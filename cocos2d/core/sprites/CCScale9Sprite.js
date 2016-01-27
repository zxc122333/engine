/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2012 Neofect. All rights reserved.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 Created by Jung Sang-Taik on 2012-03-16
 ****************************************************************************/

EventTarget = require("../cocos2d/core/event/event-target");

/**
 * <p>
 * A 9-slice sprite for cocos2d UI.                                                                    <br/>
 *                                                                                                     <br/>
 * 9-slice scaling allows you to specify how scaling is applied                                        <br/>
 * to specific areas of a sprite. With 9-slice scaling (3x3 grid),                                     <br/>
 * you can ensure that the sprite does not become distorted when                                       <br/>
 * scaled.                                                                                             <br/>
 * @note: it will refactor in v3.1                                                                    <br/>
 * @see http://yannickloriot.com/library/ios/cccontrolextension/Classes/CCScale9Sprite.html            <br/>
 * </p>
 * @class
 * @extends _ccsg.Node
 *
 * @property {cc.Size}  preferredSize   - The preferred size of the 9-slice sprite
 * @property {cc.Rect}  capInsets       - The cap insets of the 9-slice sprite
 * @property {Number}   insetLeft       - The left inset of the 9-slice sprite
 * @property {Number}   insetTop        - The top inset of the 9-slice sprite
 * @property {Number}   insetRight      - The right inset of the 9-slice sprite
 * @property {Number}   insetBottom     - The bottom inset of the 9-slice sprite
 */
var simpleQuadGenerator = {
    _rebuildQuads_base: function (spriteFrame, contentSize, colorOpacity, isTrimmedContentSize) {
        var quads = [];
        //build vertices
        var vertices = this._calculateVertices(spriteFrame, contentSize, isTrimmedContentSize);

        //build uvs
        var uvs = this._calculateUVs(spriteFrame);

        //build quads
        var quad;
        quad = new cc.V3F_C4B_T2F_Quad();

        quad._bl.colors = colorOpacity;
        quad._br.colors = colorOpacity;
        quad._tl.colors = colorOpacity;
        quad._tr.colors = colorOpacity;

        quad._bl.vertices = new cc.Vertex3F(vertices[0].x, vertices[0].y, 0);
        quad._br.vertices = new cc.Vertex3F(vertices[1].x, vertices[0].y, 0);
        quad._tl.vertices = new cc.Vertex3F(vertices[0].x, vertices[1].y, 0);
        quad._tr.vertices = new cc.Vertex3F(vertices[1].x, vertices[1].y, 0);

        if (!spriteFrame._rotated) {
            quad._bl.texCoords = new cc.Tex2F(uvs[0].x, uvs[0].y);
            quad._br.texCoords = new cc.Tex2F(uvs[1].x, uvs[0].y);
            quad._tl.texCoords = new cc.Tex2F(uvs[0].x, uvs[1].y);
            quad._tr.texCoords = new cc.Tex2F(uvs[1].x, uvs[1].y);
        } else {
            quad._bl.texCoords = new cc.Tex2F(uvs[0].x, uvs[1].y);
            quad._br.texCoords = new cc.Tex2F(uvs[0].x, uvs[0].y);
            quad._tl.texCoords = new cc.Tex2F(uvs[1].x, uvs[1].y);
            quad._tr.texCoords = new cc.Tex2F(uvs[1].x, uvs[0].y);
        }
        quads.push(quad);
        return quads;
    },

    _calculateVertices: function (spriteFrame, contentSize, isTrimmedContentSize) {
        var x0, x3;
        var y0, y3;
        if (isTrimmedContentSize) {
            x0 = 0;
            x3 = contentSize.width;

            y0 = 0;
            y3 = contentSize.height;
        } else {
            var originalSize = spriteFrame.getOriginalSize();
            var rect = spriteFrame.getRect();
            var offset = spriteFrame.getOffset();
            var scaleX = contentSize.width / originalSize.width;
            var scaleY = contentSize.height / originalSize.height;
            var trimmLeft = offset.x + (originalSize.width - rect.width) / 2;
            var trimmRight = offset.x - (originalSize.width - rect.width) / 2;
            var trimmedBottom = offset.y + (originalSize.height - rect.height) / 2;
            var trimmedTop = offset.y - (originalSize.height - rect.height) / 2;

            x0 = trimmLeft * scaleX;
            x3 = contentSize.width + trimmRight * scaleX;
            y0 = trimmedBottom * scaleY;
            y3 = contentSize.height + trimmedTop * scaleY;
        }

        //apply contentscale factor
        x0 = x0 / cc.contentScaleFactor();
        x3 = x3 / cc.contentScaleFactor();
        y0 = y0 / cc.contentScaleFactor();
        y3 = y3 / cc.contentScaleFactor();

        var vertices = [];
        vertices.push(cc.p(x0, y0));
        vertices.push(cc.p(x3, y3));

        return vertices;
    },

    _calculateUVs: function (spriteFrame) {
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();

        var textureRect = cc.rectPointsToPixels(spriteFrame.getRect());

        //uv computation should take spritesheet into account.
        var u0, u3;
        var v0, v3;

        if (spriteFrame._rotated) {
            u0 = textureRect.x / atlasWidth;
            u3 = (textureRect.x + textureRect.height) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v3 = (textureRect.y + textureRect.width) / atlasHeight;
        }
        else {
            u0 = textureRect.x / atlasWidth;
            u3 = (textureRect.x + textureRect.width) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v3 = (textureRect.y + textureRect.height) / atlasHeight;
        }

        var uvCoordinates = [];
        uvCoordinates.push(cc.p(u0, v3));
        uvCoordinates.push(cc.p(u3, v0));

        return uvCoordinates;
    }
};

