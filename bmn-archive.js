(() => {
  const webAppUrl = 'https://script.google.com/macros/s/AKfycbyrZbYtNwk5OhDNA958y9WmbKKjxiipkYIozwLeIO1DTAilEfxNkoOpG7SEujEQI3Z-/exec';
  const archiveTypes = {
    'bmn:loan-saved': { type: 'form', previewId: 'loanPreview', mode: 'printing-loan', label: 'Formulir Peminjaman' },
    'bmn:extension-saved': { type: 'form', previewId: 'extensionPreview', mode: 'printing-extension', label: 'Formulir Perpanjangan' },
    'bmn:return-saved': { type: 'form', previewId: 'returnPreview', mode: 'printing-return', label: 'Formulir Pengembalian' },
    'bmn:bast-saved': { type: 'bast', previewId: 'documentPreview', mode: 'printing-bast', label: 'Berita Acara' }
  };

  function makeInlineImage(sourceImage) {
    if (!sourceImage || !sourceImage.getAttribute('src')) return '';
    const source = sourceImage.getAttribute('src');
    if (/^data:image\//i.test(source)) return source;
    if (!sourceImage.complete || !sourceImage.naturalWidth) {
      throw new Error(`Gambar dokumen belum siap dimuat: ${sourceImage.alt || source}`);
    }
    const canvas = sourceImage.ownerDocument.createElement('canvas');
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    canvas.getContext('2d').drawImage(sourceImage, 0, 0);
    return canvas.toDataURL('image/png');
  }

  function createDocument(documentObject, eventType, entity) {
    const config = archiveTypes[eventType];
    if (!config) return null;
    const preview = documentObject.getElementById(config.previewId);
    if (!preview || !preview.innerHTML.trim()) {
      throw new Error(`Pratinjau ${config.label} belum tersedia.`);
    }

    const clone = preview.cloneNode(true);
    clone.classList.add('archive-document');
    const originalImages = [...preview.querySelectorAll('img')];
    const clonedImages = [...clone.querySelectorAll('img')];
    clonedImages.forEach((image, index) => {
      const source = makeInlineImage(originalImages[index]);
      if (source) image.setAttribute('src', source);
    });

    const styles = [...documentObject.querySelectorAll('style')]
      .map((style) => style.textContent)
      .join('\n');
    const overrides = `
      @page { size: A4 portrait; margin: 12mm; }
      html, body {
        width: auto !important; height: auto !important; min-width: 0 !important;
        min-height: 0 !important; margin: 0 !important; padding: 0 !important;
        overflow: visible !important; background: #fff !important;
      }
      body.${config.mode} { display: block !important; color: #111 !important; }
      .archive-document {
        display: block !important; width: 100% !important; max-width: none !important;
        min-width: 0 !important; margin: 0 !important; padding: 0 !important;
        overflow: visible !important; border: 0 !important; border-radius: 0 !important;
        box-shadow: none !important; background: #fff !important; color: #111 !important;
      }
      .archive-document, .archive-document * { font-family: Arial, sans-serif !important; }
      .archive-document img { max-width: 100% !important; object-fit: contain !important; }
    `;
    const html = `<!doctype html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${config.label}</title><style>${styles}\n${overrides}</style></head><body class="${config.mode}">${clone.outerHTML}</body></html>`;
    return { type: config.type, label: config.label, entity, html };
  }

  function jsonp(parameters) {
    return new Promise((resolve, reject) => {
      const callbackName = `__bmnArchive${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
      const script = document.createElement('script');
      let timeoutId;
      const finish = (error, value) => {
        window.clearTimeout(timeoutId);
        delete window[callbackName];
        script.remove();
        if (error) reject(error);
        else resolve(value);
      };
      window[callbackName] = (value) => finish(null, value);
      script.onerror = () => finish(new Error('Tidak dapat membaca data dari Apps Script.'));
      timeoutId = window.setTimeout(() => finish(new Error('Apps Script tidak merespons.'), null), 15000);
      const query = new URLSearchParams({ ...parameters, callback: callbackName, _: String(Date.now()) });
      script.src = `${webAppUrl}?${query.toString()}`;
      document.head.appendChild(script);
    });
  }

  function delay(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  async function save(record, archiveDocument) {
    if (!record || !record.id || !archiveDocument || !archiveDocument.type) {
      throw new Error('Data pengajuan atau dokumen PDF tidak lengkap.');
    }
    await fetch(webAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ source: 'bmn-user', event: 'submission-upsert', record, archiveDocument })
    });

    let response;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      response = await jsonp({ action: 'submission', id: record.id });
      const archivedPdf = response && response.ok && response.record && response.record.pdfUrls
        ? response.record.pdfUrls[archiveDocument.type]
        : null;
      if (archivedPdf && archivedPdf.url) {
        if (archivedPdf.sharingError) {
          const error = new Error(`PDF sudah tersimpan, tetapi tautan berbagi Drive tidak aktif: ${archivedPdf.sharingError}`);
          error.recordSaved = true;
          error.pdfSaved = true;
          throw error;
        }
        return response.record;
      }
      await delay(800);
    }
    const recordSaved = Boolean(response && response.ok && response.record);
    const error = new Error(recordSaved
      ? `Pengajuan sudah masuk ke Spreadsheet, tetapi PDF ${archiveDocument.label || archiveDocument.type} belum tersedia di Google Drive.`
      : response && response.error
        ? response.error
        : `PDF ${archiveDocument.label || archiveDocument.type} belum tersedia di Google Drive.`);
    error.recordSaved = recordSaved;
    throw error;
  }

  async function list() {
    const response = await jsonp({ action: 'list' });
    if (!response.ok || !Array.isArray(response.records)) {
      throw new Error(response.error || 'Daftar arsip Google Drive tidak valid.');
    }
    return response.records;
  }

  window.BmnArchive = { createDocument, save, list };
})();
