    function STLViewer(model, elementID) {
        var elem = document.getElementById(elementID)
        var camera = new THREE.PerspectiveCamera(45, elem.clientWidth/elem.clientHeight, 1, 1000);
        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(elem.clientWidth, elem.clientHeight);
        elem.appendChild(renderer.domElement);

        window.addEventListener('resize', function () {
            renderer.setSize(elem.clientWidth, elem.clientHeight);
            camera.aspect = elem.clientWidth/elem.clientHeight;
            camera.updateProjectionMatrix();
        }, false);

        var controls = new THREE.OrbitControls(camera, renderer.domElement);

        controls.enableDamping = true;
        controls.rotateSpeed = 0.05;
        controls.dampingFactor = 0.1;
        controls.enableZoom = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = .75;

        var scene = new THREE.Scene();
        scene.add(new THREE.HemisphereLight(0x1f1f1f, 1.5));
        //scene.add(new THREE.AmbientLight(0xfafafa, 0.25));

        // Plane
        const planeGeometry = new THREE.PlaneGeometry(20, 20);
        const materialPlane = new THREE.MeshPhongMaterial({ 
                                color: 0x2f2f3f,
                                specular: 20, 
                                shininess: 90,
                                reflectivity: 0.9 }); 

        const plane = new THREE.Mesh( planeGeometry, materialPlane );
        plane.rotateX(-Math.PI / 2);
        plane.receiveShadow = true;
        plane.position.set(0, -2.5, 0);
        scene.add(plane);

        // Boat model
        (new THREE.STLLoader()).load(model, function (geometry) {
            var material = new THREE.MeshPhongMaterial({ 
            color: 0xf0f0f0, 
            specular: 100, 
            shininess: 50 });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        var middle = new THREE.Vector3();
        geometry.computeBoundingBox();
        geometry.boundingBox.getCenter(middle);
        mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation( -middle.x, -middle.y, -middle.z ) );

        // Sprites
        const map = new THREE.TextureLoader().load( 'sprite.png' );
        const materialWhiteSprite = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        const materialRedSprite = new THREE.SpriteMaterial( { map: map, color: 0xff0000 } );
        const materialGreenSprite = new THREE.SpriteMaterial( { map: map, color: 0x00ff00 } );
        const materialYellowSprite = new THREE.SpriteMaterial( { map: map, color: 0xffff00 } );

        const spriteMastRed = new THREE.Sprite( materialRedSprite );
        spriteMastRed.position.set(0, 2.7, 0);
        spriteMastRed.scale.set(.4,.4,.4);  // imageWidth, imageHeight
        mesh.add( spriteMastRed );

        const spriteMastWhite = new THREE.Sprite( materialWhiteSprite );
        spriteMastWhite.position.set(0, 2.4, 0);
        spriteMastWhite.scale.set(.4,.4,.4);  // imageWidth, imageHeight
        mesh.add( spriteMastWhite );

        const spriteRear = new THREE.Sprite( materialWhiteSprite );
        spriteRear.position.set(0, -1.7, 2);
        spriteRear.scale.set(.4,.4,.4);  // imageWidth, imageHeight
        mesh.add( spriteRear );

        const spritePortside = new THREE.Sprite( materialRedSprite );
        spritePortside.position.set(-1, -1.7, 0);
        spritePortside.scale.set(.4,.4,.4);  // imageWidth, imageHeight
        mesh.add( spritePortside );

        const spriteStarboard = new THREE.Sprite( materialGreenSprite );
        spriteStarboard.position.set(1, -1.7, 0);
        spriteStarboard.scale.set(.4,.4,.4);  // imageWidth, imageHeight
        mesh.add( spriteStarboard );

//        mesh.rotation.set(new THREE.Vector3( Math.PI / 12, 0, 0 ));

/*
        var light1 = new THREE.DirectionalLight(0xfa2a2a, 1.5);
        light1.position.set(1, 1, 0);
        scene.add(light1);
*/

        var largestDimension = Math.max(
                        geometry.boundingBox.max.x,
                        geometry.boundingBox.max.y, 
                        geometry.boundingBox.max.z
                        )
        camera.position.z = largestDimension * 5.5;

        var animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }; 

        animate();
        });
    }
