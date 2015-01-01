//
//  AppDelegate.swift
//  GithubPulse
//
//  Created by Tadeu Zagallo on 12/27/14.
//  Copyright (c) 2014 Tadeu Zagallo. All rights reserved.
//

import Cocoa

private var myContext = 0

@NSApplicationMain

class AppDelegate: NSObject, NSApplicationDelegate {
  var open:Bool = false
  var contentViewController:ContentViewController
  var popover:INPopoverController
  var statusItem:NSStatusItem!
  var statusButton:CustomButton!
  var timer:NSTimer!
  
  override init() {
    self.contentViewController = ContentViewController(nibName: "ContentViewController", bundle: nil)!
    self.popover = INPopoverController(contentViewController: self.contentViewController)
    self.popover.animates = false;
    self.popover.color = NSColor(calibratedWhite: 0.9, alpha: 1)
    self.popover.borderWidth = 0
    
    super.init()
    
    self.contentViewController.addObserver(self, forKeyPath: "username", options: nil, context: &myContext)
  }
  
  func applicationDidFinishLaunching(aNotification: NSNotification) {
    self.statusButton = CustomButton(frame: NSRect(x: 0, y: 0, width: 32, height: 24))
    self.statusButton.bordered = false
    self.statusButton.image = NSImage(named: "icon")
    self.statusButton.target = self
    self.statusButton.action = "toggle:"
    self.statusButton.rightAction = { (_) in
      self.contentViewController.refresh(nil)
    }
    
    self.statusItem = NSStatusBar.systemStatusBar().statusItemWithLength(32)
    self.statusItem.title = "Github Pulse"
    self.statusItem.highlightMode = true
    self.statusItem.view = self.statusButton
    
    self.timer = NSTimer(fireDate: NSDate(), interval: 15*60, target: self, selector: "checkForCommits", userInfo: nil, repeats: true)
    NSRunLoop.currentRunLoop().addTimer(self.timer, forMode: NSDefaultRunLoopMode)
  }
  
  deinit {
    self.contentViewController.removeObserver(self, forKeyPath: "username")
    self.timer.invalidate()
    self.timer = nil
  }
  
  func checkForCommits() {
    if let username = NSUserDefaults.standardUserDefaults().valueForKey("username") as String? {
      self.fetchCommits(username)
    }
  }
  
  func fetchCommits(usernameString: String) {
    let usernameData = usernameString.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: false)!
    let usernameObject = NSJSONSerialization.JSONObjectWithData(usernameData, options: NSJSONReadingOptions.AllowFragments, error: nil) as NSDictionary
    let username = usernameObject["data"] as String
    
    Contributions.fetch(username) { (success, _, _, today) in
      if success {
        self.updateIcon(today)
        
        if today == 0 {
          self.checkForNotification()
        }
      }
    }
  }
  
  func updateIcon(count: Int) {
    let imageName = count == 0 ?  "icon_notification" : "icon"
    self.statusButton.image = NSImage(named: imageName)
  }
  
  func checkForNotification() {
    let userDefaults = NSUserDefaults.standardUserDefaults()
    let now = NSDate()
    let components = NSCalendar.currentCalendar().components(NSCalendarUnit.CalendarUnitHour, fromDate: now)
          
    if components.hour >= 17 {
      
      if let lastNotification = userDefaults.valueForKey("last_notification") as NSDate? {
      
        if now.timeIntervalSinceDate(lastNotification) >= 23 * 60 * 60 {
          let notification = NSUserNotification()
          notification.title = "You haven't commited today yet...";
          notification.subtitle = "Rush to keep your streak going!"
          
          let notificationCenter = NSUserNotificationCenter.defaultUserNotificationCenter()
          notificationCenter.scheduleNotification(notification)
          
          userDefaults.setValue(now, forKey: "last_notification")
        }
      }
    }
  }

  func applicationWillResignActive(notification: NSNotification) {
    self.open = false
    self.popover.closePopover(nil)
  }
  
  func toggle(_: AnyObject) {
    if (self.open) {
      self.popover.closePopover(nil)
    } else {
      let controller = self.popover.contentViewController as ContentViewController
      controller.webView?.stringByEvaluatingJavaScriptFromString("update(false)")
      
      self.popover.presentPopoverFromRect(self.statusItem.view!.bounds, inView: self.statusItem.view!, preferredArrowDirection: INPopoverArrowDirection.Up, anchorsToPositionView: true)
      NSApp.activateIgnoringOtherApps(true)
    }
    
    self.open = !self.open
  }
  
  override func observeValueForKeyPath(keyPath: String, ofObject object: AnyObject, change: [NSObject : AnyObject], context: UnsafeMutablePointer<Void>) {
    if context == &myContext {
      if let username = self.contentViewController.username {
        self.fetchCommits(username)
      } else {
        self.updateIcon(1)
      }
    } else {
      super.observeValueForKeyPath(keyPath, ofObject: object, change: change, context: context)
    }
  }
}