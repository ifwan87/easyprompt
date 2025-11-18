// Application constants

export const APP_NAME = 'EasyPrompt'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'AI Prompt Optimization Platform with Multi-Provider Support'

// Prompt constraints
export const MAX_PROMPT_LENGTH = 5000
export const MIN_PROMPT_LENGTH = 10

// Rate limiting
export const RATE_LIMIT_REQUESTS = 20
export const RATE_LIMIT_WINDOW = '60 s' // 60 seconds

// Provider defaults
export const DEFAULT_PROVIDER = 'ollama'
export const DEFAULT_TEMPERATURE = 0.7
export const DEFAULT_MAX_TOKENS = 2000

// API timeouts (milliseconds)
export const API_TIMEOUT = 30000 // 30 seconds
export const HEALTH_CHECK_TIMEOUT = 5000 // 5 seconds

// Cache durations (seconds)
export const CACHE_DURATION_SHORT = 60 // 1 minute
export const CACHE_DURATION_MEDIUM = 300 // 5 minutes
export const CACHE_DURATION_LONG = 3600 // 1 hour

// UI constants
export const ANIMATION_DURATION = 300 // milliseconds
export const DEBOUNCE_DELAY = 500 // milliseconds

// Provider endpoints
export const PROVIDER_ENDPOINTS = {
  ollama: 'http://127.0.0.1:11434',
  anthropic: 'https://api.anthropic.com/v1',
  openai: 'https://api.openai.com/v1',
  together: 'https://api.together.xyz/v1',
} as const

// Error messages
export const ERROR_MESSAGES = {
  PROVIDER_UNAVAILABLE: 'Provider is not available. Please check your configuration.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  INVALID_PROMPT: 'Please enter a valid prompt.',
  PROMPT_TOO_SHORT: `Prompt must be at least ${MIN_PROMPT_LENGTH} characters.`,
  PROMPT_TOO_LONG: `Prompt must be less than ${MAX_PROMPT_LENGTH} characters.`,
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const
