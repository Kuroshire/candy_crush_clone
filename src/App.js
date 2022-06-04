import { useState, useEffect } from "react";

const width = 8;
const candyColors = [
	'blue',
	'green',
	'orange',
	'purple',
	'red',
	'yellow'
];

const App = () => {

	const [currentColorArrangement, setCurrentColorArrangement] = useState([]);


	//region FUNCTION ----------------------------------------------------------------

	const checkForColumnOfFour = () => {
		
		let lastCell = (width * (width - 3) -1)
		console.log(lastCell);
		for(let i = 0; i < lastCell; i++){
			const columnOfFour = [i, i + width, i + width * 2, i + width * 2];
			const decidedColor = currentColorArrangement[i];

			if( columnOfFour.every(cell => currentColorArrangement[cell] === decidedColor)){
				columnOfFour.forEach(cell => currentColorArrangement[cell] = "");
			}
		}
	}

	const checkForColumnOfThree = () => {
		//we want to stop counting when we arrive at the last cell of the 3rd row from the bottom
		//last cell of row n = n * width - 1
		//3rd row from the bottom = width - 2 since first row = 0.
		let lastCell = (width * (width - 2) -1)
		console.log(lastCell);
		for(let i = 0; i < lastCell; i++){
			const columnOfThree = [i, i + width, i + width * 2];
			const decidedColor = currentColorArrangement[i];

			if( columnOfThree.every(cell => currentColorArrangement[cell] === decidedColor)){
				columnOfThree.forEach(cell => currentColorArrangement[cell] = "");
			}
		}
	}

	const checkForRowOfThree = () => {
		let lastCell = (width * (width - 2) -1)
		console.log(lastCell);
		for(let i = 0; i < width * width; i++){
			const columnOfThree = [i, i + width, i + width * 2];
			const decidedColor = currentColorArrangement[i];
			const notValid = "";

			if( columnOfThree.every(cell => currentColorArrangement[cell] === decidedColor)){
				columnOfThree.forEach(cell => currentColorArrangement[cell] = "");
			}
		}
	}



	const createBoard = () => {
		const randomColorArrangement = [];
		for (let i = 0; i < width * width; i++) {
			const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
			randomColorArrangement.push(randomColor);
		}

		setCurrentColorArrangement(randomColorArrangement);


	}

	//endregion ----------------------------------------------------------------------

	//region useEffect ------------------------------------------------
	
	useEffect(() => {
		createBoard();
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			checkForColumnOfFour();
			checkForColumnOfThree();
			setCurrentColorArrangement([...currentColorArrangement]);		
		}, 100);
		return () => clearInterval(timer);

	}, [checkForColumnOfThree, checkForColumnOfFour,currentColorArrangement]);

	//endregion -------------------------------------------------------


	console.log(currentColorArrangement);

  	return (
    	<div className="app">
			<div className="game">
				{currentColorArrangement.map((candyColor, index) => (
					<img
						key={index}
						style={{backgroundColor: candyColor}}
						alt={candyColor}
					/>
				))}
			</div>
      
    	</div>
  	);
}

export default App;
