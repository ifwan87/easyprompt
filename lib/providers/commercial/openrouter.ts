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

export class OpenRouterProvider extends BaseProvider {
    private client: OpenAI
    private apiKey: string | undefined

    constructor(apiKey?: string) {
        super()
        this.apiKey = apiKey || process.env.OPENROUTER_API_KEY
        this.client = new OpenAI({
            apiKey: this.apiKey || 'dummy-key',
            baseURL: 'https://openrouter.ai/api/v1',
            defaultHeaders: {
                'HTTP-Referer': 'https://easyprompt.app',
                'X-Title': 'EasyPrompt',
            },
        })
    }

    isAvailable(): boolean {
        return !!this.apiKey
    }

    readonly metadata: ProviderMetadata = {
        name: 'openrouter',
        displayName: 'OpenRouter',
        category: 'commercial',
        location: 'cloud',
        requiresApiKey: true,
        isOpenAICompatible: true,
        supportsModelDiscovery: false,
        icon: 'openrouter-icon',
        description: 'Access multiple AI models through one unified API',
        documentation: 'https://openrouter.ai/docs',
    }

    readonly capabilities: ProviderCapabilities = {
        streaming: true,
        supportsStreaming: true,
        functionCalling: true,
        vision: false,
        embeddings: false,
        maxTokens: 4096,
    }

    models: Model[] = [
        {
            id: 'google/gemini-flash-1.5',
            name: 'Gemini Flash 1.5',
            tier: 'fast',
            provider: 'openrouter',
            contextWindow: 1000000,
            description: 'Fast and affordable with 1M token context',
            pricing: { input: 0.075, output: 0.3 },
        },
        {
            id: 'anthropic/claude-3-haiku',
            name: 'Claude 3 Haiku',
            tier: 'fast',
            provider: 'openrouter',
            contextWindow: 200000,
            description: 'Fastest Claude model, very affordable',
            pricing: { input: 0.25, output: 1.25 },
        },
        {
            id: 'meta-llama/llama-3.1-8b-instruct',
            name: 'Llama 3.1 8B',
            tier: 'fast',
            provider: 'openrouter',
            contextWindow: 131072,
            description: 'Fast and affordable open model',
            pricing: { input: 0.06, output: 0.06 },
        },
        {
            id: 'anthropic/claude-3.5-sonnet',
            name: 'Claude 3.5 Sonnet',
            tier: 'standard',
            provider: 'openrouter',
            contextWindow: 200000,
            description: 'Most intelligent Claude model',
            pricing: { input: 3.0, output: 15.0 },
        },
        {
            id: 'openai/gpt-4o',
            name: 'GPT-4o',
            tier: 'standard',
            provider: 'openrouter',
            contextWindow: 128000,
            description: 'OpenAI flagship model',
            pricing: { input: 2.5, output: 10.0 },
        },
    ]

    get defaultModel(): string {
        return 'meta-llama/llama-3.1-8b-instruct'
    }

    async analyzePrompt(prompt: string, modelId?: string): Promise<AnalysisResult> {
        if (!this.isAvailable()) {
            throw new AuthenticationError('openrouter', 'API key is missing')
        }

        const model = this.getModel(modelId)

        try {
            const response = await this.client.chat.completions.create({
                model,
                messages: [
                    { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 4096,
            })

            const content = response.choices[0]?.message?.content || ''
            return this.parseJSON<AnalysisResult>(content)
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
            throw new AuthenticationError('openrouter', 'API key is missing')
        }

        const model = this.getModel(modelId)

        try {
            const response = await this.client.chat.completions.create({
                model,
                messages: [
                    { role: 'system', content: OPTIMIZATION_SYSTEM_PROMPT },
                    {
                        role: 'user',
                        content: `Original Prompt: ${prompt}\n\nAnalysis: ${JSON.stringify(analysis)}`,
                    },
                ],
                temperature: 0.7,
                max_tokens: 4096,
            })

            const content = response.choices[0]?.message?.content || ''
            return this.parseJSON<OptimizedPrompt>(content)
        } catch (error) {
            this.handleError(error)
            throw error
        }
    }

    async generatePreview(prompt: string, modelId?: string): Promise<string> {
        if (!this.isAvailable()) {
            throw new AuthenticationError('openrouter', 'API key is missing')
        }

        const model = this.getModel(modelId)

        try {
            const response = await this.client.chat.completions.create({
                model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 4096,
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
            const startTime = Date.now()
            await this.client.chat.completions.create({
                model: 'meta-llama/llama-3.1-8b-instruct',
                messages: [{ role: 'user', content: 'Hi' }],
                max_tokens: 1,
            })
            const latency = Date.now() - startTime

            return {
                available: true,
                modelsCount: this.models.length,
                latency,
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
            let cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
            const jsonMatch = cleanContent.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                cleanContent = jsonMatch[0]
            }
            return JSON.parse(cleanContent)
        } catch (e) {
            console.error('[OpenRouter] Failed to parse JSON:', content.substring(0, 1000))
            throw new APIError('openrouter', 'Failed to parse JSON response', 500, e)
        }
    }

    private handleError(error: unknown): void {
        if (error instanceof OpenAI.APIError) {
            if (error.status === 401) {
                throw new AuthenticationError('openrouter', error.message)
            }
            if (error.status === 429) {
                throw new RateLimitError('openrouter', undefined, error.message)
            }
            throw new APIError('openrouter', error.message, error.status || 500, error)
        }
        throw new APIError('openrouter', error instanceof Error ? error.message : 'Unknown error', 500, error)
    }
}
