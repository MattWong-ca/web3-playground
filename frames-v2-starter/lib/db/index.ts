import { FrameNotificationDetails } from "@farcaster/frame-sdk";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_API_URL,
  token: process.env.KV_API_TOKEN,
});

function getUserKey(fid: number): string {
  return `frames-v2-starter:user:${fid}`;
}

function getUserNotificationDetailsKey(fid: number): string {
  return `frames-v2-starter:user:${fid}:notification-details`;
}

export type User = {
  fid: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  custodyWalletAddress: string;
  customName?: string;
};

export async function getUser(fid: number): Promise<User | null> {
  return await redis.get<User>(getUserKey(fid));
}

export async function setUser(fid: number, user: User): Promise<void> {
  await redis.set(getUserKey(fid), user);
}

export async function deleteUser(fid: number): Promise<void> {
  await redis.del(getUserKey(fid));
}

export async function getUserNotificationDetails(
  fid: number
): Promise<FrameNotificationDetails | null> {
  return await redis.get<FrameNotificationDetails>(
    getUserNotificationDetailsKey(fid)
  );
}

export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: FrameNotificationDetails
): Promise<void> {
  await redis.set(getUserNotificationDetailsKey(fid), notificationDetails);
}

export async function deleteUserNotificationDetails(
  fid: number
): Promise<void> {
  await redis.del(getUserNotificationDetailsKey(fid));
}
