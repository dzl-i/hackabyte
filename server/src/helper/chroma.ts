import { ChromaClient, Collection, OpenAIEmbeddingFunction } from "chromadb";
import { OpenAI } from "openai";

const PORT = 8000;

const openAI = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const embeddingFunction = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPEN_AI_API_KEY,
  openai_model: "text-embedding-3-small",
});

export const chromaClient = new ChromaClient({
  path: "http://" + process.env.CHROMA_IP_ADDRESS + ":" + PORT,
});

export type Transcript = {
  text: string;
  timestamp: string;
};

export type VectorisedObject = {
  text: string;
  timestamp: string;
  embedding: number[];
};

export const groupTranscripts = async (transcript: string) => {
  // Process transcript string into transcript object
  const transcripts: Transcript[] = parseTranscripts(transcript);

  // Vectorize every transcript object
  const vectorisedObjects: VectorisedObject[] = await Promise.all(
    transcripts.map(async (transcript) => {
      const response = await openAI.embeddings.create({
        model: "text-embedding-3-small",
        input: transcript.text,
      });

      return {
        text: transcript.text,
        timestamp: transcript.timestamp,
        embedding: response.data[0].embedding,
      };
    })
  );

  // Initialize clusters
  let clusters: Transcript[][] = [];
  let processedIndices = new Set();
  const threshold = 0.75;

  // Process each segment
  for (let i = 0; i < vectorisedObjects.length; i++) {
    // Skip already processed segments
    if (processedIndices.has(i)) continue;

    // Create a new cluster with this segment
    let cluster: Transcript[] = [
      {
        text: vectorisedObjects[i].text,
        timestamp: vectorisedObjects[i].timestamp,
      },
    ];

    processedIndices.add(i);

    // Find similar segments
    for (let j = 0; j < vectorisedObjects.length; j++) {
      if (i === j || processedIndices.has(j)) continue;

      // Calculate cosine similarity between embeddings
      const similarity = calculateCosineSimilarity(
        vectorisedObjects[i].embedding,
        vectorisedObjects[j].embedding
      );

      // If similarity is above threshold, add to this cluster
      if (similarity >= threshold) {
        cluster.push({
          text: vectorisedObjects[j].text,
          timestamp: vectorisedObjects[j].timestamp,
        });
        processedIndices.add(j);
      }
    }

    // Sort segments by timestamp
    cluster.sort((a: Transcript, b: Transcript) =>
      a.timestamp.localeCompare(b.timestamp)
    );

    clusters.push(cluster);
  }

  return JSON.stringify(clusters);
};

const parseTranscripts = (transcript: string): Transcript[] => {
  const lines = transcript.trim().split("\n");

  const parsed: Transcript[] = [];

  // Process each line
  for (const line of lines) {
    // This pattern looks for anything up to the first space as timestamp,
    // and everything after as text
    const match = line.match(/^(\S+)\s+(.+)$/);

    if (match) {
      parsed.push({
        timestamp: match[1],
        text: match[2],
      });
    }
  }

  return parsed;
};

const calculateCosineSimilarity = (vecA: number[], vecB: number[]) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  return dotProduct / (normA * normB);
};
