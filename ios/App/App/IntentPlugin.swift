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
    CAPPluginMethod(name:"displayShareSheet", returnType: CAPPluginReturnPromise),
    CAPPluginMethod(name:"getAppVersion", returnType: CAPPluginReturnPromise)
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
      if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
        let rootVC = scene.windows.first?.rootViewController {
          // For iPad, set the sourceView and sourceRect
          if let popoverController = activityVC.popoverPresentationController {
            popoverController.sourceView = rootVC.view
            popoverController.sourceRect = CGRect(x: rootVC.view.bounds.midX, y: rootVC.view.bounds.midY, width: 0, height: 0);
            popoverController.permittedArrowDirections = []
          }
          rootVC.present(activityVC, animated: true) {
          call.resolve(["messages": "Share sheet displayed successfully from native"])
        }
      } else {
        call.reject("unable to find root view controller")
      }
      /*if let rootVC = UIApplication.shared.keyWindow?.rootViewController {
        rootVC.present(activityVC, animated: true, completion: nil)
      }*/
      call.resolve(["message": "Share sheet displayed successfully from native"])
    }
  }
  
  @objc func getAppVersion(_ call: CAPPluginCall){
    if let appVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String {
        call.resolve(["version": appVersion])
    } else {
        call.reject("Unable to fetch app version")
    }
  }
}
