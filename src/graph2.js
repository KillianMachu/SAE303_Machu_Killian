import Chart, { elements } from 'chart.js/auto'


const req = new XMLHttpRequest();
req.addEventListener("load", evt => {
  let datas = JSON.parse(req.responseText);
  let data = datas[2].data;

  let tabProg = [];
  data.map(elt => elt.name).forEach(element => {
    tabProg.find((v) => v == element) ? undefined : tabProg.push(element)
  });

  
  (async function () {

    let sommeProgOK = [];

    tabProg.forEach(elements => {
      let filter1 = data.filter(element => element.name == elements)
      let filter2 = filter1.filter(element => element.status=="SAT" || element.status=="UNSAT")
      sommeProgOK.push(filter2.length)
      console.log(filter2.length)
    })

    somtotProg = 0

    sommeProgOK.forEach(elements => somtotProg+=elements)

    console.log(somtotProg)
    console.log(tabProg)
    console.log(sommeProgOK)
    console.log(sommeProgOK.map(elt => (elt/somtotProg)*100))

    new Chart(
      document.getElementById('graph2'),
      {
        type: 'doughnut',
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'left',
              onHover: (event, chartElement) => {
                event.native.target.style.cursor = 'pointer';
              },
              onLeave: (event, chartElement) => {
                event.native.target.style.cursor = 'default';
              }
            }
          }
        },
        data: {
          labels: tabProg,
          datasets: [
            {
              label: "Pourcentage",
              data: sommeProgOK.map(elt => (elt/somtotProg)*100),
            }
          ]
        }
      }
    );
  })();

});

req.open("GET", "https://www.cril.univ-artois.fr/~lecoutre/teaching/jssae/code5/results.json");
req.send()