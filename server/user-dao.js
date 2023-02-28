"use strict";
const db = require("./db");
const bcrypt = require("bcrypt");

exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT *  FROM User WHERE Username = ?";
    db.get(sql, [username], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve(false);
      else {
        bcrypt.compare(password, row.Password).then((result) => {
          if (result)
            // password matches
            resolve({
              id: row.Id,
              name: row.Name,
              username: row.Username,
              generalAdmin: row.General_Admin,
              groupAdmin: row.Group_Admin,
            });
          else resolve(false);
        });
      }
    });
  });
};
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user WHERE Id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve({ error: "User not found." });
      else {
        // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
        const user = {
          id: row.Id,
          username: row.Username,
          name: row.Name,
          generalAdmin: row.General_Admin,
          groupAdmin: row.Group_Admin,
        };
        resolve(user);
      }
    });
  });
};
