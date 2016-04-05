var tags = [
    { id: 58, name: "nav1", left: -1, down: 59, right: 24, up: -1, scope: "nav" },
    { id: 59, name: "nav2", left: -1, down: 60, right: 24, up: 58, scope: "nav" },
    { id: 60, name: "nav3", left: -1, down: 61, right: 24, up: 59, scope: "nav" },
    { id: 61, name: "nav4", left: -1, down: -1, right: 24, up: 60, scope: "nav" },

    { id: 24, name: "menu1", left: 58, down: 26, right: 34, up: -1, scope: "menu" },
    { id: 26, name: "menu2", left: 58, down: 51, right: 34, up: 24, scope: "menu" },
    { id: 34, name: "menu3", left: 24, down: 51, right: 37, up: -1, scope: "menu" },
    { id: 37, name: "menu4", left: 34, down: 51, right: 40, up: -1, scope: "menu" },
    { id: 40, name: "menu5", left: 37, down: 51, right: 44, up: -1, scope: "menu" },
    { id: 44, name: "menu6", left: 40, down: 51, right: 0, up: -1, scope: "menu" },

    { id: 51, name: "mv1", left: 58, down: -1, right: 53, up: 26, scope: "mv" },
    { id: 53, name: "mv2", left: 51, down: -1, right: 54, up: 26, scope: "mv" },
    { id: 54, name: "mv3", left: 53, down: -1, right: 55, up: 26, scope: "mv" },
    { id: 55, name: "mv4", left: 54, down: -1, right: 0, up: 26, scope: "mv" }
];

var increaseDelta = 20;
var actionDelta = 160;
var actionDeltaFixed = false;
var focusRect = {width: 271, height: 80};

var baseRect = {width: 428, height: 235};
var actionTime = 0.3;

var testSprite = null;

