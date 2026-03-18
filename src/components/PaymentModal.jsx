// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const PaymentModal = ({ clientSecret, onSuccess, onClose }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!stripe || !elements) return

        setLoading(true)
        setError(null)

        const cardElement = elements.getElement(CardElement)

        const { error, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: cardElement,
                    billing_details: { name: 'Patient' }
                }
            }
        )

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        if (paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent.id)
        }

        setLoading(false)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Pay for Appointment</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Card Input */}
                    <div className="border border-gray-300 rounded-lg p-3 mb-4 bg-gray-50">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#374151',
                                        '::placeholder': { color: '#9CA3AF' },
                                    },
                                    invalid: { color: '#EF4444' },
                                }
                            }}
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <p className="text-red-500 text-sm mb-3">{error}</p>
                    )}

                    {/* Test card hint */}
                    <p className="text-xs text-gray-400 mb-4">
                        Test card: 4242 4242 4242 4242 | MM/YY: 12/26 | CVC: 123
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!stripe || loading}
                            className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Pay Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ✅ fix ESLint prop validation warnings
PaymentModal.propTypes = {
    clientSecret: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default PaymentModal