import { Form, Button, Col, Row, Alert } from "react-bootstrap";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import API from "./API";
var isBetween = require("dayjs/plugin/isBetween");
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isBetween);

dayjs.extend(isSameOrAfter);

function MeetingsPicker(props) {
  const [nextMeetDate, setNextMeetDate] = useState("");
  const [nextMeetTime, setNextMeetTime] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [showsameday, setshowsameday] = useState(false);
  const [showempty, setshowempty] = useState(false);
  let meetingListSameDay = true;

  const handleNextMeetDate = (ev) => {
    setNextMeetDate(ev.target.value);
  };
  const handleNextMeetTime = (ev) => {
    setNextMeetTime(ev.target.value);
  };
  const handleDuration = (ev) => {
    setDuration(ev.target.value);
  };
  const handleLocation = (ev) => {
    setLocation(ev.target.value);
  };

  function validation() {
    props.meetingList.forEach((element) => {
      if (element.date == nextMeetDate) {
        let end = dayjs(element.time, "H:m").add(element.duration, "hour");
        let end2 = dayjs(nextMeetTime, "H:m").add(duration, "hour");
        if (
          dayjs(nextMeetTime, "H:m").isBetween(
            dayjs(element.time, "H:m"),
            dayjs(end)
          ) ||
          dayjs(end2).isBetween(dayjs(element.time, "H:m"), dayjs(end))
        ) {
          meetingListSameDay = false;
        }
      } else {
      }
    });
    if (!meetingListSameDay) setshowsameday(true);
    return meetingListSameDay;
  }
  function validation2() {
    if (
      duration == "" ||
      location == "" ||
      nextMeetTime == "" ||
      nextMeetDate == ""
    ) {
      setshowempty(true);
      return false;
    } else if (dayjs().isAfter(dayjs(nextMeetDate))) {
      setshowempty(true);
      return false;
    } else {
      return true;
    }
  }
  return (
    <>
      <Row className="justify-content-md-center">
        <Col xs={4}>
          <Form.Group controlId="form-meeting-date">
            <Form.Label>Next meeting date</Form.Label>
            <Form.Control
              type="date"
              name="Next meeting date"
              value={nextMeetDate}
              onChange={handleNextMeetDate}
            />
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Form.Group controlId="form-meeting-time">
            <Form.Label>Hour</Form.Label>
            <Form.Control
              type="time"
              name="Next meeting hour"
              value={nextMeetTime}
              onChange={handleNextMeetTime}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col xs={4}>
          <Form.Group controlId="form-meeting-date">
            <Form.Label>Duration (hour)</Form.Label>
            <Form.Control
              type="number"
              name="Duration"
              value={duration}
              onChange={handleDuration}
            />
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Form.Group controlId="form-meeting-time">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="Location"
              value={location}
              onChange={handleLocation}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <Button
            variant="outline-light"
            className="mt-3"
            style={{ backgroundColor: props.studygroup.color }}
            onClick={async () => {
              if (validation() && validation2()) {
                await API.postNewMeeting(
                  nextMeetDate,
                  nextMeetTime,
                  duration,
                  location,
                  props.studygroup.exam
                );
                props.handleUpdate();
              }
            }}
          >
            Submit
          </Button>
        </Col>
      </Row>
      <Alert variant="danger" show={showsameday} className="mt-3 ">
        <Col className="class-col mt-3">
          You are trying to set a new meeting the same day of another meeting of
          the same studygroup
          <Col>
            <Button
              variant="dark"
              onClick={() => {
                setshowsameday(false);
                props.handleUpdate();
              }}
            >
              Okay
            </Button>
          </Col>
        </Col>
      </Alert>
      <Alert variant="danger" show={showempty} className="mt-3 ">
        <Col className="class-col mt-3">
          Empty field or the date is wrong
          <Col>
            <Button
              variant="dark"
              onClick={() => {
                setshowempty(false);
                props.handleUpdate();
              }}
            >
              Okay
            </Button>
          </Col>
        </Col>
      </Alert>
    </>
  );
}
export default MeetingsPicker;
