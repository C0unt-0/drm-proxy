

const videoDatabase = require("../VideoDatabase");
const fs = require('fs');


const CatalogService = {
    getVideoById: async (id) => {



        const filePath = '../videos.json'; // Specify the path to your JSON file

        let videoList = require('../videos.json');

        // Read the file asynchronously


        console.log(videoList);



        const video = videoList.find((item) => item.id === id);

        return video;
    },
};

module.exports = CatalogService;


