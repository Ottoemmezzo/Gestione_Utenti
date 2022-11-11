var nome = document.getElementById('nome');
var cognome = document.getElementById('cognome');
var addBtn = document.getElementById('scrivi');
var elencoHtml = document.getElementById('elenco');
var errore = document.getElementById('errore');
var erroreElenco = document.getElementById('erroreElenco');
var elenco = [];
var flag = 0;
var cur_id=-1;

window.addEventListener('DOMContentLoaded', init);

function init() {
    //printData();
      fetch('http://localhost:3000/elenco').then((response) => {
         return response.json();//rappresentazione(copia) dei dati
     }).then((data) => {
         elenco = data;
         printData();
     });
   
    eventHandler();
}

function eventHandler() {
    addBtn.addEventListener('click', () => {
        
        if (controlla()&&flag==0) {
            data={
                nome: nome.value,
                cognome : cognome.value
            }
            addData(data);
        }
        else if(controlla()&&flag==1)
        {
            update(cur_id);
        }    
        
    });
}

async function addData(data) {

    let response = await fetch('http://localhost:3000/elenco', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
    });
    clearForm();

}
async function update(id) {
    clearError();
    if (flag == 1) {
        let response = await fetch(`http://localhost:3000/elenco/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                nome: nome.value,
                cognome: cognome.value

            }),
        });
        flag = 0;
    }
}

function controlla(id) {
    if (nome.value != '' && cognome.value != '') {
        var data = {
            nome: nome.value,
            cognome: cognome.value
        };
        return 1;
    }
    else {
        errore.innerHTML = 'Compilare correttamente i campi!';
        return 0;
    }

}
function clearForm() {
    nome.value = '';
    cognome.value = '';

}
function clearError(){
    errore.innerHTML='';
}
function printData() {
    //clearError();
    //fetch senza parametri opzionALI è GET
    fetch('http://localhost:3000/elenco').then((response) => {
        return response.json();//rappresentazione(copia) dei dati
    }).then((data) => {
        elenco = data;//potevo fare elenco=response.json, ma in caso di errore mandava in errore l'array e non blocca lo script
        if (elenco.length > 0) {
            errore.innerHTML = '';
            elencoHtml.innerHTML = '';
            elenco.map(function (element) {
                elencoHtml.innerHTML += `<li onclick="load(${element.id})"><button type="button" class="btn btn-danger m-1" 
                onclick="cancella(${element.id})">X</button><button type="button" class="btn btn-warning m-1" 
                onclick="update(${element.id})">M</button>
                ${element.nome}&nbsp;${element.cognome}</li>`;
            });
        }
    });
}
function load(id) {
    flag=1;
    cur_id=id;
    clearError();
    fetch(`http://localhost:3000/elenco/${id}`).then((r) => { return r.json() }).then((d) => {
        nome.value = d.nome;
        cognome.value = d.cognome;
    });
}

function cancella(id)
{
  
   if(confirm("Sei sicuro di voler cancellare?"))fetch(`http://localhost:3000/elenco/${id}`,{method:'DELETE'}); 
   else errore.innerHTML="Operazione annullata."
}

