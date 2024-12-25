fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    const table = document.getElementById('data-table');
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.description}</td>
      `;
      table.appendChild(row);
    });
  })
  .catch(error => console.error('Error fetching data:', error));
