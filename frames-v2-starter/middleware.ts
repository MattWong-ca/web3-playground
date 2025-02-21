import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { validateQstashRequest } from "@/lib/qstash";

export const config = {
  matcher: ["/api/:path*"],
};

export default async function middleware(req: NextRequest) {
  // Skip auth check for sign-in endpoint
  if (
    req.nextUrl.pathname === "/api/sign-in" ||
    req.nextUrl.pathname === "/api/webhook" ||
    req.nextUrl.pathname.includes("public") ||
    req.nextUrl.pathname.includes("og")
  ) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.includes("qstash")) {
    try {
      await validateQstashRequest(
        req.headers.get("Upstash-Signature")!,
        req.nextUrl.pathname
      );
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.toString() }, { status: 401 });
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Get token from Authorization header
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7) // Remove "Bearer " prefix
    : null;

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    // Verify the token using jose
    const { payload } = await jose.jwtVerify(token, secret);

    // Clone the request headers to add user info
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-fid", payload.fid as string);

    // Return response with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
