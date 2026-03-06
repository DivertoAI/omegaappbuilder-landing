const DEFAULT_BASE_URL = 'https://server.omegaappbuilder.com';

export const getOmegaChatBaseUrl = () => {
  const fromServer = process.env.OMEGA_CHAT_API_BASE_URL;
  const fromPublic = process.env.NEXT_PUBLIC_OMEGA_CHAT_API_BASE_URL;
  return (fromServer || fromPublic || DEFAULT_BASE_URL).replace(/\/$/, '');
};

type OmegaChatRequest = {
  path: string;
  method?: 'GET' | 'POST';
  token?: string;
  body?: unknown;
};

export async function omegaChatRequest({ path, method = 'GET', token, body }: OmegaChatRequest) {
  const url = `${getOmegaChatBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  const text = await response.text();
  const json = safeParseJson(text);

  if (!response.ok) {
    const message = resolveErrorMessage(json, text) || `Omega Chat request failed (${response.status})`;
    return {
      ok: false as const,
      status: response.status,
      error: message,
      data: json,
    };
  }

  return {
    ok: true as const,
    status: response.status,
    data: json,
  };
}

function safeParseJson(value: string) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function resolveErrorMessage(json: unknown, fallback: string) {
  if (json && typeof json === 'object') {
    const record = json as Record<string, unknown>;
    const nested = record.error;
    if (nested && typeof nested === 'object' && nested !== null) {
      const nestedRecord = nested as Record<string, unknown>;
      if (typeof nestedRecord.message === 'string') {
        return nestedRecord.message;
      }
    }

    if (typeof record.message === 'string') {
      return record.message;
    }

    if (typeof record.error === 'string') {
      return record.error;
    }
  }

  return fallback;
}
