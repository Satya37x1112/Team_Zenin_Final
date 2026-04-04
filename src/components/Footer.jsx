import React from 'react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer" id="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          FER<span>RA</span>RI
        </div>

        <p className="footer__copy">
          © 2024 Ferrari S.p.A. All rights reserved. A testament to speed and beauty.
        </p>

        <ul className="footer__links">
          <li className="footer__link">Instagram</li>
          <li className="footer__link">YouTube</li>
          <li className="footer__link">Contact</li>
          <li className="footer__link" onClick={scrollToTop} style={{ cursor: 'pointer' }}>↑ Top</li>
        </ul>
      </div>
    </footer>
  )
}
