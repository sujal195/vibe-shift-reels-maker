
import { Textarea } from "@/components/ui/textarea";
import PhotoUploader from "./create/PhotoUploader";
import AudioRecorder from "./create/AudioRecorder";
import PrivacySelector from "./create/PrivacySelector";
import PostButton from "./create/PostButton";
import { usePostCreation } from "@/hooks/usePostCreation";

const CreatePost = () => {
  const {
    content,
    privacy,
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
  } = usePostCreation();

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-border max-w-3xl mx-auto">
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={handleContentChange}
        className="border-none bg-secondary resize-none mb-4 focus-visible:ring-1 focus-visible:ring-primary w-full"
      />

      <PhotoUploader
        photoPreview={photoPreview}
        onPhotoSelect={handlePhotoSelect}
        onRemovePhoto={handleRemovePhoto}
        disabled={isRecording || recordingComplete}
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
          />
        </div>
        
        <PostButton
          onClick={handlePost}
          disabled={!canPost}
        />
      </div>
    </div>
  );
};

export default CreatePost;
