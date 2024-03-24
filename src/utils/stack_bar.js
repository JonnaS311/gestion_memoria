export const options = {
    plugins: {
      title: {
        display: true,
        text: 'Gestión de memoria Estatica de Tamaño Fijo',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  
  const labels = ['Memoria 16 Mb'];
  
  export const dataset = [
   /* {
      label: 'Dataset 1',
      data: [1048576],
      backgroundColor: 'rgb(255, 99, 132)',
    }, estructura del dataset*/
    {
      label: 'SO',
      data: [1048576],
      backgroundColor: 'rgb(255, 99, 132)',
    }
  ]
  
  export const data = {
    labels,
    datasets: dataset
  };


