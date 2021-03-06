class PhysicsWorldBuildingBlocks{
    constructor(){
        this.ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
        this.point = new Laya.Vector2();
        this._outHitResult = new Laya.HitResult();
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        this.camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
        this.camera.transform.translate(new Laya.Vector3(4.5, 6, 4.5));
        this.camera.transform.rotate(new Laya.Vector3(-30, 45, 0), true, false);
        this.camera.clearColor = new Laya.Vector4(0.5, 0.5, 0.5, 1.0);
        var directionLight = this.scene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1, -1, 1));
        var plane = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createPlane(13, 13, 10, 10)));
        var planeMat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
            planeMat.albedoTexture = tex;
        }));
        planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
        plane.meshRenderer.material = planeMat;
        plane.meshRenderer.receiveShadow = true;
        var rigidBody = plane.addComponent(Laya.PhysicsCollider);
        var boxShape = new Laya.BoxColliderShape(13, 0, 13);
        rigidBody.colliderShape = boxShape;
        this.addMouseEvent();
        this.addBox();
    }

    addMouseEvent(){
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onMouseOut);
    }

    addBox(){
                //var i:number = 0;
        for (var i = 0; i < 8; i++) {
            this.addVerticalBox(-0.65, 0.165 + i * 0.33 * 2, 0);
            this.addVerticalBox(0, 0.165 + i * 0.33 * 2, 0);
            this.addVerticalBox(0.65, 0.165 + i * 0.33 * 2, 0);
            this.addHorizontalBox(0, 0.165 + 0.33 + i * 0.33 * 2, -0.65);
            this.addHorizontalBox(0, 0.165 + 0.33 + i * 0.33 * 2, 0);
            this.addHorizontalBox(0, 0.165 + 0.33 + i * 0.33 * 2, 0.65);
        }
    }

    addVerticalBox(x, y, z){
        var mat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function (tex) {
            mat.albedoTexture = tex;
        }));
        var box = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createBox(0.5, 0.33, 2)));
        box.meshRenderer.material = mat;
        box.meshRenderer.castShadow = true;
        box.meshRenderer.receiveShadow = true;
        box.transform.position = new Laya.Vector3(x, y, z);
        var rigidBody = box.addComponent(Laya.Rigidbody3D);
        rigidBody.mass = 10;
        rigidBody.friction = 0.4;
        rigidBody.restitution = 0.2;
        var boxShape = new Laya.BoxColliderShape(0.5, 0.33, 2);
        rigidBody.colliderShape = boxShape;
    }
    addHorizontalBox(x, y, z){
        var mat = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function (tex) {
            mat.albedoTexture = tex;
        }));
        var box = this.scene.addChild(new Laya.MeshSprite3D(new Laya.PrimitiveMesh.createBox(2, 0.33, 0.5)));
        box.meshRenderer.material = mat;
        box.meshRenderer.castShadow = true;
        box.meshRenderer.receiveShadow = true;
        box.transform.position = new Laya.Vector3(x, y, z);
        var rigidBody = box.addComponent(Laya.Rigidbody3D);
        rigidBody.mass = 10;
        rigidBody.friction = 1.0;
        rigidBody.restitution = 0.2;
        var boxShape = new Laya.BoxColliderShape(2, 0.33, 0.5);
        rigidBody.colliderShape = boxShape;
    }

    onMouseDown() {
        this.posX = this.point.x = Laya.MouseManager.instance.mouseX;
        this.posY = this.point.y = Laya.MouseManager.instance.mouseY;
        this.camera.viewportPointToRay(this.point, this.ray);
        this.scene.physicsSimulation.rayCast(this.ray, this._outHitResult);
        if (this._outHitResult.succeeded) {
            var collider = this._outHitResult.collider;
            this.hasSelectedSprite = collider.owner;
            this.hasSelectedRigidBody = collider;
            collider.angularFactor = Laya.Vector3.ZERO;
            collider.angularVelocity = Laya.Vector3.ZERO;
            collider.linearFactor = Laya.Vector3.ZERO;
            collider.linearVelocity = Laya.Vector3.ZERO;
        }
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
    }
    onMouseMove() {
        this.delX = Laya.MouseManager.instance.mouseX - this.posX;
        this.delY = Laya.MouseManager.instance.mouseY - this.posY;
        if (this.hasSelectedSprite) {
            this.hasSelectedRigidBody.linearVelocity = new Laya.Vector3(this.delX / 4, 0, this.delY / 4);
        }
        this.posX = Laya.MouseManager.instance.mouseX;
        this.posY = Laya.MouseManager.instance.mouseY;
    }

    onMouseUp() {
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        if (this.hasSelectedSprite) {
            this.hasSelectedRigidBody.angularFactor = Laya.Vector3.ONE;
            this.hasSelectedRigidBody.linearFactor = Laya.Vector3.ONE;
            this.hasSelectedSprite = null;
        }
    }

    onMouseOut() {
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        if (this.hasSelectedSprite) {
            this.hasSelectedRigidBody.angularFactor = Laya.Vector3.ONE;
            this.hasSelectedRigidBody.linearFactor = Laya.Vector3.ONE;
            this.hasSelectedSprite = null;
        }
    }

}

//激活启动类
new PhysicsWorldBuildingBlocks();
