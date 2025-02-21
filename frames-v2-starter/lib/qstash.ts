import { Client } from "@upstash/qstash";
import * as jose from "jose";

// if (!process.env.QSTASH_TOKEN) {
//   throw new Error("QSTASH_TOKEN is required");
// }

const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export type QStashPublishJSONRequest = {
  url: string;
  body: {
    [key: string]: string;
  };
  headers?: {
    [key: string]: string;
  };
  delay?: number | `${bigint}s` | `${bigint}m` | `${bigint}h` | `${bigint}d`; // this is a string folliwng the format "1s", "1m", "1h"
  notBefore?: number;
};

export const qstashPublishJSON = async (req: QStashPublishJSONRequest) => {
  const res = await qstashClient.publishJSON({
    url: req.url,
    body: req.body,
    headers: {
      ...req.headers,
      Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
    },
    delay: req.delay,
    notBefore: req.notBefore,
  });

  return res;
};

export const validateQstashRequest = async (
  upstashSignature: string,
  path: string
) => {
  // verify the signature
  if (!upstashSignature) {
    console.error(
      `[QSTASH-${new Date().toISOString()}]`,
      "No Upstash signature provided"
    );
    throw new Error("No Upstash signature provided");
  }

  const verificationResult = await jose.jwtVerify(
    upstashSignature,
    new TextEncoder().encode(process.env.QSTASH_CURRENT_SIGNING_KEY),
    {
      issuer: "Upstash",
      subject: `${process.env.NEXT_PUBLIC_URL}${path}`,
    }
  );

  // if the verification fails, return an error
  if (!verificationResult) {
    console.error(
      `[QSTASH-${new Date().toISOString()}]`,
      "Invalid Upstash signature"
    );
    throw new Error("Invalid Upstash signature");
  }

  console.log(
    `[QSTASH-${new Date().toISOString()}]`,
    "Upstash signature verified"
  );
};
