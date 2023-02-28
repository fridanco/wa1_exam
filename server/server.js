"use strict";

const express = require("express");
const session = require("express-session"); // session middleware
const { check, validationResult } = require("express-validator"); // validation middleware
const morgan = require("morgan"); // logging middleware

const userDao = require("./user-dao");
const studyDao = require("./studygroup-dao");

const passport = require("passport");
const passportLocal = require("passport-local");

passport.use(
  new passportLocal.Strategy((username, password, done) => {
    // verification callback for authentication
    userDao
      .getUser(username, password)
      .then((user) => {
        if (user) done(null, user);
        else done(null, false, { message: "Username or password wrong" });
      })
      .catch((err) => {
        done(err);
      });
  })
);

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao
    .getUserById(id)
    .then((user) => {
      done(null, user); // this will be available in req.user
    })
    .catch((err) => {
      done(err, null);
    });
});

// init express
const app = new express();
const port = 3001;

app.use(morgan("dev"));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "not authenticated" });
};

// initialize and configure HTTP sessions
app.use(
  session({
    secret: "this and that and other",
    resave: false,
    saveUninitialized: false,
  })
);

// tell passport to use session cookies
app.use(passport.initialize());
app.use(passport.session());

//USER API//
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);
      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()

      return res.json(req.user);
    });
  })(req, res, next);
});

app.delete("/api/sessions/current", isLoggedIn, (req, res) => {
  //  res.header("Access-Control-Allow-Origin", "");
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get("/api/sessions/current", isLoggedIn, (req, res) => {
  //  res.header("Access-Control-Allow-Origin", "");
  res.status(200).json(req.user);
});
//              StudyGroup API

app.get("/api/studygroup", async (req, res) => {
  studyDao
    .getStudyGroups()
    .then((studygroup) => {
      res.status(200).json(studygroup);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

app.get("/api/studygroup/:id", async (req, res) => {
  studyDao
    .getStudyGroupJoinedByStudent(req.params.id)
    .then((examsJoinedbByUser) => {
      res.status(200).json(examsJoinedbByUser);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
app.get("/api/meetinglistjoined/id/:id", async (req, res) => {
  studyDao
    .getMeetingListByStudentSGJoined(req.params.id)
    .then((meetingsSGJoinedbByUser) => {
      res.status(200).json(meetingsSGJoinedbByUser);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
app.get("/api/meetinglist/id/:id", async (req, res) => {
  studyDao
    .getMeetingListByStudent(req.params.id)
    .then((meetingsJoinedbByUser) => {
      res.status(200).json(meetingsJoinedbByUser);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

app.get("/api/meetinglist/exam/:exam", async (req, res) => {
  studyDao
    .getMeetingList(req.params.exam)
    .then((meetingList) => {
      res.status(200).json(meetingList);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});
app.put("/api/groupadmin0", async (req, res) => {
  studyDao
    .putGroupAdmin0(req.body.id, req.body.exam)
    .then(() => {
      res.status(200).json();
      return res;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});
app.post("/api/studygroup/resultask", async (req, res) => {
  studyDao
    .postResultAskStudy(req.body.id, req.body.exam)
    .then(() => {
      res.status(200).json();
      return res;
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json(error);
    });
});
app.put("/api/studygroup/promoveAdmin", async (req, res) => {
  studyDao
    .putPromoveGroupAdmin(req.body.id, req.body.exam)
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});
app.post("/api/studygroup/promoveAdmin", async (req, res) => {
  studyDao
    .postGroupAdmin(req.body.id, req.body.exam)
    .then(() => {
      res.status(200).json();
      return res;
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json(error);
    });
});
app.post("/api/studygroup/ask", async (req, res) => {
  studyDao
    .postAskStudy(req.body.id, req.body.exam)
    .then(() => {
      res.status(200).json();
      return res;
    })
    .catch(function (error) {
      res.status(500).json(error);
      console.log(error);
    });
});
app.post("/api/exam/meeting", async (req, res) => {
  let parametri = {
    date: req.body.params.dateNextMeet,
    time: req.body.params.timeNextMeet,
    duration: req.body.params.duration,
    location: req.body.params.location,
    exam: req.body.params.exam,
  };
  studyDao
    .postMeeting(parametri)
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      res.status(500).json(error);
      console.log(error);
    });
});
app.post("/api/studygroup/new", async (req, res) => {
  studyDao
    .postNewStudyGroup(
      req.body.name,
      req.body.code,
      req.body.credits,
      req.body.color
    )
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      res.status(500).json(error);
      console.log(error);
    });
});
app.post("/api/meeting/join", async (req, res) => {
  studyDao
    .postMeetingUser(req.body.id, req.body.mid, req.body.exam)
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      res.status(500).json(error);
      console.log(error);
    });
});

//Get all the managed course by the user
app.get("/api/studygroup/managed/:id", async (req, res) => {
  studyDao
    .getStudyGroupManagedByUser(req.params.id)
    .then((examsManagedbByUser) => {
      res.status(200).json(examsManagedbByUser);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
//Get the list of the students that join in the sg

app.get("/api/studygroup/ls/:exam", async (req, res) => {
  studyDao
    .getStudentJoined(req.params.exam)
    .then((listofstudent) => {
      res.status(200).json(listofstudent);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});
app.get("/api/studygroup/admin/:exam", async (req, res) => {
  studyDao
    .getStudentAdmin(req.params.exam)
    .then((listofadmin) => {
      res.status(200).json(listofadmin);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

app.get("/api/asktojoin/:exam", async (req, res) => {
  studyDao
    .getPendingJoin(req.params.exam)
    .then((listofasking) => {
      res.status(200).json(listofasking);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});
app.delete("/api/meetings", async (req, res) => {
  studyDao
    .deleteMeetings(req.body.exam)
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
app.delete("/api/meetingsUser", async (req, res) => {
  studyDao
    .deleteUserMeetings(req.body.exam)
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
app.delete("/api/pendingask", async (req, res) => {
  studyDao
    .deletePendingAsk(req.body.id, req.body.exam)
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
app.delete("/api/userlist", async (req, res) => {
  studyDao
    .deleteStudentFromAList(req.body.id, req.body.exam)
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
app.delete("/api/meetlist", async (req, res) => {
  studyDao
    .deleteUser_Meeting(req.body.id, req.body.exam)
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
app.delete("/api/deletesignupmeetlist", async (req, res) => {
  studyDao
    .deleteMeetingfromaStudent(req.body.id, req.body.mid)
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
app.delete("/api/groupadmin", async (req, res) => {
  studyDao
    .deleteGroupAdmin(req.body.id, req.body.exam)
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
app.delete("/api/studygroup", async (req, res) => {
  studyDao
    .deleteStudyGroup(req.body.exam)
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
app.delete("/api/studygroup/admin", async (req, res) => {
  studyDao
    .deleteStudyGroupAdmin(req.body.exam)
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
app.delete("/api/studygroup/users", async (req, res) => {
  studyDao
    .deleteStudyGroupUsers(req.body.exam)
    .then(() => {
      res.status(200).json();
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
