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
  var timer:Timer!
  
  override init() {
    self.contentViewController = ContentViewController(nibName: "ContentViewController", bundle: nil)!
    self.popover = INPopoverController(contentViewController: self.contentViewController)
    
    self.popover.animates = false;
    self.popover.color = NSColor.white
    self.popover.borderWidth = 1
    self.popover.cornerRadius = 5;
    self.popover.borderColor = NSColor(calibratedWhite: 0.76, alpha: 1)
    
    super.init()
    
    NotificationCenter.default.addObserver(self, selector: #selector(AppDelegate._checkUsernameNotification(_:)), name: NSNotification.Name( "check_username"), object: nil)
    NotificationCenter.default.addObserver(self, selector: #selector(AppDelegate._checkIconNotification(_:)), name: NSNotification.Name("check_icon"), object: nil)
    DistributedNotificationCenter.default().addObserver(self, selector: #selector(AppDelegate._darkModeChanged), name: NSNotification.Name("AppleInterfaceThemeChangedNotification"), object: nil)

  }
  
  func applicationDidFinishLaunching(_ aNotification: Notification) {
    self.statusButton = CustomButton(frame: NSRect(x: 0, y: 0, width: 32, height: 24))
    self.statusButton.isBordered = false
    self.statusButton.target = self
    self.statusButton.action = #selector(AppDelegate.toggle(_:))
    self.updateIcon(1)
    self.statusButton.rightAction = { (_) in
      self.contentViewController.refresh(nil)
    }
    
    self.statusItem = NSStatusBar.system().statusItem(withLength: 32)
    self.statusItem.title = "Github Pulse"
    self.statusItem.highlightMode = true
    self.statusItem.view = self.statusButton
    
    self.timer = Timer(fireAt: Date(), interval: 15*60, target: self, selector: #selector(AppDelegate.checkForCommits), userInfo: nil, repeats: true)
    RunLoop.current.add(self.timer, forMode: RunLoopMode.defaultRunLoopMode)
  }
  
  deinit {
    NotificationCenter.default.removeObserver(self)
    DistributedNotificationCenter.default().removeObserver(self)
    self.timer.invalidate()
    self.timer = nil
  }
  
  func checkForCommits() {
    GithubUpdate.check()
    
    if let username = parseData("username") as? String {
      self.fetchCommits(username)
    }
  }
  
  func parseData(_ key: String) -> AnyObject? {
    if let input = UserDefaults.standard.value(forKey: key) as? String {
      if let data = input.data(using: String.Encoding.utf8, allowLossyConversion: false) {
        if let object = (try? JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments)) as? [String: AnyObject] {
          return object["data"]
        }
      }
    }
    
    return nil
  }
  
  func fetchCommits(_ username: String) {
    let dontNotify = parseData("dont_notify") as? Bool
    
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
  func updateIcon(_ _count: Int) {
    var count:Int
    
    if _count == -1 {
      count = self.lastIconCount
    } else {
      count = _count
      self.lastIconCount = count
    }
    
    var imageName = count == 0 ?  "icon_notification" : "icon"
    
    if let domain = UserDefaults.standard.persistentDomain(forName: UserDefaults.globalDomain) {
      if let style = domain["AppleInterfaceStyle"] as? String {
        if style == "Dark" {
          imageName += "_dark"
        }
      }
    }
    
    self.statusButton.image = NSImage(named: imageName)
  }
  
  func checkForNotification() {
    let userDefaults = UserDefaults.standard
    let now = Date()
    let components = (Calendar.current as NSCalendar).components(NSCalendar.Unit.hour, from: now)
          

    if components.hour! >= 18 {
      let lastNotification = userDefaults.value(forKey: "last_notification") as? Date
      let todayStart = (Calendar.current as NSCalendar).date(bySettingHour: 1, minute: 0, second: 0, of: now, options: [])
      
      if lastNotification == nil || todayStart!.timeIntervalSince(lastNotification!) > 0 {
        let notification = NSUserNotification()
        notification.title = "You haven't committed yet today...";
        notification.subtitle = "Rush to keep your streak going!"
        
        let notificationCenter = NSUserNotificationCenter.default
        notificationCenter.scheduleNotification(notification)
        
        userDefaults.setValue(now, forKey: "last_notification")
      }
    }
  }

  func applicationWillResignActive(_ notification: Notification) {
    self.open = false
    self.popover.closePopover(nil)
  }
  
  func toggle(_: AnyObject) {
    if (self.open) {
      self.popover.closePopover(nil)
    } else {
      let controller = self.popover.contentViewController as! ContentViewController
      _ = controller.webView?.stringByEvaluatingJavaScript(from: "update(false)")
      
      self.popover.presentPopover(from: self.statusItem.view!.bounds, in: self.statusItem.view!, preferredArrowDirection: INPopoverArrowDirection.up, anchorsToPositionView: true)
      NSApp.activate(ignoringOtherApps: true)
    }
    
    self.open = !self.open
  }
  
  func _checkIconNotification(_ notification:Notification) {
    self.updateIcon(notification.userInfo?["today"] as! Int)
  }
  
  @objc func _darkModeChanged(_ notification:Notification) {
    self.updateIcon(-1)
  }
  
  func _checkUsernameNotification(_ notification:Notification) {
    if let username = self.parseData("username") as? String {
      self.fetchCommits(username)
    } else {
      self.updateIcon(1)
    }
  }
}
