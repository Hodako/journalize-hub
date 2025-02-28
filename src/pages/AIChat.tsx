
import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, Bot, Sparkles, HelpCircle, Book, Search, Brain } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Preset commands
  const presetCommands = [
    { icon: <Sparkles className="h-4 w-4" />, text: "Tell me a fun fact about Bangladesh" },
    { icon: <Book className="h-4 w-4" />, text: "Summarize the latest news" },
    { icon: <Search className="h-4 w-4" />, text: "What's your opinion on AI ethics?" },
    { icon: <Brain className="h-4 w-4" />, text: "Explain quantum computing simply" }
  ];

  useEffect(() => {
    // Add welcome message when component mounts
    setMessages([
      { 
        role: "assistant", 
        content: "👋 Hello! I'm the BanguJournal AI assistant. How can I help you today?" 
      }
    ]);
    
    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await supabase.functions.invoke('chat-with-ai', {
        body: { message: userMessage }
      });

      if (response.error) throw response.error;

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: response.data.response 
      }]);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to get AI response");
      
      // Add error message from AI
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I encountered an error processing your request. Please try again later." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetCommand = (command: string) => {
    setInput(command);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Chat with BanguAI</h1>
            <p className="text-muted-foreground">Powered by Gemini AI to answer your questions</p>
          </div>
          
          <Card className="border-primary/20 shadow-lg">
            <CardContent className="p-6">
              <ScrollArea className="h-[60vh] mb-4 pr-4 rounded-lg">
                <div className="space-y-4 p-2">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "assistant" ? "justify-start" : "justify-end"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "assistant"
                            ? "bg-muted"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Preset Commands */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {presetCommands.map((command, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="text-xs justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                    onClick={() => handlePresetCommand(command.text)}
                  >
                    {command.icon}
                    <span className="ml-2 truncate">{command.text}</span>
                  </Button>
                ))}
              </div>
              
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading}
                  className="border-primary/20 focus:border-primary"
                />
                <Button type="submit" disabled={loading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              
              <p className="mt-4 text-xs text-center text-muted-foreground">
                BanguAI is powered by Gemini. Your conversations may be stored to improve our service.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIChat;
