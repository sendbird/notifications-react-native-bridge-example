package com.rnsbnotifications;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

import com.sendbird.uikit.SendbirdUIKit;
import com.sendbird.uikit.adapter.SendbirdUIKitAdapter;
import com.sendbird.uikit.interfaces.UserInfo;
import com.sendbird.android.handler.InitResultHandler;
import com.sendbird.android.exception.SendbirdException;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new DefaultReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for
      // example:
      packages.add(new SendbirdNotificationsPackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

    @Override
    protected boolean isNewArchEnabled() {
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }

    @Override
    protected Boolean isHermesEnabled() {
      return BuildConfig.IS_HERMES_ENABLED;
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

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
            return "test"; // Specify your user ID.
          }

          @Nullable
          @Override
          public String getNickname() {
            return "Test"; // Specify your user nickname.
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
    }, this);

    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for
      // this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }
}
