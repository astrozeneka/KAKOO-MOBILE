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

  @PluginMethod()
  public void displayShareSheet(PluginCall call) {

    JSObject ret = new JSObject();

    String intentTitle = call.getString("intentTitle");
    if (intentTitle == null) {
      intentTitle = "Share via";
    }

    String shareSubject = call.getString("subject");
    if (shareSubject == null) {
      shareSubject = "Sharing from Android";
    }
    String shareLink = call.getString("message");

    Intent shareIntent = new Intent(Intent.ACTION_SEND);
    shareIntent.setType("text/plain");
    shareIntent.putExtra(Intent.EXTRA_SUBJECT, shareSubject);
    shareIntent.putExtra(Intent.EXTRA_TEXT, shareLink);

    try {
      getContext().startActivity(Intent.createChooser(shareIntent, intentTitle));
      ret.put("message", "Share sheet displayed successfully");
      call.resolve(ret);
    } catch (android.content.ActivityNotFoundException ex) {
      ret.put("error", "Failed to display share sheet: " + ex.getMessage());
      call.reject(ret.toString());
    }


    ret.put("message", "Share sheet displayed from Android");
    call.resolve(ret);
  }

  @PluginMethod()
  public void getAppVersion(PluginCall call){
    try {
      String packageName = getContext().getPackageName();
      String version = getContext().getPackageManager()
        .getPackageInfo(packageName, 0).versionName;
      JSObject result = new JSObject();
      result.put("version", version);
      call.resolve(result);
    } catch (Exception e) {
      call.reject("Unable to fetch app version", e);
    }
  }
}
