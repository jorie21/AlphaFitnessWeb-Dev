import { createServerSupabaseClient } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createServerSupabaseClient();
    
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) {
        console.error('Session exchange error:', sessionError);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }

      if (sessionData?.user) {
        // Check if user already exists in our users table
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('id')
          .eq('id', sessionData.user.id)
          .single();

        // If user doesn't exist, create them in our users table
        if (!existingUser && !fetchError) {
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: sessionData.user.id,
                email: sessionData.user.email,
                username: sessionData.user.user_metadata?.username || 
                         sessionData.user.user_metadata?.full_name || 
                         sessionData.user.email?.split('@')[0] || 
                         `user_${Date.now()}`, // Fallback username
                avatar_url: sessionData.user.user_metadata?.avatar_url,
                full_name: sessionData.user.user_metadata?.full_name,
              },
            ]);

          if (insertError) {
            console.error('Error creating user in database:', insertError);
            // Continue anyway - user is authenticated even if DB insert fails
          }
        }
      }

      // Successful authentication - redirect to dashboard or intended page
      return NextResponse.redirect(`${origin}${next}`);
      
    } catch (error) {
      console.error('Callback error:', error);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  }

  // No code present, redirect to error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}