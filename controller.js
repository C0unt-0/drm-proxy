const EntitlementService = require('./services/entitlement.service.js');
const CatalogService = require('./services/catalog.service.js');
const { request } = require('express');


const Controller = {
    fairplay: async (req, res) => {
        try {
            const videoList = await CatalogService.getVideos();
            console.log(request.body);

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    widevine: async (req, res) => {
        try {
            const videoId = req.params.id;

            // add validation logic
            const videoList = await CatalogService.getVideos();


            const token = EntitlementService.getToken(videoId);
            console.log(token);

            // Make a new request to the third-party API
            const thirdPartyApiUrl = 'https://example.com/api';  // Replace with the actual URL
            const requestBody = req.body;  // Assuming the request body is what you want to send

            // Include existing headers and add new ones
            const existingHeaders = req.headers;
            const additionalHeaders = {
                'Content-Type': 'application/json',  // Modify as needed
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN',  // Add the necessary headers
                // Add any other headers you need
            };

            const headers = {
                ...existingHeaders,
                ...additionalHeaders,
            };

            const thirdPartyApiResponse = await axios.post(thirdPartyApiUrl, requestBody, { headers });

            // Handle the response from the third-party API as needed
            console.log(thirdPartyApiResponse.data);



            res.status(200).send('success');


        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    playready: async (req, res) => {
        try {

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
};

module.exports = Controller;