/**
* @fileoverview Esta clase contiene la logíca del juego
*
* @author Jose Wilson Capera Castaño
* @author Estefania Alzate Daza
* @version 1.0
*/

//Constantes del control del teclado del jugador 1
var J1_TECLA_IZQUIERDA = 65;
var J1_TECLA_ARRIBA = 87;
var J1_TECLA_DERECHA = 68;
var J1_TECLA_ABAJO = 83;

//Constantes del control del teclado del jugador 2
var J2_TECLA_IZQUIERDA = 37;
var J2_TECLA_ARRIBA = 38;
var J2_TECLA_DERECHA = 39;
var J2_TECLA_ABAJO = 40;

//Constante de la tecla Enter/Entrar
var TECLA_ENTER = 13;

//Indica cuantos objetos en total deben estar creados para inciar el juego
var TOTAL_MODELOS_CARGADOS = 102;

var EST_CUENTA_REGRESIVA=0;
var EST_JUGANDO=1;
var EST_PAUSA=2;
var EST_VICTORIA=3;


//Representan al jugador 1 y 2
var jugador1 = new Aguila(1);
var jugador2 = new Aguila(2);

//Arreglo que contiene todos los objetos que representan los turbos
var turbos = new Array();
//Arreglo que contiene todos los objetos que representan los muros
var muros = new Array();

//Representa la posición de los Creditos
var inidiceCreditos=1;
//Indica el total de archivos con los creditos
var TOTAL_CREDITOS=3;

//Se crean todos los turbos y se les indica que deben colisionar con ambos jugadores
for(var i = 0;i<100;i++){
    var temp= new Turbo();
    temp.objetosColision.push(jugador1);
    temp.objetosColision.push(jugador2);
    turbos.push(temp);
}

//Se crean todos los muros y se les indica que deben colisionar con ambos jugadores
for(var i = 0;i<25;i++){
    var temp= new Muro();
    temp.objetosColision.push(jugador1);
    temp.objetosColision.push(jugador2);
    temp.setModelo(KPTF.Geometria.obtenerGeometria(KPTF.Geometria.obtenerCubo(KPTF.Elemento3D.ancho, KPTF.Elemento3D.alto, KPTF.Elemento3D.alto), KPTF.Geometria.obtenerMaterialTextura("img/texturas/rocks.jpg")),null,null);
    muros.push(temp);
}

//Se indica que cada jugador debe colisionar con el opuesto
jugador1.objetosColision.push(jugador2);
jugador2.objetosColision.push(jugador1);

//Indica el estado del juego
var estadoJuego=EST_CUENTA_REGRESIVA;

//los milisegundo antes de que empiece el juego
var cuentaRegresiva=5000;

//Sonidos de la cuenta regresiva
var sonidoAguila= new KPTF.Sonido("sonido/aguila.mp3");
var sonido3= new KPTF.Sonido("sonido/3.mp3");
var sonido2= new KPTF.Sonido("sonido/2.mp3");
var sonido1= new KPTF.Sonido("sonido/1.mp3");

//Musica de los diferentes estados y menus
var musicaMenu= new KPTF.Sonido("sonido/maldad_jose_capera.m4a", true);
var musicaJuego= new KPTF.Sonido("sonido/angelita_jose_capera.m4a", true);
var musicaCreditos= new KPTF.Sonido("sonido/new_year_jose_capera.m4a", true);

//Instancia del AM Mundo3D, este contiene el escenario del juego
var mundo3d = new KPTF.Mundo3D(0,0,0, 10,10,10);

/*
 * Indica la direccion (izquierda o derecha), es un ligero movimiento de las
 * camaras de cada jugador, para dar ambientacion al juego.
 */
var direccionCamara=true;

/*
 * Es el primer metodo llamado en el juego, se encarga de mostrar el
 * logo inicial y desencadenar el evento siguiente (cargarLogo2).
 */
function cargarLogo() {
    var sonidoIntro = new KPTF.Sonido("sonido/intro.mp3");
    $("#marco").load("html/logo.html", function() {
        $("#logo").hide(0);
        sonidoIntro.reproducir();
        $("#logo").fadeIn(3000);
        KPTF.miHilo.añadirTarea(cargarLogo2, 3000);
    });
}

