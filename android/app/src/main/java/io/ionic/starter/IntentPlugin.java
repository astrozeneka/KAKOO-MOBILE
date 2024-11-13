package io.ionic.starter;

import android.content.Intent;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name="Intent")
public class IntentPlugin extends Plugin{

  @Override
  public void load() {
    // Initalize the plugin
    System.out.println("Initializing Intent plugin in android");
  }

  @PluginMethod()
  public void openMailApp(PluginCall call){
    // Return { "message": "Hello World" }
    JSObject ret = new JSObject();

    Intent intent = new Intent(Intent.ACTION_MAIN);
    intent.addCategory(Intent.CATEGORY_APP_EMAIL);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    getContext().startActivity(intent);

    ret.put("message", "Mail opened");
    call.resolve(ret);
  }
}
