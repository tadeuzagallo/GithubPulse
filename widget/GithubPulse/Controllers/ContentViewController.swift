//
//  ContentViewController.swift
//  GithubPulse
//
//  Created by Tadeu Zagallo on 12/28/14.
//  Copyright (c) 2014 Tadeu Zagallo. All rights reserved.
//

import Cocoa
import WebKit

class ContentViewController: NSViewController, NSXMLParserDelegate {
  @IBOutlet weak var webView:WebView?
  @IBOutlet weak var lastUpdate:NSTextField?
  dynamic var username:String?
  
  var regex = NSRegularExpression(pattern: "^osx:(\\w+)\\((.*)\\)$", options: NSRegularExpressionOptions.CaseInsensitive, error: nil)
  var calls: [String: [String] -> Void]
  
  func loadCalls() {
    self.calls = [:]
    self.calls["contributions"] = { (args) in
      Contributions.fetch(args[0]) { (success, commits, streak, today) in
        if success {
          NSNotificationCenter.defaultCenter().postNotificationName("check_icon", object: nil, userInfo: ["today": today])
        }
        let _ = self.webView?.stringByEvaluatingJavaScriptFromString("contributions(\(success), \(today),\(streak),\(commits))")
      }
    }
    
    self.calls["set"] = { (args) in
      
      NSUserDefaults.standardUserDefaults().setValue(args[1], forKey: args[0])
      
      if args[0] == "username" {
        self.username = args[1]
      }
      
    }
    
    self.calls["get"] = { (args) in
      var value = NSUserDefaults.standardUserDefaults().valueForKey(args[0]) as String?
      
      if value == nil {
        value = ""
      }
      
      let key = args[0].stringByReplacingOccurrencesOfString("'", withString: "\\'", options: nil, range: nil)
      let v = value!.stringByReplacingOccurrencesOfString("'", withString: "\\'", options: nil, range: nil)
      
      self.webView?.stringByEvaluatingJavaScriptFromString("get('\(key)', '\(v)', \(args[1]))");
    }
    
    self.calls["remove"] = { (args) in
      
      if args[0] == "username" {
        self.username = nil
      }
      
      NSUserDefaults.standardUserDefaults().removeObjectForKey(args[0])
    }
    
    self.calls["check_login"] = { (args) in
      let active = NSBundle.mainBundle().isLoginItem()
      self.webView?.stringByEvaluatingJavaScriptFromString("raw('check_login', \(active))")
    }
    
    self.calls["toggle_login"] = { (args) in
      if NSBundle.mainBundle().isLoginItem() {
        NSBundle.mainBundle().removeFromLoginItems()
      } else {
        NSBundle.mainBundle().addToLoginItems()
      }
    }
    
    self.calls["quit"] = { (args) in
      NSApplication.sharedApplication().terminate(self)
    }
  }
  
  override init() {
    self.calls = [:]
    super.init()
    self.loadCalls()
  }

  required init?(coder: NSCoder) {
    self.calls = [:]
    super.init(coder: coder)
    self.loadCalls()
  }
  
  override init?(nibName nibNameOrNil: String?, bundle nibBundleOrNil: NSBundle?) {
    self.calls = [:]
    super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
    self.loadCalls()
  }
  
  override func viewDidLoad() {
    var indexPath = NSBundle.mainBundle().pathForResource("index", ofType: "html", inDirectory: "front")
#if DEBUG
    var url = NSURL(string: "http://localhost:8080")
#else
    var url = NSURL(fileURLWithPath: indexPath!)
#endif
    var request = NSURLRequest(URL: url!)
    
    self.webView!.policyDelegate = self;
    self.webView!.drawsBackground = false
    self.webView!.mainFrame.loadRequest(request)
    
    super.viewDidLoad()
  }
  
  @IBAction func refresh(sender: AnyObject?) {
    self.webView?.reload(sender)
  }
  
  override func webView(webView: WebView!, decidePolicyForNavigationAction actionInformation: [NSObject : AnyObject]!, request: NSURLRequest!, frame: WebFrame!, decisionListener listener: WebPolicyDecisionListener!) {
    var url:String = request.URL.absoluteString!.stringByReplacingPercentEscapesUsingEncoding(NSUTF8StringEncoding)!
    
    if url.hasPrefix("osx:") {
      let matches = self.regex?.matchesInString(url, options: nil, range: NSMakeRange(0, countElements(url)))
      let match = matches?[0] as NSTextCheckingResult
      
      let fn = (url as NSString).substringWithRange(match.rangeAtIndex(1))
      let args = (url as NSString).substringWithRange(match.rangeAtIndex(2)).componentsSeparatedByString("%%")
      
      #if DEBUG
        println(fn, args)
      #endif
      
      let closure = self.calls[fn]
      closure?(args)
    } else if (url.hasPrefix("log:")) {
#if DEBUG
      println(url)
#endif
    } else {
      listener.use()
    }
  }
}