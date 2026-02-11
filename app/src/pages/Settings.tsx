/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import {
  Building2, Mail, Phone, MapPin, 
  Image as ImageIcon, Save, Palette, Upload, Link as LinkIcon, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { settingsAPI } from '@/services/settingsService';
import type { CompanySettings } from '@/types';
import { cn } from '@/lib/utils';

// --- CLOUDINARY CONFIG ---
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload";
const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET"; 

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings>({
    name: '',
    logo: '',
    address: '',
    phone: '',
    email: '',
    primaryColor: '#5d88c6', 
    currency: 'PKR', // Default fallback to satisfy type
    taxPercentage: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsAPI.get();
        // Merge with defaults to prevent crashes
        setSettings(prev => ({ ...prev, ...data }));
        if (data.primaryColor) applyTheme(data.primaryColor);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const applyTheme = (color: string) => {
    document.documentElement.style.setProperty('--primary', color);
  };

  const handleChange = (field: keyof CompanySettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    if (field === 'primaryColor') applyTheme(value);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await settingsAPI.update(settings);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
      setIsUploadOpen(false);
    } catch (error) {
      setMessage('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.secure_url) {
        handleChange('logo', data.secure_url);
        setMessage('Logo uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading settings...</div>;

  // Dynamic Styles based on primary color
  const primaryText = { color: settings.primaryColor };
  const primaryBg = { backgroundColor: settings.primaryColor };
  const primaryBorder = { borderColor: settings.primaryColor };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your company profile and appearance.</p>
        </div>
        {/* Quick Save Button in Header */}
        <Button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="shadow-md text-white transition-all hover:opacity-90"
          style={primaryBg}
        >
          {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
        </Button>
      </div>

      {message && (
        <div className={cn('p-4 rounded-lg flex items-center justify-between', message.toLowerCase().includes('failed') || message.toLowerCase().includes('error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800')}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Company Profile */}
        <Card className="lg:col-span-2 shadow-sm border-t-4" style={{ borderTopColor: settings.primaryColor }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={primaryText}>
              <Building2 className="w-5 h-5" />
              Company Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Logo Section */}
            <div className="flex flex-col sm:flex-row gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-24 h-24 shrink-0 rounded-xl bg-white flex items-center justify-center border-2 border-dashed overflow-hidden relative" style={primaryBorder}>
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-8 h-8 opacity-50" style={primaryText} />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-medium text-gray-900">Company Logo</h4>
                        <p className="text-sm text-gray-500">Visible on dashboard and reports.</p>
                    </div>
                    {!isUploadOpen && (
                        <Button variant="outline" size="sm" onClick={() => setIsUploadOpen(true)} className="hover:bg-slate-50">
                            Update Logo
                        </Button>
                    )}
                </div>

                {isUploadOpen && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm animate-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-3">
                            <Label className="text-xs font-semibold uppercase text-slate-500">Upload New Logo</Label>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsUploadOpen(false)}>
                                <X className="w-4 h-4 text-slate-400" />
                            </Button>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input 
                                    placeholder="Paste Image URL..." 
                                    value={settings.logo || ''} 
                                    onChange={(e) => handleChange('logo', e.target.value)}
                                    className="pl-9 bg-slate-50 focus:ring-1"
                                    style={{ '--tw-ring-color': settings.primaryColor } as React.CSSProperties}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-400 uppercase font-medium">OR</span>
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </div>

                            <div className="flex gap-2">
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                <Button className="w-full text-white hover:opacity-90" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading} style={primaryBg}>
                                    <Upload className="w-4 h-4 mr-2"/> {isUploading ? 'Uploading...' : 'Upload from Device'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" value={settings.name} onChange={(e) => handleChange('name', e.target.value)} className="focus:border-[color:var(--primary)]" style={{ '--primary': settings.primaryColor } as React.CSSProperties} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={primaryText} />
                  <Input id="email" type="email" value={settings.email} onChange={(e) => handleChange('email', e.target.value)} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={primaryText} />
                  <Input id="phone" value={settings.phone} onChange={(e) => handleChange('phone', e.target.value)} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={primaryText} />
                  <Input id="address" value={settings.address} onChange={(e) => handleChange('address', e.target.value)} className="pl-10" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="shadow-sm border-t-4" style={{ borderTopColor: settings.primaryColor }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={primaryText}>
              <Palette className="w-5 h-5" />
              Theme & Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Primary Brand Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg border shadow-sm cursor-pointer transition-transform active:scale-95 ring-2 ring-offset-2 ring-transparent hover:ring-gray-200"
                  style={{ backgroundColor: settings.primaryColor }}
                  onClick={() => document.getElementById('colorPicker')?.click()}
                />
                <Input 
                  id="colorPicker"
                  type="color" 
                  value={settings.primaryColor} 
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-0 h-0 opacity-0 absolute"
                />
                <Input 
                  value={settings.primaryColor} 
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="flex-1 font-mono uppercase"
                  placeholder="#000000"
                />
              </div>
              <p className="text-xs text-gray-500">
                 Changes apply instantly to buttons, icons, and active states.
              </p>
            </div>

            {/* Live Preview Box */}
            <div className="p-4 rounded-xl text-white transition-all duration-300 shadow-lg" style={primaryBg}>
              <p className="text-sm opacity-80 mb-1">Live Preview</p>
              <p className="text-lg font-bold">{settings.name || 'Company Name'}</p>
              <div className="mt-4 flex gap-2">
                <div className="px-3 py-1 rounded bg-white/20 text-sm backdrop-blur-sm border border-white/30">Active</div>
                <div className="px-3 py-1 rounded bg-white text-sm font-medium shadow-sm" style={{ color: settings.primaryColor }}>Button</div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Settings;