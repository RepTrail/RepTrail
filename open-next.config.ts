import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({
  override: {
    wrapper: 'cloudflare-node',
    converter: 'aws-apigw-v2',
    incrementalCache: 'dummy',
    tagCache: 'dummy',
    queue: 'sqs-lite',
  },
});
