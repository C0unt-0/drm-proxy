const express = require('express');
const router = express.Router();
const secretManagement = require('../utils/config');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const NO_SUCH_VIDEO_STATUS_CODE = 400;
const NEED_TO_KNOW_SECRETS_STATUS_CODE = 500;

const EntitlementService = {
    getToken: async (VideoId) => {
        const secrets = secretManagement.getSecrets();
        const communicationKeyAsBuffer = Buffer.from(secrets.communicationKey, 'base64');

        // We allow this token to be used within plus or minus 24 hours.
        const now = moment();
        const validFrom = now.clone().subtract(1, 'days');
        const validTo = now.clone().add(1, 'days');

        const message = {
            type: 'entitlement_message',
            version: 2,
            license: {
                start_datetime: validFrom.toISOString(),
                expiration_datetime: validTo.toISOString(),
                allow_persistence: true,
            },
            content_keys_source: {
                inline: [{
                    id: VideoId,
                    usage_policy: 'Policy A',
                }],
            },
            content_key_usage_policies: [
                {
                    name: 'Policy A',
                    playready: {
                        min_device_security_level: 150,
                        play_enablers: ['786627D8-C2A6-44BE-8F88-08AE255B01A7'],
                    },
                },
            ],
        };

        const envelope = {
            version: 1,
            com_key_id: secrets.communicationKeyId,
            message,
            begin_date: validFrom.toISOString(),
            expiration_date: validTo.toISOString(),
        };

        console.log('Creating license token with payload: ' + JSON.stringify(envelope));

        // The license token must be digitally signed to prove that it came from the token service.
        const licenseToken = jwt.sign(envelope, communicationKeyAsBuffer, {
            algorithm: 'HS256',
            noTimestamp: true,
        });

        return licenseToken;

    },
};


module.exports = EntitlementService;
