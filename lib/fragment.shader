#version 100
varying highp vec2 outTexCoord;
uniform sampler2D sample;
void main() {
	highp vec4 color = texture2D(sample, outTexCoord);
	if (color.a < 0.5) {
		discard;
	} 
	gl_FragColor = color;
};