var scale9QuadGenerator = {
    _rebuildQuads_base: function (spriteFrame, contentSize, colorOpacity, insetLeft, insetRight, insetTop, insetBottom) {
        var quads = [];
        //build vertices
        var vertices = this._calculateVertices(spriteFrame, contentSize, insetLeft, insetRight, insetTop, insetBottom);

        //build uvs
        var uvs = this._calculateUVs(spriteFrame, insetLeft, insetRight, insetTop, insetBottom);

        //build quads
        var quad;
        for (var i = 0; i < 3; ++i) {
            for (var j = 0; j < 3; ++j) {
                quad = new cc.V3F_C4B_T2F_Quad();
                quad._bl.colors = colorOpacity;
                quad._br.colors = colorOpacity;
                quad._tl.colors = colorOpacity;
                quad._tr.colors = colorOpacity;

                quad._bl.vertices = new cc.Vertex3F(vertices[i].x, vertices[j].y, 0);
                quad._br.vertices = new cc.Vertex3F(vertices[i + 1].x, vertices[j].y, 0);
                quad._tl.vertices = new cc.Vertex3F(vertices[i].x, vertices[j + 1].y, 0);
                quad._tr.vertices = new cc.Vertex3F(vertices[i + 1].x, vertices[j + 1].y, 0);

                if (!spriteFrame._rotated) {
                    quad._bl.texCoords = new cc.Tex2F(uvs[i].x, uvs[j].y);
                    quad._br.texCoords = new cc.Tex2F(uvs[i + 1].x, uvs[j].y);
                    quad._tl.texCoords = new cc.Tex2F(uvs[i].x, uvs[j + 1].y);
                    quad._tr.texCoords = new cc.Tex2F(uvs[i + 1].x, uvs[j + 1].y);
                } else {
                    quad._bl.texCoords = new cc.Tex2F(uvs[j].x, uvs[3 - i].y);
                    quad._br.texCoords = new cc.Tex2F(uvs[j].x, uvs[3 - (i + 1)].y);
                    quad._tl.texCoords = new cc.Tex2F(uvs[j + 1].x, uvs[3 - i].y);
                    quad._tr.texCoords = new cc.Tex2F(uvs[j + 1].x, uvs[3 - (i + 1)].y);
                }
                quads.push(quad);
            }
        }

        return quads;
    },

    _calculateVertices: function (spriteFrame, contentSize, insetLeft, insetRight, insetTop, insetBottom) {
        var leftWidth, centerWidth, rightWidth;
        var topHeight, centerHeight, bottomHeight;

        var rect = spriteFrame._rect;
        leftWidth = insetLeft;
        rightWidth = insetRight;
        centerWidth = rect.width - leftWidth - rightWidth;

        topHeight = insetTop;
        bottomHeight = insetBottom;
        centerHeight = rect.height - topHeight - bottomHeight;

        var preferSize = contentSize;
        var sizableWidth = preferSize.width - leftWidth - rightWidth;
        var sizableHeight = preferSize.height - topHeight - bottomHeight;
        var xScale = preferSize.width / (leftWidth + rightWidth);
        var yScale = preferSize.height / (topHeight + bottomHeight);
        xScale = xScale > 1 ? 1 : xScale;
        yScale = yScale > 1 ? 1 : yScale;
        sizableWidth = sizableWidth < 0 ? 0 : sizableWidth;
        sizableHeight = sizableHeight < 0 ? 0 : sizableHeight;
        var x0, x1, x2, x3;
        var y0, y1, y2, y3;
        x0 = 0;
        x1 = leftWidth * xScale;
        x2 = x1 + sizableWidth;
        x3 = preferSize.width;

        y0 = 0;
        y1 = bottomHeight * yScale;
        y2 = y1 + sizableHeight;
        y3 = preferSize.height;

        //apply contentscale factor
        x0 = x0 / cc.contentScaleFactor();
        x1 = x1 / cc.contentScaleFactor();
        x2 = x2 / cc.contentScaleFactor();
        x3 = x3 / cc.contentScaleFactor();
        y0 = y0 / cc.contentScaleFactor();
        y1 = y1 / cc.contentScaleFactor();
        y2 = y2 / cc.contentScaleFactor();
        y3 = y3 / cc.contentScaleFactor();

        var vertices = [];
        vertices.push(cc.p(x0, y0));
        vertices.push(cc.p(x1, y1));
        vertices.push(cc.p(x2, y2));
        vertices.push(cc.p(x3, y3));

        return vertices;
    },

    _calculateUVs: function (spriteFrame, insetLeft, insetRight, insetTop, insetBottom) {
        var rect = spriteFrame._rect;
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();

        //caculate texture coordinate
        var leftWidth, centerWidth, rightWidth;
        var topHeight, centerHeight, bottomHeight;
        leftWidth = insetLeft;
        rightWidth = insetRight;
        centerWidth = rect.width - leftWidth - rightWidth;

        topHeight = insetTop;
        bottomHeight = insetBottom;
        centerHeight = rect.height - topHeight - bottomHeight;

        var textureRect = cc.rectPointsToPixels(spriteFrame.getRect());

        //uv computation should take spritesheet into account.
        var u0, u1, u2, u3;
        var v0, v1, v2, v3;

        if (spriteFrame._rotated) {
            u0 = textureRect.x / atlasWidth;
            u1 = (bottomHeight + textureRect.x) / atlasWidth;
            u2 = (bottomHeight + centerHeight + textureRect.x) / atlasWidth;
            u3 = (textureRect.x + textureRect.height) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v1 = (leftWidth + textureRect.y) / atlasHeight;
            v2 = (leftWidth + centerWidth + textureRect.y) / atlasHeight;
            v3 = (textureRect.y + textureRect.width) / atlasHeight;
        }
        else {
            u0 = textureRect.x / atlasWidth;
            u1 = (leftWidth + textureRect.x) / atlasWidth;
            u2 = (leftWidth + centerWidth + textureRect.x) / atlasWidth;
            u3 = (textureRect.x + textureRect.width) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v1 = (topHeight + textureRect.y) / atlasHeight;
            v2 = (topHeight + centerHeight + textureRect.y) / atlasHeight;
            v3 = (textureRect.y + textureRect.height) / atlasHeight;
        }

        var uvCoordinates = [];
        uvCoordinates.push(cc.p(u0, v3));
        uvCoordinates.push(cc.p(u1, v2));
        uvCoordinates.push(cc.p(u2, v1));
        uvCoordinates.push(cc.p(u3, v0));

        return uvCoordinates;
    }
};

