let triangles = [];
function loadObject(element) {
    let file = element.files[0];
    let reader = new FileReader();

    reader.readAsText(file, "UTF-8");
    reader.onload = function(event){
        let data = event.target.result;
        let vertices = [], faces = [];

        let lines = data.split("\n");
        for(let i = 0; i < lines.length; i++){
            switch(lines[i][0]){
                case "v":
                    let vert = lines[i].split(" ");
                    vert.splice(0, 1);

                    for(let j = 0; j < vert.length; j++){
                        vert[j] = parseFloat(vert[j]);
                    }

                    vertices.push(vert);
                    break;

                case "f":
                    let face = lines[i].split(" ");
                    face.splice(0, 1);

                    for(let j = 0; j < face.length; j++){
                        face[j] = parseFloat(face[j]);
                    }

                    faces.push(face);
                    break;
            }
        }

        let newTriangles = [];
        for(let x = 0; x < faces.length; x++){
            newTriangles[x] = {
                matrices: [],
                color: []
            };

            newTriangles[x].matrices[0] = vertices[faces[x][0] - 1];
            newTriangles[x].matrices[1] = vertices[faces[x][1] - 1];
            newTriangles[x].matrices[2] = vertices[faces[x][2] - 1];
            newTriangles[x].color = [1, 1, 1, 255];
        }

        triangles = newTriangles;
    }
}