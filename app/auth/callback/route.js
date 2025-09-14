import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (!code) {
    console.log('No code parameter, redirecting to home')
    return NextResponse.redirect(`${origin}/`)
  }

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('OAuth callback error:', error)
      return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(error.message)}`)
    }

    console.log('OAuth success:', data)
    
    // Check if this is a new user (first time OAuth)
    const isNewUser = data.user && data.user.created_at === data.user.last_sign_in_at
    
    if (isNewUser) {
      console.log('New user detected, redirecting to home')
      return NextResponse.redirect(`${origin}/`)
    } else {
      console.log('Returning user, redirecting to home')
      return NextResponse.redirect(`${origin}/`)
    }

  } catch (err) {
    console.error('Unexpected error in OAuth callback:', err)
    return NextResponse.redirect(`${origin}/?auth_error=unexpected_error`)
  }
}