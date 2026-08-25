import api from './api';

export const barcodeService = {
  // Télécharger le code-barres d'un matériel
  downloadBarcode: async (materielId) => {
    const response = await api.get(`/materiels/${materielId}/barcode`, {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `barcode-${materielId}.png`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Télécharger le QR code d'un matériel
  downloadQRCode: async (materielId) => {
    const response = await api.get(`/materiels/${materielId}/qrcode`, {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `qrcode-${materielId}.png`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Télécharger l'étiquette PDF d'un matériel
  downloadLabel: async (materielId) => {
    const response = await api.get(`/materiels/${materielId}/label`, {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `etiquette-${materielId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Télécharger des étiquettes multiples
  downloadBatchLabels: async (materielIds) => {
    const response = await api.post('/materiels/labels/batch', 
      { ids: materielIds },
      { responseType: 'blob' }
    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `etiquettes-${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Scanner un code-barres (récupérer les infos depuis le numéro de série)
  scanBarcode: async (numeroSerie) => {
    const response = await api.get(`/materiels/scan/${numeroSerie}`);
    return response.data;
  },
};

export default barcodeService;
