document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('signaturePad');
    const clearButton = document.getElementById('clearSignature');
    const generatePDFButton = document.getElementById('generatePDF');
    const ctx = canvas.getContext('2d');
    
    // Configurar canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Eventos para dibujar
    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        [lastX, lastY] = [x, y];
    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        [lastX, lastY] = [e.clientX - rect.left, e.clientY - rect.top];
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    // Limpiar firma
    clearButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Generar PDF
    generatePDFButton.addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configuración de fuente
        doc.setFont('helvetica');
        doc.setFontSize(16);
        
        // Título
        doc.text('Registro de Trabajo Forestal', 105, 20, { align: 'center' });
        
        // Información general
        doc.setFontSize(12);
        doc.text('Información General:', 20, 40);
        doc.text(`Proyecto: ${document.getElementById('proyecto').value}`, 20, 50);
        doc.text(`Fecha: ${document.getElementById('fecha').value}`, 20, 60);
        doc.text(`Ubicación: ${document.getElementById('ubicacion').value}`, 20, 70);
        doc.text(`Cliente: ${document.getElementById('cliente').value}`, 20, 80);

        // Detalles técnicos
        doc.text('Detalles Técnicos:', 20, 100);
        doc.text(`Hectáreas: ${document.getElementById('hectareas').value}`, 20, 110);
        doc.text(`Especies: ${document.getElementById('especiesIdentificadas').value}`, 20, 120);
        doc.text(`Tipo de Suelo: ${document.getElementById('tipoSuelo').value}`, 20, 130);
        
        // Mediciones
        doc.text('Mediciones:', 20, 150);
        doc.text(`Altura Promedio: ${document.getElementById('alturaPromedio').value} m`, 20, 160);
        doc.text(`DAP Promedio: ${document.getElementById('dap').value} cm`, 20, 170);
        doc.text(`Densidad: ${document.getElementById('densidad').value} árboles/ha`, 20, 180);

        // Resultados
        doc.addPage();
        doc.text('Resultados:', 20, 20);
        doc.text(`Recomendaciones: ${document.getElementById('recomendaciones').value}`, 20, 30);
        doc.text(`Tratamientos: ${document.getElementById('tratamientos').value}`, 20, 40);
        doc.text(`Costos Estimados: $${document.getElementById('estimacionCostos').value}`, 20, 50);

        // Firma
        const signatureImage = canvas.toDataURL();
        doc.text('Firma Digital:', 20, 70);
        doc.addImage(signatureImage, 'PNG', 20, 80, 70, 40);

        // Descargar PDF
        doc.save('registro_forestal.pdf');
        
        // Limpiar firma después de generar el PDF
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}); 