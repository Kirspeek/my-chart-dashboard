import { APIError } from "@/interfaces/api";

export const RequestUtils = {
  /**
   * Create a fetch request with common options
   */
  async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 10000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new APIError("Request timeout", undefined, url);
      }
      throw error;
    }
  },

  /**
   * Retry a fetch request with exponential backoff
   */
  async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<Response> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.fetchWithTimeout(url, options);
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          break;
        }

        // Wait before retrying with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  },
};
