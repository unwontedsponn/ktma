export default function Card ({ title, rightHand, kick, hhf, leftHand }) {
  const renderPatterns = (pattern) => (
    // Assuming pattern is a string; split into an array of characters for mapping
    <div className="flex items-center justify-center space-x-3 md:space-x-4">
      {pattern.split("").map((char, index) => (
        <div key={index} className="text-center text-sm md:text-lg">
          {char}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="border p-8 shadow-md text-center font-gopher-mono color-dark">
        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>
        </div>
        {renderPatterns(rightHand)}
        {renderPatterns(leftHand)}
        {renderPatterns(kick)}
        {renderPatterns(hhf)}
      </div>
    </>
  );
};