import { fetchAndReturnTopTenWords } from '../services/wordService';

class wordsController {
  static async getWords(req, res) {
    const words = await fetchAndReturnTopTenWords();
    return res.json({
      message: "Top 10 words",
      words: words
    });
  }
}

export default wordsController;
