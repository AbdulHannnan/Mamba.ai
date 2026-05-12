 import * as Sentry from "@sentry/node"` 


Sentry.init({
  dsn: "https://27d5545c00b9a7e1889d4e0d938f3509@o4511377570791424.ingest.us.sentry.io/4511377574985728",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});