/* eslint-disable @typescript-eslint/no-unused-vars */


import React, { useEffect, useState } from 'react';
import { Save, Building2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { settingsAPI } from '@/services/settingsService';
import { useToast } from '@/components/ui/use-toast'; 
import type { CompanySettings } from '@/types';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings>({
    name: 'Encoder Bytes',
    currency: 'PKR',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsAPI.get();
      if (data) setSettings(data);
    } catch (error) {
      console.error("Failed to load settings", error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await settingsAPI.update(settings);
      toast({ title: "Settings Saved", description: "Company profile updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage company profile and configurations.</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="bg-slate-900 text-white hover:bg-slate-800">
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Profile Card */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Company Profile</CardTitle>
            <CardDescription>Visible in reports and sidebar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input 
                value={settings.name} 
                onChange={(e) => setSettings({...settings, name: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input 
                value={settings.address} 
                onChange={(e) => setSettings({...settings, address: e.target.value})} 
                placeholder="Office address..."
              />
            </div>
             <div className="space-y-2">
              <Label>Currency Symbol</Label>
              <Input 
                value={settings.currency} 
                onChange={(e) => setSettings({...settings, currency: e.target.value})} 
                className="max-w-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload Card (Placeholder for now) */}
        <Card className="shadow-sm border-gray-100">
           <CardHeader>
            <CardTitle className="text-base font-semibold">Branding</CardTitle>
            <CardDescription>Upload organization logo</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-100 rounded-lg">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
             </div>
             <Button variant="outline" size="sm">
               <Upload className="w-4 h-4 mr-2" /> Upload Logo
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;