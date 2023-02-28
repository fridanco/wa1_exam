import { useEffect, useState } from "react";
import API from "./API";
import { Button, Table, Alert, Col } from "react-bootstrap";
import dayjs, { isDayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
var isBetween = require("dayjs/plugin/isBetween");
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

function MeetingListStudyGroup(props) {
  const [meetingid, setMeetingid] = useState({});
  const [show, setShow] = useState(false);
  let meetingJoinedbyStudent = Array(props.meetingListbyStudent.length).map(
    (_) => false
  );
  let flag = false;

  function checkalreadyjoined(meetingShow, index) {
    props.meetingListbyStudent.forEach((meeting) => {
      if (meeting.id === meetingShow.id) {
        meetingJoinedbyStudent[index] = true;
      }
    });
  }

  async function handleJoin(joinMeet, studentId) {
    if (props.meetingListbyStudent.length === 0) {
      await API.postMeetingUser(studentId, joinMeet.id, joinMeet.exam);
      props.handleUpdate();
    } else {
      props.meetingListbyStudent.forEach(async (element) => {
        if (element.date == joinMeet.date) {
          let end = dayjs(element.time, "H:m").add(element.duration, "hour");
          let end2 = dayjs(joinMeet.time, "H:m").add(joinMeet.duration, "hour");
          if (
            dayjs(joinMeet.time, "H:m").isBetween(
              dayjs(element.time, "H:m"),
              dayjs(end)
            ) ||
            dayjs(end2).isBetween(dayjs(element.time, "H:m"), dayjs(end))
          ) {
            flag = true;
            setShow(true);
          }
        }
      });
      if (flag === false) {
        await API.postMeetingUser(studentId, joinMeet.id, joinMeet.exam);
        props.handleUpdate();
      }
    }
  }

  const listmeet = props.meetingList
    .filter((meet) => {
      if (props.generalAdmin == 0 && props.isGroupAdmin == 0) {
        let now = dayjs();
        let date = dayjs(meet.date);
        if (date.isSameOrAfter(now, "hour")) return true;
        else return false;
      } else return true;
    })
    .map((meet, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{meet.exam}</td>
          <td>{meet.date}</td>
          <td>{meet.time}</td>
          <td>{meet.duration}</td>
          <td>{meet.location}</td>
          <td>
            {checkalreadyjoined(meet, index)}
            {meetingJoinedbyStudent[index] ? (
              <p>Already joined</p>
            ) : (
              <>
                <Button
                  variant="outline-light"
                  style={{ backgroundColor: props.studygroup.color }}
                  onClick={async () => {
                    handleJoin(meet, props.iam.id);
                    setMeetingid({ mid: meet.id, exam: meet.exam });
                  }}
                >
                  Join
                </Button>
              </>
            )}
          </td>
        </tr>
      );
    });

  return (
    <>
      <Alert variant="warning" show={show}>
        <h3>
          Pay Attention: the booking you want to sign-up will overlap with
          another meeting. Continue?
        </h3>
        <Col className="class-col">
          <Button
            size="lg"
            className="mr-3"
            variant="dark"
            onClick={async () => {
              await API.postMeetingUser(
                props.iam.id,
                meetingid.mid,
                meetingid.exam
              );
              props.handleUpdate();
              setShow(false);
            }}
          >
            Yes
          </Button>
          <Button
            size="lg"
            variant="dark"
            onClick={() => {
              setShow(false);
              props.handleUpdate();
            }}
          >
            No
          </Button>
        </Col>
      </Alert>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Exam</th>
            <th>Date</th>
            <th>Time</th>
            <th>Duration</th>
            <th>Location</th>
            <th>Join</th>
          </tr>
        </thead>
        <tbody>{listmeet}</tbody>
      </Table>
    </>
  );
}

export default MeetingListStudyGroup;
