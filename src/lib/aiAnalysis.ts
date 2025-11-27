import { GoogleGenAI, Type } from '@google/genai';

// ⚠️ Mudei a forma como a chave é obtida.
// É altamente recomendado carregar a chave de uma variável de ambiente (process.env.GEMINI_API_KEY)
// e NUNCA deixá-la hardcoded ou exposta no frontend.
// Para este exemplo, vou manter a chave, mas você deve removê-la em produção.
const API_KEY = "AIzaSyDl4tpg-KzpHknS1EIp5rAEkzm47yzAOr8"; 

// 1. Inicialize o SDK. Ele usa a variável de ambiente GEMINI_API_KEY ou a chave passada.
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Interfaces existentes
export interface AnalysisResult {
  soilType: string;
  characteristics: string[];
  recommendations: string[];
}

interface ChatMessage {
  role: string;
  content: string;
}

// 2. Definição do Schema JSON para garantir o formato da saída
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    soilType: {
      type: Type.STRING,
      description: "O tipo principal de solo identificado (Argiloso, Arenoso, Humoso, Siltoso)."
    },
    characteristics: {
      type: Type.ARRAY,
      description: "Lista de 4 a 5 características visuais e de composição do solo.",
      items: { type: Type.STRING }
    },
    recommendations: {
      type: Type.ARRAY,
      description: "Lista de 4 a 6 recomendações práticas para plantio e manejo.",
      items: { type: Type.STRING }
    }
  },
  required: ["soilType", "characteristics", "recommendations"]
};


export async function analyzeImageWithGemini(imageBase64: string): Promise<AnalysisResult> {
  try {
    const base64Data = imageBase64.includes(',')
      ? imageBase64.split(',')[1]
      : imageBase64;

    const promptText = `Você é um especialista em análise de solo para agricultura familiar. Analise esta imagem de solo e forneça:

1. TIPO DE SOLO: Identifique o tipo principal (Argiloso, Arenoso, Humoso ou Siltoso)
2. CARACTERÍSTICAS: Liste 4-5 características visuais identificáveis (cor, textura, composição aparente, umidade)
3. RECOMENDAÇÕES: Forneça 4-6 recomendações práticas e específicas para plantio, incluindo culturas adequadas e cuidados

Use linguagem simples e direta, adequada para agricultores com pouco conhecimento técnico.
Retorne sua análise EXATAMENTE no formato JSON definido no schema.`;

    // 3. Chamada de API usando o SDK com resposta estruturada
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Modelo atualizado e estável
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data
              }
            }
          ]
        }
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        // Configurações chave para garantir o JSON
        responseMimeType: "application/json",
        responseSchema: analysisSchema
      }
    });

    // 4. A resposta estruturada está diretamente no 'response.text' como uma string JSON limpa
    const jsonText = response.text;
    
    // O SDK garante o JSON, então não precisamos mais do 'cleanedText' e regex!
    const parsedResult = JSON.parse(jsonText);

    return {
      soilType: parsedResult.soilType,
      characteristics: parsedResult.characteristics,
      recommendations: parsedResult.recommendations
    };

  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);

    // Mantendo o fallback robusto
    return {
      soilType: 'Solo não identificado',
      characteristics: ['Erro na análise visual', 'Verifique a qualidade da foto'],
      recommendations: ['Tente novamente com uma foto mais clara do solo', 'Realize um teste de solo manual (pegar um punhado e apertar)']
    };
  }
}

// ----------------------------------------------------------------------------------

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

    // 5. Chamada de API usando o SDK para o chat (AGORA USANDO gemini-2.5-flash)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // <--- CORRIGIDO para um modelo estável e com cotas
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.8,
        maxOutputTokens: 512,
      }
    });

    const textContent = response.text;

    if (!textContent) {
      throw new Error('No response from Gemini API');
    }

    return textContent.trim();

  } catch (error) {
    console.error('Error asking about soil:', error);
    throw error;
  }
}

///----------------------------------------------------------------------------------