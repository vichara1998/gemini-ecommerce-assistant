import { GoogleGenAI } from "@google/genai";

export const EMBEDDING_DIMENSION = 768;

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is required to generate embeddings");
}

const genAI = new GoogleGenAI({ apiKey });

export async function generateEmbedding(
  text: string,
  taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY",
): Promise<number[]> {
  const result = await genAI.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: {
      taskType,
      outputDimensionality: EMBEDDING_DIMENSION,
    },
  });

  const values = result.embeddings?.[0]?.values;
  if (!values) {
    throw new Error("Gemini returned no embedding values");
  }
  if (values.length !== EMBEDDING_DIMENSION) {
    throw new Error(
      `Gemini returned an embedding with ${values.length} dimensions; expected ${EMBEDDING_DIMENSION}`,
    );
  }

  return values;
}
