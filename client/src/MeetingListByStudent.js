import { useEffect, useState } from "react";
import API from "./API";
import { Button, Table } from "react-bootstrap";
import dayjs, { isDayjs } from "dayjs";
import { Link } from "react-router-dom";
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);
function MeetingListByStudent(props) {
  let meetingJoinedbyStudent = Array(props.meetingListSGjoined.len).map(
    (_) => false
  );
  function checkalreadyjoined(meetingShow, index) {
    props.meetingListbyStudent.forEach((meeting) => {
      if (meeting.id === meetingShow.id) {
        meetingJoinedbyStudent[index] = true;
      }
    });
  }

  const listmeeting = props.meetingListbyStudent.map((meeting, index) => {
    return (
      <tr
        key={index}
        style={{
          borderColor: meeting.color,
          backgroundColor: meeting.color,
        }}
      >
        <td>{index + 1}</td>
        <td>{meeting.name}</td>
        <td>{meeting.exam}</td>
        <td>{meeting.date}</td>
        <td>{meeting.time}</td>
        <td>{meeting.duration}</td>
        <td>{meeting.location}</td>
        <td>
          {" "}
          <Button
            variant="outline-dark"
            style={{ backgroundColor: meeting.color }}
            onClick={async () => {
              await API.deleteSignup(meeting.id, props.iam.id);
              props.handleUpdate();
            }}
          >
            Delete
          </Button>
        </td>
      </tr>
    );
  });
  const listmeetingSG = props.meetingListSGjoined
    .filter((meet) => {
      let now = dayjs();
      let date = dayjs(meet.date);
      if (date.isSameOrAfter(now, "hour")) return true;
      else return false;
    })
    .map((meeting, index) => {
      return (
        <tr
          key={index}
          style={{
            borderColor: meeting.color,
            backgroundColor: meeting.color,
          }}
        >
          <td>{index + 1}</td>
          <td>{meeting.name}</td>
          <td>{meeting.exam}</td>
          <td>{meeting.date}</td>
          <td>{meeting.time}</td>
          <td>{meeting.duration}</td>
          <td>{meeting.location}</td>
          {checkalreadyjoined(meeting, index)}
          <td>
            {" "}
            {meetingJoinedbyStudent[index] ? (
              <Button
                variant="outline-dark"
                style={{ backgroundColor: meeting.color }}
                onClick={async () => {
                  await API.deleteSignup(meeting.id, props.iam.id);
                  props.handleUpdate();
                }}
              >
                Delete
              </Button>
            ) : (
              <Link
                style={{
                  backgroundColor: meeting.color,
                  color: "black",
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
                to={`/studygroups/${meeting.exam}`}
              >
                Join
              </Link>
            )}
          </td>
        </tr>
      );
    });

  return (
    <>
      <h3 style={{ textAlign: "center" }}>
        Study group meetings to which you are registered{" "}
      </h3>
      {props.meetingListbyStudent.length > 0 ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Exam</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Location</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>{listmeeting}</tbody>
          </Table>
        </>
      ) : (
        <h4
          className="mt-3"
          style={{ textAlign: "center", fontStyle: "oblique" }}
        >
          You are not registered for any meeting{" "}
        </h4>
      )}

      <h3>Future meetings available for your study groups </h3>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Exam</th>
            <th>Date</th>
            <th>Time</th>
            <th>Duration</th>
            <th>Location</th>
            <th>Join or Delete</th>
          </tr>
        </thead>
        <tbody>{listmeetingSG}</tbody>
      </Table>
    </>
  );
}
export default MeetingListByStudent;
