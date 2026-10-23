const EP = Object.fromEntries(SITE.episodes.map(e => [e.id, e]));
const PL = Object.fromEntries(SITE.places.map(p => [p.id, p]));
const CAT = Object.fromEntries(SITE.categories.map(c => [c.id, c]));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================================================
   CINEMATIC PLACEHOLDER RENDERER
   写真が無い間だけ、シーンごとの仮ビジュアルをCanvasで描画します
   ========================================================= */
function rng(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function hash(str){let h=2166136261;for(const ch of str)h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0}
function lin(c,x0,y0,x1,y1,st){const g=c.createLinearGradient(x0,y0,x1,y1);st.forEach(([o,col])=>g.addColorStop(o,col));return g}
function glow(c,x,y,rad,col){const g=c.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,col);g.addColorStop(1,col.replace(/[\d.]+\)$/,"0)"));c.fillStyle=g;c.fillRect(x-rad,y-rad,rad*2,rad*2)}
function quad(c,a,b,d,e,f,g,h,i){c.beginPath();c.moveTo(a,b);c.lineTo(d,e);c.lineTo(f,g);c.lineTo(h,i);c.closePath();c.fill()}
function rrect(c,x,y,w,h,r){c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);c.fill()}
function ell(c,x,y,rx,ry,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2);c.fill()}
function streaks(c,w,ymax,r,base,n){for(let i=0;i<n;i++)ell(c,r()*w,ymax*(.18+r()*.62),w*(.08+r()*.26),ymax*(.004+r()*.012),base+(.025+r()*.05).toFixed(3)+")")}
function ridge(c,w,h,base,amp,col,r,f){const p=[r()*6.28,r()*6.28,r()*6.28];c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=Math.max(2,w/220)){const t=x/w;const y=base-amp*(.55*(.5+.5*Math.sin(t*f*6.28+p[0]))+.3*(.5+.5*Math.sin(t*f*2.3*6.28+p[1]))+.15*(.5+.5*Math.sin(t*f*7.7*6.28+p[2])));c.lineTo(x,y)}c.lineTo(w,h);c.closePath();c.fillStyle=col;c.fill()}
function trees(c,x0,x1,base,hgt,col,r,dens=1){c.fillStyle=col;c.beginPath();const step=Math.max(1.5,hgt*.3/dens);for(let x=x0;x<x1;x+=step*(.5+r()*.9)){const th=hgt*(.55+r()*.6),tw=th*(.26+r()*.12);c.moveTo(x-tw/2,base);c.lineTo(x,base-th);c.lineTo(x+tw/2,base)}c.fill();c.fillRect(x0,base-hgt*.18,x1-x0,hgt*.2)}
function horizonTrees(c,w,hy,h,col,r,hmin=.014,hvar=.014){let x=-10;while(x<w){const len=w*(.05+r()*.22);trees(c,x,x+len,hy+1,h*(hmin+r()*hvar),col,r);x+=len+w*(.006+r()*.05)}}
function windbreak(c,w,h,hy,vx,L,H,col,r,sp=.5){c.fillStyle=col;c.beginPath();let z=1;while(z<90){const s=1/z,x=vx+L*w*sp*s,y=hy+(h-hy)*s,th=H*(h-hy)*s*(.75+r()*.45),tw=th*.3;c.moveTo(x-tw,y);c.lineTo(x,y-th);c.lineTo(x+tw,y);z+=.03*z*(.6+r()*.8)}c.fill()}
function walker(c,x,yb,fh,col){c.fillStyle=col;const hr=fh*.068;c.beginPath();c.arc(x,yb-fh+hr,hr,0,7);c.fill();rrect(c,x-fh*.11,yb-fh*.85,fh*.22,fh*.43,fh*.06);c.fillRect(x-fh*.085,yb-fh*.46,fh*.075,fh*.46);c.fillRect(x+fh*.012,yb-fh*.46,fh*.075,fh*.46);const sw=fh*.2,sh=fh*.27;rrect(c,x+fh*.15,yb-sh,sw,sh,fh*.025);c.fillRect(x+fh*.15+sw*.45,yb-sh-fh*.15,Math.max(1,fh*.016),fh*.15);c.strokeStyle=col;c.lineCap="round";c.lineWidth=fh*.05;c.beginPath();c.moveTo(x+fh*.08,yb-fh*.79);c.lineTo(x+fh*.17,yb-fh*.43);c.stroke();ell(c,x+fh*.05,yb+fh*.015,fh*.32,fh*.025,"rgba(0,0,0,0.35)")}

const S = {};
S.road = (c,w,h,r,o={}) => {
  const hy=h*(o.hy||.6), vx=w*(o.vx||.5), sp=.5;
  c.fillStyle=lin(c,0,0,0,hy,o.sky||[[0,"#0A1012"],[.42,"#1A2527"],[.78,"#3C443F"],[1,"#8A7352"]]);c.fillRect(0,0,w,hy+1);
  glow(c,w*(o.sunX||.64),hy+h*.01,Math.max(w,h)*.45,o.sun||"rgba(224,170,104,0.40)");
  streaks(c,w,hy,r,o.cloud||"rgba(214,198,170,",9);
  ridge(c,w,h,hy+1,h*.045,o.mount||"rgba(56,68,70,0.8)",r,1.6);
  horizonTrees(c,w,hy,h,o.tree||"#141B1B",r);
  c.fillStyle=lin(c,0,hy,0,h,o.ground||[[0,"#2A302B"],[.35,"#161C1A"],[1,"#090C0C"]]);c.fillRect(0,hy,w,h-hy);
  c.fillStyle=o.furrow||"rgba(255,240,210,0.035)";for(let z=1.1;z<70;z*=1.16){const y=hy+(h-hy)/z;c.fillRect(0,y,w,Math.max(1,h*.0012))}
  windbreak(c,w,h,hy,vx,-2.6,1.45,o.tree2||"#0D1313",r);
  windbreak(c,w,h,hy,vx,3.4,1.25,o.tree2||"#0D1313",r);
  c.fillStyle=lin(c,0,hy,0,h,[[0,o.roadFar||"#615848"],[.22,o.roadMid||"#2A2B28"],[1,"#101313"]]);
  c.beginPath();c.moveTo(vx-.55*w*sp,h);c.lineTo(vx,hy);c.lineTo(vx+.55*w*sp,h);c.closePath();c.fill();
  c.strokeStyle="rgba(235,228,210,0.22)";c.lineWidth=Math.max(1,w*.0014);
  for(const X of [-.5,.5]){c.beginPath();c.moveTo(vx+X*w*sp,h);c.lineTo(vx,hy);c.stroke()}
  c.fillStyle="rgba(232,220,190,0.55)";
  for(let z=1;z<90;z+=1.3){const z2=z+.6,hw=.012;quad(c,vx-hw*w*sp/z,hy+(h-hy)/z,vx+hw*w*sp/z,hy+(h-hy)/z,vx+hw*w*sp/z2,hy+(h-hy)/z2,vx-hw*w*sp/z2,hy+(h-hy)/z2)}
  const tops=[];c.fillStyle=o.pole||"#0B0F10";
  for(let z=1.15;z<70;z+=1.6){const s=1/z,x=vx+.95*w*sp*s,yb=hy+(h-hy)*s,ph=(h-hy)*1.25*s,pw=Math.max(1,w*.006*s);c.fillRect(x-pw/2,yb-ph,pw,ph);c.fillRect(x-pw*4,yb-ph*.93,pw*8,Math.max(1,pw*.6));tops.push([x,yb-ph*.92])}
  c.strokeStyle=o.wire||"rgba(8,10,11,0.75)";c.lineWidth=Math.max(.6,w*.0008);c.beginPath();
  for(let i=0;i<tops.length-1;i++){const [a,b]=tops[i],[d,e]=tops[i+1];c.moveTo(a,b);c.quadraticCurveTo((a+d)/2,(b+e)/2+(b-e)*.18+2,d,e)}c.stroke();
  c.fillStyle=lin(c,0,hy-h*.07,0,hy+h*.05,[[0,"rgba(150,138,112,0)"],[.55,o.fog||"rgba(150,138,112,0.22)"],[1,"rgba(150,138,112,0)"]]);c.fillRect(0,hy-h*.07,w,h*.12);
  if(o.figure){const z=o.figure,s=1/z,X=-.12;walker(c,vx+X*w*sp*s,hy+(h-hy)*s,(h-hy)*s*1.02,o.figCol||"#07090A")}
};
S.person = (c,w,h,r) => S.road(c,w,h,r,{hy:.56,vx:.46,sunX:.4,figure:2.4,
  sky:[[0,"#0F1A1E"],[.45,"#2A3B40"],[.8,"#62705F"],[1,"#B39468"]],sun:"rgba(236,192,128,0.45)",mount:"rgba(70,84,86,0.8)",
  ground:[[0,"#38403A"],[.3,"#1B2220"],[1,"#0A0D0D"]],roadFar:"#8C7C60",roadMid:"#353632",fog:"rgba(190,170,130,0.28)"});
