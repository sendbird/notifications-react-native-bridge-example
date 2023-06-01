import SendbirdUIKit

@objc(SendbirdNotifications)
class SendbirdNotifications: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc(open:theme:disconnectFirst:successCallback:errorCallback:)
  func open(userId: String, theme: String, disconnectFirst: Bool, successCallback: @escaping RCTResponseSenderBlock, errorCallback: @escaping RCTResponseErrorBlock) -> Void {
    DispatchQueue.main.async {
      SBUTheme.set(theme: theme == "dark" ? .dark : .light)

      func connect() {
        SBUGlobals.currentUser = SBUUser(userId: userId)
        SendbirdUI.connect { user, error in
          if let error = error {
            errorCallback(error)
            return
          }

          if let user = user {
            let channelVC =
              SBUViewControllerSet.FeedNotificationChannelViewController.init(
                channelURL: "notification_143867_feed"
              )

            guard let navigationController = UIApplication.shared.keyWindow?.rootViewController as? UINavigationController else {
              errorCallback(NSError(domain: "org.reactjs.native.example.RNSBNotifications", code: 0, userInfo: [NSLocalizedDescriptionKey: "navigationController is null"]))
              return
            }
            navigationController.pushViewController(channelVC, animated: true)
            successCallback([user.userId])
          }
        }
      }

      if (disconnectFirst) {
        SendbirdUI.disconnect {
          connect()
        }
      } else {
        connect()
      }
    }
  }
}
