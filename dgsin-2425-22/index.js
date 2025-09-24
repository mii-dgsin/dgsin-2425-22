// Importar módulos
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
var cors = require('cors');
const initialCountries = require("./data/initialCountries");

// Configuración base
const BASE_API = "/api/v1";
const mdbURL = process.env.MDB_URL;
const DB_NAME = "dgsin-2425-22";

// Inicializar Express
const app = express();
app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use(cors());

let db; // Variable global para la colección

// Conexión a MongoDB
MongoClient.connect(mdbURL, { useUnifiedTopology: true })
    .then(client => {
        console.log("Conectado a MongoDB Atlas");
        const database = client.db(DB_NAME);
        db = database.collection("countries");
    })
    .catch(err => {
        console.error("Error conectando a la base de datos: ", err);
        db = null;
    });


// GET: Obtener todos los países
app.get(BASE_API + "/countries", (req, res) => {
    if (!db){
        return res.status(503).send("Base de datos no disponible");
    };
    console.info("GET /countries");
    db.find({}).toArray()
        .then(countries => res.status(200).json(countries))
        .catch(err => {
            console.error("Error accediendo a la BD: ", err);
            res.sendStatus(500);
        });
});

// POST: Crear nuevo país
app.post(BASE_API + "/countries", async (req, res) => {
    if (!db) {
        return res.status(503).send("Base de datos no disponible");
    }
    const newCountry = req.body;
    if (!newCountry || !newCountry.name || !newCountry.date || !newCountry.debt || !newCountry.debt_percentage ||
    !newCountry.debt_per_capita || !newCountry.risk_prism || !newCountry.annual_risk_variation) {
        console.warn("POST /countries mal formado");
        return res.sendStatus(422);
    }else{
          const isValid =
            newCountry &&
            typeof newCountry.name === "string" &&
            typeof newCountry.date === "string" &&
            typeof newCountry.debt === "number" &&
            typeof newCountry.debt_percentage === "number" &&
            typeof newCountry.debt_per_capita === "number" &&
            typeof newCountry.risk_prism === "number" &&
            typeof newCountry.annual_risk_variation === "number";

        if (!isValid) {
            console.warn("POST /countries con tipos incorrectos");
            return res.status(422).json({
                error: "Datos mal formados. Asegúrate de que todos los campos tengan el tipo correcto.",
                expectedFormat: {
                    name: "string",
                    date: "string (YYYY-MM-DD)",
                    debt: "number",
                    debt_percentage: "number",
                    debt_per_capita: "number",
                    risk_prism: "number",
                    annual_risk_variation: "number"
                }
            });
        }
    }
    try {
        const existing = await db.findOne({ name: newCountry.name });
        if (existing) {
            console.warn("Pais duplicado:", newCountry.name );
            return res.sendStatus(409);
        }
        await db.insertOne(newCountry);
        console.info("Pais añadido:", newCountry.name );
        res.sendStatus(201);
    } catch (err) {
        console.error("Error en POST /countries: ", err);
        res.sendStatus(500);
    }
});

// DELETE: Eliminar todos los países
app.delete(BASE_API + "/countries", async (req, res) => {
    if (!db){
        return res.status(503).send("Base de datos no disponible");
    }
    try {
        const result = await db.deleteMany({});
        console.info(`${result.deletedCount} paises eliminados`);
        res.status(200).send(`Se eliminaron ${result.deletedCount} paises`);
    } catch (err) {
        console.error("Error al eliminar todos los paises:", err);
        res.sendStatus(500);
    }
});

app.put(BASE_API + "/countries", (req, res) => {
    console.warn("New PUT request to /countries, sending 405 ...");
    res.sendStatus(405);
});

//----------------------------------------------------------------------------
// GET: Obtener país por fecha
app.get(BASE_API + "/countries/:name", async (req, res) => {
    if (!db){
        return res.status(503).send("Base de datos no disponible");
    };
    const name  = req.params.name ;

    if (!name) {
        console.warn("GET /countries/:nombre sin 'name ', enviando 400");
        return res.sendStatus(400);
    }
    console.info("GET /countries/" + name);
    try {
        const country = await db.findOne({ name });

        if (!country) {
            console.warn("No existe pais con nombre = " + name);
            return res.sendStatus(404);
        }

        res.status(200).json(country);
    } catch (err) {
        console.error("Error accediendo a MongoDB:", err);
        res.sendStatus(500);
    }
});

