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

		// Cells on the grid - set to [0,0] since we manually place obstacles and seed cells below
		NRCELLS : [0, 0],
		MANUAL_CELL_COUNT: 37,  // Number of moving cells to seed

		// Obstacle configuration
		OBSTACLE_COUNT: 16,      // Number of obstacles (should be a perfect square: 0, 1, 4, 9, 16, 25...)
		OBSTACLE_SIZE: 10,      // Radius of circular obstacles

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

// Initialize simulation
let sim = new CPM.Simulation( config )

function placeObstacles(){
	let obstacleCount = config.simsettings.OBSTACLE_COUNT
	if(obstacleCount === 0) return

	let obstacleSize = config.simsettings.OBSTACLE_SIZE
	let fieldWidth = config.field_size[0]
	let fieldHeight = config.field_size[1]

	// Calculate grid size from count (assumes perfect square)
	let gridSize = Math.round(Math.sqrt(obstacleCount))
	let spacingX = fieldWidth / gridSize
	let spacingY = fieldHeight / gridSize

	// Place obstacles evenly spaced
	for(let i = 0; i < gridSize; i++){
		for(let j = 0; j < gridSize; j++){
			let x = spacingX/2 + i * spacingX
			let y = spacingY/2 + j * spacingY
			// Create a new cell of cellkind 1 (obstacle) and get its ID
			let obstacleID = sim.C.makeNewCellID(1)
			placeCircularObstacle(x, y, obstacleSize, obstacleID)
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
for(let i = 0; i < config.simsettings.MANUAL_CELL_COUNT; i++){
	sim.gm.seedCell(2)
}

// Run simulation
sim.run()
