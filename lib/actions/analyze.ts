'use server'

import { getProvider } from '../providers/factory-v2'
import { getCurrentUser } from '../services/auth'
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
        // Get current user (may be null if not authenticated)
        const user = await getCurrentUser()

        // Get provider instance with user context (falls back to env if no user)
        const provider = await getProvider(providerName, user?.userId)

        return await provider.analyzePrompt(prompt, model)
    } catch (error) {
        console.error(`[Action] Analysis failed for ${providerName}:`, error)
        // Re-throw with a user-friendly message if possible, or let the UI handle it
        throw new Error(error instanceof Error ? error.message : 'Failed to analyze prompt')
    }
}
