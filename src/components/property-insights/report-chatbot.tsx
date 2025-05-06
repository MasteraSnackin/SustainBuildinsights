'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Loader2, Mic, MicOff } from 'lucide-react';
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

  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = useState(true);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        setBrowserSupportsSpeechRecognition(false);
        console.warn('Speech Recognition API is not supported in this browser.');
        return;
      }

      const recogInstance = new SpeechRecognitionAPI();
      recogInstance.continuous = false;
      recogInstance.interimResults = true;
      recogInstance.lang = 'en-US';

      recogInstance.onstart = () => {
        setIsListening(true);
      };

      recogInstance.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setCurrentQuestion(finalTranscript || interimTranscript);
        if (finalTranscript) {
          // Optional: auto-submit if final transcript is received
          // handleSubmitFormWithText(finalTranscript);
        }
      };

      recogInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = 'Speech recognition error.';
        if (event.error === 'no-speech') {
          errorMessage = 'No speech was detected. Please try again.';
        } else if (event.error === 'audio-capture') {
          errorMessage = 'Audio capture failed. Please ensure your microphone is working.';
        } else if (event.error === 'not-allowed') {
          errorMessage = 'Permission to use microphone was denied. Please enable it in your browser settings.';
        }
        toast({
          variant: 'destructive',
          title: 'Voice Input Error',
          description: errorMessage,
        });
        setIsListening(false);
      };

      recogInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recogInstance);

      return () => {
        if (recogInstance) {
          recogInstance.stop();
          recogInstance.onstart = null;
          recogInstance.onresult = null;
          recogInstance.onerror = null;
          recogInstance.onend = null;
        }
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  
  useEffect(() => {
    setChatHistory([]);
  }, [executiveSummaryText]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentQuestion(e.target.value);
  };

  const handleSubmitFormWithText = async (text: string) => {
     if (!text.trim() || !executiveSummaryText) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), type: 'user', text };
    setChatHistory((prev) => [...prev, userMessage]);
    setCurrentQuestion(''); // Clear input after sending
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
      const errorMessageText = error instanceof Error ? error.message : 'An unknown error occurred with the chatbot.';
      toast({
        variant: 'destructive',
        title: 'Chatbot Error',
        description: errorMessageText,
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
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitFormWithText(currentQuestion);
  };
  
  const handleToggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Unsupported Feature',
        description: 'Voice input is not supported by your browser.',
      });
      return;
    }
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        setCurrentQuestion(''); // Clear current question before starting new recognition
        recognition.start();
      }
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
             {isListening && (
              <div className="flex items-start gap-3 p-3 rounded-lg mr-auto bg-muted text-muted-foreground max-w-[85%]">
                <Mic className="h-5 w-5 shrink-0 text-accent animate-pulse" />
                <div className="flex items-center space-x-1">
                  <span className="text-sm">Listening...</span>
                </div>
              </div>
            )}
            {!executiveSummaryText && !isReportLoading && (
              <div className="text-center text-muted-foreground py-8">
                <p>Please generate a report first to enable chat.</p>
              </div>
            )}
             {chatHistory.length === 0 && executiveSummaryText && !isListening && (
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
            placeholder={
              isDisabled ? "Generate report to chat..." 
              : isListening ? "Listening..." 
              : "Ask a question or use mic..."
            }
            value={currentQuestion}
            onChange={handleInputChange}
            disabled={isBotTyping || isDisabled || isListening}
            className="flex-1"
          />
          {browserSupportsSpeechRecognition && (
            <Button 
              type="button" 
              size="icon" 
              variant={isListening ? "destructive" : "outline"}
              onClick={handleToggleListening} 
              disabled={isBotTyping || isDisabled}
              aria-label={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          <Button type="submit" size="icon" disabled={isBotTyping || isDisabled || !currentQuestion.trim() || isListening} className="bg-accent hover:bg-accent/90">
            {isBotTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}