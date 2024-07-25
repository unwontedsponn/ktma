import { useEffect } from 'react';

export default function Modal({ onClose, children }) {
  
  // Close the modal when the user presses the Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white border-3 border-thick-border-gray overflow-hidden shadow-lg max-w-2xl w-full">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl font-bold">
          &times;
        </button>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
