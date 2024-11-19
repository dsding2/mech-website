import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "bots",
  access: (allow) => ({
    "results/*": [allow.guest.to(["read"])],
    "code/{entity_id}/*": [allow.entity("identity").to(["read", "write"])],
  }),
});
