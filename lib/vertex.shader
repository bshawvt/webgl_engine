#version 100

//#pragma optimize(off)
//#pragma debug(on)

/*uniform mat4 matModel;
uniform mat4 matProjection;
uniform mat4 matView;
attribute vec4 attrVertPos;
attribute vec2 attrTexCoord;*/

//varying highp vec2 outTexCoord;
attribute vec3 pos;
void main() {
	gl_Position = vec4(pos.x, pos.y, pos.z, 1.0);
	//gl_Position = matProjection * (matView * (matModel * attrVertPos));
	//outTexCoord = attrTexCoord;
}