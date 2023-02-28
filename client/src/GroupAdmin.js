import { Button, Col, Card, CardGroup, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "./API";
import CardStudyGroup from "./CardStudyGroup";
import "./studentDashboard.css";

function GroupAdmin(props) {
  const ExamsManagedCard = props.examsManagedByUser.map((sg, index) => (
    <CardStudyGroup
      key={index}
      index={index}
      pstudygroups={sg}
      iam={props.iam}
      joined={props.examsManagedByUser}
      len={props.examsManagedByUser.length}
    />
  ));

  return (
    <>
      <Row className="justify-content-md-center">
        <h2>You are admin of these studygroups</h2>
      </Row>
      <Row className="justify-content-md-center">
        <CardGroup className="pb-5 px-md-5">{ExamsManagedCard}</CardGroup>
      </Row>
    </>
  );
}

export default GroupAdmin;
