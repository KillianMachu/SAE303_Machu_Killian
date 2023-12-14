import Chart from 'chart.js/auto'


const req = new XMLHttpRequest();
req.addEventListener("load", evt => {
  let datas = JSON.parse(req.responseText);
  let data = datas[2].data;

  let tabProg = []

  data.map(elt => elt.name).forEach(element => {
    tabProg.find((v) => v == element) ? undefined : tabProg.push(element)
  });


  (async function () {

    let mintab = []
    let maxtab = []
      tabProg.forEach(elements => {
          let filter1 = data.filter(element => element.name == elements && element.status!="UNKNOWN" && element.status!="UNSUPPORTED")
          let filter2 = filter1.map(element => parseInt(element.time))
          console.log(filter2)
          mintab.push(Math.min(...filter2));
          maxtab.push(Math.max(...filter2));
      })

      console.log(mintab)
      console.log(maxtab)
      console.log(tabProg)

    const chart = new Chart(
      document.getElementById('graph3'),
      {
        type: 'bar',
        options : {
          scales : {
            x : {
              ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
              },
              stacked: true
            }
          },
          plugins: {
            legend: {
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
                label:"minimum",
                data:mintab,
            },
            {
              label:"maximum",
              data:maxtab,
            }
          ]
        }
      }
    );

  })();

});

req.open("GET", "https://www.cril.univ-artois.fr/~lecoutre/teaching/jssae/code5/results.json");
req.send()