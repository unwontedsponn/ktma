import React from 'react';

interface BreadcrumbProps {
  currentIndex: number;
  itemCount: number;
  onBreadcrumbClick?: (index: number) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentIndex, itemCount, onBreadcrumbClick }) => {
  return (
    <div className="flex justify-center space-x-2 mt-2">
      {Array.from({ length: itemCount }, (_, index) => (
        <button
          key={index}
          className={`size-2 rounded-full ${index === currentIndex ? 'bg-dark-blue' : 'bg-gray-300'}`}
          onClick={() => onBreadcrumbClick && onBreadcrumbClick(index)}
          aria-label={`Go to item ${index + 1}`}
        ></button>
      ))}
    </div>
  );
};

export default Breadcrumb;