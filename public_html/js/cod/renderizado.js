/**
* @fileoverview Se encarga del renderizado del juego
*
* @author Jose Wilson Capera Castaño
* @author Estefania Alzate Daza
* @version 1.0
*/

var render;
var escena;
var camara;
var camara2;

//Luz roja del jugador 1
var foco = new KPTF.PuntoDeLuz(0xff0000);

//Luz verde del jugador 2
var foco2 = new KPTF.PuntoDeLuz(0x00ff00);

//Luz ambiente predeterminada por el framework
var ambiente = new KPTF.LuzAmbiente();

//total de modelos cargados
var modelosCargados=0;

//Geometria del cubo
var cuboG;
//Material del cubo
var cuboM;
//Cubo del jugador 1
var cubo;
//Cubo del jugador 2
var cubo2;

//Distancias maximas de la camara respecto al jugador en los ejes X, Y, Z
var MAX_DISTANCIA_CAMARA_X=1;
var MAX_DISTANCIA_CAMARA_Y=4;
var MAX_DISTANCIA_CAMARA_Z=30;

//Distancia en los ejes X, Y
var distanciaCamaraX=0;
var distanciaCamaraY=4;

/*
 * Se encarga iniciar el renderizado del juego
 */
function iniciarRenderizado() {
    render = new KPTF.Renderizador();
    escena = new KPTF.Escena();
    camara = new KPTF.Camara();
    camara_mini = new KPTF.Camara();
    camara2 = new KPTF.Camara();
    
    camara.cambiarAspecto((window.innerWidth / 2) / window.innerHeight);
    camara2.cambiarAspecto((window.innerWidth / 2) / window.innerHeight);
    camara_mini.cambiarAspecto((window.innerWidth*3 / 2) / window.innerHeight);

    KPTF.Renderizador.lienzo("canvas", render);

    new KPTF.Modelo("modelo/aguila.js", "modelo/aguila.png", fModeloAguila, {x: 5, y: 2.5, z: -2.5}, 4.5);
    
    new KPTF.Modelo("modelo/shuriken.js", null, fModeloShuriken, {x: 75, y: 2.5, z: -2.5}, 0.3);
    
    for(var i=0;i<muros.length;i++){
        escena.añadir(muros[i].objeto);
    }
    
    cuboG = new THREE.BoxGeometry(10, 5, 5);
    cuboM = new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: true});
    cubo = new THREE.Mesh(cuboG, cuboM);
    cubo2 = new THREE.Mesh(cuboG, cuboM);
    
    cubo.position=new THREE.Vector3(10-5, 5-2.5, 0-2.5);
    cubo2.position=new THREE.Vector3(80-5, 5-2.5, 0-2.5);
    
    escena.añadir(foco);
    escena.añadir(foco2);
    escena.añadir(ambiente);
    escena.añadir(cubo);
    escena.añadir(cubo2);
    
    mundo3d.añadirA(escena);

    KPTF.miHilo.añadirTarea(frender, 0, true);
    
    KPTF.Teclado.añadirFuncionTeclaArriba(controlTeclado);
    
    window.addEventListener('resize', onWindowResize, false);
}

/*
 * Funcion llamada para generar graficamente las aguilas
 * @param {object} objeto Es la combinacion de la geometria con el material
 * @param {object} objetoGeometria es la geometria del aguila
 * @param {object} objetoMaterial es el material del aguila
 */
function fModeloAguila(objeto, objetoGeometria, objetoMaterial){
    jugador1.setModelo(objeto, objetoGeometria, objetoMaterial);
    var objeto2 = new THREE.Mesh(objetoGeometria, objetoMaterial);
    objeto2.scale.x=objeto.scale.x;
    objeto2.scale.y=objeto.scale.y;
    objeto2.scale.z=objeto.scale.z;
    jugador2.setModelo(objeto2, objetoGeometria, objetoMaterial);
    jugador2.setPosicionGrafica(80, 5, 0);
    escena.añadir(jugador1.objeto);
    escena.añadir(jugador2.objeto);
    modelosCargados+=2;
}

/*
 * Funcion llamada para generar graficamente los turbos
 * @param {object} objeto Es la combinacion de la geometria con el material
 * @param {object} objetoGeometria es la geometria del turbo
 * @param {object} objetoMaterial es el material del turbo
 */
function fModeloShuriken(objeto, objetoGeometria, objetoMaterial){
    for(var i=0;i<turbos.length;i++){
        var objeto2 = new THREE.Mesh(objetoGeometria, objetoMaterial);
        objeto2.scale.x=objeto.scale.x;
        objeto2.scale.y=objeto.scale.y;
        objeto2.scale.z=objeto.scale.z;
        turbos[i].setModelo(objeto2, objetoGeometria, objetoMaterial);
        escena.añadir(turbos[i].objeto);
        modelosCargados++;
    }
}

/*
 * Funcion encargada del resposive design
 */
function onWindowResize() {
    KPTF.Renderizador.ANCHO = window.innerWidth - 5;
    KPTF.Renderizador.ALTO = window.innerHeight - 5;

    KPTF.Camara.ANCHO = window.innerWidth / 2;
    KPTF.Camara.ALTO = window.innerHeight;

    camara.cambiarAspecto((window.innerWidth / 2) / window.innerHeight);
    camara2.cambiarAspecto((window.innerWidth / 2) / window.innerHeight);
    camara_mini.cambiarAspecto((window.innerWidth*3 / 2) / window.innerHeight);
    
    cuboG = new THREE.BoxGeometry(4, 4, 4);
    cuboM = new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: true});
    cubo = new THREE.Mesh(cuboG, cuboM);
    
    cubo.position.x = 0;
    cubo.position.y = 0;
    cubo.position.z = 0;

    render.cambiarTamaño(window.innerWidth, window.innerHeight);
}
/*
 * Renderiza las dos camara; si detecta que el estado es EST_JUEGO, renderiza la
 * tercer camara
 */
function frender() {
    render.renderizarEnZona(0, 0, KPTF.Camara.ANCHO, KPTF.Camara.ALTO);
    render.renderizar(escena, camara);

    render.renderizarEnZona(KPTF.Camara.ANCHO, 0, KPTF.Camara.ANCHO, KPTF.Camara.ALTO);
    render.renderizar(escena, camara2);
    
    if(estadoJuego===EST_JUGANDO){
        render.renderizarEnZona(KPTF.Camara.ANCHO*3.5/5,0,KPTF.Camara.ANCHO*3/5, KPTF.Camara.ALTO/5);
        render.renderizar(escena, camara_mini);
    }
}