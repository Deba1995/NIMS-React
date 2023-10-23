import React, { useEffect, useState, useMemo } from "react";
import { Row, Col, Form, Button, InputGroup, Modal } from "react-bootstrap";
import Select from "react-select";
import { MaterialReactTable } from "material-react-table";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";

import { Link } from "react-router-dom";
import Card from "../../../components/Card";
import { API_BASE_URL } from "../../../config/serverApiConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "../../../components/DataTable";

const AddOrder = () => {
  /*---------------------------------------------------------------------
             Start MODAL VARIABLES
-----------------------------------------------------------------------*/
  const [show, setShow] = useState(false);
  const [fullscreen] = useState(true);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const onMenuOpen = () => setIsMenuOpen(true);
  const onMenuClose = () => setIsMenuOpen(false);

  const style = {
    blockquote: {
      fontStyle: "italic",
      fontSize: ".75rem",
      margin: "1rem 0",
    },
    label: {
      fontSize: ".75rem",
      fontWeight: "bold",
      lineHeight: 2,
    },
  };

  const data = [
    {
      firstName: "Dylan",
      lastName: "Murray",
      address: "261 Erdman Ford",
      city: "East Daphne",
      state: "Kentucky",
    },
    {
      firstName: "Raquel",
      lastName: "Kohler",
      address: "769 Dominic Grove",
      city: "Columbus",
      state: "Ohio",
    },
    {
      firstName: "Ervin",
      lastName: "Reinger",
      address: "566 Brakus Inlet",
      city: "South Linda",
      state: "West Virginia",
    },
    {
      firstName: "Brittany",
      lastName: "McCullough",
      address: "722 Emie Stream",
      city: "Lincoln",
      state: "Nebraska",
    },
    {
      firstName: "Branson",
      lastName: "Frami",
      address: "32188 Larkin Turnpike",
      city: "Charleston",
      state: "South Carolina",
    },
  ];

  const columns = useMemo(
    () => [
      //column definitions...
      {
        accessorKey: "firstName",
        header: "First Name",
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
      },

      {
        accessorKey: "address",
        header: "Address",
      },
      {
        accessorKey: "city",
        header: "City",
      },

      {
        accessorKey: "state",
        header: "State",
      }, //end
    ],
    []
  );
  const [tableData, setTableData] = useState(() => data);

  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
    tableData[row.index] = values;
    //send/receive api updates here
    setTableData([...tableData]);
    exitEditingMode(); //required to exit editing mode
  };

  const [oemList, setOemList] = useState([]);
  const [oem, setOem] = useState("");
  const [oemOptionsList, setOemOptionsList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [client, setclient] = useState("");
  const [clientOptionsList, setClientOptionsList] = useState([]);
  const [sectorList, setSectorList] = useState([]);
  const [sector, setSector] = useState("");
  const [sectorOptionsList, setSectorOptionsList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [productOptionsList, setProductOptionsList] = useState([]);
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  /*---------------------------------------------------------------------
             END MODAL VARIABLES
-----------------------------------------------------------------------*/

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
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}oem/oem-get-order`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setSectorList(data.sectors);
          const transformedData = data.sectors.map((item) => ({
            value: item.sectorCode,
            label: item.sectorName,
          }));
          setSectorOptionsList(transformedData);
          setClientList(data.clients);
          setProductList(data.products);
          setOemList(data.oems);
          const transformedData1 = data.oems.map((oem) => ({
            value: oem.oemCode,
            label: oem.oemName,
          }));
          setOemOptionsList(transformedData1);
        }
      } catch (error) {
        console.error("Error fetching sector:", error);
      }
    };

    fetchOrder();
  }, []);

  const handleChangeSector = (value) => {
    setSector(value.value);
    //  console.log(sector);
    const transformedData1 = clientList
      .filter((item) => item.sectorCode === value.value)
      .map((item) => ({
        value: item.clientName,
        label: item.clientName,
      }));
    setClientOptionsList(transformedData1);
  };
  const handleChangeClient = (value) => {
    setclient(value.value);
    const transformedData2 = clientList
      .find((item) => item.clientName === value.value)
      ?.departments.map((dept, index) => ({
        value: dept,
        label: dept,
      }));
    setDepartment(transformedData2);
  };

  const handleOemChange = (value) => {
    setOem(value.value);

    const transformedData1 = productList
      .filter((item) => item.oemCode === value.value)
      .map((item) => ({
        value: item.categoryName,
        label: item.categoryName,
      }));
    setCategory(transformedData1);
  };
  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/

  /*--------------------------------------------------------------------------------
--------------------------------Create oem Data--------------------------------
----------------------------------------------------------------------------------*/

  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/

  /*--------------------------------------------------------------------------------
--------------------------------Edit oem Data--------------------------------
----------------------------------------------------------------------------------*/

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
                  <h4 className="card-title">Product List</h4>
                </div>
                <div className="d-flex justify-content-between">
                  <Button className="text-center btn-primary btn-icon me-2 mt-lg-0 mt-md-0 mt-3">
                    <span>View</span>
                  </Button>
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
                    <span>New Order</span>
                  </Button>
                </div>
              </Card.Header>
              {/*======================= MODAL TO ADD ORDER======================= */}
              <Modal
                show={show}
                fullscreen={fullscreen}
                onHide={() => setShow(false)}
              >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  <Form>
                    <Row>
                      <Col xl="12" lg="12">
                        <Card>
                          <Card.Body>
                            <div className="new-user-info">
                              <div className="row">
                                <Form.Group className="col-md-2 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Sector:
                                  </label>

                                  <Select
                                    aria-labelledby="aria-label"
                                    inputId="aria-example-input"
                                    name="aria-live-color"
                                    onMenuOpen={onMenuOpen}
                                    onMenuClose={onMenuClose}
                                    options={sectorOptionsList}
                                    onChange={handleChangeSector}
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-2 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Organisation:
                                  </label>

                                  <Select
                                    aria-labelledby="aria-label"
                                    inputId="aria-example-input"
                                    name="aria-live-color"
                                    onMenuOpen={onMenuOpen}
                                    onMenuClose={onMenuClose}
                                    options={clientOptionsList}
                                    onChange={handleChangeClient}
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-2 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Department:
                                  </label>

                                  <Select
                                    aria-labelledby="aria-label"
                                    inputId="aria-example-input"
                                    name="aria-live-color"
                                    onMenuOpen={onMenuOpen}
                                    onMenuClose={onMenuClose}
                                    options={department}
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-2 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Order Id:
                                  </label>
                                  <Form.Control
                                    type="text"
                                    id="order"
                                    placeholder="Order..."
                                    style={{ border: "1px solid #c5bfc5" }}
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-1 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Order Date:
                                  </label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      placeholder="Select Date... "
                                      style={{ border: "1px solid #c5bfc5" }}
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group className="col-md-2 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Challan No:
                                  </label>
                                  <Form.Control
                                    type="text"
                                    id="challan"
                                    placeholder="Challan..."
                                    style={{ border: "1px solid #c5bfc5" }}
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-1 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Challan Date:
                                  </label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      placeholder="Select Date... "
                                      style={{ border: "1px solid #c5bfc5" }}
                                    />
                                  </div>
                                </Form.Group>
                              </div>
                              <hr />
                              <div></div>
                            </div>
                            <div className="new-user-info">
                              <div className="row">
                                <Form.Group className="col-md-3 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Oem:
                                  </label>

                                  <Select
                                    aria-labelledby="aria-label"
                                    inputId="aria-example-input"
                                    name="aria-live-color"
                                    onMenuOpen={onMenuOpen}
                                    onMenuClose={onMenuClose}
                                    options={oemOptionsList}
                                    onChange={handleOemChange}
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-3 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Category:
                                  </label>

                                  <Select
                                    aria-labelledby="aria-label"
                                    inputId="aria-example-input"
                                    name="aria-live-color"
                                    onMenuOpen={onMenuOpen}
                                    onMenuClose={onMenuClose}
                                    options={category}
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-3 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Model:
                                  </label>

                                  <Select
                                    aria-labelledby="aria-label"
                                    inputId="aria-example-input"
                                    name="aria-live-color"
                                    onMenuOpen={onMenuOpen}
                                    onMenuClose={onMenuClose}
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-3 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Specification:
                                  </label>

                                  <Select
                                    aria-labelledby="aria-label"
                                    inputId="aria-example-input"
                                    name="aria-live-color"
                                    onMenuOpen={onMenuOpen}
                                    onMenuClose={onMenuClose}
                                  />
                                </Form.Group>
                              </div>
                            </div>
                            <div className="new-user-info">
                              <div className="row">
                                <Form.Group className="col-md-2 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Oem Start Date:
                                  </label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      placeholder="Select Date... "
                                      style={{
                                        border: "1px solid #c5bfc5",
                                      }}
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group className="col-md-2 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Oem End Date:
                                  </label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      placeholder="Select Date... "
                                      style={{
                                        border: "1px solid #c5bfc5",
                                      }}
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group className="col-md-2 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Warranty Start Date:
                                  </label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      placeholder="Select Date... "
                                      style={{
                                        border: "1px solid #c5bfc5",
                                      }}
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group className="col-md-2 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Warrenty End Date:
                                  </label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      placeholder="Select Date... "
                                      style={{
                                        border: "1px solid #c5bfc5",
                                      }}
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group className="col-md-4 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Serial No:
                                  </label>
                                  <Form.Control
                                    type="text"
                                    id="challan"
                                    placeholder="xxxx-xxxx-xxxx-xxxx"
                                    style={{
                                      border: "1px solid #c5bfc5",
                                    }}
                                  />
                                </Form.Group>
                                <div className="bd-example">
                                  <Button
                                    type="button"
                                    variant="btn btn-primary"
                                    style={{
                                      float: "right",
                                      marginBottom: "18px",
                                    }}
                                  >
                                    Add item
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <div className="new-user-info">
                              <div className="row">
                                <MaterialReactTable
                                  columns={columns}
                                  data={tableData}
                                  editingMode="row"
                                  enableEditing
                                  onEditingRowSave={handleSaveRow}
                                />
                              </div>
                              <div className="bd-example">
                                <Button
                                  type="button"
                                  variant="btn btn-primary"
                                  style={{
                                    float: "right",
                                    marginTop: "18px",
                                  }}
                                >
                                  Submit Order
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Form>
                </Modal.Body>
              </Modal>
              {/*=======================END MODAL TO ADD OEM======================= */}

              {/*======================= MODAL TO EDIT OEM======================= */}

              {/*======================= END MODAL TO EDIT CLIENT======================= */}

              <Card.Body className="px-0"></Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AddOrder;
