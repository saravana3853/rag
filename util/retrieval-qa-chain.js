import { OpenAIEmbeddings, OpenAI } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { ConversationalRetrievalQAChain } from "langchain/chains"
import {HumanMessage, AIMessage} from "@langchain/core/messages"
import {ChatMessageHistory} from "langchain/stores/message/in_memory"

const retrieval_qa_chain = {

    ask_question : async function(document_id, question, chat_history = [] ){

        const directory = "./vector-db/faiss-store";
        const model = new OpenAI({openAIApiKey: 'sk-proj-BgpHOPYnpTYKJ9GkjDJPT3BlbkFJnq6UIM5nRHvOh7l4aWVd'});
        
        // Load the vector store from the same directory
        const loadedVectorStore = await FaissStore.load(
            directory,
            new OpenAIEmbeddings({openAIApiKey: 'sk-proj-BgpHOPYnpTYKJ9GkjDJPT3BlbkFJnq6UIM5nRHvOh7l4aWVd'})
        );

        const chain = ConversationalRetrievalQAChain.fromLLM(
            model,
            loadedVectorStore.asRetriever(),
            {
                returnSourceDocuments: true,
            }
        );

        const responce = await chain.invoke({question: question, chat_history: chat_history});

        const history = new ChatMessageHistory();
        await history.addMessage(new HumanMessage(question));
        await history.addMessage(new AIMessage(responce.text));

        chat_history.push(history.messages[0]);
        chat_history.push(history.messages[1]);
 
        const answer = {
            answer: responce.text,
            chat_history: chat_history,
            source:  responce.sourceDocuments
        }

        return answer;
    }

}

export default retrieval_qa_chain;
