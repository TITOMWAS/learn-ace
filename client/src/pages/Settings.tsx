import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { UserProfile } from '@/components/UserProfile';
import { getUser, saveUser, logoutUser } from '@/utils/localStorage';
import { useLocation } from 'wouter';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Palette, 
  Bell, 
  Download,
  ArrowLeft,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [darkMode, setDarkMode] = useState(() => 
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [notifications, setNotifications] = useState(() => 
    localStorage.getItem('notifications') !== 'false'
  );
  const [emailUpdates, setEmailUpdates] = useState(() => 
    localStorage.getItem('emailUpdates') === 'true'
  );
  const [autoAnalysis, setAutoAnalysis] = useState(() => 
    localStorage.getItem('autoAnalysis') !== 'false'
  );
  const { toast } = useToast();

  useEffect(() => {
    const userData = getUser();
    if (!userData || !userData.isLoggedIn) {
      setLocation('/');
      return;
    }
    setUser(userData.username);
  }, [setLocation]);

  useEffect(() => {
    // Apply theme
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "All fields required",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you'd validate the current password and update in backend
    toast({
      title: "Password updated",
      description: "Your password has been successfully changed.",
    });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleNotificationToggle = (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem('notifications', enabled.toString());
    toast({
      title: enabled ? "Notifications enabled" : "Notifications disabled",
      description: enabled ? "You'll receive study reminders." : "Notifications turned off.",
    });
  };

  const handleEmailUpdatesToggle = (enabled: boolean) => {
    setEmailUpdates(enabled);
    localStorage.setItem('emailUpdates', enabled.toString());
  };

  const handleAutoAnalysisToggle = (enabled: boolean) => {
    setAutoAnalysis(enabled);
    localStorage.setItem('autoAnalysis', enabled.toString());
  };

  const exportData = () => {
    const userData = {
      username: user,
      quizEntries: JSON.parse(localStorage.getItem('quizEntries') || '[]'),
      settings: {
        theme: darkMode ? 'dark' : 'light',
        notifications,
        emailUpdates,
        autoAnalysis
      }
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `learn-ace-data-${user}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Your learning data has been downloaded.",
    });
  };

  const deleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      localStorage.clear();
      toast({
        title: "Account deleted",
        description: "Your account and all data have been removed.",
        variant: "destructive",
      });
      setLocation('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="bg-card shadow-gentle border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/dashboard')}
              className="flex items-center gap-2"
              data-testid="button-back-dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your profile picture and personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <UserProfile username={user} />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Click your avatar to change profile picture</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF (max 2MB)</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={user}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="bg-muted"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">Email management coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      data-testid="input-current-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      data-testid="input-new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      data-testid="input-confirm-password"
                    />
                  </div>
                  <Button onClick={handlePasswordChange} data-testid="button-change-password">
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible actions that affect your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. All your data will be permanently removed.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={deleteAccount}
                      data-testid="button-delete-account"
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>
                  Customize how Learn Ace looks on your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <Switch
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                      data-testid="switch-dark-mode"
                    />
                    <Moon className="h-4 w-4" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <Label className="text-base font-medium">Theme Preview</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-background">
                      <div className="space-y-2">
                        <div className="h-2 bg-primary rounded w-3/4"></div>
                        <div className="h-2 bg-muted rounded w-1/2"></div>
                        <div className="h-2 bg-muted rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-card">
                      <div className="space-y-2">
                        <div className="h-2 bg-primary rounded w-3/4"></div>
                        <div className="h-2 bg-muted rounded w-1/2"></div>
                        <div className="h-2 bg-muted rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Study Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about your study goals and progress
                      </p>
                    </div>
                    <Switch
                      checked={notifications}
                      onCheckedChange={handleNotificationToggle}
                      data-testid="switch-notifications"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly progress reports via email
                      </p>
                    </div>
                    <Switch
                      checked={emailUpdates}
                      onCheckedChange={handleEmailUpdatesToggle}
                      data-testid="switch-email-updates"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Preferences</CardTitle>
                  <CardDescription>
                    Customize your learning experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto-Analysis</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically analyze exam papers when uploaded
                      </p>
                    </div>
                    <Switch
                      checked={autoAnalysis}
                      onCheckedChange={handleAutoAnalysisToggle}
                      data-testid="switch-auto-analysis"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>
                    Export or manage your learning data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={exportData}
                    variant="outline"
                    className="flex items-center gap-2"
                    data-testid="button-export-data"
                  >
                    <Download className="w-4 h-4" />
                    Export My Data
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Download all your quiz data and settings as a JSON file
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;