//
//  GithubUpdate.swift
//  GithubPulse
//
//  Created by Tadeu Zagallo on 1/19/15.
//  Copyright (c) 2015 Tadeu Zagallo. All rights reserved.
//

import Foundation

class GithubUpdate {
  var bundleVersion:String?
  var repoName:String?
  var githubVersion:String?
  var install:Bool = false
  
  class func check() {
    GithubUpdate().check()
  }
  
  class func check(install:Bool) {
    let instance = GithubUpdate()
    instance.install = install
    instance.check()
  }
  
  func check() {
    self.getBundleInfo()
    self.getGithubVersion()
  }
  
  func getBundleInfo() {
    let bundle = NSBundle.mainBundle()
    self.bundleVersion = bundle.objectForInfoDictionaryKey("CFBundleVersion") as? String
    self.repoName = bundle.objectForInfoDictionaryKey("GithubRepo") as? String
  }
  
  func getGithubVersion() {
    if self.repoName == nil {
      return
    }
    
    let url = NSURL(string: "https://api.github.com/repos/\(self.repoName!)/tags")
    let request = NSURLRequest(URL: url!)
    
    NSURLConnection.sendAsynchronousRequest(request, queue: NSOperationQueue.mainQueue()) { (response, data, error) in
      if data == nil || error != nil {
        return
      }
      
      if let tags = (try? NSJSONSerialization.JSONObjectWithData(data!, options: [])) as? NSArray {
        
        if tags.count > 0 {
          let lastTag = tags[0]["name"] as! String
          
          print("Latest version is \(lastTag)")
          
          if EDSemver(string: lastTag).isGreaterThan(EDSemver(string: self.bundleVersion!)) {
            NSUserDefaults.standardUserDefaults().setValue("{\"data\":true}", forKey: "update_available")
            self.download(lastTag)
          } else {
            NSUserDefaults.standardUserDefaults().setValue("{\"data\":false}", forKey: "update_available")
          }
        }
      }
     
    }
  }
  
  func download(tag:String) {
    let fileManager = NSFileManager.defaultManager()
    let url = NSURL(string: "https://github.com/tadeuzagallo/GithubPulse/raw/\(tag)/dist/GithubPulse.zip")
    let request = NSURLRequest(URL: url!)
    let folder = NSBundle.mainBundle().bundleURL.URLByAppendingPathComponent("Contents/Versions")

    if !fileManager.fileExistsAtPath(folder.absoluteString) {
      do {
        try fileManager.createDirectoryAtPath(folder.absoluteString, withIntermediateDirectories: false, attributes: nil)
      } catch _ {}
    }
    
    let path = folder.URLByAppendingPathComponent("\(tag).zip").absoluteString
    
    if !fileManager.fileExistsAtPath(path) {
      print("Downloading \(tag)...")
      NSURLConnection.sendAsynchronousRequest(request, queue: NSOperationQueue.mainQueue()) { (_, data, _) in
        print("Download complete!")
        data?.writeToFile(path, atomically: true)
        if self.install {
          self.extract(folder, tag: tag, path: path)
        }
      }
    } else {
      print("Version \(tag) is already on the cache!")
      if self.install {
        self.extract(folder, tag: tag, path: path)
      }
    }
  }
  
  func extract(folder:NSURL, tag:String, path:String) {
    let fileManager = NSFileManager.defaultManager()
    let versionFolder = folder.URLByAppendingPathComponent(tag).absoluteString
    
    if !fileManager.fileExistsAtPath(versionFolder) {
      do {
        try fileManager.createDirectoryAtPath(versionFolder, withIntermediateDirectories: false, attributes: nil)
      } catch _ {
      }
      print("Unziping \(tag) to \(versionFolder)")
      SSZipArchive.unzipFileAtPath(path, toDestination: versionFolder)
    }
    
    self.copy(tag)
  }
  
  func copy(tag:String) {
    let relaunchPath = NSBundle.mainBundle().executablePath
    let currentPath = NSBundle.mainBundle().bundleURL
    print("Replacing old version by \(tag)")
    system("rm -rf /tmp/GithubPulse.app && mv \(currentPath.absoluteString) /tmp && mv /tmp/GithubPulse.app/Contents/Versions/\(tag)/GithubPulse.app \(currentPath.URLByDeletingLastPathComponent?.absoluteString)")
    self.relaunch(relaunchPath!)
  }
  
  func relaunch(path:String) {
    NSUserDefaults.standardUserDefaults().setValue("{\"data\":false}", forKey: "update_available")
    
    print("Relaunching at \(path)...")
    NSTask.launchedTaskWithLaunchPath(path, arguments: [String(format: "%d", getpid())])
    exit(0)
  }
}