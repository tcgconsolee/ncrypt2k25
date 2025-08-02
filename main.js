import * as THREE from './three.module.js';
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

var loader = new THREE.FontLoader();
loader.load('./fonts/ncrypt.json', function (font) {
  
  var textGeo = new THREE.TextGeometry("nCrypt", {
    font: font,
    size: 100,
    height: 5,
    curveSegments: 12,
  });

  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();

  var centerOffsetX = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
  var centerOffsetY = -0.5 * (textGeo.boundingBox.max.y - textGeo.boundingBox.min.y);

  var textPoints = textGeo.vertices;

  // Create explosion from text shape
  parts.push(new ExplodeFromText(textPoints, centerOffsetX, centerOffsetY));

});

function ExplodeFromText(points, offsetX, offsetY) {
  var geometry = new THREE.Geometry();

  for (var i = 0; i < points.length; i++) {
    var vertex = points[i].clone();
    vertex.x += offsetX;
    vertex.y += offsetY;
    vertex.z += 0;

    geometry.vertices.push(vertex);
    dirs.push({
      x: (Math.random() * movementSpeed) - (movementSpeed / 2),
      y: (Math.random() * movementSpeed) - (movementSpeed / 2),
      z: (Math.random() * movementSpeed) - (movementSpeed / 2)
    });
  }

  var material = new THREE.PointsMaterial({
    size: objectSize,
    color: colors[Math.floor(Math.random() * colors.length)]
  });

  var particles = new THREE.Points(geometry, material);

  this.object = particles;
  this.status = true;

  scene.add(this.object);

  this.update = function () {
    if (!this.status) return;

    for (let i = 0; i < geometry.vertices.length; i++) {
      geometry.vertices[i].x += dirs[i].x;
      geometry.vertices[i].y += dirs[i].y;
      geometry.vertices[i].z += dirs[i].z;
    }
    geometry.verticesNeedUpdate = true;
  };
}