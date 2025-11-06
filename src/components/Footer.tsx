import React from 'react';

export default function Footer(){
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <p>© {new Date().getFullYear()} OZSTREETWEAR — Contact: contact@ozstreetwear.example</p>
      </div>
    </footer>
  )
}