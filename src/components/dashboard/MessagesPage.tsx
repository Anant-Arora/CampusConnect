import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Send, MoreVertical, Phone, Video, Smile, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConversations, useMessages, useSendMessage } from '@/hooks/useMessages';

interface Conversation {
  id: string;
  name: string;
  college: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (days === 1) return 'Yesterday';
  if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function ConversationItem({ conversation, isSelected, onClick }: { conversation: Conversation; isSelected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("w-full p-3 flex items-start gap-3 rounded-lg transition-all duration-200 text-left", isSelected ? "bg-primary/10" : "hover:bg-muted")}>
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary">{conversation.name.charAt(0)}</span>
        </div>
        {conversation.isOnline && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-accent rounded-full border-2 border-card" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className={cn("font-medium truncate", isSelected ? "text-primary" : "text-foreground")}>{conversation.name}</h4>
          <span className="text-xs text-muted-foreground flex-shrink-0">{formatTime(conversation.lastMessageTime)}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground truncate pr-2">{conversation.lastMessage}</p>
          {conversation.unreadCount > 0 && (
            <span className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground">{conversation.unreadCount}</span>
          )}
        </div>
      </div>
    </button>
  );
}

function ChatArea({ conversation, messages, onSendMessage }: { conversation: Conversation | null; messages: Message[]; onSendMessage: (content: string) => void }) {
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-xl">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <Send className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-2">Select a conversation</h3>
          <p className="text-sm text-muted-foreground">Choose a chat to start messaging</p>
        </div>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  return (
    <div className="flex-1 flex flex-col bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">{conversation.name.charAt(0)}</span>
            </div>
            {conversation.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-card" />}
          </div>
          <div>
            <h3 className="font-medium text-foreground">{conversation.name}</h3>
            <p className="text-xs text-muted-foreground">{conversation.isOnline ? 'Online' : 'Offline'} · {conversation.college}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground"><Phone className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground"><Video className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground"><MoreVertical className="w-5 h-5" /></Button>
        </div>
      </div>

      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((message) => {
          const isMe = message.senderId === 'me';
          return (
            <div key={message.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[70%] px-4 py-2.5 rounded-2xl", isMe ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md")}>
                <p className="text-sm">{message.content}</p>
                <p className={cn("text-xs mt-1", isMe ? "text-primary-foreground/70" : "text-muted-foreground")}>{formatTime(message.timestamp)}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="text-muted-foreground flex-shrink-0"><Paperclip className="w-5 h-5" /></Button>
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2.5 rounded-full bg-muted border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          <Button type="button" variant="ghost" size="icon" className="text-muted-foreground flex-shrink-0"><Smile className="w-5 h-5" /></Button>
          <Button type="submit" size="icon" disabled={!newMessage.trim()} className="flex-shrink-0"><Send className="w-4 h-4" /></Button>
        </div>
      </form>
    </div>
  );
}

export function MessagesPage() {
  const { user } = useAuth();
  const conversationsQuery = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const sendMessage = useSendMessage();

  const conversations: Conversation[] = useMemo(() => {
    const raw = conversationsQuery.data ?? [];
    return raw.map((c: any) => ({
      id: c.id,
      name: c.otherParticipant?.fullName ?? 'Unknown',
      college: '',
      lastMessage: c.lastMessage ?? '',
      lastMessageTime: c.lastMessageAt ? new Date(c.lastMessageAt) : new Date(0),
      unreadCount: c.unreadCount ?? 0,
      isOnline: !!c.otherParticipant?.isOnline,
    }));
  }, [conversationsQuery.data]);

  useEffect(() => {
    const stored = localStorage.getItem("campusconnect_selected_conversation_id");
    if (stored) {
      setSelectedConversationId(stored);
      localStorage.removeItem("campusconnect_selected_conversation_id");
      return;
    }
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId) ?? null;

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const messagesQuery = useMessages(selectedConversationId);
  const currentMessages: Message[] = useMemo(() => {
    const raw = messagesQuery.data ?? [];
    return raw.map((m: any) => ({
      id: m.id,
      senderId: m.senderId === user?.id ? 'me' : m.senderId,
      content: m.content,
      timestamp: new Date(m.createdAt),
    }));
  }, [messagesQuery.data, user?.id]);

  const handleSendMessage = (content: string) => {
    if (!selectedConversationId) return;
    sendMessage.mutate({ conversationId: selectedConversationId, content });
  };

  return (
    <div className="h-[calc(100vh-7rem)]">
      <h1 className="text-2xl font-bold text-foreground mb-6">Messages</h1>
      <div className="flex gap-4 h-[calc(100%-3rem)]">
        <div className="w-80 flex-shrink-0 card-elevated p-3 flex flex-col">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search messages..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-1">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation.id}
                onClick={() => setSelectedConversationId(conversation.id)}
              />
            ))}
          </div>
        </div>
        <ChatArea conversation={selectedConversation} messages={currentMessages} onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
