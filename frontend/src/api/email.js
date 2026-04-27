export async function sendEmail(payload) {
  const res = await fetch("http://localhost:5000/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  return res.json()
}