import { GoogleGenAI, Type } from '@google/genai';

// ⚠️ AVISO DE SEGURANÇA:
// Para produção, esta chave deve ser carregada de forma segura (ex: process.env.GEMINI_API_KEY)
// e NUNCA deve ser exposta no código de frontend (navegador).
const API_KEY = "AIzaSyDl4tpg-KzpHknS1EIp5rAEkzm47yzAOr8"; 

// 1. Inicializa o SDK do Google GenAI
const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Interfaces ---
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

// =========================================================================
// ## Função 1: analyzeImageWithGemini (Análise de Imagem)
// =========================================================================

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

    // Chamada de API usando o SDK com resposta estruturada
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Modelo Estável e Multimodal
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
        responseMimeType: "application/json",
        responseSchema: analysisSchema
      }
    });

    let jsonText = response.text; // Captura a string de resposta
    let parsedResult: AnalysisResult;

    // 🛑 VERIFICAÇÃO DE RESPOSTA VAZIA/UNDEFINED
    if (!jsonText || jsonText.trim() === "undefined" || jsonText.trim().length === 0) {
      throw new Error('Gemini returned empty or invalid response text (likely "undefined").');
    }
    
    jsonText = jsonText.trim();

    try {
      // Tenta analisar a resposta diretamente
      parsedResult = JSON.parse(jsonText);

    } catch (parseError) {
      // 5. Lógica de Saneamento de JSON (Para caracteres e truncamento)
      console.warn('JSON parsing failed. Attempting to sanitize response:', jsonText);
      
      let correctedText = jsonText;
      
      // 1. Tenta corrigir JSON truncado no final (e.g., "restos de)
      if (!correctedText.endsWith('}')) {
          // Trunca qualquer string incompleta no final e adiciona aspas, colchete, chave
          correctedText = correctedText.replace(/[^"]+$/, ''); 
          if (!correctedText.endsWith('"')) correctedText += '"';
          if (!correctedText.endsWith(']')) correctedText += ']';
          if (!correctedText.endsWith('}')) correctedText += '}';
      }
      
      // 2. Saneamento: remove quebras de linha e tenta escapar aspas duplas internas não escapadas
      const sanitizedText = correctedText
        .replace(/\\n/g, '') 
        .replace(/([^"\\])"([^"\\])/g, '$1\\"$2'); // Escapa aspas não escapadas

      try {
        // Tenta analisar novamente a string saneada
        parsedResult = JSON.parse(sanitizedText);
        console.log('JSON successfully sanitized and parsed.');

      } catch (finalError) {
        // Falha total: Lança o erro para o bloco catch externo
        console.error('Final JSON parsing failed even after sanitization.', finalError);
        throw new Error(`Failed to parse final JSON. Response fragment: ${jsonText.substring(0, 100)}...`); 
      }
    }

    return {
      soilType: parsedResult.soilType,
      characteristics: parsedResult.characteristics,
      recommendations: parsedResult.recommendations
    };

  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);

    // Retorna um resultado de fallback em caso de falha crítica
    return {
      soilType: 'Solo não identificado',
      characteristics: ['Erro na análise visual', 'Verifique a qualidade da foto'],
      recommendations: ['Tente novamente com uma foto mais clara do solo', 'Realize um teste de solo manual (pegar um punhado e apertar)']
    };
  }
}

// ----------------------------------------------------------------------------------
// ## Função 2: askAboutSoil (Chat com base na Análise)
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

    // Chamada de API usando o SDK para o chat
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Modelo Estável
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
