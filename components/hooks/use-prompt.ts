'use client'

import { useState } from 'react'
import { AnalysisResult, OptimizationResult, ProviderType } from '@/lib/providers/types'
import { analyzePrompt } from '@/lib/actions/analyze'
import { optimizePrompt } from '@/lib/actions/optimize'

export function usePrompt() {
    const [prompt, setPrompt] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
    const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleAnalyze = async (providerName: ProviderType, model?: string) => {
        if (!prompt.trim()) return

        setIsAnalyzing(true)
        setError(null)
        setAnalysis(null)
        setOptimizationResult(null)

        try {
            // 1. Analyze
            const analysisResult = await analyzePrompt(prompt, providerName, model)
            setAnalysis(analysisResult)

            // 2. Optimize (automatically after analysis for now)
            const optimized = await optimizePrompt(prompt, analysisResult, providerName, model)
            setOptimizationResult(optimized)
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsAnalyzing(false)
        }
    }

    return {
        prompt,
        setPrompt,
        isAnalyzing,
        analysis,
        optimizationResult,
        error,
        handleAnalyze,
    }
}
