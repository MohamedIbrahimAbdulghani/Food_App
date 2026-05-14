const raw = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1'

export const API_BASE = raw.replace(/\/$/, '')

const TOKEN_KEY = 'broast_auth_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  readonly status: number

  readonly errors?: Record<string, string[]>

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export type ApiEnvelope<T> = {
  status: boolean
  message: string
  data: T
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { json?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { json, auth = true, headers: hdr, ...rest } = init
  const headers = new Headers(hdr)

  headers.set('Accept', 'application/json')
  if (json !== undefined) {
    headers.set('Content-Type', 'application/json')
  }
  if (auth) {
    const t = getToken()
    if (t) headers.set('Authorization', `Bearer ${t}`)
  }

  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, {
    ...rest,
    headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })

  let body: unknown = {}
  try {
    body = await res.json()
  } catch {
    body = {}
  }

  const envelope = body as Partial<ApiEnvelope<unknown>>

  if (!res.ok) {
    const msg =
      (envelope as { message?: string }).message ??
      res.statusText ??
      'Request failed'
    const errors = (envelope as { data?: { errors?: Record<string, string[]> } }).data?.errors
    throw new ApiError(msg, res.status, errors)
  }

  if (envelope.status === false) {
    const msg = envelope.message ?? 'Error'
    const errors = (envelope.data as { errors?: Record<string, string[]> } | undefined)?.errors
    throw new ApiError(msg, res.status, errors)
  }

  return envelope.data as T
}
