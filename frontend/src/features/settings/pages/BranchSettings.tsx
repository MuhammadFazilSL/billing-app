import React, { useState, useEffect } from 'react';
import { SettingsCard } from '../../../components/settings/SettingsCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { branchesApi } from '../../../api/branches';

export const BranchSettings: React.FC = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const data = await branchesApi.getBranches();
      setBranches(data);
    } catch (error) {
      console.error('Failed to fetch branches', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { id, tenantId, createdAt, updatedAt, ...validData } = currentBranch;
      if (currentBranch.id) {
        await branchesApi.updateBranch(currentBranch.id, validData);
      } else {
        await branchesApi.createBranch(validData);
      }
      setIsFormVisible(false);
      setCurrentBranch({});
      fetchBranches();
    } catch (error) {
      console.error('Failed to save branch', error);
      alert('Failed to save branch.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      await branchesApi.deleteBranch(id);
      fetchBranches();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Branches</h2>
          <p className="text-sm text-muted-foreground">Manage your physical locations.</p>
        </div>
        <Button onClick={() => { setCurrentBranch({}); setIsFormVisible(true); }}>Add Branch</Button>
      </div>

      {isFormVisible ? (
        <SettingsCard 
          title={currentBranch.id ? "Edit Branch" : "New Branch"} 
          onSave={handleSave}
          isLoading={saving}
          isSaving={saving}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Branch Name" value={currentBranch.name || ''} onChange={e => setCurrentBranch({...currentBranch, name: e.target.value})} />
            <Input label="Branch Code" value={currentBranch.code || ''} onChange={e => setCurrentBranch({...currentBranch, code: e.target.value})} />
            <Input label="Manager Name" value={currentBranch.managerName || ''} onChange={e => setCurrentBranch({...currentBranch, managerName: e.target.value})} />
            <Input label="Phone" value={currentBranch.phone || ''} onChange={e => setCurrentBranch({...currentBranch, phone: e.target.value})} />
            <div className="md:col-span-2 flex items-center space-x-2 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={currentBranch.isDefault || false} 
                  onChange={e => setCurrentBranch({...currentBranch, isDefault: e.target.checked})} 
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium">Set as Default Branch</span>
              </label>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
             <Button variant="outline" onClick={() => setIsFormVisible(false)} className="mr-2">Cancel</Button>
          </div>
        </SettingsCard>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Default</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-6">Loading...</td></tr>
              ) : branches.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">No branches found.</td></tr>
              ) : branches.map(branch => (
                <tr key={branch.id} className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium">{branch.name}</td>
                  <td className="px-4 py-3">{branch.code}</td>
                  <td className="px-4 py-3">{branch.isDefault ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setCurrentBranch(branch); setIsFormVisible(true); }}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(branch.id)} className="text-red-500">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
