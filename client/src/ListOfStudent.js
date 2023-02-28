import { useEffect, useState } from "react";
import API from "./API";
import { Button, Table, Col, Alert, Row } from "react-bootstrap";

function ListOfStudent(props) {
  const [ListStudent, setList] = useState([]);
  const [ListAdmin, setListAdmin] = useState([]);
  const [sgmanagedadd, setSgmanagedadd] = useState({});
  const [sgmanagedmin, setSgmanagedmin] = useState([]);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  let flag = true;
  useEffect(() => {
    const getListOfStudent = async () => {
      await API.getListofStudent(props.studygroup.exam)
        .then((res) => {
          setList(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getListOfStudent();
  }, [props.isGroupAdmin, props.update]);

  useEffect(() => {
    const getListOfAdmin = async () => {
      await API.getListofAdmin(props.studygroup.exam)
        .then((res) => {
          setListAdmin(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getListOfAdmin();
  }, [props.update, props.generalAdmin, props.groupAdmin]);
  useEffect(() => {
    const removeAdminCallback = async () => {
      if (sgmanagedmin.length == 1)
        await API.putRemoveGroupAdmin(
          sgmanagedmin[0].id,
          props.studygroup.exam
        );
      await API.removeGroupAdmin(sgmanagedmin[0].id, props.studygroup.exam);
      props.handleUpdate();
    };
    if (sgmanagedmin.length > 0) removeAdminCallback();
  }, [sgmanagedmin]);
  useEffect(() => {
    const promoveAdminCallback = async () => {
      await API.postPromoveGroupAdmin(sgmanagedadd.id, props.studygroup.exam);
      props.handleUpdate();
      if (sgmanagedadd.len == 0)
        await API.putPromoveGroupAdmin(sgmanagedadd.id, props.studygroup.exam);
    };
    if (sgmanagedadd.id > 0) promoveAdminCallback();
  }, [sgmanagedadd]);

  function validation(id) {
    ListAdmin.forEach((element) => {
      if (element.id === id) {
        flag = false;
      }
    });
    return flag;
  }

  const listsg = ListStudent.map((sg, index) => {
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{sg.name}</td>
        <td>{sg.username}</td>
        <td>
          <Button
            variant="outline-light"
            style={{ backgroundColor: props.studygroup.color }}
            onClick={async () => {
              if (validation(sg.id)) {
                await API.removeStudentfromList(sg.id, props.studygroup.exam);
                await API.removeUser_MeetingLeaveSg(
                  sg.id,
                  props.studygroup.exam
                );
                props.handleUpdate();
              } else {
                setShow(true);
              }
            }}
          >
            Remove
          </Button>
        </td>
        {props.generalAdmin ? (
          <>
            <td>
              <Button
                variant="outline-light"
                style={{ backgroundColor: props.studygroup.color }}
                onClick={async () => {
                  if (validation(sg.id)) {
                    await API.getStudyGroupManagedByUser(sg.id)
                      .then((res) => {
                        setSgmanagedadd({ len: res.length, id: sg.id });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  } else {
                    setShow2(true);
                  }
                }}
              >
                Promove
              </Button>
            </td>
          </>
        ) : (
          <></>
        )}
      </tr>
    );
  });

  const listadmin = ListAdmin.map((sg, index) => {
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{sg.name}</td>
        <td>{sg.username}</td>
        {props.generalAdmin ? (
          <>
            <td>
              <Button
                variant="outline-light"
                style={{ backgroundColor: props.studygroup.color }}
                onClick={async () => {
                  await API.getStudyGroupManagedByUser(sg.id)
                    .then((res) => {
                      setSgmanagedmin(res);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                Remove
              </Button>
            </td>
          </>
        ) : (
          <></>
        )}
      </tr>
    );
  });
  return (
    <>
      <Col>
        <h3>List of students</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th> Name</th>
              <th>Username</th>
              <th>Remove student</th>
              {props.generalAdmin ? (
                <>
                  <th>Promove Admin</th>
                </>
              ) : (
                <></>
              )}
            </tr>
          </thead>
          <tbody>{listsg}</tbody>
        </Table>
      </Col>
      {props.generalAdmin ? (
        <Col>
          <h3>List of Admin</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th> Name</th>
                <th>Username</th>
                {props.generalAdmin ? <th>Remove Admin</th> : <></>}
              </tr>
            </thead>
            <tbody>{listadmin}</tbody>
          </Table>
        </Col>
      ) : (
        <></>
      )}

      <Alert variant="danger" show={show}>
        <h3>You can not delete an Admin</h3>
        <Col className="class-col">
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
        </Col>
      </Alert>
      <Alert variant="success" show={show2}>
        <h3>The student is already an Admin</h3>
        <Col className="class-col">
          <Button
            size="lg"
            className="mr-3"
            variant="dark"
            onClick={async () => {
              setShow2(false);
            }}
          >
            Ok
          </Button>
        </Col>
      </Alert>
    </>
  );
}
export default ListOfStudent;
