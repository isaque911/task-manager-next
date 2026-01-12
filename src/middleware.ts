import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // 1. Libera Auth
    if (request.nextUrl.pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // 2. Protege API de Tasks
    if (request.nextUrl.pathname.startsWith("/api")) {
        const apiKey = request.headers.get("x-api-key");
        const secretKey = process.env.API_SECRET_KEY; 

        // Só bloqueia se a chave secreta estiver configurada E a chave enviada for diferente
        // E ignora se a requisição vier do próprio navegador (para não quebrar o site)
        if (secretKey && apiKey !== secretKey) {
             const acceptHeader = request.headers.get("accept") || "";
             
             // Se for uma requisição de API (JSON), retorna 401
             if (!acceptHeader.includes("text/html")) {
                return NextResponse.json({ message: "Acesso Negado" }, { status: 401 });
             }
             
             // Se for acesso via navegador, deixa passar ou você pode criar a página /denied depois
             // Por enquanto, vamos deixar passar para evitar o erro 500 de página inexistente
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*",
};
