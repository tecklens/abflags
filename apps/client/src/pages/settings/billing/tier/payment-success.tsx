/**
 * v0 by Vercel.
 * @see https://v0.dev/t/FlJtkO7jKt3
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card } from "@client/components/ui/card"
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function PaymentSuccess() {

  useEffect(() => {
    localStorage.clear()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-md w-full space-y-6 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex flex-col items-center">
          <CircleCheckIcon className="text-green-500 h-16 w-16" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mt-4">Payment Successful</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
            Thank you for your payment. Your order is being processed.
          </p>
        </div>
        {/*<div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">*/}
        {/*  <div className="flex justify-between">*/}
        {/*    <span className="text-gray-500 dark:text-gray-400">Amount Paid:</span>*/}
        {/*    <span className="font-medium text-gray-900 dark:text-gray-50">$99.99</span>*/}
        {/*  </div>*/}
        {/*  <div className="flex justify-between">*/}
        {/*    <span className="text-gray-500 dark:text-gray-400">Payment Method:</span>*/}
        {/*    <span className="font-medium text-gray-900 dark:text-gray-50">Visa ending in 1234</span>*/}
        {/*  </div>*/}
        {/*  <div className="flex justify-between">*/}
        {/*    <span className="text-gray-500 dark:text-gray-400">Date & Time:</span>*/}
        {/*    <span className="font-medium text-gray-900 dark:text-gray-50">April 18, 2024 at 3:45 PM</span>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className="flex justify-center">
          <Link
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300"
            to="/sign-in"
          >
            Please re-login to continue
          </Link>
        </div>
      </Card>
    </div>
  )
}

function CircleCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
