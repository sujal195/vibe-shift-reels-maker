
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, X, StopCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AudioRecorderProps {
  onAudioRecorded: (audioBlob: Blob, audioUrl: string) => void;
  onCancel: () => void;
  isRecording: boolean;
  recordingComplete: boolean;
  audioUrl: string | null;
}

const AudioRecorder = ({
  onAudioRecorded,
  onCancel,
  isRecording,
  recordingComplete,
  audioUrl
}: AudioRecorderProps) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const [audioVisualization, setAudioVisualization] = useState<number[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize storage buckets
  const ensureStorageBuckets = async () => {
    try {
      const { error } = await supabase.functions.invoke('create-buckets');
      if (error) throw error;
    } catch (err) {
      console.error("Failed to initialize storage:", err);
    }
  };

  const startRecording = async () => {
    try {
      await ensureStorageBuckets();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Set up audio visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start audio visualization
      visualizeAudio();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        
        // Create local URL first for immediate preview
        const localAudioUrl = URL.createObjectURL(audioBlob);
        
        // Upload to Supabase storage in the background
        try {
          const fileName = `voice-${Date.now()}.mp3`;
          
          // Ensure 'media' bucket exists
          const { data: bucketList } = await supabase.storage.listBuckets();
          const mediaBucketExists = bucketList?.some(bucket => bucket.name === 'media');
          
          if (!mediaBucketExists) {
            await supabase.storage.createBucket('media', {
              public: true
            });
          }
          
          const { data, error } = await supabase
            .storage
            .from('media')
            .upload(`voice-notes/${fileName}`, audioBlob);
            
          if (error) throw error;
          
          // Get public URL
          const { data: urlData } = supabase
            .storage
            .from('media')
            .getPublicUrl(`voice-notes/${fileName}`);
          
          // Pass the Supabase URL to the parent component  
          onAudioRecorded(audioBlob, urlData.publicUrl);
        } catch (error) {
          console.error("Error uploading audio:", error);
          toast({
            title: "Upload Error",
            description: "Failed to upload audio. Using local preview instead.",
            variant: "destructive"
          });
          
          // Use local URL as fallback if upload fails
          onAudioRecorded(audioBlob, localAudioUrl);
        }
        
        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop());
        
        // Reset timer
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        // Stop visualization
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        
        setRecordingTime(0);
      };

      // Start the timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      mediaRecorder.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const visualizeAudio = () => {
    if (!analyserRef.current) return;
    
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateVisualization = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Create visualization data - taking only some values for performance
      const visualizationData = Array.from({length: 20}, (_, i) => {
        const index = Math.floor(i * (bufferLength / 20));
        // Normalize value between 2 and 20
        return 2 + (dataArray[index] / 255) * 18;
      });
      
      setAudioVisualization(visualizationData);
      animationRef.current = requestAnimationFrame(updateVisualization);
    };
    
    animationRef.current = requestAnimationFrame(updateVisualization);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop timer
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Stop visualization
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  };

  // Format recording time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      {isRecording ? (
        <div className="flex flex-col gap-2 p-3 bg-secondary rounded-md mb-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-red-500 mr-2 animate-pulse"></span>
              <span className="text-sm font-medium">Recording... {formatTime(recordingTime)}</span>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={stopRecording}
              className="flex items-center"
            >
              <StopCircle className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>
          
          {/* Audio Visualization */}
          <div className="flex items-end h-12 gap-[2px] my-2 justify-center">
            {audioVisualization.map((height, index) => (
              <div 
                key={index}
                className="w-[3px] bg-primary rounded-full"
                style={{ height: `${height}px`, animation: `pulse-slow ${(index % 3) + 1}s infinite` }}
              ></div>
            ))}
          </div>
          
          <div className="w-full bg-muted rounded-full h-1">
            <div 
              className="bg-primary h-1 rounded-full" 
              style={{ width: `${Math.min(recordingTime / 60, 1) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground">Maximum recording time: 1 minute</p>
        </div>
      ) : (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={startRecording}
          disabled={recordingComplete}
          className="text-foreground hover:text-primary"
        >
          <Mic className="h-5 w-5 mr-2" />
          Voice
        </Button>
      )}

      {recordingComplete && audioUrl && (
        <div className="mb-4 p-4 bg-secondary rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Voice message</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
          <audio src={audioUrl} controls className="w-full mt-2" />
        </div>
      )}
    </>
  );
};

export default AudioRecorder;
