import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/api")) {
        const apiKey = request.headers.get("x-api-key")
        const secretKey = "segredo-do-bootcamp-123"

        if(apiKey !== secretKey) {
            return NextResponse.json(
                {message: "Acesso Negado. Quem é você?"},
                {status:401}
            )
        }
    }

    return NextResponse.next()
}

export const config  = {
    matcher: "/api/:path*"
}