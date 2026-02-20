import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// @ts-expect-error - incremental is needed for bundle splitting on free tier
export default defineCloudflareConfig({
    incremental: true,
    minify: true,
});
