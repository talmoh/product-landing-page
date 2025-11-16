'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

export type CartItem = { id: string; name: string; price?: number; qty: number; img?: string }

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateItemQty: (id: string, qty: number) => void
  clearCart: () => void
  count: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('oz_cart') : null
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('oz_cart', JSON.stringify(cart))
    } catch {}
  }, [cart])

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const idx = prev.findIndex(p => p.id === item.id)
      if (idx > -1) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + item.qty }
        if (copy[idx].qty <= 0) copy.splice(idx, 1)
        return copy
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (id: string) => setCart(prev => prev.filter(p => p.id !== id))

  const updateItemQty = (id: string, qty: number) => {
    setCart(prev => {
      if (qty <= 0) return prev.filter(p => p.id !== id)
      return prev.map(p => (p.id === id ? { ...p, qty } : p))
    })
  }

  const clearCart = () => setCart([])

  const count = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateItemQty, clearCart, count }}>
      {children}
    </CartContext.Provider>
  )
}