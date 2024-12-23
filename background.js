chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleButtonsVisibility
    });
});

function toggleButtonsVisibility() {
    let selectedTexts = []; // Array para almacenar las selecciones de texto
    let buttonContainer = document.getElementById('button-container');

    // Si los botones no están creados, crearlos
    if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.id = 'button-container';
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.bottom = '10px';
        buttonContainer.style.right = '10px';
        buttonContainer.style.zIndex = '1000';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        document.body.appendChild(buttonContainer);

        // Estilo para los botones más pequeños
        const buttonStyle = {
            padding: '10px 10px',   // Botones más pequeños
            fontSize: '12px',       // Fuente más pequeña
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        };

        // Crear el botón para copiar el texto seleccionado
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copiar selección';
        Object.assign(copyButton.style, buttonStyle);
        copyButton.style.backgroundColor = '#007bff';
        copyButton.style.color = 'white';
        copyButton.addEventListener('click', () => {
            if (selectedTexts.length === 0) {
                console.log('No hay texto seleccionado.');
                return;
            }

            const combinedText = selectedTexts.join('\n');
            navigator.clipboard.writeText(combinedText).then(() => {
                console.log(`Texto copiado al portapapeles:\n\n${combinedText}`);
            }).catch(err => {
                console.error('Error al copiar el texto:', err);
            });
        });

        // Crear el botón para reiniciar la selección
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reiniciar selección';
        Object.assign(resetButton.style, buttonStyle);
        resetButton.style.backgroundColor = '#dc3545';
        resetButton.style.color = 'white';
        resetButton.addEventListener('click', () => {
            selectedTexts = []; // Vaciar el array
            console.log('La memoria de selecciones ha sido reiniciada. Ahora puedes comenzar a seleccionar nuevo texto.');
        });

        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(resetButton);
    }

    // Alternar la visibilidad de los botones
    if (buttonContainer.style.display === 'none') {
        buttonContainer.style.display = 'flex';
    } else {
        buttonContainer.style.display = 'none';
    }

    // Escuchar la selección de texto
    document.addEventListener('mouseup', () => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText && !selectedTexts.includes(selectedText)) {
            selectedTexts.push(selectedText); // Agregar el texto seleccionado al array
            console.log(`Texto añadido: "${selectedText}"`);
        }
    });
}

