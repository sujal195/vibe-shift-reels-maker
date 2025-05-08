
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "@/hooks/useAuthSession";
import { toast } from "@/components/ui/use-toast";
import { PostPrivacy } from "@/components/post/create/PrivacySelector";
import { safeQuery } from "@/utils/supabaseUtils";

export type PostType = "text" | "photo" | "voice";

export const usePostCreation = () => {
  const { user } = useAuthSession();
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState<PostPrivacy>("public");
  const [postType, setPostType] = useState<PostType>("text");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handlePrivacyChange = (value: PostPrivacy) => {
    setPrivacy(value);
  };

  const handlePhotoSelect = (file: File, publicUrl: string) => {
    setPhotoPreview(publicUrl);
    setPostType("photo");
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPostType("text");
  };

  const handleAudioRecorded = (url: string) => {
    setAudioUrl(url);
    setIsRecording(false);
    setRecordingComplete(true);
    setPostType("voice");
  };

  const startRecording = () => {
    setIsRecording(true);
    setPostType("voice");
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setRecordingComplete(false);
    setAudioUrl(null);
    setPostType("text");
  };

  const handlePost = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to create a post",
        variant: "destructive"
      });
      return;
    }

    if (!content && !photoPreview && !audioUrl) {
      toast({
        title: "Error",
        description: "Please add content, a photo, or an audio recording",
        variant: "destructive"
      });
      return;
    }

    setIsPosting(true);
    
    try {
      // In a real app, this would make an API call to create a post
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();
      
      const postsApi = await safeQuery('posts');
      const { data, error } = await postsApi
        .insert({
          user_id: user.id,
          content,
          privacy,
          media_type: postType,
          media_url: postType === "photo" ? photoPreview : audioUrl,
          created_at: new Date().toISOString(),
        })
        .select();
      
      if (error) {
        console.error("Error creating post:", error);
        toast({
          title: "Error",
          description: "Failed to create post. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Notify admin about new post
      try {
        await fetch(`${window.location.origin.includes('localhost') 
          ? 'https://gfhcmeicnbccihtyclbj.supabase.co' 
          : window.location.origin}/functions/v1/notify-admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'post_created',
            user: profile?.display_name || user.email,
            email: user.email,
            post: {
              content,
              mediaType: postType
            }
          }),
        });
      } catch (e) {
        console.error('Failed to notify admin:', e);
      }

      // Reset form
      setContent("");
      setPrivacy("public");
      setPostType("text");
      setPhotoPreview(null);
      setRecordingComplete(false);
      setAudioUrl(null);

      toast({
        title: "Post created",
        description: "Your post has been created successfully"
      });
    } catch (error) {
      console.error("Error in post creation:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsPosting(false);
    }
  };

  const canPost = (!!content || !!photoPreview || recordingComplete) && !isPosting;

  return {
    content,
    privacy,
    postType,
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
    handlePost
  };
};
