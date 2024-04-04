import NextAuth, {Session} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

import dbConnect from "../../../utils/dbConnect"
import type { user } from "../../../model/user";
import User from "../../../model/user";

export interface currentUser extends user{
    _id : string,
    email: string,
    role: string,
    avatar:string
  }


  function isCurrentUser(obj: any): obj is currentUser {
    return obj && '_id' in obj && 'email' in obj && 'role' in obj;
  }
export default NextAuth({
    // Enable JSON Web Tokens since we will not store sessions in our DB

    session: {
        strategy: "jwt",
        maxAge: 8 * 60 * 60,
    },
    // Here we add our login providers - this is where you could add Google or Github SSO as well
    providers: [
        CredentialsProvider({
            name: "credentials",
            // The credentials object is what's used to generate Next Auths default login page - We will not use it however.
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            // Authorize callback is ran upon calling the signin function
            authorize: async (credentials) => {
                dbConnect()

                // Try to find the user and also return the password field
                const user = await User.findOne({email: credentials!.email}).select('+password')

                if(!user) { throw new Error('No user with a matching email was found.')}

                // Use the comparePassword method we defined in our user.js Model file to authenticate
                const pwValid = await user.comparePassword(credentials!.password)

                if(!pwValid){ throw new Error("Your password is invalid") }

                return user
            }

            
        })
    ],

    
    // All of this is just to add user information to be accessible for our app in the token/session
    callbacks: {
        async jwt({ token, user}) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (isCurrentUser(user)) {
              token.id = user._id
              token.role = user.role
              token.avatar = user.avatar
            }
            return token
          },
    
        session: async ({ session, token }: {session: any, token:any}) => {
            // Access the role from the token and add it to the session's user object
            if (token) {
                session.user = {
                    ...session.user,  // Retain existing session user properties
                    role: token.role,  // Add role from token
                    avatar: token.avatar,
                }
            }
            return session;
        }
    }
    ,  
  pages: {
    // Here you can define your own custom pages for login, recover password, etc.
      signIn: '/login',
      newUser: '/signup'
  },
})