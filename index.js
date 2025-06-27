const express = require('express');

const customerApp = express();
customerApp.use(express.json());

const customers = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

customerApp.get("/customers", (req, res) => {
  res.json(customers);
});

customerApp.get("/customers/:id", (req, res) => {
  const customer = customers.find((c) => c.id == req.params.id);
  if (customer) {
    res.json(customer);
  } else {
    res.status(404).send({ error: "Customer not found" });
  }
});

customerApp.post("/customers", (req, res) => {
  const newCustomer = { id: customers.length + 1, ...req.body };
  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

if (require.main === module) {
  customerApp.listen(8081, () =>
    console.log("Customer Service running on port 8081")
  );
}

module.exports = customerApp;