import React, { useEffect, useState } from "react";
import { Row, Col, Modal, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../../components/Card";
import { API_BASE_URL } from "../../../config/serverApiConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDesignation = () => {
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const handleClose = () => setShow(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShow = () => setShow(true);

  let history = useNavigate();

  const handleError = (err) =>
    toast.error(err, {
      position: toast.POSITION.TOP_RIGHT,
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: toast.POSITION.TOP_RIGHT,
    });

  useEffect(() => {
    const verifyUser = async () => {
      const response = await fetch(`${API_BASE_URL}user/user-get-designation`, {
        method: "GET",
        credentials: "include", // Include cookies in the request
      });
      const data = await response.json();

      if (data.success) {
        setAuthenticated(data.success);
      } else {
        history("/auth/sign-in");
        setAuthenticated(data.success);
      }
    };
    verifyUser();
  }, [history]);

 
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designationName, setDesignationName] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState({
    departmentCode: "",
  });
  const [selectedDesignation, setSelectedDesignation] = useState({
    designationName: "",
  });

  //creating Designation
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}user/user-add-designation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ designationName, departmentCode }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        console.log("Designation added successfully");
        handleSuccess("Designation added successfully");
        setDesignations([...designations, data.designation]);
        handleClose(); // Close the modal after successful addition
      } else {
        Object.keys(data.errors).forEach((key) => {
          const messageErr = data.errors[key];
          if (messageErr) {
            handleError(messageErr);
          }
        });
        console.error("Failed to add designation");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  
  useEffect(() => {
    const fetchDesignation = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}user/user-get-designation`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success) {
          setDepartments(data.departments);
          setDesignations(data.designations);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDesignation();
  }, []);

  const handleSelectChange = (e) => {
    const deptCode = e.target.value;
    setDepartmentCode(deptCode);
  };
  const handleSelectChangeEdit = (e) => {
    const deptCode = e.target.value;
    console.log(deptCode);
    setSelectedDepartment({ departmentCode: deptCode });
  };

  const handleEditClick = (designation) => {
    setShowEdit(true);
    setSelectedDesignation(designation);
    setSelectedDepartment({ departmentCode: designation.departmentCode });
  };
  async function handleSubmitUpdate(e) {
    e.preventDefault();

    try {
      console.log(selectedDesignation._id);
      const response = await fetch(
        `${API_BASE_URL}user/user-update-designation/${selectedDesignation._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            designationName: selectedDesignation.designationName,
            departmentCode: selectedDepartment.departmentCode,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        console.log("desination updated");
        handleSuccess("Designation Updated Successfully");
        const updatedDesignations = [...designations];
        const updatedDesignationIndex = updatedDesignations.findIndex(
          (designation) => designation._id === selectedDesignation._id
        );
        if (updatedDesignationIndex !== -1) {
          updatedDesignations[updatedDesignationIndex].designationName =
            selectedDesignation.designationName;
          updatedDesignations[updatedDesignationIndex].departmentCode =
            selectedDepartment.departmentCode;
        }
        setDesignations(updatedDesignations);

        setSelectedDesignation({ designationName: "" });
        setSelectedDepartment({ departmentCode: "" });
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

  const handleDeleteClick = (designation) => {
    if (window.confirm("Are you sure you want to delete this designation?")) {
      deleteDesignation(designation._id);
    }
  };

  const deleteDesignation = async (designationId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}user/user-delete-designation/${designationId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.success) {
        handleSuccess("Designation deleted successfully");
        const updatedDesignations = designations.filter(
          (designation) => designation._id !== designationId
        );
        setDesignations(updatedDesignations);
      } else {
        handleError("Failed to delete designation");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return authenticated ? (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between flex-wrap">
              <div className="header-title">
                <h4 className="card-title mb-0">User Designation</h4>
              </div>
              <div>
                <ToastContainer position="top-right" autoClose={3000} />
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
                  <span>New Designation</span>
                </Button>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add new designation</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={(e) => handleSubmit(e)}>
                      <Form.Group className="mb-3" controlId="formDesignation">
                        <Form.Label>Designation name</Form.Label>
                        <Form.Control
                          type="text"
                          onChange={(e) => setDesignationName(e.target.value)}
                          placeholder="Designation Name"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formDepartment">
                        <Form.Label>Select Department</Form.Label>
                        <Form.Control as="select" onChange={handleSelectChange}>
                          <option value="">Select Department</option>
                          {departments.map((department, index) => (
                            <option
                              key={index}
                              value={department.departmentCode}
                            >
                              {department.departmentName}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                      <Button type="submit" variant="primary">
                        Save
                      </Button>{" "}
                      <Button variant="danger" onClick={handleClose}>
                        Cancel
                      </Button>
                    </Form>
                  </Modal.Body>
                </Modal>
                <Modal show={showEdit} onHide={handleCloseEdit}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update designation</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={(e) => handleSubmitUpdate(e)}>
                      <Form.Group className="mb-3" controlId="formDesignation">
                        <Form.Label> Update Designation </Form.Label>
                        <Form.Control
                          type="text"
                          value={selectedDesignation.designationName}
                          onChange={(e) =>
                            setSelectedDesignation({
                              ...selectedDesignation,
                              designationName: e.target.value,
                            })
                          }
                          placeholder="Designation Name"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formDepartment">
                        <Form.Label>Select Department</Form.Label>
                        <Form.Control
                          as="select"
                          onChange={handleSelectChangeEdit}
                        >
                          <option value={selectedDesignation.departmentCode}>
                            {" "}
                            {
                              departments.find(
                                (department) =>
                                  department.departmentCode ===
                                  selectedDesignation.departmentCode
                              )?.departmentName
                            }
                          </option>
                          {departments.map((department, index) => (
                            <option
                              key={index}
                              value={department.departmentCode}
                            >
                              {department.departmentName}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                      <Button
                        type="submit"
                        variant="primary"
                        onClick={(e) => handleSubmitUpdate(e)}
                      >
                        Update
                      </Button>{" "}
                      <Button variant="danger" onClick={handleCloseEdit}>
                        Cancel
                      </Button>
                    </Form>
                  </Modal.Body>
                </Modal>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Depsignation Name</th>
                      <th>Department Name</th>
                      <th style={{ float: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {designations.map((designation, index) => (
                      <tr className="" key={index}>
                        <td className="">{designation.designationName}</td>

                        <td className="">
                          {" "}
                          {
                            departments.find(
                              (department) =>
                                department.departmentCode ===
                                designation.departmentCode
                            )?.departmentName
                          }
                        </td>
                        <td className="">
                          <div style={{ float: "right" }}>
                            <Link
                              className="btn btn-sm btn-icon text-primary flex-end"
                              data-bs-toggle="tooltip"
                              title="Edit Designation"
                              onClick={() => handleEditClick(designation)}
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
                            </Link>
                            <Link
                              className="btn btn-sm btn-icon text-danger "
                              data-bs-toggle="tooltip"
                              title="Delete Designation"
                              onClick={() => handleDeleteClick(designation)}
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
                            </Link>
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
    </>
  ) : (
    ""
  );
};

export default UserDesignation;
