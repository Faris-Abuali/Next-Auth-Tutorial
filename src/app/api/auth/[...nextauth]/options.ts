import type { NextAuthOptions } from "next-auth"
import GitHubProvider, { GithubProfile } from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

export const options: NextAuthOptions = {
    providers: [
        GitHubProvider({
            profile: (profile: GithubProfile, tokens) => {
                console.log(profile)
                return {
                    ...profile,
                    id: profile.id.toString(),
                    name: profile.name,
                    email: profile.email,
                    image: profile.avatar_url,
                    role: profile.role ?? "user",
                }
            },
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "Your username"
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Your password"
                },
            },
            authorize: async (credentials) => {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                const user = {
                    id: "201810408",
                    name: "faris",
                    email: "",
                    password: "nextauth",
                    // role: "admin",
                    role: "manager",
                }

                const doesMatch =
                    credentials?.username === user.name &&
                    credentials?.password == user.password;

                return doesMatch ? user : null;
            }
        })
    ],
    callbacks: {
        // Ref: https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
        jwt: async ({ token, user }) => {
            if (user) token.role = user.role
            return token
        },
        // If you want to use the role in client components
        session: async ({ session, token }) => {
            if (session?.user) session.user.role = token.role
            return session
        },
    }
    // pages: {
    //     signIn: '/auth/signin',
    //     signOut: '/auth/signout',
    //     error: '/auth/error',
    //     verifyRequest: '/auth/verify-request',
    //     newUser: null
    // },
}