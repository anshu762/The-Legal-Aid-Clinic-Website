import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const isLoggedIn = !!token;
      return isLoggedIn;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
