import express from 'express';
import bodyParser from 'body-parser';
import { createTrack } from '../services/crud/tracks.js';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import fetch, { Response } from 'node-fetch';

const router = express.Router();

router.use(bodyParser.json());

router.get('/youtube/:url', async (req, res) => {
    const lastPart = req.params.url;

    const videoURL = `https://www.youtube.com/watch?v=${lastPart}`;

    if (!ytdl.validateURL(videoURL)) {
        return res.status(400).send("Invalid YouTube URL.");
    }

    try {
        const info = await ytdl.getInfo(videoURL);

        const title = info.videoDetails.title;
        const artist = info.videoDetails.author.name; 
        const type_id = 1;  

        const audioStream = ytdl(videoURL, {
            filter: format => format.audioBitrate && format.container === 'mp4',  // for instance, select MP4 formats
            quality: 'highestaudio'  // Select the highest audio quality available
        });
        const outputFilePath = `dump/temp.mp3`;

        ffmpeg()
            .input(audioStream)
            .audioBitrate(320)
            .toFormat('mp3')
            .on('end', async () => {
                const audioBuffer = fs.readFileSync(outputFilePath);
                const imgBuffer = await fetch(info.videoDetails.thumbnails[0].url).then((response:Response) => response.buffer());

                const track = await createTrack(title, artist, type_id, audioBuffer, imgBuffer);

                fs.unlink(outputFilePath, () => {
                    console.log("Temp file removed");
                });

                res.json(track); 
            })
            .on('error', (err) => {
                console.error(err);
                res.status(500).send("Error processing your request.");
            })
            .pipe(fs.createWriteStream(outputFilePath), { end: true });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to fetch video info.");
    }
});




export default router;