class Secne3DPlayer2D {

    constructor() {
        //初始化引擎
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //显示性能面板
        Laya.Stat.show();
        
        //创建场景
        this.scene = new Laya.Scene3D();
         Laya.stage.addChild(this.scene);
        
        //创建相机
        this.camera = new Laya.Camera(0, 0.1, 100);
        this.scene.addChild(this.camera);
        this.camera.transform.translate(new Laya.Vector3(0, 0.35, 1));
        this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        
        //创建平行光
        var directionLight = new Laya.DirectionLight();
        this.scene.addChild(directionLight);
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.rotate(new Laya.Vector3(-3.14/3, 0,0));

        //初始化变量
        this.scene = null;
        this.camera = null;
        this.layaMonkey3D = null;
        this.layaMonkey2D = null;
        this._position = new Laya.Vector3();
        this._outPos = new Laya.Vector3();
        this.scaleDelta = 0;
        //加载精灵
        Laya.loader.create("../res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, this.onComplete));
    }	
		
	onComplete() {
        //加载三维地面
        var grid = this.scene.addChild(Laya.Loader.getRes("../res/threeDimen/staticModel/grid/plane.lh"));
        //加载二维猴子
        this.layaMonkey2D = Laya.stage.addChild(new Laya.Image("../res/threeDimen/monkey.png"));
        //开启定时器循环
        Laya.timer.frameLoop(1, this, this.animate);
    }
		
	animate() {
        //变换位置
        this._position.x = Math.sin(this.scaleDelta += 0.01);
        //计算位置
        this.camera.viewport.project(this._position, this.camera.projectionViewMatrix, this._outPos);
        this.layaMonkey2D.pos(this._outPos.x / Laya.stage.clientScaleX, this._outPos.y / Laya.stage.clientScaleY);
    }	
	
}

new Secne3DPlayer2D;
