import "next-auth";

declare module "next-auth" {

    interface User {
        token?: string;
        role?: string;
        name?: string;
        email?: string;
        phone?: string;
        id?: string
    }


    interface Session {
        user: {
            name?: string;
            email?: string;
            role: string;
            token: string;
            id: string
            phone?: string;
        }
    }

}


declare module "next-auth/jwt" {
    interface JWT {
        role: string;
        token: string;
        id: string
        phone?: string;
    }
}
