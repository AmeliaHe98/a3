// CHECK WEBGL VERSION
if ( WEBGL.isWebGL2Available() === false ) {
  document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );
}

// Scene Modes
var Part = {
    GOURAUD: 0,
    PHONG: 1,
    BLINNPHONG: 2,
    FOG: 3,
    SPOTLIGHT: 4,
    TOON: 5,
    HATCH: 6,
    COUNT: 7,
}
var mode = Part.GOURAUD// current mode

// Setup renderer
var container = document.createElement( 'div' );
document.body.appendChild( container );

var canvas = document.createElement("canvas");
var context = canvas.getContext( 'webgl2' );
var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
renderer.setClearColor(0xd0f0d0); // background colour
container.appendChild( renderer.domElement );

// Adapt backbuffer to window size
function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    for (let i = 0; i < Part.COUNT; ++i) {
        cameras[i].aspect = window.innerWidth / window.innerHeight;
        cameras[i].updateProjectionMatrix();
    }
}

THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// Hook up to event listener
window.addEventListener('resize', resize);

// Disable scrollbar functi on
window.onscroll = function() {
    window.scrollTo(0, 0);
}

// Setup scenes
var scenes = [
    new THREE.Scene(),
    new THREE.Scene(),
    new THREE.Scene(),
    new THREE.Scene(),
    new THREE.Scene(),
    new THREE.Scene(),
    new THREE.Scene()
]

// Setting up all shared objects
var cameras = [];
var controls = [];
var worldFrames = [];
var floorTextures = [];
var floorMaterials = [];
var floorGeometries = [];
var floors = [];


for (let i = 0; i < Part.COUNT; ++i) {
    cameras[i] = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
    cameras[i].position.set(0,10,20);
    cameras[i].lookAt(scenes[i].position);
    scenes[i].add(cameras[i]);

    var directionlight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    directionlight.position.set(5, 8, 5);
    scenes[i].add(directionlight);

    // orbit controls
    controls[i] = new THREE.OrbitControls(cameras[i]);
    controls[i].damping = 0.2;
    controls[i].autoRotate = false;

    worldFrames[i] = new THREE.AxisHelper(2);
    scenes[i].add(worldFrames[i]);

    // FLOOR WITH PATTERN
    floorTextures[i] = (new THREE.TextureLoader().load('images/paper.jpg'));
    floorTextures[i].wrapS = floorTextures[i].wrapT = THREE.RepeatWrapping;
    floorTextures[i].repeat.set(1, 1);
    floorMaterials[i] = new THREE.MeshBasicMaterial({ map: floorTextures[i], side: THREE.DoubleSide });
    floorGeometries[i] =new THREE.PlaneBufferGeometry(90.0, 90.0);
    floors[i] = new THREE.Mesh(floorGeometries[i], floorMaterials[i]);
    floors[i].rotation.x = Math.PI / 2;
    floors[i].parent = worldFrames[i];
    scenes[i].add(floors[i]);

}
resize();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////
// Parameters defining the light position
var lightColor = new THREE.Color(1.0,1.0,1.0);
var lightFogColor = new THREE.Color(0.5,0.5,0.5);
var ambientColor = new THREE.Color(0.4,0.4,0.4);
var lightDirection = new THREE.Vector3(0.49,0.79, 0.49);
var spotlightPosition = new THREE.Vector3(0,7.0,0);
var coolColor = new THREE.Vector3(.0,0.0,.9);
var warmColor = new THREE.Vector3(.9,0.0,.0);
//var objectColor = new THREE.Vector3(0.0,0.0,0.0);
//var spotlightDirection = new THREE.Vector3(0.49,0.79, 0.49);


// Material properties
var kAmbient = 0.4;
var kDiffuse = 0.8;
var kSpecular = 0.8;
var shininess = 10.0;

// Uniforms
var catPosition = {type: 'v3', value: new THREE.Vector3(0.0,0.0,0.0)};
var lightColorUniform = {type: "c", value: lightColor};
var lightFogColorUniform = {type: "c", value: lightFogColor};
var ambientColorUniform = {type: "c", value: ambientColor};
var lightDirectionUniform = {type: "v3", value: lightDirection};
var spotlightPosition = {type: "v3", value: spotlightPosition};
var coolColorUniform = {type: "v3", value: coolColor};
var warmColorPosition = {type: "v3", value: warmColor};
//var objectColorUniform = {type: "v3", value: objectColor};


