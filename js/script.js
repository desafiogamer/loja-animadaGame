import * as THREE from 'three';
import {GLTFLoader} from '../jsm/GLTFLoader.js';
import { CharacterControls } from './charaterControls.js';
import {OrbitControls} from '../jsm/OrbitControls.js';
import {CSS2DRenderer, CSS2DObject} from '../jsm/CSS2DRenderer.js'

//variaveis globais
let scene,
  camera,
  renderer,
  model,
  characterControls,
  orbitControls,
  keysPressed,
  labelRenderer,
  mixer,
  mixerseta,
  mixerseta1,
  mixerseta2, 
  mixer3,
  mixerCozinheiro,
  mixergalinha,
  mixerPassaro,
  mixerVaca,
  rainGeo,
  rain,
  rainDrop,
  cloudGeo,
  rainCount = 3000,
  clouds = [],
  leavesMaterial,
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
  mudardisplayBaixo,
  mudardisplayAlto,
  aviao,
  decolando = false,
  somAviao

function init() {
  //criando a cena
  scene = new THREE.Scene();

  //criando a camera
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  //posição da camera
  camera.position.z = 1;
  camera.rotation.x = 1.16;
  camera.rotation.z = 0.27;

  //renderizador WebGl
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  
  //cor do background da cena
  scene.fog = new THREE.FogExp2(0x87ceeb, 0.002);
  renderer.setClearColor(scene.fog.color);
  
  //definindo o tamanho do renderizador
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  //ativando sombra
  renderer.shadowMap.enabled = true;
  
  //adicionando o renderizador no body
  document.body.appendChild(renderer.domElement);

  //uma ferramenta do three para usar tags HTML na sua cena 3D
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  labelRenderer.domElement.style.pointerEvents = "none";
  document.body.appendChild(labelRenderer.domElement);

  //cercas
  //textura da cerca
  const textureLoader = new THREE.TextureLoader();
  const placeholderParedefrontal = textureLoader.load("./textures/cerca.png");
  placeholderParedefrontal.wrapS = THREE.RepeatWrapping;
  placeholderParedefrontal.wrapT = THREE.RepeatWrapping;
  placeholderParedefrontal.repeat.set(5, 1);
  const materialParedefrontal = new THREE.MeshPhongMaterial({
    map: placeholderParedefrontal,
    transparent: true,
    side: THREE.DoubleSide,
  });

  //gerando as cercas e suas posiçoẽs LARGURA, ESPESSURA, X, Y, Z
  cerca(20, 1, 0, 0.5, -14.9, 0);
  cerca2(20, 1, 10, 0.5, -5, -Math.PI / 2);
  cerca3(20, 1, -10, 0.5, -5, +Math.PI / 2);
  cerca4(20, 1, 0, 0.5, 4.91, Math.PI);

  function cerca(largura, espessura, x, y, z, rotacao) {
    const geometryParedefrontal = new THREE.PlaneGeometry(largura, espessura);
    floorParedefrontal = new THREE.Mesh(
      geometryParedefrontal,
      materialParedefrontal
    );
    floorParedefrontal.position.set(x, y, z);
    floorParedefrontal.rotation.y = rotacao;
    scene.add(floorParedefrontal);
  }

  function cerca2(largura, espessura, x, y, z, rotacao) {
    const geometryParedefrontal = new THREE.PlaneGeometry(largura, espessura);
    floorParedefrontal1 = new THREE.Mesh(
      geometryParedefrontal,
      materialParedefrontal
    );
    floorParedefrontal1.position.set(x, y, z);
    floorParedefrontal1.rotation.y = rotacao;
    scene.add(floorParedefrontal1);
  }

  function cerca3(largura, espessura, x, y, z, rotacao) {
    const geometryParedefrontal = new THREE.PlaneGeometry(largura, espessura);
    floorParedefrontal2 = new THREE.Mesh(
      geometryParedefrontal,
      materialParedefrontal
    );
    floorParedefrontal2.position.set(x, y, z);
    floorParedefrontal2.rotation.y = rotacao;
    scene.add(floorParedefrontal2);
  }

  function cerca4(largura, espessura, x, y, z, rotacao) {
    const geometryParedefrontal = new THREE.PlaneGeometry(largura, espessura);
    floorParedefrontal3 = new THREE.Mesh(
      geometryParedefrontal,
      materialParedefrontal
    );
    floorParedefrontal3.position.set(x, y, z);
    floorParedefrontal3.rotation.y = rotacao;
    scene.add(floorParedefrontal3);
  }

  //gerando as estradas e suas posiçoẽs LARGURA, ESPESSURA, X, Y, Z
  generateFloor();
  generateEstrada(5, 18, -8, 0.001, -6, 0);
  generateEstrada(5, 16.6, 1.7, 0.002, -8, 1.6);
  generateEstrada(5, 11.5, 8.5, 0.004, -0.9, 0);
  generateEstrada(5, 5.5, 6.7, 0.004, -12.2, 0);

  //chao base
  function generateFloor() {
    const textureLoader = new THREE.TextureLoader();
    const placeholder = textureLoader.load("./textures/MuchaTseBle.jpg");
    const geometry = new THREE.PlaneGeometry(30, 30);
    const material = new THREE.MeshPhongMaterial({ map: placeholder });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -5);
    scene.add(floor);
  }

  //estradas
  function generateEstrada(largura, espessura, x, y, z, rotacao) {
    const textureLoader = new THREE.TextureLoader();
    const placeholder = textureLoader.load("./textures/estrada.png");
    const geometry = new THREE.PlaneGeometry(largura, espessura);
    const material = new THREE.MeshPhongMaterial({
      map: placeholder,
      transparent: true,
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.castShadow = true;
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    floor.rotation.z = rotacao;
    floor.position.set(x, y, z);
    scene.add(floor);
  }

  //controles
  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.minDistance = 4;
  orbitControls.maxDistance = 4;
  orbitControls.enablePan = false;
  orbitControls.maxPolarAngle = Math.PI / 2 - -0.1;
  orbitControls.minPolarAngle = Math.PI / 2 - 1;
  orbitControls.enableZoom = false;
  orbitControls.update();

  //SOM
  const listerner = new THREE.AudioListener();
  scene.add(listerner);

  //trila sonora
  const trilha = new THREE.Audio(listerner);
  const loaderSoundTrila = new THREE.AudioLoader();
  loaderSoundTrila.load("../sound/trilha.mp3", (buffer) => {
    trilha.setBuffer(buffer);
    trilha.setLoop(true);
    trilha.setVolume(0.5);
  });

  //trila sonora
  const trilhaPassaros = new THREE.Audio(listerner);
  const loaderSoundpassaro = new THREE.AudioLoader();
  loaderSoundpassaro.load("../sound/passaro.mp3", (buffer) => {
    trilhaPassaros.setBuffer(buffer);
    trilhaPassaros.setLoop(true);
    trilhaPassaros.setVolume(0.2);
    trilhaPassaros.play();
  });

  //trila avião
  somAviao = new THREE.PositionalAudio(listerner);
  const loaderSoundAviao = new THREE.AudioLoader();
  loaderSoundAviao.load("../sound/aviao.mp3", (buffer) => {
    somAviao.setBuffer(buffer);
    somAviao.setLoop(false);
    somAviao.setVolume(0.3);
    somAviao.setRefDistance(1);
  });

  //sound click
  const click = new THREE.PositionalAudio(listerner);
  const loaderSoundclick = new THREE.AudioLoader();
  loaderSoundclick.load("../sound/click.mp3", (buffer) => {
    click.setBuffer(buffer);
    click.setLoop(false);
    click.setVolume(0.5);
  });

  //sound click2
  const click2 = new THREE.PositionalAudio(listerner);
  const loaderSoundclick2 = new THREE.AudioLoader();
  loaderSoundclick2.load("../sound/click_dYtiT6GS.mp3", (buffer) => {
    click2.setBuffer(buffer);
    click2.setLoop(false);
    click2.setVolume(0.5);
  });

  // ativar e desativar trilha
  const btnPararSom = document.getElementById("paraTrilha");
  const btnAtivarSom = document.getElementById("ativarTrilha");

  //função para desativar trilha sonora
  btnPararSom.addEventListener("click", () => {
    trilha.stop();
    btnPararSom.style.display = "none";
    btnAtivarSom.style.display = "block";
  });

  //função para ativar trilha sonora
  btnAtivarSom.addEventListener("click", () => {
    trilha.play();
    btnPararSom.style.display = "block";
    btnAtivarSom.style.display = "none";
  });

  //botao das config
  //ao clicar no botão das config ativa o som de click
  document.querySelector(".arrumarConfig").addEventListener("click", () => {
    click2.play();
  });

  //Criando botão para mudar o clima pra noite
  const btnMudarClimaNoite = document.createElement("button");
  btnMudarClimaNoite.textContent = "Noite";
  btnMudarClimaNoite.setAttribute("id", "noite");

  //Criando botão para mudar o clima pra dia
  const btnMudarClimaDia = document.createElement("button");
  btnMudarClimaDia.textContent = "Dia";
  btnMudarClimaDia.setAttribute("id", "dia");
  btnMudarClimaDia.style.display = "none";

  //a div aonde ficara o botão de mudar para dia e noite
  const divMudarClimaNoite = document.createElement("div");
  divMudarClimaNoite.setAttribute("id", "home");
  divMudarClimaNoite.appendChild(btnMudarClimaNoite);
  divMudarClimaNoite.appendChild(btnMudarClimaDia);

  //adicionando essa div na cena e colocando a posição dela
  const cPointLabel2 = new CSS2DObject(divMudarClimaNoite);
  scene.add(cPointLabel2);
  cPointLabel2.position.set(-7.5, 1.5, -2);

  //balão dialogo
  var divBalao = document.createElement("div");
  divBalao.setAttribute("class", "balao");
  var menssagem = document.createElement("p");
  menssagem.setAttribute("class", "mensagem");
  menssagem.textContent =
    "Bem vindo, fique a vontade para escolher seu lanche!";
  divBalao.appendChild(menssagem);

  const divNaCena = new CSS2DObject(divBalao);
  scene.add(divNaCena);
  divNaCena.position.set(9, 2, -3);

  //aqui seleciono as divs do html aond ficará os produtos
  var pratosProntos = document.querySelector(".pratosProntos");
  var pratosLegumes = document.querySelector(".contatar");
  var bebidas = document.querySelector(".bebidas");

  //fiz um botão para fechar cada uma dessas divs
  var btnfechar1 = document.querySelector("#fechar1");
  var btnfechar2 = document.querySelector("#fechar2");
  var btnfechar3 = document.querySelector("#fechar3");
  btnfechar1.addEventListener("click", () => {
    pratosProntos.classList.remove("ativo");
    btnfechar1.style.display = "none";
    click.play();
  });
  btnfechar2.addEventListener("click", () => {
    bebidas.classList.remove("ativo");
    btnfechar2.style.display = "none";
    click.play();
  });
  btnfechar3.addEventListener("click", () => {
    pratosLegumes.classList.remove("ativo");
    btnfechar3.style.display = "none";
    click.play();
  });

  //aqui faço o botão para ativar a animação do avião
  var btnAviao = document.createElement("button");
  btnAviao.setAttribute("class", "btnAvião");
  btnAviao.textContent = "Decolar";
  const BtnAviaoCena = new CSS2DObject(btnAviao);
  scene.add(BtnAviaoCena);
  BtnAviaoCena.position.set(15, 3.5, -18);

  function removerdacena() {
    scene.remove(aviao);
  }

  //depois do click ativara o som do avião e a animação, depois de 10segundos o avião vai desaparecer da cena
  btnAviao.addEventListener("click", () => {
    decolando = true;
    somAviao.play();
    click2.play();
    document.querySelector(".btnAvião").classList.add("ativo");
    setTimeout(removerdacena, 10000);
  });

  //aqui estou criando aqueles circulos no chão para entrar nas sessões dos produtos
  const geometryPortal1 = new THREE.CircleGeometry(0.4, 32);
  const materialportal1 = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    transparent: true,
  });
  const portal1 = new THREE.Mesh(geometryPortal1, materialportal1);
  const portal2 = new THREE.Mesh(geometryPortal1, materialportal1);
  const portal3 = new THREE.Mesh(geometryPortal1, materialportal1);
  portal1.rotation.x = -Math.PI / 2;
  portal1.position.set(8, 0.01, -4.5);
  portal2.rotation.x = -Math.PI / 2;
  portal2.position.set(7, 0.01, -12);
  portal3.rotation.x = -Math.PI / 2;
  portal3.position.set(-7.5, 0.01, -13);
  scene.add(portal1);
  scene.add(portal2);
  scene.add(portal3);

  //botões dos portais
  const BtnEntra1 = document.createElement("button");
  BtnEntra1.textContent = "Entrar";
  BtnEntra1.setAttribute("class", "btnEntrar1");
  const BtnEntraCena1 = new CSS2DObject(BtnEntra1);
  scene.add(BtnEntraCena1);
  BtnEntraCena1.position.set(8, 1.5, -4.5);

  const BtnEntra2 = document.createElement("button");
  BtnEntra2.textContent = "Entrar";
  BtnEntra2.setAttribute("class", "btnEntrar2");
  const BtnEntraCena2 = new CSS2DObject(BtnEntra2);
  scene.add(BtnEntraCena2);
  BtnEntraCena2.position.set(7, 1.5, -12);

  const BtnEntra3 = document.createElement("button");
  BtnEntra3.textContent = "Entrar";
  BtnEntra3.setAttribute("class", "btnEntrar3");
  const BtnEntraCena3 = new CSS2DObject(BtnEntra3);
  scene.add(BtnEntraCena3);
  BtnEntraCena3.position.set(-7.5, 1.5, -13);

  //eventos de click dos botões
  BtnEntra1.addEventListener("click", () => {
    pratosProntos.classList.add("ativo");
    btnfechar1.style.display = "block";
    click.play();
  });

  BtnEntra2.addEventListener("click", () => {
    bebidas.classList.add("ativo");
    btnfechar2.style.display = "block";
    click.play();
  });

  BtnEntra3.addEventListener("click", () => {
    pratosLegumes.classList.add("ativo");
    btnfechar3.style.display = "block";
    click.play();
  });

  //MODELOS 3D DA CENA

  //local dos modelos 3D
  const loader = new GLTFLoader().setPath("./models/");

  //aqui estou pegando a posição atual do modelo
  var characterPreviousPosition = new THREE.Vector3();

  //carregando o modelo
  loader.load("personagem.glb", function (glft) {
    model = glft.scene;

    //definindo o tamanho do personagem
    model.scale.set(0.25, 0.25, 0.25);

    //sombra do personagem
    model.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });
    scene.add(model);

    //animações do personagem
    const gltfAnimations = glft.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap = new Map();
    gltfAnimations
      .filter((a) => a.name != "Tpose")
      .forEach((a) => {
        animationsMap.set(a.name, mixer.clipAction(a));
      });

    //controles do personagem
    characterControls = new CharacterControls(
      model,
      mixer,
      animationsMap,
      orbitControls,
      camera,
      "Idle"
    );

    //colisão
    function checkCollisions() {
      let collided = false;
      const characterBoundingBox = new THREE.Box3().setFromObject(
        characterControls.model
      );

      //objetos que colidem
      const objectsBoundingBoxes = [
        new THREE.Box3().setFromObject(fogueira),
        new THREE.Box3().setFromObject(cozinheiro),
        new THREE.Box3().setFromObject(placa),
        new THREE.Box3().setFromObject(trator),
        new THREE.Box3().setFromObject(mailBox),
        new THREE.Box3().setFromObject(poco),
        new THREE.Box3().setFromObject(lenha),
        new THREE.Box3().setFromObject(poste),
        new THREE.Box3().setFromObject(casa),
        new THREE.Box3().setFromObject(shop),
        new THREE.Box3().setFromObject(floorParedefrontal),
        new THREE.Box3().setFromObject(floorParedefrontal1),
        new THREE.Box3().setFromObject(floorParedefrontal2),
        new THREE.Box3().setFromObject(floorParedefrontal3),
      ];
      var colisionCozinheiro = new THREE.Box3().setFromObject(cozinheiro);
      var colisionPortal1 = new THREE.Box3().setFromObject(portal1);
      var colisionPortal2 = new THREE.Box3().setFromObject(portal2);
      var colisionPortal3 = new THREE.Box3().setFromObject(portal3);

      //ao modelo no personagem entrar na area de qualquer desse modelo ativara a colisão e o personagem voltara pra ultima posição antes de colidir
      objectsBoundingBoxes.forEach((objectBoundingBox) => {
        if (characterBoundingBox.intersectsBox(objectBoundingBox)) {
          collided = true;
        }

        if (characterBoundingBox.intersectsBox(colisionCozinheiro)) {
          divBalao.style.display = "block";
        }

        if (characterBoundingBox.intersectsBox(colisionPortal1)) {
          document.querySelector(".btnEntrar1").classList.add("ativo");
        } else {
          document.querySelector(".btnEntrar1").classList.remove("ativo");
        }

        if (characterBoundingBox.intersectsBox(colisionPortal3)) {
          document.querySelector(".btnEntrar3").classList.add("ativo");
        } else {
          document.querySelector(".btnEntrar3").classList.remove("ativo");
        }

        if (characterBoundingBox.intersectsBox(colisionPortal2)) {
          document.querySelector(".btnEntrar2").classList.add("ativo");
        } else {
          document.querySelector(".btnEntrar2").classList.remove("ativo");
        }
      });

      if (collided) {
        characterControls.model.position.copy(characterPreviousPosition);
      } else {
        characterPreviousPosition.copy(characterControls.model.position);
      }
      requestAnimationFrame(checkCollisions);
    }

    checkCollisions();
  });

  //adicionando alguns modelos na cena
  
  //passaro
  passaro = new THREE.Object3D();
  loader.load("birds.glb", function (glft) {
    passaro.add(glft.scene);
    passaro.scale.set(1, 1, 1);
    passaro.rotation.y = -1.5;
    passaro.position.set(-20, 12, -30);

    mixerPassaro = new THREE.AnimationMixer(passaro);

    glft.animations.forEach((clip) => {
      mixerPassaro.clipAction(clip).play();
      mixerPassaro.clipAction(clip).clampWhenFinished = true;
    });
    scene.add(passaro);
  });

  //shop
  const shop = new THREE.Object3D();
  loader.load("juice_shop.glb", function (glft) {
    shop.add(glft.scene);
    shop.scale.set(30, 30, 30);
    shop.rotation.y = -1.5;
    shop.position.set(7, 1, -14);
    shop.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });
    scene.add(shop);
  });

  //mailBox
  const mailBox = new THREE.Object3D();
  loader.load("correio.glb", function (glft) {
    mailBox.add(glft.scene);
    mailBox.scale.set(1.3, 1.3, 1.3);
    mailBox.rotation.y = 0;
    mailBox.position.set(-7.5, 0, -14);
    scene.add(mailBox);
  });

  //arvore
  const arvore = new THREE.Object3D();
  loader.load("free_tree_1.glb", function (glft) {
    arvore.add(glft.scene);
    arvore.scale.set(0.01, 0.01, 0.01);
    arvore.rotation.y = 0;
    arvore.position.set(-9, 0, -14);
    scene.add(arvore);
  });

  //arvore2
  const arvore2 = new THREE.Object3D();
  loader.load("free_tree_1.glb", function (glft) {
    arvore2.add(glft.scene);
    arvore2.scale.set(0.01, 0.01, 0.01);
    arvore2.rotation.y = 0;
    arvore2.position.set(2, 0, -5);
    scene.add(arvore2);
  });

  //aviao
  aviao = new THREE.Object3D();
  loader.load("low_poly_plane.glb", function (glft) {
    aviao.add(glft.scene);
    aviao.scale.set(1, 1, 1);
    aviao.rotation.y = -1.5;
    aviao.position.set(15, 1.5, -18);
    scene.add(aviao);
  });

  //vaca
  const vaca = new THREE.Object3D();
  loader.load("cow.glb", function (glft) {
    vaca.add(glft.scene);
    vaca.scale.set(0.25, 0.25, 0.25);
    vaca.rotation.y = 1;
    vaca.position.set(-3, 0, -14);
    scene.add(vaca);

    mixerVaca = new THREE.AnimationMixer(vaca);
    glft.animations.forEach((clip) => {
      mixerVaca.clipAction(clip).play();
      mixerVaca.clipAction(clip).clampWhenFinished = true;
    });
  });

  //fogueira
  const fogueira = new THREE.Object3D();
  loader.load("barbecue_grill.glb", function (glft) {
    fogueira.add(glft.scene);
    fogueira.scale.set(2, 2, 2);
    fogueira.rotation.y = 3;
    fogueira.position.set(9, 0, -4.5);
    fogueira.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });
    scene.add(fogueira);
  });

  //cozinheiro
  const cozinheiro = new THREE.Object3D();
  loader.load("tonko.glb", function (glft) {
    cozinheiro.add(glft.scene);
    cozinheiro.scale.set(0.0012, 0.0012, 0.0012);
    cozinheiro.rotation.y = -1;
    cozinheiro.position.set(9, 0, -3);
    cozinheiro.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });

    mixerCozinheiro = new THREE.AnimationMixer(cozinheiro);
    glft.animations.forEach((clip) => {
      mixerCozinheiro.clipAction(clip).play();
      mixerCozinheiro.clipAction(clip).clampWhenFinished = true;
    });
    scene.add(cozinheiro);
  });

  //galinha
  galinha = new THREE.Object3D();
  loader.load("chicken_walkcycle.glb", function (glft) {
    galinha.add(glft.scene);
    galinha.scale.set(0.0004, 0.0004, 0.0004);
    galinha.rotation.y = 1.5;
    galinha.position.set(-9, 0, -8);
    galinha.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });

    mixergalinha = new THREE.AnimationMixer(galinha);
    glft.animations.forEach((clip) => {
      mixergalinha.clipAction(clip).play();
      mixergalinha.clipAction(clip).clampWhenFinished = true;
    });
    scene.add(galinha);
  });

  //poste
  const poste = new THREE.Object3D();
  loader.load("poste.glb", function (glft) {
    poste.add(glft.scene);
    poste.scale.set(0.3, 0.3, 0.3);
    poste.position.set(9.5, 0, -14);
    scene.add(poste);
  });

  //lenha
  const lenha = new THREE.Object3D();
  loader.load("firewood02.glb", function (glft) {
    lenha.add(glft.scene);
    lenha.scale.set(3, 3, 3);
    lenha.position.set(0, 0, -14.2);
    lenha.rotation.y = 1.5;
    scene.add(lenha);
  });

  //banco
  const placa = new THREE.Object3D();
  loader.load("banco_de_madeira.glb", function (glft) {
    placa.add(glft.scene);
    placa.scale.set(0.25, 0.25, 0.25);
    placa.position.set(9.5, 0, -8);
    placa.rotation.y = Math.PI;
    scene.add(placa);
  });

  //trator
  const trator = new THREE.Object3D();
  loader.load("low-poly_tractor.glb", function (glft) {
    trator.add(glft.scene);
    trator.scale.set(1, 1, 1);
    trator.position.set(8, 0, 3.5);
    trator.rotation.y = -1.5;
    scene.add(trator);
  });

  //poco
  const poco = new THREE.Object3D();
  loader.load("well.glb", function (glft) {
    poco.add(glft.scene);
    poco.scale.set(1, 1, 1);
    poco.position.set(-2, 0, -5);
    scene.add(poco);
  });

  //casa
  const casa = new THREE.Object3D();
  loader.load("druids_house_and_shop.glb", function (glft) {
    casa.add(glft.scene);
    casa.scale.set(2.8, 2.8, 2.8);
    casa.position.set(-7.5, 0, 1.4);
    casa.rotation.y = 1.6;
    scene.add(casa);
  });

  //park
  const park = new THREE.Object3D();
  loader.load("playground.glb", function (glft) {
    park.add(glft.scene);
    park.scale.set(0.3, 0.3, 0.3);
    park.position.set(-0, 0.7, 4.3);
    park.rotation.y = 3.1;
    scene.add(park);
  });

  //sol
  const sol = new THREE.Object3D();
  loader.load("sun.glb", function (glft) {
    sol.add(glft.scene);
    sol.scale.set(0.05, 0.05, 0.05);
    sol.position.set(50, 30, -50);
    sol.rotation.y = 1.6;
    scene.add(sol);
  });

  //lua
  const lua = new THREE.Object3D();
  loader.load("lua.glb", function (glft) {
    lua.add(glft.scene);
    lua.scale.set(5, 5, 5);
    lua.position.set(50, 30, -100);
    lua.rotation.y = 1.6;
  });

  //seta
  const seta = new THREE.Object3D();
  loader.load("directional_arrow_1.glb", function (glft) {
    seta.add(glft.scene);
    seta.scale.set(0.03, 0.03, 0.03);
    seta.position.set(8, 0.5, -4.5);
    seta.rotation.y = 2;
    mixerseta = new THREE.AnimationMixer(seta);
    glft.animations.forEach((clip) => {
      mixerseta.clipAction(clip).play();
      mixerseta.clipAction(clip).clampWhenFinished = true;
    });
    scene.add(seta);
  });

  //seta1
  const seta1 = new THREE.Object3D();
  loader.load("directional_arrow_1.glb", function (glft) {
    seta1.add(glft.scene);
    seta1.scale.set(0.03, 0.03, 0.03);
    seta1.position.set(7, 0.5, -12);
    seta1.rotation.y = 2.5;
    mixerseta1 = new THREE.AnimationMixer(seta1);
    glft.animations.forEach((clip) => {
      mixerseta1.clipAction(clip).play();
      mixerseta1.clipAction(clip).clampWhenFinished = true;
    });
    scene.add(seta1);
  });

  //seta2
  const seta2 = new THREE.Object3D();
  loader.load("directional_arrow_1.glb", function (glft) {
    seta2.add(glft.scene);
    seta2.scale.set(0.03, 0.03, 0.03);
    seta2.position.set(-7.5, 0.5, -13);
    seta2.rotation.y = 3.5;
    mixerseta2 = new THREE.AnimationMixer(seta2);
    glft.animations.forEach((clip) => {
      mixerseta2.clipAction(clip).play();
      mixerseta2.clipAction(clip).clampWhenFinished = true;
    });
    scene.add(seta2);
  });

  //montando a ambientação do dia com luzes claras na cena
  var luzAmbientedia = new THREE.AmbientLight(0xffffff, 0.7);
  const dirLight = new THREE.DirectionalLight(0xfcffd6, 1);
  dirLight.position.set(50, 30, -50);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 50;
  dirLight.shadow.camera.bottom = -50;
  dirLight.shadow.camera.left = -50;
  dirLight.shadow.camera.right = 50;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 200;
  dirLight.shadow.mapSize.width = 4096;
  dirLight.shadow.mapSize.height = 4096;
  scene.add(dirLight);
  scene.add(luzAmbientedia);
  //isso ajuda a ver a posição que esta vindo a luz
  // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))

  //montando a ambientação da noite com luzes escuras na cena
  var LuzAmbienteNoite = new THREE.AmbientLight(0x929292, 1);
  const dirLight2 = new THREE.DirectionalLight(0xaff3ff, 1);
  dirLight2.position.set(50, 30, -100);
  dirLight2.castShadow = true;
  dirLight2.shadow.camera.top = 50;
  dirLight2.shadow.camera.bottom = -50;
  dirLight2.shadow.camera.left = -50;
  dirLight2.shadow.camera.right = 50;
  dirLight2.shadow.camera.near = 0.1;
  dirLight2.shadow.camera.far = 200;
  dirLight2.shadow.mapSize.width = 4096;
  dirLight2.shadow.mapSize.height = 4096;

  //pontos especificos de luzes
  const flash = new THREE.PointLight(0xfcfc72, 10, 10, 1);
  flash.position.set(9.5, 2, -13);

  const flash2 = new THREE.PointLight(0xff1e00, 1, 1, 4);
  flash2.position.set(9, 1, -4.5);

  const flash3 = new THREE.PointLight(0xffffff, 10, 40, 0);
  flash3.position.set(50, 30, -80);

  const flash4 = new THREE.PointLight(0x00ff00, 10, 1, 0);
  flash4.position.set(8, 0.01, -4.5);
  scene.add(flash4);

  const flash5 = new THREE.PointLight(0x00ff00, 10, 1, 0);
  flash5.position.set(7, 0.01, -12);
  scene.add(flash5);

  const flash6 = new THREE.PointLight(0x00ff00, 10, 1, 0);
  flash6.position.set(-7.5, 0.01, -13);
  scene.add(flash6);

  //tela preta para esconder carregamento da noite/dia
  const screen = document.getElementById("screen");

  //mudar para grafico suave
  //para reduzir os graficos eu tiro algumas gramas, passaros, pontos de luzes, sombras
  var modoSuave = false;
  mudardisplayBaixo = document.querySelector(".display");
  mudardisplayAlto = document.getElementById("adicionar");

  mudardisplayBaixo.addEventListener("click", () => {
    renderer.shadowMap.enabled = false;
    dirLight.castShadow = false;
    dirLight2.castShadow = false;
    scene.remove(flash3);
    scene.remove(flash2);
    scene.remove(flash);
    scene.remove(passaro);
    scene.remove(instancedMesh);
    scene.remove(dirLight);
    scene.remove(dirLight2);
    scene.remove(galinha);
    modoSuave = true;
    screen.style.display = "block";

    screen.addEventListener("animationend", function () {
      this.style.display = "none";
    });
  });

  //mudar para grafico alto
  mudardisplayAlto.addEventListener("click", () => {
    renderer.shadowMap.enabled = true;
    dirLight.castShadow = true;
    dirLight2.castShadow = true;
    scene.add(passaro);
    scene.add(instancedMesh);
    scene.add(dirLight);
    scene.add(galinha);
    modoSuave = false;
    screen.style.display = "block";

    screen.addEventListener("animationend", function () {
      this.style.display = "none";
    });
  });

  //estrelas da cena(noite)
  let positions = [];
  let sizes = [];

  //fazendo a geometria das estrelas
  //pegando a quantidade que tem e colocando elas em posições diferente na cena de acordo com a distancia maxima que definimos lá em cima na camera
  rainGeo = new THREE.BufferGeometry();
  for (let i = 0; i < rainCount; i++) {
    rainDrop = new THREE.Vector3(
      Math.random() * 400 - 200,
      Math.random() * 500 - 250,
      Math.random() * 400 - 200
    );
    positions.push(Math.random() * 400 - 200);
    positions.push(Math.random() * 500 - 250);
    positions.push(Math.random() * 400 - 200);
    sizes.push(30);
  }

  rainGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 4)
  );
  rainGeo.setAttribute(
    "size",
    new THREE.BufferAttribute(new Float32Array(sizes), 1)
  );

  //tamanho e cores das estrelas
  let rainMaterial = new THREE.PointsMaterial({
    color: 0xdbfcfd,
    size: 0.2,
    transparent: true,
  });
  rain = new THREE.Points(rainGeo, rainMaterial);

  //função para mudar noite, adiciono as luzes que fizemos mais acima e removo as luzes claras
  btnMudarClimaNoite.addEventListener("click", function () {
    screen.addEventListener("animationend", function () {
      this.style.display = "none";
    });

    scene.fog = new THREE.FogExp2(0x11111f, 0.002);
    renderer.setClearColor(scene.fog.color);

    scene.remove(dirLight);
    scene.remove(luzAmbientedia);
    scene.remove(passaro);
    scene.remove(sol);
    scene.add(lua);

    if (modoSuave === true) {
      scene.remove(dirLight2);
      scene.remove(flash3);
      scene.remove(flash2);
      scene.remove(flash);
    } else {
      scene.add(dirLight2);
      scene.add(flash);
      scene.add(flash2);
      scene.add(flash3);
    }
    scene.add(LuzAmbienteNoite);
    scene.add(rain);

    screen.style.display = "block";
    btnMudarClimaNoite.style.display = "none";
    btnMudarClimaDia.style.display = "block";
    trilhaPassaros.stop();
    click2.play();
  });

  //função para mudar dia, aqui adiciono as luzes claras e removo as escuras
  btnMudarClimaDia.addEventListener("click", function () {
    scene.fog = new THREE.FogExp2(0x83bdff, 0.002);
    renderer.setClearColor(scene.fog.color);

    if (modoSuave === true) {
      scene.remove(dirLight);
      scene.remove(passaro);
    } else {
      scene.add(dirLight);
      scene.add(passaro);
    }
    scene.add(luzAmbientedia);
    scene.add(sol);
    scene.remove(flash3);
    scene.remove(flash2);
    scene.remove(flash);
    scene.remove(lua);
    scene.remove(dirLight2);
    scene.remove(LuzAmbienteNoite);
    scene.remove(rain);
    screen.style.display = "block";
    btnMudarClimaNoite.style.display = "block";
    btnMudarClimaDia.style.display = "none";

    screen.addEventListener("animationend", function () {
      this.style.display = "none";
    });
    trilhaPassaros.play();
    click2.play();
  });

  document.querySelector(".btnFinal").addEventListener("click", () => {
    location.reload();
  });

  //gramas do cenario

  //aqui faço a animação de movimento das cameras
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
        
        float displacement = sin( mvPosition.z + time * 3.0 ) * ( 0.05 * dispPower );
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
      value: 0,
    },
  };

  leavesMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    side: THREE.DoubleSide,
  });

  //quantidade de gramas
  const instanceNumber = 160000;
  const instanceNumber2 = 60000;
  const instanceNumber3 = 10000;
  const dummy = new THREE.Object3D();

  //geometria das gramas
  const geometry = new THREE.PlaneGeometry(0.01, 0.2, 1);
  geometry.translate(0, 0.01, 0);
  const instancedMesh = new THREE.InstancedMesh(
    geometry,
    leavesMaterial,
    instanceNumber
  );
  scene.add(instancedMesh);

  //colocando elas em lugares aleatorios
  for (let i = 0; i < instanceNumber; i++) {
    dummy.position.set(
      //posição X
      (Math.random() - 0.48) * 13.5,
      //posição y
      0,
      //posição z
      (Math.random() - 0.58) * 11.2
    );

    //scala(tamanho)
    dummy.scale.setScalar(0.8 + Math.random() * 0.8);

    dummy.rotation.y = Math.random() * Math.PI;

    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }

  //colocando elas em lugares aleatorios
  for (let i = 0; i < instanceNumber2; i++) {
    dummy.position.set(
      (Math.random() - 0.56) * 11.5,
      0,
      (Math.random() - 2.85) * 5.23
    );

    dummy.scale.setScalar(0.8 + Math.random() * 0.8);

    dummy.rotation.y = Math.random() * Math.PI;

    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }

  //colocando elas em lugares aleatorios
  for (let i = 0; i < instanceNumber3; i++) {
    dummy.position.set(
      (Math.random() - -4.6) * 1.8,
      0,
      (Math.random() - 2.8) * 5.2
    );

    dummy.scale.setScalar(0.8 + Math.random() * 0.8);

    dummy.rotation.y = Math.random() * Math.PI;

    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }

  //eventos de tecla para controlar personagem
  keysPressed = {};
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle();
      } else {
        keysPressed[event.key.toLowerCase()] = true;
      }
    },
    false
  );

  document.addEventListener(
    "keyup",
    (event) => {
      keysPressed[event.key.toLowerCase()] = false;
    },
    false
  );

  //reponsividade
  window.addEventListener("resize", function () {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
    labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight);
  });

  if (window.innerWidth < 768) {
    alert("Coloque em tela cheia e vire a tela do seu celular!!");
  }

  animate();
}

//para animações funcionar
const clock = new THREE.Clock()


//aqui aonde as animações e a cena atualizam a todo instantes, mantendo a fluides 
function animate() {
    //para a atualizações de cada frame das animações
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
    if (mixerseta) mixerseta.update(mixerupdateDelta);
    if (mixerseta1) mixerseta1.update(mixerupdateDelta);
    if (mixerseta2) mixerseta2.update(mixerupdateDelta);

    //crontroles sempre atualizarem
    orbitControls.update();

    //galinha em movimento
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

    //passaro em movimento
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

    //avião decolando
    if(decolando == true){
        aviao.position.y += 0.01
        aviao.position.x -= 0.1
        if(aviao.position.x <= 8){
            aviao.position.y += 0.01
            aviao.position.x -= 0.3
        }
        if(aviao.position.x <= -200){
            decolando = false
        }
    }
    
    //gramas se movendo
    leavesMaterial.uniforms.time.value = clock.getElapsedTime();
    leavesMaterial.uniformsNeedUpdate = true;

    //cena atualizando
    labelRenderer.render(scene, camera)
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

init();

