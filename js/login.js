document.getElementById("formLogin").addEventListener("submit", function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const erroLogin = document.getElementById("erroLogin");

  const usuariosSalvos = JSON.parse(localStorage.getItem("usuariosFinanceiro")) || [];

  const usuarioEncontrado = usuariosSalvos.find(
    user => user.usuario === usuario && user.senha === senha
  );

  if (usuarioEncontrado) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
    window.location.href = "index.html"; // redireciona para o dashboard
  } else {
    erroLogin.textContent = "Usuário ou senha inválidos.";
  }
});
