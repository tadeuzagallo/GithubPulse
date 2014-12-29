//
//  ContentViewController.swift
//  GithubPulse
//
//  Created by Tadeu Zagallo on 12/28/14.
//  Copyright (c) 2014 Tadeu Zagallo. All rights reserved.
//

import Cocoa
import WebKit

class ContentViewController: NSViewController {
  @IBOutlet weak var webView:WebView?
  
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
  
  override func webView(webView: WebView!, decidePolicyForNavigationAction actionInformation: [NSObject : AnyObject]!, request: NSURLRequest!, frame: WebFrame!, decisionListener listener: WebPolicyDecisionListener!) {
    var url:String = request.URL.absoluteString!
    
    if url.hasPrefix("osx:") {
      var username = url.componentsSeparatedByString("/").last
      self.contributions(username!)
    } else if (url.hasPrefix("log:")) {
      println(url)
    } else {
      listener.use()
    }
  }
  
  func contributions(username: String) {
    var url = NSURL(string: "https://github.com/users/\(username)/contributions")
    var request = NSURLRequest(URL: url!)
    NSURLConnection.sendAsynchronousRequest(request, queue: NSOperationQueue.mainQueue()) {(response, data, error) in
      var body = NSString(data: data, encoding: NSUTF8StringEncoding)!
        .stringByReplacingOccurrencesOfString("\n", withString: "")
        .stringByReplacingOccurrencesOfString("\\", withString: "\\\\")
        .stringByReplacingOccurrencesOfString("\"", withString: "\\\"")
      var result = self.webView?.stringByEvaluatingJavaScriptFromString("contributions(\"\(body)\")")
    }
  }
}