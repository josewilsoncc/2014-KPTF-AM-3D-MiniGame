/**
* @fileoverview Esta clase representa tanto logíca, como graficamente un muro en el juego
*
* @author Jose Wilson Capera Castaño
* @author Estefania Alzate Daza
* @version 1.0
*/
var Muro = function(){
    //Objetos con los que podra colisionar el muro, en este caso otra águila
    this.objetosColision=new Array();
    
    //Es la combinacion de la geometria y el material
    this.objeto;
    //Geometria del objeto
    this.objetoGeometria;
    //Material del objeto
    this.objetoMaterial;
    
    //Coordenadas logicas x, y, z del muro
    this.x=0;
    this.y=0;
    this.z=0;
    
    /*
     * Indican las direcciones X e Y de la siguiente manera
     * Si X = -1 -> hacia la izquierda
     * Si X = 1 -> hacia la derecha
     * Si X = 0 -> sin dirección en eje X
     * Si Y = -1 -> hacia abajo
     * Si Y = 1 -> hacia arriba
     * Si Y = 0 -> sin dirección en eje Y
     * 
     * nota: la combinacion de las direcciones produce diagonales
     */
    this.direccionX=0;
    this.direccionY=0;
    
    /*
    * Cambia el modelo grafico del muro
    * @param {object} objeto la combinacion de la geometria y el material
    * @param {object} objetoGeometria la geometria del objeto
    * @param {object} objetoMaterial el material del objeto
    */
    this.setModelo=function(objeto, objetoGeometria, objetoMaterial){
        this.objeto=objeto;
        this.objetoGeometria=objetoGeometria;
        this.objetoMaterial=objetoMaterial;
        this.reubicar();
    };
    
    /*
    * Cambia la posicion logica X, Y, Z del muro, a su vez cambia
    * la posicion grafica
    * @param {integer} x Es la nueva coordenada logica en el eje X
    * @param {integer} y Es la nueva coordenada logica en el eje Y
    * @param {integer} z Es la nueva coordenada logica en el eje Z
    */
    this.posicion=function(x,y,z){
        this.x=x;
        this.y=y;
        this.z=z;
        this.setPosicionGrafica(this.x*10,this.y*5,this.z*5);
    };
    
    /*
    * Cambia la posicion grafica X, Y, Z del muro
    * @param {integer} x Es la nueva coordenada grafica en el eje X
    * @param {integer} y Es la nueva coordenada grafica en el eje Y
    * @param {integer} z Es la nueva coordenada grafica en el eje Z
    */
    this.setPosicionGrafica=function(x,y,z){
        this.objeto.position.x=x-5;
        this.objeto.position.y=y-2.5;
        this.objeto.position.z=z-2.5;
    };
    
    /*
    * Retorna la posicion grafica X, Y, Z del muro.
    * @returns {object} Es un vector con las coordenadas graficas del muro
    */
    this.getPosicionGrafica=function(){
        return this.objeto.position;
    };
    
    /*
    * Verifica si el muro colisionó con un jugador, se reubica el muro, y desacelera
    * el jugador que colisiono.
    */
    this.colision=function(){
        for(var i=0;i<this.objetosColision.length;i++){
            if(this.x === this.objetosColision[i].x && this.y === this.objetosColision[i].y && this.z === this.objetosColision[i].z){
                this.objetosColision[i].quitarTurbo();
                this.reubicar();
                Muro.sonido.reproducir(true);
            }
        }
    };
    
    /*
    * Verifica si el muro colisionó con un jugador llamando al respectivo metodo,
    * y detecta si el muro se encuentra muy atras del ultimo jugador y lo reubica.
    */
    this.avanzar=function(){
        this.colision();
        if(this.z > this.zUltimoObjetoColision()+50)
            this.reubicar();
        this.setPosicionGrafica(this.x*10,this.y*5,this.z*5);
    };
    
    /*
     * Reubica el muro mas adelante del primer jugador
     */
    this.reubicar=function(){
        this.posicion(aleatorio8_1(),aleatorio8_1(),this.zPrimerObjetoColision()-aleatorio100_120());
    };
    
    /*
     * Indica cual es la coordenada z del ultimo jugador
     * @returns {integer} valor de la z del ultimo jugador
     */
    this.zUltimoObjetoColision=function(){
        var z=this.objetosColision[0].z;
        for(var i=0;i<this.objetosColision.length;i++){
            if(this.objetosColision[i].z>z)
                z=this.objetosColision[i].z;
        }
        return z;
    };
    
    /*
     * Indica cual es la coordenada z del primer jugador
     * @returns {integer} valor de la z del primer jugador
     */
    this.zPrimerObjetoColision=function(){
        var z=this.objetosColision[0].z;
        for(var i=0;i<this.objetosColision.length;i++){
            if(this.objetosColision[i].z<z)
                z=this.objetosColision[i].z;
        }
        return z;
    };
};

Muro.sonido=new KPTF.Sonido("sonido/muro.mp3");