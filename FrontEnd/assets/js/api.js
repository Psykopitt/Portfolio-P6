// Gestion des appels à l'API 

    // Récupération des données des travaux 
    async function getWorks() {
        await fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(dataWorks => {
            /* Test de récupération des données 
               console.table(dataWorks);
            */
            // Sélection de la div qui va contenir les travaux 
            const gallery = document.querySelector(".gallery");
            gallery.innerHTML = "";
            //On crée les travaux à partir des données récupérées via l'API
            dataWorks.forEach((work) => {
                // Création des éléments nécessaires à l'affichage des travaux 
                const card = document.createElement("figure");
                const imgCard = document.createElement("img");
                const titleCard = document.createElement("figcaption");
                // On récupère les données importantes pour afficher les travaux
                imgCard.src = work.imageUrl;
                imgCard.alt = work.title;
                imgCard.setAttribute('category', work.categoryId);
                titleCard.innerText = work.title;
                // On relie les éléments img et title à leur parent card
                card.appendChild(imgCard);
                card.appendChild(titleCard);
                // On relie la card à la balise div qui contient la galerie
                gallery.appendChild(card);
            });
        });   
    };
    
    // Récupération des catégories 
    async function getCategories() {
        await fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(dataCategories => {
            /* Test de récupération des catégories
               console.table(dataCategories);
            */
            // Sélection de la div qui va contenir les filtres
            const filters = document.querySelector(".filters")
            // Création du filtre Tous 
            const allFilter = document.createElement('p');
            allFilter.textContent = 'Tous';
            allFilter.classList.add("filtersNone");
            allFilter.classList.add("filterActive")
            filters.appendChild(allFilter);
            // Utilisation d'une boucle pour créer les noms des catégories
            dataCategories.forEach((category) => {
               const nameFilters = document.createElement("p");
               nameFilters.innerText = category.name;
               nameFilters.id = category.id;
               nameFilters.classList.add("filtersNone");
               filters.appendChild(nameFilters);   
            });
            filters.querySelectorAll('p').forEach((filter) => {
                filter.addEventListener("click", function() {
                    // Sélection de l'id appliqué lors de la création des images des travaux 
                    const id = this.id;
                    document.querySelectorAll('.gallery img').forEach(image => {
                        // Si image = catégorie correspondante, afficher l'image
                        if (image.getAttribute('category') === id) {
                            image.parentElement.style.display = 'block';
                        } else {
                            // Sinon, masquer
                            image.parentElement.style.display = 'none';
                        }  
                    });
                });
            });
            // Pour le filtre Tous - réinitialisation de l'affichage 
            allFilter.addEventListener('click', function () {
                // Sélectionne toutes les images de la galerie
                document.querySelectorAll('.gallery img').forEach(image => {
                // Permet d'afficher tous les travaux 
                image.parentElement.style.display = 'block';
                });
            }); 
            //Sélection du filtre actif
            const elements = filters.querySelectorAll('p');
            elements.forEach((element) => {
                element.addEventListener("click", () => {
                    elements.forEach((element) => {
                        // Au clic sur un bouton on retire la classe "active" du filtre "Tous"
                        element.classList.remove("filterActive");
                        });
                        // Et on ajoute cette classe active sur le bouton cliqué
                        element.classList.add("filterActive"); 
                });
            });  
        });
    };