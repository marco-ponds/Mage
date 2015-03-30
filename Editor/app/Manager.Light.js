Class("LightManager", {
    LightManager: function() {
        // light map
        this.map = new HashMap();
        // lights list
        this.lights = [];
        // allowed lights
        this.allowedLights = [
            "ambientLight",
            "pointLight",
            "directionalLight"
        ];
    },

    setListeners: function() {
        //do nothing, right now
    },

    store: function(uuid, element) {
        this.map.put(uuid, element);
    },

    update: function() {
        //updating lights
        var keys_list = this.map.keys.concat();   //create a clone of the original
        if (keys_list.length != 0) {
            var start = +new Date();
            do {
                var o = this.map.get(keys_list.shift());
                if (o.target) {
                    o.light.target.position.copy(o.target.position);
                    o.light.target.updateMatrixWorld();
                }
                if (o.helper) {
                    o.helper.update();
                }
            } while (keys_list.length > 0 && (+new Date() - start < 50));
        }
    },

    addLight: function(type) {
        if (this.allowedLights.indexOf(type) != -1) {
            var object = this["_add"+__upperCaseFirstLetter__(type)]();
            //add light to scene
            app.sm.scene.add(object.light)
            //pushing light into array
            app.lm.lights.push(object.light);
            //storing this light
            app.lm.store(object.light.uuid, object);
            //forcing scene update
            app.sm.update();
            //adding to transform
            app.sm.transformControl.attach(object.light);
            //check if this light has helper
            if (object.helper) {
                //adding helper to scene
                app.sm.scene.add(object.helper);
                //ading helper to mesh lists
                app.mm.meshes.push(object.helper);
                //adding click listener to helper
                app.interface.meshEvents.bind(object.helper, "click", function(event) {
                    //now only adding this mesh to the transform control
                    if (app.sm.lastClicked.uuid === event.target.light.uuid) return;
                    app.sm.deselect();
                    app.sm.select(event.target.light, "translate");
                });
            }
            //check if this has target
            if (object.target) {
                //add target to the scene
                app.sm.scene.add(object.target);
                //adding target to meshes list
                app.mm.meshes.push(object.target);
                //adding click listener to target
                app.interface.meshEvents.bind(object.target, "click", function(event) {
                    if (app.sm.lastClicked.uuid === event.target.uuid) return;
                    app.sm.deselect();
                    app.sm.select(event.target, "translate");
                });
            }
        }
    },

    // lights

    _addAmbientLight: function() {
        var light;

        light = new THREE.AmbientLight(0x404040);

        return {
            "light": light,
            "helper": false,
            target: false
        };

    },

    _addPointLight: function() {
        var pointLight = new THREE.PointLight(0xff0000, 1, 100);
        pointLight.position.set(10, 10, 10);

        var sphereSize = 50;
        var pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);

        return {
            light: pointLight,
            helper: pointLightHelper,
            target: false
        };
    },

    _addDirectionalLight: function() {
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        directionalLight.position.set( 0, 1, 0 );

        var size = 50;
        var directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, size);

        var geo = new THREE.SphereGeometry(20, 4, 4);
        var mat = new THREE.MeshBasicMaterial({wireframe: false, color: 0x0000ff});
        var target = new THREE.Mesh(geo, mat);

        return {
            light: directionalLight,
            helper: directionalLightHelper,
            target: target
        };
    }

});