import Anthropic from '@anthropic-ai/sdk'
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

export class AnthropicProvider extends BaseProvider {
    private client: Anthropic
    private apiKey: string | undefined

    constructor(apiKey?: string) {
        super()
        // Use provided API key or fall back to environment variable
        this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY
        this.client = new Anthropic({
            apiKey: this.apiKey || 'dummy-key', // Prevent crash if key missing, check in isAvailable
        })
    }

    // Override isAvailable to check for API key
    override isAvailable(): boolean {
        return !!this.apiKey
    }

    readonly metadata: ProviderMetadata = {
        name: 'anthropic',
        displayName: 'Anthropic Claude',
        category: 'commercial',
        location: 'cloud',
        requiresApiKey: true,
        isOpenAICompatible: false,
        supportsModelDiscovery: false,
        icon: 'anthropic-icon',
        description: 'Most intelligent AI model with exceptional reasoning',
        documentation: 'https://docs.anthropic.com',
    }

    readonly capabilities: ProviderCapabilities = {
        streaming: true,
        supportsStreaming: true,
        functionCalling: true,
        vision: true,
        embeddings: false,
        maxTokens: 4096,
    }

    models: Model[] = [
        {
            id: 'claude-3-5-sonnet-20241022',
            name: 'Claude 3.5 Sonnet',
            tier: 'standard',
            provider: 'anthropic',
            contextWindow: 200000,
            description: 'Most intelligent model',
            pricing: { input: 3.0, output: 15.0 },
        },
        {
            id: 'claude-3-opus-20240229',
            name: 'Claude 3 Opus',
            tier: 'premium',
            provider: 'anthropic',
            contextWindow: 200000,
            description: 'Powerful model for complex tasks',
            pricing: { input: 15.0, output: 75.0 },
        },
        {
            id: 'claude-3-haiku-20240307',
            name: 'Claude 3 Haiku',
            tier: 'fast',
            provider: 'anthropic',
            contextWindow: 200000,
            description: 'Fastest and most compact model',
            pricing: { input: 0.25, output: 1.25 },
        },
    ]

    get defaultModel(): string {
        return 'claude-3-haiku-20240307'
    }

    private extractText(response: Anthropic.Messages.Message): string {
        const block = response.content[0]
        if (block && block.type === 'text') {
            return block.text
        }
        return ''
    }

    async analyzePrompt(prompt: string, modelId?: string): Promise<AnalysisResult> {
        if (!this.isAvailable()) {
            throw new AuthenticationError('anthropic', 'API key is missing')
        }

        const model = this.getModel(modelId)

        try {
            const response = await this.client.messages.create({
                model,
                max_tokens: 4096,
                system: ANALYSIS_SYSTEM_PROMPT,
                messages: [{ role: 'user', content: prompt }],
            })

            const content = this.extractText(response)
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
            throw new AuthenticationError('anthropic', 'API key is missing')
        }

        const model = this.getModel(modelId)

        try {
            const response = await this.client.messages.create({
                model,
                max_tokens: 4096,
                system: OPTIMIZATION_SYSTEM_PROMPT,
                messages: [
                    {
                        role: 'user',
                        content: `Original Prompt: ${prompt}\n\nAnalysis: ${JSON.stringify(analysis)}`
                    },
                ],
            })

            const content = this.extractText(response)
            return this.parseJSON<OptimizedPrompt>(content)
        } catch (error) {
            this.handleError(error)
            throw error
        }
    }

    async generatePreview(prompt: string, modelId?: string): Promise<string> {
        if (!this.isAvailable()) {
            throw new AuthenticationError('anthropic', 'API key is missing')
        }

        const model = this.getModel(modelId)

        try {
            const response = await this.client.messages.create({
                model,
                max_tokens: 4096,
                messages: [{ role: 'user', content: prompt }],
            })

            return this.extractText(response)
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
            // Simple call to check connectivity
            await this.client.messages.create({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1,
                messages: [{ role: 'user', content: 'Hi' }],
            })

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
            // Remove markdown code blocks
            let cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()

            // Try to extract JSON from text if it's wrapped in other content
            const jsonMatch = cleanContent.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                cleanContent = jsonMatch[0]
            }

            // Try parsing first - if it works, great!
            try {
                return JSON.parse(cleanContent)
            } catch (firstError) {
                // If parsing fails, try to fix common issues with control characters
                // This approach properly handles nested quotes and escaped characters
                let fixed = cleanContent
                let inString = false
                let escaped = false
                let result = ''

                for (let i = 0; i < fixed.length; i++) {
                    const char = fixed[i]

                    if (char === '"' && !escaped) {
                        inString = !inString
                        result += char
                    } else if (inString && !escaped) {
                        // Inside a string value - escape control characters
                        if (char === '\n') {
                            result += '\\n'
                        } else if (char === '\r') {
                            result += '\\r'
                        } else if (char === '\t') {
                            result += '\\t'
                        } else if (char === '\\') {
                            escaped = true
                            result += char
                        } else {
                            result += char
                        }
                    } else {
                        result += char
                        if (escaped) escaped = false
                    }
                }

                return JSON.parse(result)
            }
        } catch (e) {
            console.error('[Anthropic] Failed to parse JSON. Raw content:', content.substring(0, 1000))
            console.error('[Anthropic] Parse error:', e)
            throw new APIError('anthropic', 'Failed to parse JSON response. The AI model may have returned invalid JSON format.', 500, e)
        }
    }

    private handleError(error: unknown): void {
        if (error instanceof Anthropic.APIError) {
            if (error.status === 401) {
                throw new AuthenticationError('anthropic', error.message)
            }
            if (error.status === 429) {
                throw new RateLimitError('anthropic', undefined, error.message)
            }
            throw new APIError('anthropic', error.message, error.status, error)
        }
        throw new APIError('anthropic', error instanceof Error ? error.message : 'Unknown error', 500, error)
    }
}
