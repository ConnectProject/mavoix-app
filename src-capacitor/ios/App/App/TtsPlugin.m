//
//  TtsPlugin.m
//  App
//
//  Created by Pierre GUTHAUSER on 11/1/19.
//

#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(TtsPlugin, "TtsPlugin",
   CAP_PLUGIN_METHOD(load, CAPPluginReturnPromise);
   CAP_PLUGIN_METHOD(speak, CAPPluginReturnPromise);
)
