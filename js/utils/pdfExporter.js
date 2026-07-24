export function exportarDatosPDF({ pedidos, inventario, alertas, eventos, prediccion, curvaPrediccion, costosRutas }) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('l', 'pt', 'a4'); // horizontal

  // Paleta AgroTech IA
  const primaryColor = [15, 23, 42]; // #0f172a
  const textColor = [50, 50, 50];
  const lightBg = [248, 250, 252];
  
  let currentY = 40;

  // 1. Portada / Título
  doc.setFontSize(20);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("AgroExport — Reporte General de Datos", 40, currentY);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  currentY += 20;
  const fechaGeneracion = new Date().toLocaleString();
  doc.text(`Fecha de generación: ${fechaGeneracion}`, 40, currentY);
  currentY += 30;

  // Helper para títulos de sección
  const drawSectionTitle = (title) => {
    if (currentY > 480) {
      doc.addPage();
      currentY = 40;
    }
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(40, currentY, doc.internal.pageSize.getWidth() - 80, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(title, 45, currentY + 16);
    currentY += 34;
  };

  // Helper para añadir autoTable y actualizar currentY
  const addTable = (columns, data, didDrawCell = null) => {
    doc.autoTable({
      startY: currentY,
      head: [columns],
      body: data,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 9 },
      bodyStyles: { textColor: textColor, fontSize: 8 },
      alternateRowStyles: { fillColor: lightBg },
      margin: { left: 40, right: 40 },
      didDrawCell: didDrawCell
    });
    currentY = doc.lastAutoTable.finalY + 30;
  };

  // 2. Pedidos de Exportación
  drawSectionTitle("Pedidos de Exportación");
  if (pedidos && pedidos.length > 0) {
    const pedidosCols = ["ID", "Cliente", "Destino", "Variedad", "Cantidad", "Fecha Envío", "Precio Unit.", "Total", "Tracking", "Estado"];
    const pedidosRows = pedidos.map(p => [
      p.id || '-', p.clientName || p.cliente || '-', p.destination || p.destino || '-', p.variety || p.variedad || '-', 
      p.quantity || p.cantidad || '-', p.shippingDate || p.fecha || '-', p.price || p.precio || '-', 
      p.totalValue || p.total || '-', p.trackingNumber || p.tracking || '-', p.status || p.estado || '-'
    ]);

    addTable(pedidosCols, pedidosRows, (data) => {
      // Colorear texto del Estado
      if (data.section === 'body' && data.column.index === 9) {
        const estado = (data.cell.raw || '').toString().toLowerCase();
        if (estado.includes('entregado')) {
          doc.setTextColor(34, 197, 94); // Verde
        } else if (estado.includes('enviado')) {
          doc.setTextColor(59, 130, 246); // Azul
        } else if (estado.includes('proceso')) {
          doc.setTextColor(245, 158, 11); // Ambar
        } else if (estado.includes('pendiente')) {
          doc.setTextColor(249, 115, 22); // Naranja
        } else if (estado.includes('cancelado')) {
          doc.setTextColor(239, 68, 68); // Rojo
        }
      }
    });
    
    // Resumen debajo
    const conteo = pedidos.reduce((acc, p) => {
      const s = p.status || p.estado || 'Desconocido';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10);
    doc.text(`Resumen de pedidos: ${Object.entries(conteo).map(([k,v]) => `${k}: ${v}`).join(', ')}`, 40, currentY - 15);
  } else {
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10);
    doc.text("No hay pedidos registrados.", 40, currentY);
    currentY += 30;
  }

  // 3. Inventario Post-Cosecha
  doc.addPage();
  currentY = 40;
  drawSectionTitle("Inventario Post-Cosecha");
  if (inventario && inventario.length > 0) {
    const invCols = ["Código Lote", "Finca", "Fecha Cosecha", "Peso (kg)", "Estado", "Calidad", "Color", "Tamaño", "Plagas", "Notas"];
    const invRows = inventario.map(i => [
      i.codigo || i.id || '-', i.finca || '-', i.fecha_cosecha || i.fecha || '-', i.peso || '-', 
      i.estado || '-', i.calidad || '-', i.color || '-', i.tamano || '-', i.plagas || 'No', i.notas || '-'
    ]);
    addTable(invCols, invRows);
  } else {
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10);
    doc.text("No hay datos de inventario.", 40, currentY);
    currentY += 30;
  }

  // 4. Alertas del Sistema
  drawSectionTitle("Alertas del Sistema");
  if (alertas && alertas.length > 0) {
    const alertCols = ["Tipo", "Título", "Descripción", "Fecha", "Leída"];
    const alertRows = alertas.map(a => [
      a.type || a.tipo || '-', a.title || a.titulo || '-', a.description || a.descripcion || '-', 
      a.date || a.fecha || '-', a.read ? 'Sí' : 'No'
    ]);
    addTable(alertCols, alertRows);
  } else {
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10);
    doc.text("No hay alertas registradas.", 40, currentY);
    currentY += 30;
  }

  // 5. Eventos Agrícolas
  doc.addPage();
  currentY = 40;
  drawSectionTitle("Eventos Agrícolas");
  if (eventos && eventos.length > 0) {
    const evCols = ["Tipo", "Lote", "Fecha", "Descripción"];
    const evRows = eventos.map(e => [
      e.type || e.tipo || '-', e.batch || e.lote || '-', e.date || e.fecha || '-', e.description || e.descripcion || '-'
    ]);
    addTable(evCols, evRows);
  } else {
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10);
    doc.text("No hay eventos agrícolas.", 40, currentY);
    currentY += 30;
  }

  // 6. Última Predicción de Rendimiento (IA)
  drawSectionTitle("Última Predicción de Rendimiento (IA)");
  if (prediccion && Object.keys(prediccion).length > 0) {
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10);
    doc.text(`Fecha de predicción: ${prediccion.fecha || '-'}`, 40, currentY);
    doc.text(`Fase del cultivo: ${prediccion.fase || '-'}`, 40, currentY + 15);
    doc.text(`Rendimiento estimado: ${prediccion.rendimiento || prediccion.estimado || '-'}`, 40, currentY + 30);
    currentY += 50;
  } else {
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10);
    doc.text("No hay datos de última predicción.", 40, currentY);
    currentY += 30;
  }

  // 7. Costos y Rentabilidad por Ruta
  drawSectionTitle("Costos y Rentabilidad por Ruta");
  if (costosRutas && costosRutas.length > 0) {
    const costosCols = ["Finca", "Ruta", "Contenedores", "Cajas", "Costos (M.O., Fert., Transp., Total)", "Ingresos", "Ganancia", "Rentabilidad %"];
    const costosRows = costosRutas.map(c => [
      c.finca || '-', c.ruta || '-', c.contenedores || '-', c.cajas || '-', 
      `${c.costos_mo || '-'} / ${c.costos_fert || '-'} / ${c.costos_transporte || '-'} / ${c.costos_totales || '-'}`, 
      c.ingresos || '-', c.ganancia || '-', c.rentabilidad || '-'
    ]);
    
    addTable(costosCols, costosRows, (data) => {
      if (data.section === 'body' && data.column.index === 6) { // Ganancia
        const ganancia = parseFloat(data.cell.raw);
        if (!isNaN(ganancia)) {
          if (ganancia < 0) doc.setTextColor(239, 68, 68); // Rojo
          else doc.setTextColor(34, 197, 94); // Verde
        }
      }
    });
  } else {
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10);
    doc.text("No hay registros de costos y rentabilidad.", 40, currentY);
    currentY += 30;
  }

  // Agregar pie de página a todas las páginas
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const str = "Página " + i;
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.getHeight();
    doc.text(str, 40, pageHeight - 10);
    doc.text(fechaGeneracion, pageSize.getWidth() - 150, pageHeight - 10);
  }

  doc.save("AgroExport_Reporte.pdf");
}
