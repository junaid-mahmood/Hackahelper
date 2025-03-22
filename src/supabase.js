import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const signInWithGitHub = async () => {
  console.log('GitHub OAuth URL:', `http://localhost:3000/auth/github/callback`);
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `http://localhost:3000/auth/github/callback`,
      scopes: 'repo admin:repo_hook user:email delete_repo'
    }
  });
  
  if (error) {
    console.error('Supabase GitHub OAuth error:', error);
  } else {
    console.log('Supabase GitHub OAuth successful, data:', data);
  }
  
  return { data, error };
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};

export const getUserProfile = async () => {
  const { data: { session } } = await getSession();
  
  if (!session) return { user: null };
  
  return { user: session.user };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
}; 