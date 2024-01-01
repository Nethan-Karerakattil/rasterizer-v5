const matrixMath = {
    vectorAdd: (v1, v2) => {
        let nv1 = structuredClone(v1);
        let nv2 = structuredClone(v2);

        return [nv1[0] + nv2[0], nv1[1] + nv2[1], nv1[2] + nv2[2]];
    },

    vectorSubstract: (v1, v2) => {
        let nv1 = structuredClone(v1);
        let nv2 = structuredClone(v2);

        return [nv1[0] - nv2[0], nv1[1] - nv2[1], nv1[2] - nv2[2]];
    },

    vectorDivide: (v, k) => {
        let nv = structuredClone(v);
        let nk = structuredClone(k);

        return [ nv[0] / nk, nv[1] / nk, nv[2] / nk];
    },

    vectorMultiply: (v, k) => {
        let nv = structuredClone(v);
        let nk = structuredClone(k);

		return [ nv[0] * nk, nv[1] * k, nv[2] * k ];
	},

    createNewMatrix: (rows, collumns) => {
        let m = [];

        for(let i = 0; i < rows; i++){
            let temp = [];
            for(let j = 0; j < collumns; j++){
                temp.push(0);
            }
            m.push(temp);
        }

        return m;
    },

    vectorDotProduct: (v1, v2) => {
        let nv1 = structuredClone(v1);
        let nv2 = structuredClone(v2);

        return nv1[0] * nv2[0] + nv1[1] * nv2[1] + nv1[2] * nv2[2];
    },

    vectorLength: (v) => {
        let nv = structuredClone(v);

        return Math.sqrt(matrixMath.vectorDotProduct(nv, nv));
    },

    vectorNormalise: (v) => {
        let nv = structuredClone(v);
        let l = matrixMath.vectorLength(v);

        return [ v[0] / l, v[1] / l, v[2] / l ];
    },

    vectorCrossProduct: (v1, v2) => {
        return [
            v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0]
        ];
    },

    matrixMultiplyVector: (m, i) => {
        let nm = structuredClone(m);
        let ni = structuredClone(i);

        if(!nm[3]) nm[3] = [ 0, 0, 0 ];
        if(!ni[3]) ni[3] = 0;

        let output = [
            ni[0] * nm[0][0] + ni[1] * nm[1][0] + ni[2] * nm[2][0] + nm[3][0],
            ni[0] * nm[0][1] + ni[1] * nm[1][1] + ni[2] * nm[2][1] + nm[3][1],
            ni[0] * nm[0][2] + ni[1] * nm[1][2] + ni[2] * nm[2][2] + nm[3][2],
            ni[0] * nm[0][3] + ni[1] * nm[1][3] + ni[2] * nm[2][3] + nm[3][3]
        ];

        if(output[3] != 0){
            output[0] /= output[3];
            output[1] /= output[3];
            output[2] /= output[3];
        }

        return output;
    },

    matrixMakeIdentity: () => {
        let m = matrixMath.createNewMatrix(4, 4);
        m[0][0] = 1;
        m[1][1] = 1;
        m[2][2] = 1;
        m[3][3] = 1;

        return m;
    },

    matrixMakeTranslation: (x, y, z) => {
        let nx = structuredClone(x);
        let ny = structuredClone(y);
        let nz = structuredClone(z);

        let m = matrixMath.createNewMatrix(4, 4);
        m[0][0] = 1;
        m[1][1] = 1;
        m[2][2] = 1;
        m[3][3] = 1;
        m[3][0] = nx;
        m[3][1] = ny;
        m[3][2] = nz;

        return m;
    },

    matrixRotationX: (angle) => {
        let nAngle = structuredClone(angle);
        let m = matrixMath.createNewMatrix(4, 4);

        m[0][0] = 1;
        m[1][1] = Math.cos(nAngle);
        m[1][2] = Math.sin(nAngle);
        m[2][1] = -Math.sin(nAngle);
        m[2][2] = Math.cos(nAngle);
        m[3][3] = 1;

        return m;
    },

    matrixRotationY: (angle) => {
        let nAngle = structuredClone(angle);
        let m = matrixMath.createNewMatrix(4, 4);

        m[0][0] = Math.cos(nAngle);
        m[0][2] = Math.sin(nAngle);
        m[1][1] = 1;
        m[2][0] = -Math.sin(nAngle);
        m[2][2] = Math.cos(nAngle);
        m[3][3] = 1;

        return m;
    },

    matrixRotationZ: (angle) => {
        let nAngle = structuredClone(angle);
        let m = matrixMath.createNewMatrix(4, 4);

        m[0][0] = Math.cos(nAngle);
        m[0][1] = Math.sin(nAngle);
        m[1][0] = -Math.sin(nAngle);
        m[1][1] = Math.cos(nAngle);
        m[2][2] = 1;
        m[3][3] = 1;

        return m;
    },

    matrixMakeProjection: (fov, aspectRatio, near, far) => {
        let nFov = structuredClone(fov);
        let nAspectRatio = structuredClone(aspectRatio);
        let nNear = structuredClone(near);
        let nFar = structuredClone(far);

        let fovRad = 1 / Math.tan(nFov * 0.5 / 180 * Math.PI);
        let m = matrixMath.createNewMatrix(4, 4);

        m[0][0] = nAspectRatio * fovRad;
        m[1][1] = fovRad;
        m[2][2] = nFar / ( nFar - nNear );
        m[3][2] = (-nFar * nNear) / (nFar - nNear);
        m[2][3] = 1;

        return m;
    },

    matrixMultiplyMatrix: (m1, m2) => {
        let nm1 = structuredClone(m1);
        let nm2 = structuredClone(m2);

        let m = matrixMath.createNewMatrix(4, 4);
        for(let c = 0; c < 4; c++){
            for(let r = 0; r < 4; r++){
                m[r][c] =
                    nm1[r][0] * nm2[0][c] +
                    nm1[r][1] * nm2[1][c] +
                    nm1[r][2] * nm2[2][c] +
                    nm1[r][3] * nm2[3][c]
            }
        }

        return m;
    },

    matrixPointAt: (pos, target, up) => {
		let newForward = matrixMath.vectorNormalise(matrixMath.vectorSubstract(target, pos));
		let a = matrixMath.vectorMultiply(newForward, matrixMath.vectorDotProduct(up, newForward));
		let newUp = matrixMath.vectorNormalise(matrixMath.vectorSubstract(up, a));
		let newRight = matrixMath.vectorCrossProduct(newUp, newForward);

		let out = matrixMath.createNewMatrix(4, 4);
		out[0][0] = newRight[0];
        out[0][1] = newRight[1];
        out[0][2] = newRight[2];
        out[0][3] = 0;

		out[1][0] = newUp[0];
        out[1][1] = newUp[1];
        out[1][2] = newUp[2];
        out[1][3] = 0;

		out[2][0] = newForward[0];
        out[2][1] = newForward[1];
        out[2][2] = newForward[2];
        out[2][3] = 0;

		out[3][0] = pos[0];
        out[3][1] = pos[1];
        out[3][2] = pos[2];
        out[3][3] = 1;

		return out;
	},

	matrixQuickInverse: (m) => {
		let out = matrixMath.createNewMatrix(4, 4);
		out[0][0] = m[0][0];
        out[0][1] = m[1][0];
        out[0][2] = m[2][0];
        out[0][3] = 0;

		out[1][0] = m[0][1];
        out[1][1] = m[1][1];
        out[1][2] = m[2][1];
        out[1][3] = 0;

		out[2][0] = m[0][2];
        out[2][1] = m[1][2];
        out[2][2] = m[2][2];
        out[2][3] = 0;

		out[3][0] = -(m[3][0] * out[0][0] + m[3][1] * out[1][0] + m[3][2] * out[2][0]);
		out[3][1] = -(m[3][0] * out[0][1] + m[3][1] * out[1][1] + m[3][2] * out[2][1]);
		out[3][2] = -(m[3][0] * out[0][2] + m[3][1] * out[1][2] + m[3][2] * out[2][2]);
		out[3][3] = 1;
		return out;
	},
}