


let cart = []; 
let cartTotal = 0; 


document.addEventListener('DOMContentLoaded', function() {
    console.log('Shopping cart system initialized');
    updateCartDisplay(); // Initialize empty cart display
});

/**
 * Add item to cart function
 * Handles adding new items or increasing quantity of existing items
 * 
 * @param {string} itemName - Name of the product to add
 * @param {number} price - 
 */
function addToCart(itemName, price) {
    try {
        // Input validation using try-catch for error handling
        if (!itemName || typeof itemName !== 'string') {
            throw new Error('Invalid item name provided');
        }
        
        if (!price || typeof price !== 'number' || price <= 0) {
            throw new Error('Invalid price provided. Price must be a positive number.');
        }
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.name === itemName);
        
        if (existingItem) {
            // If item exists, increase quantity instead of duplicating
            existingItem.quantity += 1;
            existingItem.total = existingItem.quantity * existingItem.price;
            showMessage(`Quantity increased for ${itemName}`, 'info');
        } else {
            // If item doesn't exist, add new item to cart array
            const newItem = {
                name: itemName,
                price: price,
                quantity: 1,
                total: price
            };
            cart.push(newItem);
            showMessage(`${itemName} added to cart!`, 'success');
        }
        
        // Update cart display and calculations
        updateCartDisplay();
        calculateCartTotal();
        
    } catch (error) {
        // Error handling with try-catch as required
        console.error('Error adding item to cart:', error.message);
        showMessage(`Error: ${error.message}`, 'error');
    }
}

/**
 * Remove item from cart function
 * Completely removes an item from the cart array
 * 
 * @param {string} itemName - Name of the product to remove
 */
function removeFromCart(itemName) {
    try {
        // Input validation
        if (!itemName || typeof itemName !== 'string') {
            throw new Error('Invalid item name provided for removal');
        }
        
        // Find item index in cart array
        const itemIndex = cart.findIndex(item => item.name === itemName);
        
        if (itemIndex === -1) {
            throw new Error('Item not found in cart');
        }
        
        // Remove item from cart array using splice
        const removedItem = cart.splice(itemIndex, 1)[0];
        showMessage(`${removedItem.name} removed from cart`, 'info');
        
        // Update cart display and calculations
        updateCartDisplay();
        calculateCartTotal();
        
    } catch (error) {
        console.error('Error removing item from cart:', error.message);
        showMessage(`Error: ${error.message}`, 'error');
    }
}

/**
 * Update quantity of an existing cart item
 * Allows users to modify quantity directly
 * 
 * @param {string} itemName - Name of the product
 * @param {number} newQuantity - New quantity value
 */
function updateQuantity(itemName, newQuantity) {
    try {
        // Input validation
        if (!itemName || typeof itemName !== 'string') {
            throw new Error('Invalid item name provided');
        }
        
        if (!newQuantity || typeof newQuantity !== 'number' || newQuantity < 0) {
            throw new Error('Invalid quantity. Must be a non-negative number.');
        }
        
        // Find the item in cart
        const item = cart.find(item => item.name === itemName);
        
        if (!item) {
            throw new Error('Item not found in cart');
        }
        
        if (newQuantity === 0) {
            // If quantity is 0, remove the item
            removeFromCart(itemName);
            return;
        }
        
        // Update quantity and recalculate total
        item.quantity = newQuantity;
        item.total = item.quantity * item.price;
        
        // Update cart display and calculations
        updateCartDisplay();
        calculateCartTotal();
        
    } catch (error) {
        console.error('Error updating quantity:', error.message);
        showMessage(`Error: ${error.message}`, 'error');
    }
}

/**
 * Clear entire cart function
 * Removes all items from the cart array
 */
function clearCart() {
    try {
        if (cart.length === 0) {
            showMessage('Cart is already empty', 'info');
            return;
        }
        
        const itemCount = cart.length;
        cart = []; // Clear the cart array
        cartTotal = 0; // Reset total
        
        showMessage(`Cart cleared! Removed ${itemCount} item(s)`, 'info');
        updateCartDisplay();
        
    } catch (error) {
        console.error('Error clearing cart:', error.message);
        showMessage(`Error: ${error.message}`, 'error');
    }
}

/**
 * Calculate total price of all items in cart
 * Uses loops to iterate through cart array and sum totals
 */
