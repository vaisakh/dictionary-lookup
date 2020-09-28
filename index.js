import express from 'express';
import wordsController from './src/controllers/wordsController';

const router = express.Router();
router.get('/', wordsController.getWords);

const app = express()

app.use(router);

app.listen(8000,()=>
console.log(`Server is listening on port 8000`))
