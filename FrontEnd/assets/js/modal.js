// Gestion de l'ouverture/fermeture au clic de la modale
    // Conteneur des modales
    const modalContainer = document.querySelector(".modal__container");
    // Déclencheurs ouverture/fermeture modales
    // Bouton "modifier", overlay de la modale, icône croix modales
    const modalTriggers = document.querySelectorAll(".modal__trigger");
    // Modale "Galerie Photo"
    const modalOne = document.querySelector(".modal__one");
    // Modale "Ajout Photo"
    const modalTwo = document.querySelector(".modal__two");

    // Evènement sur les déclencheurs 
    modalTriggers.forEach(trigger => trigger.addEventListener("click", openAndCloseModal));

    // Fonction liée au clic des déclencheurs ouverture/fermeture modale
    function openAndCloseModal() {
        modalContainer.classList.toggle("active"); // Ajoute la class active pour afficher la modale
        modalOne.style.display = "flex"; // Affiche la modale "Galerie photo"
        modalTwo.style.display = "none"; // Masque la modale "Ajout photo"
    };

// Evènement pour accéder à la deuxième modale ou revenir à la première modale
    // Sélection du bouton "Ajouter photo"
    const nextModal = document.querySelector(".modal__one-addbutton");
    // Evènement sur le bouton  "Ajouter photo" au clic
    nextModal.addEventListener("click", openNextModal);
    // Fonction lié au bouton "Ajouter photo"
    function openNextModal() {
        modalOne.style.display = "none"; // Masque modale "Galerie photo"
        modalTwo.style.display = "flex"; // Affiche modale "Ajout photo"
    };

    // Sélection de l'icône de retour
    const returnModal = document.querySelector(".return__modal-one");
    // Evènement au clic sur l'icône
    returnModal.addEventListener("click", returnFirstModal);
    // Fonction liée à l'icône de retour
    function returnFirstModal() {
        modalOne.style.display = "flex"; // Affiche modale "Galerie photo"
        modalTwo.style.display = "none"; // Masque modale "Ajout photo"
    };

// Récupération des travaux pour la modale 
async function getWorksModal() {
    fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(dataWorksModal => {
        // Sélection de la div qui va contenir les données récupérées via l'API
        const galleryModal = document.querySelector(".modal__one-gallery"); 
        galleryModal.innerHTML = "";
        // Création des travaux via les données récupérées
        dataWorksModal.forEach((workModal) => {
            // Création des éléments nécessaires
            const cardModal = document.createElement("figure");
            const imgCardModal = document.createElement("img");
            const titleCardModal = document.createElement("figcaption");
            // On récupère les données importantes pour afficher les travaux
            cardModal.setAttribute('id', workModal.id)
            imgCardModal.src = workModal.imageUrl;
            imgCardModal.alt = workModal.title;
            imgCardModal.setAttribute('category', workModal.categoryId);
            titleCardModal.innerText = "éditer";
            // Ajout de l'icône de déplacement
            const iconMove = document.createElement('span');
            iconMove.classList.add('movePhoto');
            iconMove.innerHTML = '<i class="fa-solid fa-up-down-left-right"></i>';
            // Ajout de l'icône de suppression d'un projet
            const deleteButton = document.createElement('button');
            deleteButton.type = "submit";
            deleteButton.id= "delete"
            deleteButton.classList.add('deleteButton');
            deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            // Evènement au clic pour supprimer un projet
            deleteButton.addEventListener("click", async (event) => {
                event.preventDefault();
                if (confirm("Voulez-vous supprimer le projet ?")) {
                    const id = cardModal.id;
                    /* Test de récupération de l'id du projet
                    console.log(id);
                    */
                    const monToken = localStorage.getItem("token");
                    // Envoi de la demande à l'API pour supprimer le projet
                    try {
                        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'accept': '*/*',
                            'Authorization': `Bearer ${monToken}`,
                        }
                    });
                    // Si la réponse est ok, on recharge les galeries
                    if (response.ok) {
                        getWorks();
                        getWorksModal();
                    } else {
                        // Sinon on alerte l'utilisateur d'une erreur 
                        alert("Echec de la suppresion du projet...")
                    }
                    } catch (error) {
                        console.log("Une erreur est survenue", error);
                    };
                } else {
                    alert("Le projet n'a pas été supprimé");
                };
            });
            // On relie les éléments img et title à leur parent card
            cardModal.appendChild(imgCardModal);
            cardModal.appendChild(titleCardModal);
            cardModal.appendChild(deleteButton);
            // On relie la card à la balise div qui contient la galerie
            galleryModal.appendChild(cardModal);
            galleryModal.appendChild(iconMove);
        });
});     
};


// Evènement au clic "Supprimer la galerie"
const deleteAll = document.querySelector(".modal__one-deletegallery");
deleteAll.addEventListener("click", deleteAllProject);

