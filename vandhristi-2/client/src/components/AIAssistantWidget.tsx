import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Leaf } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';

const KNOWLEDGE_BASE = [
  {
    keywords: ['deforestation', 'cutting', 'trees loss'],
    response: 'Deforestation is the purposeful clearing of forested land. It contributes to climate change, destroys habitats, and reduces biodiversity. Awareness and stringent monitoring are critical to combat this.'
  },
  {
    keywords: ['fra', 'forest rights act', 'act 2006'],
    response: 'The Forest Rights Act (FRA) of 2006 recognizes the rights of forest-dwelling tribal communities and other traditional forest dwellers to forest resources, which they have been relying on for generations.'
  },
  {
    keywords: ['forest', 'woods', 'trees'],
    response: 'Forests are vital ecosystems that cover about 31% of the global land area. They play a crucial role in carbon sequestration, maintaining water cycles, and supporting diverse wildlife.'
  },
  {
    keywords: ['vandrishti', 'what is this', 'about'],
    response: 'VanDrishti is a Decision Support System that tracks Forest Rights Act implementation anomalies, risk levels, and workflow bottlenecks using geospatial and machine learning tools.'
  },
  {
    keywords: ['hello', 'hi', 'hey'],
    response: 'Hello! I am your VanDrishti AI assistant. Ask me anything about forests, deforestation, or the Forest Rights Act (FRA).'
  }
];

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: 'Hi! I am the VanDrishti AI. I can answer your questions about forests, deforestation, and the Forest Rights Act. How can I help you today?', isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const lowerQuery = userMessage.toLowerCase();
      let foundResponse = "I'm sorry, I don't have information on that specific topic. Try asking about deforestation, the Forest Rights Act (FRA), or general forest awareness.";

      for (const entry of KNOWLEDGE_BASE) {
        if (entry.keywords.some(kw => lowerQuery.includes(kw))) {
          foundResponse = entry.response;
          break;
        }
      }

      setMessages(prev => [...prev, { text: foundResponse, isUser: false }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <Card className="w-[350px] h-[500px] mb-4 flex flex-col shadow-2xl border-border bg-card/95 backdrop-blur-md">
          <CardHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-background p-1 flex items-center justify-center">
                <img src="/vandrishti_icon.png" alt="VanDrishti AI" className="w-full h-full object-contain" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-foreground">VanDrishti AI</CardTitle>
                <p className="text-xs text-muted-foreground">Forest & FRA Expert</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <X size={18} />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-foreground rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="p-3 border-t border-border bg-background/50 rounded-b-xl">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex w-full items-center space-x-2"
            >
              <Input
                type="text"
                placeholder="Ask about forests or FRA..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 h-9 bg-background border-border text-sm focus-visible:ring-1"
              />
              <Button type="submit" size="icon" className="h-9 w-9 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Send size={16} />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-2xl p-0 hover:scale-105 transition-transform bg-background border border-border flex items-center justify-center overflow-hidden"
      >
        {isOpen ? (
          <X className="text-foreground" size={24} />
        ) : (
          <img src="/vandrishti_icon.png" alt="AI Assistant" className="w-10 h-10 object-contain drop-shadow-md" />
        )}
      </Button>
    </div>
  );
}