S.panorama = (c,w,h,r) => {
  const hy=h*.34, vx=w*.48;
  c.fillStyle=lin(c,0,0,0,hy,[[0,"#8E9C9E"],[.6,"#BFC3BA"],[1,"#D8D2C0"]]);c.fillRect(0,0,w,hy+1);
  streaks(c,w,hy,r,"rgba(245,242,232,",10);
  glow(c,w*.72,hy*.55,w*.3,"rgba(255,246,222,0.35)");
  ridge(c,w,h,hy+1,h*.03,"rgba(110,124,128,0.55)",r,2.2);
  c.fillStyle="#5E6C55";c.fillRect(0,hy,w,h-hy);
  const pal=["#6B7A5C","#7C8763","#5E6E53","#8A8E6B","#6F7B66","#7F8A6E","#666F52"];
  const Z=[];for(let z=1;z<70;z*=1.13)Z.push(z);
  const P=(X,z)=>[vx+X*w*.2/z,hy+(h-hy)/z];
  for(let j=0;j<Z.length-1;j++)for(let X=-36;X<36;X++){const [a,b]=P(X,Z[j]),[d]=P(X+1,Z[j]),[f,g]=P(X+1,Z[j+1]),[k]=P(X,Z[j+1]);if(Math.max(a,d)<0||Math.min(a,d)>w)continue;c.fillStyle=pal[(r()*pal.length)|0];quad(c,a,b,d,b,f,g,k,g)}
  c.fillStyle="#26332A";
  for(let X=-36;X<=36;X+=3){for(let j=0;j<Z.length-1;j++){const [a,b]=P(X-.09,Z[j]),[d]=P(X+.09,Z[j]),[f,g]=P(X+.09,Z[j+1]),[k]=P(X-.09,Z[j+1]);quad(c,a,b,d,b,f,g,k,g)}}
  for(let j=0;j<Z.length-1;j+=2){const z=Z[j],z2=z*1.035;const [a,b]=P(-40,z),[d]=P(40,z),[,g]=P(40,z2);quad(c,a,b,d,b,d,g,a,g)}
  c.fillStyle=lin(c,0,hy,0,hy+(h-hy)*.65,[[0,"rgba(210,208,194,0.9)"],[.4,"rgba(200,200,186,0.35)"],[1,"rgba(200,200,186,0)"]]);c.fillRect(0,hy,w,(h-hy)*.65);
  const ry=h*.9;c.fillStyle="rgba(14,18,18,0.88)";c.fillRect(0,ry,w,Math.max(2,h*.012));for(let x=w*.04;x<w;x+=w*.16)c.fillRect(x,ry,Math.max(2,w*.006),h-ry);
};
S.field = (c,w,h,r,o={}) => {
  const hy=h*.6, vx=w*.45, sp=.5;
  c.fillStyle=lin(c,0,0,0,hy,[[0,"#74807E"],[.6,"#A6AAA0"],[1,"#C9C4B0"]]);c.fillRect(0,0,w,hy+1);
  streaks(c,w,hy,r,"rgba(236,232,218,",10);
  glow(c,w*.3,hy*.7,w*.35,"rgba(250,240,214,0.28)");
  ridge(c,w,h,hy+1,h*.04,"rgba(98,110,110,0.55)",r,1.9);
  horizonTrees(c,w,hy,h,"#2F3A32",r,.016,.016);
  c.fillStyle=lin(c,0,hy,0,h,[[0,"#7E875F"],[.4,"#606B44"],[1,"#394229"]]);c.fillRect(0,hy,w,h-hy);
  windbreak(c,w,h,hy,vx,-2.4,1.3,"#25302A",r);
  if(o.barn){const s=h*.075,bx=w*.64,by=hy+h*.012;c.fillStyle="#4C3A30";c.fillRect(bx,by-s*.7,s*1.7,s*.7);c.fillStyle="#2A2F31";c.beginPath();c.moveTo(bx-s*.06,by-s*.68);c.lineTo(bx+s*.22,by-s*1.08);c.lineTo(bx+s*.85,by-s*1.3);c.lineTo(bx+s*1.48,by-s*1.08);c.lineTo(bx+s*1.76,by-s*.68);c.fill();c.fillStyle=lin(c,bx+s*1.85,0,bx+s*2.35,0,[[0,"#8F8A7E"],[.5,"#D1CBBC"],[1,"#8A8579"]]);c.fillRect(bx+s*1.85,by-s*1.6,s*.5,s*1.6);ell(c,bx+s*2.1,by-s*1.6,s*.25,s*.14,"#A9A496");c.fillStyle="#1C1A18";c.fillRect(bx+s*.7,by-s*.42,s*.3,s*.42)}
  [[2.4,.5],[3.3,1.1],[5,-.25],[7,.9]].forEach(([z,X])=>{const s=1/z,x=vx+X*w*sp*s,y=hy+(h-hy)*s,b=(h-hy)*.42*s;ell(c,x,y+b*.04,b*.8,b*.12,"rgba(20,24,14,0.4)");c.fillStyle=lin(c,0,y-b,0,y,[[0,"#F2F0E9"],[1,"#BDBBB1"]]);rrect(c,x-b*.6,y-b,b*1.2,b,b*.48);ell(c,x-b*.42,y-b*.5,b*.17,b*.48,"#FBFAF5")});
  for(let i=0;i<1100;i++){const y=hy+(h-hy)*(.15+r()*.85),k=(y-hy)/(h-hy),x=r()*w,l=h*(.006+r()*.022)*k;c.fillStyle=r()<.6?"rgba(30,38,18,0.2)":"rgba(220,222,180,0.09)";c.fillRect(x,y-l,Math.max(1,w*.0012*k),l)}
  const fp=[];c.fillStyle="#2A2620";for(let z=1.15;z<40;z+=1.1){const s=1/z,x=vx-.85*w*sp*s,y=hy+(h-hy)*s,ph=(h-hy)*.3*s,pw=Math.max(1,w*.007*s);c.fillRect(x-pw/2,y-ph,pw,ph);fp.push([x,y-ph,ph])}
  c.strokeStyle="rgba(30,28,24,0.55)";c.lineWidth=Math.max(.6,w*.0007);for(const f of [.15,.55]){c.beginPath();fp.forEach(([x,y,ph],i)=>{const yy=y+ph*f;i?c.lineTo(x,yy):c.moveTo(x,yy)});c.stroke()}
};
S.barn = (c,w,h,r) => S.field(c,w,h,r,{barn:true});
S.airport = (c,w,h,r) => {
  const hy=h*.56, vx=w*.46, sp=.5;
  c.fillStyle=lin(c,0,0,0,hy,[[0,"#04070A"],[.6,"#0C151C"],[1,"#23313A"]]);c.fillRect(0,0,w,hy+1);
  for(let i=0;i<90;i++){c.fillStyle=`rgba(230,235,240,${(.08+r()*.35).toFixed(2)})`;const s=.4+r()*1.4;c.fillRect(r()*w,r()*hy*.7,s,s)}
  glow(c,w*.82,hy,w*.32,"rgba(214,160,96,0.24)");glow(c,w*.12,hy,w*.26,"rgba(120,150,180,0.14)");
  for(let i=0;i<160;i++){const x=r()*w,s=.6+r()*1.6;c.fillStyle=r()<.7?`rgba(240,200,140,${(.3+r()*.5).toFixed(2)})`:`rgba(200,220,255,${(.3+r()*.4).toFixed(2)})`;c.fillRect(x,hy-r()*h*.012,s,s)}
  c.fillStyle=lin(c,0,hy,0,h,[[0,"#0B0F12"],[1,"#030506"]]);c.fillRect(0,hy,w,h-hy);
  c.fillStyle=lin(c,0,hy,0,h,[[0,"#1B2124"],[1,"#0A0D0F"]]);c.beginPath();c.moveTo(vx-1.15*w*sp,h);c.lineTo(vx,hy);c.lineTo(vx+1.15*w*sp,h);c.fill();
  c.fillStyle="rgba(220,220,210,0.16)";for(let z=1;z<90;z+=1.7){const z2=z+.8,hw=.02;quad(c,vx-hw*w*sp/z,hy+(h-hy)/z,vx+hw*w*sp/z,hy+(h-hy)/z,vx+hw*w*sp/z2,hy+(h-hy)/z2,vx-hw*w*sp/z2,hy+(h-hy)/z2)}
  const L=(x,y,rad,rgb)=>{glow(c,x,y,rad*7,`rgba(${rgb},0.30)`);c.fillStyle=`rgba(${rgb},1)`;c.beginPath();c.arc(x,y,rad,0,7);c.fill()};
  for(let z=1.05;z<120;z+=.9){const s=1/z,y=hy+(h-hy)*s;for(const X of [-1.05,1.05])L(vx+X*w*sp*s,y,Math.max(.7,w*.004*s),"246,226,186")}
  for(let z=1.6;z<120;z+=1.8)L(vx,hy+(h-hy)/z,Math.max(.5,w*.0024/z),"235,240,245");
  for(let z=1.2;z<70;z+=2.2)L(vx-2.6*w*sp/z,hy+(h-hy)/z,Math.max(.6,w*.003/z),"92,140,232");
  for(let i=-5;i<=5;i++)L(vx+i*w*.0028,hy+(h-hy)/110,Math.max(.6,w*.0007),"226,70,60");
  c.fillStyle=lin(c,0,hy-h*.05,0,hy+h*.04,[[0,"rgba(90,110,130,0)"],[.5,"rgba(90,110,130,0.16)"],[1,"rgba(90,110,130,0)"]]);c.fillRect(0,hy-h*.05,w,h*.09);
};
S.town = (c,w,h,r) => {
  const hy=h*.64;
  c.fillStyle=lin(c,0,0,0,hy,[[0,"#081012"],[.7,"#15211F"],[1,"#2A3330"]]);c.fillRect(0,0,w,hy+1);
  glow(c,w*.5,hy,w*.55,"rgba(206,150,88,0.18)");
  const lights=[];let x=-20;
  while(x<w){const bw=w*(.05+r()*.1),bh=h*(.1+r()*.2);c.fillStyle=r()<.5?"#0B1112":"#0E1415";c.fillRect(x,hy-bh,bw,bh+1);
    const cs=Math.max(4,h*.022);for(let yy=hy-bh+cs;yy<hy-cs;yy+=cs*1.6)for(let xx=x+cs*.6;xx<x+bw-cs;xx+=cs*1.4)if(r()<.26){c.fillStyle=r()<.75?`rgba(238,196,132,${(.35+r()*.5).toFixed(2)})`:`rgba(170,205,205,${(.3+r()*.4).toFixed(2)})`;c.fillRect(xx,yy,cs*.8,cs*.9)}
    if(r()<.4){const sc=["214,170,110","120,170,160","226,222,210","196,112,92"][(r()*4)|0],sw=bw*.12,sh=bh*.5,sx=x+bw*.78;glow(c,sx+sw/2,hy-bh*.6,bw*.5,`rgba(${sc},0.22)`);c.fillStyle=`rgba(${sc},0.85)`;c.fillRect(sx,hy-bh*.85,sw,sh);lights.push([sx+sw/2,sc,sw])}
    x+=bw+(r()<.2?w*.02:0)}
  for(let i=0;i<5;i++){const lx=w*(.08+i*.22+r()*.05),ph=h*.2;c.fillStyle="#060909";c.fillRect(lx,hy-ph,Math.max(1.5,w*.0025),ph);glow(c,lx,hy-ph,w*.06,"rgba(244,206,150,0.55)");ell(c,lx,hy-ph,w*.004,w*.003,"rgba(255,236,200,0.95)");lights.push([lx,"244,206,150",w*.004])}
  c.fillStyle=lin(c,0,hy,0,h,[[0,"#161B1B"],[1,"#060808"]]);c.fillRect(0,hy,w,h-hy);
  lights.forEach(([lx,sc,lw])=>{c.fillStyle=lin(c,0,hy,0,hy+(h-hy)*.8,[[0,`rgba(${sc},0.35)`],[1,`rgba(${sc},0)`]]);c.fillRect(lx-lw*1.2,hy,lw*2.4,(h-hy)*.8)});
  for(let i=0;i<16;i++){const bx=r()*w,by=r()<.5?r()*h*.35:h*(.75+r()*.25),br=w*(.02+r()*.06);ell(c,bx,by,br,br,r()<.6?`rgba(236,180,110,${(.05+r()*.1).toFixed(2)})`:`rgba(150,200,200,${(.04+r()*.08).toFixed(2)})`)}
};
S.cafe = (c,w,h,r) => {
  c.fillStyle=lin(c,0,0,w,h,[[0,"#2C231C"],[1,"#120E0C"]]);c.fillRect(0,0,w,h);
  const wx=w*.56,wy=h*.08,ww=w*.4,wh=h*.56;
  c.fillStyle=lin(c,wx,wy,wx,wy+wh,[[0,"#B7C1BD"],[1,"#E0DBCB"]]);c.fillRect(wx,wy,ww,wh);
  for(let i=0;i<9;i++)ell(c,wx+r()*ww,wy+wh*(.55+r()*.45),ww*(.08+r()*.14),wh*(.06+r()*.12),`rgba(70,90,75,${(.15+r()*.25).toFixed(2)})`);
  c.fillStyle="#1A1411";c.fillRect(wx+ww/2-w*.004,wy,w*.008,wh);c.fillRect(wx,wy+wh*.42,ww,Math.max(2,h*.008));
  c.strokeStyle="#1A1411";c.lineWidth=w*.012;c.strokeRect(wx,wy,ww,wh);
  glow(c,wx+ww*.4,wy+wh,w*.55,"rgba(232,222,196,0.20)");
  const lx=w*.24;c.fillStyle="rgba(0,0,0,0.65)";c.fillRect(lx-1,0,2,h*.2);
  c.fillStyle="#2C2A26";c.beginPath();c.moveTo(lx-w*.055,h*.27);c.lineTo(lx-w*.02,h*.2);c.lineTo(lx+w*.02,h*.2);c.lineTo(lx+w*.055,h*.27);c.fill();
  glow(c,lx,h*.3,w*.32,"rgba(236,178,104,0.38)");ell(c,lx,h*.27,w*.045,h*.008,"rgba(255,226,170,0.9)");
  for(let i=0;i<10;i++){const br=w*(.015+r()*.05);ell(c,r()*w*.45,r()*h*.6,br,br,`rgba(232,170,100,${(.05+r()*.1).toFixed(2)})`)}
  const ty=h*.68;c.fillStyle=lin(c,0,ty,0,h,[[0,"#4C3929"],[.08,"#34281E"],[1,"#140F0C"]]);c.fillRect(0,ty,w,h-ty);
  c.fillStyle="rgba(255,220,170,0.22)";c.fillRect(0,ty,w,Math.max(1,h*.003));
  const cw=Math.min(w,h)*.2,ch=cw*.74,cx=w*.42,yb=ty+(h-ty)*.42;
  ell(c,cx+cw*.1,yb+cw*.05,cw*.95,cw*.16,"rgba(0,0,0,0.4)");
  ell(c,cx,yb,cw*.92,cw*.19,"#D7D1C4");ell(c,cx,yb-cw*.02,cw*.62,cw*.11,"#BDB6A8");
  c.strokeStyle="#CFC8BB";c.lineWidth=cw*.07;c.beginPath();c.ellipse(cx-cw*.52,yb-ch*.55,cw*.14,cw*.16,0,Math.PI*.5,Math.PI*1.5);c.stroke();
  c.fillStyle=lin(c,cx-cw/2,0,cx+cw/2,0,[[0,"#A39C8F"],[.6,"#EFEAE0"],[1,"#C3BCAE"]]);
  c.beginPath();c.moveTo(cx-cw/2,yb-ch);c.bezierCurveTo(cx-cw/2,yb-ch*.3,cx-cw*.36,yb,cx,yb);c.bezierCurveTo(cx+cw*.36,yb,cx+cw/2,yb-ch*.3,cx+cw/2,yb-ch);c.closePath();c.fill();
  ell(c,cx,yb-ch,cw/2,cw*.12,"#ECE7DD");ell(c,cx,yb-ch+cw*.012,cw*.44,cw*.095,"#2E1D12");
  c.strokeStyle="rgba(240,235,225,0.10)";c.lineWidth=cw*.06;c.lineCap="round";
  if("filter" in c)c.filter=`blur(${Math.max(2,cw*.04)}px)`;
  for(let i=0;i<3;i++){const sx=cx+(i-1)*cw*.15;c.beginPath();c.moveTo(sx,yb-ch*1.05);c.bezierCurveTo(sx-cw*.25,yb-ch*1.6,sx+cw*.3,yb-ch*2,sx,yb-ch*2.6-r()*ch*.5);c.stroke()}
  if("filter" in c)c.filter="none";
};
S.food = (c,w,h,r) => {
  c.fillStyle=lin(c,0,0,0,h,[[0,"#1D1815"],[1,"#0C0A09"]]);c.fillRect(0,0,w,h);
  glow(c,w*.2,0,w*.7,"rgba(230,170,100,0.20)");
  const ty=h*.6;c.fillStyle=lin(c,0,ty,0,h,[[0,"#5C4331"],[1,"#24190F"]]);c.fillRect(0,ty,w,h-ty);
  for(let i=0;i<30;i++){c.fillStyle=`rgba(20,12,6,${(.08+r()*.12).toFixed(2)})`;c.fillRect(0,ty+(h-ty)*r(),w,Math.max(1,h*.002))}
  const cx=w*.5,bw=Math.min(w,h*1.5)*.46,rimY=h*.6,ry=bw*.2,by=rimY+bw*.32;
  ell(c,cx+bw*.06,by+bw*.02,bw*.55,bw*.08,"rgba(0,0,0,0.5)");
  c.fillStyle=lin(c,cx-bw/2,0,cx+bw/2,0,[[0,"#15181A"],[.55,"#3A4043"],[1,"#121416"]]);
  c.beginPath();c.moveTo(cx-bw/2,rimY);c.bezierCurveTo(cx-bw/2,rimY+bw*.3,cx-bw*.2,by,cx,by);c.bezierCurveTo(cx+bw*.2,by,cx+bw/2,rimY+bw*.3,cx+bw/2,rimY);c.closePath();c.fill();
  ell(c,cx,rimY,bw/2,ry,"#E4DED2");
  const sg=c.createRadialGradient(cx,rimY,0,cx,rimY,bw*.46);sg.addColorStop(0,"#D59650");sg.addColorStop(1,"#874E22");c.fillStyle=sg;c.beginPath();c.ellipse(cx,rimY+ry*.06,bw*.46,ry*.84,0,0,7);c.fill();
  c.strokeStyle="rgba(244,214,156,0.55)";c.lineWidth=Math.max(1,bw*.008);for(let i=0;i<14;i++){const ox=(r()-.5)*bw*.5,oy=(r()-.5)*ry*.8;c.beginPath();c.ellipse(cx+ox,rimY+oy,bw*(.05+r()*.08),ry*(.1+r()*.15),r()*.6,0,Math.PI);c.stroke()}
  ell(c,cx-bw*.14,rimY+ry*.05,bw*.12,ry*.42,"#7A4A2C");ell(c,cx-bw*.14,rimY+ry*.02,bw*.08,ry*.26,"#9A6440");
  ell(c,cx+bw*.15,rimY-ry*.05,bw*.075,ry*.4,"#F1EBDD");ell(c,cx+bw*.15,rimY-ry*.05,bw*.04,ry*.22,"#E39B2D");
  c.fillStyle="#1D2420";c.beginPath();c.moveTo(cx+bw*.18,rimY-ry*.7);c.lineTo(cx+bw*.36,rimY-ry*.95);c.lineTo(cx+bw*.4,rimY-ry*.2);c.lineTo(cx+bw*.25,rimY-ry*.05);c.fill();
  for(let i=0;i<26;i++)ell(c,cx+(r()-.5)*bw*.6,rimY+(r()-.5)*ry*1.1,bw*.012,bw*.008,"#86A260");
  c.strokeStyle="rgba(240,236,228,0.09)";c.lineWidth=bw*.07;c.lineCap="round";if("filter" in c)c.filter=`blur(${Math.max(3,bw*.03)}px)`;
  for(let i=0;i<4;i++){const sx=cx+(i-1.5)*bw*.16;c.beginPath();c.moveTo(sx,rimY-ry*.4);c.bezierCurveTo(sx-bw*.2,rimY-bw*.5,sx+bw*.25,rimY-bw*.75,sx,rimY-bw*(1+r()*.3));c.stroke()}
  if("filter" in c)c.filter="none";
};
S.onsen = (c,w,h,r) => {
  const wy=h*.58;
  c.fillStyle=lin(c,0,0,0,wy,[[0,"#222D2C"],[1,"#46504A"]]);c.fillRect(0,0,w,wy+1);
  ridge(c,w,h,wy*.62,h*.14,"rgba(30,40,38,0.9)",r,1.2);
  trees(c,-20,w+20,wy-h*.02,h*.24,"#141C1A",r,.6);
  trees(c,-20,w+20,wy+2,h*.34,"#0A100F",r,.45);
  c.fillStyle=lin(c,0,wy,0,h,[[0,"#2E3B38"],[1,"#0D1314"]]);c.fillRect(0,wy,w,h-wy);
  for(let i=0;i<40;i++)ell(c,r()*w,wy+(h-wy)*r(),w*(.05+r()*.15),h*.002,`rgba(210,220,210,${(.03+r()*.06).toFixed(2)})`);
  glow(c,w*.18,wy-h*.03,w*.14,"rgba(232,170,100,0.45)");c.fillStyle="rgba(255,214,160,0.9)";c.fillRect(w*.178,wy-h*.05,w*.006,h*.03);
  c.fillStyle=lin(c,0,wy,0,h,[[0,"rgba(232,170,100,0.25)"],[1,"rgba(232,170,100,0)"]]);c.fillRect(w*.17,wy,w*.02,(h-wy)*.6);
  for(let i=0;i<9;i++)ell(c,r()*w,h*(.88+r()*.14),w*(.08+r()*.12),h*(.04+r()*.05),"#070A0A");
  for(let i=0;i<46;i++){const sx=r()*w,sy=wy-r()*h*.45+h*.08;glow(c,sx,sy,w*(.05+r()*.14),`rgba(226,230,224,${(.04+r()*.07).toFixed(3)})`)}
};
S.snow = (c,w,h,r) => {
  const hy=h*.58,vx=w*.5;
  c.fillStyle=lin(c,0,0,0,hy,[[0,"#A9B4B9"],[.6,"#CAD0CF"],[1,"#E0E2DC"]]);c.fillRect(0,0,w,hy+1);
  glow(c,w*.7,hy-h*.2,w*.2,"rgba(255,252,240,0.6)");ell(c,w*.7,hy-h*.2,w*.025,w*.025,"rgba(255,255,250,0.85)");
  ridge(c,w,h,hy+1,h*.04,"rgba(150,162,168,0.6)",r,1.8);
  horizonTrees(c,w,hy,h,"#5B6865",r);
  c.fillStyle=lin(c,0,hy,0,h,[[0,"#E5E9E6"],[1,"#CBD3D3"]]);c.fillRect(0,hy,w,h-hy);
  windbreak(c,w,h,hy,vx,-1.8,1.1,"#3F4B48",r);
  for(let i=0;i<14;i++)ell(c,r()*w,hy+(h-hy)*(.2+r()*.8),w*(.1+r()*.2),h*(.006+r()*.012),r()<.5?"rgba(255,255,255,0.4)":"rgba(160,175,182,0.18)");
  c.strokeStyle="rgba(120,135,140,0.32)";c.lineWidth=Math.max(1,w*.002);for(const off of [-.02,.02]){c.beginPath();c.moveTo(w*(.56+off),h);c.bezierCurveTo(w*(.5+off),h*.82,w*(.58+off*.4),h*.7,vx+w*.02,hy+h*.01);c.stroke()}
  for(let i=0;i<420;i++){const s=(.6+r()*2.4)*Math.max(1,w/900);c.fillStyle=`rgba(255,255,255,${(.45+r()*.5).toFixed(2)})`;c.beginPath();c.arc(r()*w,r()*h,s,0,7);c.fill()}
};
S.shelf = (c,w,h,r) => {
  c.fillStyle="#17120F";c.fillRect(0,0,w,h);
  const pal=["#6B4E3D","#3F5348","#8B7355","#2F3B44","#A0896B","#5C3B35","#41474A","#C2B49A","#7A6A4E","#4E5A52"];
  const rh=h*.24;for(let y0=h*.06;y0<h;y0+=rh){let x=w*.03;while(x<w*.97){if(r()<.07){const s=rh*.82;c.fillStyle=pal[(r()*pal.length)|0];c.fillRect(x,y0+rh-s-h*.02,s,s);ell(c,x+s*.5,y0+rh-s*.5-h*.02,s*.3,s*.3,"rgba(10,10,10,0.7)");ell(c,x+s*.5,y0+rh-s*.5-h*.02,s*.06,s*.06,"rgba(230,220,200,0.8)");x+=s+w*.006;continue}
      const sw=w*(.006+r()*.016),sh=rh*(.7+r()*.22);c.fillStyle=pal[(r()*pal.length)|0];c.fillRect(x,y0+rh-sh-h*.02,sw,sh);c.fillStyle="rgba(0,0,0,0.18)";c.fillRect(x+sw-1,y0+rh-sh-h*.02,1,sh);x+=sw+(r()<.1?w*.004:0)}
    c.fillStyle="#2A1F18";c.fillRect(0,y0+rh-h*.02,w,h*.02)}
  const g=c.createRadialGradient(w*.45,h*.28,0,w*.45,h*.28,Math.hypot(w,h)*.65);g.addColorStop(0,"rgba(255,200,130,0.10)");g.addColorStop(.45,"rgba(12,9,7,0.15)");g.addColorStop(1,"rgba(8,6,5,0.78)");c.fillStyle=g;c.fillRect(0,0,w,h);
};

