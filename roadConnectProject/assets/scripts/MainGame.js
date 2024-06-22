let levelContainer;
let mainActContainer;
let shapeContainer;
let endMsgContainer;
let isLevelClicked;
let isBlockClicked;

let currentLvl=1;
let totalBlocks;

//shape id names
//--I,C,L,+,X,T,U <<<all shape ids
//angles, xy positions
let levelsData=new Array(
    [   
        [4,"_C","_C","_C","_C"],[[90,0],[0,90],[0,-90],[0,180]],
        [[232,512],[360,512],[232,640],[360,640]]
    ],

    [   [6,"_C","_U","_C","_L","_U","_L"],
        [[90,0],[90,180],[180,-90],[-90,90],[0,0],[90,180]],
        [[232,448],[360,448],[232,576],[360,576],[232,704],[360,704]]
    ],

    [   [5,"_C","_C","_C","_I","_I"],
        [[0,0],[180,90],[180,-90],[90,0],[90,0]],
        [[232,448],[360,448],[232,576],[360,576],[360,704]]
    ],

    [   [14,"_U","_U","_L","_T","_T","_L","_X","_+","_+","_X","_L","_L","_L","_L"],
        [[0,90],[180,90],[0,0],[90,180],[90,0],[90,90],[90,0],[0,0],[0,0],[90,90],[180,-90],[-90,180],[180,-90],[-90,180]],
        [[232,384],[360,384],[104,512],[232,512],[360,512],[488,512],[104,640],[232,640],[360,640],[488,640],[104,768],[232,768],[360,768],[488,768]]
    ],

    [   [10,"_L","_T","_T","_L","_L","_+","_+","_L","_U","_U"],
        [[90,0],[180,90],[180,90],[-90,90],[180,-90],[-90,0],[90,0],[0,180],[90,-90],[90,-90]],
        [[105,448],[232,448],[360,448],[488,448],[105,576],[232,576],[360,576],[488,576],[232,704],[360,704]]
    ],

    [   [15,"_C","_U","_U","_+","_I","_U","_C","_C","_C","_C","_L","_I","_I","_C","_L"],
        [[90,0],[0,180],[180,0],[0,0],[180,90],[90,180],[90,0],[0,180],[90,0],[0,90],[0,-90],[0,90],[0,90],[90,180],[90,-90]],
        [[169,384],[297,384],[41,512],[169,512],[297,512],[425,512],[42,640],[169,640],[424,640],[552,640],[42,768],[168,768],[296,768],[424,768],[552,768]]
    ]
    
);



class MainGame extends Phaser.Scene {
    
    constructor(){
        super("MainGame");
    }

       


    create(){      
       
        if (!window.localStorage.getItem("roadCLevel")) {                 
            localStorage.setItem("roadCLevel", currentLvl);
            currentLvl=localStorage.getItem("roadCLevel");                    
        }else{
            currentLvl=localStorage.getItem("roadCLevel");
        }
        console.log(localStorage.getItem("roadCLevel")) 

        if(localStorage.getItem("roadCLevelComp")){
            currentLvl=levelsData.length;
            localStorage.setItem("roadCLevel", currentLvl);
        }

        this.LevelsControll();       
    }


    //==================================================================
    //--LEVEL BOARD LIST
    //==================================================================
    LevelsControll(){
        levelContainer=this.add.container(0, 0);  
        levelContainer.setSize(sW,sH);

        var titleTxt=this.add.label(0,0,"{menu_title}").setFont("55px triple2",{align: 'center'}).setOrigin(0.5); 
        titleTxt.x=sW/2;
        titleTxt.y=(sH/100)*8;
        titleTxt.setShadow(2, 2, '#000000', 2, true, true);
        levelContainer.add(titleTxt);

        let rect = new Phaser.GameObjects.Rectangle(this, 0, 0, ((sW/100)*86),  ((sH/100)*78), 0xffffff).setOrigin(0);
        rect.alpha=0.4;
        rect.x=(sW/2)-rect.width/2;
        rect.y=((sH/100)*16);
        levelContainer.add(rect);

        var xp=rect.x+((sW/100)*2);
        var yp=rect.y+((sW/100)*2);

        for(var i=1; i<=levelsData.length; i++){
            var lvlBtn=this.add.image(0,0,'_lvlOvrBtn').setOrigin(0);
            
            lvlBtn.displayWidth=((sW/100)*12);
            lvlBtn.displayHeight=lvlBtn.displayWidth;
            lvlBtn.id=i;
            lvlBtn.name="lvlBtn_"+i;
            
            //var ratio=((sW/100)*10)/49;
            //lvlBtn.scale=2.2;
            
            lvlBtn.x=xp;
            lvlBtn.y=yp;
            xp+=lvlBtn.displayWidth+((sW/100)*2);
            if(i%6==0){//more than 4 level
                xp=rect.x+((sW/100)*2);
                yp+=lvlBtn.displayHeight+((sH/100)*2);
            }
            var btnTxt=this.add.text(lvlBtn.x,lvlBtn.y,i).setFont("45px triple2",{align: 'center'}).setOrigin(0.5);             
            btnTxt.x+=lvlBtn.displayWidth/2;
            btnTxt.y+=lvlBtn.displayHeight/2;
            levelContainer.add(lvlBtn);
            levelContainer.add(btnTxt);

            if(i>currentLvl){
                lvlBtn.setTexture("_lvlGrayBtn").setTint(0x666666);
            }else{
                lvlBtn.setInteractive({ useHandCursor: true });            
                this.input.on('gameobjectup', this.OnClickSelectLevel,lvlBtn); 
            }
        }       
        
    }

