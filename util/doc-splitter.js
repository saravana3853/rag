import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const doc_splitter = {

    split_documents: async function(documents){
        
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 100,
        });
        
        const docOutput = await splitter.splitDocuments(documents);

        return docOutput;
    }

}

export default doc_splitter;
