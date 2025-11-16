'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()

  return (
    <header className="navbar">
      <div className="nav-inner container">
        <div className="nav-left">
          <Link href="/" className="brand" aria-label="OZSTREETWEAR home">
            <span className="brand-text">OZSTREETWEAR</span>
            <span className="brand-plus">+</span>
          </Link>
        </div>

        <nav className={`nav-center ${open ? 'open' : ''}`} aria-label="Main navigation">
          <Link href="#product" className="nav-link">Produits</Link>
          <Link href="#about" className="nav-link">À propos</Link>
          <Link href="/order" className="nav-link">Commander</Link>
          <Link href="#contact" className="nav-link">Contact</Link>
        </nav>

        <div className="nav-actions">
          <button className="icon-button" aria-label="Rechercher" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <Link href="/cart" className="icon-button" aria-label="Panier">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 6h15l-1.5 9h-12z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
            <span className="cart-badge">{count}</span>
          </Link>

          <button className="hamburger" aria-label="Menu" onClick={() => setOpen(s => !s)}>
            <span className={`hamburger-line ${open ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${open ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${open ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${open ? 'visible' : ''}`}>
        <Link href="#product" className="mobile-link" onClick={() => setOpen(false)}>Produits</Link>
        <Link href="#about" className="mobile-link" onClick={() => setOpen(false)}>À propos</Link>
        <Link href="/order" className="mobile-link" onClick={() => setOpen(false)}>Commander</Link>
        <Link href="#contact" className="mobile-link" onClick={() => setOpen(false)}>Contact</Link>
      </div>
    </header>
  )
}