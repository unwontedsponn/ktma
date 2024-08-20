"use client"
import { useEffect, useState } from 'react';

interface CartItem {
  itemId: string;
  price: number;
}

interface CartProps {
  showCartModal: boolean;
  setShowCartModal: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string; // Pass userId as a prop
}

const Cart: React.FC<CartProps> = ({ showCartModal, setShowCartModal, userId }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Fetch cart items when the component mounts or showCartModal changes
  useEffect(() => {
    if (showCartModal) fetchCartItems();
  }, [showCartModal]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`/api/cart/get?userId=${userId}`);
      const data = await response.json();
      
      // Log the userId and itemId for each item in the cart
      data.forEach((item: { price: number; userId: string; itemId: string }) => {
        console.log(`User ID: ${item.userId}, Item ID: ${item.itemId}, Price: ${item.price}`);
      });
  
      setCartItems(data);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    }
  };
  

  const removeItemFromCart = async (itemId: string) => {
    try {
      await fetch(`/api/cart/delete?itemId=${itemId}&userId=${userId}`, { method: 'DELETE' });
      fetchCartItems(); // Refresh cart items after removal
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  const closeModal = () => setShowCartModal(false);

  return (
    <div 
      id="myModal" 
      className={`fixed z-10 left-0 top-0 w-full h-full bg-black bg-opacity-40 ${showCartModal ? 'block' : 'hidden'}`}
    >
      <div className="modal-content bg-white m-auto p-5 border-3 border-thick-border-gray w-4/5 md:w-1/2 lg:w-1/3 shadow-lg">
        <span 
          className="close text-gray-400 float-right text-3xl font-bold hover:text-black focus:text-black cursor-pointer"
          onClick={closeModal}
        >
          &times;
        </span>
        <div className="space-y-2">
          <p className="font-gopher-mono-semi">Shopping Cart Items:</p>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.itemId} className="font-gopher-mono">
                <span>- {item.itemId}</span>
                <span> £{item.price} </span>
                <span
                  className="border-3 border-thick-border-gray py-1 px-2 hover:cursor-pointer hover:opacity-50"
                  onClick={() => removeItemFromCart(item.itemId)}
                >
                  REMOVE
                </span>
              </div>
            ))
          ) : (
            <p>No items in the cart.</p>
          )}
          <button className="border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50">
            BUY ITEMS
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
