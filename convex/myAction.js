"use node";
import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

// Helper function to create embeddings instance
const createEmbeddings = () => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GOOGLE_API_KEY not found. Please set it in your Convex environment variables."
    );
  }

  return new GoogleGenerativeAIEmbeddings({
    apiKey,
    model: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
  });
};

export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.string()
  },
  handler: async (ctx, args) => {
    try {
      const embeddings = createEmbeddings();
      const metadata = { fileId: args.fileId };

      if (!Array.isArray(args.splitText) || args.splitText.length === 0) {
        throw new Error("splitText must be a non-empty array");
      }

      await ConvexVectorStore.fromTexts(
        args.splitText,
        metadata,
        embeddings,
        { ctx }
      );

      return {
        success: true,
        message: "Text ingestion completed successfully"
      };
    } catch (error) {
      // Log the error for debugging (will appear in Convex dashboard)
      console.error("Ingest error:", error);
      
      return {
        success: false,
        error: error.message || "An error occurred during text ingestion"
      };
    }
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string()
  },
  handler: async (ctx, args) => {
    try {
      if (!args.query.trim()) {
        throw new Error("Search query cannot be empty");
      }

      const embeddings = createEmbeddings();
      const vectorStore = new ConvexVectorStore(embeddings, { ctx });

      const searchResults = await vectorStore.similaritySearch(args.query, 1);
      const filteredResults = searchResults.filter(
        (result) => result.metadata.fileId === args.fileId
      );

      return {
        success: true,
        results: filteredResults
      };
    } catch (error) {
      console.error("Search error:", error);
      
      return {
        success: false,
        error: error.message || "An error occurred during search"
      };
    }
  }
});