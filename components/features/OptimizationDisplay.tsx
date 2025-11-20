'use client'

import { OptimizationResult } from '@/lib/providers/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, CheckCircle } from 'lucide-react'
import { useState } from 'react'

interface OptimizationDisplayProps {
    optimization: OptimizationResult | null
    isLoading?: boolean
}

export function OptimizationDisplay({ optimization, isLoading }: OptimizationDisplayProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        if (optimization?.optimized) {
            await navigator.clipboard.writeText(optimization.optimized)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (isLoading) {
        return (
            <Card className="notion-card animate-pulse">
                <CardContent className="space-y-4 p-6">
                    <div className="h-32 w-full rounded bg-gray-100" />
                </CardContent>
            </Card>
        )
    }

    if (!optimization) return null

    return (
        <Card className="notion-card">
            <CardContent className="p-6 space-y-6">
                {/* Optimized Text */}
                <div className="relative">
                    <div className="absolute top-3 right-3 z-10">
                        <Button
                            onClick={handleCopy}
                            className="notion-button-secondary h-8 px-3 text-xs gap-2"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-3.5 w-3.5 text-green-600" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3.5 w-3.5" />
                                    <span>Copy</span>
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="rounded-lg bg-gray-50 border border-gray-200 p-5 pr-24">
                        <p className="text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap font-medium">
                            {optimization.optimized}
                        </p>
                    </div>
                </div>

                {/* Improvements Made */}
                {optimization.improvements.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <h4 className="text-sm font-semibold text-gray-900">
                                Improvements ({optimization.improvements.length})
                            </h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {optimization.improvements.map((improvement: string, i: number) => (
                                <div
                                    key={i}
                                    className="notion-badge bg-green-50 text-green-700 border-green-200"
                                >
                                    {improvement}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Metadata */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>
                        Optimized by <span className="font-medium text-gray-700 capitalize">{optimization.provider}</span>
                    </span>
                    <span className="font-mono">
                        {new Date(optimization.timestamp).toLocaleTimeString()}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