/*
 * Es el segundo metodo llamado en el juego, se encarga de mostrar el
 * segundo logo y desencadenar el evento siguiente (cargarMenuPrincipal).
 */
function cargarLogo2() {
    $("#logo").fadeOut(1000, function(){
        $("#marco").load("html/logo2.html", function() {
            $("#logo").hide(0);
            $("#logo").fadeIn(3000, function(){
                $("#logo").fadeOut(1000, function(){
                    cargarMenuPrincipal();
                });
            });
        });
    });
}

/*
 * Se encarga de cargar el menu principal del juego y asignar las
 * correspondientes funciones a cada uno de los menus.
 */
function cargarMenuPrincipal() {
    $("#marco").load("html/menu_principal.html", function() {
        $("#logo").hide(0);
        $("#logo").fadeIn(2000);
        $("#btn_jugar").click(iniciarJuego);
        $("#btn_instruciones").click(instruccionesJuego);
        $("#btn_KPTFAM").click(acercaDeKPTFAM);
        $("#btn_creditos").click(creditosJuego);
        musicaMenu.reproducir(true);
        musicaCreditos.detener();
    });
}

//Se encarga de cargar el sitio web del framework
function acercaDeKPTFAM(){
    window.open("http://kptfam.comuv.com/", '_blank');
}

//Se encarga de cargar las instrucciones del juego
function instruccionesJuego() {
    $("#marco").load("html/instrucciones.html", function() {
        $("#logo").hide(0);
        $("#logo").fadeIn(2000);
        $("#btn_atras").click(cargarMenuPrincipal);
        musicaCreditos.reproducir(true);
        musicaMenu.detener();
    });
}

//Se encarga de cargar los creditos del juego
function creditosJuego() {
    $("#marco").load("html/creditos.html", function() {
        $("#logo").hide(0);
        $("#logo").fadeIn(2000, function(){
            $("#btn_anterior").click(creditoAnterior);
            $("#btn_siguiente").click(creditoSiguiente);
        });
        $("#btn_anterior").hide();
        $("#texto_creditos").load("html/creditos/creditos1.html");
        $("#btn_atras").click(cargarMenuPrincipal);
        musicaCreditos.reproducir(true);
        musicaMenu.detener();
    });
}

//Carga el siguiente credito al actual
function creditoSiguiente(){
    if(inidiceCreditos<TOTAL_CREDITOS)
        inidiceCreditos++;
    cargarCreditos();
    KPTF.consola("Siguiente indiceCreditos: "+inidiceCreditos);
}

//Carga el anterior credito al actual
function creditoAnterior(){
    if(inidiceCreditos>1)
        inidiceCreditos--;
    cargarCreditos();
    KPTF.consola("Anterior indiceCreditos: "+inidiceCreditos);
}

//se encarga de cargar el texto del credito actual
function cargarCreditos(){
    $("#btn_anterior").show();
    $("#btn_siguiente").show();
    if(inidiceCreditos>=TOTAL_CREDITOS)
        $("#btn_siguiente").hide();
    if(inidiceCreditos<=1)
        $("#btn_anterior").hide();
    $("#logo").hide(0);
    $("#texto_creditos").load("html/creditos/creditos"+inidiceCreditos+".html", function() {
        $("#logo").fadeIn(500);
    });
}

//Inicia el juego
function iniciarJuego() {
    musicaMenu.detener();
    $("#marco").fadeOut(500);
    $("#fondo").hide();
    $("#canvas").fadeIn(500);
    $("#mensaje").fadeIn(100, function(){
        iniciarRenderizado();
        KPTF.miHilo.añadirTarea(controlJuego, 25, true);
    });
    $("#fondo_mensaje").show();
}

/*
 * Regula todo lo que es el juego con base en sus estados, monitorea los jugadores,
 * los muros, los turbos, las camaras, entre otros.
 */
