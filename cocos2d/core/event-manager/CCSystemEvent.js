/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var JS = cc.js;

var Event = cc.Event;

/**
 * !#en The type code of Touch event.
 * !#zh 触摸事件类型
 * @constant
 * @type {String}
 */
cc.Event.TOUCH = 'touch';
/**
 * !#en The type code of Mouse event.
 * !#zh 鼠标事件类型
 * @constant
 * @type {String}
 */
cc.Event.MOUSE = 'mouse';
/**
 * !#en The type code of Keyboard event.
 * !#zh 键盘事件类型
 * @constant
 * @memberof cc.Event
 * @type {String}
 */
cc.Event.KEYBOARD = 'keyboard';
/**
 * !#en The type code of Acceleration event.
 * !#zh 加速器事件类型
 * @constant
 * @memberof cc.Event
 * @type {String}
 */
cc.Event.ACCELERATION = 'acceleration';

/**
 * !#en The mouse event
 * !#zh 鼠标事件类型
 * @class Event.EventMouse
 * @constructor
 * @extends Event
 * @param {Number} eventType - The mouse event type, UP, DOWN, MOVE, CANCELED
 * @param {Boolean} [bubbles=false] - A boolean indicating whether the event bubbles up through the tree or not
 */
var EventMouse = function (eventType, bubbles) {
    cc.Event.call(this, cc.Event.MOUSE, bubbles);
    this._eventType = eventType;
    this._button = 0;
    this._x = 0;
    this._y = 0;
    this._prevX = 0;
    this._prevY = 0;
    this._scrollX = 0;
    this._scrollY = 0;
};

JS.extend(EventMouse, cc.Event);
JS.mixin(EventMouse.prototype, {
    /**
     * !#en Sets scroll data.
     * !#zh 设置鼠标的滚动数据。
     * @method setScrollData
     * @param {Number} scrollX
     * @param {Number} scrollY
     */
    setScrollData: function (scrollX, scrollY) {
        this._scrollX = scrollX;
        this._scrollY = scrollY;
    },

    /**
     * !#en Returns the x axis scroll value.
     * !#zh 获取鼠标滚动的X轴距离，只有滚动时才有效。
     * @method getScrollX
     * @returns {Number}
     */
    getScrollX: function () {
        return this._scrollX;
    },

    /**
     * !#en Returns the y axis scroll value.
     * !#zh 获取滚轮滚动的 Y 轴距离，只有滚动时才有效。
     * @method getScrollY
     * @returns {Number}
     */
    getScrollY: function () {
        return this._scrollY;
    },

    /**
     * !#en Sets cursor location.
     * !#zh 设置当前鼠标位置。
     * @method setLocation
     * @param {Number} x
     * @param {Number} y
     */
    setLocation: function (x, y) {
        this._x = x;
        this._y = y;
    },

    /**
     * !#en Returns cursor location.
     * !#zh 获取鼠标位置对象，对象包含 x 和 y 属性。
     * @method getLocation
     * @return {Vec2} location
     */
    getLocation: function () {
        return {x: this._x, y: this._y};
    },

    /**
     * !#en Returns the current cursor location in screen coordinates.
     * !#zh 获取当前事件在游戏窗口内的坐标位置对象，对象包含 x 和 y 属性。
     * @method getLocationInView
     * @return {Vec2}
     */
    getLocationInView: function() {
        return {x: this._x, y: cc.view._designResolutionSize.height - this._y};
    },

    _setPrevCursor: function (x, y) {
        this._prevX = x;
        this._prevY = y;
    },

    /**
     * !#en Returns the previous touch location.
     * !#zh 获取鼠标点击在上一次事件时的位置对象，对象包含 x 和 y 属性。
     * @method getPreviousLocation
     * @return {Vec2}
     */
    getPreviousLocation:function () {
        return {x: this._prevX, y: this._prevY};
    },

    /**
     * !#en Returns the delta distance from the previous location to current location.
     * !#zh 获取鼠标距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
     * @method getDelta
     * @return {Vec2}
     */
    getDelta: function () {
        return {x: this._x - this._prevX, y: this._y - this._prevY};
    },

    /**
     * !#en Returns the X axis delta distance from the previous location to current location.
     * !#zh 获取鼠标距离上一次事件移动的 X 轴距离。
     * @method getDeltaX
     * @return {Number}
     */
    getDeltaX: function () {
        return this._x - this._prevX;
    },

    /**
     * !#en Returns the Y axis delta distance from the previous location to current location.
     * !#zh 获取鼠标距离上一次事件移动的 Y 轴距离。
     * @method getDeltaY
     * @return {Number}
     */
    getDeltaY: function () {
        return this._y - this._prevY;
    },

    /**
     * !#en Sets mouse button.
     * !#zh 设置鼠标按键。
     * @method setButton
     * @param {Number} button
     */
    setButton: function (button) {
        this._button = button;
    },

    /**
     * !#en Returns mouse button.
     * !#zh 获取鼠标按键。
     * @method getButton
     * @returns {Number}
     */
    getButton: function () {
        return this._button;
    },

    /**
     * !#en Returns location X axis data.
     * !#zh 获取鼠标当前位置 X 轴。
     * @method getLocationX
     * @returns {Number}
     */
    getLocationX: function () {
        return this._x;
    },

    /**
     * !#en Returns location Y axis data.
     * !#zh 获取鼠标当前位置 Y 轴。
     * @method getLocationY
     * @returns {Number}
     */
    getLocationY: function () {
        return this._y;
    }
});

