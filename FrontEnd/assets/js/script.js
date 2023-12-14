window.addEventListener("DOMContentLoaded", (event) => {
    // console.log("DOM entièrement chargé et analysé");
    initWorks();
    
  });
// Fonction qui récupère les appels à l'API et les initialise
async function initWorks() {
    // Chargement travaux page d'accueil
    getWorks();
    // Chargement travaux modale
    getWorksModal();
    // Chargement catégories
    await getCategories();

    // Gestion utilisateur connecté
    checkUserConnected();
}