var tiledQuadGenerator = {
    _rebuildQuads_base: function (spriteFrame, contentSize, colorOpacity) {
        var quads = [];

        //build uvs
        var uvs = this._calculateUVs(spriteFrame);
        var u0 = uvs[0].x;
        var v0 = uvs[0].y;
        var u1 = uvs[1].x;
        var v1 = uvs[1].y;
        var rectWidth = spriteFrame.getRect().width;
        var rectHeight = spriteFrame.getRect().height;
        //build quads
        var hRepeat = contentSize.width / rectWidth;
        var vRepeat = contentSize.height / rectHeight;
        for (var hindex = 0; hindex < Math.ceil(hRepeat); ++hindex) {
            for (var vindex = 0; vindex < Math.ceil(vRepeat); ++vindex) {
                var quad;
                quad = new cc.V3F_C4B_T2F_Quad();

                quad._bl.colors = colorOpacity;
                quad._br.colors = colorOpacity;
                quad._tl.colors = colorOpacity;
                quad._tr.colors = colorOpacity;

                quad._bl.vertices = new cc.Vertex3F(rectWidth * hindex, rectHeight * vindex, 0);
                quad._br.vertices = new cc.Vertex3F(rectWidth * Math.min(hindex + 1, hRepeat), rectHeight * vindex, 0);
                quad._tl.vertices = new cc.Vertex3F(rectWidth * hindex, rectHeight * Math.min(vindex + 1, vRepeat), 0);
                quad._tr.vertices = new cc.Vertex3F(rectWidth * Math.min(hindex + 1, hRepeat), rectHeight * Math.min(vindex + 1, vRepeat), 0);

                if (!spriteFrame._rotated) {
                    quad._bl.texCoords = new cc.Tex2F(u0, v0);
                    quad._br.texCoords = new cc.Tex2F(u0 + (u1 - u0) * Math.min(1, hRepeat - hindex), v0);
                    quad._tl.texCoords = new cc.Tex2F(u0, v0 + (v1 - v0) * Math.min(1, vRepeat - vindex));
                    quad._tr.texCoords = new cc.Tex2F(u0 + (u1 - u0) * Math.min(1, hRepeat - hindex), v0 + (v1 - v0) * Math.min(1, vRepeat - vindex));
                } else {
                    quad._bl.texCoords = new cc.Tex2F(u0, v1);
                    quad._br.texCoords = new cc.Tex2F(u0, v1 + (v0 - v1) * Math.min(1, hRepeat - hindex));
                    quad._tl.texCoords = new cc.Tex2F(u0 + (u1 - u0) * Math.min(1, vRepeat - vindex), v1);
                    quad._tr.texCoords = new cc.Tex2F(u0 + (u1 - u0) * Math.min(1, vRepeat - vindex), v1 + (v0 - v1) * Math.min(1, hRepeat - hindex));

                }
                quads.push(quad);
            }
        }
        return quads;
    },

    _calculateUVs: function (spriteFrame) {
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();

        var textureRect = cc.rectPointsToPixels(spriteFrame.getRect());

        //uv computation should take spritesheet into account.
        var u0, u3;
        var v0, v3;

        if (spriteFrame._rotated) {
            u0 = textureRect.x / atlasWidth;
            u3 = (textureRect.x + textureRect.height) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v3 = (textureRect.y + textureRect.width) / atlasHeight;
        }
        else {
            u0 = textureRect.x / atlasWidth;
            u3 = (textureRect.x + textureRect.width) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v3 = (textureRect.y + textureRect.height) / atlasHeight;
        }

        var uvCoordinates = [];
        uvCoordinates.push(cc.p(u0, v3));
        uvCoordinates.push(cc.p(u3, v0));

        return uvCoordinates;
    }
};

