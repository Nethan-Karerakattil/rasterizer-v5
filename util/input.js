const canvasWidthElement = document.querySelector("#canvas-width");
const canvasHeightElement = document.querySelector("#canvas-height");
const fovElement = document.querySelector("#fov");

let fov = parseInt(fovElement.value);
let camera = [0, 0, 0];
let look_direction = [0, 0, 1];
let yaw = 0;
let forward = matrixMath.vectorMultiply(look_direction, 0.1);

canvasWidthElement.addEventListener("change", () => canvas.width = parseInt(canvasWidthElement.value));
canvasHeightElement.addEventListener("change", () => canvas.height = parseInt(canvasHeightElement.value));
fovElement.addEventListener("change", () => fov = parseInt(fovElement.value));

document.addEventListener("keydown", (e) => {
    console.log(e.keyCode);

    switch(e.keyCode){
        case 38: /* Arrow Up */
            camera[1] -= 0.1;
            break;

        case 37: /* Arrow Left */
            camera[0] -= 0.1;
            break;

        case 40: /* Arrow Down */
            camera[1] += 0.1;
            break;

        case 39: /* Arrow Right */
            camera[0] += 0.1;
            break;


        case 87: /* W */
            camera = matrixMath.vectorAdd(camera, forward);
            break;

        case 65: /* A */
            yaw += 0.1;
            break;

        case 83: /* S */
            camera = matrixMath.vectorSubstract(camera, forward);
            break;

        case 68: /* D */
            yaw -= 0.1;
            break;
    }
})