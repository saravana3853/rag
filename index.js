import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import url from 'url';
import dataLoader from './util/data-loader.js'
import doc_splitter from './util/doc-splitter.js';
import vectorizer from './util/vectorizer.js';
import retrieval_qa_chain from './util/retrieval-qa-chain.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());

/**
 * Set storage engine for multer 
 * And create the Destination folder for uploaded files
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        var folder = './uploads/'

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
  
// Initialize multer
const upload = multer({
    storage: storage,
});
  
/**
 * Define a route to handle file uploads
 * And if file was uploaded successfully, send a success response
 */
app.post('/upload', upload.single('file'), (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({ message: 'File uploaded successfully', fileName: req.file.filename });
});



/**
 * Embed documentation
 */
app.get('/embedding-document', async (req, res) => {
    try{
        var filePath = path.resolve(__dirname, "./uploads/"+req.query.document);
        const docs = await dataLoader.load_documents(filePath);
        const splitted_doc = await doc_splitter.split_documents(docs);
        await vectorizer.embed_and_store(req.query.document, splitted_doc);

        res.send({status:"SUCCESS"});
    }catch (error) {
        console.log(error);
        res.send({status:"FAILED", message:"I\'ve encountered an unexpected error. :)" });
    }
});



/**
 * Define a GET route
 */
app.get('/qa_chain', async (req, res) => {

    try{
        const documentID = req.query.document;

        const answer = await retrieval_qa_chain.ask_question(documentID, req.query.question, []);
        res.send(answer);
    }catch (error) {
        console.log(error);
        res.send({status:"FAILED", answer : "Ooops, I\'ve encountered an unexpected error. :)" });
    }

});

  
/**
 * Start the server
 */
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
