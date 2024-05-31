const ctx = document.getElementById('canvas');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'],
      datasets: [{
        label: 'Số bước chạy',
        data: [12, 19, 3, 5, 2, 3, 9],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  console.log("Kiểm tra");

  