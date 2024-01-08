#!/usr/bin/env node

(() => {
    "use strict";

    const program = require("commander");
    const uuid = require("uuid");
    const crypto = require("crypto");
    const axios = require("axios");

    program
        .usage('--signer <string> --signing-key <64-character_hex_value> --signing-iv <32-character_hex_value>')
        .option('--signer <string>', 'the signer of the content key request (required). Example: "widevine_test".')
        .option('--signing-key <64-character_hex_value>', 'the 32-byte signing key as hex (required). Example: "0000000000000000000000000000000000000000000000000000000000000000".')
        .option('--signing-iv <32-character_hex_value>', 'the 16-byte signing IV as hex (required). Example: "00000000000000000000000000000000".')
        .parse(process.argv);

    if (!program.signer || !program.signingKey || !program.signingIv) {
        program.outputHelp();
        return;
    }

    const keyServerUrl = "https://key-server-management.axprod.net/api/WidevineProtectionInfo";

    const contentId = Buffer.from(uuid.v4(), "ascii").toString("base64");
    const signingKey = Buffer.from(program.signingKey, "hex");
    const signingIv = Buffer.from(program.signingIv, "hex");
    const signer = program.signer;

    const contentKeyRequest = JSON.stringify({
        "content_id": contentId,
        "tracks": [{ "type": "SD" }]
    });

    // Generate signature
    const hash = crypto.createHash("sha1").update(Buffer.from(contentKeyRequest)).digest();
    const cipher = crypto.createCipheriv("aes-256-cbc", signingKey, signingIv);
    const encryptedHash = cipher.update(hash, "", "hex") + cipher.final("hex");
    const signature = Buffer.from(encryptedHash, "hex").toString("base64");

    const keyServerRequest = JSON.stringify({
        "request": Buffer.from(contentKeyRequest).toString("base64"),
        "signature": signature,
        "signer": signer
    });

    const sendKeyServerRequest = async () => {
        try {
            const response = await axios.post(keyServerUrl, keyServerRequest, {
                headers: { 'Content-Type': 'application/json' }
            });

            const contentKeyResponseBase64 = response.data.response;
            const contentKeyResponse = JSON.parse(Buffer.from(contentKeyResponseBase64, "base64").toString("ascii"));

            const keyIdBase64 = contentKeyResponse.tracks[0].key_id;
            const keyBase64 = contentKeyResponse.tracks[0].key;
            const keyIdUuid = uuid.unparse(Buffer.from(keyIdBase64, "base64"));
            const pssh = contentKeyResponse.tracks[0].pssh[0].data;

            console.log();
            console.log(`Key ID: ${keyIdUuid}`);
            console.log(`Key: ${keyBase64}`);
            console.log();
            console.log(`Widevine PSSH data: ${pssh}`);
        } catch (error) {
            console.log("Error:", error.response ? `Content key request to key server failed with code ${error.response.status}. Contact Axinom to troubleshoot the issue.` : "Failed to connect to the key server. Check your internet connection.");
        }
    };

    sendKeyServerRequest();
})();
