export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { pergunta, cartas } = req.body;

  try {
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
              content:
                "Você é um especialista em tarot, responde de forma mística e profunda.",
            },
            {
              role: "user",
              content: `Pergunta: ${pergunta}. Cartas: ${cartas.join(", ")}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    return res.status(200).json({
      resposta: data.choices[0].message.content,
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro na IA" });
  }
}