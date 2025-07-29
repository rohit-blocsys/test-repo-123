import { useState, useEffect } from 'react';
import CountdownHeader from '@/components/CountdownHeader';
import LevelSection from '@/components/LevelSection';
import AdminPanel from '@/components/AdminPanel';
import NameVerification from '@/components/NameVerification';
import DataReveal from '@/components/DataReveal';
import { Button } from '@/components/ui/button';
import { Lock, RotateCcw } from 'lucide-react';
import { api } from '@/lib/api';

const Index = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, number>>({});
  const [isVerified, setIsVerified] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string>('');

  // Load state from database on component mount
  useEffect(() => {
    if (currentUser) {
      const loadUserData = async () => {
        try {
          setIsLoading(true);
          const userData = await api.getUserData(currentUser);
          setFlippedCards(userData.flippedCards || {});
          setIsLocked(userData.isLocked || false);
          setIsVerified(userData.isVerified || false);
        } catch (error) {
          console.error('Error loading user data:', error);
          // Fallback to localStorage if database is not available
          const savedState = localStorage.getItem(`romantic-countdown-state-${currentUser}`);
          if (savedState) {
            const { flippedCards: saved, isLocked: savedLocked } = JSON.parse(savedState);
            setFlippedCards(saved || {});
            setIsLocked(savedLocked || false);
          }
        } finally {
          setIsLoading(false);
        }
      };

      loadUserData();
    } else {
      // If no current user, stop loading and show name verification
      setIsLoading(false);
    }
  }, [currentUser]);

  // Save state to database whenever it changes
  useEffect(() => {
    if (!isLoading && currentUser) {
      const saveUserData = async () => {
        try {
          await api.saveUserData({
            name: currentUser,
            flippedCards,
            isLocked,
            isVerified
          });
        } catch (error) {
          console.error('Error saving user data:', error);
          // Fallback to localStorage if database is not available
          const state = { flippedCards, isLocked };
          localStorage.setItem(`romantic-countdown-state-${currentUser}`, JSON.stringify(state));
        }
      };

      saveUserData();
    }
  }, [flippedCards, isLocked, isVerified, isLoading, currentUser]);

  const handleCardFlip = (level: number, card: number) => {
    // Only allow one card per level
    setFlippedCards(prev => ({
      ...prev,
      [level]: card
    }));
  };

  const handleVerification = (userName: string) => {
    setCurrentUser(userName);
    setIsVerified(true);
  };

  const handleLock = () => {
    setIsLocked(true);
  };

  const handleRefresh = async () => {
    try {
      await api.resetUserData(currentUser);
      setFlippedCards({});
      setIsVerified(false);
      setIsLocked(false);
      localStorage.removeItem(`romantic-countdown-state-${currentUser}`);
    } catch (error) {
      console.error('Error resetting data:', error);
      // Fallback to local reset
      setFlippedCards({});
      setIsVerified(false);
      setIsLocked(false);
      localStorage.removeItem(`romantic-countdown-state-${currentUser}`);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your romantic journey...</p>
        </div>
      </div>
    );
  }

  // Check if countdown has ended (1 minute from now for testing)
  const isCountdownEnded = new Date() >= new Date(Date.now() + 60000);

  if (!isVerified || !currentUser) {
    return <NameVerification onVerified={handleVerification} isLocked={isLocked} />;
  }

  // Show data reveal after countdown ends
  if (isCountdownEnded) {
    return <DataReveal flippedCards={flippedCards} currentUser={currentUser} />;
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
            disabled={isLocked}
            variant="outline"
            className="border-primary/30 hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
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
