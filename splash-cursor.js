(function initSplash(){
  // Run on all devices (touch support included)

  const canvas=document.createElement('canvas');
  canvas.id='fluid-canvas';
  canvas.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;display:block';
  document.body.appendChild(canvas);

  const SIM=128,DYE=512,PRESSURE=.8,PRESS_ITER=18,CURL=18;
  const SPLAT_R=.14,SPLAT_F=800,DENSITY_D=4.5,VEL_D=3.5;

  const params={alpha:true,depth:false,stencil:false,antialias:false,preserveDrawingBuffer:false};
  let gl=canvas.getContext('webgl2',params);
  const isGL2=!!gl;
  if(!isGL2)gl=canvas.getContext('webgl',params)||canvas.getContext('experimental-webgl',params);

  let halfFloat,supportLinear;
  if(isGL2){gl.getExtension('EXT_color_buffer_float');supportLinear=gl.getExtension('OES_texture_float_linear');}
  else{halfFloat=gl.getExtension('OES_texture_half_float');supportLinear=gl.getExtension('OES_texture_half_float_linear');}
  gl.clearColor(0,0,0,1);
  const hfType=isGL2?gl.HALF_FLOAT:halfFloat?.HALF_FLOAT_OES;

  function supFmt(ifmt,fmt,type){
    const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,ifmt,4,4,0,fmt,type,null);
    const fbo=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
    return gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE;
  }
  function getSup(ifmt,fmt,type){
    if(!supFmt(ifmt,fmt,type)){
      if(ifmt===gl.R16F)return getSup(gl.RG16F,gl.RG,type);
      if(ifmt===gl.RG16F)return getSup(gl.RGBA16F,gl.RGBA,type);
      return null;
    }return{internalFormat:ifmt,format:fmt};
  }
  let fmtRGBA,fmtRG,fmtR;
  if(isGL2){fmtRGBA=getSup(gl.RGBA16F,gl.RGBA,hfType);fmtRG=getSup(gl.RG16F,gl.RG,hfType);fmtR=getSup(gl.R16F,gl.RED,hfType);}
  else{fmtRGBA=getSup(gl.RGBA,gl.RGBA,hfType);fmtRG=getSup(gl.RGBA,gl.RGBA,hfType);fmtR=getSup(gl.RGBA,gl.RGBA,hfType);}

  const filtering=supportLinear?gl.LINEAR:gl.NEAREST;

  function mkSrc(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
  function mkProg(vs,fs){const p=gl.createProgram();gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);return p;}
  function getU(p){const u={};const n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);for(let i=0;i<n;i++){const nm=gl.getActiveUniform(p,i).name;u[nm]=gl.getUniformLocation(p,nm);}return u;}

  const baseV=mkSrc(gl.VERTEX_SHADER,`precision highp float;attribute vec2 aPosition;varying vec2 vUv,vL,vR,vT,vB;uniform vec2 texelSize;void main(){vUv=aPosition*.5+.5;vL=vUv-vec2(texelSize.x,0);vR=vUv+vec2(texelSize.x,0);vT=vUv+vec2(0,texelSize.y);vB=vUv-vec2(0,texelSize.y);gl_Position=vec4(aPosition,0,1);}`);
  const copyF=mkSrc(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;void main(){gl_FragColor=texture2D(uTexture,vUv);}`);
  const clearF=mkSrc(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;uniform float value;void main(){gl_FragColor=value*texture2D(uTexture,vUv);}`);
  const splatF=mkSrc(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTarget;uniform float aspectRatio;uniform vec3 color;uniform vec2 point;uniform float radius;void main(){vec2 p=vUv-point.xy;p.x*=aspectRatio;vec3 splat=exp(-dot(p,p)/radius)*color;vec3 base=texture2D(uTarget,vUv).xyz;gl_FragColor=vec4(base+splat,1);}`);
  const advF=mkSrc(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uVelocity,uSource;uniform vec2 texelSize,dyeTexelSize;uniform float dt,dissipation;vec4 bilerp(sampler2D s,vec2 uv,vec2 ts){vec2 st=uv/ts-.5;vec2 iu=floor(st);vec2 fu=fract(st);vec4 a=texture2D(s,(iu+vec2(.5,.5))*ts),b=texture2D(s,(iu+vec2(1.5,.5))*ts),c=texture2D(s,(iu+vec2(.5,1.5))*ts),d=texture2D(s,(iu+vec2(1.5,1.5))*ts);return mix(mix(a,b,fu.x),mix(c,d,fu.x),fu.y);}void main(){vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;vec4 res=texture2D(uSource,coord);gl_FragColor=res/(1.+dissipation*dt);}`);
  const divF=mkSrc(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).x,R=texture2D(uVelocity,vR).x,T=texture2D(uVelocity,vT).y,B=texture2D(uVelocity,vB).y;vec2 C=texture2D(uVelocity,vUv).xy;if(vL.x<0.)L=-C.x;if(vR.x>1.)R=-C.x;if(vT.y>1.)T=-C.y;if(vB.y<0.)B=-C.y;gl_FragColor=vec4(.5*(R-L+T-B),0,0,1);}`);
  const curlF=mkSrc(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).y,R=texture2D(uVelocity,vR).y,T=texture2D(uVelocity,vT).x,B=texture2D(uVelocity,vB).x;gl_FragColor=vec4(.5*(R-L-T+B),0,0,1);}`);
  const vortF=mkSrc(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity,uCurl;uniform float curl,dt;void main(){float L=texture2D(uCurl,vL).x,R=texture2D(uCurl,vR).x,T=texture2D(uCurl,vT).x,B=texture2D(uCurl,vB).x,C=texture2D(uCurl,vUv).x;vec2 f=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));f/=length(f)+.0001;f*=curl*C;f.y*=-1.;vec2 v=texture2D(uVelocity,vUv).xy;v+=f*dt;v=min(max(v,-1e3),1e3);gl_FragColor=vec4(v,0,1);}`);
  const pressF=mkSrc(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uDivergence;void main(){float L=texture2D(uPressure,vL).x,R=texture2D(uPressure,vR).x,T=texture2D(uPressure,vT).x,B=texture2D(uPressure,vB).x,div=texture2D(uDivergence,vUv).x;gl_FragColor=vec4((L+R+B+T-div)*.25,0,0,1);}`);
  const gradF=mkSrc(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uVelocity;void main(){float L=texture2D(uPressure,vL).x,R=texture2D(uPressure,vR).x,T=texture2D(uPressure,vT).x,B=texture2D(uPressure,vB).x;vec2 v=texture2D(uVelocity,vUv).xy;v.xy-=vec2(R-L,T-B);gl_FragColor=vec4(v,0,1);}`);
  const dispF=mkSrc(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTexture;void main(){vec3 c=texture2D(uTexture,vUv).rgb;float a=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c,a);}`);

  const copyP=mkProg(baseV,copyF);const clearP=mkProg(baseV,clearF);const splatP=mkProg(baseV,splatF);
  const advP=mkProg(baseV,advF);const divP=mkProg(baseV,divF);const curlP=mkProg(baseV,curlF);
  const vortP=mkProg(baseV,vortF);const pressP=mkProg(baseV,pressF);const gradP=mkProg(baseV,gradF);
  const dispP=mkProg(baseV,dispF);
  const uCopy=getU(copyP),uClear=getU(clearP),uSplat=getU(splatP),uAdv=getU(advP),
        uDiv=getU(divP),uCurl=getU(curlP),uVort=getU(vortP),uPress=getU(pressP),
        uGrad=getU(gradP),uDisp=getU(dispP);

  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),gl.STATIC_DRAW);
  gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(0);

  function blit(target,clear=false){
    if(!target){gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);gl.bindFramebuffer(gl.FRAMEBUFFER,null);}
    else{gl.viewport(0,0,target.width,target.height);gl.bindFramebuffer(gl.FRAMEBUFFER,target.fbo);}
    if(clear){gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);}
    gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);
  }
  function mkFBO(w,h,ifmt,fmt,type,filt){
    gl.activeTexture(gl.TEXTURE0);const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,filt);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,filt);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,ifmt,w,h,0,fmt,type,null);
    const fbo=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
    gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT);
    return{texture:tex,fbo,width:w,height:h,texelSizeX:1/w,texelSizeY:1/h,attach(id){gl.activeTexture(gl.TEXTURE0+id);gl.bindTexture(gl.TEXTURE_2D,tex);return id;}};
  }
  function mkDFBO(w,h,ifmt,fmt,type,filt){
    let a=mkFBO(w,h,ifmt,fmt,type,filt),b=mkFBO(w,h,ifmt,fmt,type,filt);
    return{width:w,height:h,texelSizeX:a.texelSizeX,texelSizeY:a.texelSizeY,
      get read(){return a;},set read(v){a=v;},get write(){return b;},set write(v){b=v;},
      swap(){let t=a;a=b;b=t;}};
  }
  function getRes(r){let ar=gl.drawingBufferWidth/gl.drawingBufferHeight;if(ar<1)ar=1/ar;const mn=Math.round(r),mx=Math.round(r*ar);return gl.drawingBufferWidth>gl.drawingBufferHeight?{width:mx,height:mn}:{width:mn,height:mx};}
  function scaleByDPR(v){return Math.floor(v*(window.devicePixelRatio||1));}

  let dye,vel,divergence,curl2,pressure;
  function initFBOs(){
    const sim=getRes(SIM),dyeR=getRes(DYE);
    if(!dye)dye=mkDFBO(dyeR.width,dyeR.height,fmtRGBA.internalFormat,fmtRGBA.format,hfType,filtering);
    if(!vel)vel=mkDFBO(sim.width,sim.height,fmtRG.internalFormat,fmtRG.format,hfType,filtering);
    divergence=mkFBO(sim.width,sim.height,fmtR.internalFormat,fmtR.format,hfType,gl.NEAREST);
    curl2=mkFBO(sim.width,sim.height,fmtR.internalFormat,fmtR.format,hfType,gl.NEAREST);
    pressure=mkDFBO(sim.width,sim.height,fmtR.internalFormat,fmtR.format,hfType,gl.NEAREST);
  }
  initFBOs();

  // ZODI palette — very dim for subtlety
  const COLORS=[
    {r:.18,g:.28,b:.0},   // acid green dim
    {r:.10,g:.06,b:.22},  // purple dim
    {r:.14,g:.10,b:.26},  // purple-light dim
    {r:.12,g:.11,b:.09},  // bone dim
    {r:.04,g:.18,b:.12},  // teal dim
  ];
  let colorIdx=0;
  function nextColor(){const c=COLORS[colorIdx%COLORS.length];colorIdx++;return{r:c.r*.6,g:c.g*.6,b:c.b*.6};}

  let ptr={x:0,y:0,px:0,py:0,dx:0,dy:0,down:false,moved:false,color:nextColor()};

  function correctRadius(r){let ar=canvas.width/canvas.height;if(ar>1)r*=ar;return r;}
  function correctDX(d){let ar=canvas.width/canvas.height;if(ar<1)d*=ar;return d;}
  function correctDY(d){let ar=canvas.width/canvas.height;if(ar>1)d/=ar;return d;}

  function doSplat(x,y,dx,dy,color){
    gl.useProgram(splatP);
    gl.uniform1i(uSplat.uTarget,vel.read.attach(0));
    gl.uniform1f(uSplat.aspectRatio,canvas.width/canvas.height);
    gl.uniform2f(uSplat.point,x,y);
    gl.uniform3f(uSplat.color,dx,dy,0);
    gl.uniform1f(uSplat.radius,correctRadius(SPLAT_R/100));
    blit(vel.write);vel.swap();
    gl.uniform1i(uSplat.uTarget,dye.read.attach(0));
    gl.uniform3f(uSplat.color,color.r,color.g,color.b);
    blit(dye.write);dye.swap();
  }

  function step(dt){
    gl.disable(gl.BLEND);
    gl.useProgram(curlP);gl.uniform2f(uCurl.texelSize,vel.texelSizeX,vel.texelSizeY);gl.uniform1i(uCurl.uVelocity,vel.read.attach(0));blit(curl2);
    gl.useProgram(vortP);gl.uniform2f(uVort.texelSize,vel.texelSizeX,vel.texelSizeY);gl.uniform1i(uVort.uVelocity,vel.read.attach(0));gl.uniform1i(uVort.uCurl,curl2.attach(1));gl.uniform1f(uVort.curl,CURL);gl.uniform1f(uVort.dt,dt);blit(vel.write);vel.swap();
    gl.useProgram(divP);gl.uniform2f(uDiv.texelSize,vel.texelSizeX,vel.texelSizeY);gl.uniform1i(uDiv.uVelocity,vel.read.attach(0));blit(divergence);
    gl.useProgram(clearP);gl.uniform1i(uClear.uTexture,pressure.read.attach(0));gl.uniform1f(uClear.value,PRESSURE);blit(pressure.write);pressure.swap();
    gl.useProgram(pressP);gl.uniform2f(uPress.texelSize,vel.texelSizeX,vel.texelSizeY);gl.uniform1i(uPress.uDivergence,divergence.attach(0));
    for(let i=0;i<PRESS_ITER;i++){gl.uniform1i(uPress.uPressure,pressure.read.attach(1));blit(pressure.write);pressure.swap();}
    gl.useProgram(gradP);gl.uniform2f(uGrad.texelSize,vel.texelSizeX,vel.texelSizeY);gl.uniform1i(uGrad.uPressure,pressure.read.attach(0));gl.uniform1i(uGrad.uVelocity,vel.read.attach(1));blit(vel.write);vel.swap();
    gl.useProgram(advP);gl.uniform2f(uAdv.texelSize,vel.texelSizeX,vel.texelSizeY);gl.uniform2f(uAdv.dyeTexelSize,vel.texelSizeX,vel.texelSizeY);
    let vi=vel.read.attach(0);gl.uniform1i(uAdv.uVelocity,vi);gl.uniform1i(uAdv.uSource,vi);gl.uniform1f(uAdv.dt,dt);gl.uniform1f(uAdv.dissipation,VEL_D);blit(vel.write);vel.swap();
    gl.uniform2f(uAdv.dyeTexelSize,dye.texelSizeX,dye.texelSizeY);gl.uniform1i(uAdv.uVelocity,vel.read.attach(0));gl.uniform1i(uAdv.uSource,dye.read.attach(1));gl.uniform1f(uAdv.dissipation,DENSITY_D);blit(dye.write);dye.swap();
  }

  let lastT=Date.now();
  function frame(){
    const now=Date.now(),dt=Math.min((now-lastT)/1000,.016);lastT=now;
    if(canvas.width!==scaleByDPR(canvas.clientWidth)||canvas.height!==scaleByDPR(canvas.clientHeight)){
      canvas.width=scaleByDPR(canvas.clientWidth);canvas.height=scaleByDPR(canvas.clientHeight);initFBOs();
    }
    if(ptr.moved){ptr.moved=false;doSplat(ptr.x,ptr.y,ptr.dx*SPLAT_F,ptr.dy*SPLAT_F,ptr.color);}
    step(dt);
    gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.enable(gl.BLEND);
    gl.useProgram(dispP);gl.uniform1i(uDisp.uTexture,dye.read.attach(0));blit(null);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function onMove(x,y){
    ptr.dx=correctDX(x/canvas.width-ptr.x);ptr.dy=correctDY(ptr.y-y/canvas.height);
    ptr.x=x/canvas.width;ptr.y=1-y/canvas.height;ptr.moved=true;
  }
  window.addEventListener('mousemove',e=>{
    // shift color occasionally
    if(Math.random()<.008)ptr.color=nextColor();
    onMove(e.clientX*((window.devicePixelRatio)||1),e.clientY*((window.devicePixelRatio)||1));
  });
  window.addEventListener('touchmove',e=>{
    const t=e.touches[0];
    onMove(t.clientX*((window.devicePixelRatio)||1),t.clientY*((window.devicePixelRatio)||1));
  },{passive:true});
  window.addEventListener('click',e=>{
    ptr.color=nextColor();
    const c=nextColor();c.r*=3;c.g*=3;c.b*=3;
    doSplat(e.clientX/canvas.clientWidth,1-e.clientY/canvas.clientHeight,(Math.random()-.5)*4,(Math.random()-.5)*4,c);
  });
})();
