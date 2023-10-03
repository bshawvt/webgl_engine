#version 100
uniform mat4 matModel;
uniform mat4 matProjection;
uniform mat4 matView;
attribute vec4 attrVertPos;
attribute vec2 attrTexCoord;

varying highp vec2 outTexCoord;

void main() {
	gl_Position = matProjection * (matView * (matModel * attrVertPos));
	outTexCoord = attrTexCoord;
}