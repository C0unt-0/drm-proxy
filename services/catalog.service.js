

const videoDatabase = require("../VideoDatabase");


const CatalogService = {
    getVideos: async () => {
        try {
            const videoList = videoDatabase.getAllVideos().map((video) => ({
                name: video.name,
                url: video.url,
                tags: video.tags,
            }));


            return videoList;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = CatalogService;


