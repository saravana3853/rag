import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const data_loader = {

    load_documents: async function(file_location){

        const loader = new PDFLoader(file_location, {
            splitPages: true,
        });
          
        const docs = await loader.load();

        return docs;
    }

};

export default data_loader;
