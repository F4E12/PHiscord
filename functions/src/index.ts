import * as functions from 'firebase-functions';
import {RtcTokenBuilder, RtcRole} from 'agora-access-token';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();
admin.initializeApp();

exports.generateAgoraToken = functions.https.onCall((data, context) => {
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  const channelName = data.channelName;
  const uid = data.uid;

  if (!appId || !appCertificate) {
    throw new functions.https.HttpsError(
        'failed-precondition',
        'Agora credentials are not set.'
    );
  }

  if (!channelName || uid == null) {
    throw new functions.https.HttpsError(
        'invalid-argument',
        'channelName and uid are required.'
    );
  }

  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
  );

  return {token};
});
