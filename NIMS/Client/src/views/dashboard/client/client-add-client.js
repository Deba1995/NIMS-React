import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Modal,
  Form,
  Button,
  ButtonGroup,
  Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Card from "../../../components/Card";
import { API_BASE_URL } from "../../../config/serverApiConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClientAdd = () => {
  const [show, setShow] = useState(false); //MODAL TO ADD CLIENT
  const [show1, setShow1] = useState(false); //MODAL TO ADD DEPARTMENT
  const [show2, setShow2] = useState(false); //MODAL TO ADD NEW DEPARTMENT IN EDIT
  const [showEdit, setShowEdit] = useState(false); //MODAL TO EDIT CLIENT
  const [showEdit1, setShowEdit1] = useState(false); //MODAL TO EDIT DEPARTMENT
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleShow1 = () => setShow1(true);
  const handleShow2 = () => setShow2(true);
  const handleClose1 = () => setShow1(false);
  const handleClose2 = () => setShow2(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleCloseEdit1 = () => setShowEdit1(false);

  const [fullscreen] = useState(true);
  const [sectors, setSectors] = useState([]);
  const [sectorCode, setSectorCode] = useState("");
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [newAddEditDepartment, setNewAddEditDepartment] = useState("");
  const [name, setName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientState, setClientState] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [clientContry, setClientCountry] = useState("");
  const [clientMobile, setClientMobile] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPinCode, setClientPinCode] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientList, setClientList] = useState([]);
  const [selectedSectorCode, setSelectedSectorCode] = useState({
    sectorCode: "",
  });
  const [selectedClientName, setSelectedClientName] = useState({
    clientName: "",
  });
  const [selectedContact, setSelectedContact] = useState({
    phone: "",
  });
  const [selectedClientAddress, setSelectedClientAddress] = useState({
    address: "",
  });
  const [selectedClientState, setSelectedClientState] = useState({
    state: "",
  });
  const [selectedClientCity, setSelectedClientCity] = useState({
    city: "",
  });
  const [selectedClientCountry, setSelectedClientCountry] = useState({
    country: "",
  });

  const [selectedClientEmail, setSelectedClientEmail] = useState({
    email: "",
  });
  const [selectedClientPinCode, setSelectedClientPinCode] = useState({
    postal: "",
  });
  const [selectedClientId, setSelectedClientId] = useState({
    clientId: "",
  });
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const [newEditDepartment, setNewEditDepartment] = useState({
    departmentName: "",
    index: 0,
  });

  const handleError = (err) =>
    toast.error(err, {
      position: toast.POSITION.TOP_RIGHT,
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: toast.POSITION.TOP_RIGHT,
    });
  const handleRemoveDepartment = (index) => {
    const updatedDepartments = [...departments];
    updatedDepartments.splice(index, 1);
    setDepartments(updatedDepartments);
    handleSuccess("Department removed");
  };
  const handleAddDepartment = () => {
    if (newDepartment.trim() !== "") {
      setDepartments([...departments, newDepartment]);
      setNewDepartment("");
      handleSuccess("Department added");
      handleClose1();
    } else {
      handleError("Department name cannot be empty");
    }
  };
  const handleSelectChange = (e) => {
    const strCode = e.target.value;
    setSectorCode(strCode);
  };
  /*--------------------------------------------------------------------------------
--------------------------------Start Fetch Client Data--------------------------------
----------------------------------------------------------------------------------*/
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}client/client-get-client`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success) {
          setSectors(data.sectors);
          setClientList(data.clients);
        }
      } catch (error) {
        console.error("Error fetching sector:", error);
      }
    };

    fetchClients();
  }, []);
  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/

  /*--------------------------------------------------------------------------------
--------------------------------Create Client Data--------------------------------
----------------------------------------------------------------------------------*/

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}client/client-add-client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          departments,
          sectorCode,
          clientName: name,
          address: clientAddress,
          state: clientState,
          city: clientCity,
          country: clientContry,
          phone: clientMobile,
          email: clientEmail,
          postal: clientPinCode,
          clientId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Client added successfully");
        handleSuccess(data.message);
        setClientList([...clientList, data.client]);
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        Object.keys(data.errors).forEach((key) => {
          const messageErr = data.errors[key];
          if (messageErr) {
            handleError(messageErr);
          }
        });
        console.error("Failed to add client");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/

  /*--------------------------------------------------------------------------------
--------------------------------Edit Client Data--------------------------------
----------------------------------------------------------------------------------*/

  const handleSelectChangeEdit = (e) => {
    const stcode = e.target.value;
    console.log(stcode);
    setSelectedSectorCode({ sectorCode: stcode });
  };

  const handleEditClick = (item) => {
    setShowEdit(true);
    setSelectedClientName({ clientName: item.clientName });
    setSelectedContact({ phone: item.phone });
    setSelectedClientAddress({ address: item.address });
    setSelectedClientState({ state: item.state });
    setSelectedSectorCode({ sectorCode: item.sectorCode });
    setSelectedClientCity({ city: item.city });
    setSelectedClientCountry({ country: item.country });
    setSelectedClientEmail({ email: item.email });
    setSelectedClientPinCode({ postal: item.postal });
    setSelectedClientId({ clientId: item.clientId });
    setSelectedDepartments(item.departments);
  };

  const handleAddEditDepartment = () => {
    if (newAddEditDepartment.trim() !== "") {
      setSelectedDepartments([...selectedDepartments, newAddEditDepartment]);
      setNewAddEditDepartment("");
      handleSuccess("Department added");
      handleClose2();
    } else {
      handleError("Department name cannot be empty");
    }
  };
  const handleRemoveEditDepartment = (index) => {
    setSelectedDepartments(prevdept => {
      const updatedDepartments = [...prevdept];
      updatedDepartments.splice(index, 1);
      return updatedDepartments;
  });
  handleSuccess("Department removed");

  };

  const handleEditDepartment = (department, index) => {
    setShowEdit1(true);
    setNewEditDepartment({ departmentName: department, index: index });
  };
  const handelChangeDepartment = (e, newEditDepartment) => {
    e.preventDefault();
    if (newEditDepartment.departmentName.trim() !== "") {
      setSelectedDepartments((prevDepartments) => {
        return prevDepartments.map((department, i) => {
          if (i === newEditDepartment.index) {
            return newEditDepartment.departmentName;
          }
          return department;
        });
      });
      handleSuccess("Department changed successfully");
      handleCloseEdit1();
    } else {
      handleError("Department name cannot be empty");
    }
  };

  async function handleSubmitUpdate(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE_URL}client/client-update-client/${selectedClientId.clientId}`, // Replace `clientId` with the actual ID
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            sectorCode: selectedSectorCode.sectorCode,
            clientName: selectedClientName.clientName,
            address: selectedClientAddress.address,
            state: selectedClientState.state,
            city: selectedClientCity.city,
            country: selectedClientCountry.country,
            phone: selectedContact.phone,
            email: selectedClientEmail.email,
            postal: selectedClientPinCode.postal,
            departments: selectedDepartments,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);
        const updatedClients = [...clientList];
        const updatedClientIndex = updatedClients.findIndex(
          (client) => client.clientId === selectedClientId.clientId
        );
        if (updatedClientIndex !== -1) {
          updatedClients[updatedClientIndex] = {
            ...updatedClients[updatedClientIndex], // Copy existing client properties
            clientName: selectedClientName.clientName,
            address: selectedClientAddress.address,
            state: selectedClientState.state,
            city: selectedClientCity.city,
            country: selectedClientCountry.country,
            phone: selectedContact.phone,
            email: selectedClientEmail.email,
            postal: selectedClientPinCode.postal,
            departments: selectedDepartments,
          };
        }
        setClientList(updatedClients);
        setSelectedClientId({ clientId: "" });

        handleCloseEdit();
      } else {
        Object.keys(data.errors).forEach((key) => {
          const messageErr = data.errors[key];
          if (messageErr) {
            handleError(messageErr);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/

  /*--------------------------------------------------------------------------------
--------------------------------Delete Client Data--------------------------------
----------------------------------------------------------------------------------*/
  const handleDeleteClick = (item) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      deleteClient(item._id);
    }
  };

  const deleteClient = async (item) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}client/client-delete-client/${item}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);
        const updatedClients = clientList.filter(
          (client) => client._id !== item
        );
        setClientList(updatedClients);
      } else {
        handleError("Failed to delete client");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
  return (
    <>
      <div>
        <Row>
          <Col sm="12">
            <Card>
              <ToastContainer position="top-right" autoClose={3000} />
              <Card.Header className="d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">Client List</h4>
                </div>

                <Button
                  className="text-center btn-primary btn-icon me-2 mt-lg-0 mt-md-0 mt-3"
                  onClick={handleShow}
                >
                  <i className="btn-inner">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </i>
                  <span>New Client</span>
                </Button>
              </Card.Header>
              {/*======================= MODAL TO ADD CLIENT======================= */}
              <Modal
                show={show}
                fullscreen={fullscreen}
                onHide={() => setShow(false)}
              >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  
                  <Form onSubmit={(e) => handleSubmit(e)}>
                    <Row>
                      <Col xl="3" lg="4" className="">
                        <Card>
                          <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                              <h4 className="card-title">Add New Client</h4>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            
                              <Form.Group className="form-group">
                                <Form.Label>Client Sector:</Form.Label>
                                <Form.Control
                                  as="select"
                                  onChange={handleSelectChange}
                                >
                                  <option value="">Select sector</option>
                                  {sectors.map((sector, index) => (
                                    <option
                                      key={index}
                                      value={sector.sectorCode}
                                    >
                                      {sector.sectorName}
                                    </option>
                                  ))}
                                </Form.Control>
                              </Form.Group>
                            
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col xl="9" lg="8">
                        <Card>
                          <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                              <h4 className="card-title">
                                New Client Information
                              </h4>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <div className="new-user-info">
                         
                                <div className="row">
                                  <Form.Group className="col-md-6 form-group">
                                    <Form.Label htmlFor="fname">
                                      Client Name:
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="cname"
                                      onChange={(e) => setName(e.target.value)}
                                      placeholder="Client Name"
                                    />
                                  </Form.Group>
                                  <Form.Group className="col-md-6 form-group">
                                    <Form.Label htmlFor="lname">
                                      Street address:
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="sname"
                                      onChange={(e) =>
                                        setClientAddress(e.target.value)
                                      }
                                      placeholder="State address"
                                    />
                                  </Form.Group>
                                  <Form.Group className="col-md-6 form-group">
                                    <Form.Label htmlFor="add1">
                                      State:
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="add1"
                                      onChange={(e) =>
                                        setClientState(e.target.value)
                                      }
                                      placeholder="Street Address "
                                    />
                                  </Form.Group>
                                  <Form.Group className="col-md-6 form-group">
                                    <Form.Label htmlFor="add2">
                                      City:
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="add2"
                                      onChange={(e) =>
                                        setClientCity(e.target.value)
                                      }
                                      placeholder="City"
                                    />
                                  </Form.Group>
                                  <Form.Group className="col-sm-12 form-group">
                                    <Form.Label>Country:</Form.Label>
                                    <select
                                      name="type"
                                      className="selectpicker form-control"
                                      data-style="py-0"
                                      onChange={(e) =>
                                        setClientCountry(e.target.value)
                                      }
                                    >
                                      <option>Select Country</option>
                                      <option>Caneda</option>
                                      <option>Noida</option>
                                      <option>USA</option>
                                      <option>India</option>
                                      <option>Africa</option>
                                    </select>
                                  </Form.Group>
                                  <Form.Group className="col-md-6  form-group">
                                    <Form.Label htmlFor="mobno">
                                      Mobile Number:
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="mobno"
                                      onChange={(e) =>
                                        setClientMobile(e.target.value)
                                      }
                                      placeholder="Mobile Number"
                                    />
                                  </Form.Group>
                                  <Form.Group className="col-md-6  form-group">
                                    <Form.Label htmlFor="email">
                                      Email:
                                    </Form.Label>
                                    <Form.Control
                                      type="email"
                                      id="email"
                                      onChange={(e) =>
                                        setClientEmail(e.target.value)
                                      }
                                      placeholder="Email"
                                    />
                                  </Form.Group>
                                  <Form.Group className="col-md-6 form-group">
                                    <Form.Label htmlFor="pno">
                                      Pin Code:
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="pno"
                                      onChange={(e) =>
                                        setClientPinCode(e.target.value)
                                      }
                                      placeholder="Pin Code"
                                    />
                                  </Form.Group>
                                  <Form.Group className="col-md-6 form-group">
                                    <Form.Label htmlFor="clientid">
                                      Client ID:
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="clientid"
                                      onChange={(e) =>
                                        setClientId(e.target.value)
                                      }
                                      placeholder="Client ID"
                                    />
                                  </Form.Group>
                                </div>
                                <hr />
                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Button
                                      className="text-center btn-primary btn-icon me-2 mt-lg-0 mt-md-0 mt-3"
                                      onClick={handleShow1}
                                    >
                                      <i className="btn-inner">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                          />
                                        </svg>
                                      </i>
                                      <span></span>
                                    </Button>
                                    <h5 className="">Departments</h5>
                                  </div>

                                  {/*======================= MODAL TO ADD DEPARTMENT========================== */}
                                  <Modal show={show1} onHide={handleClose1}>
                                    <Modal.Header closeButton>
                                      <Modal.Title>
                                        Add new department
                                      </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      <Form.Group
                                        className="mb-3"
                                        controlId="formBasicPassword"
                                        onSubmit={(e) => e.preventDefault()}
                                      >
                                        <Form.Label>Department name</Form.Label>
                                        <Form.Control
                                          type="text"
                                          value={newDepartment}
                                          onChange={(e) =>
                                            setNewDepartment(e.target.value)
                                          }
                                          placeholder="Department Name"
                                        />
                                        <Form.Control.Feedback className="invalid">
                                          Example invalid feedback text
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                      <Button
                                        type="submit"
                                        variant="primary"
                                        onClick={handleAddDepartment}
                                      >
                                        Add
                                      </Button>{" "}
                                      <Button
                                        variant="danger"
                                        onClick={handleClose1}
                                      >
                                        Cancel
                                      </Button>
                                    </Modal.Body>
                                  </Modal>
                                  {/*======================= END MODAL TO ADD DEPARTMENT======================= */}
                                </div>

                                {departments.map((department, index) => (
                                  <div
                                    style={{ marginTop: "12px" }}
                                    key={index}
                                  >
                                    <Dropdown as={ButtonGroup}>
                                      <Button
                                        type="button"
                                        style={{
                                          backgroundColor: "gray",
                                          border: "2px solid gray",
                                        }}
                                      >
                                        {department}
                                      </Button>
                                      <Dropdown.Toggle
                                        as={Button}
                                        type="button"
                                        split
                                        style={{
                                          backgroundColor: "gray",
                                          border: "2px solid gray",
                                        }}
                                      >
                                        <span className="visually-hidden">
                                          Toggle Dropdown
                                        </span>
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        <Dropdown.Item
                                          onClick={() =>
                                            handleRemoveDepartment(index)
                                          }
                                        >
                                          Remove
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                ))}
                       
                            </div>
                            <Button
                              type="button"
                              variant="btn btn-primary"
                              style={{ float: "right" }}
                              onClick={(e) => handleSubmit(e)}
                            >
                              Add Client
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    </Form>
                </Modal.Body>
              </Modal>
              {/*=======================END MODAL TO ADD CLIENT======================= */}

              {/*======================= MODAL TO EDIT CLIENT======================= */}
              <Modal
                show={showEdit}
                fullscreen={fullscreen}
                onHide={() => setShowEdit(false)}
              >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  <Form onSubmit={(e) => handleSubmitUpdate(e)}>
                    <Row>
                      <Col xl="3" lg="4" className="">
                        <Card>
                          <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                              <h4 className="card-title">Edit Client</h4>
                            </div>
                          </Card.Header>

                          <Card.Body>
                            <Form.Group className="form-group">
                              <Form.Label>Client Sector:</Form.Label>
                              <Form.Control
                                as="select"
                                onChange={handleSelectChangeEdit}
                              >
                                <option value={selectedSectorCode.sectorCode}>
                                  {" "}
                                  {
                                    sectors.find(
                                      (sector) =>
                                        sector.sectorCode ===
                                        selectedSectorCode.sectorCode
                                    )?.sectorName
                                  }
                                </option>
                                {sectors.map((sector, index) => (
                                  <option key={index} value={sector.sectorCode}>
                                    {sector.sectorName}
                                  </option>
                                ))}
                              </Form.Control>
                            </Form.Group>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col xl="9" lg="8">
                        <Card>
                          <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                              <h4 className="card-title">Client Information</h4>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <div className="new-user-info">
                              <div className="row">
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="fname">
                                    Client Name:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="cname"
                                    value={selectedClientName.clientName}
                                    onChange={(e) =>
                                      setSelectedClientName({
                                        clientName: e.target.value,
                                      })
                                    }
                                    placeholder="Client Name"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="lname">
                                    Street address:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="sname"
                                    value={selectedClientAddress.address}
                                    onChange={(e) =>
                                      setSelectedClientAddress({
                                        address: e.target.value,
                                      })
                                    }
                                    placeholder="State address"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="add1">State:</Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="add1"
                                    value={selectedClientState.state}
                                    onChange={(e) =>
                                      setSelectedClientState({
                                        state: e.target.value,
                                      })
                                    }
                                    placeholder="Street State "
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="add2">City:</Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="add2"
                                    value={selectedClientCity.city}
                                    onChange={(e) =>
                                      setSelectedClientCity({
                                        city: e.target.value,
                                      })
                                    }
                                    placeholder="City"
                                  />
                                </Form.Group>
                                <Form.Group className="col-sm-12 form-group">
                                  <Form.Label>Country:</Form.Label>
                                  <select
                                    name="type"
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                    value={selectedClientCountry.country}
                                    onChange={(e) =>
                                      setSelectedClientCountry({
                                        country: e.target.value,
                                      })
                                    }
                                  >
                                    <option>
                                      {selectedClientCountry.country}
                                    </option>
                                    <option>Caneda</option>
                                    <option>Noida</option>
                                    <option>USA</option>
                                    <option>India</option>
                                    <option>Africa</option>
                                  </select>
                                </Form.Group>
                                <Form.Group className="col-md-6  form-group">
                                  <Form.Label htmlFor="mobno">
                                    Mobile Number:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="mobno"
                                    value={selectedContact.phone}
                                    onChange={(e) =>
                                      setSelectedContact({
                                        phone: e.target.value,
                                      })
                                    }
                                    placeholder="Mobile Number"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6  form-group">
                                  <Form.Label htmlFor="email">
                                    Email:
                                  </Form.Label>
                                  <Form.Control
                                    type="email"
                                    id="email"
                                    value={selectedClientEmail.email}
                                    onChange={(e) =>
                                      setSelectedClientEmail({
                                        email: e.target.value,
                                      })
                                    }
                                    placeholder="Email"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="pno">
                                    Pin Code:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="pno"
                                    value={selectedClientPinCode.postal}
                                    onChange={(e) =>
                                      setSelectedClientPinCode({
                                        postal: e.target.value,
                                      })
                                    }
                                    placeholder="Pin Code"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="clientid">
                                    Client ID:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="clientid"
                                    disabled
                                    value={selectedClientId.clientId}
                                    onChange={(e) =>
                                      setSelectedClientId({
                                        clientId: e.target.value,
                                      })
                                    }
                                    placeholder="Client ID"
                                  />
                                </Form.Group>
                              </div>
                              <hr />
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Button
                                    className="text-center btn-primary btn-icon me-2 mt-lg-0 mt-md-0 mt-3"
                                    onClick={handleShow2}
                                  >
                                    <i className="btn-inner">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                      </svg>
                                    </i>
                                    <span></span>
                                  </Button>
                                  <h5 className="">Departments</h5>
                                </div>
                                {/*========================= MODAL TO ADD DEPARTMENT IN EDIT CLIENT ====================================*/}
                                <Modal show={show2} onHide={handleClose2}>
                                  <Modal.Header closeButton>
                                    <Modal.Title>
                                      Add new department
                                    </Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <Form.Group
                                      className="mb-3"
                                      controlId="formBasicPassword"
                                      onSubmit={(e) => e.preventDefault()}
                                    >
                                      <Form.Label>Department name</Form.Label>
                                      <Form.Control
                                        type="text"
                                        value={newAddEditDepartment}
                                        onChange={(e) =>
                                          setNewAddEditDepartment(
                                            e.target.value
                                          )
                                        }
                                        placeholder="Department Name"
                                      />
                                      <Form.Control.Feedback className="invalid">
                                        Example invalid feedback text
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                    <Button
                                      type="submit"
                                      variant="primary"
                                      onClick={handleAddEditDepartment}
                                    >
                                      Add
                                    </Button>{" "}
                                    <Button
                                      variant="danger"
                                      onClick={handleClose2}
                                    >
                                      Cancel
                                    </Button>
                                  </Modal.Body>
                                </Modal>

                                {/*========================= END MODAL TO ADD DEPARTMENT IN EDIT CLIENT ====================================*/}

                                {/*=========================  MODAL TO EDIT DEPARTMENT IN EDIT CLIENT ====================================*/}
                                <Modal
                                  show={showEdit1}
                                  onHide={handleCloseEdit1}
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>Update Sector</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <Form>
                                      <Form.Group
                                        className="mb-3"
                                        controlId="formSector"
                                      >
                                        <Form.Label> Update Sector </Form.Label>
                                        <Form.Control
                                          type="text"
                                          value={
                                            newEditDepartment.departmentName
                                          }
                                          onChange={(e) =>
                                            setNewEditDepartment({
                                              departmentName: e.target.value,
                                              index: newEditDepartment.index,
                                            })
                                          }
                                          placeholder="Department Name"
                                        />
                                      </Form.Group>
                                      <Button
                                        type="button"
                                        variant="primary"
                                        onClick={(e) =>
                                          handelChangeDepartment(
                                            e,
                                            newEditDepartment
                                          )
                                        }
                                      >
                                        change
                                      </Button>{" "}
                                      <Button
                                        variant="danger"
                                        onClick={handleCloseEdit1}
                                      >
                                        Cancel
                                      </Button>
                                    </Form>
                                  </Modal.Body>
                                </Modal>

                                {/*========================= END MODAL TO EDIT DEPARTMENT IN EDIT CLIENT ====================================*/}
                              </div>

                              {selectedDepartments.map((department, index) => (
                                <div style={{ marginTop: "12px" }} key={index}>
                                  <Dropdown as={ButtonGroup}>
                                    <Button
                                      type="button"
                                      style={{
                                        backgroundColor: "gray",
                                        border: "2px solid gray",
                                      }}
                                      value={department}
                                    >
                                      {department}
                                    </Button>
                                    <Dropdown.Toggle
                                      as={Button}
                                      type="button"
                                      split
                                      style={{
                                        backgroundColor: "gray",
                                        border: "2px solid gray",
                                      }}
                                    >
                                      <span className="visually-hidden">
                                        Toggle Dropdown
                                      </span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item
                                        onClick={() =>
                                          handleEditDepartment(
                                            department,
                                            index
                                          )
                                        }
                                      >
                                        Edit
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={() =>
                                          handleRemoveEditDepartment(index)
                                        }
                                      >
                                        Remove
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              ))}
                            </div>
                            <Button
                              type="button"
                              variant="btn btn-primary"
                              style={{ float: "right" }}
                              onClick={(e) => handleSubmitUpdate(e)}
                            >
                              Update Client
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Form>
                </Modal.Body>
              </Modal>
              {/*======================= END MODAL TO EDIT CLIENT======================= */}

              <Card.Body className="px-0">
                <div className="table-responsive">
                  <table
                    id="user-list-table"
                    className="table table-striped"
                    role="grid"
                    data-toggle="data-table"
                  >
                    <thead>
                      <tr className="ligth">
                        <th>Name</th>
                        <th>ID</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th style={{ float: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientList.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.clientName}</td>
                          <td>{item.clientId}</td>
                          <td>{item.phone}</td>
                          <td>{item.email}</td>
                          <td>
                            <div style={{ float: "right" }}>
                              <Link
                                className="btn btn-sm btn-icon text-primary flex-end"
                                data-bs-toggle="tooltip"
                                title="Edit client"
                                onClick={() => handleEditClick(item)}
                              >
                                <span className="btn-inner">
                                  <svg
                                    width="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M11.4925 2.78906H7.75349C4.67849 2.78906 2.75049 4.96606 2.75049 8.04806V16.3621C2.75049 19.4441 4.66949 21.6211 7.75349 21.6211H16.5775C19.6625 21.6211 21.5815 19.4441 21.5815 16.3621V12.3341"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M8.82812 10.921L16.3011 3.44799C17.2321 2.51799 18.7411 2.51799 19.6721 3.44799L20.8891 4.66499C21.8201 5.59599 21.8201 7.10599 20.8891 8.03599L13.3801 15.545C12.9731 15.952 12.4211 16.181 11.8451 16.181H8.09912L8.19312 12.401C8.20712 11.845 8.43412 11.315 8.82812 10.921Z"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                    <path
                                      d="M15.1655 4.60254L19.7315 9.16854"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                  </svg>
                                </span>
                              </Link>{" "}
                              <Link
                                className="btn btn-sm btn-icon text-danger"
                                data-toggle="tooltip"
                                title="Delete client"
                                onClick={() => handleDeleteClick(item)}
                              >
                                <span className="btn-inner">
                                  <svg
                                    width="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    stroke="currentColor"
                                  >
                                    <path
                                      d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                    <path
                                      d="M20.708 6.23975H3.75"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                    <path
                                      d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                  </svg>
                                </span>
                              </Link>{" "}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ClientAdd;
