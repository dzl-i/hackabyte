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
  lectureId: string;
};

export type Cluster = {
    text: string;
    timestamp: string;
}

export const groupTranscripts = async (lectureId: string) => {
  const lectureCollection = await initializeCollection();

  const transcripts = await lectureCollection.get({
    where: { lectureId },
    // @ts-ignore
    include: ["documents", "metadatas", "embeddings"],
  });

  return clustersTranscripts(
    transcripts.documents,
    transcripts.metadatas,
    transcripts.embeddings,
    0.75
  );
};

const clustersTranscripts = (documents, metadatas, embeddings, threshold) => {
  // Initialize clusters
  let clusters: Cluster[][] = [];
  let processedIndices = new Set();

  // Process each segment
  for (let i = 0; i < documents.length; i++) {
    // Skip already processed segments
    if (processedIndices.has(i)) continue;

    // Create a new cluster with this segment
    let cluster: Cluster[] = [
      {
        text: documents[i],
        timestamp: metadatas[i].timestamp,
      },
    ];

    processedIndices.add(i);

    // Find similar segments
    for (let j = 0; j < documents.length; j++) {
      if (i === j || processedIndices.has(j)) continue;

      // Calculate cosine similarity between embeddings
      const similarity = calculateCosineSimilarity(
        embeddings[i],
        embeddings[j]
      );

      // If similarity is above threshold, add to this cluster
      if (similarity >= threshold) {
        cluster.push({
          text: documents[j],
          timestamp: metadatas[j].timestamp,
        });
        processedIndices.add(j);
      }
    }

    // Sort segments by timestamp
    cluster.sort((a: Cluster, b: Cluster) =>
      a.timestamp.localeCompare(b.timestamp)
    );

    clusters.push(cluster);
  }

  return clusters;
};

export const addTranscripts = async (transcripts: Transcript[]) => {
  const lectureCollection = await initializeCollection();

  // Add transcripts to collection
  await lectureCollection.add({
    ids: transcripts.map((transcript) => transcript.timestamp),
    metadatas: transcripts.map((transcript) => ({
      timestamp: transcript.timestamp,
    })),
    documents: transcripts.map((transcript) => transcript.text),
  });
};

const initializeCollection = async () => {
  const lectureCollection = await chromaClient.getOrCreateCollection({
    name: "lecture_Transcripts",
    metadata: { "hnsw:space": "cosine" },
    embeddingFunction,
  });

  return lectureCollection;
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
