const currentUrlEtatPaiement = window.location.href; // Vérification de l'URL
if (currentUrlEtatPaiement.indexOf("/etat-paiement") !== -1) {
    $(document).ready(function () {
        // Fonction pour initialiser DataTable avec des options communes
        function initializeDataTable(selector) {
            const table = $(selector).DataTable({
                "order": [[0, "asc"]], // Tri par défaut
                "language": {
                    "paginate": {
                        "first": "Première", "last": "Dernière", "next": "Suivant", "previous": "Précédent"
                    },
                    "search": "Rechercher un élément ",
                    "lengthMenu": "Afficher _MENU_",
                    "info": "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
                    "infoEmpty": "Affichage de 0 à 0 sur 0 entrées",
                    "infoFiltered": "(filtré à partir de _MAX_ entrées au total)",
                    "zeroRecords": "Aucun enregistrement correspondant trouvé",
                    "emptyTable": "Aucune donnée disponible dans le tableau",
                    "loadingRecords": "Chargement...",
                    "processing": "Traitement..."
                }, "lengthMenu": [10, 25, 50, 100],
                dom: 'Bfrtip', buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fas fa-file-excel fa-1xl me-3 text-white"></i> Exporter en Excel',
                        className: 'btn text-white bg-success btn-custom-excel me-3',// Style personnalisé pour Excel
                        title: 'Données exportées',
                        exportOptions: {
                            columns: ':not(:last-child)'
                        }
                    },
                    {
                        extend: 'print',
                        text: '<i class="fas fa-print fa-1xl me-3 text-white"></i> Imprimer la liste',
                        className: 'ms-2 btn text-white bg-warning btn-custom-print ms-2 me-3',
                        title: 'Impression de la liste',
                        exportOptions: {
                            columns: ':not(:last-child)' // Exclure la dernière colonne (actions)
                        }
                    }]
            });

            // Fonction pour filtrer le tableau
            function filterTable() {
                var clientetat = $('#clientetat').val();
                var periodeEtat = $('#periodeEtat').val();
                var EtatPaiement = $('#EtatPaiement').val();

                // Filtrer par client
                table.column(1).search(clientetat ? '^' + clientetat + '$' : '', true, false);

                // Filtrer par période
                table.column(2).search(periodeEtat ? '^' + periodeEtat + '$' : '', true, false);

                // Filtrer par état de paiement
                table.column(11).search(EtatPaiement ? '^' + EtatPaiement + '$' : '', true, false);

                table.draw(); // Rafraîchir la table
            }

            // Écouter les changements sur les champs de filtrage
            $('#clientetat, #periodeEtat, #EtatPaiement').on('change', function () {
                filterTable(); // Appliquer les filtres de colonnes
                table.draw(); // Appliquer le filtre de date
            });

            return table;
        }

        // Initialisation des DataTables
        initializeDataTable('.table');
    });
}



