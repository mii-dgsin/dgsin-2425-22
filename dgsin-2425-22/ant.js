// Importar módulos
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
var cors = require('cors');

// Configuración base
const BASE_API = "/api/v1";
const mdbURL = "mongodb+srv://fracamcas1:kMD6Gt725LK8hQzL@dgsin-2425-22.kbcla6p.mongodb.net/?retryWrites=true&w=majority";
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
        console.log("✅ Conectado a MongoDB Atlas");
        const database = client.db(DB_NAME);
        db = database.collection("contacts");
    })
    .catch(err => {
        console.error("❌ Error conectando a la base de datos: ", err);
        db=null;
    });

// GET: Obtener todos los contactos
app.get(BASE_API + "/contacts", (req, res) => {
     if (!db) {
        return res.status(503).send("Base de datos no disponible");
    };
    console.info("📡 GET /contacts");
    db.find({}).toArray()
        .then(contacts => res.status(200).json(contacts))
        .catch(err => {
            console.error("❌ Error accediendo a la BD: ", err);
            res.sendStatus(500);
        });
});

// POST: Crear nuevo contacto
app.post(BASE_API + "/contacts", async (req, res) => {
    if (!db) {
        return res.status(503).send("Base de datos no disponible");
    }
    const newContact = req.body;
    if (!newContact || !newContact.name || !newContact.email || !newContact.phone) {
        console.warn("⚠️ POST /contacts mal formado");
        return res.sendStatus(422);
    }
    try {
        const existing = await db.findOne({ name: newContact.name });
        if (existing) {
            console.warn("⚠️ Contacto duplicado:", newContact.name);
            return res.sendStatus(409);
        }
        await db.insertOne(newContact);
        console.info("✅ Contacto añadido:", newContact.name);
        res.sendStatus(201);
    } catch (err) {
        console.error("❌ Error en POST /contacts: ", err);
        res.sendStatus(500);
    }
});

// DELETE: Eliminar todos los contactos
app.delete(BASE_API + "/contacts", async (req, res) => {
    if (!db) {
        return res.status(503).send("Base de datos no disponible");
    }
    try {
        const result = await db.deleteMany({});
        console.info(`✅ ${result.deletedCount} contactos eliminados`);
        res.status(200).send(`Se eliminaron ${result.deletedCount} contactos`);
    } catch (err) {
        console.error("❌ Error al eliminar todos los contactos:", err);
        res.sendStatus(500);
    }
});

app.put(BASE_API + "/contacts", (req, res) =>{
    console.warn("New PUT request to /contacts, sending 405 ...");
    res.sendStatus(405);
});

//----------------------------------------------------------------------------

// GET: Obtener un contacto por nombre desde la base de datos
app.get(BASE_API + "/contacts/:name", async (req, res) => {
    if (!db) {
        return res.status(503).send("Base de datos no disponible");
    }
    const name = req.params.name;

    if (!name) {
        console.warn("⚠️ GET /contacts/:name sin 'name', enviando 400");
        return res.sendStatus(400);
    }
    console.info("📡 GET /contacts/" + name);
    try {
        const contact = await db.findOne({ name });

        if (!contact) {
            console.warn("⚠️ No existe contacto con name = " + name);
            return res.sendStatus(404);
        }

        res.status(200).json(contact);
    } catch (err) {
        console.error("❌ Error accediendo a MongoDB:", err);
        res.sendStatus(500);
    }
});


app.post(BASE_API + "/contacts/:name", (req, res) =>{
    var name = req.params.name;
    console.warn("New PUT request to /contacts/" + name + ", sending 405 ...")
    res.sendStatus(405);
});

// DELETE: Eliminar un contacto
app.delete(BASE_API + "/contacts/:name", async (req, res) => {
    const name = req.params.name;

    try {
        const result = await db.deleteOne({ name });
        result.deletedCount === 0 ? res.sendStatus(404) : res.sendStatus(200);
    } catch (err) {
        console.error("❌ Error en DELETE /contacts:", err);
        res.sendStatus(500);
    }
});

// PUT: Actualizar un contacto existente
app.put(BASE_API + "/contacts/:name", async (req, res) => {
    const updatedContact = req.body;
    const name = req.params.name;

    if (!updatedContact || !updatedContact.email || !updatedContact.phone) {
        return res.sendStatus(422);
    }

    try {
        const result = await db.updateOne(
            { name },
            { $set: { email: updatedContact.email, phone: updatedContact.phone } }
        );

        result.modifiedCount === 0 ? res.sendStatus(404) : res.sendStatus(200);
    } catch (err) {
        console.error("❌ Error en PUT /contacts:", err);
        res.sendStatus(500);
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🟢 Servidor escuchando en http://localhost:${PORT}`);
}).on("error", (e) => {
    console.error("❌ Error al iniciar el servidor:", e);
});