    //==================================================================
    //--LEVEL BOARD LIST
    //==================================================================

    OnClickSelectLevel(pointer,getBtn){
        if(!isLevelClicked){
            ClickSnd.play();
            isLevelClicked=true;  
            currentLvl=getBtn.name.split("_")[1];            
            levelContainer.x=- ((sW/100)*120);            
        }         
    }

    //==================================================================
    //--LEVEL BTN EVEN DESABLE
    //==================================================================

    removeAllLevelEvents(getBoo=false){
        for(var i=1; i<=levelsData.length; i++){
            //levelContainer.getByName("lvlBtn_"+i).disableInteractive();
            if(!getBoo){
               
                this.input.off('gameobjectup', this.OnClickSelectLevel,levelContainer.getByName("lvlBtn_"+i)); 
            }else{
                if(i>localStorage.getItem("roadCLevel")){//if level done sprit change
                    levelContainer.getByName("lvlBtn_"+i).setTexture("_lvlGrayBtn").setTint(0x666666);
                }else{
                    levelContainer.getByName("lvlBtn_"+i).setTexture("_lvlOvrBtn").setTint(0xffffff);
                    levelContainer.getByName("lvlBtn_"+i).setInteractive({ useHandCursor: true });                     
                }
                this.input.on('gameobjectup', this.OnClickSelectLevel, levelContainer.getByName("lvlBtn_"+i));
            }

            
        }
    }

    //==================================================================
    //--CREATE CURRENT LEVEL SHAPES
    //==================================================================

    createShapesAndPos(){
        mainActContainer=this.add.container(0, 0);  
        mainActContainer.setSize(720,1280);
        
        var titleTxt=this.add.label(0,0,"{level_title} "+currentLvl).setFont("45px triple2",{align: 'center'}).setOrigin(0.5); 
        titleTxt.name="titleTxt";
        titleTxt.x=(sW/2);
        titleTxt.y= ((sH/100)*5);
        titleTxt.setShadow(2, 2, '#000000', 2, true, true);
        mainActContainer.add(titleTxt);

        var menuBtn=this.add.image(0, ((sH/100)*90),'_menuBtn').setOrigin(0);
        menuBtn.scaleY=0.8;
        menuBtn.x=(sW/2)-menuBtn.width/2;       
        //-----level event----------------
       // menuBtn.setInteractive({ useHandCursor: true }); 

        menuBtn.on('pointerup', () => {//bottom level menu button event
            ClickSnd.play();
            levelContainer.x=0; 
            this.removeAllLevelEvents(true);     
            mainActContainer.destroy();
        });
        mainActContainer.add(menuBtn);

        //--------------SHAPE GENERATE---------------
        shapeContainer=this.add.container(0, 0);  
        shapeContainer.setSize(720,1280);
        var i=0;       
        
        var intrV=setInterval(() => {       
            appearSnd.play();
            var block=this.add.image(0,0,levelsData[currentLvl-1][0][i+1]).setOrigin(0.5);           
            block.name="block_"+(i+1);           
            block.x=levelsData[currentLvl-1][2][i][0]+block.displayWidth/2;
            block.y=levelsData[currentLvl-1][2][i][1];
            block.setAngle(levelsData[currentLvl-1][1][i][0]);   
            block.scale=0;  
            shapeContainer.add(block);            
           
            var blockTween=this.tweens.add({
                targets: block,
                scale: 1,
                duration: 240,            
                ease: 'sine.out',
                onComplete: function () {                                      
                    blockTween.remove();               
                }
            });

           // block.setInteractive({ useHandCursor: false });            
            block.on('pointerup', () => {
                this.OnClickShapeRotate( block);
            }); 
           

            if((levelsData[currentLvl-1][0][0]-1)==i){
                console.log(i);
                clearInterval(intrV);
                menuBtn.setInteractive({ useHandCursor: true }); 
                this.shapeAllDesableEvents(true);
            }
            i++;
        }, 130); 
        shapeContainer.x=sW/2-shapeContainer.width/2;
        shapeContainer.y=sH/2-shapeContainer.height/2+50;
        mainActContainer.add(shapeContainer);
            
    }

