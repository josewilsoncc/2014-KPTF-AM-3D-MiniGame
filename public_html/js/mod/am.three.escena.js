/**
* @fileoverview Este AM representa una escena
* @author Jose Wilson Capera Castaño
* @author Estefania Alzate Daza
* @version 1.0
*/
KPTF.Escena = function(){
    this.objeto = new THREE.Scene();
    
    /*
    * Añade un objeto a la escena
    * @param {object} temp Es el objeto a añadir en la escena
    */
    this.añadir=function(temp){
        if(temp.objeto!==null && temp.objeto!==undefined)
            this.objeto.add(temp.objeto);
        else
            this.objeto.add(temp);
    };
};
   
//Inicia el AM 
KPTF.Escena.iniciar=function(){
};

/*
 * se le asigna al AM el identificador, la version para el framework y la
 * informacion mostrada en consola
 */
KPTF.Escena.am_id="escena";
KPTF.Escena.am_version=1.0;
KPTF.Escena.am_log="Escena basada en Three.js";

//se añade el AM al arreglo de adicion de modular
KPTF.añadirAM(KPTF.Escena);