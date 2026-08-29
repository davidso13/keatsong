import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Auth.js v5 설정.
 * DB 어댑터(@auth/prisma-adapter)는 DATABASE_URL 설정 후 연결하세요.
 * 현재는 JWT 세션 전략으로 동작합니다.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
