
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UseFormReturn } from "react-hook-form";
import MainLayout from "@/components/layout/MainLayout";
import { UserSettings } from "@/types";
import { saveSettings, loadSettings } from "@/settings-utils";
import PixKeysManager from "@/components/settings/PixKeysManager";

interface SettingsFormValues {
  name: string;
  email: string;
  language: string;
  timezone: string;
  marketingEmails: boolean;
  securityEmails: boolean;
}

interface ProfileFormProps {
  form: UseFormReturn<SettingsFormValues>;
}

interface APIKeySettingsProps {
  apiKeys: { id: string; name: string; createdAt: string; lastUsed: string | null }[];
  onCreateKey: (name: string) => void;
  onDeleteKey: (id: string) => void;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  // Mock data for demonstration
  const [pixKeys, setPixKeys] = useState([
    {
      id: "1",
      key_type: "CPF",
      key: "123.456.789-00",
      owner_name: "John Doe",
      is_default: true,
      is_active: true,
      created_at: "2023-01-15T10:30:00Z",
      bank_name: "Nubank"
    },
    {
      id: "2",
      key_type: "EMAIL",
      key: "john@example.com",
      owner_name: "John Doe",
      is_default: false,
      is_active: true,
      created_at: "2023-02-20T15:45:00Z",
      bank_name: "Itaú"
    }
  ]);
  
  useEffect(() => {
    const loadUserSettings = async () => {
      setLoading(true);
      try {
        const userSettings = await loadSettings();
        setSettings(userSettings);
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserSettings();
  }, [toast]);
  
  const handleSaveSettings = async (updatedSettings: Partial<UserSettings>) => {
    setSaving(true);
    try {
      await saveSettings(updatedSettings);
      setSettings(prev => ({ ...prev, ...updatedSettings }));
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePixKey = (id: string) => {
    setPixKeys(keys => keys.filter(key => key.id !== id));
    toast({
      title: "Chave Pix removida",
      description: "A chave Pix foi removida com sucesso.",
    });
  };
  
  const handleSetDefaultPixKey = (id: string) => {
    setPixKeys(keys => keys.map(key => ({
      ...key,
      is_default: key.id === id
    })));
    toast({
      title: "Chave padrão atualizada",
      description: "A chave Pix padrão foi atualizada com sucesso.",
    });
  };
  
  const handleAddPixKey = (newKey: any) => {
    setPixKeys(keys => [...keys, {
      ...newKey,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    }]);
    toast({
      title: "Chave Pix adicionada",
      description: "A chave Pix foi adicionada com sucesso.",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <Tabs
              defaultValue={activeTab}
              className="w-full"
              orientation="vertical"
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full justify-start flex-col h-full bg-transparent p-0 flex">
                {["account", "appearance", "notifications", "display", "pix-keys"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="w-full justify-start px-4 py-2 text-left data-[state=active]:bg-muted"
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </aside>
          <div className="flex-1 lg:max-w-3xl">
            {activeTab === "account" && (
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>
                    Update your account settings. Set your preferred language and
                    timezone.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="User avatar"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <Button variant="outline" size="sm">
                          Change avatar
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          JPG, GIF or PNG. Max size 4MB.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        defaultValue={settings?.name || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        defaultValue={settings?.email || ""}
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue={settings?.language || "en"}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue={settings?.timezone || "utc"}>
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select Timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="est">Eastern Time (EST)</SelectItem>
                          <SelectItem value="cst">Central Time (CST)</SelectItem>
                          <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                          <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                          <SelectItem value="brt">Brasília Time (BRT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings({
                    name: (document.getElementById('name') as HTMLInputElement)?.value,
                    email: (document.getElementById('email') as HTMLInputElement)?.value,
                  })}
                  disabled={saving}>
                    {saving ? "Saving..." : "Save changes"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize the appearance of the app. Automatically switch between day
                    and night themes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="theme">Theme</Label>
                    <Select defaultValue={settings?.theme || "system"}>
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings({
                    theme: (document.getElementById('theme') as HTMLSelectElement)?.value as 'light' | 'dark' | 'system',
                  })}
                  disabled={saving}>
                    {saving ? "Saving..." : "Save changes"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Configure how you receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="marketing_emails">Marketing emails</Label>
                    <Switch 
                      id="marketing_emails" 
                      defaultChecked={settings?.notifications?.marketing || false}
                      onCheckedChange={(checked) => handleSaveSettings({
                        notifications: {
                          ...settings?.notifications,
                          marketing: checked
                        }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="security_emails">Security emails</Label>
                    <Switch 
                      id="security_emails" 
                      defaultChecked={settings?.notifications?.security || true}
                      onCheckedChange={(checked) => handleSaveSettings({
                        notifications: {
                          ...settings?.notifications,
                          security: checked
                        }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "display" && (
              <Card>
                <CardHeader>
                  <CardTitle>Display</CardTitle>
                  <CardDescription>
                    Turn items on or off to control what&apos;s displayed in the app.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="show_balance">Show balance</Label>
                    <Switch 
                      id="show_balance" 
                      defaultChecked={settings?.display?.showBalance || true}
                      onCheckedChange={(checked) => handleSaveSettings({
                        display: {
                          ...settings?.display,
                          showBalance: checked
                        }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="show_notifications">Show notifications</Label>
                    <Switch 
                      id="show_notifications" 
                      defaultChecked={settings?.display?.showNotifications || true}
                      onCheckedChange={(checked) => handleSaveSettings({
                        display: {
                          ...settings?.display,
                          showNotifications: checked
                        }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "pix-keys" && (
              <Card>
                <CardHeader>
                  <CardTitle>Chaves Pix</CardTitle>
                  <CardDescription>
                    Gerencie suas chaves Pix cadastradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PixKeysManager 
                    pixKeys={pixKeys}
                    onDelete={handleDeletePixKey}
                    onSetDefault={handleSetDefaultPixKey}
                    onAdd={handleAddPixKey}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
