const { userdepartment } = require("../../models/user");

const { handleErrors } = require("./handleError");

const departmentView = async (req, res, next) => {
  const departments = await userdepartment.find({});
  res.status(201).json({
    departments: departments,
    message: "Data retrieved successfully",
    success: true,
  });
};

const createDepartment = async (req, res, next) => {
  try {
    
    const { departmentName } = req.body;
    
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
      res
        .status(201)
        .json({ department: id, location: "/user/add-department" });
    })
    .catch((err) => {
      console.log(err);
      const errors = handleErrors(err);

      res.status(400).json({ errors });
    });
};

const deleteDepartment = (req, res, next) => {
  try {
    const id = req.params.id;
    userdepartment
      .findByIdAndDelete(id)
      .then((result) => {
        res.json({ location: "/user/add-department" });
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
