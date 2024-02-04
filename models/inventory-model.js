const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

// to retrieve the data for a specific vehicle
async function getVehicleById(id) {
  try{
    const vehicle = await pool.query(
      'SELECT * FROM public.inventory WHERE inv_id = $1', [id]
    )
    return vehicle.rows[0];
  } catch(error){
    console.error('getVehicleById error ' + error); 
  }
};

// to add a new classification
async function addClassification(classification_name) {
  try {
      const result = await pool.query(
          'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *', 
          [classification_name]
      );
      return result.rows[0];
  } catch (error) {
      console.error('addClassification error ' + error);
  }
}

// to add a new inventory item
async function addInventory(inv) {
  try {
    const result = await pool.query(
      'INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_color, inv_price, inv_mileage, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [inv.inv_make, inv.inv_model, inv.inv_year, inv.inv_color, inv.inv_price, inv.inv_mileage, inv.classification_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('addInventory error ' + error);
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory};