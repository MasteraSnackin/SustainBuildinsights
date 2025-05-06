
'use client';

import type {SVGProps} from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Download, Podcast, Volume2, Play, Pause, Loader2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePodcastAudio, type GeneratePodcastAudioInput } from '@/ai/flows/generate-podcast-audio-flow';
import { cn } from '@/lib/utils';

interface ReportActionsProps {
  reportContent: string | null;
}

export function ReportActions({ reportContent }: ReportActionsProps) {
  const { toast } = useToast();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);

  const [isPodcastLoading, setIsPodcastLoading] = useState(false);
  const [podcastAudioUrl, setPodcastAudioUrl] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);


  useEffect(() => {
    // Ensure window.speechSynthesis is accessed only on the client
    if (typeof window !== 'undefined') {
      speechSynthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    const synth = speechSynthRef.current;
    if (reportContent && synth) {
      const newUtterance = new SpeechSynthesisUtterance(reportContent);
      newUtterance.onstart = () => setIsSpeaking(true);
      newUtterance.onend = () => {
        setIsSpeaking(false);
         // HACK: Force re-render for button state update on Safari/iOS
        setTimeout(() => setIsSpeaking(false), 0);
      };
      newUtterance.onpause = () => setIsSpeaking(false);
      newUtterance.onresume = () => setIsSpeaking(true);
      newUtterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
        toast({
          title: 'Speech Error',
          description: 'Could not read the report aloud. ' + event.error,
          variant: 'destructive',
        });
      };
      setUtterance(newUtterance);
    } else {
      setUtterance(null);
    }

    // Cleanup: cancel speech if component unmounts or reportContent changes
    return () => {
      if (synth && synth.speaking) {
        synth.cancel();
      }
      setIsSpeaking(false);
    };
  }, [reportContent, toast]);
  
  // Reset podcast when report content changes
  useEffect(() => {
    setPodcastAudioUrl(null);
    setIsPodcastLoading(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = '';
    }
  }, [reportContent]);


  const handleEmailReport = () => {
    if (!reportContent) {
      toast({ title: 'Error', description: 'No report content to email.', variant: 'destructive' });
      return;
    }
    // This is a placeholder. Actual email functionality requires backend integration.
    // For example, using mailto: or a server-side email service.
    const subject = encodeURIComponent('Property Redevelopment Report');
    const body = encodeURIComponent(reportContent);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    
    // Check if mailtoLink exceeds typical URL length limits (around 2000 chars)
    if (mailtoLink.length > 2000) {
       toast({
        title: 'Report Too Long for Email',
        description: 'The report is too long to be sent directly via a mailto link. Please download and attach it manually.',
        variant: 'destructive'
      });
    } else {
      window.location.href = mailtoLink;
      toast({ title: 'Email Client Opened', description: 'Your email client should now be open with the report.' });
    }
    console.log('Email report content ready.');
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

  const handleConvertToPodcast = async () => {
    if (!reportContent) {
      toast({ title: 'Error', description: 'No report content to convert.', variant: 'destructive' });
      return;
    }
    if (podcastAudioUrl) { // If already generated, just play or clear
      if (audioPlayerRef.current) {
        if (audioPlayerRef.current.paused) {
          audioPlayerRef.current.play().catch(e => console.error("Error playing audio:", e));
        } else {
          audioPlayerRef.current.pause();
        }
      }
      return;
    }

    setIsPodcastLoading(true);
    setPodcastAudioUrl(null);

    try {
      const input: GeneratePodcastAudioInput = { text: reportContent };
      const response = await generatePodcastAudio(input);
      setPodcastAudioUrl(response.audioDataUri);
      toast({ title: 'Podcast Ready', description: 'Your podcast audio has been generated.' });
      // Automatically play once loaded
      if (audioPlayerRef.current) {
          // audioPlayerRef.current.load(); // src is updated, load should happen
          // audioPlayerRef.current.play().catch(e => console.error("Error auto-playing audio:", e));
      }

    } catch (error) {
      console.error('Error generating podcast audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Podcast Generation Error',
        description: `Failed to generate podcast: ${errorMessage}`,
      });
      setPodcastAudioUrl(null);
    } finally {
      setIsPodcastLoading(false);
    }
  };
  
  const clearPodcast = () => {
    setPodcastAudioUrl(null);
    if(audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = '';
    }
  }

  const handleReadAloud = () => {
    const synth = speechSynthRef.current;
    if (!reportContent || !utterance || !synth) {
      toast({ title: 'Error', description: 'No report content or speech synthesizer available.', variant: 'destructive' });
      return;
    }

    if (synth.speaking) {
      if (synth.paused) { // Is paused, so resume
        synth.resume();
        setIsSpeaking(true);
      } else { // Is speaking, so pause
        synth.pause();
        setIsSpeaking(false);
      }
    } else { // Not speaking, so start
      // Cancel any previous speech just in case state is out of sync
      synth.cancel(); 
      synth.speak(utterance);
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
      <CardContent className="flex flex-col gap-2 p-3">
        <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleEmailReport} disabled={isPodcastLoading}>
            <Mail className="mr-2 h-4 w-4" />
            Email Report
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadReport} disabled={isPodcastLoading}>
            <Download className="mr-2 h-4 w-4" />
            Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleConvertToPodcast} disabled={isPodcastLoading || (speechSynthRef.current?.speaking && isSpeaking)}>
            {isPodcastLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : podcastAudioUrl ? (
                 audioPlayerRef.current && !audioPlayerRef.current.paused ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />
            ) : (
                <Podcast className="mr-2 h-4 w-4" />
            )}
            {isPodcastLoading ? 'Generating...' : podcastAudioUrl ? (audioPlayerRef.current && !audioPlayerRef.current.paused ? 'Pause Podcast' : 'Play Podcast') : 'To Podcast'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReadAloud} disabled={isPodcastLoading || !speechSynthRef.current}>
            {isSpeaking ? (
                <Pause className="mr-2 h-4 w-4" />
            ) : (
                <Play className="mr-2 h-4 w-4" />
            )}
            {isSpeaking ? 'Pause Reading' : 'Read Aloud'}
            </Button>
        </div>
        {podcastAudioUrl && (
          <div className="mt-2 p-2 border rounded-md bg-muted/50 flex items-center gap-2">
            <audio 
              ref={audioPlayerRef} 
              src={podcastAudioUrl} 
              controls 
              className="w-full h-10"
              onPlay={() => setIsSpeaking(false)} // Stop browser read-aloud if podcast plays
              onCanPlayThrough={() => {
                if (audioPlayerRef.current && isPodcastLoading === false) { // Check isPodcastLoading to prevent auto-play on initial load if not intended
                  // audioPlayerRef.current.play().catch(e => console.error("Error auto-playing audio:", e));
                }
              }}
            />
            <Button variant="ghost" size="icon" onClick={clearPodcast} aria-label="Clear podcast audio">
              <XCircle className="h-5 w-5 text-destructive" />
            </Button>
          </div>
        )}
         {!speechSynthRef.current && <p className="text-xs text-muted-foreground">Speech synthesis not available in this browser.</p>}
      </CardContent>
    </Card>
  );
}
