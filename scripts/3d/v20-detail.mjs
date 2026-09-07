import * as T from 'three';
import { workshop, material } from './geometry.mjs';
import { inowGeometry } from './logo-geometry.mjs';
import { modelScale, wheelDimensions, measurementEvidence } from './v20-measurements.mjs';
import { tyreGeometry, rimGeometry, sidewallOffset, treadRadius } from './v20-wheel.mjs';

// Cross-reference: public/imagens/026,042,048,049,056,060. Hidden dimensions inferred.
export function buildV20({merge=true}={}) {
 const w=workshop(),{section,mesh,tube,box,ring,path,plate,softPlate,label,loftSeat,seatAt,seatSurfaceAt,roundedPanel,cached}=w;
 const paint=new T.MeshPhysicalMaterial({color:'#17191c',roughness:.36,metalness:.12,clearcoat:.3,clearcoatRoughness:.3});paint.name='Pintura acetinada';
 const plastic=material('Plástico moldado','#181a1d',.55,.02),batteryTrim=material('Acabamento da bateria','#2a2c30',.46,.22);
 const tire=material('Borracha do pneu','#202122',.86),grip=material('Borracha das manoplas','#191b1d',.78);
 const leather=material('Vinil granulado','#1c1b1d',.69),stitch=material('Costura grafite','#292726',.88);
 const brakeMetal=material('Aço dos discos','#929c9e',.38,.82);
 const metal=material('Alumínio escovado','#aab0b3',.28,.84),chrome=material('Hastes cromadas','#c8cbcd',.14,.95),steel=material('Aço fosfatizado','#474b4e',.4,.75);
 const white=material('Serigrafia','#c5c5bd',.73),orange=material('Refletores âmbar','#d5790a',.24,.15),red=material('Lanterna vermelha','#a81813',.2,.1);
 const glass=material('Vidro do farol','#b5c6ca',.14,.3),lcd=material('LCD desligado','#202a2e',.14,.3),dark=material('Rebaixos','#080a0b',.78);
 const stanchion=material('Hastes anodizadas escuras','#24282c',.22,.72);
 const bolt=(p,r=.006,dir=[0,0,1])=>w.bolt(p,r,metal,dark,dir);
 const front=-.61,rear=.61,cy=.309,tyreBodies=[];
 const cockpitScale=.98,cockpitOffset=.997-.905*cockpitScale;
 const cockpitLocal=([x,y,z])=>[x,(y-cockpitOffset)/cockpitScale,z];

 function arcText(text,x,angle,size,back){
  const step=size*.86/.264;
  [...text].forEach((letter,i)=>{
   const a=angle+((text.length-1)/2-i)*step*(back?-1:1);
   const o=label(letter,size,[x+.264*Math.cos(a),cy+.264*Math.sin(a),0],back?Math.PI/2-a:a-Math.PI/2,white,back);
   // Project every letter vertex onto the curved sidewall: no floating flat text.
   o.updateMatrix();o.geometry.applyMatrix4(o.matrix);const p=o.geometry.attributes.position;
   for(let k=0;k<p.count;k++){
    const r=Math.hypot(p.getX(k)-x,p.getY(k)-cy)*modelScale;
    p.setZ(k,(back?-1:1)*(sidewallOffset(r)+.0007)/modelScale);
   }
   p.needsUpdate=true;o.geometry.computeVertexNormals();o.position.set(0,0,0);o.rotation.set(0,0,0);
  });
 }
 function rotor(x,y,z,r=.096){
  const shape=new T.Shape();for(let i=0;i<=120;i++){const a=i/120*Math.PI*2,rr=r*(1+.035*Math.cos(a*12)),p=[rr*Math.cos(a),rr*Math.sin(a)];i?shape.lineTo(...p):shape.moveTo(...p);}
  const circle=(x,y,r)=>{const h=new T.Path();h.absarc(x,y,r,0,Math.PI*2,true);shape.holes.push(h);};circle(0,0,.017);
  for(let k=0;k<6;k++){
   const a=k*Math.PI/3,polar=(r,t)=>[r*Math.cos(t),r*Math.sin(t)];circle(.031*Math.cos(a),.031*Math.sin(a),.003);
   const h=new T.Path();h.moveTo(...polar(.036,a+.14));h.lineTo(...polar(.080,a+.25));h.absarc(0,0,.080,a+.25,a+.99,false);h.lineTo(...polar(.036,a+.83));h.closePath();shape.holes.push(h);
   // Two staggered rows of elongated cooling slots, visible in photos 048/049.
   for(let j=0;j<4;j++){
    const angle=a+j*.24+.04,rr=j%2?.087:.090,slot=new T.Path(),da=.054;
    slot.absarc(0,0,rr-.0012,angle-da,angle+da,false);
    slot.lineTo((rr+.0012)*Math.cos(angle+da),(rr+.0012)*Math.sin(angle+da));
    slot.absarc(0,0,rr+.0012,angle+da,angle-da,true);slot.closePath();shape.holes.push(slot);
   }
  }
  mesh('Disco recortado e perfurado',new T.ExtrudeGeometry(shape,{depth:.002,bevelEnabled:false,curveSegments:16}),brakeMetal,[x,y,z]);
  for(let k=0;k<6;k++){const a=k*Math.PI/3;bolt([x+.031*Math.cos(a),y+.031*Math.sin(a),z+.002],.003);}
 }
 function mudguard(x,start,end){
  const pos=[],uv=[],ix=[],n=64,width=12;
  for(let i=0;i<=n;i++)for(let j=0;j<=width;j++){const a=start+(end-start)*i/n,t=(j/width-.5)*2,r=.334+.019*(1-t*t);pos.push(x+r*Math.cos(a),cy+r*Math.sin(a),t*.066);uv.push(i/n,j/width);}
  for(let i=0;i<n;i++)for(let j=0;j<width;j++){const a=i*(width+1)+j,b=a+width+1;ix.push(a,b,a+1,b,b+1,a+1);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();
  const m=plastic.clone();m.name='Paralamas moldados';m.side=T.DoubleSide;mesh('Casca fina do paralama',g,m);
  for(const z of [-.066,.066]){const points=[];for(let i=0;i<=32;i++){const a=start+(end-start)*i/32;points.push([x+.334*Math.cos(a),cy+.334*Math.sin(a),z]);}path('Borda do paralama',points,.0025,paint);}
 }

 for(const x of [front,rear])section(x===front?'01 · Roda dianteira':'02 · Roda traseira',()=>{
  tyreBodies.push(mesh('Carcaça de seção nominal 98 mm',cached('tyre-98-406',tyreGeometry),tire,[x,cy,0]));
  mesh('Aro com assentamento nominal de 406 mm',cached('rim-406',rimGeometry),paint,[x,cy,0]);
  for(const s of [-1,1])ring('Friso moldado do flanco',[x,cy,s*(sidewallOffset(.252*modelScale)+.0002)/modelScale],.252,.0007,grip);
  tube('Cubo',[x,cy,-.06],[x,cy,.06],x===rear?.058:.028,paint);
  tube('Eixo contínuo da roda',[x,cy,-.095],[x,cy,.095],.01,steel);
  tube('Flange de apoio do disco',[x,cy,.059],[x,cy,.073],.026,steel);
  if(x===rear)for(const s of [-1,1]){tube('Tampa do motor',[x,cy,s*.06],[x,cy,s*.064],.054,steel);for(let k=0;k<10;k++){const a=k*Math.PI/5;bolt([x+.047*Math.cos(a),cy+.047*Math.sin(a),s*.065],.003,[0,0,s]);}}
  for(let k=0;k<6;k++)for(const s of [-1,1])for(const spread of [-.08,.08]){
   const o=plate('Raio duplo fundido',[[.027,-.008],[.21,-.005+spread*.27],[.21,.005+spread*.27],[.048,.01]],.008,s*.027,paint,[],.0015);o.rotation.z=k*Math.PI/3;o.position.x=x;o.position.y=cy;
  }
  for(let i=0;i<64;i++)for(let j=-2;j<=2;j++){
   const z=j*.023*(wheelDimensions.nominalSectionWidth/(.12*modelScale)),a=(i+(j%2)*.36)/64*Math.PI*2,r=treadRadius(z*modelScale)/modelScale;
   const o=box('Cravo escalonado',[x+(r+.002)*Math.cos(a),cy+(r+.002)*Math.sin(a),z],[j===0?.018:.014,.006,.017],tire,.0014);o.rotation.z=a-Math.PI/2;
  }
  for(const s of [-1,1]){
   const brandAngle=x===front?(s>0?2.98:.19):(s>0?1.04:2.10);
   arcText('KENDA',x,brandAngle,.044,s<0);arcText('KRUSADE',x,s>0?-.9:4.1,.026,s<0);
   arcText('20 x 4.0',x,s>0?.48:2.66,.007,s<0);
   tube('Porca do eixo',[x,cy,s*.075],[x,cy,s*.09],.013,metal,.013,6);bolt([x,cy,s*.092],.006,[0,0,s]);
   const a=x===front?Math.PI*4/3:Math.PI*5/3,px=x+.16*Math.cos(a),py=cy+.16*Math.sin(a);
   box('Presilha do refletor no raio',[px,py,.035*s],[.084,.030,.009],plastic,.003).rotation.z=a;
   box('Refletor de roda',[px,py,.041*s],[.078,.018,.006],orange,.003).rotation.z=a;
  }
  const valveAngle=Math.atan2(-.092,-.185),valvePoint=r=>[x+r*Math.cos(valveAngle),cy+r*Math.sin(valveAngle),.016];
  tube('Válvula assentada no aro',valvePoint(.216),valvePoint(.19),.003,grip);
  rotor(x,cy,.072);box('Pinça hidráulica',[x-.063,cy+.076,.084],[.052,.038,.024],paint,.007);bolt([x-.075,cy+.083,.1],.004);
  softPlate('Adaptador da pinça',[[x-.005,cy+.014],[x-.055,cy+.108],[x-.080,cy+.094],[x-.045,cy+.052],[x-.012,cy-.006]],.008,.077,paint,[],.22,.001);
 });

 section('03 · Quadro e articulações',()=>{
  for(const [x,y] of [[.065,.357],[.295,.615],[.365,.598],[.16,.744],[.44,.804]])tube('Pino passante da articulação',[x,y,-.067],[x,y,.067],.0045,steel);
  for(const z of [-.045,.045]){
   path('Tubo inferior curvado',[[-.44,.77,z],[-.31,.65,z],[.065,.357,z],[.21,.297,z],[.61,.309,z]],.022,paint);
   path('Apoio central',[[.08,.358,z],[.23,.49,z],[.295,.61,z],[.38,.715,z],[.48,.824,z]],.021,paint);
   tube('Balança inferior',[.13,.337,z],[.61,.309,z],.019,paint);tube('Escora traseira',[.365,.598,z],[.61,.309,z],.016,paint);
   softPlate('Ponte superior de contorno curvo',[[-.456,.797],[-.444,.879],[-.395,.913],[-.239,.913],[-.175,.908],[-.122,.866],[-.079,.839],[-.10,.826],[-.334,.841],[-.393,.82],[-.432,.786]],.026,z,paint,[
    [[-.361,.880],[-.263,.882],[-.254,.858],[-.354,.857]],[[ -.231,.882],[-.167,.875],[-.123,.845],[-.211,.853]],[[ -.404,.844],[-.372,.849],[-.386,.816]],
   ],.32,.003);
   softPlate('Longarina diagonal',[[ -.112,.852],[-.057,.852],[.326,.632],[.294,.588]],.029,z,paint,[],.09,.003);
   softPlate('Reforço sob o banco',[[ -.13,.825],[.028,.823],[.16,.777],[.145,.751],[.02,.793],[-.13,.801]],.015,z,paint,[
    [[-.062,.818],[-.012,.815],[.018,.8],[-.047,.807]]
   ],.14,.002).position.add(new T.Vector3(.05,.005,0));
   softPlate('Chapa de ancoragem da mola',[[.005,.812],[.192,.806],[.156,.726],[.055,.74]],.013,z,paint,[[[.035,.79],[.086,.791],[.059,.759]],[[.106,.79],[.162,.788],[.14,.751]]],.18,.002).position.add(new T.Vector3(.05,.005,0));
   path('Berço contornado do banco',[[-.13,.846,z],[.05,.843,z],[.18,.826,z],[.25,.772,z],[.36,.801,z],[.5,.849,z]].map(([x,y,z])=>[x+.05,y+.005,z]),.015,paint);
   for(const [x,y] of [[.065,.357],[.295,.615],[.365,.598],[.16,.744],[.44,.804]])bolt([x,y,z+Math.sign(z)*.021],.006,[0,0,Math.sign(z)]);
  }
  tube('Caixa de direção',[-.463,.825,0],[-.414,.997,0],.035,paint);tube('Movimento central',[.065,.357,-.085],[.065,.357,.085],.032,paint);
  for(const z of [-.025,.025])path('Cabos presos ao quadro',[[-.445,.761,z],[-.29,.603,z],[.09,.347,z],[.5,.328,z]],.003,grip);
  for(let i=0;i<7;i++){const t=i/6;box('Abraçadeira do chicote',[-.38+t*.4,.7-t*.35,-.042],[.018,.009,.008],grip,.002).rotation.z=.7;}
  for(const s of [-1,1])path('Continuidade dos cabos de comando',[[-.49,.85,.012*s],[-.466,.79,.02*s],[-.445,.761,.025*s]],.0027,grip);
  path('Continuidade do freio traseiro',[[-.49,.85,-.03],[-.446,.763,-.038],[-.285,.604,-.04],[.08,.357,.06]],.0027,grip);
 });

 section('04 · Bancos e bagageiro',()=>{
  const slices=[[-.159,.856,.854,.012],[-.155,.86,.85,.079],[-.145,.865,.847,.135],[-.137,.887,.846,.167],[-.115,.938,.846,.18],[-.065,.94,.843,.194],[.02,.938,.838,.208],[.12,.937,.815,.226],[.24,.939,.788,.24],[.33,.946,.804,.246],[.44,.964,.848,.24],[.493,.978,.868,.205],[.506,.953,.877,.154],[.515,.934,.884,.091],[.519,.912,.902,.012]];
  loftSeat('Banco principal esculpido',slices,leather);
  for(const s of [-1,1]){
   const upper=[],lower=[];
   for(let i=0;i<=96;i++){
    const x=T.MathUtils.lerp(-.13,.502,i/96),a=seatSurfaceAt(slices,x,.90*s),b=seatSurfaceAt(slices,x,.82*s,false);
    a[1]+=.0002;b[1]-=.0002;upper.push(a);lower.push(b);
   }
   path('Vivo assentado no estofado',upper,.00085,stitch);
   path('Acabamento inferior assentado',lower,.0018,plastic);
  }
  for(let i=0;i<12;i++){
   const x=-.07+i*.045,[,top,bottom,width]=seatAt(slices,x),points=[];
   for(let j=0;j<=24;j++){const z=(j/24-.5)*width*.86,q=Math.abs(z)/(width/2),height=(top+bottom)/2+(top-bottom)/2*(1-q**4)**.24;points.push([x,height+.0008,z]);}path('Costura transversal',points,.00085,stitch);
  }
  const passengerSlices=[[.527,.884,.882,.035],[.532,.886,.88,.17],[.542,.948,.881,.218],[.59,.952,.883,.23],[.7,.954,.884,.233],[.786,.955,.886,.221],[.8,.918,.891,.17],[.809,.909,.901,.11],[.812,.906,.904,.012]];
  loftSeat('Almofada do passageiro',passengerSlices,leather);
  for(let i=0;i<6;i++){
   const x=.575+i*.038,points=[],[,top,bottom,width]=seatAt(passengerSlices,x);
   for(let j=0;j<=24;j++){const z=(j/24-.5)*width*.86,q=Math.abs(z)/(width/2);points.push([x,(top+bottom)/2+(top-bottom)/2*(1-q**4)**.24+.001,z]);}
   path('Costura traseira',points,.0009,stitch);
  }
  box('Base traseira',[.665,.881,0],[.286,.021,.213],paint,.013);
  for(const s of [-1,1]){
   softPlate('Longarina curva do passageiro',[[.335,.77],[.35,.789],[.54,.781],[.608,.792],[.70,.866],[.72,.888],[.787,.889],[.715,.811],[.641,.761],[.563,.748],[.361,.748]],.024,.077*s,paint,[],.36,.003);
   softPlate('Tirante do suporte traseiro',[[.495,.874],[.517,.879],[.563,.779],[.539,.772]],.021,.077*s,paint,[],.12,.002);
   bolt([.376,.77,.093*s],.007,[0,0,s]);bolt([.508,.866,.093*s],.006,[0,0,s]);
  }
  // Keep the complete housing and fins on the same slope as the seat underside.
  // The old individually rotated fins formed a horizontal row outside the housing.
  const controllerAngle=.34,controllerPoint=(x,y,z)=>[.342+x*Math.cos(controllerAngle)-y*Math.sin(controllerAngle),.804+x*Math.sin(controllerAngle)+y*Math.cos(controllerAngle),z];
  box('Controlador sob o banco',controllerPoint(0,0,0),[.176,.024,.105],plastic,.004).rotation.z=controllerAngle;
  for(let i=0;i<10;i++)box('Aleta de dissipação',controllerPoint(-.077+i*.0171,-.019,0),[.005,.014,.104],steel,.001).rotation.z=controllerAngle;
  for(const s of [-1,1]){
   const contour=points=>points.map(([x,y])=>controllerPoint(x,y,0).slice(0,2));
   softPlate('Chapa lateral perfurada do controlador',contour([[-.092,-.024],[-.092,.016],[.092,.016],[.092,-.024]]),.005,.058*s,paint,
    Array.from({length:7},(_,i)=>{const x=-.075+i*.023;return contour([[x,-.016],[x+.006,.008],[x+.014,.008],[x+.008,-.016]]);}),.20,.001);
  }
  softPlate('Suporte dobrado da lanterna',[[.77,.88],[.791,.88],[.81,.846],[.824,.826],[.816,.817],[.8,.833],[.778,.866]],.08,0,paint,[],.28,.001);
  box('Carcaça da lanterna',[.797,.845,0],[.035,.034,.104],plastic,.005);
  box('Lanterna traseira',[.814,.845,0],[.006,.026,.094],red,.003);
  for(let i=0;i<11;i++)box('Prisma da lanterna',[.818,.845,-.038+i*.0076],[.001,.02,.002],red,.0003);
  box('Suporte de placa',[.817,.808,0],[.007,.052,.082],plastic,.004).rotation.z=-.23;
  for(const z of [-.025,.025]){bolt([.823,.819,z],.003,[1,0,0]);box('Rasgo da placa',[.824,.793,z],[.003,.009,.018],dark,.002);}
 }).position.set(.05,.005,0);

 section('05 · Suspensão e paralamas',()=>{
  const fy=y=>cy+(y-cy)*1.16,fp=([x,y,z])=>[x,fy(y),z];
  for(const z of [-.081,.081]){
   tube('Canela do garfo',[front,cy,z],fp([-.523,.562,z]),.024,paint,.028);tube('Retentor',fp([-.531,.545,z]),fp([-.523,.565,z]),.031,grip);
   tube('Haste anodizada',fp([-.523,.562,z]),fp([-.485,.69,z]),.019,stanchion);tube('Corpo superior',fp([-.485,.69,z]),fp([-.429,.89,z]),.03,paint);
   for(const y of [.709,.87]){const x=-.485+(y-.69)*.28;tube('Abraçadeira do garfo',fp([x-.003,y-.01,z]),fp([x+.003,y+.01,z]),.034,paint);bolt(fp([x,y,z+Math.sign(z)*.033]),.005,[0,0,Math.sign(z)]);}
   tube('Tampa de regulagem',fp([-.431,.885,z]),fp([-.427,.902,z]),.028,steel,.026,24);bolt(fp([-.427,.904,z]),.008,[0,1,0]);
  }
  for(const y of [.708,.875])box('Mesa dupla',[-.486+(y-.69)*.28,fy(y),0],[.074,.024,.224],paint,.011).rotation.z=-.23;
  const a=new T.Vector3(.16,.744,0),b=new T.Vector3(.363,.598,0),axis=b.clone().sub(a),u=new T.Vector3(0,0,1),v=new T.Vector3().crossVectors(axis.clone().normalize(),u),at=t=>a.clone().addScaledVector(axis,t).toArray();
  tube('Haste do amortecedor',at(0),at(1),.011,chrome);tube('Corpo do amortecedor',at(.12),at(.74),.02,paint);
  for(const t of [.12,.78])tube('Prato da mola',at(t),at(t+.035),.033,steel);
  const spring=[];for(let i=0;i<=220;i++){const t=.15+i/220*.6,angle=i/220*Math.PI*16;spring.push(a.clone().addScaledVector(axis,t).addScaledVector(u,.028*Math.cos(angle)).addScaledVector(v,.028*Math.sin(angle)).toArray());}path('Mola helicoidal',spring,.0055,paint);
  for(const p of [a,b]){tube('Olhal',[p.x,p.y,-.024],[p.x,p.y,.024],.021,steel);bolt([p.x,p.y,.026],.007);}
  mudguard(front,-.34,2.13);mudguard(rear,.20,Math.PI+.16);
  for(const x of [front,rear])for(const s of [-1,1]){const end=[x+.295,cy+.16,.066*s];path('Arame do paralama',[[x,cy,.077*s],[x+.13,cy+.06,.093*s],end],.0025,metal);bolt(end,.0035,[0,0,s]);}
  path('Ponte do paralama dianteiro',[[-.55,.611,-.062],[-.555,.65,-.052],[-.555,.656,.052],[-.55,.611,.062]],.009,paint);
  for(const s of [-1,1]){
   // End on the curved edge of the fender, not on its higher centre crown.
   const x=.65,z=.064*s,r=.334+.019*(1-(z/.066)**2),y=cy+Math.sqrt(r*r-(x-rear)**2);
   tube('Tirante superior do paralama traseiro',[.625,.767,z],[x,y,z],.003,steel);
   bolt([.625,.767,.068*s],.003,[0,0,s]);bolt([x,y+.003,z],.003,[0,1,0]);
  }
  path('Mangueira hidráulica dianteira',[[-.49,.85,.03],[-.50,.76,.105],[-.543,.58,.115],[-.61,.405,.108],[-.673,.387,.095]],.003,grip);
  bolt([-.671,.39,.109],.004);path('Mangueira hidráulica traseira',[[.08,.357,.06],[.34,.332,.075],[.505,.376,.102],[.547,.385,.094]],.0027,grip);
 });

 section('06 · Bateria',()=>{
  const origin=new T.Vector3(-.12,.608,0),axis=new T.Vector3(0,0,1),angle=.79;
  const world=p=>new T.Vector3(...p).applyAxisAngle(axis,angle).add(origin).toArray();
  const part=(name,p,size,m=plastic,r=.003)=>{const o=box(name,world(p),size,m,r);o.rotation.z=angle;return o;};
  const cover=(name,p,size,m,r)=>{const o=roundedPanel(name,world(p),size,m,r);o.rotation.z=angle;return o;};
  cover('Carcaça de cantos contornados',[0,0,0],[.166,.395,.123],plastic,.029);
  for(const s of [-1,1]){
   cover('Moldura da tampa',[0,0,.061*s],[.157,.38,.006],batteryTrim,.028);cover('Painel lateral',[0,0,.065*s],[.144,.366,.004],plastic,.025);
   for(const x of [-.049,.049])for(const y of [-.145,.145])bolt(world([x,y,.067*s]),.0026,[0,0,s]);
   const logo=mesh('Logotipo INOW original',cached('inow-logo',()=>inowGeometry(.22)),white,world([0,.012,.06725*s]));logo.rotation.set(0,s<0?Math.PI:0,s>0?angle-Math.PI/2:Math.PI/2-angle);
  }
  part('Trilho',[.065,-.006,0],[.024,.376,.083],paint,.005);part('Porta de carga',[-.007,.139,.070],[.041,.035,.007],grip,.005);
  part('Interruptor vermelho',[-.05,.155,.0685],[.007,.016,.004],red,.002);
  // Small catches join the removable shell to its diagonal mounting rail.
  for(const y of [-.14,-.06,.035,.125])part('Presilha do trilho',[.079,y,0],[.012,.015,.09],paint,.002);
  const key=new T.Vector3(...world([-.052,.117,.0665]));tube('Fechadura',key.toArray(),key.clone().add(new T.Vector3(0,0,.007)).toArray(),.011,metal);
  box('Ranhura da chave',key.clone().add(new T.Vector3(0,0,.0075)).toArray(),[.002,.012,.001],dark,.0003);
  part('Botão indicador',[.03,.139,.069],[.016,.021,.005],dark,.003);for(let i=0;i<4;i++)part('Janela do indicador',[.018+i*.008,.119,.0678],[.004,.005,.001],steel,.0005);
 });

 section('07 · Guidão e comandos',()=>{
  tube('Avanço inclinado',[-.414,.905,0],[-.377,.977,0],.025,paint);box('Abraçadeira do avanço',[-.386,.954,0],[.056,.063,.048],paint,.01).rotation.z=-.32;
  for(const y of [.933,.961])bolt([-.377,y,.028],.005);
  for(const s of [-1,1]){
   path('Haste alta dupla',[[-.377,.978,.105*s],[-.366,1.022,.105*s],[-.389,1.112,.105*s],[-.419,1.17,.118*s],[-.425,1.19,.17*s],[-.416,1.19,.21*s]],.019,paint);
   tube('Punho ergonômico',[-.416,1.19,.217*s],[-.415,1.19,.337*s],.02,grip,.022,24);box('Apoio da palma',[-.398,1.19,.29*s],[.048,.032,.079],grip,.011);
   for(let i=0;i<11;i++)ring('Sulco da manopla',[-.416,1.19,(.224+i*.009)*s],.021,.0008,dark);
   tube('Trava da manopla',[-.416,1.19,.208*s],[-.416,1.19,.217*s],.023,steel);bolt([-.415,1.19,.341*s],.005,[0,0,s]);
   box('Reservatório do freio',[-.443,1.181,.181*s],[.049,.027,.051],plastic,.006);path('Manete curvo',[[-.442,1.171,.173*s],[-.468,1.158,.195*s],[-.473,1.158,.27*s],[-.47,1.166,.296*s]],.0055,paint);bolt([-.446,1.196,.176*s],.003,[0,1,0]);
   for(let j=0;j<2;j++)path('Cabo de comando',[[-.445,1.17,(.16+j*.02)*s],[-.52,1.105,.13*s],[-.551,.969,.06*s],cockpitLocal([-.49,.85,(j===0?.03:.012)*s])],.0027,grip);
  }
  tube('Travessa inferior',[-.377,.99,-.106],[-.377,.99,.106],.016,paint);tube('Travessa superior',[-.407,1.11,-.113],[-.407,1.11,.113],.014,paint);
  for(const s of [-1,1]){
   tube('Abraçadeira da travessa inferior',[-.377,.99,.058*s],[-.377,.99,.079*s],.021,paint);
   bolt([-.353,.995,.069*s],.0038,[1,0,0]);
  }
  const displayAngle=-.56,displayPoint=p=>new T.Vector3(...p).applyAxisAngle(new T.Vector3(0,0,1),displayAngle).add(new T.Vector3(-.384,1.155,0)).toArray();
  box('Display LCD',displayPoint([0,0,0]),[.08,.018,.067],plastic,.006).rotation.z=displayAngle;
  box('Vidro do display',displayPoint([0,.0098,0]),[.067,.0018,.053],lcd,.004).rotation.z=displayAngle;
  box('Base articulada do display',displayPoint([0,-.011,0]),[.04,.004,.051],paint,.002).rotation.z=displayAngle;
  for(const s of [-1,1]){
   const name=s<0?'direito':'esquerdo',end=displayPoint([0,-.012,.021*s]);
   tube(`Abraçadeira do display ${name}`,[-.407,1.11,.038*s],[-.407,1.11,.05*s],.018,paint);
   path(`Braço do display ${name}`,[[-.407,1.119,.044*s],[-.401,1.133,.035*s],end],.0045,paint);
   bolt([-.397,1.118,.044*s],.003,[1,0,0]);
  }
  path('Cabo conectado ao display',[displayPoint([-.034,0,0]),[-.446,1.16,-.012],[-.48,1.11,.018]],.0025,grip);
  box('Botoneira esquerda',[-.414,1.18,.181],[.035,.025,.024],plastic,.005);for(let i=0;i<3;i++)box('Tecla de comando',[-.424+i*.010,1.194,.18],[.009,.005,.014],grip,.002);
  tube('Campainha',[-.411,1.188,-.189],[-.409,1.213,-.189],.016,metal,.019,24);tube('Gatilho',[-.41,1.208,-.205],[-.382,1.213,-.212],.004,plastic);
  // Keys visible in reference 056; their tiny profiles remain illustrative.
  ring('Argola do chaveiro',[-.389,1.16,-.188],.01,.0014,metal);
  tube('Gancho do chaveiro',[-.425,1.177,-.181],[-.389,1.17,-.188],.002,metal);
  for(let i=0;i<6;i++){const link=ring('Elo do chaveiro',[-.389,1.146-i*.008,-.188],.004,.0009,metal);link.scale.y=1.3;link.rotation.y=i%2*Math.PI/2;}
  box('Controle do alarme',[-.389,1.083,-.188],[.024,.041,.009],plastic,.006);
  for(const y of [1.073,1.087])box('Tecla do controle',[-.389,y,-.193],[.011,.008,.001],grip,.002);
  const harness=new T.CatmullRomCurve3([[-.445,1.17,.16],[-.48,1.11,.018],[-.526,.99,.03],cockpitLocal([-.49,.85,.03]),cockpitLocal([-.445,.761,.025])].map(p=>new T.Vector3(...p)),false,'centripetal');
  path('Núcleo contínuo do chicote',harness.getPoints(48).map(p=>p.toArray()),.0032,grip);
  const cable=[],frames=harness.computeFrenetFrames(220,false);
  for(let i=0;i<=220;i++){const t=i/220,a=t*Math.PI*54;cable.push(harness.getPointAt(t).addScaledVector(frames.normals[i],.004*Math.cos(a)).addScaledVector(frames.binormals[i],.004*Math.sin(a)).toArray());}
  path('Proteção espiral do chicote',cable,.0014,grip);
 }).scale.set(1,cockpitScale,1);
 w.root.children.at(-1).position.y=cockpitOffset;

 section('08 · Farol',()=>{
  // Rounded housing and segmented optics, matched to the close view in photo 049.
  const shell=new T.LatheGeometry([[.018,0],[.04,.006],[.06,.024],[.071,.051],[.074,.071],[.074,.083],[.068,.087]].map(p=>new T.Vector2(...p)),64);
  shell.rotateZ(Math.PI/2);mesh('Carcaça abaulada do farol',shell,paint,[-.552,.785,0]);
  tube('Aro do farol',[-.632,.785,0],[-.641,.785,0],.074,steel,.074,64);
  tube('Fundo óptico',[-.642,.785,0],[-.644,.785,0],.067,dark,.067,64);
  for(let i=0;i<8;i++){
   const g=new T.RingGeometry(.032,.063,12,1,i*Math.PI/4+.055,Math.PI/4-.11);g.rotateY(-Math.PI/2);
   mesh('Setor do refletor óptico',g,metal,[-.645,.785,0]);
  }
  ring('Anel da lente',[-.648,.785,0],.065,.0018,chrome).rotation.y=Math.PI/2;
  box('Moldura do projetor',[-.648,.785,0],[.004,.046,.043],plastic,.007);
  box('Refletor central',[-.651,.785,0],[.003,.035,.03],metal,.005);
  box('Lente do projetor',[-.653,.785,0],[.002,.027,.023],glass,.003);
  box('Núcleo do LED',[-.6545,.785,0],[.0006,.022,.017],white,.002);
  ring('Grade externa',[-.662,.785,0],.068,.0033,paint).rotation.y=Math.PI/2;
  for(let i=0;i<4;i++){const a=i*Math.PI/2,c=Math.cos(a),s=Math.sin(a);tube('Pé de apoio da grade',[-.64,.785+.069*c,.069*s],[-.662,.785+.068*c,.068*s],.0028,paint);}
  const square=[];
  for(let i=0;i<32;i++){const a=i/32*Math.PI*2,c=Math.cos(a),s=Math.sin(a);square.push([-.665,.785+.027*Math.sign(c)*Math.abs(c)**.5,.027*Math.sign(s)*Math.abs(s)**.5]);}
  path('Grade central quadrada arredondada',square,.0026,paint,true);
  for(let i=0;i<8;i++){
   const a=i*Math.PI/4,c=Math.cos(a),s=Math.sin(a),inner=.027/(Math.abs(c)**4+Math.abs(s)**4)**.25;
   tube('Raio da grade frontal',[-.665,.785+inner*c,inner*s],[-.662,.785+.068*c,.068*s],.0027,paint);
  }
  for(const s of [-1,1]){
   softPlate('Suporte perfurado do farol',[[-.475,.76],[-.586,.773],[-.586,.795],[-.475,.789]],.006,.06*s,paint,[[[-.507,.77],[-.507,.781],[-.518,.775]],[[-.532,.775],[-.532,.784],[-.544,.779]]],.22,.001);
   bolt([-.572,.785,.064*s],.007,[0,0,s]);bolt([-.483,.78,.064*s],.004,[0,0,s]);
  }
  tube('Tampa traseira do farol',[-.553,.785,0],[-.558,.785,0],.019,paint);
  path('Chicote do farol',[[-.47,.79,.02],[-.505,.765,.025],[-.551,.785,0]],.0027,grip);
 }).position.y=.06;

 section('09 · Transmissão e pedais',()=>{
  const cx=.065,y=.357,z=-.104;
  ring('Guarda da coroa',[cx,y,z],.105,.009,plastic);ring('Coroa dentada',[cx,y,z+.008],.094,.007,steel);
  for(let k=0;k<48;k++){const a=k*Math.PI/24;box('Dente da coroa',[cx+.100*Math.cos(a),y+.100*Math.sin(a),z+.008],[.008,.009,.003],steel,.001).rotation.z=a;}
  for(let i=0;i<5;i++){const o=plate('Braço da coroa',[[.018,-.012],[.09,-.008],[.09,.01],[.04,.014]],.008,z,plastic);o.rotation.z=i*Math.PI*2/5;o.position.x=cx;o.position.y=y;}
  for(let i=0;i<7;i++){const r=.027+i*.0045,zz=-.061-i*.005;ring('Pinhão do cassete',[rear,cy,zz],r,.004,steel);for(let j=0;j<16;j++){const a=j*Math.PI/8;tube('Dente do pinhão',[rear+r*Math.cos(a),cy+r*Math.sin(a),zz],[rear+(r+.004)*Math.cos(a),cy+(r+.004)*Math.sin(a),zz],.002,metal,.002,8);}}
  const cp=[],guide=[.638,.24],tension=[.673,.183],chainZ=z+.008;
  const chainLine=(a,b,n=16)=>{for(let i=1;i<=n;i++){const t=i/n;cp.push([T.MathUtils.lerp(a[0],b[0],t),T.MathUtils.lerp(a[1],b[1],t),chainZ]);}};
  const chainArc=(c,r,a,b,n=18)=>{for(let i=1;i<=n;i++){const t=T.MathUtils.lerp(a,b,i/n);cp.push([c[0]+r*Math.cos(t),c[1]+r*Math.sin(t),chainZ]);}};
  cp.push([cx,y+.101,chainZ]);chainLine([cx,y+.101],[rear,cy+.053],24);
  chainArc([rear,cy],.053,Math.PI/2,-Math.PI/2);
  chainLine([rear,cy-.053],[guide[0],guide[1]+.018],5);
  chainArc(guide,.018,Math.PI/2,Math.PI*1.5,12);
  chainLine([guide[0],guide[1]-.018],[tension[0]+.018,tension[1]],7);
  chainArc(tension,.018,0,-Math.PI/2,8);
  chainLine([tension[0],tension[1]-.018],[cx,y-.101],24);
  chainArc([cx,y],.101,-Math.PI/2,-Math.PI*1.5,24);cp.pop();
  const curve=new T.CatmullRomCurve3(cp.map(p=>new T.Vector3(...p)),true,'centripetal'),links=Math.round(curve.getLength()/.009);
  for(let i=0;i<links;i++){
   const p=curve.getPointAt(i/links),t=curve.getTangentAt(i/links),a=Math.atan2(t.y,t.x);
   for(const s of [-1,1])box('Placa de elo',[p.x,p.y,p.z+s*.004],[.009,.0045,.0014],i%2?metal:steel,.001).rotation.z=a;
   tube('Pino da corrente',[p.x,p.y,p.z-.005],[p.x,p.y,p.z+.005],.0014,metal,.0014,8);
  }
  box('Corpo do câmbio',[.65,.277,-.075],[.038,.052,.042],plastic,.008);
  for(const s of [-1,1])plate('Gaiola vazada do câmbio',[[.62,.256],[.651,.252],[.691,.19],[.687,.164],[.662,.163],[.639,.21]],.003,chainZ+s*.008,paint,[[[.641,.226],[.67,.187],[.663,.178],[.646,.206]]],.001);
  for(const p of [guide,tension]){
   tube('Miolo da roldana',[...p,chainZ-.006],[...p,chainZ+.006],.014,plastic);
   for(let k=0;k<12;k++){const a=k*Math.PI/6;box('Dente da roldana',[p[0]+.016*Math.cos(a),p[1]+.016*Math.sin(a),chainZ],[.006,.004,.006],plastic,.0007).rotation.z=a;}
   for(const s of [-1,1])bolt([...p,chainZ+s*.011],.004,[0,0,s]);
  }
  path('Conduíte do câmbio',[[.49,.338,-.063],[.713,.34,-.087],[.75,.28,-.091],[.683,.268,-.087]],.003,grip);
  tube('Regulador do câmbio',[.681,.268,-.087],[.665,.269,-.085],.006,steel);
  ring('Proteção parcial da corrente',[cx,y,-.116],.119,.005,plastic,Math.PI*.88).rotation.z=.2;tube('Haste do protetor',[cx,y+.117,-.116],[.59,.355,-.116],.01,plastic);
  for(const s of [-1,1]){
   const px=cx+.105*s,py=y-.097*s;tube('Pedivela',[cx,y,.09*s],[px,py,.12*s],.013,paint,.017);bolt([cx,y,.113*s],.009,[0,0,s]);tube('Eixo do pedal',[px,py,.12*s],[px,py,.195*s],.006,metal);
   for(const zz of [.144,.222])tube('Longarina do pedal',[px-.043,py,zz*s],[px+.043,py,zz*s],.006,plastic);
   for(const xx of [-.043,0,.043])tube('Travessa do pedal',[px+xx,py,.144*s],[px+xx,py,.222*s],.006,plastic);
   for(const xx of [-.035,-.012,.012,.035])for(const zz of [.146,.221])tube('Pino antiderrapante',[px+xx,py,zz*s],[px+xx,py+.008,zz*s],.002,metal);
   for(const side of [-1,1])box('Refletor do pedal',[px+side*.047,py,.182*s],[.003,.013,.058],orange,.003);
  }
  tube('Suporte do descanso',[.39,.335,.05],[.42,.29,.08],.02,paint);bolt([.41,.309,.098],.009);tube('Descanso articulado',[.42,.29,.08],[.46,.035,.20],.012,paint,.018);box('Sapata do descanso',[.464,.016,.205],[.065,.02,.045],grip,.008);
 });
 w.root.name='V20 Brake Pro · revisão 06';
 w.root.scale.setScalar(modelScale);w.root.updateMatrixWorld(true);
 // Ground the actual tread, without squashing either wheel or individual parts.
 const bounds=new T.Box3().setFromObject(w.root,true);w.root.position.y=-bounds.min.y;w.root.updateMatrixWorld(true);
 const whole=new T.Box3().setFromObject(w.root,true),size=whole.getSize(new T.Vector3());
 const dimensions={
  ...measurementEvidence,
  reconstructed:{length:size.x,width:size.z,height:size.y,wheelbase:(rear-front)*modelScale,groundOffset:w.root.position.y,status:'estimated-reconstruction-not-product-specification'},
  measuredTyreBodies:tyreBodies.map(o=>{const b=new T.Box3().setFromObject(o,true),v=b.getSize(new T.Vector3());return {sectionWidth:v.z,diameterX:v.x,diameterY:v.y};}),
 };
 w.root.userData={revision:6,status:'Nominal 98-406 component anchor; curved surfaces and connected fittings; remaining dimensions estimated; not manufacturer CAD',dimensions};
 // The unmerged form is only for local attachment tests. Production export stays grouped.
 const result=merge?w.finish():{root:w.root,report:{}};result.report.dimensions=dimensions;return result;
}
