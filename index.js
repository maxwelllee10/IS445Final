// Required modules 
const express = require("express");
const app = express();
const dblib = require("./dblib.js");

const multer = require("multer");
const upload = multer();

// Add middleware to parse default urlencoded form
app.use(express.urlencoded({ extended: false }));

// Setup EJS
app.set("view engine", "ejs");

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Application folders
app.use(express.static("public"));

// Setup routes
app.get("/", (req, res) => {
    //res.send("Root resource - Up and running!")
    res.render("index");
});

// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});


// import code

app.get("/import", async (req, res) => {
    const totalRecs = await dblib.getTotalRecords();
    const message = "";
    const summary = {
      totalRecordsProcessed: 0,
      recordsInsertedSuccessfully: 0,
      recordsNotInserted: 0,
      errors: [],
    };
    res.render("import", {
      message: message,
      totRecs: totalRecs.totRecords,
      summary: summary,
    });
  });
  
  app.post("/import", upload.single("filename"), async (req, res) => {
    let message = "";
    let totalRecordsProcessed = 0;
    let recordsInsertedSuccessfully = 0;
    let recordsNotInserted = 0;
    let errors = [];
  
    if (!req.file || Object.keys(req.file).length === 0) {
      message = "Error: Import file not uploaded";
      return res.send(message);
    }
  
    //Read file line by line, inserting records
    const buffer = req.file.buffer;
    const lines = buffer.toString().split(/\r?\n/);
  
    const totalRecs = await dblib.getTotalRecords();

    for (const line of lines) {
      const evehicle = line.split(",");
      
      for (let i = 0; i < evehicle.length; i++) {
        if (evehicle[i] === "Null") {
          evehicle[i] = undefined;
        }
      }

      const vid = evehicle[0];
      const vin = evehicle[1];
      const city = evehicle[2];
      const postal_code = evehicle[3];
      const model_year = evehicle[4];
      const make = evehicle[5];
      const model = evehicle[6];
      const ev_type = evehicle[7];
      const electric_range = evehicle[8];
      const base_msrp = evehicle[9];
      const purchase_date = evehicle[10];

  

      try {
        await dblib.insertrecord(
          vid,
          vin,
          city,
          postal_code,
          model_year,
          make,
          model,
          ev_type,
          electric_range,
          base_msrp,
          purchase_date,
        );
        console.log(`Inserted successfully`);
        recordsInsertedSuccessfully++;
      } catch (err) {
        console.log(`Insert Error. Error message: ${err.message}`);
        recordsNotInserted++;
        errors.push(`${vid}: ${err.message}`);
      }
      totalRecordsProcessed++;
    }
  
    res.send({
      totRecs: totalRecs.totRecords,
      totalRecordsProcessed: totalRecordsProcessed,
      recordsInsertedSuccessfully: recordsInsertedSuccessfully,
      recordsNotInserted: recordsNotInserted,
      errors: errors,
    });
  });

// // sumofseries

app.get("/sum", async (req, res) => {
  // Omitted validation check
  res.render("sumofseries", {
      type: "get",
  });
});
