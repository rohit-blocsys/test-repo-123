import { useState, useEffect } from 'react';
import { Heart, Calendar } from 'lucide-react';

const CountdownHeader = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // For testing: Set timer to 1 minute from now
    const targetDate = new Date(Date.now() + 60000); // 1 minute from now
    // const targetDate = new Date('2025-08-02T00:00:00'); // Original date
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const isRevealed = new Date() >= new Date(Date.now() + 60000);
  // const isRevealed = new Date() >= new Date('2025-08-02T00:00:00'); // Original

  return (
    <div className="text-center mb-12">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4 animate-float">
          Never Ending Life Journey
        </h1>
        <div className="flex items-center justify-center gap-2 mb-6">
          <Heart className="w-8 h-8 text-accent animate-heart-beat" />
          <p className="text-xl text-muted-foreground font-medium">
            6 Months of Beautiful Memories
          </p>
          <Heart className="w-8 h-8 text-accent animate-heart-beat" />
        </div>
      </div>

      {!isRevealed ? (
        <div className="bg-gradient-card border border-primary/20 rounded-2xl p-8 shadow-romantic max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-primary">Countdown to Reveal</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Our special day is on August 2nd, 2025! ✨
          </p>
          
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <div className="bg-gradient-love text-primary-foreground rounded-xl p-4 mb-2">
                  <div className="text-2xl md:text-3xl font-bold">{value}</div>
                </div>
                <div className="text-sm text-muted-foreground capitalize font-medium">
                  {unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-love text-primary-foreground rounded-2xl p-8 shadow-romantic max-w-2xl mx-auto animate-glow">
          <h2 className="text-3xl font-bold mb-4">🎉 The Day Has Arrived! 🎉</h2>
          <p className="text-lg">
            Now you can see all the beautiful surprises I've planned for you! 💕
          </p>
        </div>
      )}
    </div>
  );
};

export default CountdownHeader;