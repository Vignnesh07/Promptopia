import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async session({ session }) {
            // Get current user's session 
            const sessionUser = await User.findOne({
                email: session.user.email,
            });
    
            // Update session with user's id to indicate which user is currently online
            session.user.id = sessionUser._id.toString();
    
            return session;
        },
        async signIn({ profile }) {
            try {
                // Serverless route -> lambda -> dynamodb
                await connectToDB();
    
                // Check if a user already exists 
                const userExists = await User.findOne({
                    email: profile.email,
                })
    
                // If not, create a new user and save it to the database
                if(!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ", "").toLowerCase(),
                        image: profile.picture,
                    });
                }
    
                return true;
            } catch (error) {
                console.log(error);;
                return false;
            }
        }
    }
})

export { handler as GET, handler as POST };