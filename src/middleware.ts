import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Exceção para Auth (Dia 8)
    if (request.nextUrl.pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // Proteção da API de Tasks (Dia 5)
    if (request.nextUrl.pathname.startsWith("/api")) {
        const apiKey = request.headers.get("x-api-key");
        const secretKey = process.env.API_SECRET_KEY; 

        if (apiKey !== secretKey) {
             const acceptHeader = request.headers.get("accept") || "";
             // Se for humano (navegador), manda pro guarda
             if (acceptHeader.includes("text/html")) {
                return NextResponse.redirect(new URL("/denied", request.url));
             }
             // Se for código, manda JSON
             return NextResponse.json({ message: "Acesso Negado" }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config  = {
    matcher: "/api/:path*"
}