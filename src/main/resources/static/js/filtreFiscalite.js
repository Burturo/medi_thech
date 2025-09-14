// Vérification si l'URL contient "/fiscalite"
const currentUrlFiscalite = window.location.href;
if (currentUrlFiscalite.indexOf("/fiscalite") !== -1) {

    $(document).ready(function () {
        // Fonction pour initialiser DataTable
        function initializeDataTable(selector) {
            // Vérifier si le DataTable est déjà initialisé et le détruire si nécessaire
            if ($.fn.dataTable.isDataTable(selector)) {
                $(selector).DataTable().destroy(); // Détruire l'instance existante
            }

            const table = $(selector).DataTable({
                "order": [[0, "asc"]], // Tri par défaut
                "language": {
                    "paginate": {
                        "first": "Première",
                        "last": "Dernière",
                        "next": "Suivant",
                        "previous": "Précédent"
                    },
                    "search": "Rechercher un élément",
                    "lengthMenu": "Afficher _MENU_",
                    "info": "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
                    "infoEmpty": "Affichage de 0 à 0 sur 0 entrées",
                    "infoFiltered": "(filtré à partir de _MAX_ entrées au total)",
                    "zeroRecords": "Aucun enregistrement correspondant trouvé",
                    "emptyTable": "Aucune donnée disponible dans le tableau",
                    "loadingRecords": "Chargement...",
                    "processing": "Traitement..."
                },
                "lengthMenu": [10, 25, 50, 100],
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fas fa-file-excel fa-1xl me-3 text-white"></i> Exporter en Excel',
                        className: 'btn text-white bg-success btn-custom-excel me-3',
                        title: 'Données exportées',
                        exportOptions: {
                            columns: ':not(:last-child)'
                        }
                    },
                    {
                        extend: 'print',
                        text: '<i class="fas fa-print fa-1xl me-3 text-white"></i> Imprimer la liste',
                        className: 'btn text-white bg-warning btn-custom-print ms-2 me-3',
                        title: 'Impression de la liste',
                        exportOptions: {
                            columns: ':not(:last-child)' // Exclure la dernière colonne
                        }
                    }
                ]
            });

            // Filtrage dynamique
            $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                const periodeDebutFiscalite = $('#periodeDebutFiscalite').val();
                const periodeFinFiscalite = $('#periodeFinFiscalite').val();
                const clientFiscalite = $('#clientFiscalite').val();

                const dateIndex = 7; // Index de la colonne "DATE"
                const statusIndex = 1; // Index de la colonne "STATUS"

                const rowDate = new Date(data[dateIndex]); // Récupérer la date de la colonne
                const rowStatus = data[statusIndex]; // Récupérer le statut de la colonne

                // Filtrage par date
                const minDate = periodeDebutFiscalite ? new Date(periodeDebutFiscalite) : null;
                const maxDate = periodeFinFiscalite ? new Date(periodeFinFiscalite) : null;

                if ((minDate && rowDate < minDate) || (maxDate && rowDate > maxDate)) {
                    return false; // Date hors de la plage
                }

                // Filtrage par statut
                if (clientFiscalite !== 'aucune' && clientFiscalite !== rowStatus) {
                    return false; // Statut non correspondant
                }

                return true; // Passe tous les filtres
            });

            // Rafraîchir le tableau et recalculer le total
            function filterTable() {
                table.draw(); // Rafraîchir les données filtrées
            }

            // Écouter les changements sur les champs de filtrage
            $('#periodeDebutFiscalite, #periodeFinFiscalite, #clientFiscalite').on('change', function () {
                filterTable(); // Appliquer les filtres
            });

            return table;
        }

        // Initialisation du DataTable
        initializeDataTable('.table');
    });
}