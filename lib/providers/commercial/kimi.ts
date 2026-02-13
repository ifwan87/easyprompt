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

export class KimiProvider extends BaseProvider {
    private client: OpenAI
    private apiKey: string | undefined

    constructor(apiKey?: string) {
        super()
        // Use provided API key or fall back to environment variable
        this.apiKey = apiKey || process.env.KIMI_API_KEY
        this.client = new OpenAI({
            apiKey: this.apiKey || 'dummy-key',
            baseURL: 'https://api.moonshot.cn/v1',
        })
    }

    // Override isAvailable to check for API key
    isAvailable(): boolean {
        return !!this.apiKey
    }

    readonly metadata: ProviderMetadata = {
        name: 'kimi',
        displayName: 'Kimi AI',
        category: 'commercial',
        location: 'cloud',
        requiresApiKey: true,
        isOpenAICompatible: true,
        supportsModelDiscovery: false,
        icon: 'kimi-icon',
        description: 'Moonshot AI\'s Kimi with extended context capabilities',
        documentation: 'https://platform.moonshot.cn/docs',
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
            id: 'moonshot-v1-128k',
            name: 'Kimi K2.5 (128K)',
            tier: 'standard',
            provider: 'kimi',
            contextWindow: 128000,
            description: 'Extended context window model for long documents',
            pricing: { input: 0.5, output: 2.0 },
        },
        {
            id: 'moonshot-v1-32k',
            name: 'Kimi K2.5 (32K)',
            tier: 'fast',
            provider: 'kimi',
            contextWindow: 32000,
            description: 'Faster model with 32K context window',
            pricing: { input: 0.3, output: 1.0 },
        },
        {
            id: 'moonshot-v1-8k',
            name: 'Kimi K2.5 (8K)',
            tier: 'fast',
            provider: 'kimi',
            contextWindow: 8000,
            description: 'Fastest model with 8K context window',
            pricing: { input: 0.1, output: 0.5 },
        },
    ]

    get defaultModel(): string {
        return 'moonshot-v1-128k'
    }

    async analyzePrompt(prompt: string, modelId?: string): Promise<AnalysisResult> {
        if (!this.isAvailable()) {
            throw new AuthenticationError('kimi', 'API key is missing')
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
            throw new AuthenticationError('kimi', 'API key is missing')
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
            throw new AuthenticationError('kimi', 'API key is missing')
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
                model: 'moonshot-v1-8k',
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
            console.error('[Kimi] Failed to parse JSON:', content.substring(0, 1000))
            throw new APIError('kimi', 'Failed to parse JSON response', 500, e)
        }
    }

    private handleError(error: unknown): void {
        if (error instanceof OpenAI.APIError) {
            if (error.status === 401) {
                throw new AuthenticationError('kimi', error.message)
            }
            if (error.status === 429) {
                throw new RateLimitError('kimi', undefined, error.message)
            }
            throw new APIError('kimi', error.message, error.status || 500, error)
        }
        throw new APIError('kimi', error instanceof Error ? error.message : 'Unknown error', 500, error)
    }
}
