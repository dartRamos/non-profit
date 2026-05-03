require("dotenv").config()
const express = require("express")
const cors = require("cors")
const formData = require("form-data")
const Mailgun = require("mailgun.js")

// ---------------- FIREBASE ADMIN ----------------
const admin = require("firebase-admin")

const serviceAccount = require("./serviceAccountKey.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

// ---------------- APP SETUP ----------------
const app = express()

app.use(cors())
app.use(express.json())

// ---------------- MAILGUN SETUP ----------------
const mailgun = new Mailgun(formData)

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
})

// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
  res.send("Backend is running")
})

// ---------------- SEND EMAIL ----------------
app.post("/send-email", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      postalCode,
      messages,

      mppName,
      mppEmail,
      mppRiding,
    } = req.body

    const fullName = `${firstName} ${lastName}`

    const emailMessages =
      Array.isArray(messages) && messages.length ? messages : []

    if (!emailMessages.length) {
      throw new Error("No email templates provided")
    }

    const sendOne = async (item, index) => {
      const msg = item.body || ""

      // ✅ FIXED: ONLY support recipientEmails array
      const recipients = Array.isArray(item.recipientEmails)
        ? item.recipientEmails.filter(Boolean)
        : []

      if (!recipients.length) {
        throw new Error(
          `No recipientEmails found in email template at index ${index}`
        )
      }

      const subject =
        item.subject || `Campaign Message ${index + 1}`

      const isMPPFlow = !!mppEmail

      const toList = isMPPFlow ? [mppEmail] : recipients

      const emailBody = `
        Dear ${
          isMPPFlow
            ? mppName
            : item.recipientPosition
              ? `${item.recipientPosition} ${item.recipientName || ""}`.trim()
              : item.recipientName || "Representative"
        },

        ${msg}

        ${
          isMPPFlow
            ? `\nThis message was sent to you as the elected MPP for ${mppRiding}.\n`
            : ""
        }

        Sincerely,
        ${fullName}
        ${email}
        ${postalCode}
        `

      return Promise.all(
        toList.map((to) =>
          mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: `Campaign <mail@${process.env.MAILGUN_DOMAIN}>`,
            to,
            subject,
            text: emailBody,
          })
        )
      )
    }

    const responses = await Promise.allSettled(
      emailMessages.map((item, i) => sendOne(item, i))
    )

    const failed = responses.filter((r) => r.status === "rejected")

    res.json({
      success: true,
      sent: responses.length - failed.length,
      failed: failed.length,
      results: responses,
    })
  } catch (err) {
    console.error("SEND EMAIL ERROR:", err)
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

// ---------------- SEND VERIFICATION EMAIL ----------------
app.post("/send-verification", async (req, res) => {
  try {
    const { email, firstName, actionId } = req.body

    const snapshot = await db
      .collection("action_signups")
      .where("email", "==", email)
      .where("actionId", "==", actionId)
      .where("verified", "==", false)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return res.status(400).json({ error: "Pending signup not found" })
    }

    const doc = snapshot.docs[0]
    const signup = doc.data()
    const token = signup.verificationToken

    if (!token) {
      return res.status(400).json({ error: "Missing verification token" })
    }

    const verifyLink = `http://localhost:5173/verify?token=${token}&actionId=${actionId}`

    const message = `
Hello ${firstName},

Please confirm your signature by clicking the link below:

${verifyLink}

If you did not sign this petition, you can ignore this email.
`

    try {
      await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `Verify <mail@${process.env.MAILGUN_DOMAIN}>`,
        to: email,
        subject: "Confirm your signature",
        text: message,
      })
    } catch (err) {
      console.error("MAILGUN VERIFY EMAIL FAILED:", err)
      throw err
    }

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// ---------------- VERIFY SIGNUP ----------------
app.post("/verify-signup", async (req, res) => {
  try {
    const { token, actionId } = req.body

    const snapshot = await db
      .collection("action_signups")
      .where("verificationToken", "==", token)
      .where("actionId", "==", actionId)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return res.status(400).json({ error: "Invalid token" })
    }

    const docRef = snapshot.docs[0].ref

    await db.runTransaction(async (tx) => {
      const docSnap = await tx.get(docRef)

      if (!docSnap.exists) throw new Error("Signup not found")

      const data = docSnap.data()

      if (data.verified) return

      if (data.verificationToken !== token) {
        throw new Error("Token mismatch")
      }

      tx.update(docRef, {
        verified: true,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      })

      const actionRef = db.collection("actions").doc(actionId)

      tx.update(actionRef, {
        "stats.signups": admin.firestore.FieldValue.increment(1),
      })
    })

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// ---------------- START SERVER ----------------
const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})