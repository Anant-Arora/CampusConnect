import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image, Link2, Send, Search } from 'lucide-react';
import { Post } from '@/types/user';

const initialPosts: Post[] = [
  {
    id: '1',
    authorId: '1',
    authorName: 'Sarah Chen',
    authorCollege: 'MIT',
    content: 'Just finished my machine learning project on neural networks! 🧠 Really excited about the results we got on the validation set. Anyone else working on similar projects?',
    likes: 42,
    comments: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    authorId: '2',
    authorName: 'James Rodriguez',
    authorCollege: 'Stanford University',
    content: 'Looking for teammates for the upcoming hackathon next weekend! Need a designer and a backend developer. Drop a comment if interested! 🚀',
    likes: 28,
    comments: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    authorId: '3',
    authorName: 'Priya Sharma',
    authorCollege: 'Carnegie Mellon',
    content: 'Great workshop on system design today! Learned so much about distributed systems and microservices architecture. Thanks to everyone who attended! 💡',
    likes: 56,
    comments: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
];

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <div className="card-elevated p-5 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {post.authorName.charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-foreground">{post.authorName}</h4>
            <p className="text-sm text-muted-foreground">{post.authorCollege} · {formatTimeAgo(post.createdAt)}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      <p className="text-foreground leading-relaxed mb-4">{post.content}</p>

      <div className="flex items-center gap-1 pt-3 border-t border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLike}
          className={liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}
        >
          <Heart className={`w-4 h-4 mr-1.5 ${liked ? 'fill-current' : ''}`} />
          {likeCount}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <MessageCircle className="w-4 h-4 mr-1.5" />
          {post.comments}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Share2 className="w-4 h-4 mr-1.5" />
          Share
        </Button>
      </div>
    </div>
  );
}

function CreatePostCard({ onPost }: { onPost: (content: string) => void }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onPost(content.trim());
    setContent('');
  };

  return (
    <div className="card-elevated p-5 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary">
              {user?.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share something with the community..."
              className="w-full resize-none bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 min-h-[80px]"
              rows={3}
            />
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon" className="text-muted-foreground">
                  <Image className="w-5 h-5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="text-muted-foreground">
                  <Link2 className="w-5 h-5" />
                </Button>
              </div>
              <Button type="submit" size="sm" disabled={!content.trim()}>
                <Send className="w-4 h-4 mr-1.5" />
                Post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export function CommunityFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNewPost = (content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      authorId: user?.id || 'me',
      authorName: user?.fullName || 'You',
      authorCollege: user?.collegeName || '',
      content,
      likes: 0,
      comments: 0,
      createdAt: new Date(),
    };
    setPosts([newPost, ...posts]);
  };

  const filteredPosts = posts.filter((post) =>
    post.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Community Feed</h1>

      {/* Search */}
      <div className="card-elevated p-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <CreatePostCard onPost={handleNewPost} />
      
      <div className="space-y-4">
        {filteredPosts.map((post, index) => (
          <div key={post.id} style={{ animationDelay: `${index * 0.1}s` }}>
            <PostCard post={post} />
          </div>
        ))}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-foreground mb-2">No posts found</h3>
            <p className="text-muted-foreground">No posts match "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
