require("dotenv").config();
// Add database package and connection string
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 2
});

// gettotalrecords

const getTotalRecords = () => {
    sql = "SELECT COUNT(*) FROM evehicle";
    return pool.query(sql)
        .then(result => {
            return {
                msg: "success",
                totRecords: result.rows[0].count
            }
        })
        .catch(err => {
            return {
                msg: `Error: ${err.message}`
            }
        });
};

// insertrecord
async function insertrecord(vid, vin, city, postal_code, model_year, make, model, ev_type, electric_range, base_msrp, purchase_date) {
    try {
      const query = {
        text: 'INSERT INTO evehicle (vid, vin, city, postal_code, model_year, make, model, ev_type, electric_range, base_msrp, purchase_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
        values: [vid, vin, city, postal_code, model_year, make, model, ev_type, electric_range, base_msrp, purchase_date],
      };
  
      const result = await pool.query(query);
      console.log(`Inserted successfully`);
  
      return result;
    } catch (err) {
      console.error(`Insert Error. Error message: ${err.message}`);
      throw err;
    }
  }

module.exports.getTotalRecords = getTotalRecords;
module.exports.insertrecord = insertrecord;