let GRAIN;
function grainTile(){if(GRAIN)return GRAIN;const c=document.createElement("canvas");c.width=c.height=160;const x=c.getContext("2d"),d=x.createImageData(160,160);for(let i=0;i<d.data.length;i+=4){const v=(Math.random()*255)|0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0);GRAIN=c;return c}
function finish(c,w,h){c.save();c.globalAlpha=.09;c.globalCompositeOperation="overlay";c.fillStyle=c.createPattern(grainTile(),"repeat");c.fillRect(0,0,w,h);c.restore();
  c.save();c.globalCompositeOperation="soft-light";c.fillStyle="rgba(40,70,72,0.18)";c.fillRect(0,0,w,h);c.restore();
  const g=c.createRadialGradient(w/2,h/2,Math.min(w,h)*.35,w/2,h/2,Math.hypot(w,h)*.62);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,0.42)");c.fillStyle=g;c.fillRect(0,0,w,h)}

/* =========================================================
   MEDIA — 写真・動画があればそれを表示し、無い間（または読み込み失敗時）は仮ビジュアルを描画
   ========================================================= */
const isSP = () => matchMedia("(max-width: 720px)").matches;
const saveData = !!(navigator.connection && navigator.connection.saveData);

function mediaFor(fig){
  const key = fig.dataset.media;
  if(key && SITE.media[key]) return SITE.media[key];
  return { src: fig.dataset.src || "", alt: fig.dataset.alt || "" };
}
function paintCanvas(fig){
  const rect=fig.getBoundingClientRect();if(rect.width<2||rect.height<2)return;
  let cv=fig.querySelector("canvas");
  if(!cv){cv=document.createElement("canvas");cv.setAttribute("aria-hidden","true");fig.prepend(cv);
    if(SITE.showDraftLabels&&!fig.closest(".poster")){
      if(fig.classList.contains("hero-media")){
        // ファーストビューは文字と重ならないよう、左上のメタ情報の行に表示
        const meta=document.querySelector(".hero-meta");
        if(meta&&!meta.querySelector(".hero-ph")){const t=document.createElement("p");t.className="eyebrow hero-ph";t.textContent="Movie — 仮映像（撮影準備中）";meta.appendChild(t)}
      }else{const t=document.createElement("span");t.className="ph-tag";t.textContent="IMAGE · 仮イメージ";fig.appendChild(t)}
    }}
  const dpr=Math.min(window.devicePixelRatio||1,1.75),w=Math.round(rect.width*dpr),h=Math.round(rect.height*dpr);
  cv.width=w;cv.height=h;const c=cv.getContext("2d");
  (S[fig.dataset.scene]||S.field)(c,w,h,rng(hash(fig.dataset.seed||fig.dataset.scene)));finish(c,w,h);
  fig.dataset.done=1;fig.dataset.w=rect.width;
}
function paintFrame(fig,force){
  if(fig.dataset.done&&!force)return;
  const m=mediaFor(fig);
  const video=(isSP()&&m.videoMobile)||m.video;
  if(video&&!reduce&&!saveData){
    if(!fig.querySelector("video")){
      const v=document.createElement("video");
      v.muted=true;v.loop=true;v.playsInline=true;v.autoplay=true;v.preload="auto";
      v.setAttribute("muted","");v.setAttribute("playsinline","");v.setAttribute("aria-hidden","true");
      if(m.poster)v.poster=m.poster;
      v.src=video;
      v.addEventListener("error",()=>{v.remove();delete fig.dataset.done;m.video=m.videoMobile="";paintFrame(fig,true)},{once:true});
      fig.prepend(v);
    }
    fig.dataset.done=1;return;
  }
  const src=m.src||m.poster;
  if(src){
    if(!fig.querySelector("img")){
      const im=new Image();im.alt=m.alt||"";im.decoding="async";
      im.loading=fig.hasAttribute("data-eager")?"eager":"lazy";
      im.addEventListener("error",()=>{im.remove();paintCanvas(fig)},{once:true});
      im.src=src;fig.prepend(im);
    }
    fig.dataset.done=1;return;
  }
  paintCanvas(fig);
}
/* 一時停止：画面外の動画は止める（モバイルの電池・通信量対策） */
const vidIO=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target.querySelector("video");if(!v)return;e.isIntersecting?v.play().catch(()=>{}):v.pause()}));

const frameIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){paintFrame(e.target);frameIO.unobserve(e.target)}}),{rootMargin:"600px 0px"});
function watchFrames(root=document){root.querySelectorAll(".frame").forEach(f=>{if(f.hasAttribute("data-eager"))paintFrame(f);else frameIO.observe(f)})}


/* =========================================================
   DATA HELPERS
   ========================================================= */
// スポット→登場エピソード は episodes[].places から自動で作るので、二重に書く必要はありません
const PLACE_EPS = Object.fromEntries(SITE.places.map(p => [p.id, SITE.episodes.filter(e => (e.places||[]).includes(p.id))]));
const EPISODES_NEW = [...SITE.episodes].reverse();
const LATEST = EPISODES_NEW[0];
const esc = s => String(s ?? "").replace(/[&<>"]/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[ch]));
function gmapsURL(p){
  if(p.lat!=null && p.lng!=null) return `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
  return p.mapQuery ? "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(p.mapQuery) : "";
}
const pending = txt => `<span class="muted">${txt||"確認中"}</span>`;
const DRAFT = cond => SITE.showDraftLabels && cond ? '<span class="draft">仮テキスト</span>' : "";
const PH = img => SITE.showDraftLabels && !img ? '<span class="p-ph">仮イメージ</span>' : "";
// 写真がまだ無いときの注意書き（仮ビジュアルを実際の店舗・風景と誤解されないように）
const PH_NOTE = img => !img ? '<p class="ph-note">※ 写真は撮影準備中のため、仮のイメージを表示しています。実際の店舗・風景とは異なります。</p>' : "";
document.documentElement.classList.toggle("show-draft", !!SITE.showDraftLabels);
// ポスターに縦書きで載せるタイトル（長い名前は posterTitle で短くできます）
function posterTitle(ep){
  const t=ep.posterTitle||ep.title, latin=/^[\x20-\x7E]+$/.test(t);
  return `<span class="p-title${latin?" latin":""}" style="--len:${[...t].length}">${esc(t)}</span>`;
}
function fmtDate(d){ if(!d) return ""; const [y,m,dd]=d.split("-"); return `${y}.${m}.${dd}`; }

/* =========================================================
   STORIES
   ========================================================= */
function storyCard(ep){
  const pls=(ep.places||[]).map(id=>PL[id]).filter(Boolean);
  return `<article class="story rv"><a class="story-link" href="#${ep.id}" data-open="${ep.id}">
    <figure class="frame poster" data-scene="${ep.scene}" data-seed="${ep.id}" data-src="${esc(ep.image)}" data-alt="${esc(ep.title)}">
      <div class="poster-ui" aria-hidden="true"><span class="p-ep">EP.${ep.no}</span><span class="p-tags">${ep===LATEST?'<span class="p-badge">LATEST</span>':""}${PH(ep.image)}</span>
      ${posterTitle(ep)}<span class="p-credit">NAKASHIBETSU URASHIMA STORY<br>EPISODE ${ep.no}${ep.titleEn?` — ${esc(ep.titleEn)}`:""}</span></div>
    </figure>
    <div class="story-meta"><p class="story-cat"><span>${esc(ep.category)}</span>${esc(ep.categoryJa)}</p>
      <h3 class="story-title"><span class="sr">EP.${ep.no} </span>${esc(ep.title)}</h3><p class="story-lead">${esc(ep.lead)}${DRAFT(ep.draft)}</p>
      ${pls.length?`<p class="story-places">登場スポット：${pls.map(p=>esc(p.name)).join("、")}</p>`:""}
      <span class="story-more">エピソードを見る<i aria-hidden="true">→</i></span></div></a></article>`;
}
// トップページには最新 homeEpisodes 本だけ表示（残りは「すべてのエピソード」から）
const HOME_LIMIT=Math.max(1,SITE.homeEpisodes||4);
document.getElementById("storyGrid").innerHTML=EPISODES_NEW.slice(0,HOME_LIMIT).map(storyCard).join("");
document.querySelectorAll("[data-ep-count]").forEach(el=>el.textContent=`全${SITE.episodes.length}話`);

/* =========================================================
   PLACES
   ========================================================= */
const pg=document.getElementById("placeGrid"), fl=document.getElementById("filters");
const catCount=id=>id==="ALL"?SITE.places.length:SITE.places.filter(p=>p.cat===id).length;
pg.innerHTML=SITE.places.map(p=>{
  const eps=PLACE_EPS[p.id];
  return `<article class="place rv" data-cat="${p.cat}"><a href="#spot-${p.id}" data-open="spot-${p.id}">
  <figure class="frame" data-scene="${p.scene}" data-seed="pl-${p.id}" data-src="${esc(p.image)}" data-alt="${esc(p.name)}"></figure>
  <div class="place-meta"><span class="place-no" aria-label="スポット番号">${p.no}</span><span class="place-cat">${CAT[p.cat].en} <span class="cat-ja">／${CAT[p.cat].ja}</span></span>
  <h3>${esc(p.name)}</h3>${p.nameEn?`<p class="place-en">${esc(p.nameEn)}</p>`:""}<p class="place-desc">${esc(p.desc)}${DRAFT(p.draft)}</p>
  ${eps.length?`<p class="place-ep">${eps.map(e=>`EP.${e.no}「${esc(e.title)}」`).join(" / ")}に登場</p>`:""}</div></a></article>`}).join("")
  +`<p class="place-empty" id="placeEmpty" hidden>このカテゴリのスポットは、取材をしたあとに追加していきます。<br>おすすめの場所があれば、<a href="#join">情報募集</a>から教えてください。</p>`;
fl.innerHTML=SITE.categories.map((c,i)=>`<button class="fbtn" data-f="${c.id}" aria-pressed="${i===0}"><b>${c.en}<sup>${catCount(c.id)}</sup></b><small>${c.ja}</small></button>`).join("");
const SIZES=[["sz-a"],["sz-b","off"],["sz-b"],["sz-a"]];
function layoutPlaces(){let i=0;pg.querySelectorAll(".place").forEach(el=>{el.classList.remove("sz-a","sz-b","off","wide-md");if(el.hidden)return;el.classList.add(...SIZES[i%4]);if(i%3===0)el.classList.add("wide-md");i++});return i}
function applyFilter(f){
  pg.querySelectorAll(".place").forEach(el=>{el.hidden=!(f==="ALL"||el.dataset.cat===f)});
  document.getElementById("placeEmpty").hidden=layoutPlaces()>0;
  requestAnimationFrame(()=>pg.querySelectorAll(".place:not([hidden]) .frame").forEach(fig=>{const el=fig.closest(".place");el.classList.remove("rv-wait");el.classList.add("rv-in");const w=fig.getBoundingClientRect().width;if(!fig.dataset.done||Math.abs(w-(+fig.dataset.w||0))>w*.12)paintFrame(fig,true)}));
}
fl.addEventListener("click",e=>{const b=e.target.closest(".fbtn");if(!b)return;fl.querySelectorAll(".fbtn").forEach(x=>x.setAttribute("aria-pressed",x===b));applyFilter(b.dataset.f)});
layoutPlaces();

/* =========================================================
   MAP（演出用の概略図。実際の位置はGoogleマップへ）
   ========================================================= */
function buildMapSVG(){
  const r=rng(77),W=1000,H=800;let s=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="${W}" height="${H}" fill="#E2E3DC"/>`;
  for(let x=0;x<W;x+=50)for(let y=0;y<H;y+=50)if(r()<.32)s+=`<rect x="${x}" y="${y}" width="50" height="50" fill="${r()<.5?"#D9DBD1":"#E9E9E2"}"/>`;
  s+=`<g stroke="#9DAE9F" stroke-width="7" opacity=".85">`;
  for(let x=25;x<W;x+=150){let y=0;while(y<H){const l=120+r()*420;s+=`<line x1="${x}" y1="${y}" x2="${x}" y2="${Math.min(H,y+l)}"/>`;y+=l+(r()<.35?60:0)}}
  for(let y=40;y<H;y+=150){let x=0;while(x<W){const l=120+r()*420;s+=`<line x1="${x}" y1="${y}" x2="${Math.min(W,x+l)}" y2="${y}"/>`;x+=l+(r()<.35?60:0)}}
  s+=`</g><g stroke="#B8C7A9" stroke-width="2.5" opacity=".9">`;for(let x=100;x<W;x+=150)s+=`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke-dasharray="${40+r()*80} 30"/>`;s+=`</g>`;
  s+=`<path d="M0 290 C 140 300, 230 350, 330 345 S 480 370, 540 380 S 760 420, 1000 450" fill="none" stroke="#A3B8BE" stroke-width="5"/>`;
  s+=`<rect x="455" y="330" width="150" height="150" rx="40" fill="#D2D3CA"/>`;
  // 物語の順路（エピソード順にスポットを結ぶ点線）
  const pts=SITE.episodes.flatMap(e=>(e.places||[]).map(id=>PL[id])).filter(Boolean).map(p=>[p.schematic[0]*10,p.schematic[1]*8]);
  if(pts.length>1)s+=`<polyline points="${pts.map(p=>p.join(",")).join(" ")}" fill="none" stroke="#111719" stroke-width="1.6" stroke-dasharray="2 7" stroke-linecap="round"/>`;
  s+=`<g transform="translate(940 70)"><circle r="22" fill="none" stroke="#111719" stroke-width="1"/><path d="M0 -15 L5 4 L0 0 L-5 4Z" fill="#111719"/><text y="-28" text-anchor="middle" font-family="Archivo, sans-serif" font-size="12" font-weight="600" fill="#111719">N</text></g>`;
  return s+`</svg>`;
}
const mapBox=document.getElementById("mapBox"),panel=document.getElementById("panel"),spotIdx=document.getElementById("spotIndex");
mapBox.innerHTML=buildMapSVG()+`<span class="map-tag">SCHEMATIC<span>演出用の概略図</span></span>`+SITE.places.map(p=>`<button class="pin" style="left:${p.schematic[0]}%;top:${p.schematic[1]}%" data-id="${p.id}" aria-pressed="false" aria-label="${p.no} ${esc(p.name)}">${p.no}<span class="pin-label" aria-hidden="true">${esc(p.name)}</span></button>`).join("");
spotIdx.innerHTML=SITE.places.map(p=>`<button data-id="${p.id}" aria-pressed="false"><b>${p.no}</b>${esc(p.name)}</button>`).join("");

/* 観光情報：確認できた項目だけを表示（未入力の項目は出さない） */
const FACT_FIELDS=[["address","所在地"],["hours","営業時間"],["closed","定休日"],["price","料金"],["access","アクセス"],["parking","駐車場"],["phone","電話"]];
function factsHTML(p){
  const eps=PLACE_EPS[p.id];
  const rows=FACT_FIELDS.filter(([k])=>p[k]).map(([k,l])=>`<dt>${l}</dt><dd>${k==="phone"?`<a href="tel:${esc(String(p[k]).replace(/[^0-9+]/g,""))}">${esc(p[k])}</a>`:esc(p[k]).replace(/\n/g,"<br>")}</dd>`);
  const links=[];
  if(p.official)links.push(`<a href="${esc(p.official)}" target="_blank" rel="noopener">公式サイト ↗</a>`);
  if(p.sns)links.push(`<a href="${esc(p.sns)}" target="_blank" rel="noopener">公式SNS ↗</a>`);
  if(links.length)rows.push(`<dt>公式</dt><dd class="facts-links">${links.join("")}</dd>`);
  const verified=rows.length>0;
  if(eps.length){
    // 登場回が多いスポットでも長くならないよう、新しい3話まで表示
    const recent=[...eps].reverse().slice(0,3), more=eps.length-recent.length;
    rows.push(`<dt>登場</dt><dd>${recent.map(e=>`<a href="#${e.id}" data-open="${e.id}">EP.${e.no}「${esc(e.title)}」</a>`).join("<br>")}${more>0?`<br><span class="muted">ほか${more}話</span>`:""}</dd>`);
  }
  const note=verified
    ?(p.checkedAt?`<p class="facts-note">掲載情報は${fmtDate(p.checkedAt)}時点のものです。訪問前に公式情報もご確認ください。</p>`:"")
    :`<p class="facts-note">営業時間などの詳しい情報は、確認でき次第掲載します。</p>`;
  return (rows.length?`<dl class="facts">${rows.join("")}</dl>`:"")+note;
}
function gmapsBtn(p,cls="btn solid"){
  const u=gmapsURL(p);
  if(!u) return `<span class="${cls}" aria-disabled="true">Googleマップ（準備中）</span>`;
  return `<a class="${cls}" href="${u}" target="_blank" rel="noopener">Googleマップで開く ↗</a>`;
}
function selectSpot(id){
  const p=PL[id];if(!p)return;
  mapBox.querySelectorAll(".pin").forEach(b=>b.setAttribute("aria-pressed",b.dataset.id===id));
  spotIdx.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.id===id));
  panel.innerHTML=`<figure class="frame" data-scene="${p.scene}" data-seed="pl-${p.id}" data-src="${esc(p.image)}" data-alt="${esc(p.name)}"></figure>
  <div class="panel-body"><div class="panel-top"><span class="panel-no">${p.no}</span><span class="place-cat">${CAT[p.cat].en}<br><span class="cat-ja">${CAT[p.cat].ja}</span></span></div>
  <h3>${esc(p.name)}</h3>${p.nameEn?`<p class="place-en">${esc(p.nameEn)}</p>`:""}<p class="desc">${esc(p.desc)}${DRAFT(p.draft)}</p>
  ${factsHTML(p)}
  <div class="panel-actions">${gmapsBtn(p)}<a class="btn" href="#spot-${p.id}" data-open="spot-${p.id}">詳しく見る →</a></div>
  ${p.lat==null&&gmapsURL(p)?'<p class="gm-note">Googleマップでは「'+esc(p.mapQuery)+'」の検索結果が開きます。</p>':""}</div>`;
  paintFrame(panel.querySelector(".frame"),true);
}
mapBox.addEventListener("click",e=>{const b=e.target.closest(".pin");if(b)selectSpot(b.dataset.id)});
spotIdx.addEventListener("click",e=>{const b=e.target.closest("button");if(b)selectSpot(b.dataset.id)});

