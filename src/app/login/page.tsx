'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  return (
    <main className="min-h-screen bg-[#030711] flex items-center justify-center">
      <div className="relative w-full max-w-md">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-25" />
        <div className="absolute inset-0 bg-radial-gradient" />
        
        {/* Content */}
        <div className="relative bg-white/5 p-8 rounded-lg border border-white/10 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to CodeTask</h1>
            <p className="text-white/70">Sign in to manage your tasks</p>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#ffffff',
                    brandAccent: '#ffffff',
                    brandButtonText: '#030711',
                  },
                },
              },
              style: {
                button: {
                  background: '#ffffff',
                  color: '#030711',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '500',
                },
                anchor: {
                  color: '#ffffff',
                  textDecoration: 'none',
                },
                input: {
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  color: '#ffffff',
                },
                label: {
                  color: '#ffffff',
                },
              },
            }}
            theme="dark"
            providers={['github']}
            redirectTo={`${window.location.origin}/dashboard`}
          />
        </div>
      </div>
    </main>
  )
} 