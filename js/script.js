import * as THREE from '../build/three.module.js';
import {GLTFLoader} from '../jsm/GLTFLoader.js';
import { CharacterControls } from './charaterControls.js';
import {OrbitControls} from '../jsm/OrbitControls.js';
import {CSS2DRenderer, CSS2DObject} from '../jsm/CSS2DRenderer.js'

let scene,
    camera,
    renderer,
    characterControls,
    orbitControls,
    keysPressed,
    labelRenderer,
    //animações
    mixer, 
    mixer3,
    mixerCozinheiro,
    mixergalinha,
    mixerPassaro,
    mixerVaca,
    //nuvens e estrelas
    rainGeo,
    rain,
    rainDrop,
    cloudGeo,
    rainCount = 3000,
    clouds = [],
    //grama
    leavesMaterial,
    //galinha e passaro se movendo
    andando = true,
    andandoPassaro = true,
    girando = true,
    flutuando = true,
    galinha,
    passaro,
    floorParedefrontal,
    floorParedefrontal1,
    floorParedefrontal2,
    floorParedefrontal3,
    rock
    
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.z = 0.27;
    

    //renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    scene.fog = new THREE.FogExp2(0x83bdff, 0.002);
    renderer.setClearColor(scene.fog.color);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true
    document.body.appendChild(renderer.domElement);

    labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(window.innerWidth, window.innerHeight)
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = '0px'
    labelRenderer.domElement.style.pointerEvents = 'none'
    document.body.appendChild(labelRenderer.domElement)

    //cercas

    //textura da cerca
    const textureLoader = new THREE.TextureLoader();
    const placeholderParedefrontal = textureLoader.load("./textures/cerca.png");
    placeholderParedefrontal.wrapS = THREE.RepeatWrapping;
    placeholderParedefrontal.wrapT = THREE.RepeatWrapping;
    placeholderParedefrontal.repeat.set(5,1)
    const materialParedefrontal = new THREE.MeshPhongMaterial({ map: placeholderParedefrontal,transparent: true,side: THREE.DoubleSide})

    //cercas frontal
    cerca(20,1,0,0.5,-14.9, 0)
    cerca2(20,1,10, 0.5, -5, - Math.PI / 2)
    cerca3(20,1,-10, 0.5, -5, + Math.PI / 2)
    cerca4(20,1,0, 0.5, 4.91, Math.PI)

    function cerca(largura, espessura,x,y,z, rotacao){
        const geometryParedefrontal = new THREE.PlaneGeometry(largura, espessura);
        floorParedefrontal = new THREE.Mesh(geometryParedefrontal,materialParedefrontal)
        floorParedefrontal.position.set(x,y,z)
        floorParedefrontal.rotation.y = rotacao
        scene.add(floorParedefrontal)
    }

    function cerca2(largura, espessura,x,y,z, rotacao){
        const geometryParedefrontal = new THREE.PlaneGeometry(largura, espessura);
        floorParedefrontal1 = new THREE.Mesh(geometryParedefrontal,materialParedefrontal)
        floorParedefrontal1.position.set(x,y,z)
        floorParedefrontal1.rotation.y = rotacao
        scene.add(floorParedefrontal1)
    }

    function cerca3(largura, espessura,x,y,z, rotacao){
        const geometryParedefrontal = new THREE.PlaneGeometry(largura, espessura);
        floorParedefrontal2 = new THREE.Mesh(geometryParedefrontal,materialParedefrontal)
        floorParedefrontal2.position.set(x,y,z)
        floorParedefrontal2.rotation.y = rotacao
        scene.add(floorParedefrontal2)
    }

    function cerca4(largura, espessura,x,y,z, rotacao){
        const geometryParedefrontal = new THREE.PlaneGeometry(largura, espessura);
        floorParedefrontal3 = new THREE.Mesh(geometryParedefrontal,materialParedefrontal)
        floorParedefrontal3.position.set(x,y,z)
        floorParedefrontal3.rotation.y = rotacao
        scene.add(floorParedefrontal3)
    }

    //texturas da paredes
    generateFloor()
    generateEstrada(5, 15, -8, 0.001, -5, 0)
    generateEstrada(5, 16.6,1.7, 0.002,-8,1.6)
    generateEstrada(5, 11.5,8.5, 0.004, -0.9,0)
    generateEstrada(5, 4,6.7, 0.004, -11.5,0)

    //chao base
    function generateFloor() {
        const textureLoader = new THREE.TextureLoader();
        const placeholder = textureLoader.load("./textures/MuchaTseBle.jpg");
        const geometry = new THREE.PlaneGeometry(30, 30);
        const material = new THREE.MeshPhongMaterial({ map: placeholder})
        const floor = new THREE.Mesh(geometry, material)
        floor.castShadow = true;
        floor.receiveShadow = true;
        floor.rotation.x = - Math.PI / 2
        floor.position.set(0,0,-5)
        scene.add(floor)
    }

    //estradas
    function generateEstrada(largura, espessura, x,y,z,rotacao) {
        const textureLoader = new THREE.TextureLoader();
        const placeholder = textureLoader.load("./textures/estrada.png");
        const geometry = new THREE.PlaneGeometry(largura, espessura);
        const material = new THREE.MeshPhongMaterial({ map: placeholder,transparent: true,})
        const floor = new THREE.Mesh(geometry, material)
        floor.castShadow = true;
        floor.receiveShadow = true;
        floor.rotation.x = - Math.PI / 2
        floor.rotation.z = rotacao
        floor.position.set(x,y,z)
        scene.add(floor)
    }

    //controles
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true
    orbitControls.minDistance = 4
    orbitControls.maxDistance = 4
    orbitControls.enablePan = false
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.05
    orbitControls.minPolarAngle = Math.PI / 2 - 1
    orbitControls.enableZoom = false
    orbitControls.update();

    //SOM
    const listerner = new THREE.AudioListener()
    scene.add(listerner)

    //trila sonora
    const trilha = new THREE.Audio(listerner)
    const loaderSoundTrila = new THREE.AudioLoader()
    loaderSoundTrila.load('../sound/Golden.mp3', (buffer) =>{
        trilha.setBuffer(buffer)
        trilha.setLoop(true)
        trilha.setVolume(0.5)
    })

    const btnPararSom = document.getElementById('paraTrilha')
    const btnAtivarSom = document.getElementById('ativarTrilha')
    
    btnPararSom.addEventListener('click', ()=>{
        trilha.stop()
        btnPararSom.style.display = 'none'
        btnAtivarSom.style.display = 'block'
    })

    btnAtivarSom.addEventListener('click', ()=>{
        trilha.play()
        btnPararSom.style.display = 'block'
        btnAtivarSom.style.display = 'none'
    })

    //Botão para dormir
    const btnMudarClimaNoite = document.createElement('button')
    btnMudarClimaNoite.textContent = 'Noite'
    btnMudarClimaNoite.setAttribute('id', 'noite')

    const btnMudarClimaDia = document.createElement('button')
    btnMudarClimaDia.textContent = 'Dia'
    btnMudarClimaDia.setAttribute('id', 'dia')
    btnMudarClimaDia.style.display = 'none'

    const divMudarClimaNoite = document.createElement('div')
    divMudarClimaNoite.setAttribute('id', 'home')
    divMudarClimaNoite.appendChild(btnMudarClimaNoite)
    divMudarClimaNoite.appendChild(btnMudarClimaDia)
    
    const cPointLabel2 = new CSS2DObject(divMudarClimaNoite)
    scene.add(cPointLabel2)
    cPointLabel2.position.set(-7.5, 1.5, -2)

    //balão dialogo
    var divBalao = document.createElement('div');
    divBalao.setAttribute('class', 'balao')
    var menssagem = document.createElement('p');
    menssagem.setAttribute('class', 'mensagem');
    menssagem.textContent = 'Bem vindo, fique a vontade para escolher seu prato!'
    divBalao.appendChild(menssagem)

    const divNaCena = new CSS2DObject(divBalao)
    scene.add(divNaCena)
    divNaCena.position.set(9, 2, -3)

    //pratos prontos
    var pratosProntos = document.querySelector('.pratosProntos')
    var pratosLegumes = document.querySelector('.legumes')
    var bebidas = document.querySelector('.bebidas')

    var btnfechar1 = document.querySelector('#fechar1')
    var btnfechar2 = document.querySelector('#fechar2')
    var btnfechar3 = document.querySelector('#fechar3')
    btnfechar1.addEventListener('click',()=>{
        pratosProntos.classList.remove('ativo')
        btnfechar1.style.display = 'none'
    })
    btnfechar2.addEventListener('click',()=>{
        bebidas.classList.remove('ativo')
        btnfechar2.style.display = 'none'
    })
    btnfechar3.addEventListener('click',()=>{
        
        pratosLegumes.classList.remove('ativo')
        btnfechar3.style.display = 'none'
    })

    //MODELOS 3D DA CENA
    var characterPreviousPosition = new THREE.Vector3();

    //personagem controlado
    const loader = new GLTFLoader().setPath('./models/');
    loader.load('personagem.glb', function (glft) {
        const model = glft.scene
        model.scale.set(0.25, 0.25, 0.25)
        model.traverse(function (object) {
            if (object.isMesh) object.castShadow = true;
        });
        scene.add(model)
        const gltfAnimations = glft.animations
        const mixer = new THREE.AnimationMixer(model)
        const animationsMap = new Map()
        gltfAnimations.filter(a => a.name != 'Tpose').forEach((a)=>{
            animationsMap.set(a.name, mixer.clipAction(a))
        })
        characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera, 'Idle')

        //colisão
        function checkCollisions() {
            let collided = false;
            const characterBoundingBox = new THREE.Box3().setFromObject(characterControls.model);

            const objectsBoundingBoxes = [
                new THREE.Box3().setFromObject(fogueira),
                new THREE.Box3().setFromObject(cozinheiro),
                new THREE.Box3().setFromObject(placa),
                new THREE.Box3().setFromObject(poco),
                new THREE.Box3().setFromObject(lenha),
                new THREE.Box3().setFromObject(poste),
                new THREE.Box3().setFromObject(casa),
                new THREE.Box3().setFromObject(shopVegetal),
                new THREE.Box3().setFromObject(shop),
                new THREE.Box3().setFromObject(floorParedefrontal),
                new THREE.Box3().setFromObject(floorParedefrontal1),
                new THREE.Box3().setFromObject(floorParedefrontal2),
                new THREE.Box3().setFromObject(floorParedefrontal3),
            ];
            var colisionCozinheiro = new THREE.Box3().setFromObject(cozinheiro)
            var colisionFogueira = new THREE.Box3().setFromObject(fogueira)
            var colisionLegumes = new THREE.Box3().setFromObject(shopVegetal)
            var colisionBebidas = new THREE.Box3().setFromObject(shop)

            objectsBoundingBoxes.forEach(objectBoundingBox => {
                if (characterBoundingBox.intersectsBox(objectBoundingBox)) {
                    collided = true;
                }

                if (characterBoundingBox.intersectsBox(colisionCozinheiro)) {
                    divBalao.style.display = 'block'
                }

                if (characterBoundingBox.intersectsBox(colisionFogueira)) {
                    pratosProntos.classList.add('ativo')
                    btnfechar1.style.display = 'block'
                }

                if (characterBoundingBox.intersectsBox(colisionLegumes)) {
                    pratosLegumes.classList.add('ativo')
                    btnfechar3.style.display = 'block'
                }

                if (characterBoundingBox.intersectsBox(colisionBebidas)) {
                    bebidas.classList.add('ativo')
                    btnfechar2.style.display = 'block'
                }

            });

            if (collided) {
                characterControls.model.position.copy(characterPreviousPosition);
            } else {
                characterPreviousPosition.copy(characterControls.model.position);
            }
        }
        function update() {
            checkCollisions();
            requestAnimationFrame(update);
        }
        update() 
    });

    //passaro
    passaro = new THREE.Object3D()
    loader.load('birds.glb', function (glft) {
        passaro.add(glft.scene)
        passaro.scale.set(1, 1, 1)
        passaro.rotation.y = -1.5
        passaro.position.set(-20, 12, -30)

        mixerPassaro = new THREE.AnimationMixer(passaro);
        glft.animations.forEach((clip) => {
            mixerPassaro.clipAction(clip).play();
            mixerPassaro.clipAction(clip).clampWhenFinished = true;
        });
        scene.add(passaro)
    })

    //shop
    const shop = new THREE.Object3D()
    loader.load('juice_carton_shop.glb', function (glft) {
        shop.add(glft.scene)
        shop.scale.set(1, 1, 1)
        shop.rotation.y = -0.8
        shop.position.set(-8, 0, -13)
        shop.traverse(function (object) {
            if (object.isMesh) object.castShadow = true;
        });
        scene.add(shop)
    })

    //mailBox
    const mailBox = new THREE.Object3D()
    loader.load('correio.glb', function (glft) {
        mailBox.add(glft.scene)
        mailBox.scale.set(1.3, 1.3, 1.3)
        mailBox.rotation.y = 3.05
        mailBox.position.set(1, 0, 4.3)
        scene.add(mailBox)
    })

    //vaca
    const vaca = new THREE.Object3D()
    loader.load('cow.glb', function (glft) {
        vaca.add(glft.scene)
        vaca.scale.set(0.25, 0.25, 0.25)
        vaca.rotation.y = 1
        vaca.position.set(-3, 0, -14)
        scene.add(vaca)

        mixerVaca = new THREE.AnimationMixer(vaca);
        glft.animations.forEach((clip) => {
            mixerVaca.clipAction(clip).play();
            mixerVaca.clipAction(clip).clampWhenFinished = true;
        });
    })

    //shopVegetal
    const shopVegetal = new THREE.Object3D()
    loader.load('vegetables_shop.glb', function (glft) {
        shopVegetal.add(glft.scene)
        shopVegetal.scale.set(0.8, 0.8, 0.8)
        shopVegetal.rotation.y = -1.5
        shopVegetal.position.set(7, 0.1, -14)
        shopVegetal.traverse(function (object) {
            if (object.isMesh) object.castShadow = true;
        });
        scene.add(shopVegetal)
    })

    //fogueira
    const fogueira = new THREE.Object3D()
    loader.load('pot_with_food_and__bonfire_lowpoly.glb', function (glft) {
        fogueira.add(glft.scene)
        fogueira.scale.set(1, 1, 1)
        fogueira.position.set(9, 1, -5)
        fogueira.traverse(function (object) {
            if (object.isMesh) object.castShadow = true;
        });
        scene.add(fogueira)
    })

    //cozinheiro
    const cozinheiro = new THREE.Object3D()
    loader.load('tonko.glb', function (glft) {
        cozinheiro.add(glft.scene)
        cozinheiro.scale.set(0.0012, 0.0012, 0.0012)
        cozinheiro.rotation.y = -1
        cozinheiro.position.set(9, 0, -3)
        cozinheiro.traverse(function (object) {
            if (object.isMesh) object.castShadow = true;
        });

        mixerCozinheiro = new THREE.AnimationMixer(cozinheiro);
        glft.animations.forEach((clip) => {
            mixerCozinheiro.clipAction(clip).play();
            mixerCozinheiro.clipAction(clip).clampWhenFinished = true;
        });
        scene.add(cozinheiro)
    })

    //galinha
    galinha = new THREE.Object3D()
    loader.load('chicken_walkcycle.glb', function (glft) {
        galinha.add(glft.scene)
        galinha.scale.set(0.0004, 0.0004, 0.0004)
        galinha.rotation.y = 1.5
        galinha.position.set(-9, 0, -8)
        galinha.traverse(function (object) {
            if (object.isMesh) object.castShadow = true;
        });

        mixergalinha = new THREE.AnimationMixer(galinha);
        glft.animations.forEach((clip) => {
            mixergalinha.clipAction(clip).play();
            mixergalinha.clipAction(clip).clampWhenFinished = true;
        });
        scene.add(galinha)
    })

    //poste
    const poste = new THREE.Object3D()
    loader.load('poste.glb', function (glft) {
        poste.add(glft.scene)
        poste.scale.set(0.3, 0.3, 0.3)
        poste.position.set(9.5, 0, -14)
        scene.add(poste)
    })

    //lenha
    const lenha = new THREE.Object3D()
    loader.load('firewood02.glb', function (glft) {
        lenha.add(glft.scene)
        lenha.scale.set(3, 3, 3)
        lenha.position.set(0, 0, -14.2)
        lenha.rotation.y = 1.5
        lenha.traverse(function (object) {
            if (object.isMesh) object.castShadow = true;
        });
        scene.add(lenha)
    })

    //placa
    const placa = new THREE.Object3D()
    loader.load('notice_board_low-poly.glb', function (glft) {
        placa.add(glft.scene)
        placa.scale.set(0.6, 0.6, 0.6)
        placa.position.set(9, 0.7, 4)
        placa.rotation.y = -4
        scene.add(placa)
    })

    //poco
    const poco = new THREE.Object3D()
    loader.load('well.glb', function (glft) {
        poco.add(glft.scene)
        poco.scale.set(1, 1, 1)
        poco.position.set(-2, 0, -5)
        //poco.rotation.y = -4
        scene.add(poco)
    })

    //casa
    const casa = new THREE.Object3D()
    loader.load('druids_house_and_shop.glb', function (glft) {
        casa.add(glft.scene)
        casa.scale.set(2.8, 2.8, 2.8)
        casa.position.set(-7.5, 0, 1.4)
        casa.rotation.y = 1.6
        casa.traverse(function (object) {
            if (object.isMesh) object.castShadow = true;
        });
        scene.add(casa)
    })

    //sol
    const sol = new THREE.Object3D()
    loader.load('sun.glb', function (glft) {
        sol.add(glft.scene)
        sol.scale.set(0.05, 0.05, 0.05)
        sol.position.set(50, 30, -50)
        sol.rotation.y = 1.6
        scene.add(sol)
    })

    //lua
    const lua = new THREE.Object3D()
    loader.load('the_moon.glb', function (glft) {
        lua.add(glft.scene)
        lua.scale.set(0.7, 0.7, 0.7)
        lua.position.set(50, 30, -100)
        lua.rotation.y = 1.6
    })

    //pedras
    const pedras = new THREE.Object3D()
    for(let i = 0; i < 30; i++){
        loader.load('stone_cube.glb', function (glft) {
            pedras.add(glft.scene)
            rock = pedras.clone()
            rock.scale.set(
                Math.random() * 0.1 - 0.15,
                Math.random() * 0.1 - 0.001,
                Math.random() * 0.1 - 0.15
            )
            rock.position.set(
                Math.random() * 20 - 10,
                0,
                Math.random() * 20 - 15
            );
            scene.add(rock)  
        })
    }

    //nuvens
    const nuvens = new THREE.Object3D()
    for(let i = 0; i < 30; i++){
        loader.load('clouds.glb', function (glft) {
            nuvens.add(glft.scene)
            var clouund = nuvens.clone()
            clouund.scale.x = 0.01
            clouund.scale.z = 0.01
            clouund.scale.y = Math.random() * 0.01 - 0.001,
            clouund.position.set(
                Math.random() * 100 - 55,
                15,
                Math.random() * 100 - 55
            );
            
            clouund.traverse(function (child) {
                if (child.isMesh) {
                    child.material.transparent = true;
                    child.material.opacity = 0.01;
                }
            });
            scene.add(clouund)
        })
    }

    //luzes
    var luzAmbientedia = new THREE.AmbientLight(0xffffff, 0.7)
    const dirLight = new THREE.DirectionalLight(0xfcffd6, 1)
    dirLight.position.set(50, 30, -50);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = - 50;
    dirLight.shadow.camera.left = - 50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    scene.add(dirLight);
    scene.add(luzAmbientedia)
    // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))

    var LuzAmbienteNoite = new THREE.AmbientLight(0x929292, 1)
    const dirLight2 = new THREE.DirectionalLight(0xaff3ff, 1)
    dirLight2.position.set(50, 30, -100);
    dirLight2.castShadow = true;
    dirLight2.shadow.camera.top = 50;
    dirLight2.shadow.camera.bottom = - 50;
    dirLight2.shadow.camera.left = - 50;
    dirLight2.shadow.camera.right = 50;
    dirLight2.shadow.camera.near = 0.1;
    dirLight2.shadow.camera.far = 200;
    dirLight2.shadow.mapSize.width = 4096;
    dirLight2.shadow.mapSize.height = 4096;  

    //pontos de luzes
    const flash = new THREE.PointLight(0xfcfc72, 30, 10, 2);
    flash.position.set(9.5, 2, -14);

    const flash2 = new THREE.PointLight(0xff1e00, 2, 4, 4);
    flash2.position.set(9, 0, -5);

    const flash3 = new THREE.PointLight(0xffffff, 10, 40, 0);
    flash3.position.set(50, 30, -80);

    const flash5 = new THREE.PointLight(0xfcfc72, 30, 10, 2);
    flash5.position.set(-8, 0, -13);

    var modoSuave = false
    var mudardisplay = document.querySelector('.display')
    mudardisplay.addEventListener('click',()=>{
        dirLight.castShadow = false
        dirLight2.castShadow = false
        scene.remove(flash5)
        scene.remove(flash3)
        scene.remove(flash2)
        scene.remove(flash)
        scene.remove(passaro)
        scene.remove( instancedMesh );
        scene.remove(dirLight);
        modoSuave = true
    })

    //nuvens e estrelas
    let positions = []
    let sizes = []

    rainGeo = new THREE.BufferGeometry();
    for (let i = 0; i < 
        rainCount; i++) {
        rainDrop = new THREE.Vector3(
            Math.random() * 400 - 200,
            Math.random() * 500 - 250,
            Math.random() * 400 - 200
        );
        positions.push(Math.random() * 400 - 200)
        positions.push(Math.random() * 500 - 250)
        positions.push(Math.random() * 400 - 200)
        sizes.push(30)
    }

    rainGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(positions), 4)
    );
    rainGeo.setAttribute(
        "size",
        new THREE.BufferAttribute(new Float32Array(sizes), 1)
    );
    let rainMaterial = new THREE.PointsMaterial({
        color: 0xdbfcfd,
        size: 0.2,
        transparent: true
    });
    rain = new THREE.Points(rainGeo, rainMaterial);

    const screen = document.getElementById('screen');

    //função para mudar noite/dia
    btnMudarClimaNoite.addEventListener('click', function() {  
        screen.addEventListener('animationend', function() {
            this.style.display = 'none';
        });
        
        scene.fog = new THREE.FogExp2(0x11111f, 0.002);
        renderer.setClearColor(scene.fog.color);
        
        scene.remove(dirLight)
        scene.remove(luzAmbientedia)
        scene.remove(passaro)
        scene.remove(sol)
        scene.add(lua)

        if(modoSuave === true){
            scene.remove(dirLight2)
            scene.remove(flash5)
            scene.remove(flash3)
            scene.remove(flash2)
            scene.remove(flash)
        }else{
            scene.add(dirLight2)
            scene.add(flash)
            scene.add(flash2)
            scene.add(flash3)
            scene.add(flash5)
        }
        scene.add(LuzAmbienteNoite)
        scene.add(rain);
        
        screen.style.display = 'block';
        btnMudarClimaNoite.style.display = 'none'
        btnMudarClimaDia.style.display = 'block'
       
    });

    btnMudarClimaDia.addEventListener('click', function() {  
        scene.fog = new THREE.FogExp2(0x83bdff, 0.002);
        renderer.setClearColor(scene.fog.color);
        
        if(modoSuave === true){
            scene.remove(dirLight)
            scene.remove(passaro)
        }else{
            scene.add(dirLight)
            scene.add(passaro)
        }
        scene.add(luzAmbientedia)
        scene.add(sol)
        scene.remove(flash5)
        scene.remove(flash3)
        scene.remove(flash2)
        scene.remove(flash)
        scene.remove(lua)
        scene.remove(dirLight2);
        scene.remove(LuzAmbienteNoite)
        scene.remove(rain);
        screen.style.display = 'block';
        btnMudarClimaNoite.style.display = 'block'
        btnMudarClimaDia.style.display = 'none'

        screen.addEventListener('animationend', function() {
            this.style.display = 'none';
        });
    });

    //gramas do cenario

    //movimentação da gramas
    const vertexShader = `
    varying vec2 vUv;
    uniform float time;
    
        void main() {
        vUv = uv;
        
        vec4 mvPosition = vec4( position, 1.0 );
        #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
        #endif
        
        float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
        
        float displacement = sin( mvPosition.z + time * 3.0 ) * ( 0.02 * dispPower );
        mvPosition.z += displacement;

        vec4 modelViewPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * modelViewPosition;

        }
    `;
    
    //cor das gramas
    const fragmentShader = `
    varying vec2 vUv;
    
    void main() {
        vec3 baseColor = vec3( 0.61, 1.0, 0.6 );
        float clarity = ( vUv.y * 0.35 ) + 0.00001;
        gl_FragColor = vec4( baseColor * clarity, 1 );
    }
    `;

    const uniforms = {
        time: {
            value: 0
        }
    }

    leavesMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        side: THREE.DoubleSide
    });

    //quantidade de gramas
    const instanceNumber = 160000;
    const instanceNumber2 = 60000;
    const instanceNumber3 = 10000;
    const dummy = new THREE.Object3D();

    const geometry = new THREE.PlaneGeometry( 0.01, 0.2, 1);
    geometry.translate( 0, 0.01, 0 );
    const instancedMesh = new THREE.InstancedMesh( geometry, leavesMaterial, instanceNumber );
    scene.add( instancedMesh );

    //colocando elas em lugares aleatorios
    for ( let i=0 ; i<instanceNumber ; i++ ) {

        dummy.position.set(
            //posição X
            ( Math.random() - 0.48 ) * 13.5,
            //posição y
            0,
            //posição z
            ( Math.random() - 0.58 ) * 11.2
        );
        
        //scala(tamanho)
        dummy.scale.setScalar( 0.8 + Math.random() * 0.8 );
        
        dummy.rotation.y = Math.random() * Math.PI;
        
        dummy.updateMatrix();
        instancedMesh.setMatrixAt( i, dummy.matrix );
    }

    for ( let i=0 ; i<instanceNumber2 ; i++ ) {

        dummy.position.set(
            ( Math.random() - 0.56 ) * 11.5,
            0,
            ( Math.random() - 2.85 ) * 5.23
        );
        
        dummy.scale.setScalar( 0.8 + Math.random() * 0.8 );
        
        dummy.rotation.y = Math.random() * Math.PI;
        
        dummy.updateMatrix();
        instancedMesh.setMatrixAt( i, dummy.matrix );

    }

    for ( let i=0 ; i<instanceNumber3 ; i++ ) {

        dummy.position.set(
            ( Math.random() - -4.6 ) * 1.8,
            0,
            ( Math.random() - 2.8 ) * 5.2
        );
        
        dummy.scale.setScalar( 0.8 + Math.random() * 0.8 );
        
        dummy.rotation.y = Math.random() * Math.PI;
        
        dummy.updateMatrix();
        instancedMesh.setMatrixAt( i, dummy.matrix );

    }

    //eventos de tecla para controlar personagem
    keysPressed = { }
    document.addEventListener('keydown', (event) =>{
        if(event.shiftKey && characterControls){
            characterControls.switchRunToggle()
        }else{
            (keysPressed)[event.key.toLowerCase()] = true
        }
    }, false)

    document.addEventListener('keyup', (event) =>{
        (keysPressed)[event.key.toLowerCase()] = false
    }, false)

    //reponsividade
    window.addEventListener('resize', function(){ 
        camera.aspect = this.window.innerWidth / this.window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(this.window.innerWidth, this.window.innerHeight)
        labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight)
    })

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
    
    animate();
}

