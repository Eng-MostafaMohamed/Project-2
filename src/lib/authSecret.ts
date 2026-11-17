/** Shared JWT secret for NextAuth and the request proxy. */
export const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
