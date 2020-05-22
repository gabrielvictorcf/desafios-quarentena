const BULLET_SIZE = 10;
const BULLET_SPEED = 1;

/**
* This is a class declaration
* This class is responsible for defining the bullets behavior.
* this class extends the MovableEntity class, which is responsible for defining physics behavior
* If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class Bullet extends MovableEntity {

	/**
	* @argument { HTMLDivElement } containerElement The DOM element that will contain the bullet
	* @argument { Map } mapInstance The map in which the bullet will spawn
	* @argument { Vector } direction The bullet's direction
	*/
	constructor (
		containerElement,
		mapInstance,
		direction,
		bulletPosition
	) {
		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, BULLET_SIZE, bulletPosition, direction.normalize().scale(BULLET_SPEED), direction);

		this.bulletSpecial = 1;
		this.bulletType = this.assignBulletType(); 

		this.mapInstance = mapInstance;

		// This is so the map can execute the player's physics (see the `frame` function
		// in the `map.js` file
		mapInstance.addEntity(this);

		// Assigns the bullet's image to it's element
		this.rootElement.style.backgroundImage = "url('assets/bullet.svg')";
		this.rootElement.style.backgroundSize = this.size + 'px';
	}

	/* 
	* Assigns a type on bullet creation, giving it acess
	* to a special function
	*/
	assignBulletType() {
		let allTypes = ["ricochet", "explosive", "common", "common", "common", "common"];
		let thisType = allTypes[Math.floor( (Math.random() * 6) - 1)];
		
		// assigns the bulletspecial property, which is interpreted
		// differently on each fuction
		this.bulletSpecial = 1;

		return thisType;
	}

	// If the bullet collides with an asteroid, delete the bullet.
	collided (object) {
		if (object instanceof Asteroid) {
			this.mapInstance.removeEntity(this);
			this.delete();
		}
	}

	/*  
	* Called when bullet in on map border and of "ricochet" type
	* reverses the velocity, effectively making it ricochet.
	* Here bulletSpecial stores how many ricochets are done.
	*/
	ricochet() {
		if (this.bulletSpecial != 0){
			this.bulletSpecial--;
			this.velocity = this.velocity.scale(-1);
		};
	}

	/* 
	* Called when bullet is shot, waits 800ms for explosion
	* and then another 500ms for deletion of the element.
	* Here bulletSpecial primes the explosion, acting as a boolean.
	*/
	explode() {
		this.bulletSpecial = 0;
		setTimeout(() => {
			this.size = 150;
			setTimeout(() => {
				this.delete;
			}, 0.5 * 1000)
		}, 0.8 * 1000);
	}
}