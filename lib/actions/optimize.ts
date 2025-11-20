'use server'

import { providerFactory } from '../providers/factory'
import { ProviderType, AnalysisResult, OptimizationResult } from '../providers/types'
import { analyzePrompt } from './analyze'
import { MAX_PROMPT_LENGTH, MIN_PROMPT_LENGTH, ERROR_MESSAGES } from '../constants'

export async function optimizePrompt(
    prompt: string,
    analysis?: AnalysisResult,
    providerName?: ProviderType,
    model?: string
): Promise<OptimizationResult> {
    // Validate prompt
    if (!prompt || !prompt.trim()) {
        throw new Error(ERROR_MESSAGES.INVALID_PROMPT)
    }

    if (prompt.length < MIN_PROMPT_LENGTH) {
        throw new Error(ERROR_MESSAGES.PROMPT_TOO_SHORT)
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
        throw new Error(ERROR_MESSAGES.PROMPT_TOO_LONG)
    }

    const targetProvider = providerName || 'ollama'

    try {
        // If no analysis provided, analyze first
        const promptAnalysis = analysis || await analyzePrompt(prompt, targetProvider, model)

        const provider = providerFactory.getProvider(targetProvider)
        const result = await provider.optimizePrompt(prompt, promptAnalysis, model)

        return {
            original: prompt,
            optimized: result.text,
            improvements: result.improvements,
            analysis: promptAnalysis,
            provider: targetProvider,
            model: model || provider.defaultModel,
            timestamp: new Date().toISOString(),
        }
    } catch (error) {
        console.error(`[Action] Optimization failed for ${targetProvider}:`, error)
        throw new Error(error instanceof Error ? error.message : 'Failed to optimize prompt')
    }
}