const currentUrlEnvoieColisEdite = window.location.href;//Recuperation de l url actuel pour voir sii la page est celle de l'entrepot
if (currentUrlEnvoieColisEdite.indexOf("/rapport/paiements") !== -1) {
    $(document).ready(function () {
        // Fonction pour initialiser DataTable avec des options communes
        function initializeDataTable(selector) {
            const table = $(selector).DataTable({
                "order": [[0, "asc"]], // Tri par défaut
                "language": {
                    "paginate": {
                        "first": "Première", "last": "Dernière", "next": "Suivant", "previous": "Précédent"
                    },
                    "search": "Rechercher un élément ",
                    "lengthMenu": "Afficher _MENU_",
                    "info": "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
                    "infoEmpty": "Affichage de 0 à 0 sur 0 entrées",
                    "infoFiltered": "(filtré à partir de _MAX_ entrées au total)",
                    "zeroRecords": "Aucun enregistrement correspondant trouvé",
                    "emptyTable": "Aucune donnée disponible dans le tableau",
                    "loadingRecords": "Chargement...",
                    "processing": "Traitement..."
                }, "lengthMenu": [10, 25, 50, 100],
                dom: 'Bfrtip', buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fas fa-file-excel fa-1xl me-3 text-white"></i> Exporter en Excel',
                        className: 'btn text-white bg-success btn-custom-excel me-3',// Style personnalisé pour Excel
                        title: 'Données exportées',
                        exportOptions: {
                            columns: ':not(:last-child)'
                        }
                    },
                    {
                        extend: 'print',
                        text: '<i class="fas fa-print fa-1xl me-3 text-white"></i> Imprimer la liste',
                        className: 'ms-2 btn text-white bg-warning btn-custom-print ms-2 me-3',
                        title: 'Impression de la liste',
                        exportOptions: {
                            columns: ':not(:last-child)' // Exclure la dernière colonne (actions)
                        }
                    }]
            });

            // Ajout d'un filtre personnalisé pour la période (dates)
            $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                var periodeDebut = $('#periodeDebut').val();
                var periodeFin = $('#periodeFin').val();
                var dateIndex = 9; // Index de la colonne "DATE"
                var rowDate = new Date(data[dateIndex]); // Récupérer la date de la colonne

                if (!periodeDebut && !periodeFin) {
                    return true; // Pas de filtre de date
                }

                var minDate = periodeDebut ? new Date(periodeDebut) : null;
                var maxDate = periodeFin ? new Date(periodeFin) : null;

                if ((minDate && rowDate < minDate) || (maxDate && rowDate > maxDate)) {
                    return false; // Hors de la plage
                }

                return true; // Dans la plage
            });

            // Fonction pour filtrer le tableau
            function filterTable() {
                var client = $('#client').val();
                var statusPaiement = $('#statusPaiement').val();
                var methodePaiement = $('#methodePaiement').val();

                // Filtrer par type d'envoi
                table.column(1).search(client ? '^' + client + '$' : '', true, false);

                // Filtrer par status
                table.column(6).search(statusPaiement ? '^' + statusPaiement + '$' : '', true, false);

                // Filtrer par agence
                table.column(7).search(methodePaiement ? '^' + methodePaiement + '$' : '', true, false);

                table.draw(); // Rafraîchir la table
            }

            // Écouter les changements sur les champs de filtrage
            $('#client, #statusPaiement, #methodePaiement, #periodeDebut, #periodeFin').on('change', function () {
                filterTable(); // Appliquer les filtres de colonnes
                table.draw(); // Appliquer le filtre de date
            });

            return table;
        }

        // Initialisation des DataTables
        initializeDataTable('.table');
    });
}

//todo : pour la suspension de contrat
const currentUrlSuspensionContrat = window.location.href;//Recuperation de l url actuel pour voir sii la page est celle de l'entrepot
if (currentUrlSuspensionContrat.indexOf("/rapport/suspension") !== -1) {
    $(document).ready(function () {
        // Fonction pour initialiser DataTable avec des options communes
        function initializeDataTable(selector) {
            const table = $(selector).DataTable({
                "order": [[0, "asc"]], // Tri par défaut
                "language": {
                    "paginate": {
                        "first": "Première", "last": "Dernière", "next": "Suivant", "previous": "Précédent"
                    },
                    "search": "Rechercher un élément ",
                    "lengthMenu": "Afficher _MENU_",
                    "info": "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
                    "infoEmpty": "Affichage de 0 à 0 sur 0 entrées",
                    "infoFiltered": "(filtré à partir de _MAX_ entrées au total)",
                    "zeroRecords": "Aucun enregistrement correspondant trouvé",
                    "emptyTable": "Aucune donnée disponible dans le tableau",
                    "loadingRecords": "Chargement...",
                    "processing": "Traitement..."
                }, "lengthMenu": [10, 25, 50, 100],
                dom: 'Bfrtip', buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fas fa-file-excel fa-1xl me-3 text-white"></i> Exporter en Excel',
                        className: 'btn text-white bg-success btn-custom-excel me-3',// Style personnalisé pour Excel
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
                            columns: ':not(:last-child)' // Exclure la dernière colonne (actions)
                        }
                    }]
            });

            // Ajout d'un filtre personnalisé pour la période (dates)
            $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                var periodeDebut = $('#periodeDebut').val();
                var periodeFin = $('#periodeFin').val();
                var dateIndex = 3; // Index de la colonne "DATE"
                var rowDate = new Date(data[dateIndex]); // Récupérer la date de la colonne

                if (!periodeDebut && !periodeFin) {
                    return true; // Pas de filtre de date
                }

                var minDate = periodeDebut ? new Date(periodeDebut) : null;
                var maxDate = periodeFin ? new Date(periodeFin) : null;

                if ((minDate && rowDate < minDate) || (maxDate && rowDate > maxDate)) {
                    return false; // Hors de la plage
                }

                return true; // Dans la plage
            });

            // Fonction pour filtrer le tableau
            function filterTable() {
                var typeEnvoi = $('#type_envoi').val();

                // Filtrer par type d'envoi
                table.column(1).search(typeEnvoi ? '^' + typeEnvoi + '$' : '', true, false);

                table.draw(); // Rafraîchir la table
            }

            // Écouter les changements sur les champs de filtrage
            $('#type_envoi, #periodeDebut, #periodeFin').on('change', function () {
                filterTable(); // Appliquer les filtres de colonnes
                table.draw(); // Appliquer le filtre de date
            });

            return table;
        }

        // Initialisation des DataTables
        initializeDataTable('.table');
    });
}

