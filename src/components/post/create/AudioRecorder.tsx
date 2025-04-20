
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, X } from "lucide-react";

interface AudioRecorderProps {
  onAudioRecorded: (audioUrl: string) => void;
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

  const startRecording = async () => {
    try {
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
        onAudioRecorded(audioUrl);
        
        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <>
      {isRecording ? (
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={stopRecording}
        >
          <span className="h-2 w-2 rounded-full bg-white mr-2 animate-pulse" />
          Stop Recording
        </Button>
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
