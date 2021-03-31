document.addEventListener('DOMContentLoaded', () => {
    let generateButton = document.getElementById('generate');
    let nbRow          = document.getElementById('row');
    let nbCol          = document.getElementById('col');
    let speed          = document.getElementById('speed');

    generateButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (nbRow.value.match(/^[0-9]+$/) && nbCol.value.match(/^[0-9]+$/) && nbCol.value && speed.value.match(/^[0-9]+$/)) {
            if (nbRow.value >= 5 && nbCol.value >= 5) {
                if(speed.value > 0){
                    new Maze(parseInt(nbRow.value), parseInt(nbCol.value), parseInt(speed.value));
                }else{
                    alert('La vitesse de résolution doit être supérieure à 0');
                }
            } else {
                alert('Le nombre de lignes et de colonnes doivent être au moins égales à 5');
            }
        } else {
            alert('Erreur dans les données du formulaire : les données doivent être des chiffres uniquement');
        }
    });
});