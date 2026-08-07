import api from './api';

const rapportService = {
  // Récupérer le rapport mensuel
  getMonthlyReport: async (annee, mois) => {
    const response = await api.get('/rapports/mensuel', {
      params: { annee, mois },
    });
    return response.data;
  },

  // Télécharger le PDF du rapport mensuel
  downloadMonthlyPDF: async (annee, mois) => {
    const response = await api.get('/rapports/mensuel/pdf', {
      params: { annee, mois },
      responseType: 'blob',
    });
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rapport-${annee}-${mois}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return response.data;
  },
};

export default rapportService;