function controlJuego(){
    if(estadoJuego===EST_CUENTA_REGRESIVA){
        if(modelosCargados>=TOTAL_MODELOS_CARGADOS){
            camara.ubicar(jugador1.objeto.position.x+distanciaCamaraX, jugador1.objeto.position.y+distanciaCamaraY, jugador1.objeto.position.z+jugador1.distanciaCamaraZ, jugador1.objeto);
            camara2.ubicar(jugador2.objeto.position.x+distanciaCamaraX, jugador2.objeto.position.y+distanciaCamaraY, jugador2.objeto.position.z+jugador2.distanciaCamaraZ, jugador2.objeto);

            if(jugador1.distanciaCamaraZ<MAX_DISTANCIA_CAMARA_Z)
                jugador1.distanciaCamaraZ+=0.1;
            if(jugador2.distanciaCamaraZ<MAX_DISTANCIA_CAMARA_Z)
                jugador2.distanciaCamaraZ+=0.1;
            
            jugador1.posicion(1,1,0);
            jugador2.posicion(8,1,0);
            
            jugador1.estabilizar();
            jugador2.estabilizar();

            $("#mensaje").fadeOut(500);
            $("#fondo_mensaje").hide();
            
            cuentaRegresiva-=25;
            if(cuentaRegresiva===3000){
                $("#marco_mensaje_flotante").show();
                sonido3.reproducir();
            }
            if(cuentaRegresiva===2000){
                $("#aviso").attr("src","img/avisos/2.png");
                sonido2.reproducir();
            }
            if(cuentaRegresiva===1000){
                $("#aviso").attr("src","img/avisos/1.png");
                sonido1.reproducir();
            }
            if(cuentaRegresiva===0){
                sonidoAguila.reproducir();
                $("#marco_mensaje_flotante").hide();
                jugador1.distanciaCamaraZ+=5;
                jugador1.distanciaCamaraZ+=5;
                estadoJuego=EST_JUGANDO;
                musicaJuego.reproducir();
            }
        }
    }
    if(estadoJuego===EST_JUGANDO){
        $("#marco_mensaje_flotante").hide();
        jugador1.estabilizar();
        jugador2.estabilizar();
        jugador1.avanzar();
        jugador2.avanzar();
        //KPTF.consola("j1: "+jugador1.aceleracion);
        ////KPTF.consola("j2: "+jugador2.aceleracion);
        
        for(var i=0;i<turbos.length;i++)
            turbos[i].avanzar();
        
        for(var i=0;i<muros.length;i++)
            muros[i].avanzar();
        
        foco.posicion(new THREE.Vector3(jugador1.getPosicionGrafica().x,jugador1.getPosicionGrafica().y,jugador1.getPosicionGrafica().z-5));
        foco2.posicion(new THREE.Vector3(jugador2.getPosicionGrafica().x,jugador2.getPosicionGrafica().y,jugador2.getPosicionGrafica().z-5));
        
        camara.ubicar(jugador1.objeto.position.x+distanciaCamaraX, jugador1.objeto.position.y+distanciaCamaraY, jugador1.objeto.position.z+jugador1.distanciaCamaraZ, jugador1.objeto);
        camara2.ubicar(jugador2.objeto.position.x+distanciaCamaraX, jugador2.objeto.position.y+distanciaCamaraY, jugador2.objeto.position.z+jugador2.distanciaCamaraZ, jugador2.objeto);
        
        if(jugador1.getPosicionGrafica().z<=jugador2.getPosicionGrafica().z)
            camara_mini.ubicar(jugador1.getPosicionGrafica().x, jugador1.getPosicionGrafica().y, jugador1.getPosicionGrafica().z-jugador1.distanciaCamaraZ, jugador1.objeto);
        else
            camara_mini.ubicar(jugador2.getPosicionGrafica().x, jugador2.getPosicionGrafica().y, jugador2.getPosicionGrafica().z-jugador2.distanciaCamaraZ, jugador2.objeto);

        if(jugador1.distanciaCamaraZ<MAX_DISTANCIA_CAMARA_Z)
            jugador1.distanciaCamaraZ+=0.1;
        if(jugador1.distanciaCamaraZ>MAX_DISTANCIA_CAMARA_Z)
            jugador1.distanciaCamaraZ-=0.1;
        if(jugador2.distanciaCamaraZ<MAX_DISTANCIA_CAMARA_Z)
            jugador2.distanciaCamaraZ+=0.1;
        if(jugador2.distanciaCamaraZ>MAX_DISTANCIA_CAMARA_Z)
            jugador2.distanciaCamaraZ-=0.1;
        
        if(direccionCamara){
            distanciaCamaraX+=0.01;
            if(distanciaCamaraX>MAX_DISTANCIA_CAMARA_X)
                direccionCamara=false;
        }
        if(!direccionCamara){
            distanciaCamaraX-=0.01;
            if(distanciaCamaraX<-MAX_DISTANCIA_CAMARA_X)
                direccionCamara=true;
        }
        
        if(jugador1.z<-2000 || jugador2.z<-2000)
            estadoJuego=EST_VICTORIA;
    }
    if(estadoJuego===EST_PAUSA){
        $("#marco_mensaje_flotante").show();
        $("#aviso").attr("src","img/avisos/pausa.png");
    }
    if(estadoJuego===EST_VICTORIA){
        $("#marco_mensaje_flotante").show();
        if(jugador1.z === jugador2.z)
            $("#marco_mensaje_flotante")[0].innerHTML="<center>Empate</center>";
        if(jugador1.z < jugador2.z)
            $("#aviso").attr("src","img/avisos/victoria1.png");
        if(jugador1.z > jugador2.z)
            $("#aviso").attr("src","img/avisos/victoria2.png");
        
        jugador1.estabilizar();
        jugador2.estabilizar();
        jugador1.avanzar();
        jugador2.avanzar();
    }
}

