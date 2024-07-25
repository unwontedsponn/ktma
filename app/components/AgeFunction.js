/** This is not uet being used!!!!! */

import{ useEffect, useState } from 'react';

export default function AgeFunction() {
  const [age, setAge] = useState('');

  // Calculates the age based on a birthdate and the current date
  useEffect(() => {
    const calculateAge = () => {
        const birthDate = new Date("1989-11-24"); // Your birthdate
        const currentDate = new Date(); // Today's date
        const ageInMilliseconds = currentDate - birthDate;
        const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
        // Update the 'age' state with the calculated age
        setAge(ageInYears);
    };
    calculateAge();
  }, []); // Empty dependency array means this effect runs once after the initial render
  
  return <span>{age}</span>;
}