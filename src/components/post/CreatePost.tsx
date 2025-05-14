
import { Textarea } from "@/components/ui/textarea";
import PhotoUploader from "@/components/photo/PhotoUploader";
import AudioRecorder from "@/components/post/AudioRecorder";
import PrivacySelector from "./create/PrivacySelector";
import PostButton from "./create/PostButton";
import { usePostCreation } from "@/hooks/usePostCreation";
import { useAuthSession } from "@/hooks/useAuthSession";

const CreatePost = () => {
  const { user } = useAuthSession();
  const {
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
    handlePost
  } = usePostCreation();

  if (!user) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-border max-w-3xl mx-auto">
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={handleContentChange}
        className="border-none bg-secondary resize-none mb-4 focus-visible:ring-1 focus-visible:ring-primary w-full"
        disabled={isPosting}
      />

      <PhotoUploader
        photoPreview={photoPreview}
        onPhotoSelect={handlePhotoSelect}
        onRemovePhoto={handleRemovePhoto}
        disabled={isRecording || recordingComplete || isPosting}
        uploadType="post"
      />

      {!photoPreview && (
        <AudioRecorder
          onAudioRecorded={handleAudioRecorded}
          onCancel={cancelRecording}
          isRecording={isRecording}
          recordingComplete={recordingComplete}
          audioUrl={audioUrl}
        />
      )}

      <div className="flex items-center justify-between flex-wrap gap-2 mt-4">
        <div className="flex flex-wrap gap-2">
          <PrivacySelector
            privacy={privacy}
            onPrivacyChange={handlePrivacyChange}
            disabled={isPosting}
          />
        </div>
        
        <PostButton
          onClick={handlePost}
          disabled={!canPost}
          isPosting={isPosting}
        />
      </div>
    </div>
  );
};

export default CreatePost;
