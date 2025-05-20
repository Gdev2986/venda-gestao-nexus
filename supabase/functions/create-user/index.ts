
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { decode as base64Decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validate inputs
function validateRequest(body: any) {
  if (!body) return "Body is required";
  if (!body.email || typeof body.email !== "string") return "Email is required";
  if (!body.password || typeof body.password !== "string") return "Password is required";
  if (!body.metadata || typeof body.metadata !== "object") return "Metadata object is required";
  if (!body.metadata.name) return "Name is required in metadata";
  if (!body.metadata.role) return "Role is required in metadata";
  return null;
}

// Check user authorization
async function isAuthorized(req: Request) {
  // Assuming we're using a JWT token in the Authorization header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.split(" ")[1];
  
  try {
    // Validate the token with Supabase JWT verification
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error) {
      console.error("Auth error:", error.message);
      return false;
    }

    // Only allow admin or financial roles to create users
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (roleError) {
      console.error("Role error:", roleError.message);
      return false;
    }

    const allowedRoles = ["ADMIN", "FINANCIAL"];
    return allowedRoles.includes(roleData.role);
  } catch (err) {
    console.error("Auth validation error:", err);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    // Check authorization
    const authorized = await isAuthorized(req);
    if (!authorized) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Parse request body
    const body = await req.json();
    
    // Validate request body
    const validationError = validateRequest(body);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const { email, password, metadata } = body;

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin.auth.admin.getUserByEmail(email);
    
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "User with this email already exists" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 409,
        }
      );
    }

    // Create user in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation
      user_metadata: metadata,
    });

    if (error) {
      console.error("Error creating user:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Create profile for the user
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: data.user.id,
        email: email,
        name: metadata.name,
        role: metadata.role.toUpperCase(),
        phone: metadata.phone || null,
      });

    if (profileError) {
      console.error("Error creating profile:", profileError);
      
      // Rollback auth user creation if profile creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(data.user.id);
      } catch (deleteError) {
        console.error("Error rolling back user creation:", deleteError);
      }
      
      return new Response(
        JSON.stringify({ error: profileError.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Create client entry if role is "CLIENT"
    if (metadata.role.toUpperCase() === "CLIENT" && metadata.client_data) {
      const { error: clientError } = await supabaseAdmin
        .from("clients")
        .insert({
          business_name: metadata.client_data.business_name,
          document: metadata.client_data.document,
          contact_name: metadata.name,
          email: email,
          phone: metadata.phone,
          address: metadata.client_data.address,
          city: metadata.client_data.city,
          state: metadata.client_data.state,
          zip: metadata.client_data.zip,
          partner_id: metadata.client_data.partner_id || null,
        });

      if (clientError) {
        console.error("Error creating client:", clientError);
        return new Response(
          JSON.stringify({ 
            error: clientError.message,
            note: "User and profile created successfully but client creation failed" 
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: { 
          id: data.user.id,
          email: data.user.email,
          role: metadata.role,
          name: metadata.name
        } 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201,
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
