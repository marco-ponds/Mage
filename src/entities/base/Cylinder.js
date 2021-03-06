import {
    CylinderGeometry,
    MeshBasicMaterial
} from 'three';
import { Element, ENTITY_TYPES } from '../index';

export default class Cylinder extends Element {

    constructor(radiusTop = 10, radiusBottom = 10, height, color, options = {}) {
        super(null, null, options);

        const segments = 32;

        const geometry = new CylinderGeometry(radiusTop, radiusBottom, height, segments );
        const material = new MeshBasicMaterial({
            color: color,
            wireframe: false,
            ...options
        });

        this.setBody({ geometry, material });
        this.setEntityType(ENTITY_TYPES.MESH);
    }
}
