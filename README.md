# Ma Voix -- Application

## Preparation
1. Prepare the API
> Go to https://github.com/ConnectProject/mavoix-api

2. Prepare the repo
> `git clone https://github.com/ConnectProject/mavoix-app.git`

> `npm install`

3. Load environment variables
> To load environment variables you can copy `.env.example` to a file called `.env` and set the variables to match the api.

4. Install Quasar CLI
> `npm install -g @quasar/cli`

## Running
> `quasar dev -m capacitor -T [ios, android]`

## Using the app on an Android tablet

The Android app (APK) is built by the GitHub Action `Android APK`
(Actions tab > "Android APK" > Run workflow, then download the `mavoix-debug-apk` artifact).
Copy the APK to the tablet and open it to install it (allow "install unknown apps" when asked),
or from a computer: `adb install -r mavoix-debug.apk`.

If the person using the tablet must not leave Ma Voix, choose one of the levels below.
They go from the gentlest to the strictest; you can stop at any level.

The app always hides the status bar and the navigation bar (the back, home and recents buttons).
Swiping from a screen edge shows them again for a few seconds, so on its own this keeps the screen
clean but does not stop someone from leaving.

### Level 1 -- Ma Voix as the home app (no computer, easy to undo)
1. Press the Home button, or open Settings > Apps > Default apps > Home app.
2. Choose **Ma Voix** and "Always".

The tablet opens Ma Voix at start-up and whenever Home is pressed. Anyone can still swipe to
the other apps. To undo, choose the original launcher again in the same menu.

### Level 2 -- Screen pinning (no computer, can be undone by anyone who knows the trick)
1. Settings > Security (or "Security & privacy" > "More security settings") > **App pinning** /
   "Screen pinning": turn it on, and turn on "Ask for PIN before unpinning".
2. Open Ma Voix, press Recents, tap the app icon at the top of its card and choose **Pin**.

Home and Recents stop working. To unpin, hold Back and Recents together (or swipe up and hold)
and enter the PIN. The pin is lost after a restart and must be done again; menu names vary by
manufacturer.

### Level 3 -- Kiosk mode (needs a computer, strictest)
Ma Voix becomes the tablet's "device owner" and locks itself: no navigation buttons, no status bar,
no way out by gestures, and it relocks itself every time it opens, also after a restart
(combine it with Level 1 so the tablet opens Ma Voix at start-up).

What you need: a computer with [adb](https://developer.android.com/tools/releases/platform-tools),
a USB cable, and a tablet **without any account** (Google or other) in Settings > Accounts. Android
refuses the command below otherwise; remove the accounts, or factory-reset the tablet and skip the
account set-up.

1. On the tablet: Settings > About > tap "Build number" 7 times, then Settings > Developer options >
   turn on **USB debugging**. Plug in the cable and accept the computer's key on the tablet.
   If installing fails with a verification error, turn off "Verify apps over USB".
2. Install the APK: `adb install -r mavoix-debug.apk`
3. Make Ma Voix the device owner (once):
   `adb shell dpm set-device-owner io.connect.mavoix/.AdminReceiver`
   It must answer `Success`.
4. Close and reopen Ma Voix. The navigation buttons are gone.

Maintenance and undoing it:
- Updating the app: `adb install -r new.apk` works as usual and keeps the kiosk.
- Leave kiosk mode for good: `adb shell dpm remove-active-admin io.connect.mavoix/.AdminReceiver`.
  If the tablet refuses, a factory reset always works.
- While locked, the tablet can still be reached from a computer with adb, so keep USB debugging
  off when it is not needed.
- Updates must be signed with the same key as the installed app, or uninstall it first (this
  deletes its data).

## Enjoy
