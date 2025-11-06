import Link from 'next/link'

export default function Navbar(){
  return (
    <header className="navbar">
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/"><a className="brand">OZSTREETWEAR</a></Link>
        <nav>
          <a href="#features" style={{marginRight:12}}>Features</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  )
}