'use server'

import { providerFactory } from '../providers/factory'
import { ProviderType, AnalysisResult } from '../providers/types'
import { MAX_PROMPT_LENGTH, MIN_PROMPT_LENGTH, ERROR_MESSAGES } from '../constants'

export async function analyzePrompt(
    prompt: string,
    providerName: ProviderType,
    model?: string
): Promise<AnalysisResult> {
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

    try {
        const provider = providerFactory.getProvider(providerName)
        return await provider.analyzePrompt(prompt, model)
    } catch (error) {
        console.error(`[Action] Analysis failed for ${providerName}:`, error)
        // Re-throw with a user-friendly message if possible, or let the UI handle it
        throw new Error(error instanceof Error ? error.message : 'Failed to analyze prompt')
    }
}
