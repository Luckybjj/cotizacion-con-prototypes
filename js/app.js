/*
Tendremos dos objetos constructores.
1.- Uno se encargará de la cotización, marca, año, tipo.
2.- El otro se encargará de la interfaz y de lo que el usuario visauliza.

CONSTRUCTOR
El método constructor es un metodo especial para crear e inicializar un objeto creado a partir de una clase.

Un punto importante es comunicar dos objetos, dos constructores diferentes con dos prototipos diferentes. 
*/

// Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}
// Con los datos del formulario se crea la nueva instancia de Seguro
// Cotizacion con los datos
Seguro.prototype.cotizarSeguro = function () {
    /*
        1 = Americano 1.15
        2 = Asiatico 1.05
        3 = Europeo 1.35
    */
    let cantidad;
    let base = 2000;
    console.log(this.marca);
    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;

        default:
            break;
    }

    // Leer el año
    const diferencia = new Date().getFullYear() - this.year;
    // Cada año que la diferencia es mayor, el costo va a reducirse en un 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    /*
        Si el seguro es básico se multiplica por un 30% más
        Si el seguro es completo se multiplica ór un 50% más
    */

    if (this.tipo === 'basico') {
        cantidad *= 1.30;

    } else {
        cantidad *= 1.50;
    }

    return cantidad;

}

/*
Los datos de la interfaz de usuario se iran generando 
*/
function UI() { }
// Llernar las opciones de los años.
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),   // Tomo el año actual
        min = max - 20;

    const selectYear = document.querySelector('#year'); // Llenamos el select

    for (let i = max; i > min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }

}
// Mostrar alertas en pantallas
UI.prototype.moostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');
    if (tipo === 'error') {
        div.classList.add('mensaje', 'error');
    } else {
        div.classList.add('mensaje', 'correcto');
    }
    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;
    // Insertar en el HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'))  // insertBefore(newNode, referenceNode)

    setTimeout(() => {
        div.remove()
    }, 2000);
}

UI.prototype.mostrarResultado = (total, seguro) => {

    const { marca, year, tipo } = seguro;
    let textoMarca;
    switch (marca) {
        case '1':
        textoMarca = 'Americano';
            break;

        case '2':
            textoMarca = 'Asiatico';
            break;

        case '3':
            textoMarca = 'Europeo';
            break;

        default:
            break;
    }


    // Crear resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal"> ${textoMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal"> ${year}</span></p>
        <p class="font-bold">Tipop: <span class="font-normal capitalize"> ${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal"> $ ${total}</span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado')

    // Mostrar el Spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';   // Se borra el spinner y se muestra el resultado
        resultadoDiv.appendChild(div);
    }, 2000);

}

// Instanciar UI
const ui = new UI();
// console.log(ui);

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); // Llena el select con los años.
})

const eventListeners = () => {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

const cotizarSeguro = (e) => {
    e.preventDefault();
    // Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;
    // console.log(marca);

    // Leer el año seleccionado
    const year = document.querySelector('#year').value;

    /*
    Leer el tipo de cobertura
    Acá se tienen "radio buttons" --> type="radio", una de las caracteristicas de estos 
    es que el name="es-el-mismo", pero el valor="es-diferente"
    Entonces como leer esos valores?
    Selecciono por input que tenga el name
    */
    const tipo = document.querySelector('input[name="tipo"]:checked').value;    // selecciono el que está checkeado
    // console.log(tipo);

    if (marca === '' || year === '' || tipo === '') {
        ui.moostrarMensaje('Todos los campos son obligatiorios', 'error');
        console.log('No paso la validación');
        return;
    }
    ui.moostrarMensaje('Cotizando...', 'exito');
    console.log('Cotizado... !!');

    // Ocultar las cotizaciones previas.
    const resultados = document.querySelector('#resultado div'); // Se selecciona el div dentro de resultado
    if (resultados != null) {
        resultados.remove();

    }
    // Instanciar el Seguro --> este objeto se instancia segun los datos que haya seleccionado el usuario
    const seguro = new Seguro(marca, year, tipo)
    const total = seguro.cotizarSeguro();


    // Utilizar el prototype que va a cotizar
    ui.mostrarResultado(total, seguro);


}

eventListeners();