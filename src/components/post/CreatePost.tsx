import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Mic, Upload, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type PostPrivacy = "public" | "friends" | "private";
type PostType = "text" | "photo" | "voice";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState<PostPrivacy>("public");
  const [postType, setPostType] = useState<PostType>("text");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handlePrivacyChange = (value: string) => {
    setPrivacy(value as PostPrivacy);
  };

  const handlePhotoClick = () => {
    setPostType("photo");
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPostType("text");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
        setAudioUrl(audioUrl);
        setRecordingComplete(true);
        
        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setPostType("voice");
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordingComplete(false);
    setAudioUrl(null);
    setPostType("text");
  };

  const handlePost = () => {
    // In a real app, this would make an API call to create a post
    console.log({
      type: postType,
      content,
      privacy,
      media: postType === "photo" ? photoPreview : audioUrl,
    });

    // Reset form
    setContent("");
    setPrivacy("public");
    setPostType("text");
    setPhotoPreview(null);
    setRecordingComplete(false);
    setAudioUrl(null);
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={handleContentChange}
        className="border-none bg-secondary resize-none mb-4 focus-visible:ring-1 focus-visible:ring-primary"
      />

      {photoPreview && (
        <div className="relative mb-4">
          <img 
            src={photoPreview} 
            alt="Upload preview" 
            className="w-full rounded-md max-h-72 object-contain bg-secondary" 
          />
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute top-2 right-2 rounded-full" 
            onClick={handleRemovePhoto}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {recordingComplete && audioUrl && (
        <div className="mb-4 p-4 bg-secondary rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Voice message</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={cancelRecording}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
          <audio src={audioUrl} controls className="w-full mt-2" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handlePhotoClick}
            disabled={isRecording || recordingComplete}
            className="text-foreground hover:text-primary"
          >
            <Camera className="h-5 w-5 mr-2" />
            Photo
          </Button>

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
              disabled={photoPreview !== null || recordingComplete}
              className="text-foreground hover:text-primary"
            >
              <Mic className="h-5 w-5 mr-2" />
              Voice
            </Button>
          )}

          <RadioGroup 
            defaultValue="public" 
            value={privacy} 
            onValueChange={handlePrivacyChange}
            className="flex items-center space-x-2 ml-2"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="text-xs cursor-pointer">Public</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="friends" id="friends" />
              <Label htmlFor="friends" className="text-xs cursor-pointer">Friends</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="text-xs cursor-pointer">Private</Label>
            </div>
          </RadioGroup>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={handlePost}
            disabled={!content && !photoPreview && !recordingComplete}
            className="bg-primary hover:bg-primary/90 ml-2"
          >
            <Upload className="h-4 w-4 mr-2" />
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
