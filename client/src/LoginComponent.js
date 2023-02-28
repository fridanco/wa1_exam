import { Form, Button, Alert, Col, Nav, NavLink, Row } from "react-bootstrap";
import { useState } from "react";

function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");
    const credentials = { username, password };

    // VALIDATION
    let valid = true;
    let validPasswordEqual = true;
    if (username === "" || password === "" || password.length < 6)
      valid = false;
    if (username === password) validPasswordEqual = false;

    if (valid && validPasswordEqual) {
      props.login(credentials);
    } else {
      if (!valid)
        setErrorMessage(
          "The username or passoword cannot be empty and the password lenght can not be less 6"
        );
      if (!validPasswordEqual)
        setErrorMessage("the username can not be equal to the password");
    }
  };

  return (
    <Form>
      {errorMessage ? <Alert variant="danger">{errorMessage}</Alert> : ""}
      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="email"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
      </Form.Group>
      <Row className="justify-content-center">
        <Col className="class-col">
          <Button variant="secondary" className="mt-3 " onClick={handleSubmit}>
            Login
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

function LogoutButton(props) {
  return (
    <Col>
      <Nav.Link style={{ color: "white" }} onClick={props.logout}>
        Logout
      </Nav.Link>
    </Col>
  );
}
function LoginButton(props) {
  return (
    <Col>
      <NavLink variant="info" href="/login" onClick={props.login}>
        Login
      </NavLink>
    </Col>
  );
}

export { LoginButton, LoginForm, LogoutButton };
