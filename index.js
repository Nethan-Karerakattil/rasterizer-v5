const canvas = document.querySelector("#c");
const ctx = canvas.getContext("2d");

canvas.width = parseInt(canvasWidthElement.value);
canvas.height = parseInt(canvasHeightElement.value);

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
    let view_space = [], screen_space = [];

    /* World Matrix */
    let near = 0.1;
    let far = 1000;
    let aspect_ratio = canvas.height / canvas.width;

    let projection_matrix = matrixMath.matrixMakeProjection(fov, aspect_ratio, near, far);
    let world_matrix = matrixMath.matrixMakeIdentity();

    /* Camera Matrix */
    let up = [0, 1, 0];
    let target = [0, 0, 1];
    let camera_rotation = matrixMath.matrixRotationY(yaw);
    look_direction = matrixMath.matrixMultiplyVector(camera_rotation, target);
    target = matrixMath.vectorAdd(camera, look_direction);

    let camera_matrix = matrixMath.matrixPointAt(camera, target, up);
    let view_matrix = matrixMath.matrixQuickInverse(camera_matrix);
    view_matrix = matrixMath.matrixMultiplyMatrix(view_matrix, world_matrix);
    
    for(let i = 0; i < model_space.length; i++){
        /* Model Space -> View Space */
        view_space[i] = matrixMath.createNewMatrix(3, 3);

        view_space[i][0] = matrixMath.matrixMultiplyVector(view_matrix, model_space[i][0]);
        view_space[i][1] = matrixMath.matrixMultiplyVector(view_matrix, model_space[i][1]);
        view_space[i][2] = matrixMath.matrixMultiplyVector(view_matrix, model_space[i][2]);

        view_space[i][0][2] = view_space[i][0][2] + 3;
        view_space[i][1][2] = view_space[i][1][2] + 3;
        view_space[i][2][2] = view_space[i][2][2] + 3;

        view_space[i][0] = matrixMath.matrixMultiplyVector(projection_matrix, view_space[i][0]);
        view_space[i][1] = matrixMath.matrixMultiplyVector(projection_matrix, view_space[i][1]);
        view_space[i][2] = matrixMath.matrixMultiplyVector(projection_matrix, view_space[i][2]);

        /* Scale Up Points */
        screen_space = view_space;
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