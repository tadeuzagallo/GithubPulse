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
  let streakRegex = try? NSRegularExpression(pattern: "Current streak</span>\\s*<span[^>]*?>(\\d+)\\s*days", options: NSRegularExpressionOptions.CaseInsensitive)
  let dayRegex = try? NSRegularExpression(pattern: "<rect.*?data-count=\"(\\d+)\"", options: [])
  
  class func fetch(username: String, completionBlock: FetchCallback) {
    Contributions().fetch(username, completionBlock: completionBlock)
  }

  private func baseFetch(URLString: String, completionBlock: (String) -> Void) {
    let url = NSURL(string: URLString)
    let request = NSMutableURLRequest(URL: url!, cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalAndRemoteCacheData, timeoutInterval: 30)
    request.HTTPShouldHandleCookies = false
    
    NSURLConnection.sendAsynchronousRequest(request, queue: NSOperationQueue.mainQueue()) { (response, data, error) in
      if error != nil || data == nil {
        self.invokeCallback(false)
        return
      }

      completionBlock(String(data: data!, encoding: NSUTF8StringEncoding)!)
    }
  }

  func fetch(username: String, completionBlock: FetchCallback) {
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

  private func invokeCallback(success: Bool) {
    if callback != nil {
      callback(success, commits, streak, today)
    }

    self.callback = nil
  }

  private func getRange(input: String) -> NSRange {
    let start = (input as NSString).rangeOfString("<svg")
    return NSMakeRange(start.location, (input as NSString).length - start.location)
  }

  func parse(string: String) {
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

  func parseStreak(string: String, range: NSRange) {
    let streakMatch = streakRegex?.firstMatchInString(string, options: [], range: range)
    if streakMatch != nil {
      if let streak = Int((string as NSString).substringWithRange(streakMatch!.rangeAtIndex(1))) {
        self.streak = streak
      }
    }
  }

  func parseCommits(string: String, range: NSRange) {
    let dayMatches = dayRegex?.matchesInString(string, options: [], range: range)
    if dayMatches != nil {
      var a = 30
      for dayMatch in dayMatches!.reverse() {
        if let day = Int((string as NSString).substringWithRange(dayMatch.rangeAtIndex(1))) {
          commits.insert(day, atIndex: 0)
        }

        if --a == 0 {
          break
        }
      }
    }

    if let today = commits.last {
      self.today = today
    }
  }
}