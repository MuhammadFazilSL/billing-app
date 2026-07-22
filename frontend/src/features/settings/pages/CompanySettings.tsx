import React, { useState, useEffect } from 'react';
import { SettingsCard } from '../../../components/settings/SettingsCard';
import { Input } from '../../../components/ui/Input';
import { settingsApi } from '../../../api/settings';

export const CompanySettings: React.FC = () => {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getCompanyProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch company profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { id, tenantId, createdAt, updatedAt, ...validData } = profile;
      await settingsApi.updateCompanyProfile(validData);
      alert('Company profile saved successfully!');
    } catch (error) {
      console.error('Failed to save profile', error);
      alert('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Company Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your business information and branding.</p>
      </div>

      <SettingsCard 
        title="General Information" 
        description="Update your company's basic details."
        onSave={handleSave}
        isLoading={loading}
        isSaving={saving}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Company Name" name="companyName" value={profile?.companyName || ''} onChange={handleChange} />
          <Input label="Legal Name" name="legalName" value={profile?.legalName || ''} onChange={handleChange} />
          <Input label="Email Address" name="email" type="email" value={profile?.email || ''} onChange={handleChange} />
          <Input label="Phone Number" name="phone" value={profile?.phone || ''} onChange={handleChange} />
          <Input label="Website" name="website" value={profile?.website || ''} onChange={handleChange} />
          <Input label="GST Number" name="gstNumber" value={profile?.gstNumber || ''} onChange={handleChange} />
        </div>
      </SettingsCard>

      <SettingsCard 
        title="Address details"
        onSave={handleSave}
        isLoading={loading}
        isSaving={saving}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input label="Address Line" name="address" value={profile?.address || ''} onChange={handleChange} />
          </div>
          <Input label="City" name="city" value={profile?.city || ''} onChange={handleChange} />
          <Input label="State" name="state" value={profile?.state || ''} onChange={handleChange} />
          <Input label="Country" name="country" value={profile?.country || ''} onChange={handleChange} />
          <Input label="Postal Code" name="postalCode" value={profile?.postalCode || ''} onChange={handleChange} />
        </div>
      </SettingsCard>
    </div>
  );
};