var AppLayer = cc.Layer.extend({
    sprite: null,
    _focusEvent: null,
    _customEvent: null,
    selectSprite: null,
    mainNode: null,
    pageview: null,
    isActionRunning: false,
    currentFocusedWidget:null,
    ctor: function() {
        this._super();
        var size = cc.winSize;
         
        var mainscene = ccs.load(res.MainScene_json);
        this.mainNode = mainscene.node;
        this.addChild(this.mainNode);
        
        this.pageview = this.mainNode.children[2];
        this.pageview.addEventListener(function(sender, type) {
             
            switch (type) {
                case ccui.PageView.EVENT_TURNING:
                    
                    break;
                default:
                    break;
            }
        });

        this.selectSprite = this.mainNode.children[3];

        this.selectSprite.setScale9Enabled(true);
        testSprite = this.selectSprite;
        var childrens = this.mainNode.getChildren();
        var leftLayout = childrens[1];
         
        cc.eventManager.addListener(keyEventListener.clone(), this);
        
        this._customEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "dispatchPadEvent",
            callback: this.dispatchEventCallback.bind(this)
        });
        
        cc.eventManager.addListener(this._customEvent, 1);
        this.currentFocusedWidget = leftLayout.getChildren()[1];
        return true;
    },

    onFocusChanged: function(widgetLostFocus, widgetGetFocus, keyCode) {
        if (widgetGetFocus) {
            if (true) {
                
                var p = widgetGetFocus.parent.convertToWorldSpace(widgetGetFocus);
                if (this.actionDeltaFixed) {
                    p.x = p.x - actionDelta;
                    this.actionDeltaFixed = false;
                }

                this.currentFocusedWidget = widgetGetFocus;

                if(this.selectSprite.getNumberOfRunningActions() > 0){
                    this.selectSprite.stopAllActions();
                }

              
                var moveTo = new cc.MoveTo(actionTime, p);

                var func = cc.callFunc(this.actionDone.bind(this), this);
                var seq = new cc.Sequence(moveTo, func);
                this.selectSprite.runAction(seq);


                //add action to focuswidget
                // var a = new cc.FlipX3D(0.3);
                // var delay = cc.delayTime(2);
                // var r = a.reverse();
                // var seq2 = new cc.Sequence(a, a.reverse());
                 
                var rotate1 = cc.rotateBy(0.5, 360);
                //var rotate_back = rotate1.reverse();
                var rotate_seq = cc.sequence(cc.delayTime(0.1),rotate1);
                var rotate_1 = rotate_seq.repeat(1);

                widgetGetFocus.runAction(rotate_1);



                var scaleX = widgetGetFocus.getScaleX();
                var scaleY = widgetGetFocus.getScaleY();
                
                if(widgetGetFocus.width < focusRect.width){
                    var deltaX = focusRect.width - widgetGetFocus.width;
                    this.selectSprite.attr({
                        width: baseRect.width - deltaX*2
                        
                    });
                } else {
                    var deltaX = widgetGetFocus.width -focusRect.width;
                    this.selectSprite.attr({
                        width: baseRect.width + deltaX*2
                    });
                }
                if(widgetGetFocus.height < focusRect.height){
                    var deltaY = focusRect.height - widgetGetFocus.height;
                    this.selectSprite.attr({
                        height: baseRect.height - deltaY*2
                    });
                } else {
                    var deltaY = widgetGetFocus.height - focusRect.height;
                    this.selectSprite.attr({
                        height: baseRect.height + deltaY*2
                    });
                }
            }

        }

        if (widgetLostFocus) {
            if (widgetLostFocus.getTag() == 40) {
                //widgetLostFocus.x = widgetLostFocus.x + increaseDelta / 2;
                //widgetLostFocus.y = widgetLostFocus.y + increaseDelta / 2;
                //widgetLostFocus.width = widgetLostFocus.width - increaseDelta;
                //widgetLostFocus.height = widgetLostFocus.height - increaseDelta;
            }
        }
    },

    dispatchEventCallback: function(event) {
        var keyCode = event.getUserData();
        var current = this.currentFocusedWidget;//this.firstDefaultFocusWidget;//ccui.Widget.getCurrentFocusedWidget();
        var tagId = current.getTag();
        var currentTags = tags.filter(function(t) {
            return t.id === tagId;
        });


        var currentTag = currentTags[0];
        if (keyCode == cc.KEY.up || keyCode == 1003) { //up

            if (currentTag.up > 0) {

                var nextId = currentTag.up;
                var next = ccui.helper.seekWidgetByTag(this.mainNode, nextId);
               
                this.onFocusChanged.call(this, current, next, keyCode);
            }

        } else if (keyCode == cc.KEY.down || keyCode == 1004) { //down

            if (currentTag.down > 0) {
                var nextId = currentTag.down;
                var next = ccui.helper.seekWidgetByTag(this.mainNode, nextId);
                var nextTag = tags.filter(function(t) {
                    return t.id === currentTag.down;
                });

                if (currentTag.scope === "menu" && nextTag[0].scope === "mv") {
                    //this.actionDeltaFixed = false;
                }

                

                this.onFocusChanged.call(this, current, next, keyCode);
            }

        } else if (keyCode == cc.KEY.left || keyCode == 1000) { //left

            if (currentTag.left > 0) {

                var nextTag = tags.filter(function(t) {
                    return t.id === currentTag.left;
                });
                var nextId = currentTag.left;
                var next = ccui.helper.seekWidgetByTag(this.mainNode, nextId);

                if (nextTag[0].scope === "nav") {

                    this.updateTextVisible(next.parent, true);
                    var moveBy = new cc.MoveBy(0.3, cc.p(actionDelta, 0));
                    this.pageview.runAction(moveBy);
                }
                this.onFocusChanged.call(this, current, next, keyCode);
            }

        } else if (keyCode == cc.KEY.right || keyCode == 1001) { //right

            if (currentTag.right > 0) {

                var nextTag = tags.filter(function(t) {
                    return t.id === currentTag.right;
                });

                if (currentTag.scope === "nav" && nextTag[0].scope === "menu") {
                    this.updateTextVisible(current.parent, false);
                    var moveBy = new cc.MoveBy(0.3, cc.p(-actionDelta, 0));
                    this.pageview.runAction(moveBy);
                    this.actionDeltaFixed = true;
                }
                
                var nextId = currentTag.right;
                var next = ccui.helper.seekWidgetByTag(this.mainNode, nextId);
                
                this.onFocusChanged.call(this, current, next, keyCode);

            } else if (currentTag.right === 0) {
                if (this.pageview.getCurPageIndex() + 1 <= this.pageview.getPages().length) {
                    //this.pageview.scrollToPage(this.pageview.getCurPageIndex() + 1);
                }
            }

        } else if (keyCode == cc.KEY.enter|| keyCode == 1005) {  //enter
            var random = Math.floor(Math.random()*21);
            //var random = 1;
            
            var transitionTime = 1;
            var scene = new SecondScene();
            var transitionScene;

            //transitionScene = new cc.TransitionCrossFade(transitionTime,scene);
            switch (random) {
                case 0:
                    transitionScene = new cc.TransitionProgressInOut(transitionTime, scene);
                    break;
                case 1:
                    transitionScene = new cc.TransitionCrossFade(transitionTime, scene);
                    break;
                case 2:
                    transitionScene = new cc.TransitionFade(transitionTime, scene);
                    break;
                case 3:
                    transitionScene = new cc.TransitionFadeBL(transitionTime, scene);
                    break;
                case 4:
                    transitionScene = new cc.TransitionFadeDown(transitionTime, scene);
                    break;
                case 5:
                    transitionScene = new cc.TransitionFadeTR(transitionTime, scene);
                    break;
                case 6:
                    transitionScene = new cc.TransitionFadeUp(transitionTime, scene);
                    break;
                case 7:
                    transitionScene = new cc.TransitionFlipAngular(transitionTime, scene);
                    break;
                case 8:
                    transitionScene = new cc.TransitionFlipX(transitionTime, scene);
                    break;
                case 9:
                case 10:
                    transitionScene = new cc.TransitionJumpZoom(transitionTime, scene);
                    break;
                case 11:
                    transitionScene = new cc.TransitionMoveInB(transitionTime, scene);
                    break;
                case 12:
                    transitionScene = new cc.TransitionMoveInL(transitionTime, scene);
                    break;
                case 13:
                    transitionScene = new cc.TransitionMoveInT(transitionTime, scene);
                    break;
                case 14:
                    transitionScene = new cc.TransitionRadialCCW(transitionTime, scene);
                    break;
                case 15:
                    transitionScene = new cc.TransitionRotoZoom(transitionTime, scene);
                    break;
                case 16:
                    transitionScene = new cc.TransitionShrinkGrow(transitionTime, scene);
                    break;
                case 17:
                    transitionScene = new cc.TransitionSlideInB(transitionTime, scene);
                    break;
                case 18:
                case 19:
                    transitionScene = new cc.TransitionSplitRows(transitionTime, scene);
                    break;
                case 20:
                    transitionScene = new cc.TransitionTurnOffTiles(transitionTime, scene);
                    break;
                 
            }
            //cc.director.pushScene(transitionScene);
            cc.director.runScene(transitionScene);
        } else {
            return true;
        }

    },

    actionDone: function() {
        //this.isActionRunning = false;
      
        // var current = this.currentFocusedWidget;//ccui.Widget.getCurrentFocusedWidget();
        // if (current.getTag() == 40) {
            //current.x = current.x - increaseDelta / 2;
            //current.y = current.y - increaseDelta / 2;
            //current.width = current.width + increaseDelta;
            //current.height = current.height + increaseDelta;
        //}
    },

    updateTextVisible: function(rootPanel, visible) {
        if (rootPanel.children.length > 0) {
            rootPanel.children.forEach(function(panel) {
                if (panel.children.length > 0) {
                    panel.children.forEach(function(p) {
                        if (p instanceof ccui.Text) {
                            p.setVisible(visible);
                        }
                    });
                }

            });
        }
    }
});

var AppScene = cc.Scene.extend({
    appLayer: null,
    onEnter: function() {
        this._super();
        this.appLayer = new AppLayer();
        this.addChild(this.appLayer);
        
    } 
});


var keyEventListener = cc.EventListener.create({
    event: cc.EventListener.KEYBOARD,
    onKeyPressed: function(keyCode, event) {
        
        if(keyCode == cc.KEY.escape || keyCode == 6){
            cc.director.end();
            return;
        }
        var ev = new cc.EventCustom("dispatchPadEvent");
        ev.setUserData(keyCode);
        cc.eventManager.dispatchEvent(ev);
    },
    onKeyReleased: function(keyCode, event){

    }
});
