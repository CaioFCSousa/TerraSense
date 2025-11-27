export interface AnalysisResult {
  soilType: string;
  characteristics: string[];
  recommendations: string[];
}

interface ChatMessage {
  role: string;
  content: string;
}

// ⚠️ ATENÇÃO: Nunca exponha chaves de API diretamente em código frontend. 
// Use variáveis de ambiente ou um proxy seguro.
const API_KEY = "AIzaSyBbRXWHFap0_DkCjYzwKs5GuyrYRMz0qgU"; // Exemplo, use sua chave
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;
const MAX_RETRIES = 5;

// -----------------------------------------------------------------
// FUNÇÕES DE UTILIDADE PARA TRATAMENTO DE ERROS (RATE LIMIT)
// -----------------------------------------------------------------

/**
 * Pausa a execução por um número especificado de milissegundos.
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Tenta fazer uma chamada fetch, repetindo com Backoff Exponencial e Jitter se for um erro 429.
 * @param url A URL da API.
 * @param options As opções do fetch (method, headers, body).
 * @param maxRetries O número máximo de vezes que a tentativa será repetida.
 * @returns A Response do fetch.
 */
async function retryFetch(
    url: string,
    options: RequestInit,
    maxRetries: number = MAX_RETRIES
): Promise<Response> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);

            if (response.status === 429) {
                // Erro 429: Too Many Requests. Tentar novamente.
                const baseDelay = Math.pow(2, i); // Backoff Exponencial (1s, 2s, 4s, ...)
                const jitter = Math.random() * 1000; // Jitter (Aleatoriedade 0-1000ms)
                const delayMs = (baseDelay * 1000) + jitter;

                console.warn(`[API] Tentativa ${i + 1} de ${maxRetries} falhou com 429. Esperando ${delayMs.toFixed(0)}ms...`);
                await sleep(delayMs);
                continue; // Pula para a próxima iteração para tentar novamente
            }

            // Para 200 (OK) e outros erros HTTP que não são 429, retorna a resposta
            return response;
        } catch (error) {
            // Erros de rede (ex: falha de conexão).
            console.error(`[API] Erro de rede na tentativa ${i + 1}:`, error);
            if (i < maxRetries - 1) {
                await sleep(2000); // Espera fixa para erros de rede
                continue;
            }
            throw error; // Lança o erro se for a última tentativa
        }
    }
    throw new Error(`Excedeu o limite de ${maxRetries} tentativas para a chamada de API.`);
}

// -----------------------------------------------------------------
// FUNÇÕES PRINCIPAIS DE ANÁLISE E CHAT
// -----------------------------------------------------------------

export async function analyzeImageWithGemini(imageBase64: string): Promise<AnalysisResult> {
  try {
    const base64Data = imageBase64.includes(',')
      ? imageBase64.split(',')[1]
      : imageBase64;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Você é um especialista em análise de solo para agricultura familiar. Analise esta imagem de solo e forneça:

1. TIPO DE SOLO: Identifique o tipo principal (Argiloso, Arenoso, Humoso ou Siltoso)
2. CARACTERÍSTICAS: Liste 4-5 características visuais identificáveis (cor, textura, composição aparente, umidade)
3. RECOMENDAÇÕES: Forneça 4-6 recomendações práticas e específicas para plantio, incluindo culturas adequadas e cuidados

Use linguagem simples e direta, adequada para agricultores com pouco conhecimento técnico.
Seja específico e prático nas recomendações.

Retorne sua análise EXATAMENTE neste formato JSON (sem markdown, sem código):
{
  "soilType": "tipo do solo aqui",
  "characteristics": ["característica 1", "característica 2", "característica 3", "característica 4"],
  "recommendations": ["recomendação 1", "recomendação 2", "recomendação 3", "recomendação 4", "recomendação 5"]
}`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    // 🔄 Usa retryFetch para lidar com 429 e erros de rede
    const response = await retryFetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        // Se cair aqui, é um erro HTTP diferente de 429, após as tentativas
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error('No response from Gemini API');
    }

    // Lógica para limpar e garantir que o JSON é parseado
    const cleanedText = textContent
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsedResult = JSON.parse(cleanedText);

    return {
      soilType: parsedResult.soilType || 'Solo não identificado',
      characteristics: Array.isArray(parsedResult.characteristics)
        ? parsedResult.characteristics
        : ['Características não identificadas'],
      recommendations: Array.isArray(parsedResult.recommendations)
        ? parsedResult.recommendations
        : ['Recomendações não disponíveis']
    };

  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);

    // Retorno de erro amigável para o usuário
    return {
      soilType: 'Erro na análise',
      characteristics: [
        'Não foi possível analisar a imagem',
        'Verifique se a foto está nítida',
        'Tente novamente com melhor iluminação'
      ],
      recommendations: [
        'Tire uma nova foto com boa iluminação',
        'Certifique-se de que o solo está visível',
        'Evite sombras e reflexos na imagem'
      ]
    };
  }
}

export async function askAboutSoil(
  question: string,
  soilType: string,
  characteristics: string[],
  recommendations: string[],
  chatHistory: ChatMessage[]
): Promise<string> {
  try {
    const conversationHistory = chatHistory
      .map(msg => `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`)
      .join('\n\n');

    const prompt = `Você é um especialista em análise de solo e agricultura familiar. Você está conversando com um agricultor sobre uma análise de solo específica.

INFORMAÇÕES DA ANÁLISE:
- Tipo de Solo: ${soilType}
- Características: ${characteristics.join('; ')}
- Recomendações: ${recommendations.join('; ')}

${conversationHistory ? `HISTÓRICO DA CONVERSA:\n${conversationHistory}\n\n` : ''}PERGUNTA DO USUÁRIO: ${question}

Responda de forma clara, objetiva e prática. Use linguagem simples, adequada para agricultores. Baseie sua resposta nas informações da análise fornecidas acima. Se a pergunta for sobre algo não relacionado ao solo ou agricultura, redirecione educadamente para o tema da análise.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 512,
      }
    };

    // 🔄 Usa retryFetch para lidar com 429 e erros de rede
    const response = await retryFetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error('No response from Gemini API');
    }

    return textContent.trim();

  } catch (error) {
    console.error('Error asking about soil:', error);
    // Em vez de lançar o erro bruto, você pode retornar uma mensagem amigável:
    return 'Desculpe, houve um erro de comunicação e não consegui responder. Por favor, tente novamente.';
  }
}