//Inner event types of MouseEvent
/**
 * !#en The none event code of mouse event.
 * !#zh 无。
 * @constant
 * @type {Number}
 */
EventMouse.NONE = 0;
/**
 * !#en The event type code of mouse down event.
 * !#zh 鼠标按下事件。
 * @constant
 * @type {Number}
 */
EventMouse.DOWN = 1;
/**
 * !#en The event type code of mouse up event.
 * !#zh 鼠标按下后释放事件。
 * @constant
 * @type {Number}
 */
EventMouse.UP = 2;
/**
 * !#en The event type code of mouse move event.
 * !#zh 鼠标移动事件。
 * @constant
 * @type {Number}
 */
EventMouse.MOVE = 3;
/**
 * !#en The event type code of mouse scroll event.
 * !#zh 鼠标滚轮事件。
 * @constant
 * @type {Number}
 */
EventMouse.SCROLL = 4;

/**
 * !#en The tag of Mouse left button.
 * !#zh 鼠标左键的标签。
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_LEFT = 0;

/**
 * !#en The tag of Mouse right button  (The right button number is 2 on browser).
 * !#zh 鼠标右键的标签。
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_RIGHT = 2;

/**
 * !#en The tag of Mouse middle button  (The right button number is 1 on browser).
 * !#zh 鼠标中键的标签。
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_MIDDLE = 1;

/**
 * !#en The tag of Mouse button 4.
 * !#zh 鼠标按键 4 的标签。
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_4 = 3;

/**
 * !#en The tag of Mouse button 5.
 * !#zh 鼠标按键 5 的标签。
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_5 = 4;

/**
 * !#en The tag of Mouse button 6.
 * !#zh 鼠标按键 6 的标签。
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_6 = 5;

/**
 * !#en The tag of Mouse button 7.
 * !#zh 鼠标按键 7 的标签。
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_7 = 6;

/**
 * !#en The tag of Mouse button 8.
 * !#zh 鼠标按键 8 的标签。
 * @constant
 * @type {Number}
 */
EventMouse.BUTTON_8 = 7;

/**
 * !#en The touch event
 * !#zh 触摸事件
 * @class Event.EventTouch
 * @constructor
 * @extends Event
 * @param {Array} touchArr - The array of the touches
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */
var EventTouch = function (touchArr, bubbles) {
    cc.Event.call(this, cc.Event.TOUCH, bubbles);
    this._eventCode = 0;
    this._touches = touchArr || [];
    this.currentTouch = null;
};

