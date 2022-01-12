import{Asterisms,HelpButton,INITIAL_FOV,Keys,LENGTH_SCALE,Loader,Measure,Object3D,Planet,Ray,Raycaster,SpriteSheet,Star,Stars,ThreeUi,Time,Vector2,Vector3,assertArgs,capitalize,createTree,elt,makeCollapsable,marker,queryPoints,reifyMeasures,setTitleFromLocation,shapes_exports,shared_exports,targets,three_module_exports,twoPi,utils_exports,visitToggleProperty}from"./chunk-S6ZX5IK2.js";import{Link,__toESM,require_react,useLocation}from"./chunk-4CNGUTRA.js";var import_react3=__toESM(require_react(),1);var import_react=__toESM(require_react(),1);function AboutButton(){let[open,setOpen]=import_react.default.useState(!1),toggleOpen=()=>{setOpen(!open)};return import_react.default.createElement(import_react.default.Fragment,null,import_react.default.createElement("button",{onClick:toggleOpen,className:"textButton"},"About"),open&&import_react.default.createElement(About,{openToggle:toggleOpen}))}function About({openToggle}){return import_react.default.createElement("div",{className:"dialog"},import_react.default.createElement("button",{onClick:openToggle},"X"),import_react.default.createElement("h1",null,"About"),"Celestiary is a cosmological simulator.",import_react.default.createElement("h2",null,"News"),import_react.default.createElement("ul",null,import_react.default.createElement("li",null,"2021 Dec 30 - Introduce esbuild with code splitting.  Use react and react-router to improve code structure and prepare for better permalinks."),import_react.default.createElement("li",null,"2021 Jan 25 - Works in Safari 13.1.2+ on OSX, maybe earlier. Now all major browsers tested except IE.")),import_react.default.createElement("h2",null,"Features"),import_react.default.createElement("ul",null,import_react.default.createElement("li",null,"Keplerian orbits (6 orbital elements)"),import_react.default.createElement("li",null,"Time controls, to alter rate and direction of time"),import_react.default.createElement("li",null,"Star colors based on surface temperatures"),import_react.default.createElement("li",null,"Star surface dynamics simulation (Perlin noise in black-body spectra)"),import_react.default.createElement("li",null,"9 planets, 20 moons"),import_react.default.createElement("li",null,"Permanent links for scene locations"),import_react.default.createElement("li",null,"Even kinda works on mobile! :)")),import_react.default.createElement("h2",null,"Datasets"),import_react.default.createElement("ul",null,import_react.default.createElement("li",null,"~100,000 stars"),import_react.default.createElement("li",null,"~3k star names"),import_react.default.createElement("li",null,"~80 Asterisms/constellations")),import_react.default.createElement("h2",null,"Learn more"),import_react.default.createElement("ul",null,import_react.default.createElement("li",null,import_react.default.createElement(Link,{to:"/guide"},"Software development guide")),import_react.default.createElement("li",null,import_react.default.createElement("a",{href:"https://github.com/pablo-mayrgundter/celestiary",target:"_blank"},"Source code (GitHub)"))))}var Animation=class{constructor(time){this.time=time,this.Y_AXIS=new Vector3(0,1,0)}animate(scene){this.time.updateTime(),this.animateSystem(scene,this.time.simTime/1e3)}animateSystem(system,simTimeSecs){if(system.preAnimCb&&system.preAnimCb(this.time),system.siderealRotationPeriod){let angle=1.5*Math.PI+simTimeSecs/86400*twoPi;system.setRotationFromAxisAngle(this.Y_AXIS,angle)}if(system.orbit){let eccentricity=system.orbit.eccentricity,aRadius=system.orbit.semiMajorAxis.scalar*LENGTH_SCALE,bRadius=aRadius*Math.sqrt(1-Math.pow(eccentricity,2)),angle=-1*simTimeSecs/system.orbit.siderealOrbitPeriod.scalar*twoPi,x=aRadius*Math.cos(angle),y=0,z=bRadius*Math.sin(angle);system.position.set(x,y,z),system.postAnimCb&&system.postAnimCb(system)}for(let ndx in system.children){let child=system.children[ndx];this.animateSystem(child,simTimeSecs)}}};var ControlPanel=class{constructor(containerElt,loader){this.containerElt=containerElt,this.loader=loader}getPathTarget(path){return path[path.length-1]}showNavDisplay(path){let crumbs="";for(let i=0;i<path.length;i++){let hash=path.slice(0,i+1).join("/"),name=path[i];i==path.length-1?crumbs+=capitalize(name):crumbs+='<a href="#'+hash+'">'+capitalize(name)+"</a>",i<path.length-1&&(crumbs+=" &gt; ")}let html=crumbs+` <ul>
`,pathPrefix=path.join("/");html+=this.showInfoRecursive(this.loader.loaded[this.getPathTarget(path)],pathPrefix,!1,!1),html+=`</ul>
`,this.containerElt.innerHTML=html,makeCollapsable(this.containerElt)}showInfoRecursive(obj,pathPrefix,isArray,isSystem){let html="";for(let prop in obj)if(!(prop=="name"||prop=="parent"||prop.startsWith("texture_"))&&obj.hasOwnProperty(prop)){let val=obj[prop];if(prop=="system"&&typeof val=="object"&&Array.isArray(val)&&val.length==0)continue;if(html+="<li>",isArray||(html+=prop+": "),val instanceof Measure){switch(prop){case"radius":val=val.convertTo(Measure.Magnitude.KILO);break;case"mass":val=val.convertTo(Measure.Magnitude.KILO);break;case"semiMajorAxis":typeof val.scalar=="string"&&(val.scalar=parseFloat(val.scalar)),val.scalar=val.scalar.toExponential(4),val=val.toString();break;case"siderealOrbitPeriod":val=secsToYDHMS(val.scalar);break;case"siderealRotationPeriod":val=secsToYDHMS(val.scalar);break}html+=val}else if(val instanceof Array)prop=="system"?html+=`<ol>
`:html+=`<ol class="collapsed">
`,html+=this.showInfoRecursive(val,pathPrefix,!0,prop=="system"),html+=`</ol>
`;else if(val instanceof Object)html+=`<ul class="collapsed">
`,html+=this.showInfoRecursive(val,pathPrefix,!1,!1),html+=`</ul>
`;else{if(isSystem){let path=pathPrefix;pathPrefix.length>0&&(path+="/"),path+=val,html+='<a href="#'+path+'">',html+=capitalize(val)}else html+=val;isSystem&&(html+="</a>")}html+=`</li>
`}return html}};function secsToYDHMS(s){let secsPerYear=86400*365,str="",years=parseInt(s/secsPerYear);years>0&&(s-=years*secsPerYear,str+=`${years}y`);let days=parseInt(s/86400);days>0&&(s-=days*86400,str+=` ${days}d`);let hours=parseInt(s/3600);hours>0&&(s-=hours*3600,str+=` ${hours}h`);let minutes=parseInt(s/60);minutes>0&&(s-=minutes*60,str+=` ${minutes}m`);let seconds=parseInt(s);return seconds>0&&(str+=` ${seconds}s`),str}function CustomRaycaster(origin,direction,near,far){this.ray=new Ray(origin,direction),this.near=near||0,this.far=far||1/0,this.params={Mesh:{},Line:{},LOD:{},Points:{threshold:1},Sprite:{}},Object.defineProperties(this.params,{PointCloud:{get:function(){return console.warn("CustomRaycaster: params.PointCloud has been renamed to params.Points."),this.Points}}})}function ascSort(a,b){return a.distanceToRay-b.distanceToRay}function intersectObject(object,raycaster,intersects,recursive){if(object.visible!==!1&&(object.raycast(raycaster,intersects),recursive===!0))for(var children=object.children,i=0,l=children.length;i<l;i++)intersectObject(children[i],raycaster,intersects,!0)}Object.assign(CustomRaycaster.prototype,{linePrecision:1,set:function(origin,direction){this.ray.set(origin,direction)},setFromCamera:function(coords,camera){camera&&camera.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(camera.matrixWorld),this.ray.direction.set(coords.x,coords.y,.5).unproject(camera).sub(this.ray.origin).normalize()):camera&&camera.isOrthographicCamera?(this.ray.origin.set(coords.x,coords.y,(camera.near+camera.far)/(camera.near-camera.far)).unproject(camera),this.ray.direction.set(0,0,-1).transformDirection(camera.matrixWorld)):console.error("CustomRaycaster: Unsupported camera type.")},intersectObject:function(object,recursive,optionalTarget){var intersects=optionalTarget||[];return intersectObject(object,this,intersects,recursive),intersects.sort(ascSort),intersects},intersectObjects:function(objects,recursive,optionalTarget){var intersects=optionalTarget||[];if(Array.isArray(objects)===!1)return console.warn("CustomRaycaster.intersectObjects: objects is not an Array."),intersects;for(var i=0,l=objects.length;i<l;i++)intersectObject(objects[i],this,intersects,recursive);return intersects.sort(ascSort),intersects}});var lengthScale=LENGTH_SCALE,INITIAL_STEP_BACK_MULT=10,Scene=class{constructor(ui){this.ui=ui,this.objects={},this.mouse=new Vector2,this.raycaster=new Raycaster,this.raycaster.params.Points.threshold=3,ui.addClickCb(click=>{this.onClick(click)}),this.stars=null,this.asterisms=null,this.marker=marker(),this.marker.visible=!0,this.ui.scene.add(this.marker),this.starSelected=!1}add(props){let name=props.name,parentObj=this.objects[props.parent],parentOrbitPosition=this.objects[props.parent+".orbitPosition"];if((props.name=="milkyway"||props.name=="sun")&&(parentObj=parentOrbitPosition=this.ui.scene),!parentObj||!parentOrbitPosition)throw new Error(`No parent obj: ${parentObj} or pos: ${parentOrbitPosition} for ${name}`);let obj3d=this.objectFactory(props);return parentOrbitPosition.add(obj3d),obj3d}objectFactory(props){switch(props.type){case"galaxy":return this.newGalaxy(props);case"stars":let pickedStarLabel;return this.stars=new Stars(props,()=>{this.stars.showLabels();let tree=createTree();tree.init(this.stars.geom.coords);let traceCb=e=>{queryPoints(this.ui,e,tree,this.stars,pick=>{this.starSelected||this.marker.position.copy(pick),pickedStarLabel!=null&&pickedStarLabel.removeFromParent();let starName=""+this.stars.catalog.getNameOrId(pick.star.hipId),pickedLabelSheet=new SpriteSheet(1,starName,void 0,[0,1e5]);pickedLabelSheet.add(pick.x,pick.y,pick.z,starName),pickedStarLabel=pickedLabelSheet.compile(),this.ui.scene.add(pickedStarLabel)})},markCb=e=>{queryPoints(this.ui,e,tree,this.stars,pick=>{this.starSelected&&this.marker.position.copy(pick),this.starSelected=!this.starSelected})};document.body.addEventListener("dblclick",markCb),document.body.addEventListener("mousemove",traceCb)}),this.stars;case"star":return new Star(props,this.objects,this.ui);case"planet":return new Planet(this,props);case"moon":return new Planet(this,props,!0)}throw new Error(`Object has unknown type: ${props.type}`)}newObject(name,props,onClick){let obj=this.newGroup(name,props);if(!onClick)throw new Error("Must provide an onClick handler");return obj.onClick=onClick,obj}newGroup(name,props){let obj=new Object3D;return this.objects[name]=obj,obj.name=name,props&&(obj.props=props),obj}targetNamed(name){this.setTarget(name),this.lookAtTarget()}targetParent(){let cObj=targets.cur;cObj&&cObj.props&&cObj.props.parent&&this.setTarget(cObj.props.parent)}targetNode(index){let cObj=targets.cur;if(cObj&&cObj.props&&cObj.props.system&&cObj.props.system){let sys=cObj.props.system;sys[index-1]&&this.setTarget(sys[index-1])}}targetCurNode(){let cObj=targets.cur;cObj&&cObj.props&&cObj.props.name&&this.setTarget(cObj.props.name)}setTarget(name){let obj=this.objects[name];if(!obj)throw new Error(`scene#setTarget: no matching target: ${name}`);targets.obj=obj}lookAtTarget(){if(!targets.obj){console.error("scene.js#lookAtTarget: no target obj to look at.");return}let obj=targets.obj,tPos=targets.pos;this.ui.scene.updateMatrixWorld(),tPos.setFromMatrixPosition(obj.matrixWorld),this.ui.camera.lookAt(tPos)}goTo(){if(!targets.obj){console.error("Scene.goTo called with no target obj.");return}let obj=targets.obj,tPos=targets.pos;this.ui.scene.updateMatrixWorld(),tPos.setFromMatrixPosition(obj.matrixWorld);let pPos=new Vector3,cPos=new Vector3,surfaceAltitude=obj.props.radius.scalar*lengthScale;pPos.set(0,0,0),cPos.set(0,0,surfaceAltitude*INITIAL_STEP_BACK_MULT),obj.orbitPosition.add(this.ui.camera.platform),this.ui.camera.platform.position.copy(pPos),this.ui.camera.platform.lookAt(targets.origin),this.ui.camera.position.copy(cPos),this.ui.camera.lookAt(tPos),targets.track=targets.cur=targets.obj,this.ui.controls.update()}track(name){targets.track?targets.track=null:targets.track=targets.obj}follow(name){if(targets.follow)delete targets.follow.postAnimCb,targets.follow=null;else if(targets.obj)if(targets.obj.orbitPosition){let followed=targets.obj.orbitPosition;targets.follow=followed,followed.postAnimCb=obj=>{this.ui.camera.platform.lookAt(targets.origin)},followed.postAnimCb(followed)}else console.error("Target to follow has no orbitPosition property.");else console.error("No target object to follow.")}onClick(mouse){return;for(let i=0;i<intersects.length;i++){let intersect=intersects[i],dist=intersect.distance,obj2=intersect.object;if(obj2.isAnchor){console.log("raycast skipping anchor");continue}if(obj2.type!="Line")switch(obj2.type){case"Mesh":{if(nearestMeshIntersect&&nearestMeshIntersect.distance<dist)continue;nearestMeshIntersect=intersect}break;case"Points":if(obj2.isStarPoints){if(nearestStarPointIntersect&&nearestStarPointIntersect.distanceToRay<intersect.distanceToRay)continue;nearestStarPointIntersect=intersect}else{if(nearestPointIntersect&&nearestPointIntersect.distance<dist)continue;nearestPointIntersect=intersect}break;case"Group":break;default:{if(nearestDefaultIntersect&&nearestDefaultIntersect.distance<dist)continue;nearestDefaultIntersect=intersect}}}}toggleAsterisms(){if(this.asterisms==null){let asterisms=new Asterisms(this.stars,()=>{this.stars.add(asterisms),console.log("Asterisms count:",asterisms.catalog.numAsterisms),this.asterisms=asterisms})}this.asterisms&&(this.asterisms.visible=!this.asterisms.visible)}toggleOrbits(){visitToggleProperty(this.objects.sun,"name","orbit","visible")}togglePlanetLabels(){visitToggleProperty(this.objects.sun,"name","label","visible")}toggleStarLabels(){this.stars.labelLOD.visible=!this.stars.labelLOD.visible}newGalaxy(galaxyProps){let group=this.newObject(galaxyProps.name,galaxyProps,click=>{});return this.objects[galaxyProps.name+".orbitPosition"]=group,group}};var DEFAULT_TARGET="sun",elt2=id=>document.getElementById(id),Celestiary=class{constructor(canvasContainer,navElt,setTimeStr){assertArgs(arguments,3),this.time=new Time(setTimeStr),this.animation=new Animation(this.time),canvasContainer.style.width=window.innerWidth+"px",canvasContainer.style.height=window.innerHeight+"px";let animCb=scene=>{this.animation.animate(scene),targets.track&&this.scene.lookAtTarget()};this.ui=new ThreeUi(canvasContainer,animCb),this.scene=new Scene(this.ui),this.loader=new Loader,this.controlPanel=new ControlPanel(navElt,this.loader),this.load(),this.setupListeners(),this.navVisible=!0,this.shared=shared_exports,this.shapes=shapes_exports,this.three=three_module_exports,this.utils=utils_exports,this.toggleHelp=null,window.c=this}getTime(){if(this.time===null)throw new Error("Null time");return this.time}load(){this.onLoadCb=(name,obj)=>{reifyMeasures(obj),this.scene.add(obj)},this.onDoneCb=(path2,obj)=>{this.controlPanel.showNavDisplay(path2.split("/"),this.loader),setTimeout(()=>{let parts=path2.split("/"),targetName=parts[parts.length-1];targetName.indexOf("-")>=0&&(targetName=targetName.split("-")[0]),this.scene.targetNamed(targetName),this.scene.goTo()},0)};let path;location.hash?path=location.hash.substring(1):(path=DEFAULT_TARGET,location.hash=path),this.loader.loadPath("milkyway",this.onLoadCb,()=>{this.loader.loadPath(path,this.onLoadCb,this.onDoneCb,()=>{setTimeout(()=>{location.hash=DEFAULT_TARGET},1e3)})})}goTo(){let tObj=this.shared.targets.obj;if(tObj)if(tObj.props&&tObj.props.name){let path=this.loader.pathByName[tObj.props.name];path?window.location.hash=path:console.error(`no loaded path for ${tObj.props.name}: ${path}`)}else console.error("target obj has no name prop: ",tObj);else console.error("no target obj!")}setupListeners(){window.addEventListener("hashchange",e=>{this.loader.loadPath((window.location.hash||"#").substring(1),this.onLoadCb,this.onDoneCb)},!1);let k=new Keys;k.map("Escape",()=>{this.hideActiveDialog()},"Hide active dialog"),k.map(" ",()=>{this.time.togglePause()},"Toggle time pause"),k.map(",",()=>{this.ui.multFov(.9)},"Narrow field-of-vision"),k.map(".",()=>{this.ui.multFov(1.1)},"Broaden field-of-vision"),k.map("/",()=>{this.ui.resetFov()},"Reset field-of-vision to "+INITIAL_FOV+"\xBA"),k.map("0",()=>{this.scene.targetCurNode()},"Target current system");for(let i=1;i<=9;i++)k.map(""+i,()=>{let ndx=i;this.scene.targetNode(ndx)},`Look at child ${i} of current system`);k.map(";",()=>{this.time.changeTimeScale(0)},"Change time scale to real-time"),k.map("c",()=>{this.scene.lookAtTarget()},"Look at target"),k.map("f",()=>{this.scene.follow()},"Follow current node"),k.map("g",()=>{this.goTo()},"Go to target node"),k.map("j",()=>{this.time.invertTimeScale()},"Reverse time"),k.map("k",()=>{this.time.changeTimeScale(-1)},"Slow down time"),k.map("l",()=>{this.time.changeTimeScale(1)},"Speed up time"),k.map("n",()=>{this.time.setTimeToNow()},"Set time to now"),k.map("t",()=>{this.scene.track()},"Track target node"),k.map("u",()=>{this.scene.targetParent()},"Look at parent of current system"),k.map("A",()=>{this.scene.toggleAsterisms()},"Show/hide asterisms"),k.map("O",()=>{this.scene.toggleOrbits()},"Show/hide orbits"),k.map("P",()=>{this.scene.togglePlanetLabels()},"Show/hide planet and moon names"),k.map("S",()=>{this.scene.toggleStarLabels()},"Show/hide star names"),k.map("V",()=>{[elt2("nav-id"),elt2("top-right")].map(panel=>{panel.style.visibility=this.navVisible?"hidden":"visible"}),this.navVisible=!this.navVisible},"Show/hide navigation panels"),this.keys=k}hideActiveDialog(){document.querySelectorAll(".dialog").forEach(elt3=>this.hideElt(elt3))}hideElt(elt3){elt3.style.display="none"}toggleEltDisplay(elt3){return elt3.style.display=="block"?(this.hideElt(elt3),!1):(this.hideActiveDialog(),elt3.style.display="block",!0)}hideHelpOnEscape(){let keysElt=elt2("keys-id");keysElt.style.display="none"}};var import_react2=__toESM(require_react(),1);function updateTimeMsg(time){let msg="";return time.timeScale==1?msg="real-time":msg=time.timeScale.toLocaleString()+" secs/s",time.pause&&(msg+=" (paused)"),msg}function TimePanel({time,timeStr}){let[timeScale,setTimeScale]=import_react2.default.useState("");return import_react2.default.useEffect(()=>{setTimeScale(updateTimeMsg(time))},[timeStr]),import_react2.default.createElement("div",{id:"time-id"},import_react2.default.createElement("div",{id:"date-id"},timeStr),import_react2.default.createElement("div",{id:"time-scale-id"},timeScale),import_react2.default.createElement("div",{id:"time-controls-id"},import_react2.default.createElement("button",{onClick:()=>{time.changeTimeScale(1)}},"+"),import_react2.default.createElement("button",{onClick:()=>{time.changeTimeScale(-1)}},"-"),import_react2.default.createElement("button",{onClick:()=>{time.changeTimeScale(0)}},"="),import_react2.default.createElement("button",{onClick:()=>{time.invertTimeScale()}},"/")))}function App(){let location2=useLocation();import_react3.default.useEffect(()=>{setTitleFromLocation(location2)},[location2]);let[celestiary,setCelestiary]=import_react3.default.useState(null),[timeStr,setTimeStr]=import_react3.default.useState(""),[showAbout,setShowAbout]=import_react3.default.useState(!1);return import_react3.default.useEffect(()=>{setCelestiary(new Celestiary(elt("scene-id"),elt("nav-id"),setTimeStr))},[]),import_react3.default.createElement(import_react3.default.Fragment,null,import_react3.default.createElement("div",{id:"scene-id"}),import_react3.default.createElement("div",{id:"nav-id",className:"panel"},"Welcome to Celestiary!  Loading..."),import_react3.default.createElement("div",{id:"top-right",className:"panel"},celestiary&&import_react3.default.createElement(TimePanel,{time:celestiary.time,timeStr}),celestiary&&import_react3.default.createElement(HelpButton,{keys:celestiary.keys}),import_react3.default.createElement(AboutButton,null)),import_react3.default.createElement("h1",{id:"target-id"}))}export{App as default};
//# sourceMappingURL=App-XBR5CBR3.js.map
