import { Ollama } from 'ollama'
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
import { APIError, ModelNotFoundError, ProviderUnavailableError } from '../errors'

export class OllamaProvider extends BaseProvider {
    private client: Ollama
    private endpoint: string

    constructor(endpoint?: string) {
        super()
        // Use provided endpoint or fall back to environment variable
        this.endpoint = endpoint || process.env.OLLAMA_ENDPOINT || 'http://127.0.0.1:11434'
        this.client = new Ollama({ host: this.endpoint })
    }

    readonly metadata: ProviderMetadata = {
        name: 'ollama',
        displayName: 'Ollama (Local)',
        category: 'open-source',
        location: 'local',
        requiresApiKey: false,
        isOpenAICompatible: false,
        supportsModelDiscovery: true,
        icon: 'ollama-icon',
        description: '100% local, private, and free AI models',
        documentation: 'https://ollama.ai/docs',
        defaultEndpoint: 'http://127.0.0.1:11434',
    }

    readonly capabilities: ProviderCapabilities = {
        streaming: true,
        supportsStreaming: true,
        functionCalling: false, // Varies by model, assuming false for safety
        vision: true, // Varies by model
        embeddings: true,
        maxTokens: 4096, // Varies by model
    }

    // Default models - will be updated by discovery
    models: Model[] = [
        {
            id: 'llama3.2',
            name: 'Llama 3.2',
            tier: 'free',
            provider: 'ollama',
            openSource: true,
            description: 'Meta Llama 3.2 - Efficient and capable',
        },
        {
            id: 'mistral',
            name: 'Mistral 7B',
            tier: 'free',
            provider: 'ollama',
            openSource: true,
            description: 'Mistral AI 7B model',
        },
    ]

    get defaultModel(): string {
        return 'llama3.2'
    }

    override isAvailable(): boolean {
        // Ollama only works locally, not on Vercel
        return process.env.VERCEL !== '1'
    }

    async analyzePrompt(prompt: string, modelId?: string): Promise<AnalysisResult> {
        const model = this.getModel(modelId)

        try {
            const response = await this.client.chat({
                model,
                messages: [
                    { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
                    { role: 'user', content: prompt },
                ],
                format: 'json', // Ollama supports JSON mode
                stream: false,
            })

            const content = response.message.content
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
        const model = this.getModel(modelId)

        try {
            const response = await this.client.chat({
                model,
                messages: [
                    { role: 'system', content: OPTIMIZATION_SYSTEM_PROMPT },
                    {
                        role: 'user',
                        content: `Original Prompt: ${prompt}\n\nAnalysis: ${JSON.stringify(analysis)}`
                    },
                ],
                format: 'json',
                stream: false,
            })

            const content = response.message.content
            return this.parseJSON<OptimizedPrompt>(content)
        } catch (error) {
            this.handleError(error)
            throw error
        }
    }

    async generatePreview(prompt: string, modelId?: string): Promise<string> {
        const model = this.getModel(modelId)

        try {
            const response = await this.client.chat({
                model,
                messages: [{ role: 'user', content: prompt }],
                stream: false,
            })

            return response.message.content
        } catch (error) {
            this.handleError(error)
            throw error
        }
    }

    async healthCheck(): Promise<HealthStatus> {
        try {
            // Try to list tags to check connection
            const response = await this.client.list()

            // Update available models
            this.models = response.models.map(m => ({
                id: m.name,
                name: m.name,
                tier: 'free',
                provider: 'ollama',
                openSource: true,
                description: `Size: ${(m.size / 1024 / 1024 / 1024).toFixed(1)}GB`,
            }))

            return {
                available: true,
                modelsCount: response.models.length,
                latency: 0, // Could measure this
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
            // Remove markdown code blocks if present
            const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
            return JSON.parse(cleanContent)
        } catch (e) {
            throw new APIError('ollama', 'Failed to parse JSON response from provider', 500, e)
        }
    }

    private handleError(error: unknown): void {
        if (error instanceof Error) {
            // Check for connection errors
            if (error.message.includes('ECONNREFUSED')) {
                throw new ProviderUnavailableError('ollama', 'Ollama is not running or not reachable')
            }
            // Check for model not found
            if (error.message.includes('model') && error.message.includes('not found')) {
                throw new ModelNotFoundError('ollama', 'Selected model not found')
            }
        }
        throw new APIError('ollama', error instanceof Error ? error.message : 'Unknown error', 500, error)
    }
}
