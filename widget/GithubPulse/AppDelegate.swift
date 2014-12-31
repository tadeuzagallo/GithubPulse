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
  var timer:NSTimer!
  
  override init() {
    self.popover = NSPopover()
    self.popover.animates = false
    self.popover.contentViewController = ContentViewController(nibName: "ContentViewController", bundle: nil)
    
    super.init()
  }
  
  func applicationDidFinishLaunching(aNotification: NSNotification) {
    var button = CustomButton(frame: NSRect(x: 0, y: 0, width: 32, height: 24))
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
    
    var now = NSDate()
    let calendar = NSCalendar.currentCalendar()
    let components = calendar.components(NSCalendarUnit.CalendarUnitDay|NSCalendarUnit.CalendarUnitHour, fromDate: now)
    
    if components.hour > 17 {
      now = NSDate(timeIntervalSinceNow: 24*60*60)
    }
    
    now = calendar.dateBySettingHour(17, minute: 0, second: 0, ofDate: now, options: nil)!
    
    self.timer = NSTimer(fireDate: now, interval: 24*60*60, target: self, selector: "checkForCommits", userInfo: nil, repeats: true)
    NSRunLoop.currentRunLoop().addTimer(self.timer, forMode: NSDefaultRunLoopMode)
  }
  
  deinit {
    self.timer.invalidate()
    self.timer = nil
  }
  
  func checkForCommits() {
    let notification = NSUserNotification()
    notification.title = "You haven't commited today yet...";
    notification.subtitle = "Rush to keep your streak going!"
    
    let notificationCenter = NSUserNotificationCenter.defaultUserNotificationCenter()
    notificationCenter.scheduleNotification(notification)
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