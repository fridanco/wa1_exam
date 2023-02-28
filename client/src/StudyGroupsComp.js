import { Container, Navbar, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./studentDashboard.css";
import API from "./API";
import { LogoutButton } from "./LoginComponent";
import ListOfStudent from "./ListOfStudent";
import MeetingsPicker from "./MeetingsPicker";
import GetRequestJoinStudent from "./GetRequestJoinStudent";
import MeetingListStudyGroup from "./MeetingListStudyGroup";

function StudyGroupsComp(props) {
  const { exam } = useParams();
  const [isGroupAdmin, setIsgroupadmin] = useState(false);
  const [meetingList, setMeetingList] = useState([]);
  const [isJoined, setIsjoined] = useState(false);

  let studygroupselected = {};
  props.sg.forEach((element) => {
    if (exam === element.exam) studygroupselected = element;
  });

  useEffect(() => {
    const checkAdmin = () => {
      props.examsManagedByUser.forEach((element) => {
        if (exam === element.exam) setIsgroupadmin(true);
      });
    };
    checkAdmin();
  });
  useEffect(() => {
    const checkAdmin = () => {
      props.joined.forEach((element) => {
        if (exam === element.exam) setIsjoined(true);
      });
    };
    checkAdmin();
  });
  useEffect(() => {
    const getMeetingList = async () => {
      await API.getMeetingListStudyGroup(exam)
        .then((res) => {
          setMeetingList(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getMeetingList();
  }, [props.studygroup, props.update]);

  return (
    <>
      <Navbar style={{ backgroundColor: studygroupselected.color }}>
        <Container fluid>
          <Navbar.Brand href="/">StudyGroup</Navbar.Brand>
          {props.isLogged ? <LogoutButton logout={props.doLogOut} /> : <></>}
        </Container>
      </Navbar>
      <Row>
        <Col>
          <h1>Studygroup: {studygroupselected.name}</h1>
          <p style={{ textAlign: "center", fontSize: "20px" }}>
            ExamCode: {studygroupselected.exam}
          </p>
          <p style={{ textAlign: "center", fontSize: "20px" }}>
            Credits: {studygroupselected.credits}
          </p>
        </Col>
      </Row>
      <Container>
        {isGroupAdmin || props.generalAdmin ? (
          <>
            {isGroupAdmin ? (
              <>
                <Row className="pb-5">
                  <Col xs={12} className="justify-content-md-center">
                    <h3>Define a new meeting</h3>
                    <MeetingsPicker
                      handleUpdate={props.handleUpdate}
                      studygroup={studygroupselected}
                      meetingList={meetingList}
                    />
                  </Col>
                </Row>
                <Col xs={12}>
                  <h3>Pending request</h3>
                  <GetRequestJoinStudent
                    handleUpdate={props.handleUpdate}
                    update={props.update}
                    studygroup={studygroupselected}
                  />
                </Col>
              </>
            ) : (
              <></>
            )}

            <ListOfStudent
              generalAdmin={props.generalAdmin}
              handleUpdate={props.handleUpdate}
              isGroupAdmin={isGroupAdmin}
              update={props.update}
              studygroup={studygroupselected}
            />
          </>
        ) : (
          <></>
        )}
      </Container>
      {isJoined || props.generalAdmin ? (
        <Container>
          <h3>List of meetings</h3>
          <MeetingListStudyGroup
            isGroupAdmin={isGroupAdmin}
            generalAdmin={props.generalAdmin}
            iam={props.iam}
            handleUpdate={props.handleUpdate}
            update={props.update}
            studygroup={studygroupselected}
            meetingList={meetingList}
            meetingListbyStudent={props.meetingListbyStudent}
          ></MeetingListStudyGroup>
        </Container>
      ) : (
        <>
          <h3>You are not a member of this study group</h3>
        </>
      )}
    </>
  );
}

export default StudyGroupsComp;
