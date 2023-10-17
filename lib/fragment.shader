#version 100

//#pragma optimize(off)
//#pragma debug(on)

//varying highp vec2 outTexCoord;
//uniform sampler2D sample;
void main() {
	
	/*highp vec4 color = texture2D(sample, outTexCoord);
	if (color.a < 0.5) {
		discard;
	} 
	gl_FragColor = color;*/
	
	gl_FragColor = vec4(color.r, color.g, color.b, color.alpha);
}