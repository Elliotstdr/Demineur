//Sélectionne les index des mines
let list_mines = [];

import {cellsToCheck} from "./CellsFinder.js";

//Crée autant de bouton que demandé dans l'appel
export function createCells(){
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
export function choseMine(index){
    //Empeche de placer une mine sur la case cliquée et sur les cases adjacentes
    let cellsCheck = cellsToCheck(index);
    let unvalidMineList = [index];
    cellsCheck.forEach((cellToCheck) => {
        unvalidMineList.push(cellToCheck);
    })
    
    while (list_mines.length < number_of_mines){
        let new_mine = Math.floor(Math.random()*(number_of_cells));
        if (list_mines.indexOf(new_mine) === -1 && unvalidMineList.includes(new_mine) == false){
            list_mines.push(new_mine);
        }
    }
   
    return list_mines
}

//Pour chaque cellule n'étant pas une mine cherche le nombre de mine adjacente
export function countMine(){
    //Compte le nombre de mine sur les 8 cases adjacentes
    const cells = Array.from(document.querySelectorAll("#corps button"));
    cells.forEach((cell) => { 
        let counter = 0;
        const indexOfCell = cells.indexOf(cell);
        const list_index = cellsToCheck(indexOfCell)

        if (list_mines.includes(indexOfCell) === false){
        //if (!cell.classList.contains("mine")){
            list_index.forEach((index) => {
                if (list_mines.includes(index) === true){
                //if (cells[index].classList.contains("mine")){
                    counter++;
                } 
            })
            //Ajoute un attibut value avec le nombre de mine adjacente en argument
            cell.setAttribute("value", counter.toString());
            
        }
    })
}