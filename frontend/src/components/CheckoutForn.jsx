import React, { useContext, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import api from '../api/api';
import { AuthContext } from '../AuthProvider';

const CheckoutForm = ({ totalPrice, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const { setCart } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        try {
            // Call your backend to create the PaymentIntent
            const { data } = await api.post('/create-payment-intent', {
                amount: totalPrice * 100, // Amount in cents
            });

            // Confirm the payment with the client secret
            const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (error) {
                setError(error.message);
                setProcessing(false);
            } else if (paymentIntent.status === 'succeeded') {
                alert('Payment successful!');
                onClose();
            }
        } catch (error) {
            setError(error.message);
            setProcessing(false);
        }
    };


    const payNow = async() => {
        const data = await api.post('/proceed-payment')
        setCart(null)
    }

    return (
        <>
            {/* <form onSubmit={handleSubmit} className='space-y-4'>
                <CardElement />
                {error && <p className='text-red-500'>{error}</p>}
                <button
                    type='submit'
                    disabled={processing}
                    className='w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg'
                >
                    {processing ? 'Processing...' : 'Pay Now'}
                </button>
            </form> */}
            <button
                type='submit'
                onClick={payNow}
                className='w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg'
            >
                {processing ? 'Processing...' : 'Pay Now'}
            </button>
        </>

    );
};

export default CheckoutForm;
