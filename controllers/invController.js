const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav();
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ***************************
 *  Build vehicleDetail view
 * ************************** */
invCont.getVehicleById = async (req, res) => {
  const vehicle = await invModel.getVehicleById(req.params.id);
  const vehicleHtml = utilities.buildVehicleHtml(vehicle);
  let nav = await utilities.getNav();
  res.render('./inventory/vehicleDetail', { 
    title: vehicle.inv_make + ' ' + vehicle.inv_model,
    nav,
    vehicleHtml
  });
};

/* ***************************
 *  Build mangement view
 * ************************** */
invCont.buildManagement = async (req, res) => {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
  });
}

/* ***************************
  *  Build AddClassification view
  * ************************** */ 
invCont.buildAddClassification = async (req, res) => {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
  });
}

// Process the add classification data
invCont.addClassification = async (req, res) => {
  try {
      let classificationName = req.body.classificationName;
      if (!classificationName.match(/^[a-zA-Z0-9]+$/)) {
          throw new Error('Invalid classification name. It should not contain spaces or special characters.');
      }

      await invModel.addClassification(classificationName);

      req.flash('notice', 'Classification added successfully');
      res.redirect('/inv');
  } catch (error) {
      req.flash('notice', error.message);
      res.redirect('/inv/add-classification');
  }
}

/* ***************************
  *  Build AddInventory view
  * ************************** */ 
invCont.buildAddInventory = async (req, res) => {
  let nav = await utilities.getNav();
  let classifications = await utilities.buildOptions();
  res.render('inventory/add-inventory', { 
    title: 'Add Vehicle', 
    nav,
    options: classifications, 
  });
};

invCont.addInventory = async (req, res) => {
  let nav = await utilities.getNav();
  let classifications = await utilities.buildOptions();
  try {
    // Validate the input
    // TODO: Add validation logic here
    if (req.body.inv_make === '') {
      throw new Error('Make is required');
    }
    if (req.body.inv_model === '') {
      throw new Error('Model is required');
    }
    if (req.body.inv_year === '') {
      throw new Error('Year is required');
    }
    if (req.body.inv_color === '') {
      throw new Error('Color is required');
    }
    if (req.body.inv_price === '') {
      throw new Error('Price is required');
    }
    if (req.body.inv_miles === '') {
      throw new Error('Mileage is required');
    }
    if (req.body.inv_image === '') {
      throw new Error('Image is required');
    }
    if (req.body.inv_description === '') {
      throw new Error('Description is required');
    }
    if (req.body.inv_thumbnail === '') {
      throw new Error('Thumbnail is required');
    }
    if (req.body.classification_id === '') {
      throw new Error('Classification is required');
    }
    
    // If valid, add the vehicle to the database
    // TODO: Add code to add the vehicle to the database
    const inv = {
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_color: req.body.inv_color,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_image: req.body.inv_image,
      inv_description: req.body.inv_description,
      inv_thumbnail: req.body.inv_thumbnail,
      classification_id: req.body.classification_id,
    };
    await invModel.addInventory(inv); 
    // If successful, redirect to the management view with a success message
    req.flash('notice', 'Vehicle added successfully');
    res.redirect('/inv');
  } catch (error) {
    // If not successful, render the add-inventory view with an error message
    req.flash('notice', error.message);
    res.render('inventory/add-inventory', {
      title: 'Add Vehicle',
      nav,
      options: classifications,
    });
  }
};

module.exports = invCont