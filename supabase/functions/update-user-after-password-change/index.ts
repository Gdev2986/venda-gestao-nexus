
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { user_id } = await req.json()

    if (!user_id) {
      throw new Error('User ID is required')
    }

    // Update profile to mark password as changed
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        status: 'active',
        password_reset_required: false,
        temp_access_expires_at: null
      })
      .eq('id', user_id)

    if (profileError) {
      throw new Error(`Failed to update profile: ${profileError.message}`)
    }

    // Record password change in user_first_login table
    const { error: loginError } = await supabaseAdmin
      .from('user_first_login')
      .upsert({
        user_id: user_id,
        password_changed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (loginError) {
      console.error('Error recording password change:', loginError)
      // Don't throw here as the main operation succeeded
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    console.error('Error in update-user-after-password-change:', error)
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
