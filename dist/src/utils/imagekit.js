"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initimagekit = void 0;
var ImageKit = require("imagekit");
const initimagekit = () => {
    var imagekit = new ImageKit({
        publicKey: process.env.PUBLICKEY_IMAGEKIT || 'public_Q9pB1wASRu8V3bNzb7ewPtavWUY',
        privateKey: process.env.PRIVATEKEY_IMAGEKIT || 'private_yJx+qECjVyvClE0l1q1jiUKVHcM=',
        urlEndpoint: process.env.ENDPOINT_URL || 'https://ik.imagekit.io/gqtxnz1656'
    });
    return imagekit;
};
exports.initimagekit = initimagekit;
//# sourceMappingURL=imagekit.js.map