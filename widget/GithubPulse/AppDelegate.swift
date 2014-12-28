//
//  AppDelegate.swift
//  GithubPulse
//
//  Created by Tadeu Zagallo on 12/27/14.
//  Copyright (c) 2014 Tadeu Zagallo. All rights reserved.
//

import Cocoa

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
    var button = NSButton(frame: NSRect(x: 0, y: 0, width: 24, height: 24))
    button.bordered = false
    button.image = NSImage(named: "octocat")
    button.target = self
    button.action = "toggle:"
    
    self.statusItem = NSStatusBar.systemStatusBar().statusItemWithLength(24)
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
      self.popover.showRelativeToRect(self.statusItem.view!.bounds, ofView: self.statusItem.view!, preferredEdge: NSMaxYEdge)
      NSApp.activateIgnoringOtherApps(true)
    }
    
    self.open = !self.open
  }
}