import { useState, useEffect } from 'react';
import CountdownHeader from '@/components/CountdownHeader';
import LevelSection from '@/components/LevelSection';
import AdminPanel from '@/components/AdminPanel';
import NameVerification from '@/components/NameVerification';
import DataReveal from '@/components/DataReveal';
import Timer from '@/components/Timer';
import { Button } from '@/components/ui/button';
import { Lock, RotateCcw } from 'lucide-react';
import { api } from '@/lib/api';

const Index = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, number>>({});
  const [selectedStatements, setSelectedStatements] = useState<Record<string, string>>({});
  const [isVerified, setIsVerified] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [hasSeenResults, setHasSeenResults] = useState(false);
  const [lockedAt, setLockedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Load state from database on component mount
  useEffect(() => {
    if (currentUser) {
      const loadUserData = async () => {
        try {
          setIsLoading(true);
          console.log('🔄 Loading user data for:', currentUser);
          const userData = await api.getUserData(currentUser);
          console.log('📊 User data loaded:', userData);
          setFlippedCards(userData.flippedCards || {});
          setSelectedStatements(userData.selectedStatements || {});
          setIsLocked(userData.isLocked || false);
          setHasSeenResults(userData.hasSeenResults || false);
          setLockedAt(userData.lockedAt ? new Date(userData.lockedAt) : null);
          setShowConfetti(false); // Don't show confetti when loading existing data
          // Only set isVerified from database if it's true, don't override if user just verified
          if (userData.isVerified) {
            console.log('✅ Setting isVerified to true from database');
            setIsVerified(true);
          }
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
            selectedStatements,
            isLocked,
            isVerified,
            hasSeenResults
          });
        } catch (error) {
          console.error('Error saving user data:', error);
          // Fallback to localStorage if database is not available
          const state = { flippedCards, selectedStatements, isLocked, hasSeenResults };
          localStorage.setItem(`romantic-countdown-state-${currentUser}`, JSON.stringify(state));
        }
      };

      saveUserData();
    }
  }, [flippedCards, selectedStatements, isLocked, isVerified, hasSeenResults, isLoading, currentUser]);

  const handleCardFlip = (level: number, card: number, statement: string) => {
    // Only allow one card per level
    setFlippedCards(prev => ({
      ...prev,
      [level]: card
    }));
    
    // Store the selected statement
    setSelectedStatements(prev => ({
      ...prev,
      [level]: statement
    }));
  };

  const handleVerification = (userName: string) => {
    console.log('🔐 User verified:', userName);
    setCurrentUser(userName);
    setIsVerified(true);
    setIsLoading(false); // Ensure loading stops immediately
    setShowConfetti(false); // Reset confetti state for new session
  };

  const handleLock = () => {
    const now = new Date();
    setIsLocked(true);
    setLockedAt(now);
    console.log('🔒 User locked their choices at:', now);
  };

  const handleTimeUp = () => {
    console.log('⏰ 1 minute timer ended, user can now see results');
    setHasSeenResults(true);
    setShowConfetti(true); // Trigger confetti when timer ends
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

  // Check if countdown has ended (August 2nd, 2025)
  const isCountdownEnded = new Date() >= new Date('2025-08-02T00:00:00Z');
  
  // Check if 1 minute has passed since locking (for testing)
  const isOneHourPassed = lockedAt && new Date() >= new Date(lockedAt.getTime() + 60 * 1000);
  
  // Check if user has made choices for all 4 levels
  const hasMadeAllChoices = Object.keys(flippedCards).length === 4;
  
  // Check if user should see results (only if they've made ALL choices AND either countdown ended, 1 minute passed, or they've already seen results AND choices are locked)
  const shouldShowResults = hasMadeAllChoices && isLocked && (isCountdownEnded || isOneHourPassed || (hasSeenResults && isOneHourPassed));
  
  // Additional safety check: never show results if not all choices are made
  if (!hasMadeAllChoices) {
    console.log('🛡️ Safety check: Not showing results because not all choices are made');
  }

  console.log('🔍 Render state:', { 
    currentUser, 
    isVerified, 
    isLoading, 
    isLocked, 
    lockedAt, 
    isOneHourPassed, 
    hasSeenResults, 
    hasMadeAllChoices, 
    shouldShowResults,
    flippedCards: Object.keys(flippedCards),
    flippedCardsLength: Object.keys(flippedCards).length
  });
  
  if (!isVerified || !currentUser) {
    console.log('📝 Showing name verification form');
    return <NameVerification onVerified={handleVerification} isLocked={isLocked} />;
  }

  // Show data reveal after countdown ends or 1 hour passed
  if (shouldShowResults && hasMadeAllChoices && Object.keys(flippedCards).length === 4) {
    console.log('🚨 SHOWING RESULTS - Debug info:', {
      hasMadeAllChoices,
      isCountdownEnded,
      isOneHourPassed,
      hasSeenResults,
      isLocked,
      flippedCards: Object.keys(flippedCards),
      flippedCardsLength: Object.keys(flippedCards).length
    });
    return <DataReveal flippedCards={flippedCards} selectedStatements={selectedStatements} currentUser={currentUser} showConfetti={showConfetti} />;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <CountdownHeader />
        
        {/* Show timer if locked */}
        {isLocked && lockedAt && !isOneHourPassed && (
          <Timer lockedAt={lockedAt} onTimeUp={handleTimeUp} />
        )}
        
        {/* Control buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={handleLock}
            disabled={isLocked || !hasMadeAllChoices}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Lock className="w-4 h-4 mr-2" />
            {isLocked ? 'Locked' : hasMadeAllChoices ? 'Lock Progress' : `Select ${4 - Object.keys(flippedCards).length} more choices`}
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
        
        <AdminPanel flippedCards={flippedCards} selectedStatements={selectedStatements} />
      </div>
    </div>
  );
};

export default Index;
