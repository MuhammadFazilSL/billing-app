import React, { useState, useEffect } from 'react';
import { SettingsCard } from './SettingsCard';
import { Input } from '../ui/Input';
import { settingsApi } from '../../api/settings';

interface Field {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'checkbox';
}

interface GenericSettingsFormProps {
  title: string;
  description: string;
  endpoint: 'invoice' | 'tax' | 'printer' | 'email' | 'regional' | 'preferences' | 'backup';
  fields: Field[];
}

export const GenericSettingsForm: React.FC<GenericSettingsFormProps> = ({ title, description, endpoint, fields }) => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getTenantSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Select only relevant fields to send
      const dataToSave: any = {};
      fields.forEach(f => {
        dataToSave[f.name] = settings[f.name];
      });

      // Dynamically call the correct update method
      const updateMethodName = `update${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}Settings`;
      await (settingsApi as any)[updateMethodName](dataToSave);
      
      alert(`${title} saved successfully!`);
    } catch (error) {
      console.error(`Failed to save ${title}`, error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings({ 
      ...settings, 
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value 
    });
  };

  return (
    <SettingsCard 
      title={title} 
      description={description}
      onSave={handleSave}
      isLoading={loading}
      isSaving={saving}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(field => (
          <div key={field.name} className={field.type === 'checkbox' ? 'flex items-center space-x-2' : ''}>
            {field.type === 'checkbox' ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  name={field.name} 
                  checked={settings?.[field.name] || false} 
                  onChange={handleChange} 
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium">{field.label}</span>
              </label>
            ) : (
              <Input 
                label={field.label} 
                name={field.name} 
                type={field.type || 'text'}
                value={settings?.[field.name] || ''} 
                onChange={handleChange} 
              />
            )}
          </div>
        ))}
      </div>
    </SettingsCard>
  );
};
