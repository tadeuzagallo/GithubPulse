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
  
  var year = [Int]()
  var commits = [Int]()
  var today = 0
  var streak = 0
  var regex = NSRegularExpression(pattern: "^osx:([a-z]+)\\((.*)\\)$", options: NSRegularExpressionOptions.CaseInsensitive, error: nil)
  var calls: [String: [String] -> Void]
  
  func loadCalls() {
    self.calls = [:]
    self.calls["contributions"] = { (args) in
      println("contributions", args)
      self.contributions(args[0]) {
        let _ = self.webView?.stringByEvaluatingJavaScriptFromString("contributions(\(self.today),\(self.streak),\(self.commits))")
      }
    }
    
    self.calls["set"] = { (args) in
      println("set", args)
      NSUserDefaults.standardUserDefaults().setValue(args[1], forKey: args[0])
    }
    
    self.calls["get"] = { (args) in
      println("get", args)
      var value = NSUserDefaults.standardUserDefaults().valueForKey(args[0]) as String?
      
      if value == nil {
        value = ""
      }
      
      self.webView?.stringByEvaluatingJavaScriptFromString("get('\(args[0])', '\(value!)', \(args[1]))");
    }
    
    self.calls["remove"] = { (args) in
      println("remove", args)
      NSUserDefaults.standardUserDefaults().removeObjectForKey(args[0])
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
//    var url = NSURL(fileURLWithPath: indexPath!)
    var url = NSURL(string: "http://localhost:8080")
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
      
      let closure = self.calls[fn]
      closure?(args)
    } else if (url.hasPrefix("log:")) {
      println(url)
    } else {
      listener.use()
    }
  }
  
  func contributions(username: String, completionBlock: (() -> Void)?) {
    self.year = [];
    
    let url = NSURL(string: "https://github.com/users/\(username)/contributions")
    let request = NSURLRequest(URL: url!)
    
    NSURLConnection.sendAsynchronousRequest(request, queue: NSOperationQueue.mainQueue()) {(response, data, error) in
      let parser = NSXMLParser(data: data)
      parser.delegate = self
      parser.parse()
      
      self.calculate()
      
      if completionBlock != nil {
        completionBlock?()
      }
    }
  }
  
  func calculate() {
    var length = self.year.count - 1
    self.today = self.year[length]
    self.streak = self.today > 0 ? 1 : 0
    self.commits = Array(self.year[length-29 ... length])
    
    for var i = length - 1; i >= 0 && self.year[i] > 0; i-- {
      self.streak++;
    }
  }
  
  func parser(parser: NSXMLParser!, didStartElement elementName: String!, namespaceURI: String!, qualifiedName qName: String!, attributes attributeDict: [NSObject : AnyObject]!) {
    if elementName == "rect" {
      self.year.append((attributeDict["data-count"] as String).toInt()!)
    }
  }
}