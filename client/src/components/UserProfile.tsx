import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, User } from 'lucide-react';

interface UserProfileProps {
  username: string;
  className?: string;
}

export const UserProfile = ({ username, className = '' }: UserProfileProps) => {
  const [profileImage, setProfileImage] = useState<string | null>(
    localStorage.getItem(`profile_${username}`) || null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setProfileImage(imageUrl);
        localStorage.setItem(`profile_${username}`, imageUrl);
        setIsDialogOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    localStorage.removeItem(`profile_${username}`);
    setIsDialogOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="relative group cursor-pointer">
            <Avatar className="h-10 w-10 border-2 border-primary/20 transition-all duration-300 group-hover:border-primary group-hover:scale-105">
              <AvatarImage src={profileImage || undefined} alt={username} />
              <AvatarFallback className="bg-gradient-primary text-white font-medium">
                {getInitials(username)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </div>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md" aria-describedby="profile-dialog-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Picture
            </DialogTitle>
          </DialogHeader>
          <div id="profile-dialog-description" className="sr-only">
            Upload or change your profile picture
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={profileImage || undefined} alt={username} />
                <AvatarFallback className="bg-gradient-primary text-white text-xl font-medium">
                  {getInitials(username)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-3">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary-hover"
                data-testid="input-profile-image"
              />
              
              {profileImage && (
                <Button
                  variant="outline"
                  onClick={removeImage}
                  className="w-full"
                  data-testid="button-remove-profile"
                >
                  Remove Picture
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{username}</span>
        <span className="text-xs text-muted-foreground">Student</span>
      </div>
    </div>
  );
};