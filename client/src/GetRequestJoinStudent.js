import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import API from "./API";

function GetRequestJoinStudent(props) {
  let flag = false;
  const [listrequest, setListrequest] = useState([]);
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    const getListrequest = async () => {
      await API.getListrequest(props.studygroup.exam)
        .then((res) => {
          setListrequest(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getListrequest();
  }, [props.update]);

  const askinglist = listrequest.map((askreq, index) => {
    return (
      <>
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{askreq.name}</td>
          <td>{askreq.username}</td>
          <td>
            <Button
              variant="outline-light"
              style={{ backgroundColor: props.studygroup.color }}
              onClick={async () => {
                await API.postAcceptStudent(askreq.id, props.studygroup.exam);
                await API.removePendingAsk(askreq.id, props.studygroup.exam);
                props.handleUpdate();
              }}
            >
              Accept
            </Button>
          </td>
          <td>
            <Button
              variant="outline-light"
              style={{ backgroundColor: props.studygroup.color }}
              onClick={async () => {
                await API.removePendingAsk(askreq.id, props.studygroup.exam);
                props.handleUpdate();
              }}
            >
              Reject
            </Button>
          </td>
        </tr>
      </>
    );
  });

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Username</th>
            <th>Accept</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>{askinglist}</tbody>
      </Table>
    </>
  );
}
export default GetRequestJoinStudent;
