const { userdepartment } = require("../../models/user");

const { handleErrors } = require("./handleError");

const departmentView = async (req, res, next) => {
  const departments = await userdepartment.find({});
  if (departments.length != 0) {
    res.status(201).json({
      departments: departments,
      message: "Data retrieved successfully",
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Error retrieving the data or no data available",
    });
  }
};

const createDepartment = async (req, res, next) => {
  try {
    console.log("Hi from department");
    const { departmentName } = req.body;
    console.log(departmentName);
    const dcode = departmentName.slice(0, 3);
    const departmentCode = dcode + "001";
    //creating new department document
    const newDepartment = new userdepartment({
      departmentName,
      departmentCode,
    });
    // saving the document
    const userDepartment = await newDepartment.save();
    if (userDepartment) {
      res.status(201).json({
        department: userDepartment,
        success: true,
        message: "Department created successfully",
      });
    }
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const editDepartment = async (req, res, next) => {
  const id = req.params.id;
  const { departmentName } = req.body;
  const dcode = departmentName.slice(0, 3);
  const departmentCode = dcode + "001";
  req.body.departmentCode = departmentCode;
  userdepartment
    .findByIdAndUpdate(id, req.body, { runValidators: true })
    .then((result) => {
      res.status(201).json({
        department: id,
        success: true,
        message: "Department updated successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      const errors = handleErrors(err);
      console.log(errors);
      res.status(400).json({ errors });
    });
};

const deleteDepartment = (req, res, next) => {
  try {
    const id = req.params.id;
    userdepartment
      .findByIdAndDelete(id)
      .then((result) => {
        res.json({ success: true, message: "Department deleted successfully" });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  departmentView,
  createDepartment,
  editDepartment,
  deleteDepartment,
};
