'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { useProvider } from '@/components/hooks/use-provider'
import { comparePrompts } from '@/lib/actions/compare'
import { OptimizationResult, ProviderType } from '@/lib/providers/types'
import { GitCompare, Sparkles, Clock, AlertCircle, CheckCircle2, Loader2, TrendingUp } from 'lucide-react'

export default function ComparePage() {
    const { providers } = useProvider()
    const [prompt, setPrompt] = useState('')
    const [isComparing, setIsComparing] = useState(false)
    const [results, setResults] = useState<Map<ProviderType, OptimizationResult | Error>>(new Map())

    const handleCompare = async () => {
        if (!prompt.trim()) return

        setIsComparing(true)
        setResults(new Map())

        try {
            const availableProviders = providers
                .filter(p => p.available)
                .slice(0, 3)
                .map(p => p.name)

            const comparisonResults = await comparePrompts(prompt, availableProviders)
            setResults(comparisonResults)
        } catch (error) {
            console.error('Comparison failed:', error)
        } finally {
            setIsComparing(false)
        }
    }

    return (
        <main className="min-h-screen bg-white">
            {/* Header */}
            <section className="border-b border-gray-100">
                <div className="max-w-[1200px] mx-auto px-6 py-16">
                    <div className="max-w-3xl mx-auto text-center space-y-6 animate-in">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-2">
                            <GitCompare className="h-3.5 w-3.5" />
                            Multi-Model Comparison
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight text-gray-900">
                            Compare AI Models
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            See how different AI models optimize your prompt side-by-side. Find the perfect match for your use case.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Input Section */}
                    <Card className="notion-card p-6 animate-in">
                        <div className="space-y-4">
                            <label className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-gray-700" />
                                Your Prompt
                            </label>
                            <Textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Enter a prompt to compare across different AI models..."
                                className="min-h-[150px] notion-input text-[15px] resize-none"
                            />
                            <div className="flex justify-end pt-2">
                                <Button
                                    onClick={handleCompare}
                                    disabled={!prompt.trim() || isComparing}
                                    className="notion-button gap-2"
                                >
                                    {isComparing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Comparing...
                                        </>
                                    ) : (
                                        <>
                                            <GitCompare className="h-4 w-4" />
                                            Compare Models
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Results Grid */}
                    {results.size > 0 && (
                        <div className="grid md:grid-cols-3 gap-6 animate-in">
                            {Array.from(results.entries()).map(([providerName, result]) => (
                                <Card key={providerName} className="notion-card flex flex-col">
                                    {/* Provider Header */}
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="notion-badge capitalize font-semibold">
                                                {providerName}
                                            </span>
                                            {!(result instanceof Error) && (
                                                <div className="flex items-center gap-1 text-xs font-mono text-gray-500">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(result.timestamp).toLocaleTimeString()}
                                                </div>
                                            )}
                                        </div>

                                        {!(result instanceof Error) && (
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gray-900"
                                                        style={{ width: `${result.analysis.score}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">{result.analysis.score}/100</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col gap-6">
                                        {result instanceof Error ? (
                                            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                                <div className="p-3 rounded-full bg-red-100 mb-3">
                                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                                </div>
                                                <p className="text-red-900 text-sm font-medium">{result.message}</p>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Optimized Prompt */}
                                                <div className="space-y-2 flex-1">
                                                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                                                        <Sparkles className="h-3 w-3" />
                                                        Result
                                                    </p>
                                                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 leading-relaxed min-h-[120px]">
                                                        {result.optimized}
                                                    </div>
                                                </div>

                                                {/* Key Improvements */}
                                                <div className="space-y-3">
                                                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                                                        <TrendingUp className="h-3 w-3" />
                                                        Improvements
                                                    </p>
                                                    <div className="space-y-2">
                                                        {result.improvements.slice(0, 3).map((improvement, i) => (
                                                            <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                                <span>{improvement}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
