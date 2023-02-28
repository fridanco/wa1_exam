"use strict";
const db = require("./db");

exports.getStudyGroups = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM StudyGroup";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      let studygroups = rows.map((e) => ({
        exam: e.Exam,
        name: e.Name,
        credits: e.Credits,
        color: e.Color,
      }));
      resolve(studygroups);
    });
  });
};
exports.postNewStudyGroup = (name, code, credits, color) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO StudyGroup(Exam,Name,Credits,Color) VALUES (?,?,?,?)";
    db.run(sql, [code, name, credits, color], (err) => {
      if (err) {
        console.log(err);
        reject(err.message);
        return;
      }
      resolve();
    });
  });
};
exports.postAskStudy = (id, exam) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO PendingAskStudyGroup(Exam,Id) VALUES (?,?)";
    db.run(sql, [exam, id], (err) => {
      if (err) {
        console.log(err);
        reject(err.message);
        return;
      }
      resolve();
    });
  });
};
exports.putPromoveGroupAdmin = (id, exam) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE User SET Group_Admin =? WHERE id=?";
    db.run(sql, [1, id], (err) => {
      if (err) {
        console.log(err);
        reject(err.message);
        return;
      }
      resolve();
    });
  });
};
exports.postGroupAdmin = (id, exam) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO GroupAdministrator_Exam(User_Id,Exam) VALUES (?,?)";
    db.run(sql, [id, exam], (err) => {
      if (err) {
        reject(err.message);
        return;
      }
      resolve();
    });
  });
};
exports.postResultAskStudy = (id, exam) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO StudyGroup_User(Exam,User_id) VALUES (?,?)";
    db.run(sql, [exam, id], (err) => {
      if (err) {
        reject(err.message);
        return;
      }
      resolve();
    });
  });
};
exports.deletePendingAsk = (id, exam) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM PendingAskStudyGroup WHERE Id=? AND Exam=?";
    db.run(sql, [id, exam], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve();
    });
  });
};
exports.deleteStudentFromAList = (id, exam) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM StudyGroup_User WHERE User_id=? AND Exam=?";
    db.run(sql, [id, exam], (err) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      } else resolve();
    });
  });
};

exports.postMeeting = (params) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Meetings(Exam,Date,Time,Duration,Location) VALUES (?,?,?,?,?)";
    db.run(
      sql,
      [params.exam, params.date, params.time, params.duration, params.location],
      (err) => {
        if (err) {
          reject(err.message);
          return;
        }

        resolve();
      }
    );
  });
};
exports.postMeetingUser = (id, mid, exam) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Meetings_User(User_Id,Meetings_Id,Exam) VALUES (?,?,?)";
    db.run(sql, [id, mid, exam], (err) => {
      if (err) {
        console.log(err);
        reject(err.message);
        return;
      }
      resolve();
    });
  });
};

exports.getStudyGroupJoinedByStudent = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT Exam FROM StudyGroup_User WHERE User_id=?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      let examsJoinedbByUser = rows.map((e) => ({
        exam: e.Exam,
      }));

      resolve(examsJoinedbByUser);
    });
  });
};
exports.getListSGgrouped = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT Exam FROM GroupAdministrator_Exam WHERE User_Id=?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      let examsAdministrated = rows.map((e) => ({
        exam: e.Exam,
      }));

      resolve(examsAdministrated);
    });
  });
};
exports.getMeetingListByStudentSGJoined = (id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT StudyGroup.Exam,Date,Time,Duration,Location,Name,Meetings.Meetings_Id,Color FROM StudyGroup_User, Meetings, StudyGroup WHERE StudyGroup_User.User_Id=? AND Meetings.Exam=StudyGroup.Exam AND StudyGroup_User.Exam=StudyGroup.Exam";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      let meetingsSGJoinedbByUser = rows.map((e) => ({
        id: e.Meetings_Id,
        exam: e.Exam,
        date: e.Date,
        time: e.Time,
        duration: e.Duration,
        location: e.Location,
        name: e.Name,
        color: e.Color,
      }));

      resolve(meetingsSGJoinedbByUser);
    });
  });
};
exports.getMeetingListByStudent = (id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT StudyGroup.Exam,Date,Time,Duration,Location,Name,Meetings.Meetings_Id,Color FROM Meetings_User, Meetings, StudyGroup WHERE Meetings_User.User_Id=? AND Meetings_User.Meetings_Id==Meetings.Meetings_Id AND Meetings.Exam=StudyGroup.Exam";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      let meetingsJoinedbByUser = rows.map((e) => ({
        id: e.Meetings_Id,
        exam: e.Exam,
        date: e.Date,
        time: e.Time,
        duration: e.Duration,
        location: e.Location,
        name: e.Name,
        color: e.Color,
      }));

      resolve(meetingsJoinedbByUser);
    });
  });
};
exports.getMeetingList = (exam) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Meetings WHERE Exam = ?  ";
    db.all(sql, [exam], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      let listMeetings = rows.map((e) => ({
        id: e.Meetings_Id,
        exam: e.Exam,
        date: e.Date,
        time: e.Time,
        duration: e.Duration,
        location: e.Location,
      }));

      resolve(listMeetings);
    });
  });
};

