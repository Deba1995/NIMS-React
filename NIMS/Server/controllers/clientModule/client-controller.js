const { clientsector, client } = require("../../models/client");

const { handleErrorsClient } = require("./handleErrorClient");


const singleClient = async (req, res, next) => {
  try {
    const clientId = req.params.id;

    const singleClient = await client.find({ _id: clientId });
    const sectors = await clientsector.find({});

    if (!singleClient) {
      // Handle the case when the user with the provided ID is not found
      const err = { message: "Not found" };
      res.status(404).json({ err });
    }

    res.status(201).json({
      singleClient: singleClient[0],
      sectors: sectors,
      success: true,
      message: "Client created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const createClient = async (req, res, next) => {
  try {
    if (req.body?.departments === undefined) {
      req.body["departments"] = "";
    }
    console.log(req.body)
    const newClient = new client(req.body);
    const clientRegistered = await newClient.save();
    if (clientRegistered) {
      res.status(201).json({
        client: clientRegistered,
        success: true,
        message: "Client created successfully",
      });
    }
  } catch (err) {
    console.log(err);
    const errors = handleErrorsClient(err);
    console.log(errors);
    res.status(400).json({ errors });
  }
};

const clientList = async (req, res, next) => {
  const clients = await client.find({});
  const sectors = await clientsector.find({});
  
  res.status(201).json({
    clients: clients,
    sectors: sectors,
    message: "Data retrieved successfully",
    success: true,
  });
};

const editSingleClient = async (req, res, next) => {
  const id = req.params.id;
  if (req.body?.departments === undefined) {
    req.body["departments"] = "";
  }
  
  client
    .findOneAndUpdate({clientId: id}, req.body, { runValidators: true })
    .then((result) => {
      res
        .status(201)
        .json({
           client: id,
           success:true,
           message: "client updated successfully", 
        });
    })
    .catch((err) => {
      console.log(err)
      const errors = handleErrorsClient(err);
      console.log(errors)
      res.status(400).json({ errors });
    });
};

const deleteClient = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    client
      .findByIdAndDelete(id)
      .then((result) => {
        res.json({ 
          success: true,
          message: "Client deleted successfully",
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
 
  singleClient,
  createClient,
  clientList,
  editSingleClient,
  deleteClient,
};
