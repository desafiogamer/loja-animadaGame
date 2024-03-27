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

//full screen
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

//joystick
//joystick para mobile
    const joystick = document.getElementById('joystick');
    const stick = document.getElementById('stick');
    let stickOffsetX = 0;
    let stickOffsetY = 0;
    let isJoystickActive = false;

    function pressKey(key) {
        const event = new KeyboardEvent('keydown', {
            key: key
        });
        document.dispatchEvent(event);
    }

    function releaseKey(key) {
        const event = new KeyboardEvent('keyup', {
            key: key
        });
        document.dispatchEvent(event);
    }

    joystick.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!isJoystickActive) {
            isJoystickActive = true;
            const touch = e.touches[0];
            const rect = joystick.getBoundingClientRect();
            stickOffsetX = touch.clientX;
            stickOffsetY = touch.clientY;
            stick.style.transition = 'none';
            moveStick(touch.clientX, touch.clientY);
        }
    });

    joystick.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (isJoystickActive) {
            const touch = e.touches[0];
            moveStick(touch.clientX, touch.clientY);
        }
    });

    joystick.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (isJoystickActive) {
            isJoystickActive = false;
            stick.style.transition = 'transform 0.1s ease-out';
            stick.style.transform = 'translate(0, 0)';
            releaseKey('w');
            releaseKey('a');
            releaseKey('s');
            releaseKey('d');
        }
    });

    function moveStick(x, y) {
        const rect = joystick.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = x - centerX;
        const deltaY = y - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = Math.min(rect.width, rect.height) / 2 - 25; // 25 = metade do tamanho do stick

        if (distance > maxDistance) {
            const ratio = maxDistance / distance;
            x = centerX + deltaX * ratio;
            y = centerY + deltaY * ratio;
        }

        stick.style.transform = `translate(${x - stickOffsetX}px, ${y - stickOffsetY}px)`;

        // Calcular a direção
        const angle = Math.atan2(deltaY, deltaX);
        const angleInDegrees = angle * (180 / Math.PI);

        if (angleInDegrees >= -135 && angleInDegrees < -45) {
            releaseKey('d');
            releaseKey('s');
            releaseKey('a');
            pressKey('w'); // Esquerda
        } else if (angleInDegrees >= -45 && angleInDegrees < 45) {
            releaseKey('w');
            releaseKey('s');
            releaseKey('a');
            pressKey('d'); // Cima
        } else if (angleInDegrees >= 45 && angleInDegrees < 135) {
            releaseKey('w');
            releaseKey('a');
            releaseKey('d');
            pressKey('s'); // Baixo
        } else {
            releaseKey('w');
            releaseKey('d');
            releaseKey('s');
            pressKey('a'); // Direita
        }
    }