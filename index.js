const canvas = document.querySelector("#c");
const ctx = canvas.getContext("2d");

canvas.width = parseInt(canvasWidthElement.value);
canvas.height = parseInt(canvasHeightElement.value);

/* Frame Counter */
let frameCounter = 0;
createNewTimeout();
function createNewTimeout(){
    setTimeout(() => {
        createNewTimeout();
        console.log(`Frames Per Second: ${frameCounter}`);
        frameCounter = 0;
    }, 1000);
}

let fov = parseInt(fovElement.value);
// let camera = [0, 0, 0];
// let look_direction = [0, 0, 1];
let forward = matrixMath.vectorMultiply(look_direction, 0.1);

/* Animation Loop */
requestAnimationFrame(generate_image);
function generate_image(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(triangles.length === 0){
        ctx.font = "20px arial";
        ctx.textAlign = "center";
        ctx.fillText("No 3d Data to display", canvas.width / 2, canvas.height / 2);
        ctx.stroke();

        requestAnimationFrame(generate_image);
        return;
    }

    /* Input */
    update_keyboard_input();

    /* Render */
    let model_space = [];
    for(let i = 0; i < triangles.length; i++){
        model_space[i] = triangles[i].matrices;
    }

    let screen_space = vertex_shader(model_space);
    let cBuffer = rasterizer(screen_space);

    frameCounter++;
    requestAnimationFrame(generate_image);
}

