'use client'

import { AnalysisResult } from '@/lib/providers/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { AlertCircle, Lightbulb, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnalysisDisplayProps {
    analysis: AnalysisResult | null
    isLoading?: boolean
}

export function AnalysisDisplay({ analysis, isLoading }: AnalysisDisplayProps) {
    if (isLoading) {
        return (
            <Card className="notion-card animate-pulse">
                <CardHeader>
                    <div className="h-6 w-1/3 rounded bg-gray-100" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-32 w-full rounded bg-gray-100" />
                </CardContent>
            </Card>
        )
    }

    if (!analysis) return null

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200'
        if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200'
        return 'text-red-600 bg-red-50 border-red-200'
    }

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent'
        if (score >= 60) return 'Good'
        return 'Needs Work'
    }

    return (
        <Card className="notion-card">
            <CardContent className="p-6 space-y-6">
                {/* Score Section */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                            <TrendingUp className="h-5 w-5 text-gray-700" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">
                                Quality Score
                            </h3>
                            <p className="text-xs text-gray-500">
                                {getScoreLabel(analysis.score)}
                            </p>
                        </div>
                    </div>

                    {/* Score Badge */}
                    <div className={cn(
                        "px-4 py-2 rounded-lg border font-semibold",
                        getScoreColor(analysis.score)
                    )}>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl">{analysis.score}</span>
                            <span className="text-sm opacity-70">/ 100</span>
                        </div>
                    </div>
                </div>

                {/* Issues Section */}
                {analysis.issues.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <h4 className="text-sm font-semibold text-gray-900">
                                Issues ({analysis.issues.length})
                            </h4>
                        </div>
                        <div className="space-y-2">
                            {analysis.issues.map((issue, i) => (
                                <div
                                    key={i}
                                    className="group p-3 rounded-lg bg-red-50 border border-red-100 hover:border-red-200 transition-colors"
                                >
                                    <p className="text-sm text-red-900 leading-relaxed">
                                        {issue}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Suggestions Section */}
                {analysis.suggestions.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-amber-600" />
                            <h4 className="text-sm font-semibold text-gray-900">
                                Suggestions ({analysis.suggestions.length})
                            </h4>
                        </div>
                        <div className="space-y-2">
                            {analysis.suggestions.map((suggestion, i) => (
                                <div
                                    key={i}
                                    className="group p-3 rounded-lg bg-blue-50 border border-blue-100 hover:border-blue-200 transition-colors"
                                >
                                    <p className="text-sm text-blue-900 leading-relaxed">
                                        {suggestion}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Provider Badge */}
                <div className="pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                        Analyzed by <span className="font-medium text-gray-700 capitalize">{analysis.provider}</span>
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
