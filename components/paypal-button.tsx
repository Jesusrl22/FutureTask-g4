"use client"

import { useEffect, useRef } from "react"

interface PayPalButtonProps {
  amount: string
  onSuccess: (details: any, data: any) => void
}

declare global {
  interface Window {
    paypal: any
  }
}

export function PayPalButton({ amount, onSuccess }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.paypal) {
      window.paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                  },
                },
              ],
            })
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              onSuccess(details, data)
            })
          },
          onError: (err: any) => {
            console.error("PayPal Checkout onError", err)
            alert("Ocurrió un error con el pago de PayPal. Por favor, inténtalo de nuevo.")
          },
        })
        .render(paypalRef.current)
    }
  }, [amount, onSuccess])

  return <div ref={paypalRef} className="w-full" />
}
