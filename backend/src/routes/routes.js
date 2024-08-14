import { credentialLogin, credentialSignup, getUser, googleLogin, logout } from '../controllers/auth.js';
import express from 'express';
import { checkIsAdmin, loginRequired } from '../middleware/middleware.js';
import { checkOut, deleteCart, manageCartItems, paymentCheckOut, removeProductFromCart } from '../controllers/cart.js';
import { addProduct, deleteProduct, getAdminData, updateOrderStatus, updateProduct } from '../controllers/admin.js';
import multer from 'multer'
import { getAllProducts, giveRating } from '../controllers/initial.js';


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    },
});

const router = express.Router();

// ===========> get initally data <==========
router.get('/user', loginRequired, getUser);
router.get('/all-products', loginRequired, getAllProducts)

// ===========> Login routes <===============
router.post('/auth/google', googleLogin);
router.post('/auth/login', credentialLogin);
router.post('/auth/signup', credentialSignup);
router.get('/logout', logout);


// ===========> cart routes <==============

router.get('/manage-cart-items', loginRequired, manageCartItems)
router.post('/manage-cart-items', loginRequired, manageCartItems);
router.delete('/manage-cart-items/:productId', loginRequired, manageCartItems);
router.post('/remove-product-from-cart', loginRequired, removeProductFromCart);
router.get('/delete-cart', loginRequired, deleteCart);

// ===========> product routes <============
router.post('/give-rating', loginRequired, giveRating)

// ===========> admin routes <==============

router.post('/add-product', loginRequired, checkIsAdmin, upload.single('image'), addProduct);
router.get('/get-admin-data', loginRequired, checkIsAdmin, getAdminData);
router.post('/update-order-status', loginRequired, checkIsAdmin, updateOrderStatus);
router.delete('/product/:id', loginRequired, checkIsAdmin, deleteProduct);
router.put('/update-product/:id', loginRequired, checkIsAdmin, upload.single('image'), updateProduct);


// ===========> payment routes <=============

router.post('/create-payment-intent',loginRequired, paymentCheckOut);
router.post('/proceed-payment',loginRequired, checkOut);


export default router;
