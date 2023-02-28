import { CardGroup, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { useState } from "react";
import "./studentDashboard.css";
import CardStudyGroup from "./CardStudyGroup";
import MeetingListByStudent from "./MeetingListByStudent";

function StudentDashboard(props) {
  const [update2, setUpdate2] = useState(false);
  const [show, setShow] = useState(false);

  function handleUpdate2() {
    setUpdate2(!update2);
  }
  function handleShow() {
    setShow(true);
  }

  const cardListS = props.pstudyGroups.map((pstudygroups, index) => (
    <CardStudyGroup
      handleShow={handleShow}
      pstudygroups={pstudygroups}
      key={index}
      index={index}
      iam={props.iam}
      handleUpdate={props.handleUpdate}
      joined={props.joined}
      len={props.pstudyGroups.length}
      managed={props.examsManagedByUser}
      generalAdmin={props.generalAdmin}
    />
  ));

  return (
    <>
      <h3 style={{ textAlign: "center" }}>
        As a student, you can see these study group:
      </h3>
      {props.generalAdmin ? <h3>You are a General Admin</h3> : <></>}

      <CardGroup className="pb-5 px-md-5">
        {cardListS}
        {props.generalAdmin ? (
          <Col className="py-md">
            <a
              style={{ cursor: "pointer" }}
              onClick={() => {
                props.changeModal();
              }}
            >
              <Card className="MuiCard-root" style={{ borderColor: "#000000" }}>
                {" "}
                <Card.Body style={{ backgroundColor: "#dcdcdc" }}>
                  <Card.Text
                    style={{
                      fontSize: "30px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    +{" "}
                  </Card.Text>{" "}
                  <Card.Text
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      left: "50%",
                      top: "65%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    Click here to create a new studygroup
                  </Card.Text>
                </Card.Body>
              </Card>
            </a>
          </Col>
        ) : (
          <></>
        )}
      </CardGroup>
      <Alert variant="success" show={show}>
        <Row className="class-col">
          <Col>
            <h3>Request is sent. Please, wait the response </h3>
            <Row className="class-col">
              <Button
                size="lg"
                className="mr-3"
                variant="dark"
                onClick={async () => {
                  setShow(false);
                }}
              >
                Ok
              </Button>
            </Row>
          </Col>
        </Row>
      </Alert>
      <Row>
        <Col sm={2}></Col>
        <Col sm={8}>
          <MeetingListByStudent
            handleUpdate2={handleUpdate2}
            handleUpdate={props.handleUpdate}
            meetingListSGjoined={props.meetingListSGjoined}
            meetingListbyStudent={props.meetingListbyStudent}
            iam={props.iam}
          />{" "}
        </Col>
      </Row>
    </>
  );
}

export default StudentDashboard;
