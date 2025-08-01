import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TimerProps {
  lockedAt: Date;
  onTimeUp: () => void;
}

const Timer = ({ lockedAt, onTimeUp }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 1, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetTime = new Date(lockedAt.getTime() + 60 * 1000).getTime(); // 1 minute for testing
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        
        // Trigger celebration confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        // Additional burst of confetti
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 250);
        
        onTimeUp();
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [lockedAt, onTimeUp]);

  return (
    <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-primary/20 p-4 z-50">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-primary">Time Remaining</span>
      </div>
      <div className="text-2xl font-bold text-primary">
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

export default Timer; 