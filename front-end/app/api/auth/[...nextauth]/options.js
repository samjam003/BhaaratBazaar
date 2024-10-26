import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from '@/lib/supabase'

export const options = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log(credentials)
                const { email, password_hash } = credentials

                const { data: user, error } = await supabase
                    .from('users')
                    .select('id, email, password_hash, role')
                    .eq('email', email)
                    .single()

                console.log(user)

                if (error || !user) {
                    throw new Error('Invalid email or user not found');
                }

                // Password check (you can use bcrypt for hashed passwords)
                const isValidPassword = password_hash == user.password_hash
                console.log(isValidPassword)
                if (!isValidPassword) {
                    throw new Error('Invalid password');
                }

                // Successful login, return user data
                return {
                    id: user.id,
                    email: user.email,
                    role: user.role // Example role: 'admin', 'user', etc.
                };
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // Add user_id to the token
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role;
                session.user.id = token.id; // Include user_id in the session
            }
            return session;
        },

    },

    pages: {
        signIn: '/auth/signin',  // Custom sign-in page
        error: '/auth/error',    // Error page
    }
}
