
const boton = document.getElementById("btnLeer");
var casos = document.querySelector('#tabla2 tbody');

let arrivalData = [];

boton.addEventListener("click", function() {

  var contador = 0;

  var arrival = document.querySelector('.arrival-time').value;
  var burst = document.querySelector('.burst-time').value;

  var arrivalValue = arrival.split(",");
  var burstValue = burst.split(",");


  if (burstValue.length == arrivalValue.length) {

    arrivalData.splice(0, arrivalData.length);

    //Almacena los datos de arrival-time en un arreglo
    for (let i = 0; i < arrivalValue.length; i++) {

      var idFila = String.fromCharCode(65 + contador);

      arrivalData[i] = [];
      arrivalData[i][0] = idFila;
      arrivalData[i][1] = arrivalValue[i];
      arrivalData[i][2] = burstValue[i];

      contador++;
    }
    createTable(arrivalData);
  } else
    alert('Los tiempos de llegada y de ejecución deben ser la misma cantidad');
});

function createTable(arrivalData) {

  arrivalData.sort(function(a, b) {
    return a[1] - b[1];
  });

  var arrivalTime = 0;
  var burstTime = 0;
  var finishTime = 0;
  var turnaroundTime = 0;
  var waitingTime = 0;
  var turnaroundTimeTotal = 0;
  var waitingTimeTotal = 0;

  let table = '<table border="1" align="center" class="visible"><thead><tr><th>Task </th><th>Arrival Time</th><th>Burst Time</th><th>Finish Time</th><th>Turnaround Time</th><th>Waiting Time</th></tr></thead><tbody>';

  for (let i = 0; i < arrivalData.length; i++) {

    arrivalTime = parseInt(arrivalData[i][1]);

    burstTime = parseInt(arrivalData[i][2]);

    finishTime += parseInt(arrivalData[i][2]);

    turnaroundTime = finishTime - arrivalTime;

    turnaroundTimeTotal += turnaroundTime;

    waitingTime = turnaroundTime - burstTime;

    waitingTimeTotal += waitingTime;

    table += '<tr><td>' + arrivalData[i][0] + '</td><td>' + arrivalTime + '</td><td>' + burstTime + '</td><td>' + finishTime + '</td><td>' + turnaroundTime + '</td><td>' + waitingTime + '</td></tr>';
  }

  var resultado1 = (turnaroundTimeTotal / arrivalData.length).toString();
  var resultado2 = (waitingTimeTotal / arrivalData.length).toString();

  if (resultado1.includes(".0")) {
    resultado1 = resultado1.replace(".0", "");
  }

  if (resultado2.includes(".0")) {
    resultado2 = resultado2.replace(".0", "");
  }

  table += '<td colspan="4" style="text-align:right;">Average</td><td>' + turnaroundTimeTotal + ' / ' + arrivalData.length + ' = ' + resultado1 + '</td><td>' + waitingTimeTotal + ' / ' + arrivalData.length + ' = ' + resultado2 + '</td></tr></tbody></table><br><br>';
  document.getElementById('tabla').innerHTML = table;

}