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
      client.conversion({ arg0: mont }, (err, result) => {
        if (err) {
          console.error("SOAP request error:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          const convertedAmount = result.return;
          res.status(200).render("conversion", { result: convertedAmount });
        }
      });
    });

    app.get("/retirer", (req, res) => {
      client.getCurrentSolde({}, (err, result) => {
        if (err) {
          console.error("SOAP request error:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          const solde = result.return;
          res.render("retirer", { solde: solde, result: solde });
        }
      });
    });
    app.get("/verser", (req, res) => {
      client.getCurrentSolde({}, (err, result) => {
        if (err) {
          console.error("SOAP request error:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          const solde = result.return;
          res.render("verser", { solde: solde, result: solde });
        }
      });
    });

    app.post("/retirer", (req, res) => {
      mont = req.body.value || 0;
      client.retirer({ arg0: mont }, (err, result) => {
        if (err) {
          console.error("SOAP request error:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          const convertedAmount = result.return;
          res.status(200).render("retirer", {
            result: convertedAmount,
            solde: convertedAmount,
          });
        }
      });
    });

    app.post("/verser", (req, res) => {
      mont = req.body.value || 0;
      client.verser({ arg0: mont }, (err, result) => {
        if (err) {
          console.error("SOAP request error:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          const convertedAmount = result.return;
          res.status(200).render("verser", {
            result: convertedAmount,
            solde: convertedAmount,
          });
        }
      });
    });
  }
});

var myHeaders = new Headers();
myHeaders.append("apikey", "6hztCdNujF35j93EprXhg3rwddzwalwS");

var requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};

let storedCurrencies;
app.get("/list", (req, res) => {
  fetch("https://api.apilayer.com/currency_data/list", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const currencies = JSON.parse(result);
      // console.log(currencies.currencies);
      storedCurrencies = currencies.currencies;
      res.render("list", { value: currencies.currencies });
    })
    .catch((error) => console.log("error", error));
});

app.post("/submit", (req, res) => {
  const fromCurrency = req.body.fromCurrency;
  const toCurrency = req.body.toCurrency;
  const amount = parseFloat(req.body.amount);

  fetch(
    `https://api.apilayer.com/currency_data/convert?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      const convertedAmount = JSON.parse(result);
      res.render("list", {
        value: storedCurrencies,
        convertedAmount: convertedAmount,
      });
    })
    .catch((error) => console.log("error", error));
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
