import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthProvider';
import api from '../api/api';
import UpdateProductForm from '../components/UpdateProductForm';

const ProductManagement = () => {
    const { products, fetchProducts } = useContext(AuthContext);
    console.log(products);
    
    const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleDelete = async (productId) => {
        try {
            await api.delete(`/product/${productId}`);
            fetchProducts(); // Refresh the product list after deletion
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdate = (product) => {
        setSelectedProduct(product);
        setIsUpdateFormVisible(true);
    };

    const handleFormClose = () => {
        setIsUpdateFormVisible(false);
        setSelectedProduct(null);
    };

    return (
        <div className='p-10'>
            <table className='min-w-full bg-white border'>
                <thead>
                    <tr>
                        <th className='py-2 px-4 border-b'>Name</th>
                        <th className='py-2 px-4 border-b'>Price</th>
                        <th className='py-2 px-4 border-b'>Orders</th>
                        <th className='py-2 px-4 border-b'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td className='text-center py-2 px-4 border-b'>{product.name}</td>
                            <td className='text-center py-2 px-4 border-b'>${product.price}</td>
                            <td className='text-center py-2 px-4 border-b'>{product.noOfOrders}</td>
                            <td className='text-center py-2 px-4 border-b'>
                                <button
                                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded'
                                    onClick={() => handleUpdate(product)}
                                >
                                    Update
                                </button>
                                <button
                                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2'
                                    onClick={() => handleDelete(product._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isUpdateFormVisible && (
                <UpdateProductForm product={selectedProduct} onClose={handleFormClose} />
            )}
        </div>
    );
};

export default ProductManagement;
