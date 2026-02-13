import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, MapPin, Clock, Upload, CheckCircle2 } from 'lucide-react';

interface ApplyPageProps {
  opportunity: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    deadline: Date;
    description: string;
    skills: string[];
  };
  onBack: () => void;
}

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function ApplyPage({ opportunity, onBack }: ApplyPageProps) {
  const [submitted, setSubmitted] = useState(false);
  const [resumeName, setResumeName] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    coverLetter: '',
    portfolio: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="card-elevated p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h2>
          <p className="text-muted-foreground mb-1">
            Your application for <span className="font-medium text-foreground">{opportunity.title}</span> at{' '}
            <span className="font-medium text-foreground">{opportunity.company}</span> has been sent.
          </p>
          <p className="text-sm text-muted-foreground mb-8">You'll receive updates via email.</p>
          <Button variant="gradient" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Opportunities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Opportunities</span>
      </button>

      {/* Opportunity Summary Card */}
      <div className="card-elevated p-5 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Building2 className="w-7 h-7 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground">{opportunity.title}</h1>
            <p className="text-muted-foreground">{opportunity.company}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {opportunity.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {daysUntil(opportunity.deadline)} days left
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{opportunity.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {opportunity.skills.map((skill) => (
                <span key={skill} className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit}>
        <div className="card-elevated p-6">
          <h2 className="text-lg font-semibold text-foreground mb-5">Your Application</h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <input
                required
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                required
                type="email"
                placeholder="john@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
              <input
                required
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">College</label>
              <input
                required
                type="text"
                placeholder="Stanford University"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1.5">Resume / CV</label>
            <label className="flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all duration-200">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {resumeName || 'Click to upload your resume (PDF, DOC)'}
              </span>
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          {/* Portfolio */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1.5">Portfolio / LinkedIn (optional)</label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/johndoe"
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              className="input-field"
            />
          </div>

          {/* Cover Letter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-1.5">Cover Letter</label>
            <textarea
              rows={5}
              placeholder="Tell them why you're a great fit for this role..."
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              className="input-field resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button type="submit" variant="gradient" size="lg" className="flex-1">
              Submit Application
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={onBack}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
