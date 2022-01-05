/**
 * Add connect message to db
 * @param  {map}                message user message
 * @param  {express response}   res     express response object
 * @param  {firebase firestore} db      firebase firestore object
 */
exports.addMessage = async function (message, res, db) {
  try {
    if (!message.email || !message.type || !message.message)
      throw { code: 400, message: "Invalid message object" };

    let date = new Date();
    let newMessage = Object.assign({ created: date.toUTCString() }, message);

    await db
      .collection("messages")
      .doc(`${message.email}_${date.toUTCString().replace(/\s+/g, "")}`)
      .set(newMessage);

    res.json({
      code: 200,
      message: "Message added",
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: error.code && error.code === 400 ? error.code : 500,
      message:
        error.code && error.code === 400
          ? error.message
          : "Internal error, pl-ease try again later",
    });
  }
};

/**
 * Add log to db
 * @param  {map}                log log object
 * @param  {express response}   res express response object
 * @param  {firebase firestore} db  firebase firestore object
 */
exports.addLog = async function (log, res, db) {
  try {
    if (!log.message) throw { code: 400, message: "Invalid log object" };

    let date = new Date();
    let newLog = Object.assign({ created: date.toUTCString() }, log);

    await db.collection("logs").doc(date.toUTCString()).set(newLog);

    res.json({
      code: 200,
      message: "Log added",
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: error.code && error.code === 400 ? error.code : 500,
      message:
        error.code && error.code === 400
          ? error.message
          : "Internal error, please try again later",
    });
  }
};

/**
 * Sends an sms to a provided number with message
 * @param {Express response}  res        express response object
 * @param {Twilio SMS Object} sms        twilio sms object
 * @param {string}            message    message to be sent
 */
exports.sendSMS = async function (res, sms, smsContent) {
  try {
    if (!res || !sms || !message) throw new Error("Invalid sms request");
    let sendMessage = await sms.messages.create({
      to: functions.config().sms.personal_number,
      from: functions.config().sms.twilio_number,
      body: message,
    });
    console.log(sendMessage);
    res.json({ status: "Success", message: "Sent sms message" });
  } catch (error) {
    res.json({
      status: "Error",
      message: error.message || "Unable to send sms",
    });
  }
};

/**
 * add an advice to db
 * @param {express response} res        express response object
 * @param {array[advice]}    adviceList list of advice
 */
exports.addAdvice = async function (res, adviceList) {
  console.log("adding advice to db");
};

/**
 * validate the advice object
 * @param {number} likes     total likes for advice
 * @param {string} advice    the advice itself
 * @param {string} author    advice owner
 * @param {string} category  type of advice
 */
function validateAdvice(likes, advice, author, category) {
  console.log("validating advice");
}
