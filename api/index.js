export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { pergunta, cartas, tipo } = req.body;

    // ================= MAOS =================
    if (tipo === "maos") {

      const prompt = `
Você é um especialista em leitura de mãos (quiromancia).

Faça uma leitura completa e mística dividida em:

❤️ Amor
💰 Dinheiro
🧠 Personalidade
⚡ Destino

Seja envolvente, espiritual e direto.
Nunca diga que é uma IA.
`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.2-3b-instruct:free",
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: "Faça a leitura." }
          ]
        }),
      });

      const data = await response.json();

      // 🔥 fallback (ESSENCIAL)
      if (!data.choices || !data.choices[0]) {
        console.log("ERRO MAOS:", data);

        return res.status(200).json({
          resposta: "🔮 Energia instável... tente novamente."
        });
      }

      return res.status(200).json({
        resposta: data.choices[0].message.content,
      });
    }

    // ================= TAROT =================
    if (!pergunta || !cartas || cartas.length === 0) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (tipo === "free") {
      systemPrompt = `
Você é um tarólogo experiente.

Explique a carta, conecte com a pergunta e dê um conselho.

Nunca diga que é uma IA.
`;

      userPrompt = `
Pergunta: ${pergunta}
Carta: ${cartas[0]}
`;
    } else {
      systemPrompt = `
Você é um tarólogo profissional.

Faça leitura completa de passado, presente e futuro.

Nunca diga que é uma IA.
`;

      userPrompt = `
Pergunta: ${pergunta}
Cartas: ${cartas.join(", ")}
`;
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      }),
    });

    const data = await response.json();

    // 🔥 fallback geral
    if (!data.choices || !data.choices[0]) {
      console.log("ERRO TAROT:", data);

      return res.status(200).json({
        resposta: "🔮 As cartas estão confusas... tente novamente."
      });
    }

    return res.status(200).json({
      resposta: data.choices[0].message.content,
    });

  } catch (err) {
    console.log("ERRO GERAL:", err);

    return res.status(200).json({
      resposta: "🔮 Energia instável... tente novamente."
    });
  }
}