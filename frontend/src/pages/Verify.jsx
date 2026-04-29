import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import "./Verify.css"

export default function Verify() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState("loading")

  const token = searchParams.get("token")
  const actionId = searchParams.get("actionId")

  useEffect(() => {
    const verify = async () => {
      if (!token || !actionId) {
        setStatus("error")
        return
      }

      try {
        const res = await fetch("http://localhost:5000/verify-signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, actionId }),
        })

        const data = await res.json()

        if (!data.success) {
          setStatus("error")
          return
        }

        setStatus("success")
      } catch (err) {
        setStatus("error")
      }
    }

    verify()
  }, [token, actionId])

  return (
    <div className="verify-page">
      <div className="verify-card">

        {status === "loading" && (
          <>
            <div className="spinner" />
            <h2>Verifying your signature...</h2>
            <p>Please wait while we confirm your support.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="check">✓</div>
            <h2>Signature confirmed</h2>
            <p>Thank you for supporting this action.</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="error">✕</div>
            <h2>Verification failed</h2>
            <p>The link is invalid or has expired.</p>
          </>
        )}

      </div>
    </div>
  )
}