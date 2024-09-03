"use client"
import React from 'react';

// Define the Props interface
interface ContactProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Contact({ showModal, setShowModal }: ContactProps) {
  // Function to close the modal
  const closeModal = () => setShowModal(false);

  return (
    <div 
      id="myModal" 
      className={`fixed inset-0 z-10 bg-black/40 ${showModal ? 'block' : 'hidden'}`} // Modal overlay styles
    >
      <div 
        className="modal-content m-auto w-4/5 md:w-1/2 lg:w-1/3 p-5 border-3 border-thick-border-gray bg-white shadow-lg" // Modal content styles
      >
        <span
          className="float-right text-3xl font-bold text-gray-400 cursor-pointer hover:text-black focus:text-black close"
          role="button"
          tabIndex={0}
          onClick={closeModal}
          onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') closeModal();}}
        >
          &times;
        </span>

        <p className="font-gopher-mono">Drop me an email at: <span className="font-bold">benpaulspooner@gmail.com</span></p>
      </div>
    </div>
  );
}
