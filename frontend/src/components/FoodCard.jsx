import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faStar } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../AuthProvider';
import encryptApi from '../api/encryptApi';

const FoodCard = ({ _id, image, title, rating, price, userRating }) => {
  const { cart, addToCart, removeProductFromCart, fetchProducts } = useContext(AuthContext);

  // Check if the item is in the cart
  const isInCart = cart && cart.findIndex(cartItem => cartItem.product._id === _id) !== -1;

  const handleRating = (rating) => {
    encryptApi.post('/give-rating', { productId: _id, rating })
      .then(() => fetchProducts())
      .catch(error => console.error('Error giving rating:', error));
  };

  // Helper function to determine star color
  const getStarClassName = (starNumber) => {
    return starNumber <= userRating ? 'text-yellow-600' : 'text-gray-300';
  };

  return (
    <div className='w-[250px] bg-secondary p-3 rounded-md shadow-sm hover:shadow-2xl flex flex-col items-center hover:bg-tertiary transition-all duration-300'>
      <div className='overflow-hidden rounded-md w-[100%] h-[150px]'>
        <img src={image} alt="Food Image" className='hover:scale-[1.1] transition-all duration-300' />
      </div>
      <div className='pt-3 w-full text-center'>
        <p className='font-bold'>{title}</p>
        <div className='flex justify-between pt-3 pb-2 w-full'>
          <p className='font-semibold'>
            $ {price}
          </p>
          <p className='font-semibold'>
            {rating.toFixed(1)}/5
          </p>
        </div>
      </div>
      <p className='w-full fcc gap-3 pb-4'>
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={faStar}
            className={`cursor-pointer ${getStarClassName(star)}`}
            onClick={() => handleRating(star)}
          />
        ))}
      </p>
      {isInCart ? (
        <p className='p-2 text-sm cursor-pointer rounded-md bg-red-500 text-white' onClick={() => removeProductFromCart(_id)}>
          <FontAwesomeIcon icon={faMinus} /> &nbsp;Remove From Cart
        </p>
      ) : (
        <p className='p-2 text-sm cursor-pointer rounded-md bg-green-600 text-white' onClick={() => addToCart(_id)}>
          <FontAwesomeIcon icon={faPlus} /> &nbsp;Add To Cart
        </p>
      )}
    </div>
  );
};

export default FoodCard;
