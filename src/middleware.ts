import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith("/api")) {
        const apiKey = request.headers.get("x-api-key");
        const secretKey = process.env.API_SECRET_KEY; 

        if (apiKey !== secretKey) {
             const acceptHeader = request.headers.get("accept") || "";
             if (acceptHeader.includes("text/html")) {
                return NextResponse.redirect(new URL("/denied", request.url));
             }
             return NextResponse.json({ message: "Acesso Negado" }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config  = {
    matcher: "/api/:path*"
}