var filledQuadGeneratorBar = {
    //percentage from 0 to 1;
    _rebuildQuads_base : function (spriteFrame, contentSize, colorOpacity, fillType, filledStart, filledRange) {
        var filledEnd;
        //build vertices
        var vertices = this._calculateVertices(spriteFrame, contentSize);

        //build uvs
        var uvs = this._calculateUVs(spriteFrame);

        //build quads
        var quad = new cc.V3F_C4B_T2F_Quad();

        quad._bl.colors = colorOpacity;
        quad._br.colors = colorOpacity;
        quad._tl.colors = colorOpacity;
        quad._tr.colors = colorOpacity;

        quad._bl.vertices = new cc.Vertex3F(vertices[0].x, vertices[0].y, 0);
        quad._br.vertices = new cc.Vertex3F(vertices[1].x, vertices[0].y, 0);
        quad._tl.vertices = new cc.Vertex3F(vertices[0].x, vertices[1].y, 0);
        quad._tr.vertices = new cc.Vertex3F(vertices[1].x, vertices[1].y, 0);
        quad._bl.texCoords = new cc.Tex2F(0, 0);
        quad._br.texCoords = new cc.Tex2F(0, 0);
        quad._tl.texCoords = new cc.Tex2F(0, 0);
        quad._tr.texCoords = new cc.Tex2F(0, 0);

        var quadUV = [null,null,null,null];

        if (!spriteFrame._rotated) {
            quadUV[0] = new cc.Tex2F(uvs[0].x, uvs[0].y);
            quadUV[1] = new cc.Tex2F(uvs[1].x, uvs[0].y);
            quadUV[2] = new cc.Tex2F(uvs[0].x, uvs[1].y);
            quadUV[3] = new cc.Tex2F(uvs[1].x, uvs[1].y);
        } else {
            quadUV[0] = new cc.Tex2F(uvs[0].x, uvs[1].y);
            quadUV[1] = new cc.Tex2F(uvs[0].x, uvs[0].y);
            quadUV[2]= new cc.Tex2F(uvs[1].x, uvs[1].y);
            quadUV[3]= new cc.Tex2F(uvs[1].x, uvs[0].y);
        }

        //do clamp
        filledStart = filledStart > 1 ? 1 : filledStart;
        filledStart = filledStart < 0 ? 0 : filledStart;

        filledRange = filledRange < 0 ? 0 : filledRange;

        filledEnd = filledStart + filledRange;

        filledEnd = filledEnd > 1 ? 1 : filledEnd;

        var progressStart, progressEnd;
        switch (fillType) {
            case cc.Scale9Sprite.FillType.Horizontal:
                progressStart = vertices[0].x + (vertices[1].x - vertices[0].x) * filledStart;
                progressEnd = vertices[0].x + (vertices[1].x - vertices[0].x) * filledEnd;

                quad._bl.vertices.x = progressStart;
                quad._tl.vertices.x = progressStart;

                quad._br.vertices.x = progressEnd;
                quad._tr.vertices.x = progressEnd;

                quad._bl.texCoords.u = quadUV[0].u + (quadUV[1].u - quadUV[0].u) * filledStart;
                quad._bl.texCoords.v = quadUV[0].v + (quadUV[1].v - quadUV[0].v) * filledStart;

                quad._tl.texCoords.u = quadUV[2].u + (quadUV[3].u - quadUV[2].u) * filledStart;
                quad._tl.texCoords.v = quadUV[2].v + (quadUV[3].v - quadUV[2].v) * filledStart;

                quad._br.texCoords.u = quadUV[0].u + (quadUV[1].u - quadUV[0].u) * filledEnd;
                quad._br.texCoords.v = quadUV[0].v + (quadUV[1].v - quadUV[0].v) * filledEnd;

                quad._tr.texCoords.u = quadUV[2].u + (quadUV[3].u - quadUV[2].u) * filledEnd;
                quad._tr.texCoords.v = quadUV[2].v + (quadUV[3].v - quadUV[2].v) * filledEnd;
                break;
            case cc.Scale9Sprite.FillType.Vertical:
                progressStart = vertices[0].y + (vertices[1].y - vertices[0].y) * filledStart;
                progressEnd = vertices[0].y + (vertices[1].y - vertices[0].y) * filledEnd;

                quad._bl.vertices.y = progressStart;
                quad._br.vertices.y = progressStart;

                quad._tl.vertices.y = progressEnd;
                quad._tr.vertices.y = progressEnd;

                quad._bl.texCoords.u = quadUV[0].u + (quadUV[2].u - quadUV[0].u) * filledStart;
                quad._bl.texCoords.v = quadUV[0].v + (quadUV[2].v - quadUV[0].v) * filledStart;

                quad._br.texCoords.u = quadUV[1].u + (quadUV[3].u - quadUV[1].u) * filledStart;
                quad._br.texCoords.v = quadUV[1].v + (quadUV[3].v - quadUV[1].v) * filledStart;

                quad._tl.texCoords.u = quadUV[0].u + (quadUV[2].u - quadUV[0].u) * filledEnd;
                quad._tl.texCoords.v = quadUV[0].v + (quadUV[2].v - quadUV[0].v) * filledEnd;

                quad._tr.texCoords.u = quadUV[1].u + (quadUV[3].u - quadUV[1].u) * filledEnd;
                quad._tr.texCoords.v = quadUV[1].v + (quadUV[3].v - quadUV[1].v) * filledEnd;
                break;
            default:
                cc.error("Unrecognized fill type in bar fill");
                break;
        }

        return [quad];
    },

    _calculateVertices : function (spriteFrame, contentSize) {

        var x0,x3;
        var y0,y3;
        x0 = 0;
        x3 = contentSize.width;

        y0 = 0;
        y3 = contentSize.height;

        //apply contentscale factor
        x0 = x0 / cc.contentScaleFactor();
        x3 = x3 / cc.contentScaleFactor();
        y0 = y0 / cc.contentScaleFactor();
        y3 = y3 / cc.contentScaleFactor();

        return [cc.p(x0, y0), cc.p(x3, y3)];
    },

    _calculateUVs : function (spriteFrame) {
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();

        var textureRect = cc.rectPointsToPixels(spriteFrame.getRect());

        //uv computation should take spritesheet into account.
        var u0, u3;
        var v0, v3;

        if (spriteFrame._rotated) {
            u0 = textureRect.x / atlasWidth;
            u3 = (textureRect.x + textureRect.height) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v3 = (textureRect.y + textureRect.width) / atlasHeight;
        }
        else {
            u0 = textureRect.x / atlasWidth;
            u3 = (textureRect.x + textureRect.width) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v3 = (textureRect.y + textureRect.height) / atlasHeight;
        }

        return [cc.p(u0, v3),cc.p(u3, v0)];
    }
};

