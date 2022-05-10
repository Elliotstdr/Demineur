//Gère le cas où on a cliqué sur une mine
//Affiche la mine en rouge, affiche toutes les autres mines
export function mineClick(cliquedCell, list_mine){
    document.getElementById("center_head").innerHTML = '<img src="photo/angry.png" alt="angry"></img>';
	cliquedCell.classList.add("red");
	const cells = Array.from(document.querySelectorAll("#corps button"));
	cells.forEach((cell) => {
        cell.disabled = true;
        if (list_mine.includes(cells.indexOf(cell)) === true){
		//if (cell.classList.contains("mine")){
			cell.innerHTML = '<img src="photo/mine.png" alt="Mine"></img>';
		}
	})	
}

//Quand le compteur de mine est à 0 vérifie si les bonnes mines ont été flaguée
export function checkSolution(timer, list_mine){
    let rightAnswer = 0;
    const cells = Array.from(document.querySelectorAll("#corps button"));

    //Compte le nombre de mines bien flagués
    cells.forEach((cell) => {
        if (list_mine.includes(cells.indexOf(cell)) === true && cell.classList.contains("flag")){
        //if (cell.classList.contains("mine") && cell.classList.contains("flag")){
            rightAnswer += 1;
        }
    })

    //S'il est égal au nombre total de mine: dévoile toutes les cases et stoppe le timer
    if (rightAnswer === number_of_mines){
        document.getElementById("center_head").innerHTML = '<img src="photo/sunny.png" alt="sunny"></img>';
        clearInterval(timer);
        cells.forEach((cell) => {
            cell.innerHTML = "";
            if (list_mine.includes(cells.indexOf(cell)) === true){
            //if (cell.classList.contains("mine")){
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

//Quand toutes les cases hors mines ont été cliqué
export function checkSolutionBis(timer, list_mine){
    const cells = Array.from(document.querySelectorAll("#corps button"));
    document.getElementById("center_head").innerHTML = '<img src="photo/sunny.png" alt="sunny"></img>';
    clearInterval(timer);
    cells.forEach((cell) => {
        cell.innerHTML = "";
        if (list_mine.includes(cells.indexOf(cell)) === true){
        //if (cell.classList.contains("mine")){
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