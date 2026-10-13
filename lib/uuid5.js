// The podcast:guid of a feed (Podcasting 2.0): a UUID v5 of the feed's address without the scheme, in the namespace
// the standard names, so the show keeps its identity in every directory even if the address moves
// (https://podcastindex.org/namespace/1.0#guid). Used by src/_data/podcast.js.
import { createHash } from "node:crypto";

const NAMESPACE = Buffer.from("ead4c236bf5858c6a2c6a6b28d128cb6", "hex");

export const uuid5 = (name) => {
  const hash = createHash("sha1").update(Buffer.concat([NAMESPACE, Buffer.from(name)])).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.subarray(0, 16).toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};
