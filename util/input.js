const canvasWidthElement = document.querySelector("#canvas-width");
const canvasHeightElement = document.querySelector("#canvas-height");
const fovElement = document.querySelector("#fov");

canvasWidthElement.addEventListener("change", () => canvas.width = parseInt(canvasWidthElement.value));
canvasHeightElement.addEventListener("change", () => canvas.height = parseInt(canvasHeightElement.value));
fovElement.addEventListener("change", () => fov = parseInt(fovElement.value));

let camera = [0, 0, 0];
let look_direction = [0, 0, 1];
let camera_up = [0, 1, 0];
let yaw = 0;
let pitch = 0;

let pre_mouse_position = [innerWidth / 2, innerHeight / 2];

let press_w = false;
let press_a = false;
let press_s = false;
let press_d = false;

document.addEventListener("keydown", (e) => {
    if(e.keyCode === 87) press_w = true;
    else if(e.keyCode === 65) press_a = true;
    else if(e.keyCode === 83) press_s = true;
    else if(e.keyCode === 68) press_d = true;
})

document.addEventListener("keyup", (e) => {
    if(e.keyCode === 87) press_w = false;
    else if(e.keyCode === 65) press_a = false;
    else if(e.keyCode === 83) press_s = false;
    else if(e.keyCode === 68) press_d = false;
});

document.addEventListener("mousemove", (e) => {
    yaw -= (e.clientX - pre_mouse_position[0]) * 0.005;
    pitch -= (e.clientY - pre_mouse_position[1]) * 0.005;

    pre_mouse_position = [e.clientX, e.clientY];
})

function update_keyboard_input() {

    /* Keyboard Input */
    if(press_w) {
        let change = matrixMath.vectorMultiply(look_direction, 0.05);
        camera = matrixMath.vectorAdd(camera, change);
    }

    if(press_a) {
        let strafe_direction = matrixMath.vectorCrossProduct(look_direction, camera_up);
        strafe_direction = matrixMath.vectorMultiply(strafe_direction, 0.05);
        camera = matrixMath.vectorAdd(camera, strafe_direction);
    }

    if(press_s) {
        let change = matrixMath.vectorMultiply(look_direction, 0.05);
        camera = matrixMath.vectorSubstract(camera, change);
    }

    if(press_d) {
        let strafe_direction = matrixMath.vectorCrossProduct(look_direction, camera_up);
        strafe_direction = matrixMath.vectorMultiply(strafe_direction, 0.05);
        camera = matrixMath.vectorSubstract(camera, strafe_direction);
    }
}