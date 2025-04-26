// controllers/cartController.js
import CartItem from '../models/Cart.js';
import Tour from '../models/Tour.js';
import { sendTourInfoEmail } from '../utils/notifyCartEmailService.js';

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { tour, adults, children, roomCategory, roomType, email, totalPrice } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required' 
      });
    }

    // 1. Check if tour exists
    const tourDoc = await Tour.findById(tour);
    if (!tourDoc) {
      return res.status(404).json({ 
        success: false,
        error: 'Tour not found' 
      });
    }

    // 2. Create cart item
    const cartItem = new CartItem({
      tour,
      adults,
      children,
      roomCategory,
      roomType,
      email,
      totalPrice
    });

    await cartItem.save();

    // 3. Send email notification
    let emailSent = false;
    let emailErrorMessage = null;
    try {
      await sendTourInfoEmail(email, {
        tourTitle: tourDoc.title,
        tourDetails: tourDoc.description,
        adults,
        children,
        roomCategory,
        roomType,
        totalPrice
      });
      emailSent = true;
      cartItem.emailSent = true;
      await cartItem.save();
    } catch (emailError) {
      emailErrorMessage = emailError.message || String(emailError);
      console.error("Failed to send email:", emailErrorMessage);
      
    }

    // 4. Respond with status
    res.status(201).json({
      success: true,
      message: 'notified successfully',
      data: cartItem,
      emailSent,
      emailError: emailErrorMessage
    });
  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get cart items
export const getCartItems = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required' 
      });
    }

    const cartItems = await CartItem.find({ email })
      .populate({
        path: 'tour',
        select: 'title imageUrls regularPrice discountedPrice'
      })
      .sort({ addedAt: -1 });

    res.status(200).json({
      success: true,
      count: cartItems.length,
      data: cartItems
    });
  } catch (error) {
    console.error('Error in getCartItems:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await CartItem.findByIdAndDelete(id);

    if (!cartItem) {
      return res.status(404).json({ 
        success: false,
        error: 'Cart item not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const cartItem = await CartItem.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );

    if (!cartItem) {
      return res.status(404).json({ 
        success: false,
        error: 'Cart item not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: cartItem
    });
  } catch (error) {
    console.error('Error in updateCartItem:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Clear cart (delete all items for an email)
export const clearCart = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required' 
      });
    }
    
    const result = await CartItem.deleteMany({ email });
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error in clearCart:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
