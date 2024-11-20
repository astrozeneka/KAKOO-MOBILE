//
//  IntentPlugin.swift
//  App
//
//  Created by Ryan Rasoarahona on 13/11/2567 BE.
//

import Foundation
import Capacitor
import MessageUI

@objc(IntentPlugin)
public class IntentPlugin: CAPPlugin, CAPBridgedPlugin, MFMailComposeViewControllerDelegate {
  public let identifier = "IntentPlugin"
  public let jsName = "Intent"
  public let pluginMethods: [CAPPluginMethod] = [
    CAPPluginMethod(name:"openMailApp", returnType: CAPPluginReturnPromise),
    CAPPluginMethod(name:"displayShareSheet", returnType: CAPPluginReturnPromise)
  ]
  
  override public func load() {
    print("Initializing ios intent plugin")
  }
  
  // Constructor
  @objc override public init() {
    print("Here in the constructor")
    super.init()
  }
  
  @objc func openMailApp(_ call: CAPPluginCall){
    print("Opening mail app from iOS");
    /*if MFMailComposeViewController.canSendMail() {
      DispatchQueue.main.async {
        let mailComposeViewController = MFMailComposeViewController()
        mailComposeViewController.mailComposeDelegate = self
        self.bridge?.viewController?.present(mailComposeViewController, animated: true, completion: nil)
        call.resolve(["message": "Mail app opened successfully"]);
      }
    } else {
      call.resolve(["error": "Mail app not available"]);
    }*/
    if let url = URL(string: "message://") {
      if UIApplication.shared.canOpenURL(url) {
        DispatchQueue.main.async {
          UIApplication.shared.open(url, options: [:], completionHandler: nil)
          call.resolve(["message": "Mail app inbox opened successfully"])
        }
      } else {
        call.resolve(["error": "Mail app not available"])
      }
    }
  }
  
  @objc func displayShareSheet(_ call: CAPPluginCall){
    DispatchQueue.main.async {
      let textToShare = call.getString("message") ?? ""
      let activityVC = UIActivityViewController(activityItems: [textToShare], applicationActivities: nil)
      if let rootVC = UIApplication.shared.keyWindow?.rootViewController {
        rootVC.present(activityVC, animated: true, completion: nil)
      }
      call.resolve(["message": "Share sheet displayed successfully from native"])
    }
  }
}
