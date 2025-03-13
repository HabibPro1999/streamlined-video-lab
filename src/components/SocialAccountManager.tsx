
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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface SocialAccount {
  id: string;
  platform: 'instagram' | 'youtube' | 'facebook' | 'linkedin' | 'tiktok';
  account_name: string;
  platform_user_id?: string;
  access_token?: string;
}

type PlatformData = {
  name: string;
  oauthEndpoint: string;
  color: string;
  icon: React.ElementType;
  scope: string;
  clientId?: string;
};

const SocialAccountManager = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountPlatform, setNewAccountPlatform] = useState<SocialAccount['platform']>('instagram');
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Map of platform data with OAuth endpoints
  const platformData: Record<string, PlatformData> = {
    instagram: {
      name: 'Instagram',
      oauthEndpoint: 'https://api.instagram.com/oauth/authorize',
      color: 'text-pink-500 bg-pink-500/10',
      icon: Instagram,
      scope: 'user_profile,user_media',
      clientId: '123456789', // Replace with actual client ID
    },
    youtube: {
      name: 'YouTube',
      oauthEndpoint: 'https://accounts.google.com/o/oauth2/auth',
      color: 'text-red-600 bg-red-600/10',
      icon: Youtube,
      scope: 'https://www.googleapis.com/auth/youtube',
      clientId: '123456789', // Replace with actual client ID
    },
    tiktok: {
      name: 'TikTok',
      oauthEndpoint: 'https://www.tiktok.com/auth/authorize/',
      color: 'text-gray-900 dark:text-white bg-gray-900/10 dark:bg-white/10',
      icon: TikTokIcon,
      scope: 'user.info.basic,video.upload',
      clientId: '123456789', // Replace with actual client ID
    },
    facebook: {
      name: 'Facebook',
      oauthEndpoint: 'https://www.facebook.com/v16.0/dialog/oauth',
      color: 'text-blue-600 bg-blue-600/10',
      icon: Facebook,
      scope: 'pages_show_list,pages_read_engagement,pages_manage_posts',
      clientId: '123456789', // Replace with actual client ID
    },
    linkedin: {
      name: 'LinkedIn',
      oauthEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
      color: 'text-blue-700 bg-blue-700/10',
      icon: Linkedin,
      scope: 'r_liteprofile,w_member_social',
      clientId: '123456789', // Replace with actual client ID
    },
  };

  // Create a constant with the platform icons
  const platformIcons = Object.fromEntries(
    Object.entries(platformData).map(([key, data]) => [key, data.icon])
  );

  // Create a constant with the platform colors
  const platformColors = Object.fromEntries(
    Object.entries(platformData).map(([key, data]) => [key, data.color])
  );

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  useEffect(() => {
    // Handle OAuth redirect
    const handleOAuthRedirect = async () => {
      const params = new URLSearchParams(window.location.hash.substring(1) || window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Authentication failed',
          description: `There was an error authenticating: ${error}`,
        });
        return;
      }
      
      if (code && state && user) {
        const stateData = JSON.parse(atob(state));
        const { platform, redirectUri } = stateData;
        
        setIsAddingAccount(true);
        
        try {
          // In a real implementation, this would call the backend to exchange the code for tokens
          // For demo purposes, we'll simulate this
          const mockTokenResponse = {
            access_token: `mock-token-${Date.now()}`,
            refresh_token: `mock-refresh-${Date.now()}`,
            expires_in: 3600,
            platform_user_id: `user-${Date.now()}`,
            account_name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} User`,
          };
          
          await addSocialAccount({
            userId: user.id,
            platform: platform as SocialAccount['platform'],
            accountName: mockTokenResponse.account_name,
            accessToken: mockTokenResponse.access_token,
            refreshToken: mockTokenResponse.refresh_token,
            tokenExpiresAt: new Date(Date.now() + mockTokenResponse.expires_in * 1000),
            platformUserId: mockTokenResponse.platform_user_id,
          });
          
          toast({
            title: 'Account connected',
            description: `Your ${platform} account has been connected successfully.`,
          });
          
          // Remove the OAuth parameters from the URL
          window.history.replaceState({}, document.title, redirectUri);
          
          // Refresh the accounts list
          fetchAccounts();
        } catch (error) {
          console.error('Error exchanging OAuth code:', error);
          toast({
            variant: 'destructive',
            title: 'Authentication failed',
            description: 'There was an error connecting your social media account.',
          });
        } finally {
          setIsAddingAccount(false);
        }
      }
    };
    
    handleOAuthRedirect();
  }, [user]);

  const fetchAccounts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const accountsData = await getUserSocialAccounts(user.id);
      // Convert the platform string to our specific union type
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

  const handleOAuthLogin = (platform: SocialAccount['platform']) => {
    if (!user) return;
    
    // Prepare the redirect URI (current URL without any parameters)
    const redirectUri = window.location.origin + window.location.pathname;
    
    // Create a state parameter with the platform and redirect URI
    const state = btoa(JSON.stringify({ platform, redirectUri }));
    
    // Build the OAuth URL
    const platformInfo = platformData[platform];
    
    const oauthUrl = new URL(platformInfo.oauthEndpoint);
    oauthUrl.searchParams.append('client_id', platformInfo.clientId || '');
    oauthUrl.searchParams.append('redirect_uri', redirectUri);
    oauthUrl.searchParams.append('scope', platformInfo.scope);
    oauthUrl.searchParams.append('response_type', 'code');
    oauthUrl.searchParams.append('state', state);
    
    // Redirect to the OAuth URL
    window.location.href = oauthUrl.toString();
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
        refreshToken: `demo-refresh-${Date.now()}`,
        tokenExpiresAt: new Date(Date.now() + 3600 * 1000),
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
            
            <Tabs defaultValue="oauth" className="mt-4">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="oauth">OAuth Connect</TabsTrigger>
                <TabsTrigger value="manual">Manual Setup</TabsTrigger>
              </TabsList>
              
              <TabsContent value="oauth" className="mt-4 space-y-4">
                <Alert>
                  <AlertTitle>OAuth Integration</AlertTitle>
                  <AlertDescription>
                    Connect your social media accounts securely using OAuth. Click on a platform below to start the authorization process.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(platformData).map(([platform, data]) => {
                    const Icon = data.icon;
                    
                    return (
                      <Button
                        key={platform}
                        variant="outline"
                        className={cn("h-auto py-3 justify-start gap-3", data.color)}
                        onClick={() => handleOAuthLogin(platform as SocialAccount['platform'])}
                      >
                        <Icon className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                          <span>Connect {data.name}</span>
                          <span className="text-xs opacity-70">via OAuth</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="manual" className="mt-4 space-y-4">
                <Alert>
                  <AlertTitle>Demo Mode</AlertTitle>
                  <AlertDescription>
                    This is a demo mode. In a real application, you would connect via OAuth to securely access your social media accounts.
                  </AlertDescription>
                </Alert>
                
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
            <strong>Note:</strong> For full functionality, you would need to register your app with each social media platform's developer program and implement complete OAuth flows. 
            The following API keys are needed to make everything work:
            <ul className="mt-2 ml-6 list-disc">
              <li>OpenAI API key - for AI-powered content generation</li>
              <li>Instagram API credentials - for Instagram integration</li>
              <li>YouTube/Google API credentials - for YouTube integration</li>
              <li>TikTok API credentials - for TikTok integration</li>
              <li>Facebook API credentials - for Facebook integration</li>
              <li>LinkedIn API credentials - for LinkedIn integration</li>
            </ul>
          </span>
        </p>
      </div>
    </div>
  );
};

export default SocialAccountManager;
