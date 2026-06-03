let paso=1;
const pasoInicial= 1;
const pasoFinal = 3;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded',function(){
    iniciarApp();
});


function iniciarApp(){
    mostrarSeccion(); // muestra y oculta las secciones
    tabs();//cambia la  seccion cuando se precionen los tabs
    botonesPaginador(); //Agrega o quita los botones del paginador
    paginaAnterior();
    paginaSiguiente();

    consultarAPI();//CONSULTAR LA API EN EL BACKEND DE PHP
    
    nombreCliente(); //añade el nombre del cliente a la cita
    seleccionarFecha(); //agrega la fecha de la cita en el objeto
    seleccionarHora(); //agrega la hora de la cita en el objeto
    mostrarResumen(); //muestra el resumen de la cita creada
}




function mostrarSeccion(){

    //ocultar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar');
    }
    
    //seleccionar la seccion con el paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(`#paso-${paso}`);
    seccion.classList.add('mostrar');

    //Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
        if(tabAnterior){
            tabAnterior.classList.remove('actual');
        }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs(){
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach( boton => {
        boton.addEventListener('click', function(e){
            e.preventDefault();

            paso = parseInt( e.target.dataset.paso);//informacion de a que le diste click
            mostrarSeccion();

            botonesPaginador();

        });
    })
}

function botonesPaginador(){
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');
    
    if(paso === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso=== 3){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();
    } else{
        paginaAnterior.classList.remove('ocultar')
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();

}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function(){
        if (paso<=pasoInicial)return;
        paso--;
        
        botonesPaginador();
    })
}
function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function(){
        if (paso>=pasoFinal)return;
        paso++;
        
        botonesPaginador();
    })
}

async function consultarAPI(){

    try{
        const url = 'http://localhost:3000/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);

    } catch (error){
            console.log(error);
    }
}

function mostrarServicios(servicios){
    servicios.forEach(servicio => {
            const {id, nombre, precio} = servicio;

            //DOM Scripting
            const nombreServicio = document.createElement('P');
            nombreServicio.classList.add('nombre-servicio');
            nombreServicio.textContent = nombre;

            const precioServicio = document.createElement('P');
            precioServicio.classList.add('precio-servicio');
            precioServicio.textContent = `$${precio}`;

            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;//dataset para agregar un id al div
            servicioDiv.onclick = function(){
                seleccionarServicio(servicio);
            };

            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            document.querySelector('#servicios').appendChild(servicioDiv);
            
    });
}

function seleccionarServicio(servicio){
    const {id} = servicio;
    const {servicios }=cita;

    //identificar el div del servicio que se le dio click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    //comprobar si un servicio ya fue agregado 
    if( servicios.some( agregado => agregado.id === id) ){
        //Eliminarlo
            cita.servicios = servicios.filter(agregado => agregado.id !== id)
            divServicio.classList.remove('seleccionado');
    } else{
        //Agregarlo
            cita.servicios = [...servicios, servicio];
            divServicio.classList.add('seleccionado');
    }
    

}

function nombreCliente(){
    const nombre = document.querySelector('#nombre').value;
    cita.nombre = nombre;
}

function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e){

        const dia = new Date(e.target.value).getUTCDay(); //obtener la fecha en milisegundos
        
        if( [6, 0].includes (dia) ){
            e.target.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        } else{
                cita.fecha = e.target.value;
        }
    });
}

function seleccionarHora(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e){
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];
        if(hora < 10 || hora > 18){
            e.target.value = '';
            mostrarAlerta('Hora no valida', 'error', '.formulario');
        } else{
            cita.hora = e.target.value;

            console.log(cita);
        }
    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true){

    //previene que se genere mas de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    //scripting para crear una alerta 
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece){
    //eliminar la alerta despues de 3 segundos
        setTimeout( () => {
            alerta.remove();
        }, 3000);
    }

}

function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen');


    //Limpiar el contenido Resumen
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    }
    

    if(Object.values(cita).includes('') || cita.servicios.length ===0 ){

        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);
        return;
    }
    
    // Formatear el div de resumen
    const {nombre,fecha,hora,servicios} = cita;



    //heading para servicios en resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);


    //iterando y mostrando los servicios seleccionados
    servicios.forEach(servicio =>{
        const { id, precio, nombre} = servicio; 
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
        
    });

    //heading para cita en resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCliente= document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    //formatear la fecha an español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth(); // Los meses en JavaScript comienzan desde 0 como si fuera un arreglo
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));


    const opciones = {weekday: 'long', year:'numeric', month:'long', day:'numeric'}
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);

    const fechaCita= document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita= document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    //Boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
   
}

async function reservarCita(){
    const datos = new FormData();
    datos.append('nombre', 'jose');

    //peticion hacia la api
    const url = 'http://localhost:3000/api/citas';
    const respuesta = await fetch (url, {
        method: 'POST',
        body: datos
    });
    
    const resultado = await respuesta.json();


    //console.log([...datos]);
}