import React, { useState } from 'react';
import { User, Lock, Code, Image, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateUser } from '@/hooks/useUsers';
import { api } from '@/lib/api';

const AVAILABLE_SKILLS = [
  'Programming', 'UI/UX Design', 'Data Analysis', 'Marketing',
  'Video Editing', 'Public Speaking', 'Writing', 'Leadership',
  'Project Management', 'Research', 'AI/ML', 'Full Stack Development',
  'Data Science', 'Strategy', 'Fundraising', 'Cloud Architecture',
  'DevOps', 'Blockchain', 'Cybersecurity', 'Product Management'
];

export function SettingsPage() {
  const { user, logout } = useAuth();
  const updateUser = useUpdateUser();

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'skills' | 'avatar' | 'danger'>('profile');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Profile form
  const [fullName, setFullName] = useState((user as any)?.fullName ?? '');
  const [bio, setBio] = useState((user as any)?.bio ?? '');
  const [collegeName, setCollegeName] = useState((user as any)?.collegeName ?? '');
  const [degree, setDegree] = useState((user as any)?.degree ?? '');
  const [location, setLocation] = useState((user as any)?.location ?? '');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>((user as any)?.skills ?? []);

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState((user as any)?.avatar ?? '');

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setSuccessMessage('');
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleProfileSave = () => {
    if (!fullName.trim()) return showError('Name cannot be empty');
    updateUser.mutate(
      { id: user?.id ?? '', data: { fullName, bio, collegeName, degree, location } },
      {
        onSuccess: () => showSuccess('Profile updated successfully!'),
        onError: () => showError('Failed to update profile'),
      }
    );
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword)
      return showError('Please fill in all password fields');
    if (newPassword.length < 8)
      return showError('New password must be at least 8 characters');
    if (newPassword !== confirmPassword)
      return showError('Passwords do not match');
    try {
      await api.put(`/users/${user?.id}/password`, { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showSuccess('Password changed successfully!');
    } catch {
      showError('Current password is incorrect');
    }
  };

  const handleSkillsSave = () => {
    updateUser.mutate(
      { id: user?.id ?? '', data: { skills: selectedSkills } },
      {
        onSuccess: () => showSuccess('Skills updated successfully!'),
        onError: () => showError('Failed to update skills'),
      }
    );
  };

  const handleAvatarSave = () => {
    if (!avatarUrl.trim()) return showError('Please enter a valid image URL');
    updateUser.mutate(
      { id: user?.id ?? '', data: { avatar: avatarUrl } },
      {
        onSuccess: () => showSuccess('Profile picture updated!'),
        onError: () => showError('Failed to update profile picture'),
      }
    );
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmed) return;
    const doubleConfirm = window.confirm(
      'This will permanently delete all your posts, messages, and data. Continue?'
    );
    if (!doubleConfirm) return;
    try {
      await api.delete(`/users/${user?.id}`);
      logout();
    } catch {
      showError('Failed to delete account. Please try again.');
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const tabs = [
    { id: 'profile', label: 'Edit Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'avatar', label: 'Profile Picture', icon: Image },
    { id: 'danger', label: 'Delete Account', icon: Trash2 },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      {successMessage && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          ✅ {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          ❌ {errorMessage}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? tab.id === 'danger'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-primary/10 text-primary'
                  : tab.id === 'danger'
                  ? 'text-destructive hover:bg-red-50'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 card-elevated p-6">

          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-foreground mb-4">Edit Profile</h2>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" placeholder="Your full name" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input-field resize-none" rows={3} placeholder="Tell others about yourself..." />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">College</label>
                <input value={collegeName} onChange={(e) => setCollegeName(e.target.value)} className="input-field" placeholder="Your college name" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Degree</label>
                <input value={degree} onChange={(e) => setDegree(e.target.value)} className="input-field" placeholder="e.g. Btech CSE" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} className="input-field" placeholder="e.g. Delhi, India" />
              </div>
              <Button onClick={handleProfileSave} className="w-full" disabled={updateUser.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {updateUser.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-foreground mb-4">Change Password</h2>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Current Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field pr-10" placeholder="Enter current password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">New Password</label>
                <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" placeholder="Min 8 characters" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Confirm New Password</label>
                <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="Re-enter new password" />
              </div>
              <Button onClick={handlePasswordChange} className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-foreground mb-1">Edit Skills</h2>
              <p className="text-sm text-muted-foreground mb-4">Select skills that represent you. These appear on your Find CEO profile.</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedSkills.includes(skill)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{selectedSkills.length} skills selected</p>
              <Button onClick={handleSkillsSave} className="w-full" disabled={updateUser.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {updateUser.isPending ? 'Saving...' : 'Save Skills'}
              </Button>
            </div>
          )}

          {activeTab === 'avatar' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-foreground mb-4">Profile Picture</h2>
              <div className="flex justify-center mb-4">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar preview" className="w-24 h-24 rounded-full object-cover border-4 border-primary/20" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                    <span className="text-2xl font-bold text-primary">
                      {(user as any)?.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Image URL</label>
                <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="input-field" placeholder="https://example.com/your-photo.jpg" />
                <p className="text-xs text-muted-foreground mt-1">Paste a direct link to your profile image</p>
              </div>
              <Button onClick={handleAvatarSave} className="w-full" disabled={updateUser.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {updateUser.isPending ? 'Saving...' : 'Update Picture'}
              </Button>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-red-600 mb-2">Delete Account</h2>
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700 font-medium mb-2">⚠️ This action is permanent</p>
                <p className="text-sm text-red-600">Deleting your account will permanently remove:</p>
                <ul className="text-sm text-red-600 mt-2 space-y-1 list-disc list-inside">
                  <li>Your profile and all personal data</li>
                  <li>All your posts and comments</li>
                  <li>All your messages and conversations</li>
                  <li>All your saved opportunities</li>
                </ul>
              </div>
              <Button onClick={handleDeleteAccount} variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Permanently Delete My Account
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}