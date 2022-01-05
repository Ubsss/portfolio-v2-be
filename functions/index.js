const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilioClient = require("twilio");
const cors = require("cors")({ origin: true });
const uboh = require("./modules/Uboh");

const smsClient = twilioClient(
  functions.config().sms.account_sid,
  functions.config().sms.auth_token
);

exports.uboh = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    try {
      if (req.method !== "POST" || !req.body)
        throw { code: 400, message: "Invalid sms request" };

      if (
        !req.headers.authentication ||
        !req.headers.authentication.startsWith("Bearer ")
      ) {
        throw { code: 400, message: "Unauthorized access" };
      }

      let token = req.headers.authentication.split("Bearer ")[1];

      let action = req.body.action;

      auth
        .verifyIdToken(token)
        .then(() => {
          switch (action) {
            case "addMessage":
              uboh.addMessage(req.body.message, res, db);
              break;
            case "addLog":
              uboh.addLog(req.body.log, res, db);
              break;
            case "sendSMS":
              uboh.sendSMS(res, smsClient, req.body.smsContent);
              break;
            case "addAdvice":
              uboh.addAdvice(res, req.body.advice);
              break;
            default:
              res.json({ code: 400, message: "Invalid sms request" });
              break;
          }
          return;
        })
        .catch((err) => {
          console.error(err);
          return res.status(400).json({
            code: 400,
            message: "Unauthorized access",
          });
        });
    } catch (error) {
      console.error(error);
      res.json({
        code: error.code && error.code === 400 ? error.code : 500,
        message:
          error.code && error.code === 400 ? error.message : "Internal error",
      });
    }
  });
});
