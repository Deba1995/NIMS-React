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

  const [showEdit, setShowEdit] = useState(false);
  const handleShowEdit = () => setShowEdit(true);
  const handleCloseEdit = () => setShowEdit(false);
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
  /*---------------------------------------------------------------------
             COLUMN FOR TABLE
-----------------------------------------------------------------------*/
  const columns = useMemo(
    () => [
      //column definitions...
      {
        accessorKey: "oemName",
        header: "Oem Name",
      },
      {
        accessorKey: "categoryName",
        header: " Category",
      },

      {
        accessorKey: "subcategoryName",
        header: "Sub Category",
      },
      {
        accessorKey: "modelName",
        header: "Model",
      },

      {
        accessorKey: "oemStartDate",
        header: "Oem wrr fr",
      },
      {
        accessorKey: "oemEndDate",
        header: "Oem wrr To",
      },
      {
        accessorKey: "warrantyStart",
        header: "wrr To",
      },
      {
        accessorKey: "warrantyEnd",
        header: "wrr Fr",
      },
      {
        accessorKey: "serialNumber",
        header: "Serial No",
      },

      //end
    ],
    []
  );
  /*---------------------------------------------------------------------
            END COLUMN FOR TABLE
-----------------------------------------------------------------------*/
  /*---------------------------------------------------------------------
            SET THE DATA IN THE TABLE
-----------------------------------------------------------------------*/

  const [formData, setFormData] = useState({
    oemName: "",
    categoryName: "",
    subcategoryName: "",
    modelName: "",
    oemStartDate: "",
    oemEndDate: "",
    warrantyStart: "",
    warrantyEnd: "",
    serialNumber: "",
  });

  const [tableData, setTableData] = useState([]);
  const handleAddItem = () => {
    if (oemCodeDropdown === "") {
      handleError("Table Data cannot be empty");
      return;
    }
    setTableData([
      ...tableData,
      {
        ...formData,
        oemName: oemCodeDropdown,
        categoryName: categoryDropdown,
        subcategoryName: subCategoryDropdown,
        modelName: modelDropdown,
        oemStartDate: oemWarrentyFromDropdown,
        oemEndDate: oemWarrentyToDropdown,
        warrantyStart: warrentyFromDropdown,
        warrantyEnd: warrentyToDropdown,
        serialNumber: serialDropdown,
      },
    ]);
    handleSuccess("Order Added Successfully");
    setSerialDropdown("");
  };

  //for edit
  const [formDataEdit, setFormDataEdit] = useState({
    oemName: "",
    categoryName: "",
    subcategoryName: "",
    modelName: "",
    oemStartDate: "",
    oemEndDate: "",
    warrantyStart: "",
    warrantyEnd: "",
    serialNumber: "",
  });

  const [tableDataEdit, setTableDataEdit] = useState([]);
  const handleAddItemEdit = () => {
    if (selectedOemCodeDropdown === "") {
      handleError("Table Data cannot be empty");
      return;
    }
    setTableDataEdit([
      ...tableDataEdit,
      {
        ...formDataEdit,
        oemName: selectedOemCodeDropdown,
        categoryName: selectedCategoryDropdown,
        subcategoryName: selectedSubCategoryDropdown,
        modelName: selectedModelDropdown,
        oemStartDate: selectedOemWarrentyFromDropdown,
        oemEndDate: selectedOemWarrentyToDropdown,
        warrantyStart: selectedWarrentyFromDropdown,
        warrantyEnd: selectedWarrentyToDropdown,
        serialNumber: selectedSerialDropdown,
      },
    ]);
    handleSuccess("Order Added Successfully");
    setSelectedSerialDropdown("");
  };
  /*---------------------------------------------------------------------
           END SET THE DATA IN THE TABLE
-----------------------------------------------------------------------*/
  /*---------------------------------------------------------------------
            EDIT MODE IN THE TABLE
-----------------------------------------------------------------------*/
  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
    tableData[row.index] = values;
    //send/receive api updates here
    setTableData([...tableData, { ...formData }]);
    exitEditingMode(); //required to exit editing mode
  };

  /*---------------------------------------------------------------------
           END EDIT MODE IN THE TABLE
-----------------------------------------------------------------------*/

  //for oem
  const [oemOrderList, setOemOrderList] = useState([]); //GETTING THE OEMORDER LIST DATA

  // const [oemList, setOemList] = useState([]); //GETTING THE OEM LIST DATA
  //for sector
  const [sectorList, setSectorList] = useState([]); //GETTING THE sector LIST DATA
  const [oemOptionsList, setOemOptionsList] = useState([]); //SET OEM NAME DROPDOWN
  //for client
  const [clientList, setClientList] = useState([]); //GETTING THE CLIENTLIST DATA

  const [clientOptionsList, setClientOptionsList] = useState([]); //SET CLIENT DROPDOWN

  const [sectorOptionsList, setSectorOptionsList] = useState([]); //SET SECTOR DROPDOWN
  //for product
  const [productList, setProductList] = useState([]); //GETTING THE PRODUCT LIST DATA

  const [departmentOptionList, setDepartmentOptionList] = useState([]); //SET DEPARTMENT DROPDOWN

  const [categoryOptionList, setCategoryOptionList] = useState([]); //SET CATEGORY DROPDOWN
  const [subCategoryOptionList, setSubCategoryOptionList] = useState([]); //SET SUBCATEGORY DROPDOWN

  const [modelOptionsList, setModelOptionsList] = useState([]); //SET MODAL DROPDOWN

  const [sectorDropdown, setSectorDropdown] = useState("");
  const [clientDropdown, setClientDropdown] = useState("");
  const [departmentDropdown, setDepartmentDropdown] = useState("");
  const [orderIdDropdown, setOrderIdDropdown] = useState("");
  const [orderDateDropdown, setOrderDateDropdown] = useState("");
  const [challanNoDropdown, setChallanNoDropdown] = useState("");
  const [challanDateDropdown, setChallanDateDropdown] = useState("");

  const [oemCodeDropdown, setOemcodeDropdown] = useState(""); //SET THE VALUE OF OEM IN THE TABLE
  const [categoryDropdown, setCategoryDropdown] = useState(""); //SET THE VALUE OF CATEGORY IN THE TABLE
  const [subCategoryDropdown, setSubCategoryDropdown] = useState(""); //SET THE VALUE OF SUBCATEGORY IN THE TABLE
  const [modelDropdown, setModelDropdown] = useState(""); //SET THE VALUE OF MODEL IN THE TABLE
  const [oemWarrentyFromDropdown, setOemWarrentyFromDropdown] = useState(""); //SET THE VALUE OF OEMWARRENTY FROM IN THE TABLE
  const [oemWarrentyToDropdown, setOemWarrentyToDropdown] = useState(""); //SET THE VALUE OF OEMWARRENTY TO IN THE TABLE
  const [warrentyFromDropdown, setWarrentyFromDropdown] = useState(""); //SET THE VALUE OF WARRENTY FROM IN THE TABLE
  const [warrentyToDropdown, setWarrentyToDropdown] = useState(""); //SET THE VALUE OF WARRENTY TO IN THE TABLE
  const [serialDropdown, setSerialDropdown] = useState(""); //SET THE VALUE OF SERIAL NO IN THE TABLE

  //for edit

  const [selectedId, setSelectedId] = useState("");

  const [selectedSectorDropdown, setSelectedSectorDropdown] = useState({
    value: "",
    label: "",
  });
  const [selectedClientDropdown, setSelectedClientDropdown] = useState({
    value: "",
    label: "",
  });
  const [selectedDepartmentDropdown, setSelectedDepartmentDropdown] = useState({
    value: "",
    label: "",
  });
  const [selectedOrderIdDropdown, setSelectedOrderIdDropdown] = useState("");
  const [selectedOrderDateDropdown, setSelectedOrderDateDropdown] =
    useState("");
  const [selectedChallanNoDropdown, setSelectedChallanNoDropdown] =
    useState("");
  const [selectedChallanDateDropdown, setSelectedChallanDateDropdown] =
    useState("");

  const [selectedOemCodeDropdown, setSelectedOemcodeDropdown] = useState(""); //SET THE VALUE OF OEM IN THE TABLE
  const [selectedCategoryDropdown, setSelectedCategoryDropdown] = useState(""); //SET THE VALUE OF CATEGORY IN THE TABLE
  const [selectedSubCategoryDropdown, setSelectedSubCategoryDropdown] =
    useState(""); //SET THE VALUE OF SUBCATEGORY IN THE TABLE
  const [selectedModelDropdown, setSelectedModelDropdown] = useState(""); //SET THE VALUE OF MODEL IN THE TABLE
  const [selectedOemWarrentyFromDropdown, setSelectedOemWarrentyFromDropdown] =
    useState(""); //SET THE VALUE OF OEMWARRENTY FROM IN THE TABLE
  const [selectedOemWarrentyToDropdown, setSelectedOemWarrentyToDropdown] =
    useState(""); //SET THE VALUE OF OEMWARRENTY TO IN THE TABLE
  const [selectedWarrentyFromDropdown, setSelectedWarrentyFromDropdown] =
    useState(""); //SET THE VALUE OF WARRENTY FROM IN THE TABLE
  const [selectedWarrentyToDropdown, setSelectedWarrentyToDropdown] =
    useState(""); //SET THE VALUE OF WARRENTY TO IN THE TABLE
  const [selectedSerialDropdown, setSelectedSerialDropdown] = useState(""); //SET THE VALUE OF SERIAL NO IN THE TABLE
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
          setOemOrderList(data.orders);
          setSectorList(data.sectors);
          setTableDataEdit(data.orders);

          const transformedData = data.sectors.map((item) => ({
            value: item.sectorCode,
            label: item.sectorName,
          }));
          setSectorOptionsList(transformedData);
          setClientList(data.clients);
          setProductList(data.products);

          const transformedData1 = data.oems.map((oem) => ({
            value: oem.oemName,
            label: oem.oemName,
          }));
          setOemOptionsList(transformedData1);
        }
        const transformedData2 = data.category.map((item) => ({
          value: item.categoryName,
          label: item.categoryName,
        }));
        setCategoryOptionList(transformedData2);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrder();
  }, []);

  /*---------------------------------------------------------------------
            HANDEL THE DROPDOWN CHANGE INTHE FORM
-----------------------------------------------------------------------*/
  const handleChangeSector = (value) => {
    setSectorDropdown(value.value);
    const transformedData1 = clientList
      .filter((item) => item.sectorCode === value.value)
      .map((item) => ({
        value: item.clientName,
        label: item.clientName,
      }));
    setClientOptionsList(transformedData1);
  };
  const handleChangeClient = (value) => {
    setClientDropdown(value.value);
    const transformedData2 = clientList
      .find((item) => item.clientName === value.value)
      ?.departments.map((dept, index) => ({
        value: dept,
        label: dept,
      }));
    setDepartmentOptionList(transformedData2);
  };
  const handleChangeCategory = (value) => {
    setCategoryDropdown(value.value);

    const uniqueSubCategories = new Set(
      productList
        .filter((item) => item.categoryName === value.value)
        .map((item) => item.subcategoryName)
    );

    const transformedData = [...uniqueSubCategories].map((subcategory) => ({
      value: subcategory,
      label: subcategory,
    }));

    setSubCategoryOptionList(transformedData);
  };
  const handlechangeSubCategory = (value) => {
    setSubCategoryDropdown(value.value);
    const transformedData1 = productList
      .filter((item) => item.subcategoryName === value.value)
      .map((item) => ({
        value: item.modelName,
        label: item.modelName,
      }));
    setModelOptionsList(transformedData1);
  };

  /*---------------------------------------------------------------------
           END HANDEL THE DROPDOWN CHANGE INTHE FORM
-----------------------------------------------------------------------*/
  /*--------------------------------------------------------------------------------
--------------------------------Create  order Data--------------------------------
----------------------------------------------------------------------------------*/

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const selectedSector = sectorList.find(
        (sector) => sector.sectorCode === sectorDropdown
      );

      const response = await fetch(`${API_BASE_URL}oem/oem-add-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          sectorName: selectedSector.sectorName,
          clientName: clientDropdown,
          departmentName: departmentDropdown,
          orderId: orderIdDropdown,
          orderDate: orderDateDropdown,
          challanNo: challanNoDropdown,
          challanDate: challanDateDropdown,

          details: tableData.map((item) => ({
            oemName: item.oemName,
            categoryName: item.categoryName,
            subcategoryName: item.subcategoryName,
            modelName: item.modelName,
            oemStartDate: item.oemStartDate,
            oemEndDate: item.oemEndDate,
            warrantyStart: item.warrantyStart,
            warrantyEnd: item.warrantyEnd,
            serialNumber: item.serialNumber,
          })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        handleSuccess(data.message);

        setOemOrderList([...oemOrderList, data.oemOrders]);
        setFormData({
          oemName: "",
          category: "",
          subcategory: "",
          model: "",
          OemWrrFr: "",
          OemWrrTo: "",
          WrrFr: "",
          WrrTo: "",
          Serial: "",
        });
        setOemcodeDropdown("");
        setCategoryDropdown("");
        setSubCategoryDropdown("");
        setModelDropdown("");
        setOemWarrentyFromDropdown("");
        setOemWarrentyToDropdown("");
        setWarrentyFromDropdown("");
        setWarrentyToDropdown("");
        setSerialDropdown("");
        setTableData([]);

        setTimeout(() => {
          handleClose();
        }, 1000);
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
--------------------------------UPDATE ORDER Data--------------------------------
----------------------------------------------------------------------------------*/
  const handleEditClick = (item) => {
    setShowEdit(true);
    setSelectedId(item._id);

    setTableDataEdit(item.details);
    console.log(item.sectorName);
    setSelectedSectorDropdown({
      value: item.sectorName,
      label: item.sectorName,
    });
    setSelectedClientDropdown({
      value: item.clientName,
      label: item.clientName,
    });
    setSelectedDepartmentDropdown({
      value: item.departmentName,
      label: item.departmentName,
    });
    setSelectedOrderIdDropdown(item.orderId);
    setSelectedOrderDateDropdown(item.orderDate);
    setSelectedChallanNoDropdown(item.challanNo);
    setSelectedChallanDateDropdown(item.challanDate);
  };
  async function handleSubmitUpdate(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE_URL}oem/oem-update-order/${selectedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            sectorName: selectedSectorDropdown.value,
            clientName: selectedClientDropdown.value,
            departmentName: selectedDepartmentDropdown.value,
            orderId: selectedOrderIdDropdown,
            orderDate: selectedOrderDateDropdown,
            challanNo: selectedChallanNoDropdown,
            challanDate: selectedChallanDateDropdown,

            details: tableDataEdit.map((item) => ({
              oemName: item.oemName,
              categoryName: item.categoryName,
              subcategoryName: item.subcategoryName,
              modelName: item.modelName,
              oemStartDate: item.oemStartDate,
              oemEndDate: item.oemEndDate,
              warrantyStart: item.warrantyStart,
              warrantyEnd: item.warrantyEnd,
              serialNumber: item.serialNumber,
            })),
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);
        const updatedOemOrder = [...oemOrderList];
        const updatedOemOrderIndex = updatedOemOrder.findIndex(
          (item) => item._id === selectedId
        );
        console.log(updatedOemOrderIndex);
        if (updatedOemOrderIndex !== -1) {
          updatedOemOrder[updatedOemOrderIndex] = {
            ...updatedOemOrder[updatedOemOrderIndex], // Copy existing oem properties
            sectorName: selectedSectorDropdown.value,
            clientName: selectedClientDropdown.value,
            departmentName: selectedDepartmentDropdown.value,
            orderId: selectedOrderIdDropdown,
            orderDate: selectedOrderDateDropdown,
            challanNo: selectedChallanNoDropdown,
            challanDate: selectedChallanDateDropdown,
            details: tableDataEdit.map((item) => ({
              oemName: item.oemName,
              categoryName: item.categoryName,
              subcategoryName: item.subcategoryName,
              modelName: item.modelName,
              oemStartDate: item.oemStartDate,
              oemEndDate: item.oemEndDate,
              warrantyStart: item.warrantyStart,
              warrantyEnd: item.warrantyEnd,
              serialNumber: item.serialNumber,
            })),
          };
        }

        setOemOrderList(updatedOemOrder);
        setSelectedCategoryDropdown("");
        setSelectedClientDropdown("");
        setSelectedDepartmentDropdown("");
        setSelectedOrderIdDropdown("");
        setSelectedOrderDateDropdown("");
        setSelectedChallanNoDropdown("");
        setSelectedChallanDateDropdown("");

        setTimeout(() => {
          handleCloseEdit();
        }, 1000);
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

  const handleChangeSectorEdit = (value) => {
    const secCode = value.value;

    const valueSector = sectorList.find(
      (sector) => sector.sectorCode === secCode
    );

    setSelectedSectorDropdown({
      value: valueSector.sectorName,
      label: valueSector.sectorName,
    });
    setSelectedClientDropdown("");
    setSelectedDepartmentDropdown("");
    const transformedData1 = clientList
      .filter((item) => item.sectorCode === secCode)
      .map((item) => ({
        value: item.clientName,
        label: item.clientName,
      }));
    setClientOptionsList(transformedData1);
  };
  const handleChangeClientEdit = (value) => {
    setSelectedClientDropdown({ value: value.value, label: value.value });
    const transformedData2 = clientList
      .find((item) => item.clientName === value.value)
      ?.departments.map((dept, index) => ({
        value: dept,
        label: dept,
      }));
    setDepartmentOptionList(transformedData2);
  };

  const handleChangeCategoryEdit = (value) => {
    setSelectedCategoryDropdown(value.value);

    const uniqueSubCategories = new Set(
      productList
        .filter((item) => item.categoryName === value.value)
        .map((item) => item.subcategoryName)
    );

    const transformedData = [...uniqueSubCategories].map((subcategory) => ({
      value: subcategory,
      label: subcategory,
    }));

    setSubCategoryOptionList(transformedData);
  };
  const handlechangeSubCategoryEdit = (value) => {
    setSelectedSubCategoryDropdown(value.value);
    const transformedData1 = productList
      .filter((item) => item.subcategoryName === value.value)
      .map((item) => ({
        value: item.modelName,
        label: item.modelName,
      }));
    setModelOptionsList(transformedData1);
  };
  /*--------------------------------------------------------------------------------
--------------------------------Delete oem Data--------------------------------
----------------------------------------------------------------------------------*/
  const handleDeleteClick = (item) => {
    if (window.confirm("Are you sure you want to delete this Product?")) {
      deleteOrder(item._id);
    }
  };

  const deleteOrder = async (deleteId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}oem/oem-delete-order/${deleteId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);
        const updatedOrderList = oemOrderList.filter(
          (item) => item._id !== deleteId
        );
        setOemOrderList(updatedOrderList);
      } else {
        handleError("Failed to delete order");
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
                  <h4 className="card-title">Order List</h4>
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
                <Modal.Header closeButton>
                  <Card.Header className="d-flex justify-content-between">
                    <div className="header-title">
                      <h4 className="card-title">Order Register </h4>
                    </div>
                  </Card.Header>
                </Modal.Header>
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
                                    options={departmentOptionList}
                                    onChange={(value) =>
                                      setDepartmentDropdown(value.value)
                                    }
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
                                    onChange={(e) =>
                                      setOrderIdDropdown(e.target.value)
                                    }
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
                                      placeholder="Date... "
                                      style={{ border: "1px solid #c5bfc5" }}
                                      onChange={(selectedDates) => {
                                        const dateStr =
                                          selectedDates[0].toLocaleDateString();
                                        setOrderDateDropdown(dateStr);
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
                                    Challan No:
                                  </label>
                                  <Form.Control
                                    type="text"
                                    id="challan"
                                    placeholder="Challan..."
                                    style={{ border: "1px solid #c5bfc5" }}
                                    onChange={(e) =>
                                      setChallanNoDropdown(e.target.value)
                                    }
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
                                      placeholder="Date... "
                                      style={{ border: "1px solid #c5bfc5" }}
                                      onChange={(selectedDates) => {
                                        const dateStr =
                                          selectedDates[0].toLocaleDateString();
                                        setChallanDateDropdown(dateStr);
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
                                    Oem:
                                  </label>

                                  <Select
                                    aria-labelledby="aria-label"
                                    inputId="aria-example-input"
                                    name="aria-live-color"
                                    onMenuOpen={onMenuOpen}
                                    onMenuClose={onMenuClose}
                                    options={oemOptionsList}
                                    onChange={(value) =>
                                      setOemcodeDropdown(value.value)
                                    }
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-2 form-group">
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
                                    onChange={handleChangeCategory}
                                    options={categoryOptionList}
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-2 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Sub Category:
                                  </label>

                                  <Select
                                    aria-labelledby="aria-label"
                                    inputId="aria-example-input"
                                    name="aria-live-color"
                                    onMenuOpen={onMenuOpen}
                                    onMenuClose={onMenuClose}
                                    options={subCategoryOptionList}
                                    onChange={handlechangeSubCategory}
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-2 form-group">
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
                                    options={modelOptionsList}
                                    onChange={(value) =>
                                      setModelDropdown(value.value)
                                    }
                                  />
                                </Form.Group>

                                <Form.Group className="col-md-1 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Oem-wrrn fr:
                                  </label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      placeholder="Date... "
                                      style={{
                                        border: "1px solid #c5bfc5",
                                      }}
                                      onChange={(selectedDates) => {
                                        const dateStr =
                                          selectedDates[0].toLocaleDateString();
                                        setOemWarrentyFromDropdown(dateStr);
                                      }}
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group className="col-md-1 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Oem-wrrn to:
                                  </label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      placeholder="Date... "
                                      style={{
                                        border: "1px solid #c5bfc5",
                                      }}
                                      onChange={(selectedDates) => {
                                        const dateStr =
                                          selectedDates[0].toLocaleDateString();
                                        setOemWarrentyToDropdown(dateStr);
                                      }}
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group className="col-md-1 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Wrrn from:
                                  </label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      placeholder="Date... "
                                      style={{
                                        border: "1px solid #c5bfc5",
                                      }}
                                      onChange={(selectedDates) => {
                                        const dateStr =
                                          selectedDates[0].toLocaleDateString();
                                        setWarrentyFromDropdown(dateStr);
                                      }}
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group className="col-md-1 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Wrrn to:
                                  </label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      placeholder="Date... "
                                      style={{
                                        border: "1px solid #c5bfc5",
                                      }}
                                      onChange={(selectedDates) => {
                                        const dateStr =
                                          selectedDates[0].toLocaleDateString();
                                        setWarrentyToDropdown(dateStr);
                                      }}
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group className="col-md-3 form-group">
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
                                    value={serialDropdown}
                                    style={{
                                      border: "1px solid #c5bfc5",
                                    }}
                                    onChange={(e) =>
                                      setSerialDropdown(e.target.value)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <hr />
                            </div>

                            <div className="new-user-info">
                              <div className="row">
                                <div className="bd-example">
                                  <Button
                                    type="button"
                                    variant="btn btn-primary"
                                    style={{
                                      float: "right",
                                      marginBottom: "18px",
                                    }}
                                    onClick={handleAddItem}
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
                                  onClick={(e) => handleSubmit(e)}
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
              {/*=======================END MODAL TO ADD ORDER======================= */}
              {/*======================= MODAL TO EDIT ORDER======================= */}
              <Modal
                show={showEdit}
                fullscreen={fullscreen}
                onHide={() => setShowEdit(false)}
              >
                <Modal.Header closeButton>
                  <Card.Header className="d-flex justify-content-between">
                    <div className="header-title">
                      <h4 className="card-title">Edit Register </h4>
                    </div>
                  </Card.Header>
                </Modal.Header>
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
                                    value={selectedSectorDropdown}
                                    options={sectorOptionsList}
                                    onChange={handleChangeSectorEdit}
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
                                    value={selectedClientDropdown}
                                    options={clientOptionsList}
                                    onChange={handleChangeClientEdit}
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
                                    value={selectedDepartmentDropdown}
                                    options={departmentOptionList}
                                    onChange={(value) =>
                                      setSelectedDepartmentDropdown({
                                        value: value.value,
                                        label: value.value,
                                      })
                                    }
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
                                    value={selectedOrderIdDropdown}
                                    onChange={(e) =>
                                      setSelectedOrderIdDropdown(e.target.value)
                                    }
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
                                      placeholder="Date... "
                                      style={{ border: "1px solid #c5bfc5" }}
                                      value={selectedOrderDateDropdown}
                                      onChange={(selectedDates) => {
                                        const dateStr =
                                          selectedDates[0].toLocaleDateString();
                                        setSelectedOrderDateDropdown(dateStr);
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
                                    Challan No:
                                  </label>
                                  <Form.Control
                                    type="text"
                                    id="challan"
                                    placeholder="Challan..."
                                    style={{ border: "1px solid #c5bfc5" }}
                                    value={selectedChallanNoDropdown}
                                    onChange={(e) =>
                                      setSelectedChallanNoDropdown(
                                        e.target.value
                                      )
                                    }
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
                                      placeholder="Date... "
                                      style={{ border: "1px solid #c5bfc5" }}
                                      value={selectedChallanDateDropdown}
                                      onChange={(selectedDates) => {
                                        const dateStr =
                                          selectedDates[0].toLocaleDateString();
                                        setSelectedChallanDateDropdown(dateStr);
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
                                    Oem:
                                  </label>

                                  <Select
                                    aria-labelledby="aria-label"
                                    inputId="aria-example-input"
                                    name="aria-live-color"
                                    onMenuOpen={onMenuOpen}
                                    onMenuClose={onMenuClose}
                                    options={oemOptionsList}
                                    onChange={(value) =>
                                      setSelectedOemcodeDropdown(value.value)
                                    }
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-2 form-group">
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
                                    onChange={handleChangeCategoryEdit}
                                    options={categoryOptionList}
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-2 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Sub Category:
                                  </label>

                                  <Select
                                    aria-labelledby="aria-label"
                                    inputId="aria-example-input"
                                    name="aria-live-color"
                                    onMenuOpen={onMenuOpen}
                                    onMenuClose={onMenuClose}
                                    options={subCategoryOptionList}
                                    onChange={handlechangeSubCategoryEdit}
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-2 form-group">
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
                                    options={modelOptionsList}
                                    onChange={(value) =>
                                      setSelectedModelDropdown(value.value)
                                    }
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-1 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Oem-wrrn fr:
                                  </label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      placeholder="Date... "
                                      style={{
                                        border: "1px solid #c5bfc5",
                                      }}
                                      onChange={(selectedDates) => {
                                        const dateStr =
                                          selectedDates[0].toLocaleDateString();
                                        setSelectedOemWarrentyFromDropdown(
                                          dateStr
                                        );
                                      }}
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group className="col-md-1 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Oem-wrrn to:
                                  </label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      placeholder="Date... "
                                      style={{
                                        border: "1px solid #c5bfc5",
                                      }}
                                      onChange={(selectedDates) => {
                                        const dateStr =
                                          selectedDates[0].toLocaleDateString();
                                        setSelectedOemWarrentyToDropdown(
                                          dateStr
                                        );
                                      }}
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group className="col-md-1 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Wrrn from:
                                  </label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      placeholder="Date... "
                                      style={{
                                        border: "1px solid #c5bfc5",
                                      }}
                                      onChange={(selectedDates) => {
                                        const dateStr =
                                          selectedDates[0].toLocaleDateString();
                                        setSelectedWarrentyFromDropdown(
                                          dateStr
                                        );
                                      }}
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group className="col-md-1 form-group">
                                  <label
                                    style={style.label}
                                    id="aria-label"
                                    htmlFor="aria-example-input"
                                  >
                                    Wrrn to:
                                  </label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      placeholder="Date... "
                                      style={{
                                        border: "1px solid #c5bfc5",
                                      }}
                                      onChange={(selectedDates) => {
                                        const dateStr =
                                          selectedDates[0].toLocaleDateString();
                                        setSelectedWarrentyToDropdown(dateStr);
                                      }}
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group className="col-md-3 form-group">
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
                                    value={selectedSerialDropdown}
                                    style={{
                                      border: "1px solid #c5bfc5",
                                    }}
                                    onChange={(e) =>
                                      setSelectedSerialDropdown(e.target.value)
                                    }
                                  />
                                </Form.Group>
                              </div>
                              <hr />
                            </div>

                            <div className="new-user-info">
                              <div className="row">
                                <div className="bd-example">
                                  <Button
                                    type="button"
                                    variant="btn btn-primary"
                                    style={{
                                      float: "right",
                                      marginBottom: "18px",
                                    }}
                                    onClick={handleAddItemEdit}
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
                                  data={tableDataEdit}
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
                                  onClick={(e) => handleSubmitUpdate(e)}
                                >
                                  Update Order
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
              {/*=======================END MODAL TO EDIT ORDER======================= */}
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
                        <th>Order Id</th>
                        <th>Order Date</th>
                        <th>Challan Number</th>
                        <th style={{ float: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {oemOrderList.map((item, id) => (
                        <tr key={id}>
                          <td>{item.orderId}</td>
                          <td>{item.orderDate}</td>
                          <td>{item.challanNo}</td>
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

export default AddOrder;
