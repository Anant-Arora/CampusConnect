import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface PostOpportunityFormProps {
  onBack: () => void;
  onSubmit: (opportunity: {
    title: string;
    company: string;
    location: string;
    type: string;
    deadline: string;
    description: string;
    skills: string[];
  }) => void;
}

const opportunityTypes = ['Internship', 'Full-time', 'Part-time', 'Hackathon', 'Research'];

export function PostOpportunityForm({ onBack, onSubmit }: PostOpportunityFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Internship',
    deadline: '',
    description: '',
    skillsInput: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = formData.skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    onSubmit({
      title: formData.title,
      company: formData.company,
      location: formData.location,
      type: formData.type,
      deadline: formData.deadline,
      description: formData.description,
      skills,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="card-elevated p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Opportunity Posted!</h2>
          <p className="text-muted-foreground mb-8">Your opportunity is now visible to the community.</p>
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
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Opportunities</span>
      </button>

      <form onSubmit={handleSubmit}>
        <div className="card-elevated p-6">
          <h2 className="text-xl font-bold text-foreground mb-5">Post an Opportunity</h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
              <input
                required
                type="text"
                placeholder="e.g. Software Engineering Intern"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Company / Organization</label>
              <input
                required
                type="text"
                placeholder="e.g. Google"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
              <input
                required
                type="text"
                placeholder="e.g. Remote, New York, NY"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
              >
                {opportunityTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1.5">Application Deadline</label>
            <input
              required
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea
              required
              rows={4}
              placeholder="Describe the opportunity..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-1.5">Skills (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Python, Machine Learning"
              value={formData.skillsInput}
              onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button type="submit" variant="gradient" size="lg" className="flex-1">
              Post Opportunity
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
