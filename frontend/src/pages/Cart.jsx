import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthProvider';
import CartCard from '../components/CartCard';
import CheckoutModal from './CheckoutModal';

const Cart = () => {
    const { cart, isAuth, fetchCartData, deleteCart } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isAuth) {
            fetchCartData();
        }
    }, [isAuth]);

    const totalPrice = cart ? cart.reduce((sum, item) => sum + item.product.price * item.count, 0) : 0

    return (
        <section>
            <div className='fbc pt-5 px-10'>
                <p className='font-bold text-2xl'>My Cart</p>
                {cart && (
                    <div className='flex gap-3'>
                        <p
                            className='px-3 py-2 cursor-pointer bg-red-600 hover:bg-red-700 w-36 text-center rounded-lg text-white'
                            onClick={deleteCart}
                        >
                            Delete Cart
                        </p>
                        <p
                            className='px-3 py-2 cursor-pointer bg-green-600 hover:bg-green-700 w-36 text-center rounded-lg text-white'
                            onClick={() => setIsModalOpen(true)}
                        >
                            Checkout
                        </p>
                    </div>
                )}
            </div>
            <div className='p-10 flex gap-8 flex-wrap'>
                {cart ? (
                    cart.map(cartProduct => (
                        <CartCard key={cartProduct._id} cartProduct={cartProduct} />
                    ))
                ) : (
                    <p className='w-full h-full fcc'>0 Items in your cart</p>
                )}
            </div>
            <CheckoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                cart={cart}
                totalPrice={totalPrice}
            />
        </section>
    );
};

export default Cart;
