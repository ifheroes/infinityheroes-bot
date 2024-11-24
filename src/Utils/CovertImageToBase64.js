const axios = require('axios');

async function ConvertImageToBase64(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    const mimeType = response.headers['content-type'];
    const base64Data = Buffer.from(response.data).toString('base64');

    return {
        mimeData: mimeType,
        base64Data: base64Data,
    };
}

module.exports = ConvertImageToBase64;
