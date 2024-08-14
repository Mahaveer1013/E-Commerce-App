import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';

// Resolve path to your JSON file
const serviceAccountPath = path.resolve('./event-db-393fb-firebase-adminsdk-92cxv-6d3d050954.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'event-db-393fb.appspot.com' // Replace with your bucket name
});

export const bucket = admin.storage().bucket();
