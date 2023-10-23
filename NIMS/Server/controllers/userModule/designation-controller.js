const { userdesignation, userdepartment } = require("../../models/user");

const { handleErrors } = require("./handleError");

const designationView = async (req, res, next) => {
  const designations = await userdesignation.find({});
  const departments = await userdepartment.find({});
  res.status(201).json({
    designations: designations,
    departments: departments,
    message: "Data retrieved successfully",
    success: true,
  });
};

const createDesignation = async (req, res, next) => {
  try {
    const { designationName, departmentCode } = req.body;
    //creating new designation document
    console.log(designationName, departmentCode);
    const dcode = designationName.slice(0, 3);
    const designationCode = dcode + "100";
    const newDesignation = new userdesignation({
      designationName,
      designationCode,
      departmentCode,
    });
    // saving the document
    const userDesignation = await newDesignation.save();
    if (userDesignation) {
      res.status(201).json({
        designation: userDesignation,
        success: true,
        message: "Designation created successfully",
      });
    }
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    console.log(errors);
    res.status(400).json({ errors });
  }
};

const editDesignation = (req, res, next) => {
  const id = req.params.id;
  const { designationName, departmentCode } = req.body;
  console.log(designationName, departmentCode)
  const dcode = designationName.slice(0, 3);
  const designationCode = dcode + "100";
  req.body.designationCode = designationCode;
  userdesignation
    .findByIdAndUpdate(id, req.body, { runValidators: true })
    .then((result) => {
      res
        .status(201)
        .json({
          designation: id,
          success: true,
          message: "Designation added successfully",
        });
    })
    .catch((err) => {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    });
};

const deleteDesignation = (req, res, next) => {
  try {
    const id = req.params.id;
    userdesignation
      .findByIdAndDelete(id)
      .then((result) => {
        res.json({
          success:true,
          message:"Designation deleted successfully"
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  designationView,
  createDesignation,
  editDesignation,
  deleteDesignation,
};
