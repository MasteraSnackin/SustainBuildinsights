
'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { chatWithReport, type ChatWithReportInput } from '@/ai/flows/chat-with-report-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ReportChatbotProps {
  executiveSummaryText: string | null;
  isReportLoading: boolean; // To know if the main report is still loading
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  text: string;
}

export function ReportChatbot({ executiveSummaryText, isReportLoading }: ReportChatbotProps) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);
  
  // Clear chat history when a new report is generated (executiveSummaryText changes)
  useEffect(() => {
    setChatHistory([]);
  }, [executiveSummaryText]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentQuestion(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentQuestion.trim() || !executiveSummaryText) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), type: 'user', text: currentQuestion };
    setChatHistory((prev) => [...prev, userMessage]);
    setCurrentQuestion('');
    setIsBotTyping(true);

    try {
      const input: ChatWithReportInput = {
        reportContext: executiveSummaryText,
        userQuestion: userMessage.text,
      };
      const response = await chatWithReport(input);
      const botMessage: ChatMessage = { id: (Date.now() + 1).toString(), type: 'bot', text: response.botResponse };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error chatting with report:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred with the chatbot.';
      toast({
        variant: 'destructive',
        title: 'Chatbot Error',
        description: errorMessage,
      });
      const errorBotMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: "Sorry, I encountered an error. Please try again."
      };
      setChatHistory((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const isDisabled = isReportLoading || !executiveSummaryText;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold text-primary">
          <Bot className="mr-2 h-6 w-6 text-accent" />
          Chat with Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full pr-4 border rounded-md p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg max-w-[85%]',
                  msg.type === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'mr-auto bg-muted text-muted-foreground'
                )}
              >
                {msg.type === 'bot' && <Bot className="h-5 w-5 shrink-0 text-accent" />}
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                {msg.type === 'user' && <User className="h-5 w-5 shrink-0" />}
              </div>
            ))}
            {isBotTyping && (
              <div className="flex items-start gap-3 p-3 rounded-lg mr-auto bg-muted text-muted-foreground max-w-[85%]">
                <Bot className="h-5 w-5 shrink-0 text-accent" />
                <div className="flex items-center space-x-1">
                  <span className="text-sm">Typing</span>
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                </div>
              </div>
            )}
            {!executiveSummaryText && !isReportLoading && (
              <div className="text-center text-muted-foreground py-8">
                <p>Please generate a report first to enable chat.</p>
              </div>
            )}
             {chatHistory.length === 0 && executiveSummaryText && (
              <div className="text-center text-muted-foreground py-8">
                <p>Ask questions about the executive summary above.</p>
                <p className="text-xs mt-1">For example: "What are the key risks?" or "Summarize the market analysis."</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder={isDisabled ? "Generate report to chat..." : "Ask a question about the summary..."}
            value={currentQuestion}
            onChange={handleInputChange}
            disabled={isBotTyping || isDisabled}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isBotTyping || isDisabled || !currentQuestion.trim()} className="bg-accent hover:bg-accent/90">
            {isBotTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
