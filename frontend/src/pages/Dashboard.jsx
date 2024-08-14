import React, { useContext, useEffect, useState } from 'react';
import FoodCard from '../components/FoodCard';
import { AuthContext } from '../AuthProvider';

const Dashboard = () => {
    const { fetchProducts, products, isAuth, user } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isAuth) {
            fetchProducts();
        }
    }, [isAuth]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const calculateAverageRating = (ratings) => {
        if (ratings.length === 0) return 0;

        // Calculate the total sum of ratings and the total number of ratings
        const totalStars = ratings.reduce((sum, { rating }) => sum + rating, 0);
        const totalRatings = ratings.length;

        // Calculate average rating
        const averageRating = totalStars / totalRatings;

        // Scale the average rating to the range of 1 to 5
        const scaledRating = Math.min(5, Math.max(1, averageRating));

        return parseFloat(scaledRating.toFixed(1)); // Format to one decimal place
    };

    const getUserRating = (ratings) => {
        console.log(ratings);

        const userRating = ratings.length > 0 ? ratings.find(rating => rating.user === user._id) : 0
        return userRating ? userRating.rating : 0;
    };

    return (
        <section>
            <div className='fbc pt-5 px-10'>
                <p className='font-bold text-2xl'>Products</p>
                <input
                    type='text'
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder='Search for products...'
                    className='mt-5 mb-5 p-2 border border-gray-300 rounded-md'
                />
            </div>
            <div className='p-10 flex gap-8 flex-wrap'>
                {filteredProducts.map(product => (
                    <FoodCard
                        key={product._id}
                        _id={product._id}
                        title={product.name}
                        image={product.image}
                        rating={calculateAverageRating(product.rating)}
                        userRating={getUserRating(product.rating)}
                        price={product.price}
                        oldPrice={product.oldPrice} // Include oldPrice if needed
                    />
                ))}
            </div>
        </section>
    );
};

export default Dashboard;