    shapeAllDesableEvents(getBoo=false){
        for(var i=1; i<=levelsData[currentLvl-1][0][0]; i++){            
            if(!getBoo){
                shapeContainer.getByName("block_"+i).disableInteractive();              
            }else{
                shapeContainer.getByName("block_"+i).setInteractive({ useHandCursor: false }); 
            }                
        }
    }

//==================================================================
//--SHAPE EVENT
//==================================================================

    OnClickShapeRotate(evnt){
        if(!isBlockClicked){  
            rotateSnd.play();           
            isBlockClicked=true;
            evnt.disableInteractive();
            //evnt.setAngle(ag+90);
            shapeContainer.sendToBack(evnt);
           
            var ag=evnt.angle;
            var blockTween=this.tweens.add({
                targets: evnt,
                angle: Phaser.Math.RoundTo((evnt.angle+90)),
                duration: 240,            
                ease: 'sine.out',
                onComplete: function () {                                   
                    blockTween.remove();      
                }
            });

            setTimeout(() => { 
                console.log("=============> "+Phaser.Math.RoundTo(evnt.angle));                  
                this.checkShapeAnswer();
            }, "245"); 
            
           
        }
       
    }

//==================================================================
//--CHECK SHAPE ANSWER
//==================================================================
    checkShapeAnswer(){
        var isAllAnsRight=true;
        
        for(var i=0; i<levelsData[currentLvl-1][0][0]; i++){
            if(Phaser.Math.RoundTo(shapeContainer.getByName("block_"+(i+1)).angle)==360){
                shapeContainer.getByName("block_"+(i+1)).setAngle(0);
            }

            if(currentLvl==3){
                if(Phaser.Math.RoundTo(shapeContainer.getByName("block_4").angle)==180||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_4").angle)==0){
                    shapeContainer.getByName("block_4").setAngle(0);
                }
                if(Phaser.Math.RoundTo(shapeContainer.getByName("block_5").angle)==180 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_5").angle)==0){
                    shapeContainer.getByName("block_5").setAngle(0);
                }
            }

            if(currentLvl==4){
                if(Phaser.Math.RoundTo(shapeContainer.getByName("block_7").angle) == 180 || 
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_7").angle) == 0){
                        shapeContainer.getByName("block_7").setAngle(0);
                }

                if(Phaser.Math.RoundTo(shapeContainer.getByName("block_8").angle) == 90 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_8").angle) == 180 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_8").angle) == -90 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_8").angle) == 0){

                        shapeContainer.getByName("block_8").setAngle(0);
                }

                if(Phaser.Math.RoundTo(shapeContainer.getByName("block_9").angle) == 90 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_9").angle) == 180 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_9").angle) == -90 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_9").angle) == 0){
                        shapeContainer.getByName("block_9").setAngle(0);
                }                

                if(Phaser.Math.RoundTo(shapeContainer.getByName("block_10").angle) == 90 || 
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_10").angle) == -90){
                        shapeContainer.getByName("block_10").setAngle(90);
                }
            }

            if(currentLvl==5){                

                if(Phaser.Math.RoundTo(shapeContainer.getByName("block_6").angle) == 90 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_6").angle) == 180 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_6").angle) == -90 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_6").angle) == 0){

                        shapeContainer.getByName("block_6").setAngle(0);
                }

                if(Phaser.Math.RoundTo(shapeContainer.getByName("block_7").angle) == 90 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_7").angle) == 180 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_7").angle) == -90 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_7").angle) == 0){
                        shapeContainer.getByName("block_7").setAngle(0);
                }               

            }

            if(currentLvl==6){                

                if(Phaser.Math.RoundTo(shapeContainer.getByName("block_4").angle) == 90 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_4").angle) == 180 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_4").angle) == -90 ||
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_4").angle) == 0){

                        shapeContainer.getByName("block_4").setAngle(0);
                } 

                if(Phaser.Math.RoundTo(shapeContainer.getByName("block_5").angle) == 90 || 
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_5").angle) == -90){
                        shapeContainer.getByName("block_5").setAngle(90);
                }
                if(Phaser.Math.RoundTo(shapeContainer.getByName("block_12").angle) == 90 || 
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_12").angle) == -90){
                        shapeContainer.getByName("block_12").setAngle(90);
                }
                if(Phaser.Math.RoundTo(shapeContainer.getByName("block_13").angle) == 90 || 
                    Phaser.Math.RoundTo(shapeContainer.getByName("block_13").angle) == -90){
                        shapeContainer.getByName("block_13").setAngle(90);
                }
                
            }
           
            if(levelsData[currentLvl-1][1][i][1]!=Phaser.Math.RoundTo(shapeContainer.getByName("block_"+(i+1)).angle)){
                isAllAnsRight=false;
                break;
            }
        }
      
        if(isAllAnsRight){
            this.shapeAllDesableEvents(false);
            var isAllLevelComp=false;
            if(levelsData.length==currentLvl){//IF ALL LEVELS ARE COMPLETE
                isAllLevelComp=true;
                
            }else{
               
                isAllLevelComp=false;                
            }

            setTimeout(() => { 
                levelCompSnd.play();
                this.allShapesDisappear(isAllLevelComp);                
            }, "350"); 
            
        }else{
            this.shapeAllDesableEvents(true);
        }
    }
