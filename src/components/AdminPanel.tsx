import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface AdminPanelProps {
  flippedCards: Record<string, number>;
}

const AdminPanel = ({ flippedCards }: AdminPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);

  const correctPasscode = 'DiyuuuRohuuu';

  const handleAuth = () => {
    if (passcode === correctPasscode) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect passcode!');
    }
  };

  const levelTitles = {
    1: 'Breakfast Places',
    2: 'Adventures Together',
    3: 'Gifts for You',
    4: 'Dares for Me'
  };

  const getSelectedCard = (level: number) => {
    return flippedCards[level] || null;
  };

  const resetAuth = () => {
    setIsAuthenticated(false);
    setPasscode('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed bottom-6 right-6 bg-gradient-love border-primary/30 text-primary-foreground hover:shadow-romantic"
        >
          <Lock className="w-4 h-4 mr-2" />
          Answers
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-primary flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Admin Panel
          </DialogTitle>
        </DialogHeader>
        
        {!isAuthenticated ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Enter Passcode</label>
              <div className="relative">
                <Input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  className="pr-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-7 w-7 p-0"
                  onClick={() => setShowPasscode(!showPasscode)}
                >
                  {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button onClick={handleAuth} className="w-full bg-gradient-love">
              Unlock
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Here's your fiancé's progress through the countdown! 💕
              </p>
            </div>
            
            <div className="grid gap-4">
              {[1, 2, 3, 4].map(level => (
                <Card key={level} className="bg-gradient-card border-primary/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-primary">
                      Level {level}: {levelTitles[level as keyof typeof levelTitles]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {getSelectedCard(level) ? `Card ${getSelectedCard(level)} selected` : 'No card selected yet'}
                      </span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map(cardNum => (
                          <div
                            key={cardNum}
                            className={`w-4 h-4 rounded-full border-2 ${
                              getSelectedCard(level) === cardNum
                                ? 'bg-primary border-primary'
                                : 'border-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button onClick={resetAuth} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;