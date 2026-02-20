import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
    // @ts-ignore
    incremental: true,
    minify: true,
});
