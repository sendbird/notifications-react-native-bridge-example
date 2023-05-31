package com.rnsbnotifications;

import android.content.Intent;
import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

import com.sendbird.uikit.SendbirdUIKit;
import com.sendbird.uikit.adapter.SendbirdUIKitAdapter;
import com.sendbird.uikit.interfaces.UserInfo;
import com.sendbird.android.handler.InitResultHandler;
import com.sendbird.android.exception.SendbirdException;
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
    public void open(String userId, String theme) {
        try {
            SendbirdUIKit.setDefaultThemeMode(
                    theme.equals("dark") ? SendbirdUIKit.ThemeMode.Dark : SendbirdUIKit.ThemeMode.Light);

            SendbirdUIKit.init(new SendbirdUIKitAdapter() {
                @NonNull
                @Override
                public String getAppId() {
                    return "5884F3E6-135C-445B-8791-05B5D8DA6BB9"; // Specify your Sendbird application ID.
                }

                @Nullable
                @Override
                public String getAccessToken() {
                    return "";
                }

                @NonNull
                @Override
                public UserInfo getUserInfo() {
                    return new UserInfo() {
                        @Override
                        public String getUserId() {
                            return userId;
                        }

                        @Nullable
                        @Override
                        public String getNickname() {
                            return "";
                        }

                        @Nullable
                        @Override
                        public String getProfileUrl() {
                            return "";
                        }
                    };
                }

                @NonNull
                @Override
                public InitResultHandler getInitResultHandler() {
                    return new InitResultHandler() {
                        @Override
                        public void onMigrationStarted() {
                            // DB migration has started.
                        }

                        @Override
                        public void onInitFailed(SendbirdException e) {
                            // If DB migration fails, this method is called.
                        }

                        @Override
                        public void onInitSucceed() {
                            // If DB migration is successful, this method is called and you can proceed to
                            // the next step.
                            // In the sample app, the LiveData class notifies you on the initialization
                            // progress
                            // And observes the MutableLiveData<InitState> initState value in
                            // SplashActivity().
                            // If successful, the LoginActivity screen
                            // Or the HomeActivity screen will show.
                        }
                    };
                }
            }, reactContext);

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
