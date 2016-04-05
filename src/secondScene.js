var SecondLayer = cc.Layer.extend({
     
    ctor: function() {
        this._super();
        var size = cc.winSize;
        var scene = ccs.load(res.SecondScene_json);
        this.addChild(scene.node);
        cc.eventManager.addListener(backListener.clone(), this);
        return true;
    } 
});

var SecondScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new SecondLayer();
        this.addChild(layer);
    },
    onExit: function() {
        this._super();
    }
});

var backListener = cc.EventListener.create({
    event: cc.EventListener.KEYBOARD,
    onKeyPressed: function(keyCode, event) {
    	if(keyCode == cc.KEY.escape || keyCode == 6){


    		//cc.director.popScene();
            cc.director.runScene(new AppScene());
    	}
 		 
    }
});
