package io.connect.mavoix;

import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;

import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import java.util.Locale;

/**
 * Text to speech through the Android engine. Android's WebView has no
 * window.speechSynthesis, so the app calls this plugin when it runs natively.
 */
@NativePlugin()
public class TtsPlugin extends Plugin implements TextToSpeech.OnInitListener {

    private TextToSpeech tts;
    private PluginCall initCall;
    private PluginCall speakCall;
    private String speakId;
    private int counter = 0;

    @PluginMethod()
    public void load(PluginCall call) {
        this.initCall = call;
        this.tts = new TextToSpeech(this.getContext(), this);
    }

    @Override
    public void onInit(int initStatus) {
        if (initStatus == TextToSpeech.SUCCESS) {
            this.tts.setLanguage(Locale.FRENCH);
            this.tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                @Override
                public void onStart(String utteranceId) {
                }

                @Override
                public void onDone(String utteranceId) {
                    finishSpeak(utteranceId);
                }

                @Override
                public void onError(String utteranceId) {
                    finishSpeak(utteranceId);
                }

                @Override
                public void onStop(String utteranceId, boolean interrupted) {
                    finishSpeak(utteranceId);
                }
            });
            this.initCall.success();
        } else {
            this.initCall.error(initStatus + ": Failed to init TTS");
        }
    }

    /** Resolve the pending speak call once its utterance is over. */
    private synchronized void finishSpeak(String utteranceId) {
        if (this.speakCall != null && utteranceId != null && utteranceId.equals(this.speakId)) {
            PluginCall call = this.speakCall;
            this.speakCall = null;
            this.speakId = null;
            call.success();
        }
    }

    @PluginMethod()
    public synchronized void speak(PluginCall call) {
        if (this.tts == null) {
            call.error("TTS not loaded");
            return;
        }
        String value = call.getString("text");
        String lang = call.getString("locale");
        String speed = call.getString("rate");

        float rate = 1.0f;
        try {
            if (speed != null) {
                rate = Float.parseFloat(speed);
            }
        } catch (NumberFormatException e) {
            rate = 1.0f;
        }
        this.tts.setSpeechRate(rate);

        Locale locale = Locale.FRENCH;
        if (lang != null && !lang.isEmpty()) {
            locale = Locale.forLanguageTag(lang.replace('_', '-'));
        }
        int result = this.tts.setLanguage(locale);
        if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
            call.error("Language not available: " + lang);
            return;
        }

        // a new phrase replaces the one being spoken
        if (this.speakCall != null) {
            PluginCall previous = this.speakCall;
            this.speakCall = null;
            this.speakId = null;
            previous.success();
        }
        this.counter++;
        this.speakId = "iSpeak" + this.counter;
        this.speakCall = call;
        int status = this.tts.speak(value, TextToSpeech.QUEUE_FLUSH, null, this.speakId);
        if (status != TextToSpeech.SUCCESS) {
            this.speakCall = null;
            this.speakId = null;
            call.error("speak failed: " + status);
        }
    }

    @PluginMethod()
    public synchronized void stop(PluginCall call) {
        if (this.tts != null) {
            this.tts.stop();
        }
        if (this.speakCall != null) {
            PluginCall pending = this.speakCall;
            this.speakCall = null;
            this.speakId = null;
            pending.success();
        }
        call.success();
    }
}
