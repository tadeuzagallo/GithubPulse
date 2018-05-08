//
//  Contributions.swift
//  GithubPulse
//
//  Created by Tadeu Zagallo on 12/30/14.
//  Copyright (c) 2014 Tadeu Zagallo. All rights reserved.
//

import Foundation

typealias FetchCallback = ((Bool, [Int], Int, Int) -> Void)!

class Contributions {
  var username = ""
  var year = [Int]()
  var commits = [Int]()
  var today = 0
  var streak = 0
  var succeeded = false
  var state = 0
  var callback: FetchCallback = nil
  let streakRegex = try? NSRegularExpression(pattern: "Current streak</span>\\s*<span[^>]*?>(\\d+)\\s*days", options: NSRegularExpression.Options.caseInsensitive)
  let dayRegex = try? NSRegularExpression(pattern: "<rect.*?data-count=\"(\\d+)\"", options: [])
  
  class func fetch(_ username: String, completionBlock: FetchCallback) {
    Contributions().fetch(username, completionBlock: completionBlock)
  }

  fileprivate func baseFetch(_ URLString: String, completionBlock: @escaping (String) -> Void) {
    let url = URL(string: URLString)
    let request = NSMutableURLRequest(url: url!, cachePolicy: NSURLRequest.CachePolicy.reloadIgnoringLocalAndRemoteCacheData, timeoutInterval: 30)
    request.httpShouldHandleCookies = false
    
    NSURLConnection.sendAsynchronousRequest(request as URLRequest, queue: OperationQueue.main) { (response, data, error) in
      if error != nil || data == nil {
        self.invokeCallback(false)
        return
      }

      completionBlock(String(data: data!, encoding: String.Encoding.utf8)!)
    }
  }

  func fetch(_ username: String, completionBlock: FetchCallback) {
    self.username = username
    self.year = []
    self.callback = completionBlock

    baseFetch("https://github.com/\(username)") { (body) in
      self.parse(body)
    }
  }

  func fetchContributions() {
    baseFetch("https://github.com/users/\(username)/contributions") { (body) in
      let range = self.getRange(body)

      if range.location == NSNotFound {
        self.invokeCallback(false)
        return
      }

      self.parseStreak(body, range: range)
      self.invokeCallback(true)
    }
  }

  fileprivate func invokeCallback(_ success: Bool) {
    if callback != nil {
      callback(success, commits, streak, today)
    }

    self.callback = nil
  }

  fileprivate func getRange(_ input: String) -> NSRange {
    let start = (input as NSString).range(of: "<svg")
    return NSMakeRange(start.location, (input as NSString).length - start.location)
  }

  func parse(_ string: String) {
    let range = getRange(string)

    if range.location == NSNotFound {
      parseCommits(string, range: NSMakeRange(0, (string as NSString).length))
      fetchContributions()
      return
    }

    parseCommits(string, range: range)
    parseStreak(string, range: range)
    invokeCallback(true)
  }

  func parseStreak(_ string: String, range: NSRange) {
    let streakMatch = streakRegex?.firstMatch(in: string, options: [], range: range)
    if streakMatch != nil {
      if let streak = Int((string as NSString).substring(with: streakMatch!.rangeAt(1))) {
        self.streak = streak
      }
    }
  }

  func parseCommits(_ string: String, range: NSRange) {
    let dayMatches = dayRegex?.matches(in: string, options: [], range: range)
    if dayMatches != nil {
      var a = 30
      for dayMatch in dayMatches!.reversed() {
        if let day = Int((string as NSString).substring(with: dayMatch.rangeAt(1))) {
          commits.insert(day, at: 0)
        }

        a -= 1
        if a == 0 {
          break
        }
      }
    }

    if let today = commits.last {
      self.today = today
    }
  }
}
