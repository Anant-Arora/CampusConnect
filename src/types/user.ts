export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  collegeName: string;
  degree: string;
  interests: string[];
  skills: string[];
  avatar?: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorCollege: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: Date;
}
