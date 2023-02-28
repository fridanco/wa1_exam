import API from "./API";
import { Row, Col, Modal, Button, Form, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";

function MyVerticallyCenteredModal(props) {
  const [nameStudyGroup, setNameStudyGroup] = useState("");
  const [codeStudyGroup, setCodeStudyGroup] = useState("");
  const [credits, setCredits] = useState(0);
  const [color, setColor] = useState("#563d7c");
  const [show, setShow] = useState(false);

  function ValidationName() {
    if (nameStudyGroup === "") return false;
    props.studygroup.map((element) => {
      if (element.name == nameStudyGroup) return false;
    });
    return true;
  }
  function ValidationCode() {
    if (codeStudyGroup === "") return false;
    props.studygroup.map((element) => {
      if (element.code == codeStudyGroup) return false;
    });
    return true;
  }
  function ValidationCredits() {
    if (codeStudyGroup === "") return false;
    if (codeStudyGroup < 1) return false;
    return true;
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create a new StudyGroup
        </Modal.Title>
      </Modal.Header>
      <Alert className="mt-2 ml-2 mr-2" show={show} variant="danger">
        <Alert.Heading className="class-col"> You got an error!</Alert.Heading>
        <p className="class-col pt-3" style={{ fontWeight: "bold" }}>
          The form is incomplete or it has wrong data
        </p>

        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-dark">
            Close
          </Button>
        </div>
      </Alert>
      <Modal.Body>
        <Row className="justify-content-md-center">
          <Col xs={4}>
            <Form.Group>
              <Form.Label>StudyGroup Name</Form.Label>
              <Form.Control
                type="text"
                name="StudyGroup Name"
                value={nameStudyGroup}
                onChange={(ev) => {
                  setNameStudyGroup(ev.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col xs={4}>
            <Form.Group>
              <Form.Label>StudyGroup Code</Form.Label>
              <Form.Control
                type="text"
                name="Code"
                value={codeStudyGroup}
                onChange={(ev) => {
                  setCodeStudyGroup(ev.target.value);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xs={4}>
            <Form.Group>
              <Form.Label>Credits</Form.Label>
              <Form.Control
                type="number"
                name="Credits"
                value={credits}
                onChange={(ev) => {
                  setCredits(ev.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col xs={4}>
            <Form.Group>
              <Form.Label htmlFor="exampleColorInput">Color picker</Form.Label>
              <Form.Control
                type="color"
                id="exampleColorInput"
                title="Choose your color"
                value={color}
                onChange={(ev) => {
                  setColor(ev.target.value);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Button
              variant="dark"
              className="mt-3"
              onClick={async () => {
                if (
                  ValidationName() &&
                  ValidationCode() &&
                  ValidationCredits()
                ) {
                  await API.postNewStudyGroup(
                    nameStudyGroup,
                    codeStudyGroup,
                    credits,
                    color
                  );
                  await API.postPromoveGroupAdmin(props.iam.id, codeStudyGroup);
                  await API.postAcceptStudent(props.iam.id, codeStudyGroup);
                  props.handleupdate();
                  if (props.examsManagedByUser.length == 0)
                    await API.putPromoveGroupAdmin(
                      props.iam.id,
                      codeStudyGroup
                    );
                  props.onHide();
                } else setShow(true);
              }}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
export default MyVerticallyCenteredModal;
