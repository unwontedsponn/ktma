"use client"

// Define the Props interface
interface CartProps {
  showCartModal: boolean;
  setShowCartModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Cart: React.FC<CartProps> = ({ showCartModal, setShowCartModal }) => {
  // Function to close the modal
  const closeModal = () => setShowCartModal(false);

  return (
    <div 
      id="myModal" 
      className={`fixed z-10 left-0 top-0 w-full h-full bg-black bg-opacity-40 ${showCartModal ? 'block' : 'hidden'}`} // Modal overlay styles
    >
      <div 
        className="modal-content bg-white m-auto p-5 border-3 border-thick-border-gray w-4/5 md:w-1/2 lg:w-1/3 shadow-lg" // Modal content styles
      >
        <span 
          className="close text-gray-400 float-right text-3xl font-bold hover:text-black focus:text-black cursor-pointer" // Close button styles
          onClick={closeModal}
        >
          &times;
        </span>
        <div className="space-y-2">
          <p className="font-gopher-mono-semi">Shopping Cart Items: </p>
          <div className="font-gopher-mono">
            <span>- </span>
            <span>Beginner To Composer In 14 Days Book</span>
            <span> £10 </span>
            <span className="border-3 border-thick-border-gray py-1 px-2 hover:cursor-pointer hover:opacity-50">REMOVE</span>
          </div>
          <button className="border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50">BUY ITEMS</button>
        </div>        
      </div>
    </div>
  );
}
export default Cart;