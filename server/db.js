"use strict";

const sqlite = require("sqlite3");

// open the database
const db = new sqlite.Database("ExamStudy.sqlite", (err) => {
  if (err) {
    console.log(err);
    throw err;
  }
});

module.exports = db;
