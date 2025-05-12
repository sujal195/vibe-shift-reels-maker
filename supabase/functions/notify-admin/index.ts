
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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
    const requestData = await req.json();
    const adminEmail = "sujalgiri574@gmail.com";
    
    console.log("Notification received:", requestData);

    let emailSubject = "";
    let emailBody = "";
    
    // Format email based on event type
    switch (requestData.type) {
      case 'signin':
        emailSubject = "New Sign In";
        emailBody = `User with email ${requestData.email} has signed in.`;
        break;
      case 'signout':
        emailSubject = "User Signed Out";
        emailBody = `User with email ${requestData.email} has signed out.`;
        break;
      case 'post_created':
        emailSubject = "New Post Created";
        emailBody = `User ${requestData.user} created a new ${requestData.post?.mediaType || 'text'} post.`;
        break;
      case 'profile_updated':
        emailSubject = "Profile Updated";
        emailBody = `User ${requestData.email} updated their profile.`;
        break;
      case 'invitation_used':
        emailSubject = "Invitation Code Used";
        emailBody = `User ${requestData.email} used an invitation code to join.`;
        break;
      default:
        emailSubject = "Notification";
        emailBody = "A new event occurred in your application.";
    }
    
    // Send email via SMTP
    try {
      const client = new SMTPClient({
        connection: {
          hostname: Deno.env.get("SMTP_HOSTNAME") || "smtp.gmail.com",
          port: Number(Deno.env.get("SMTP_PORT") || "587"),
          tls: true,
          auth: {
            username: Deno.env.get("SMTP_USERNAME") || "",
            password: Deno.env.get("SMTP_PASSWORD") || "",
          },
        },
      });
      
      await client.send({
        from: `Memoria <${Deno.env.get("SMTP_USERNAME") || "noreply@memoria.app"}>`,
        to: adminEmail,
        subject: emailSubject,
        content: emailBody,
      });
      
      await client.close();
      console.log("Email sent to admin:", adminEmail);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Continue and return success response even if email fails
    }
    
    return new Response(
      JSON.stringify({
        message: "Notification logged successfully",
        emailSubject,
        emailBody,
        recipient: adminEmail
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Error in notify-admin function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      },
    )
  }
});
