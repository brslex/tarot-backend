import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return res.status(500).json({ erro: "Erro ao processar imagens" });
      }

      const mao1 = files.mao1?.filepath;
      const mao2 = files.mao2?.filepath;

      if (!mao1 || !mao2) {
        return res.status(400).json({ erro: "Envie as duas mãos" });
      }

      // 🔥 CONVERTE IMAGENS PARA BASE64
      const img1 = fs.readFileSync(mao1, { encoding: "base64" });
      const img2 = fs.readFileSync(mao2, { encoding: "base64" });

      // 🔮 PROMPT
      const prompt = `
Você é um especialista em leitura de mãos (quiromancia).

Analise as duas mãos enviadas.

Faça uma leitura completa e mística dividida em:

Amor:
Dinheiro:
Personalidade:
Destino:

Seja direto, envolvente e espiritual.
Nunca diga que é uma IA.
`;

      // ⚠️ AQUI você conecta com sua IA (OpenAI ou outra)

      // EXEMPLO SIMPLES (RESPOSTA MOCK)
      const resposta = `
🔮 Leitura das suas mãos

❤️ Amor:
Você demonstra intensidade emocional e busca conexões profundas.

💰 Dinheiro:
Existe potencial de crescimento financeiro, mas exige disciplina.

🧠 Personalidade:
Pessoa intuitiva, observadora e espiritual.

⚡ Destino:
Caminho ligado a evolução pessoal e descobertas internas.
`;

      return res.status(200).json({ resposta });

    } catch (e) {
      return res.status(500).json({ erro: "Erro interno", detalhe: e.message });
    }
  });
}