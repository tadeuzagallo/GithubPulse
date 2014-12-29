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
  var year = [Int]()
  var commits = [Int]()
  var today = 0
  var streak = 0
  
  override func viewDidLoad() {
    var indexPath = NSBundle.mainBundle().pathForResource("index", ofType: "html", inDirectory: "front")
//    var url = NSURL(fileURLWithPath: indexPath!)
    var url = NSURL(string: "http://localhost:8080")
    var request = NSURLRequest(URL: url!)
    
    self.webView!.policyDelegate = self;
    self.webView!.drawsBackground = false
    self.webView!.mainFrame.loadRequest(request)
    
    self.contributions("tadeuzagallo", nil)
    
    super.viewDidLoad()
  }
  
  override func webView(webView: WebView!, decidePolicyForNavigationAction actionInformation: [NSObject : AnyObject]!, request: NSURLRequest!, frame: WebFrame!, decisionListener listener: WebPolicyDecisionListener!) {
    var url:String = request.URL.absoluteString!
    
    if url.hasPrefix("osx:") {
      var username = url.componentsSeparatedByString("/").last
      self.contributions(username!) {() in
        let ret = self.webView?.stringByEvaluatingJavaScriptFromString("contributions(\(self.today),\(self.streak),\(self.commits))")
      }
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