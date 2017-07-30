/**
* @fileoverview Esta clase representa tanto logíca, como graficamente un águila en el juego
*
* @author Jose Wilson Capera Castaño
* @author Estefania Alzate Daza
* @version 1.0
*/
var Aguila=function(){
    
    //Objetos con los que podra colisionar el águila, en este caso otra águila
    this.objetosColision=new Array();
    
    //Es la combinacion de la geometria y el material
    this.objeto;
    //Geometria del objeto
    this.objetoGeometria;
    //Material del objeto
    this.objetoMaterial;
    
    //Aceleración del personaje en el juego
    this.aceleracion=20;
    //Indice que cada que esta en cero desacelera el personaje
    this.parcialAceleracion=6;
    
    //Coordenadas logicas x, y, z del personaje
    this.x=0;
    this.y=0;
    this.z=0;
    
    //Coordenadas graficas parciales, indican donde debe renderizarse el personaje
    this.x_parcial=0;
    this.y_parcial=0;
    this.z_parcial=0;
    
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
    
    //Indica el numero del jugador, ejemplo, jugador #1, jugador #2
    this.numeroJugador=arguments[0];
    
    //Indica la distancia en el eje Z de la camara partiendo del personaje
    this.distanciaCamaraZ=1;
    
    /*
    * Cambia el modelo grafico del águila
    * @param {object} objeto la combinacion de la geometria y el material
    * @param {object} objetoGeometria la geometria del objeto
    * @param {object} objetoMaterial el material del objeto
    */
    this.setModelo=function(objeto, objetoGeometria, objetoMaterial){
        console.log("SetModelo "+this.numeroJugador);
        this.objeto=objeto;
        this.objetoGeometria=objetoGeometria;
        this.objetoMaterial=objetoMaterial;
    };
    
    /*
    * Cambia el angulo en el eje Y del personaje en una magnitud en grados dada
    * @param {integer} magnitud la cantidad de grados que el personaje debe rotar
    */
    this.darAnguloY=function(magnitud){
        this.objeto.rotation.y+= angulo(magnitud);
    };
    
    /*
    * Cambia el angulo en el eje Z del personaje en una magnitud en grados dada, no
    * permite rotar mas si el angulo actual supera los 45° o es inferior a -45°
    * @param {integer} magnitud la cantidad de grados que el personaje debe rotar
    */
    this.darAnguloZ=function(magnitud){
        if((this.objeto.rotation.z<angulo(45) && angulo(magnitud)>0) || (this.objeto.rotation.z>angulo(-45) && angulo(magnitud)<0))
            this.objeto.rotation.z+= angulo(magnitud);
    };
    
    /*
    * Cambia el angulo en el eje X del personaje en una magnitud en grados dada, no
    * permite rotar mas si el angulo actual supera los 45° o es inferior a -45°
    * @param {integer} magnitud la cantidad de grados que el personaje debe rotar
    */
    this.darAnguloX=function(magnitud){
        if((this.objeto.rotation.x<angulo(45) && angulo(magnitud)>0) || (this.objeto.rotation.x>angulo(-45) && angulo(magnitud)<0))
            this.objeto.rotation.x+= angulo(magnitud);
    };
    
    /*
    * Cambia la posicion logica X, Y, Z del personaje
    * @param {integer} x Es la nueva coordenada logica en el eje X
    * @param {integer} y Es la nueva coordenada logica en el eje Y
    * @param {integer} z Es la nueva coordenada logica en el eje Z
    */
    this.posicion=function(x,y,z){
        this.x=x;
        this.y=y;
        this.z=z;
    };
    
    /*
    * Cambia la posicion grafica X, Y, Z del personaje
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
    * Retorna la posicion grafica X, Y, Z del personaje.
    * @returns {object} Es un vector con las coordenadas graficas del personaje
    */
    this.getPosicionGrafica=function(){
        return this.objeto.position;
    };
    
    /*
    * Cambia la direccion en el eje X del personaje si actualmente
    * no tiene direccion y si no hay un objeto del array de colision
    * que lo impida.
    * @param {integer} direccion Es la direccion (1,-1) que tomara el personaje
    */
    this.moverX=function(direccion){
        if(this.direccionX===0 && !this.colision(true, direccion))
            this.direccionX=direccion;
    };
    
    /*
    * Cambia la direccion en el eje Y del personaje si actualmente
    * no tiene direccion y si no hay un objeto del array de colision
    * que lo impida.
    * @param {integer} direccion Es la direccion (1,-1) que tomara el personaje
    */
    this.moverY=function(direccion){
        if(this.direccionY===0 && !this.colision(false, direccion))
            this.direccionY=direccion;
    };
    
    /*
    * Indica si el personaje colisionara con otro al realizar un movimiento
    * @param {boolean} enX Un true indica que es en el eje X, de lo contrario (false),
    * sera considerado eje Y
    * @param {integer} direccion Es la dirección (1,-1) que tomara el personaje
    */
    this.colision=function(enX, direccion){
        for(var i=0;i<this.objetosColision.length;i++){
            var x_este_futuro, y_este_futuro, z_este_futuro, x_otro_futuro, y_otro_futuro, z_otro_futuro;
            x_otro_futuro = this.objetosColision[i].x;
            y_otro_futuro = this.objetosColision[i].y;
            z_otro_futuro = this.objetosColision[i].z;
            
            z_este_futuro = this.z;
            
            if(this.objetosColision[i].direccionX !== 0)
                x_otro_futuro += this.objetosColision[i].direccionX;
            
            if(this.objetosColision[i].direccionY !== 0)
                y_otro_futuro += this.objetosColision[i].direccionY;
            
            if(enX){
                y_este_futuro = this.y + this.direccionY;
                x_este_futuro = this.x + direccion;
            }
            else{
                x_este_futuro = this.x + this.direccionX;
                y_este_futuro = this.y + direccion;
            }
            
            if (x_otro_futuro === x_este_futuro && y_otro_futuro === y_este_futuro && z_este_futuro === z_otro_futuro)
                return true;
        }
        return false;
    };
    
    /*
    * Este metodo debe ser llamado constantemente, verifica si las direcciones X y Y
    * han cambiado a 1 o -1, y ejecuta el correspondiente movimiento, tambien se encarga
    * del movimiento constante en el eje Z con base en la aceleracion.
    */
    this.avanzar=function(){
        if(this.direccionX!==0){
            if((this.x<8 && this.direccionX>0) || (this.x>1 && this.direccionX<0)){
                if((this.direccionX>0 && this.x_parcial<10) || (this.direccionX<0 && this.x_parcial>-10))
                    this.x_parcial+=this.direccionX;
                else{
                    this.x_parcial=0;
                    this.x+=this.direccionX;
                    this.direccionX=0;
                }
            }
            else
                this.direccionX=0;
        }
        
        if(this.direccionY!==0){
            if((this.y<8 && this.direccionY>0) || (this.y>1 && this.direccionY<0)){
                if((this.direccionY>0 && this.y_parcial<10) || (this.direccionY<0 && this.y_parcial>-10))
                    this.y_parcial+=this.direccionY;
                else{
                    this.y_parcial=0;
                    this.y+=this.direccionY;
                    this.direccionY=0;
                }
            }
            else
                this.direccionY=0;
        }
        
        if(this.z_parcial > -5){
            if(this.aceleracion>5)
                this.z_parcial -= 5;
            else
                this.z_parcial -= this.aceleracion;
        }
        else{
            this.z_parcial=0;
            this.z--;
        }
        this.desacelerar();
        this.setPosicionGrafica(this.x*10+this.x_parcial, this.y*5+this.y_parcial/2, this.z*5+this.z_parcial);
    };
    
    /*
    * Este metodo debe ser llamado constantemente, verifica si los angulos en X, Y y Z
    * estan alineados, de no ser asi, los estabiliza gradualmente
    */
    this.estabilizar=function(){
        if(this.objeto.rotation.x>angulo(0))
            this.objeto.rotation.x-= angulo(1);
        if(this.objeto.rotation.x<angulo(0))
            this.objeto.rotation.x+= angulo(1);
        if(this.objeto.rotation.y>angulo(180))
            this.objeto.rotation.y-= angulo(2);
        if(this.objeto.rotation.y<angulo(180))
            this.objeto.rotation.y+= angulo(2);
        if(this.objeto.rotation.z>angulo(0))
            this.objeto.rotation.z-= angulo(1);
        if(this.objeto.rotation.z<angulo(0))
            this.objeto.rotation.z+= angulo(1);
    };
    
    /*
    * Este metodo debe ser llamado constantemente, desacelera
    * gradualmente a los jugadores
    */
    this.desacelerar=function(){
        if(this.parcialAceleracion>0)
            this.parcialAceleracion--;
        else{
            this.parcialAceleracion=6;
            if(this.aceleracion>1){
                this.aceleracion--;
            }
        }
    };
    
    /*
    * Acelera al jugador
    */
    this.acelerar=function(){
        if(this.esElPrimero() && this.aceleracion<15)
            this.aceleracion+=10;
        
        if(!this.esElPrimero() && this.aceleracion<30)
            this.aceleracion+=20;
        
            this.distanciaCamaraZ+=3;
    };
    
    /*
    * Quita toda la aceleracion al jugador
    */
    this.quitarTurbo=function(){
        this.aceleracion=1;
    };
    
    /*
    * Indica si el jugador ocupa la primera posicion
    * @returns {boolean} true si es el primero jugador o si esta
    * empatado con el primero, false de lo contrario
    */
    this.esElPrimero=function(){
        var zPrimero = this.objetosColision[0].z;
        for(var i=0; i < this.objetosColision.length; i++){
            if(zPrimero < this.objetosColision[i].z)
                zPrimero = this.objetosColision[i].z;
        }
        return this.z === zPrimero;
    };
};