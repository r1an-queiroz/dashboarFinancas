document.getElementById("formCadastro").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmarSenha = document.getElementById("confirmarSenha").value.trim();
  const erro = document.getElementById("erroCadastro");

  if (!nome || !usuario || !senha || !confirmarSenha) {
    erro.textContent = "Preencha todos os campos.";
    return;
  }

  if (senha !== confirmarSenha) {
    erro.textContent = "As senhas não coincidem.";
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuariosFinanceiro")) || [];

  const usuarioExiste = usuarios.some(u => u.usuario === usuario);
  if (usuarioExiste) {
    erro.textContent = "Este usuário já está cadastrado.";
    return;
  }

  usuarios.push({ nome, usuario, senha });
  localStorage.setItem("usuariosFinanceiro", JSON.stringify(usuarios));
  alert("Cadastro realizado com sucesso!");
  window.location.href = "login.html";
});
