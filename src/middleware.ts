
// // Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
// // // Without a defined matcher, this one line applies next-auth 
// // // to the entire project
// export { default } from "next-auth/middleware"

// // Applies next-auth only to matching routes - can be regex
// // Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// export const config = {
//     // matcher: ["/extra", "/dashboard"]
//     // matcher: "/me"
//     matcher: []
// }

// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    (request: NextRequestWithAuth) => {
        const pathName = request.nextUrl.pathname;
        console.log(request.nextUrl.pathname)
        console.log(request.nextauth.token)

        const role = request.nextauth.token?.role!;
        const isAdminOrManager = ["admin", "manager"].includes(role)

        if (pathName.startsWith("/dashboard")) {
            return NextResponse.rewrite(
                new URL("/denied", request.url)
            )
        }

        if (pathName.startsWith("/extra") && role !== "admin") {
            return NextResponse.rewrite(
                new URL("/denied", request.url)
            )
        }

        if (pathName.startsWith("/client") && !isAdminOrManager) {
            return NextResponse.rewrite(
                new URL("/denied", request.url)
            )
        }
    },
    {
        // callbacks: {
        //     // authorized: ({ token }) => !!token
        //     // authorized: ({ token }) => token?.role === "admin"
        // },
    }
)

// // Applies next-auth only to matching routes - can be regex
// // Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// export const config = { matcher: ["/extra", "/client", "/dashboard"] }
