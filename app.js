import express from "express";
import expressHandlebars from "express-handlebars";
import __dirname from "./__dirname.js";
import mongodb from "mongodb";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import multer from "multer";
import { messagesError } from "./src/messages/messagesError.js";
import { getRegistration, postRegistration } from "./src/rout/registration.js";
import { getAuthorisation, postAuthorisation } from "./src/rout/authorization.js";
import { getHome } from "./src/rout/home.js";
import { getCreateRecipes, postCreateRecipes } from "./src/rout/createRecipes.js";
import { postCategory } from "./src/rout/category.js";
import { getAdmin } from "./src/rout/admin.js";
import { getEdit, postEdit } from "./src/rout/editId.js";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const filePathCSV = path.join(__dirname, "data", "ingredients.csv");

function readIngredientsFromCSV() {
  return new Promise((resolve, reject) => {
    const ingredients = [];
    fs.createReadStream(filePathCSV)
      .pipe(csv())
      .on("data", (row) => {
        ingredients.push({
          name: row.name,
          measurement_unit: row.measurement_unit,
        });
      })
      .on("end", () => {
        resolve(ingredients);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

const handlebars = expressHandlebars.create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: {
    ifEquals: function (arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    },
    eq: function (arg1, arg2) {
      return arg1 === arg2;
    },
  },
});

let app = express();
app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/src/views/")); 

app.use(express.static(__dirname + "/dist/"));
app.use(express.static(__dirname + "/dist/images/"));
app.use(express.static(__dirname + "/dist/img/"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");
let mongoClient = new mongodb.MongoClient("mongodb://127.0.0.1:27017/");

try {
  let mongo = await mongoClient.connect();
  let db = mongo.db("sharing-recipes");
  let usersdb = db.collection("users");
  let recipesdb = db.collection("recipes");

  app.get("/registration", async function (req, res) {
    await getRegistration(req, res);
  });
  app.get("/", async function (req, res) {
    await getHome(req, res, usersdb, recipesdb);
  });
  app.post("/home/:category", upload, async function (req, res) {
    await postCategory(req, res, usersdb, recipesdb);
  });
  app.post("/registration", async function (req, res) {
    await postRegistration(req, res, usersdb);
  });
  app.get("/authorization", async function (req, res) {
    await getAuthorisation(req, res, usersdb);
  });
  app.post("/authorization", async function (req, res) {
    await postAuthorisation(req, res, usersdb);
  });
  app.get("/admin", async function (req, res) {
    await getAdmin(req, res, usersdb, recipesdb);
  });
  app.get("/edit/:id", async function (req, res) {
    await getEdit(req, res, usersdb, recipesdb);
  });
  app.post("/edit/:id", upload, async function (req, res) {
    await postEdit(req, res, usersdb, recipesdb);
  });
  app.get("/create", async function (req, res) {
    await getCreateRecipes(req, res, usersdb);
  });
  app.post("/create", upload, async function (req, res) {
    await postCreateRecipes(req, res, usersdb, recipesdb);
  });
  app.get("/api/ingredients", async (req, res) => {
    try {
      const ingredients = await readIngredientsFromCSV();
      res.json(ingredients);
    } catch (error) {
      console.error(messagesError.errors.ingredientsCSVError, error);
      res.status(500).json({ error: messagesError.errors.internalServerError });
    }
  });
} catch (err) {
  console.error(err, "no connected db");
}

app.use(function (req, res) {
  res.status(404).render("404", {
    layout: "404",
    title: messagesError.errors.titleError,
  });
});

app.listen(3000, function () {
  console.log("running");
});
