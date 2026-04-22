function Newsletter() {
  return (
    <div>
      <h1>Newsletter Signup</h1>

      <form>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
          />
        </div>

        <button className="btn btn-success">Subscribe</button>
      </form>
    </div>
  )
}

export default Newsletter