var kAmbientUniform = {type: "f", value: kAmbient};
var kDiffuseUniform = {type: "f", value: kDiffuse};
var kSpecularUniform = {type: "f", value: kSpecular};
var shininessUniform = {type: "f", value: shininess};
var fogDensity = {type: "f", value: 0.02};

// Change this with keyboard controls in Part 1.D
var spotDirectPosition = {type: 'v3', value: new THREE.Vector3(0.0,0.0,0.0)};
var normalMaterial = new THREE.MeshNormalMaterial();

// CREATIVE ORTRICH
// MATERIALS
//var normalMaterial = new THREE.MeshNormalMaterial();


// GEOMETRY
var torsoGeometry = new THREE.SphereGeometry(2.5, 64, 64); // centered on origin
for (var i = 0; i < torsoGeometry.vertices.length; i++)
{
  torsoGeometry.vertices[i].z *= 1.4;
}
var neckGeometry = new THREE.CylinderGeometry(.4, .4, 4.5, 32);
var headGeometry = new THREE.SphereGeometry(0.7, 32, 32);
for (var i = 0; i < headGeometry.vertices.length; i++)
{
  headGeometry.vertices[i].z *= 1.5;
}
var thighGeometry = new THREE.CylinderGeometry(.8, .3, 3, 32);
for (var i = 0; i < thighGeometry.vertices.length; i++)
{
  thighGeometry.vertices[i].y -= 1.5;
}
var lowerlegGeometry = new THREE.CylinderGeometry(.3, .25, 4, 32);
for (var i = 0; i < lowerlegGeometry.vertices.length; i++)
{
  lowerlegGeometry.vertices[i].y -= 2;
}

var wingGeometry = new THREE.SphereGeometry(2, 64, 64); // centered on origin
for (var i = 0; i < wingGeometry.vertices.length; i++)
{
  wingGeometry.vertices[i].z *= 1.4;
  wingGeometry.vertices[i].x *= 0.2;
  wingGeometry.vertices[i].y *= 1;
}


// MATRICES
var torsoMatrix = new THREE.Matrix4().set(1,0,0,-5, 0,1,0,7, 0,0,1,0, 0,0,0,1);
var neckMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,3.5, 0,0,1,2.5, 0,0,0,1);
var necktorsoMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, neckMatrix);
var headMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,2.5, 0,0,1,0.5, 0,0,0,1);
var headnecktorsoMatrix = new THREE.Matrix4().multiplyMatrices(necktorsoMatrix, headMatrix);
var winglMatrix = new THREE.Matrix4().set(1,0,0,2.5, 0,1,0,-1, 0,0,1,-1, 0,0,0,1);
var wingltorsoMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, winglMatrix);
var wingrMatrix = new THREE.Matrix4().set(1,0,0,-2.5, 0,1,0,-1, 0,0,1,-1, 0,0,0,1);
var wingrtorsoMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, wingrMatrix);

//initialize matrices for legs here:
var thighlMatrix = new THREE.Matrix4().set(1,0,0,1, 0,1,0,-1.5, 0,0,1,0, 0,0,0,1);
var thighltorsoMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, thighlMatrix);
var thighrMatrix = new THREE.Matrix4().set(1,0,0,-1, 0,1,0,-1.5, 0,0,1,0, 0,0,0,1);
var thighrtorsoMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, thighrMatrix);

var leglMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,-3, 0,0,1,0, 0,0,0,1);
var leglthighltorsoMatrix = new THREE.Matrix4().multiplyMatrices(thighltorsoMatrix, leglMatrix);
var legrMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,-3, 0,0,1,0, 0,0,0,1);
var legrthighrtorsoMatrix = new THREE.Matrix4().multiplyMatrices(thighrtorsoMatrix, legrMatrix);

var torso = new THREE.Mesh(torsoGeometry, normalMaterial);
torso.setMatrix(torsoMatrix);
scenes[Part.HATCH].add(torso);


var neck = new THREE.Mesh(neckGeometry, normalMaterial);
neck.setMatrix(necktorsoMatrix);
scenes[Part.HATCH].add(neck);

var head = new THREE.Mesh(headGeometry, normalMaterial);
head.setMatrix(headnecktorsoMatrix);
scenes[Part.HATCH].add(head);

