'use client'

import { AnalysisResult } from '@/lib/providers/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { AlertTriangle, Lightbulb, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnalysisDisplayProps {
    analysis: AnalysisResult | null
    isLoading?: boolean
}

export function AnalysisDisplay({ analysis, isLoading }: AnalysisDisplayProps) {
    if (isLoading) {
        return (
            <Card className="glass-card animate-pulse border-0">
                <CardHeader>
                    <div className="h-6 w-1/3 rounded bg-[hsl(var(--muted))]" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-4 w-full rounded bg-[hsl(var(--muted))]" />
                    <div className="h-4 w-2/3 rounded bg-[hsl(var(--muted))]" />
                    <div className="h-4 w-1/2 rounded bg-[hsl(var(--muted))]" />
                </CardContent>
            </Card>
        )
    }

    if (!analysis) return null

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-500'
        if (score >= 70) return 'text-yellow-500'
        return 'text-red-500'
    }

    return (
        <Card className="glass-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Prompt Analysis</CardTitle>
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    <span className={cn("text-2xl font-bold", getScoreColor(analysis.score))}>
                        {analysis.score}
                    </span>
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">/100</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Issues */}
                {analysis.issues.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--destructive))]">
                            <AlertTriangle className="h-4 w-4" />
                            Issues Detected
                        </h4>
                        <ul className="space-y-1">
                            {analysis.issues.map((issue, i) => (
                                <li key={i} className="text-sm text-[hsl(var(--muted-foreground))]">
                                    • {issue}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--secondary))]">
                            <Lightbulb className="h-4 w-4" />
                            Suggestions
                        </h4>
                        <ul className="space-y-1">
                            {analysis.suggestions.map((suggestion, i) => (
                                <li key={i} className="text-sm text-[hsl(var(--muted-foreground))]">
                                    • {suggestion}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
