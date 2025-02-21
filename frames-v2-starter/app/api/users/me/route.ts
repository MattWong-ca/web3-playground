import { NextRequest, NextResponse } from "next/server";
import { getUser, setUser } from "@/lib/db";
import { trackEvent } from "@/lib/posthog/server";

export async function GET(req: NextRequest) {
  const fid = req.headers.get("x-user-fid");
  if (!fid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await getUser(Number(fid));
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const fid = req.headers.get("x-user-fid");
  if (!fid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const existingUser = await getUser(Number(fid));
  if (!existingUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const { customName } = await req.json();
  const user = await setUser(Number(fid), {
    ...existingUser,
    customName,
  });
  trackEvent(Number(fid), "user_updated", {
    customName,
  });
  return NextResponse.json(user);
}