exports.getStudyGroupManagedByUser = (id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM GroupAdministrator_Exam, StudyGroup WHERE StudyGroup.Exam = GroupAdministrator_Exam.Exam AND User_id=? ";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const examsManagedbByUser = rows.map((e) => ({
        exam: e.Exam,
        id: e.User_Id,
        name: e.Name,
        credits: e.Credits,
        color: e.Color,
      }));

      resolve(examsManagedbByUser);
    });
  });
};
exports.getStudentJoined = (exam) => {
  return new Promise((resolve, reject) => {
    const sql =
      "Select * FROM User,StudyGroup_User WHERE StudyGroup_User.User_id==User.Id AND StudyGroup_User.Exam=? ";
    db.all(sql, [exam], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      const listofstudent = rows.map((e) => ({
        id: e.Id,
        name: e.Name,
        username: e.Username,
      }));
      resolve(listofstudent);
    });
  });
};
exports.getStudentAdmin = (exam) => {
  return new Promise((resolve, reject) => {
    const sql =
      "Select * FROM User,StudyGroup_User,GroupAdministrator_Exam WHERE StudyGroup_User.User_id==User.Id AND StudyGroup_User.Exam=? AND User.Id= GroupAdministrator_Exam.User_Id AND GroupAdministrator_Exam.Exam=StudyGroup_User.Exam";
    db.all(sql, [exam], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      const listofadmin = rows.map((e) => ({
        id: e.Id,
        name: e.Name,
        username: e.Username,
      }));
      resolve(listofadmin);
    });
  });
};
exports.getPendingJoin = (exam) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM PendingAskStudyGroup,User WHERE PendingAskStudyGroup.Id = User.Id AND PendingAskStudyGroup.Exam=?";
    db.all(sql, [exam], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      const listofasking = rows.map((e) => ({
        id: e.Id,
        name: e.Name,
        username: e.Username,
      }));
      resolve(listofasking);
    });
  });
};
exports.deleteMeetingfromaStudent = (id, mid) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Meetings_User WHERE User_Id=? AND Meetings_Id=?";
    db.run(sql, [id, mid], (err) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      } else resolve();
    });
  });
};
exports.deleteMeetings = (exam) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Meetings WHERE Exam=?";
    db.run(sql, [exam], (err) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      } else resolve();
    });
  });
};
exports.deleteUserMeetings = (exam) => {
  return new Promise((resolve, reject) => {
    const sql2 = " DELETE FROM Meetings_User Where Exam=?";
    db.run(sql2, [exam], (err) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      } else resolve();
    });
  });
};
exports.deleteUser_Meeting = (id, exam) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Meetings_User WHERE User_Id=? AND Exam=?";
    db.run(sql, [id, exam], (err) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      } else resolve();
    });
  });
};
exports.deleteGroupAdmin = (id, exam) => {
  return new Promise((resolve, reject) => {
    const sql =
      "DELETE FROM GroupAdministrator_Exam WHERE User_Id=? AND Exam=?";
    db.run(sql, [id, exam], (err) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      } else resolve();
    });
  });
};
exports.putGroupAdmin0 = (id, exam) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE User SET Group_Admin =? WHERE id=?";
    db.run(sql, [0, id], (err) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve();
    });
  });
};
exports.deleteStudyGroup = (exam) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM StudyGroup Where Exam = ?";
    db.run(sql, [exam], (err) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve();
    });
  });
};
exports.deleteStudyGroupAdmin = (exam) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM GroupAdministrator_Exam Where Exam = ?";
    db.run(sql, [exam], (err) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve();
    });
  });
};
exports.deleteStudyGroupUsers = (exam) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM StudyGroup_User Where Exam = ?";
    db.run(sql, [exam], (err) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve();
    });
  });
};
