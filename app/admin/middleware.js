import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Use jose for Edge runtime compatibility

export async function middleware(request) {
  const token = request.cookies.get('auth_token')?.value;

  // 1. Check if token exists
  if (!token) {
    return NextResponse.redirect(new URL('/account/login', request.url));
  }

  try {
    // 2. Verify Token (and check expiration)
    // Replace 'YOUR_SECRET' with your actual JWT secret key
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    
    return NextResponse.next();
  } catch (error) {
    // 3. If expired or invalid, redirect to login
    console.error("JWT Verification failed:", error);
    const response = NextResponse.redirect(new URL('/account/login', request.url));
    response.cookies.delete('auth_token'); // Clean up the bad cookie
    return response;
  }
}

export const config = {
  matcher: '/admin/:path*', // Protects all routes inside /admin
};