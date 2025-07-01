/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private gemini: GoogleGenerativeAI;

  constructor() {
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }
  async onModuleInit() {
    try {
      const models = await this.listModels();
      console.log('✅ Gemini Models Available:\n', models);
    } catch (err) {
      console.error('❌ Failed to list Gemini models:', err);
    }
  }
  async chat(messages: { role: string; content: string }[]): Promise<string> {
    // Use the smallest available Gemini model for quota-free access
    const model = this.gemini.getGenerativeModel({
      model: 'models/gemini-1.5-flash-8b-001',
    });
    const result = await model.generateContent({
      contents: messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });
    if (
      result?.response?.candidates &&
      result.response.candidates[0]?.content?.parts &&
      result.response.candidates[0].content.parts[0]?.text
    ) {
      return result.response.candidates[0].content.parts[0].text;
    }
    return 'No response from Gemini.';
  }

  /**
   * Gemini Vision (image+text) chat using the latest supported multimodal model
   */
  async chatVision(
    messages: { role: string; content: string }[],
    imageBuffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    const model = this.gemini.getGenerativeModel({
      model: 'models/gemini-1.5-flash-8b-001', // Use the smallest/cheapest multimodal model
    });
    const result = await model.generateContent({
      contents: [
        ...messages.map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        })),
        {
          role: 'user',
          parts: [
            { text: 'Analyze the attached image.' },
            { inlineData: { data: imageBuffer.toString('base64'), mimeType } },
          ],
        },
      ],
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });
    if (
      result?.response?.candidates &&
      result.response.candidates[0]?.content?.parts &&
      result.response.candidates[0].content.parts[0]?.text
    ) {
      return result.response.candidates[0].content.parts[0].text;
    }
    return 'No response from Gemini Vision.';
  }

  /**
   * List available Gemini models for this API key (debugging utility)
   */
  async listModels(): Promise<any> {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to list models: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }
}
