import { NextRequest, NextResponse } from "next/server";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateEmbedding } from "@/lib/embeddings";


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ASTRA_DB_TOKEN = process.env.ASTRA_DB_TOKEN;
const ASTRA_DB_ENDPOINT = process.env.ASTRA_DB_ENDPOINT;
const ASTRA_DB_NAMESPACE = process.env.ASTRA_DB_NAMESPACE;
const ASTRA_DB_COLLECTION = process.env.ASTRA_DB_COLLECTION;


// console.log(`Using Gemini Key: ${GEMINI_API_KEY ? 'Loaded' : 'NOT Loaded'}`);
// console.log(`Astra Endpoint: ${ASTRA_DB_ENDPOINT}`);

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const client = new DataAPIClient(ASTRA_DB_TOKEN);
const db = client.db(ASTRA_DB_ENDPOINT, { keyspace: ASTRA_DB_NAMESPACE });

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        const latestMessage = messages[messages.length - 1]?.content;

        if (!latestMessage) {
            return NextResponse.json({ error: "No message provided" }, { status: 400 });
        }

        
        const embedding = await generateEmbedding(latestMessage, "RETRIEVAL_QUERY");

       
        const collection = db.collection(ASTRA_DB_COLLECTION);
        const docs = await collection
            .find({}, {
                sort: { $vector: embedding },
                limit: 5,
                includeSimilarity: true
            })
            .toArray();

        const docContext = docs.map((d: any) => d.text).join("\n\n");

        
        const conversationHistory = messages
            .slice(0, -1)
            .map((msg: any) => `${msg.role === "user" ? "Customer" : "Assistant"}: ${msg.content}`)
            .join("\n");

      
        const systemPrompt = `You are an e-commerce assistant. Use the following knowledge base to answer customer questions accurately and professionally:

Knowledge Base:
${docContext}

Conversation:
${conversationHistory}

User: ${latestMessage}`;

        
        let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(systemPrompt);

        const aiReply = result.response.text();

        
        return NextResponse.json({
            role: "assistant",
            content: aiReply
        });

    } catch (err) {
        console.error("API ERROR →", err);
        return NextResponse.json(
            {
                role: "assistant",
                content: " Sorry, something went wrong while processing your request."
            },
            { status: 500 }
        );
    }
}