var filledQuadGeneratorRadial = {
    _rebuildQuads_base : function (spriteFrame, contentSize, colorOpacity, center, filledStart, filledRange) {

        filledStart *= Math.PI * 2;
        filledRange *= Math.PI * 2;
        var vertPos = [null, null,null,null];
        var vertUV = [null,null,null,null];
        //build vertices
        var vertices = this._calculateVertices(spriteFrame, contentSize);
        //build uvs
        var uvs = this._calculateUVs(spriteFrame);

        vertPos[0] = cc.v2(vertices[0].x, vertices[0].y);
        vertPos[1] = cc.v2(vertices[1].x, vertices[0].y);
        vertPos[3] = cc.v2(vertices[0].x, vertices[1].y);
        vertPos[2] = cc.v2(vertices[1].x, vertices[1].y);

        if (!spriteFrame._rotated) {
            vertUV[0] = cc.v2(uvs[0].x, uvs[0].y);
            vertUV[1] = cc.v2(uvs[1].x, uvs[0].y);
            vertUV[3] = cc.v2(uvs[0].x, uvs[1].y);
            vertUV[2] = cc.v2(uvs[1].x, uvs[1].y);
        } else {
            vertUV[0] = cc.v2(uvs[0].x, uvs[1].y);
            vertUV[1] = cc.v2(uvs[0].x, uvs[0].y);
            vertUV[3] = cc.v2(uvs[1].x, uvs[1].y);
            vertUV[2] = cc.v2(uvs[1].x, uvs[0].y);
        }

        //fallback
        //todo remove it if outside is implemented
        if(center.x > vertices[1].x) {
            center.x = vertices[1].x;
        }
        if(center.x < vertices[0].x) {
            center.x = vertices[0].x;
        }
        if(center.y < vertices[0].y) {
            center.y = vertices[0].y;
        }
        if(center.y > vertices[1].y) {
            center.y = vertices[1].y;
        }

        var rawQuad;
        rawQuad = new cc.V3F_C4B_T2F_Quad();

        rawQuad._bl.colors = colorOpacity;
        rawQuad._br.colors = colorOpacity;
        rawQuad._tl.colors = colorOpacity;
        rawQuad._tr.colors = colorOpacity;

        rawQuad._bl.vertices = new cc.Vertex3F(vertices[0].x, vertices[0].y, 0);
        rawQuad._br.vertices = new cc.Vertex3F(vertices[1].x, vertices[0].y, 0);
        rawQuad._tl.vertices = new cc.Vertex3F(vertices[0].x, vertices[1].y, 0);
        rawQuad._tr.vertices = new cc.Vertex3F(vertices[1].x, vertices[1].y, 0);

        if (!spriteFrame._rotated) {
            rawQuad._bl.texCoords = new cc.Tex2F(uvs[0].x, uvs[0].y);
            rawQuad._br.texCoords = new cc.Tex2F(uvs[1].x, uvs[0].y);
            rawQuad._tl.texCoords = new cc.Tex2F(uvs[0].x, uvs[1].y);
            rawQuad._tr.texCoords = new cc.Tex2F(uvs[1].x, uvs[1].y);
        } else {
            rawQuad._bl.texCoords = new cc.Tex2F(uvs[0].x, uvs[1].y);
            rawQuad._br.texCoords = new cc.Tex2F(uvs[0].x, uvs[0].y);
            rawQuad._tl.texCoords = new cc.Tex2F(uvs[1].x, uvs[1].y);
            rawQuad._tr.texCoords = new cc.Tex2F(uvs[1].x, uvs[0].y);
        }

        //get vertex Angle
        var triangleIndex = 0;
        var vertsIn = [0,0,0,0];
        vertsIn[0] = this._isAngleIn(this._getVertAngle(center,vertPos[0]), filledStart, filledRange);
        vertsIn[1] = this._isAngleIn(this._getVertAngle(center,vertPos[1]), filledStart, filledRange);
        vertsIn[2] = this._isAngleIn(this._getVertAngle(center,vertPos[2]), filledStart, filledRange);
        vertsIn[3] = this._isAngleIn(this._getVertAngle(center,vertPos[3]), filledStart, filledRange);

        var intersectPoint_1,intersectPoint_2;
        intersectPoint_1 = this._getInsectedPoints(vertices[0].x, vertices[1].x, vertices[0].y, vertices[1].y, center, filledStart);
        intersectPoint_2 = this._getInsectedPoints(vertices[0].x, vertices[1].x, vertices[0].y, vertices[1].y, center, filledStart + filledRange);
        var polygons = [];
        var triangles = [null, null, null, null];
        //in boudary
        if(center.x <= vertices[1].x && center.x >= vertices[0].x && center.y <= vertices[1].y && center.y >= vertices[0].y) {
            if(center.x !== vertices[0].x) {
                triangles[0] = [3,0];
            }
            if(center.x !== vertices[1].x) {
                triangles[2] = [1,2];
            }
            if(center.y !== vertices[0].y) {
                triangles[1] = [0,1];
            }
            if(center.y !== vertices[1].y) {
                triangles[3] = [2,3];
            }
            for(triangleIndex = 0; triangleIndex < 4; ++triangleIndex ) {
                var triangle = triangles[triangleIndex];
                if(triangle === null) {
                    continue;
                }
                //do triangle processing

                if(intersectPoint_1[triangleIndex] === null && intersectPoint_2[triangleIndex] === null) {
                    //no intersect
                    if(vertsIn[triangle[0]] && vertsIn[triangle[1]]) {
                        polygons.push([center, vertPos[triangle[0]], vertPos[triangle[1]]]);
                    }
                } else if(intersectPoint_1[triangleIndex] === null) {
                    //no start intersect
                    if(vertsIn[triangle[1]] === true) {
                        polygons.push([center, vertPos[triangle[0]], vertPos[triangle[1]]]);
                    } else {
                        polygons.push([center, vertPos[triangle[0]], intersectPoint_2[triangleIndex]]);
                    }

                } else if(intersectPoint_2[triangleIndex] === null) {
                    //no end intersect
                    if(vertsIn[triangle[0]] === true) {
                        polygons.push([center,  vertPos[triangle[0]], vertPos[triangle[1]]]);
                    } else {
                        polygons.push([center, intersectPoint_1[triangleIndex], vertPos[triangle[1]]]);
                    }

                } else {
                    //two intersects
                    if(vertsIn[triangle[0]]) {
                        //push two triangles
                        polygons.push([center, vertPos[triangle[0]], intersectPoint_2[triangleIndex]]);
                        polygons.push([center, intersectPoint_1[triangleIndex], vertPos[triangle[1]]]);
                    } else {
                        polygons.push([center, intersectPoint_1[triangleIndex], intersectPoint_2[triangleIndex]]);
                    }
                }
            }

        } else {
            //todo add outside implementation
        }
        var quads = new Array(polygons.length);
        for(var polyindex = 0; polyindex < polygons.length; ++polyindex) {
            var quad = quads[polyindex] = new cc.V3F_C4B_T2F_Quad();

            var polygon = polygons[polyindex];
            quad._tl.vertices = new cc.Vertex3F(polygon[0].x, polygon[0].y, 0);
            quad._bl.vertices = new cc.Vertex3F(polygon[1].x, polygon[1].y, 0);
            quad._tr.vertices = new cc.Vertex3F(polygon[2].x, polygon[2].y, 0);
            quad._tl.colors = colorOpacity;
            quad._bl.colors = colorOpacity;
            quad._tr.colors = colorOpacity;
            var progess = cc.v2(0,0);
            progess.x = (polygon[0].x - vertices[0].x) / (vertices[1].x - vertices[0].x);
            progess.y = (polygon[0].y - vertices[0].y) / (vertices[1].y - vertices[0].y);
            quad._tl.texCoords = this._generateUV(progess, vertUV[0],vertUV[1],vertUV[2],vertUV[3]);

            progess.x = (polygon[1].x - vertices[0].x) / (vertices[1].x - vertices[0].x);
            progess.y = (polygon[1].y - vertices[0].y) / (vertices[1].y - vertices[0].y);
            quad._bl.texCoords = this._generateUV(progess, vertUV[0],vertUV[1],vertUV[2],vertUV[3]);

            progess.x = (polygon[2].x - vertices[0].x) / (vertices[1].x - vertices[0].x);
            progess.y = (polygon[2].y - vertices[0].y) / (vertices[1].y - vertices[0].y);
            quad._tr.texCoords = this._generateUV(progess, vertUV[0],vertUV[1],vertUV[2],vertUV[3]);
        }
        var result = {};
        result.quad = quads;
        result.rawQuad = rawQuad;
        return result;

    },

    _isAngleIn : function(angle, start, rangeAngle) {
        var pi_2 = Math.PI * 2;
        while(angle < start || angle >= start + pi_2) {
            if(angle < start) {
                angle += pi_2;
            }
            if(angle >= start + pi_2) {
                angle -= pi_2;
            }
        }

        return angle <= start + rangeAngle;
    },

    _getVertAngle: function(start, end) {
        var placement = cc.v2(end.x - start.x, end.y - start.y);
        if(placement.x === 0 && placement.y === 0) {
            return undefined;
        } else if(placement.x === 0) {
            if(placement.y > 0) {
                return Math.PI / 2;
            } else {
                return - Math.PI / 2;
            }
        } else {
            var angle = Math.atan(placement.y / placement.x);
            if(placement.x < 0) {
                angle += Math.PI;
            }

            return angle;
        }
    },

    _getInsectedPoints: function(left, right, bottom, top, start, angle) {
        //left bottom, right, top
        var result = [null, null, null, null];
        var sinAngle = Math.sin(angle);
        var cosAngle = Math.cos(angle);
        var tanAngle,cotAngle;
        if(Math.cos(angle) !== 0) {
            tanAngle = sinAngle / cosAngle;
            //calculate right and left
            if((left - start.x) * cosAngle > 0) {
                var yleft = start.y + tanAngle * (left - start.x);
                if(yleft > bottom && yleft < top) {
                    result[0] = cc.v2(left, yleft);
                }
            }
            if((right - start.x) * cosAngle > 0) {
                var yright = start.y + tanAngle * (right - start.x);

                if(yright > bottom && yright < top) {
                    result[2] = cc.v2(right, yright);
                }
            }

        }

        if(Math.sin(angle) !== 0) {
            cotAngle = cosAngle / sinAngle;
            //calculate  top and bottom
            if((top - start.y) * sinAngle > 0) {
                var xtop = start.x  + cotAngle * (top-start.y);
                if(xtop > left && xtop < right) {
                    result[3] = cc.v2(xtop, top);
                }
            }
            if((bottom - start.y) * sinAngle > 0) {
                var xbottom = start.x  + cotAngle * (bottom-start.y);
                if(xbottom > left && xbottom < right) {
                    result[1] = cc.v2(xbottom, bottom);
                }
            }

        }
        return result;
    },

    _generateUV : function(progress, uvbl, uvbr, uvtr, uvtl) {
        var result = new cc.Tex2F(0,0);
        var px1 = uvbl.x + (uvbr.x-uvbl.x) * progress.x;
        var px2 = uvtl.x + (uvtr.x-uvtl.x) * progress.x;
        var py1 = uvbl.y + (uvbr.y-uvbl.y) * progress.x;
        var py2 = uvtl.y + (uvtr.y-uvtl.y) * progress.x;
        result.u = px1 + (px2 - px1) * progress.y;
        result.v = py1 + (py2 - py1) * progress.y;
        return result;
    },


    _calculateVertices : function (spriteFrame, contentSize) {

        var x0,x3;
        var y0,y3;
        x0 = 0;
        x3 = contentSize.width;

        y0 = 0;
        y3 = contentSize.height;

        //apply contentscale factor
        x0 = x0 / cc.contentScaleFactor();
        x3 = x3 / cc.contentScaleFactor();
        y0 = y0 / cc.contentScaleFactor();
        y3 = y3 / cc.contentScaleFactor();

        var vertices = [];
        vertices.push(cc.p(x0, y0));
        vertices.push(cc.p(x3, y3));

        return vertices;
    },

    _calculateUVs : function (spriteFrame) {
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();

        var textureRect = cc.rectPointsToPixels(spriteFrame.getRect());

        //uv computation should take spritesheet into account.
        var u0, u3;
        var v0, v3;

        if (spriteFrame._rotated) {
            u0 = textureRect.x / atlasWidth;
            u3 = (textureRect.x + textureRect.height) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v3 = (textureRect.y + textureRect.width) / atlasHeight;
        }
        else {
            u0 = textureRect.x / atlasWidth;
            u3 = (textureRect.x + textureRect.width) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v3 = (textureRect.y + textureRect.height) / atlasHeight;
        }

        var uvCoordinates = [];
        uvCoordinates.push(cc.p(u0, v3));
        uvCoordinates.push(cc.p(u3, v0));

        return uvCoordinates;
    }
};

