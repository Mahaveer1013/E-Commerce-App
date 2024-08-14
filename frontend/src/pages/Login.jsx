import React, { useContext, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import encryptApi from '../api/encryptApi';
import api from '../api/api';
import { AuthContext } from '../AuthProvider';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // New state for success message

    const { loading, setLoading, fetchUser } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage(''); // Clear any previous success message

        try {
            let response;
            if (isLogin) {
                response = await encryptApi.post('/auth/login', { username, password });
            } else {
                if (password !== confirmPassword) {
                    alert('Passwords do not match');
                    setLoading(false);
                    return;
                }
                response = await encryptApi.post('/auth/signup', { username, password });
            }
            
            if (response.status >= 200 && response.status < 300) {
                console.log('Success:', response.data);
                fetchUser()
                if (!isLogin) {
                    setSuccessMessage('Registration successful! You can now log in.'); // Set success message on successful registration
                    setIsLogin(true)
                }
            } else {
                setErrorMessage(response.data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error during submission:', error);
            setErrorMessage(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
            setUsername('')
            setPassword('')
            setConfirmPassword('')
        }
    };

    const GoogleAuthSuccess = async (response) => {
        try {
            const result = await api.post('/auth/google', { tokenId: response.credential });
            console.log('Google login successful:', result.data);
            fetchUser()
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const GoogleAuthError = (error) => {
        console.error('Google Login Error:', error);
        setErrorMessage('Google login failed. Please try again.');
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-lg flex">
                <div className="w-full lg:w-1/2 flex-1 bg-white p-8 rounded-r-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">{isLogin ? 'Login' : 'Sign Up'}</h2>
                    {errorMessage && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-6">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-green-100 text-green-700 p-3 rounded mb-6">
                            {successMessage}
                        </div>
                    )}
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label htmlFor="username" className="text-sm font-medium text-gray-600 mb-2">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="password" className="text-sm font-medium text-gray-600 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                required
                            />
                        </div>
                        {!isLogin && (
                            <div className="flex flex-col">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-600 mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                    required
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className={`bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </form>
                    <p className="text-center mt-4">
                        {isLogin ? (
                            <span>
                                Don't have an account?{' '}
                                <button
                                    className="text-blue-600 hover:underline focus:outline-none"
                                    onClick={() => setIsLogin(false)}
                                >
                                    Sign Up
                                </button>
                            </span>
                        ) : (
                            <span>
                                Already have an account?{' '}
                                <button
                                    className="text-blue-600 hover:underline focus:outline-none"
                                    onClick={() => setIsLogin(true)}
                                >
                                    Login
                                </button>
                            </span>
                        )}
                    </p>
                    <p className="text-center mt-4 font-bold w-full">OR</p>
                    <div className="flex justify-center w-full">
                        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_SECRET}>
                            <GoogleLogin
                                onSuccess={GoogleAuthSuccess}
                                onError={GoogleAuthError}
                            />
                        </GoogleOAuthProvider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