JS.extend(EventTouch, cc.Event);
JS.mixin(EventTouch.prototype, {
    /**
     * !#en Returns event code.
     * !#zh 获取事件类型。
     * @method getEventCode
     * @returns {Number}
     */
    getEventCode: function () {
        return this._eventCode;
    },

    /**
     * !#en Returns touches of event.
     * !#zh 获取触摸点的列表。
     * @method getTouches
     * @returns {Array}
     */
    getTouches: function () {
        return this._touches;
    },

    _setEventCode: function (eventCode) {
        this._eventCode = eventCode;
    },

    _setTouches: function (touches) {
        this._touches = touches;
    },

    /**
     * !#en Sets touch location.
     * !#zh 设置当前触点位置
     * @method setLocation
     * @param {Number} x
     * @param {Number} y
     */
    setLocation: function (x, y) {
        this.touch && this.touch.setTouchInfo(this.touch.getID(), x, y);
    },

    /**
     * !#en Returns touch location.
     * !#zh 获取触点位置。
     * @method getLocation
     * @return {Vec2} location
     */
    getLocation: function () {
        return this.touch ? this.touch.getLocation() : cc.v2();
    },

    /**
     * !#en Returns the current touch location in screen coordinates.
     * !#zh 获取当前触点在游戏窗口中的位置。
     * @method getLocationInView
     * @return {Vec2}
     */
    getLocationInView: function() {
        return this.touch ? this.touch.getLocationInView() : cc.v2();
    },

    /**
     * !#en Returns the previous touch location.
     * !#zh 获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性。
     * @method getPreviousLocation
     * @return {Vec2}
     */
    getPreviousLocation:function () {
        return this.touch ? this.touch.getPreviousLocation() : cc.v2();
    },

    /**
     * !#en Returns the start touch location.
     * !#zh 获获取触点落下时的位置对象，对象包含 x 和 y 属性。
     * @method getStartLocation
     * @returns {Vec2}
     */
    getStartLocation: function() {
        return this.touch ? this.touch.getStartLocation() : cc.v2();
    },

    /**
     * !#en Returns the id of cc.Touch.
     * !#zh 触点的标识 ID，可以用来在多点触摸中跟踪触点。
     * @method getID
     * @return {Number}
     */
    getID:function () {
        return this.touch ? this.getID() : null;
    },

    /**
     * !#en Returns the delta distance from the previous location to current location.
     * !#zh 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
     * @method getDelta
     * @return {Vec2}
     */
    getDelta: function () {
        return this.touch ? this.touch.getDelta() : cc.v2();
    },

    /**
     * !#en Returns the X axis delta distance from the previous location to current location.
     * !#zh 获取触点距离上一次事件移动的 x 轴距离。
     * @method getDeltaX
     * @return {Number}
     */
    getDeltaX: function () {
        return this.touch ? this.touch.getDelta().x : 0;
    },

    /**
     * !#en Returns the Y axis delta distance from the previous location to current location.
     * !#zh 获取触点距离上一次事件移动的 y 轴距离。
     * @method getDeltaY
     * @return {Number}
     */
    getDeltaY: function () {
        return this.touch ? this.touch.getDelta().y : 0;
    },

    /**
     * !#en Returns location X axis data.
     * !#zh 获取当前触点 X 轴位置。
     * @method getLocationX
     * @returns {Number}
     */
    getLocationX: function () {
        return this.touch ? this.touch.getLocationX() : 0;
    },

    /**
     * !#en Returns location Y axis data.
     * !#zh 获取当前触点 Y 轴位置。
     * @method getLocationY
     * @returns {Number}
     */
    getLocationY: function () {
        return this.touch ? this.touch.getLocationY() : 0;
    }
});

/**
 * !#en The maximum touch numbers
 * !#zh 最大触摸数量。
 * @constant
 * @type {Number}
 */
EventTouch.MAX_TOUCHES = 5;

/**
 * !#en The event type code of touch began event.
 * !#zh 开始触摸事件
 * @constant
 * @type {Number}
 */
EventTouch.BEGAN = 0;
/**
 * !#en The event type code of touch moved event.
 * !#zh 触摸后移动事件
 * @constant
 * @type {Number}
 */
EventTouch.MOVED = 1;
/**
 * !#en The event type code of touch ended event.
 * !#zh 结束触摸事件
 * @constant
 * @type {Number}
 */
EventTouch.ENDED = 2;
/**
 * !#en The event type code of touch cancelled event.
 * !#zh 取消触摸事件
 * @constant
 * @type {Number}
 */
EventTouch.CANCELED = 3;

/**
 * !#en The acceleration event
 * !#zh 加速度事件
 * @class Event.EventAcceleration
 * @extends Event
 * @constructor
 * @param {Object} acc - The acceleration
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */
EventAcceleration = function (acc, bubbles) {
    cc.Event.call(this, Event.ACCELERATION, bubbles);
    this._acc = acc;
};
JS.extend(EventAcceleration, cc.Event);

/**
 * !#en The keyboard event
 * !#zh 键盘事件
 * @class Event.EventKeyboard
 * @extends Event
 * @constructor
 * @param {Number} keyCode - The key code of which triggered this event
 * @param {Boolean} isPressed - A boolean indicating whether the key have been pressed
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */
EventKeyboard = function (keyCode, isPressed, bubbles) {
    cc.Event.call(this, Event.KEYBOARD, bubbles);
    this._keyCode = keyCode;
    this._isPressed = isPressed;
};
JS.extend(EventKeyboard, cc.Event);

cc.Event.EventMouse = EventMouse;
cc.Event.EventTouch = EventTouch;
cc.Event.EventAcceleration = EventAcceleration;
cc.Event.EventKeyboard = EventKeyboard;

module.exports = Event;