app.post(BASE_API + "/countries/:name", (req, res) => {
    var name  = req.params.name;
    console.warn("New POST request to /countries/" + name + ", sending 405 ...");
    res.sendStatus(405);
});

// DELETE: Eliminar un país
app.delete(BASE_API + "/countries/:name", async (req, res) => {
    const name  = req.params.name;
    try {
        const result = await db.deleteOne({ name });
        result.deletedCount === 0 ? res.sendStatus(404) : res.sendStatus(200);
    } catch (err) {
        console.error("Error en DELETE /countries:", err);
        res.sendStatus(500);
    }
});

// PUT: Actualizar un país existente
app.put(BASE_API + "/countries/:name", async (req, res) => {
    const updatedCountry = req.body;
    const name = req.params.name;
    if (updatedCountry.name !== name) {
        return res.status(409).json({
        error: `El nombre de la URL (${urlName}) no coincide con el del cuerpo (${bodyName}).`
    });
    }
    if (!updatedCountry || !updatedCountry.date|| !updatedCountry.debt || !updatedCountry.debt_percentage 
        || !updatedCountry.debt_per_capita || !updatedCountry.risk_prism || !updatedCountry.annual_risk_variation) {
        return res.sendStatus(422);
    }
    try {
        const result = await db.updateOne(
            { name },
            {$set: {date: updatedCountry.date, debt: updatedCountry.debt,  
                    debt_percentage: updatedCountry.debt_percentage,
                    debt_per_capita: updatedCountry.debt_per_capita, 
                    risk_prism : updatedCountry.risk_prism ,
                    annual_risk_variation: updatedCountry.annual_risk_variation
                }
            }
        );
        result.modifiedCount === 0 ? res.sendStatus(404) : res.sendStatus(200);
    } catch (err) {
        console.error("Error en PUT /countries:", err);
        res.sendStatus(500);
    }
});


// GET: Introducir los paises iniciales
app.get(BASE_API + "/countries/loadInitialData", async (req, res) => {
  if (!db) {
    return res.status(503).send("Base de datos no disponible");
  }
  try {
    const count = await db.countDocuments();
    if (count > 0) {
      console.info("Datos ya existentes, no se insertan");
      return res.status(200).send("La base de datos ya contiene datos");
    }
    await db.insertMany(initialCountries);
    console.info("Datos iniciales insertados");
    res.status(201).send("Datos iniciales insertados correctamente");
  } catch (err) {
    console.error("Error en /loadInitialData:", err);
    res.sendStatus(500);
  }
});

// GET: Redirigir al enlace de Postman
app.get("/api/v1/countries/docs", (req, res) => {
  res.redirect("https://www.postman.com/avionics-astronaut-7358837/dgsin-2425-22/collection/44o4dmw/rest-api-basics-crud-test-variable?action=share&source=copy-link&creator=46704898");
});


const axios = require('axios');
// GET: Obtener datos de API Externa
app.get(BASE_API + "/proxy-countries", async (req, res) => {
  try {
    const externalResponse = await axios.get("https://restcountries.com/v3.1/alpha?codes=USA,JPN,DEU,FRA,ITA,ESP,IND,NOR,MEX,KOR,ARG,SWE&fields=name,cca3,flags,population,region,capital");
    res.status(200).json(externalResponse.data);
  } catch (error) {
    console.error("Error al obtener datos externos:", error.message);
    res.status(500).send("Error al conectar con la API externa");
  }
});

// GET: Redirigir al enlace de video explicatorio
app.get(BASE_API + "/about-videos", (req, res) => {
  const videoURL = "https://www.youtube.com/watch?v=tuVideoID";
  res.redirect(videoURL);
});

// Iniciar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
}).on("error", (e) => {
    console.error("Error al iniciar el servidor:", e);
});

