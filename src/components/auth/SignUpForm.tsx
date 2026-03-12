import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User as UserIcon, Mail, Phone, GraduationCap, BookOpen, Sparkles, Briefcase, ArrowRight, Lock } from 'lucide-react';
import { User } from '@/types/user';
import { useLogin, useRegister } from '@/hooks/useAuth';

const INTEREST_OPTIONS = [
  'Technology', 'Design', 'Business', 'Arts', 'Science',
  'Sports', 'Music', 'Writing', 'Photography', 'Gaming'
];

const SKILL_OPTIONS = [
  'Programming', 'UI/UX Design', 'Data Analysis', 'Marketing',
  'Video Editing', 'Public Speaking', 'Writing', 'Leadership',
  'Project Management', 'Research'
];

export function SignUpForm() {
  const { login } = useAuth();
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const [step, setStep] = useState(1);
  const [showRegister, setShowRegister] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeName: '',
    degree: '',
    interests: [] as string[],
    skills: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSelection = (type: 'interests' | 'skills', value: string) => {
    const current = formData[type];
    if (current.includes(value)) {
      setFormData({ ...formData, [type]: current.filter(item => item !== value) });
    } else if (current.length < 5) {
      setFormData({ ...formData, [type]: [...current, value] });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({ email: loginEmail, password: loginPassword });
    } catch (err: any) {
      const message = err?.response?.data?.error ?? 'Invalid email or password';
      alert(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const password = formData.password;
    if (password.length < 8) return;
    if (formData.confirmPassword !== password) return;
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password,
      college: formData.collegeName,
      degree: formData.degree,
      skills: formData.skills,
    };
    try {
      await registerMutation.mutateAsync(payload);
    } catch (err: any) {
      const message = err?.response?.data?.error ?? 'Registration failed. Please try again.';
      alert(message);
    }
  };

  const passwordTooShort = formData.password.length > 0 && formData.password.length < 8;
  const passwordMismatch = formData.confirmPassword.length > 0 && formData.confirmPassword !== formData.password;
  const canProceedStep1 = formData.fullName && formData.email && formData.phone && formData.password.length >= 8 && formData.confirmPassword && !passwordMismatch;
  const canProceedStep2 = formData.collegeName && formData.degree;
  const canSubmit = formData.interests.length > 0 && formData.skills.length > 0;

  // LOGIN PAGE — shown by default
  if (!showRegister) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <GraduationCap className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Login to your CampusConnect account</p>
          </div>
          <div className="card-elevated p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@college.edu" className="input-field pl-11" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Enter your password" className="input-field pl-11" required />
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            New here?{' '}
            <button type="button" onClick={() => setShowRegister(true)} className="text-primary font-medium hover:underline">
              Create an account
            </button>
          </p>
        </div>
      </div>
    );
  }

  // REGISTER PAGE — shown when showRegister is true
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg animate-fade-in">

        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <GraduationCap className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Join CampusConnect</h1>
          <p className="text-muted-foreground">Discover, connect, and grow with your college community</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? 'w-8 bg-primary' : s < step ? 'w-8 bg-accent' : 'w-8 bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Form Card */}
        <div className="card-elevated p-8">
          <form onSubmit={handleSubmit}>

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-5 animate-slide-up">
                <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" className="input-field pl-11" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email ID</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@college.edu" className="input-field pl-11" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" className="input-field pl-11" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Create a password" className="input-field pl-11" required minLength={8} />
                  </div>
                  {passwordTooShort && <p className="text-sm text-destructive">Password must be at least 8 characters</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Re-enter your password" className="input-field pl-11" required minLength={8} />
                  </div>
                  {passwordMismatch && <p className="text-sm text-destructive">Passwords do not match</p>}
                </div>
                <Button type="button" onClick={() => setStep(2)} disabled={!canProceedStep1} className="w-full mt-4" size="lg">
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Step 2: Academic Info */}
            {step === 2 && (
              <div className="space-y-5 animate-slide-up">
                <h2 className="text-lg font-semibold text-foreground mb-4">Academic Details</h2>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">College Name</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="text" name="collegeName" value={formData.collegeName} onChange={handleInputChange} placeholder="e.g., Stanford University" className="input-field pl-11" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Degree / Program</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="text" name="degree" value={formData.degree} onChange={handleInputChange} placeholder="e.g., B.Tech Computer Science" className="input-field pl-11" required />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1" size="lg">Back</Button>
                  <Button type="button" onClick={() => setStep(3)} disabled={!canProceedStep2} className="flex-1" size="lg">
                    Continue <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Interests & Skills */}
            {step === 3 && (
              <div className="space-y-6 animate-slide-up">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <h2 className="text-lg font-semibold text-foreground">Your Interests</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Select up to 5 interests</p>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map((interest) => (
                      <button key={interest} type="button" onClick={() => toggleSelection('interests', interest)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${formData.interests.includes(interest) ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-secondary'}`}>
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Your Skills</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Select up to 5 skills</p>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_OPTIONS.map((skill) => (
                      <button key={skill} type="button" onClick={() => toggleSelection('skills', skill)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${formData.skills.includes(skill) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-secondary'}`}>
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)} className="flex-1" size="lg">Back</Button>
                  <Button type="submit" disabled={!canSubmit} className="flex-1" size="lg">Get Started</Button>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Back to Login Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <button type="button" onClick={() => setShowRegister(false)} className="text-primary font-medium hover:underline">
            Login here
          </button>
        </p>

      </div>
    </div>
  );
}