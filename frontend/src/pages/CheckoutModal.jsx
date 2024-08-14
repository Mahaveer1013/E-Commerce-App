import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/CheckoutForn';

const stripePromise = loadStripe('your-stripe-publishable-key'); // Replace with your Stripe publishable key

const CheckoutModal = ({ isOpen, onClose, cart, totalPrice }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg shadow-lg p-5 w-[90%] max-w-lg'>
                <div className='flex justify-between items-center'>
                    <p className='text-xl font-bold'>Checkout</p>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-800'>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div className='mt-4'>
                    {(!cart || cart.length === 0) ? (
                        <p>No items in the cart</p>
                    ) : (
                        <>
                            <ul>
                                {cart.map(item => (
                                    <li key={item._id} className='flex justify-between py-2 border-b'>
                                        <p>{item.product.name}</p>
                                        <p>${item.product.price} x {item.count}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className='mt-4 flex justify-between font-bold'>
                                <p>Total Price:</p>
                                <p>${totalPrice}</p>
                            </div>
                        </>
                    )}
                </div>
                <div className='mt-4'>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm totalPrice={totalPrice} onClose={onClose} />
                    </Elements>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
