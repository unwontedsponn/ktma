import useScreenHeight from "@/app/hooks/useScreenHeight";
import useScreenWidth from "@/app/hooks/useScreenWidth";

const ResponsiveVisibility = ({ minHeight, minWidth, children }) => {
  const screenHeight = useScreenHeight();
  const screenWidth = useScreenWidth();

  // Render null on server-side to ensure no incorrect rendering before client-side JavaScript kicks in
  if (typeof window === 'undefined') {
    return null;
  }

  const isVisible = (screenHeight > minHeight) && (screenWidth > minWidth);

  return isVisible ? <>{children}</> : null;
};

export default ResponsiveVisibility;
