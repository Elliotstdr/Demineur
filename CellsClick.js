import {choseMine, countMine} from "./CellsBuilder.js";
import {blankCellsToReveal, aroundBlankCells} from "./CellsFinder.js";
import {mineClick, checkSolution, checkSolutionBis} from "./CellsClickExceptions.js";

let timer = 0;
let TimerStatus = false;
let revealedCellsList = [];
let list_mine = [];

//lance un timer au premier click et retourne le timer pour pouvoir l'arrêter
//appelle la fonction de positionnement des mines
//appelle la fonction de contage des mines adjacentes
function startTheCount(index){
    list_mine = choseMine(index);
    countMine();
    let second = 0;
    const timerElement = document.getElementById("timer");

    function countTime(){
        second++;
        timerElement.innerText = second; 
    }
    return setInterval(countTime, 1000);	
}

//Gère le clique gauche sur une cellule
export function leftClickButtons(){
	const cells = Array.from(document.querySelectorAll("#corps button"));

	cells.forEach((cell) => {
		cell.addEventListener("click", function(){
            //Empeche le clique s'il y a un flag
            if (!cell.classList.contains("flag")){
                //Si c'est une mine: stop le timer, affiche la mine en rouge et affiche toutes les autres mines
                if (list_mine.includes(cells.indexOf(cell)) === true){
                //if (cell.classList.contains("mine")){
                    mineClick(cell, list_mine);
                    clearInterval(timer);
                }
                else{
                    //Si premier clique: lance le timer
                    if (TimerStatus === false){
                        timer = startTheCount(cells.indexOf(cell));
                    }
                    
                    //Fait une liste avec l'indice de la case et des cases blanches autour
                    let blankCellList = blankCellsToReveal(cells.indexOf(cell), [cells.indexOf(cell)]);

                    //Si la case n'est pas blanche n'affiche pas les cases autour mais vérifie s'il y a des cases blanches autour
                    //Evite de révéler des cases si aucune autour n'est blanche
                    if (parseInt(cell.getAttribute("value")) !== 0 ){
                        blankCellList = blankCellList.slice(1,blankCellList.length);
                    }

                    let IndexCellsToReveal = blankCellList.concat(aroundBlankCells(blankCellList))
                    if (IndexCellsToReveal.length === 0){IndexCellsToReveal = [cells.indexOf(cell)]};

                    //Révèle les cases si elles n'ont pas de mines ou de drapeau
                    IndexCellsToReveal.forEach((element) => {
                        if (list_mine.includes(element) === false && !cells[element].classList.contains("flag")){
                        //if (!cells[element].classList.contains("mine") && !cells[element].classList.contains("flag")){
                            const valueButton = cells[element].getAttribute("value");
                            //Affiche le nombre de mine adjacente, change le background en blanc, désactive la case
                            if (parseInt(valueButton) !== 0){cells[element].textContent = valueButton}
                            else {cells[element].textContent = ""};
                            cells[element].classList.add("mine" + valueButton);
                            cells[element].disabled = true;
                            
                            //compte le nombre de case révélée. Si il est égal à 80, fin du game
                            if (revealedCellsList.includes(element) === false) {revealedCellsList.push(element)}
                            if (revealedCellsList.length === number_of_cells-number_of_mines){checkSolutionBis(timer, list_mine)};
                        }
                    })
                }
                TimerStatus = true;
            }
		})
	})
}

//Gère le clique droit sur la case
export function rightClickButtons(){
	const cells = Array.from(document.querySelectorAll("#corps button"));
	cells.forEach((cell) => {
		cell.addEventListener("contextmenu", function(e){
            e.preventDefault();


            //Si la cellule est à l'état de départ on met un drapeau
            //On baisse le compteur, s'il atteint 0 on regarde si on a fini
            if (!cell.classList.contains("flag") && !cell.classList.contains("ask")){
				cell.classList.add("flag");
                cell.innerHTML = '<img src="photo/drapeau.png" alt="Drapeau"></img>';
                document.getElementById("compteur").textContent 
                = parseInt(document.getElementById("compteur").textContent) - 1;
				if (parseInt(document.getElementById("compteur").textContent) ===0){
                    checkSolution(timer, list_mine);
                }
            }

            //Si la cellule a un drapeau on met un point d'interrogation
            //On réaugmente le compteur de mine, s'il passe à 0 on regarde si on a fini
			else if (cell.classList.contains("flag")){
				cell.classList.replace("flag", "ask");
                cell.innerHTML = "?"
                document.getElementById("compteur").textContent 
                = parseInt(document.getElementById("compteur").textContent) + 1;
                if (parseInt(document.getElementById("compteur").textContent) ===0){
                    checkSolution(timer, list_mine);
                }
			}

            //Si la cellule a un point d'interrogation on revient à l'état de départ
			else if (cell.classList.contains("ask")){
				cell.classList.remove("ask");
                cell.innerHTML = ""
			}
        })
	})
}