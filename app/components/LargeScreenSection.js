const breakpoints = {
  sm: 'sm:flex',
  md: 'md:flex',
  lg: 'lg:flex',
  xl: 'xl:flex',
  // Add more if needed
};

export default function LargeScreenSection({
  children,
  flexDirection = 'flex-row', // Default to 'flex-row'
  justifyContent = 'justify-center', // Default to 'justify-center'
  gapX = 'gap-x-8', // Default value for gap-x
  paddingX = 'px-0', // Default padding x (no padding)
  className
}) {
  const containerClasses = `hidden h-screen overflow-hidden lg:flex ${flexDirection} ${justifyContent} items-center ${gapX} ${paddingX} ${className}`;

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}