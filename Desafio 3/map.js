/**
* This is a class declaration
* This class is responsible for defining the Map behavior
* There should be only one map in the game, so this is a Singleton class.
* If you'd like to know more about the singleton pattern, see this link:
* https://en.wikipedia.org/wiki/Singleton_pattern
*/
class Map {

	/**
	* @argument { HTMLDivElement } containerElement
	*/
	constructor (containerElement) {
		// This array will contain all of the game's movableEntities.
		// All movableEntities will have it's physics updated in the `frame` function,
		// and will also be checked for possible collisions every frame.
		this.movableEntities = [];

		this.containerElement = containerElement;

		// This is to allow for the map to set it's difficulty based on the game's time length
		this.gameStartTimestamp = Date.now();
	}

	/**
	* Adds the entity to the movableEntity list. All entities on the movableEntity list
	* will have it's physics updated in the `frame function`, and will be checked for
	* possible collisions.
	* @argument { MovableEntity } entity
	*/
	addEntity (entity) {
		this.movableEntities.push(entity);
	}

	/**
	* Removes an entity from the movableEntities list. This should be done when
	* and entity is destroyed, and wont be needing physics updating anymore.
	* Very importante to conserve resources (memory and processing).
	* @argument { MovableEntity } entity
	*/
	removeEntity (entity) {
		// Here, we will find the index o the entity, and use it to remove the element from the
		// movableEntities array.
		// If you don't know how the splice method works, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
		// If you dont't know how the findIndex method works, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
		this.movableEntities.splice(this.movableEntities.findIndex(a => a === entity), 1);
	}

	/**
	* Checks if the two entities collidade, and if they did, call their `collided` method.
	* It will ignore collisions between asteroids with asteroids and players with bullets.
	* the instanceof operator will check if an object was created by a class, or one of it's children.
	* If you'd like to know more about the instanceof operator, see this link:
	* https://www.geeksforgeeks.org/instanceof-operator-in-javascript/
	* @argument { MovableEntity } entity1
	* @argument { MovableEntity } entity2
	*/
	verifyForCollision (entity1, entity2) {
		if (entity1 instanceof Asteroid && entity2 instanceof Asteroid) return;
		if (entity1 instanceof Player && entity2 instanceof Bullet) return;
		if (entity1 instanceof Bullet && entity2 instanceof Player) return;

		if (MovableEntity.didEntitiesColide(entity1, entity2)) {
			entity1.collided(entity2);
			entity2.collided(entity1);
		}
	}

	/**
	* This function will check if an asteroid should spawn at the current game frame.
	* @returns { boolean }
	*/
	shouldAsteroidSpawn () {
		// Note that the formula considers how long the gave have been going.
		// the longed the game, the higher the chance to spawn more asteroids.
		// In case the player doesn't destroy many asteroids and the game's duration
		// is considerate, this hurts perfomance.
		// const asteroidSpawnChance = 0.003 + Math.sqrt(Date.now() - this.gameStartTimestamp) / 10000000;

		// With a static rate the performance should be better overall
		const asteroidSpawnChance = 0.005;


		return Math.random() < asteroidSpawnChance;
	}

	/*
	* This function should be executed every game frame. It will call all of it's
	* movableObjects's frame functions (which will update their physics), and
	* handle any collision that happened.
	*/
	frame () {
		// Call the frame function on all movableEntities
		this.movableEntities.forEach(entity => entity.frame());

		for (let i = 0; i < this.movableEntities.length; i ++) {
			const entity1 = this.movableEntities[i];
			// Used to process new bullet functions
			if (entity1 instanceof Bullet){
				if (entity1.distanceFromCenter() > 280 && entity1.bulletType === "ricochet") entity1.ricochet();
				if (entity1.bulletType === "explosive") entity1.explode();
			};
			 
			for (let j = i + 1; j < this.movableEntities.length; j ++) {
				// Verify collision between all game objects
				const entity2 = this.movableEntities[j];
				this.verifyForCollision(entity1, entity2);
			}

			// if the entity is too far from the center, delete it to conserve processing power.
			if (entity1.distanceFromCenter() > 300) entity1.delete();
		}

		// Once the physics has been calculated, and collisions have been checked,
		// see if any asteroid shouold spawn
		if (this.shouldAsteroidSpawn()) {
			// pick a random position for the asteroid
			const position = new Vector(Math.random() - 0.5, Math.random() - 0.5).normalize().scale(299);

			// create the asteroid
			new Asteroid(this.containerElement, this, position);
		}
	}
}