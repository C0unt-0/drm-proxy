(() => {
    "use strict";

    // The responsibility of this module is to provide information about videos to other modules.

    // The videos are defined here. Add your videos to this list.
    const allVideos = [

        {
            "id": 'bcbf3075-9da6-478f-bbb6-5ad869179950',
            "name": "My video 2",
            "url": "http://localhost:8120/Video2/Encrypted_Cenc/Manifest.mpd",
            "keys": [
                {
                    "keyId": "f3d588c7-c17a-4033-9035-8db317390be6"
                },
                {
                    "keyId": "44b18a32-6d36-499d-8b93-a20f948ac5f2"
                },
                {
                    "keyId": "ae6e87e2-3c3c-46d1-8e9d-ef4c461d4681"
                },
            ]
        },
        {
            "id": '3af89f70-7b5e-4ece-b12a-87d550661b5a',
            "name": "My video 2",
            "url": "http://localhost:8120/Video2/Encrypted_Cenc/Manifest.mpd",
            "keys": [
                {
                    "keyId": "f3d588c7-c17a-4033-9035-8db317390be6"
                },
                {
                    "keyId": "44b18a32-6d36-499d-8b93-a20f948ac5f2"
                },
                {
                    "keyId": "ae6e87e2-3c3c-46d1-8e9d-ef4c461d4681"
                },
            ]
        }

    ];

    // Verifies that all critical information is present on a video.
    // Automatically performs sanity checks to avoid making mistakes in the above list. 
    const verifyVideoIntegrity = (video) => {
        if (!video) {
            throw new Error("A video was expected but was not present.");
        }
        if (!video.name || !video.name.length) {
            throw new Error("A video is missing its name.");
        }

        console.log(`Verifying integrity of video definition: ${video.name}`);

        if (!video.url || !video.url.length) {
            throw new Error("The video is missing its URL.");
        }

        // Either a hardcoded license token or the keys structure must exist. Not both.
        if (video.licenseToken && video.keys) {
            throw new Error("The video has both a hardcoded license token and a content key list - pick only one.");
        }
        if (!video.licenseToken && !video.keys) {
            throw new Error("The video is missing the content key list.");
        }

        if (video.keys) {
            if (!video.keys.length) {
                throw new Error("The content key list for this video is empty.");
            }

            // Verify that each item in the keys list has all the required data.
            video.keys.forEach((item) => {
                if (!item.keyId) {
                    throw new Error("A content key is missing the key ID.");
                }
            });
        }
    };

    // Verify all videos on startup.
    allVideos.forEach(verifyVideoIntegrity);

    module.exports = {
        getAllVideos: () => allVideos,
        getVideoById: (id) => allVideos.find((item) => item.id === id),
    };
})();
