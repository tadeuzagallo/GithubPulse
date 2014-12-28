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
  override func viewDidLoad() {
    var indexPath = NSBundle.mainBundle().pathForResource("index", ofType: "html", inDirectory: "front")
    var url = NSURL(fileURLWithPath: indexPath!)
    var request = NSURLRequest(URL: url!)
    
    var webView:WebView = self.view as WebView
    webView.drawsBackground = false
    webView.mainFrame.loadRequest(request)
    
    super.viewDidLoad()
  }
}