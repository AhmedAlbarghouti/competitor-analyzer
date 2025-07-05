# Competitor Analysis API Endpoint

This API endpoint allows you to analyze competitor websites by crawling their content and generating insights using AI.

## Endpoint Details

- **URL**: `/api/competitor`
- **Method**: `POST`
- **Content Type**: `application/json`

## Request Format

```json
{
  "domain": "https://example.com"
}
```

The `domain` must be a valid URL including the protocol (http:// or https://).

## Response Format

```json
{
  "domain": "https://example.com",
  "analysis": "Detailed analysis of the competitor...",
  "timestamp": "2025-07-05T18:43:01.000Z"
}
```

## Error Responses

The API may return the following error responses:

- **400 Bad Request**: Invalid domain format or domain not accessible
- **500 Internal Server Error**: API key not configured or error with external services

## Implementation Details

1. The endpoint validates the domain format using Zod
2. It checks if the domain is accessible by making a HEAD request
3. It uses the Tavily API to crawl the website for specific content:
   - News
   - Latest products
   - Compliance documents
   - Terms of service
4. The crawled content is analyzed using the Gemini AI API
5. The analysis focuses on:
   - What the company does
   - Its current direction and focus
   - Compliance posture and legal/regulatory details
   - Other interesting or unique findings

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
TAVILY_API_KEY=your_tavily_api_key
GEMINI_API_KEY=your_gemini_api_key
```

## Example Usage

```typescript
const analyzeCompetitor = async (domain: string) => {
  const response = await fetch('/api/competitor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ domain }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to analyze competitor');
  }
  
  return await response.json();
};
```

## Demo Page

A demo page is available at `/competitor-analysis` to test the API endpoint.
