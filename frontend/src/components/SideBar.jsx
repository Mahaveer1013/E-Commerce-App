import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBox, faCartShopping, faHatCowboy, faHome, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../AuthProvider';

const Sidebar = () => {

    const { logout, setIsSidebar, isSidebar, user, cart } = useContext(AuthContext);

    const handleSidebar = () => {
        setIsSidebar(prev => !prev)
    }

    const totalCount = cart ? cart.reduce((sum, item) => { return sum + item.count }, 0) : 0

    return (
        <nav className={(isSidebar ? 'w-full md:w-[250px]' : 'w-[60px]') + ' px-2 h-[100vh] flex flex-col bg-secondary shadow-lg fixed z-40 transition-all duration-200'}>
            <p className='p-3 cursor-pointer mb-5' onClick={handleSidebar}><FontAwesomeIcon icon={faBars} /></p>
            {user.user_type === 1 &&
                <>
                    <Link to={'/admin'} className='hover:bg-darkhover border-y border-darkhover p-3 rounded transition-all duration-300 hover:text-primary'>
                        <FontAwesomeIcon icon={faHatCowboy} /> {isSidebar && 'Admin'}
                    </Link>
                    <Link to={'/products'} className='hover:bg-darkhover border-y border-darkhover p-3 rounded transition-all duration-300 hover:text-primary'>
                        <FontAwesomeIcon icon={faBox} /> {isSidebar && 'Product Management'}
                    </Link>
                </>
            }
            <Link to={'/'} className='hover:bg-darkhover border-b border-darkhover p-3 rounded transition-all duration-300 hover:text-primary'>
                <FontAwesomeIcon icon={faHome} /> {isSidebar && 'Home'}
            </Link>
            <Link to={'/cart'} className='hover:bg-darkhover border-b border-darkhover p-3 rounded transition-all duration-300 hover:text-primary relative'>
                <FontAwesomeIcon icon={faCartShopping} /> {isSidebar && 'View Cart'}
                {isSidebar && <span className='bg-darkhover rounded-full h-3 w-3 text-sm p-[10px] fcc text-primary absolute top-1/2 -translate-y-1/2 left-[120px]'>{totalCount}</span>}
            </Link>
            <p onClick={logout} className='cursor-pointer hover:bg-darkhover border-b border-darkhover p-3 rounded transition-all duration-300 hover:text-primary'>
                <FontAwesomeIcon icon={faSignOut} /> {isSidebar && 'Logout'}
            </p>
        </nav>
    )
}

export default Sidebar