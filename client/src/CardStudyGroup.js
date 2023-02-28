import { Button, Col, Card, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from "./API";
import "./studentDashboard.css";

function CardStudyGroup(props) {
  let studyGroupJoinedbyStudent = Array(props.len).map((_) => false);
  let studyGroupManagedbyStudent = Array(props.len).map((_) => false);
  //for (let i = 0; i < props.len; i++) studyGroupJoinedbyStudent.push(false);

  function checkJoinedStudyGroup(studygroupjoined, pstudyGroup, index) {
    studygroupjoined.forEach((element) => {
      if (element.exam === pstudyGroup) studyGroupJoinedbyStudent[index] = true;
    });
  }
  function checkManagedStudyGroup(studygroupmanaged, pstudyGroup, index) {
    studygroupmanaged.forEach((element) => {
      if (element.exam === pstudyGroup)
        studyGroupManagedbyStudent[index] = true;
    });
  }
  return (
    <Col key={props.index} className="py-md">
      {checkJoinedStudyGroup(
        props.joined,
        props.pstudygroups.exam,
        props.index
      )}
      {checkManagedStudyGroup(
        props.managed,
        props.pstudygroups.exam,
        props.index
      )}
      <Card
        className="MuiCard-root"
        style={{
          borderColor: `${props.pstudygroups.color}`,
        }}
      >
        <Card.Body>
          {studyGroupManagedbyStudent[props.index] ? (
            <Card.Text
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: props.pstudygroups.color,
                textAlign: "center",
              }}
            >
              You are an Admin
            </Card.Text>
          ) : (
            <></>
          )}
          <Card.Title>{props.pstudygroups.name}</Card.Title>
          <Card.Text>Exam Code: {props.pstudygroups.exam}</Card.Text>
          <Card.Text>Exam Credits: {props.pstudygroups.credits}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <Row className="justify-content-md-center">
            {studyGroupJoinedbyStudent[props.index] ? (
              <></>
            ) : (
              <Button
                variant="outline-light"
                style={{ backgroundColor: props.pstudygroups.color }}
                onClick={async () => {
                  props.handleShow();
                  await API.postStudentAskToJoin(
                    props.iam.id,
                    props.pstudygroups.exam
                  );
                }}
              >
                Ask to join
              </Button>
            )}
            <Link
              variant="outline-light"
              style={{
                backgroundColor: props.pstudygroups.color,
                color: "white",
                hoverColor: "black",
                fontSize: "17px",
                padding: "6px",
                borderRadius: "2px",
              }}
              to={`/studygroups/${props.pstudygroups.exam}`}
            >
              Open
            </Link>
            {props.generalAdmin ? (
              <Button
                variant="outline-light"
                style={{ backgroundColor: props.pstudygroups.color }}
                onClick={async () => {
                  await API.deleteStudyGroup(props.pstudygroups.exam);
                  await API.deleteStudyGroupAdmin(props.pstudygroups.exam);
                  await API.deleteStudyGroupUser(props.pstudygroups.exam);
                  await API.deleteMeetings(props.pstudygroups.exam);
                  await API.deleteMeetingsUser(props.pstudygroups.exam);
                  props.handleUpdate();
                }}
              >
                Remove
              </Button>
            ) : (
              <></>
            )}
          </Row>
        </Card.Footer>
      </Card>
    </Col>
  );
}

export default CardStudyGroup;
