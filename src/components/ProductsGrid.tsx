import Image from 'next/image'

const PRODUCTS = [
  { id:1, name:'Produit 1', price:'39.99€', img:'/images/product1.jpg' },
  { id:2, name:'Produit 2', price:'49.99€', img:'/images/product2.jpg' },
  { id:3, name:'Produit 3', price:'29.99€', img:'/images/product3.jpg' }
]

export default function ProductsGrid(){
  return (
    <div id="productList" className="products-grid">
      {PRODUCTS.map(p=>(
        <article key={p.id} className="card">
          <div style={{width:'100%',height:180,position:'relative'}}>
            <Image src={p.img} alt={p.name} fill style={{objectFit:'cover',borderRadius:6}} />
          </div>
          <h3 style={{marginTop:8}}>{p.name}</h3>
          <p style={{color:'var(--muted)'}}>{p.price}</p>
          <a className="btn" href="#">Voir</a>
        </article>
      ))}
    </div>
  )
}