/* =========================================================
   DETAIL SHEET（エピソード詳細・スポット詳細）
   URLの #ep-01 / #spot-kaiyodai で直接開けます
   ========================================================= */
const sheet=document.getElementById("sheet"),sheetBody=document.getElementById("sheetBody"),sheetKind=document.getElementById("sheetKind");
const baseTitle=document.title;let lastFocus=null;

function watchBtns(ep){
  const tt=ep.tiktok||SITE.links.tiktok, ig=ep.instagram||SITE.links.instagram;
  return `<div class="watch">
    <a class="btn-light" href="${esc(tt)}" target="_blank" rel="noopener">TikTokで観る<i aria-hidden="true">↗</i></a>
    <a class="btn-ghost" href="${esc(ig)}" target="_blank" rel="noopener">Instagramで観る<i aria-hidden="true">↗</i></a></div>
    ${ep.tiktok||ep.instagram?"":'<p class="watch-note">投稿ページへのリンクは準備中のため、アカウントページが開きます。</p>'}`;
}
function storySheet(ep){
  const i=SITE.episodes.indexOf(ep), prev=SITE.episodes[i-1], next=SITE.episodes[i+1];
  const pls=(ep.places||[]).map(id=>PL[id]).filter(Boolean);
  return `<article class="sd wrap">
    <figure class="frame poster sd-poster" data-scene="${ep.scene}" data-seed="${ep.id}" data-src="${esc(ep.image)}" data-alt="${esc(ep.title)}">
      <div class="poster-ui" aria-hidden="true"><span class="p-ep">EP.${ep.no}</span><span class="p-tags">${PH(ep.image)}</span>${posterTitle(ep)}<span class="p-credit">NAKASHIBETSU URASHIMA STORY<br>EPISODE ${ep.no}${ep.titleEn?` — ${esc(ep.titleEn)}`:""}</span></div>
    </figure>
    <div class="sd-text">
      <p class="story-cat"><span>${esc(ep.category)}</span>${esc(ep.categoryJa)}${ep.published?`<em>${fmtDate(ep.published)}</em>`:""}</p>
      <h2 class="sd-title" id="sheetTitle"><span class="sd-no">EP.${ep.no}</span>${esc(ep.title)}</h2>
      ${ep.titleEn?`<p class="sd-en">${esc(ep.titleEn)}</p>`:""}
      <p class="sd-lead">${esc(ep.lead)}${DRAFT(ep.draft)}</p>
      ${watchBtns(ep)}
      ${PH_NOTE(ep.image)}
      ${pls.length?`<h3 class="sd-h">LOCATIONS<span>この回に登場した場所</span></h3>
      <ul class="sd-places">${pls.map(p=>`<li><a href="#spot-${p.id}" data-open="spot-${p.id}">
        <figure class="frame" data-scene="${p.scene}" data-seed="pl-${p.id}" data-src="${esc(p.image)}" data-alt="${esc(p.name)}"></figure>
        <span><b>${p.no}</b><strong>${esc(p.name)}</strong><small>${CAT[p.cat].en}</small></span><i aria-hidden="true">→</i></a></li>`).join("")}</ul>`:""}
      <a class="sd-all" href="#episodes" data-open="episodes">すべてのエピソード<span>全${SITE.episodes.length}話</span><i aria-hidden="true">→</i></a>
      <nav class="sd-nav" aria-label="ほかのエピソード">
        ${prev?`<a href="#${prev.id}" data-open="${prev.id}"><small>← PREV</small>EP.${prev.no} ${esc(prev.title)}</a>`:"<span></span>"}
        ${next?`<a class="r" href="#${next.id}" data-open="${next.id}"><small>NEXT →</small>EP.${next.no} ${esc(next.title)}</a>`:`<span class="r sd-soon"><small>NEXT</small>次のエピソードは準備中</span>`}
      </nav>
    </div></article>`;
}
function spotSheet(p){
  const eps=PLACE_EPS[p.id];
  return `<article class="spd">
    <figure class="frame spd-hero" data-scene="${p.scene}" data-seed="pl-${p.id}-wide" data-src="${esc(p.image)}" data-alt="${esc(p.name)}"></figure>
    <div class="wrap spd-grid">
      <div>
        <div class="panel-top"><span class="panel-no">${p.no}</span><span class="place-cat">${CAT[p.cat].en}<br><span class="cat-ja">${CAT[p.cat].ja}</span></span></div>
        <h2 class="spd-title" id="sheetTitle">${esc(p.name)}</h2>${p.nameEn?`<p class="place-en">${esc(p.nameEn)}</p>`:""}
        <p class="spd-desc">${esc(p.desc)}${DRAFT(p.draft)}</p>
        ${PH_NOTE(p.image)}
      </div>
      <div>
        ${factsHTML(p)}
        <div class="panel-actions">${gmapsBtn(p)}<a class="btn" href="#map" data-locate="${p.id}">概略図で見る</a></div>
        ${p.lat==null&&gmapsURL(p)?'<p class="gm-note">Googleマップでは「'+esc(p.mapQuery)+'」の検索結果が開きます。訪問前に最新の情報をご確認ください。</p>':""}
      </div>
    </div>
    ${eps.length?`<div class="wrap"><h3 class="sd-h">EPISODES<span>この場所が登場するエピソード</span></h3>
    <ul class="spd-eps">${[...eps].reverse().map(e=>`<li><a href="#${e.id}" data-open="${e.id}"><figure class="frame poster" data-scene="${e.scene}" data-seed="${e.id}" data-src="${esc(e.image)}" data-alt="${esc(e.title)}"><div class="poster-ui" aria-hidden="true"><span class="p-ep">EP.${e.no}</span></div></figure><strong>${esc(e.title)}</strong><small>エピソードを見る →</small></a></li>`).join("")}</ul></div>`:""}
  </article>`;
}
/* すべてのエピソード（アーカイブ）— 本数が増えても1画面で探せる一覧 */
function archiveSheet(){
  const cats=[...new Map(EPISODES_NEW.map(e=>[e.category,e.categoryJa])).entries()];
  return `<section class="arc wrap">
    <header class="arc-head">
      <div><p class="eyebrow">All episodes</p><h2 class="display" id="sheetTitle">All<br>Stories</h2></div>
      <p class="catch">すべてのエピソード<span class="arc-count">全${SITE.episodes.length}話</span></p>
    </header>
    <div class="arc-filters" role="group" aria-label="カテゴリで絞り込む">
      <button class="arc-f" data-c="ALL" aria-pressed="true">ALL<small>すべて</small></button>
      ${cats.map(([c,ja])=>`<button class="arc-f" data-c="${esc(c)}" aria-pressed="false">${esc(c)}<small>${esc(ja)}</small></button>`).join("")}
    </div>
    <ol class="arc-grid">${EPISODES_NEW.map(e=>`<li data-c="${esc(e.category)}"><a href="#${e.id}" data-open="${e.id}">
      <figure class="frame poster" data-scene="${e.scene}" data-seed="${e.id}" data-src="${esc(e.image)}" data-alt="${esc(e.title)}">
        <div class="poster-ui" aria-hidden="true"><span class="p-ep">EP.${e.no}</span><span class="p-tags">${e===LATEST?'<span class="p-badge">LATEST</span>':""}${PH(e.image)}</span></div>
      </figure>
      <span class="arc-meta"><small>${esc(e.category)}　${esc(e.categoryJa)}</small><strong><span class="sr">EP.${e.no} </span>${esc(e.title)}</strong>${e.published?`<small class="arc-date">${fmtDate(e.published)}</small>`:""}</span></a></li>`).join("")}</ol>
  </section>`;
}
sheetBody.addEventListener("click",e=>{
  const b=e.target.closest(".arc-f");if(!b)return;
  sheetBody.querySelectorAll(".arc-f").forEach(x=>x.setAttribute("aria-pressed",x===b));
  sheetBody.querySelectorAll(".arc-grid li").forEach(li=>{li.hidden=!(b.dataset.c==="ALL"||li.dataset.c===b.dataset.c)});
  watchFrames(sheetBody);
});
let sheetIsOpen=false;
function openSheet(token,push=true){
  let html,kind,title,theme;
  if(token==="episodes"){html=archiveSheet();kind=`ALL EPISODES — ${SITE.episodes.length}`;title="すべてのエピソード";theme="dark"}
  else if(EP[token]){const e=EP[token];html=storySheet(e);kind=`STORY — EP.${e.no}`;title=`EP.${e.no} ${e.title}`;theme="dark"}
  else if(token.startsWith("spot-")&&PL[token.slice(5)]){const p=PL[token.slice(5)];html=spotSheet(p);kind=`PLACE — No.${p.no}`;title=p.name;theme="light"}
  else return false;
  const wasOpen=sheetIsOpen;sheetIsOpen=true;
  if(!wasOpen)lastFocus=document.activeElement;
  sheet.dataset.theme=theme;sheetKind.textContent=kind;sheetBody.innerHTML=html;
  sheet.hidden=false;sheet.scrollTop=0;document.documentElement.classList.add("lock");
  // 画像は見えている分から順に描画（エピソードが増えても重くならない）
  requestAnimationFrame(()=>{sheet.classList.add("open");watchFrames(sheetBody)});
  document.title=`${title} | ${baseTitle}`;
  // シート内から別の詳細へ移るときは履歴を積まない（閉じる1回で一覧へ戻れるように）
  if(push){try{wasOpen?history.replaceState({sheet:token},"","#"+token):history.pushState({sheet:token},"","#"+token)}catch(_){}}
  document.getElementById("sheetClose").focus({preventScroll:true});
  dockSync();return true;
}
function closeSheet(fromPop){
  if(!sheetIsOpen)return;
  // 状態フラグを先に切り替え、ナビの再表示をアニメーション完了待ちにしない
  sheetIsOpen=false;
  sheet.classList.remove("open");document.documentElement.classList.remove("lock");document.title=baseTitle;
  setTimeout(()=>{if(!sheetIsOpen){sheet.hidden=true;sheetBody.innerHTML=""}dockSync()},reduce?0:420);
  if(!fromPop){try{history.state&&history.state.sheet?history.back():history.replaceState(null,"",location.pathname+location.search)}catch(_){}}
  if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
  dockSync();
}
document.getElementById("sheetClose").addEventListener("click",()=>closeSheet());
addEventListener("popstate",e=>{const t=e.state&&e.state.sheet;if(t)openSheet(t,false);else closeSheet(true)});
sheet.addEventListener("keydown",e=>{
  if(e.key==="Escape")closeSheet();
  if(e.key==="Tab"){const f=[...sheet.querySelectorAll("a[href],button:not([disabled])")];if(!f.length)return;const a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}
});

