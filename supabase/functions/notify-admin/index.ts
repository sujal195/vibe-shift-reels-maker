
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    })
  }

  try {
    const requestData = await req.json()
    
    // Here you would normally send an email notification
    // For now, we'll just log the data
    console.log("Notification received:", requestData)

    let emailSubject = ""
    let emailBody = ""
    
    // Format email based on event type
    switch (requestData.type) {
      case 'signin':
        emailSubject = "New Sign In"
        emailBody = `User with email ${requestData.email} has signed in.`
        break
      case 'signout':
        emailSubject = "User Signed Out"
        emailBody = `User with email ${requestData.email} has signed out.`
        break
      case 'post_created':
        emailSubject = "New Post Created"
        emailBody = `User ${requestData.user} created a new ${requestData.post?.mediaType || 'text'} post.`
        break
      default:
        emailSubject = "Notification"
        emailBody = "A new event occurred in your application."
    }
    
    // In a real implementation, you would send an email to sujalgiri574@gmail.com here
    // For example using a service like SendGrid, Resend, etc.
    
    return new Response(
      JSON.stringify({
        message: "Notification logged successfully",
        emailSubject,
        emailBody,
        recipient: "sujalgiri574@gmail.com"
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Error in notify-admin function:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      },
    )
  }
})
