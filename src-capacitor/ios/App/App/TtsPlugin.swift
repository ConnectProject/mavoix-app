//
//  TtsPlugin.swift
//  App
//
//  Created by Pierre GUTHAUSER on 11/1/19.
//

import Foundation
import AVFoundation
import Capacitor

@objc(TtsPlugin)
public class TtsPlugin: CAPPlugin {
    var tts: AVSpeechSynthesizer = AVSpeechSynthesizer();
    
    @objc func load(_ call: CAPPluginCall) {
      call.success();
    }
    
    @objc func speak(_ call: CAPPluginCall) {
        print("Holaaaa")
        if let msg = call.getString("text") {
            print("comoo estaa")
          let utterance = AVSpeechUtterance(string: msg);
          utterance.voice = AVSpeechSynthesisVoice(language: "fr-FR");
          tts.speak(utterance);
          call.success();
        } else {
          call.reject("Error");
        }
    }
}
