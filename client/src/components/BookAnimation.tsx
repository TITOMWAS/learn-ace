import { useEffect, useState } from 'react';
import bookImage from '@/assets/book-learning.png';

interface BookAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BookAnimation = ({ size = 'md', className = '' }: BookAnimationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} mx-auto`}>
      <img
        src={bookImage}
        alt="Learning Book"
        className={`w-full h-full object-contain transition-all duration-1000 ${
          isVisible 
            ? 'opacity-100 animate-enhanced-bounce' 
            : 'opacity-0 scale-90'
        }`}
      />
    </div>
  );
};