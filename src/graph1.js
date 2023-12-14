import Chart from 'chart.js/auto'


let firstgraph_firstprog = document.getElementById('firstgraph_firstprog')
let firstgraph_secprog = document.getElementById('firstgraph_secprog')
let firstgraph_probfamily = document.getElementById('firstgraph_probfamily')

const req = new XMLHttpRequest();
req.addEventListener("load", evt => {
  let datas = JSON.parse(req.responseText);
  let data = datas[2].data;

  let tabProg = []

  data.map(elt => elt.name).forEach(element => {
    tabProg.find((v) => v == element) ? undefined : tabProg.push(element)
  });

  console.log(data.map(elt => elt.name))

  tabProg.forEach(element => {
    let option = document.createElement("option")
    option.value = element
    option.text = element
    firstgraph_firstprog.appendChild(option.cloneNode(true))
    firstgraph_secprog.appendChild(option)
  });

  document.querySelector("#firstgraph_secprog>option:nth-child(2)").selected = true

  let tabProb = []

  data.map(elt => elt.family).forEach(element => {
    tabProb.find((v) => v == element) ? undefined : tabProb.push(element.toString())
  });

  tabProb.forEach(element => {
    let option = document.createElement("option")
    option.value = element
    option.text = element
    firstgraph_probfamily.appendChild(option)
  });

  (async function () {
    let critere = firstgraph_probfamily.value

    let filter1 = data.filter(elt => elt.name == firstgraph_firstprog.value && elt.family == critere)
    let filter2 = data.filter(elt => elt.name == firstgraph_secprog.value && elt.family == critere)
    const chart = new Chart(
      document.getElementById('graph1'),
      {
        type: 'line',
        options : {
          scales : {
            x : {
              ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
              }
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
          labels: filter1.map(row => row.fullname),
          datasets: [
            {
              label: firstgraph_firstprog.value,
              data: filter1.map(row => row.time),
              backgroundColor: "rgba(46,204,113,.5)",
              fill: true,
              pointRadius: filter1.map(row => row.status == "UNKNOWN" ? 10 : 3),
              pointHoverRadius: filter1.map(row => row.status == "UNKNOWN" ? 10 : 3),
              borderRadius: 10,
              segment: {
                borderDash: filter1.map(row => row.status == "UNKNOWN" ? [5,5] : []),
              },
            },
            {
              label: firstgraph_secprog.value,
              data: filter2.map(row => row.time),
              backgroundColor: "rgba(52,73,94,.5)",
              fill: true,
              pointRadius: filter2.map(row => row.status == "UNKNOWN" ? 5 : 3),
              pointHoverRadius: filter2.map(row => row.status == "UNKNOWN" ? 10 : 3),
              borderRadius: 10
            }
          ]
        }
      }
    );

    function update(param, id){
        let filter = data.filter(elt => elt.name == param.value && elt.family == firstgraph_probfamily.value)
        console.log(filter)
        chart.data.datasets[id].data = filter.map(row => row.time)
        chart.data.labels = filter.map(row => row.fullname)
        chart.data.datasets[id].label = param.value
        chart.data.datasets[id].pointRadius = filter.map(row => row.status == "UNKNOWN" ? 10 : 3),
        chart.data.datasets[id].pointHoverRadius = filter.map(row => row.status == "UNKNOWN" ? 10 : 3),
        console.log(param.value)
        chart.update();
    }

    firstgraph_firstprog.addEventListener("change", () => {
      update(firstgraph_firstprog, 0)
    })

    firstgraph_secprog.addEventListener("change", () => {
      update(firstgraph_secprog, 1)
    })

    firstgraph_probfamily.addEventListener("change", () => {
      for (var i = 0; i < 2; i++) {
        inputs = [firstgraph_firstprog, firstgraph_secprog]
        update(inputs[i], i)
      }
    })
  })();

});

req.open("GET", "https://www.cril.univ-artois.fr/~lecoutre/teaching/jssae/code5/results.json");
req.send()