import React from "react";
import PropTypes from "prop-types";
import { Formik, Form, Field } from "formik";
import {
  Container,
  Row,
  Col,
  Form as BootstrapForm,
  Button,
} from "react-bootstrap";

const VideoChatForm = ({ onSubmit }) => {
  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Row>
        <Col>
          <Formik
            initialValues={{
              name: "",
              privacy: "public",
              startAudioOff: false,
              startVideoOff: false,
              enableChat: false,
              expiration: "",
            }}
            onSubmit={(values) => {
              const {
                name,
                privacy,
                startAudioOff,
                startVideoOff,
                enableChat,
                expiration,
              } = values;
              const properties = {
                startAudioOff: startAudioOff,
                startVideoOff: startVideoOff,
                enableChat: enableChat,
                exp: expiration * 60,
              };
              const postData = {
                name,
                privacy: privacy === "public" ? 1 : 0,
                properties,
              };
              onSubmit(postData);
            }}
          >
            {({ values, handleChange }) => (
              <Form as={BootstrapForm}>
                <BootstrapForm.Group controlId="formRoomName">
                  <BootstrapForm.Label>Room Name:</BootstrapForm.Label>
                  <Field
                    type="text"
                    name="name"
                    // id="name"
                    className="form-control"
                    // onChange={handleChange}
                    // value={values.name}
                  />
                </BootstrapForm.Group>
                <BootstrapForm.Group controlId="formPrivacy">
                  <BootstrapForm.Label>Privacy:</BootstrapForm.Label>
                  <Field
                    component="select"
                    name="privacy"
                    // id="privacy"
                    className="form-control"
                    // onChange={handleChange}
                    // value={values.privacy}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </Field>
                </BootstrapForm.Group>
                <BootstrapForm.Group controlId="formStartAudioOff">
                  <BootstrapForm.Check
                    type="checkbox"
                    name="startAudioOff"
                    id="startAudioOff"
                    label="Start Audio Off"
                    onChange={handleChange}
                    checked={values.startAudioOff}
                  />
                </BootstrapForm.Group>
                <BootstrapForm.Group controlId="formStartVideoOff">
                  <BootstrapForm.Check
                    type="checkbox"
                    name="startVideoOff"
                    id="startVideoOff"
                    label="Start Video Off"
                    onChange={handleChange}
                    checked={values.startVideoOff}
                  />
                </BootstrapForm.Group>
                <BootstrapForm.Group controlId="formEnableChat">
                  <BootstrapForm.Check
                    type="checkbox"
                    name="enableChat"
                    id="enableChat"
                    label="Enable Chat"
                    onChange={handleChange}
                    checked={values.enableChat}
                  />
                </BootstrapForm.Group>
                <BootstrapForm.Group controlId="formExpiration">
                  <BootstrapForm.Label>
                    Expiration Time (minutes):
                  </BootstrapForm.Label>
                  <Field
                    type="number"
                    name="expiration"
                    // id="expiration"
                    className="form-control"
                    // onChange={handleChange}
                    // value={values.expiration}
                  />
                </BootstrapForm.Group>
                <Button variant="primary" type="submit">
                  Create Room
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

VideoChatForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default VideoChatForm;
