'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Download, Podcast, Volume2, Play, Pause, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportActionsProps {
  reportContent: string | null;
}

export function ReportActions({ reportContent }: ReportActionsProps) {
  const { toast } = useToast();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (reportContent) {
      const newUtterance = new SpeechSynthesisUtterance(reportContent);
      newUtterance.onend = () => setIsSpeaking(false);
      setUtterance(newUtterance);
    }

    // Cleanup: cancel speech if component unmounts while speaking
    return () => {
      synth.cancel();
    };
  }, [reportContent]);


  const handleEmailReport = () => {
    if (!reportContent) {
      toast({ title: 'Error', description: 'No report content to email.', variant: 'destructive' });
      return;
    }
    // This is a placeholder. Actual email functionality requires backend integration.
    toast({ title: 'Email Report', description: 'Email functionality is not yet implemented.' });
    console.log('Email report:', reportContent);
  };

  const handleDownloadReport = () => {
    if (!reportContent) {
      toast({ title: 'Error', description: 'No report content to download.', variant: 'destructive' });
      return;
    }
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'property_redevelopment_report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: 'Download Started', description: 'Your report is downloading.' });
  };

  const handleConvertToPodcast = () => {
    if (!reportContent) {
      toast({ title: 'Error', description: 'No report content to convert.', variant: 'destructive' });
      return;
    }
    // This is a placeholder. Actual podcast generation is complex and requires GenAI/TTS backend.
    toast({ title: 'Convert to Podcast', description: 'Podcast conversion functionality is not yet implemented.' });
    console.log('Convert to podcast:', reportContent);
  };

  const handleReadAloud = () => {
    const synth = window.speechSynthesis;
    if (!reportContent || !utterance) {
      toast({ title: 'Error', description: 'No report content to read.', variant: 'destructive' });
      return;
    }

    if (synth.speaking) {
      if (isSpeaking) { // If it's currently speaking this utterance
        synth.pause();
        setIsSpeaking(false);
      } else { // If something else is speaking, or it's paused
        synth.cancel(); // Stop other speech
        synth.speak(utterance);
        setIsSpeaking(true);
      }
    } else { // Not speaking, or was paused and now wants to resume/start
        if(synth.paused && utterance === synth.getVoices()[0]?.name){ // Check if this utterance was paused
            synth.resume();
        } else {
            synth.speak(utterance);
        }
        setIsSpeaking(true);
    }
  };


  if (!reportContent) {
    return null; // Don't render if no report content
  }

  return (
    <Card className="mb-6 shadow-md sticky top-[57px] z-5 bg-background/95 backdrop-blur-sm">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-lg font-medium text-primary">Report Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 p-3">
        <Button variant="outline" size="sm" onClick={handleEmailReport}>
          <Mail className="mr-2 h-4 w-4" />
          Email Report
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownloadReport}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={handleConvertToPodcast}>
          <Podcast className="mr-2 h-4 w-4" />
          To Podcast
        </Button>
        <Button variant="outline" size="sm" onClick={handleReadAloud} disabled={isLoadingAudio}>
          {isLoadingAudio ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isSpeaking ? (
            <Pause className="mr-2 h-4 w-4" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          {isSpeaking ? 'Pause' : 'Read Aloud'}
        </Button>
      </CardContent>
    </Card>
  );
}
