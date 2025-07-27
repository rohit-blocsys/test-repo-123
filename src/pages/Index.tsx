import { useState, useEffect } from 'react';
import CountdownHeader from '@/components/CountdownHeader';
import LevelSection from '@/components/LevelSection';
import AdminPanel from '@/components/AdminPanel';
import NameVerification from '@/components/NameVerification';
import { Button } from '@/components/ui/button';
import { Lock, RotateCcw } from 'lucide-react';

const Index = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, number>>({});
  const [isVerified, setIsVerified] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('romantic-countdown-state');
    if (savedState) {
      const { flippedCards: saved, isLocked: savedLocked } = JSON.parse(savedState);
      setFlippedCards(saved || {});
      setIsLocked(savedLocked || false);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state = { flippedCards, isLocked };
    localStorage.setItem('romantic-countdown-state', JSON.stringify(state));
  }, [flippedCards, isLocked]);

  const handleCardFlip = (level: number, card: number) => {
    // Only allow one card per level
    setFlippedCards(prev => ({
      ...prev,
      [level]: card
    }));
  };

  const handleVerification = () => {
    setIsVerified(true);
  };

  const handleLock = () => {
    setIsLocked(true);
  };

  const handleRefresh = () => {
    setFlippedCards({});
    setIsVerified(false);
    setIsLocked(false);
    localStorage.removeItem('romantic-countdown-state');
  };

  const levelData = [
    {
      level: 1,
      title: "Let's Start Our Day Together",
      cards: [
        "Cozy café with the best pancakes in town - where we can share stories over steaming coffee",
        "Rooftop restaurant with sunrise views - watching the world wake up together",
        "Local bakery with fresh croissants - picking out pastries and planning our day",
        "Beachside breakfast spot - listening to waves while enjoying fresh fruit and toast"
      ]
    },
    {
      level: 2,
      title: "Adventures Awaiting Us",
      cards: [
        "Long bike ride through scenic trails - feeling the wind in our hair and freedom in our hearts",
        "Restaurant near the dam / lake - dining with a view of sparkling water and sunset reflections",
        "Movie date - 2nd position on BookMyShow English horror list (prepare for some hand-holding!)",
        "Roaming around the gaming zone – chasing scores, laughs, and power-ups together."
      ]
    },
    {
      level: 3,
      title: "Gifts from My Heart to Yours",
      cards: [
        "Beautiful makeup kit - because you're already stunning but deserve to feel pampered",
        "A gorgeous dress that matches your radiant personality - for special moments together",
        "Handcrafted art piece - either a drawing of us or romantic shayaris written just for you",
        "A special dance performance - choreographed with love just to see you smile"
      ]
    },
    {
      level: 4,
      title: "Dares I'll Complete for You",
      cards: [
        "Serenade you in public with your favorite song - no matter how embarrassed I get!",
        "Cook an entire romantic dinner from scratch - even if I burn it the first time",
        "Write and recite an original poem about our love story in front of your friends",
        "Learn your favorite dance and perform it perfectly - practice until I get every step right"
      ]
    }
  ];

  if (!isVerified) {
    return <NameVerification onVerified={handleVerification} isLocked={isLocked} />;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <CountdownHeader />
        
        {/* Control buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={handleLock}
            disabled={isLocked}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Lock className="w-4 h-4 mr-2" />
            {isLocked ? 'Locked' : 'Lock Progress'}
          </Button>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-primary/30 hover:bg-primary/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <div className="space-y-16">
          {levelData.map((data) => (
            <LevelSection
              key={data.level}
              level={data.level}
              title={data.title}
              cards={data.cards}
              onCardFlip={handleCardFlip}
              selectedCard={flippedCards[data.level]}
            />
          ))}
        </div>
        
        <AdminPanel flippedCards={flippedCards} />
      </div>
    </div>
  );
};

export default Index;
