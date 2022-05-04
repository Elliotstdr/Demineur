//Intégrer des classes
//Organiser en plusieurs fichiers
//Migrer github
//Cacher l'info des mines à l'inspecteur

let timer = 0;
const number_of_mines = 30;
const number_of_cells = 100;
let TimerStatus = false;

createCells();
leftClickButtons();
rightClickButtons();


//lance un timer au premier click et retourne le timer pour pouvoir l'arrêter
//appelle la fonction de positionnement des mines
//appelle la fonction de contage des mines adjacentes
function startTheCount(index){
    choseMine(index);
    countMine();
    let second = 0;
    const timerElement = document.getElementById("timer");

    function countTime(){
        second++;
        timerElement.innerText = second; 
    }
    return setInterval(countTime, 1000);	
}

//Crée autant de bouton que demandé dans l'appel
function createCells(){
    document.getElementById("compteur").textContent = number_of_mines;
    const cellWrapper = document.getElementById("corps");
    cellWrapper.innerHTML = "";
    for (let i = 0; i < number_of_cells; i++){
            const cell = document.createElement("button");
            cell.setAttribute("type", "button");
            cellWrapper.appendChild(cell);
    }
}

//Positionne le nombre de mine demandé dans createCells() aléatoirement
function choseMine(index){
    //Empeche de placer une mine sur la case cliquée et sur les cases adjacentes
    let cellsCheck = cellsToCheck(index);
    let unvalidMineList = [index];
    cellsCheck.forEach((cellToCheck) => {
        unvalidMineList.push(cellToCheck);
    })

    //Sélectionne les index des mines
    let list_mines = [];
    while (list_mines.length < number_of_mines){
        let new_mine = Math.floor(Math.random()*(100));
        if (list_mines.indexOf(new_mine) === -1 && unvalidMineList.includes(new_mine) == false){
            list_mines.push(new_mine);
        }
    }
    //Pour chaque cellule contenant une mine, lui ajoute une classe "mine"
    const cells = Array.from(document.querySelectorAll("#corps button"));
    list_mines.forEach((mine) => {
        cells[mine].classList.add("mine");
    })
}

//Pour chaque cellule n'étant pas une mine cherche le nombre de mine adjacente
function countMine(){
    //Compte le nombre de mine sur les 8 cases adjacentes
    const cells = Array.from(document.querySelectorAll("#corps button"));
    cells.forEach((cell) => { 
        let counter = 0;
        const indexOfCell = cells.indexOf(cell);
        const list_index = cellsToCheck(indexOfCell)

        if (!cell.classList.contains("mine")){
            list_index.forEach((index) => {
                if (cells[index].classList.contains("mine")){
                    counter++;
                } 
            })
            //Ajoute un attibut value avec le nombre de mine adjacente en argument
            cell.setAttribute("value", counter.toString());
            
        }
    })
}

//Détermine les cases à regarder en fonction de la position de la case
function cellsToCheck(indexOfCell){
    const n = Math.sqrt(number_of_cells);

    //Ajoute les index des cases sur le bord gauche
    let left_edge_list = [];  
    for (let i=0; i<n; i++){
        left_edge_list.push(i*n);
    }
    //Ajoute les index des cases sur le bord droit
    let rigth_edge_list = [];  
    for (let j=1; j<n+1; j++){
        rigth_edge_list.push((j*n)-1);
    }

    //si la case est sur le bord gauche
    if (left_edge_list.indexOf(indexOfCell) !== -1){
        return returnList([indexOfCell-n, indexOfCell-(n-1), indexOfCell+1, indexOfCell+n, indexOfCell+(n+1)]);
    }
    //si la case est sur le bord droit
    else if (rigth_edge_list.indexOf(indexOfCell) !== -1){
        return returnList([indexOfCell-(n+1), indexOfCell-n, indexOfCell-1, indexOfCell+(n-1), indexOfCell+n]);
    }
    //sinon
    else{
        return returnList([indexOfCell-(n+1), indexOfCell-n, indexOfCell-(n-1), indexOfCell-1, indexOfCell+1, indexOfCell+(n-1), indexOfCell+n, indexOfCell+(n+1)]);
    }

    function returnList(liste){
        let listToReturn = [];
        liste.forEach((element) => {
            if (element > -1 && element < 100){listToReturn.push(element)};
        })
        return listToReturn;
    }
}

