Future<void> enviarParaIA() async {
  if (mao1 == null || mao2 == null) return;

  setState(() {
    loading = true;
    resposta = "";
  });

  try {
    var request = http.MultipartRequest(
      'POST',
      Uri.parse('https://tarot-backend-psi.vercel.app/api/maos'),
    );

    request.files.add(await http.MultipartFile.fromPath('mao1', mao1!.path));
    request.files.add(await http.MultipartFile.fromPath('mao2', mao2!.path));

    print("ENVIANDO PRA API...");

    var response = await request.send().timeout(Duration(seconds: 20));

    print("STATUS: ${response.statusCode}");

    var respStr = await response.stream.bytesToString();

    print("RESPOSTA: $respStr");

    final data = jsonDecode(respStr);

    setState(() {
      resposta = data["resposta"] ?? "Erro ao gerar leitura";
      loading = false;
    });

  } catch (e) {
    print("ERRO: $e");

    setState(() {
      resposta = "Erro ao conectar com servidor";
      loading = false;
    });
  }
}