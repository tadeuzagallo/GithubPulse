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
    self.popover.color = NSColor.whiteColor()
    self.popover.borderWidth = 1
    self.popover.cornerRadius = 5;
    self.popover.borderColor = NSColor(calibratedWhite: 0.76, alpha: 1)
    
    super.init()
    
    NSNotificationCenter.defaultCenter().addObserver(self, selector: "_checkUsernameNotification:", name: "check_username", object: nil)
    NSNotificationCenter.defaultCenter().addObserver(self, selector: "_checkIconNotification:", name: "check_icon", object: nil)
    NSDistributedNotificationCenter.defaultCenter().addObserver(self, selector: "_darkModeChanged:", name: "AppleInterfaceThemeChangedNotification", object: nil)

  }
  
  func applicationDidFinishLaunching(aNotification: NSNotification) {
    self.statusButton = CustomButton(frame: NSRect(x: 0, y: 0, width: 32, height: 24))
    self.statusButton.bordered = false
    self.statusButton.target = self
    self.statusButton.action = "toggle:"
    self.updateIcon(1)
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
    NSNotificationCenter.defaultCenter().removeObserver(self)
    NSDistributedNotificationCenter.defaultCenter().removeObserver(self)
    self.timer.invalidate()
    self.timer = nil
  }
  
  func checkForCommits() {
    if let username = parseData("username") as String? {
      self.fetchCommits(username)
    }
  }
  
  func parseData(key: String) -> AnyObject? {
    if let input = NSUserDefaults.standardUserDefaults().valueForKey(key) as String? {
      if let data = input.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: false) {
        if let object = NSJSONSerialization.JSONObjectWithData(data, options: NSJSONReadingOptions.AllowFragments, error: nil) as NSDictionary? {
          return object["data"]
        }
      }
    }
    
    return nil
  }
  
  func fetchCommits(username: String) {
    let dontNotify = parseData("dont_notify") as Bool?
    
    Contributions.fetch(username) { (success, _, _, today) in
      if success {
        self.updateIcon(today)
        
        
        if today == 0 && (dontNotify == nil || !dontNotify!) {
          self.checkForNotification()
        }
      }
    }
  }
  
  var lastIconCount = 0
  func updateIcon(_count: Int) {
    var count:Int
    
    if _count == -1 {
      count = self.lastIconCount
    } else {
      count = _count
      self.lastIconCount = count
    }
    
    var imageName = count == 0 ?  "icon_notification" : "icon"
    
    if let domain = NSUserDefaults.standardUserDefaults().persistentDomainForName(NSGlobalDomain) {
      if let style = domain["AppleInterfaceStyle"] as String? {
        if style == "Dark" {
          imageName += "_dark"
        }
      }
    }
    
    self.statusButton.image = NSImage(named: imageName)
  }
  
  func checkForNotification() {
    let userDefaults = NSUserDefaults.standardUserDefaults()
    let now = NSDate()
    let components = NSCalendar.currentCalendar().components(NSCalendarUnit.CalendarUnitHour, fromDate: now)
          

    if components.hour >= 18 {
      var lastNotification = userDefaults.valueForKey("last_notification") as NSDate?
      var todayStart = NSCalendar.currentCalendar().dateBySettingHour(1, minute: 0, second: 0, ofDate: now, options: nil)
      
      if lastNotification == nil || todayStart!.timeIntervalSinceDate(lastNotification!) > 0 {
        let notification = NSUserNotification()
        notification.title = "You haven't commited today yet...";
        notification.subtitle = "Rush to keep your streak going!"
        
        let notificationCenter = NSUserNotificationCenter.defaultUserNotificationCenter()
        notificationCenter.scheduleNotification(notification)
        
        userDefaults.setValue(now, forKey: "last_notification")
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
  
  func _checkIconNotification(notification:NSNotification) {
    self.updateIcon(notification.userInfo?["today"] as Int!)
  }
  
  func _darkModeChanged(notification:NSNotification) {
    self.updateIcon(-1)
  }
  
  func _checkUsernameNotification(notification:NSNotification) {
    if let username = self.parseData("username") as String? {
      self.fetchCommits(username)
    } else {
      self.updateIcon(1)
    }
  }
}