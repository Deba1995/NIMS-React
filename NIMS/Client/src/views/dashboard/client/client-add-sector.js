import React, { useEffect, useState } from "react";
import { Row, Col, Modal, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../../components/Card";
import { API_BASE_URL } from "../../../config/serverApiConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ClientSector = () => {
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleClose = () => setShow(false);
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
      const response = await fetch(`${API_BASE_URL}client/client-get-sector`, {
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

  //
  //permission
  
  const [sectors, setSectors] = useState([]);
  const [sectorName, setSectorName] = useState("");
  const [selectSector, setSelectSector] = useState({
    sectorName: "",
  });


  async function handleSubmit(e) {
    e.preventDefault();

    try {

      const response = await fetch(
        `${API_BASE_URL}client/client-add-sector`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ sectorName }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.sector) {
        // Handle success, e.g., show a success message or update UI
        console.log("Sector added successfully");
        handleSuccess(data.message);
        setSectors([...sectors, data.sector]);
        // setDepartmentName("");
        handleClose();
      } else {
        // Handle error, e.g., show an error message or perform necessary actions
       handleError("Failed to add Sector")
        console.error("Failed to add Sector");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    const fetchSector = async () => {
      try{
      const response = await fetch(`${API_BASE_URL}client/client-get-sector`, {
        method: "GET",
        credentials: "include", // Include cookies in the request
      });
      const data = await response.json();
      
      if (data.success) {
        console.log(data);
        setSectors(data.sectors);
      }
    }catch (error){
      console.error("Error fetching sector:", error);
    }
    };
    fetchSector();
  }, []);

  const handleEditClick = (sector) => {
    setShowEdit(true);
    setSelectSector(sector);
  };

  async function handleSubmitUpdate(e) {
    e.preventDefault();

    try {
     
      const response = await fetch(
        `${API_BASE_URL}client/client-update-sector/${selectSector._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            sectorName: selectSector.sectorName,
          }),
        }
      );

      const data = await response.json();
      if(data.success){
        handleSuccess(data.message);
        const updateSectors = [...sectors];
        const updateSectorIndex = updateSectors.findIndex(
          (sector) => sector._id === selectSector._id
        );
        if (updateSectorIndex !== -1) {
          updateSectors[updateSectorIndex].sectorName =
            selectSector.sectorName;
        }
        setSectors(updateSectors);
        setSelectSector({sectorName: ""});
        handleCloseEdit();
      }else{
        handleError("Cannot update sector")
      }
    } catch (error) {
      console.error(error);
      
    }
  }

  const handleDeleteClick =  (sector) => {
    if(window.confirm("Are you sure you want to delete this sector?")) {
      deleteSector(sector._id);
    }
  };
  const deleteSector = async (sectorId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}client/client-delete-sector/${sectorId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();
      if(data.success){
        handleSuccess(data.message);
        const updateSectors = sectors.filter(
          (sector) => sector._id !== sectorId
        );
        setSectors(updateSectors);
      }else{
        handleError("Failed to delete sector");
      }
      
    } catch (error) {
      console.error("Error:",error);
      
    }
  }


  return authenticated ? (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between flex-wrap">
              <div className="header-title">
                <h4 className="card-title mb-0">Client Sector</h4>
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
                  <span>New Sector</span>
                </Button>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add new sector</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicPassword"
                      onSubmit={(e) => handleSubmit(e)}
                    >
                      <Form.Label>Sector name</Form.Label>
                      <Form.Control
                        type="text"
                        
                        onChange={(e) => setSectorName(e.target.value)}
                        placeholder="Sector Name"
                      />
                    </Form.Group>
                    <Button
                      type="submit"
                      variant="primary"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Save
                    </Button>{" "}
                    <Button variant="danger" onClick={handleClose}>
                      Cancel
                    </Button>
                  </Modal.Body>
                </Modal>
                <Modal show={showEdit} onHide={handleCloseEdit}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Sector</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={(e) => handleSubmitUpdate(e)}>
                      <Form.Group className="mb-3" controlId="formSector">
                        <Form.Label> Update Sector </Form.Label>
                        <Form.Control
                          type="text"
                          value={selectSector.sectorName}
                          onChange={(e) =>
                            setSelectSector({
                              ...selectSector,
                              sectorName: e.target.value,
                            })
                          }
                          placeholder="Sector Name"
                        />
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
                      <th>Sector Name</th>
                      <th style={{ float: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectors.map((sector, index) => (
                      <tr className="" key={index}>
                        <td className="">{sector.sectorName}</td>
                        <td className="">
                          <div style={{ float: "right" }}>
                            <Link
                              className="btn btn-sm btn-icon text-primary flex-end"
                              data-bs-toggle="tooltip"
                              title="Edit sector"
                              onClick={() => handleEditClick(sector)}
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
                              className="btn btn-sm btn-icon text-danger "
                              data-bs-toggle="tooltip"
                              title="Delete sector"
                              onClick={() => handleDeleteClick(sector)}
                             
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
    </>
  ) : (
    ""
  );
};
export default ClientSector;
