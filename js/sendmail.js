var nome = document.getElementById('nome').value
var email = document.getElementById('email').value
var telefone = document.getElementById('telefone').value
var assunto = document.getElementById('assunto').value
var menssagem = document.getElementById('menssagem').value
var btn = document.getElementById('envarMensagem')

btn.addEventListener('click',()=>{
    
        Email.send({
            Host : "smtp.elasticemail.com",
            Username : "me2803390@gmail.com",
            Password : "60D37F3F9DCFCB84D6988D0BD93D76999C5C",
            To : 'joaopap1234@gmail.com',
            From : "me2803390@gmail.com",
            Subject : `nome:${nome}  assunto:${assunto}`,
            Body : ` telefone:${telefone} email:${email}
            ${menssagem}`
        }).then(
            message => alert(message)
        );
    
})




