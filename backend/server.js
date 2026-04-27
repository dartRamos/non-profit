require("dotenv").config()
const express = require("express")
const cors = require("cors")
const formData = require("form-data")
const Mailgun = require("mailgun.js")

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
      recipientName,
      recipientPosition,
      firstName,
      lastName,
      email,
      postalCode,
      message,
      messages,
    } = req.body

    console.log("RAW EMAIL REQUEST:", JSON.stringify(req.body, null, 2))
    const fullName = `${firstName} ${lastName}`

    const emailMessages =
      Array.isArray(messages) && messages.length
        ? messages
        : [message]

        const sendOne = async (item, index) => {

          // 🔥 ADD THIS RIGHT HERE (FIRST THING)
          if (typeof item !== "string") {
            if (
              !item.recipientEmail ||
              !item.recipientName ||
              !item.recipientPosition
            ) {
              throw new Error(
                `Missing recipient fields in template at index ${index}`
              )
            }
          }
        
          const msg = typeof item === "string" ? item : item.body
        
          const to =
            typeof item === "string"
              ? "alessandro.ramos.it@gmail.com"
              : item.recipientEmail
        
          const subject =
            typeof item === "string"
              ? `Campaign Message ${index + 1}`
              : item.subject || `Campaign Message ${index + 1}`
        
              const emailBody = `
                Dear ${item.recipientPosition} ${item.recipientName},
                
                ${msg}
                
                Sincerely,
                ${fullName}
                ${email}
                ${postalCode}
                `
        
          return mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: `Campaign <mail@${process.env.MAILGUN_DOMAIN}>`,
            to,
            subject,
            text: emailBody,
          })
        }

    // SEND IN PARALLEL
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
    console.error(err)
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})