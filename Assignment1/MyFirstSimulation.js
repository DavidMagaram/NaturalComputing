// Run with: node MyFirstSimulation.js

let CPM = require("./artistoo_minimal/build/artistoo-cjs.js")

/*	----------------------------------
	CONFIGURATION SETTINGS
	----------------------------------
*/
let config = {

	// Grid settings
	ndim : 2,
	field_size : [200,200],

	// CPM parameters and configuration
	conf : {
		// Basic CPM parameters
		torus : [true,true],// Border. True = wrapped. False=borders.
		seed : 4,							// Seed for random number generation.
		T : 20,								// CPM temperature

		// Constraint parameters.
		// Mostly these have the format of an array in which each element specifies the
		// parameter value for one of the cellkinds on the grid.
		// First value is always cellkind 0 (the background) and is often not used.

		// Adhesion parameters: [background, obstacle, moving cell]
		J: [[0,20,20], [20,0,1000], [20,0,0]],

		// VolumeConstraint parameters
		LAMBDA_V: [0,500,50],					// Obstacle rigid, moving cell flexible
		V: [0,150,200],							// Same size for both

		// PerimeterConstraint parameters
		LAMBDA_P: [0,200,2],
		P : [0,10,180],

		// ActivityConstraint parameters
		LAMBDA_ACT : [0,0,200],				// Obstacle has NO activity
		MAX_ACT : [0,0,20],					// Obstacle cannot move
		ACT_MEAN : "geometric"

	},

	// Simulation setup and configuration
	simsettings : {

		// Cells on the grid: [1 obstacle, 1 moving cell]
		NRCELLS : [0, 37],	// Change this for more or less cells. First one is for obstacles. Set it to squares (3x3, 4x4, 5x5...). Second one is for moving (black) cells. 37 is number that just works. More will break it, less works fine.


		// V 150
		// Can only fit maximum of 37 (black) cells.
		// Spacing 100 = 4
		// Spacing 66 = 9 (anything between 60-70 works)
		// Spacingg 48 = 16
		// Spacing 38 = 25
		// Spacing 34 = 36

		// V 125
		// Spacing 100 = 4
		// Spacing 70/68/66 = 9
		// Spacingg 50 = 16

		// Runtime etc
		BURNIN : 0,
		RUNTIME : 600,

		FRAMERATE : 1,
		// Visualization
		CANVASCOLOR : "eaecef",
		CELLCOLOR : ["CCCCCC", "000000"],  // Blue obstacle, black moving cell
		ACTCOLOR : [false, true],
		SHOWBORDERS : [false, false],
		zoom : 2,

		// Output images
		SAVEIMG : true,
		IMGFRAMERATE : 1,
		SAVEPATH : "img",
		EXPNAME : "simulation",

		// Output stats etc
		STATSOUT : { browser: false, node: true },
		LOGRATE : 10

	}
}
/*	---------------------------------- */

// Custom initialization with obstacles
let customConfig = Object.assign({}, config.simsettings)
customConfig.NRCELLS = [0, 0]

let sim = new CPM.Simulation( config, customConfig )

function placeObstacles(){
	let obstacleID = 1
	let obstacleSize = 10
	let fieldWidth = config.field_size[0]
	let fieldHeight = config.field_size[1]

	// Grid pattern that adapts to field size
	let spacing = 100  // Distance between obstacles (keep even (2,4,6...))
	for(let x = spacing/2; x < fieldWidth; x += spacing){
		for(let y = spacing/2; y < fieldHeight; y += spacing){
			placeCircularObstacle(x, y, obstacleSize, obstacleID)
			obstacleID++
		}
	}
}

function placeCircularObstacle(centerX, centerY, radius, cellID){
	// Draw a circular obstacle
	for(let x = centerX - radius; x <= centerX + radius; x++){
		for(let y = centerY - radius; y <= centerY + radius; y++){
			// Check if pixel is within circle
			let dx = x - centerX
			let dy = y - centerY
			if(dx*dx + dy*dy <= radius*radius){
				sim.C.setpix([x, y], cellID)
			}
		}
	}
}

function placeSquareObstacle(centerX, centerY, size, cellID){
	// Draw a square obstacle
	let halfSize = Math.floor(size / 2)
	for(let x = centerX - halfSize; x <= centerX + halfSize; x++){
		for(let y = centerY - halfSize; y <= centerY + halfSize; y++){
			sim.C.setpix([x, y], cellID)
		}
	}
}

// Place obstacles first
placeObstacles()

// Seed moving cells
for(let i = 0; i < config.simsettings.NRCELLS[1]; i++){
	sim.gm.seedCell(2)
}

// Run simulation
sim.run()
