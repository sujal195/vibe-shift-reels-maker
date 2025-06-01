
import { supabase } from "@/integrations/supabase/client";

export const ensureStorageBuckets = async (): Promise<boolean> => {
  console.log("Skipping bucket creation - using existing ones.");
  return true;
};

export const getFileUrl = (bucket: string, filePath: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

export const uploadFile = async (
  bucket: string,
  filePath: string,
  file: File
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    return getFileUrl(bucket, data.path);
  } catch (error) {
    console.error('Upload exception:', error);
    return null;
  }
};
