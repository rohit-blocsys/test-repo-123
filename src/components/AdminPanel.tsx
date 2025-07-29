import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, EyeOff, Lock, Users, User } from 'lucide-react';
import { api, UserData } from '@/lib/api';

interface AdminPanelProps {
  flippedCards: Record<string, number>;
}

const AdminPanel = ({ flippedCards }: AdminPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const correctPasscode = 'DiyuuuRohuuu';

  const handleAuth = async () => {
    if (passcode === correctPasscode) {
      setIsAuthenticated(true);
      // Load all users data when authenticated
      try {
        setIsLoadingUsers(true);
        const users = await api.getAllUsersData();
        setAllUsers(users);
      } catch (error) {
        console.error('Error loading all users data:', error);
      } finally {
        setIsLoadingUsers(false);
      }
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
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  All Users' Progress Through the Countdown! 💕
                </p>
              </div>
            </div>
            
            {isLoadingUsers ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading all users data...</p>
              </div>
            ) : allUsers.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {allUsers.map((user) => (
                  <Card key={user.name} className="bg-gradient-card border-primary/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-primary flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {user.name}
                        <span className="text-sm text-muted-foreground">
                          ({new Date(user.updatedAt || user.createdAt || '').toLocaleDateString()})
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {[1, 2, 3, 4].map(level => {
                          const selectedCard = user.flippedCards[level];
                          return (
                            <div key={level} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                              <span className="text-sm">
                                Level {level}: {levelTitles[level as keyof typeof levelTitles]}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {selectedCard ? `Card ${selectedCard}` : 'Not selected'}
                                </span>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4].map(cardNum => (
                                    <div
                                      key={cardNum}
                                      className={`w-3 h-3 rounded-full border ${
                                        selectedCard === cardNum
                                          ? 'bg-primary border-primary'
                                          : 'border-muted-foreground/30'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 pt-3 border-t border-primary/10">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`px-2 py-1 rounded ${user.isLocked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {user.isLocked ? 'Locked' : 'Active'}
                          </span>
                          <span className={`px-2 py-1 rounded ${user.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.isVerified ? 'Verified' : 'Not Verified'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users have used the app yet</p>
              </div>
            )}
            
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