"use client"

import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"

interface PayPalButtonProps {
  amount: string
  onSuccess: (details: any, data: any) => void
}

export function PayPalButton({ amount, onSuccess }: PayPalButtonProps) {
  const handlePayment = () => {
    // Simulate PayPal payment success for demo
    const mockDetails = {
      id: "PAYMENT_ID_" + Date.now(),
      status: "COMPLETED",
      payer: {
        email_address: "buyer@example.com",
        name: { given_name: "John", surname: "Doe" },
      },
    }

    const mockData = {
      orderID: "ORDER_ID_" + Date.now(),
    }

    // Simulate payment processing delay
    setTimeout(() => {
      onSuccess(mockDetails, mockData)
    }, 1500)
  }

  return (
    <Button
      onClick={handlePayment}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
    >
      <CreditCard className="w-5 h-5" />
      <span>Pagar ${amount} USD</span>
    </Button>
  )
}
