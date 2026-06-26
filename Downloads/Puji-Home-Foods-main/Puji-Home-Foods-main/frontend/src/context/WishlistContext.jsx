import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth, authHeaders } from '../auth/AuthContext'

const WishlistContext = createContext(null)

const BASE = 'https://puji-home-foods.onrender.com/api/wishlist'
function getUserId() {
  try {
    const token = localStorage.getItem('puji_token')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.id || null
  } catch { return null }
}

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])

  // Load wishlist from MongoDB
  useEffect(() => {
    const userId = getUserId()
    if (!userId) {
      setWishlist([])
      return
    }

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${BASE}/${userId}`, {
          headers: authHeaders(),
        })

        const data = await res.json()

        if (!res.ok) return

        const mapped = data.map(item => ({
          ...item,
          id: item.productId,
          dbId: item._id,
        }))

        setWishlist(mapped)
      } catch (err) {
        console.error('Wishlist load failed:', err)
      }
    }

    fetchWishlist()
  }, [user?.id, user?._id])

  // Add to wishlist
  const addToWishlist = async (product) => {
    const userId = getUserId()
    const productId = product._id || product.id

    if (wishlist.find(p => p.id === productId)) return

    if (!user) {
      window.dispatchEvent(new CustomEvent('require-login'))
      return
    }

    if (!userId) {
      window.dispatchEvent(new CustomEvent('require-login'))
      return
    }

    try {
      const res = await fetch(BASE, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          userId: userId,
          productId: productId,
          name: product.name,
          image: product.image,
          category: product.category,
          price: Number(product.price),
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message)

      setWishlist(prev => [
        ...prev,
        {
          ...product,
          id: productId,
          dbId: data.item._id,
        },
      ])
    } catch (err) {
      console.error('Wishlist add failed:', err)
    }
  }

  // Remove wishlist item
  const removeFromWishlist = async (productId) => {
    const item = wishlist.find(p => p.id === productId)

    setWishlist(prev => prev.filter(p => p.id !== productId))

    if (!item?.dbId) return

    try {
      await fetch(`${BASE}/${item.dbId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
    } catch (err) {
      console.error('Wishlist remove failed:', err)
    }
  }

  const isWishlisted = (productId) =>
    wishlist.some(p => p.id === productId)

  const clearWishlist = async () => {
    try {
      await Promise.all(
        wishlist.map(item =>
          item.dbId
            ? fetch(`${BASE}/${item.dbId}`, {
                method: 'DELETE',
                headers: authHeaders(),
              })
            : Promise.resolve()
        )
      )
    } catch (err) {
      console.error(err)
    }

    setWishlist([])
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)

  if (!ctx) {
    throw new Error(
      'useWishlist must be used inside WishlistProvider'
    )
  }

  return ctx
}