let ClickSnd;
let rotateSnd;
let appearSnd;
let levelCompSnd;
let isLandScape;
let languagePosition=0;
let allLanguages;
let isLangClicked;
let isShowLangPanel;
let langContainer;
let playTxt;
let sW;
let sH;



class GameConfig extends Phaser.Scene {
    
    
    constructor(){
        super("GameBoot");
    }



    preload(){
        this.load.image('_lvlOvrBtn', 'assets/sprites/ui/red_button08.png');
        this.load.image('_lvlGrayBtn', 'assets/sprites/ui/grey_button12.png');
        this.load.image('_menuBtn', 'assets/sprites/ui/barsHorizontal.png');
        this.load.image('_mask', 'assets/sprites/roads/maskBox.png');
        this.load.image('_langBtn', 'assets/sprites/ui/langBtn.png');
        this.load.image('_backBtn', 'assets/sprites/ui/back.png');

        //---patterns blocks-----
        this.load.image('_I', 'assets/sprites/roads/roadTexture_01_MR180.png');
        this.load.image('_C', 'assets/sprites/roads/roadTexture_02.png');
        this.load.image('_L', 'assets/sprites/roads/roadTexture_06.png');
        this.load.image('_+', 'assets/sprites/roads/roadTexture_10_BN360.png');
        this.load.image('_X', 'assets/sprites/roads/roadTexture_22_BN360.png');
        this.load.image('_T', 'assets/sprites/roads/roadTexture_29.png');
        this.load.image('_U', 'assets/sprites/roads/roadTexture_45.png');

        //--------sounds--------------        
        this.load.audio('background_music', ['assets/audios/bgSnd.wav']);
        this.load.audio('_clickSnd', ['assets/audios/DefaultClick.ogg']);
        this.load.audio('_rotateSnd', ['assets/audios/RotateShape.ogg']);
        this.load.audio('_appeareSnd', ['assets/audios/ShapeAppear.ogg']);
        this.load.audio('_lvlCompleSnd', ['assets/audios/LevelComplete.wav']);
        
        //---lanugages json file loading------------
        this.load.json(config.language, "assets/locale/" + config.language + ".json");
    }


