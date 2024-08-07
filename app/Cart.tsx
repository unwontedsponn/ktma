"use client"

// Define the Props interface
interface CartProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Cart: React.FC<CartProps> = ({ showModal, setShowModal }) => {
  // Function to close the modal
  const closeModal = () => setShowModal(false);

  return (
    <div 
      id="myModal" 
      className={`fixed z-10 left-0 top-0 w-full h-full bg-black bg-opacity-40 ${showModal ? 'block' : 'hidden'}`} // Modal overlay styles
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
        <p className="font-gopher-mono">Drop me an email at: <span className="font-bold">benpaulspooner@gmail.com</span></p>
      </div>
    </div>
  );
}
export default Cart;