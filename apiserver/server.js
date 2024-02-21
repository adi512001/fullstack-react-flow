const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const services = require("./db/services.json");
const dataFlows = require("./db/dataFlows.json");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);

app.get("/dataFlows/left", (req, res) => {
  try {
    const { serviceId } = req.query;
    const results = [];
    if (serviceId && serviceId !== "") {
      const servicesFlows = dataFlows.filter((dataFlow) =>
        dataFlow.sendingToServices.find((id) => id === serviceId)
      );
      for (const flow of servicesFlows) {
        const service = services.find((service) => service.id === flow.id);
        service && results.push(service);
      }
    }
    res.send(results);
  } catch (error) {
    console.error(
      "Error occurred while processing /dataFlows/left route:",
      error
    );
    res.status(500).send("Internal Server Error");
  }
});

app.get("/dataFlows/right", (req, res) => {
  try {
    const { serviceId } = req.query;
    let results = [];
    if (serviceId && serviceId !== "") {
      const serviceIds = dataFlows.find(
        (dataFlow) => dataFlow.id === serviceId
      )?.sendingToServices;
      results = serviceIds
        ? services.filter((service) =>
            serviceIds.find((id) => id === service.id)
          )
        : [];
    }
    res.send(results);
  } catch (error) {
    console.error(
      "Error occurred while processing /dataFlows/right route:",
      error
    );
    res.status(500).send("Internal Server Error");
  }
});

app.get("/services", (req, res) => {
  try {
    const { searchValue } = req.query;
    let results = [...services];
    if (searchValue && searchValue !== "") {
      results = services.filter((service) =>
        service.label.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    res.send(results);
  } catch (error) {
    console.error("Error occurred while processing /services route:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/serviceById", (req, res) => {
  try {
    const { serviceId } = req.query;
    const result = services.find((service) => service.id === serviceId);
    res.send(result);
  } catch (error) {
    console.error("Error occurred while processing /serviceById route:", error);
    res.status(500).send("Internal Server Error");
  }
});

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});
