const express = require('express');
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const app = express();

app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/download', async (req, res) => {
    const { videoUrl } = req.body;

    try {
        const info = await ytdl.getInfo(videoUrl);
        const formats = ytdl.filterFormats(info.formats, 'video');

        if (formats.length > 0) {
            const video = formats[0];
            res.header('Content-Disposition', `attachment; filename="${info.title}.mp4"`);
            ytdl(video.url).pipe(res);
        } else {
            res.status(400).send('No video formats available.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error downloading video.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
