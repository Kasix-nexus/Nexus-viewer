// Получаем элементы из DOM
const modelViewer = document.getElementById('model-viewer');
const addModelButton = document.getElementById('add-model');
const modelInput = document.getElementById('model-input');
// Открываем диалог выбора файла при нажатии на кнопку Add Model
addModelButton.addEventListener('click', () => {
  modelInput.click();
});

// Обработка выбранного файла
modelInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const url = e.target.result;
      modelViewer.src = url;

      // После загрузки модели настраиваем камеру
      modelViewer.addEventListener('load', () => {
        // Проверяем, доступна ли граница модели
        if (modelViewer.model && modelViewer.model.bounds) {
          const bbox = modelViewer.model.bounds;
          const size = bbox.size;
          const maxDim = Math.max(size.x, size.y, size.z);
          const distance = maxDim * 2; // Коэффициент можно настроить

          // Устанавливаем новую позицию камеры с перспективной проекцией
          modelViewer.cameraOrbit = `0deg 75deg ${distance}m`;
          modelViewer.jumpCameraToGoal();
        } else {
          console.warn('Не удалось получить границы модели для настройки камеры.');
        }
      }, { once: true }); // Слушатель срабатывает только один раз
    };

    reader.onerror = function() {
      alert('Ошибка при чтении файла. Пожалуйста, попробуйте другой файл.');
    };

    reader.readAsDataURL(file);
  } else {
    alert('Пожалуйста, выберите файл формата .glb или .gltf.');
  }
});
