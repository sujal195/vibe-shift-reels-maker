import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "./useAuthSession";
import { ensureStorageBuckets } from "@/utils/storageUtils";

type Privacy = "public" | "friends" | "private";

export function usePostCreation() {
  const { user } = useAuthSession();
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState<Privacy>("public");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handlePrivacyChange = (value: Privacy) => {
    setPrivacy(value);
  };

  const handlePhotoSelect = (file: File, preview: string) => {
    setPhotoFile(file);
    setPhotoPreview(preview);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingComplete(false);
    setAudioUrl(null);
    setAudioBlob(null);
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setRecordingComplete(false);
    setAudioUrl(null);
    setAudioBlob(null);
  };

  const handleAudioRecorded = (audioBlob: Blob, url: string) => {
    setAudioBlob(audioBlob);
    setAudioUrl(url);
    setIsRecording(false);
    setRecordingComplete(true);
  };

  const canPost = Boolean(user && (content.trim() || photoFile || audioBlob) && !isPosting);

  const handlePost = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to create a post",
        variant: "destructive",
      });
      return;
    }

    if (!canPost) return;

    setIsPosting(true);

    try {
      // First, ensure storage buckets are initialized
      const bucketsInitialized = await ensureStorageBuckets();
      if (!bucketsInitialized) {
        throw new Error("Failed to initialize storage buckets");
      }

      // Handle media upload if needed
      let mediaUrl = null;
      let mediaType = null;
      
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        // Upload photo to the posts bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(filePath, photoFile);

        if (uploadError) {
          throw new Error(`Error uploading file: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath);

        mediaUrl = urlData.publicUrl;
        mediaType = 'image';
      } else if (audioBlob) {
        const filePath = `${user.id}/${Date.now()}.webm`;
        
        // Upload audio to the posts bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(filePath, audioBlob);

        if (uploadError) {
          throw new Error(`Error uploading audio: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath);

        mediaUrl = urlData.publicUrl;
        mediaType = 'audio';
      }

      // Create post record
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content,
          privacy,
          media_url: mediaUrl,
          media_type: mediaType,
        });

      if (postError) {
        throw new Error(`Error creating post: ${postError.message}`);
      }

      toast({
        title: "Post created",
        description: "Your memory has been shared successfully!",
      });

      // Reset form
      setContent("");
      setPhotoFile(null);
      setPhotoPreview(null);
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingComplete(false);
      setPrivacy("public");
      
      // Trigger a page refresh to show the new post
      window.location.reload();

    } catch (error: any) {
      toast({
        title: "Error creating post",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return {
    content,
    privacy,
    photoPreview,
    isRecording,
    recordingComplete,
    audioUrl,
    isPosting,
    canPost,
    handleContentChange,
    handlePrivacyChange,
    handlePhotoSelect,
    handleRemovePhoto,
    handleAudioRecorded,
    startRecording,
    cancelRecording,
    handlePost,
  };
}
