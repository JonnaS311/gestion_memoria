export const options = {
    plugins: {
      title: {
        display: true,
        text: 'Gestión de memoria Estatica de Tamaño Fijo',
      },
      legend: {
        display: false
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          // cambia los limites de la gráfica
          stepSize: 1048576
        }
      },
    },
  };
  