/* =========================================================
   LINKS / 準備中の扱い
   ========================================================= */
document.querySelectorAll("[data-sns]").forEach(a=>{const u=SITE.links[a.dataset.sns];if(u)a.href=u});
const formBtn=document.getElementById("formBtn"),contactLink=document.getElementById("contactLink");
if(SITE.links.form){formBtn.href=SITE.links.form;formBtn.target="_blank";formBtn.rel="noopener";formBtn.innerHTML=`${formBtn.dataset.readyLabel}<i aria-hidden="true">↗</i>`}
else{formBtn.setAttribute("aria-disabled","true");formBtn.dataset.soon="情報提供フォームは準備中です。InstagramのDMやTikTokのコメントで受け付けています。"}
if(SITE.links.contact){contactLink.href=SITE.links.contact;contactLink.target="_blank";contactLink.rel="noopener";contactLink.textContent="Contact ↗"}
else contactLink.dataset.soon="お問い合わせ窓口は準備中です。InstagramのDMからご連絡ください。";

const toast=document.getElementById("toast");let tt;
function say(m){toast.textContent=m;toast.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove("show"),3200)}
document.addEventListener("click",e=>{
  const a=e.target.closest("a");if(!a)return;
  if(a.dataset.open){e.preventDefault();openSheet(a.dataset.open);return}
  if(a.dataset.soon){e.preventDefault();say(a.dataset.soon);return}
  const href=a.getAttribute("href")||"";
  if(!sheet.hidden&&href.startsWith("#")&&!a.target){
    // 詳細シートからページ内の各セクションへ移動
    e.preventDefault();const id=a.dataset.locate;closeSheet(true);
    try{history.replaceState(null,"",location.pathname+location.search)}catch(_){}
    if(id)selectSpot(id);
    const t=document.querySelector(href);if(t)setTimeout(()=>t.scrollIntoView({behavior:reduce?"auto":"smooth"}),40);
  }
});

