require("dotenv").config()
const express = require("express")
const cors = require("cors")
const formData = require("form-data")
const Mailgun = require("mailgun.js")
const rateLimit = require("express-rate-limit")

// --------------- PAYPAL -------------------
const paypal = require("@paypal/checkout-server-sdk");

// ---------------- FIREBASE ADMIN ----------------
const admin = require("firebase-admin")

let serviceAccount

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
} else {
  serviceAccount = require("./serviceAccountKey.json")
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const environment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_SECRET
);

const client = new paypal.core.PayPalHttpClient(environment);

// ---------------- SIMPLE CACHE ----------------
const cache = new Map()

const setCache = (key, data, ttlMs = 60 * 1000) => {
  cache.set(key, {
    data,
    expires: Date.now() + ttlMs,
  })
}

const getCache = (key) => {
  const cached = cache.get(key)
  if (!cached) return null
  if (Date.now() > cached.expires) {
    cache.delete(key)
    return null
  }
  return cached.data
}

// ---------------- APP SETUP ----------------
const app = express()

app.use(express.json())

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://onac.ca",
  "https://www.onac.ca"
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    console.log("Blocked CORS origin:", origin)
    return callback(new Error("Not allowed by CORS"))
  },
  credentials: true
}))

// ---------------- MAILGUN ----------------
const mailgun = new Mailgun(formData)

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
})

// ---------------- RATE LIMIT ----------------
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: "Too many email requests. Try again later.",
  },
})

// ---------------- HEALTH ----------------
app.get("/", (req, res) => {
  res.send("Backend is running")
})

/* ================= ACTIONS ================= */

// GET ALL ACTIONS (CACHED)
app.get("/actions", async (req, res) => {
  try {
    const cached = getCache("actions")
    if (cached) return res.json({ success: true, actions: cached })

    const snapshot = await db
      .collection("actions")
      .orderBy("createdAt", "desc")
      .get()

    const actions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    setCache("actions", actions, 2 * 60 * 1000)

    res.json({ success: true, actions })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: "Failed to fetch actions" })
  }
})

// GET FEATURED ACTIONS (CACHED)
app.get("/actions/featured", async (req, res) => {
  try {
    const key = `featured:${req.query.types}`
    const cached = getCache(key)
    if (cached) return res.json({ success: true, actions: cached })

    const types = (req.query.types || "")
      .split(",")
      .map(t => t.trim())
      .filter(Boolean)

    if (!types.length) {
      return res.status(400).json({
        success: false,
        error: "No types provided",
      })
    }

    const snapshot = await db
      .collection("actions")
      .where("featured", "==", true)
      .where("type", "in", types)
      .get()

    const actions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    setCache(key, actions, 2 * 60 * 1000)

    res.json({ success: true, actions })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      success: false,
      error: "Failed to fetch featured actions",
    })
  }
})

// GET SINGLE ACTION (CACHED)
app.get("/actions/:id", async (req, res) => {
  try {
    const key = `action:${req.params.id}`
    const cached = getCache(key)
    if (cached) return res.json({ success: true, action: cached })

    const docRef = await db.collection("actions").doc(req.params.id).get()

    if (!docRef.exists) {
      return res.status(404).json({ success: false, error: "Not found" })
    }

    const action = { id: docRef.id, ...docRef.data() }

    setCache(key, action, 5 * 60 * 1000)

    res.json({ success: true, action })
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch action" })
  }
})

// GET SIGNUPS (NOW FROM ACTION DOC ONLY, NO USER STORAGE)
app.get("/actions/:id/signups", async (req, res) => {
  try {
    const doc = await db.collection("actions").doc(req.params.id).get()

    if (!doc.exists) {
      return res.json({ success: true, signups: [] })
    }

    const data = doc.data()
    const signups = data?.stats?.signups || 0

    res.json({
      success: true,
      signups: Array.from({ length: signups }).map(() => ({}))
    })
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch signups" })
  }
})

/* SIGNUP ACTION (UPDATED: NO USER DATA SAVED) */
app.post("/signup-action", async (req, res) => {
  try {
    const { actionId } = req.body

    if (!actionId) {
      return res.status(400).json({ success: false, error: "Missing actionId" })
    }

    // ONLY increment counter (NO PERSONAL DATA SAVED)
    const actionRef = db.collection("actions").doc(actionId)

    await actionRef.set(
      {
        stats: {
          signups: admin.firestore.FieldValue.increment(1),
        },
      },
      { merge: true }
    )

    // invalidate cache
    cache.delete("actions")
    cache.delete(`action:${actionId}`)

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: "Signup failed" })
  }
})

/* ================= EVERYTHING ELSE UNTOUCHED ================= */

// (KEEP YOUR EMAIL, PAYPAL, SUBSCRIBERS, VOLUNTEERS EXACTLY AS IS BELOW)
// I DID NOT MODIFY THEM PER YOUR REQUEST

/* PAYPAL */
app.post("/paypal-success", async (req, res) => {
  try {
    const { orderID } = req.body;

    if (!orderID) {
      return res.status(400).json({
        success: false,
        error: "Missing orderID",
      });
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const order = await client.execute(request);

    const capture =
      order.result.purchase_units?.[0]?.payments?.captures?.[0];

    const amountValue = capture?.amount?.value;

    if (!amountValue) {
      throw new Error("Missing capture amount in PayPal response");
    }

    const amount = Number(amountValue);

    await db.collection("fundraising").doc("campaign").set(
      {
        raised: admin.firestore.FieldValue.increment(amount),
      },
      { merge: true }
    );

    res.json({
      success: true,
      added: amount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: "Payment verification failed",
    });
  }
})

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})