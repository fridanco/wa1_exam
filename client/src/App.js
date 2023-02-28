import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Navbar,
  Row,
  Col,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import API from "./API";
import "./App.css";
import StudentDashboard from "./StudentDashboard";
import StudyGroupsComp from "./StudyGroupsComp";
import { LoginForm, LogoutButton } from "./LoginComponent";
import { BrowserRouter as Router, Route } from "react-router-dom";
import GroupAdmin from "./GroupAdmin";
import MyVerticallyCenteredModal from "./MyVerticallyCentredModal";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
dayjs.extend(isToday);

function App() {
  const [message, setMessage] = useState("");
  const [generalAdmin, setGeneralAdmin] = useState(false);
  const [groupAdmin, setGroupAdmin] = useState(false);
  const [isStudent, setIStudent] = useState(false);
  const [isLogged, setLoggedIn] = useState(false);
  const [student, setStudent] = useState({});
  const [joined, setJoined] = useState([]); //only the studygroup already joined by a user logged
  const [studyGroups, setStudyGroups] = useState([]); //all the studygroups available
  const [studyGroup, setStudyGroup] = useState({});
  const [update, setUpdate] = useState(false);
  const [examsManagedByUser, setExamsManagedByUser] = useState([]);
  const [meetingListbyStudent, setMeetingListByStudent] = useState([]);
  const [meetingListSGjoined, setMeetingListSGjoined] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const getStudyGroupManagedByUser = async () => {
      await API.getStudyGroupManagedByUser(student.id)
        .then((res) => {
          console.log(res);
          setExamsManagedByUser(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    if (student.id !== undefined && student.id > 0)
      getStudyGroupManagedByUser();
  }, [groupAdmin]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        // TODO: store them somewhere and use them, if needed
        const user = await API.getUserInfo();
        setStudent(user);
        if (user.generalAdmin === 1) {
          setGeneralAdmin(true);
          setGroupAdmin(true);
        } else if (user.groupAdmin === 1) setGroupAdmin(true);
        else setIStudent(true);
        setLoggedIn(true);
      } catch (err) {
        console.error(err.error);
      }
    };
    const studyGroupslist = async () => {
      await API.getStudyGroup()
        .then((res) => {
          setStudyGroups(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    checkAuth();
    studyGroupslist();
  }, [update]);

  useEffect(() => {
    //studygroup joined by a specific student
    const studyGroupJoinedbyStudent = async () => {
      await API.getStudyGroupJoinedByStudent(student.id)
        .then((res) => {
          setJoined(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    if (student.id > 0) {
      studyGroupJoinedbyStudent();
    }
  }, [student]);

  useEffect(() => {
    const getMeetingListofJoinedSG = async () => {
      await API.getMeetingListJoined(student.id)
        .then((res) => {
          console.log(res);
          setMeetingListSGjoined(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (student.id > 0) {
      getMeetingListofJoinedSG();
    }
  }, [student, update]);

  useEffect(() => {
    const getMeetingList = async () => {
      await API.getMeetingListByStudent(student.id)
        .then((res) => {
          console.log(res);
          setMeetingListByStudent(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (student.id > 0) {
      getMeetingList();
    }
  }, [student, update]);

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setStudent(user);
      if (user.generalAdmin === 1) {
        setGeneralAdmin(true);
        setGroupAdmin(true);
      } else if (user.groupAdmin === 1) setGroupAdmin(true);
      else setIStudent(true);
      setLoggedIn(true);
    } catch (err) {
      setMessage({ msg: err, type: "danger" });
    }
  };

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setStudent("");
    setGroupAdmin(false);
    setJoined([]);
    setGeneralAdmin(false);
  };
  function handleUpdate() {
    setUpdate(!update);
  }
  function changeModalShow() {
    setModalShow(true);
  }

  function LoginLogic(props) {
    return (
      <>
        <Row className="justify-content-center">
          <Col lg={8}>
            <h1 style={{ paddingTop: "30px" }}> Sign in to StudyGroup</h1>
            <LoginForm login={props.login}></LoginForm>
          </Col>
        </Row>
      </>
    );
  }

  return (
    <Router>
      <Route exact path="/">
        <Navbar bg="dark" variant="dark">
          <Container fluid>
            <Navbar.Brand>StudyGroup</Navbar.Brand>
            {isLogged ? <LogoutButton logout={doLogOut} /> : <></>}
          </Container>
        </Navbar>
        <Container fluid>
          {isLogged ? (
            <>
              <h1>Welcome, {student.username}</h1>
              <StudentDashboard
                update={update}
                handleUpdate={handleUpdate}
                iam={student}
                pstudyGroups={studyGroups}
                joined={joined}
                meetingListSGjoined={meetingListSGjoined}
                meetingListbyStudent={meetingListbyStudent}
                groupAdmin={groupAdmin}
                examsManagedByUser={examsManagedByUser}
                generalAdmin={student.generalAdmin}
                changeModal={changeModalShow}
              />
            </>
          ) : (
            <LoginLogic login={doLogIn} />
          )}
          <MyVerticallyCenteredModal
            iam={student}
            examsManagedByUser={examsManagedByUser}
            handleupdate={handleUpdate}
            studygroup={studyGroups}
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
        </Container>
      </Route>
      <Route exact path="/studygroups/:exam">
        <StudyGroupsComp
          generalAdmin={generalAdmin}
          update={update}
          handleUpdate={handleUpdate}
          iam={student}
          sg={studyGroups}
          isLogged={isLogged}
          doLogOut={doLogOut}
          joined={joined}
          examsManagedByUser={examsManagedByUser}
          meetingListbyStudent={meetingListbyStudent}
        />
      </Route>
    </Router>
  );
}

export default App;
