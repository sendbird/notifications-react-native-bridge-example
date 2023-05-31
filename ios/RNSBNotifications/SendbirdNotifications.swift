import SendbirdUIKit

@objc(SendbirdNotifications)
class SendbirdNotifications: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc(open:theme:)
  func open(userId: String, theme: String) -> Void {
    DispatchQueue.main.async {
      SBUGlobals.currentUser = SBUUser(userId: userId)
      SBUTheme.set(theme: theme == "dark" ? .dark : .light)

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
