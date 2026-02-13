// Core types for EasyPrompt

export type ProviderType =
  | 'anthropic'
  | 'openai'
  | 'google'
  | 'openrouter'
  | 'ollama'
  | 'huggingface'
  | 'together'
  | 'replicate'
  | 'cohere'

export type ProviderCategory = 'commercial' | 'open-source'
export type ProviderLocation = 'local' | 'cloud'
export type ModelTier = 'free' | 'fast' | 'standard' | 'premium'

export interface ProviderMetadata {
  name: ProviderType
  displayName: string
  category: ProviderCategory
  location: ProviderLocation
  requiresApiKey: boolean
  isOpenAICompatible: boolean
  supportsModelDiscovery: boolean
  icon: string
  description: string
  documentation: string
  defaultEndpoint?: string
}

export interface Model {
  id: string
  name: string
  tier: ModelTier
  description?: string
  contextWindow?: number
  pricing?: {
    input: number // per 1M tokens
    output: number // per 1M tokens
  }
  provider: ProviderType
  openSource?: boolean
}

export interface ProviderCapabilities {
  streaming: boolean
  supportsStreaming: boolean
  functionCalling: boolean
  vision: boolean
  embeddings: boolean
  maxTokens: number
}

export interface HealthStatus {
  available: boolean
  latency?: number
  error?: string
  modelsCount?: number
}

export interface AnalysisResult {
  issues: string[]
  suggestions: string[]
  score: number
  provider: ProviderType
}

export interface OptimizedPrompt {
  text: string
  improvements: string[]
  reasoning: string
}

export interface OptimizationResult {
  original: string
  optimized: string
  improvements: string[]
  analysis: AnalysisResult
  provider: ProviderType
  model: string
  timestamp: string
}

export interface ProviderInfo extends ProviderMetadata {
  available: boolean
  latency?: number
  error?: string
  models: Model[]
  capabilities: ProviderCapabilities
}
