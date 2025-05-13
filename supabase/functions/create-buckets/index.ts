
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );

    // Define buckets to create
    const requiredBuckets = ['media', 'avatars', 'profiles', 'posts'];
    const results = [];
    
    // Check if buckets exist, create if not
    const { data: buckets, error: bucketsError } = await supabaseAdmin
      .storage
      .listBuckets();

    if (bucketsError) throw bucketsError;
    
    const existingBuckets = buckets.map(bucket => bucket.name);
    
    for (const bucketName of requiredBuckets) {
      if (!existingBuckets.includes(bucketName)) {
        // Create bucket if it doesn't exist
        const { data, error } = await supabaseAdmin.storage.createBucket(bucketName, {
          public: true, // Make all uploaded files publicly accessible
          fileSizeLimit: 10485760, // 10MB
        });
        
        if (error) throw error;
        
        // Create a policy that allows authenticated users to upload files
        const { error: policyError } = await supabaseAdmin
          .storage
          .from(bucketName)
          .createSignedUploadUrl('test.txt');
          
        if (policyError) console.error(`Policy error for ${bucketName}:`, policyError);
        
        results.push(`Created bucket: ${bucketName}`);
      } else {
        results.push(`Bucket already exists: ${bucketName}`);
        
        // Update bucket to be public
        try {
          await supabaseAdmin.storage.updateBucket(bucketName, {
            public: true
          });
          results.push(`Updated ${bucketName} to be public`);
        } catch (err) {
          console.error(`Error updating ${bucketName}:`, err);
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Storage buckets verified", 
      results 
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 200,
    });
  } catch (error) {
    console.error("Error in create-buckets function:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500,
    });
  }
});