//create legs and add them to the scene here:
var thighl = new THREE.Mesh(thighGeometry, normalMaterial);
thighl.setMatrix(thighltorsoMatrix);
scenes[Part.HATCH].add(thighl);


var thighr = new THREE.Mesh(thighGeometry, normalMaterial);
thighr.setMatrix(thighrtorsoMatrix);
scenes[Part.HATCH].add(thighr);

var legl = new THREE.Mesh(lowerlegGeometry, normalMaterial);
legl.setMatrix(leglthighltorsoMatrix);
scenes[Part.HATCH].add(legl);

var legr = new THREE.Mesh(lowerlegGeometry, normalMaterial);
legr.setMatrix(legrthighrtorsoMatrix);
scenes[Part.HATCH].add(legr);


var wingl = new THREE.Mesh(wingGeometry, normalMaterial);
wingl.setMatrix(wingltorsoMatrix);
scenes[Part.HATCH].add(wingl);

var wingr = new THREE.Mesh(wingGeometry, normalMaterial);
wingr.setMatrix(wingrtorsoMatrix);
scenes[Part.HATCH].add(wingr);

//MOVING OSTRICH
//APPLY DIFFERENT EFFECTS TO DIFFERNET CHANNELS
var clock = new THREE.Clock(true);
function updateBody() {

    //animation
        var t = clock.getElapsedTime();


        //set meshes back to original position
        torso.setMatrix(torsoMatrix);
        neck.setMatrix(necktorsoMatrix);
        head.setMatrix(headnecktorsoMatrix);
        thighl.setMatrix(thighltorsoMatrix);
        thighr.setMatrix(thighrtorsoMatrix);
        legl.setMatrix(leglthighltorsoMatrix);
        legr.setMatrix(legrthighrtorsoMatrix);



        //animate legs here:


        //rotate left thigh
        var thighlRotateAngle = Math.cos(10*t)*Math.PI/5;
        var thighlRotateMatrix = new THREE.Matrix4().set(1,0,0,0,
                                                         0,Math.cos(thighlRotateAngle),-Math.sin(thighlRotateAngle),0,
                                                         0,Math.sin(thighlRotateAngle),Math.cos(thighlRotateAngle),0,
                                                         0,0,0,1);

        var thighltorsoRotateMatrix = new THREE.Matrix4().multiplyMatrices(thighltorsoMatrix, thighlRotateMatrix);
        thighl.setMatrix(thighltorsoRotateMatrix);

        //rotate right thigh
        var thighrRotateAngle = -Math.cos(10*t)*Math.PI/5;
        var thighrRotateMatrix = new THREE.Matrix4().set(1,0,0,0,
                                                         0,Math.cos(thighrRotateAngle),-Math.sin(thighrRotateAngle),0,
                                                         0,Math.sin(thighrRotateAngle),Math.cos(thighrRotateAngle),0,
                                                         0,0,0,1);

        var thighrtorsoRotateMatrix = new THREE.Matrix4().multiplyMatrices(thighrtorsoMatrix, thighrRotateMatrix);
        thighr.setMatrix(thighrtorsoRotateMatrix);


        //rotate left leg
        var leglRotateAngle = Math.cos(10*t)*Math.PI/4*0.5;
        var rotateAngle = Math.cos(5*t)*Math.PI/3*(-0.5);
        var rotateMatrix = new THREE.Matrix4().set(1,0,0,0,
                                                         0,Math.cos(rotateAngle),-Math.sin(rotateAngle),0,
                                                         0,Math.sin(rotateAngle),Math.cos(rotateAngle),0,
                                                         0,0,0,1);
        var leglthighltorsoRotateMatrix = new THREE.Matrix4().multiplyMatrices(thighltorsoRotateMatrix,leglMatrix);
        var leglRotateMatrix = new THREE.Matrix4().set(1,0,0,0,
                                                         0,Math.cos(leglRotateAngle),-Math.sin(leglRotateAngle),0,
                                                         0,Math.sin(leglRotateAngle),Math.cos(leglRotateAngle),0,
                                                         0,0,0,1);

            leglthighltorsoRotateMatrix = new THREE.Matrix4().multiplyMatrices(leglthighltorsoRotateMatrix,leglRotateMatrix);
            leglthighltorsoRotateMatrix.multiply(rotateMatrix);
        legl.setMatrix(leglthighltorsoRotateMatrix);

        //rotate right leg
        var legrRotateAngle = Math.cos(10*t)*Math.PI/4*0.5;
        var legrthighrtorsoRotateMatrix = new THREE.Matrix4().multiplyMatrices(thighrtorsoRotateMatrix,legrMatrix);
        var legrRotateMatrix = new THREE.Matrix4().set(1,0,0,0,
                                                         0,Math.cos(legrRotateAngle),-Math.sin(legrRotateAngle),0,
                                                         0,Math.sin(legrRotateAngle),Math.cos(legrRotateAngle),0,
                                                         0,0,0,1);

            legrthighrtorsoRotateMatrix = new THREE.Matrix4().multiplyMatrices(legrthighrtorsoRotateMatrix,legrRotateMatrix);
            legrthighrtorsoRotateMatrix.multiply(rotateMatrix);
        legr.setMatrix(legrthighrtorsoRotateMatrix);
      }

