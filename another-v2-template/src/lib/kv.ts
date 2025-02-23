import { FrameNotificationDetails } from "@farcaster/frame-sdk";
import { Redis } from "@upstash/redis";
import { PROJECT_ID } from "~/lib/constants";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

function getProjectKey(): string {
  return PROJECT_ID;
}

function getUserNotificationDetailsKey(fid: number): string {
  return `${getProjectKey()}:${fid}`;
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
