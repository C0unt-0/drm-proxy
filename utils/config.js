"use strict";

const fs = require("fs");

const COMMUNICATION_KEY_LENGTH_IN_BYTES = 32;
const SECRETS_FILE_NAME = "Secrets.json";

let secrets = null;

module.exports = {
    getSecrets() {
        return secrets;
    },

    areSecretsAvailable() {
        return secrets !== null;
    },

    async tryLoadSecrets() {
        try {
            await this.loadSecrets();
        } catch (error) {
            console.error(error.message);
        }
    },

    async loadSecrets() {
        if (!(await fs.existsSync(SECRETS_FILE_NAME))) {
            console.log(`No ${SECRETS_FILE_NAME} file found - only the built-in sample videos can be viewed.`);
            return;
        }

        console.log(`Loading ${SECRETS_FILE_NAME} file.`);

        secrets = require(`../${SECRETS_FILE_NAME}`);

        this.validateSecrets();
    },

    validateSecrets() {
        if (!secrets.communicationKeyId) {
            throw new Error(`${SECRETS_FILE_NAME} validation failed: communicationKeyId field is missing.`);
        }
        if (!secrets.communicationKey) {
            throw new Error(`${SECRETS_FILE_NAME} validation failed: communicationKey field is missing.`);
        }

        const communicationKeyBuffer = Buffer.from(secrets.communicationKey, "base64");

        if (communicationKeyBuffer.length !== COMMUNICATION_KEY_LENGTH_IN_BYTES) {
            throw new Error(
                `${SECRETS_FILE_NAME} validation failed: communicationKey did not contain ${COMMUNICATION_KEY_LENGTH_IN_BYTES} bytes of base64-encoded data.`
            );
        }

        if (secrets.communicationKeyId === "00000000-0000-0000-0000-000000000000" ||
            secrets.communicationKey === "00000000000000000000000000000000000000000w==") {
            throw new Error(`You need to replace the example values in ${SECRETS_FILE_NAME} with your own!`);
        }
    },

    async fileExists(fileName) {
        try {
            await fs.access(fileName);
            return true;
        } catch (error) {
            return false;
        }
    },
};
