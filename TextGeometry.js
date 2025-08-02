
THREE.TextGeometry = function ( text, parameters ) {

	parameters = parameters || {};

	const font = parameters.font;

	if ( font === undefined ) {

		console.error( 'THREE.TextGeometry: font parameter is not passed.' );

		return new THREE.BufferGeometry();

	}

	const shapes = font.generateShapes( text, parameters.size );

	// translate parameters to Geometry options
	parameters.depth = parameters.height !== undefined ? parameters.height : 50;

	// create geometry from shapes
	const geometry = new THREE.ExtrudeGeometry( shapes, parameters );

	geometry.computeBoundingBox();

	const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );

	geometry.translate( xMid, 0, 0 );

	return geometry;

};

THREE.TextGeometry.prototype = Object.create( THREE.ExtrudeGeometry.prototype );
THREE.TextGeometry.prototype.constructor = THREE.TextGeometry;
