export interface AnalysisResult {
  soilType: string;
  characteristics: string[];
  recommendations: string[];
}

interface ChatMessage {
  role: string;
  content: string;
}

// ====== NOVO: trava anti-spam ======
let isProcessingImage = false;
let isProcessingChat = false;

const API_KEY = "AIzaSyDl4tpg-KzpHknS1EIp5rAEkzm47yzAOr8";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;

// ====== Função auxiliar com retry leve ======
async function fetchWithRetry(url: string, options: any, retries = 3): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(url, options);

    if (response.status !== 429) return response;

    console.warn(`[Gemini] 429 - Tentativa ${attempt}/${retries}`);

    // espera progressiva
    await new Promise(res => setTimeout(res, 800 * attempt));
  }

  throw new Error("Falha após múltiplas tentativas (429 Too Many Requests)");
}

// =====================================================
// ============= ANALISAR IMAGEM (CORRIGIDO) ===========
// =====================================================
export async function analyzeImageWithGemini(imageBase64: string): Promise<AnalysisResult> {
  if (isProcessingImage) {
    console.warn("Aguarde: análise já em andamento.");
    return {
      soilType: "Aguardando requisição anterior",
      characteristics: ["Espere alguns segundos"],
      recommendations: ["Evite enviar várias imagens ao mesmo tempo"]
    };
  }

  isProcessingImage = true;

  try {
    const base64Data = imageBase64.includes(",")
      ? imageBase64.split(",")[1]
      : imageBase64;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Você é um especialista em análise de solo para agricultura familiar. Analise esta imagem de solo e forneça:

1. TIPO DE SOLO: Identifique o tipo principal (Argiloso, Arenoso, Humoso ou Siltoso)
2. CARACTERÍSTICAS: Liste 4-5 características visuais identificáveis
3. RECOMENDAÇÕES: Forneça 4-6 recomendações práticas

Retorne EXATAMENTE neste formato JSON:
{
  "soilType": "tipo",
  "characteristics": ["c1","c2","c3","c4"],
  "recommendations": ["r1","r2","r3","r4"]
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

    const response = await fetchWithRetry(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) throw new Error("Resposta vazia da API Gemini");

    const cleaned = textContent.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      soilType: parsed.soilType ?? "Não identificado",
      characteristics: Array.isArray(parsed.characteristics)
        ? parsed.characteristics
        : ["Não identificado"],
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations
        : ["Não identificado"]
    };

  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);

    return {
      soilType: "Erro na análise",
      characteristics: [
        "Imagem ruim",
        "Tente melhorar a nitidez"
      ],
      recommendations: [
        "Tire outra foto",
        "Evite sombra",
        "Centralize o solo"
      ]
    };
  } finally {
    isProcessingImage = false;
  }
}

// =====================================================
// ================== CHAT SOBRE O SOLO =================
// =====================================================
export async function askAboutSoil(
  question: string,
  soilType: string,
  characteristics: string[],
  recommendations: string[],
  chatHistory: ChatMessage[]
): Promise<string> {

  if (isProcessingChat) {
    console.warn("Chat ainda processando, espere...");
    return "Calma! Estou terminando a resposta anterior 😅";
  }

  isProcessingChat = true;

  try {
    const historyText = chatHistory
      .map(msg => `${msg.role === "user" ? "Usuário" : "Assistente"}: ${msg.content}`)
      .join("\n\n");

    const prompt = `
INFORMAÇÕES DO SOLO:
- Tipo: ${soilType}
- Características: ${characteristics.join(", ")}
- Recomendações: ${recommendations.join(", ")}

${historyText ? `HISTÓRICO:\n${historyText}\n\n` : ""}
Pergunta: ${question}

Responda de forma simples e prática, como se estivesse falando com um agricultor.
`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 512,
      }
    };

    const response = await fetchWithRetry(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) throw new Error("Resposta vazia da API Gemini");

    return textContent.trim();

  } catch (error) {
    console.error("Error asking about soil:", error);
    return "Ocorreu um erro ao responder. Tente novamente.";
  } finally {
    isProcessingChat = false;
  }
}
