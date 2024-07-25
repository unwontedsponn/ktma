import React, { ReactNode } from 'react';

// Define the Props interface
interface LargeScreenSectionProps {
  children: ReactNode;
  flexDirection?: string; // Optional, default is 'flex-row'
  justifyContent?: string; // Optional, default is 'justify-center'
  gapX?: string; // Optional, default is 'gap-x-8'
  paddingX?: string; // Optional, default is 'px-0'
  className?: string; // Optional
}

// Annotate the component with the props interface
const LargeScreenSection: React.FC<LargeScreenSectionProps> = ({
  children,
  flexDirection = 'flex-row', // Default to 'flex-row'
  justifyContent = 'justify-center', // Default to 'justify-center'
  gapX = 'gap-x-8', // Default value for gap-x
  paddingX = 'px-0', // Default padding x (no padding)
  className = '', // Default to empty string
}) => {
  const containerClasses = `hidden h-screen overflow-hidden lg:flex ${flexDirection} ${justifyContent} items-center ${gapX} ${paddingX} ${className}`;

  return <div className={containerClasses}>{children}</div>;
};

export default LargeScreenSection;
