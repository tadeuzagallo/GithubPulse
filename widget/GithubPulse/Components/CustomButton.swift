//
//  CustomButton.swift
//  GithubPulse
//
//  Created by Tadeu Zagallo on 12/30/14.
//  Copyright (c) 2014 Tadeu Zagallo. All rights reserved.
//

import Cocoa

class CustomButton : NSButton {
  var rightAction:((NSEvent) -> Void)?
  
  override init(frame frameRect: NSRect) {
    super.init(frame: frameRect)
  }

  required init?(coder: NSCoder) {
      fatalError("init(coder:) has not been implemented")
  }
  
  override func rightMouseDown(with theEvent: NSEvent) {
    if self.rightAction != nil {
      self.rightAction?(theEvent)
    }
  }
}
