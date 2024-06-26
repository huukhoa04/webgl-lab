/*============= Creating a canvas =================*/
document.addEventListener('DOMContentLoaded', function(){
   Reset();
});


Reset = function(){
   document.getElementById('T__xVal').value = 0;
   document.getElementById('T__yVal').value = 0;
   document.getElementById('T__zVal').value = 0;

   document.getElementById('S__xVal').value = 1;
   document.getElementById('S__yVal').value = 1;
   document.getElementById('S__zVal').value = 1;

   document.getElementById('R__xVal').value = 0;
   document.getElementById('R__yVal').value = 0;
   document.getElementById('R__zVal').value = 0;
   document.getElementById('out__val').value.clear;
   Draw();
}

Draw = function(){
   document.getElementById('holder__1').innerHTML = '';

   document.getElementById('holder__1').innerHTML = '<canvas width = "500" height = "500" id="my_Canvas"></canvas>';
   var Tx = document.getElementById('T__xVal').value;
   var Ty = document.getElementById('T__yVal').value;
   var Tz = document.getElementById('T__zVal').value;

   var Sx = document.getElementById('S__xVal').value;
   var Sy = document.getElementById('S__yVal').value;
   var Sz = document.getElementById('S__zVal').value;

   var Rx = document.getElementById('R__xVal').value * Math.PI/180;
   var Ry = document.getElementById('R__yVal').value * Math.PI/180;
   var Rz = document.getElementById('R__zVal').value * Math.PI/180;
   
   document.getElementById('__Tx').innerHTML = Tx;
   document.getElementById('__Ty').innerHTML = Ty;
   document.getElementById('__Tz').innerHTML = Tz;
   
   document.getElementById('__Sx').innerHTML = Sx;
   document.getElementById('__Sy').innerHTML = Sy;
   document.getElementById('__Sz').innerHTML = Sz;

   document.getElementById('__Rx').innerHTML = document.getElementById('R__xVal').value + 'deg';
   document.getElementById('__Ry').innerHTML = document.getElementById('R__yVal').value + 'deg';
   document.getElementById('__Rz').innerHTML = document.getElementById('R__zVal').value + 'deg';

   var sideInput = document.getElementById('side__value');
      console.log(sideInput.value);
      var canvas = document.getElementById('my_Canvas');
      var gl = canvas.getContext('experimental-webgl');
      var c = 1; // Initial side value
      if(sideInput.value != null) var c = sideInput.value;
      
      
      
      /*============ Defining and storing the geometry =========*/
      
          var vertices = [
             //  -1,-1,-1, 1,-1,-1, 1, 1,-1, -1, 1,-1,
             //  -1,-1, 1, 1,-1, 1, 1, 1, 1, -1, 1, 1,
             //  -1,-1,-1, -1, 1,-1, -1, 1, 1, -1,-1, 1,
             //  1,-1,-1, 1, 1,-1, 1, 1, 1, 1,-1, 1,
             //  -1,-1,-1, -1,-1, 1, 1,-1, 1, 1,-1,-1,
             //  -1, 1,-1, -1, 1, 1, 1, 1, 1, 1, 1,-1,
              -c,-c,-c, c,-c,-c, c, c,-c, -c, c,-c,
             -c,-c, c, c,-c, c, c, c, c, -c, c, c,
             -c,-c,-c, -c, c,-c, -c, c, c, -c,-c, c,
             c,-c,-c, c, c,-c, c, c, c, c,-c, c,
             -c,-c,-c, -c,-c, c, c,-c, c, c,-c,-c,
             -c, c,-c, -c, c, c, c, c, c, c, c,-c,
           ];
      
      
      var colors = [
         5,3,7, 5,3,7, 5,3,7, 5,3,7,
         1,1,3, 1,1,3, 1,1,3, 1,1,3,
         0,0,1, 0,0,1, 0,0,1, 0,0,1,
         1,0,0, 1,0,0, 1,0,0, 1,0,0,
         1,1,0, 1,1,0, 1,1,0, 1,1,0,
         0,1,0, 0,1,0, 0,1,0, 0,1,0
      ];
      
      var indices = [
         0,1,2, 0,2,3, 4,5,6, 4,6,7,
         8,9,10, 8,10,11, 12,13,14, 12,14,15,
         16,17,18, 16,18,19, 20,21,22, 20,22,23 
      ];
      
      // Create and store data into vertex buffer
      var vertex_buffer = gl.createBuffer ();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      
      // Create and store data into color buffer
      var color_buffer = gl.createBuffer ();
      gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
      
      // Create and store data into index buffer
      var index_buffer = gl.createBuffer ();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
      
      /*=================== Shaders =========================*/
      
      var vertCode = 'attribute vec3 position;'+
         'uniform mat4 Pmatrix;'+
         'uniform mat4 Vmatrix;'+
         'uniform mat4 Mmatrix;'+
         'attribute vec3 color;'+//the color of the point
         'varying vec3 vColor;'+
      
         'void main(void) { '+//pre-built function
            'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);'+
            'vColor = color;'+
         '}';
      
      var fragCode = 'precision mediump float;'+
         'varying vec3 vColor;'+
         'void main(void) {'+
            'gl_FragColor = vec4(vColor, 1.);'+
         '}';
      
      var vertShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertShader, vertCode);
      gl.compileShader(vertShader);
      
      var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragShader, fragCode);
      gl.compileShader(fragShader);
      
      var shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertShader);
      gl.attachShader(shaderProgram, fragShader);
      gl.linkProgram(shaderProgram);
      
      /* ====== Associating attributes to vertex shader =====*/
      var Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
      var Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
      var Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");
      
      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
      var position = gl.getAttribLocation(shaderProgram, "position");
      gl.vertexAttribPointer(position, 3, gl.FLOAT, false,0,0) ;
      
      // Position
      gl.enableVertexAttribArray(position);
      gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
      var color = gl.getAttribLocation(shaderProgram, "color");
      gl.vertexAttribPointer(color, 3, gl.FLOAT, false,0,0) ;
      
      // Color
      gl.enableVertexAttribArray(color);
      gl.useProgram(shaderProgram);
      
      /*==================== MATRIX =====================*/
      
      function get_projection(angle, a, zMin, zMax) {
         var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
         return [
            0.5/ang, 0 , 0, 0,
            0, 0.5*a/ang, 0, 0,
            0, 0, -(zMax+zMin)/(zMax-zMin), -1,
            0, 0, (-2*zMax*zMin)/(zMax-zMin), 0 
         ];
      }
      
      var proj_matrix = get_projection(40, canvas.width/canvas.height, 1, 100);
      var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, Tx,Ty,Tz,1];
      var mov_matrix_1 = [1,0,0,0, 0,1,0,0, 0,0,1,0, Tx,Ty,Tz,1];

      var view_matrix = [Sx,0,0,0, 0,Sy,0,0, 0,0,Sz,0, 0,0,0,1];
      var view_matrix_1 = [Sx,0,0,0, 0,Sy,0,0, 0,0,Sz,0, 0,0,0,1];

      // console.log('translate: ' + mov_matrix);
      // console.log('scale: ' + view_matrix);
      // translating z
      view_matrix[14] = view_matrix[14]-10;//zoom
      
      /*==================== Rotation ====================*/
      
      function rotateZ(m, angle) {
         var c = Math.cos(angle);
         var s = Math.sin(angle);
         var mv0 = m[0], mv4 = m[4], mv8 = m[8];
      
         m[0] = c*m[0]-s*m[1];
         m[4] = c*m[4]-s*m[5];
         m[8] = c*m[8]-s*m[9];
      
         m[1]=c*m[1]+s*mv0;
         m[5]=c*m[5]+s*mv4;
         m[9]=c*m[9]+s*mv8;
         
      }
      
      function rotateX(m, angle) {
         var c = Math.cos(angle);
         var s = Math.sin(angle);
         var mv1 = m[1], mv5 = m[5], mv9 = m[9];
      
         m[1] = m[1]*c-m[2]*s;
         m[5] = m[5]*c-m[6]*s;
         m[9] = m[9]*c-m[10]*s;
      
         m[2] = m[2]*c+mv1*s;
         m[6] = m[6]*c+mv5*s;
         m[10] = m[10]*c+mv9*s;
         
      }
      
      function rotateY(m, angle) {
         var c = Math.cos(angle);
         var s = Math.sin(angle);
         var mv0 = m[0], mv4 = m[4], mv8 = m[8];
      
         m[0] = c*m[0]+s*m[2];
         m[4] = c*m[4]+s*m[6];
         m[8] = c*m[8]+s*m[10];
      
         m[2] = c*m[2]-s*mv0;
         m[6] = c*m[6]-s*mv4;
         m[10] = c*m[10]-s*mv8;
         
      }
      
      /*================= Drawing ===========================*/
      var time_old = 0;
      function multiplyMatrices(a, b) {
         var result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
         for (var i = 0; i < 4; i++) {
           for (var j = 0; j < 4; j++) {
             for (var k = 0; k < 4; k++) {
               result[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
               result[i * 4 + j] = Number((result[i * 4 + j]).toFixed(1));
             }
           }
         }
         return result;
       }
       function matrixToString(matrix) {
         var str = "";
         for (var i = 0; i < 4; i++) {
           str += "[";
           for (var j = 0; j < 4; j++) {
             str += matrix[i * 4 + j] + (j < 3 ? ", " : "");
           }
           str += "]\n"; // Add a newline after each row
         }
         return str.slice(0, -2) + "]"; // Remove the trailing comma and newline
       }
       // ... your existing code ...
       
       
      
      var animate = function() {
      
         
         rotateZ(mov_matrix, Rx);//time
         rotateY(mov_matrix, Ry);
         rotateX(mov_matrix, Rz);
         var final_matrix = multiplyMatrices(proj_matrix, multiplyMatrices(mov_matrix, view_matrix));
         document.getElementById('out__val').value = matrixToString(final_matrix) + 
         '\n' + 'Tịnh tiến:'  + '\n' + matrixToString(mov_matrix_1) + 
         '\n' + 'Scale'  + '\n' + matrixToString(view_matrix_1) + 
         '\n' + 'Rotate'  + '\n' + matrixToString(multiplyMatrices(mov_matrix, view_matrix_1));
      
         gl.enable(gl.DEPTH_TEST);
         gl.depthFunc(gl.LEQUAL);
         gl.clearColor(0.5, 0.5, 0.5, 0.9);
         gl.clearDepth(1.0);
         
         gl.viewport(0.0, 0.0, canvas.width, canvas.height);
         gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
         gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
         gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
         gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
      
         gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
         document.getElementById('out__val').textContent = Pmatrix.value;
         // window.requestAnimationFrame(animate);
      }
      animate();
}