// Materials

var spotlightMaterial = new THREE.ShaderMaterial({
    uniforms: {
      spotlightPosition:spotlightPosition,
      lightColorUniform: lightColorUniform,
      spotDirectPosition:spotDirectPosition
    }
});

var phongMaterial = new THREE.ShaderMaterial({
    uniforms: {
      light: lightColorUniform,
      light_d: lightDirectionUniform,
      ambient: ambientColorUniform,
      kAmbient: kAmbientUniform,
      kDiffuse: kDiffuseUniform,
      kSpecular: kSpecularUniform,
      shininess: shininessUniform
    },
});

var bPhongMaterial = new THREE.ShaderMaterial({
    uniforms: {
      light: lightColorUniform,
      light_d: lightDirectionUniform,
      ambient: ambientColorUniform,
      kAmbient: kAmbientUniform,
      kDiffuse: kDiffuseUniform,
      kSpecular: kSpecularUniform,
      shininess: shininessUniform

    },
});
var toonMaterial = new THREE.ShaderMaterial({
    uniforms: {
      lightColorUniform: lightColorUniform,
      lightDirectionUniform: lightDirectionUniform,
      ambientColorUniform: ambientColorUniform,
      kAmbientUniform: kAmbientUniform,
      kDiffuseUniform: kDiffuseUniform,
      kSpecularUniform: kSpecularUniform
    },
});

var fogMaterial = new THREE.ShaderMaterial({
    uniforms: {
      lightColorUniform: lightColorUniform,
      lightFogColor: lightFogColorUniform,
      lightDirectionUniform: lightDirectionUniform,
      fogDensity: fogDensity,
      kDiffuseUniform: kDiffuseUniform,
      shininessUniform: shininessUniform
    },
});

var hatchMaterial = new THREE.ShaderMaterial({
   uniforms: {
     lightColorUniform : lightColorUniform,
     ambientColorUniform : ambientColorUniform,
     lightDirectionUniform : lightDirectionUniform,
     catPosition: catPosition
   },
});

var goochMaterial = new THREE.ShaderMaterial({
   uniforms: {
     // lightColorUniform : lightColorUniform,
     // ambientColorUniform : ambientColorUniform,
     lightDirectionUniform : lightDirectionUniform,
     coolColor : {type: 'v3', value: coolColor},
     warmColor : {type: 'v3', value: warmColor},
     //objectColor : {type: 'v3', value: objectColor},
   },
});

// LOAD SHADERS
var shaderFiles = [

  'glsl/spotlight.vs.glsl',
  'glsl/spotlight.fs.glsl',
  'glsl/phong.vs.glsl',
  'glsl/phong.fs.glsl',
  'glsl/phong_blinn.vs.glsl',
  'glsl/phong_blinn.fs.glsl',
  'glsl/fog.vs.glsl',
  'glsl/fog.fs.glsl',
  'glsl/toon.fs.glsl',
  'glsl/toon.vs.glsl',
  'glsl/hatch.fs.glsl',
  'glsl/hatch.vs.glsl',
  'glsl/gooch.fs.glsl',
  'glsl/gooch.vs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {


  spotlightMaterial.vertexShader = shaders['glsl/spotlight.vs.glsl'];
  spotlightMaterial.fragmentShader = shaders['glsl/spotlight.fs.glsl'];

  phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
  phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
  bPhongMaterial.vertexShader = shaders['glsl/phong_blinn.vs.glsl'];
  bPhongMaterial.fragmentShader = shaders['glsl/phong_blinn.fs.glsl'];
  fogMaterial.vertexShader = shaders['glsl/fog.vs.glsl'];
  fogMaterial.fragmentShader = shaders['glsl/fog.fs.glsl'];
    toonMaterial.fragmentShader = shaders['glsl/toon.fs.glsl'];
    toonMaterial.vertexShader = shaders['glsl/toon.vs.glsl'];
    hatchMaterial.fragmentShader = shaders['glsl/hatch.fs.glsl'];
    hatchMaterial.vertexShader = shaders['glsl/hatch.vs.glsl'];
    goochMaterial.fragmentShader = shaders['glsl/gooch.fs.glsl'];
    goochMaterial.vertexShader = shaders['glsl/gooch.vs.glsl'];
})

