export function indicadorSulco(listaPneus) {
  const canvasElement = document.querySelector(".indicadorsulco-1");

  if (!canvasElement) return;

  const ctx = canvasElement.getContext("2d");

  if (!canvasElement) return;
  const contagemSulcos = listaPneus.reduce((acumulador, item) => {
    const sulco = Math.round(item.sulco); // Arredondando o sulco para ter numeros inteiros apenas

    // usando o sulco como indice para adicionar +1 em cada um dos 18 indices que deve ter
    acumulador[sulco] = (acumulador[sulco] || 0) + 1;

    return acumulador;
  }, {}); // utilizando objeto para transformar em um array

  const labelsGrafico = Array.from({ length: 18 }, (_, i) => i + 1);

  // Transformando em array para usar no grafico/data -> percorro pelo indices do objeto que criei acima é pego os valores, caso não exista = 0
  const dadosGrafico = labelsGrafico.map((sulco) => {
    return contagemSulcos[sulco] || 0;
  });

  var chartGraph = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labelsGrafico,
      datasets: [
        {
          label: "Sulcos por Quantidade",
          data: dadosGrafico,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
            "rgba(205, 19, 132, 0.2)",
            "rgba(115, 39, 14, 0.2)",
            "rgba(05, 205, 86, 0.2)",
            "rgba(275, 002, 252, 0.2)",
            "rgba(0, 0, 235, 0.2)",
            "rgba(153, 102, 0, 0.2)",
            "rgba(0, 203, 0, 0.2)",
            "rgba(075, 102, 112, 0.2)",
            "rgba(0, 0, 0, 0.2)",
            "rgba(255, 252, 0, 0.2)",
            "rgba(05, 53, 50, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(201, 203, 207)",
            "rgb(205, 19, 132)",
            "rgb(115, 39, 14)",
            "rgb(05, 205, 86)",
            "rgb(275, 002, 252)",
            "rgb(0, 0, 235)",
            "rgb(153, 102, 0)",
            "rgb(0, 203, 0)",
            "rgb(075, 102, 112)",
            "rgb(0, 0, 0)",
            "rgb(255, 252, 0)",
            "rgb(05, 53, 50)",
          ],
          borderWidth: 1,
        },
      ],
    },
  });
}
