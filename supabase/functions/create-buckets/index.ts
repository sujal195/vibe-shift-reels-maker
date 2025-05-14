
// This is an edge function to create storage buckets if they don't exist
// Gets called from client when storage operations are needed

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        "Allow": "POST, OPTIONS",
      },
      status: 204,
    });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default when deployed to Supabase
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase SERVICE_ROLE KEY - env var exported by default when deployed to Supabase
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Create an array of buckets we want to ensure exist
    const bucketsToCreate = [
      { name: "avatars", public: true, fileSizeLimit: 5242880 }, // 5MB
      { name: "posts", public: true, fileSizeLimit: 10485760 }, // 10MB
      { name: "profiles", public: true, fileSizeLimit: 5242880 }, // 5MB
      { name: "media", public: true, fileSizeLimit: 20971520 }, // 20MB
    ];

    // Get list of existing buckets
    const { data: existingBuckets, error: listError } = await supabaseClient.storage.listBuckets();

    if (listError) {
      throw new Error(`Error listing buckets: ${listError.message}`);
    }

    // Create buckets that don't exist yet
    for (const bucket of bucketsToCreate) {
      const exists = existingBuckets?.some((b) => b.name === bucket.name);
      
      if (!exists) {
        console.log(`Creating bucket ${bucket.name}`);
        const { error } = await supabaseClient.storage.createBucket(bucket.name, {
          public: bucket.public,
          fileSizeLimit: bucket.fileSizeLimit,
        });
        
        if (error) {
          console.error(`Error creating bucket ${bucket.name}:`, error);
          // Continue with other buckets even if one fails
        }
      }
    }

    // Create or update RLS policies for buckets
    for (const bucket of bucketsToCreate) {
      // Allow public read access for all buckets
      const readPolicyName = `${bucket.name}_public_read`;
      await supabaseClient.rpc("create_storage_policy", {
        bucket_name: bucket.name,
        policy_name: readPolicyName,
        policy_definition: "TRUE",
        operation: "SELECT",
      }).catch((err) => console.log(`Policy ${readPolicyName} might already exist:`, err.message));

      // Allow authenticated users to upload (insert)
      const insertPolicyName = `${bucket.name}_auth_insert`;
      await supabaseClient.rpc("create_storage_policy", {
        bucket_name: bucket.name,
        policy_name: insertPolicyName,
        policy_definition: "(auth.role() = 'authenticated')",
        operation: "INSERT",
      }).catch((err) => console.log(`Policy ${insertPolicyName} might already exist:`, err.message));

      // Allow users to update their own files
      const updatePolicyName = `${bucket.name}_owner_update`;
      await supabaseClient.rpc("create_storage_policy", {
        bucket_name: bucket.name,
        policy_name: updatePolicyName,
        policy_definition: "(auth.uid() = owner) OR (auth.role() = 'service_role')",
        operation: "UPDATE",
      }).catch((err) => console.log(`Policy ${updatePolicyName} might already exist:`, err.message));

      // Allow users to delete their own files
      const deletePolicyName = `${bucket.name}_owner_delete`;
      await supabaseClient.rpc("create_storage_policy", {
        bucket_name: bucket.name,
        policy_name: deletePolicyName,
        policy_definition: "(auth.uid() = owner) OR (auth.role() = 'service_role')",
        operation: "DELETE",
      }).catch((err) => console.log(`Policy ${deletePolicyName} might already exist:`, err.message));
    }

    return new Response(
      JSON.stringify({ success: true, message: "Storage buckets initialized successfully" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }
});