cc.Scale9Sprite = _ccsg.Node.extend({
    //resource data, could be async loaded.
    _spriteFrame: null,

    //scale 9 data
    _insetLeft: 0,
    _insetRight: 0,
    _insetTop: 0,
    _insetBottom: 0,
    //blend function
    _blendFunc: null,
    //sliced or simple
    _renderingType: 1,
    //bright or not
    _brightState: 0,
    //rendering quads
    _quads: [],
    _quadsDirty: true,
    _rawQuad: null,
    _isTriangle: false,
    _isTrimmedContentSize: true,
    //filled type
    _filledType: 0,
    //for filled radial
    _center: null,
    //normalized filled start and range
    _filledStart: 0,
    _filledRange: Math.PI * 2,

    ctor: function (textureOrSpriteFrame) {
        _ccsg.Node.prototype.ctor.call(this);
        this._renderCmd.setState(this._brightState);
        this._blendFunc = cc.BlendFunc._alphaNonPremultiplied();
        this._center = cc.v2(0,0);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        //
        if (typeof textureOrSpriteFrame === 'string') {
            var frame = cc.spriteFrameCache.getSpriteFrame(textureOrSpriteFrame);
            if (frame) {
                this.initWithSpriteFrame(frame);
            } else {
                this.initWithTexture(textureOrSpriteFrame);
            }
        } else if (textureOrSpriteFrame instanceof cc.SpriteFrame) {
            this.initWithSpriteFrame(textureOrSpriteFrame);
        }
        else if (textureOrSpriteFrame instanceof cc.Texture2D) {
            this.initWithTexture(textureOrSpriteFrame);
        }
    },

    loaded: function () {
        if (this._spriteFrame === null) {
            return false;
        } else {
            return this._spriteFrame.textureLoaded();
        }
    },

    /**
     * Initializes a 9-slice sprite with a texture file
     *
     * @param textureOrTextureFile The name of the texture file.
     */
    initWithTexture: function (textureOrTextureFile) {
        this.setTexture(textureOrTextureFile);
    },

    /**
     * Initializes a 9-slice sprite with an sprite frame
     * @param spriteFrameOrSFName The sprite frame object.
     */
    initWithSpriteFrame: function (spriteFrameOrSFName) {
        this.setSpriteFrame(spriteFrameOrSFName);
    },

    /**
     * Change the texture file of 9 slice sprite
     *
     * @param textureOrTextureFile The name of the texture file.
     */
    setTexture: function (textureOrTextureFile) {
        var spriteFrame = cc.SpriteFrame.createWithTexture(textureOrTextureFile);
        this.setSpriteFrame(spriteFrame);
    },

    /**
     * Change the sprite frame of 9 slice sprite
     *
     * @param spriteFrameOrSFFileName The name of the texture file.
     */
    setSpriteFrame: function (spriteFrameOrSFName) {
        var spriteFrame;
        if (spriteFrameOrSFName instanceof cc.SpriteFrame) {
            spriteFrame = spriteFrameOrSFName;
        }
        else {
            spriteFrame = cc.spriteFrameCache.getSpriteFrame(spriteFrameOrSFName);
        }

        if (spriteFrame) {
            this._spriteFrame = spriteFrame;
            this._quadsDirty = true;
            var self = this;
            var onResourceDataLoaded = function () {
                if (cc.sizeEqualToSize(self._contentSize, cc.size(0, 0))) {
                    self.setContentSize(self._spriteFrame.getRect());
                }
            };
            if (spriteFrame.textureLoaded()) {
                onResourceDataLoaded();
            } else {
                spriteFrame.once('load', onResourceDataLoaded, this);
            }
        }
    },

    /**
     * Sets the source blending function.
     *
     * @param blendFunc A structure with source and destination factor to specify pixel arithmetic. e.g. {GL_ONE, GL_ONE}, {GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA}.
     */
    setBlendFunc: function (blendFunc, dst) {
        if (dst === undefined) {
            this._blendFunc.src = blendFunc.src || cc.BLEND_SRC;
            this._blendFunc.dst = blendFunc.dst || cc.BLEND_DST;
        }
        else {
            this._blendFunc.src = blendFunc || cc.BLEND_SRC;
            this._blendFunc.dst = dst || cc.BLEND_DST;
        }
    },

    /**
     * Returns the blending function that is currently being used.
     *
     * @return A BlendFunc structure with source and destination factor which specified pixel arithmetic.
     */
    getBlendFunc: function () {
        return new cc.BlendFunc(this._blendFunc.src, this._blendFunc.dst);
    },

    // overrides
    setContentSize: function (width, height) {
        if (height === undefined) {
            height = width.height;
            width = width.width;
        }
        if (width === this._contentSize.width && height === this._contentSize.height) {
            return;
        }

        _ccsg.Node.prototype.setContentSize.call(this, width, height);
        this._quadsDirty = true;
    },

    //
    enableTrimmedContentSize: function (isTrimmed) {
        if (this._isTrimmedContentSize !== isTrimmed) {
            this._isTrimmedContentSize = isTrimmed;
            this._quadsDirty = true;
        }
    },

    isTrimmedContentSizeEnabled: function () {
        return this._isTrimmedContentSize;
    },
    /**
     * Change the state of 9-slice sprite.
     * @see `State`
     * @param state A enum value in State.
     */
    setState: function (state) {
        this._brightState = state;
        this._renderCmd.setState(state);
    },

    /**
     * Query the current bright state.
     * @return @see `State`
     */
    getState: function () {
        return this._brightState;
    },

    /**
     * change the rendering type, could be simple or slice
     * @return @see `RenderingType`
     */
    setRenderingType: function (type) {
        if (this._renderingType === type) return;
        this._renderingType = type;
        this._quadsDirty = true;
    },
    /**
     * get the rendering type, could be simple or slice
     * @return @see `RenderingType`
     */
    getRenderingType: function () {
        return this._renderingType;
    },
    /**
     * change the left border of 9 slice sprite, it should be specified before trimmed.
     * @param insetLeft left border.
     */
    setInsetLeft: function (insetLeft) {
        this._insetLeft = insetLeft;
        this._quadsDirty = true;
    },
    /**
     * get the left border of 9 slice sprite, the result is specified before trimmed.
     * @return left border.
     */
    getInsetLeft: function () {
        return this._insetLeft;
    },
    /**
     * change the top border of 9 slice sprite, it should be specified before trimmed.
     * @param insetTop top border.
     */
    setInsetTop: function (insetTop) {
        this._insetTop = insetTop;
        this._quadsDirty = true;
    },

    /**
     * get the top border of 9 slice sprite, the result is specified before trimmed.
     * @return top border.
     */
    getInsetTop: function () {
        return this._insetTop;
    },

    /**
     * change the right border of 9 slice sprite, it should be specified before trimmed.
     * @param insetRight right border.
     */
    setInsetRight: function (insetRight) {
        this._insetRight = insetRight;
        this._quadsDirty = true;
    },

    /**
     * get the right border of 9 slice sprite, the result is specified before trimmed.
     * @return right border.
     */
    getInsetRight: function () {
        return this._insetRight;
    },

    /**
     * change the bottom border of 9 slice sprite, it should be specified before trimmed.
     * @param insetBottom bottom border.
     */
    setInsetBottom: function (insetBottom) {
        this._insetBottom = insetBottom;
        this._quadsDirty = true;
    },
    /**
     * get the bottom border of 9 slice sprite, the result is specified before trimmed.
     * @return bottom border.
     */
    getInsetBottom: function () {
        return this._insetBottom;
    },

    setFilledType: function(value) {
        if(this._filledType === value)
            return;
        this._filledType = value;
        if(this._renderingType === cc.SpriteType.FILLED) {
            this._quadsDirty = true;
        }
    },

    getFilledType: function() {
        return this._filledType;
    },

    setCenter: function(value,y) {
        this._center = cc.v2(value,y);
        if(this._renderingType === cc.SpriteType.FILLED && this._filledType === cc.Scale9Sprite.FillType.RADIAL) {
            this._quadsDirty = true;
        }
    },

    getCenter: function() {
        return cc.v2(this._center);
    },

    setFilledStart: function(value) {
        if(this._filledStart === value)
            return;
        this._filledStart = value;
        if(this._renderingType === cc.SpriteType.FILLED) {
            this._quadsDirty = true;
        }
    },

    getFilledStart: function() {
        return this._filledStart;
    },

    setFilledRange: function(value) {
        if(this._filledRange === value)
            return;
        this._filledRange = value;
        if(this._renderingType === cc.SpriteType.FILLED ) {
            this._quadsDirty = true;
        }
    },

    getFilledRange: function() {
        return this._filledRange;
    },

    _onColorOpacityDirty: function () {
        var color = this.getDisplayedColor();
        color.a = this.getDisplayedOpacity();
        var index;
        var quadLength = this._quads.length;
        for (index = 0; index < quadLength; ++index) {
            //svar quad = this._quads[index];
            this._quads[index]._bl.colors = color;
            this._quads[index]._br.colors = color;
            this._quads[index]._tl.colors = color;
            this._quads[index]._tr.colors = color;
        }
    },

    _rebuildQuads: function () {
        if (!this.loaded() || this._quadsDirty === false) return;
        var color = this.getDisplayedColor();
        color.a = this.getDisplayedOpacity();
        this._isTriangle = false;
        if (this._renderingType === cc.Scale9Sprite.RenderingType.SIMPLE) {
            this._quads = simpleQuadGenerator._rebuildQuads_base(this._spriteFrame, this.getContentSize(), color, this._isTrimmedContentSize);
        } else if (this._renderingType === cc.Scale9Sprite.RenderingType.SLICED) {
            this._quads = scale9QuadGenerator._rebuildQuads_base(this._spriteFrame, this.getContentSize(), color, this._insetLeft, this._insetRight, this._insetTop, this._insetBottom);
        } else if (this._renderingType === cc.Scale9Sprite.RenderingType.TILED) {
            this._quads = tiledQuadGenerator._rebuildQuads_base(this._spriteFrame, this.getContentSize(), color);
        } else if (this._renderingType === cc.Scale9Sprite.RenderingType.FILLED) {
            if(this._filledType !== cc.Scale9Sprite.FillType.RADIAL) {
                this._quads = filledQuadGeneratorBar._rebuildQuads_base(this._spriteFrame, this.getContentSize(), color, this._filledType, this._filledStart,this._filledRange);
            } else {
                this._isTriangle = true;
                var fillResult = filledQuadGeneratorRadial._rebuildQuads_base(this._spriteFrame, this.getContentSize(), color,this._center,this._filledStart,this._filledRange);
                this._quads = fillResult.quad;
                this._rawQuad = fillResult.rawQuad;
            }
        } else {
            this._quads = [];
            cc.error("Can not generate quad");
        }
        this._quadsDirty = false;
    },
    _createRenderCmd: function () {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new cc.Scale9Sprite.CanvasRenderCmd(this);
        else
            return new cc.Scale9Sprite.WebGLRenderCmd(this);
    }

});

