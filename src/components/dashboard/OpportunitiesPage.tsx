import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Building2, 
  ExternalLink, 
  Search,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { ApplyPage } from './ApplyPage';
import { PostOpportunityForm } from './PostOpportunityForm';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: Date;
  deadline: Date;
  description: string;
  skills: string[];
}

const initialOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'Internship',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    description: 'Join our team to work on cutting-edge products used by billions of users worldwide.',
    skills: ['Python', 'Data Structures', 'Algorithms'],
  },
  {
    id: '2',
    title: 'Product Design Intern',
    company: 'Figma',
    location: 'Remote',
    type: 'Internship',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
    description: 'Help design the future of collaborative design tools.',
    skills: ['UI/UX', 'Figma', 'Prototyping'],
  },
  {
    id: '3',
    title: 'AI/ML Research Assistant',
    company: 'MIT CSAIL',
    location: 'Cambridge, MA',
    type: 'Research',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    description: 'Work on cutting-edge machine learning research projects.',
    skills: ['PyTorch', 'Machine Learning', 'Research'],
  },
  {
    id: '4',
    title: 'Global Hackathon 2024',
    company: 'MLH',
    location: 'Virtual',
    type: 'Hackathon',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    description: '48-hour hackathon with amazing prizes and mentorship opportunities.',
    skills: ['Any Stack', 'Creativity', 'Teamwork'],
  },
];

const typeColors: Record<string, string> = {
  'Internship': 'bg-primary/10 text-primary',
  'Full-time': 'bg-accent/10 text-accent',
  'Part-time': 'bg-secondary text-secondary-foreground',
  'Hackathon': 'bg-orange-100 text-orange-700',
  'Research': 'bg-violet-100 text-violet-700',
};

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function OpportunityCard({ opportunity, onApply }: { opportunity: Opportunity; onApply: (opp: Opportunity) => void }) {
  const [saved, setSaved] = useState(false);
  const daysLeft = daysUntil(opportunity.deadline);

  return (
    <div className="card-elevated p-5 hover:shadow-medium transition-all duration-200 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <Building2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{opportunity.title}</h3>
            <p className="text-sm text-muted-foreground">{opportunity.company}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSaved(!saved)} className={saved ? 'text-primary' : 'text-muted-foreground'}>
          {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{opportunity.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {opportunity.skills.map((skill) => (
          <span key={skill} className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">{skill}</span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{opportunity.location}</div>
          <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{daysLeft} days left</div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[opportunity.type] || 'bg-muted text-muted-foreground'}`}>
          {opportunity.type}
        </span>
      </div>
      <Button className="w-full mt-4" variant="soft" onClick={() => onApply(opportunity)}>
        Apply Now <ExternalLink className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}

export function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [applyingTo, setApplyingTo] = useState<Opportunity | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);

  if (applyingTo) {
    return <ApplyPage opportunity={applyingTo} onBack={() => setApplyingTo(null)} />;
  }

  if (showPostForm) {
    return (
      <PostOpportunityForm
        onBack={() => setShowPostForm(false)}
        onSubmit={(data) => {
          const newOpp: Opportunity = {
            id: Date.now().toString(),
            title: data.title,
            company: data.company,
            location: data.location,
            type: data.type,
            postedAt: new Date(),
            deadline: new Date(data.deadline),
            description: data.description,
            skills: data.skills,
          };
          setOpportunities([newOpp, ...opportunities]);
        }}
      />
    );
  }

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || opp.type === selectedType;
    return matchesSearch && matchesType;
  });

  const types = ['Internship', 'Full-time', 'Research', 'Hackathon'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Opportunities</h1>
          <p className="text-muted-foreground mt-1">Discover internships, jobs, and events</p>
        </div>
        <Button variant="gradient" onClick={() => setShowPostForm(true)}>
          <Briefcase className="w-4 h-4 mr-2" />
          Post Opportunity
        </Button>
      </div>

      <div className="card-elevated p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search opportunities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {types.map((type) => (
              <button key={type} onClick={() => setSelectedType(selectedType === type ? null : type)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedType === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-secondary'}`}>
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredOpportunities.map((opportunity, index) => (
          <div key={opportunity.id} style={{ animationDelay: `${index * 0.1}s` }}>
            <OpportunityCard opportunity={opportunity} onApply={setApplyingTo} />
          </div>
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium text-foreground mb-2">No opportunities found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
}
