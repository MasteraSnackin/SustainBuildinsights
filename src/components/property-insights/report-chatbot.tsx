'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
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
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  
  // Speech Synthesis
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isChatbotSpeaking, setIsChatbotSpeaking] = useState(false);
  const [enableVoiceOutput, setEnableVoiceOutput] = useState(true);

  // Speech Recognition
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = useState(true);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthRef.current = window.speechSynthesis;
      
      const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        setBrowserSupportsSpeechRecognition(false);
        console.warn('Speech Recognition API is not supported in this browser.');
        return;
      }

      const recogInstance = new SpeechRecognitionAPI();
      recogInstance.continuous = false; // Listen for a single utterance
      recogInstance.interimResults = true; // Get results as user speaks
      recogInstance.lang = 'en-US';

      recogInstance.onstart = () => {
        setIsListening(true);
        cancelSpeech(); // Stop bot speaking when user starts talking
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
        // Optionally auto-submit if final transcript is received and user pauses
        // if (finalTranscript) {
        //   handleSubmitFormWithText(finalTranscript);
        // }
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
        cancelSpeech(); // Ensure speech is cancelled on unmount
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  const speakText = useCallback((text: string) => {
    if (!speechSynthRef.current || !enableVoiceOutput) return;

    cancelSpeech(); // Cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsChatbotSpeaking(true);
    utterance.onend = () => setIsChatbotSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsChatbotSpeaking(false);
      toast({ title: 'Speech Error', description: 'Could not read the response aloud.', variant: 'destructive' });
    };
    setCurrentUtterance(utterance);
    speechSynthRef.current.speak(utterance);
  }, [enableVoiceOutput, toast]);

  const cancelSpeech = useCallback(() => {
    if (speechSynthRef.current && speechSynthRef.current.speaking) {
      speechSynthRef.current.cancel();
    }
    setIsChatbotSpeaking(false);
    setCurrentUtterance(null);
  }, []);

  const toggleVoiceOutput = () => {
    setEnableVoiceOutput(prev => {
      if (!prev) { // if turning on
        // If there was a last message from bot, speak it.
        const lastBotMessage = chatHistory.filter(m => m.type === 'bot').pop();
        if(lastBotMessage) speakText(lastBotMessage.text);
      } else { // if turning off
        cancelSpeech();
      }
      return !prev;
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  const handleSubmitFormWithText = async (questionText: string) => {
    if (!questionText.trim() || !executiveSummaryText) {
      if (!executiveSummaryText) {
        toast({ title: 'No Report', description: 'Please generate a report first.', variant: 'destructive'});
      }
      return;
    }

    const newUserMessage: ChatMessage = { id: Date.now().toString(), type: 'user', text: questionText };
    setChatHistory(prev => [...prev, newUserMessage]);
    setCurrentQuestion('');
    setIsBotTyping(true);

    try {
      const input: ChatWithReportInput = {
        reportContext: executiveSummaryText,
        userQuestion: questionText,
      };
      const response = await chatWithReport(input);
      const botResponse: ChatMessage = { id: (Date.now() + 1).toString(), type: 'bot', text: response.botResponse };
      setChatHistory(prev => [...prev, botResponse]);
      if (enableVoiceOutput) {
        speakText(response.botResponse);
      }
    } catch (error) {
      console.error('Error chatting with report:', error);
      const errorMessageText = error instanceof Error ? error.message : 'An unexpected error occurred.';
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: `Sorry, I encountered an error: ${errorMessageText}`,
      };
      setChatHistory(prev => [...prev, errorResponse]);
      toast({ variant: 'destructive', title: 'Chat Error', description: errorMessageText });
    } finally {
      setIsBotTyping(false);
    }
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitFormWithText(currentQuestion);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentQuestion(e.target.value);
  };

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition || !recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };


  const isChatDisabled = isReportLoading || !executiveSummaryText;

  if (isReportLoading) {
     return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-lg font-medium text-primary">Chat with Report</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Report is generating... Chat will be available soon.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!executiveSummaryText) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-lg font-medium text-primary">Chat with Report</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-2" />
            <p>Generate a report to start chatting about its summary.</p>
          </div>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="h-full flex flex-col shadow-md">
      <CardHeader className="pb-2 pt-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium text-primary">Chat with Report</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleVoiceOutput}
          title={enableVoiceOutput ? "Mute voice output" : "Enable voice output"}
          className={cn(enableVoiceOutput ? "text-accent" : "text-muted-foreground")}
          disabled={!speechSynthRef.current}
        >
          {enableVoiceOutput ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          {chatHistory.map(message => (
            <div key={message.id} className={cn('mb-3 flex', message.type === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn('p-2 rounded-lg max-w-[80%] flex items-start gap-2', message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                {message.type === 'bot' && <Bot className="h-5 w-5 mt-0.5 shrink-0" />}
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                {message.type === 'user' && <User className="h-5 w-5 mt-0.5 shrink-0" />}
              </div>
            </div>
          ))}
          {isBotTyping && (
            <div className="mb-3 flex justify-start">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm italic">AI is typing...</span>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
          {browserSupportsSpeechRecognition && (
             <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={toggleListening}
                title={isListening ? "Stop listening" : "Start voice input"}
                className={cn(isListening && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
                disabled={isChatDisabled || !recognition}
              >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          )}
          <Input
            type="text"
            placeholder={isChatDisabled ? "Generate a report first..." : "Ask about the report..."}
            value={currentQuestion}
            onChange={handleInputChange}
            disabled={isBotTyping || isChatDisabled}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isBotTyping || !currentQuestion.trim() || isChatDisabled}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
