import { Injectable } from '@nestjs/common';

export interface EmbeddingChunk {
  text: string;
  embedding: number[];
}

@Injectable()
export class EmbeddingService {
  private memory: EmbeddingChunk[] = [];

  // Dummy embedding for Gemini-only mode
  async embedText(text: string): Promise<number[]> {
    // Return a simple hash as a fake embedding
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    return [hash % 1000];
  }

  async addChunk(text: string) {
    const embedding = await this.embedText(text);
    this.memory.push({ text, embedding });
  }

  similarity(a: number[], b: number[]): number {
    // Simple similarity for demo
    return a[0] === b[0] ? 1 : 0;
  }

  async retrieveRelevant(query: string, topN = 3): Promise<EmbeddingChunk[]> {
    const queryEmbedding = await this.embedText(query);
    return this.memory
      .map((chunk) => ({
        ...chunk,
        score: this.similarity(chunk.embedding, queryEmbedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);
  }
}
