class Uboh {
  /**
   * Store new user to firestore db, updates existing records if present
   * @param  {map}                user user object
   * @param  {express response}   res  express response object
   * @param  {firebase firestore} db   firebase firestore object
   */
  async addUser(data, res, db) {
    try {
      if (!data.email) throw { code: 400, message: "Invalid user object" };
      let gettingDoc = await db
        .collection("uboh")
        .doc("web")
        .collection("users")
        .doc(data.email)
        .get();
      if (gettingDoc.exists) {
        let userData = gettingDoc.data();
        if (data.phone && userData.phone != data.phone) {
          await db
            .collection("uboh")
            .doc("web")
            .collection("users")
            .doc(data.email)
            .update({ phone: data.phone });
        }
      } else {
        let date = new Date();
        let newUser = Object.assign({ created: date.toUTCString() }, data);
        await db
          .collection("uboh")
          .doc("web")
          .collection("users")
          .doc(data.email)
          .set(newUser);
      }
      res.json({
        code: 200,
        message: "Add or updated user",
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
  }

  /**
   * Add connect message to db
   * @param  {map}                message user message
   * @param  {express response}   res     express response object
   * @param  {firebase firestore} db      firebase firestore object
   */
  async addMessage(message, res, db) {
    try {
      if (!message.email || !message.type || !message.message)
        throw { code: 400, message: "Invalid message object" };

      let date = new Date();
      let newMessage = Object.assign({ created: date.toUTCString() }, message);

      await db
        .collection("uboh")
        .doc("web")
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
            : "Internal error, please try again later",
      });
    }
  }

  /**
   * Add score to db
   * @param  {map}                score score object
   * @param  {express response}   res   express response object
   * @param  {firebase firestore} db    firebase firestore object
   */
  async addScore(score, res, db) {
    try {
      if (!score.name || !score.score)
        throw { code: 400, message: "Invalid score object" };

      let date = new Date();
      let newScore = Object.assign({ created: date.toUTCString() }, score);

      await db
        .collection("uboh")
        .doc("web")
        .collection("topScores")
        .doc(`${score.email}_${date.toUTCString()}_${score.score}`)
        .set(newScore);

      res.json({
        code: 200,
        message: "Score added",
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
  }

  //   /**
  //    * Update top scores
  //    * @param  {map}                score score object
  //    * @param  {firebase firestore} db    firebase firestore object
  //    */
  //   async updateHighScores(score, db) {
  //     try {
  //       let date = new Date();
  //       let newScore = Object.assign({ created: date.toUTCString() }, score);

  //       await db
  //         .collection("uboh")
  //         .doc("web")
  //         .collection("scores")
  //         .doc(`${score.email}_${date.toUTCString()}_${score.score}`)
  //         .set(newScore);

  //       res.json({
  //         code: 200,
  //         message: "Score added",
  //       });
  //     } catch (error) {
  //       console.error(error);
  //       res.json({
  //         code: error.code && error.code === 400 ? error.code : 500,
  //         message:
  //           error.code && error.code === 400
  //             ? error.message
  //             : "Internal error, please try again later",
  //       });
  //     }
  //   }

  /**
   * Add log to db
   * @param  {map}                log log object
   * @param  {express response}   res express response object
   * @param  {firebase firestore} db  firebase firestore object
   */
  async addLog(log, res, db) {
    try {
      if (!log.message) throw { code: 400, message: "Invalid log object" };

      let date = new Date();
      let newLog = Object.assign({ created: date.toUTCString() }, log);

      await db
        .collection("uboh")
        .doc("web")
        .collection("logs")
        .doc(date.toUTCString())
        .set(newLog);

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
  }

  /**
   * Implement
   * Get advice function
   * update likes function
   */
}

module.exports = new Uboh();
