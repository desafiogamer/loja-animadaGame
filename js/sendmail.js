var btn = document.getElementById('envarMensagem')

btn.addEventListener('click',()=>{
    var nome = document.getElementById('nome').value
    var email = document.getElementById('email').value
    var telefone = document.getElementById('telefone').value
    var assunto = document.getElementById('assunto').value
    var menssagem = document.getElementById('menssagem').value

    if(nome && email && telefone && assunto && menssagem){
        Email.send({
            Host : "smtp.elasticemail.com",
            Username : "me2803390@gmail.com",
            Password : "60D37F3F9DCFCB84D6988D0BD93D76999C5C",
            To : 'joaopap1234@gmail.com',
            From : "me2803390@gmail.com",
            Subject : `${nome}`,
            Body : `assunto:${assunto} <br>\n Telefone: ${telefone} <br>\n Email: ${email}<br>\n${menssagem}`
        }).then(
            message => alert(message)
        );
    }else{
        alert('Preencha todos os campos')
    }
})




