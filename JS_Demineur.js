import {createCells} from "./CellsBuilder.js";
import {leftClickButtons, rightClickButtons} from "./CellsClick.js";

createCells();
leftClickButtons();
rightClickButtons();

//Refresh la page si on clique sur le smile
const smile = document.querySelector("#center_head");
smile.addEventListener("click", function(){
    window.location.reload();
})