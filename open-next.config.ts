import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  wrapper: "cloudflare-node",
  converter: "aws-apigw-v2",
  incrementalCache: "dummy",
  tagCache: "dummy",
  queue: "direct",
});
