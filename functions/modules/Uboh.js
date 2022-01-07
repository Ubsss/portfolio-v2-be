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
 * @param {string}            smsContent message to be sent
 * @param {string}            to         number getting message
 * @param {string}            from       twilio number sending message
 */
exports.sendSMS = async function (res, sms, smsContent, to, from) {
  try {
    if (!res || !sms || !smsContent)
      throw { code: 400, message: "Invalid sms request" };
    let sendMessage = await sms.messages.create({
      to,
      from,
      body: JSON.stringify(smsContent),
    });
    res.json({ status: "Success", message: "Sent sms message" });
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
 * add an advice to db
 * @param {express response}   res        express response object
 * @param {firebase firestore} db         firestore object
 * @param {array[advice]}      adviceList list of advice
 */
exports.addAdvice = async function (res, db, adviceList) {
  try {
    let unprocessedAdvice = [];
    adviceList.map((advice) => {
      let adviceValidation = validateAdvice(
        advice.likes,
        advice.advice,
        advice.author,
        advice.category
      );
      if (adviceValidation.length > 0) {
        let adviceValidationResponse = Object.assign(
          { ...advice },
          { validationResult: adviceValidation }
        );
        unprocessedAdvice.push(adviceValidationResponse);
      } else {
        db.collection("advice").add(advice);
      }
    });
    res.json({ code: 200, message: "added advice", unprocessedAdvice });
  } catch (error) {
    console.error(error);
    res.json({
      code: error.code && error.code === 400 ? error.code : 500,
      message: "Internal error",
    });
  }
};

/**
 * gets all advice from db
 * @param {express response}   res express response object
 * @param {firebase firestore} db  firestore object
 */
exports.getAllAdvice = async function (res, db) {
  try {
    let adviceList = [];
    await db
      .collection("advice")
      .get()
      .then((response) => {
        if (!response.empty) {
          response.forEach((doc) => {
            adviceList.push({ id: doc.id, ...doc.data() });
          });
        }
      });

    res.json({ code: 200, message: adviceList });
  } catch (error) {
    console.error(error);
    res.json({
      code: 500,
      message: "Internal error",
    });
  }
};

/**
 * gets all advice from db
 * @param {express response}   res      express response object
 * @param {firebase firestore} db       firestore object
 * @param {string}             adviceID id of advice to update
 * @param {number}             newLikes number of likes to add
 */
exports.likeAdvice = async function (res, db, adviceID, newLikes) {
  try {
    if (typeof newLikes !== "number")
      throw { code: 400, message: "invalid request" };
    await db
      .collection("advice")
      .doc(adviceID)
      .get()
      .then((response) => {
        if (response.exists) {
          let adviceInfo = response.data();
          adviceInfo.likes += newLikes;
          db.collection("advice").doc(adviceID).set(adviceInfo);
        } else throw { code: 400, message: "advice does not exist" };
      });

    res.json({ code: 200, message: "advice updated" });
  } catch (error) {
    console.error(error);
    res.json({
      code: error.code ? error.code : 500,
      message: error.message ? error.message : "Internal error",
    });
  }
};

/**
 * validate the advice object
 * @param {number} likes     total likes for advice
 * @param {string} advice    the advice itself
 * @param {string} author    advice owner
 * @param {string} category  type of advice
 */
function validateAdvice(likes, advice, author, category) {
  let validationResult = [];
  if (likes == null || likes == undefined || typeof likes !== "number")
    validationResult.push("likes should be number");
  if (!advice || typeof advice !== "string")
    validationResult.push("advice should be string");
  if (!author || typeof author !== "string")
    validationResult.push("author should be string");
  if (!category || typeof category !== "string")
    validationResult.push("category should be string");
  return validationResult;
}
