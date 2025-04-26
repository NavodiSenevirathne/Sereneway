// routes/cartRoutes.js
import express from 'express';
import { 
  addToCart, 
  getCartItems, 
  removeFromCart, 
  updateCartItem,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

// Add to cart
router.post('/', addToCart);

// Get cart items
router.get('/', getCartItems);

// Remove from cart
router.delete('/:id', removeFromCart);

// Update cart item
router.put('/:id', updateCartItem);

// Clear cart (delete all items for an email)
router.delete('/', clearCart);

export default router;
