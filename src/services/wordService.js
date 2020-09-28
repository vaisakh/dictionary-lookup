import stream from 'stream';
import { promisify } from 'util';
import { createWriteStream, createReadStream } from 'fs';
import got from 'got';
import path from 'path';
import { wordDetails } from '../utils/utils'; 

const pipeline = promisify(stream.pipeline);

  export const fetchAndReturnTopTenWords = async() => {
    try {
      await fetchDocument();
      let topTenWords = await getTopTenWords();
      let details = await wordDetails(topTenWords);
      return details;
    } catch (error) {
      console.log(error);
    }
  }

  const fetchDocument = async() => {
    const docURL = 'http://norvig.com/big.txt';
    const filePath = path.join(__dirname, '../../documents/words.txt');
    const downloadStream = await got.stream(docURL);
    const fileWriterStream = await createWriteStream(filePath)

    await pipeline(downloadStream, fileWriterStream);
  }

  const getTopTenWords = async() => {
    let wordMap = {};
    const filePath = path.join(__dirname, '../../documents/words.txt');
    // const readable = createReadStream(filePath, {  encoding: 'utf8',  highWaterMark: 1024 });
    const readable = createReadStream(filePath);

    for await (const chunk of readable) {
      let data = chunk.toString().split(/\s+/);
      
      data.forEach(function (key) {
        if (wordMap.hasOwnProperty(key)) {
          wordMap[key]++;
        } else {
          wordMap[key] = 1;
        }
      });
    }
    
    let wordsArray = [];
    wordsArray = Object.keys(wordMap).map(function (key) {
      return { word: key, total: wordMap[key] };
    });
    
    wordsArray.sort(function (a, b) {
      return b.total - a.total;
    });
    
    let topTenWords = wordsArray.slice(0, 10);
    return topTenWords;
  }
  


