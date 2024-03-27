import*as t from"../build/three.module.js";import{A as i,D as e,DIRECTIONS as o,S as a,W as r}from"./utils.js";export class CharacterControls{model;mixer;animationsMap=new Map;orbitControl;camera;trilha;toggleRun=!0;currentAction;walkDirection=new t.Vector3;rotateAngle=new t.Vector3(0,1,0);rotateQuarternion=new t.Quaternion;cameraTarget=new t.Vector3;fadeDuration=.2;runVelocity=3;walkVelocity=1.5;constructor(t,i,e,o,a,r){this.model=t,this.mixer=i,this.animationsMap=e,this.currentAction=r,this.animationsMap.forEach((t,i)=>{i==r&&t.play()}),this.orbitControl=o,this.camera=a,this.updateCameraTarget(0,0)}switchRunToggle(){this.toggleRun=!this.toggleRun}update(t,i){let e=o.some(t=>!0==i[t]);var a="";if(a=e&&this.toggleRun?"Run":e?"Walk":"Idle",this.currentAction!=a){let r=this.animationsMap.get(a),n=this.animationsMap.get(this.currentAction);n.fadeOut(this.fadeDuration),r.reset().fadeIn(this.fadeDuration).play(),this.currentAction=a}if(this.mixer.update(t),"Run"==this.currentAction||"Walk"==this.currentAction){var s=Math.atan2(this.camera.position.x-this.model.position.x,this.camera.position.z-this.model.position.z),h=this.directionOffset(i);this.rotateQuarternion.setFromAxisAngle(this.rotateAngle,s+h),this.model.quaternion.rotateTowards(this.rotateQuarternion,.2),this.camera.getWorldDirection(this.walkDirection),this.walkDirection.y=0,this.walkDirection.normalize(),this.walkDirection.applyAxisAngle(this.rotateAngle,h);let l="Run"==this.currentAction?this.runVelocity:this.walkVelocity,c=this.walkDirection.x*l*t,m=this.walkDirection.z*l*t;this.model.position.x+=c,this.model.position.z+=m,this.updateCameraTarget(c,m)}}updateCameraTarget(t,i){this.camera.position.x+=t,this.camera.position.z+=i,this.cameraTarget.x=this.model.position.x,this.cameraTarget.y=this.model.position.y+1.3,this.cameraTarget.z=this.model.position.z,this.orbitControl.target=this.cameraTarget}directionOffset(t){var o=0;return t[r]?t[i]?o=Math.PI/4:t[e]&&(o=-Math.PI/4):t[a]?o=t[i]?Math.PI/4+Math.PI/2:t[e]?-Math.PI/4-Math.PI/2:Math.PI:t[i]?o=Math.PI/2:t[e]&&(o=-Math.PI/2),o}}
