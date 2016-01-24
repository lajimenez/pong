rock.namespace('pong.geometry');

/**
 * Class representing a dynamic BBOX
 *
 * @constructor
 *
 * @author Luis Alberto Jiménez
 */
pong.geometry.DynamicBBOX = function (center, width, height, depth) {
    this.center = center;
    this.width = width;
    this.height = height;
    this.depth = depth;
};

pong.geometry.DynamicBBOX.prototype.getXMin = function () {
    var centerX = this.getCenter().getX();
    return centerX - (this.width / 2);
};

pong.geometry.DynamicBBOX.prototype.getXMax = function () {
    var centerX = this.getCenter().getX();
    return centerX + (this.width / 2);
};

pong.geometry.DynamicBBOX.prototype.getYMin = function () {
    var centerY= this.getCenter().getY();
    return centerY - (this.height / 2);
};

pong.geometry.DynamicBBOX.prototype.getYMax = function () {
    var centerY = this.getCenter().getY();
    return centerY + (this.height / 2);
};

pong.geometry.DynamicBBOX.prototype.getZMin = function () {
    var centerZ = this.getCenter().getZ();
    return centerZ - (this.depth / 2);
};

pong.geometry.DynamicBBOX.prototype.getZMax = function () {
    var centerZ = this.getCenter().getZ();
    return centerZ + (this.depth / 2);
};

pong.geometry.DynamicBBOX.prototype.adjustXMin = function (xMin) {
    var center = this.center;
    var difference = xMin - this.getXMin();

    var newCenterX = center.getX() + difference;
    center.setX(newCenterX);
};

pong.geometry.DynamicBBOX.prototype.adjustXMax = function (xMax) {
    var center = this.center;
    var difference = xMax - this.getXMax();

    var newCenterX = center.getX() + difference;
    center.setX(newCenterX);
};

/**
 * Get the center
 */
pong.geometry.DynamicBBOX.prototype.getCenter = function() {
    return this.center;
};

/**
 * Set the center
 *
 * @param center the value
 */
pong.geometry.DynamicBBOX.prototype.setCenter = function(center) {
    this.center = center;
};

/**
 * Get the width
 */
pong.geometry.DynamicBBOX.prototype.getWidth = function() {
    return this.width;
};

/**
 * Set the width
 *
 * @param width the value
 */
pong.geometry.DynamicBBOX.prototype.setWidth = function(width) {
    this.width = width;
};

/**
 * Get the height
 */
pong.geometry.DynamicBBOX.prototype.getHeight = function() {
    return this.height;
};

/**
 * Set the height
 *
 * @param height the value
 */
pong.geometry.DynamicBBOX.prototype.setHeight = function(height) {
    this.height = height;
};

/**
 * Get the depth
 */
pong.geometry.DynamicBBOX.prototype.getDepth = function() {
    return this.depth;
};

/**
 * Set the depth
 *
 * @param depth the value
 */
pong.geometry.DynamicBBOX.prototype.setDepth = function(depth) {
    this.depth = depth;
};