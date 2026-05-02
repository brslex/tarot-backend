import Busboy from "busboy";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const busboy = Busboy({ headers: req.headers });

    let recebeuMao1 = false;
    let recebeuMao2 = false;

    busboy.on("file", (fieldname, file) => {
      console.log("Recebendo:", fieldname);

      if (fieldname === "mao1") recebeuMao1 = true;
      if (fieldname === "mao2") recebeuMao2 = true;

      file.on("data", () => {}); // só consumir stream
    });

    busboy.on("finish", () => {
      if (!recebeuMao1 || !recebeuMao2) {
        return res.status(400).json({ error: "Envie as duas mãos" });
      }

      // 🔥 TESTE SIMPLES
      return res.status(200).json({
        resposta: "UPLOAD OK 🔥",
      });
    });

    req.pipe(busboy);

  } catch (e) {
    console.log("ERRO GERAL:", e);
    return res.status(500).json({ error: "Erro interno" });
  }
}