import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Modal,
  Form,
  Button,
  ButtonGroup,
  Dropdown,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Card from "../../../components/Card";
import { API_BASE_URL } from "../../../config/serverApiConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubCategory = () => {
  const [show, setShow] = useState(false); //MODAL TO ADD oem
  const [show1, setShow1] = useState(false); //MODAL TO ADD oem
  const [show2, setShow2] = useState(false); //MODAL TO ADD NEW oem IN EDIT
  const [showEdit, setShowEdit] = useState(false); //MODAL TO EDIT oem
  const [showEdit1, setShowEdit1] = useState(false); //MODAL TO EDIT oem
  const [showView, setShowView] = useState(false); //MODAL TO View oem
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleShow1 = () => setShow1(true);
  const handleShow2 = () => setShow2(true);
  const handleClose1 = () => setShow1(false);
  const handleClose2 = () => setShow2(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleCloseEdit1 = () => setShowEdit1(false);
  const handleCloseView = () => setShowView(false);

  const [subCategoriesList, setSubCategoriesList] = useState([]);
  const [subcategory, setSubCategory] = useState("");
  const [selectedParent, setselectedParent] = useState("");

  const [newAddEditTag, setnewAddEditTag] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  //Updating variables/state
  const [selectedParentEdit, setselectedParentEdit] = useState({
    parentType: "",
  });
  const [selectedSubCategoryEdit, setSelectedSubCategoryEdit] = useState({
    SubCategoryName: "",
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [newEditTag, setnewEditTag] = useState({
    modelName: "",
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
  /*--------------------------------------------------------------------------------
--------------------------------Start Fetch oem Data--------------------------------
----------------------------------------------------------------------------------*/
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}oem/oem-get-subcategory`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          console.log(data.subcategory);
          setSubCategoriesList(data.subcategory);
        }
      } catch (error) {
        console.error("Error fetching Model:", error);
      }
    };

    fetchSubCategories();
  }, []);
  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/

  /*--------------------------------------------------------------------------------
--------------------------------Create oem Data--------------------------------
----------------------------------------------------------------------------------*/

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}oem/oem-add-subcategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          parentType: selectedParent,
          SubCategoryName: subcategory,
          tags,
        }),
      });

      const data = await response.json();

      if (data.success) {
        handleSuccess(data.message);
        if (data.subcategory) {
          console.log(data.subcategory);
          setSubCategoriesList([...subCategoriesList, data.subcategory]);
        } else {
          setSubCategoriesList([...subCategoriesList]);
        }

        setselectedParent("");
        setSubCategory({ SubCategoryName: "" });
        setTags([]);
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
        console.error("Failed to add Model");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleOemChange = (e) => {
    const selectedParent = e.target.value;
    setselectedParent(selectedParent);
  };

  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      setTags([...tags, newTag]);
      setNewTag("");
      handleSuccess("Tag added");
      handleClose1();
    } else {
      handleError("Tag name cannot be empty");
    }
  };

  const handleRemoveTag = (index) => {
    const updatedModel = [...tags];
    updatedModel.splice(index, 1);
    setTags(updatedModel);
    handleSuccess("Tag removed");
  };
  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
  /*--------------------------------------------------------------------------------
--------------------------------Edit oem Data--------------------------------
----------------------------------------------------------------------------------*/

  const handleEditClick = (item) => {
    setShowEdit(true);
    setselectedParentEdit({ parentType: item.parentType });
    setSelectedSubCategoryEdit({ SubCategoryName: item.SubCategoryName });
  };

  useEffect(() => {
    const filteredsubcategory = subCategoriesList
      .find((item) => item.parentType === selectedParentEdit.parentType)
      ?.subcategories.find(
        (subcategory) =>
          subcategory.SubCategoryName ===
          selectedSubCategoryEdit.SubCategoryName
      )?.tags;

    setSelectedTags(filteredsubcategory || []);
  }, [selectedSubCategoryEdit, selectedParentEdit, subCategoriesList]);

  const handleAddEditTag = () => {
    if (newAddEditTag.trim() !== "") {
      setSelectedTags([...selectedTags, newAddEditTag]);
      setnewAddEditTag("");
      handleSuccess("Tag added");
      handleClose2();
    } else {
      handleError("Tag name cannot be empty");
    }
  };

  const handleRemoveEditTag = (index) => {
    setSelectedTags((prevTags) => {
      const updatedTags = [...prevTags];
      updatedTags.splice(index, 1);
      return updatedTags;
    });
    handleSuccess("Tag removed");
  };
  const handleEditModel = (item, index) => {
    setShowEdit1(true);
    setnewEditTag({ tags: item, index: index });
  };
  const handleChangeTag = (e, newEditTag) => {
    e.preventDefault();
    if (newEditTag.tags.trim() !== "") {
      setSelectedTags((prevtag) => {
        return prevtag.map((item, i) => {
          if (i === newEditTag.index) {
            return newEditTag.tags;
          }
          return item;
        });
      });
      handleSuccess("Tag changed successfully");
      handleCloseEdit1();
    } else {
      handleError("Tag name cannot be empty");
    }
  };
  async function handleSubmitUpdate(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE_URL}oem/oem-update-subcategory/${selectedParentEdit.parentType}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            parentType: selectedParentEdit.parentType,
            SubCategoryName: selectedSubCategoryEdit.SubCategoryName,
            tags: selectedTags,
          }),
        }
      );
      const data = await response.json();
      handleSuccess(data.message);
      if (data.success) {
        const updatedsubCategory = [...subCategoriesList];
        const updatedsubCategoryIndex = updatedsubCategory.findIndex(
          (subcategory) => subcategory.parentType === selectedTags.parentType
        );
        if (updatedsubCategoryIndex !== -1) {
          updatedsubCategory[updatedsubCategoryIndex] = {
            ...updatedsubCategory[updatedsubCategoryIndex],
            parentType: selectedParentEdit.parentType,
            SubCategoryName: selectedSubCategoryEdit.SubCategoryName,
            tags: selectedTags,
          };
        }
        setSubCategoriesList(updatedsubCategory);

        handleCloseEdit();
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

  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/

  /*--------------------------------------------------------------------------------
--------------------------------view oem Data--------------------------------
----------------------------------------------------------------------------------*/
  const handleViewClick = (index) => {
    setShowView(true);

    setselectedParent({ oemCode: index.oemCode });
  };

  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
  /*--------------------------------------------------------------------------------
--------------------------------Delete oem Data--------------------------------
----------------------------------------------------------------------------------*/
  const handleDeleteClick = (index) => {
    if (
      window.confirm(
        "Are you sure you want to delete models associated with this OEM?"
      )
    ) {
      deleteSubCategory(index._id);
    }
  };

  const deleteSubCategory = async (subcategoryId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}oem/oem-delete-subcategory/${subcategoryId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);

        const updatedsubCategory = subCategoriesList.filter(
          (subcategory) => subcategory._id !== subcategoryId
        );

        setSubCategoriesList(updatedsubCategory);
      } else {
        handleError("Failed to delete model");
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
                  <h4 className="card-title">Model List</h4>
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
                  <span> Add New</span>
                </Button>
              </Card.Header>
              {/*======================= MODAL TO ADD model======================= */}
              <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  <Form onSubmit={(e) => handleSubmit(e)}>
                    <Row>
                      <Col xl="12" lg="8">
                        <Card>
                          <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                              <h4 className="card-title">
                                Add New subcategories
                              </h4>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <div className="new-user-info">
                              <div className="row">
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="name">
                                    Parent:
                                  </Form.Label>
                                  <select
                                    name="type"
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                    onChange={handleOemChange}
                                  >
                                    <option>Select</option>
                                    <option>Desktop</option>
                                    <option>Laptop</option>
                                    <option>Printer</option>
                                  </select>
                                </Form.Group>

                                <Form.Group className="col-md-6  form-group">
                                  <Form.Label htmlFor="fname">
                                    Subcategory:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="cname"
                                    onChange={(e) =>
                                      setSubCategory(e.target.value)
                                    }
                                    placeholder="Subcategory Name"
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
                                  <h5 className="">Tags</h5>
                                </div>

                                {/*======================= MODAL TO ADD Model========================== */}
                                <Modal show={show1} onHide={handleClose1}>
                                  <Modal.Header closeButton>
                                    <Modal.Title>Add new Tag</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <Form.Group
                                      className="mb-3"
                                      controlId="formBasicPassword"
                                      onSubmit={(e) => e.preventDefault()}
                                    >
                                      <Form.Label>Tag name</Form.Label>
                                      <Form.Control
                                        type="text"
                                        value={newTag}
                                        onChange={(e) =>
                                          setNewTag(e.target.value)
                                        }
                                        placeholder="Tag Name"
                                      />
                                      <Form.Control.Feedback className="invalid">
                                        Example invalid feedback text
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                    <Button
                                      type="submit"
                                      variant="primary"
                                      onClick={handleAddTag}
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
                                {/*======================= END MODAL TO ADD Model======================= */}
                              </div>

                              {tags.map((tag, index) => (
                                <div style={{ marginTop: "12px" }} key={index}>
                                  <Dropdown as={ButtonGroup}>
                                    <Button
                                      type="button"
                                      style={{
                                        backgroundColor: "gray",
                                        border: "2px solid gray",
                                      }}
                                    >
                                      {tag}
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
                                        Toggle Dropdow
                                      </span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item
                                        onClick={() => handleRemoveTag(index)}
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
                              Add Oem
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Form>
                </Modal.Body>
              </Modal>
              {/*=======================END MODAL TO ADD model ======================= */}

              {/*======================= MODAL TO EDIT model======================= */}
              <Modal show={showEdit} onHide={() => setShowEdit(false)}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  <Form onSubmit={(e) => handleSubmitUpdate(e)}>
                    <Row>
                      <Col xl="12" lg="8">
                        <Card>
                          <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                              <h4 className="card-title">Model Information</h4>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <div className="new-user-info">
                              <div className="row">
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="fname">
                                    Parent:
                                  </Form.Label>
                                  <select
                                    name="type"
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                    defaultValue={selectedParentEdit.parentType}
                                  >
                                    <option>
                                      {selectedParentEdit.parentType}
                                    </option>
                                  </select>
                                </Form.Group>

                                <Form.Group className="col-md-6  form-group">
                                  <Form.Label htmlFor="cat">
                                    SubCategories :
                                  </Form.Label>
                                  <select
                                    name="type"
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                    value={
                                      selectedSubCategoryEdit.SubCategoryName
                                    }
                                    onChange={(e) =>
                                      setSelectedSubCategoryEdit({
                                        SubCategoryName: e.target.value,
                                      })
                                    }
                                  >
                                    <option>Select Category</option>
                                    {subCategoriesList
                                      .find(
                                        (item) =>
                                          item.parentType ===
                                          selectedParentEdit.parentType
                                      )
                                      ?.subcategories.map((item, index) => (
                                        <option
                                          key={index}
                                          value={item.SubCategoryName}
                                        >
                                          {item.SubCategoryName}
                                        </option>
                                      ))}
                                  </select>
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
                                  <h5 className="">Tag</h5>
                                </div>
                                {/*========================= MODAL TO ADD model IN EDIT CLIENT ====================================*/}
                                <Modal show={show2} onHide={handleClose2}>
                                  <Modal.Header closeButton>
                                    <Modal.Title>Add new Tag</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <Form.Group
                                      className="mb-3"
                                      controlId="formBasicPassword"
                                      onSubmit={(e) => e.preventDefault()}
                                    >
                                      <Form.Label>Tag name</Form.Label>
                                      <Form.Control
                                        type="text"
                                        value={newAddEditTag}
                                        onChange={(e) =>
                                          setnewAddEditTag(e.target.value)
                                        }
                                        placeholder="Tag Name"
                                      />
                                      <Form.Control.Feedback className="invalid">
                                        Example invalid feedback text
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                    <Button
                                      type="submit"
                                      variant="primary"
                                      onClick={handleAddEditTag}
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

                                {/*========================= END MODAL TO ADD model IN EDIT OEM ====================================*/}

                                {/*=========================  MODAL TO EDIT model IN EDIT OEM ====================================*/}
                                <Modal
                                  show={showEdit1}
                                  onHide={handleCloseEdit1}
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>Update Tag</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <Form>
                                      <Form.Group
                                        className="mb-3"
                                        controlId="formSector"
                                      >
                                        <Form.Label> Update Tag </Form.Label>
                                        <Form.Control
                                          type="text"
                                          value={newEditTag.modelName}
                                          onChange={(e) =>
                                            setnewEditTag({
                                              modelName: e.target.value,
                                              index: newEditTag.index,
                                            })
                                          }
                                          placeholder="Model Name"
                                        />
                                      </Form.Group>
                                      <Button
                                        type="button"
                                        variant="primary"
                                        onClick={(e) =>
                                          handleChangeTag(e, newEditTag)
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

                                {/*========================= END MODAL TO EDIT category IN EDIT OEM ====================================*/}

                                {/*=========================  MODAL TO EDIT model IN EDIT OEM ====================================*/}
                                <Modal
                                  show={showEdit1}
                                  onHide={handleCloseEdit1}
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>Update Tag</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <Form>
                                      <Form.Group
                                        className="mb-3"
                                        controlId="formSector"
                                      >
                                        <Form.Label> Update Tag </Form.Label>
                                        <Form.Control
                                          type="text"
                                          value={newEditTag.tags}
                                          onChange={(e) =>
                                            setnewEditTag({
                                              tags: e.target.value,
                                              index: newEditTag.index,
                                            })
                                          }
                                          placeholder="tag Name"
                                        />
                                      </Form.Group>
                                      <Button
                                        type="button"
                                        variant="primary"
                                        onClick={(e) =>
                                          handleChangeTag(e, newEditTag)
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
                              </div>
                              {/*========================= END MODAL TO EDIT category IN EDIT OEM ====================================*/}
                              {selectedTags.map((tag, index) => (
                                <div style={{ marginTop: "12px" }} key={index}>
                                  <Dropdown as={ButtonGroup}>
                                    <Button
                                      type="button"
                                      style={{
                                        backgroundColor: "gray",
                                        border: "2px solid gray",
                                      }}
                                      value={tag}
                                    >
                                      {tag}
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
                                          handleEditModel(tag, index)
                                        }
                                      >
                                        Edit
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={() =>
                                          handleRemoveEditTag(index)
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
                              Update Tag
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
                        <th>Oem Name</th>
                        <th style={{ float: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subCategoriesList.map((item, index) => (
                        <tr className="" key={index}>
                          <td className="">{item.parentType}</td>
                          <td>
                            <div style={{ float: "right" }}>
                              <Link
                                className="btn btn-sm btn-icon text-primary flex-end"
                                data-toggle="tooltip"
                                title=" views oem"
                                onClick={() => handleViewClick(item)}
                              >
                                <span className="btn-inner">
                                  <svg
                                    width="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      id="Ellipse 158"
                                      d="M22.4541 11.3918C22.7819 11.7385 22.7819 12.2615 22.4541 12.6082C21.0124 14.1335 16.8768 18 12 18C7.12317 18 2.98759 14.1335 1.54586 12.6082C1.21811 12.2615 1.21811 11.7385 1.54586 11.3918C2.98759 9.86647 7.12317 6 12 6C16.8768 6 21.0124 9.86647 22.4541 11.3918Z"
                                      stroke="#130F26"
                                    ></path>
                                    <circle
                                      id="Ellipse 159"
                                      cx="12"
                                      cy="12"
                                      r="5"
                                      stroke="#130F26"
                                    ></circle>
                                    <circle
                                      id="Ellipse 160"
                                      cx="12"
                                      cy="12"
                                      r="3"
                                      fill="#130F26"
                                    ></circle>
                                    <mask
                                      id="mask0"
                                      mask-type="alpha"
                                      maskUnits="userSpaceOnUse"
                                      x="9"
                                      y="9"
                                      width="6"
                                      height="6"
                                    >
                                      <circle
                                        id="Ellipse 163"
                                        cx="12"
                                        cy="12"
                                        r="3"
                                        fill="#130F26"
                                      ></circle>
                                    </mask>
                                    <circle
                                      id="Ellipse 161"
                                      opacity="0.89"
                                      cx="13.5"
                                      cy="10.5"
                                      r="1.5"
                                      fill="white"
                                    ></circle>
                                  </svg>
                                </span>
                              </Link>{" "}
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
                                    stroke="currentColor"
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
export default SubCategory;
