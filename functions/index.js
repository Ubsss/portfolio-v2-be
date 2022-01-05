const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilioClient = require("twilio");
const cors = require("cors")({ origin: true });
const uboh = require("./modules/Uboh");

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const smsClient = twilioClient(
  functions.config().sms.account_sid,
  functions.config().sms.auth_token
);

exports.uboh = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    try {
      if (req.method !== "POST" || !req.body)
        return res.json({ code: 400, message: "Invalid request" });
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer ")
      ) {
        return res.json({ code: 400, message: "Unauthorized access" });
      }
      let token = req.headers.authorization.split("Bearer ")[1];
      let action = req.body.action;
      auth
        .verifyIdToken(token)
        .then(() => {
          switch (action) {
            case "addMessage":
              uboh.addMessage(req.body.message, res, db);
              break;
            case "addLog":
              uboh.addLog(req.body.messages, res, db);
              break;
            case "sendSMS":
              uboh.sendSMS(res, smsClient, req.body.message);
              break;
            case "addAdvice":
              uboh.addAdvice(res, db, req.body.message);
              break;
            default:
              res.json({ code: 400, message: "Invalid request" });
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
        code: 500,
        message: "Internal error, please try again later",
      });
    }
  });
});