/* Vertex Shader */
function vertex_shader(model_space){
    let view_space = [], depth_clipped = [], screen_space = []

    /* View Matrix */
    let near = 0.1;
    let far = 1000;
    let aspect_ratio = canvas.height / canvas.width;

    let up = [0, 1, 0];
    let target = [0, 0, 1];
    let camera_rotation = matrixMath.matrixRotationY(yaw);
    camera_rotation = matrixMath.matrixMultiplyMatrix(matrixMath.matrixRotationX(pitch), camera_rotation);
    look_direction = matrixMath.matrixMultiplyVector(camera_rotation, target);
    target = matrixMath.vectorAdd(camera, look_direction);

    let projection_matrix = matrixMath.matrixMakeProjection(fov, aspect_ratio, near, far);
    let world_matrix = matrixMath.matrixMakeIdentity();
    let camera_matrix = matrixMath.matrixPointAt(camera, target, up);
    let view_matrix = matrixMath.matrixQuickInverse(camera_matrix);
    view_matrix = matrixMath.matrixMultiplyMatrix(view_matrix, world_matrix);
    
    for(let i = 0; i < model_space.length; i++){
        /* Model Space -> View Space */
        view_space[i] = matrixMath.createNewMatrix(3, 3);

        view_space[i][0] = matrixMath.matrixMultiplyVector(view_matrix, model_space[i][0]);
        view_space[i][1] = matrixMath.matrixMultiplyVector(view_matrix, model_space[i][1]);
        view_space[i][2] = matrixMath.matrixMultiplyVector(view_matrix, model_space[i][2]);

        view_space[i][0][2] += 3;
        view_space[i][1][2] += 3;
        view_space[i][2][2] += 3;

        /* Depth Clipping */
        let triangles_clipped = clip([0, 0, 0.1], [0, 0, 1], view_space[i]);
        for(let j = 0; j < triangles_clipped.length; j++) depth_clipped.push(triangles_clipped[j]);
    }

    for(let i = 0; i < depth_clipped.length; i++){
        /* View Space -> Screen Space */
        screen_space[i] = depth_clipped[i];
        screen_space[i][0] = matrixMath.matrixMultiplyVector(projection_matrix, depth_clipped[i][0]);
        screen_space[i][1] = matrixMath.matrixMultiplyVector(projection_matrix, depth_clipped[i][1]);
        screen_space[i][2] = matrixMath.matrixMultiplyVector(projection_matrix, depth_clipped[i][2]);

        /* Scale Up Points */
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

    function clip(plane_p, plane_n, in_tri){
        let clone_plane_p = structuredClone(plane_p);
        let clone_plane_n = structuredClone(plane_n);
        let clone_in_tri = structuredClone(in_tri);

        clone_plane_n = matrixMath.vectorNormalise(clone_plane_n);

        function dist(p){
            let n = matrixMath.vectorNormalise(p);
            return clone_plane_n[0] * p[0] + clone_plane_n[1] * p[1] + clone_plane_n[2] * p[2] - matrixMath.vectorDotProduct(clone_plane_n, clone_plane_p);
        }

        let inside_points = [];
        let outside_points = [];
        let inside_points_count = 0;
        let outside_points_count = 0;

		let d0 = dist(clone_in_tri[0]);
		let d1 = dist(clone_in_tri[1]);
		let d2 = dist(clone_in_tri[2]);

		if(d0 >= 0) inside_points[inside_points_count++] = clone_in_tri[0];
		else outside_points[outside_points_count++] = clone_in_tri[0];

		if(d1 >= 0) inside_points[inside_points_count++] = clone_in_tri[1];
		else outside_points[outside_points_count++] = clone_in_tri[1];

		if(d2 >= 0) inside_points[inside_points_count++] = clone_in_tri[2];
		else outside_points[outside_points_count++] = clone_in_tri[2];

		if(inside_points_count == 0) return [];
		if(inside_points_count == 3) return [clone_in_tri];

		if(inside_points_count == 1 && outside_points_count == 2){
            let out = clone_in_tri;

			out[0] = inside_points[0];
			out[1] = intersect_plane(clone_plane_p, clone_plane_n, inside_points[0], outside_points[0]);
			out[2] = intersect_plane(clone_plane_p, clone_plane_n, inside_points[0], outside_points[1]);

			return [out];
		}

		if(inside_points_count == 2 && outside_points_count == 1){
			let out1 = clone_in_tri;
			let out2 = clone_in_tri;

			out1[0] = inside_points[0];
			out1[1] = inside_points[1];
			out1[2] = intersect_plane(clone_plane_p, clone_plane_n, inside_points[0], outside_points[0]);

			out2[0] = inside_points[1];
			out2[1] = out1[2];
			out2[2] = intersect_plane(clone_plane_p, clone_plane_n, inside_points[1], outside_points[0]);

			return [out1, out2];
		}
    }

    function intersect_plane(plane_p, plane_n, lineStart, lineEnd){
        let clone_plane_p = structuredClone(plane_p);
        let clone_plane_n = structuredClone(plane_n);
        let clone_lineStart = structuredClone(lineStart);
        let clone_lineEnd = structuredClone(lineEnd);
        
        clone_plane_n = matrixMath.vectorNormalise(clone_plane_n);
		let plane_d = -matrixMath.vectorDotProduct(clone_plane_n, clone_plane_p);
		let ad = matrixMath.vectorDotProduct(clone_lineStart, clone_plane_n);
		let bd = matrixMath.vectorDotProduct(clone_lineEnd, clone_plane_n);
		let t = (-plane_d - ad) / (bd - ad);
		let lineStartToEnd = matrixMath.vectorSubstract(clone_lineEnd, clone_lineStart);
		let lineToIntersect = matrixMath.vectorMultiply(lineStartToEnd, t);

		return matrixMath.vectorAdd(lineStart, lineToIntersect);
    }

    return screen_space;
}

/* Rasterizer */
function rasterizer(screen_space){
    for(let i = 0; i < screen_space.length; i++){
        ctx.beginPath();
        ctx.moveTo(screen_space[i][0][0], screen_space[i][0][1]);
        ctx.lineTo(screen_space[i][1][0], screen_space[i][1][1]);
        ctx.lineTo(screen_space[i][2][0], screen_space[i][2][1]);
        ctx.lineTo(screen_space[i][0][0], screen_space[i][0][1]);
        ctx.stroke();
    }
}