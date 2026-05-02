export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { pergunta, cartas } = req.body;

    if (!pergunta || !cartas || cartas.length < 3) {
      return res.status(400).json({
        error: "Dados inválidos",
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-4-31b-it:free",
          messages: [
            {
              role: "system",
              content: `
Você é um tarólogo profissional extremamente experiente.

Regras:
- Interprete profundamente cada carta
- Depois conecte as cartas entre si
- Seja direto e claro, sem enrolação
- Fale como se estivesse aconselhando a pessoa
- Nunca dê respostas genéricas
- Traga orientação real para a vida dela
- Linguagem mística, porém compreensível

Estrutura obrigatória:

🔮 PASSADO:
Explique a primeira carta e o que ela revela

🔮 PRESENTE:
Explique a segunda carta e a situação atual

🔮 FUTURO:
Explique a terceira carta e a tendência

✨ CONSELHO FINAL:
Dê uma orientação prática baseada na leitura

Nunca diga que é uma IA.
`
            },
            {
              role: "user",
              content: `
Pergunta: ${pergunta}

Cartas tiradas:
1ª (Passado): ${cartas[0]}
2ª (Presente): ${cartas[1]}
3ª (Futuro): ${cartas[2]}

Faça uma leitura completa e profunda.
`
            }
          ]
        }),
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        error: "Erro na resposta da IA",
      });
    }

    return res.status(200).json({
      resposta: data.choices[0].message.content,
    });

  } catch (err) {
    return res.status(500).json({
      error: "Erro interno no servidor",
    });
  }
}