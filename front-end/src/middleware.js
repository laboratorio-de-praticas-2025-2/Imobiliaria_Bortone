import {NextResponse} from 'next/server';

export function middleware(req) {
    const {pathname} = req.nextUrl;

    if (pathname.startsWith('/admin')){
        const res = NextResponse.next();
        res.headers.set('X-Robots-Tag', 'noindex, nofollow');
        return res;
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
