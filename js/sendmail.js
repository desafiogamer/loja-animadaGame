var nome = document.getElementById('nome').textContent
var email = document.getElementById('email').textContent
var telefone = document.getElementById('telefone').textContent
var assunto = document.getElementById('assunto').textContent
var menssagem = document.getElementById('menssagem').textContent
var btn = document.getElementById('envarMensagem')

btn.addEventListener('click',()=>{
    
        Email.send({
            Host : "smtp.elasticemail.com",
            Username : "me2803390@gmail.com",
            Password : "60D37F3F9DCFCB84D6988D0BD93D76999C5C",
            To : 'joaopap1234@gmail.com',
            From : "me2803390@gmail.com",
            Subject : `nome:${nome}  assunto:${assunto} telefone:${telefone} email:${email}`,
            Body : `${menssagem}`
        }).then(
            message => alert(message)
        );
    
})




