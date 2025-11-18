import React from 'react'

export default function Footer(){
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p>© {new Date().getFullYear()} OZSTREETWEAR+ — Contact: contact@ozstreetwear+.com</p>
          
          <div className="col-lg-3 col-5 ms-auto">
            <ul className="social-icon" style={{ display: 'flex', listStyle: 'none', gap: 12, margin: 0, padding: 0 }}>
              <li>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-facebook"></i>
                </a>
              </li>
              <li>
                <a href="https://web.whatsapp.com/+213541830685" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-whatsapp"></i>
                </a>
              </li>
              <li>
                <a href="https://instagram.com/oz_streer_wear_2?igsh=MXRvbnlrZnFIZG9jZQ==" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}