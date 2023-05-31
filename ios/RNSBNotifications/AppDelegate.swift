import Foundation
import UIKit
import SendbirdUIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  var navigationController: UINavigationController?
  var bridge: RCTBridge!

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    let APP_ID = "5884F3E6-135C-445B-8791-05B5D8DA6BB9"

    SendbirdUI.initialize(applicationId: APP_ID) { // This is the origin.
      // Initialization of SendbirdUIKit has started.
      // Show a loading indicator.
    } migrationHandler: {
      // DB migration has started.
    } completionHandler: { error in
      // If DB migration is successful, proceed to the next step.
      // If DB migration fails, an error exists.
      // Hide the loading indicator.
    }

    let jsCodeLocation: URL

    jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "RNSBNotifications", initialProperties: nil, launchOptions: launchOptions)
    let rootViewController = BaseViewController()
    rootViewController.view = rootView

    navigationController = UINavigationController(rootViewController: rootViewController)
    navigationController?.interactivePopGestureRecognizer?.isEnabled = true

    self.window = UIWindow(frame: UIScreen.main.bounds)
    self.window?.rootViewController = navigationController
    self.window?.makeKeyAndVisible()

    return true
  }
}

class BaseViewController: UIViewController {
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    self.navigationController?.setNavigationBarHidden(true, animated: animated)
  }

  override func viewWillDisappear(_ animated: Bool) {
    super.viewWillDisappear(animated)
    self.navigationController?.setNavigationBarHidden(false, animated: animated)
  }
}
