function toggleFullScreen() {
    if (!document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

document.getElementById('fullscreen-button').addEventListener('click', function() {
    toggleFullScreen();
});

const carrin = document.querySelector('.Comprados')
function carrinho() {
	carrin.classList.toggle('ativo')
}

const config = document.querySelector('.arrumarConfig')
const openConfig = document.querySelector('.config')
config.addEventListener('click', () => {
	openConfig.classList.toggle('ativo')
})

const containerDesabilitar = document.querySelector('.desabilitar')
const containerHabilitar = document.querySelector('.habilitar')
const remover = document.getElementById('remover')
const habilitar = document.getElementById('adicionar')

remover.addEventListener('click', ()=>{
	containerDesabilitar.style.display = 'none'
	containerHabilitar.style.display ='flex'
})
habilitar.addEventListener('click', ()=>{
	containerDesabilitar.style.display = 'flex'
	containerHabilitar.style.display ='none'
})

function removerSelecaoTexto() {
    if (document.getSelection()) {
        document.getSelection().removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
}
removerSelecaoTexto();

function desabilitarArrastar() {
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
    }, false);

    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    }, false);

    document.addEventListener('drop', function(e) {
        e.preventDefault();
    }, false);
}
desabilitarArrastar();