function calculateCartTotal() {
    try {
        cartTotal = 0; // Reset total
        
        // Loop through cart array to calculate total
        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            cartTotal += item.total;
        }
        
        // Round to 2 decimal places to avoid floating point errors
        cartTotal = Math.round(cartTotal * 100) / 100;
        
    } catch (error) {
        console.error('Error calculating cart total:', error.message);
        cartTotal = 0;
    }
}

/**
 * Update cart display in the DOM
 * Dynamically creates table rows for cart items using DOM manipulation
 */
function updateCartDisplay() {
    try {
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartContent = document.getElementById('cart-content');
        const cartItems = document.getElementById('cart-items');
        const grandTotal = document.getElementById('grand-total');
        
        // Clear existing cart items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            // Show empty cart message
            emptyCartMessage.style.display = 'block';
            cartContent.style.display = 'none';
        } else {
            // Hide empty message and show cart content
            emptyCartMessage.style.display = 'none';
            cartContent.style.display = 'block';
            
            // Loop through cart array to create table rows
            cart.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <input type="number" 
                               value="${item.quantity}" 
                               min="0" 
                               max="99"
                               onchange="updateQuantity('${item.name}', parseInt(this.value))"
                               class="quantity-input">
                    </td>
                    <td>$${item.total.toFixed(2)}</td>
                    <td>
                        <button class="remove-btn" onclick="removeFromCart('${item.name}')">
                            Remove
                        </button>
                    </td>
                `;
                cartItems.appendChild(row);
            });
            
            // Update grand total display
            grandTotal.innerHTML = `<strong>$${cartTotal.toFixed(2)}</strong>`;
        }
        
    } catch (error) {
        console.error('Error updating cart display:', error.message);
        showMessage(`Error updating display: ${error.message}`, 'error');
    }
}

/**
 * Show user feedback messages
 * Creates and displays temporary messages for user actions
 * 
 * @param {string} message - Message text to display
 * @param {string} type - Type of message (success, error, info)
 */
function showMessage(message, type = 'info') {
    try {
        const messageContainer = document.getElementById('message-container');
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        // Add message to container
        messageContainer.appendChild(messageElement);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 3000);
        
    } catch (error) {
        console.error('Error showing message:', error.message);
    }
}

/**
 * Checkout function
 * Processes the cart for checkout (simulated)
 */
function checkout() {
    try {
        if (cart.length === 0) {
            showMessage('Cannot checkout with an empty cart!', 'error');
            return;
        }
        
        // Simulate checkout process
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        showMessage(`Checkout successful! ${totalItems} item(s) for $${cartTotal.toFixed(2)}`, 'success');
        
        // Clear cart after successful checkout
        setTimeout(() => {
            clearCart();
        }, 2000);
        
    } catch (error) {
        console.error('Error during checkout:', error.message);
        showMessage(`Checkout error: ${error.message}`, 'error');
    }
}

/**
 * Utility function to format currency
 * Helper function for consistent currency formatting
 * 
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    try {
        if (typeof amount !== 'number') {
            throw new Error('Amount must be a number');
        }
        return `$${amount.toFixed(2)}`;
    } catch (error) {
        console.error('Error formatting currency:', error.message);
        return '$0.00';
    }
}

/**
 * Validate cart data integrity
 * Utility function to check cart data consistency
 */
function validateCartData() {
    try {
        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            
            // Check required properties
            if (!item.name || !item.price || !item.quantity || !item.total) {
                throw new Error(`Invalid cart item at index ${i}`);
            }
            
            // Check data types
            if (typeof item.name !== 'string' || 
                typeof item.price !== 'number' || 
                typeof item.quantity !== 'number' || 
                typeof item.total !== 'number') {
                throw new Error(`Invalid data types in cart item at index ${i}`);
            }
            
            // Check calculated total matches expected
            const expectedTotal = item.price * item.quantity;
            if (Math.abs(item.total - expectedTotal) > 0.01) {
                throw new Error(`Total mismatch for item ${item.name}`);
            }
        }
        
        return true;
    } catch (error) {
        console.error('Cart validation error:', error.message);
        return false;
    }
}

// Additional CSS for quantity input styling
const style = document.createElement('style');
style.textContent = `
    .quantity-input {
        width: 60px;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
        text-align: center;
        font-size: 0.9rem;
    }
    
    .quantity-input:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    }
`;
document.head.appendChild(style);
