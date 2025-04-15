import { useState, useEffect } from "react";

interface TypingTextProps {
  words: string[];
  className?: string;
}

export default function TypingText({ words, className = "" }: TypingTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const typingSpeed = 100; // Velocidade de digitação
    const deletingSpeed = 50; // Velocidade de deleção
    const pauseTime = 1500; // Tempo de pausa entre palavras

    const type = () => {
      const currentWord = words[currentWordIndex];
      
      if (isPaused) {
        // Pausa entre palavras
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseTime);
        return;
      }

      if (isDeleting) {
        // Deletando texto
        setCurrentText(currentWord.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }
      } else {
        // Digitando texto
        setCurrentText(currentWord.substring(0, currentText.length + 1));
        if (currentText === currentWord) {
          setIsPaused(true);
        }
      }
    };

    const timer = setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, isPaused, currentWordIndex, words]);

  return (
    <span className={`typing-container ${className}`}>
      <span className="typing-text">{currentText}</span>
    </span>
  );
} 