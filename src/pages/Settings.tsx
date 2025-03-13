
import { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import SocialAccountManager from '@/components/SocialAccountManager';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, UserCircle, Link2, Bell, ShieldAlert } from 'lucide-react';

const Settings = () => {
  const { user, profile } = useAuth();
  
  useEffect(() => {
    // Smooth scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <NavBar />
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-32">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your accounts and preferences</p>
        </div>
        
        <Tabs defaultValue="accounts" className="w-full">
          <TabsList className="grid grid-cols-4 max-w-md mb-8">
            <TabsTrigger value="accounts" className="flex items-center">
              <Link2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Accounts</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center">
              <UserCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <ShieldAlert className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="glass-panel">
            <TabsContent value="accounts" className="p-6">
              <SocialAccountManager />
            </TabsContent>
            
            <TabsContent value="profile" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <UserCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Profile Settings</h3>
                </div>
                
                <div className="max-w-md space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Username</label>
                    <input
                      type="text"
                      defaultValue={profile?.username || ''}
                      className="glass-input w-full"
                      placeholder="Enter your username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      className="glass-input w-full"
                      placeholder="Enter your email"
                      disabled
                    />
                  </div>
                  
                  <button className="glass-button bg-primary/10 text-primary hover:bg-primary/20">
                    Save Changes
                  </button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive email updates</p>
                    </div>
                    <div className="h-6 w-12 relative rounded-full bg-muted">
                      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-muted-foreground"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="font-medium">Post Reminders</h4>
                      <p className="text-sm text-muted-foreground">Get reminders about scheduled posts</p>
                    </div>
                    <div className="h-6 w-12 relative rounded-full bg-primary/20">
                      <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-primary"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="font-medium">Analytics Updates</h4>
                      <p className="text-sm text-muted-foreground">Weekly performance reports</p>
                    </div>
                    <div className="h-6 w-12 relative rounded-full bg-primary/20">
                      <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-primary"></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Security Settings</h3>
                </div>
                
                <div className="max-w-md space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Current Password</label>
                    <input
                      type="password"
                      className="glass-input w-full"
                      placeholder="Enter your current password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">New Password</label>
                    <input
                      type="password"
                      className="glass-input w-full"
                      placeholder="Enter your new password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Confirm New Password</label>
                    <input
                      type="password"
                      className="glass-input w-full"
                      placeholder="Confirm your new password"
                    />
                  </div>
                  
                  <button className="glass-button bg-primary/10 text-primary hover:bg-primary/20">
                    Update Password
                  </button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
