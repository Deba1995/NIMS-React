import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import Card from "../../../components/Card";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config/serverApiConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [selectedFirstName, setSelectedFirstName] = useState({
    firstName: "",
  });
  const [selectedLastName, setSelectedLastName] = useState({
    lastName: "",
  });
  const [selectedEmail, setSelectedEmail] = useState({
    email: "",
  });
  const [selectedPhone, setSelectedPhoneNo] = useState({
    phone: "",
  });
  const [selectedLicense, setSelectedLicenseCode] = useState({
    license: "",
  });
  const [selectedPassword, setSelectedPassword] = useState({
    password: "",
  });
  const [selectedConfirmPassword, setSelectedConfirmPassword] = useState({
    confirmpassword: "",
  });
  const handleError = (err) =>
    toast.error(err, {
      position: toast.POSITION.TOP_RIGHT,
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: toast.POSITION.TOP_RIGHT,
    });

  useEffect(() => {
    const profile = async () => {
      const response = await fetch(`${API_BASE_URL}admin/admin-get-profile`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setSelectedFirstName({ firstName: data.profile.firstName });
        setSelectedLastName({ lastName: data.profile.lastName });
        setSelectedEmail({ email: data.profile.email });
        setSelectedPhoneNo({ phone: data.profile.phone });
        setSelectedLicenseCode({ license: data.profile.license });
        handleSuccess(data.message);
      } else {
        handleError(data.success);
      }
    };
    profile();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE_URL}admin/admin-update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            firstName: selectedFirstName.firstName,
            lastName: selectedLastName.lastName,
            email: selectedEmail.email,
            phone: selectedPhone.phone,
            license: selectedLicense.license,
            password: selectedPassword.password,
            confirmpassword: selectedConfirmPassword.confirmpassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        handleSuccess(data.message);
        setTimeout(() => {
          navigate(`/dashboard/`);
        }, 2000);
      } else {
        Object.keys(data.errors).forEach((key) => {
          const messageErr = data.errors[key];
          if (messageErr) {
            handleError(messageErr);
          }
        });
      }
    } catch (error) {}
  }
  return (
    <>
      <div>
        <Row>
          <Col xl="15" lg="25">
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">Admin Profile</h4>
                </div>
                <ToastContainer position="top-right" autoClose={3000} />
              </Card.Header>
              <Card.Body>
                <div className="new-user-info">
                  <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="row">
                      <Form.Group className="col-md-6 form-group">
                        <Form.Label htmlFor="fname">First Name:</Form.Label>
                        <Form.Control
                          type="text"
                          id="fname"
                          placeholder="First Name"
                          value={selectedFirstName.firstName || ""}
                          onChange={(e) =>
                            setSelectedFirstName({ firstName: e.target.value })
                          }
                        />
                      </Form.Group>
                      <Form.Group className="col-md-6 form-group">
                        <Form.Label htmlFor="lname">Last Name:</Form.Label>
                        <Form.Control
                          type="text"
                          id="lname"
                          placeholder="Last Name"
                          value={selectedLastName.lastName || ""}
                          onChange={(e) =>
                            setSelectedLastName({ lastName: e.target.value })
                          }
                        />
                      </Form.Group>
                      <Form.Group className="col-md-6  form-group">
                        <Form.Label htmlFor="email">Email:</Form.Label>
                        <Form.Control
                          type="email"
                          id="email"
                          placeholder="Email"
                          value={selectedEmail.email || ""}
                          onChange={(e) =>
                            setSelectedEmail({ email: e.target.value })
                          }
                        />
                      </Form.Group>
                      <Form.Group className="col-md-6  form-group">
                        <Form.Label htmlFor="phno">Phone No:</Form.Label>
                        <Form.Control
                          type="text"
                          id="phno"
                          placeholder="Phone No"
                          value={selectedPhone.phone || ""}
                          onChange={(e) =>
                            setSelectedPhoneNo({ phone: e.target.value })
                          }
                        />
                      </Form.Group>
                      <Form.Group className="col-md-6 form-group">
                        <Form.Label htmlFor="lic">License Code:</Form.Label>
                        <Form.Control
                          type="text"
                          id="lic"
                          placeholder="License Code"
                          value={selectedLicense.license || ""}
                          onChange={(e) =>
                            setSelectedLicenseCode({ license: e.target.value })
                          }
                        />
                      </Form.Group>
                    </div>
                    <hr />
                    <div className="row">
                      <Form.Group className="col-md-6 form-group">
                        <Form.Label htmlFor="pass">Password:</Form.Label>
                        <Form.Control
                          type="password"
                          id="pass"
                          placeholder="Password"
                          value={selectedPassword.password || ""}
                          onChange={(e) =>
                            setSelectedPassword({ password: e.target.value })
                          }
                        />
                      </Form.Group>
                      <Form.Group className="col-md-6 form-group">
                        <Form.Label htmlFor="cpass">
                          Comfirm Password:
                        </Form.Label>
                        <Form.Control
                          type="password"
                          id="cpass"
                          placeholder="Confirm Password "
                          value={selectedConfirmPassword.confirmpassword || ""}
                          onChange={(e) =>
                            setSelectedConfirmPassword({
                              confirmpassword: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                    </div>
                    <Button
                      type="Submit"
                      onClick={(e) => handleSubmit(e)}
                      variant="btn btn-primary"
                    >
                      Update
                    </Button>
                  </form>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AdminProfile;