    create(){
      
        //--cavs size-----
        sW=this.cameras.main.width;
        sH=this.cameras.main.height;        

        //--------defoult language select------
        this.translate.setLanguage(config.language);       
        allLanguages = ["en", "pt", "fr"];       

        
       
        //-----local storage for language---------
        if(!window.localStorage.getItem("langId")){           
            localStorage.setItem("langId", 1);
            languagePosition=localStorage.getItem("langId");          
           
        }else{
            languagePosition = localStorage.getItem("langId");         
        }
        console.log(languagePosition);
        this.translate.setLanguage(allLanguages[languagePosition]);        
        console.log(">>>> "+this.translate.getLanguage()); 
        


        //--------all game  sund object initialized------------
        var backgroundMusic = this.sound.add('background_music', { loop: true,volume:0.2 });        
        backgroundMusic.play();
        ClickSnd=this.sound.add('_clickSnd', { loop: false,volume:1});     
        rotateSnd=this.sound.add('_rotateSnd', { loop: false,volume:1});    
        appearSnd=this.sound.add('_appeareSnd', { loop: false,volume:0.6});   
        levelCompSnd=this.sound.add('_lvlCompleSnd', { loop: false,volume:0.8});   


        //---title animation--------------
        var roadTxt=this.add.label(0,0,"{road_title}").setFont("75px nonstop",{align: 'center'}).setOrigin(0.5); 
        //roadTxt.x=360-roadTxt.displayWidth/2;
        roadTxt.x=sW+10;
        roadTxt.y=(sH/100)*20;
        roadTxt.setShadow(2, 2, '#000000', 2, true, true);
       

        var connectTxt=this.add.label(0,0,"{connect_title}").setFont("75px nonstop",{align: 'center'}).setOrigin(0.5); 
        //connectTxt.x=360-connectTxt.displayWidth/2;
        connectTxt.x=-sW+10;
        connectTxt.y=roadTxt.y+roadTxt.displayHeight+20;
        connectTxt.setShadow(2, 2, '#000000', 2, true, true);


        playTxt=this.add.label(0,0,"{play_btn}").setFont("75px triple2",{align: 'center'}).setOrigin(0.5); 
        playTxt.name="playTxtBtn"
        playTxt.x=sW/2;
        playTxt.y=connectTxt.y+((sH/100)*40);
        playTxt.scale=0;
        playTxt.setShadow(2, 2, '#000000', 2, true, true);


        //---play event-----------------------------
        playTxt.setInteractive({ useHandCursor: true }); 
        playTxt.on('pointerup', () => {
            ClickSnd.play();
            this.scene.start("MainGame"); // game scene load from here
        });


        //---tweens-----------------------------
        var roadTween=this.tweens.add({
            targets: roadTxt,
            x: (sW/2),
            duration: 440,            
            ease: 'sine.out',
            onComplete: function () {                 
                roadTween.remove();               
            }
        });

        var connectTween=this.tweens.add({
            targets: connectTxt,
            x: (sW/2),
            duration: 440,            
            ease: 'sine.out',
            onComplete: function () {                 
                connectTween.remove();               
            }
        });

        //----play button tween-----
        setTimeout(() => {                             
        
            var playTween=this.tweens.add({
                targets: playTxt,
                scale: 1,
                duration: 240,            
                ease: 'sine.out',
                onComplete: function () {                 
                    playTween.remove();               
                }
            });
            
        }, "650");      
        
        //-----orientation event check-----
        this.checkOriention(this.scale.orientation);
        this.scale.on('orientationchange', this.checkOriention, this);
         
        
       //--------language top corner button  ----------------
       var langBtn=this.add.image(((sW/100)*2), ((sH/100)*2),'_langBtn').setOrigin(0);
      // langBtn.setSize(150,50);   
       var langBtnTxt=this.add.label(0, 0,"{lang}").setFont("25px triple2",{align: 'center'}).setOrigin(0.5);      
       langBtnTxt.x=langBtn.x+(100);
       langBtnTxt.y=langBtn.y+38   

       //----language top corner button event--------
       langBtn.setInteractive({ useHandCursor: true }); 
       langBtn.on('pointerup', () => {           
           isShowLangPanel=true;
           playTxt.disableInteractive();       
       });  


       //------version number-------
       var vrsionTxt=this.add.label(0,0,"V-1.0").setFont("35px arial",{align: 'left'}).setOrigin(0);        
       vrsionTxt.scale=1.5
       vrsionTxt.x=vrsionTxt.displayWidth/4;
       vrsionTxt.y=sH-vrsionTxt.displayHeight;
       vrsionTxt.setFitWidth(100);
       //vrsionTxt.setShadow(2, 2, '#000000', 2, true, true);
       
        //-----triger language panel fuction---------------
       this.createLanguagePanel(); 
    }   

//===========================================================
    //---create language menu panel------------------
//==========================================================

