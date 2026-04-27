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
    } = req.body

    const fullName = `${firstName} ${lastName}`

    const emailBody = `
Dear ${recipientPosition} ${recipientName},

${message}

Sincerely,
${fullName}
${email}
${postalCode}
`

    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Campaign <mail@${process.env.MAILGUN_DOMAIN}>`,
      to: "alessandro.ramos.it@gmail.com",
      subject: "Campaign Message",
      text: emailBody,
    })

    res.json({ success: true, response })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: err.message })
  }
})

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})