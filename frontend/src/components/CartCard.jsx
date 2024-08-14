import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faStar } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../AuthProvider'

const CartCard = ({ cartProduct }) => {

  const {addToCart, removeFromCart} = useContext(AuthContext)

  return (
    <div className='w-[250px] bg-secondary p-3 rounded-md shadow-sm hover:shadow-2xl fcc flex-col hover:bg-tertiary transition-all duration-300'>
      <div className='overflow-hidden rounded-md w-[100%] h-[150px]'><img src={cartProduct.product.image} alt="Food Image" className='hover:scale-[1.1] transition-all duration-300' />
      </div>
      <div className='pt-3 w-full'>
        <p className='font-bold text-center font'>{cartProduct.product.name}</p>
        <div className='fbc pt-3 pb-2 w-full'>
          <p className='font-semibold'>$ {cartProduct.product.price}</p>
          <p className='font-semibold'><FontAwesomeIcon icon={faStar} className='text-yellow-600' /> &nbsp;{cartProduct.product.rating?.totalRating}/5</p>
        </div>
      </div>
      <div className='fcc gap-4'>
        <FontAwesomeIcon icon={faMinus} className='bg-darkhover text-primary p-3 rounded-full cursor-pointer' onClick={()=>{removeFromCart(cartProduct.product._id)}}/>
        <p>{cartProduct.count}</p>
        <FontAwesomeIcon icon={faPlus} className='bg-darkhover text-primary p-3 rounded-full cursor-pointer' onClick={()=>{addToCart(cartProduct.product._id)}}/>
      </div>
    </div>
  )
}

export default CartCard