require("dotenv").config();
const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const rateLimit = require("express-rate-limit");

// PAYPAL
const paypal = require("@paypal/checkout-server-sdk");

// FIREBASE ADMIN
const admin = require("firebase-admin");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = require("./serviceAccountKey.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const environment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_SECRET
);

const client = new paypal.core.PayPalHttpClient(environment);

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://onac.ca",
  "https://www.onac.ca",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// MAILGUN
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

// RATE LIMIT
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: "Too many email requests. Try again later.",
  },
});

// HEALTH 
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// GET ALL ACTIONS
app.get("/actions", async (req, res) => {
  try {
    const snapshot = await db
      .collection("actions")
      .orderBy("createdAt", "desc")
      .get();

    const actions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, actions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch actions" });
  }
});

// GET FEATURED ACTIONS
app.get("/actions/featured", async (req, res) => {
  try {
    const types = (req.query.types || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (!types.length) {
      return res.status(400).json({
        success: false,
        error: "No types provided",
      });
    }

    const snapshot = await db
      .collection("actions")
      .where("featured", "==", true)
      .where("type", "in", types)
      .get();

    const actions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, actions });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch featured actions",
    });
  }
});

// GET SINGLE ACTION
app.get("/actions/:id", async (req, res) => {
  try {
    const docRef = await db.collection("actions").doc(req.params.id).get();

    if (!docRef.exists) {
      return res.status(404).json({ success: false, error: "Not found" });
    }

    res.json({ success: true, action: { id: docRef.id, ...docRef.data() } });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch action" });
  }
});

app.get("/fundraising", async (req, res) => {
  try {
    const doc = await db.collection("fundraising").doc("campaign").get();

    res.json({
      success: true,
      raised: doc.data()?.raised || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch funding" });
  }
});

// CREATE ACTION
app.post("/actions", async (req, res) => {
  try {
    const ref = await db.collection("actions").add({
      ...req.body,
      featured: false,
      stats: { signups: 0 },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, id: ref.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Create failed" });
  }
});

// UPDATE ACTION
app.put("/actions/:id", async (req, res) => {
  try {
    await db.collection("actions").doc(req.params.id).update(req.body);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Update failed" });
  }
});

// DELETE ACTION
app.delete("/actions/:id", async (req, res) => {
  try {
    await db.collection("actions").doc(req.params.id).delete();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Delete failed" });
  }
});

// TOGGLE FEATURED
app.patch("/actions/:id/featured", async (req, res) => {
  try {
    const featured = req.body?.featured;

    if (typeof featured !== "boolean") {
      return res
        .status(400)
        .json({ success: false, error: "featured must be boolean" });
    }

    await db
      .collection("actions")
      .doc(req.params.id)
      .update({
        featured,
        featuredOrder: featured
          ? admin.firestore.FieldValue.serverTimestamp()
          : 999,
      });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, error: "Failed to toggle featured" });
  }
});

// GET SIGNUPS
app.get("/actions/:id/signups", async (req, res) => {
  try {
    const snapshot = await db
      .collection("petition_signups")
      .where("actionId", "==", req.params.id)
      .get();

    const signups = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      signups,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: "Failed to fetch signups",
    });
  }
});

