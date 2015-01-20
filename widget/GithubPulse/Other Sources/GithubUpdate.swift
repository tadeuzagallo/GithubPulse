//
//  GithubUpdate.swift
//  GithubPulse
//
//  Created by Tadeu Zagallo on 1/19/15.
//  Copyright (c) 2015 Tadeu Zagallo. All rights reserved.
//

import Foundation

func version(version:String) -> String {
  if version[version.startIndex] == "v" {
    return version.substringFromIndex(advance(version.startIndex, 1))
  } else {
    return version;
  }
}

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
    self.bundleVersion = bundle.objectForInfoDictionaryKey("CFBundleVersion") as String?
    self.repoName = bundle.objectForInfoDictionaryKey("GithubRepo") as String?
  }
  
  func getGithubVersion() {
    if self.repoName == nil {
      return
    }
    
    let url = NSURL(string: "https://api.github.com/repos/\(self.repoName!)/tags")
    let request = NSURLRequest(URL: url!)
    
    NSURLConnection.sendAsynchronousRequest(request, queue: NSOperationQueue.mainQueue()) { (response, data, error) in
      if let tags = NSJSONSerialization.JSONObjectWithData(data, options: nil, error: nil) as NSArray? {
        
        if tags.count > 0 {
          let lastTag = tags[0]["name"] as String
          
          println("Latest version is \(lastTag)")
          
          if version(self.bundleVersion!) != version(lastTag) {
            NSUserDefaults.standardUserDefaults().setValue("{\"data\":true}", forKey: "update_available")
            self.download(lastTag)
          }
        }
      }
     
    }
  }
  
  func download(tag:String) {
    let fileManager = NSFileManager.defaultManager()
    let url = NSURL(string: "https://github.com/tadeuzagallo/GithubPulse/raw/\(tag)/dist/GithubPulse.zip")
    let request = NSURLRequest(URL: url!)
    let folder = NSBundle.mainBundle().bundlePath.stringByAppendingPathComponent("Contents/Versions")
    if !fileManager.fileExistsAtPath(folder) {
      fileManager.createDirectoryAtPath(folder, withIntermediateDirectories: false, attributes: nil, error: nil)
    }
    
    let path = folder.stringByAppendingPathComponent("\(tag).zip")
    
    if !fileManager.fileExistsAtPath(path) {
      println("Downloading \(tag)...")
      NSURLConnection.sendAsynchronousRequest(request, queue: NSOperationQueue.mainQueue()) { (_, data, _) in
        println("Download complete!")
        data.writeToFile(path, atomically: true)
        if self.install {
          self.extract(folder, tag: tag, path: path)
        }
      }
    } else {
      println("Version \(tag) is already on the cache!")
      if self.install {
        self.extract(folder, tag: tag, path: path)
      }
    }
  }
  
  func extract(folder:String, tag:String, path:String) {
    let fileManager = NSFileManager.defaultManager()
    let versionFolder = folder.stringByAppendingPathComponent(tag)
    
    if !fileManager.fileExistsAtPath(versionFolder) {
      fileManager.createDirectoryAtPath(versionFolder, withIntermediateDirectories: false, attributes: nil, error: nil)
      println("Unziping \(tag) to \(versionFolder)")
      SSZipArchive.unzipFileAtPath(path, toDestination: versionFolder)
    }
    
    self.copy(tag)
  }
  
  func copy(tag:String) {
    let relaunchPath = NSBundle.mainBundle().executablePath
    let currentPath = NSBundle.mainBundle().bundlePath
    println("Replacing old version by \(tag)")
    system("rm -rf /tmp/GithubPulse.app && mv \(currentPath) /tmp && mv /tmp/GithubPulse.app/Contents/Versions/\(tag)/GithubPulse.app \(currentPath.stringByDeletingLastPathComponent)")
    self.relaunch(relaunchPath!)
  }
  
  func relaunch(path:String) {
    NSUserDefaults.standardUserDefaults().setValue("{\"data\":false}", forKey: "update_available")
    
    println("Relaunching at \(path)...")
    NSTask.launchedTaskWithLaunchPath(path, arguments: [NSString(format: "%d", getpid())])
    exit(0)
  }
}