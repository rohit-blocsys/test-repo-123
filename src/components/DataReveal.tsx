import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Calendar, Clock, User } from 'lucide-react';
import { api, UserData } from '@/lib/api';

interface DataRevealProps {
  flippedCards: Record<string, number>;
  selectedStatements: Record<string, string>;
  currentUser: string;
}

const DataReveal = ({ flippedCards, selectedStatements, currentUser }: DataRevealProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const data = await api.getUserData(currentUser);
        setUserData(data);
      } catch (error) {
        console.error('Error loading user data for reveal:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [currentUser]);

  const levelTitles = {
    1: 'Breakfast Places',
    2: 'Adventures Together', 
    3: 'Gifts for You',
    4: 'Dares for Me'
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
          <p className="text-muted-foreground">Loading your choices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-12 h-12 text-primary animate-heart-beat" />
            <h1 className="text-5xl md:text-6xl font-bold text-primary">
              Your Choices Revealed! 💕
            </h1>
            <Heart className="w-12 h-12 text-primary animate-heart-beat" />
          </div>
          <p className="text-xl text-muted-foreground mb-4">
            Here are all the romantic choices you made during our countdown journey
          </p>
          {userData && (
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{userData.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Completed on: {new Date(userData.updatedAt || userData.createdAt || '').toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Choices Display */}
        <div className="space-y-8">
          {levelData.map((data) => {
            const selectedCard = flippedCards[data.level];
            const selectedContent = selectedStatements[data.level] || (selectedCard ? data.cards[selectedCard - 1] : null);

            return (
              <Card key={data.level} className="bg-gradient-card border-primary/20 shadow-romantic">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary flex items-center gap-3">
                    <span className="text-3xl">
                      {data.level === 1 ? '🍳' : data.level === 2 ? '🚴‍♀️' : data.level === 3 ? '🎁' : '💫'}
                    </span>
                    Level {data.level}: {levelTitles[data.level as keyof typeof levelTitles]}
                  </CardTitle>
                  <p className="text-muted-foreground">{data.title}</p>
                </CardHeader>
                <CardContent>
                  {selectedContent ? (
                    <div className="space-y-4">
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                        <h3 className="font-semibold text-primary mb-2">Your Choice:</h3>
                        <p className="text-foreground leading-relaxed">{selectedContent}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {data.cards.map((card, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border text-sm ${
                              index + 1 === selectedCard
                                ? 'bg-primary/20 border-primary text-primary font-medium'
                                : 'bg-muted/50 border-muted-foreground/20 text-muted-foreground'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">Card {index + 1}</span>
                              {index + 1 === selectedCard && (
                                <Heart className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <p className="text-xs leading-relaxed">{card}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No choice was made for this level</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-primary/20">
          <p className="text-muted-foreground">
            Thank you for being part of this beautiful journey! 💖
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Every choice you made brought us closer together
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataReveal; 