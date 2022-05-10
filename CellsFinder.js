//Détermine les cases à regarder en fonction de la position de la case
export function cellsToCheck(indexOfCell){
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

export function blankCellsToReveal(indexcell, listOfCell){
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

export function aroundBlankCells(blankList){
    let result = [];
    blankList.forEach((element) => {
        let blankCellListCheck = cellsToCheck(element);
        blankCellListCheck.forEach((e) =>{
            if (result.includes(e) === false && blankList.includes(e) === false){
                result.push(e);
            }
        })
    })
    return(result)
}