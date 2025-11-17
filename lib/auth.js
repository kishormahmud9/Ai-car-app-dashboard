
import Credentials from "next-auth/providers/credentials";


const demoUser = {
  id: "1",
  name: "Admin User",
  email: "admin@example.com",
  password: "password123", 
  role: "admin",
};

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        const user = creds.email === demoUser.email ? demoUser : null;
        if (!user) return null;

   
        if (creds.password !== user.password) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role;
      return session;
    },
  },
};