var ctx = renderer.context;
ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

function loadOBJ(mode, file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
    var onProgress = function(query) {
        if (query.lengthComputable) {
            var percentComplete = query.loaded / query.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function() {
        console.log('Failed to load ' + file);
    };

    var loader = new THREE.OBJLoader();
    loader.load(file, function(object) {
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });

        object.position.set(xOff, yOff, zOff);
        object.rotation.x = xRot;
        object.rotation.y = yRot;
        object.rotation.z = zRot;
        object.scale.set(scale, scale, scale);
        object.parent = worldFrames[mode];
        scenes[mode].add(object);
    }, onProgress, onError);
}


/////////////////////////////////
//       GOURAUD SCENE           //
//    RELEVANT TO PART 1.A B & C //
/////////////////////////////////
var GOURAUDMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});

var ballGeometry = new THREE.SphereGeometry(3.5, 10, 10);
function addEggs(lightingMaterial, scene_number){
    for (var i = 0;  i < 80; i++) {
        var mesh = new THREE.Mesh(ballGeometry, lightingMaterial);
        var offset = 0;
        if (Math.floor(i/10)%2 == 0) offset = 0.5;
        mesh.position.x = (i % 10 + offset) * 4 - 20;
        mesh.position.z = Math.floor(i/4) * 4 - 40;
        //mesh.position.y = Math.floor(i/4) * 4 - 80;
        mesh.scale.set(0.3, 0.4, 0.3);
        scenes[scene_number].add(mesh);
    }
}
addEggs(GOURAUDMaterial, Part.GOURAUD);
addEggs(phongMaterial, Part.PHONG);
addEggs(bPhongMaterial, Part.BLINNPHONG);
addEggs(fogMaterial, Part.FOG);
addEggs(toonMaterial, Part.TOON);
addEggs(goochMaterial, Part.HATCH);


/////////////////////////////////
//      SPOTLIGHT SCENE        //
//    RELEVANT TO PART 1.D     //
/////////////////////////////////

loadOBJ(Part.SPOTLIGHT, 'obj/bunny.obj', spotlightMaterial, 20, 0, 0, 0, 0,0,0);

// floor
var geoFloor = new THREE.PlaneBufferGeometry( 2000.0, 2000.0 );
var floor = new THREE.Mesh( geoFloor, spotlightMaterial );
floor.rotation.x = - Math.PI * 0.5;
floor.position.set( 0, - 0.05, 0 );
scenes[Part.SPOTLIGHT].add(floor);


/////////////////////////////////
//      TOON SCENE             //
//    RELEVANT TO PART 1.E     //
/////////////////////////////////

toon = {};
//loadOBJ(Part.TOON, 'obj/bunny.obj', toonMaterial, 20, 0, 0, 0, 0,0,0);
loadOBJ(Part.TOON, 'obj/cat.obj', toonMaterial, 20, 0, 0, 0, 0,0,0);
loadOBJ(Part.TOON, 'obj/cat.obj', toonMaterial, 0.05, 20, 0, 0, 0,0,0);
loadOBJ(Part.TOON, 'obj/LEGO_Man.obj', toonMaterial, 1.0, 20, 13, 0, 0,20,0);
loadOBJ(Part.TOON, 'obj/grass.obj', toonMaterial, 0.5, 0, 0, 0, 20,0,0);
//loadOBJ(Part.TOON, 'obj/cat.obj', toonMaterial, 20, 0, 0, 0, 0,0,0);
// loadOBJ(Part.TOON, 'obj/male.obj', toonMaterial, 70, 0, 20, 0, 0,50,0);

// TODO: load your objects here

