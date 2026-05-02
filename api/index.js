export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { pergunta, cartas, tipo } = req.body;

    // ================= MAOS =================
    if (tipo === "maos") {
      return res.status(200).json({
        resposta: `🔮 Leitura das suas mãos

❤️ Amor: Você demonstra intensidade emocional e busca conexões profundas.
💰 Dinheiro: Existe potencial de crescimento financeiro, mas exige disciplina.
🧠 Personalidade: Pessoa intuitiva, observadora e espiritual.
⚡ Destino: Seu caminho está ligado à evolução pessoal e descobertas importantes.`
      });
    }

    // ================= TAROT =================
    if (!pergunta || !cartas || cartas.length === 0) {
      return res.status(400).json({
        error: "Dados inválidos"
      });
    }

    let systemPrompt = "";
    let userPrompt = "";

    // ===== 1 CARTA =====
    if (tipo === "free") {
      systemPrompt = `Você é um tarólogo experiente.

Regras:
- Explique o significado da carta
- Relacione com a pergunta
- Seja direto e claro
- Linguagem mística, mas simples

Estrutura:
🔮 SIGNIFICADO: Explique a carta
✨ CONSELHO: Dê um conselho curto e direto

Nunca diga que é uma IA.`;

      userPrompt = `Pergunta: ${pergunta}
Carta tirada: ${cartas[0]}`;
    }

    // ===== 3 CARTAS =====
    else {
      if (cartas.length < 3) {
        return res.status(400).json({
          error: "Para leitura completa são necessárias 3 cartas"
        });
      }

      systemPrompt = `Você é um tarólogo profissional extremamente experiente.

Estrutura obrigatória:
🔮 PASSADO: Explique a primeira carta
🔮 PRESENTE: Explique a segunda carta
🔮 FUTURO: Explique a terceira carta
✨ CONSELHO FINAL: Dê uma orientação forte`;

      userPrompt = `Pergunta: ${pergunta}
Cartas:
1: ${cartas[0]}
2: ${cartas[1]}
3: ${cartas[2]}`;
    }

    // ================= CHAMADA IA =================
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.log("ERRO IA:", data);
      return res.status(500).json({
        error: "Erro na resposta da IA"
      });
    }

    return res.status(200).json({
      resposta: data.choices[0].message.content
    });

  } catch (err) {
    console.log("ERRO GERAL:", err);
    return res.status(500).json({
      error: "Erro interno no servidor"
    });
  }
}