const axios = require('axios');

function buildEstimatePrompt(title, description) {
  return [
    'Estimate effort and due date for this task.',
    'Return JSON with effort, dueDate, reasoning.',
    `Title: ${title}`,
    `Description: ${description || 'No description provided'}`,
    'Effort should be one of S, M, L or a short hours-based value like 2h, 5h, 1d.',
    'Due date should be a date 1-7 days from now in ISO format.',
  ].join('\n');
}

function parseAiResponse(content) {
  if (!content) {
    return null;
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const payload = jsonMatch ? jsonMatch[0] : content;
  try {
    const parsed = JSON.parse(payload);
    return {
      estimatedEffort: parsed.effort || parsed.estimatedEffort || 'M',
      suggestedDueDate: parsed.dueDate || parsed.suggestedDueDate || null,
      reasoning: parsed.reasoning || 'AI estimate generated successfully.',
    };
  } catch (error) {
    return null;
  }
}

async function suggestEstimate(taskTitle, taskDescription) {
  const apiKey = process.env.LLM_API_KEY;
  const provider = (process.env.LLM_API_PROVIDER || 'gemini').toLowerCase();
  const prompt = buildEstimatePrompt(taskTitle, taskDescription);

  if (!apiKey || apiKey === 'your-llm-api-key' || apiKey.startsWith('your-')) {
    const error = new Error('AI feature unavailable');
    error.code = 'AI_KEY_MISSING';
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    let response;

    if (provider === 'groq') {
      response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: process.env.LLM_MODEL || 'llama-3.1-8b-instant',
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

      return parseAiResponse(response.data?.choices?.[0]?.message?.content);
    }

    const model = process.env.LLM_MODEL || 'gemini-2.0-flash';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
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

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = parseAiResponse(text);
    if (!parsed) {
      const error = new Error('Unable to parse AI response');
      error.code = 'AI_PARSE_ERROR';
      throw error;
    }

    return parsed;
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      const timeoutError = new Error('API timeout, please try again');
      timeoutError.code = 'AI_TIMEOUT';
      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  suggestEstimate,
};
