import { defineConfig } from "@hatk/hatk/config";

const isProd = process.env.NODE_ENV === "production";
const prodDomain = process.env.RAILWAY_PUBLIC_DOMAIN;

export default defineConfig({
  relay: "wss://bsky.network",
  plc: "https://plc.directory",
  port: 3000,
  databaseEngine: "sqlite",
  database: isProd ? "/data/hatk.db" : "data/hatk.db",
  backfill: {
    repos: ["did:plc:giaakn4axmr5dhfnvha6r6wn"],
    parallelism: 5,
    fullNetwork: false,
  },
  oauth: {
    issuer: isProd && prodDomain ? `https://${prodDomain}` : undefined,
    scopes: ["atproto"],
    clients: [
      ...(prodDomain
        ? [
            {
              client_id: `https://${prodDomain}/oauth-client-metadata.json`,
              client_name: "indiemusi.ch",
              scope: "atproto",
              redirect_uris: [
                `https://${prodDomain}/oauth/callback`,
                `https://${prodDomain}/admin`,
              ],
            },
          ]
        : []),
      {
        client_id: "http://127.0.0.1:3000/oauth-client-metadata.json",
        client_name: "indiemusi.ch",
        scope: "atproto",
        redirect_uris: ["http://127.0.0.1:3000/oauth/callback"],
      },
    ],
  },
});
