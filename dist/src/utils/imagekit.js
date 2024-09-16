"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initimagekit = void 0;
var ImageKit = require("imagekit");
const initimagekit = () => {
    var imagekit = new ImageKit({
        publicKey: process.env.PUBLICKEY_IMAGEKIT,
        privateKey: process.env.PRIVATEKEY_IMAGEKIT,
        urlEndpoint: process.env.ENDPOINT_URL
    });
    return imagekit;
};
exports.initimagekit = initimagekit;
//# sourceMappingURL=imagekit.js.map