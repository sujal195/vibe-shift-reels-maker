
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ADMIN_EMAIL = "sujalgiri574@gmail.com";
// Define the application URL (use the actual production domain)
const APP_URL = "https://gfhcmeicnbccihtyclbj.lovable.dev";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { type, user, email, code, username, post } = await req.json();
    
    let subject = "Memoria Activity Notification";
    let body = "An activity occurred in your Memoria app.";
    
    // Customize email based on notification type
    switch (type) {
      case 'signup':
        subject = "New User Signup on Memoria";
        body = `A new user has signed up to Memoria:\n\nUser: ${user}\nEmail: ${email}\n\nThey will require an invitation code to access the platform fully.\n\nView the user: ${APP_URL}/admin/users`;
        break;
      case 'signin':
        subject = "User Sign In on Memoria";
        body = `A user has signed in to Memoria:\n\nEmail: ${email}\n\nView the user: ${APP_URL}/auth`;
        break;
      case 'signout':
        subject = "User Sign Out from Memoria";
        body = `A user has signed out from Memoria:\n\nEmail: ${email}\n\nView auth logs: ${APP_URL}/admin/logs`;
        break;
      case 'invitation_code_redeemed':
        subject = "Invitation Code Redeemed on Memoria";
        body = `A user has redeemed an invitation code on Memoria:\n\nUser: ${user}\nInvitation Code: ${code}\n\nView invitation codes: ${APP_URL}/admin/invitation-codes`;
        break;
      case 'profile_completed':
        subject = "User Completed Profile Setup on Memoria";
        body = `A user has completed their profile setup on Memoria:\n\nUser: ${user}\nUsername: @${username}\n\nView profile: ${APP_URL}/profile/${username}`;
        break;
      case 'post_created':
        subject = "New Post Created on Memoria";
        body = `A new post was created on Memoria:\n\nUser: ${user}\nContent: ${post?.content?.substring(0, 100)}${post?.content?.length > 100 ? '...' : ''}\n\nView the post: ${APP_URL}/home`;
        break;
      default:
        subject = "Memoria Notification";
        body = `Activity on Memoria:\n\nType: ${type}\nUser: ${user || email || "Unknown"}\n\nView the app: ${APP_URL}`;
    }
    
    // In a real implementation, you would use an email service like Resend, SendGrid, etc.
    // This is a placeholder that logs the email content
    console.log(`
      To: ${ADMIN_EMAIL}
      Subject: ${subject}
      Body: ${body}
    `);
    
    // Simulate successful sending 
    return new Response(
      JSON.stringify({ message: "Notification sent" }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error("Error processing notification:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
});
