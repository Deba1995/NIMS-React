const { clientsector } = require("../../models/client");

const { handleErrorsClient } = require("./handleErrorClient");

const sectorView = async (req, res, next) => {
  const sectors = await clientsector.find({});
  res.status(201).json( { 
    sectors: sectors,
    message: "Data retrieved successfully",
    success: true,
   });
};

const createSector = async (req, res, next) => {
  try {
    const { sectorName } = req.body;
    const scode = sectorName.slice(0, 3);
    const sectorCode = scode + "001";
    //creating new sector document
    const newSector = new clientsector({
      sectorName,
      sectorCode,
    });
    // saving the document
    const clientSector = await newSector.save();
    if (clientSector) {
      res.status(201).json({ 
        sector: clientSector,
        success: true,
        message: "Sector created successfully",
       });
    }
  } catch (err) {
    const errors = handleErrorsClient(err);
    res.status(400).json({ errors });
  }
};

const editSector = async (req, res, next) => {
  const id = req.params.id;
  const { sectorName } = req.body;
  const scode = sectorName.slice(0, 3);
  const sectorCode = scode + "001";
  req.body.sectorCode = sectorCode;
  clientsector
    .findByIdAndUpdate(id, req.body, { runValidators: true })
    .then((result) => {
      res.status(201).json({ sector: id, 
      success:true,
      message: "Sector edited successfully",  
      });
    })
    .catch((err) => {
      console.log(err);
      const errors = handleErrorsClient(err);

      res.status(400).json({ errors });
    });
};

const deleteSector = async (req, res, next) => {
  try {
    const id = req.params.id;
    clientsector
      .findByIdAndDelete(id)
      .then((result) => {
        res.json({ 
          success: true,
          message: "Sector deleted successfully",
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
  sectorView,
  createSector,
  editSector,
  deleteSector,
};
