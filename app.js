const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

// set view engine defaults
app.set("view engine", "ejs");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// connect to database
mongoose.connect("mongodb://localhost:27017/mydb", { useNewUrlParser: true });

// define schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// define model
const User = mongoose.model("User", userSchema);
const data = [];
// serve static files
app.use(express.static(path.join(__dirname, "public")));

// send index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// post route form
app.post("/add", (req, res) => {
  const data = []; // deklarasi variable data sebagai array kosong
  const { name, email, phone } = req.body;
  const newData = {
    id: data.length + 1,
    name,
    email,
    phone,
  };
  data.push(newData);
  res.redirect("/");
});
// get route form
app.get("/data", (req, res) => {
  res.render("data", { data: data });
});

// create new user
app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// update user by id
app.put("/users/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, {
      name,
      email,
      password,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// delete user by id
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
