export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // 🔥 não vamos processar imagem ainda (pra não crashar)
    // só validar que chegou request

    return res.status(200).json({
      resposta: `
🔮 Leitura das suas mãos

❤️ Amor:
Você tem forte intensidade emocional e busca conexões verdadeiras.

💰 Dinheiro:
Existe potencial de crescimento, mas exige foco e disciplina.

🧠 Personalidade:
Pessoa intuitiva, observadora e com forte energia espiritual.

⚡ Destino:
Seu caminho envolve evolução pessoal e descobertas importantes.
      `
    });

  } catch (err) {
    console.log("ERRO MAOS:", err);
    return res.status(500).json({
      error: "Erro interno no servidor",
    });
  }
}