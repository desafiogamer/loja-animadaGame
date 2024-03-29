var btn=document.getElementById("envarMensagem");btn.addEventListener("click",()=>{var e=document.getElementById("nome").value,a=document.getElementById("email").value,m=document.getElementById("telefone").value,n=document.getElementById("assunto").value,t=document.getElementById("menssagem").value;e&&a&&m&&n&&t?Email.send({Host:"smtp.elasticemail.com",Username:"me2803390@gmail.com",Password:"60D37F3F9DCFCB84D6988D0BD93D76999C5C",To:"joaopap1234@gmail.com",From:"me2803390@gmail.com",Subject:"Chegou um email para voce",Body:`NOME:${e} <br>
 ASSUNTO:${n} <br>
 TELEFONE: ${m} <br>
 EMAIL: ${a}<br>
${t}`}).then(()=>{alert("sua mensagem foi enviada")}):alert("Preencha todos os campos")});