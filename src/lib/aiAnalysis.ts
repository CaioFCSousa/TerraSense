export interface AnalysisResult {
  soilType: string;
  characteristics: string[];
  recommendations: string[];
}

interface ChatMessage {
  role: string;
  content: string;
}

const API_KEY = "AIzaSyCMF7NE7gsxx1E0OiGXJXbtkAp89LxOnIA";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;

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

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error('No response from Gemini API');
    }

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

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error('No response from Gemini API');
    }

    return textContent.trim();

  } catch (error) {
    console.error('Error asking about soil:', error);
    throw error;
  }
}
