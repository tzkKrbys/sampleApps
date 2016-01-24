var main = function () {
  // ここにあなたのコードを書いていきます
  var scene = new THREE.Scene();
  //
  //
  var canvasWidth  = document.documentElement.clientWidth;
  var canvasHeight  = document.documentElement.clientHeight;
  var fov    = 60;
  var aspect = canvasWidth / canvasHeight;
  var near   = 1;
  var far    = 1000;
  var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  camera.position.set( 0, 0, 250 );
  //
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( canvasWidth, canvasHeight );

  var directionalLight = new THREE.DirectionalLight(0xeeeeee);
  directionalLight.position.set(0, 0.8, 0.7);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  var ambientLight = new THREE.AmbientLight(0x333333);
  scene.add( ambientLight );
  // document.body.appendChild( renderer.domElement );
  //
  // var directionalLight = new THREE.DirectionalLight( 0xffffff );
  // directionalLight.position.set( 0, 0.7, 0.7 );
  // scene.add( directionalLight );
  //
  // var geometry = new THREE.CubeGeometry( 30, 30, 30 );
  // var material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
  // var mesh = new THREE.Mesh( geometry, material );
  // scene.add( mesh );
  //
  //
  // renderer.render( scene, camera );





  // var scene = new THREE.Scene();
  // var camera = new THREE.PerspectiveCamera(75, 600 / 400, 1, 1000);

  // camera.position.set(50, 0, 100);

  // renderer = new THREE.WebGLRenderer();
  // renderer.setSize(655, 437);
  document.body.appendChild(renderer.domElement);

  var directionalLight = new THREE.DirectionalLight('#ffffff', 1);
  directionalLight.position.set(0, 7, 10);
  scene.add(directionalLight);

  var geometry = new THREE.BoxGeometry(10, 10, 10);
  var material = new THREE.MeshPhongMaterial({color: 'white'});

  var cube = [];
  var position = [
            [-10,0,0],
            [-10,10,0],
            [-10,20,0],
            [-10,30,0],
            [-10,40,0],
            [0,0,0],
            [10,0,0],
            [20,0,0],
            [40,0,0],
            [40,10,0],
            [40,20,0],
            [40,30,0],
            [40,40,0],
            [60,40,0],
            [60,20,0],
            [60,20,0],
            [60,10,0],
            [60,0,0],
            [70,0,0],
            [80,0,0],
            [90,0,0],
            [70,40,0],
            [80,40,0],
            [90,30,0],
            [90,10,0],
        ];

  for (var i = 0; i < position.length; i++) {
      cube[i] = new THREE.Mesh(geometry, material);
      cube[i].position.set(position[i][0]-40,position[i][1]-20,position[i][2],position[i][0]-40,position[i][1]-20,position[i][2],position[i][0]-40,position[i][1]-20,position[i][2]);
      scene.add(cube[i]);
  };

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  function render() {
      requestAnimationFrame(render);

      // for (var i = 0; i < cube.length; i++) {
      //     cube[i].rotation.x += 0.01; // 追加
      //     cube[i].rotation.y += 0.01; // 追加
      // };

      controls.update();
      renderer.render(scene, camera);
  }
  render();







  // ( function renderLoop () {
  //   requestAnimationFrame( renderLoop );
  //   // mesh.rotation.set(
  //   //   0,
  //   //   mesh.rotation.y + 0.01,
  //   //   mesh.rotation.z + 0.01
  //   // )
  //   renderer.render( scene, camera );
  // } )();
};

window.addEventListener( 'DOMContentLoaded', main, false );
