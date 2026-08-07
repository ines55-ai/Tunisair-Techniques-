/**
 * Extrait les données d'une réponse qui peut être soit un tableau direct,
 * soit un objet paginé {data: [], meta: {}}
 * 
 * @param {*} response - La réponse de l'API
 * @returns {{data: Array, total: number}} - Les données et le total
 */
export const extractPaginatedData = (response) => {
  // Si c'est un tableau direct
  if (Array.isArray(response)) {
    return {
      data: response,
      total: response.length,
    };
  }
  
  // Si c'est un objet avec data et meta
  if (response && response.data && Array.isArray(response.data)) {
    return {
      data: response.data,
      total: response.meta?.total || response.data.length,
    };
  }
  
  // Cas par défaut
  return {
    data: [],
    total: 0,
  };
};

/**
 * Extrait un tableau simple d'une réponse paginée
 * Utilisé dans les formulaires où on veut juste la liste
 * 
 * @param {*} response - La réponse de l'API
 * @returns {Array} - Le tableau de données
 */
export const extractDataArray = (response) => {
  if (Array.isArray(response)) {
    return response;
  }
  
  if (response && response.data && Array.isArray(response.data)) {
    return response.data;
  }
  
  return [];
};