const clock = new THREE.Clock()

function animate() {
    let mixerupdateDelta = clock.getDelta()
        if(characterControls){
            characterControls.update(mixerupdateDelta, keysPressed)
        }
        if (mixer) mixer.update(mixerupdateDelta);
        if (mixer3) mixer3.update(mixerupdateDelta);
        if (mixerCozinheiro) mixerCozinheiro.update(mixerupdateDelta);
        if (mixergalinha) mixergalinha.update(mixerupdateDelta);
        if (mixerPassaro) mixerPassaro.update(mixerupdateDelta);
        if (mixerVaca) mixerVaca.update(mixerupdateDelta);
        orbitControls.update();

    clouds.forEach(function(cloud) {
        cloud.rotation.z += 0.002;
    });

    if(andando == true){
        galinha.position.x += 0.005;
        if(galinha.position.x >= 9){
            andando = false
            galinha.rotation.y = -1.5
        }
    }else{
        galinha.position.x -= 0.005;
        if(galinha.position.x <= -9){
            andando = true
            galinha.rotation.y = 1.5
        }
    }

    if(andandoPassaro == true){
        passaro.position.x += 0.03;
        if(passaro.position.x >= 100){
            andandoPassaro = false
            passaro.rotation.y = 1.5
        }
    }else{
        passaro.position.x -= 0.03;
        if(passaro.position.x <= -100){
            andandoPassaro = true
            passaro.rotation.y = -1.5
        }
    }
    
    leavesMaterial.uniforms.time.value = clock.getElapsedTime();
    leavesMaterial.uniformsNeedUpdate = true;
    labelRenderer.render(scene, camera)

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
init();

