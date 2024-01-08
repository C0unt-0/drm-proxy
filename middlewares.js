const EntitlementService = require('./services/entitlement.service.js');
const CatalogService = require('./services/catalog.service.js');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
var proxy = require('express-http-proxy');




const axios = require('axios');
const https = require('https');


const { request } = require('express');

const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});


const Controller = {
    fairplay: async (req, res) => {
        try {
            const videoList = await CatalogService.getVideoById();
            console.log(request.body);

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
    // widevine: proxy('https://enbsdchmndarf.x.pipedream.net',),

    widevine: createProxyMiddleware({
        target: "https://drm-widevine-licensing.axprod.net/AcquireLicense",
        secure: false, ignorePath: true, changeOrigin: true, onProxyRes: (proxyRes, req, res) => {
            console.log(res.status);
        }, on: {
            proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
                // log original request and proxied request info
                const exchange = `[DEBUG] ${req.method} ${req.path} -> ${proxyRes.req.protocol}//${proxyRes.req.host}${proxyRes.req.path} [${proxyRes.statusCode}]`;
                console.log(exchange); // [DEBUG] GET / -> http://www.example.com [200]

                // log complete response
                const response = responseBuffer.toString('utf8');
                console.log(response); // log response body

                return responseBuffer;
            })

        }
    }),
    setTokenHeader: async (req, res, next) => {

        const videoId = req.params.id;

        // add validation logic

        console.log(videoId);
        const targetVideo = await CatalogService.getVideoById(videoId);



        if (targetVideo) {
            // The video with the specified id was found
            console.log('Found video:', targetVideo);
        } else {
            // No video with the specified id was found
            console.log('Video not found');
        }


        const token = await EntitlementService.getToken(targetVideo);


        req.headers['X-AxDRM-Message'] = token;
        next();

    }
};

module.exports = Controller;