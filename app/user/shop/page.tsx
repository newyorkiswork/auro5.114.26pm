"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Laundry Detergent",
    price: 12.99,
    description: "High-efficiency liquid detergent",
    image: "/detergent.jpg"
  },
  {
    id: 2,
    name: "Fabric Softener",
    price: 8.99,
    description: "Fresh scent fabric softener",
    image: "/softener.jpg"
  },
  {
    id: 3,
    name: "Dryer Sheets",
    price: 6.99,
    description: "Anti-static dryer sheets (40 count)",
    image: "/dryer-sheets.jpg"
  }
]

export default function ShopPage() {
  const [cart, setCart] = useState<number[]>([])

  const addToCart = (productId: number) => {
    setCart([...cart, productId])
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(id => id !== productId))
  }

  const getQuantity = (productId: number) => {
    return cart.filter(id => id === productId).length
  }

  const total = cart.reduce((sum, productId) => {
    const product = products.find(p => p.id === productId)
    return sum + (product?.price || 0)
  }, 0)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Shop</h1>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span className="font-medium">
            ${total.toFixed(2)} ({cart.length} items)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-square relative bg-gray-100 rounded-lg">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Product Image
                  </div>
                </div>
                <p className="text-gray-600">{product.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">${product.price}</Badge>
                  {getQuantity(product.id) > 0 ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(product.id)}
                      >
                        -
                      </Button>
                      <span>{getQuantity(product.id)}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(product.id)}
                      >
                        +
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => addToCart(product.id)}>
                      Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {cart.length} item{cart.length > 1 ? "s" : ""} in cart
              </p>
              <p className="font-medium">Total: ${total.toFixed(2)}</p>
            </div>
            <Button size="lg">Checkout</Button>
          </div>
        </div>
      )}
    </div>
  )
}
