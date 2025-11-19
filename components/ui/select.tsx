import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, label, ...props }, ref) => {
        return (
            <div className="relative w-full">
                {label && (
                    <label className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        className={cn(
                            'flex h-10 w-full appearance-none rounded-xl border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm ring-offset-[hsl(var(--background))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        {children}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
                </div>
            </div>
        )
    }
)
Select.displayName = 'Select'

export { Select }
