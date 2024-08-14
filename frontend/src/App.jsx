import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Navbar from './components/Navbar';
import './assets/fontAwesome';
import Login from './pages/Login';
import { AuthContext } from './AuthProvider';
import { useContext } from 'react';
import Admin from './pages/Admin';
import Sidebar from './components/SideBar';
import CheckoutModal from './pages/CheckoutModal';
import ProductManagement from './pages/ProductManagement';

function App() {

    const { isAuth, isSidebar } = useContext(AuthContext);

    const width = isSidebar ? 'calc(100% - 250px)' : 'calc(100% - 60px)';

    return (
        <BrowserRouter>
            {isAuth ?
                <>
                    <Navbar />
                    <Sidebar />
                    <main className={(isSidebar ? 'hidden md:left-[250px] md:block' : 'left-[60px]') + ' absolute top-16 transition-all duration-200'} style={{ width: width }}>
                        <Routes>
                            <Route path='/' element={<Dashboard />} />
                            <Route path='/admin' element={<Admin />} />
                            <Route path='/cart' element={<Cart />} />
                            <Route path='/cart/checkout' element={<CheckoutModal />} />
                            <Route path='/products' element={<ProductManagement />} />
                        </Routes>
                    </main>
                </>
                : <Login />}
        </BrowserRouter>
    )
}

export default App
