require("dotenv").config();
const express = require("express");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const cors = require("cors");

const app = express();
const PORT = 3001;

const AGORA_APP_ID = "e9f44b3f91fb4ef2815937b4fcc10907";
const AGORA_APP_CERTIFICATE = "2343569ed7954497b4fb65ae94056ca5";

app.use(cors());
app.use(express.json());

app.get("/generate-agora-token", (req, res) => {
  const { channelId, uid } = req.query;

  if (!channelId || !uid) {
    return res.status(400).json({ error: "channelId and uid are required" });
  }

  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    AGORA_APP_ID,
    AGORA_APP_CERTIFICATE,
    channelId,
    uid,
    role,
    privilegeExpiredTs
  );

  return res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Token server is running on port ${PORT}`);
});
