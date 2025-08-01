import CountdownCard from './CountdownCard';
import { Heart } from 'lucide-react';

interface LevelSectionProps {
  level: number;
  title: string;
  cards: string[];
  onCardFlip: (level: number, card: number, statement: string) => void;
  selectedCard?: number;
}

const LevelSection = ({ level, title, cards, onCardFlip, selectedCard }: LevelSectionProps) => {
  const handleCardFlip = (cardNumber: number, statement: string) => {
    // Only allow flipping if no card is selected yet for this level
    if (selectedCard === undefined) {
      onCardFlip(level, cardNumber, statement);
    }
  };

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 1: return '🍳';
      case 2: return '🚴‍♀️';
      case 3: return '🎁';
      case 4: return '💫';
      default: return '💖';
    }
  };

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-3xl">{getLevelIcon(level)}</span>
          <h2 className="text-3xl font-bold text-primary">Level {level}</h2>
          <Heart className="w-6 h-6 text-accent animate-heart-beat" />
        </div>
        <p className="text-lg text-muted-foreground font-medium">{title}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((content, index) => (
          <CountdownCard
            key={`${level}-${index + 1}`}
            number={index + 1}
            content={content}
            onFlip={() => handleCardFlip(index + 1, content)}
            isFlipped={selectedCard === index + 1}
            isDisabled={selectedCard !== undefined && selectedCard !== index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default LevelSection;