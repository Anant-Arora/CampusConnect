import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, MessageSquare, MapPin, GraduationCap, Star, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Person {
  id: string;
  name: string;
  college: string;
  degree: string;
  location: string;
  skills: string[];
  interests: string[];
  avatar?: string;
  rating: number;
  isOnline: boolean;
}

const samplePeople: Person[] = [
  { id: '1', name: 'Sarah Chen', college: 'MIT', degree: 'MBA', location: 'Boston, MA', skills: ['Leadership', 'Strategy', 'Product Management', 'AI/ML', 'Fundraising'], interests: ['Tech Startups', 'FinTech'], rating: 4.9, isOnline: true },
  { id: '2', name: 'James Rodriguez', college: 'Stanford', degree: 'MS Computer Science', location: 'San Francisco, CA', skills: ['Full Stack Development', 'AI/ML', 'Cloud Architecture', 'Data Science', 'DevOps'], interests: ['SaaS', 'Deep Learning'], rating: 4.8, isOnline: true },
  { id: '3', name: 'Priya Sharma', college: 'Carnegie Mellon', degree: 'MS Business Analytics', location: 'Pittsburgh, PA', skills: ['Data Science', 'Business Strategy', 'Marketing', 'Python', 'SQL'], interests: ['EdTech', 'Analytics'], rating: 4.7, isOnline: false },
  { id: '4', name: 'Alex Kim', college: 'Berkeley', degree: 'BS Electrical Engineering', location: 'Oakland, CA', skills: ['Hardware Design', 'IoT', 'Embedded Systems', 'Python', 'Leadership'], interests: ['Hardware Startups', 'CleanTech'], rating: 4.6, isOnline: false },
  { id: '5', name: 'Maya Johnson', college: 'Harvard', degree: 'MBA', location: 'New York, NY', skills: ['Fundraising', 'Strategy', 'Finance', 'Leadership', 'Sales'], interests: ['FinTech', 'Impact Investing'], rating: 4.9, isOnline: true },
  { id: '6', name: 'Raj Patel', college: 'Georgia Tech', degree: 'MS Computer Science', location: 'Atlanta, GA', skills: ['Blockchain', 'Smart Contracts', 'Full Stack Development', 'Cloud Architecture', 'Security'], interests: ['Web3', 'DeFi'], rating: 4.5, isOnline: false },
  { id: '7', name: 'Emily Wang', college: 'Columbia', degree: 'MS Data Science', location: 'New York, NY', skills: ['AI/ML', 'NLP', 'Data Science', 'Python', 'Research'], interests: ['HealthTech', 'AI Ethics'], rating: 4.8, isOnline: true },
  { id: '8', name: 'Carlos Martinez', college: 'Wharton', degree: 'MBA', location: 'Philadelphia, PA', skills: ['Marketing', 'Growth Hacking', 'Sales', 'Product Management', 'Strategy'], interests: ['E-commerce', 'D2C'], rating: 4.7, isOnline: false },
];

const popularSkills = ['Leadership', 'AI/ML', 'Strategy', 'Full Stack Development', 'Data Science', 'Marketing', 'Fundraising', 'Product Management'];

function PersonCard({ person, onMessage }: { person: Person; onMessage: (person: Person) => void }) {
  return (
    <div className="card-elevated p-5 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">{person.name.charAt(0)}</span>
          </div>
          {person.isOnline && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-accent rounded-full border-2 border-card" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground truncate">{person.name}</h3>
            <div className="flex items-center gap-1 text-accent flex-shrink-0">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{person.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <GraduationCap className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{person.degree} · {person.college}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{person.location}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {person.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {skill}
              </span>
            ))}
          </div>

          <Button
            onClick={() => onMessage(person)}
            className="w-full"
            variant="soft"
          >
            <MessageSquare className="w-4 h-4" />
            Message
          </Button>
        </div>
      </div>
    </div>
  );
}

export function FindCEOPage({ onNavigateToMessages }: { onNavigateToMessages?: (personName: string) => void }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [messageSent, setMessageSent] = useState<string | null>(null);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
  };

  const filteredPeople = samplePeople.filter((person) => {
    const queryLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      person.skills.some((s) => s.toLowerCase().includes(queryLower)) ||
      person.name.toLowerCase().includes(queryLower) ||
      person.interests.some((i) => i.toLowerCase().includes(queryLower));

    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) =>
        person.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
      );

    return matchesSearch && matchesSkills;
  });

  const handleMessage = (person: Person) => {
    setMessageSent(person.name);
    setTimeout(() => setMessageSent(null), 3000);
    if (onNavigateToMessages) {
      onNavigateToMessages(person.name);
    }
  };

  const hasFilters = searchQuery || selectedSkills.length > 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Find CEO</h1>
        <p className="text-muted-foreground">Search for talented people by skills and connect with them</p>
      </div>

      {/* Search Bar */}
      <div className="card-elevated p-4 mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by skills, name, or interests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12 text-base"
          />
        </div>

        {/* Popular Skill Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mr-1">
            <Filter className="w-4 h-4" />
            <span>Skills:</span>
          </div>
          {popularSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                selectedSkills.includes(skill)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              )}
            >
              {skill}
            </button>
          ))}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-destructive hover:bg-destructive/10 transition-all duration-200 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Toast */}
      {messageSent && (
        <div className="fixed top-6 right-6 z-50 card-elevated px-5 py-3 flex items-center gap-3 animate-slide-up">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-accent" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Redirecting to chat with <span className="text-primary">{messageSent}</span>
          </p>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredPeople.length} {filteredPeople.length === 1 ? 'person' : 'people'} found
        </p>
      </div>

      {/* Results Grid */}
      {filteredPeople.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPeople.map((person) => (
            <PersonCard key={person.id} person={person} onMessage={handleMessage} />
          ))}
        </div>
      ) : (
        <div className="card-elevated p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-2">No results found</h3>
          <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button variant="soft" onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
}
