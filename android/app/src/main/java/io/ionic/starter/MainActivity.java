package io.ionic.starter;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    // The sequence of the below code is very important
    // Initializes the Capacitor Plugin
    registerPlugin(IntentPlugin.class);
    super.onCreate(savedInstanceState);
  }
}
