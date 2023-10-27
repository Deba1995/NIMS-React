import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Modal,
  ProgressBar,
} from "react-bootstrap";
import Select from "react-select";
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

const OemProduct = () => {
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
      { title: "Category" },
      { title: "Sub Category" },
      { title: "Model" },
      { title: "Specification" },
    ],
    data: [],
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  // Function to update the progress
  const updateProgressUI = (newProgress) => {
    setProgress(newProgress);
  };
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

  const onMenuOpen = () => setIsMenuOpen(true);
  const onMenuClose = () => setIsMenuOpen(false);
  /*---------------------------------------------------------------------
             END MODAL VARIABLES
-----------------------------------------------------------------------*/

  const [oemCode, setOemCode] = useState(""); // Adding oem name to send data
  const [oemCategory, setOemCategory] = useState(""); //Adding category to send data
  const [oemSubCategory, setOemSubCategory] = useState(""); //Adding subcategory to send data
  const [oemModel, setOemModel] = useState(""); // Adding oem model to send data
  const [oemSpecification, setOemSpecification] = useState(""); // Adding Secification oem to send data

  const [oemList, setOemList] = useState([]); // Storing fetched oem data for display
  const [oemProductList, setOemProductList] = useState([]); // Storing fetched product oem data
  const [oemOptionsList, setOemOptionsList] = useState([]);
  const [oemOptionsListCategory, setOemOptionsListCategory] = useState([]);
  const [oemOptionsListSubCategory, setOemOptionsListSubCategory] = useState(
    []
  );
  const [newOption, setNewOption] = useState([]);
  const [newOptionSubCat, setNewOptionSubCat] = useState([]);
  // To update Oem data
  const [selectedId, setSelectedId] = useState("");
  const [selectedOemCode, setSelectedOemCode] = useState("");
  const [selectedOemCategory, setSelectedOemCategory] = useState("");
  const [selectedOemSubCategory, setSelectedOemSubCategory] = useState("");
  const [selectedOemModel, setSelectedOemModel] = useState("");
  const [selectedOemSpecification, setSelectedOemSpecification] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [csvFile, setCSVFile] = useState(null);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleFileChange = (e) => {
    setCSVFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    // Add your upload logic here, including processing the CSV file
    // console.log("Uploading CSV file:", csvFile);
    closeModal();
    if (csvFile) {
      const formData = new FormData();
      formData.append("csvfile", csvFile);

      try {
        // Send the CSV file to the server for processing
        const response = await fetch(
          `${API_BASE_URL}oem/oem-add-product/upload`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
        const reader = response.body.getReader();
        const contentLength = +response.headers.get("content-length");
        let receivedLength = 0;
        let chunks = [];

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }
          chunks.push(value);
          receivedLength += value.length;

          // Calculate the progress percentage
          const progress = Math.round((receivedLength / contentLength) * 100);
          updateProgressUI(progress);
        }
        // Combine the chunks into a single response body
        const responseData = new Uint8Array(receivedLength);
        let offset = 0;
        for (const chunk of chunks) {
          responseData.set(chunk, offset);
          offset += chunk.length;
        }

        const result = new TextDecoder("utf-8").decode(responseData);
        const data = JSON.parse(result);
        // const data = await response.json();
        if (data.success) {
          handleSuccess(data.message);
          const newProductList = [];
          const savedData = data.docs;

          savedData.forEach((doc) => {
            newProductList.push(doc);
          });
          setOemProductList([...oemProductList, ...newProductList]);
          setOemCategory("");
          setOemSubCategory("");
          setOemModel("");
          setOemSpecification("");
          setOemCode("");
        } else {
          handleError(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      handleError("No CSV file selected");
    }
  };

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
    const fetchOemProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}oem/oem-get-product`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setOemProductList(data.oemProduct);
          setOemList(data.oems);
          // Transform the data
          const transformedData = data.oems.map((oem) => ({
            value: oem.oemCode,
            label: oem.oemName,
          }));
          // Set the oemOptionsList
          setOemOptionsList(transformedData);

          const transformedData1 = data.oemCategory.map((oem) => ({
            value: oem.categoryName,
            label: oem.categoryName,
          }));
          setOemOptionsListCategory(transformedData1);

          const transformedData2 = data.oemSubCategory.map((oem) => ({
            value: oem.subcategoryName,
            label: oem.subcategoryName,
          }));
          setOemOptionsListSubCategory(transformedData2);

          // handleSuccess(data.message);
        }
      } catch (error) {
        console.error("Error fetching sector:", error);
      }
    };

    fetchOemProducts();
  }, []);

  const handleOemChange = (inpValue) => {
    setOemCode(inpValue);
  };
  const handleCategoryChange = (inpValue) => {
    setOemCategory(inpValue);
  };
  const handleSubCategoryChange = (inpValue) => {
    setOemSubCategory(inpValue);
  };

  const handleKeyDownCategory = (e) => {
    if (e.key === "Enter") {
      if (
        !oemOptionsListCategory.find((option) => option.label === newOption)
      ) {
        // Create a new option and add it to the list
        const newOptionData = { value: newOption, label: newOption };
        setOemOptionsListCategory([...oemOptionsListCategory, newOptionData]);
      }
    }
  };
  const handleInputChangeCategory = (inputValue) => {
    setNewOption(inputValue);
  };

  const handleKeyDownSubCategory = (e) => {
    if (e.key === "Enter") {
      if (
        !oemOptionsListSubCategory.find(
          (option) => option.label === newOptionSubCat
        )
      ) {
        // Create a new option and add it to the list
        const newOptionSubData = {
          value: newOptionSubCat,
          label: newOptionSubCat,
        };
        setOemOptionsListSubCategory([
          ...oemOptionsListSubCategory,
          newOptionSubData,
        ]);
      }
    }
  };
  const handleInputChangeSubCategory = (inputValue) => {
    setNewOptionSubCat(inputValue);
  };
  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
  useEffect(() => {
    // Update dataTableOptions whenever oems changes
    const newDataTableOptions = {
      ...dataTableOptions,
      data: oemProductList.map((oem) => [
        oemList.find((item) => item.oemCode === oem.oemCode)?.oemName,
        oem.categoryName,
        oem.subcategoryName,
        oem.modelName,
        oem.additionalInfo,
      ]),
    };
    setDataTableOptions(newDataTableOptions);
  }, [oemProductList]);
  /*--------------------------------------------------------------------------------
--------------------------------Create oem Data--------------------------------
----------------------------------------------------------------------------------*/

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}oem/oem-add-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          oemCode: oemCode?.value,
          categoryName: oemCategory?.value,
          subcategoryName: oemSubCategory?.value,
          modelName: oemModel,
          additionalInfo: oemSpecification,
        }),
      });

      const data = await response.json();

      if (data.success) {
        handleSuccess(data.message);
        setOemProductList([...oemProductList, data.oemProduct]);
        setOemCategory("");
        setOemSubCategory("");
        setOemModel("");
        setOemSpecification("");
        setOemCode("");
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
        console.error("Failed to add product");
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
    setSelectedOemCode(item.oemCode);
    setSelectedOemCategory(item.categoryName);
    setSelectedOemSubCategory(item.subcategoryName);
    setSelectedOemModel(item.modelName);
    setSelectedOemSpecification(item.additionalInfo);
    setSelectedId(item._id);
  };

  async function handleSubmitUpdate(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE_URL}oem/oem-update-product/${selectedId}`, // Replace `clientId` with the actual ID
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            oemCode: selectedOemCode,
            categoryName: selectedOemCategory,
            subcategoryName: selectedOemSubCategory,
            modelName: selectedOemModel,
            additionalInfo: selectedOemSpecification,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);
        const updatedOemProduct = [...oemProductList];
        const updatedOemProductIndex = updatedOemProduct.findIndex(
          (item) => item._id === selectedId
        );

        if (updatedOemProductIndex !== -1) {
          updatedOemProduct[updatedOemProductIndex] = {
            ...updatedOemProduct[updatedOemProductIndex], // Copy existing client properties
            oemCode: selectedOemCode,
            categoryName: selectedOemCategory,
            subcategoryName: selectedOemSubCategory,
            modelName: selectedOemModel,
            additionalInfo: selectedOemSpecification,
          };
        }
        setOemProductList(updatedOemProduct);
        setSelectedOemCode("");
        setSelectedOemCategory("");
        setSelectedOemSubCategory("");
        setSelectedOemModel("");
        setSelectedOemSpecification("");

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
    if (window.confirm("Are you sure you want to delete this Product?")) {
      deleteOemProduct(item._id);
    }
  };

  const deleteOemProduct = async (deleteId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}oem/oem-delete-product/${deleteId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);
        const updatedOemProduct = oemProductList.filter(
          (item) => item._id !== deleteId
        );
        setOemProductList(updatedOemProduct);
      } else {
        handleError("Failed to delete product");
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
              <div>
                <ProgressBar now={progress} label={`${progress}%`} />
                {/* Render other components or content here */}
              </div>
              <Card.Header className="d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">Product List</h4>
                </div>
                <div className="d-flex justify-content-between">
                  <Button
                    className="text-center btn-primary btn-icon me-2 mt-lg-0 mt-md-0 mt-3"
                    onClick={openModal}
                  >
                    <span>Upload CSV</span>
                  </Button>
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
                    <span>New Product</span>
                  </Button>
                </div>
              </Card.Header>
              <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                  <Modal.Title>CSV Upload Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleUpload}>
                    Confirm Upload
                  </Button>
                </Modal.Footer>
              </Modal>
              {/*======================= MODAL TO ADD OEM======================= */}
              <MDBModal show={optSmModal} tabIndex="-1" setShow={setOptSmModal}>
                <MDBModalDialog size="xl">
                  <MDBModalContent>
                    <MDBModalHeader>
                      <MDBModalTitle>New Product Information</MDBModalTitle>
                      <MDBBtn
                        className="btn-close"
                        color="none"
                        onClick={toggleShow}
                      ></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                      <Form onSubmit={(e) => handleSubmit(e)}>
                        <div className="row">
                          <Form.Group className="col-md-3 form-group">
                            <label
                              style={style.label}
                              id="aria-label"
                              htmlFor="aria-example-input"
                            >
                              Oem Name:
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
                          <Form.Group className="col-md-3  form-group">
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
                              options={oemOptionsListCategory}
                              onChange={handleCategoryChange}
                              onKeyDown={handleKeyDownCategory}
                              onInputChange={handleInputChangeCategory}
                            />
                          </Form.Group>
                          <Form.Group className="col-md-3  form-group">
                            <label
                              style={style.label}
                              id="aria-label"
                              htmlFor="aria-example-input"
                            >
                              SubCategory:
                            </label>

                            <Select
                              aria-labelledby="aria-label"
                              inputId="aria-example-input"
                              name="aria-live-color"
                              onMenuOpen={onMenuOpen}
                              onMenuClose={onMenuClose}
                              options={oemOptionsListSubCategory}
                              onChange={handleSubCategoryChange}
                              onKeyDown={handleKeyDownSubCategory}
                              onInputChange={handleInputChangeSubCategory}
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
                            <Form.Control
                              type="text"
                              id="model"
                              value={oemModel}
                              onChange={(e) => setOemModel(e.target.value)}
                              placeholder="Model..."
                              style={{ minHeight: "38px" }}
                            />
                          </Form.Group>
                        </div>
                        <hr />
                        <div className="row">
                          <Form.Group className="col-md-4 form-group">
                            <Form.Label htmlFor="spect">
                              Specifications :
                            </Form.Label>
                            <InputGroup
                              className=""
                              style={{ maxHeight: "200px" }}
                              placeholder="Specification "
                            />
                            <textarea
                              className="form-control"
                              aria-label="With textarea"
                              style={{
                                minHeight: "130px",
                                width: "100%",
                              }}
                              value={oemSpecification}
                              onChange={(e) =>
                                setOemSpecification(e.target.value)
                              }
                            ></textarea>
                          </Form.Group>
                        </div>
                        <hr />
                        <Button
                          type="button"
                          variant="btn btn-primary"
                          style={{ float: "right" }}
                          onClick={(e) => handleSubmit(e)}
                        >
                          Add Product
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
                      <MDBModalTitle>Edit Product Information</MDBModalTitle>
                      <MDBBtn
                        className="btn-close"
                        color="none"
                        onClick={toggleShow1}
                      ></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                      <Form onSubmit={(e) => handleSubmitUpdate(e)}>
                        <div className="row">
                          <Form.Group className="col-md-3 form-group">
                            <label
                              style={style.label}
                              id="aria-label"
                              htmlFor="aria-example-input"
                            >
                              Oem Name:
                            </label>

                            <Form.Control
                              type="text"
                              id="cname"
                              disabled={true}
                              value={
                                selectedOemCode &&
                                `${
                                  oemList.find(
                                    (oem) => oem.oemCode === selectedOemCode
                                  )?.oemName || ""
                                }`
                              }
                              onChange={(e) =>
                                setSelectedOemCode(e.target.value)
                              }
                              placeholder="Oem Name"
                            />
                          </Form.Group>
                          <Form.Group className="col-md-3  form-group">
                            <label
                              style={style.label}
                              id="aria-label"
                              htmlFor="aria-example-input"
                            >
                              Category:
                            </label>

                            <Form.Control
                              type="text"
                              id="cname"
                              disabled={true}
                              value={selectedOemCategory}
                              placeholder="Oem Name"
                              onChange={(e) =>
                                setSelectedOemCategory(e.target.value)
                              }
                            />
                          </Form.Group>
                          <Form.Group className="col-md-3  form-group">
                            <label
                              style={style.label}
                              id="aria-label"
                              htmlFor="aria-example-input"
                            >
                              SubCategory:
                            </label>

                            <Form.Control
                              type="text"
                              id="cname"
                              disabled={true}
                              value={selectedOemSubCategory}
                              placeholder="Oem Name"
                              onChange={(e) =>
                                setSelectedOemSubCategory(e.target.value)
                              }
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
                            <Form.Control
                              type="text"
                              id="model"
                              value={selectedOemModel}
                              onChange={(e) =>
                                setSelectedOemModel(e.target.value)
                              }
                              placeholder="Model..."
                              style={{ minHeight: "38px" }}
                            />
                          </Form.Group>
                        </div>
                        <hr />
                        <div className="row">
                          <Form.Group className="col-md-4 form-group">
                            <Form.Label htmlFor="spect">
                              Additional Info :
                            </Form.Label>
                            <InputGroup
                              className=""
                              style={{ maxHeight: "200px" }}
                              placeholder="Specification "
                            />
                            <textarea
                              className="form-control"
                              aria-label="With textarea"
                              style={{
                                minHeight: "130px",
                                width: "100%",
                              }}
                              value={selectedOemSpecification}
                              onChange={(e) =>
                                setSelectedOemSpecification(e.target.value)
                              }
                            ></textarea>
                          </Form.Group>
                        </div>
                        <hr />
                        <Button
                          type="button"
                          variant="btn btn-primary"
                          style={{ float: "right" }}
                          onClick={(e) => handleSubmitUpdate(e)}
                        >
                          Edit Product
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
                      <MDBModalTitle>View Product Information</MDBModalTitle>
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
                        <th>Category</th>
                        <th>SubCategory</th>
                        <th>Model</th>
                        <th style={{ float: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {oemProductList.map((item, id) => (
                        <tr key={id}>
                          <td>
                            {
                              oemList.find(
                                (oem) => oem.oemCode === item.oemCode
                              )?.oemName
                            }
                          </td>
                          <td>{item.categoryName}</td>
                          <td>{item.subcategoryName}</td>
                          <td>{item.modelName}</td>
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

export default OemProduct;
