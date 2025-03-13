
import { useState, useEffect } from 'react';
import { 
  Instagram, Youtube, Facebook, Linkedin, 
  Plus, Trash2, Link as LinkIcon
} from 'lucide-react';
import { TikTokIcon } from './icons/TikTokIcon';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { getUserSocialAccounts, addSocialAccount } from '@/services/videoService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SocialAccount {
  id: string;
  platform: 'instagram' | 'youtube' | 'facebook' | 'linkedin' | 'tiktok';
  account_name: string;
  platform_user_id?: string;
  access_token?: string;
}

const SocialAccountManager = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountPlatform, setNewAccountPlatform] = useState<SocialAccount['platform']>('instagram');
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Map of platform names to icons
  const platformIcons: Record<string, React.ElementType> = {
    instagram: Instagram,
    youtube: Youtube,
    tiktok: TikTokIcon,
    facebook: Facebook,
    linkedin: Linkedin,
  };

  // Map of platform names to colors
  const platformColors: Record<string, string> = {
    instagram: 'text-pink-500 bg-pink-500/10',
    youtube: 'text-red-600 bg-red-600/10',
    tiktok: 'text-gray-900 dark:text-white bg-gray-900/10 dark:bg-white/10',
    facebook: 'text-blue-600 bg-blue-600/10',
    linkedin: 'text-blue-700 bg-blue-700/10',
  };

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const accountsData = await getUserSocialAccounts(user.id);
      // Convert to the expected SocialAccount type
      setAccounts(accountsData.map((account: any) => ({
        id: account.id,
        platform: account.platform as SocialAccount['platform'],
        account_name: account.account_name,
        platform_user_id: account.platform_user_id,
        access_token: account.access_token
      })));
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        variant: 'destructive',
        title: 'Error fetching accounts',
        description: 'Could not load your social media accounts.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async () => {
    if (!user) return;
    
    if (!newAccountName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Account name required',
        description: 'Please enter a name for this account.',
      });
      return;
    }
    
    setIsAddingAccount(true);
    
    try {
      // In a real app, this would involve OAuth flows and getting tokens
      // For this demo, we'll just add the account with manual info
      await addSocialAccount({
        userId: user.id,
        platform: newAccountPlatform,
        accountName: newAccountName,
        // These fields would come from OAuth process
        accessToken: `demo-token-${Date.now()}`,
        platformUserId: `user-${Date.now()}`
      });
      
      toast({
        title: 'Account added',
        description: `Your ${newAccountPlatform} account has been added successfully.`,
      });
      
      // Refresh accounts list
      fetchAccounts();
      
      // Reset form
      setNewAccountName('');
      setNewAccountPlatform('instagram');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding account:', error);
    } finally {
      setIsAddingAccount(false);
    }
  };

  const handleDeleteAccount = async (accountId: string, platform: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', accountId);
        
      if (error) throw error;
      
      toast({
        title: 'Account removed',
        description: `Your ${platform} account has been removed.`,
      });
      
      // Update local state to remove the account
      setAccounts(accounts.filter(account => account.id !== accountId));
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        variant: 'destructive',
        title: 'Error removing account',
        description: 'Could not remove the social media account.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Connected Social Accounts</h3>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glass-button bg-primary/10 text-primary hover:bg-primary/20">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Social Media Account</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="manual" className="mt-4">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="manual">Manual Setup</TabsTrigger>
                <TabsTrigger value="oauth" disabled>OAuth Setup</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  This is a demo mode. In a real application, you would connect via OAuth to securely access your social media accounts.
                </p>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Platform</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(platformIcons).map((platform) => {
                      const Icon = platformIcons[platform];
                      const isSelected = newAccountPlatform === platform;
                      
                      return (
                        <button
                          key={platform}
                          onClick={() => setNewAccountPlatform(platform as SocialAccount['platform'])}
                          className={cn(
                            "p-2 rounded-full transition-all duration-200",
                            isSelected
                              ? platformColors[platform]
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Account Name</label>
                  <Input
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    placeholder="Enter account name"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddAccount}
                    disabled={isAddingAccount || !newAccountName.trim()}
                  >
                    {isAddingAccount ? 'Adding...' : 'Add Account'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="oauth" className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  In a real application, you would be redirected to the platform to authenticate and grant permissions.
                </p>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="glass-panel p-8 flex justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : accounts.length === 0 ? (
        <div className="glass-panel p-8 text-center">
          <p className="text-muted-foreground mb-4">You don't have any connected social media accounts yet.</p>
          <Button 
            className="glass-button bg-primary/10 text-primary hover:bg-primary/20"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Account
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => {
            const Icon = platformIcons[account.platform];
            
            return (
              <div key={account.id} className="glass-panel p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={cn("p-2 rounded-full mr-3", platformColors[account.platform])}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{account.account_name}</h4>
                    <p className="text-xs text-muted-foreground capitalize">{account.platform}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                    title="Copy API keys"
                  >
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  </button>
                  
                  <button 
                    onClick={() => handleDeleteAccount(account.id, account.platform)}
                    className="p-2 hover:bg-red-500/10 rounded-full transition-colors"
                    title="Remove account"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-6 text-sm text-muted-foreground bg-amber-500/10 p-4 rounded-lg">
        <p className="flex items-center">
          <LinkIcon className="h-4 w-4 mr-2 text-amber-500" />
          <span>
            <strong>Note:</strong> In a production environment, you would need to register your app with each social media platform's developer program and implement proper OAuth flows.
          </span>
        </p>
      </div>
    </div>
  );
};

export default SocialAccountManager;
