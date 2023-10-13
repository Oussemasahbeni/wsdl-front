const express = require("express");
const app = express();
const soap = require("strong-soap").soap;

// Create a SOAP client
const url = "http://localhost:5555/?WSDL";

// const requestArgs = {
//   mont: 100.0,
// };
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});

const client = soap.createClient(url, (err, client) => {
  if (err) {
    console.error("Error creating SOAP client:", err);
  } else {
    app.post("/conversion", (req, res) => {
      mont = req.body.value || 0;

      console.log("mont is ", mont);
      client.conversion({ arg0: mont }, (err, result) => {
        if (err) {
          console.error("SOAP request error:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          let convertedAmount = result.return;
          console.log("converted amount is ", convertedAmount);
          // res.json({ result: convertedAmount });
          res.status(200).render("conversion", { result: convertedAmount });
          // convertedAmount = 0;
          // res.status(200).redirect(`/conversion?result=${convertedAmount}`);
        }
      });
    });
  }
});
app.get("/conversion", (req, res) => {
  // const result = req.query.result || 0;
  // console.log("Request body:", req.query.result);
  res.render("conversion");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
