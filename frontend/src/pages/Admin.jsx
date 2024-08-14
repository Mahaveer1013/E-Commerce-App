import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthProvider';
import { Navigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import api from '../api/api';

const Admin = () => {
    const { user, isAuth } = useContext(AuthContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [addProductModalIsOpen, setAddProductModalIsOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ image: null, name: '', price: '' });
    const [topSellingProducts, setTopSellingProducts] = useState([])
    const [ordersPerDay, setOrdersPerDay] = useState([])
    const [orderHistory, setOrderHistory] = useState([])

    if (user.user_type !== 1) {
        return <Navigate to={'/'} />;
    }

    const handleViewProducts = (order) => {
        setSelectedOrder(order);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedOrder(null);
    };

    const handleAddProductModalOpen = () => {
        setAddProductModalIsOpen(true);
    };

    const closeAddProductModal = () => {
        setAddProductModalIsOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Create a new FormData object
        const formData = new FormData();
        formData.append('image', newProduct.image);
        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price);
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        console.log(newProduct);

        try {
            const response = await api.post('/add-product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response.data);
            setNewProduct({ image: null, name: '', price: '' });
            closeAddProductModal();
        } catch (error) {
            console.error('Error uploading product:', error);
        }
    };

    const fetchAdminData = async () => {
        try {
            const { data } = await api.get('/get-admin-data');
            setTopSellingProducts(data.topSellingProducts);
            setOrdersPerDay(data.ordersPerDay);
            setOrderHistory(data.orderHistory);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
    };

    const updateOrderStatus = async (orderId) => {
        const confirmed = window.confirm('Is that order delivery completed ?');
        if (confirmed) {
            const response = await api.post('/update-order-status', { orderId })
            fetchAdminData()
        }
    }

    useEffect(() => {
        isAuth && fetchAdminData();
    }, [isAuth]);

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c'];

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
        return (
            <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12">
                {`${topSellingProducts[index].name} (${(percent * 100).toFixed(0)}%)`}
            </text>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-4">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleAddProductModalOpen}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                        Add Product
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row lg:justify-around mt-3">
                    <div className="flex-1 mb-6 lg:mb-0">
                        <h2 className="text-center font-bold mb-4">Top 10 Most Selling Products</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={topSellingProducts}
                                    dataKey="noOfOrders"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                >
                                    {topSellingProducts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-center font-bold mb-4">Orders Per Day</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ordersPerDay}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="orders" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-center font-bold mb-4">Order History</h2>
                    <div className="overflow-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                            <thead className="bg-gray-100 text-gray-600">
                                <tr>
                                    <th className="py-3 px-4 text-left">Username</th>
                                    <th className="py-3 px-4 text-left">No. of Products</th>
                                    <th className="py-3 px-4 text-left">Total Price</th>
                                    <th className="py-3 px-4 text-left">View Products</th>
                                    <th className="py-3 px-4 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderHistory.map((order, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4">{order.username}</td>
                                        <td className="py-3 px-4">{order.numProducts}</td>
                                        <td className="py-3 px-4">${order.totalPrice}</td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => handleViewProducts(order)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                            >
                                                View Products
                                            </button>
                                        </td>
                                        <td className="py-3 px-4">
                                            {order.status === 'Delivered' ? (
                                                <p className="bg-green-500 rounded-md p-2 text-center text-white hover:bg-green-600 cursor-pointer">
                                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                                    {order.status}
                                                </p>
                                            ) : (
                                                <p className="bg-yellow-500 rounded-md p-2 text-center text-white hover:bg-yellow-600 cursor-pointer" onClick={() => updateOrderStatus(order._id)}>
                                                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                                                    {order.status}
                                                </p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Order Products"
                    className="ml-[70px] mr-[10px] max-w-lg w-full mx-auto mt-20 bg-white p-8 rounded-lg shadow-lg relative z-50"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                >
                    <h2 className="text-xl font-bold mb-4">Products in Cart</h2>
                    <ul className="list-disc ml-6">
                        {selectedOrder?.products.map((product, index) => (
                            <li key={index}>{product}</li>
                        ))}
                    </ul>
                    <button
                        onClick={closeModal}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Close
                    </button>
                </Modal>

                <Modal
                    isOpen={addProductModalIsOpen}
                    onRequestClose={closeAddProductModal}
                    contentLabel="Add Product"
                    className="ml-[70px] mr-[10px] max-w-lg w-full mx-auto mt-20 bg-white p-8 rounded-lg shadow-lg relative z-50"
                    overlayClassName="fixed inset-0 z-6 bg-black bg-opacity-50 flex items-center justify-center"
                >
                    <h2 className="text-xl font-bold mb-4">Add New Product</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Image</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={newProduct.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={newProduct.price}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={closeAddProductModal}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                                Add Product
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default Admin;
