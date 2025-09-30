const { google } = require("googleapis");
const fs = require("fs");

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json", // your downloaded service account key
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

const uploadToDrive = async (filePath, fileName, mimeType) => {
  const fileMetadata = {
    name: fileName,
    parents: ["11hhHf6_IZpEkysvMBkn0pH6cVuPRD8vr"], // replace with Drive folder ID
  };

  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(filePath),
  };

  const file = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id",
  });

  // make public
  await drive.permissions.create({
    fileId: file.data.id,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  // clean up local file
  fs.unlinkSync(filePath);

  return `https://drive.google.com/uc?id=${file.data.id}`;
};

module.exports = { uploadToDrive };
