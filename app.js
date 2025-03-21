document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formRegister');
    const nombreInput = document.getElementById('nombreInput');
    const telefonoInput = document.getElementById('telefonoInput');
    const buttons = document.querySelectorAll('.button--secondary');

    function saveDataToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function loadDataFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    function renderTable(key, tableBodyId) {
        const data = loadDataFromLocalStorage(key);
        const tableBody = document.getElementById(tableBodyId);
        tableBody.innerHTML = '';

        data.forEach((item, index) => {
            let secondaryValue = '';
            if (key === 'registroData' && item.telefono) secondaryValue = item.telefono;
            if (key === 'cajaData' && item.monto) secondaryValue = item.monto;
            if (key === 'almacenData' && item.cantidad) secondaryValue = item.cantidad;

            if (!item.nombre && !secondaryValue) return; // Evitar filas vacías

            const newRow = document.createElement('tr');
            let rowContent = `<td>${item.nombre}</td>`;
            if (secondaryValue) {
                rowContent += `<td>${secondaryValue}</td>`;
            }
            rowContent += `
                <td>
                    <button class="button button--edit" onclick="editRow('${key}', ${index}, '${tableBodyId}')">Editar</button>
                    <button class="button button--delete" onclick="deleteRow('${key}', ${index}, '${tableBodyId}')">Eliminar</button>
                </td>
            `;
            newRow.innerHTML = rowContent;
            tableBody.appendChild(newRow);
        });
    }

    function navigateTo(section) {
        document.getElementById('registroTable').classList.add('hidden');
        document.getElementById('cajaTable').classList.add('hidden');
        document.getElementById('almacenTable').classList.add('hidden');
    
        const title = document.querySelector('.crud__title');
        if (section === 'registro') {
            document.getElementById('registroTable').classList.remove('hidden');
            title.textContent = 'REGISTRO CLIENTES';
        } else if (section === 'caja') {
            document.getElementById('cajaTable').classList.remove('hidden');
            title.textContent = 'CAJA CLIENTES';
        } else if (section === 'almacen') {
            document.getElementById('almacenTable').classList.remove('hidden');
            title.textContent = 'ALMACÉN CLIENTES';
        }

        buttons.forEach(button => {
            if (button.getAttribute('data-section') === section) {
                button.classList.add('button--active');
                button.disabled = true;
            } else {
                button.classList.remove('button--active');
                button.disabled = false;
            }
        });
    }

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            navigateTo(button.getAttribute('data-section'));
        });
    });

    function addDataToTable(key, tableBodyId, data) {
        if (!data.nombre && !data.telefono && !data.monto && !data.cantidad) return; // Evitar agregar datos vacíos
        const currentData = loadDataFromLocalStorage(key);
        currentData.push(data);
        saveDataToLocalStorage(key, currentData);
        renderTable(key, tableBodyId);
    }

    function deleteRow(key, index, tableBodyId) {
        const data = loadDataFromLocalStorage(key);
        data.splice(index, 1);
        saveDataToLocalStorage(key, data);
        renderTable(key, tableBodyId);
    }

    function editRow(key, index, tableBodyId) {
        const data = loadDataFromLocalStorage(key);
        const item = data[index];
        nombreInput.value = item.nombre;
        telefonoInput.value = item.telefono || item.monto || item.cantidad || '';
        deleteRow(key, index, tableBodyId);
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const nombre = nombreInput.value.trim();
        const telefono = telefonoInput.value.trim();

        if (!document.getElementById('registroTable').classList.contains('hidden')) {
            addDataToTable('registroData', 'tableBody', { nombre, telefono });
        } else if (!document.getElementById('cajaTable').classList.contains('hidden')) {
            addDataToTable('cajaData', 'cajaBody', { nombre, monto: telefono });
        } else if (!document.getElementById('almacenTable').classList.contains('hidden')) {
            addDataToTable('almacenData', 'almacenBody', { nombre, cantidad: telefono });
        }

        form.reset();
    });

    renderTable('registroData', 'tableBody');
    renderTable('cajaData', 'cajaBody');
    renderTable('almacenData', 'almacenBody');
});
