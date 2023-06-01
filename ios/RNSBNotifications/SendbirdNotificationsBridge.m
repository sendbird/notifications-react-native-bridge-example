#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(SendbirdNotifications, NSObject)
RCT_EXTERN_METHOD(open:(NSString *)userId theme:(NSString *)theme disconnectFirst:(BOOL *)disconnectFirst successCallback:(RCTResponseSenderBlock)successCallback errorCallback:(RCTResponseSenderBlock)errorCallback)
@end