//todo : pour la renoullement de contrat
const currentUrlrenoullement = window.location.href;//Recuperation de l url actuel pour voir sii la page est celle de l'entrepot
if (currentUrlrenoullement.indexOf("/rapport/renouvelement") !== -1 || ("/rapport/prolongement") !== -1) {
    $(document).ready(function () {
        // Fonction pour initialiser DataTable avec des options communes
        function initializeDataTable(selector) {
            // Vérifier si le DataTable est déjà initialisé et le détruire si nécessaire
            if ($.fn.dataTable.isDataTable(selector)) {
                $(selector).DataTable().destroy(); // Détruire l'instance existante
            }
            const table = $(selector).DataTable({
                "order": [[0, "asc"]], // Tri par défaut
                "language": {
                    "paginate": {
                        "first": "Première", "last": "Dernière", "next": "Suivant", "previous": "Précédent"
                    },
                    "search": "Rechercher un élément ",
                    "lengthMenu": "Afficher _MENU_",
                    "info": "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
                    "infoEmpty": "Affichage de 0 à 0 sur 0 entrées",
                    "infoFiltered": "(filtré à partir de _MAX_ entrées au total)",
                    "zeroRecords": "Aucun enregistrement correspondant trouvé",
                    "emptyTable": "Aucune donnée disponible dans le tableau",
                    "loadingRecords": "Chargement...",
                    "processing": "Traitement..."
                }, "lengthMenu": [10, 25, 50, 100],
                dom: 'Bfrtip', buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fas fa-file-excel fa-1xl me-3 text-white"></i> Exporter en Excel',
                        className: 'btn text-white bg-success btn-custom-excel me-3',// Style personnalisé pour Excel
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
                            columns: ':not(:last-child)' // Exclure la dernière colonne (actions)
                        }
                    }]
            });

            // Ajout d'un filtre personnalisé pour la période (dates)
            $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                var periodeDebut = $('#periodeDebut').val();
                var periodeFin = $('#periodeFin').val();
                var dateDebut = 6; // Index de la colonne "DATE"
                var dateFin = 6; // Index de la colonne "DATE"
                var rowDebut = new Date(data[dateDebut]); // Récupérer la date de la colonne
                var rowFin = new Date(data[dateFin]); // Récupérer la date de la colonne

                if (!periodeDebut && !periodeFin) {
                    return true; // Pas de filtre de date
                }

                var minDate = periodeDebut ? new Date(periodeDebut) : null;
                var maxDate = periodeFin ? new Date(periodeFin) : null;

                if ((minDate && rowDebut < minDate) || (maxDate && rowFin > maxDate)) {
                    return false; // Hors de la plage
                }

                return true; // Dans la plage
            });

            // Fonction pour filtrer le tableau
            function filterTable() {
                var typeEnvoi = $('#type_envoi').val();

                // Filtrer par type d'envoi
                table.column(1).search(typeEnvoi ? '^' + typeEnvoi + '$' : '', true, false);

                table.draw(); // Rafraîchir la table
            }

            // Écouter les changements sur les champs de filtrage
            $('#type_envoi, #status, #agence, #periodeDebut, #periodeFin,#dateRenouvellement').on('change', function () {
                filterTable(); // Appliquer les filtres de colonnes
                table.draw(); // Appliquer le filtre de date
            });

            return table;
        }

        // Initialisation des DataTables
        initializeDataTable('.table');
    });
}

