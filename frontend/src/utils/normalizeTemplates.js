export function normalizeTemplates(source) {
  if (!source) return []

  const arr = Array.isArray(source)
    ? source
    : typeof source === "string"
      ? [source]
      : source.emailTemplates
        ? source.emailTemplates
        : source.emailTemplate
          ? [source.emailTemplate]
          : source.description
            ? [source.description]
            : []

  return arr.map((t) => {
    if (typeof t === "string") {
      return {
        body: t,
        subject: "Campaign Message",
        requireMppInfo: false,
        recipientEmails: [],
        recipientName: "",
        recipientPosition: "",
      }
    }

    return {
      body: t.body || "",
      subject: t.subject || "Campaign Message",
      requireMppInfo: t.requireMppInfo === true,
      recipientEmails: t.recipientEmails || [],
      recipientName: t.recipientName || "",
      recipientPosition: t.recipientPosition || "",
    }
  })
}