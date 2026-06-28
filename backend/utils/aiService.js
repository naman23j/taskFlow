const axios = require('axios');

function buildEstimatePrompt(title, description) {
  const future = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return [
    'You are a task estimation assistant. Return ONLY a valid JSON object — no markdown, no code fences, no extra text.',
    'The JSON must have exactly these keys:',
    '  "effort": one of "S" (under 2h), "M" (2-8h), or "L" (1-3 days)',
    `  "dueDate": an ISO date string like "${future}"`,
    '  "reasoning": a single sentence explaining the estimate',
    '',
    `Task Title: ${title}`,
    `Task Description: ${description || 'No description provided'}`,
  ].join('\n');
}


function parseAiResponse(content) {
  if (!content) {
    console.log('[AI Estimate Flow] parseAiResponse: content is empty');
    return null;
  }

  // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
  let cleaned = content.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();

  // Extract the first JSON object found
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  const payload = jsonMatch ? jsonMatch[0] : cleaned;

  try {
    const parsed = JSON.parse(payload);

    // Effort may be a nested object {low, medium, high} — pick 'medium' as default
    let effort = parsed.effort || parsed.estimatedEffort || parsed.estimated_effort || 'M';
    if (typeof effort === 'object' && effort !== null) {
      effort = 'M'; // normalise nested effort objects to medium
    }
    // Normalise single-char S/M/L or short strings
    if (typeof effort === 'string' && effort.length > 4) {
      effort = 'M';
    }

    // Normalise due date
    let rawDate = parsed.dueDate || parsed.suggestedDueDate || parsed.due_date || parsed.date || null;
    let suggestedDueDate = null;
    if (rawDate && typeof rawDate === 'string') {
      // If it already looks like a YYYY-MM-DD ISO date, use it directly
      const isoMatch = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (isoMatch) {
        const candidate = new Date(rawDate);
        const now = new Date();
        const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        if (candidate > now && candidate <= maxDate) {
          // Valid near-future date — use as-is
          suggestedDueDate = rawDate;
        } else {
          // Out of range (past or >30 days) — default to 3 days from now
          suggestedDueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        }
      } else {
        // Relative string like "1-3 days" — extract the first small number
        const daysMatch = rawDate.match(/\b([1-9]|[12]\d|30)\b/);
        const days = daysMatch ? parseInt(daysMatch[1], 10) : 3;
        suggestedDueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      }
    }

    const result = {
      estimatedEffort: effort,
      suggestedDueDate,
      reasoning: parsed.reasoning || parsed.explanation || 'AI estimate generated successfully.',
    };
    console.log('[AI Estimate Flow] parseAiResponse successfully parsed payload. Result:', result);
    return result;
  } catch (error) {
    console.error('[AI Estimate Flow] parseAiResponse: failed to parse JSON. Error:', error.message, 'Payload:', payload);
    return null;
  }
}


function generateMockEstimate(title, description) {
  const text = `${title} ${description || ''}`.toLowerCase();
  let effort = 'M';
  let reasoning = 'AI service quota exceeded or disabled. Generated a rule-based fallback estimate.';

  if (text.includes('fix') || text.includes('bug') || text.includes('typo') || text.includes('simple') || text.includes('update')) {
    effort = 'S';
    reasoning = 'Tasks involving minor fixes, updates, or typo corrections typically take under 2 hours (Effort: S).';
  } else if (text.includes('build') || text.includes('implement') || text.includes('create') || text.includes('setup') || text.includes('ppt') || text.includes('slides')) {
    effort = 'M';
    reasoning = 'Tasks involving creation, presentations, setup, or development of features usually take around 4-8 hours (Effort: M).';
  } else if (text.includes('refactor') || text.includes('redesign') || text.includes('migrate') || text.includes('deploy')) {
    effort = 'L';
    reasoning = 'Large architectural changes, migrations, or design overhauls typically take 1-3 days (Effort: L).';
  }

  const suggestedDueDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const fallback = {
    estimatedEffort: effort,
    suggestedDueDate,
    reasoning: `[Fallback Mode] ${reasoning}`
  };
  console.log('[AI Estimate Flow] Generated mock estimate fallback:', fallback);
  return fallback;
}

async function suggestEstimate(taskTitle, taskDescription) {
  const apiKey = process.env.LLM_API_KEY;
  const provider = (process.env.LLM_API_PROVIDER || 'gemini').toLowerCase();
  const model = process.env.LLM_MODEL || 'gemini-2.0-flash';
  const prompt = buildEstimatePrompt(taskTitle, taskDescription);

  console.log('[AI Estimate Flow] Starting suggestEstimate...');
  console.log('[AI Estimate Flow] Provider:', provider);
  console.log('[AI Estimate Flow] Model:', model);
  console.log('[AI Estimate Flow] API Key Configured:', apiKey ? `${apiKey.slice(0, 5)}...` : 'undefined');

  if (!apiKey || apiKey === 'your-llm-api-key' || apiKey.startsWith('your-')) {
    console.warn('[AI Estimate Flow] AI API key is missing or placeholder. Using mock fallback estimate.');
    return generateMockEstimate(taskTitle, taskDescription);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    console.warn('[AI Estimate Flow] Request timed out. Aborting axios request...');
    controller.abort();
  }, 10000);

  try {
    let response;

    if (provider === 'groq') {
      const groqUrl = 'https://api.groq.com/openai/v1/chat/completions';
      console.log('[AI Estimate Flow] Sending request to Groq API:', groqUrl);
      response = await axios.post(
        groqUrl,
        {
          model: model || 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: 'You return only valid JSON.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.2,
        },
        {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('[AI Estimate Flow] Raw Groq API response status:', response.status);
      console.log('[AI Estimate Flow] Raw Groq API response content:', response.data?.choices?.[0]?.message?.content);
      const parsed = parseAiResponse(response.data?.choices?.[0]?.message?.content);
      if (!parsed) {
        throw new Error('Unable to parse Groq response');
      }
      return parsed;
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    console.log('[AI Estimate Flow] Sending request to Gemini API (URL hidden API Key)');
    response = await axios.post(
      geminiUrl,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      },
      {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[AI Estimate Flow] Raw Gemini API response status:', response.status);
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('[AI Estimate Flow] Raw Gemini API text content:', text);

    const parsed = parseAiResponse(text);
    if (!parsed) {
      throw new Error('Unable to parse Gemini response');
    }

    return parsed;
  } catch (error) {
    console.error('[AI Estimate Flow] External API call failed. Error:', error.message);
    if (error.response) {
      console.error('[AI Estimate Flow] API Error response status:', error.response.status);
      console.error('[AI Estimate Flow] API Error response data:', JSON.stringify(error.response.data));
    }
    console.warn('[AI Estimate Flow] Falling back to mock estimate.');
    return generateMockEstimate(taskTitle, taskDescription);
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  suggestEstimate,
  generateMockEstimate,
};
