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
      console.log("EMAIL TEMPLATE RECEIVED:", JSON.stringify(item, null, 2))
      const msg = typeof item === "string" ? item : item.body || ""
      const subject =
        typeof item === "string"
          ? `Campaign Message ${index + 1}`
          : item.subject || `Campaign Message ${index + 1}`
    
      const requiresMPP = item.requireMppInfo === true || item.requireMppInfo === "true"
    
      // ---------------- NORMAL FLOW ----------------
      if (!requiresMPP) {
        const recipients = Array.isArray(item.recipientEmails)
          ? item.recipientEmails.filter(Boolean)
          : []
    
        if (!recipients.length) {
          throw new Error(`No recipientEmails found in template ${index}`)
        }
    
        const emailBody = `
    Dear ${
          item.recipientPosition
            ? `${item.recipientPosition} ${item.recipientName || ""}`.trim()
            : item.recipientName || "Representative"
        },
    
    ${msg}
    
    Sincerely,
    ${fullName}
    ${email}
    ${postalCode}
    `
    
        console.log("SENDING TO:", recipients)
        console.log("SUBJECT:", subject)
        console.log("FULL TEMPLATE:", item)

        return Promise.all(
          recipients.map((to) =>
            mg.messages.create(process.env.MAILGUN_DOMAIN, {
              from: `Campaign <mail@${process.env.MAILGUN_DOMAIN}>`,
              to,
              subject,
              text: emailBody,
            })
          )
        )
      }
    
      // ---------------- MPP FLOW (USER INPUT ONLY) ----------------
    
      const mppEmail = (req.body.mppEmail || "").trim()
      const mppName = (req.body.mppName || "").trim()

      console.log("MPP FLOW ACTIVE")
      console.log("MPP NAME:", mppName)
      console.log("MPP EMAIL:", mppEmail)
    
      if (!mppEmail ) {
        throw new Error(`MPP email missing or empty in request`)
      }
    
      const emailBody = `
        Dear MPP ${mppName || ""},
        
        ${msg}
        
        Sincerely,
        ${fullName}
        ${email}
        ${postalCode}
        `
    
      return mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `Campaign <mail@${process.env.MAILGUN_DOMAIN}>`,
        to: mppEmail,
        subject,
        text: emailBody,
      })
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

// ---------------- START SERVER ----------------
const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})