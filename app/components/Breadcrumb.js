import React from 'react';

export default function Breadcrumb ({ currentIndex, itemCount, onBreadcrumbClick }) {
  return (
    <div className="flex justify-center space-x-2 mt-2">
      {Array.from({ length: itemCount }, (_, index) => (
        <button
          key={index}
          className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-[#334862]' : 'bg-gray-300'}`}
          onClick={() => onBreadcrumbClick && onBreadcrumbClick(index)}
          aria-label={`Go to item ${index + 1}`}
        ></button>
      ))}
    </div>
  );
};