var _p = cc.Scale9Sprite.prototype;
cc.js.addon(_p, EventTarget.prototype);
// Extended properties
/** @expose */
_p.insetLeft;
cc.defineGetterSetter(_p, "insetLeft", _p.getInsetLeft, _p.setInsetLeft);
/** @expose */
_p.insetTop;
cc.defineGetterSetter(_p, "insetTop", _p.getInsetTop, _p.setInsetTop);
/** @expose */
_p.insetRight;
cc.defineGetterSetter(_p, "insetRight", _p.getInsetRight, _p.setInsetRight);
/** @expose */
_p.insetBottom;
cc.defineGetterSetter(_p, "insetBottom", _p.getInsetBottom, _p.setInsetBottom);

_p = null;


cc.Scale9Sprite.create = function (file) {
    return new cc.Scale9Sprite(file);
};

/**
 * create a cc.Scale9Sprite with Sprite frame.
 * @deprecated since v3.0, please use "new cc.Scale9Sprite(spriteFrame, capInsets)" instead.
 * @param {cc.SpriteFrame} spriteFrame
 * @param {cc.Rect} capInsets
 * @returns {cc.Scale9Sprite}
 */
cc.Scale9Sprite.createWithSpriteFrame = function (spriteFrame) {
    return new cc.Scale9Sprite(spriteFrame);
};

/**
 * create a cc.Scale9Sprite with a Sprite frame name
 * @deprecated since v3.0, please use "new cc.Scale9Sprite(spriteFrameName, capInsets)" instead.
 * @param {string} spriteFrameName
 * @param {cc.Rect} capInsets
 * @returns {Scale9Sprite}
 */
cc.Scale9Sprite.createWithSpriteFrameName = function (spriteFrameName) {
    return new cc.Scale9Sprite(spriteFrameName);
};

cc.Scale9Sprite.state = {NORMAL: 0, GRAY: 1};

/**
 * Enum for sprite type
 * @enum SpriteType
 */
cc.SpriteType = cc.Enum({
    /**
     * @property {Number} SIMPLE
     */
    SIMPLE: 0,
    /**
     * @property {Number} SLICED
     */
    SLICED: 1,
    /*
     * @property {Number} TILED
     */
    TILED: 2,
    /*
     * @property {Number} FILLED
     */
    FILLED: 3
});

cc.Scale9Sprite.RenderingType = cc.SpriteType;

cc.Scale9Sprite.FillType = cc.Enum({
    Horizontal: 0,
    Vertical: 1,
    //todo implement this
    RADIAL:2,
});