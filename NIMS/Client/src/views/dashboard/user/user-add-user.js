import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Modal, Form, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Card from "../../../components/Card";
import { API_BASE_URL } from "../../../config/serverApiConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";

// img
import avatars1 from "../../../assets/images/avatars/01.png";
import avatars2 from "../../../assets/images/avatars/avtar_1.png";
import avatars3 from "../../../assets/images/avatars/avtar_2.png";
import avatars4 from "../../../assets/images/avatars/avtar_3.png";
import avatars5 from "../../../assets/images/avatars/avtar_4.png";
import avatars6 from "../../../assets/images/avatars/avtar_5.png";

const UserAdd = () => {
  const [fullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(""); //Select Option for department while adding user
  const [selectedDesignation, setSelectedDesignation] = useState(""); //Select Option for designation while adding user
  const [selectedDepartmentEdit, setSelectedDepartmentEdit] = useState(""); //Select Option for department while editing user
  // const [selectedDesignationEdit, setSelectedDesignationEdit] = useState(""); //Select Option for designation while editing user
  const fileInputRef = useRef(null);
  const [defaultProfileAvatar, setDefaultProfileAvatar] = useState("");
  const [defaultAvatar, setDefaultAvatar] = useState("");
  const [defaultGovIdAvatar, setDefaultGovIdAvatar] = useState("");
  const [defaultProfileAvatarEdit, setDefaultProfileAvatarEdit] = useState("");
  const [defaultGovIdAvatarEdit, setDefaultGovIdAvatarEdit] = useState(""); //setDefaultGovIdAvatarEdit
  const handleClose = () => setShow(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShow = () => {
    setShow(true);
    return setDefaultProfileAvatar("");
  };

  const [users, setUsers] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [gender, setGender] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDepartmentCode, setSelectedDepartmentCode] = useState({
    dept: "",
  });
  const [selectedDesignationCode, setSelectedDesignationCode] = useState({
    desg: "",
  });
  const [selectedFirstName, setSelectedFirstName] = useState({
    firstName: "",
  });
  const [selectedLastName, setSelectedLastName] = useState({
    lastName: "",
  });
  const [selectedContact, setSelectedContact] = useState({
    phone: "",
  });
  const [selectedAddress, setSelectedAddress] = useState({
    address: "",
  });
  const [selectedState, setSelectedState] = useState({
    state: "",
  });
  const [selectedCity, setSelectedCity] = useState({
    city: "",
  });
  const [selectedCountry, setSelectedCountry] = useState({
    country: "",
  });

  const [selectedEmail, setSelectedEmail] = useState({
    email: "",
  });
  const [selectedPinCode, setSelectedPinCode] = useState({
    postal: "",
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState({
    employeeId: "",
  });
  const [selectedGender, setSelectedGender] = useState({
    gender: "",
  });
  const [selectedJoinDate, setSelectedJoinDate] = useState({
    joinDate: "",
  });
  const [selectedPassword, setSelectedPassword] = useState({
    password: "",
  });
  const [selectedConfirmPassword, setSelectedConfirmPassword] = useState({
    cpassword: "",
  });
  const [selectedStatus, setSelectedStatus] = useState({
    status: "",
  });
  // const [selectededitGovId, setSelectedEditGovId] = useState({
  //   govermentId: "",
  // });

  const handleError = (err) =>
    toast.error(err, {
      position: toast.POSITION.TOP_RIGHT,
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: toast.POSITION.TOP_RIGHT,
    });

  /*--------------------------------------------------------------------------------
--------------------------------Start Fetch user Data--------------------------------
----------------------------------------------------------------------------------*/
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}user/user-get-user`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
          setDepartments(data.departments);
          setDesignations(data.designations);
        }
      } catch (error) {
        console.error("Error fetching sector:", error);
      }
    };

    fetchUser();
  }, []);

  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/

  /*--------------------------------------------------------------------------------
--------------------------------Delete user Data--------------------------------
----------------------------------------------------------------------------------*/
  const handleDeleteClick = (item) => {
    if (window.confirm("Are you sure you want to delete this User?")) {
      deleteUser(item._id);
    }
  };

  const deleteUser = async (item) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}user/user-delete-user/${item}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);
        const updatedUsers = users.filter((user) => user._id !== item);
        setUsers(updatedUsers);
      } else {
        handleError("Failed to delete user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/

  /*--------------------------------------------------------------------------------
-------------------------------- Add user--------------------------------
----------------------------------------------------------------------------------*/

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  //For profile
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setDefaultProfileAvatar(file);
        setDefaultAvatar(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  //For GovId
  const handleFileChangeGovId = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDefaultGovIdAvatar(file);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("profilePic", defaultProfileAvatar);
      formData.append("govId", defaultGovIdAvatar);
      formData.append("desg", selectedDesignation);
      formData.append("dept", selectedDepartment);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("address", address);
      formData.append("email", email);
      formData.append("employeeId", employeeId);
      formData.append("phone", mobile);
      formData.append("city", city);
      formData.append("country", country);
      formData.append("state", state);
      formData.append("gender", gender);
      formData.append("password", password);
      formData.append("postal", pinCode);
      formData.append("doj", joinDate);
      const response = await fetch(`${API_BASE_URL}user/user-add-user`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);
        setUsers([...users, data.user]);
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
        console.error("Failed to add user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };
  const handleDesignationChange = (e) => {
    setSelectedDesignation(e.target.value);
  };

  const filteredDesignations = designations.filter(
    (designation) => designation.departmentCode === selectedDepartment
  );

  /*--------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/

  /*--------------------------------------------------------------------------------
--------------------------------Update user Data--------------------------------
----------------------------------------------------------------------------------*/
  const handleEditClick = (item) => {
    setShowEdit(true);
    setSelectedFirstName({ firstName: item.firstName });
    setSelectedLastName({ lastName: item.lastName });
    setSelectedContact({ phone: item.phone });
    setSelectedAddress({ address: item.address });
    setSelectedState({ state: item.state });
    setSelectedDepartmentCode({ dept: item.dept });
    setSelectedDesignationCode({ desg: item.desg });
    setSelectedCity({ city: item.city });
    setSelectedCountry({ country: item.country });
    setSelectedEmail({ email: item.email });
    setSelectedPinCode({ postal: item.postal });
    setSelectedEmployeeId({ employeeId: item.employeeId });
    setSelectedGender({ gender: item.gender });
    setSelectedJoinDate({ joinDate: item.doj });
    if(item?.profilePic?.image){
      setDefaultAvatar(item?.profilePic?.image);
    }else{
      setDefaultAvatar("")
    }
    if(item?.govId?.image){
      setDefaultGovIdAvatar(item?.govId?.image);
    }else{
      setDefaultGovIdAvatar("")
    }
    
   
    setSelectedStatus({ status: item.status });
  };
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      if (defaultProfileAvatarEdit !== "") {
        formData.append("profilePic", defaultProfileAvatarEdit);
      }
      if (defaultGovIdAvatarEdit !== "") {
        formData.append("govId", defaultGovIdAvatarEdit);
      }
      formData.append("desg", selectedDesignationCode.desg);
      formData.append("dept", selectedDepartmentCode.dept);
      formData.append("firstName", selectedFirstName.firstName);
      formData.append("lastName", selectedLastName.lastName);
      formData.append("address", selectedAddress.address);
      formData.append("email", selectedEmail.email);
      formData.append("employeeId", selectedEmployeeId.employeeId);
      formData.append("phone", selectedContact.phone);
      formData.append("city", selectedCity.city);
      formData.append("country", selectedCountry.country);
      formData.append("state", selectedState.state);
      formData.append("gender", selectedGender.gender);
      formData.append("password", selectedPassword.password);
      formData.append("confirmpassword", selectedConfirmPassword.cpassword);
      formData.append("postal", selectedPinCode.postal);
      formData.append("doj", selectedJoinDate.joinDate);
      formData.append("status", selectedStatus.status);
      const response = await fetch(
        `${API_BASE_URL}user/user-update-user/${selectedEmployeeId.employeeId}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.success) {
        handleSuccess(data.message);

        const updatedUsers = [...users];
        const updatedUserIndex = updatedUsers.findIndex(
          (userData) => userData.employeeId === selectedEmployeeId.employeeId
        );
        if (updatedUserIndex !== -1) {
          const inputDate = new Date(selectedJoinDate.joinDate);
          const year = inputDate.getFullYear();
          const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so we add 1
          const day = String(inputDate.getDate()).padStart(2, "0");
          const formattedDate = `${year}-${month}-${day}`;
          updatedUsers[updatedUserIndex] = {
            ...updatedUsers[updatedUserIndex], // Copy existing user properties
            firstName: selectedFirstName.firstName,
            lastName: selectedLastName.lastName,
            address: selectedAddress.address,
            state: selectedState.state,
            city: selectedCity.city,
            country: selectedCountry.country,
            phone: selectedContact.phone,
            email: selectedEmail.email,
            postal: selectedPinCode.postal,
            gender: selectedGender.gender,
            desg: selectedDesignationCode.desg,
            dept: selectedDepartmentCode.dept,
            status: selectedStatus.status,
            employeeId: selectedEmployeeId.employeeId,
            doj: formattedDate,
          };
          if(defaultAvatar !== ""){
            updatedUsers[updatedUserIndex].profilePic.image = defaultAvatar
          };
          if(defaultGovIdAvatar !== ""){
            updatedUsers[updatedUserIndex].govId.image = defaultGovIdAvatar
          };
        }
        setUsers(updatedUsers);
        setSelectedEmployeeId({ employeeId: "" });
        setTimeout(() => {
          handleCloseEdit();
        }, 2000);
      } else {
        Object.keys(data.errors).forEach((key) => {
          const messageErr = data.errors[key];
          if (messageErr) {
            handleError(messageErr);
          }
        });
        console.error("Failed to add user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleSelectDepartmentEdit = (e) => {
    setSelectedDepartmentEdit(e.target.value);
    setSelectedDepartmentCode({ dept: e.target.value });
  };
  const handleSelectDesignationEdit = (e) => {
    // setSelectedDesignationEdit(e.target.value);
    setSelectedDesignationCode({ desg: e.target.value });
  };

  //For GovId edit
  const handleFileChangeGovIdEdit = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setDefaultGovIdAvatarEdit(file);
        setDefaultGovIdAvatar(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  //For profile pic edit
  const handleFileChangeEdit = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setDefaultProfileAvatarEdit(file);
        setDefaultAvatar(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredDesignationsEdit = designations.filter(
    (designation) => designation.departmentCode === selectedDepartmentEdit
  );

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
                  <h4 className="card-title">User List</h4>
                </div>

                {/* ===================BUTTON TO ADD USER =================================== */}
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
                  <span>New User</span>
                </Button>
                {/* ===================END BUTTON TO ADD USER =============================== */}
              </Card.Header>
              {/*======================= MODAL TO ADD USER======================= */}
              <Modal
                show={show}
                fullscreen={fullscreen}
                onHide={() => setShow(false)}
              >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  <div>
                    <Form onSubmit={(e) => handleSubmit(e)}>
                      <Row>
                        <Col xl="3" lg="4" className="">
                          <Card>
                            <Card.Header className="d-flex justify-content-between">
                              <div className="header-title">
                                <h4 className="card-title">Add New User</h4>
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <Form.Group className="form-group">
                                <div className="profile-img-edit position-relative">
                                  <Image
                                    className="theme-color-default-img  profile-pic rounded avatar-100"
                                    src={
                                      defaultAvatar === ""
                                        ? avatars1
                                        : defaultAvatar
                                    }
                                    alt="profile-pic"
                                  />
                                  <Image
                                    className="theme-color-purple-img profile-pic rounded avatar-100"
                                    src={
                                      defaultAvatar === ""
                                        ? avatars2
                                        : defaultAvatar
                                    }
                                    alt="profile-pic"
                                  />
                                  <Image
                                    className="theme-color-blue-img profile-pic rounded avatar-100"
                                    src={
                                      defaultAvatar === ""
                                        ? avatars3
                                        : defaultAvatar
                                    }
                                    alt="profile-pic"
                                  />
                                  <Image
                                    className="theme-color-green-img profile-pic rounded avatar-100"
                                    src={
                                      defaultAvatar === ""
                                        ? avatars5
                                        : defaultAvatar
                                    }
                                    alt="profile-pic"
                                  />
                                  <Image
                                    className="theme-color-yellow-img profile-pic rounded avatar-100"
                                    src={
                                      defaultAvatar === ""
                                        ? avatars6
                                        : defaultAvatar
                                    }
                                    alt="profile-pic"
                                  />
                                  <Image
                                    className="theme-color-pink-img profile-pic rounded avatar-100"
                                    src={
                                      defaultAvatar === ""
                                        ? avatars4
                                        : defaultAvatar
                                    }
                                    alt="profile-pic"
                                  />
                                  <div
                                    className="upload-icone bg-primary"
                                    onClick={handleUploadClick}
                                  >
                                    <svg
                                      className="upload-button"
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#ffffff"
                                        d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z"
                                      />
                                    </svg>
                                    <Form.Control
                                      ref={fileInputRef}
                                      className="file-upload"
                                      type="file"
                                      accept="image/*"
                                      onChange={handleFileChange}
                                    />
                                  </div>
                                </div>
                                <div className="img-extension mt-3">
                                  <div className="d-inline-block align-items-center">
                                    <span>Only</span> <Link to="#">.jpg</Link>{" "}
                                    <Link to="#">.png</Link>{" "}
                                    <Link to="#">.jpeg</Link>{" "}
                                    <span>allowed</span>
                                  </div>
                                </div>
                              </Form.Group>
                              <div>
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="furl">
                                    Department:
                                  </Form.Label>
                                  <select
                                    name="type"
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                    value={selectedDepartment}
                                    onChange={handleDepartmentChange}
                                  >
                                    <option>Select Department</option>
                                    {departments.map((department, index) => (
                                      <option
                                        key={index}
                                        value={department.departmentCode}
                                      >
                                        {department.departmentName}
                                      </option>
                                    ))}
                                  </select>
                                  <Form.Label>Designation:</Form.Label>
                                  <select
                                    name="type"
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                    value={selectedDesignation}
                                    onChange={handleDesignationChange}
                                  >
                                    <option>Select Designation</option>
                                    {filteredDesignations.map(
                                      (designation, index) => (
                                        <option
                                          key={index}
                                          value={designation.designationCode}
                                        >
                                          {designation.designationName}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </Form.Group>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col xl="9" lg="8">
                          <Card>
                            <Card.Header className="d-flex justify-content-between">
                              <div className="header-title">
                                <h4 className="card-title">
                                  New User Information
                                </h4>
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <div className="row">
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="fname">
                                    First Name:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="fname"
                                    onChange={(e) =>
                                      setFirstName(e.target.value)
                                    }
                                    placeholder="First Name"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="lname">
                                    Last Name:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="lname"
                                    onChange={(e) =>
                                      setLastName(e.target.value)
                                    }
                                    placeholder="Last Name"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-4 form-group">
                                  <Form.Label htmlFor="add1">
                                    Street Address:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="add1"
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Street Address "
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-4 form-group">
                                  <Form.Label htmlFor="add2">State:</Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="add2"
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder="State"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-4 form-group">
                                  <Form.Label htmlFor="cname">City:</Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="cname"
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="City"
                                  />
                                </Form.Group>
                                <Form.Group className="col-sm-12 form-group">
                                  <Form.Label>Country:</Form.Label>
                                  <select
                                    name="type"
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                    onChange={(e) => setCountry(e.target.value)}
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
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="Mobile Number"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6  form-group">
                                  <Form.Label htmlFor="altconno">
                                    Gender:
                                  </Form.Label>
                                  <select
                                    name="type"
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                    onChange={(e) => setGender(e.target.value)}
                                  >
                                    <option>Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Others</option>
                                  </select>
                                </Form.Group>
                                <Form.Group className="col-md-6  form-group">
                                  <Form.Label htmlFor="email">
                                    Email:
                                  </Form.Label>
                                  <Form.Control
                                    type="email"
                                    id="email"
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    onChange={(e) => setPinCode(e.target.value)}
                                    placeholder="Pin Code"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-4 form-group">
                                  <Form.Label htmlFor="doj">
                                    Date of joining:
                                  </Form.Label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      value={joinDate}
                                      onChange={(selectedDate) =>
                                        setJoinDate(selectedDate)
                                      }
                                      placeholder="Select Date... "
                                    />
                                  </div>
                                </Form.Group>
                              </div>
                              <hr />
                              <h5 className="mb-3">Security</h5>
                              <div className="row">
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="eid">
                                    Employee ID:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="uname"
                                    onChange={(e) =>
                                      setEmployeeId(e.target.value)
                                    }
                                    placeholder="Employee ID"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="pass">
                                    Password:
                                  </Form.Label>
                                  <Form.Control
                                    type="password"
                                    id="pass"
                                    onChange={(e) =>
                                      setPassword(e.target.value)
                                    }
                                    placeholder="Password"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="rpass">
                                    Goverment ID:
                                  </Form.Label>
                                  <div className="mb-3">
                                    <Form.Control
                                      type="file"
                                      className=" form-control-sm"
                                      onChange={handleFileChangeGovId}
                                      aria-label="Small file input example"
                                    />
                                  </div>
                                </Form.Group>
                              </div>

                              <Button
                                type="button"
                                variant="btn btn-primary"
                                style={{ float: "right" }}
                                onClick={(e) => handleSubmit(e)}
                              >
                                Add User
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Modal.Body>
              </Modal>
              {/*=======================END MODAL TO ADD USER======================= */}

              {/*======================= MODAL TO Edit USER======================= */}
              <Modal
                show={showEdit}
                fullscreen={fullscreen}
                onHide={() => setShowEdit(false)}
              >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  <div>
                    <Form onSubmit={(e) => handleSubmitUpdate(e)}>
                      <Row>
                        <Col xl="3" lg="4" className="">
                          <Card>
                            <Card.Header className="d-flex justify-content-between">
                              <div className="header-title">
                                <h4 className="card-title">Add New User</h4>
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <Form.Group className="form-group">
                                <div className="profile-img-edit position-relative">
                                  <Image
                                    className="theme-color-default-img  profile-pic rounded avatar-100"
                                    src={
                                      defaultAvatar === ""
                                        ? avatars1
                                        : defaultAvatar
                                    }
                                    alt="profile-pic"
                                  />
                                  <Image
                                    className="theme-color-purple-img profile-pic rounded avatar-100"
                                    src={
                                      defaultAvatar === ""
                                        ? avatars2
                                        : defaultAvatar
                                    }
                                    alt="profile-pic"
                                  />
                                  <Image
                                    className="theme-color-blue-img profile-pic rounded avatar-100"
                                    src={
                                      defaultAvatar === ""
                                        ? avatars3
                                        : defaultAvatar
                                    }
                                    alt="profile-pic"
                                  />
                                  <Image
                                    className="theme-color-green-img profile-pic rounded avatar-100"
                                    src={
                                      defaultAvatar === ""
                                        ? avatars5
                                        : defaultAvatar
                                    }
                                    alt="profile-pic"
                                  />
                                  <Image
                                    className="theme-color-yellow-img profile-pic rounded avatar-100"
                                    src={
                                      defaultAvatar === ""
                                        ? avatars6
                                        : defaultAvatar
                                    }
                                    alt="profile-pic"
                                  />
                                  <Image
                                    className="theme-color-pink-img profile-pic rounded avatar-100"
                                    src={
                                      defaultAvatar === ""
                                        ? avatars4
                                        : defaultAvatar
                                    }
                                    alt="profile-pic"
                                  />
                                  <div
                                    className="upload-icone bg-primary"
                                    onClick={handleUploadClick}
                                  >
                                    <svg
                                      className="upload-button"
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#ffffff"
                                        d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z"
                                      />
                                    </svg>
                                    <Form.Control
                                      ref={fileInputRef}
                                      className="file-upload"
                                      type="file"
                                      accept="image/*"
                                      onChange={handleFileChangeEdit}
                                    />
                                  </div>
                                </div>
                                <div className="img-extension mt-3">
                                  <div className="d-inline-block align-items-center">
                                    <span>Only</span> <Link to="#">.jpg</Link>{" "}
                                    <Link to="#">.png</Link>{" "}
                                    <Link to="#">.jpeg</Link>{" "}
                                    <span>allowed</span>
                                  </div>
                                </div>
                              </Form.Group>
                              <div>
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="furl">
                                    Department:
                                  </Form.Label>
                                  <select
                                    name="type"
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                    value={selectedDepartmentCode.dept}
                                    onChange={(e) =>
                                      handleSelectDepartmentEdit(e)
                                    }
                                  >
                                    <option
                                      value={selectedDepartmentCode.dept}
                                      disabled={true}
                                    >
                                      {
                                        departments.find(
                                          (department) =>
                                            department.departmentCode ===
                                            selectedDepartmentCode.dept
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
                                  </select>
                                  <Form.Label>Designation:</Form.Label>
                                  <select
                                    name="type"
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                    value={selectedDesignationCode.desg}
                                    onChange={(e) =>
                                      handleSelectDesignationEdit(e)
                                    }
                                  >
                                    <option
                                      value={selectedDesignationCode.desg}
                                      disabled={true}
                                    >
                                      {
                                        designations.find(
                                          (designation) =>
                                            designation.designationCode ===
                                            selectedDesignationCode.desg
                                        )?.designationName
                                      }
                                    </option>
                                    {filteredDesignationsEdit.map(
                                      (designation, index) => (
                                        <option
                                          key={index}
                                          value={designation.designationCode}
                                        >
                                          {designation.designationName}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </Form.Group>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col xl="9" lg="8">
                          <Card>
                            <Card.Header className="d-flex justify-content-between">
                              <div className="header-title">
                                <h4 className="card-title">Information</h4>
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <div className="row">
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="fname">
                                    First Name:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="fname"
                                    value={selectedFirstName.firstName}
                                    onChange={(e) =>
                                      setSelectedFirstName({
                                        firstName: e.target.value,
                                      })
                                    }
                                    placeholder="First Name"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="lname">
                                    Last Name:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="lname"
                                    value={selectedLastName.lastName}
                                    onChange={(e) =>
                                      setSelectedLastName({
                                        lastName: e.target.value,
                                      })
                                    }
                                    placeholder="Last Name"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-4 form-group">
                                  <Form.Label htmlFor="add1">
                                    Street Address:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="add1"
                                    value={selectedAddress.address}
                                    onChange={(e) =>
                                      setSelectedAddress({
                                        address: e.target.value,
                                      })
                                    }
                                    placeholder="Street Address "
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-4 form-group">
                                  <Form.Label htmlFor="add2">State:</Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="add2"
                                    value={selectedState.state}
                                    onChange={(e) =>
                                      setSelectedState({
                                        state: e.target.value,
                                      })
                                    }
                                    placeholder="State"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-4 form-group">
                                  <Form.Label htmlFor="cname">City:</Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="cname"
                                    value={selectedCity.city}
                                    onChange={(e) =>
                                      setSelectedCity({
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
                                    value={selectedCountry.country}
                                    onChange={(e) =>
                                      setSelectedCountry({
                                        country: e.target.value,
                                      })
                                    }
                                  >
                                    <option>{selectedCountry.country}</option>
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
                                  <Form.Label htmlFor="altconno">
                                    Gender:
                                  </Form.Label>
                                  <select
                                    name="type"
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                    value={selectedGender.gender}
                                    onChange={(e) =>
                                      setSelectedGender({
                                        gender: e.target.value,
                                      })
                                    }
                                  >
                                    <option>{selectedGender.gender}</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Others</option>
                                  </select>
                                </Form.Group>
                                <Form.Group className="col-md-6  form-group">
                                  <Form.Label htmlFor="email">
                                    Email:
                                  </Form.Label>
                                  <Form.Control
                                    type="email"
                                    id="email"
                                    value={selectedEmail.email}
                                    onChange={(e) =>
                                      setSelectedEmail({
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
                                    value={selectedPinCode.postal}
                                    onChange={(e) =>
                                      setSelectedPinCode({
                                        postal: e.target.value,
                                      })
                                    }
                                    placeholder="Pin Code"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="doj">
                                    Date of joining:
                                  </Form.Label>

                                  <div className="form-group">
                                    <Flatpickr
                                      className="form-control flatpickrdate"
                                      value={selectedJoinDate.joinDate}
                                      onChange={(selectedDate) =>
                                        setSelectedJoinDate({
                                          joinDate: selectedDate,
                                        })
                                      }
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="status">
                                    Status:
                                  </Form.Label>
                                  <select
                                    name="type"
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                    value={selectedStatus.status}
                                    onChange={(e) =>
                                      setSelectedStatus({
                                        status: e.target.value,
                                      })
                                    }
                                  >
                                    <option disabled={true}>
                                      {selectedStatus.status}
                                    </option>
                                    <option>Active</option>
                                    <option>InActive</option>
                                    <option>Pending</option>
                                  </select>
                                </Form.Group>
                              </div>
                              <hr />
                              <h5 className="mb-3">Security</h5>
                              <div className="row">
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="eid">
                                    Employee ID:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="uname"
                                    value={selectedEmployeeId.employeeId}
                                    onChange={(e) =>
                                      setSelectedEmployeeId({
                                        employeeId: e.target.value,
                                      })
                                    }
                                    placeholder="Employee ID"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="pass">
                                    Password:
                                  </Form.Label>
                                  <Form.Control
                                    type="password"
                                    id="pass"
                                    onChange={(e) =>
                                      setSelectedPassword({
                                        password: e.target.value,
                                      })
                                    }
                                    placeholder="Password"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="rpass">
                                    Goverment ID:
                                  </Form.Label>
                                  <div className="mb-3">
                                    <Form.Control
                                      type="file"
                                      className=" form-control-sm"
                                      onChange={handleFileChangeGovIdEdit}
                                      aria-label="Small file input example"
                                    />
                                  </div>
                                </Form.Group>
                                <Form.Group className="col-md-6 form-group">
                                  <Form.Label htmlFor="conpass">
                                    Confirm Password:
                                  </Form.Label>
                                  <Form.Control
                                    type="password"
                                    id="conpass"
                                    onChange={(e) =>
                                      setSelectedConfirmPassword({
                                        cpassword: e.target.value,
                                      })
                                    }
                                    placeholder="Confirm Password"
                                  />
                                </Form.Group>
                                <Form.Group className="col-md-12 form-group">
                                  <Form.Label htmlFor="updoc">
                                    Uploaded Documents:
                                  </Form.Label>
                                  <div
                                    className="mb-3"
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "start",
                                      gap: "24px",
                                    }}
                                  >
                                    <Image
                                      className="bd-placeholder-img bd-placeholder-img-lg img-fluid"
                                      width="30%"
                                      src={defaultGovIdAvatar}
                                      height="70"
                                      xmlns="http://www.w3.org/2000/svg"
                                      role="img"
                                      aria-label="Placeholder: Responsive image"
                                      preserveAspectRatio="xMidYMid slice"
                                      focusable="false"
                                    />
                                    <a
                                      href={defaultGovIdAvatar}
                                      download="identification.jpg"
                                    >
                                      <Button
                                        type="button"
                                        variant="primary"
                                        size="sm"
                                        style={{ marginLeft: "90px" }}
                                      >
                                        Download
                                      </Button>
                                    </a>
                                  </div>
                                </Form.Group>
                              </div>

                              <Button
                                type="button"
                                variant="btn btn-primary"
                                style={{ float: "right" }}
                                onClick={(e) => handleSubmitUpdate(e)}
                              >
                                Update User
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Modal.Body>
              </Modal>
              {/*=======================END MODAL TO edit USER======================= */}

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
                        <th>Profile</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Email</th>

                        <th>Status</th>

                        <th>Join Date</th>
                        <th min-width="100px">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((item, idx) => (
                        <tr key={idx}>
                          <td className="text-center">
                            <Image
                              className="bg-soft-primary rounded img-fluid avatar-40 me-3"
                              src={
                                item?.profilePic?.image
                                  ? item.profilePic.image
                                  : avatars1
                              }
                              alt="profile"
                            />
                          </td>
                          <td>
                            {item.firstName}
                            {item.lastName}
                          </td>
                          <td>{item.phone}</td>
                          <td>{item.email}</td>

                          <td>
                            <span
                              className={`badge ${
                                item.status === "Pending"
                                  ? "bg-warning"
                                  : item.status === "Active"
                                  ? "bg-primary"
                                  : "bg-danger"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>

                          <td>{item.doj}</td>
                          <td>
                            <div className="flex align-items-center list-user-action">
                              <Link
                                className="btn btn-sm btn-icon text-primary flex-end"
                                data-bs-toggle="tooltip"
                                title="Edit user"
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
                                data-bs-toggle="tooltip"
                                title="Delete user"
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

export default UserAdd ;
