export async function sendEmail(payload) {
  const res = await fetch("https://non-profit-ta9x.onrender.com/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  return res.json()
}