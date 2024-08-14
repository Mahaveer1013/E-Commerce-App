import React, { useContext, useState } from 'react';
import api from '../api/api';
import { AuthContext } from '../AuthProvider';

const UpdateProductForm = ({ product, onClose }) => {
    const { fetchProducts } = useContext(AuthContext)
    const [formData, setFormData] = useState({
        name: product.name,
        price: product.price,
        noOfOrders: product.noOfOrders,
        image: product.image,
    });
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedFormData = new FormData();
            updatedFormData.append('name', formData.name);
            updatedFormData.append('price', formData.price);
            updatedFormData.append('noOfOrders', formData.noOfOrders);

            if (file) {
                updatedFormData.append('image', file);
            }

            await api.put(`/update-product/${product._id}`, updatedFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchProducts()
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg shadow-lg p-5 w-[90%] max-w-lg'>
                <h2 className='text-xl font-bold mb-4'>Update Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
                            Name
                        </label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='price'>
                            Price
                        </label>
                        <input
                            type='number'
                            id='price'
                            name='price'
                            value={formData.price}
                            onChange={handleChange}
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='noOfOrders'>
                            Number of Orders
                        </label>
                        <input
                            type='number'
                            id='noOfOrders'
                            name='noOfOrders'
                            value={formData.noOfOrders}
                            onChange={handleChange}
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='currentImage'>
                            Current Image
                        </label>
                        <img src={formData.image} alt='Current product' className='mb-4 w-1/2 m-auto' />
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='imageFile'>
                            New Image
                        </label>
                        <input
                            type='file'
                            id='imageFile'
                            name='imageFile'
                            onChange={handleFileChange}
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <button
                            type='submit'
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        >
                            Update
                        </button>
                        <button
                            type='button'
                            onClick={onClose}
                            className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProductForm;
