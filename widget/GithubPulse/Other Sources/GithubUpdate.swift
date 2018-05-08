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
  
  class func check(_ install:Bool) {
    let instance = GithubUpdate()
    instance.install = install
    instance.check()
  }
  
  func check() {
    self.getBundleInfo()
    self.getGithubVersion()
  }
  
  func getBundleInfo() {
    let bundle = Bundle.main
    self.bundleVersion = bundle.object(forInfoDictionaryKey: "CFBundleVersion") as? String
    self.repoName = bundle.object(forInfoDictionaryKey: "GithubRepo") as? String
  }
  
  func getGithubVersion() {
    if self.repoName == nil {
      return
    }
    
    let url = URL(string: "https://api.github.com/repos/\(self.repoName!)/tags")
    let request = URLRequest(url: url!)
    
    NSURLConnection.sendAsynchronousRequest(request, queue: OperationQueue.main) { (response, data, error) in
      guard error == nil, let data = data else {
        return
      }
      
      if let tags = (try? JSONSerialization.jsonObject(with: data, options: [])) as? [[String: AnyObject]] {
        
        if !tags.isEmpty {
          let mostRecentTag = tags.first!
          let lastTag = mostRecentTag["name"] as! String
          
          print("Latest version is \(lastTag)")
          
          if EDSemver(string: lastTag).isGreaterThan(EDSemver(string: self.bundleVersion!)) {
            UserDefaults.standard.setValue("{\"data\":true}", forKey: "update_available")
            self.download(lastTag)
          } else {
            UserDefaults.standard.setValue("{\"data\":false}", forKey: "update_available")
          }
        }
      }
     
    }
  }
  
  func download(_ tag:String) {
    let fileManager = FileManager.default
    let url = URL(string: "https://github.com/tadeuzagallo/GithubPulse/raw/\(tag)/dist/GithubPulse.zip")
    let request = URLRequest(url: url!)
    let folder = Bundle.main.bundleURL.appendingPathComponent("Contents/Versions")

    if !fileManager.fileExists(atPath: folder.path) {
      do {
        try fileManager.createDirectory(atPath: folder.path, withIntermediateDirectories: true, attributes: nil)
      } catch _ {}
    }
    
    let path = folder.appendingPathComponent("\(tag).zip").path
    
    if !fileManager.fileExists(atPath: path) {
      print("Downloading \(tag)...")
      NSURLConnection.sendAsynchronousRequest(request, queue: OperationQueue.main) { (_, data, _) in
        print("Download complete!")
        try? data?.write(to: URL(fileURLWithPath: path), options: [.atomic])
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
  
  func extract(_ folder:URL, tag:String, path:String) {
    let fileManager = FileManager.default
    let versionFolder = folder.appendingPathComponent(tag).path
    
    if !fileManager.fileExists(atPath: versionFolder) {
      do {
        try fileManager.createDirectory(atPath: versionFolder, withIntermediateDirectories: false, attributes: nil)
      } catch _ {
      }
      print("Unziping \(tag) to \(versionFolder)")
      SSZipArchive.unzipFile(atPath: path, toDestination: versionFolder)
    }
    
    self.copy(tag)
  }
  
  func copy(_ tag:String) {
    let relaunchPath = Bundle.main.executablePath
    let currentPath = Bundle.main.bundleURL
    print("Replacing old version by \(tag)")
    let command = "rm -rf /tmp/GithubPulse.app && mv \(currentPath.path) /tmp && mv /tmp/GithubPulse.app/Contents/Versions/\(tag)/GithubPulse.app \(currentPath.deletingLastPathComponent().path)"
    let (output, error, status) = runCommand(path: "/bin/bash", args: command.components(separatedBy: " "))
    debugPrint(output)
    debugPrint(error)
    debugPrint("exit code: \(status)")

    self.relaunch(relaunchPath!)
  }
  
  func relaunch(_ path:String) {
    UserDefaults.standard.setValue("{\"data\":false}", forKey: "update_available")
    UserDefaults.standard.synchronize()
    
    print("Relaunching at \(path)...")
    Process.launchedProcess(launchPath: path, arguments: [String(format: "%d", getpid())])
    exit(0)
  }
}

func runCommand(path: String, args: [String]) -> (output: [String], error: [String], exitCode: Int32) {
    let process = Process()
    process.launchPath = path
    process.arguments = args

    let outpipe = Pipe()
    process.standardOutput = outpipe
    let errpipe = Pipe()
    process.standardError = errpipe

    process.launch()

    let outdata = outpipe.fileHandleForReading.readDataToEndOfFile()
    var outstring = String(cString: [UInt8](outdata))
    outstring = outstring.trimmingCharacters(in: .newlines)
    let output = outstring.components(separatedBy: "\n")

    let errdata = errpipe.fileHandleForReading.readDataToEndOfFile()
    var errstring = String(cString: [UInt8](errdata))
    errstring = errstring.trimmingCharacters(in: .newlines)
    let error = errstring.components(separatedBy: "\n")

    //process.waitUntilExit()
    let status = process.terminationStatus

    return (output, error, status)
}
