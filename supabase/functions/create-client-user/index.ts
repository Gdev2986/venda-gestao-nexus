
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateUserRequest {
  email: string;
  contact_name: string;
  phone: string;
  client_id: string;
  business_name: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email, contact_name, phone, client_id, business_name }: CreateUserRequest = await req.json()

    console.log('Creating user for client:', { email, contact_name, client_id })

    // Generate temporary password (first name + last 4 digits of phone)
    const firstName = contact_name.split(' ')[0]
    const phoneDigits = phone.replace(/\D/g, '')
    const lastFourDigits = phoneDigits.slice(-4)
    const tempPassword = firstName + lastFourDigits

    console.log('Generated temporary password for user:', email)

    // Create user in auth.users
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm email for admin-created users
      user_metadata: {
        name: contact_name,
        phone: phone,
        business_name: business_name,
        created_by_admin: true
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      throw new Error(`Failed to create user: ${authError.message}`)
    }

    console.log('Auth user created successfully:', authUser.user.id)

    // Create profile with CLIENT role
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authUser.user.id,
        email: email,
        name: contact_name,
        phone: phone,
        role: 'CLIENT',
        status: 'pending_activation',
        password_reset_required: true,
        temp_access_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      // If profile creation fails, we should delete the auth user to maintain consistency
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      throw new Error(`Failed to create user profile: ${profileError.message}`)
    }

    console.log('Profile created successfully for user:', authUser.user.id)

    // Create user-client access association
    const { error: accessError } = await supabaseAdmin
      .from('user_client_access')
      .insert({
        user_id: authUser.user.id,
        client_id: client_id
      })

    if (accessError) {
      console.error('Error creating user-client access:', accessError)
      // Clean up on error
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      await supabaseAdmin.from('profiles').delete().eq('id', authUser.user.id)
      throw new Error(`Failed to create user-client association: ${accessError.message}`)
    }

    console.log('User-client access created successfully')

    // Create user role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: authUser.user.id,
        role: 'client'
      })

    if (roleError) {
      console.error('Error creating user role:', roleError)
      // Continue even if role creation fails, as it's not critical
    }

    return new Response(
      JSON.stringify({
        success: true,
        user_id: authUser.user.id,
        email: email,
        temp_password: tempPassword,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    console.error('Error in create-client-user function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
