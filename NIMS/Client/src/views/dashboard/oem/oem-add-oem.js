import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
} from "mdb-react-ui-kit";

import { Link } from "react-router-dom";
import Card from "../../../components/Card";
import { API_BASE_URL } from "../../../config/serverApiConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "../../../components/DataTable";

const OemAdd = () => {
  /*---------------------------------------------------------------------
             Start MODAL VARIABLES
-----------------------------------------------------------------------*/
  const toggleShow = () => setOptSmModal(!optSmModal);
  const [optSmModal, setOptSmModal] = useState(false);
  const toggleShow1 = () => setOptSmModal1(!optSmModal1);
  const [optSmModal1, setOptSmModal1] = useState(false);
  const toggleShow2 = () => setOptSmModal2(!optSmModal2);
  const [optSmModal2, setOptSmModal2] = useState(false);
  const [dataTableOptions, setDataTableOptions] = useState({
    columns: [
      { title: "Oem Name" },
      { title: "Email" },
      { title: "Toll-number" },
      { title: "Mobile" },
      { title: "Contact Person" },
      { title: "Address" },
    ],
    data: [],
  });

  /*---------------------------------------------------------------------
             END MODAL VARIABLES
-----------------------------------------------------------------------*/

  const [oemName, setOemName] = useState(""); // Adding oem name to send data
  const [oemContact, setOemContact] = useState(""); // Adding oem Contact to send data
  const [oemToll, setOemToll] = useState(""); // Adding toll number oem to send data
  const [oemAddress, setOemAddress] = useState(""); // Adding address oem to send data
  const [oemContactPerson, setOemContactPerson] = useState(""); //Adding contact person to send data
  const [oemEmail, setOemEmail] = useState(""); // Adding oemEmail to send data
  const [oemList, setOemList] = useState([]); // Storing fetched data for display

  // To update Oem data
  const [selectedId, setSelectedId] = useState("");
  const [selectedOemName, setSelectedOemName] = useState("");
  const [selectedOemContact, setSelectedOemContact] = useState("");
  const [selectedOemToll, setSelectedOemToll] = useState("");
  const [selectedOemAddress, setSelectedOemAddress] = useState("");
  const [selectedOemContactPerson, setSelectedOemContactPerson] = useState("");
  const [selectedOemEmail, setselectedOemEmail] = useState("");

  /*---------------------------------------------------------------------
             Start HANDLE ERROR TOASTS
-----------------------------------------------------------------------*/
  const handleError = (err) =>
    toast.error(err, {
      position: toast.POSITION.TOP_RIGHT,
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: toast.POSITION.TOP_RIGHT,
    });

  /*---------------------------------------------------------------------
             END HANDLE ERROR TOASTS
-----------------------------------------------------------------------*/
  /*--------------------------------------------------------------------------------
--------------------------------Start Fetch oem Data--------------------------------
----------------------------------------------------------------------------------*/
  useEffect(() => {
    const fetchOems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}oem/oem-get-oem`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setOemList(data.oems);
          handleSuccess(data.message);
        }
      } catch (error) {
        console.error("Error fetching sector:", error);
      }
    };

    fetchOems();
  }, []);
  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
  useEffect(() => {
    // Update dataTableOptions whenever oems changes
    const newDataTableOptions = {
      ...dataTableOptions,
      data: oemList.map((oem) => [
        oem.oemName,
        oem.email,
        oem.tollphone,
        oem.contact,
        oem.contactName,
        oem.address,
      ]),
    };
    setDataTableOptions(newDataTableOptions);
  }, [oemList]);
  /*--------------------------------------------------------------------------------
--------------------------------Create oem Data--------------------------------
----------------------------------------------------------------------------------*/

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}oem/oem-add-oem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          oemName: oemName,
          email: oemEmail,
          tollphone: oemToll,
          contact: oemContact,
          contactName: oemContactPerson,
          address: oemAddress,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Oem added successfully");
        handleSuccess(data.message);
        setOemList([...oemList, data.oems]);
        setOemName("");
        setOemToll("");
        setOemContact("");
        setOemEmail("");
        setOemContactPerson("");
        setOemAddress("");
        setTimeout(() => {
          toggleShow();
        }, 1000);
      } else {
        Object.keys(data.errors).forEach((key) => {
          const messageErr = data.errors[key];
          if (messageErr) {
            handleError(messageErr);
          }
        });
        console.error("Failed to add oem");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/

  /*--------------------------------------------------------------------------------
--------------------------------Edit oem Data--------------------------------
----------------------------------------------------------------------------------*/

  const handleEditClick = (item) => {
    toggleShow1();
    setSelectedOemName(item.oemName);
    setSelectedOemContact(item.contact);
    setSelectedOemAddress(item.address);
    setSelectedOemContactPerson(item.contactName);
    setSelectedOemToll(item.tollphone);
    setselectedOemEmail(item.email);
    setSelectedId(item._id);
  };

  async function handleSubmitUpdate(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE_URL}oem/oem-update-oem/${selectedId}`, // Replace `clientId` with the actual ID
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            oemName: selectedOemName,
            email: selectedOemEmail,
            tollphone: selectedOemToll,
            contact: selectedOemContact,
            contactName: selectedOemContactPerson,
            address: selectedOemAddress,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);
        const updatedOems = [...oemList];
        const updatedOemIndex = updatedOems.findIndex(
          (oem) => oem._id === selectedId
        );

        if (updatedOemIndex !== -1) {
          updatedOems[updatedOemIndex] = {
            ...updatedOems[updatedOemIndex], // Copy existing client properties
            oemName: selectedOemName,
            email: selectedOemEmail,
            tollphone: selectedOemToll,
            contact: selectedOemContact,
            contactName: selectedOemContactPerson,
            address: selectedOemAddress,
          };
        }
        setOemList(updatedOems);
        setSelectedOemName("");
        setselectedOemEmail("");
        setSelectedOemToll("");
        setSelectedOemContact("");
        setSelectedOemContactPerson("");
        setSelectedOemAddress("");
        toggleShow1();
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
--------------------------------Delete oem Data--------------------------------
----------------------------------------------------------------------------------*/
  const handleDeleteClick = (item) => {
    if (window.confirm("Are you sure you want to delete this oem?")) {
      deleteOem(item._id);
    }
  };

  const deleteOem = async (item) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}oem/oem-delete-oem/${item}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);
        const updatedOems = oemList.filter((oem) => oem._id !== item);
        setOemList(updatedOems);
      } else {
        handleError("Failed to delete oem");
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
                  <h4 className="card-title">Oem List</h4>
                </div>
                <div className="d-flex justify-content-between">
                  <Button
                    className="text-center btn-primary btn-icon me-2 mt-lg-0 mt-md-0 mt-3"
                    onClick={toggleShow2}
                  >
                    <span>View</span>
                  </Button>
                  <Button
                    className="text-center btn-primary btn-icon me-2 mt-lg-0 mt-md-0 mt-3"
                    onClick={toggleShow}
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
                    <span>New Oem</span>
                  </Button>
                </div>
              </Card.Header>
              {/*======================= MODAL TO ADD OEM======================= */}
              <MDBModal show={optSmModal} tabIndex="-1" setShow={setOptSmModal}>
                <MDBModalDialog size="xl">
                  <MDBModalContent>
                    <MDBModalHeader>
                      <MDBModalTitle>New Oem Information</MDBModalTitle>
                      <MDBBtn
                        className="btn-close"
                        color="none"
                        onClick={toggleShow}
                      ></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                      <Form onSubmit={(e) => handleSubmit(e)}>
                        <div className="row">
                          <Form.Group className="col-md-4 form-group">
                            <Form.Label htmlFor="fname">Oem Name:</Form.Label>
                            <Form.Control
                              type="text"
                              id="cname"
                              value={oemName}
                              onChange={(e) => setOemName(e.target.value)}
                              placeholder="Oem Name"
                            />
                          </Form.Group>

                          <Form.Group className="col-md-4  form-group">
                            <Form.Label htmlFor="mobno">
                              Toll Number:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="mobno"
                              value={oemToll}
                              onChange={(e) => setOemToll(e.target.value)}
                              placeholder="Toll free Number"
                            />
                          </Form.Group>
                          <Form.Group className="col-md-4  form-group">
                            <Form.Label htmlFor="email">Email:</Form.Label>
                            <Form.Control
                              type="email"
                              id="email"
                              value={oemEmail}
                              onChange={(e) => setOemEmail(e.target.value)}
                              placeholder="Email"
                            />
                          </Form.Group>
                        </div>
                        <hr />
                        <div className="row">
                          <Form.Group className="col-md-4 form-group">
                            <Form.Label htmlFor="fname">
                              Contact Number:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="cnumbr"
                              value={oemContact}
                              onChange={(e) => setOemContact(e.target.value)}
                              placeholder="Contact number"
                            />
                          </Form.Group>
                          <Form.Group className="col-md-4 form-group">
                            <Form.Label htmlFor="fname">
                              Contact Person:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="cper"
                              value={oemContactPerson}
                              onChange={(e) =>
                                setOemContactPerson(e.target.value)
                              }
                              placeholder="Contact person"
                            />
                          </Form.Group>

                          <Form.Group className="col-md-4  form-group">
                            <Form.Label htmlFor="address">Address:</Form.Label>
                            <Form.Control
                              type="text"
                              id="addr"
                              value={oemAddress}
                              onChange={(e) => setOemAddress(e.target.value)}
                              placeholder="Address"
                            />
                          </Form.Group>
                        </div>
                        <hr />
                        <Button
                          type="button"
                          variant="btn btn-primary"
                          style={{ float: "right" }}
                          onClick={(e) => handleSubmit(e)}
                        >
                          Add Oem
                        </Button>
                      </Form>
                    </MDBModalBody>
                  </MDBModalContent>
                </MDBModalDialog>
              </MDBModal>
              {/*=======================END MODAL TO ADD OEM======================= */}

              {/*======================= MODAL TO EDIT OEM======================= */}
              <MDBModal
                show={optSmModal1}
                tabIndex="-1"
                setShow={setOptSmModal1}
              >
                <MDBModalDialog size="xl">
                  <MDBModalContent>
                    <MDBModalHeader>
                      <MDBModalTitle>Edit Oem Information</MDBModalTitle>
                      <MDBBtn
                        className="btn-close"
                        color="none"
                        onClick={toggleShow1}
                      ></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                      <Form onSubmit={(e) => handleSubmitUpdate(e)}>
                        <div className="row">
                          <Form.Group className="col-md-4 form-group">
                            <Form.Label htmlFor="fname">Oem Name:</Form.Label>
                            <Form.Control
                              type="text"
                              id="cname"
                              value={selectedOemName}
                              onChange={(e) =>
                                setSelectedOemName(e.target.value)
                              }
                              placeholder="Oem Name"
                            />
                          </Form.Group>

                          <Form.Group className="col-md-4  form-group">
                            <Form.Label htmlFor="mobno">
                              Toll Number:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="mobno"
                              value={selectedOemToll}
                              onChange={(e) =>
                                setSelectedOemToll(e.target.value)
                              }
                              placeholder="Toll free Number"
                            />
                          </Form.Group>
                          <Form.Group className="col-md-4  form-group">
                            <Form.Label htmlFor="email">Email:</Form.Label>
                            <Form.Control
                              type="email"
                              id="email"
                              value={selectedOemEmail}
                              onChange={(e) =>
                                setselectedOemEmail(e.target.value)
                              }
                              placeholder="Email"
                            />
                          </Form.Group>
                        </div>
                        <hr />
                        <div className="row">
                          <Form.Group className="col-md-4 form-group">
                            <Form.Label htmlFor="fname">
                              Contact Number:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="cnumbr"
                              value={selectedOemContact}
                              onChange={(e) =>
                                setSelectedOemContact(e.target.value)
                              }
                              placeholder="Contact number"
                            />
                          </Form.Group>
                          <Form.Group className="col-md-4 form-group">
                            <Form.Label htmlFor="fname">
                              Contact Person:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="cper"
                              value={selectedOemContactPerson}
                              onChange={(e) =>
                                setSelectedOemContactPerson(e.target.value)
                              }
                              placeholder="Contact person"
                            />
                          </Form.Group>

                          <Form.Group className="col-md-4  form-group">
                            <Form.Label htmlFor="address">Address:</Form.Label>
                            <Form.Control
                              type="text"
                              id="addr"
                              value={selectedOemAddress}
                              onChange={(e) =>
                                setSelectedOemAddress(e.target.value)
                              }
                              placeholder="Address"
                            />
                          </Form.Group>
                        </div>
                        <hr />
                        <Button
                          type="button"
                          variant="btn btn-primary"
                          style={{ float: "right" }}
                          onClick={(e) => handleSubmitUpdate(e)}
                        >
                          Update Oem
                        </Button>
                      </Form>
                    </MDBModalBody>
                  </MDBModalContent>
                </MDBModalDialog>
              </MDBModal>
              {/*======================= END MODAL TO EDIT CLIENT======================= */}

              <MDBModal
                show={optSmModal2}
                tabIndex="-1"
                setShow={setOptSmModal2}
              >
                <MDBModalDialog size="xl">
                  <MDBModalContent>
                    <MDBModalHeader>
                      <MDBModalTitle>View Oem Information</MDBModalTitle>
                      <MDBBtn
                        className="btn-close"
                        color="none"
                        onClick={toggleShow2}
                      ></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                      <div className="table-responsive border-bottom my-3">
                        <DataTable
                          data={dataTableOptions.data}
                          columns={dataTableOptions.columns}
                          iscolumnfooter="bootstrap-datatable"
                        />
                      </div>
                    </MDBModalBody>
                  </MDBModalContent>
                </MDBModalDialog>
              </MDBModal>

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
                        <th>Toll Free</th>
                        <th>Email</th>
                        <th style={{ float: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {oemList.map((item, id) => (
                        <tr key={id}>
                          <td>{item.oemName}</td>
                          <td>{item.tollphone}</td>
                          <td>{item.email}</td>
                          <td>
                            <div style={{ float: "right" }}>
                              <Link
                                className="btn btn-sm btn-icon text-primary flex-end"
                                data-bs-toggle="tooltip"
                                title="Edit oem"
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
                                title="Delete oem"
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

export default OemAdd;
