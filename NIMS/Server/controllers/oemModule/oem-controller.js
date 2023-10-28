const {
  oem,
  oemProduct,
  oemSubCategory,
  oemCategory,
} = require("../../models/oem");
const { handleErrorsOem } = require("./handleErrorOem");
const oemList = async (req, res, next) => {
  const oems = await oem.find({});
  res.status(201).json({
    oems: oems,
    message: "Data retrieved successfully ",
    success: true,
  });
};
const createOem = async (req, res, next) => {
  try {
    const { oemName } = req.body;
    const ocode = oemName.slice(0, 2);
    const oemCode = ocode + "001";
    req.body.oemCode = oemCode;

    const newOem = new oem(req.body);
    const oemRegistered = await newOem.save();
    if (oemRegistered) {
      res.status(201).json({
        oems: oemRegistered,
        success: true,
        message: "Oem created successfully",
      });
    }
  } catch (err) {
    const errors = handleErrorsOem(err);
    console.log(errors);
    res.status(400).json({ errors });
  }
};
const editSingleOem = async (req, res, next) => {
  const id = req.params.id;

  const { oemName } = req.body;
  const ocode = oemName.slice(0, 2);
  const oemCode = ocode + "001";
  req.body.oemCode = oemCode;

  oem
    .findOneAndUpdate({ _id: id }, req.body, { runValidators: true })
    .then((result) => {
      res.status(201).json({
        oemName: id,
        success: true,
        message: "Oem updated successfully",
      });
    })
    .catch((err) => {
      const errors = handleErrorsOem(err);
      res.status(400).json({ errors });
    });
};
const deleteOem = async (req, res, next) => {
  try {
    const id = req.params.id;

    oem
      .findByIdAndDelete(id)
      .then((result) => {
        res.json({
          success: true,
          message: "Oem deleted successfully",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};
const oemProductList = async (req, res, next) => {
  try {
    const oems = await oem.find({});
    const oemProducts = await oemProduct.find({});
    const oemCategorys = await oemCategory.find({});
    const oemSubCategorys = await oemSubCategory.find({});
    res.status(201).json({
      oems: oems,
      oemProduct: oemProducts,
      oemCategory: oemCategorys,
      oemSubCategory: oemSubCategorys,
      message: "Data retrieved successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to retrieve data at this moment",
      success: false,
    });
  }
};
const oemProductAdd = async (req, res, next) => {
  try {
    const { categoryName, subcategoryName } = req.body;
    if (req.file) {
      const filePath = path.join(
        __dirname + "/" + `../uploads/assets/csv/` + req.file.filename
      );
      const jsonArray = await csv().fromFile(filePath);
      if (!jsonArray || jsonArray.length === 0) {
        // No data in the CSV file or error reading the file
        return res.status(400).json({
          message: "No data in the CSV file or error reading the file",
        });
      }

      // Process the CSV data and insert into newOemProduct schema
      const csvDataToSave = jsonArray.map((data) => {
        const ocode = data.oemCode.slice(0, 2); // Modify this based on your actual data
        const oemdCode = ocode + "001";
        // Map CSV data to the schema properties of newOemProduct
        return {
          oemCode: oemdCode.trim(),
          categoryName: data.categoryName.trim(),
          subcategoryName: data.subcategoryName.trim(),
          modelName: data.modelName.trim(),
          additionalInfo: data.additionalInfo.trim(),
          // Add other properties as needed
        };
      });

      // Check if categoryName exists in the CSV data
      const uniqueCategories = [
        ...new Set(
          csvDataToSave.map((item) => item.categoryName.toLowerCase())
        ),
      ];
      console.log(uniqueCategories);
      for (const category of uniqueCategories) {
        console.log(`hi${category}`);
        const ifExistCategory = await oemCategory.findOne({
          categoryName: category,
        });
        console.log(ifExistCategory);
        if (!ifExistCategory) {
          // Create a new entry in the oemCategory schema
          const newCategoryEntry = new oemCategory({ categoryName: category });
          await newCategoryEntry.save();
        }
      }

      // Check if categoryName exists in the CSV data
      const uniqueSubCategories = [
        ...new Set(
          csvDataToSave.map((item) => item.subcategoryName.toLowerCase())
        ),
      ];

      for (const subcategory of uniqueSubCategories) {
        const ifExistSubCategory = await oemSubCategory.findOne({
          subcategoryName: subcategory,
        });
        console.log(ifExistSubCategory);
        if (!ifExistSubCategory) {
          // Create a new entry in the oemCategory schema
          const newCategoryEntry = new oemSubCategory({
            subcategoryName: subcategory,
          });
          await newCategoryEntry.save();
        }
      }
      const savedData = await oemProduct.insertMany(csvDataToSave);

      if (savedData) {
        return res.status(201).json({
          docs: savedData,
          success: true,
          message: "CSV data uploaded successfully",
        });
      } else {
        return res.status(400).json({
          message: "Error saving CSV data to the database",
        });
      }
    } else {
      const newOemProduct = new oemProduct(req.body);
      const oemRegisteredProduct = await newOemProduct.save();
      if (oemRegisteredProduct) {
        let newCat, newSubCat;
        const ifExistCategory = await oemCategory.findOne({ categoryName });

        if (!ifExistCategory) {
          const newCategory = new oemCategory({ categoryName: categoryName });
          newCat = await newCategory.save();
        }
        const ifExistSubCategory = await oemSubCategory.findOne({
          subcategoryName,
        });
        if (!ifExistSubCategory) {
          const newSubCategory = new oemSubCategory({
            subcategoryName: subcategoryName,
          });
          newSubCat = await newSubCategory.save();
        }
        res.status(201).json({
          oemProduct: oemRegisteredProduct,
          oemCategory: newCat,
          oemSubCategory: newSubCat,
          success: true,
          message: "Oem product created successfully",
        });
      }
    }
  } catch (err) {
    console.log(err);
    const errors = handleErrorsOem(err);
    console.log(errors);
    res.status(400).json({ errors });
  }
};
const oemProductUpdate = async (req, res, next) => {
  const id = req.params.id;

  oemProduct
    .findOneAndUpdate({ _id: id }, req.body, { runValidators: true })
    .then((result) => {
      res.status(201).json({
        oemProduct: id,
        success: true,
        message: "Product updated successfully",
      });
    })
    .catch((err) => {
      const errors = handleErrorsOem(err);
      res.status(400).json({ errors });
    });
};
const oemProductDelete = async (req, res, next) => {
  try {
    const id = req.params.id;

    oemProduct
      .findByIdAndDelete(id)
      .then((result) => {
        res.json({
          success: true,
          message: "Product deleted successfully",
        });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ success: false, message: "Error deleting the product" });
      });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error " });
  }
};

module.exports = {
  oemList,
  createOem,
  editSingleOem,
  deleteOem,
  oemProductList,
  oemProductAdd,
  oemProductUpdate,
  oemProductDelete,
};