//==================================================================
//--DISAPPEAR ALL SHAPE ON COMPLETE LEVEL
//==================================================================
    allShapesDisappear(isLevelComp){
        for(var i=0; i<levelsData[currentLvl-1][0][0]; i++){
           
            var blockTween=this.tweens.add({
                targets: shapeContainer.getByName("block_"+(i+1)),
                scale: 0.01,
                duration: 440,            
                ease: 'sine.out',
                onComplete: function () {                                   
                    blockTween.remove();               
                }
            });
        }

        if(isLevelComp){
            setTimeout(() => {
                localStorage.setItem("roadCLevelComp", true);  
                this.showEndMsg();//show end msg if all level complete
            }, "450");   
        }else{
            setTimeout(() => {        
                var lvlTitleTween=this.tweens.add({
                    targets: mainActContainer.getByName("titleTxt"),
                    x: - ((sW/100)*84),
                    duration: 440,            
                    ease: 'sine.out',
                    onComplete: function () {                                   
                        lvlTitleTween.remove();               
                    }
                });
               
                this.startNextLevel();
            }, "450");   
            
        }
    }

    startNextLevel(){
        setTimeout(() => { //next level auto switch 
            mainActContainer.destroy();               
            currentLvl++;
            if(!localStorage.getItem("roadCLevelComp")){
                localStorage.setItem("roadCLevel", currentLvl);
            }
            levelContainer.x=-((sW/100)*120);  
            this.removeAllLevelEvents();                  
            this.createShapesAndPos();  
        }, "450");   
    }



//==================================================================
//--SHOW ENE MSG
//==================================================================

    showEndMsg(){
        mainActContainer.destroy();

        endMsgContainer=this.add.container(0, 0);  
        endMsgContainer.setSize(sW,sH);

        var msgTxt=this.add.label(0,0,"{gme_cop}").setStyle({fontStyle: 'normal', fontFamily: 'triple2', fontSize:"75px",align: 'center', wordWrap: { width: 360, useAdvancedWrap: true }}).setOrigin(0.5);        
        msgTxt.x=(sW/2);
        msgTxt.y=(sH/2);
        msgTxt.setShadow(2, 2, '#000000', 2, true, true);
        endMsgContainer.add(msgTxt);

        //----level event-----

        var menuBtn=this.add.image(0, ((sH/100)*94),'_menuBtn').setOrigin(0);
        menuBtn.scaleY=0.8;
        menuBtn.x=(sW/2)-menuBtn.width/2;  

        //-----level event----------------
        menuBtn.setInteractive({ useHandCursor: true }); 
        menuBtn.on('pointerup', () => { 
            ClickSnd.play();            
            levelContainer.x=0; 
            this.removeAllLevelEvents(true);
            endMsgContainer.destroy(); 
        });
        endMsgContainer.add(menuBtn);
    }

   

   
   

    update(){
        if(isLevelClicked){
            isLevelClicked=false;    
            this.removeAllLevelEvents();                  
            this.createShapesAndPos();            
        }

        if(isBlockClicked){
            isBlockClicked=false;
            
        }
        
    }


}
