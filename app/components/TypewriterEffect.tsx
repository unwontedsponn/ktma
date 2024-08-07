"use client"
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface TypewriterEffectProps {
    text: string;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ text }) => {
    const [typingEffect, setTypingEffect] = useState('');
    const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 }); // Consider using triggerOnce: true if you want the effect to run only once

    useEffect(() => {
        if (inView) { // Only start typing when the element is in view
            let currentText = '';
            let index = 0;
            const typeLetter = () => {
                if (index < text.length) {
                    currentText += text.charAt(index);
                    setTypingEffect(currentText);
                    index++;
                    setTimeout(typeLetter, 70);
                }
            };
            typeLetter();
        }
    }, [inView, text]); // Add inView as a dependency

    return (
        <span ref={ref}>
            {typingEffect}
        </span>
    );
}
export default TypewriterEffect;