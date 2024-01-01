const canvas = document.querySelector("#c");
const ctx = canvas.getContext("2d");

const canvasWidthElement = document.querySelector("#canvas-width");
const canvasHeightElement = document.querySelector("#canvas-height");
const fovElement = document.querySelector("#fov");
const angleElement = document.querySelector("#angle");
const isRotationXElement = document.querySelector("#rotation-x");
const isRotationYElement = document.querySelector("#rotation-y");
const isRotationZElement = document.querySelector("#rotation-z");

canvas.width = parseInt(canvasWidthElement.value);
canvas.height = parseInt(canvasHeightElement.value);

let fov = parseInt(fovElement.value);
let angle = parseInt(angleElement.value);
let isRotationX = isRotationXElement.checked;
let isRotationY = isRotationYElement.checked;
let isRotationZ = isRotationZElement.checked;

canvasWidthElement.addEventListener("change", () => canvas.width = parseInt(canvasWidthElement.value));
canvasHeightElement.addEventListener("change", () => canvas.height = parseInt(canvasHeightElement.value));
fovElement.addEventListener("change", () => fov = parseInt(fovElement.value));
angleElement.addEventListener("change", () => angle = parseInt(angleElement.value));
isRotationXElement.addEventListener("change", () => isRotationX = isRotationXElement.checked);
isRotationYElement.addEventListener("change", () => isRotationY = isRotationYElement.checked);
isRotationZElement.addEventListener("change", () => isRotationZ = isRotationZElement.checked);

/* Animation Loop */
animate();
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let c_buffer = ctx.createImageData(canvas.width, canvas.height);
    let z_buffer = [];

    let model_space = [];
    for(let i = 0; i < triangles.length; i++){
        model_space[i] = triangles[i].matrices;
    }

    let screen_space = vertex_shader(model_space);
    let rastered_image = rasterizer(screen_space, c_buffer, z_buffer);
    fragment_shader();

    requestAnimationFrame(animate)
}

/* Vertex Shader */
function vertex_shader(model_space){
    let world_space = [], camera_space = [], screen_space = [];

    /* World Space */
    let near = 0.1;
    let far = 1000;
    let aspect_ratio = canvas.height / canvas.width;

    let projection_matrix = matrixMath.matrixMakeProjection(fov, aspect_ratio, near, far);
    let rotation_x = matrixMath.matrixRotationX(angle);
    let rotation_y = matrixMath.matrixRotationY(angle);
    let rotation_z = matrixMath.matrixRotationZ(angle);

    let world_matrix = matrixMath.matrixMakeIdentity();
    if(isRotationX) world_matrix = matrixMath.matrixMultiplyMatrix(world_matrix, rotation_x);
    if(isRotationY) world_matrix = matrixMath.matrixMultiplyMatrix(world_matrix, rotation_y);
    if(isRotationZ) world_matrix = matrixMath.matrixMultiplyMatrix(world_matrix, rotation_z);
    
    for(let i = 0; i < model_space.length; i++){
        world_space[i] = matrixMath.createNewMatrix(3, 3);

        world_space[i][0] = matrixMath.matrixMultiplyVector(world_matrix, model_space[i][0]);
        world_space[i][1] = matrixMath.matrixMultiplyVector(world_matrix, model_space[i][1]);
        world_space[i][2] = matrixMath.matrixMultiplyVector(world_matrix, model_space[i][2]);

        world_space[i][0][2] = world_space[i][0][2] + 3;
        world_space[i][1][2] = world_space[i][1][2] + 3;
        world_space[i][2][2] = world_space[i][2][2] + 3;

        world_space[i][0] = matrixMath.matrixMultiplyVector(projection_matrix, world_space[i][0]);
        world_space[i][1] = matrixMath.matrixMultiplyVector(projection_matrix, world_space[i][1]);
        world_space[i][2] = matrixMath.matrixMultiplyVector(projection_matrix, world_space[i][2]);
    }

    /* Screen Space */
    for(let i = 0; i < world_space.length; i++){
        screen_space = world_space;
        screen_space[i][0][0] += 1;
        screen_space[i][1][0] += 1;
        screen_space[i][2][0] += 1;

        screen_space[i][0][1] += 1;
        screen_space[i][1][1] += 1;
        screen_space[i][2][1] += 1;

        screen_space[i][0][0] *= 0.5 * canvas.width;
        screen_space[i][1][0] *= 0.5 * canvas.width;
        screen_space[i][2][0] *= 0.5 * canvas.width;

        screen_space[i][0][1] *= 0.5 * canvas.height;
        screen_space[i][1][1] *= 0.5 * canvas.height;
        screen_space[i][2][1] *= 0.5 * canvas.height;
    }

    return screen_space;
}

/* Rasterizer */
function rasterizer(screen_space, c_buffer, z_buffer){
    for(let i = 0; i < screen_space.length; i++){
        ctx.beginPath();
        ctx.moveTo(screen_space[i][0][0], screen_space[i][0][1]);
        ctx.lineTo(screen_space[i][1][0], screen_space[i][1][1]);
        ctx.lineTo(screen_space[i][2][0], screen_space[i][2][1]);
        ctx.lineTo(screen_space[i][0][0], screen_space[i][0][1]);
        ctx.stroke();
    }
}

/* Fragment Shader */
function fragment_shader(){

}