const ROOF_LEFT_FORWARD = [-1, 0, 0]; // 1
const ROOF_LEFT_BACKWARD = [-1, 0, -2]; // 2
const ROOF_RIGHT_FORWARD = [1, 0, 0]; // 3
const ROOF_RIGHT_BACKWARD = [1, 0, -2]; // 4
const ROOF_TOP = [0, -1, -1]; // 5

const WALLS_RIGHT_FU = [0.8, 0, -0.2]; // 6
const WALLS_RIGHT_FD = [0.8, 0.8, -0.2]; // 7
const WALLS_LEFT_FU = [-0.8, 0, -0.2]; // 8
const WALLS_LEFT_FD = [-0.8, 0.8, -0.2]; // 9

const WALLS_RIGHT_BU = [0.8, 0, -1.8]; // 10
const WALLS_RIGHT_BD = [0.8, 0.8, -1.8]; // 11
const WALLS_LEFT_BU = [-0.8, 0, -1.8]; // 12
const WALLS_LEFT_BD = [-0.8, 0.8, -1.8]; // 13

let triangles = [
    /* Roof */
    {
        matrices: [ROOF_LEFT_FORWARD, ROOF_TOP, ROOF_RIGHT_FORWARD],
        color: [117, 70, 0, 255]
    },

    {
        matrices: [ROOF_LEFT_FORWARD, ROOF_TOP, ROOF_LEFT_BACKWARD],
        color: [102, 61, 1, 255]
    },

    {
        matrices: [ROOF_LEFT_BACKWARD, ROOF_TOP, ROOF_RIGHT_BACKWARD],
        color: [117, 70, 0, 255]
    },

    {
        matrices: [ROOF_RIGHT_BACKWARD, ROOF_TOP, ROOF_RIGHT_FORWARD],
        color: [102, 61, 1, 255]
    },

    {
        matrices: [ROOF_LEFT_FORWARD, ROOF_RIGHT_FORWARD, ROOF_LEFT_BACKWARD],
        color: [36, 36, 36, 255]
    },

    {
        matrices: [ROOF_RIGHT_FORWARD, ROOF_RIGHT_BACKWARD, ROOF_LEFT_BACKWARD],
        color: [36, 36, 36, 255]
    },

    /* Walls */
    {
        matrices: [WALLS_RIGHT_FU, WALLS_RIGHT_FD, WALLS_LEFT_FU],
        color: [255, 205, 143, 255]
    },

    {
        matrices: [WALLS_LEFT_FU, WALLS_RIGHT_FD, WALLS_LEFT_FD],
        color: [255, 205, 143, 255]
    },

    {
        matrices: [WALLS_LEFT_FU, WALLS_LEFT_BU, WALLS_LEFT_FD],
        color: [255, 205, 143, 255]
    },

    {
        matrices: [WALLS_LEFT_FD, WALLS_LEFT_BD, WALLS_LEFT_BU],
        color: [255, 205, 143, 255]
    },

    {
        matrices: [WALLS_LEFT_BU, WALLS_LEFT_BD, WALLS_RIGHT_BU],
        color: [255, 205, 143, 255]
    },

    {
        matrices: [WALLS_RIGHT_BD, WALLS_LEFT_BD, WALLS_RIGHT_BU],
        color: [255, 205, 143, 255]
    },

    {
        matrices: [WALLS_RIGHT_FD, WALLS_RIGHT_FU, WALLS_RIGHT_BU],
        color: [255, 205, 143, 255]
    },

    {
        matrices: [WALLS_RIGHT_FD, WALLS_RIGHT_BD, WALLS_RIGHT_BU],
        color: [255, 205, 143, 255]
    },

    {
        matrices: [WALLS_LEFT_FD, WALLS_RIGHT_FD, WALLS_RIGHT_BD],
        color: [163, 132, 93, 255]
    },

    {
        matrices: [WALLS_LEFT_FD, WALLS_LEFT_BD, WALLS_RIGHT_BD],
        color: [163, 132, 93, 255]
    },
]