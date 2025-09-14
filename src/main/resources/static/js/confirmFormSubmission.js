// confirmFormSubmission.js

document.addEventListener("DOMContentLoaded", function () {

    // Sélectionner tous les formulaires ayant la méthode POST
    const forms = document.querySelectorAll('form[method="post"]');

    if (forms.length > 0) {
        forms.forEach((form) => {
            // Interception de la soumission du formulaire
            form.addEventListener("submit", function (e) {
                e.preventDefault(); // Empêche la soumission automatique

                // Affiche la boîte de dialogue SweetAlert
                Swal.fire({
                    title: "Êtes-vous sûr?",
                    text: "Voulez-vous vraiment éffectuer cet opération ?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Oui, soumettre!",
                    cancelButtonText: "Annuler",
                    allowOutsideClick: false, // Empêche la fermeture en cliquant à l'extérieur
                    allowEscapeKey: false,    // Empêche la fermeture avec la touche Échap
                }).then((result) => {
                    if (result.isConfirmed) {
                        form.submit(); // Soumet le formulaire après confirmation
                    }
                });

                // Ajoute un écouteur pour détecter la touche "Entrée"
                document.addEventListener("keydown", function onEnterPress(event) {
                    if (event.key === "Enter") {
                        Swal.clickConfirm(); // Confirme la boîte de dialogue SweetAlert
                        document.removeEventListener("keydown", onEnterPress); // Supprime l'écouteur
                    }
                });
            });
        });
    }
});
