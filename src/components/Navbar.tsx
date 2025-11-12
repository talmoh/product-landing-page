import Link from 'next/link'

export default function Navbar(){
  return (
    <header className="navbar">
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/"><span className="brand">OZSTREETWEAR<span className="brand-plus">+</span></span></Link>
        <nav>
          <a href="#product" style={{marginRight:12}}>Produit</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  )
}