package io.connect.mavoix;

import android.app.ActivityManager;
import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.view.View;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {

  private int MY_DATA_CHECK_CODE = 0;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

    Intent checkTTSIntent = new Intent();
    checkTTSIntent.setAction(TextToSpeech.Engine.ACTION_CHECK_TTS_DATA);
    startActivityForResult(checkTTSIntent, MY_DATA_CHECK_CODE);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
        add(TtsPlugin.class);
    }});
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (requestCode == MY_DATA_CHECK_CODE) {
      if (resultCode != TextToSpeech.Engine.CHECK_VOICE_DATA_PASS) {
        Intent installTtsIntent = new Intent();
        installTtsIntent.setAction(TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA);
        startActivity(installTtsIntent);
      }
    }
  }

  @Override
  public void onResume() {
    super.onResume();
    enterKioskMode();
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) {
      hideSystemBars();
    }
  }

  /** Immersive fallback: hides status and navigation bars (a swipe from the edge shows them briefly). */
  private void hideSystemBars() {
    getWindow().getDecorView().setSystemUiVisibility(
      View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
        | View.SYSTEM_UI_FLAG_FULLSCREEN
        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
  }

  /** Lock task mode: only possible once the app is device owner (adb shell dpm set-device-owner). */
  private void enterKioskMode() {
    DevicePolicyManager dpm = (DevicePolicyManager) getSystemService(Context.DEVICE_POLICY_SERVICE);
    if (dpm == null || !dpm.isDeviceOwnerApp(getPackageName())) {
      return;
    }
    ComponentName admin = new ComponentName(this, AdminReceiver.class);
    dpm.setLockTaskPackages(admin, new String[] { getPackageName() });
    ActivityManager am = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
    if (am.getLockTaskModeState() == ActivityManager.LOCK_TASK_MODE_NONE) {
      startLockTask();
    }
  }
}
