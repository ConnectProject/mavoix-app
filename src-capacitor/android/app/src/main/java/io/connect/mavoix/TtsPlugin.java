package io.connect.mavoix;

import android.speech.tts.TextToSpeech;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import java.util.Locale;

@NativePlugin()
public class TtsPlugin extends Plugin implements TextToSpeech.OnInitListener {

    private TextToSpeech tts;
    private PluginCall initCall;

    @PluginMethod()
    public void init(PluginCall call) {
        this.tts = new TextToSpeech(this.getContext(),this);
        this.initCall = call;
    }

    @Override
    public void onInit(int initStatus) {
        if (initStatus == TextToSpeech.SUCCESS) {
            this.tts.setLanguage(Locale.FRANCE);
            this.initCall.success();
        } else {
            this.initCall.error(initStatus + ": Failed to init TTS");
        }
    }

    @PluginMethod()
    public void speak(PluginCall call) {
        String value = call.getString("text");
        this.tts.speak(value, TextToSpeech.QUEUE_FLUSH, null, "iSpeak");
        call.success();
    }
}
