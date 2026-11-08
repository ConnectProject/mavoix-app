package io.connect.mavoix;

import android.content.Context;
import android.media.AudioManager;
import android.media.audiofx.LoudnessEnhancer;
import android.os.Bundle;
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

    // The media volume is already at its maximum and the engine's own volume
    // parameter cannot exceed 1.0, so the speech is boosted with a LoudnessEnhancer
    // attached to the audio session the engine plays in.
    private static final int DEFAULT_GAIN_MB = 600; // +6 dB, in millibels
    private int audioSessionId = AudioManager.ERROR;
    private LoudnessEnhancer enhancer;

    @PluginMethod()
    public void load(PluginCall call) {
        // a second load() (retry) must not leave the first engine bound
        if (this.tts != null) {
            this.tts.shutdown();
        }
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
            this.setupBoost();
            this.initCall.success();
        } else {
            this.initCall.error(initStatus + ": Failed to init TTS");
        }
    }

    private void setupBoost() {
        try {
            AudioManager audio = (AudioManager) this.getContext().getSystemService(Context.AUDIO_SERVICE);
            this.audioSessionId = audio.generateAudioSessionId();
            this.enhancer = new LoudnessEnhancer(this.audioSessionId);
            this.enhancer.setTargetGain(DEFAULT_GAIN_MB);
            this.enhancer.setEnabled(true);
        } catch (Exception e) {
            // no boost on this device: the speech is just played at normal level
            this.enhancer = null;
            this.audioSessionId = AudioManager.ERROR;
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
        // optional "gain" in millibels (0 = no boost) overrides the default
        String gain = call.getString("gain");
        if (this.enhancer != null && gain != null) {
            try {
                this.enhancer.setTargetGain(Math.max(0, Math.min(1500, Integer.parseInt(gain))));
            } catch (Exception e) {
                // keep the current gain
            }
        }
        Bundle params = new Bundle();
        if (this.enhancer != null) {
            params.putInt(TextToSpeech.Engine.KEY_PARAM_SESSION_ID, this.audioSessionId);
        }
        this.counter++;
        this.speakId = "iSpeak" + this.counter;
        this.speakCall = call;
        int status = this.tts.speak(value, TextToSpeech.QUEUE_FLUSH, params, this.speakId);
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

    @Override
    protected void handleOnDestroy() {
        if (this.enhancer != null) {
            this.enhancer.release();
            this.enhancer = null;
        }
        if (this.tts != null) {
            this.tts.shutdown();
        }
        super.handleOnDestroy();
    }
}
