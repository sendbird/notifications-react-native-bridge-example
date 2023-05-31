package com.rnsbnotifications;

import android.content.Intent;
import android.app.Activity;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

import com.sendbird.uikit.activities.FeedNotificationChannelActivity;

public class SendbirdNotifications extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    SendbirdNotifications(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "SendbirdNotifications";
    }

    @ReactMethod
    public void open() {
        try {
            System.out.println("Inside native SendbirdNotifications method");
            Activity currentActivity = getCurrentActivity();
            if (currentActivity == null)
                return;

            Intent intent = FeedNotificationChannelActivity.newIntent(reactContext, "notification_143867_feed");
            currentActivity.startActivity(intent);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