// Fonction de suppression de toute la galerie 
async function deleteAllProject(event) {
    event.preventDefault();
    // Demande de confirmation de suppression de la galerie
    // Si oui, exécute le code
    if (confirm("Voulez-vous supprimer tous les projets ?")) {
        // Sélection de tous les projets
        let projectModal = document.querySelectorAll(".modal__one-gallery figure");
        // Boucle permettant de récupérer chaque id des projets
        for (let i = 0; i < projectModal.length; i++) {
            // idProject correspond à chaque id de chaque projet
            const idProject = projectModal[i].id;
            // Récupération du token
            const monToken = localStorage.getItem("token");
            /* Test de récupération des id de chaque projet avec la boucle for
               console.log(idProject);
            */
           // Appel à l'API pour demander l'autorisation de supprimer les projets
            let response = await fetch (`http://localhost:5678/api/works/${idProject}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*',
                    'Authorization': `Bearer ${monToken}`,
                }
            });
            // Si réponse OK, on recharge les galeries (vide)
            if (response.ok) {
                getWorks();
                getWorksModal();
            } else {
                // Sinon on affiche un message d'erreur
                alert("Echec de la suppresion de la galerie...")
            };
        }
    // Si non, affiche message d'annulation    
    } else {
        alert("La galerie n'a pas été supprimée...");
    }
};

// Formulaire d'envoi d'un nouveau projet
    // Eléments requis pour valider l'ajout d'un projet
    const formModal = document.getElementById("modal__two-form");
    const inputImage = document.getElementById("addPhoto");
    const titleProject = document.getElementById("photoTitle");
    const categoryProject = document.getElementById("photoCategories");
    const validateProject = document.getElementById("validateProject");

    // Message d'erreur
    let errorForm = document.getElementById("errorForm");

    // Prévisualisation d'une photo
    inputImage.addEventListener("change", previewPicture);

    function previewPicture(event) {
        event.preventDefault();

        // Utilisation de l'objet FileReader pour lire l'image
        const reader = new FileReader();
        reader.readAsDataURL(inputImage.files[0]);

        // Listener de chargement sur la lecture de l'image
        reader.addEventListener("load", () => {
            previewImage.src = reader.result;
        });
        
        // Affichage de l'image 
        const pictureContainer = document.querySelector(".modal__two-imgcontainer");
        const previewImage = document.createElement("img");
        // On ajoute un id pour pouvoir la supprimer lors du reset du formulaire
        previewImage.setAttribute("id", "previewImage");
        // On relie l'image au parent Containeur
        pictureContainer.appendChild(previewImage);
        // On lui donne les dimensions pour l'affichage
        previewImage.style.width = "140px";
        previewImage.style.height = "183px";

        // On cache le label qui dépasse lors de prévisualisation de la photo
        const labelPicture = document.querySelector(".modal__two-textAddPhoto");
        labelPicture.style.opacity = "0";
    };
        
    // Reset formulaire
    function resetForm() {
        document.getElementById("modal__two-form").reset();

        // Suppresion de la prévisualisation de la photo du projet après validation formulaire
        const pictureContainer = document.querySelector(".modal__two-imgcontainer");
        const previewImage = document.getElementById("previewImage");
        if (previewImage) {
            pictureContainer.removeChild(previewImage);
        };

        // On affiche de nouveau le label
        const labelPicture = document.querySelector(".modal__two-textAddPhoto");
        labelPicture.style.opacity = "1";
    };

    // Ajout des catégories au formulaire d'ajout de projet 
    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(dataCategories => {
            // On récupère le select pour ajouter les catégories
            const select = document.getElementById("photoCategories");
            // Catégorie vide pour le visuel
            const emptyOption = document.createElement('option');
            select.appendChild(emptyOption);
            // Récupération dynamique des catégories présentes sur API
            dataCategories.forEach((category) => {
                const option = document.createElement('option');
                option.innerText = category.name;
                option.value = category.id;
                select.appendChild(option);
            });
        });

    // Listeners sur les infos à soumettre pour que le bouton "Valider" passe au vert
    inputImage.addEventListener("input", verifForm);
    titleProject.addEventListener("input", verifForm);
    categoryProject.addEventListener("input", verifForm);
    
    // Fonction de vérification si les conditions sont remplies = bouton "Valider" passe au vert
    function verifForm() {
        if (titleProject.value !== "" && categoryProject.value !== "" && inputImage.value !== ""){
            validateProject.classList.toggle("active");
            errorForm.style.display = 'none';
        } else {
            errorForm.innerText = "Veuillez renseigner tous les champs";
        }
    };

    // Fonction pour valider le formulaire
    async function validationFormModal () {
        // Sélection des infos pour soumettre le formulaire
        const inputImageUrl = document.getElementById("addPhoto").files[0];
        const titleProject = document.getElementById("photoTitle").value;
        const categoryProject = document.getElementById("photoCategories").value;

        // Sélection des galeries et de la modale
        const gallery = document.querySelector(".gallery");
        const galleryModal = document.querySelector(".modal__one-gallery");
        const modalContainer = document.querySelector(".modal__container");
        
        /* Test de récupération des infos
           console.log(inputImageUrl);
           console.log(titleProject);
           console.log(categoryProject);
        */
        // On crée le formulaire de soumission du projet
        let formData = new FormData();
        formData.append("image", inputImageUrl);
        formData.append("title", titleProject);
        formData.append("category", categoryProject);
        /* Test de vérification que le formulaire est bien créé
        console.log(formData);
        */
        const myToken = localStorage.getItem("token");
        /* Test de récupération du token d'authentification pour soumettre nouveau projet
        console.log(myToken);
        */    
            await fetch("http://localhost:5678/api/works", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${myToken}`,
                },
                body: formData,
            })
            // Si la réponse est OK (status 201)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } 
                throw new Error("Erreur lors du transfert");
            })
            .then((data) => {
                // Réinitialisation des galeries
                gallery.innerHTML = "";
                galleryModal.innerHTML = "";
                // On recharge dynamiquement les galeries
                getWorks();
                getWorksModal();
                // Bouton "Valider" du formulaire redevient gris
                validateProject.classList.remove("active");
                // Fermeture de la modale
                modalContainer.classList.remove("active");
            })
            .catch((error) => {
                console.log(error);
            });
    };    

    // Evènement au clic pour soumettre le formulaire
    formModal.addEventListener("submit", (event) => {
        event.preventDefault();
        validationFormModal();
        resetForm();
        /* Vérification que le formulaire est bien remis à zéro et qu'il ne contient aucune donnée
           console.log(inputImage.files)
           console.log(titleProject.value)
           console.log(categoryProject.value)
        */
    });