/* =========================================================
   HEADER / MENU / MOBILE DOCK
   ========================================================= */
const head=document.getElementById("head"),hero=document.getElementById("top"),dock=document.getElementById("dock");
let pastHero=false;
// 下部ナビ：ファーストビューを過ぎていて、メニューも詳細画面も開いていないときに表示
function dockSync(){
  if(sheetIsOpen||!menu.hidden){dock.classList.remove("on");return}
  pastHero=hero.getBoundingClientRect().bottom<70;
  dock.classList.toggle("on",pastHero);
}
new IntersectionObserver(([e])=>{pastHero=!e.isIntersecting;head.classList.toggle("solid",pastHero||!menu.hidden);dockSync()},{rootMargin:"-70px 0px 0px 0px"}).observe(hero);
const menu=document.getElementById("menu"),mb=document.getElementById("menuBtn");
function setMenu(open){menu.hidden=!open;mb.setAttribute("aria-expanded",open);mb.lastChild.textContent=open?"CLOSE":"MENU";document.documentElement.classList.toggle("lock",open);head.classList.toggle("solid",open||pastHero);dockSync()}
mb.addEventListener("click",()=>setMenu(menu.hidden));
menu.addEventListener("click",e=>{if(e.target.closest("nav a"))setMenu(false)});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!menu.hidden)setMenu(false)});
// 現在地のハイライト
const dockLinks=[...dock.querySelectorAll('a[href^="#"]')];
const secIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)dockLinks.forEach(a=>a.toggleAttribute("aria-current",a.getAttribute("href")==="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
["stories","places","map"].forEach(id=>secIO.observe(document.getElementById(id)));

/* 最新エピソードへの導線は STORIES セクションに集約（ファーストビューには置かない） */

/* =========================================================
   REVEAL / INIT
   ========================================================= */
if(!reduce){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("rv-in");e.target.classList.remove("rv-wait");io.unobserve(e.target)}}),{rootMargin:"0px 0px -8% 0px"});
  document.querySelectorAll(".rv").forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add("rv-wait");io.observe(el)}});
}
watchFrames();
vidIO.observe(document.querySelector(".hero-media"));
selectSpot(SITE.places[0].id);
{const t=decodeURIComponent(location.hash.slice(1));if(t&&(t==="episodes"||EP[t]||t.startsWith("spot-"))){try{history.replaceState(null,"",location.pathname+location.search)}catch(_){}openSheet(t)}}
let rt;addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(()=>document.querySelectorAll(".frame[data-done]").forEach(f=>{if(f.querySelector("img,video"))return;const w=f.getBoundingClientRect().width;if(Math.abs(w-(+f.dataset.w||0))>w*.15)paintFrame(f,true)}),220)});
