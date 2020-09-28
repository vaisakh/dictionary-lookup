import got from 'got';

const API_KEY = 'dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf';
const DIC_API = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?lang=en-en&key=' + API_KEY;

export const wordDetails = async(words) => {
  try {
    for (const word of words) {
      let pos = [];
      let syn = [];
      const responseJSON = await got(`${DIC_API}&text=${word.word}`);

      if(responseJSON && responseJSON.body) {
        let responseData = JSON.parse(responseJSON.body);
        if(responseData && responseData.def) {
          responseData.def.forEach((def) => {
            pos.push(def.pos);
            const moreData = def.tr;
            if(moreData) {
              moreData.forEach((moreDef) => {
                pos.push(moreDef.pos);
                const synonyms = moreDef.syn;
                if(synonyms) {
                  synonyms.forEach((synonym) => {
                    syn.push(synonym.text);
                    pos.push(synonym.pos);
                  })
                }
              })
            }
          })
          word['pos'] = pos;
          word['synonyms'] = syn;
        }
      }
    }
    return words;
  } catch (error) {
    console.log(error);
  }
}

