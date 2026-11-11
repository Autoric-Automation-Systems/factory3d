import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { upsertUser } from "@/lib/store";

export const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

export const DEMO_EMAIL = "visitante@factory3d.local";

if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) {
  console.error(
    "[auth] AUTH_SECRET não definido: as sessões usam um segredo público e podem ser forjadas. Defina AUTH_SECRET no ambiente.",
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? "factory3d-dev-secret",
  session: { strategy: "jwt" },
  pages: { signIn: "/entrar" },
  providers: [
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      id: "demo",
      name: "Demonstração",
      credentials: {},
      async authorize() {
        const record = await upsertUser({
          email: DEMO_EMAIL,
          name: "Visitante",
          provider: "demo",
        });
        return { id: record.id, email: record.email, name: record.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (!token.uid && user?.email) {
        const record = await upsertUser({
          email: user.email,
          name: user.name,
          image: user.image,
          provider: "oauth",
        });
        token.uid = record.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) {
        session.user.id = token.uid as string;
      }
      return session;
    },
  },
});
