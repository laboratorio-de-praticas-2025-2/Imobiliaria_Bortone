import {NextResponse} from 'next/server';

export function middleware(req) {
    const {pathname} = req.nextUrl;

    if (pathname.startsWith('/admin')){
        // Verificar se a rota contém 'undefined' e redirecionar
        if (pathname.includes('undefined')) {
            
            // Redirecionar para a página principal do admin correspondente
            if (pathname.includes('/cms-publicidades/')) {
                return NextResponse.redirect(new URL('/admin/cms-publicidades', req.url));
            } else if (pathname.includes('/cms-usuarios/')) {
                return NextResponse.redirect(new URL('/admin/cms-usuarios', req.url));
            } else if (pathname.includes('/cms-imoveis/')) {
                return NextResponse.redirect(new URL('/admin/cms-imoveis', req.url));
            } else if (pathname.includes('/cms-publicacoes/')) {
                return NextResponse.redirect(new URL('/admin/cms-publicacoes', req.url));
            } else if (pathname.includes('/cms-banner/')) {
                return NextResponse.redirect(new URL('/admin/cms-banner', req.url));
            } else {
                // Para qualquer outra rota admin com undefined, redirecionar para dashboard
                return NextResponse.redirect(new URL('/admin/dashboard', req.url));
            }
        }

        const res = NextResponse.next();
        res.headers.set('X-Robots-Tag', 'noindex, nofollow');
        return res;
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
