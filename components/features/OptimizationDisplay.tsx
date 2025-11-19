'use client'

import { OptimizationResult } from '@/lib/providers/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface OptimizationDisplayProps {
    result: OptimizationResult | null
    isLoading?: boolean
}

export function OptimizationDisplay({ result, isLoading }: OptimizationDisplayProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        if (result?.optimized) {
            await navigator.clipboard.writeText(result.optimized)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (isLoading) {
        return (
            <Card className="glass-card animate-pulse border-0">
                <CardHeader>
                    <div className="h-6 w-1/3 rounded bg-[hsl(var(--muted))]" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-32 w-full rounded bg-[hsl(var(--muted))]" />
                </CardContent>
            </Card>
        )
    }

    if (!result) return null

    return (
        <Card className="glass-card border-0 ring-1 ring-[hsl(var(--primary))]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[hsl(var(--primary))]" />
                    <CardTitle className="text-lg font-medium">Optimized Prompt</CardTitle>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 text-xs"
                >
                    {copied ? (
                        <>
                            <Check className="mr-2 h-3 w-3" />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy className="mr-2 h-3 w-3" />
                            Copy
                        </>
                    )}
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="rounded-xl bg-[hsl(var(--background))]/50 p-4 font-mono text-sm leading-relaxed">
                    {result.optimized}
                </div>

                {result.improvements.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Improvements Made</h4>
                        <div className="flex flex-wrap gap-2">
                            {result.improvements.map((improvement, i) => (
                                <Badge key={i} variant="secondary" className="bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/20">
                                    {improvement}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
