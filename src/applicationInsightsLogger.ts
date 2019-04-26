import appInsights = require("applicationinsights");

require("dotenv").config();

class ApplicationInsightsLogger {
  enable = false;

  init() {
    // start application insights
    const key = process.env.INSTRUMENTATION_KEY;
    if (!key) {
      console.error("application insight key missing");
      return false;
    }
    appInsights.setup(key).start();
    this.enable = true;
    return this.enable;
  }

  trackHttpRequests(app: any) {
    if (!this.enable) {
      return;
    }

    app.use((req: any, res: any, next: any) => {
      appInsights.defaultClient.trackNodeHttpRequest({
        request: req,
        response: res
      });
      next();
    });
  }

  trackTrace(message: string, properties: any) {
    if (!this.enable) {
      return;
    }

    appInsights.defaultClient.commonProperties = properties;
    appInsights.defaultClient.trackTrace({ message });
  }
}

const applicationInsightsLogger = new ApplicationInsightsLogger();

export default applicationInsightsLogger;
