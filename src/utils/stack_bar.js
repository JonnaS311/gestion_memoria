export const options = {
  maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Gestión de memoria Estatica de Tamaño Fijo',
      },
      legend: {
        display: false
      }
    },
    responsive: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          // cambia los limites de la gráfica
          stepSize: 1048576
        }
      },
    },
  };
  
