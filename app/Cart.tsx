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
        className="modal-content bg-white m-auto p-5 border border-gray-200 w-4/5 md:w-1/2 lg:w-1/3 rounded shadow-lg" // Modal content styles
      >
        <span 
          className="close text-gray-400 float-right text-3xl font-bold hover:text-black focus:text-black cursor-pointer" // Close button styles
          onClick={closeModal}
        >
          &times;
        </span>
        <p className="font-gopher-mono">Shopping Cart Items: <span className="font-bold">Beginner To Composer In 14 Days PDF Book x1</span></p>
      </div>
    </div>
  );
}
export default Cart;