//Gère le clique droit sur une cellule
function leftClickButtons(){
	const cells = Array.from(document.querySelectorAll("#corps button"));

	cells.forEach((cell) => {
		cell.addEventListener("click", function(){
            //Empeche le clique s'il y a un flag
            if (!cell.classList.contains("flag")){
                //Si c'est une mine: stop le timer, affiche la mine en rouge et affiche toutes les autres mines
                if (cell.classList.contains("mine")){
                    mineClick(cell);
                    clearInterval(timer);
                }
                else{
                    //Si premier clique: lance le timer
                    if (TimerStatus === false){
                        timer = startTheCount(cells.indexOf(cell));
                    }
                    
                    //Fait une liste avec l'indice de la case et des cases blanches autour
                    const blankCellList = blankCellsToReveal(cells.indexOf(cell), [cells.indexOf(cell)]);

                    //Si la case cliquée est blanche: révèle les cases autour
                    let sliceBlank = null;
                    if (parseInt(cell.getAttribute("value")) === 0 ){
                        sliceBlank = blankCellList;
                    }
                    //Sinon n'affiche pas les cases autour mais vérifie s'il y a des cases blanches autour
                    //Evite de révéler des cases si aucune autour n'est blanche
                    else{
                        sliceBlank = blankCellList.slice(1,blankCellList.length);
                    }
                    IndexCellsToReveal = blankCellList.concat(aroundBlankCells(sliceBlank))
                    //Révèle les cases si elles n'ont pas de mines ou de drapeau
                    IndexCellsToReveal.forEach((element) => {
                        if (!cells[element].classList.contains("mine") && !cells[element].classList.contains("flag")){
                            const valueButton = cells[element].getAttribute("value");
                            //Affiche le nombre de mine adjacente, change le background en blanc, désactive la case
                            if (parseInt(valueButton) !== 0){cells[element].textContent = valueButton}
                            else {cells[element].textContent = ""};
                            cells[element].classList.add("mine" + valueButton);
                            cells[element].disabled = true;
                        }
                    })
                }
                TimerStatus = true;
            }
		})
	})
}

//Gère le clique droit sur la case
function rightClickButtons(){
	const cells = Array.from(document.querySelectorAll("#corps button"));
	cells.forEach((cell) => {
		cell.addEventListener("contextmenu", function(e){
            e.preventDefault();

            //Si la cellule a un drapeau on met un point d'interrogation
            //On réaugmente le compteur de mine, s'il passe à 0 on regarde si on a fini
			if (cell.classList.contains("flag")){
				cell.classList.replace("flag", "ask");
                cell.innerHTML = "?"
                document.getElementById("compteur").textContent 
                = parseInt(document.getElementById("compteur").textContent) + 1;
                if (parseInt(document.getElementById("compteur").textContent) ===0){
                    checkSolution();
                }
			}

            //Si la cellule a un point d'interrogation on revient à l'état de départ
			else if (cell.classList.contains("ask")){
				cell.classList.remove("ask");
                cell.innerHTML = ""
			}

            //Si la cellule est à l'état de départ on met un drapeau
            //On baisse le compteur, s'il atteint 0 on regarde si on a fini
			else{
				cell.classList.add("flag");
                cell.innerHTML = '<img src="photo/drapeau.png" alt=""></img>';
                document.getElementById("compteur").textContent 
                = parseInt(document.getElementById("compteur").textContent) - 1;
				if (parseInt(document.getElementById("compteur").textContent) ===0){
                    checkSolution();
                }
			}
        })
	})
}

//Gère le cas où on a cliqué sur une mine
//Affiche la mine en rouge, affiche toutes les autres mines
function mineClick(cliquedCell){
    document.getElementById("center_head").innerHTML = '<img src="photo/angry.png" alt="angry"></img>';
	cliquedCell.classList.add("red");
	const cells = Array.from(document.querySelectorAll("#corps button"));
	cells.forEach((cell) => {
        cell.disabled = true;
		if (cell.classList.contains("mine")){
			cell.innerHTML = '<img src="photo/mine.png" alt="Mine"></img>';
		}
	})	
}

//Quand le compteur de mine est à 0 vérifie si les bonnes mines ont été flaguée
function checkSolution(){
    let rightAnswer = 0;
    const cells = Array.from(document.querySelectorAll("#corps button"));

    //Compte le nombre de mines bien flagués
    cells.forEach((cell) => {
        if (cell.classList.contains("mine") && cell.classList.contains("flag")){
            rightAnswer += 1;
        }
    })

    //S'il est égal au nombre total de mine: dévoile toutes les cases et stoppe le timer
    if (rightAnswer === number_of_mines){
        document.getElementById("center_head").innerHTML = '<img src="photo/sunny.png" alt="sunny"></img>';
        clearInterval(timer);
        cells.forEach((cell) => {
            cell.innerHTML = "";
            if (cell.classList.contains("mine")){
                cell.innerHTML = '<img src="photo/mine.png" alt="Mine"></img>';
                cell.disabled = true;
            }
            else{
                const valueButton = cell.getAttribute("value");
				if (parseInt(valueButton) !== 0){cell.textContent = valueButton};
                cell.classList.add("mine" + valueButton);
				cell.disabled = true;
            }
        })
    }
}

function blankCellsToReveal(indexcell, listOfCell){
    const cells = Array.from(document.querySelectorAll("#corps button"));
    let aroundCell = cellsToCheck(indexcell);
    let unreveal = false;

    aroundCell.forEach((cell) =>{
        if (parseInt(cells[cell].getAttribute("value")) === 0 && listOfCell.includes(cell) == false){
            listOfCell.push(cell);
            unreveal = true;
            return blankCellsToReveal(cell, listOfCell);
        }
    })
    return listOfCell
}

function aroundBlankCells(blankList){
    result = blankList;
    blankList.forEach((element) => {
        let blankCellListCheck = cellsToCheck(element);
        blankCellListCheck.forEach((e) =>{
            if (result.includes(e) == false){
                result.push(e);
            }
        })
    })
    return(result)
}

//Refresh la page si on clique sur le smile
const smile = document.querySelector("#center_head");
smile.addEventListener("click", function(){
    window.location.reload();
})