import { useState, useEffect } from "react";
import { blueCandy, greenCandy, orangeCandy, purpleCandy, redCandy, yellowCandy, blank } from "./images";
import ScoreBoard from "./Component/ScoreBoard";
import { waitFor } from "@testing-library/dom";

const width = 8;
const candyColors = [
	blueCandy,
	greenCandy,
	orangeCandy,
	purpleCandy,
	redCandy,
	yellowCandy
];

const App = () => {

	const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
	const [squareBeingDragged, setSquareBeingDragged] = useState(null);
	const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);

	const [scoreDisplay, setScoreDisplay] = useState(0);



	//region FUNCTION ----------------------------------------------------------------

	const checkForColumnOfFour = () => {
		
		let lastCell = (width * (width - 3) -1)
		for(let i = 0; i < lastCell; i++){
			const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
			const decidedColor = currentColorArrangement[i];
			const isBlank = currentColorArrangement[i] === blank;

			if( columnOfFour.every(cell => currentColorArrangement[cell] === decidedColor && !isBlank)){
				setScoreDisplay( (score) => score + 400 );
				columnOfFour.forEach(cell => currentColorArrangement[cell] = blank);
				//console.log(decidedColor);
				//console.log("check col 4")
				return true;
			}
		}
	}

	const checkForColumnOfThree = () => {
		//we want to stop counting when we arrive at the last cell of the 3rd row from the bottom
		//last cell of row n = n * width - 1
		//3rd row from the bottom = width - 2 since first row = 0.
		let lastCell = (width * (width - 2) -1)
		for(let i = 0; i < lastCell; i++){
			const columnOfThree = [i, i + width, i + width * 2];
			const decidedColor = currentColorArrangement[i];
			const isBlank = currentColorArrangement[i] === blank;


			if( columnOfThree.every(cell => currentColorArrangement[cell] === decidedColor && !isBlank)){
				setScoreDisplay( (score) => score + 300 );
				columnOfThree.forEach(cell => currentColorArrangement[cell] = blank);
				//console.log(decidedColor);
				//console.log("check col 3")
				return true;

			}
		}
	}

	const checkForRowOfFour = () => {
		for(let i = 0; i < width * width; i++){
			const rowOfFour = [i, i + 1, i + 2, i + 3];
			const decidedColor = currentColorArrangement[i];
			const isBlank = currentColorArrangement[i] === blank;

			
			if(i%width >= width - 3){
				continue;
			}

			if( rowOfFour.every(cell => currentColorArrangement[cell] === decidedColor && !isBlank)){
				setScoreDisplay( (score) => score + 400 );
				rowOfFour.forEach(cell => { currentColorArrangement[cell] = blank });
				//console.log(decidedColor);
				//console.log("check row 4")
				return true;
			}
		}
	}

	const checkForRowOfThree = () => {
		for(let i = 0; i < width * width; i++){
			const rowOfThree = [i, i + 1, i + 2];
			const decidedColor = currentColorArrangement[i];
			const isBlank = currentColorArrangement[i] === blank;

			
			if(i%width >= width - 2){
				continue;
			}

			if( rowOfThree.every(cell => currentColorArrangement[cell] === decidedColor && !isBlank)){
				setScoreDisplay( (score) => score + 300 );
				rowOfThree.forEach(cell => { currentColorArrangement[cell] = blank });
				//console.log(decidedColor);
				//console.log("check row 3")
				return true;
			}
		}
	}

	const moveIntoSquareBelow = () => {
		for(let i= 0; i < width * (width-1); i++) {

			let isFirstRow = (i < width)
			if( isFirstRow && currentColorArrangement[i] ===blank) {
				let randomNumber = Math.floor( Math.random() * candyColors.length )
				currentColorArrangement[i] = candyColors[randomNumber]
			}

			if((currentColorArrangement[i + width]) === blank) {
				currentColorArrangement[i + width] = currentColorArrangement[i];
				currentColorArrangement[i] = blank;
			}
		}
	}

	const dragStart = (e) => {
		setSquareBeingDragged(e.target);
	}

	const dragDrop = (e) => {

		setSquareBeingReplaced(e.target);
	}

	const dragEnd = (e) => {
		const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'));
		const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));
		
		const validMoves = [
			squareBeingDraggedId - 1,
			squareBeingDraggedId - width,
			squareBeingDraggedId + 1,
			squareBeingDraggedId + width
		]

		const validMove = validMoves.includes(squareBeingReplacedId);
		if( validMove === true) {
			currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute("src");
			currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute("src");
		}

/*
		const isColumnOfFour = checkForColumnOfFour();
		const isRowOfFour = checkForRowOfFour();
		const isColumnOfThree = checkForColumnOfThree();
		const isRowOfThree = checkForRowOfThree();
*/
		/*
		if(squareBeingReplacedId &&
		validMove &&
		(isColumnOfFour || isRowOfFour || isColumnOfThree || isRowOfThree)) {
			setSquareBeingDragged(null);
			setSquareBeingReplaced(null);
		} 
		*/
		setSquareBeingDragged(null);
		setSquareBeingReplaced(null);
	}

	const createBoard = () => {
		const randomColorArrangement = [];
		for (let i = 0; i < width * width; i++) {
			const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
			randomColorArrangement.push(randomColor);
		}

		setCurrentColorArrangement(randomColorArrangement);


	}

	const prepareScore = () => {
		setScoreDisplay(0);
	}


	//endregion ----------------------------------------------------------------------

	//region useEffect ------------------------------------------------
	
	useEffect(() => {
		createBoard();

		setTimeout(() => {
			prepareScore();
		}, 2000);

	}, []);

	useEffect(() => {
		const timer = setInterval(() => {

			checkForColumnOfFour();
			checkForRowOfFour();

			checkForColumnOfThree();			
			checkForRowOfThree();

			setCurrentColorArrangement([...currentColorArrangement]);		
		}, 100);
		return () => clearInterval(timer);

	}, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, currentColorArrangement]);

	useEffect(() => {
		const timer = setInterval(() => {

			moveIntoSquareBelow();

			setCurrentColorArrangement([...currentColorArrangement]);		
		}, 100);
		return () => clearInterval(timer);

	}, [moveIntoSquareBelow, currentColorArrangement]);

	//endregion -------------------------------------------------------

  	return (
    	<div className="app">
			<div className="game">
				{currentColorArrangement.map((candyColor, index) => (
					<img
						key={index}
						src={candyColor}
						alt={{backgroundColor: candyColor}}
						data-id={index}
						draggable={true}
						onDragStart={dragStart}
						onDragOver={ (e) => e.preventDefault()}
						onDragEnter={ (e) => e.preventDefault()}
						onDragLeave={ (e) => e.preventDefault()}
						onDrop={dragDrop}
						onDragEnd={dragEnd}
					/>
				))}
			</div>

			<ScoreBoard score = {scoreDisplay} />
      
    	</div>
  	);
}

export default App;
