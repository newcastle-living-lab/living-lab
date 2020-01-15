import colours from 'colors.css';

export default {

	"structuralLineOuter": {
		points: [325, 365, 930, 25],
		stroke: colours.blue,
		strokeWidth: 3,
		lineCap: "square",
		lineJoin: "square"
	},

	"structuralLineInner": {
		points: [330, 370, 935, 30],
		stroke: colours.blue,
		strokeWidth: 3,
		lineCap: "square",
		lineJoin: "square"
	},

	"structuralText": {
		x: 570,
		y: 245,
		rotation: -30,
		text: "STRUCTURAL",
		fontStyle: "bold",
		fontSize: 12,
	},

	"resourcesShape": {
		x: 160,
		y: 320,
		rotation: -30,
		sides: 6,
		radius: 55,
		stroke: colours.black,
		strokeWidth: 1,
	},
	"resourcesText": {
		x: 160 - 55,
		width: 110,
		y: 320 - 6,
		text: 'Resources',
		fontStyle: 'bold',
		fontSize: 12,
		align: 'center'
	},


	"lawShape": {
		x: 95 - 55,
		y: 400,
		width: 110,
		height: 50,
		cornerRadius: 25,
		stroke: colours.black,
		strokeWidth: 1,
	},
	"lawText": {
		x: 95 - 55,
		width: 110,
		y: (400 + 25) - 6,
		text: 'LAW',
		fontStyle: 'bold',
		fontSize: 12,
		align: 'center'
	},


	"ethosShape": {
		x: 95 - 55,
		y: 480,
		width: 110,
		height: 75,
		stroke: colours.black,
		strokeWidth: 1,
	},
	"ethosText": {
		x: 95 - 55,
		width: 110,
		y: (480 + 37.5) - 6,
		text: 'ETHOS',
		fontStyle: 'bold',
		fontSize: 12,
		align: 'center'
	},


	"infrastructuralLineOuter": {
		points: [325, 535, 930, 885],
		stroke: colours.orange,
		strokeWidth: 3,
		lineCap: "square",
		lineJoin: "square"
	},

	"infrastructuralLineInner": {
		points: [330, 530, 935, 880],
		stroke: colours.orange,
		strokeWidth: 3,
		lineCap: "square",
		lineJoin: "square"
	},

	"infrastructuralText": {
		x: 570,
		y: 685,
		rotation: 30,
		text: "INFRASTRUCTURAL",
		fontStyle: "bold",
		fontSize: 12,
	},

};
