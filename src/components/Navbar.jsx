import React, { useEffect, useState, useRef } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 100)
      setHidden(y > 500 && y > lastScrollY.current + 5)
      if (Math.abs(y - lastScrollY.current) > 5) {
        lastScrollY.current = y
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${hidden ? 'navbar--hidden' : ''}`} id="navbar">
      <div className="navbar__logo">
        FER<span>RA</span>RI
      </div>

      <ul className="navbar__links">
        <li className="navbar__link" id="nav-legacy">Legacy</li>
        <li className="navbar__link" id="nav-evolution">Evolution</li>
        <li className="navbar__link" id="nav-showcase">Showcase</li>
        <li className="navbar__link" id="nav-blueprint">Blueprint</li>
        <li className="navbar__link" id="nav-craft">Craft</li>
        <li className="navbar__link" id="nav-drive">Drive</li>
      </ul>

      <button className="navbar__cta" id="nav-cta">
        Experience
      </button>
    </nav>
  )
}
