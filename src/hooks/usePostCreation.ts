
import { useState, useRef } from "react";
import { PostPrivacy } from "@/components/post/create/PrivacySelector";

export type PostType = "text" | "photo" | "voice";

export const usePostCreation = () => {
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState<PostPrivacy>("public");
  const [postType, setPostType] = useState<PostType>("text");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handlePrivacyChange = (value: PostPrivacy) => {
    setPrivacy(value);
  };

  const handlePhotoSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
      setPostType("photo");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPostType("text");
  };

  const handleAudioRecorded = (url: string) => {
    setAudioUrl(url);
    setIsRecording(false);
    setRecordingComplete(true);
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

  const canPost = !!content || !!photoPreview || recordingComplete;

  return {
    content,
    privacy,
    postType,
    photoPreview,
    isRecording,
    recordingComplete,
    audioUrl,
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
