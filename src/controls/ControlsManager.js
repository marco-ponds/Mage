import SceneManager from '../base/SceneManager';
import Orbit from './Orbit';
import Transform from './Transform';
import FirstPersonControl from './FirstPersonControl';
import FlyControl from './FlyControl';

export class ControlsManager {

    constructor() {

        this.controls = {
            orbit: undefined,
            transform: undefined,
            fps: undefined,
            fly: undefined
        };
    }

    disposePreviousControls(controls = []) {
        controls.forEach(c => {
            if (this.controls[c] && this.controls[c].dispose) {
                this.controls[c].dispose();
                delete this.controls[c];
            }
        })
    }

    getControl(control) {
        if (control && this.controls[control]) {
            return this.controls[control];
        }
    }

    update(dt) {
        Object
            .keys(this.controls)
            .forEach(control => {
                this.controls[control] && this.controls[control].update(dt);
            });
    }

    setOrbitControl() {
        this.disposePreviousControls(['pointerlock', 'fly']);
        this.controls.orbit = new Orbit(SceneManager.camera.object, SceneManager.renderer.domElement);
        this.controls.orbit.init();

        this.controls.orbit.addEventListener('change', SceneManager.render);

        return this.controls.orbit;
    }

    setTransformControl() {
        this.controls.transform = new Transform(SceneManager.camera.object, SceneManager.renderer.domElement);
        this.controls.transform.init();
		this.controls.transform.addEventListener('change', SceneManager.render);
		this.controls.transform.addEventListener('dragging-changed', (event) => {
            if (this.controls.orbit) {
                this.controls.orbit.enabled = !event.value;
            }
		});

        return this.controls.transform;
    }

    setFirstPersonControl() {
        this.controls.fps = new FirstPersonControl(SceneManager.camera.object, document.body);
        this.controls.fps.init();

        return this.controls.fps;
    }

    setFlyControl() {
        this.controls.fly = new FlyControl(SceneManager.camera.object, document.body);
        this.controls.fly.init();

        return this.controls.fly;
    }
}

export default new ControlsManager();
