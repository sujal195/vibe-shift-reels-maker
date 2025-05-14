
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// The edge function to ensure all required storage buckets exist
Deno.serve(async (req) => {
  try {
    // Initialize the Supabase client with the correct environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Define all the buckets we need
    const requiredBuckets = [
      { name: 'avatars', public: true, folderPaths: ['profile-pictures/', 'cover-pictures/'] },
      { name: 'posts', public: true, folderPaths: [] },
      { name: 'media', public: true, folderPaths: ['voice-notes/'] }
    ]
    
    const results: Record<string, any> = {}
    
    // Check all existing buckets first
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      return new Response(JSON.stringify({
        error: `Error listing buckets: ${listError.message}`
      }), { status: 400 })
    }
    
    // Create buckets if they don't exist
    for (const bucket of requiredBuckets) {
      const exists = existingBuckets?.some(b => b.name === bucket.name)
      
      if (!exists) {
        const { data, error } = await supabase.storage.createBucket(
          bucket.name,
          { public: bucket.public }
        )
        
        if (error) {
          results[bucket.name] = `Error creating bucket: ${error.message}`
        } else {
          results[bucket.name] = 'Created successfully'
          
          // Create RLS policies for the bucket to allow authenticated users to upload files
          await supabase.rpc('create_storage_policy', {
            bucket_name: bucket.name,
            definition: 'auth.uid() = auth.uid()', // Allow any authenticated user
          })
        }
      } else {
        results[bucket.name] = 'Already exists'
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Bucket initialization complete',
      results
    }), { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    })
  } catch (err) {
    return new Response(JSON.stringify({
      error: `Unexpected error: ${err.message}`
    }), { 
      headers: { 'Content-Type': 'application/json' },
      status: 500 
    })
  }
})
