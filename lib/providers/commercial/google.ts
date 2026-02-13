import { GoogleGenerativeAI } from '@google/generative-ai'
import { BaseProvider } from '../base'
import {
    AnalysisResult,
    HealthStatus,
    Model,
    OptimizedPrompt,
    ProviderCapabilities,
    ProviderMetadata,
} from '../types'
import { ANALYSIS_SYSTEM_PROMPT } from '../../prompts/analysis'
import { OPTIMIZATION_SYSTEM_PROMPT } from '../../prompts/optimization'
import { APIError, AuthenticationError } from '../errors'

export class GoogleProvider extends BaseProvider {
    private client: GoogleGenerativeAI
    private apiKey: string | undefined

    constructor(apiKey?: string) {
        super()
        // Use provided API key or fall back to environment variable
        this.apiKey = apiKey || process.env.GOOGLE_API_KEY
        this.client = new GoogleGenerativeAI(this.apiKey || 'dummy-key')
    }

    // Override isAvailable to check for API key
    override isAvailable(): boolean {
        return !!this.apiKey
    }

    readonly metadata: ProviderMetadata = {
        name: 'google',
        displayName: 'Google Gemini',
        category: 'commercial',
        location: 'cloud',
        requiresApiKey: true,
        isOpenAICompatible: false,
        supportsModelDiscovery: false,
        icon: 'google-icon',
        description: 'Fast, capable AI with multimodal support',
        documentation: 'https://ai.google.dev/docs',
    }

    readonly capabilities: ProviderCapabilities = {
        streaming: true,
        supportsStreaming: true,
        functionCalling: true,
        vision: true,
        embeddings: true,
        maxTokens: 8192,
    }

    models: Model[] = [
        {
            id: 'gemini-1.5-flash-latest',
            name: 'Gemini 1.5 Flash',
            tier: 'fast',
            provider: 'google',
            contextWindow: 1000000,
            description: 'Fast and versatile multimodal model (Default)',
        },
        {
            id: 'gemini-1.5-pro-latest',
            name: 'Gemini 1.5 Pro',
            tier: 'premium',
            provider: 'google',
            contextWindow: 2000000,
            description: 'Best performing multimodal model',
        },
    ]

    get defaultModel(): string {
        return 'gemini-1.5-flash-latest'
    }

    async analyzePrompt(prompt: string, modelId?: string): Promise<AnalysisResult> {
        if (!this.isAvailable()) {
            throw new AuthenticationError('google', 'API key is missing')
        }

        const modelName = this.getModel(modelId)
        const model = this.client.getGenerativeModel({ model: modelName })

        try {
            const result = await model.generateContent([
                ANALYSIS_SYSTEM_PROMPT,
                `Analyze this prompt: ${prompt}`,
            ])
            const response = result.response
            const text = response.text()
            return this.parseJSON<AnalysisResult>(text)
        } catch (error) {
            this.handleError(error)
            throw error
        }
    }

    async optimizePrompt(
        prompt: string,
        analysis: AnalysisResult,
        modelId?: string
    ): Promise<OptimizedPrompt> {
        if (!this.isAvailable()) {
            throw new AuthenticationError('google', 'API key is missing')
        }

        const modelName = this.getModel(modelId)
        const model = this.client.getGenerativeModel({ model: modelName })

        try {
            const result = await model.generateContent([
                OPTIMIZATION_SYSTEM_PROMPT,
                `Original Prompt: ${prompt}`,
                `Analysis: ${JSON.stringify(analysis)}`,
            ])
            const response = result.response
            const text = response.text()
            return this.parseJSON<OptimizedPrompt>(text)
        } catch (error) {
            this.handleError(error)
            throw error
        }
    }

    async generatePreview(prompt: string, modelId?: string): Promise<string> {
        if (!this.isAvailable()) {
            throw new AuthenticationError('google', 'API key is missing')
        }

        const modelName = this.getModel(modelId)
        const model = this.client.getGenerativeModel({ model: modelName })

        try {
            const result = await model.generateContent(prompt)
            const response = result.response
            return response.text()
        } catch (error) {
            this.handleError(error)
            throw error
        }
    }

    async healthCheck(): Promise<HealthStatus> {
        if (!this.isAvailable()) {
            return { available: false, error: 'API key missing' }
        }

        try {
            const model = this.client.getGenerativeModel({ model: 'gemini-1.5-flash' })
            await model.generateContent('Hi')
            return {
                available: true,
                modelsCount: this.models.length,
                latency: 0,
            }
        } catch (error) {
            return {
                available: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }
        }
    }

    private parseJSON<T>(content: string): T {
        try {
            const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
            return JSON.parse(cleanContent)
        } catch (e) {
            throw new APIError('google', 'Failed to parse JSON response', 500, e)
        }
    }

    private handleError(error: unknown): void {
        throw new APIError('google', error instanceof Error ? error.message : 'Unknown error', 500, error)
    }
}
