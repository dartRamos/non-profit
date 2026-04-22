import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">NonProfit</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/petitions">Petitions</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/protests">Protests</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/newsletter">Newsletter</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar