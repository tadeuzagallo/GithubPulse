//
//  AppDelegate.swift
//  GithubPulse
//
//  Created by Tadeu Zagallo on 12/27/14.
//  Copyright (c) 2014 Tadeu Zagallo. All rights reserved.
//

import Cocoa

class Button : NSButton {
  var rightAction:((NSEvent) -> Void)?
  
  override init(frame frameRect: NSRect) {
    super.init(frame: frameRect)
  }

  required init?(coder: NSCoder) {
      fatalError("init(coder:) has not been implemented")
  }
  
  override func rightMouseDown(theEvent: NSEvent) {
    if self.rightAction != nil {
      self.rightAction?(theEvent)
    }
  }
}

@NSApplicationMain

class AppDelegate: NSObject, NSApplicationDelegate {
  var open:Bool = false
  var popover:NSPopover
  var statusItem:NSStatusItem!
  
  override init() {
    self.popover = NSPopover()
    self.popover.animates = false
    self.popover.contentViewController = ContentViewController(nibName: "ContentViewController", bundle: nil)
    
    super.init()
  }
  
  func applicationDidFinishLaunching(aNotification: NSNotification) {
    var button = Button(frame: NSRect(x: 0, y: 0, width: 32, height: 24))
    button.bordered = false
    button.image = NSImage(named: "icon")
    button.target = self
    button.action = "toggle:"
    button.rightAction = { (_) in
      let controller = self.popover.contentViewController as ContentViewController
      controller.webView?.reload(nil)
    }
    
    self.statusItem = NSStatusBar.systemStatusBar().statusItemWithLength(32)
    self.statusItem.title = "Github Pulse"
    self.statusItem.highlightMode = true
    self.statusItem.view = button
  }

  func applicationWillResignActive(notification: NSNotification) {
    self.open = false
    self.popover.close()
  }
  
  func toggle(_: AnyObject) {
    if (self.open) {
      self.popover.close()
    } else {
      let controller = self.popover.contentViewController as ContentViewController
      controller.webView?.stringByEvaluatingJavaScriptFromString("update(false)")
      
      self.popover.showRelativeToRect(self.statusItem.view!.bounds, ofView: self.statusItem.view!, preferredEdge: NSMaxYEdge)
      NSApp.activateIgnoringOtherApps(true)
    }
    
    self.open = !self.open
  }
}