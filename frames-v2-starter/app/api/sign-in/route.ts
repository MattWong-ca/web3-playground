import { fetchUser } from "@/lib/neynar";
import { NextRequest, NextResponse } from "next/server";
import { verifyMessage } from "viem";
import * as jose from "jose";
import { getUser, setUser } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  const { fid, signature, message } = await req.json();

  let user = await getUser(fid);

  if (!user) {
    const newUser = await fetchUser(fid);
    user = {
      fid: fid,
      username: newUser.username,
      displayName: newUser.display_name,
      avatarUrl: newUser.pfp_url,
      custodyWalletAddress: newUser.custody_address,
    };
    await setUser(fid, user);
  }

  // Verify signature matches custody address
  const isValidSignature = await verifyMessage({
    address: user.custodyWalletAddress as `0x${string}`,
    message,
    signature,
  });

  if (!isValidSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  // Generate a session token using fid and current timestamp
  const jwtToken = await new jose.SignJWT({
    fid,
    timestamp: Date.now(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30 days")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  const response = NextResponse.json({ success: true, token: jwtToken });

  return response;
};
