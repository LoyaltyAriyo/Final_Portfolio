// Top navigation with active link styles and custom logo.

import { Fragment } from 'react'
import { NavLink, Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { useAuth } from '../context/AuthContext.jsx'

export default function NavBar() {
    const linkClass = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '')
    const { isAuthenticated, user, logout } = useAuth()

    return (
        <nav className="navbar">
            <div className="nav-inner">
                <div className="brand">
                    <img src={logo} alt="AM logo" />
                    <span>Amirhossein • Portfolio</span>
                </div>
                <div className="nav-links">
                    <NavLink to="/" className={linkClass}>Home</NavLink>
                    <NavLink to="/about" className={linkClass}>About</NavLink>
                    <NavLink to="/projects" className={linkClass}>Projects</NavLink>
                    <NavLink to="/services" className={linkClass}>Services</NavLink>
                    <NavLink to="/contact" className={linkClass}>Contact</NavLink>
                    {isAuthenticated ? (
                        <Fragment>
                            <span style={{ color: '#9ca3af' }}>Hi, {user?.name}</span>
                            <button
                                type="button"
                                onClick={logout}
                                style={{ background: 'transparent', border: 'none', color: '#f97316', cursor: 'pointer' }}
                            >
                                Logout
                            </button>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Link to="/signin" className={linkClass({ isActive: false })}>Sign In</Link>
                            <Link to="/signup" className={linkClass({ isActive: false })}>Sign Up</Link>
                        </Fragment>
                    )}
                </div>
            </div>
        </nav>
    )
}
