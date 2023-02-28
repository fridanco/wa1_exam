/**
 * All the API calls
 */
import axios from "axios";
const BASEURL = "/api";

async function logIn(credentials) {
  let response = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

async function getStudyGroup() {
  return await axios.get(BASEURL + "/studygroup").then((response) => {
    return response.data;
  });
}
async function getSGmanaged(id) {
  return await axios
    .get(BASEURL + `/studygroup/admin/managed/${id}`)
    .then((response) => {
      return response.data;
    });
}
async function getStudyGroupJoinedByStudent(id) {
  return await axios.get(BASEURL + `/studygroup/${id}`).then((response) => {
    return response.data;
  });
}
async function putPromoveGroupAdmin(id, exam) {
  const idExamObject = { id: id, exam: exam };
  return await axios
    .put(BASEURL + "/studygroup/promoveAdmin", idExamObject)
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function putRemoveGroupAdmin(id, exam) {
  const idExamObject = { id: id, exam: exam };
  return await axios
    .put(BASEURL + "/groupadmin0", idExamObject)
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function postPromoveGroupAdmin(id, exam) {
  const idExamObject = { id: id, exam: exam };
  return await axios
    .post(BASEURL + "/studygroup/promoveAdmin", idExamObject)
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function postNewStudyGroup(name, code, credits, color) {
  const idStudyGroup = {
    name: name,
    code: code,
    credits: credits,
    color: color,
  };

  return await axios
    .post(BASEURL + "/studygroup/new", idStudyGroup)
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function postAcceptStudent(id, exam) {
  const idExamObject = { id: id, exam: exam };
  return await axios
    .post(BASEURL + "/studygroup/resultask", idExamObject)
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function postMeetingUser(id, mid, exam) {
  const idExamObject = { id: id, mid: mid, exam: exam };
  return await axios
    .post(BASEURL + "/meeting/join", idExamObject)
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function postStudentAskToJoin(id, exam) {
  const idExamObject = { id: id, exam: exam };
  return await axios
    .post(BASEURL + "/studygroup/ask", idExamObject)
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function postNewMeeting(
  dateNextMeet,
  timeNextMeet,
  duration,
  location,
  exam
) {
  return await axios
    .post(BASEURL + "/exam/meeting", {
      params: {
        dateNextMeet,
        timeNextMeet,
        duration,
        location,
        exam,
      },
    })
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function getListofStudent(exam) {
  return await axios
    .get(BASEURL + `/studygroup/ls/${exam}`)
    .then((response) => {
      return response.data;
    });
}
async function getListofAdmin(exam) {
  return await axios
    .get(BASEURL + `/studygroup/admin/${exam}`)
    .then((response) => {
      return response.data;
    });
}
async function getMeetingListStudyGroup(exam) {
  console.log(exam);
  return await axios
    .get(BASEURL + `/meetinglist/exam/${exam}`)
    .then((response) => {
      return response.data;
    });
}
async function getMeetingListJoined(id) {
  return await axios
    .get(BASEURL + `/meetinglistjoined/id/${id}`)
    .then((response) => {
      return response.data;
    });
}
async function getMeetingListByStudent(id) {
  return await axios.get(BASEURL + `/meetinglist/id/${id}`).then((response) => {
    return response.data;
  });
}

async function getListrequest(exam) {
  return await axios.get(BASEURL + `/asktojoin/${exam}`).then((response) => {
    return response.data;
  });
}
async function getStudyGroupManagedByUser(id) {
  return await axios
    .get(BASEURL + `/studygroup/managed/${id}`)
    .then((response) => {
      console.log(response.data);
      return response.data;
    });
}

async function logOut() {
  await fetch("/api/sessions/current", { method: "DELETE" });
}

async function getUserInfo() {
  const response = await fetch(BASEURL + "/sessions/current");
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo; // an object with the error coming from the server
  }
}
async function removePendingAsk(id, exam) {
  return await axios
    .delete(BASEURL + "/pendingask", {
      data: {
        id: id,
        exam: exam,
      },
    })
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function deleteStudyGroup(exam) {
  return await axios
    .delete(BASEURL + "/studygroup", {
      data: {
        exam: exam,
      },
    })
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function deleteStudyGroupAdmin(exam) {
  return await axios
    .delete(BASEURL + "/studygroup/admin", {
      data: {
        exam: exam,
      },
    })
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function deleteStudyGroupUser(exam) {
  return await axios
    .delete(BASEURL + "/studygroup/users", {
      data: {
        exam: exam,
      },
    })
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function removeStudentfromList(id, exam) {
  return await axios
    .delete(BASEURL + "/userlist", {
      data: {
        id: id,
        exam: exam,
      },
    })
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function deleteMeetings(exam) {
  return await axios
    .delete(BASEURL + "/meetings", {
      data: {
        exam: exam,
      },
    })
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function deleteMeetingsUser(exam) {
  return await axios
    .delete(BASEURL + "/meetingsUser", {
      data: {
        exam: exam,
      },
    })
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function deleteSignup(mid, id) {
  return await axios
    .delete(BASEURL + "/deletesignupmeetlist", {
      data: {
        id: id,
        mid: mid,
      },
    })
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function removeGroupAdmin(id, exam) {
  return await axios
    .delete(BASEURL + "/groupadmin", {
      data: {
        id: id,
        exam: exam,
      },
    })
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function removeUser_MeetingLeaveSg(id, exam) {
  return await axios
    .delete(BASEURL + "/meetlist", {
      data: {
        id: id,
        exam: exam,
      },
    })
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
}
const API = {
  logIn,
  logOut,
  getUserInfo,
  getStudyGroup,
  getStudyGroupJoinedByStudent,
  postStudentAskToJoin,
  getStudyGroupManagedByUser,
  getListofStudent,
  postNewMeeting,
  getListrequest,
  postAcceptStudent,
  removePendingAsk,
  removeStudentfromList,
  getMeetingListStudyGroup,
  postMeetingUser,
  getMeetingListByStudent,
  deleteSignup,
  putPromoveGroupAdmin,
  postPromoveGroupAdmin,
  getSGmanaged,
  removeGroupAdmin,
  putRemoveGroupAdmin,
  getListofAdmin,
  postNewStudyGroup,
  deleteStudyGroup,
  deleteStudyGroupAdmin,
  deleteStudyGroupUser,
  getMeetingListJoined,
  deleteMeetings,
  deleteMeetingsUser,
  removeUser_MeetingLeaveSg,
};
export default API;
