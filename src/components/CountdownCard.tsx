import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface CountdownCardProps {
  number: number;
  content: string;
  onFlip: () => void;
  isFlipped: boolean;
  isDisabled?: boolean;
}

const CountdownCard = ({ number, content, onFlip, isFlipped, isDisabled = false }: CountdownCardProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isFlipped) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isFlipped]);

  const handleClick = () => {
    if (!isFlipped && !isDisabled) {
      onFlip();
    }
  };

  return (
    <div className="perspective-1000 w-full h-40">
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        } ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={handleClick}
      >
        {/* Front of card */}
        <div className="absolute inset-0 backface-hidden bg-gradient-card border border-border rounded-xl shadow-card-custom flex items-center justify-center group hover:shadow-romantic transition-all duration-300">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2 group-hover:animate-heart-beat">
              {number}
            </div>
            <Heart className="w-6 h-6 text-accent mx-auto group-hover:animate-float" />
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-love border border-primary/20 rounded-xl shadow-romantic flex items-center justify-center p-4">
          <div className="text-center text-primary-foreground">
            {showContent && (
              <div className="animate-fade-in">
                <p className="text-sm font-medium leading-relaxed">{content}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownCard;