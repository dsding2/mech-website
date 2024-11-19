import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "bots",
  access: (allow) => ({
    "results/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write"]),
    ],
    "code/{entity_id}/*": [allow.entity("identity").to(["read", "write"])],
    "test_code/*": [
      allow.guest.to(["read", "write"]),
      allow.authenticated.to(["read", "write"]),
    ],
  }),
});