//todo : pour la depenses de contrat
const currentUrlDepense = window.location.href; // Vérification de l'URL
if (currentUrlDepense.indexOf("/rapport/depenses") !== -1) {

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
                    "search": "Rechercher un élément ",
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
                        className: 'btn text-white bg-success btn-custom-excel me-3',// Style personnalisé pour Excel
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

            $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                var periodeDebut = $('#periodeDebutDepense').val();
                var periodeFin = $('#periodeFinDepense').val();
                var statusSelected = $('#statusDepense').val();

                var dateIndex = 5; // Index de la colonne "DATE"
                var statusIndex = 3; // Index de la colonne "STATUS"

                var rowDate = new Date(data[dateIndex]); // Récupérer la date de la colonne
                var rowStatus = data[statusIndex]; // Récupérer le statut de la colonne

                // Filtrage par date
                var minDate = periodeDebut ? new Date(periodeDebut) : null;
                var maxDate = periodeFin ? new Date(periodeFin) : null;

                if ((minDate && rowDate < minDate) || (maxDate && rowDate > maxDate)) {
                    return false; // Date hors de la plage
                }

                // Filtrage par statut
                if (statusSelected !== 'aucune' && statusSelected !== rowStatus) {
                    return false; // Statut non correspondant
                }

                return true; // Passe tous les filtres
            });

            // Fonction pour calculer la somme des montants filtrés
            function calculateTotalAmount() {
                let total = 0;

                table.rows({filter: 'applied'}).data().each(function (rowData) {
                    const montantIndex = 1; // Index de la colonne des montants
                    const montantBrut = rowData[montantIndex];
                    console.log('Montant brut :', montantBrut);

                    // Nettoyage et conversion
                    let montant = parseFloat(montantBrut.replace(/[^0-9.-]+/g, ""));
                    if (!isNaN(montant)) {
                        montant = Math.abs(montant); // Convertir en positif si nécessaire
                        console.log('Montant valide :', montant);
                        total += montant; // Ajouter au total
                    } else {
                        console.log('Montant ignoré :', montantBrut);
                    }
                });

                // Afficher le total
                console.log('Total calculé :', total);
                $('#montantDepense').val(total.toFixed(2) + " F CFA");
            }

            // Rafraîchir le tableau et recalculer le total
            function filterTable() {
                table.draw(); // Rafraîchir les données filtrées
                calculateTotalAmount(); // Calculer le total
            }

            // Écouter les changements sur les champs de filtrage
            $('#periodeDebutDepense, #periodeFinDepense, #statusDepense').on('change', function () {
                filterTable(); // Appliquer les filtres
            });

            return table;
        }

        // Initialisation du DataTable
        initializeDataTable('.table');
    });
}

//todo : pour la les rapports de revenue
const currentUrlRevenus = window.location.href; // Vérification de l'URL
if (currentUrlRevenus.indexOf("/rapport/revenus") !== -1) {

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
                    "search": "Rechercher un élément ",
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
                        className: 'btn text-white bg-success btn-custom-excel me-3',// Style personnalisé pour Excel
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

            // Ajout d'un filtre personnalisé pour la période (dates)
            $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                var periodeDebut = $('#periodeDebut').val();
                var periodeFin = $('#periodeFin').val();
                var statusDepense = $('#statusDepense').val();
                var dateIndex = 4; // Index de la colonne contenant les dates

                var rowDate = new Date(data[dateIndex]); // Convertir la date de la ligne

                // Filtrage par période
                var isDateValid = true;
                if (periodeDebut || periodeFin) {
                    var minDate = periodeDebut ? new Date(periodeDebut) : null;
                    var maxDate = periodeFin ? new Date(periodeFin) : null;

                    if ((minDate && rowDate < minDate) || (maxDate && rowDate > maxDate)) {
                        isDateValid = false;
                    }
                }

                // Filtrage par statut
                var isStatusValid = true;
                if (statusDepense !== statusDepense) {
                    isStatusValid = false;
                }

                // Retourne vrai si les deux filtres (date et status) sont valides
                return isDateValid && isStatusValid;
            });

            // Fonction pour calculer la somme des montants filtrés
            function calculateTotalAmount() {
                let total = 0;

                table.rows({filter: 'applied'}).data().each(function (rowData) {
                    const montantIndex = 1; // Index de la colonne des montants
                    const montantBrut = rowData[montantIndex];
                    console.log('Montant brut :', montantBrut);

                    // Nettoyage et conversion
                    let montant = parseFloat(montantBrut.replace(/[^0-9.-]+/g, ""));
                    if (!isNaN(montant)) {
                        montant = Math.abs(montant); // Convertir en positif si nécessaire
                        console.log('Montant valide :', montant);
                        total += montant; // Ajouter au total
                    } else {
                        console.log('Montant ignoré :', montantBrut);
                    }
                });

                // Afficher le total
                console.log('Total calculé :', total);
                $('#montantDepense').val(total.toFixed(2) + " F CFA");
            }

            // Rafraîchir le tableau et recalculer le total
            function filterTable() {
                table.draw(); // Rafraîchir les données filtrées
                calculateTotalAmount(); // Calculer le total
            }

            // Écouter les changements sur les champs de filtrage
            $('#periodeDebut, #periodeFin').on('change', function () {
                filterTable(); // Appliquer les filtres
            });

            return table;
        }

        // Initialisation du DataTable
        initializeDataTable('.table');
    });
}