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
    public void load(PluginCall call) {
        this.tts = new TextToSpeech(this.getContext(),this);
        this.initCall = call;
    }

    @Override
    public void onInit(int initStatus) {
        if (initStatus == TextToSpeech.SUCCESS) {
            this.tts.setLanguage(Locale.FRENCH);
            this.initCall.success();
        } else {
            this.initCall.error(initStatus + ": Failed to init TTS");
        }
    }

    @PluginMethod()
    public void speak(PluginCall call) {
        String value = call.getString("text");
        String lang = call.getString("locale");
        String speed = call.getString("rate");
        Float rate = Float.parseFloat(speed);
        if(rate != null) {
          this.tts.setSpeechRate(rate);
        }else {
          this.tts.setSpeechRate(1.0f);
        }
        switch(lang) {
          case "fr_FR":
            this.tts.setLanguage(Locale.FRENCH);
            break;
          case "en_US":
            Locale us = new Locale("en", "US");
            this.tts.setLanguage(us);
            break;
          case "it_IT":
            this.tts.setLanguage(Locale.ITALIAN);
            break;
          case "pt_PT":
            Locale pt = new Locale("pt", "PT");
            this.tts.setLanguage(pt);
            break;
          case "en_UK":
            Locale uk = new Locale("en", "UL");
            this.tts.setLanguage(uk);
            break;
          case "es_ES":
            Locale spanish = new Locale("es", "ES");
            this.tts.setLanguage(spanish);
            break;
          case "de_DE":
            this.tts.setLanguage(Locale.GERMAN);
            break;
          case "nl_NL":
            Locale dutch = new Locale("nl", "NL");
            this.tts.setLanguage(dutch);
            break;
          default:
            this.tts.setLanguage(Locale.FRENCH);
        }
        this.tts.speak(value, TextToSpeech.QUEUE_FLUSH, null, "iSpeak");
        call.success();
    }
}
