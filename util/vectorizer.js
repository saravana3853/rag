import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

const vectorizer = {

    embed_and_store: async function(vector_store, split_documents){

        // Load the docs into the vector store
        const vectorStore = await FaissStore.fromDocuments(
            split_documents,
            new OpenAIEmbeddings({openAIApiKey: 'sk-proj-BgpHOPYnpTYKJ9GkjDJPT3BlbkFJnq6UIM5nRHvOh7l4aWVd'})
        );

        // Save the vector store to a directory
        const directory = "./vector-db/faiss-store/"+vector_store;

        await vectorStore.save(directory);
    }

} 

export default vectorizer;
