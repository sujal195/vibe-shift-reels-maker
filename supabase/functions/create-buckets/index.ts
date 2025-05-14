
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
      console.error("Error listing buckets:", listError)
      return new Response(JSON.stringify({
        error: `Error listing buckets: ${listError.message}`
      }), { 
        headers: { 'Content-Type': 'application/json' },
        status: 400 
      })
    }
    
    // Create buckets if they don't exist
    for (const bucket of requiredBuckets) {
      const exists = existingBuckets?.some(b => b.name === bucket.name)
      
      if (!exists) {
        console.log(`Creating bucket: ${bucket.name}`)
        const { data, error } = await supabase.storage.createBucket(
          bucket.name,
          { public: bucket.public }
        )
        
        if (error) {
          console.error(`Error creating bucket ${bucket.name}:`, error)
          results[bucket.name] = `Error creating bucket: ${error.message}`
        } else {
          console.log(`Bucket ${bucket.name} created successfully`)
          results[bucket.name] = 'Created successfully'
          
          // Create necessary folders within the bucket
          if (bucket.folderPaths.length > 0) {
            for (const folderPath of bucket.folderPaths) {
              // Create an empty file to establish the folder
              const { error: folderError } = await supabase.storage
                .from(bucket.name)
                .upload(`${folderPath}.gitkeep`, new Uint8Array(0))
              
              if (folderError && !folderError.message.includes('The resource already exists')) {
                console.error(`Error creating folder ${folderPath}:`, folderError)
              } else {
                console.log(`Folder ${folderPath} created successfully in ${bucket.name}`)
              }
            }
          }
          
          // Set up public access policy for the bucket
          try {
            const policyName = `allow_public_${bucket.name}_access`
            // Try to create a policy to allow public access if bucket is public
            if (bucket.public) {
              await supabase.rpc('create_storage_policy', {
                bucket_name: bucket.name,
                definition: 'true', // Allow public access
                policy_name: policyName,
                operation: 'SELECT'
              }).catch(e => console.log(`Policy might already exist: ${e.message}`))
              
              // Add policy for authenticated users to upload
              await supabase.rpc('create_storage_policy', {
                bucket_name: bucket.name,
                definition: 'auth.uid() = auth.uid()', // Any authenticated user
                policy_name: `allow_uploads_${bucket.name}`,
                operation: 'INSERT'
              }).catch(e => console.log(`Policy might already exist: ${e.message}`))
            }
          } catch (policyError) {
            console.error(`Error setting policies for ${bucket.name}:`, policyError)
          }
        }
      } else {
        console.log(`Bucket ${bucket.name} already exists`)
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
    console.error("Unexpected error in create-buckets function:", err)
    return new Response(JSON.stringify({
      error: `Unexpected error: ${err.message}`
    }), { 
      headers: { 'Content-Type': 'application/json' },
      status: 500 
    })
  }
})
