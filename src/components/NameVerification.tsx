import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Lock } from 'lucide-react';

interface NameVerificationProps {
  onVerified: () => void;
  isLocked: boolean;
}

const NameVerification = ({ onVerified, isLocked }: NameVerificationProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.toLowerCase() === 'divu') {
      onVerified();
      setError('');
    } else {
      setError('Hmm, that\'s not the right name. Try again! 💕');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-gradient-card border-primary/20 shadow-romantic">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-accent animate-heart-beat" />
            {isLocked && <Lock className="w-6 h-6 text-primary" />}
          </div>
          <CardTitle className="text-2xl text-primary">
            {isLocked ? 'Welcome Back!' : 'Who\'s There?'}
          </CardTitle>
          <p className="text-muted-foreground">
            {isLocked 
              ? 'Enter your name to continue your journey 💖' 
              : 'Enter your name to start this romantic adventure 💕'
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center border-primary/30 focus:border-primary"
            />
            {error && (
              <p className="text-sm text-destructive text-center animate-fade-in">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
              {isLocked ? 'Continue Journey' : 'Start Adventure'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NameVerification;