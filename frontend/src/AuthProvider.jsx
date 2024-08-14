import { createContext, useEffect, useState } from 'react';
import api from './api/api';
import encryptApi from './api/encryptApi';

export const AuthContext = createContext();

function AuthProvider({ children }) {

    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSidebar, setIsSidebar] = useState(true);
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState(null)

    const fetchProducts = async () => {
        try {
            const response = await api.get('/all-products');
            if (response) {
                setProducts(response.data);
            } else {
                console.log('No Products Found');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCartData = async () => {
        try {
            const response = await api.get('/manage-cart-items')
            if (response.data.products.length) {
                setCart(response.data.products)
                console.log(response.data.products);
                
            } else {
                setCart(null)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const addToCart = async(productId) => {
        try {
            console.log(productId);
            const response = await encryptApi.post('/manage-cart-items', {productId});
            fetchCartData()
        } catch (error) {
            console.log(error);
        }
    }

    const removeFromCart = async(productId) => {
        try {
            console.log(productId);
            const response = await encryptApi.delete(`/manage-cart-items/${productId}`);
            fetchCartData()
        } catch (error) {
            console.log(error);
        }
    }

    const removeProductFromCart = async(productId) => {
        try {
            console.log(productId);
            const response = await encryptApi.post('/remove-product-from-cart', productId);
            fetchCartData()
        } catch (error) {
            console.log(error);
        }
    }

    const deleteCart = async () => {
        // Show a confirmation dialog
        const confirmed = window.confirm('Are you sure you want to delete the cart?');
    
        if (confirmed) {
            try {
                const response = await api.get('/delete-cart');
                setCart(null); // Clear the cart after successful deletion
            } catch (error) {
                console.log(error);
            }
        }
    };
    
    const fetchUser = async () => {
        try {
            const response = await api.get('/user');

            if (response.data) {
                setUser(response.data)
                setIsAuth(true)
            }
        }
        catch (err) {
            console.log('User Unauthorized..');
        }
    }

    const logout = async () => {
        try {
            const response = await api.get('/logout')
            console.log(response.data);
            setUser(null)
            setIsAuth(false)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchUser()
        fetchCartData()
        fetchProducts()
    }, [])

    const value = {
        isAuth, user, setUser, setIsAuth, loading, setLoading, logout, fetchUser,
        isSidebar, setIsSidebar, products, setProducts, cart, setCart, fetchCartData,
        addToCart, removeFromCart, removeProductFromCart, deleteCart, fetchProducts
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
