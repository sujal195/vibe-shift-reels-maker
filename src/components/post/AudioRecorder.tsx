import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, X, StopCircle } from "lucide-react";
import { ensureStorageBuckets } from "@/utils/storageUtils";

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

  const startRecording = async () => {
    try {
      // We still call ensureStorageBuckets, but it now just returns true
      await ensureStorageBuckets();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onAudioRecorded(audioBlob, audioUrl);
        
        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop());
        
        // Reset timer
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
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
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop timer
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
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
