//
//  ContentViewController.swift
//  GithubPulse
//
//  Created by Tadeu Zagallo on 12/28/14.
//  Copyright (c) 2014 Tadeu Zagallo. All rights reserved.
//

import Cocoa
import WebKit

class ContentViewController: NSViewController, XMLParserDelegate, WebPolicyDelegate {
  @IBOutlet weak var webView:WebView?
  @IBOutlet weak var lastUpdate:NSTextField?
  
  var regex = try? NSRegularExpression(pattern: "^osx:(\\w+)\\((.*)\\)$", options: NSRegularExpression.Options.caseInsensitive)
  var calls: [String: ([String]) -> Void]
  
  func loadCalls() {
    self.calls = [:]
    self.calls["contributions"] = { (args) in
      Contributions.fetch(args[0]) { (success, commits, streak, today) in
        if success {
          if args.count < 2 || args[1] == "true" {
            NotificationCenter.default.post(name: Notification.Name(rawValue: "check_icon"), object: nil, userInfo: ["today": today])
          }
        }
        let _ = self.webView?.stringByEvaluatingJavaScript(from: "contributions(\"\(args[0])\", \(success), \(today),\(streak),\(commits))")
      }
    }
    
    self.calls["set"] = { (args) in
      let userDefaults = UserDefaults.standard
      userDefaults.setValue(args[1], forKey: args[0])
      userDefaults.synchronize()
      
      if args[0] == "username" {
        NotificationCenter.default.post(name: Notification.Name(rawValue: "check_username"), object: self, userInfo: nil)
      }
      
    }
    
    self.calls["get"] = { [weak self] (args) in
      var value = UserDefaults.standard.value(forKey: args[0]) as? String
      
      if value == nil {
        value = ""
      }
      
      let key = args[0].replacingOccurrences(of: "'", with: "\\'", options: [], range: nil)
      let v = value!.replacingOccurrences(of: "'", with: "\\'", options: [], range: nil)
      
      _ = self?.webView?.stringByEvaluatingJavaScript(from: "get('\(key)', '\(v)', \(args[1]))");
    }
    
    self.calls["remove"] = { (args) in
      let userDefaults = UserDefaults.standard
      userDefaults.removeObject(forKey: args[0])
      userDefaults.synchronize()
      
      if args[0] == "username" {
        NotificationCenter.default.post(name: Notification.Name(rawValue: "check_username"), object: self, userInfo: nil)
      }
    }
    
    self.calls["check_login"] = { [weak self] (args) in
      let active = Bundle.main.isLoginItem()
      _ = self?.webView?.stringByEvaluatingJavaScript(from: "raw('check_login', \(active))")
    }
    
    self.calls["toggle_login"] = { (args) in
      if Bundle.main.isLoginItem() {
        Bundle.main.removeFromLoginItems()
      } else {
        Bundle.main.addToLoginItems()
      }
    }
    
    self.calls["quit"] = { (args) in
      NSApplication.shared().terminate(self)
    }
    
    self.calls["update"] = { (args) in
      GithubUpdate.check(true)
    }

    self.calls["open_url"] = { (args) in
      if let checkURL = URL(string: args[0]) {
        NSWorkspace.shared().open(checkURL)
      }
    }
  }

  required init?(coder: NSCoder) {
    self.calls = [:]
    super.init(coder: coder)
    self.loadCalls()
  }
  
  override init?(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
    self.calls = [:]
    super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
    self.loadCalls()
  }
  
  override func viewDidLoad() {
#if DEBUG
    let url = URL(string: "http://0.0.0.0:8080")!
#else
    let indexPath = Bundle.main.path(forResource: "index", ofType: "html", inDirectory: "front")
    let url = URL(fileURLWithPath: indexPath!)
#endif
    let request = URLRequest(url: url)
    
    self.webView?.policyDelegate = self
    self.webView?.drawsBackground = false
    self.webView?.wantsLayer = true
    self.webView?.layer?.cornerRadius = 5
    self.webView?.layer?.masksToBounds = true
    
    self.webView?.mainFrame.load(request)
    
    super.viewDidLoad()
  }
  
  @IBAction func refresh(_ sender: AnyObject?) {
    self.webView?.reload(sender)
  }
  
  func webView(_ webView: WebView!, decidePolicyForNavigationAction actionInformation: [AnyHashable: Any]!, request: URLRequest!, frame: WebFrame!, decisionListener listener: WebPolicyDecisionListener!) {
    let url:String = request.url!.absoluteString.removingPercentEncoding!

    if url.hasPrefix("osx:") {
      let matches = self.regex?.matches(in: url, options: [], range: NSMakeRange(0, url.characters.count))
      if let match = matches?[0] {
        let fn = (url as NSString).substring(with: match.rangeAt(1))
        let args = (url as NSString).substring(with: match.rangeAt(2)).components(separatedBy: "%%")
        
        #if DEBUG
          print(fn, args)
        #endif
        
        let closure = self.calls[fn]
        closure?(args)
      }
    } else if (url.hasPrefix("log:")) {
#if DEBUG
      print(url)
#endif
    } else {
      listener.use()
    }
  }
}
