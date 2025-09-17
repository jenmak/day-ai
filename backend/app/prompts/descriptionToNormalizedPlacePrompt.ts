export const DESCRIPTION_TO_NORMALIZED_PLACE_PROMPT = (description: string) => `Convert this place description to a normalized format with city and state/country.

Place description: "${description}"

Please respond with a JSON object containing:
- normalizedPlace: The standardized place (e.g., "New York, NY" or "London, UK")
- slug: A URL-friendly slug (e.g., "new-york-ny" or "london-uk")
- confidence: A number between 0 and 1 indicating your confidence
- reasoning: Brief explanation of your choice

Examples:
- "Gotham City" → {"normalizedPlace": "New York, NY", "slug": "new-york-ny", "confidence": 0.95, "reasoning": "Gotham City is commonly associated with New York City"}
- "The Big Apple" → {"normalizedPlace": "New York, NY", "slug": "new-york-ny", "confidence": 0.98, "reasoning": "The Big Apple is a well-known nickname for New York City"}
- "Home of Harvard" → {"normalizedPlace": "Cambridge, MA", "slug": "cambridge-ma", "confidence": 0.95, "reasoning": "Harvard University is located in Cambridge, Massachusetts"}
- "Springfield" → {"normalizedPlace": "Springfield, IL", "slug": "springfield-il", "confidence": 0.85, "reasoning": "Springfield could refer to multiple cities, defaulting to Illinois state capital"}

Respond only with valid JSON:`