/*
 * Funcion especificada al AM de control de teclado
 * encarga de con base en el estado del juego y el
 * evento generado por el teclado, producir el comportamiento
 * deseado.
 */
function controlTeclado(evento){
    KPTF.consola("KKKKK: "+evento.keyCode);
    
    if(evento.keyCode === TECLA_ENTER){
        if(estadoJuego===EST_JUGANDO)
            estadoJuego=EST_PAUSA;
        else if(estadoJuego===EST_PAUSA)
            estadoJuego=EST_JUGANDO;
        else if(estadoJuego===EST_VICTORIA)
            location.reload(true);
    }
    
    if(estadoJuego===EST_JUGANDO){
        switch(evento.keyCode){
            case J1_TECLA_IZQUIERDA:
                jugador1.darAnguloZ(-10);
                jugador1.moverX(-1);
                break;
            case J1_TECLA_ARRIBA:
                jugador1.darAnguloX(10);
                jugador1.moverY(1);
                break;
            case J1_TECLA_DERECHA:
                jugador1.darAnguloZ(10);
                jugador1.moverX(1);
                break;
            case J1_TECLA_ABAJO:
                jugador1.darAnguloX(-10);
                jugador1.moverY(-1);
                break;
            case J2_TECLA_IZQUIERDA:
                jugador2.darAnguloZ(-10);
                jugador2.moverX(-1);
                break;
            case J2_TECLA_ARRIBA:
                jugador2.darAnguloX(10);
                jugador2.moverY(1);
                break;
            case J2_TECLA_DERECHA:
                jugador2.darAnguloZ(10);
                jugador2.moverX(1);
                break;
            case J2_TECLA_ABAJO:
                jugador2.darAnguloX(-10);
                jugador2.moverY(-1);
                break;
        }
    }
}

/*
* Convierte un angulo en grados a radianes
* @param {integer} angulo Es el angulo en grados
* @returns {number} el angulo convertido a radianes
*/
function angulo(angulo){
    return angulo * Math.PI / 180;
}

/*
* Genera un numero aleatorio entre 8 y 1
* @returns {integer} numero aleatorio entre 8 y 1
*/
function aleatorio8_1(){
    return Math.floor((Math.random() * 8) + 1);
}

/*
* Genera un numero aleatorio entre 100 y 120
* @returns {integer} numero aleatorio entre 100 y 120
*/
function aleatorio100_120(){
    return Math.floor((Math.random() * 120) + 100);
}