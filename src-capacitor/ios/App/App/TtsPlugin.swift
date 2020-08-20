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
        print("bailar la")
        if let msg = call.getString("text") {
          print("comoo estaa yolo")
          var locale = call.getString("locale") 
          if locale != nil {

          } else {
            locale = "fr-FR"
          }
          let speed = call.getString("rate")
          var rate = Float(1.0)
          if speed != nil {
            rate = Float(speed!) ?? 1.0
          }
          print(String(rate))
          switch rate {
          case 0.25:
              rate = 0.3
          case 0.5:
              rate = 0.45
          case 0.75:
              rate = 0.48
          case 1.0:
              rate = 0.5
          case 1.25:
              rate = 0.52
          case 1.50:
              rate = 0.55
          case 1.75:
              rate = 0.57
          case 2.0:
              rate = 0.6
          default:
              rate = 0.5
          }
          print(String(rate))
          let utterance = AVSpeechUtterance(string: msg);
          utterance.voice = AVSpeechSynthesisVoice(language: locale);
          utterance.rate = rate
          tts.speak(utterance);
          call.success();
        } else {
          call.reject("Error");
        }
    }
}