//  SIGNUP ACTION 
app.post("/signup-action", async (req, res) => {
  try {
    const {
      actionId,
      firstName,
      lastName,
      email,
      postalCode,
    } = req.body;

    if (!actionId) {
      return res.status(400).json({
        success: false,
        error: "Missing actionId",
      });
    }

    // GET ACTION
    const actionRef = await db.collection("actions").doc(actionId).get();

    if (!actionRef.exists) {
      return res.status(404).json({
        success: false,
        error: "Action not found",
      });
    }

    const actionData = actionRef.data();

    // ALWAYS INCREMENT SIGNUP COUNT
    await db.collection("actions").doc(actionId).set(
      {
        stats: {
          signups: admin.firestore.FieldValue.increment(1),
        },
      },
      { merge: true }
    );

    // ONLY SAVE PERSONAL DATA FOR PETITIONS
    if (actionData.type === "petition") {
      if (!firstName || !lastName || !email || !postalCode) {
        return res.status(400).json({
          success: false,
          error: "Missing signup fields",
        });
      }

      const existingSignup = await db
        .collection("petition_signups")
        .where("actionId", "==", actionId)
        .where("email", "==", email.trim().toLowerCase())
        .limit(1)
        .get();

      if (!existingSignup.empty) {
        return res.status(400).json({
          success: false,
          error: "You already signed this petition",
        });
      }

      await db.collection("petition_signups").add({
        actionId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        postalCode: postalCode.trim().toUpperCase(),

        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: "Signup failed",
    });
  }
});

// SUBSCRIBERS
app.get("/subscribers", async (req, res) => {
  const snapshot = await db.collection("subscribers").get();

  res.json({
    success: true,
    subscribers: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
  });
});

app.post("/subscribe", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const id = email.toLowerCase();

    await db.collection("subscribers").doc(id).set({
      name,
      email: email.toLowerCase(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Subscribe failed" });
  }
});

// VOLUNTEERS
app.get("/volunteers", async (req, res) => {
  const snapshot = await db.collection("volunteer_signups").get();

  res.json({
    success: true,
    volunteers: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
  });
});

app.post("/volunteer", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const id = email.toLowerCase();

    await db.collection("volunteer_signups").doc(id).set({
      name,
      email: email.toLowerCase(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Volunteer signup failed" });
  }
});

// EMAIL
app.post("/send-email", emailLimiter, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      postalCode,
      messages,
      mppName,
      mppEmail,
    } = req.body;

    const fullName = `${firstName} ${lastName}`;

    const emailMessages =
      Array.isArray(messages) && messages.length ? messages : [];

    if (!emailMessages.length) {
      return res.status(400).json({
        success: false,
        error: "No email templates provided",
      });
    }

    const sendOne = async (item, index) => {
      const msg = typeof item === "string" ? item : item.body || "";
      const subject =
        typeof item === "string"
          ? `Campaign Message ${index + 1}`
          : item.subject || `Campaign Message ${index + 1}`;

      const requiresMPP =
        item.requireMppInfo === true || item.requireMppInfo === "true";

      if (!requiresMPP) {
        const recipients = Array.isArray(item.recipientEmails)
          ? item.recipientEmails.filter(Boolean)
          : [];

        if (!recipients.length) {
          throw new Error(`No recipientEmails found in template ${index}`);
        }

        const recipientName =
          item.recipientName || req.body.recipientName || "";
        const recipientPosition =
          item.recipientPosition || req.body.recipientPosition || "";

        const emailBody = `
Dear ${
          recipientPosition
            ? `${recipientPosition} ${recipientName}`.trim()
            : recipientName || "Representative"
        },

${msg}

Sincerely,
${fullName}
${email}
${postalCode}
`;

        return Promise.all(
          recipients.map((to) =>
            mg.messages.create(process.env.MAILGUN_DOMAIN, {
              from: `Ontarians Against Corruption <mail@${process.env.MAILGUN_DOMAIN}>`,
              to,
              subject,
              text: emailBody,
            })
          )
        );
      }

      const mppEmailClean = (mppEmail || "").trim();
      const mppNameClean = (mppName || "").trim();

      if (!mppEmailClean) {
        throw new Error(`MPP email missing`);
      }

      const emailBody = `
Dear MPP ${mppNameClean},

${msg}

Sincerely,
${fullName}
${email}
${postalCode}
`;

      return mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `Ontarians Against Corruption <mail@${process.env.MAILGUN_DOMAIN}>`,
        to: mppEmailClean,
        subject,
        text: emailBody,
      });
    };

    const responses = await Promise.allSettled(
      emailMessages.map((item, i) => sendOne(item, i))
    );

    const failed = responses.filter((r) => r.status === "rejected");

    res.json({
      success: true,
      sent: responses.length - failed.length,
      failed: failed.length,
      results: responses,
    });
  } catch (err) {
    console.error("SEND EMAIL ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// PAYPAL

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

    const capture = order.result.purchase_units?.[0]?.payments?.captures?.[0];

    const amountValue = capture?.amount?.value;

    if (!amountValue) {
      console.log(
        "FULL PAYPAL RESPONSE:",
        JSON.stringify(order.result, null, 2)
      );
      throw new Error("Missing capture amount in PayPal response");
    }

    const amount = Number(amountValue);

    await db
      .collection("fundraising")
      .doc("campaign")
      .set(
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
    console.error("PAYPAL ERROR:", err);

    res.status(500).json({
      success: false,
      error: "Payment verification failed",
    });
  }
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
