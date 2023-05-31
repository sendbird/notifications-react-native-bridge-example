import SendbirdUIKit

@objc(SendbirdNotifications)
class SendbirdNotifications: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc public func open() -> Void {
    DispatchQueue.main.async {
      let channelVC =
        SBUViewControllerSet.FeedNotificationChannelViewController.init(
        channelURL: "notification_143867_feed"
      )

      guard let navigationController = UIApplication.shared.keyWindow?.rootViewController as? UINavigationController else {
        return
      }
      navigationController.pushViewController(channelVC, animated: true)
    }
  }
}
