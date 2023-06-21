const boton = document.getElementById("btnLeer");

let arrivalData = [];
let regex = [];

boton.addEventListener("click", function() {
  
  var regexMatch = false;

  for (let i = 65; i <= 90; i++) {
      regex.push(String.fromCharCode(i));
    }
  
  for (let j = 97; j <= 122; j++) {
      regex.push(String.fromCharCode(j));
    }
  
  regex.push('!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', '|', ';', ':', '.', '<', '>', '/', '?');

  var contador = 0;
  
  var arrival = document.querySelector('.arrival-time').value;
  var burst = document.querySelector('.burst-time').value;

  var soloComasArrival = /^\s*,*\s*$/.test(arrival);
  var soloComasBurst = /^\s*,*\s*$/.test(burst);
  var multiplesComasArrival = /,{2,}/.test(arrival);
  var multiplesComasBurst = /,{2,}/.test(burst);

  var empiezaConComaArrival = /^,/.test(arrival);
  var empiezaConComaBurst = /^,/.test(burst);

  var arrivalValue = arrival.split(",");
  var burstValue = burst.split(",");
  
  for(let i = 0; i < regex.length; i++){
    
    if(arrival.includes(regex[i]) || burst.includes(regex[i])){
      Swal.fire({
        title: '¡ WARNING !',
        text: 'Please, type only whole numbers',
        icon: 'error',
        //timer: 4000, 
        //timerProgressBar: true,
        allowOutsideClick: true, 
        allowEscapeKey: true,
        allowEnterKey: true
    });
      regexMatch = true;
      break;
    }else if(!arrival.includes(",") || !burst.includes(",")){
      Swal.fire({
        title: '¡ WARNING !',
        text: 'Please, separate the numbers by a comma',
        icon: 'error',
        //timer: 4000, 
        //timerProgressBar: true,
        allowOutsideClick: true, 
        allowEscapeKey: true,
        allowEnterKey: true
    });
      regexMatch = true;
      break;
    }else if(multiplesComasArrival || multiplesComasBurst || soloComasArrival || soloComasBurst){
      Swal.fire({
        title: '¡ WARNING !',
        text: 'Please, do not type commas in sequence',
        icon: 'error',
        //timer: 4000, 
        //timerProgressBar: true,
        allowOutsideClick: true, 
        allowEscapeKey: true,
        allowEnterKey: true
    });
      regexMatch = true;
    }else if(empiezaConComaArrival || empiezaConComaBurst){
      Swal.fire({
        title: '¡ WARNING !',
        text: 'Please, the first value must be an integer number.',
        icon: 'error',
        //timer: 4000, 
        //timerProgressBar: true,
        allowOutsideClick: true, 
        allowEscapeKey: true,
        allowEnterKey: true
    });
      regexMatch = true;
    }else if(burstValue.includes("0")){
      Swal.fire({
        title: '¡ WARNING !',
        text: '0 burst time is invalid',
        icon: 'error',
        //timer: 4000, 
        //timerProgressBar: true,
        allowOutsideClick: true, 
        allowEscapeKey: true,
        allowEnterKey: true
    });
      regexMatch = true;
    }
    }


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
        
      } else{
      Swal.fire({
        title: '¡ WARNING !',
        text: 'Arrival Times and Burst Times must be the same amount',
        icon: 'error',
        //timer: 4000, 
        //timerProgressBar: true,
        allowOutsideClick: true, 
        allowEscapeKey: true,
        allowEnterKey: true
    });
    regexMatch = true;
  }

  if(!regexMatch){
      createTable(arrivalData);
      createGranttChart(arrivalData);
    }
      
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

  let table = '<table align="center" class="visible"><thead><tr><th>Task </th><th>Arrival Time</th><th>Burst Time</th><th>Finish Time</th><th>Turnaround Time</th><th>Waiting Time</th></tr></thead><tbody>';

  for (let i = 0; i < arrivalData.length; i++) {
    if(i==0){
      finishTime += parseInt(arrivalData[i][1]);
    }
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

function createGranttChart(arrivalData){

  let ganttChart = '';
  let burst = '';
  let title = '<h3>Gantt Chart</h3>';
  var finish = 0;

  for (let i = 0; i < arrivalData.length; i++) {

    
    if(i==0){
      finish += parseInt(arrivalData[i][1]);
      burst += '<div class="br">' + finish + '</div>';
    }
    finish += parseInt(arrivalData[i][2]);
    ganttChart += '<div class="id">' + arrivalData[i][0] + '</div>';
    burst += '<div class="br">' + finish + '</div>';

  }
  document.getElementById('h3').innerHTML = title;
  document.getElementById('gantt').innerHTML = ganttChart;
  document.getElementById('burst').innerHTML = burst;
}