    createLanguagePanel(){
        var langArr=["English","Portuguese","French"];
        langContainer=this.add.container(0, 0);  
        langContainer.setSize(sW,sH);        
        
        var rect = this.add.rectangle(0, 0, sW, sH, 0x000000, 0.8).setOrigin(0);
        rect.name="bgLanguage"
        langContainer.add(rect); 
        
        var langHolderG = this.add.graphics();
        langHolderG.fillStyle(0x23BF8E, 1);
        langHolderG.fillRoundedRect(0, 0, ((sW/100)*65), ((sH/100)*40), 32);
        langHolderG.x=sW/6;
        langHolderG.y=sH/4;       
        langContainer.add(langHolderG);

        var menuTxt=this.add.label(0,0,"{menu}").setFont("45px triple2",{align: 'center'}).setOrigin(0.5); 
        menuTxt.x=sW/2;
        menuTxt.y=langHolderG.y-80;
        //titleTxt.setFitWidth(720);
        langContainer.add(menuTxt);

        //----language menu-----
        var xp=langHolderG.x+((sW/100)*2.5); 
        var yp=langHolderG.y+20;

        for(var i=1; i<=3; i++){
           
            var brect = this.add.rectangle(0,0, ((sW/100)*60), ((sH/100)*8), 0x000000, 0.4).setOrigin(0);
            brect.name="langBtnBg_"+i;
            brect.x=xp;
            brect.y=yp;            
            yp+=brect.height+10;
            var opnTxt = this.add.label(0, 0, langArr[i-1]).setFont("35px triple2",{align: 'center'}).setOrigin(0);       
            opnTxt.x=(brect.width/2-opnTxt.width/2)+brect.x;
            opnTxt.y=(brect.height/2-opnTxt.height/2)+brect.y; 

            brect.setInteractive({ useHandCursor: true });
            this.input.on('gameobjectup', this.OnSelectLanguage, brect); 
            
            langContainer.add([brect,opnTxt]);
        }  

         //---background click to no selection lang----
                
         var backImg=this.add.image(0, 0,'_backBtn').setOrigin(0);
         backImg.displayWidth=((sW/100)*8);
         backImg.displayHeight=((sW/100)*8);
         backImg.x=sW/2-backImg.displayWidth/2
         backImg.setTint(0xFFFF00);
         backImg.y=langHolderG.y+((sH/100)*42)                  
         langContainer.add([backImg]);          

        backImg.setInteractive({ useHandCursor: false }); 
        backImg.on('pointerup', () => {        
            isLangClicked=true; 
        }); 
 
        
        langContainer.x=sW+100;

       
        this.desableLangMenuBtns(); 
    }


   
//===========================================================
    //---event off language menu panel------------------
//==========================================================
    desableLangMenuBtns(getBoo=false){
        for(var i=1; i<=3; i++){            
            if(!getBoo){
                this.input.off('gameobjectup', this.OnSelectLanguage, langContainer.getByName("langBtnBg_"+i)); 
            }else{
                this.input.on('gameobjectup', this.OnSelectLanguage, langContainer.getByName("langBtnBg_"+i)); 
            }
            langContainer.getByName("langBtnBg_"+i).fillColor ='0x000000';            
        }    
        
            
        if(getBoo){
            var getId=parseInt(languagePosition)+1;  
            langContainer.getByName("langBtnBg_"+getId).fillColor = 0x0000FF;  
        }
        
    }
//===========================================================
    //---language panell menu event------------------
//==========================================================
    OnSelectLanguage(pointer,getbtn){
        if(!isLangClicked){
            var getId=getbtn.name.split("_")[1]-1;            
            getbtn.fillColor = '0X0000FF';          
           
            languagePosition = getId;            
            localStorage.setItem("langId", getId);                  
            isLangClicked=true;           
        }       
    }

//===========================================================
    //---orientation checking------------------
//==========================================================
    checkOriention (orientation)
    {
        if (orientation === Phaser.Scale.PORTRAIT)
        {
            console.log("pro"+orientation);
            isLandScape=false;
        }
        else if (orientation === Phaser.Scale.LANDSCAPE)
        {
            console.log("land>>"+orientation);
            isLandScape=true;
        }
    }


    update(){
        if(isLangClicked){
            isLangClicked=false; 
            this.desableLangMenuBtns(); 
            this.translate.setLanguage(allLanguages[languagePosition]);
            console.log(this.translate.getLanguage());           
            langContainer.x=sW+100;   
            playTxt.setInteractive({ useHandCursor: true });                           
        } 

        
        if( isShowLangPanel){
            isShowLangPanel=false;          
            this.desableLangMenuBtns(true); 
            langContainer.x=0;
        }
    }
    
   
}






const ratio = window.innerWidth < 1280 ? 2 : 1;
const config = {
    language: "en",
    type: Phaser.WEBGL,    
    
    scale: {
        mode: Phaser.Scale.ScaleModes.FIT,
        parent: 'phaser-example',
        zoom: 1,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        /* width: 720,
        height: 1280 */
        width: window.innerWidth * ratio,
        height: window.innerHeight * ratio,
       
    },      
    backgroundColor: 0x23BF8E,
    scene: [GameConfig,MainGame],
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x:0, y: 0 }
        }
    },
    autoRound: true,

    plugins: {
        global: [{
            key: "LabelTranslatePlugin",
            plugin: LabelTranslatePlugin,
            start: true,
            mapping: "translate",
            data: {
                path: "assets/locale/"
            }
        }]
    }
    
};


const game = new Phaser.Game(config);