// toon.sphere = new THREE.SphereGeometry(1, 16, 16);
// toon.npr_toon = new THREE.Mesh(toon.sphere, toonMaterial);
// toon.npr_toon.position.set(0, 1, 1);
// scenes[Part.TOON].add(toon.npr_toon);

/////////////////////////////////
//      TOON SCENE             //
//    RELEVANT TO PART 1.E     //
/////////////////////////////////
light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2);
light.position.set(1, 1000, 1);
light.castShadow = true;
light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 1, 5000));

scenes[Part.HATCH].add(light);
var cat = loadOBJ(Part.HATCH, 'obj/cat.obj', hatchMaterial, 0.05, 20, 0, 0, 0,10,0);
var tree = loadOBJ(Part.HATCH, 'obj/tree01.obj', goochMaterial, 5, 60, 0, 0, 0,0,0);
var tree = loadOBJ(Part.HATCH, 'obj/tree02.obj', goochMaterial, 10, 80, 0, 40, 0,0,0);
// var spheremesh = new THREE.Mesh(cat, hatchMaterial);
// spheremesh.castShadow = true;
// spheremesh.receiveShadow = true;
// scenes[Part.HATCH].add(spheremesh);
//model(cat);
// light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2);
// light.position.set(1, 1000, 1);
// light.castShadow = true;
// light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 1, 5000));
// scenes[Part.HATCH].add(light);

//var cat = loadModel('obj/cat.obj');
// var spheremesh = new THREE.Mesh(sphere, new THREE.MeshPhongMaterial( ));
// spheremesh.position.y = 0;
// spheremesh.castShadow = true;
// spheremesh.receiveShadow = true;
// scenes[Part.HATCH].add(spheremesh);

//var geoFloor = new THREE.PlaneBufferGeometry( 2000.0, 2000.0 );
//egg.position.set(bunnyPosition.value.x, bunnyPosition.value.y, bunnyPosition.value.z);
//var geometry = new THREE.PlaneBufferGeometry(2000.0, 2000.0 );
//var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
// var plane = new THREE.Mesh( geometry, material );
// plane.rotation.x = - Math.PI * 0.5;
// plane.position.set( 0, - 0.05, 0 );
//scene.add( plane );

// var floor = new THREE.Mesh( geoFloor, phongMaterial );
// floor.rotation.x = - Math.PI * 0.5;
// floor.position.set( 0, - 0.05, 0 );
//scenes[Part.HATCH].add(plane);

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();

function checkKeyboard() {
    if (keyboard.pressed("0"))
        mode = Part.GOURAUD
    else if (keyboard.pressed("1"))
        mode = Part.PHONG
    else if (keyboard.pressed("2"))
        mode = Part.BLINNPHONG
    else if (keyboard.pressed("3"))
        mode = Part.FOG
    else if (keyboard.pressed("4"))
        mode = Part.SPOTLIGHT
    else if (keyboard.pressed("5"))
        mode = Part.TOON
        else if (keyboard.pressed("6"))
            mode = Part.HATCH

        if (mode == Part.SPOTLIGHT) {
          if (keyboard.pressed("S"))
            spotDirectPosition.value.z -= 0.1;
          else if (keyboard.pressed("W"))
            spotDirectPosition.value.z += 0.1;

          if (keyboard.pressed("D"))
            spotDirectPosition.value.x -= 0.1;
          else if (keyboard.pressed("A"))
            spotDirectPosition.value.x += 0.1;

          //spotDirectPosition.value = spotDirectPosition;
        }
        if (mode == Part.HATCH) {

        if (keyboard.pressed("W"))
          catPosition.value.z -= 0.1;
        else if (keyboard.pressed("S"))
          catPosition.value.z += 0.1;

        if (keyboard.pressed("A"))
          catPosition.value.x -= 0.1;
        else if (keyboard.pressed("D"))
          catPosition.value.x += 0.1;
        }

    // TODO: add keyboard control to change spotDirectPosition


  spotlightMaterial.needsUpdate = true;
  phongMaterial.needsUpdate = true;
  bPhongMaterial.needsUpdate = true;
  toonMaterial.needsUpdate = true;
  fogMaterial.needsUpdate = true;
  hatchMaterial.needsUpdate = true;
}

// SETUP UPDATE CALL-BACK
function update() {
  updateBody();
  checkKeyboard();
  requestAnimationFrame(update);
  renderer.render(scenes[mode], cameras[mode]);
}

update();
