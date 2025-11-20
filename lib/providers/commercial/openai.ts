import OpenAI from 'openai'
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
import { APIError, AuthenticationError, RateLimitError } from '../errors'

export class OpenAIProvider extends BaseProvider {
    private client: OpenAI
    private apiKey: string | undefined

    constructor(apiKey?: string) {
        super()
        // Use provided API key or fall back to environment variable
        this.apiKey = apiKey || process.env.OPENAI_API_KEY
        this.client = new OpenAI({
            apiKey: this.apiKey || 'dummy-key',
            dangerouslyAllowBrowser: true, // We're using this on server, but just in case
        })
    }

    // Override isAvailable to check for API key
    isAvailable(): boolean {
        return !!this.apiKey
    }

    readonly metadata: ProviderMetadata = {
        name: 'openai',
        displayName: 'OpenAI GPT',
        category: 'commercial',
        location: 'cloud',
        requiresApiKey: true,
        isOpenAICompatible: true,
        supportsModelDiscovery: false,
        icon: 'openai-icon',
        description: 'Most popular AI with strong creative and coding capabilities',
        documentation: 'https://platform.openai.com/docs',
    }

    readonly capabilities: ProviderCapabilities = {
        streaming: true,
        supportsStreaming: true,
        functionCalling: true,
        vision: true,
        embeddings: true,
        maxTokens: 4096,
    }

    models: Model[] = [
        {
            id: 'gpt-4-turbo',
            name: 'GPT-4 Turbo',
            tier: 'premium',
            provider: 'openai',
            contextWindow: 128000,
            description: 'Latest GPT-4 model',
            pricing: { input: 10.0, output: 30.0 },
        },
        {
            id: 'gpt-4o',
            name: 'GPT-4o',
            tier: 'standard',
            provider: 'openai',
            contextWindow: 128000,
            description: 'Fastest and most capable flagship model',
            pricing: { input: 5.0, output: 15.0 },
        },
        {
            id: 'gpt-3.5-turbo',
            name: 'GPT-3.5 Turbo',
            tier: 'fast',
            provider: 'openai',
            contextWindow: 16385,
            description: 'Cost-effective model',
            pricing: { input: 0.5, output: 1.5 },
        },
    ]

    get defaultModel(): string {
        return 'gpt-4o'
    }

    async analyzePrompt(prompt: string, modelId?: string): Promise<AnalysisResult> {
        if (!this.isAvailable()) {
            throw new AuthenticationError('openai', 'API key is missing')
        }

        const model = this.getModel(modelId)

        try {
            const response = await this.client.chat.completions.create({
                model,
                messages: [
                    { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
                    { role: 'user', content: prompt },
                ],
                response_format: { type: 'json_object' },
            })

            const content = response.choices[0]?.message?.content || '{}'
            return JSON.parse(content)
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
            throw new AuthenticationError('openai', 'API key is missing')
        }

        const model = this.getModel(modelId)

        try {
            const response = await this.client.chat.completions.create({
                model,
                messages: [
                    { role: 'system', content: OPTIMIZATION_SYSTEM_PROMPT },
                    {
                        role: 'user',
                        content: `Original Prompt: ${prompt}\n\nAnalysis: ${JSON.stringify(analysis)}`
                    },
                ],
                response_format: { type: 'json_object' },
            })

            const content = response.choices[0]?.message?.content || '{}'
            return JSON.parse(content)
        } catch (error) {
            this.handleError(error)
            throw error
        }
    }

    async generatePreview(prompt: string, modelId?: string): Promise<string> {
        if (!this.isAvailable()) {
            throw new AuthenticationError('openai', 'API key is missing')
        }

        const model = this.getModel(modelId)

        try {
            const response = await this.client.chat.completions.create({
                model,
                messages: [{ role: 'user', content: prompt }],
            })

            return response.choices[0]?.message?.content || ''
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
            await this.client.models.list()
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

    private handleError(error: unknown): void {
        if (error instanceof OpenAI.APIError) {
            if (error.status === 401) {
                throw new AuthenticationError('openai', error.message)
            }
            if (error.status === 429) {
                throw new RateLimitError('openai', undefined, error.message)
            }
            throw new APIError('openai', error.message, error.status, error)
        }
        throw new APIError('openai', error instanceof Error ? error.message : 'Unknown error', 500, error)
    }
}
