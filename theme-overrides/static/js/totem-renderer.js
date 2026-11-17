/* Original Step artwork, recovered from menu.swf with JPEXS 26.5.0.
 * Drawing helper derived from JPEXS; see theme/step/totem/NOTICE.txt and COPYING.
 * Adapted to a scoped native renderer with reviewed timeline controls. */
window.StepTotemRenderer = function(canvas) {
var defaultFill;
/**
 *  JPEXS Free Flash Decompiler Filters
 */

var Filters = {};

var createCanvas = function (width, height) {
    var c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    c.style.display = "none";
    //temporary add to document to get this work (getImageData, etc.)
    document.body.appendChild(c);
    document.body.removeChild(c);
    return c;
};

Filters._premultiply = function (data) {
    var len = data.length;
    for (var i = 0; i < len; i += 4) {
        var f = data[i + 3] * 0.003921569;
        data[i] = Math.round(data[i] * f);
        data[i + 1] = Math.round(data[i + 1] * f);
        data[i + 2] = Math.round(data[i + 2] * f);
    }
};

Filters._unpremultiply = function (data) {
    var len = data.length;
    for (var i = 0; i < len; i += 4) {
        var a = data[i + 3];
        if (a == 0 || a == 255) {
            continue;
        }
        var f = 255 / a;
        var r = (data[i] * f);
        var g = (data[i + 1] * f);
        var b = (data[i + 2] * f);
        if (r > 255) {
            r = 255;
        }
        if (g > 255) {
            g = 255;
        }
        if (b > 255) {
            b = 255;
        }

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
    }
};


Filters._boxBlurHorizontal = function (pixels, mask, w, h, radius, maskType) {
    var index = 0;
    var newColors = [];

    for (var y = 0; y < h; y++) {
        var hits = 0;
        var r = 0;
        var g = 0;
        var b = 0;
        var a = 0;
        for (var x = -radius * 4; x < w * 4; x += 4) {
            var oldPixel = x - radius * 4 - 4;
            if (oldPixel >= 0) {
                if ((maskType == 0) || (maskType == 1 && mask[index + oldPixel + 3] > 0) || (maskType == 2 && mask[index + oldPixel + 3] < 255)) {
                    a -= pixels[index + oldPixel + 3];
                    r -= pixels[index + oldPixel];
                    g -= pixels[index + oldPixel + 1];
                    b -= pixels[index + oldPixel + 2];
                    hits--;
                }
            }

            var newPixel = x + radius * 4;
            if (newPixel < w * 4) {
                if ((maskType == 0) || (maskType == 1 && mask[index + newPixel + 3] > 0) || (maskType == 2 && mask[index + newPixel + 3] < 255)) {
                    a += pixels[index + newPixel + 3];
                    r += pixels[index + newPixel];
                    g += pixels[index + newPixel + 1];
                    b += pixels[index + newPixel + 2];
                    hits++;
                }
            }

            if (x >= 0) {
                if ((maskType == 0) || (maskType == 1 && mask[index + x + 3] > 0) || (maskType == 2 && mask[index + x + 3] < 255)) {
                    if (hits == 0) {
                        newColors[x] = 0;
                        newColors[x + 1] = 0;
                        newColors[x + 2] = 0;
                        newColors[x + 3] = 0;
                    } else {
                        newColors[x] = Math.round(r / hits);
                        newColors[x + 1] = Math.round(g / hits);
                        newColors[x + 2] = Math.round(b / hits);
                        newColors[x + 3] = Math.round(a / hits);

                    }
                } else {
                    newColors[x] = 0;
                    newColors[x + 1] = 0;
                    newColors[x + 2] = 0;
                    newColors[x + 3] = 0;
                }
            }
        }
        for (var p = 0; p < w * 4; p += 4) {
            pixels[index + p] = newColors[p];
            pixels[index + p + 1] = newColors[p + 1];
            pixels[index + p + 2] = newColors[p + 2];
            pixels[index + p + 3] = newColors[p + 3];
        }

        index += w * 4;
    }
};

Filters._boxBlurVertical = function (pixels, mask, w, h, radius, maskType) {
    var newColors = [];
    var oldPixelOffset = -(radius + 1) * w * 4;
    var newPixelOffset = (radius) * w * 4;

    for (var x = 0; x < w * 4; x += 4) {
        var hits = 0;
        var r = 0;
        var g = 0;
        var b = 0;
        var a = 0;
        var index = -radius * w * 4 + x;
        for (var y = -radius; y < h; y++) {
            var oldPixel = y - radius - 1;
            if (oldPixel >= 0) {
                if ((maskType == 0) || (maskType == 1 && mask[index + oldPixelOffset + 3] > 0) || (maskType == 2 && mask[index + oldPixelOffset + 3] < 255)) {
                    a -= pixels[index + oldPixelOffset + 3];
                    r -= pixels[index + oldPixelOffset];
                    g -= pixels[index + oldPixelOffset + 1];
                    b -= pixels[index + oldPixelOffset + 2];
                    hits--;
                }

            }

            var newPixel = y + radius;
            if (newPixel < h) {
                if ((maskType == 0) || (maskType == 1 && mask[index + newPixelOffset + 3] > 0) || (maskType == 2 && mask[index + newPixelOffset + 3] < 255)) {
                    a += pixels[index + newPixelOffset + 3];
                    r += pixels[index + newPixelOffset];
                    g += pixels[index + newPixelOffset + 1];
                    b += pixels[index + newPixelOffset + 2];
                    hits++;
                }
            }

            if (y >= 0) {
                if ((maskType == 0) || (maskType == 1 && mask[y * w * 4 + x + 3] > 0) || (maskType == 2 && mask[y * w * 4 + x + 3] < 255)) {
                    if (hits == 0) {
                        newColors[4 * y] = 0;
                        newColors[4 * y + 1] = 0;
                        newColors[4 * y + 2] = 0;
                        newColors[4 * y + 3] = 0;
                    } else {
                        newColors[4 * y] = Math.round(r / hits);
                        newColors[4 * y + 1] = Math.round(g / hits);
                        newColors[4 * y + 2] = Math.round(b / hits);
                        newColors[4 * y + 3] = Math.round(a / hits);
                    }
                } else {
                    newColors[4 * y] = 0;
                    newColors[4 * y + 1] = 0;
                    newColors[4 * y + 2] = 0;
                    newColors[4 * y + 3] = 0;
                }
            }

            index += w * 4;
        }

        for (var y = 0; y < h; y++) {
            pixels[y * w * 4 + x] = newColors[4 * y];
            pixels[y * w * 4 + x + 1] = newColors[4 * y + 1];
            pixels[y * w * 4 + x + 2] = newColors[4 * y + 2];
            pixels[y * w * 4 + x + 3] = newColors[4 * y + 3];
        }
    }
};


Filters.blur = function (canvas, ctx, hRadius, vRadius, iterations, mask, maskType) {
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;
    Filters._premultiply(data);
    for (var i = 0; i < iterations; i++) {
        Filters._boxBlurHorizontal(data, mask, canvas.width, canvas.height, Math.floor(hRadius / 2), maskType);
        Filters._boxBlurVertical(data, mask, canvas.width, canvas.height, Math.floor(vRadius / 2), maskType);
    }

    Filters._unpremultiply(data);

    var width = canvas.width;
    var height = canvas.height;
    var retCanvas = createCanvas(width, height);
    var retImg = retCanvas.getContext("2d");
    retImg.putImageData(imgData, 0, 0);
    return retCanvas;
}

Filters._moveRGB = function (width, height, rgb, deltaX, deltaY, fill) {
    var img = createCanvas(width, height);

    var ig = img.getContext("2d");

    Filters._setRGB(ig, 0, 0, width, height, rgb);
    var retImg = createCanvas(width, height);
    retImg.width = width;
    retImg.height = height;
    var g = retImg.getContext("2d");
    g.fillStyle = fill;
    g.globalCompositeOperation = "copy";
    g.fillRect(0, 0, width, height);
    g.drawImage(img, deltaX, deltaY);
    return g.getImageData(0, 0, width, height).data;
};


Filters.FULL = 1;
Filters.INNER = 2;
Filters.OUTER = 3;

Filters._setRGB = function (ctx, x, y, width, height, data) {
    var id = ctx.createImageData(width, height);
    for (var i = 0; i < data.length; i++) {
        id.data[i] = data[i];
    }
    ctx.putImageData(id, x, y);
};

Filters.gradientGlow = function (srcCanvas, src, blurX, blurY, angle, distance, colors, ratios, type, iterations, strength, knockout) {
    var width = canvas.width;
    var height = canvas.height;
    var retCanvas = createCanvas(width, height);
    var retImg = retCanvas.getContext("2d");

    var gradCanvas = createCanvas(256, 1);

    var gradient = gradCanvas.getContext("2d");
    var grd = ctx.createLinearGradient(0, 0, 255, 0);
    for (var s = 0; s < colors.length; s++) {
        var v = "rgba(" + colors[s][0] + "," + colors[s][1] + "," + colors[s][2] + "," + colors[s][3] + ")";
        grd.addColorStop(ratios[s], v);
    }
    gradient.fillStyle = grd;
    gradient.fillRect(0, 0, 256, 1);
    var gradientPixels = gradient.getImageData(0, 0, gradCanvas.width, gradCanvas.height).data;

    var angleRad = angle / 180 * Math.PI;
    var moveX = (distance * Math.cos(angleRad));
    var moveY = (distance * Math.sin(angleRad));
    var srcPixels = src.getImageData(0, 0, width, height).data;
    var shadow = [];
    for (var i = 0; i < srcPixels.length; i += 4) {
        var alpha = srcPixels[i + 3];
        shadow[i] = 0;
        shadow[i + 1] = 0;
        shadow[i + 2] = 0;
        shadow[i + 3] = Math.round(alpha * strength);
    }
    var colorAlpha = "rgba(0,0,0,0)";
    shadow = Filters._moveRGB(width, height, shadow, moveX, moveY, colorAlpha);

    Filters._setRGB(retImg, 0, 0, width, height, shadow);

    var maskType = 0;
    if (type == Filters.INNER) {
        maskType = 1;
    }
    if (type == Filters.OUTER) {
        maskType = 2;
    }


    retCanvas = Filters.blur(retCanvas, retCanvas.getContext("2d"), blurX, blurY, iterations, srcPixels, maskType);
    retImg = retCanvas.getContext("2d");
    shadow = retImg.getImageData(0, 0, width, height).data;

    if (maskType != 0) {
        for (var i = 0; i < srcPixels.length; i += 4) {
            if ((maskType == 1 && srcPixels[i + 3] == 0) || (maskType == 2 && srcPixels[i + 3] == 255)) {
                shadow[i] = 0;
                shadow[i + 1] = 0;
                shadow[i + 2] = 0;
                shadow[i + 3] = 0;
            }
        }
    }


    for (var i = 0; i < shadow.length; i += 4) {
        var a = shadow[i + 3];
        shadow[i] = gradientPixels[a * 4];
        shadow[i + 1] = gradientPixels[a * 4 + 1];
        shadow[i + 2] = gradientPixels[a * 4 + 2];
        shadow[i + 3] = gradientPixels[a * 4 + 3];
    }

    Filters._setRGB(retImg, 0, 0, width, height, shadow);

    if (!knockout) {
        retImg.globalCompositeOperation = "destination-over";
        retImg.drawImage(srcCanvas, 0, 0);
    }

    return retCanvas;
};


Filters.dropShadow = function (canvas, src, blurX, blurY, angle, distance, color, inner, iterations, strength, knockout) {
    var width = canvas.width;
    var height = canvas.height;
    var srcPixels = src.getImageData(0, 0, width, height).data;
    var shadow = [];
    for (var i = 0; i < srcPixels.length; i += 4) {
        var alpha = srcPixels[i + 3];
        if (inner) {
            alpha = 255 - alpha;
        }
        shadow[i] = color[0];
        shadow[i + 1] = color[1];
        shadow[i + 2] = color[2];
        var sa = color[3] * alpha * strength;
        if (sa > 255)
            sa = 255;
        shadow[i + 3] = Math.round(sa);
    }
    var colorFirst = "#000000";
    var colorAlpha = "rgba(0,0,0,0)";
    var angleRad = angle / 180 * Math.PI;
    var moveX = (distance * Math.cos(angleRad));
    var moveY = (distance * Math.sin(angleRad));
    shadow = Filters._moveRGB(width, height, shadow, moveX, moveY, inner ? colorFirst : colorAlpha);


    var retCanvas = createCanvas(canvas.width, canvas.height);
    Filters._setRGB(retCanvas.getContext("2d"), 0, 0, width, height, shadow);
    if (blurX > 0 || blurY > 0) {
        retCanvas = Filters.blur(retCanvas, retCanvas.getContext("2d"), blurX, blurY, iterations, null, 0);
    }
    shadow = retCanvas.getContext("2d").getImageData(0, 0, width, height).data;

    var srcPixels = src.getImageData(0, 0, width, height).data;
    for (var i = 0; i < shadow.length; i += 4) {
        var mask = srcPixels[i + 3];
        if (!inner) {
            mask = 255 - mask;
        }
        shadow[i + 3] = mask * shadow[i + 3] / 255;
    }
    Filters._setRGB(retCanvas.getContext("2d"), 0, 0, width, height, shadow);

    if (!knockout) {
        var g = retCanvas.getContext("2d");
        g.globalCompositeOperation = "destination-over";
        g.drawImage(canvas, 0, 0);
    }

    return retCanvas;
};

Filters._cut = function (a, min, max) {
    if (a > max)
        a = max;
    if (a < min)
        a = min;
    return a;
}

Filters.gradientBevel = function (canvas, src, colors, ratios, blurX, blurY, strength, type, angle, distance, knockout, iterations) {
    var width = canvas.width;
    var height = canvas.height;
    var retImg = createCanvas(width, height);
    var srcPixels = src.getImageData(0, 0, width, height).data;

    var gradient = createCanvas(512, 1);
    var gg = gradient.getContext("2d");

    var grd = ctx.createLinearGradient(0, 0, 511, 0);
    for (var s = 0; s < colors.length; s++) {
        var v = "rgba(" + colors[s][0] + "," + colors[s][1] + "," + colors[s][2] + "," + colors[s][3] + ")";
        grd.addColorStop(ratios[s], v);
    }
    gg.fillStyle = grd;
    gg.globalCompositeOperation = "copy";
    gg.fillRect(0, 0, gradient.width, gradient.height);
    var gradientPixels = gg.getImageData(0, 0, gradient.width, gradient.height).data;


    if (type != Filters.OUTER) {
        var hilightIm = Filters.dropShadow(canvas, src, 0, 0, angle, distance, [255, 0, 0, 1], true, iterations, strength, true);
        var shadowIm = Filters.dropShadow(canvas, src, 0, 0, angle + 180, distance, [0, 0, 255, 1], true, iterations, strength, true);
        var h2 = createCanvas(width, height);
        var s2 = createCanvas(width, height);
        var hc = h2.getContext("2d");
        var sc = s2.getContext("2d");
        hc.drawImage(hilightIm, 0, 0);
        hc.globalCompositeOperation = "destination-out";
        hc.drawImage(shadowIm, 0, 0);

        sc.drawImage(shadowIm, 0, 0);
        sc.globalCompositeOperation = "destination-out";
        sc.drawImage(hilightIm, 0, 0);
        var shadowInner = s2;
        var hilightInner = h2;
    }
    if (type != Filters.INNER) {
        var hilightIm = Filters.dropShadow(canvas, src, 0, 0, angle + 180, distance, [255, 0, 0, 1], false, iterations, strength, true);
        var shadowIm = Filters.dropShadow(canvas, src, 0, 0, angle, distance, [0, 0, 255, 1], false, iterations, strength, true);
        var h2 = createCanvas(width, height);
        var s2 = createCanvas(width, height);
        var hc = h2.getContext("2d");
        var sc = s2.getContext("2d");
        hc.drawImage(hilightIm, 0, 0);
        hc.globalCompositeOperation = "destination-out";
        hc.drawImage(shadowIm, 0, 0);

        sc.drawImage(shadowIm, 0, 0);
        sc.globalCompositeOperation = "destination-out";
        sc.drawImage(hilightIm, 0, 0);
        var shadowOuter = s2;
        var hilightOuter = h2;
    }

    var hilightIm;
    var shadowIm;
    switch (type) {
        case Filters.OUTER:
            hilightIm = hilightOuter;
            shadowIm = shadowOuter;
            break;
        case Filters.INNER:
            hilightIm = hilightInner;
            shadowIm = shadowInner;
            break;
        case Filters.FULL:
            hilightIm = hilightInner;
            shadowIm = shadowInner;
            var hc = hilightIm.getContext("2d");
            hc.globalCompositeOperation = "source-over";
            hc.drawImage(hilightOuter, 0, 0);
            var sc = shadowIm.getContext("2d");
            sc.globalCompositeOperation = "source-over";
            sc.drawImage(shadowOuter, 0, 0);
            break;
    }

    var maskType = 0;
    if (type == Filters.INNER) {
        maskType = 1;
    }
    if (type == Filters.OUTER) {
        maskType = 2;
    }

    var retc = retImg.getContext("2d");
    retc.fillStyle = "#000000";
    retc.fillRect(0, 0, width, height);
    retc.drawImage(shadowIm, 0, 0);
    retc.drawImage(hilightIm, 0, 0);

    retImg = Filters.blur(retImg, retImg.getContext("2d"), blurX, blurY, iterations, srcPixels, maskType);
    var ret = retImg.getContext("2d").getImageData(0, 0, width, height).data;

    for (var i = 0; i < srcPixels.length; i += 4) {
        var ah = ret[i] * strength;
        var as = ret[i + 2] * strength;
        var ra = Filters._cut(ah - as, -255, 255);
        ret[i] = gradientPixels[4 * (255 + ra)];
        ret[i + 1] = gradientPixels[4 * (255 + ra) + 1];
        ret[i + 2] = gradientPixels[4 * (255 + ra) + 2];
        ret[i + 3] = gradientPixels[4 * (255 + ra) + 3];
    }
    Filters._setRGB(retImg.getContext("2d"), 0, 0, width, height, ret);


    if (!knockout) {
        var g = retImg.getContext("2d");
        g.globalCompositeOperation = "destination-over";
        g.drawImage(canvas, 0, 0);
    }
    return retImg;
}
Filters.bevel = function (canvas, src, blurX, blurY, strength, type, highlightColor, shadowColor, angle, distance, knockout, iterations) {
    return Filters.gradientBevel(canvas, src, [
        shadowColor,
        [shadowColor[0], shadowColor[1], shadowColor[2], 0],
        [highlightColor[0], highlightColor[1], highlightColor[2], 0],
        highlightColor
    ], [0, 127 / 255, 128 / 255, 1], blurX, blurY, strength, type, angle, distance, knockout, iterations);
}


//http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
Filters.convolution = function (canvas, ctx, weights, opaque) {
    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);
    var src = pixels.data;
    var sw = pixels.width;
    var sh = pixels.height;
    // pad output by the convolution matrix
    var w = sw;
    var h = sh;
    var outCanvas = createCanvas(w, h);
    var outCtx = outCanvas.getContext("2d");
    var output = outCtx.getImageData(0, 0, w, h);
    var dst = output.data;
    // go through the destination image pixels
    var alphaFac = opaque ? 1 : 0;
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var sy = y;
            var sx = x;
            var dstOff = (y * w + x) * 4;
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            var r = 0, g = 0, b = 0, a = 0;
            for (var cy = 0; cy < side; cy++) {
                for (var cx = 0; cx < side; cx++) {
                    var scy = sy + cy - halfSide;
                    var scx = sx + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = (scy * sw + scx) * 4;
                        var wt = weights[cy * side + cx];
                        r += src[srcOff] * wt;
                        g += src[srcOff + 1] * wt;
                        b += src[srcOff + 2] * wt;
                        a += src[srcOff + 3] * wt;
                    }
                }
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = a + alphaFac * (255 - a);
        }
    }
    outCtx.putImageData(output, 0, 0);
    return outCanvas;
};

Filters.colorMatrix = function (canvas, ctx, m) {
    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var data = pixels.data;
    for (var i = 0; i < data.length; i += 4) {
        var r = i;
        var g = i + 1;
        var b = i + 2;
        var a = i + 3;

        var oR = data[r];
        var oG = data[g];
        var oB = data[b];
        var oA = data[a];

        data[r] = (m[0] * oR) + (m[1] * oG) + (m[2] * oB) + (m[3] * oA) + m[4];
        data[g] = (m[5] * oR) + (m[6] * oG) + (m[7] * oB) + (m[8] * oA) + m[9];
        data[b] = (m[10] * oR) + (m[11] * oG) + (m[12] * oB) + (m[13] * oA) + m[14];
        data[a] = (m[15] * oR) + (m[16] * oG) + (m[17] * oB) + (m[18] * oA) + m[19];
    }
    var outCanvas = createCanvas(canvas.width, canvas.height);
    var outCtx = outCanvas.getContext("2d");
    outCtx.putImageData(pixels, 0, 0);
    return outCanvas;
};


Filters.glow = function (canvas, src, blurX, blurY, strength, color, inner, knockout, iterations) {
    return Filters.dropShadow(canvas, src, blurX, blurY, 45, 0, color, inner, iterations, strength, knockout);
};


var BlendModes = {};

BlendModes._cut = function (v) {
    if (v < 0)
        v = 0;
    if (v > 255)
        v = 255;
    return v;
};

BlendModes.normal = function (src, dst, result, pos) {
    var am = (255 - src[pos + 3]) / 255;
    result[pos] = this._cut(src[pos] * src[pos + 3] / 255 + dst[pos] * dst[pos + 3] / 255 * am);
    result[pos + 1] = this._cut(src[pos + 1] * src[pos + 3] / 255 + dst[pos + 1] * dst[pos + 3] / 255 * am);
    result[pos + 2] = this._cut(src[pos + 2] * src[pos + 3] / 255 + dst[pos + 2] * dst[pos + 3] / 255 * am);
    result[pos + 3] = this._cut(src[pos + 3] + dst[pos + 3] * am);
};

BlendModes.layer = function (src, dst, result, pos) {
    BlendModes.normal(src, dst, result, pos);
};

BlendModes.multiply = function (src, dst, result, pos) {
    result[pos + 0] = (src[pos + 0] * dst[pos + 0]) >> 8;
    result[pos + 1] = (src[pos + 1] * dst[pos + 1]) >> 8;
    result[pos + 2] = (src[pos + 2] * dst[pos + 2]) >> 8;
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes.screen = function (src, dst, result, pos) {
    result[pos + 0] = 255 - ((255 - src[pos + 0]) * (255 - dst[pos + 0]) >> 8);
    result[pos + 1] = 255 - ((255 - src[pos + 1]) * (255 - dst[pos + 1]) >> 8);
    result[pos + 2] = 255 - ((255 - src[pos + 2]) * (255 - dst[pos + 2]) >> 8);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes.lighten = function (src, dst, result, pos) {
    result[pos + 0] = Math.max(src[pos + 0], dst[pos + 0]);
    result[pos + 1] = Math.max(src[pos + 1], dst[pos + 1]);
    result[pos + 2] = Math.max(src[pos + 2], dst[pos + 2]);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes.darken = function (src, dst, result, pos) {
    result[pos + 0] = Math.min(src[pos + 0], dst[pos + 0]);
    result[pos + 1] = Math.min(src[pos + 1], dst[pos + 1]);
    result[pos + 2] = Math.min(src[pos + 2], dst[pos + 2]);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes.difference = function (src, dst, result, pos) {
    result[pos + 0] = Math.abs(dst[pos + 0] - src[pos + 0]);
    result[pos + 1] = Math.abs(dst[pos + 1] - src[pos + 1]);
    result[pos + 2] = Math.abs(dst[pos + 2] - src[pos + 2]);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes.add = function (src, dst, result, pos) {
    result[pos + 0] = Math.min(255, src[pos + 0] + dst[pos + 0]);
    result[pos + 1] = Math.min(255, src[pos + 1] + dst[pos + 1]);
    result[pos + 2] = Math.min(255, src[pos + 2] + dst[pos + 2]);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3]);
};

BlendModes.subtract = function (src, dst, result, pos) {
    result[pos + 0] = Math.max(0, src[pos + 0] + dst[pos + 0] - 256);
    result[pos + 1] = Math.max(0, src[pos + 1] + dst[pos + 1] - 256);
    result[pos + 2] = Math.max(0, src[pos + 2] + dst[pos + 2] - 256);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes.invert = function (src, dst, result, pos) {
    result[pos + 0] = 255 - dst[pos + 0];
    result[pos + 1] = 255 - dst[pos + 1];
    result[pos + 2] = 255 - dst[pos + 2];
    result[pos + 3] = src[pos + 3];
};

BlendModes.alpha = function (src, dst, result, pos) {
    result[pos + 0] = src[pos + 0];
    result[pos + 1] = src[pos + 1];
    result[pos + 2] = src[pos + 2];
    result[pos + 3] = dst[pos + 3]; //?
};

BlendModes.erase = function (src, dst, result, pos) {
    result[pos + 0] = src[pos + 0];
    result[pos + 1] = src[pos + 1];
    result[pos + 2] = src[pos + 2];
    result[pos + 3] = 255 - dst[pos + 3]; //?
};

BlendModes.overlay = function (src, dst, result, pos) {
    result[pos + 0] = dst[pos + 0] < 128 ? dst[pos + 0] * src[pos + 0] >> 7
            : 255 - ((255 - dst[pos + 0]) * (255 - src[pos + 0]) >> 7);
    result[pos + 1] = dst[pos + 1] < 128 ? dst[pos + 1] * src[pos + 1] >> 7
            : 255 - ((255 - dst[pos + 1]) * (255 - src[pos + 1]) >> 7);
    result[pos + 2] = dst[pos + 2] < 128 ? dst[pos + 2] * src[pos + 2] >> 7
            : 255 - ((255 - dst[pos + 2]) * (255 - src[pos + 2]) >> 7);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes.hardlight = function (src, dst, result, pos) {
    result[pos + 0] = src[pos + 0] < 128 ? dst[pos + 0] * src[pos + 0] >> 7
            : 255 - ((255 - src[pos + 0]) * (255 - dst[pos + 0]) >> 7);
    result[pos + 1] = src[pos + 1] < 128 ? dst[pos + 1] * src[pos + 1] >> 7
            : 255 - ((255 - src[pos + 1]) * (255 - dst[pos + 1]) >> 7);
    result[pos + 2] = src[pos + 2] < 128 ? dst[pos + 2] * src[pos + 2] >> 7
            : 255 - ((255 - src[pos + 2]) * (255 - dst[pos + 2]) >> 7);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes._list = [
    BlendModes.normal,
    BlendModes.normal,
    BlendModes.layer,
    BlendModes.multiply,
    BlendModes.screen,
    BlendModes.lighten,
    BlendModes.darken,
    BlendModes.difference,
    BlendModes.add,
    BlendModes.subtract,
    BlendModes.invert,
    BlendModes.alpha,
    BlendModes.erase,
    BlendModes.overlay,
    BlendModes.hardlight
];

BlendModes.blendData = function (srcPixel, dstPixel, retData, modeIndex) {
    var result = [];
    var retPixel = [];
    var alpha = 1.0;
    for (var i = 0; i < retData.length; i += 4) {
        this._list[modeIndex](srcPixel, dstPixel, result, i);

        retPixel[i + 0] = this._cut(dstPixel[i + 0] + (result[i + 0] - dstPixel[i + 0]) * alpha);
        retPixel[i + 1] = this._cut(dstPixel[i + 1] + (result[i + 1] - dstPixel[i + 1]) * alpha);
        retPixel[i + 2] = this._cut(dstPixel[i + 2] + (result[i + 2] - dstPixel[i + 2]) * alpha);
        retPixel[i + 3] = this._cut(dstPixel[i + 3] + (result[i + 3] - dstPixel[i + 3]) * alpha);

        var af = srcPixel[i + 3] / 255;
        retData[i + 0] = this._cut((1 - af) * dstPixel[i + 0] + af * retPixel[i + 0]);
        retData[i + 1] = this._cut((1 - af) * dstPixel[i + 1] + af * retPixel[i + 1]);
        retData[i + 2] = this._cut((1 - af) * dstPixel[i + 2] + af * retPixel[i + 2]);
        retData[i + 3] = this._cut((1 - af) * dstPixel[i + 3] + af * retPixel[i + 3]);
    }
};

BlendModes.blendCanvas = function (src, dst, result, modeIndex) {
    var width = src.width;
    var height = src.height;
    var rctx = result.getContext("2d");
    var sctx = src.getContext("2d");
    var dctx = dst.getContext("2d");
    var ridata = rctx.getImageData(0, 0, width, height);
    var sidata = sctx.getImageData(0, 0, width, height);
    var didata = dctx.getImageData(0, 0, width, height);

    this.blendData(sidata.data, didata.data, ridata.data, modeIndex);
    rctx.putImageData(ridata, 0, 0);
};


function concatMatrix(m1, m2) {
    var result = [1, 0, 0, 1, 0, 0];
    var scaleX = 0;
    var rotateSkew0 = 1;
    var rotateSkew1 = 2;
    var scaleY = 3;
    var translateX = 4;
    var translateY = 5;

    result[scaleX] = m2[scaleX] * m1[scaleX] + m2[rotateSkew1] * m1[rotateSkew0];
    result[rotateSkew0] = m2[rotateSkew0] * m1[scaleX] + m2[scaleY] * m1[rotateSkew0];
    result[rotateSkew1] = m2[scaleX] * m1[rotateSkew1] + m2[rotateSkew1] * m1[scaleY];
    result[scaleY] = m2[rotateSkew0] * m1[rotateSkew1] + m2[scaleY] * m1[scaleY];
    result[translateX] = m2[scaleX] * m1[translateX] + m2[rotateSkew1] * m1[translateY] + m2[translateX];
    result[translateY] = m2[rotateSkew0] * m1[translateX] + m2[scaleY] * m1[translateY] + m2[translateY];

    return result;
}

var enhanceContext = function (context) {
    var m = [1, 0, 0, 1, 0, 0];
    context._matrix = m;

    //the stack of saved matrices
    context._savedMatrices = [m]; //[[m]];

    var super_ = context.__proto__;
    context.__proto__ = ({
        save: function () {
            this._savedMatrices.push(this._matrix); //.slice()
            super_.save.call(this);
        },
        //if the stack of matrices we're managing doesn't have a saved matrix,
        //we won't even call the context's original `restore` method.
        restore: function () {
            if (this._savedMatrices.length == 0)
                return;
            super_.restore.call(this);
            this._matrix = this._savedMatrices.pop();
        },
        scale: function (x, y) {
            super_.scale.call(this, x, y);
        },
        rotate: function (theta) {
            super_.rotate.call(this, theta);
        },
        translate: function (x, y) {
            super_.translate.call(this, x, y);
        },
        transform: function (a, b, c, d, e, f) {
            this._matrix = concatMatrix([a, b, c, d, e, f], this._matrix);
            super_.transform.call(this, a, b, c, d, e, f);
        },
        setTransform: function (a, b, c, d, e, f) {
            this._matrix = [a, b, c, d, e, f];
            super_.setTransform.call(this, a, b, c, d, e, f);
        },
        resetTransform: function () {
            super_.resetTransform.call(this);
        },
        applyTransforms: function (m) {
            this.setTransform(m[0], m[1], m[2], m[3], m[4], m[5])
        },
        applyTransformToPoint: function (p) {
            var ret = {};
            ret.x = this._matrix[0] * p.x + this._matrix[2] * p.y + this._matrix[4];
            ret.y = this._matrix[1] * p.x + this._matrix[3] * p.y + this._matrix[5];
            return ret;
        },
        __proto__: super_
    });

    return context;
};
var cxform = function (r_add, g_add, b_add, a_add, r_mult, g_mult, b_mult, a_mult) {
    this.r_add = r_add;
    this.g_add = g_add;
    this.b_add = b_add;
    this.a_add = a_add;
    this.r_mult = r_mult;
    this.g_mult = g_mult;
    this.b_mult = b_mult;
    this.a_mult = a_mult;
    this._cut = function (v, min, max) {
        if (v < min)
            v = min;
        if (v > max)
            v = max;
        return v;
    };
    this.apply = function (c) {
        var d = c;
        d[0] = this._cut(Math.round(d[0] * this.r_mult / 255 + this.r_add), 0, 255);
        d[1] = this._cut(Math.round(d[1] * this.g_mult / 255 + this.g_add), 0, 255);
        d[2] = this._cut(Math.round(d[2] * this.b_mult / 255 + this.b_add), 0, 255);
        d[3] = this._cut(d[3] * this.a_mult / 255 + this.a_add / 255, 0, 1);
        return d;
    };
    this.applyToImage = function (fimg) {
        if (this.isEmpty()) {
            return fimg
        }
        ;
        var icanvas = createCanvas(fimg.width, fimg.height);
        var ictx = icanvas.getContext("2d");
        ictx.drawImage(fimg, 0, 0);
        var imdata = ictx.getImageData(0, 0, icanvas.width, icanvas.height);
        var idata = imdata.data;
        for (var i = 0; i < idata.length; i += 4) {
            var c = this.apply([idata[i], idata[i + 1], idata[i + 2], idata[i + 3] / 255]);
            idata[i] = c[0];
            idata[i + 1] = c[1];
            idata[i + 2] = c[2];
            idata[i + 3] = Math.round(c[3] * 255);
        }
        ictx.putImageData(imdata, 0, 0);
        return icanvas;
    };
    this.merge = function (cx) {
        return new cxform(this.r_add + cx.r_add, this.g_add + cx.g_add, this.b_add + cx.b_add, this.a_add + cx.a_add, this.r_mult * cx.r_mult / 255, this.g_mult * cx.g_mult / 255, this.b_mult * cx.b_mult / 255, this.a_mult * cx.a_mult / 255);
    };
    this.isEmpty = function () {
        return this.r_add == 0 && this.g_add == 0 && this.b_add == 0 && this.a_add == 0 && this.r_mult == 255 && this.g_mult == 255 && this.b_mult == 255 && this.a_mult == 255;
    };
};

var placeRaw = function (obj, canvas, ctx, matrix, ctrans, blendMode, frame, ratio, time) {
    ctx.save();
    ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    if (blendMode > 1) {
        var oldctx = ctx;
        var ncanvas = createCanvas(canvas.width, canvas.height);
        ctx = ncanvas.getContext("2d");
        enhanceContext(ctx);
        ctx.applyTransforms(oldctx._matrix);
    }
    if (blendMode > 1) {
        characters[obj](ctx,new cxform(0,0,0,0,255,255,255,255),frame,ratio,time);
    } else {
        characters[obj](ctx,ctrans,frame,ratio,time);
    }
    if (blendMode > 1) {
        BlendModes.blendCanvas(ctrans.applyToImage(ncanvas), canvas, canvas, blendMode);
        ctx = oldctx;
    }
    ctx.restore();
}

var transformPoint = function (matrix, p) {
    var ret = {};
    ret.x = matrix[0] * p.x + matrix[2] * p.y + matrix[4];
    ret.y = matrix[1] * p.x + matrix[3] * p.y + matrix[5];
    return ret;
}

var transformRect = function (matrix, rect) {
    var minX = Number.MAX_VALUE;
    var minY = Number.MAX_VALUE;
    var maxX = Number.MIN_VALUE;
    var maxY = Number.MIN_VALUE;
    var point = transformPoint(matrix, {x: rect.xMin, y: rect.yMin});
    if (point.x < minX) {
        minX = point.x;
    }
    if (point.x > maxX) {
        maxX = point.x;
    }
    if (point.y < minY) {
        minY = point.y;
    }
    if (point.y > maxY) {
        maxY = point.y;
    }
    point = transformPoint(matrix, {x: rect.xMax, y: rect.yMin});
    if (point.x < minX) {
        minX = point.x;
    }
    if (point.x > maxX) {
        maxX = point.x;
    }
    if (point.y < minY) {
        minY = point.y;
    }
    if (point.y > maxY) {
        maxY = point.y;
    }
    point = transformPoint(matrix, {x: rect.xMin, y: rect.yMax});
    if (point.x < minX) {
        minX = point.x;
    }
    if (point.x > maxX) {
        maxX = point.x;
    }
    if (point.y < minY) {
        minY = point.y;
    }
    if (point.y > maxY) {
        maxY = point.y;
    }
    point = transformPoint(matrix, {x: rect.xMax, y: rect.yMax});
    if (point.x < minX) {
        minX = point.x;
    }
    if (point.x > maxX) {
        maxX = point.x;
    }
    if (point.y < minY) {
        minY = point.y;
    }
    if (point.y > maxY) {
        maxY = point.y;
    }
    return {xMin: minX, xMax: maxX, yMin: minY, yMax: maxY};
}

var getTranslateMatrix = function (translateX, translateY) {
    return [1, 0, 0, 1, translateX, translateY];
}

var getRectWidth = function (rect) {
    return rect.xMax - rect.xMin;
}

var getRectHeight = function (rect) {
    return rect.yMax - rect.yMin;
}

var rint = function (v) {
    return Math.round(v);
}

var scaleMatrix = function (m, factorX, factorY) {
    var scaleX = 0;
    var rotateSkew0 = 1;
    var rotateSkew1 = 2;
    var scaleY = 3;
    var translateX = 4;
    var translateY = 5;

    var m2 = Object.assign({}, m);

    m2[scaleX] *= factorX;
    m2[scaleY] *= factorY;
    m2[rotateSkew0] *= factorX;
    m2[rotateSkew1] *= factorY;
    return m2;
}

var translateMatrix = function (m, x, y) {
    var m2 = Object.assign({}, m);
    var scaleX = 0;
    var rotateSkew0 = 1;
    var rotateSkew1 = 2;
    var scaleY = 3;
    var translateX = 4;
    var translateY = 5;

    m2[translateX] = m2[scaleX] * x + m2[rotateSkew1] * y + m2[translateX];
    m2[translateY] = m2[rotateSkew0] * x + m2[scaleY] * y + m2[translateY];

    return m2;
}

var place = function (obj, canvas, ctx, matrix, ctrans, blendMode, frame, ratio, time) {
    if ((typeof scalingGrids[obj]) !== "undefined") {
        var swfScaleMatrix = [1 / 20, 0, 0, 1 / 20, 0, 0];
        var boundRect = boundRects[obj];
        var scalingRect = scalingGrids[obj];
        var exRect = boundRect;
        var newRect = exRect;
        var transform = matrix;

        var transform2;
        newRect = transformRect(transform, exRect);
        transform = Object.assign({}, transform);

        transform = getTranslateMatrix(newRect.xMin, newRect.yMin);

        transform = concatMatrix(swfScaleMatrix, transform);

        var scaleWidth = getRectWidth(newRect) * 20 - scalingRect.xMin - (boundRect.xMax - scalingRect.xMax);
        var originalWidth = getRectWidth(boundRect) - scalingRect.xMin - (boundRect.xMax - scalingRect.xMax);
        var scaleX = scaleWidth / originalWidth;

        var scaleHeight = getRectHeight(newRect) * 20 - scalingRect.yMin - (boundRect.yMax - scalingRect.yMax);
        var originalHeight = getRectHeight(boundRect) - scalingRect.yMin - (boundRect.yMax - scalingRect.yMax);
        var scaleY = scaleHeight / originalHeight;


        //top left
        ctx.save();
        drawPath(ctx, ""
                + "M " + newRect.xMin + " " + newRect.yMin + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + newRect.yMin + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + newRect.xMin + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " Z"
                );
        ctx.clip();
        placeRaw(obj, canvas, ctx, transform, ctrans, blendMode, frame, ratio, time);

        ctx.restore();

        //bottom left
        transform2 = Object.assign({}, transform);
        transform2[5] /*translateY*/ += getRectHeight(newRect) - getRectHeight(boundRect) / 20;

        ctx.save();

        drawPath(ctx, "M " + newRect.xMin + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + newRect.yMax + " "
                + "L " + newRect.xMin + " " + newRect.yMax + " Z"
                )
        ctx.clip();

        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();

        //top right
        transform2 = Object.assign({}, transform);
        transform2[4] /*translateX*/ += getRectWidth(newRect) - getRectWidth(boundRect) / 20;
        ctx.save();
        drawPath(ctx, "M " + (newRect.xMax - rint((exRect.xMax - scalingRect.xMax) / 20)) + " " + newRect.yMin + " "
                + "L " + newRect.xMax + " " + newRect.yMin + " "
                + "L " + newRect.xMax + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + (newRect.xMax - rint((exRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " Z");

        ctx.clip();

        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();

        //bottom right
        transform2 = Object.assign({}, transform);
        transform2[4] /*translateX*/ += getRectWidth(newRect) - getRectWidth(boundRect) / 20;
        transform2[5] /*translateY*/ += getRectHeight(newRect) - getRectHeight(boundRect) / 20;
        ctx.save();
        drawPath(ctx, "M " + (newRect.xMax - rint((exRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + newRect.xMax + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + newRect.xMax + " " + newRect.yMax + " "
                + "L " + (newRect.xMax - rint((exRect.xMax - scalingRect.xMax) / 20)) + " " + newRect.yMax + " Z");

        ctx.clip();

        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();


        //top
        transform2 = Object.assign({}, transform);
        ctx.save();
        transform2 = translateMatrix(transform2, scalingRect.xMin, 0);
        transform2 = scaleMatrix(transform2, scaleX, 1);
        transform2 = translateMatrix(transform2, -scalingRect.xMin, 0);

        drawPath(ctx, "M " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + newRect.yMin + " "
                + "L " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + newRect.yMin + " "
                + "L " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " Z");

        ctx.clip();
        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();

        //left
        transform2 = Object.assign({}, transform);
        ctx.save();
        transform2 = translateMatrix(transform2, 0, scalingRect.yMin);
        transform2 = scaleMatrix(transform2, 1, scaleY);
        transform2 = translateMatrix(transform2, 0, -scalingRect.yMin);

        drawPath(ctx, "M " + newRect.xMin + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + newRect.xMin + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " Z");

        ctx.clip();
        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();

        //bottom
        transform2 = Object.assign({}, transform);
        ctx.save();
        transform2 = translateMatrix(transform2, scalingRect.xMin, 0);
        transform2 = scaleMatrix(transform2, scaleX, 1);
        transform2 = translateMatrix(transform2, -scalingRect.xMin, 0);

        transform2 = translateMatrix(transform2, 0, getRectHeight(newRect) * 20 - getRectHeight(boundRect));

        drawPath(ctx, "M " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + newRect.yMax + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + newRect.yMax + " Z");

        ctx.clip();
        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();

        //right
        transform2 = Object.assign({}, transform);
        ctx.save();
        transform2 = translateMatrix(transform2, 0, scalingRect.yMin)
        transform2 = scaleMatrix(transform2, 1, scaleY);
        transform2 = translateMatrix(transform2, 0, -scalingRect.yMin);

        transform2 = translateMatrix(transform2, getRectWidth(newRect) * 20 - getRectWidth(boundRect), 0);

        drawPath(ctx, "M " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + newRect.xMax + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + newRect.xMax + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " Z");

        ctx.clip();
        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();

        //center
        transform2 = Object.assign({}, transform);
        ctx.save();
        transform2 = translateMatrix(transform2, scalingRect.xMin, scalingRect.yMin)
        transform2 = scaleMatrix(transform2, scaleX, scaleY);
        transform2 = translateMatrix(transform2, -scalingRect.xMin, -scalingRect.yMin);

        drawPath(ctx, "M " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " Z");

        ctx.clip();
        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();
        return;
    }
    placeRaw(obj, canvas, ctx, matrix, ctrans, blendMode, frame, ratio, time);
}

var tocolor = function (c) {
    var r = "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + c[3] + ")";
    return r;
};


function drawMorphPath(ctx, p, ratio, doStroke, scaleMode) {
    var parts = p.split(" ");
    var len = parts.length;
    if (doStroke) {
        for (var i = 0; i < len; i++) {
            switch (parts[i]) {
                case '':
                    break;
                case 'L':
                case 'M':
                case 'Q':
                    break;
                default:
                    var k = ctx.applyTransformToPoint({x: parts[i], y: parts[i + 2]});
                    parts[i] = k.x;
                    parts[i + 2] = k.y;
                    k = ctx.applyTransformToPoint({x: parts[i + 1], y: parts[i + 3]});
                    parts[i + 1] = k.x;
                    parts[i + 3] = k.y;
                    i += 3;
            }
        }

        switch (scaleMode) {
            case "NONE":
                break;
            case "NORMAL":
                ctx.lineWidth *= 20 * Math.max(ctx._matrix[0], ctx._matrix[3]);
                break;
            case "VERTICAL":
                ctx.lineWidth *= 20 * ctx._matrix[3];
                break;
            case "HORIZONTAL":
                ctx.lineWidth *= 20 * ctx._matrix[0];
                break;
        }

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.beginPath();
    var drawCommand = "";
    for (var i = 0; i < len; i++) {
        switch (parts[i]) {
            case 'L':
            case 'M':
            case 'Q':
                drawCommand = parts[i];
                break;
            default:
                switch (drawCommand) {
                    case 'L':
                        ctx.lineTo(useRatio(parts[i], parts[i + 1], ratio), useRatio(parts[i + 2], parts[i + 3], ratio));
                        i += 3;
                        break;
                    case 'M':
                        ctx.moveTo(useRatio(parts[i], parts[i + 1], ratio), useRatio(parts[i + 2], parts[i + 3], ratio));
                        i += 3;
                        break;
                    case 'Q':
                        ctx.quadraticCurveTo(useRatio(parts[i], parts[i + 1], ratio), useRatio(parts[i + 2], parts[i + 3], ratio),
                                useRatio(parts[i + 4], parts[i + 5], ratio), useRatio(parts[i + 6], parts[i + 7], ratio));
                        i += 7;
                        break;
                }
                break;
        }
    }
    if (doStroke) {
        ctx.stroke();
        ctx.restore();
    }
}

function useRatio(v1, v2, ratio) {
    return v1 * 1 + (v2 - v1) * ratio / 65535;
}

function drawPath(ctx, p, doStroke, scaleMode) {
//console.log("drawing "+p)
    var parts = p.split(" ");
    var len = parts.length;
    if (doStroke) {
        for (var i = 0; i < len; i++) {
            switch (parts[i]) {
                case 'L':
                case 'M':
                case 'Q':
                case 'Z':
                    break;
                default:
                    var k = ctx.applyTransformToPoint({x: parts[i], y: parts[i + 1]});
                    parts[i] = k.x;
                    parts[i + 1] = k.y;
                    i++;
            }
        }

        switch (scaleMode) {
            case "NONE":
                break;
            case "NORMAL":
                ctx.lineWidth *= 20 * Math.max(ctx._matrix[0], ctx._matrix[3]);
                break;
            case "VERTICAL":
                ctx.lineWidth *= 20 * ctx._matrix[3];
                break;
            case "HORIZONTAL":
                ctx.lineWidth *= 20 * ctx._matrix[0];
                break;
        }

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.beginPath();
    var drawCommand = "";
    for (var i = 0; i < len; i++) {
        switch (parts[i]) {
            case 'L':
            case 'M':
            case 'Q':
                drawCommand = parts[i];
                break;
            case 'Z':
                ctx.closePath();
                break;
            default:
                switch (drawCommand) {
                    case 'L':
                        ctx.lineTo(parts[i], parts[i + 1]);
                        i++;
                        break;
                    case 'M':
                        ctx.moveTo(parts[i], parts[i + 1]);
                        i++;
                        break;
                    case 'Q':
                        ctx.quadraticCurveTo(parts[i], parts[i + 1], parts[i + 2], parts[i + 3]);
                        i += 3;
                        break;
                }
                break;
        }
    }
    if (doStroke) {
        ctx.stroke();
        ctx.restore();
    }
}
var ctx=canvas.getContext("2d");
enhanceContext(ctx);
var ctrans = new cxform(0,0,0,0,255,255,255,255);

var scalingGrids = {};
var boundRects = {};
function shape1(ctx,ctrans,frame,ratio,time){
	var pathData="M 6080 45617 L -20 45617 -20 -41 6080 -41 6080 45617";
	ctx.fillStyle=tocolor(ctrans.apply([0,153,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function font2(ctx,ch,textColor){
	defaultFill = textColor;
	switch(ch){
		case " ":
			break;
		case ".":
			var pathData="M 20 -164 L 20 -164 20 0 172 0 172 -164 20 -164";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "a":
			var pathData="M 280 -178 L 280 -178 275 -116 Q 270 -104 252 -104 233 -104 227 -119 220 -134 220 -186 220 -232 228 -256 235 -281 280 -317 L 280 -178 M 220 -477 L 220 -477 Q 220 -533 225 -546 230 -560 249 -560 266 -560 273 -544 280 -528 280 -476 280 -434 273 -421 266 -407 167 -368 75 -332 52 -305 28 -278 28 -203 L 28 -148 Q 28 -47 72 -18 116 12 168 12 208 12 237 -6 266 -23 284 -59 L 284 0 484 0 484 -333 Q 484 -498 474 -550 463 -603 411 -639 359 -676 257 -676 171 -676 117 -644 64 -612 46 -570 28 -529 28 -452 L 28 -408 220 -408 220 -477";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "c":
			var pathData="M 484 -412 L 484 -412 Q 484 -506 466 -557 447 -608 391 -642 335 -676 257 -676 177 -676 122 -642 66 -608 49 -565 32 -522 32 -438 L 32 -249 Q 32 -152 53 -99 74 -46 124 -17 174 12 259 12 326 12 371 -9 417 -30 445 -72 473 -113 479 -153 L 484 -272 304 -272 304 -192 Q 304 -141 297 -122 290 -104 271 -104 254 -104 245 -122 236 -139 236 -175 L 236 -491 Q 236 -535 242 -547 247 -560 264 -560 280 -560 286 -545 292 -531 292 -490 L 292 -412 484 -412";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "e":
			var pathData="M 236 -428 L 236 -428 236 -477 Q 236 -534 241 -547 245 -560 264 -560 279 -560 283 -545 L 288 -477 288 -428 236 -428 M 492 -408 L 492 -408 Q 492 -504 470 -558 448 -611 393 -643 338 -676 254 -676 185 -676 132 -649 79 -622 56 -572 32 -522 32 -435 L 32 -241 Q 32 -167 43 -128 53 -89 80 -57 107 -25 156 -6 204 12 268 12 333 12 377 -6 420 -25 449 -62 477 -100 485 -133 492 -166 492 -227 L 492 -276 300 -276 300 -188 Q 300 -138 293 -121 286 -104 265 -104 248 -104 242 -117 236 -130 236 -175 L 236 -320 492 -320 492 -408";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "g":
			var pathData="M 292 -278 L 292 -278 287 -204 Q 281 -188 263 -188 246 -188 241 -201 236 -215 236 -260 L 236 -488 Q 236 -531 243 -545 250 -560 266 -560 283 -560 287 -547 L 292 -488 292 -278 M 308 -664 L 308 -664 292 -613 Q 268 -645 237 -660 206 -676 168 -676 100 -676 66 -634 32 -592 32 -497 L 32 -254 Q 32 -188 45 -152 58 -116 93 -94 128 -72 182 -72 213 -72 242 -84 270 -96 296 -119 L 296 -70 Q 296 -27 289 -13 282 0 259 0 228 0 228 -44 L 32 -44 Q 34 51 93 84 151 116 247 116 326 116 377 98 429 81 458 47 487 13 492 -17 496 -48 496 -151 L 496 -664 308 -664";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "h":
			var pathData="M 36 -808 L 36 -808 36 0 240 0 240 -475 Q 240 -526 246 -543 253 -560 270 -560 289 -560 295 -543 L 300 -468 300 0 504 0 504 -458 Q 504 -551 496 -586 488 -622 451 -649 414 -676 361 -676 326 -676 296 -664 266 -652 240 -627 L 240 -808 36 -808";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "m":
			var pathData="M 36 -664 L 36 -664 36 0 232 0 232 -461 233 -524 Q 234 -539 243 -549 253 -560 266 -560 287 -560 292 -540 296 -521 296 -423 L 296 0 492 0 492 -434 Q 492 -520 498 -540 504 -560 525 -560 545 -560 551 -539 L 556 -434 556 0 752 0 752 -472 Q 752 -553 743 -589 733 -626 700 -651 667 -676 616 -676 577 -676 545 -657 514 -638 488 -601 442 -676 362 -676 320 -676 288 -657 256 -638 232 -601 L 236 -664 36 -664";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "n":
			var pathData="M 36 -664 L 36 -664 36 0 240 0 240 -450 Q 240 -525 246 -542 251 -560 272 -560 292 -560 296 -545 300 -530 300 -461 L 300 0 504 0 504 -465 Q 504 -552 495 -589 485 -627 452 -651 419 -676 367 -676 326 -676 294 -657 262 -639 240 -603 L 244 -664 36 -664";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "o":
			var pathData="M 288 -173 L 288 -173 283 -117 Q 278 -104 262 -104 247 -104 242 -118 236 -132 236 -180 L 236 -482 Q 236 -533 242 -546 247 -560 263 -560 279 -560 283 -546 L 288 -482 288 -173 M 492 -431 L 492 -431 Q 492 -501 483 -536 473 -570 447 -603 420 -635 372 -655 323 -676 256 -676 175 -676 124 -644 72 -613 52 -561 32 -509 32 -416 L 32 -246 Q 32 -161 43 -119 54 -77 80 -47 105 -17 151 -2 L 264 12 Q 324 12 370 -5 416 -22 445 -59 474 -95 483 -137 492 -178 492 -268 L 492 -431";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "r":
			var pathData="M 36 -664 L 36 -664 36 0 240 0 240 -263 Q 240 -360 246 -387 252 -414 278 -429 305 -444 360 -444 L 360 -676 Q 276 -670 232 -575 L 240 -664 36 -664";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "s":
			var pathData="M 452 -490 L 452 -490 447 -564 Q 442 -587 417 -615 392 -642 345 -659 298 -676 231 -676 164 -676 113 -655 63 -635 41 -597 20 -559 20 -479 20 -423 40 -382 60 -341 150 -291 257 -232 269 -220 280 -208 280 -160 280 -125 271 -115 262 -104 240 -104 219 -104 211 -120 204 -136 204 -190 L 204 -232 24 -232 24 -200 Q 24 -117 45 -76 66 -36 121 -12 177 12 255 12 326 12 376 -10 426 -32 447 -74 468 -115 468 -196 468 -269 440 -307 412 -345 323 -389 256 -421 234 -438 213 -455 209 -470 204 -484 204 -515 204 -537 213 -548 222 -560 240 -560 261 -560 267 -547 L 272 -488 272 -452 452 -452 452 -490";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "t":
			var pathData="M 48 -752 L 48 -752 48 -648 4 -648 4 -544 48 -544 48 -206 Q 48 -107 54 -80 59 -53 82 -32 104 -11 133 -6 L 231 0 312 0 312 -108 259 -115 Q 252 -123 252 -188 L 252 -544 304 -544 304 -648 252 -648 252 -752 48 -752";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "u":
			var pathData="M 296 -664 L 296 -664 296 -216 Q 296 -134 292 -119 288 -104 266 -104 246 -104 241 -118 236 -133 236 -211 L 236 -664 32 -664 32 -216 Q 32 -130 36 -102 39 -73 54 -46 68 -20 98 -4 128 12 174 12 214 12 244 -5 275 -21 296 -55 L 293 0 500 0 500 -664 296 -664";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
	}
}

function text3(ctx,ctrans,frame,ratio,time){
	var textColor = tocolor(ctrans.apply([153,153,153,1]));
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,0.0,240.0);
	font2(ctx,"c",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,119.0,240.0);
	font2(ctx,"h",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,244.0,240.0);
	font2(ctx,"a",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,365.0,240.0);
	font2(ctx,"r",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,451.0,240.0);
	font2(ctx,"g",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,575.0,240.0);
	font2(ctx,"e",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,698.0,240.0);
	font2(ctx,"m",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,883.0,240.0);
	font2(ctx,"e",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,1006.0,240.0);
	font2(ctx,"n",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,1131.0,240.0);
	font2(ctx,"t",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,1204.0,240.0);
	font2(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,1246.0,240.0);
	font2(ctx,"e",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,1369.0,240.0);
	font2(ctx,"n",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,1494.0,240.0);
	font2(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,1536.0,240.0);
	font2(ctx,"c",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,1655.0,240.0);
	font2(ctx,"o",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,1777.0,240.0);
	font2(ctx,"u",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,1902.0,240.0);
	font2(ctx,"r",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,1988.0,240.0);
	font2(ctx,"s",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,2101.0,240.0);
	font2(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,2143.0,240.0);
	font2(ctx,".",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,2188.0,240.0);
	font2(ctx,".",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.234375,0.0,0.0,0.234375,2233.0,240.0);
	font2(ctx,".",textColor);
	ctx.restore();
}

function text4(ctx,ctrans,frame,ratio,time){
}

function sprite5(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 3;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("text3",canvas,ctx,[1.0,0.0,0.0,1.0,-2340.0,-176.0],ctrans,1,0,0,time);
			place("text4",canvas,ctx,[1.2142791748046875,0.0,0.0,1.0,56.0,-167.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("text3",canvas,ctx,[1.0,0.0,0.0,1.0,-2340.0,-176.0],ctrans,1,0,0,time);
			place("text4",canvas,ctx,[1.2142791748046875,0.0,0.0,1.0,56.0,-167.0],ctrans,1,0,0,time);
			break;
		case 2:
			place("text3",canvas,ctx,[1.0,0.0,0.0,1.0,-2340.0,-176.0],ctrans,1,0,0,time);
			place("text4",canvas,ctx,[1.2142791748046875,0.0,0.0,1.0,56.0,-167.0],ctrans,1,0,0,time);
			break;
	}
}

function shape6(ctx,ctrans,frame,ratio,time){
	var pathData="M 6102 41555 L -52 41555 -52 -10 6102 -10 6102 41555";
	var grd=ctx.createLinearGradient(3025.0,-9.5,3025.0,41555.5);
	grd.addColorStop(0.0,tocolor(ctrans.apply([0,153,255,1])));
	grd.addColorStop(0.16862745098039217,tocolor(ctrans.apply([0,153,255,1])));
	grd.addColorStop(0.7176470588235294,tocolor(ctrans.apply([102,102,102,1])));
	grd.addColorStop(1.0,tocolor(ctrans.apply([51,51,51,1])));
	ctx.fillStyle = grd;
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 6093 45619 L -52 45619 -52 41555 6093 41555 6093 45619";
	ctx.fillStyle=tocolor(ctrans.apply([51,51,51,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -140 28520 L -140 26994 Q 281 27105 566 27476 627 27555 661 27644 777 27538 931 27456 1452 27178 2035 27216 L 2165 27228 Q 2248 26504 2947 26283 2992 26269 3035 26248 3105 25680 3507 25260 3773 24983 4155 24913 4109 24289 4631 23939 4761 23852 4904 23786 L 4980 23753 Q 4931 23263 4948 22763 4960 22425 5066 22109 5107 21987 5173 21875 5299 21663 5500 21554 5740 21584 5610 21789 5519 21933 5440 22088 5302 22359 5303 22668 5304 23223 5389 23761 L 5399 23868 Q 5405 24059 5238 24122 5227 24152 5198 24188 5190 24198 5175 24203 4776 24581 4689 25132 4618 25578 4600 26019 4598 26086 4581 26151 4565 26213 4505 26243 4378 26218 4352 26108 L 4351 26112 Q 4228 26690 4209 27284 4200 27567 4145 27838 L 4172 28198 Q 4174 28240 4150 28273 4172 28400 4181 28529 4183 28562 4155 28583 L 4145 28586 4085 28583 3992 28302 Q 3987 28353 3950 28398 3779 28384 3756 28194 L 3745 28148 Q 3610 27995 3604 27773 3602 27681 3589 27591 3566 27430 3561 27270 L 3556 27324 Q 3506 27920 3635 28490 3658 28596 3649 28702 3643 28770 3580 28803 3536 28799 3500 28785 3565 29094 3653 29387 3660 29408 3640 29420 3476 29518 3404 29327 3369 29235 3319 29150 L 3311 29136 Q 3330 29211 3362 29283 3385 29334 3389 29380 L 3437 29480 Q 3449 29503 3438 29532 L 3425 29563 Q 3435 29590 3456 29612 L 3490 29653 3483 29667 3470 29683 3445 29683 3411 29652 3385 29623 Q 3153 29635 3048 29393 L 3008 29307 Q 2736 28770 2752 28173 2764 27731 2882 27302 2967 26990 3074 26692 L 3064 26695 Q 2603 26826 2577 27304 2564 27533 2433 27706 2425 27716 2414 27717 2201 27749 2003 27642 1922 27599 1830 27609 1204 27681 807 28138 771 28179 762 28234 718 28490 663 28740 634 28867 644 28997 656 29144 555 29248 L 448 29265 556 29465 Q 639 29612 520 29718 318 29735 270 29523 259 29479 225 29448 L 210 29443 Q 198 29443 187 29450 L 185 29453 75 29453 Q -67 29329 -15 29119 -8 29090 -18 29059 -74 28877 -74 28688 -75 28635 -82 28582 L -140 28520 M 3150 27594 Q 3164 27542 3183 27492 L 3190 27475 3194 27372 Q 3169 27483 3150 27594";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,0.08235294]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape7(ctx,ctrans,frame,ratio,time){
	var pathData="M 839 -839 Q 1187 -491 1187 0 1187 491 839 839 491 1187 -1 1187 -492 1187 -840 839 -1188 491 -1188 0 -1188 -491 -840 -839 -492 -1187 -1 -1187 491 -1187 839 -839";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([255,204,0,0.0]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.0736083984375,0,0,0.0736083984375,-1,0);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.43137254901960786,tocolor(ctrans.apply([255,204,0,1])));
	grd.addColorStop(0.984313725490196,tocolor(ctrans.apply([255,204,0,0.0])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
}

function shape8(ctx,ctrans,frame,ratio,time){
	var pathData="M -936 17878 L -928 17889 Q -1016 18142 -1072 18402 L -1070 18401 -1054 18397 Q -984 18467 -1021 18584 -1042 18650 -1047 18720 -1069 19090 -1012 19453 -969 19725 -913 19995 -838 20357 -725 20711 L -715 20740 Q -439 21099 -258 21515 L -207 21638 Q -26 22093 -141 22571 L -190 22776 -190 22859 Q -194 23231 -259 23594 -305 23850 -360 24104 L -359 24125 -364 24136 -368 24142 -409 24319 Q -494 24677 -631 25022 -665 25108 -709 25189 L -793 25354 -788 25352 -777 25350 Q -751 25457 -786 25570 -792 25590 -778 25611 -673 25766 -501 25865 -480 25878 -464 25901 -279 26176 -578 26346 -796 26412 -896 26234 -955 26044 -790 25960 -717 25922 -670 25984 L -633 26031 Q -627 26049 -630 26067 L -633 26079 Q -677 26147 -749 26183 L -789 26179 Q -775 26217 -721 26234 -613 26249 -530 26171 -460 25976 -662 25874 -880 25764 -884 25564 L -921 25662 Q -952 25751 -970 25843 -963 25885 -967 25924 -943 25976 -933 26031 L -934 26040 Q -902 26067 -914 26106 L -915 26124 -977 26124 -996 26105 -1005 26096 -1038 26079 -1045 26086 -1043 26095 -1049 26118 -1055 26131 Q -1077 26152 -1107 26138 L -1155 26167 Q -1456 26177 -1476 25892 -1488 25708 -1461 25532 -1666 25553 -1788 25737 L -1807 25856 -1804 25892 Q -1796 25917 -1776 25936 L -1772 25920 -1768 25908 Q -1624 25778 -1516 25929 -1461 26005 -1493 26091 -1669 26248 -1807 26056 -1924 25893 -1868 25701 -1712 25466 -1446 25452 -1413 25290 -1346 25134 -1244 24897 -1072 24701 -939 24551 -817 24394 -691 24175 -589 23944 -507 23760 -459 23566 -456 23399 -431 23230 -413 23109 -377 22990 L -350 22897 -346 22732 Q -342 22365 -445 22016 -553 21646 -679 21280 -751 21072 -812 20862 L -913 20724 Q -1210 20332 -1249 19838 -1277 19494 -1277 19144 -1277 18670 -1136 18224 -1077 18035 -976 17870 L -968 17867 -948 17866 -936 17878 M -1153 19163 Q -1142 19638 -1033 20096 -1001 20232 -947 20358 L -985 20192 Q -1063 19841 -1117 19485 -1142 19325 -1153 19163 M -507 21355 L -485 21415 Q -358 21765 -272 22126 L -258 22188 Q -265 21834 -424 21514 -464 21433 -507 21355 M -586 24289 L -903 24694 Q -1020 24883 -1109 25086 -1168 25220 -1177 25366 L -1180 25458 Q -1118 25452 -1057 25434 -991 25277 -907 25126 -717 24786 -617 24408 L -586 24289 M -1318 25533 L -1343 25532 -1360 25637 Q -1386 25842 -1301 26013 -1282 26051 -1238 26055 L -1151 26049 Q -1257 25801 -1266 25533 L -1318 25533 M -1266 25461 Q -1265 25347 -1246 25231 -1290 25333 -1321 25442 L -1325 25456 -1266 25461 M -1144 25692 L -1117 25588 -1084 25501 -1179 25524 -1164 25699 Q -1155 25694 -1144 25692 M -2252 24252 Q -2199 24420 -2217 24597 -2221 24640 -2237 24681 -2319 24894 -2466 25079 -2529 25159 -2576 25248 -2757 25594 -2635 25956 -2616 26013 -2577 26049 -2625 25876 -2445 25796 -2415 25783 -2382 25782 -2120 25776 -2109 26019 -2104 26114 -2177 26186 -2401 26406 -2652 26220 -2813 26101 -2849 25897 -2915 25525 -2746 25186 -2615 24922 -2435 24690 -2351 24582 -2363 24447 -2373 24339 -2406 24234 -2449 24099 -2416 23973 L -2406 23956 -2400 23954 -2382 23952 -2382 23950 Q -2298 24008 -2281 24122 -2272 24189 -2252 24252 M -1732 25991 Q -1732 26018 -1704 26051 -1647 26089 -1577 26071 L -1565 26059 Q -1565 26040 -1558 26023 L -1553 26011 -1592 25951 -1597 25944 Q -1650 25921 -1700 25944 -1719 25958 -1726 25979 L -1732 25991 M -2385 25962 Q -2447 26032 -2528 26076 L -2543 26083 Q -2370 26195 -2267 26009 -2305 25943 -2385 25962 M -1154 25764 L -1153 25768 -1153 25764 -1154 25764";
	ctx.fillStyle=tocolor(ctrans.apply([39,39,39,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -1253 25581 Q -1098 25600 -1051 25758 L -1013 25890 Q -903 25887 -934 25990 -944 26025 -983 26027 -983 26139 -856 26137 L -717 26136 -693 26115 Q -678 26100 -670 26080 L -664 26061 Q -709 25962 -816 25902 L -854 25876 Q -1050 25724 -984 25503 -955 25403 -856 25385 -622 25359 -550 25572 -535 25617 -574 25649 -668 25662 -707 25568 -722 25533 -761 25527 L -837 25522 Q -917 25651 -774 25752 -646 25841 -554 25956 -491 26035 -524 26126 -563 26237 -667 26294 -836 26330 -981 26259 -1041 26230 -1075 26189 L -1078 26191 Q -1093 26207 -1123 26197 -1163 26184 -1159 26142 -1140 25924 -1247 25733 -1329 25824 -1300 25965 -1270 26108 -1395 26103 -1419 26102 -1421 26076 -1442 25870 -1447 25667 -1448 25641 -1420 25633 -1388 25624 -1361 25646 L -1290 25595 Q -1271 25581 -1253 25581 M -1484 25733 L -1485 25742 Q -1607 25919 -1823 25974 -1719 26093 -1551 26064 L -1535 26055 -1520 26055 -1511 26065 -1507 26074 -1514 26082 -1526 26092 -1538 26102 Q -1536 26191 -1634 26188 -1675 26187 -1712 26202 -1754 26219 -1797 26201 -2039 26097 -1983 25847 L -1964 25799 Q -1849 25595 -1613 25605 -1487 25620 -1484 25733 M -1613 25717 Q -1738 25731 -1810 25830 L -1814 25838 Q -1780 25850 -1701 25821 -1631 25794 -1585 25739 L -1597 25724 Q -1603 25719 -1613 25717 M -2555 25147 Q -2453 24946 -2298 24799 L -2264 24802 Q -2207 24903 -2299 25005 -2334 25045 -2362 25093 -2539 25398 -2598 25743 -2622 25885 -2540 26002 -2433 25981 -2341 25922 L -2285 25928 -2274 25924 -2258 25915 -2258 25923 -2273 25943 Q -2276 26049 -2381 26108 -2445 26145 -2519 26149 -2659 26158 -2710 26022 -2823 25716 -2683 25412 L -2555 25147 M -2110 25399 Q -2098 25386 -2078 25384 L -2034 25382 Q -1898 25417 -1975 25534 -2006 25581 -2062 25558 -2208 25498 -2110 25399 M -2109 25608 Q -1968 25624 -2017 25760 -2056 25871 -2081 25984 -1995 26050 -2066 26126 -2104 26165 -2155 26138 -2299 26062 -2250 25901 -2206 25755 -2126 25629 L -2109 25608";
	ctx.fillStyle=tocolor(ctrans.apply([255,204,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 143 -20608 Q 154 -20626 159 -20651 L 151 -20660 138 -20672 105 -20676 101 -20675 101 -20676 Q 87 -20703 63 -20713 -296 -20875 -704 -20893 L -951 -20911 -1721 -20942 -2296 -20923 -2493 -20904 -2610 -20891 -2786 -20866 -2795 -20864 Q -2980 -20855 -3142 -20796 L -3226 -20772 -3233 -20774 Q -3342 -20793 -3389 -20709 -3410 -20698 -3428 -20684 L -3448 -20690 -3448 -20688 Q -3501 -20701 -3527 -20658 -3546 -20628 -3534 -20593 -3545 -20555 -3527 -20520 -3505 -20483 -3503 -20440 -3501 -20398 -3492 -20360 L -3491 -20359 Q -3476 -20298 -3440 -20249 -3418 -20221 -3409 -20187 -3401 -20153 -3406 -20118 -3445 -19864 -3364 -19745 -3332 -19705 -3326 -19654 -3309 -19494 -3274 -19394 L -3274 -19392 -3268 -19376 -3268 -19374 -3230 -19262 Q -3218 -19226 -3222 -19188 -3226 -19150 -3246 -19117 -3283 -19056 -3278 -19013 -3263 -18985 -3226 -18960 -3199 -18942 -3180 -18915 -3136 -18850 -3111 -18774 L -3111 -18773 Q -3078 -18672 -3084 -18551 -3086 -18513 -3103 -18481 L -3094 -18453 Q -3087 -18415 -3096 -18377 L -3103 -18347 -3103 -18345 Q -3124 -18250 -3130 -18154 L -3133 -18017 -3133 -18015 -3132 -17964 Q -3130 -17898 -3174 -17846 -3218 -17795 -3283 -17787 -3350 -17779 -3405 -17817 L -3443 -17844 -3441 -17842 -3530 -17901 -3661 -17987 Q -3716 -18040 -3803 -18061 L -3803 -18065 -3803 -18173 -3802 -18185 -3799 -18183 -3678 -18102 -3483 -17974 -3484 -17974 -3392 -17914 -3393 -17914 -3355 -17887 Q -3327 -17868 -3294 -17872 -3261 -17877 -3239 -17902 -3218 -17928 -3219 -17961 L -3220 -18015 -3220 -18016 -3216 -18160 -3216 -18161 Q -3209 -18264 -3187 -18366 L -3187 -18364 -3180 -18398 Q -3175 -18417 -3179 -18435 -3183 -18454 -3195 -18470 -3206 -18485 -3198 -18496 -3172 -18521 -3170 -18555 -3165 -18660 -3193 -18747 -3214 -18811 -3252 -18866 L -3275 -18889 Q -3337 -18931 -3359 -18982 -3383 -19059 -3320 -19162 -3310 -19179 -3308 -19197 -3306 -19216 -3312 -19234 L -3350 -19348 -3350 -19347 -3356 -19364 -3356 -19365 Q -3393 -19473 -3412 -19644 -3415 -19670 -3431 -19690 -3537 -19829 -3491 -20131 -3489 -20148 -3493 -20165 -3498 -20183 -3508 -20197 -3556 -20259 -3575 -20338 -3587 -20384 -3589 -20436 -3590 -20458 -3601 -20476 -3651 -20562 -3600 -20659 L -3597 -20665 -3596 -20666 -3593 -20673 Q -3570 -20700 -3459 -20766 -3330 -20843 -3122 -20890 -2902 -20940 -2621 -20977 -2341 -21014 -2054 -21019 -1764 -21023 -1521 -21018 L -1520 -21018 -999 -20992 Q -725 -20969 -442 -20927 -176 -20887 -33 -20813 L 139 -20720 154 -20711 155 -20711 181 -20694 180 -20694 Q 184 -20692 187 -20689 L 186 -20690 192 -20684 196 -20679 Q 207 -20663 224 -20652 251 -20616 249 -20570 L 249 -20569 Q 247 -20539 235 -20504 L 230 -20502 Q 32 -20392 98 -20134 L 100 -20129 Q 106 -20109 104 -20083 L 99 -20048 99 -20049 Q 88 -20004 61 -19951 -50 -19732 -81 -19464 L -104 -19459 Q -128 -19450 -143 -19429 -159 -19409 -160 -19384 L -181 -19368 Q -207 -19352 -216 -19322 -226 -19294 -214 -19265 -137 -19063 -247 -18908 L -247 -18907 Q -274 -18870 -305 -18850 -332 -18834 -342 -18805 -353 -18777 -343 -18748 -312 -18659 -298 -18555 L -296 -18540 Q -283 -18424 -289 -18291 L -290 -18267 -290 -18265 Q -298 -18131 -314 -18000 L -314 -17999 -318 -17968 Q -322 -17939 -307 -17913 L -294 -17897 Q -290 -17876 -275 -17858 -254 -17833 -221 -17829 L -175 -17835 Q -141 -17843 -94 -17887 -18 -17937 54 -17979 L 151 -18038 152 -18038 264 -18108 472 -18233 472 -18234 Q 580 -18297 690 -18363 L 721 -18381 905 -18484 Q 1017 -18544 1124 -18607 L 1345 -18728 Q 1470 -18791 1572 -18853 L 1571 -18853 1774 -18970 Q 1883 -19029 1989 -19091 L 1999 -19097 2001 -19098 Q 2093 -19152 2186 -19202 L 2187 -19202 2208 -19214 2208 -19213 2403 -19318 2410 -19321 2409 -19321 2645 -19445 2861 -19556 2860 -19556 Q 2989 -19620 3107 -19696 3214 -19765 3327 -19828 L 3327 -19829 3559 -19965 Q 3666 -20031 3781 -20074 L 3858 -20108 Q 3958 -20040 3939 -19929 3912 -19789 3828 -19702 3729 -19602 3637 -19526 L 3453 -19369 3339 -19270 3273 -19215 3068 -19057 2983 -18996 2850 -18910 2849 -18910 2624 -18766 Q 2509 -18689 2409 -18584 L 2410 -18584 2352 -18525 2353 -18525 2307 -18476 Q 2284 -18452 2284 -18420 2283 -18388 2304 -18362 2325 -18337 2357 -18332 2468 -18316 2561 -18282 2597 -18268 2614 -18242 L 2622 -18212 Q 2633 -18124 2558 -18079 L 2557 -18079 Q 2449 -18013 2328 -17970 L 2224 -17935 2070 -17883 2071 -17883 Q 1947 -17844 1827 -17801 L 1702 -17761 1575 -17726 1330 -17666 1068 -17602 1069 -17602 Q 941 -17571 816 -17525 L 656 -17473 657 -17473 594 -17454 402 -17388 Q 301 -17351 200 -17317 L 201 -17317 52 -17266 53 -17266 3 -17247 4 -17248 -34 -17233 -105 -17206 -126 -17197 Q -115 -17229 -127 -17259 L -127 -17260 -129 -17264 -141 -17284 -138 -17286 -137 -17286 -59 -17317 -27 -17329 -28 -17328 23 -17347 36 -17352 173 -17399 175 -17400 Q 273 -17433 372 -17469 L 568 -17536 569 -17537 632 -17556 631 -17555 787 -17607 786 -17606 Q 916 -17654 1048 -17686 L 1310 -17750 1311 -17750 1554 -17810 1677 -17843 1798 -17883 2045 -17966 2043 -17965 2196 -18016 2196 -18017 2299 -18052 2300 -18052 Q 2412 -18091 2512 -18152 L 2513 -18153 Q 2540 -18170 2536 -18201 L 2531 -18201 2532 -18200 Q 2446 -18232 2345 -18247 2280 -18257 2238 -18306 2196 -18357 2197 -18422 2198 -18487 2243 -18535 L 2290 -18585 2347 -18644 2348 -18645 Q 2454 -18756 2576 -18838 L 2576 -18837 Q 2686 -18913 2805 -18984 L 2934 -19068 2934 -19067 3016 -19126 3218 -19282 3218 -19283 3283 -19336 3396 -19433 3396 -19434 3582 -19593 Q 3671 -19666 3767 -19763 3833 -19833 3854 -19945 3861 -20000 3813 -20034 3843 -20006 3811 -19993 3704 -19953 3604 -19892 L 3370 -19753 3154 -19623 3154 -19624 Q 3032 -19545 2900 -19479 L 2899 -19479 2685 -19369 2451 -19245 2450 -19245 2448 -19244 2439 -19239 2249 -19137 2229 -19127 2227 -19125 2045 -19023 2040 -19020 2032 -19016 Q 1925 -18954 1815 -18894 L 1816 -18895 1616 -18779 Q 1512 -18716 1384 -18651 L 1383 -18651 Q 1267 -18593 1168 -18533 L 945 -18407 Q 854 -18360 765 -18307 L 734 -18288 734 -18289 515 -18159 310 -18035 310 -18034 197 -17964 196 -17964 98 -17905 -37 -17821 Q -167 -17697 -246 -17745 -301 -17757 -340 -17801 -363 -17827 -374 -17858 L -381 -17870 Q -411 -17921 -403 -17979 L -400 -18009 -399 -18010 Q -384 -18139 -376 -18272 L -377 -18268 -376 -18295 Q -370 -18421 -382 -18529 L -382 -18530 -384 -18543 Q -397 -18638 -424 -18719 -445 -18777 -423 -18835 -402 -18893 -350 -18924 L -317 -18958 -316 -18959 Q -235 -19078 -295 -19234 -318 -19291 -298 -19349 -281 -19402 -237 -19434 -229 -19459 -213 -19481 -191 -19511 -160 -19528 -123 -19780 -16 -19989 L -16 -19990 Q 5 -20032 15 -20067 L 15 -20069 18 -20089 17 -20103 15 -20113 Q -65 -20422 161 -20562 L 185 -20575 Q 171 -20583 160 -20592 L 143 -20608 M -3717 -17757 L -3717 -17598 -3717 -17597 -3725 -17601 Q -3724 -17649 -3731 -17696 -3738 -17744 -3753 -17792 L -3717 -17757 M -3681 -17124 L -3494 -17055 -3495 -17056 Q -3411 -17026 -3252 -16956 -3201 -16934 -3173 -16886 -3145 -16838 -3149 -16783 L -3150 -16772 -3150 -16771 -3156 -16698 Q -3160 -16651 -3188 -16611 -3217 -16572 -3261 -16553 -3305 -16534 -3352 -16540 -3516 -16563 -3603 -16592 L -3717 -16630 -3717 -16616 -3732 -16627 -3803 -16628 -3803 -16635 -3803 -16717 -3803 -16752 Q -3690 -16712 -3576 -16675 -3494 -16648 -3341 -16626 L -3295 -16632 Q -3273 -16642 -3258 -16661 -3245 -16681 -3243 -16705 L -3237 -16779 -3236 -16790 Q -3233 -16818 -3247 -16842 -3262 -16866 -3287 -16877 -3442 -16945 -3524 -16974 L -3523 -16974 -3752 -17058 -3803 -17076 -3803 -17095 -3803 -17124 Q -3747 -17113 -3681 -17124 M -3717 -16423 L -3717 -16388 -3728 -16432 -3717 -16423 M -3717 -15784 L -3717 -15669 -3725 -15783 -3717 -15784 M -3717 -15105 L -3717 -14999 -3699 -14986 -3697 -14985 Q -3605 -14917 -3521 -14826 L -3439 -14878 Q -3386 -14912 -3323 -14904 -3260 -14896 -3217 -14849 -3175 -14802 -3172 -14739 L -3167 -14627 Q -3161 -14524 -3121 -14432 L -3120 -14431 -3072 -14309 -3071 -14306 -3060 -14284 Q -3029 -14236 -3032 -14179 -3041 -14046 -3006 -13921 L -2983 -13825 -2980 -13807 -2969 -13730 -2969 -13729 Q -2960 -13656 -2961 -13580 L -2961 -13578 -2962 -13485 -2962 -13484 -2962 -13481 -2963 -13463 Q -2960 -13440 -2963 -13416 -2971 -13366 -3004 -13327 L -3007 -13322 -3007 -13323 -3014 -13313 -3014 -13312 Q -3058 -13233 -3059 -13138 -3062 -13017 -3055 -12895 L -3055 -12896 -3054 -12879 Q -3047 -12759 -3059 -12605 -3054 -12568 -3065 -12530 L -3071 -12512 -3072 -12509 -3102 -12403 -3102 -12402 -3131 -12274 Q -3155 -12154 -3164 -12037 L -3164 -12036 Q -3174 -11927 -3164 -11816 -3152 -11698 -3119 -11583 L -3119 -11584 Q -3094 -11499 -3041 -11429 L -3026 -11413 -3019 -11417 Q -3013 -11420 -3006 -11424 -2954 -11454 -2894 -11444 -2835 -11435 -2794 -11390 -2753 -11346 -2748 -11286 -2744 -11226 -2778 -11176 L -2793 -11155 Q -2833 -11097 -2902 -11084 -2936 -11078 -2966 -11083 L -2948 -11022 Q -2924 -10960 -2948 -10898 L -2963 -10853 -2963 -10852 Q -2991 -10759 -2970 -10664 L -2970 -10665 Q -2962 -10629 -2938 -10607 -2889 -10566 -2878 -10502 -2867 -10439 -2901 -10384 -2935 -10329 -2996 -10309 -3032 -10296 -3045 -10258 L -3045 -10257 Q -3066 -10191 -3035 -10128 -3004 -10063 -2971 -10016 -2943 -9976 -2940 -9927 -2938 -9878 -2961 -9834 -3004 -9754 -3033 -9650 -3055 -9574 -3026 -9498 -2996 -9418 -2949 -9358 L -2944 -9351 -2936 -9341 Q -2776 -9144 -2985 -8914 L -2986 -8913 Q -3014 -8883 -3004 -8849 -2951 -8743 -2996 -8509 -3013 -8422 -2982 -8338 L -2981 -8336 -2975 -8318 Q -2921 -8279 -2907 -8213 -2894 -8148 -2928 -8090 -2966 -8023 -2991 -7921 -3011 -7840 -2983 -7765 L -2974 -7747 Q -2953 -7709 -2951 -7665 -2951 -7622 -2970 -7582 -2989 -7547 -2977 -7513 -2961 -7475 -2963 -7434 -2966 -7393 -2987 -7356 L -3024 -7281 -3026 -7265 -3028 -7237 Q -3046 -7130 -3053 -7024 L -3053 -7023 -3069 -6793 -3069 -6792 Q -3077 -6692 -3063 -6592 L -3063 -6595 Q -3041 -6458 -3027 -6321 -3014 -6199 -2988 -6079 L -2989 -6081 Q -2958 -5940 -2933 -5800 L -2933 -5798 -2890 -5549 -2890 -5548 Q -2876 -5464 -2869 -5371 -2865 -5321 -2889 -5276 -2913 -5232 -2958 -5207 -2999 -5184 -3044 -5185 L -3041 -5177 Q -3024 -5125 -3041 -5072 -3057 -5019 -3100 -4985 -3129 -4959 -3126 -4913 -3120 -4832 -3076 -4763 -3055 -4731 -3018 -4735 -2956 -4742 -2904 -4708 -2852 -4675 -2833 -4615 -2814 -4556 -2837 -4498 -2861 -4441 -2915 -4411 -2955 -4389 -2957 -4341 L -2957 -4340 -2957 -4326 Q -2908 -4298 -2884 -4247 -2860 -4196 -2871 -4141 -2861 -4151 -2826 -4141 -2765 -4126 -2728 -4074 -2691 -4022 -2696 -3959 -2702 -3897 -2747 -3852 -2792 -3807 -2854 -3801 L -2860 -3801 Q -2867 -3775 -2881 -3752 -2905 -3713 -2945 -3690 L -2984 -3670 -2982 -3544 Q -2981 -3411 -2989 -3279 L -2989 -3278 Q -2998 -3152 -2998 -3023 -2995 -2939 -2968 -2844 L -2968 -2843 -2947 -2782 Q -2925 -2724 -2946 -2665 -2967 -2606 -3020 -2574 -3073 -2542 -3135 -2551 L -3137 -2552 Q -3144 -2494 -3107 -2448 L -3106 -2448 -3098 -2438 Q -3047 -2408 -3025 -2352 -3004 -2297 -3021 -2240 -3029 -2218 -3040 -2198 L -3037 -2196 Q -2983 -2157 -2968 -2092 -2954 -2028 -2987 -1969 L -2981 -1963 Q -2969 -1910 -2990 -1860 L -3001 -1837 Q -2981 -1804 -2976 -1764 -2970 -1716 -2990 -1672 -2968 -1634 -2968 -1590 L -2968 -1580 Q -2935 -1520 -2953 -1453 -2970 -1388 -3027 -1351 -2999 -1309 -2999 -1258 -2999 -1207 -3026 -1164 -3050 -1121 -3035 -1067 -2996 -1042 -2973 -999 -2945 -945 -2957 -886 -2969 -827 -3016 -787 -3037 -764 -3034 -724 L -3034 -722 -3032 -705 -3022 -659 Q -3005 -607 -3022 -554 -3038 -502 -3020 -444 -3002 -385 -3027 -327 -3034 -311 -3044 -296 -3010 -235 -2968 -178 -2930 -126 -2935 -61 -2939 -19 -2959 14 -2948 50 -2953 90 -2961 155 -3012 199 L -3008 195 -3016 203 Q -3040 225 -3056 260 -3092 332 -3082 414 L -3080 423 Q -3065 528 -3013 621 L -3014 620 -3001 643 -2961 705 Q -2927 754 -2931 814 -2934 872 -2973 917 L -2990 944 Q -3000 973 -2992 1009 L -2992 1011 -2989 1021 -2989 1022 Q -2949 1065 -2943 1123 -2938 1180 -2968 1230 L -2983 1264 -2986 1279 -2986 1277 Q -2992 1322 -2982 1362 L -2982 1364 -2981 1366 Q -2969 1414 -2984 1462 -3000 1510 -3039 1543 -3076 1573 -3123 1580 -3166 1616 -3224 1619 L -3269 1615 Q -3243 1716 -3186 1804 L -3185 1806 -3173 1823 Q -3126 1890 -3091 1960 L -3091 1959 -3051 2029 Q -3030 2065 -3027 2107 -3025 2148 -3041 2187 -3049 2205 -3049 2222 L -3048 2254 Q -3050 2297 -3033 2346 L -3034 2345 -3014 2387 Q -2999 2413 -2993 2441 -2988 2469 -2992 2500 L -2999 2530 Q -3015 2523 -3032 2523 -3068 2523 -3093 2549 -3119 2574 -3119 2610 L -3113 2641 -3151 2647 -3178 2647 -3163 2700 -3163 2699 -3154 2733 Q -3117 2879 -3104 3032 -3103 3043 -3094 3051 L -3093 3052 -3080 3060 -3081 3060 -3067 3063 -3065 3063 -3010 3063 -3006 3063 -2935 3061 -2892 3067 -2864 3160 -2892 3156 -2894 3156 -2943 3147 -2997 3149 -2995 3148 Q -3035 3153 -3074 3149 L -3075 3149 -3115 3139 -3147 3119 -3148 3119 Q -3187 3088 -3191 3039 -3204 2877 -3246 2723 L -3274 2634 -3274 2633 Q -3303 2548 -3351 2484 L -3350 2484 Q -3276 2502 -3212 2546 -3188 2563 -3157 2561 -3127 2559 -3104 2538 -3082 2517 -3078 2487 -3074 2457 -3089 2431 L -3115 2373 -3115 2374 Q -3138 2308 -3134 2248 L -3135 2232 Q -3139 2194 -3120 2153 -3112 2133 -3113 2113 -3115 2092 -3126 2074 L -3168 1999 Q -3201 1935 -3244 1873 L -3258 1852 Q -3353 1706 -3373 1529 L -3373 1528 Q -3407 1237 -3407 942 L -3408 790 -3401 800 Q -3363 856 -3346 926 -3316 1047 -3324 1173 L -3324 1174 Q -3334 1316 -3318 1455 -3315 1489 -3288 1511 -3262 1533 -3228 1532 -3194 1530 -3170 1506 -3160 1498 -3141 1496 L -3139 1495 Q -3114 1492 -3094 1476 -3074 1459 -3066 1435 -3059 1411 -3065 1387 L -3065 1386 -3066 1384 Q -3081 1328 -3071 1265 L -3066 1241 Q -3058 1211 -3042 1185 -3027 1160 -3030 1131 -3033 1102 -3052 1081 L -3069 1053 -3076 1029 -3076 1028 Q -3091 964 -3070 911 -3059 884 -3038 861 -3019 838 -3017 809 -3015 779 -3032 755 L -3075 687 -3089 663 Q -3148 557 -3166 436 L -3167 430 Q -3182 319 -3134 222 -3110 172 -3074 139 L -3070 135 -3068 133 Q -3043 111 -3038 78 -3034 45 -3053 18 L -3059 9 -3058 10 -3060 4 -3047 -13 Q -3024 -36 -3021 -68 -3019 -101 -3038 -127 -3095 -205 -3138 -289 L -3149 -321 -3146 -318 Q -3119 -333 -3106 -361 -3094 -390 -3103 -420 -3128 -503 -3104 -580 -3096 -607 -3104 -633 L -3118 -693 -3118 -694 -3120 -718 -3120 -719 Q -3126 -805 -3071 -853 -3048 -873 -3042 -903 -3036 -933 -3050 -960 -3065 -987 -3092 -999 -3107 -1007 -3113 -1026 -3148 -1129 -3099 -1210 -3085 -1232 -3085 -1257 -3086 -1283 -3099 -1304 L -3111 -1321 Q -3132 -1348 -3131 -1370 -3119 -1397 -3075 -1423 -3046 -1442 -3037 -1475 -3028 -1508 -3044 -1539 -3054 -1559 -3054 -1589 -3055 -1615 -3069 -1637 -3089 -1669 -3070 -1704 -3058 -1728 -3061 -1754 -3065 -1781 -3082 -1801 L -3091 -1815 -3092 -1816 Q -3105 -1843 -3103 -1853 -3080 -1868 -3070 -1893 -3060 -1918 -3065 -1944 -3074 -1985 -3062 -2012 -3046 -2041 -3053 -2073 -3060 -2106 -3087 -2125 -3137 -2160 -3193 -2190 L -3214 -2205 -3191 -2204 Q -3161 -2203 -3137 -2220 -3113 -2237 -3104 -2265 -3096 -2294 -3106 -2321 -3117 -2349 -3142 -2364 L -3172 -2392 -3173 -2393 Q -3236 -2468 -3222 -2566 L -3222 -2567 Q -3209 -2650 -3122 -2636 -3092 -2632 -3065 -2648 -3038 -2664 -3028 -2693 -3018 -2723 -3028 -2752 L -3051 -2820 -3051 -2819 Q -3081 -2924 -3084 -3018 L -3084 -3020 -3075 -3284 Q -3067 -3413 -3068 -3543 L -3072 -3724 Q -3030 -3742 -2987 -3766 -2967 -3777 -2955 -3797 -2943 -3817 -2942 -3839 L -2940 -3882 -2861 -3888 Q -2830 -3891 -2808 -3913 -2786 -3935 -2783 -3967 -2780 -3998 -2798 -4024 -2817 -4050 -2847 -4058 -2960 -4087 -2956 -4158 -2950 -4185 -2962 -4211 -2974 -4237 -2999 -4250 -3049 -4281 -3044 -4348 -3037 -4444 -2957 -4487 -2930 -4502 -2918 -4530 -2906 -4559 -2915 -4589 -2925 -4619 -2951 -4635 -2977 -4653 -3008 -4649 -3099 -4638 -3149 -4716 -3205 -4804 -3212 -4907 -3219 -5001 -3153 -5054 -3132 -5071 -3123 -5097 -3115 -5124 -3124 -5150 -3132 -5176 -3154 -5192 L -3152 -5201 -3152 -5199 Q -3145 -5258 -3091 -5268 L -3092 -5268 -3047 -5271 Q -3022 -5270 -2999 -5282 -2977 -5295 -2965 -5317 -2953 -5339 -2955 -5364 -2962 -5453 -2975 -5533 L -2976 -5534 -3018 -5784 -3019 -5785 Q -3043 -5924 -3073 -6062 -3100 -6186 -3113 -6312 -3127 -6446 -3148 -6581 L -3148 -6580 Q -3164 -6689 -3155 -6799 L -3156 -6799 -3139 -7029 Q -3132 -7139 -3113 -7251 L -3112 -7265 -3108 -7300 -3108 -7302 Q -3096 -7341 -3061 -7400 -3051 -7418 -3049 -7439 -3048 -7459 -3057 -7478 -3085 -7547 -3047 -7621 -3038 -7641 -3038 -7663 -3039 -7685 -3049 -7704 L -3063 -7734 -3063 -7733 Q -3102 -7833 -3075 -7942 -3047 -8058 -3002 -8134 -2986 -8163 -2992 -8195 -2999 -8228 -3026 -8248 -3050 -8268 -3063 -8307 L -3064 -8309 Q -3103 -8414 -3081 -8525 -3042 -8727 -3085 -8817 L -3085 -8816 Q -3117 -8900 -3049 -8972 -2892 -9144 -3006 -9291 L -3010 -9296 -3017 -9305 Q -3072 -9374 -3107 -9467 -3146 -9570 -3117 -9673 L -3116 -9673 Q -3084 -9788 -3037 -9876 -3025 -9898 -3026 -9922 -3028 -9946 -3042 -9966 -3078 -10019 -3113 -10090 -3159 -10185 -3127 -10285 L -3128 -10284 Q -3101 -10366 -3022 -10391 -2992 -10401 -2975 -10429 -2958 -10456 -2963 -10488 -2969 -10520 -2993 -10540 -3039 -10580 -3054 -10646 -3080 -10763 -3046 -10877 L -3028 -10929 Q -3017 -10960 -3028 -10991 -3052 -11051 -3057 -11103 L -3057 -11104 Q -3065 -11171 -3038 -11222 L -3029 -11243 -3028 -11237 Q -3019 -11207 -2993 -11189 L -2982 -11182 Q -2953 -11162 -2918 -11169 -2884 -11176 -2863 -11204 L -2849 -11224 Q -2833 -11250 -2835 -11279 -2837 -11310 -2857 -11332 -2878 -11354 -2907 -11359 -2937 -11364 -2963 -11348 L -2982 -11339 Q -3011 -11325 -3024 -11296 L -3029 -11281 -3030 -11285 Q -3039 -11319 -3069 -11337 L -3110 -11377 Q -3172 -11460 -3202 -11559 -3238 -11681 -3250 -11808 -3261 -11926 -3251 -12043 L -3251 -12044 Q -3241 -12166 -3216 -12291 L -3186 -12424 -3185 -12424 -3154 -12536 -3154 -12537 -3148 -12556 Q -3142 -12578 -3146 -12601 -3133 -12755 -3140 -12874 L -3141 -12890 -3141 -12891 Q -3148 -13016 -3145 -13140 -3143 -13256 -3090 -13353 L -3090 -13354 -3078 -13372 -3069 -13384 Q -3052 -13404 -3049 -13429 -3046 -13446 -3051 -13462 L -3048 -13482 -3048 -13484 -3048 -13485 -3047 -13579 -3047 -13580 Q -3047 -13651 -3055 -13719 L -3055 -13720 -3067 -13799 -3068 -13809 -3089 -13898 Q -3128 -14037 -3118 -14184 -3117 -14213 -3133 -14237 L -3153 -14278 -3154 -14279 -3200 -14397 -3200 -14398 Q -3245 -14503 -3253 -14621 L -3253 -14622 -3259 -14736 Q -3260 -14768 -3281 -14791 -3303 -14814 -3334 -14818 -3366 -14823 -3392 -14805 L -3483 -14747 Q -3523 -14722 -3557 -14743 L -3583 -14766 -3584 -14766 Q -3663 -14852 -3749 -14916 L -3750 -14917 Q -3778 -14937 -3803 -14943 L -3803 -15151 -3803 -15153 -3779 -15137 Q -3747 -15116 -3717 -15105 M -2727 3409 L -2727 3440 Q -2733 3506 -2781 3553 -2815 3585 -2854 3611 L -2854 3612 -2905 3641 -2980 3704 -2979 3703 -3020 3744 Q -3054 3783 -3080 3829 L -3044 3836 Q -2984 3855 -2950 3907 -2916 3959 -2923 4022 -2927 4085 -2890 4161 L -2890 4162 -2859 4209 Q -2816 4262 -2821 4330 -2826 4397 -2875 4444 L -2895 4460 Q -2947 4504 -3005 4569 -3037 4603 -3081 4618 L -3171 4622 -3176 4621 Q -3204 4620 -3229 4638 L -3230 4639 -3250 4655 Q -3266 4671 -3258 4693 -3233 4770 -3187 4838 L -3186 4839 -3159 4876 -3158 4877 Q -3106 4945 -3095 5019 L -3093 5037 -3093 5038 Q -3081 5132 -3141 5237 L -3141 5238 -3144 5243 -3145 5245 -3146 5246 -3151 5257 Q -3069 5322 -3069 5468 L -3069 5469 Q -3068 5593 -3060 5717 L -3060 5718 -3049 5876 -3049 5877 -3042 5983 -3042 5984 -3038 6028 -3038 6027 -3031 6071 -3031 6073 -3030 6081 -3020 6125 -3019 6128 -2997 6201 Q -2983 6241 -2988 6283 -3000 6368 -2990 6483 L -2990 6484 -2984 6523 -2983 6523 Q -2975 6552 -2957 6575 L -2956 6577 -2940 6600 Q -2917 6639 -2915 6682 L -2916 6676 -2918 6670 -2919 6667 -2919 6665 -2922 6648 -2922 6651 -2929 6628 -2925 6639 -2931 6623 -2967 6759 -2920 6730 -2906 6725 -2884 6720 Q -2822 6710 -2767 6743 -2713 6776 -2692 6836 L -2691 6838 Q -2671 6901 -2697 6962 -2724 7022 -2785 7050 -2831 7071 -2878 7065 -2881 7128 -2891 7192 L -2893 7206 -2893 7207 -2903 7261 -2903 7260 Q -2926 7378 -2963 7492 L -2963 7493 Q -2996 7591 -3005 7696 L -3006 7698 Q -3018 7826 -3038 7953 -3054 8058 -3053 8164 L -2945 8164 Q -2911 8143 -2869 8139 -2820 8134 -2776 8157 L -2763 8164 -530 8164 -550 7973 Q -554 7940 -545 7909 L -536 7879 -536 7878 Q -502 7755 -475 7632 L -467 7580 -466 7579 Q -460 7507 -477 7437 L -477 7436 Q -502 7333 -538 7254 -553 7222 -555 7188 L -555 7175 -555 7173 -555 7165 -555 7161 -555 7157 Q -557 7060 -537 6967 L -537 6966 Q -510 6833 -475 6700 L -476 6700 Q -450 6598 -461 6496 L -461 6495 -468 6448 Q -475 6411 -466 6375 -457 6339 -434 6310 -401 6262 -402 6190 L -402 6188 Q -402 6127 -412 6066 L -413 6059 -412 6061 -413 6056 -422 6011 -423 6007 -424 6006 -434 5969 -440 5945 -441 5944 Q -479 5801 -476 5654 L -476 5652 Q -474 5506 -455 5362 L -455 5361 Q -437 5218 -396 5081 L -395 5080 Q -359 4961 -341 4841 L -341 4840 Q -326 4739 -353 4643 L -353 4642 Q -370 4586 -373 4506 -374 4483 -368 4461 -358 4417 -385 4388 -420 4355 -433 4310 -446 4264 -434 4219 -429 4196 -417 4176 -379 4107 -366 4027 L -365 4024 Q -351 3940 -380 3877 -402 3836 -400 3790 -398 3744 -373 3705 L -307 3585 -307 3586 Q -281 3532 -299 3482 -317 3439 -341 3405 -375 3357 -372 3299 -370 3241 -333 3196 L -332 3194 Q -302 3159 -260 3144 -240 3164 -210 3167 -177 3170 -150 3151 -124 3132 -116 3100 L -108 3060 -106 3057 Q -68 3007 -53 2936 L -17 2744 -12 2717 -27 2730 Q -45 2743 -67 2753 L -118 2766 Q -138 2754 -161 2754 L -186 2757 Q -235 2742 -266 2703 L -273 2694 Q -309 2645 -306 2585 -303 2522 -306 2459 L -306 2458 Q -311 2320 -308 2183 L -308 2181 Q -306 2059 -320 1940 L -321 1939 Q -334 1828 -381 1726 L -391 1698 Q -439 1522 -411 1387 L -411 1386 Q -396 1305 -435 1230 -452 1198 -454 1163 -457 1128 -445 1094 L -415 1004 -414 1002 Q -399 956 -430 923 -474 879 -480 817 -486 755 -451 704 -404 632 -385 545 L -385 547 Q -364 447 -376 346 L -376 345 Q -388 256 -442 192 -482 145 -484 84 -485 37 -464 -2 -465 -18 -454 -21 -495 -68 -498 -129 L -497 -150 -502 -149 -444 -263 Q -415 -277 -401 -306 -388 -336 -398 -368 L -399 -372 -392 -394 Q -369 -460 -379 -510 L -353 -549 Q -340 -577 -340 -632 -340 -728 -373 -786 -396 -819 -402 -858 -408 -898 -396 -936 L -386 -995 Q -379 -1106 -406 -1202 -422 -1258 -401 -1312 L -395 -1327 Q -420 -1346 -438 -1374 -474 -1432 -461 -1497 L -463 -1497 Q -482 -1546 -471 -1596 -461 -1641 -431 -1675 -466 -1726 -460 -1787 L -454 -1820 -466 -1865 Q -473 -1912 -454 -1956 L -421 -2047 Q -420 -2097 -391 -2138 L -371 -2163 -389 -2196 Q -426 -2244 -426 -2303 -426 -2363 -388 -2410 -351 -2457 -292 -2471 L -278 -2486 -277 -2487 Q -267 -2505 -280 -2529 L -280 -2530 -281 -2531 Q -322 -2521 -364 -2532 -426 -2548 -463 -2601 -500 -2654 -493 -2717 L -472 -2857 -432 -3065 -426 -3204 -426 -3205 Q -421 -3336 -424 -3467 L -424 -3611 -446 -3622 Q -489 -3643 -516 -3683 -543 -3723 -545 -3770 L -554 -3933 -555 -3946 -555 -3982 Q -556 -4074 -534 -4090 -575 -4116 -597 -4160 -619 -4205 -615 -4253 -611 -4301 -581 -4341 L -579 -4374 -579 -4373 Q -588 -4468 -641 -4539 L -641 -4538 Q -782 -4652 -592 -4852 -582 -4863 -587 -4878 -611 -4941 -585 -5004 -559 -5067 -497 -5095 -486 -5103 -482 -5118 L -483 -5118 Q -467 -5183 -511 -5229 -549 -5267 -559 -5319 -570 -5371 -549 -5420 -530 -5465 -492 -5493 -534 -5494 -573 -5517 -625 -5548 -647 -5604 -669 -5661 -650 -5718 L -626 -5793 -626 -5794 -556 -6016 -555 -6018 Q -516 -6137 -494 -6260 L -494 -6261 -473 -6379 -473 -6378 -454 -6487 -454 -6488 -415 -6742 Q -399 -6864 -396 -6988 L -396 -6989 -386 -7219 Q -381 -7310 -383 -7390 -412 -7453 -447 -7509 L -447 -7510 -468 -7541 Q -496 -7583 -498 -7632 -500 -7682 -475 -7725 -450 -7768 -406 -7791 L -404 -7793 Q -394 -7809 -390 -7835 L -390 -7833 Q -375 -7944 -385 -8055 L -385 -8054 Q -389 -8090 -401 -8120 L -402 -8121 Q -417 -8154 -445 -8178 L -448 -8182 -453 -8186 Q -492 -8221 -505 -8272 -518 -8327 -497 -8379 -480 -8422 -444 -8449 -466 -8475 -476 -8508 -492 -8560 -476 -8611 -466 -8642 -447 -8665 -461 -8795 -415 -8863 L -413 -8866 Q -399 -8892 -391 -8920 L -390 -8921 Q -377 -8971 -378 -9029 L -378 -9030 -378 -9037 -416 -9053 Q -470 -9084 -492 -9142 -557 -9272 -449 -9461 -426 -9502 -409 -9545 L -409 -9546 Q -389 -9599 -378 -9655 L -378 -9656 Q -369 -9703 -384 -9746 L -400 -9779 -398 -9777 Q -499 -9941 -404 -10052 -360 -10120 -367 -10202 L -367 -10201 Q -373 -10269 -423 -10307 -467 -10339 -485 -10392 -504 -10444 -488 -10496 -472 -10549 -429 -10583 -390 -10615 -369 -10664 -341 -10733 -362 -10803 L -362 -10804 -366 -10817 Q -386 -10868 -373 -10920 -360 -10972 -320 -11008 L -324 -11031 -326 -11036 Q -371 -11063 -393 -11113 -423 -11178 -398 -11244 L -367 -11337 Q -344 -11415 -331 -11482 L -331 -11481 Q -320 -11542 -318 -11594 -316 -11716 -322 -11836 L -343 -12085 -348 -12126 -348 -12127 Q -360 -12216 -383 -12292 L -420 -12405 Q -434 -12443 -429 -12482 -419 -12568 -418 -12649 L -418 -12651 -414 -12791 -408 -12929 Q -402 -13051 -411 -13171 L -411 -13172 Q -416 -13217 -432 -13247 L -442 -13259 -444 -13261 -447 -13263 Q -486 -13288 -507 -13329 -529 -13371 -527 -13416 -525 -13458 -516 -13494 L -516 -13493 -482 -13651 -482 -13650 -434 -13879 -434 -13878 Q -400 -14030 -418 -14185 L -418 -14186 -422 -14214 Q -434 -14247 -433 -14281 L -427 -14387 -427 -14388 -408 -14574 -408 -14573 Q -392 -14706 -352 -14845 -337 -14898 -294 -14932 -252 -14966 -198 -14970 -144 -14974 -97 -14945 L 97 -14830 98 -14830 104 -14825 105 -14825 114 -14836 115 -14837 Q 205 -14928 305 -14996 L 306 -14997 Q 465 -15105 585 -14959 L 585 -14958 Q 654 -14876 743 -14822 L 744 -14822 775 -14823 Q 821 -14868 821 -14935 825 -15148 927 -15194 1034 -15314 1231 -15177 1338 -15102 1450 -15038 L 1451 -15038 Q 1540 -14987 1639 -14966 1644 -15027 1616 -15084 1486 -15348 1661 -15502 L 1662 -15503 Q 1779 -15624 1959 -15624 L 1960 -15624 2193 -15643 2191 -15642 2449 -15691 2448 -15691 Q 2523 -15708 2580 -15755 L 2559 -15812 Q 2435 -15819 2316 -15841 L 2315 -15841 Q 2204 -15862 2107 -15899 2053 -15920 2022 -15970 1991 -16020 1997 -16077 2002 -16135 2042 -16178 2184 -16340 2440 -16353 L 2438 -16352 2579 -16371 2578 -16370 Q 2879 -16431 3169 -16527 3177 -16598 3165 -16660 2931 -16649 2705 -16613 L 2249 -16537 Q 2048 -16502 1846 -16528 1733 -16543 1694 -16601 L 1692 -16603 Q 1566 -16696 1686 -16880 1721 -16934 1783 -16952 L 1985 -17011 1984 -17011 2209 -17079 2208 -17078 Q 2331 -17116 2456 -17142 L 2458 -17142 2468 -17144 2469 -17144 2731 -17192 2733 -17192 2960 -17234 2961 -17234 3200 -17294 3455 -17375 3456 -17376 Q 3534 -17402 3607 -17435 3577 -17493 3556 -17554 L 3461 -17541 3460 -17541 3304 -17526 3302 -17526 3065 -17508 Q 2956 -17499 2859 -17475 2743 -17446 2574 -17420 L 2275 -17364 2275 -17363 2190 -17345 1807 -17265 1806 -17265 1600 -17226 Q 1257 -17163 872 -17069 L 561 -16988 399 -16943 397 -16942 Q 306 -16916 213 -16908 L 212 -16908 169 -16901 163 -16899 80 -16885 87 -16885 84 -16885 77 -16884 63 -16881 68 -16869 Q 78 -16837 76 -16805 L -17 -16785 Q -6 -16813 -15 -16843 -26 -16876 -56 -16893 -87 -16910 -120 -16900 L -125 -16899 Q -154 -16891 -171 -16868 -189 -16845 -189 -16815 -190 -16786 -172 -16763 L -167 -16756 -223 -16747 -259 -16740 Q -276 -16775 -276 -16815 -276 -16851 -263 -16882 L -271 -16892 Q -303 -16930 -309 -16979 L -323 -17048 Q -330 -17075 -328 -17100 L -333 -17104 -333 -17105 -358 -17134 Q -341 -17172 -331 -17214 -326 -17237 -313 -17254 -313 -17220 -299 -17188 L -293 -17196 Q -287 -17179 -273 -17165 L -272 -17165 Q -253 -17146 -227 -17141 L -233 -17130 Q -247 -17102 -239 -17070 L -223 -16990 Q -220 -16966 -204 -16947 -189 -16928 -165 -16920 L -118 -16918 -101 -16922 -100 -16922 Q -31 -16939 -4 -16952 L 27 -16962 64 -16969 68 -16970 73 -16971 142 -16983 145 -16984 206 -16994 206 -16995 Q 291 -17002 374 -17026 L 373 -17026 538 -17072 539 -17072 852 -17153 Q 1239 -17247 1585 -17311 L 1790 -17350 2171 -17429 2257 -17448 2561 -17506 Q 2725 -17531 2838 -17559 2941 -17584 3057 -17594 L 3296 -17612 3297 -17613 3451 -17627 3452 -17627 3586 -17647 3587 -17647 3617 -17647 Q 3649 -17530 3711 -17426 L 3711 -17427 3725 -17396 3724 -17396 3723 -17395 Q 3610 -17337 3484 -17294 L 3483 -17293 3224 -17211 2979 -17149 2745 -17106 2486 -17060 2485 -17060 2475 -17058 2474 -17057 Q 2352 -17032 2233 -16996 L 2234 -16996 2009 -16929 1807 -16869 Q 1776 -16860 1759 -16833 1684 -16719 1757 -16661 L 1758 -16660 Q 1783 -16624 1857 -16614 2046 -16589 2234 -16623 L 2692 -16698 Q 2955 -16740 3231 -16750 3274 -16632 3251 -16486 3241 -16460 3202 -16447 2905 -16348 2596 -16286 L 2595 -16286 2444 -16266 2443 -16266 Q 2227 -16255 2106 -16119 2086 -16098 2083 -16069 2080 -16040 2096 -16015 2111 -15991 2138 -15980 2228 -15946 2331 -15926 L 2332 -15926 Q 2468 -15901 2610 -15896 2646 -15844 2668 -15762 L 2668 -15761 Q 2676 -15730 2658 -15709 L 2657 -15709 Q 2579 -15631 2467 -15606 L 2206 -15557 2205 -15557 1960 -15537 Q 1817 -15537 1723 -15442 1595 -15324 1694 -15123 L 1694 -15122 Q 1741 -15027 1720 -14925 1703 -14866 1630 -14880 L 1629 -14880 Q 1512 -14902 1407 -14963 1291 -15029 1182 -15106 1050 -15197 979 -15125 911 -15089 908 -14934 906 -14830 835 -14761 L 834 -14760 Q 772 -14704 699 -14748 597 -14809 519 -14903 L 518 -14903 Q 448 -14989 355 -14925 L 354 -14925 Q 261 -14861 176 -14776 L 176 -14775 Q 144 -14744 111 -14739 L 111 -14738 Q 83 -14738 54 -14755 L -141 -14871 Q -165 -14886 -192 -14884 -219 -14882 -240 -14865 -262 -14848 -269 -14821 -307 -14689 -323 -14562 L -323 -14563 -341 -14382 -341 -14381 -346 -14278 -341 -14244 -332 -14195 Q -313 -14026 -350 -13859 L -397 -13635 -397 -13634 Q -413 -13552 -432 -13473 L -432 -13472 -440 -13413 Q -441 -13390 -430 -13369 -420 -13349 -401 -13336 L -389 -13327 -387 -13326 -359 -13294 Q -331 -13249 -325 -13180 L -325 -13179 Q -315 -13052 -321 -12924 L -327 -12788 -331 -12649 -331 -12648 Q -333 -12562 -343 -12472 -345 -12453 -339 -12433 L -301 -12317 Q -276 -12235 -262 -12139 L -262 -12138 -257 -12094 -236 -11841 Q -229 -11717 -232 -11592 -233 -11534 -246 -11466 L -246 -11465 Q -260 -11394 -284 -11312 L -317 -11214 Q -329 -11181 -314 -11148 -300 -11116 -267 -11103 L -249 -11075 -247 -11070 -246 -11069 Q -215 -10992 -262 -10943 -283 -10926 -289 -10899 -296 -10873 -286 -10848 L -279 -10828 -279 -10827 Q -250 -10728 -290 -10631 -320 -10560 -375 -10515 -397 -10498 -405 -10472 -413 -10446 -404 -10419 -395 -10393 -372 -10377 -291 -10318 -281 -10210 -271 -10097 -332 -10004 L -332 -10005 Q -392 -9932 -325 -9823 L -325 -9822 -302 -9774 -302 -9775 Q -280 -9711 -293 -9640 L -293 -9639 Q -305 -9575 -328 -9514 -348 -9465 -374 -9419 L -374 -9418 Q -457 -9272 -412 -9172 -401 -9144 -374 -9128 -347 -9113 -317 -9118 L -306 -9117 Q -292 -9088 -291 -9031 -290 -8958 -307 -8897 -319 -8858 -338 -8824 L -339 -8822 Q -375 -8766 -358 -8653 L -358 -8652 Q -356 -8637 -364 -8627 -385 -8611 -393 -8585 -402 -8559 -393 -8533 -386 -8508 -364 -8491 -328 -8459 -329 -8400 L -331 -8400 Q -359 -8402 -382 -8387 -406 -8373 -417 -8346 -428 -8320 -421 -8293 -414 -8266 -393 -8248 L -392 -8247 -388 -8243 Q -346 -8206 -323 -8156 L -323 -8157 Q -304 -8114 -299 -8063 L -299 -8062 Q -288 -7942 -304 -7822 -314 -7760 -348 -7727 L -349 -7726 -365 -7715 Q -387 -7704 -400 -7682 -412 -7660 -411 -7635 -411 -7611 -396 -7590 L -374 -7555 Q -331 -7488 -297 -7409 -293 -7318 -300 -7214 L -300 -7213 Q -308 -7101 -309 -6987 L -309 -6986 Q -312 -6858 -329 -6731 L -329 -6730 -369 -6473 -388 -6363 -387 -6364 -409 -6245 Q -432 -6116 -473 -5991 L -473 -5990 -543 -5768 -543 -5767 -567 -5692 Q -577 -5664 -566 -5635 -555 -5607 -529 -5591 -503 -5576 -473 -5580 -441 -5585 -422 -5574 -404 -5553 -399 -5510 L -399 -5509 Q -392 -5455 -437 -5425 -459 -5411 -469 -5386 -480 -5362 -475 -5336 -470 -5310 -450 -5291 -370 -5211 -399 -5097 -413 -5040 -461 -5016 -492 -5002 -505 -4971 -518 -4940 -506 -4908 -482 -4843 -529 -4792 -653 -4663 -572 -4590 L -572 -4591 Q -505 -4501 -493 -4382 L -493 -4381 Q -488 -4325 -512 -4289 -527 -4269 -528 -4245 -531 -4221 -520 -4199 -509 -4177 -488 -4164 -470 -4135 -468 -3983 L -468 -3946 -468 -3939 -459 -3775 Q -458 -3751 -444 -3731 -431 -3711 -409 -3700 -369 -3682 -335 -3659 -340 -3569 -337 -3469 -335 -3335 -339 -3201 L -346 -3056 -388 -2841 -407 -2708 Q -411 -2677 -392 -2650 -374 -2624 -343 -2616 -312 -2608 -283 -2622 -238 -2636 -203 -2570 -160 -2487 -216 -2426 -246 -2395 -273 -2386 -302 -2380 -320 -2356 -339 -2333 -339 -2303 -340 -2273 -321 -2249 L -289 -2192 Q -275 -2163 -245 -2150 L -231 -2145 Q -195 -2165 -172 -2190 L -179 -2203 -167 -2195 -161 -2203 -146 -2232 -125 -2167 -167 -2195 -168 -2194 -169 -2192 -172 -2190 -152 -2166 -150 -2164 -140 -2155 -184 -2147 -231 -2145 -273 -2125 -268 -2126 -280 -2122 Q -305 -2112 -319 -2090 -335 -2068 -334 -2041 L -334 -2033 Q -355 -1970 -374 -1922 -384 -1901 -380 -1877 -377 -1854 -363 -1835 L -354 -1826 Q -371 -1806 -373 -1779 -376 -1748 -358 -1722 -320 -1666 -362 -1622 -381 -1604 -386 -1578 -392 -1553 -382 -1528 -373 -1505 -376 -1484 -383 -1450 -364 -1420 -346 -1390 -311 -1382 L -294 -1376 Q -292 -1348 -312 -1300 L -320 -1281 Q -331 -1254 -322 -1226 -291 -1116 -300 -989 -304 -943 -313 -910 -320 -891 -316 -871 -314 -851 -302 -835 -254 -760 -253 -632 -254 -538 -288 -492 -307 -470 -309 -442 -312 -415 -297 -390 L -277 -367 -333 -280 -383 -204 -383 -203 -394 -188 Q -413 -163 -411 -132 -410 -102 -390 -79 L -378 -12 -378 -11 Q -374 12 -379 26 -398 51 -397 82 -397 112 -376 136 -306 219 -291 335 -277 450 -300 564 -323 667 -380 752 -397 778 -394 809 -391 839 -369 862 -299 932 -332 1030 L -333 1031 -364 1122 Q -370 1139 -368 1157 L -359 1190 Q -306 1292 -326 1402 -349 1521 -307 1676 L -302 1689 Q -249 1804 -235 1929 L -235 1930 Q -220 2054 -221 2183 L -221 2184 Q -225 2319 -219 2455 L -219 2589 Q -221 2618 -203 2643 -185 2667 -156 2676 L -100 2673 Q -72 2661 -57 2635 L 6 2526 Q 21 2502 18 2474 L -2 2201 Q -11 2079 14 1956 33 1857 55 1759 L 55 1758 58 1745 58 1744 Q 77 1650 111 1562 L 119 1541 120 1540 222 1292 222 1293 290 1134 311 1084 342 1006 347 1041 Q 375 1240 370 1443 L 370 1444 Q 368 1535 341 1622 L 278 1816 277 1818 Q 249 1901 209 1980 L 208 1981 174 2032 173 2032 148 2058 147 2059 132 2076 132 2075 Q 64 2144 50 2208 42 2234 52 2260 61 2285 84 2301 106 2317 134 2317 161 2316 183 2301 203 2286 226 2274 L 250 2261 Q 257 2257 265 2254 L 266 2253 Q 343 2215 426 2192 L 426 2191 Q 528 2162 634 2158 L 635 2158 662 2157 773 2166 774 2166 Q 825 2176 874 2196 976 2239 1078 2271 L 1068 2281 1067 2282 Q 1002 2353 915 2397 L 842 2432 843 2432 744 2472 743 2472 Q 691 2492 637 2493 L 631 2493 630 2493 500 2485 341 2463 304 2455 303 2455 Q 281 2448 266 2438 240 2419 210 2421 L 189 2425 169 2426 Q 140 2432 121 2454 101 2476 99 2505 L 86 2646 86 2647 Q 64 2802 32 2954 12 3046 -38 3111 L -85 3158 Q -111 3179 -141 3196 -168 3209 -220 3222 -248 3228 -266 3251 -285 3274 -286 3303 -287 3331 -270 3355 -241 3397 -219 3448 L -219 3447 Q -185 3533 -229 3624 -262 3689 -300 3751 -313 3770 -313 3794 -314 3816 -303 3837 -260 3924 -280 4039 L -280 4040 Q -295 4132 -339 4213 L -351 4240 Q -357 4263 -350 4286 -343 4308 -326 4325 -262 4386 -284 4481 L -286 4503 Q -284 4571 -270 4619 -237 4734 -255 4853 -274 4980 -312 5105 L -313 5106 Q -352 5236 -370 5372 L -370 5373 Q -387 5513 -389 5654 L -389 5655 Q -392 5791 -357 5922 L -351 5945 -340 5985 -339 5987 -339 5986 -339 5988 -338 5990 -327 6046 -327 6049 -326 6053 Q -316 6120 -315 6188 L -315 6189 Q -315 6294 -366 6363 -378 6378 -382 6396 L -383 6432 -375 6486 -375 6487 Q -363 6604 -392 6721 L -452 6984 Q -470 7070 -469 7159 L -469 7164 -469 7171 -469 7172 -468 7184 Q -468 7201 -460 7217 -420 7303 -393 7416 L -393 7417 Q -372 7501 -380 7587 L -390 7651 Q -418 7776 -453 7902 L -461 7931 -464 7963 -441 8192 -441 8193 -435 8251 -2792 8251 -2815 8234 Q -2837 8223 -2862 8225 -2886 8227 -2906 8242 L -2917 8251 -3137 8251 -3139 8183 Q -3142 8061 -3123 7940 -3104 7815 -3092 7690 L -3092 7689 Q -3082 7574 -3046 7465 -3010 7356 -2988 7244 L -2978 7192 -2976 7179 Q -2957 7046 -2969 6913 -2981 6788 -2999 6702 L -2999 6703 -3001 6694 -3002 6690 -3003 6706 Q -3010 6738 -3036 6758 L -3038 6760 -3011 6657 -3009 6660 -3006 6672 -3006 6671 -3005 6675 -3003 6683 -3002 6690 Q -3001 6666 -3014 6645 L -3024 6630 -3024 6631 Q -3054 6593 -3067 6547 L -3077 6491 -3077 6490 Q -3087 6365 -3074 6271 -3071 6250 -3078 6230 L -3103 6149 -3103 6146 -3115 6096 -3115 6094 -3116 6091 -3116 6088 -3116 6087 -3124 6038 -3128 5989 -3135 5883 -3135 5882 -3146 5723 -3146 5722 -3155 5469 Q -3156 5350 -3231 5309 L -3246 5292 -3245 5264 Q -3239 5237 -3222 5205 L -3220 5201 -3220 5203 -3216 5194 -3216 5195 Q -3171 5116 -3179 5046 L -3179 5045 -3181 5032 -3181 5033 Q -3189 4979 -3226 4930 L -3227 4930 -3258 4887 Q -3312 4808 -3341 4720 -3366 4644 -3309 4591 L -3308 4591 -3280 4568 Q -3224 4528 -3163 4536 L -3152 4538 -3107 4536 -3069 4511 Q -3001 4435 -2941 4387 L -2939 4385 -2934 4381 Q -2909 4357 -2907 4324 -2905 4290 -2926 4263 L -2967 4200 Q -3018 4098 -3009 4012 -3005 3980 -3022 3954 -3040 3928 -3069 3919 L -3128 3922 -3179 3941 -3180 3942 -3247 3965 Q -3210 3900 -3179 3833 -3143 3753 -3085 3687 L -3037 3639 -3038 3640 -2951 3568 Q -2926 3555 -2902 3539 -2869 3517 -2840 3490 -2816 3466 -2813 3434 -2811 3400 -2831 3374 -2852 3348 -2884 3342 -2917 3336 -2945 3354 L -2998 3388 -2999 3389 -3040 3418 -3068 3429 -3104 3438 -3096 3432 -3038 3390 -3038 3391 Q -2978 3354 -2925 3338 L -2924 3337 -2896 3330 -2895 3330 -2882 3328 Q -2848 3324 -2826 3298 L -2816 3284 -2815 3288 Q -2773 3331 -2737 3380 L -2727 3409 M -1427 -17825 L -1423 -17826 Q -1401 -17823 -1434 -17789 L -1435 -17792 -1427 -17825 M -2645 -16659 L -2643 -16652 -2646 -16630 -2645 -16659 M -2979 -13517 L -2977 -13513 -2973 -13502 -2979 -13517 M -1328 -10930 L -1324 -10910 Q -1316 -10861 -1335 -10814 L -1337 -10811 -1340 -10803 -1328 -10930 M -2675 -5494 Q -2722 -5531 -2735 -5590 -2751 -5658 -2715 -5717 L -2713 -5720 Q -2708 -5602 -2675 -5494 M -3044 -5185 Q -3062 -5232 -3103 -5262 -3087 -5200 -3077 -5183 -3067 -5195 -3066 -5191 L -3067 -5184 -3052 -5185 -3044 -5185 M -546 -2331 Q -488 -2307 -459 -2249 L -457 -2246 Q -432 -2194 -442 -2138 -450 -2094 -477 -2061 -462 -2215 -546 -2319 L -546 -2331 M -1888 -3012 L -1887 -2999 -1899 -3050 -1893 -3039 -1888 -3012 M -1894 -3042 L -1894 -3041 -1898 -3049 -1894 -3042 M -2229 -2950 L -2230 -2955 -2229 -2954 -2229 -2950 M -3015 -1856 L -3014 -1853 -3013 -1851 -3017 -1858 -3015 -1856 Q -3042 -1910 -3057 -1780 -3022 -1803 -3001 -1837 L -3015 -1856 M -2327 2005 L -2340 1992 Q -2386 1940 -2383 1872 -2381 1810 -2365 1767 -2353 1732 -2329 1706 L -2332 1749 -2329 1965 -2327 2005 M -1793 4170 L -1849 4179 Q -1921 4178 -1971 4127 -2023 4077 -2023 4005 L -2017 3959 -2017 3961 Q -2019 4041 -1970 4077 L -1975 4091 -1977 4101 -1952 4132 -1934 4155 -1793 4170 M -329 2798 L -326 2787 -333 2817 -329 2798 M -1972 5885 Q -1967 5920 -1978 5958 L -1980 5966 Q -1996 6033 -2055 6071 -2114 6108 -2182 6095 L -2184 6094 Q -2245 6082 -2284 6034 -2323 5985 -2323 5924 -2323 5893 -2313 5865 -2314 5921 -2285 5979 -2253 6043 -2182 6041 -1996 6037 -1972 5885 M -2920 6663 L -2922 6655 -2920 6662 -2920 6663 M -2919 6665 L -2918 6668 -2918 6670 -2919 6664 -2919 6665 M -2943 6892 L -2936 6925 -2930 6937 Q -2914 6965 -2882 6975 L -2820 6971 Q -2790 6957 -2777 6927 -2764 6897 -2774 6865 L -2774 6864 Q -2785 6834 -2812 6817 -2839 6800 -2870 6806 -2902 6811 -2922 6835 -2943 6859 -2943 6891 L -2943 6892 M 115 2368 L 97 2381 99 2400 134 2403 Q 181 2403 222 2379 321 2385 263 2357 L 259 2355 Q 246 2362 234 2371 L 222 2379 115 2368 M 907 2303 L 840 2276 841 2276 Q 800 2259 757 2251 L 664 2243 663 2243 639 2244 638 2244 Q 542 2248 449 2275 374 2296 304 2331 L 302 2332 290 2338 276 2345 Q 297 2353 317 2368 L 326 2372 328 2372 353 2377 512 2399 629 2406 632 2406 636 2406 712 2391 714 2391 807 2354 808 2353 875 2321 876 2320 907 2303 M 283 1442 L 283 1440 284 1367 200 1573 192 1592 192 1593 Q 160 1675 143 1761 L 142 1763 140 1776 139 1777 99 1973 96 1988 110 1973 111 1972 131 1943 132 1941 Q 169 1867 195 1790 L 196 1788 259 1597 Q 282 1521 283 1442";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([34,34,34,0.6627451]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(2.56341552734375,0,0,2.56341552734375,-1966,-20892);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.4666666666666667,tocolor(ctrans.apply([102,102,102,0.6627451])));
	grd.addColorStop(1.0,tocolor(ctrans.apply([34,34,34,0.6627451])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M 143 -20608 L 160 -20592 Q 171 -20583 185 -20575 L 161 -20562 Q -65 -20422 15 -20113 L 17 -20103 18 -20089 15 -20069 15 -20067 Q 5 -20032 -16 -19990 L -16 -19989 Q -123 -19780 -160 -19528 -191 -19511 -213 -19481 -229 -19459 -237 -19434 -281 -19402 -298 -19349 -318 -19291 -295 -19234 -235 -19078 -316 -18959 L -317 -18958 -350 -18924 Q -402 -18893 -423 -18835 -445 -18777 -424 -18719 -397 -18638 -384 -18543 L -382 -18530 -382 -18529 Q -370 -18421 -376 -18295 L -377 -18268 -376 -18272 Q -384 -18139 -399 -18010 L -400 -18009 -403 -17979 Q -411 -17921 -381 -17870 L -374 -17858 Q -363 -17827 -340 -17801 -301 -17757 -246 -17745 -167 -17697 -37 -17821 L 98 -17905 196 -17964 197 -17964 310 -18034 310 -18035 515 -18159 734 -18289 734 -18288 765 -18307 Q 854 -18360 945 -18407 L 1168 -18533 Q 1267 -18593 1383 -18651 L 1384 -18651 Q 1512 -18716 1616 -18779 L 1816 -18895 1815 -18894 Q 1925 -18954 2032 -19016 L 2040 -19020 2045 -19023 2227 -19125 2229 -19127 2249 -19137 2439 -19239 2448 -19244 2450 -19245 2451 -19245 2685 -19369 2899 -19479 2900 -19479 Q 3032 -19545 3154 -19624 L 3154 -19623 3370 -19753 3604 -19892 Q 3704 -19953 3811 -19993 3843 -20006 3813 -20034 3861 -20000 3854 -19945 3833 -19833 3767 -19763 3671 -19666 3582 -19593 L 3396 -19434 3396 -19433 3283 -19336 3218 -19283 3218 -19282 3016 -19126 2934 -19067 2934 -19068 2805 -18984 Q 2686 -18913 2576 -18837 L 2576 -18838 Q 2454 -18756 2348 -18645 L 2347 -18644 2290 -18585 2243 -18535 Q 2198 -18487 2197 -18422 2196 -18357 2238 -18306 2280 -18257 2345 -18247 2446 -18232 2532 -18200 L 2531 -18201 2536 -18201 Q 2540 -18170 2513 -18153 L 2512 -18152 Q 2412 -18091 2300 -18052 L 2299 -18052 2196 -18017 2196 -18016 2043 -17965 2045 -17966 1798 -17883 1677 -17843 1554 -17810 1311 -17750 1310 -17750 1048 -17686 Q 916 -17654 786 -17606 L 787 -17607 631 -17555 632 -17556 569 -17537 568 -17536 372 -17469 Q 273 -17433 175 -17400 L 173 -17399 36 -17352 23 -17347 -28 -17328 -27 -17329 -59 -17317 -137 -17286 -138 -17286 -141 -17284 -152 -17280 -206 -17259 -207 -17259 -226 -17249 Q -267 -17231 -293 -17196 L -299 -17188 Q -313 -17220 -313 -17254 L -286 -17281 Q -182 -17356 -247 -17443 L -287 -17446 -320 -17419 Q -498 -17262 -492 -17029 -486 -17024 -480 -17022 L -438 -17015 Q -387 -17069 -358 -17134 L -333 -17105 -333 -17104 -328 -17100 Q -330 -17075 -323 -17048 L -309 -16979 Q -303 -16930 -271 -16892 L -263 -16882 Q -276 -16851 -276 -16815 -276 -16775 -259 -16740 -462 -16702 -625 -16602 L -625 -16591 -624 -16580 -621 -16570 Q -421 -16527 -209 -16589 -110 -16618 -8 -16630 180 -16651 303 -16771 L 302 -16781 Q 286 -16848 213 -16839 L 76 -16805 Q 78 -16837 68 -16869 L 63 -16881 77 -16884 84 -16885 87 -16885 80 -16885 163 -16899 169 -16901 212 -16908 213 -16908 Q 306 -16916 397 -16942 L 399 -16943 561 -16988 872 -17069 Q 1257 -17163 1600 -17226 L 1806 -17265 1807 -17265 2190 -17345 2275 -17363 2275 -17364 2574 -17420 Q 2743 -17446 2859 -17475 2956 -17499 3065 -17508 L 3302 -17526 3304 -17526 3460 -17541 3461 -17541 3556 -17554 Q 3577 -17493 3607 -17435 3534 -17402 3456 -17376 L 3455 -17375 3200 -17294 2961 -17234 2960 -17234 2733 -17192 2731 -17192 2469 -17144 2468 -17144 2458 -17142 2456 -17142 Q 2331 -17116 2208 -17078 L 2209 -17079 1984 -17011 1985 -17011 1783 -16952 Q 1721 -16934 1686 -16880 1566 -16696 1692 -16603 L 1694 -16601 Q 1733 -16543 1846 -16528 2048 -16502 2249 -16537 L 2705 -16613 Q 2931 -16649 3165 -16660 3177 -16598 3169 -16527 2879 -16431 2578 -16370 L 2579 -16371 2438 -16352 2440 -16353 Q 2184 -16340 2042 -16178 2002 -16135 1997 -16077 1991 -16020 2022 -15970 2053 -15920 2107 -15899 2204 -15862 2315 -15841 L 2316 -15841 Q 2435 -15819 2559 -15812 L 2580 -15755 Q 2523 -15708 2448 -15691 L 2449 -15691 2191 -15642 2193 -15643 1960 -15624 1959 -15624 Q 1779 -15624 1662 -15503 L 1661 -15502 Q 1486 -15348 1616 -15084 1644 -15027 1639 -14966 1540 -14987 1451 -15038 L 1450 -15038 Q 1338 -15102 1231 -15177 1034 -15314 927 -15194 825 -15148 821 -14935 821 -14868 775 -14823 L 744 -14822 743 -14822 Q 654 -14876 585 -14958 L 585 -14959 Q 465 -15105 306 -14997 L 305 -14996 Q 205 -14928 115 -14837 L 114 -14836 105 -14825 104 -14825 98 -14830 97 -14830 -97 -14945 Q -144 -14974 -198 -14970 -252 -14966 -294 -14932 -337 -14898 -352 -14845 -392 -14706 -408 -14573 L -408 -14574 -427 -14388 -427 -14387 -433 -14281 Q -434 -14247 -422 -14214 L -418 -14186 -418 -14185 Q -400 -14030 -434 -13878 L -434 -13879 -482 -13650 -482 -13651 -516 -13493 -516 -13494 Q -525 -13458 -527 -13416 -529 -13371 -507 -13329 -486 -13288 -447 -13263 L -444 -13261 -442 -13259 -432 -13247 Q -416 -13217 -411 -13172 L -411 -13171 Q -402 -13051 -408 -12929 L -414 -12791 -418 -12651 -418 -12649 Q -419 -12568 -429 -12482 -434 -12443 -420 -12405 L -383 -12292 Q -360 -12216 -348 -12127 L -348 -12126 -343 -12085 -322 -11836 Q -316 -11716 -318 -11594 -320 -11542 -331 -11481 L -331 -11482 Q -344 -11415 -367 -11337 L -398 -11244 Q -423 -11178 -393 -11113 -371 -11063 -326 -11036 L -324 -11031 -320 -11008 Q -360 -10972 -373 -10920 -386 -10868 -366 -10817 L -362 -10804 -362 -10803 Q -341 -10733 -369 -10664 -390 -10615 -429 -10583 -472 -10549 -488 -10496 -504 -10444 -485 -10392 -467 -10339 -423 -10307 -373 -10269 -367 -10201 L -367 -10202 Q -360 -10120 -404 -10052 -499 -9941 -398 -9777 L -400 -9779 -384 -9746 Q -369 -9703 -378 -9656 L -378 -9655 Q -389 -9599 -409 -9546 L -409 -9545 Q -426 -9502 -449 -9461 -557 -9272 -492 -9142 -470 -9084 -416 -9053 L -378 -9037 -378 -9030 -378 -9029 Q -377 -8971 -390 -8921 L -391 -8920 Q -399 -8892 -413 -8866 L -415 -8863 Q -461 -8795 -447 -8665 -466 -8642 -476 -8611 -492 -8560 -476 -8508 -466 -8475 -444 -8449 -480 -8422 -497 -8379 -518 -8327 -505 -8272 -492 -8221 -453 -8186 L -448 -8182 -445 -8178 Q -417 -8154 -402 -8121 L -401 -8120 Q -389 -8090 -385 -8054 L -385 -8055 Q -375 -7944 -390 -7833 L -390 -7835 Q -394 -7809 -404 -7793 L -406 -7791 Q -450 -7768 -475 -7725 -500 -7682 -498 -7632 -496 -7583 -468 -7541 L -447 -7510 -447 -7509 Q -412 -7453 -383 -7390 -381 -7310 -386 -7219 L -396 -6989 -396 -6988 Q -399 -6864 -415 -6742 L -454 -6488 -454 -6487 -473 -6378 -473 -6379 -494 -6261 -494 -6260 Q -516 -6137 -555 -6018 L -556 -6016 -626 -5794 -626 -5793 -650 -5718 Q -669 -5661 -647 -5604 -625 -5548 -573 -5517 -534 -5494 -492 -5493 -530 -5465 -549 -5420 -570 -5371 -559 -5319 -549 -5267 -511 -5229 -467 -5183 -483 -5118 L -482 -5118 Q -486 -5103 -497 -5095 -559 -5067 -585 -5004 -611 -4941 -587 -4878 -582 -4863 -592 -4852 -782 -4652 -641 -4538 L -641 -4539 Q -588 -4468 -579 -4373 L -579 -4374 -581 -4341 Q -611 -4301 -615 -4253 -619 -4205 -597 -4160 -575 -4116 -534 -4090 -556 -4074 -555 -3982 L -555 -3946 -554 -3933 -545 -3770 Q -543 -3723 -516 -3683 -489 -3643 -446 -3622 L -424 -3611 -424 -3467 Q -421 -3336 -426 -3205 L -426 -3204 -432 -3065 -472 -2857 -493 -2717 Q -500 -2654 -463 -2601 -426 -2548 -364 -2532 -322 -2521 -281 -2531 L -280 -2530 -280 -2529 Q -267 -2505 -277 -2487 L -278 -2486 -292 -2471 Q -351 -2457 -388 -2410 -426 -2363 -426 -2303 -426 -2244 -389 -2196 L -371 -2163 -391 -2138 Q -420 -2097 -421 -2047 L -454 -1956 Q -473 -1912 -466 -1865 L -454 -1820 -460 -1787 Q -466 -1726 -431 -1675 -461 -1641 -471 -1596 -482 -1546 -463 -1497 L -461 -1497 Q -474 -1432 -438 -1374 -420 -1346 -395 -1327 L -401 -1312 Q -422 -1258 -406 -1202 -379 -1106 -386 -995 L -396 -936 Q -408 -898 -402 -858 -396 -819 -373 -786 -340 -728 -340 -632 -340 -577 -353 -549 L -379 -510 -384 -528 Q -388 -587 -456 -624 L -456 -622 -489 -613 -498 -611 Q -527 -603 -533 -575 L -546 -552 Q -630 -554 -673 -481 -739 -369 -727 -227 -752 -253 -786 -271 -803 -269 -822 -255 -871 -219 -851 -163 -853 -103 -858 -44 L -907 10 -959 12 -970 16 Q -1061 43 -1096 125 L -1114 152 -1128 164 -1138 175 -1142 185 -1142 188 -1171 188 Q -1196 190 -1199 215 -1212 311 -1212 412 L -1218 419 -1225 430 -1228 441 -1229 462 -1229 473 -1213 494 -1210 497 -1208 537 Q -1205 581 -1209 622 -1227 787 -1099 846 L -1096 854 -1092 864 -1078 882 Q -1047 909 -1020 922 -1002 958 -989 997 L -970 1035 -968 1038 -978 1047 Q -998 1067 -1009 1092 L -991 1088 -959 1050 Q -937 1077 -905 1095 L -840 1095 Q -769 1000 -716 892 L -711 890 Q -611 757 -567 589 -543 497 -531 403 L -530 399 Q -505 336 -522 276 L -522 265 Q -518 105 -658 80 L -663 76 Q -571 -30 -502 -149 L -497 -150 -498 -129 Q -495 -68 -454 -21 -465 -18 -464 -2 -485 37 -484 84 -482 145 -442 192 -388 256 -376 345 L -376 346 Q -364 447 -385 547 L -385 545 Q -404 632 -451 704 -486 755 -480 817 -474 879 -430 923 -399 956 -414 1002 L -415 1004 -445 1094 Q -457 1128 -454 1163 -452 1198 -435 1230 -396 1305 -411 1386 L -411 1387 Q -439 1522 -391 1698 L -381 1726 Q -334 1828 -321 1939 L -320 1940 Q -306 2059 -308 2181 L -308 2183 Q -311 2320 -306 2458 L -306 2459 Q -303 2522 -306 2585 -309 2645 -273 2694 L -266 2703 Q -235 2742 -186 2757 L -180 2759 -118 2766 -67 2753 Q -45 2743 -27 2730 L -12 2717 -17 2744 -53 2936 Q -68 3007 -106 3057 L -108 3060 -139 3091 -182 3120 -182 3119 -240 3138 -260 3144 Q -302 3159 -332 3194 L -333 3196 Q -370 3241 -372 3299 -375 3357 -341 3405 -317 3439 -299 3482 -281 3532 -307 3586 L -307 3585 -373 3705 Q -398 3744 -400 3790 -402 3836 -380 3877 -351 3940 -365 4024 L -366 4027 Q -379 4107 -417 4176 -429 4196 -434 4219 -446 4264 -433 4310 -420 4355 -385 4388 -358 4417 -368 4461 -374 4483 -373 4506 -370 4586 -353 4642 L -353 4643 Q -326 4739 -341 4840 L -341 4841 Q -359 4961 -395 5080 L -396 5081 Q -437 5218 -455 5361 L -455 5362 Q -474 5506 -476 5652 L -476 5654 Q -479 5801 -441 5944 L -440 5945 -434 5969 -424 6006 -423 6007 -422 6011 -413 6056 -412 6061 -413 6059 -412 6066 Q -402 6127 -402 6188 L -402 6190 Q -401 6262 -434 6310 -457 6339 -466 6375 -475 6411 -468 6448 L -461 6495 -461 6496 Q -450 6598 -476 6700 L -475 6700 Q -510 6833 -537 6966 L -537 6967 Q -557 7060 -555 7157 L -555 7161 -555 7165 -555 7173 -555 7175 -555 7188 Q -553 7222 -538 7254 -502 7333 -477 7436 L -477 7437 Q -460 7507 -466 7579 L -467 7580 -475 7632 Q -502 7755 -536 7878 L -536 7879 -545 7909 Q -554 7940 -550 7973 L -530 8164 -2763 8164 -2776 8157 Q -2820 8134 -2869 8139 -2911 8143 -2945 8164 L -3053 8164 Q -3054 8058 -3038 7953 -3018 7826 -3006 7698 L -3005 7696 Q -2996 7591 -2963 7493 L -2963 7492 Q -2926 7378 -2903 7260 L -2903 7261 -2893 7207 -2893 7206 -2891 7192 Q -2881 7128 -2878 7065 -2831 7071 -2785 7050 -2724 7022 -2697 6962 -2671 6901 -2691 6838 L -2692 6836 Q -2713 6776 -2767 6743 -2822 6710 -2884 6720 L -2906 6725 -2920 6730 -2967 6759 -2931 6623 -2925 6639 -2929 6628 -2922 6651 -2922 6648 -2919 6665 -2919 6667 -2918 6670 -2916 6676 -2915 6682 Q -2917 6639 -2940 6600 L -2956 6577 -2957 6575 Q -2975 6552 -2983 6523 L -2984 6523 -2990 6484 -2990 6483 Q -3000 6368 -2988 6283 -2983 6241 -2997 6201 L -3019 6128 -3020 6125 -3030 6081 -3031 6073 -3031 6071 -3038 6027 -3038 6028 -3042 5984 -3042 5983 -3049 5877 -3049 5876 -3060 5718 -3060 5717 Q -3068 5593 -3069 5469 L -3069 5468 Q -3069 5322 -3151 5257 L -3146 5246 -3145 5245 -3144 5243 -3141 5238 -3141 5237 Q -3081 5132 -3093 5038 L -3093 5037 -3095 5019 Q -3106 4945 -3158 4877 L -3159 4876 -3186 4839 -3187 4838 Q -3233 4770 -3258 4693 -3266 4671 -3250 4655 L -3230 4639 -3229 4638 Q -3204 4620 -3176 4621 L -3171 4622 -3081 4618 Q -3037 4603 -3005 4569 -2947 4504 -2895 4460 L -2875 4444 Q -2826 4397 -2821 4330 -2816 4262 -2859 4209 L -2890 4162 -2890 4161 Q -2927 4085 -2923 4022 -2916 3959 -2950 3907 -2984 3855 -3044 3836 L -3080 3829 Q -3054 3783 -3020 3744 L -2979 3703 -2980 3704 -2905 3641 -2854 3612 -2854 3611 Q -2815 3585 -2781 3553 -2733 3506 -2727 3440 L -2727 3409 Q -2703 3479 -2667 3547 -2637 3604 -2576 3575 -2484 3530 -2521 3426 -2585 3243 -2606 3050 -2609 3023 -2603 3000 -2564 2843 -2707 2810 L -2715 2816 Q -2739 2827 -2746 2852 L -2767 2949 Q -2811 2876 -2872 2821 L -2873 2823 -2890 2826 -2897 2828 Q -2920 2849 -2919 2878 -2915 2973 -2892 3067 L -2935 3061 -3006 3063 -3010 3063 -3065 3063 -3067 3063 -3081 3060 -3080 3060 -3093 3052 -3094 3051 Q -3103 3043 -3104 3032 -3117 2879 -3154 2733 L -3163 2699 -3163 2700 -3178 2647 -3151 2647 -3113 2641 Q -3076 2629 -3045 2601 -3013 2570 -2999 2530 L -2992 2500 Q -2988 2469 -2993 2441 -2999 2413 -3014 2387 L -3034 2345 -3033 2346 Q -3050 2297 -3048 2254 L -3049 2222 Q -3049 2205 -3041 2187 -3025 2148 -3027 2107 -3030 2065 -3051 2029 L -3091 1959 -3091 1960 Q -3126 1890 -3173 1823 L -3185 1806 -3186 1804 Q -3243 1716 -3269 1615 L -3224 1619 Q -3166 1616 -3123 1580 -3076 1573 -3039 1543 -3000 1510 -2984 1462 -2969 1414 -2981 1366 L -2982 1364 -2982 1362 Q -2992 1322 -2986 1277 L -2986 1279 -2983 1264 -2968 1230 Q -2938 1180 -2943 1123 -2949 1065 -2989 1022 L -2989 1021 -2992 1011 -2992 1009 Q -3000 973 -2990 944 L -2973 917 Q -2934 872 -2931 814 -2927 754 -2961 705 L -3001 643 -3014 620 -3013 621 Q -3065 528 -3080 423 L -3082 414 Q -3092 332 -3056 260 -3040 225 -3016 203 L -3008 195 -3012 199 Q -2961 155 -2953 90 -2948 50 -2959 14 -2939 -19 -2935 -61 -2930 -126 -2968 -178 -3010 -235 -3044 -296 -3034 -311 -3027 -327 -3002 -385 -3020 -444 -3038 -502 -3022 -554 -3005 -607 -3022 -659 L -3032 -705 -3034 -722 -3034 -724 Q -3037 -764 -3016 -787 -2969 -827 -2957 -886 -2945 -945 -2973 -999 -2996 -1042 -3035 -1067 -3050 -1121 -3026 -1164 -2999 -1207 -2999 -1258 -2999 -1309 -3027 -1351 -2970 -1388 -2953 -1453 -2935 -1520 -2968 -1580 L -2968 -1590 Q -2968 -1634 -2990 -1672 -2970 -1716 -2976 -1764 -2981 -1804 -3001 -1837 L -2990 -1860 Q -2969 -1910 -2981 -1963 L -2987 -1969 Q -2954 -2028 -2968 -2092 -2983 -2157 -3037 -2196 L -3040 -2198 Q -3029 -2218 -3021 -2240 -3004 -2297 -3025 -2352 -3047 -2408 -3098 -2438 L -3106 -2448 -3107 -2448 Q -3144 -2494 -3137 -2552 L -3135 -2551 Q -3073 -2542 -3020 -2574 -2967 -2606 -2946 -2665 -2925 -2724 -2947 -2782 L -2968 -2843 -2968 -2844 Q -2995 -2939 -2998 -3023 -2998 -3152 -2989 -3278 L -2989 -3279 Q -2981 -3411 -2982 -3544 L -2984 -3670 -2945 -3690 Q -2905 -3713 -2881 -3752 -2867 -3775 -2860 -3801 L -2854 -3801 Q -2792 -3807 -2747 -3852 -2702 -3897 -2696 -3959 -2691 -4022 -2728 -4074 -2765 -4126 -2826 -4141 -2861 -4151 -2871 -4141 -2860 -4196 -2884 -4247 -2908 -4298 -2957 -4326 L -2957 -4340 -2957 -4341 Q -2955 -4389 -2915 -4411 -2861 -4441 -2837 -4498 -2814 -4556 -2833 -4615 -2852 -4675 -2904 -4708 -2956 -4742 -3018 -4735 -3055 -4731 -3076 -4763 -3120 -4832 -3126 -4913 -3129 -4959 -3100 -4985 -3057 -5019 -3041 -5072 -3024 -5125 -3041 -5177 L -3044 -5185 Q -2999 -5184 -2958 -5207 -2913 -5232 -2889 -5276 -2865 -5321 -2869 -5371 -2876 -5464 -2890 -5548 L -2890 -5549 -2933 -5798 -2933 -5800 Q -2958 -5940 -2989 -6081 L -2988 -6079 Q -3014 -6199 -3027 -6321 -3041 -6458 -3063 -6595 L -3063 -6592 Q -3077 -6692 -3069 -6792 L -3069 -6793 -3053 -7023 -3053 -7024 Q -3046 -7130 -3028 -7237 L -3026 -7265 -3024 -7281 -2987 -7356 Q -2966 -7393 -2963 -7434 -2961 -7475 -2977 -7513 -2989 -7547 -2970 -7582 -2951 -7622 -2951 -7665 -2953 -7709 -2974 -7747 L -2983 -7765 Q -3011 -7840 -2991 -7921 -2966 -8023 -2928 -8090 -2894 -8148 -2907 -8213 -2921 -8279 -2975 -8318 L -2981 -8336 -2982 -8338 Q -3013 -8422 -2996 -8509 -2951 -8743 -3004 -8849 -3014 -8883 -2986 -8913 L -2985 -8914 Q -2776 -9144 -2936 -9341 L -2944 -9351 -2949 -9358 Q -2996 -9418 -3026 -9498 -3055 -9574 -3033 -9650 -3004 -9754 -2961 -9834 -2938 -9878 -2940 -9927 -2943 -9976 -2971 -10016 -3004 -10063 -3035 -10128 -3066 -10191 -3045 -10257 L -3045 -10258 Q -3032 -10296 -2996 -10309 -2935 -10329 -2901 -10384 -2867 -10439 -2878 -10502 -2889 -10566 -2938 -10607 -2962 -10629 -2970 -10665 L -2970 -10664 Q -2991 -10759 -2963 -10852 L -2963 -10853 -2948 -10898 Q -2924 -10960 -2948 -11022 L -2966 -11083 Q -2936 -11078 -2902 -11084 -2833 -11097 -2793 -11155 L -2778 -11176 Q -2744 -11226 -2748 -11286 -2753 -11346 -2794 -11390 -2835 -11435 -2894 -11444 -2954 -11454 -3006 -11424 -3013 -11420 -3019 -11417 L -3026 -11413 -3041 -11429 Q -3094 -11499 -3119 -11584 L -3119 -11583 Q -3152 -11698 -3164 -11816 -3174 -11927 -3164 -12036 L -3164 -12037 Q -3155 -12154 -3131 -12274 L -3102 -12402 -3102 -12403 -3072 -12509 -3071 -12512 -3065 -12530 Q -3054 -12568 -3059 -12605 -3047 -12759 -3054 -12879 L -3055 -12896 -3055 -12895 Q -3062 -13017 -3059 -13138 -3058 -13233 -3014 -13312 L -3014 -13313 -3007 -13323 -3007 -13322 -3004 -13327 Q -2971 -13366 -2963 -13416 -2960 -13440 -2963 -13463 L -2962 -13481 -2962 -13484 -2962 -13485 -2961 -13578 -2961 -13580 Q -2960 -13656 -2969 -13729 L -2969 -13730 -2980 -13807 -2983 -13825 -3006 -13921 Q -3041 -14046 -3032 -14179 -3029 -14236 -3060 -14284 L -3071 -14306 -3072 -14309 -3120 -14431 -3121 -14432 Q -3161 -14524 -3167 -14627 L -3172 -14739 Q -3175 -14802 -3217 -14849 -3260 -14896 -3323 -14904 -3386 -14912 -3439 -14878 L -3521 -14826 Q -3605 -14917 -3697 -14985 L -3699 -14986 -3717 -14999 -3717 -15105 Q -3619 -15070 -3539 -15140 -3512 -15164 -3533 -15192 L -3574 -15240 -3574 -15241 Q -3565 -15267 -3585 -15283 -3669 -15353 -3710 -15443 -3710 -15555 -3717 -15669 L -3717 -15784 Q -3679 -15794 -3675 -15843 -3655 -16124 -3717 -16388 L -3717 -16423 Q -3665 -16387 -3604 -16408 -3591 -16413 -3581 -16422 -3555 -16483 -3607 -16528 L -3717 -16616 -3717 -16630 -3603 -16592 Q -3516 -16563 -3352 -16540 -3305 -16534 -3261 -16553 -3217 -16572 -3188 -16611 -3160 -16651 -3156 -16698 L -3150 -16771 -3150 -16772 -3149 -16783 Q -3145 -16838 -3173 -16886 -3201 -16934 -3252 -16956 -3411 -17026 -3495 -17056 L -3494 -17055 -3681 -17124 -3662 -17128 Q -3611 -17139 -3595 -17188 -3563 -17284 -3671 -17331 L -3644 -17400 Q -3590 -17541 -3717 -17597 L -3717 -17598 -3717 -17757 Q -3652 -17711 -3588 -17780 -3573 -17795 -3577 -17815 -3596 -17924 -3661 -17987 L -3530 -17901 -3441 -17842 -3443 -17844 -3405 -17817 Q -3350 -17779 -3283 -17787 -3218 -17795 -3174 -17846 -3130 -17898 -3132 -17964 L -3133 -18015 -3133 -18017 -3130 -18154 Q -3124 -18250 -3103 -18345 L -3103 -18347 -3096 -18377 Q -3087 -18415 -3094 -18453 L -3103 -18481 Q -3086 -18513 -3084 -18551 -3078 -18672 -3111 -18773 L -3111 -18774 Q -3136 -18850 -3180 -18915 -3199 -18942 -3226 -18960 -3263 -18985 -3278 -19013 -3283 -19056 -3246 -19117 -3226 -19150 -3222 -19188 -3218 -19226 -3230 -19262 L -3268 -19374 -3268 -19376 -3274 -19392 -3274 -19394 Q -3309 -19494 -3326 -19654 -3332 -19705 -3364 -19745 -3445 -19864 -3406 -20118 -3401 -20153 -3409 -20187 -3418 -20221 -3440 -20249 -3476 -20298 -3491 -20359 L -3492 -20360 Q -3501 -20398 -3503 -20440 -3505 -20483 -3527 -20520 -3545 -20555 -3534 -20593 L -3533 -20592 -3532 -20583 -3527 -20561 Q -3515 -20554 -3503 -20548 L -3502 -20543 -3498 -20532 -3483 -20522 -3459 -20509 -3444 -20500 -3429 -20498 Q -3388 -20472 -3336 -20461 L -3196 -20427 Q -3087 -20397 -2976 -20382 L -2470 -20323 Q -1890 -20262 -1335 -20366 -1059 -20339 -790 -20389 -715 -20367 -613 -20399 -426 -20459 -232 -20477 -108 -20488 -31 -20557 L 2 -20560 7 -20560 Q 107 -20552 143 -20608 M -3226 -20772 L -3142 -20796 -3184 -20780 -3220 -20771 -3226 -20772 M -2795 -20864 L -2786 -20866 -2610 -20891 -2493 -20904 -2765 -20864 -2786 -20866 -2786 -20865 -2795 -20864 M -3877 -18130 L -3825 -18096 -3859 -18062 -3879 -18061 -3887 -18055 -3887 -18137 -3877 -18130 M -1268 -18073 L -1304 -18076 -1305 -18074 -1311 -18072 -1319 -18069 Q -1333 -18058 -1337 -18040 L -1344 -18019 Q -1488 -17979 -1563 -17855 -1673 -17674 -1506 -17584 L -1504 -17562 Q -1497 -17528 -1466 -17508 L -1465 -17497 -1463 -17487 -1447 -17464 -1441 -17443 -1451 -17432 -1459 -17422 Q -1467 -17400 -1459 -17379 -1438 -17325 -1387 -17357 -1280 -17426 -1205 -17531 -1112 -17663 -1132 -17812 -1149 -17936 -1240 -17986 -1237 -18004 -1241 -18019 L -1243 -18040 -1258 -18061 -1268 -18073 M -2355 -16846 Q -2366 -16866 -2387 -16879 L -2434 -16882 Q -2473 -16854 -2526 -16840 L -2558 -16837 Q -2632 -16846 -2688 -16792 -2760 -16725 -2810 -16640 -2919 -16459 -2768 -16332 -2717 -16321 -2671 -16347 L -2656 -16339 -2663 -16318 -2664 -16307 -2642 -16300 -2598 -16325 Q -2576 -16343 -2552 -16347 -2493 -16311 -2434 -16348 -2324 -16417 -2273 -16548 -2206 -16720 -2336 -16814 L -2355 -16846 M -2818 -17868 L -2817 -17870 -2790 -17807 Q -2804 -17784 -2825 -17792 L -2827 -17803 Q -2828 -17836 -2818 -17868 M -2746 -18411 L -2790 -18414 -2790 -18412 -2797 -18410 -2804 -18407 Q -2943 -18300 -2970 -18130 -3011 -17882 -2883 -17677 L -2764 -17670 Q -2592 -17793 -2562 -18012 -2541 -18172 -2613 -18314 -2667 -18331 -2718 -18357 -2716 -18375 -2728 -18389 L -2746 -18411 M -2645 -16659 L -2646 -16630 Q -2657 -16565 -2656 -16501 -2696 -16458 -2736 -16472 L -2732 -16483 Q -2710 -16577 -2653 -16656 L -2645 -16659 M -1697 -15892 L -1721 -15901 Q -2010 -15813 -2068 -15520 -2075 -15488 -2087 -15460 -2124 -15375 -2091 -15293 L -2079 -15280 -1912 -15264 -1907 -15232 Q -1897 -15180 -1862 -15145 -1844 -15024 -1703 -15030 L -1686 -15012 Q -1485 -14866 -1295 -15049 -1181 -15158 -1219 -15300 -1225 -15322 -1240 -15335 -1354 -15438 -1513 -15483 L -1513 -15494 Q -1522 -15616 -1617 -15678 L -1616 -15710 Q -1611 -15807 -1678 -15883 L -1697 -15892 M -157 -17278 L -162 -17276 -171 -17272 -164 -17276 -157 -17278 M -3219 8337 L -2884 8337 -2890 8343 Q -2959 8414 -2985 8530 -3012 8655 -3005 8761 L -2924 8661 -2890 8618 -2775 8465 Q -2797 8408 -2838 8337 L -338 8337 -326 8444 Q -310 8572 -347 8697 L -349 8701 -346 8700 -281 8903 Q -245 9010 -216 9119 L -153 9363 -91 9616 -86 9633 -70 9694 -22 9832 66 10048 Q 108 10150 170 10243 L 178 10254 Q 245 10352 304 10454 L 305 10456 Q 368 10563 438 10664 L 510 10769 579 10868 730 11094 743 11112 Q 786 11169 910 11300 L 1156 11554 1250 11655 1317 11717 1350 11746 1510 11877 Q 1604 11951 1667 12052 L 1679 12071 Q 1748 12190 1809 12315 L 1850 12400 1916 12543 1959 12638 1999 12729 Q 2043 12830 2079 12937 L 2146 13158 2208 13373 2270 13577 2285 13625 Q 2313 13716 2350 13804 L 2376 13864 Q 2428 13979 2472 14097 2514 14208 2570 14316 L 2585 14344 2630 14419 2669 14477 Q 2757 14378 2848 14283 L 2870 14261 2950 14179 3022 14105 Q 3136 13992 3163 13832 3183 13708 3158 13582 3134 13459 3025 13418 2987 13404 2950 13406 2909 13408 2869 13430 L 2841 13448 Q 2730 13530 2768 13655 2831 13753 2715 13685 2686 13667 2678 13635 2645 13500 2713 13376 2762 13287 2830 13280 L 2868 13272 2950 13266 3060 13274 Q 3170 13290 3230 13370 3246 13391 3258 13418 3315 13542 3330 13676 3344 13808 3340 13942 3335 14077 3271 14198 L 3229 14266 Q 3172 14343 3092 14395 3017 14443 2949 14500 L 2885 14557 2870 14572 2764 14668 2868 14899 2870 14904 Q 2923 15021 2946 15149 L 2949 15167 Q 2975 15307 3024 15379 3089 15499 3167 15611 3214 15678 3238 15750 3255 15800 3261 15853 3259 15880 3241 15881 3228 15882 3206 15869 3096 15804 2996 15701 L 2953 15655 2866 15557 2815 15495 Q 2735 15395 2678 15278 L 2630 15182 2570 15064 2568 15060 Q 2513 14954 2453 14870 L 2441 14874 2350 14904 2270 14927 2177 14951 Q 2092 14971 2003 14969 L 1970 14973 1851 14982 1710 14972 1670 14963 Q 1575 14940 1476 14892 L 1350 14830 1250 14779 1233 14770 Q 1113 14707 1010 14619 L 910 14533 810 14445 750 14393 610 14278 570 14246 Q 537 14328 510 14407 490 14466 473 14524 436 14651 426 14783 415 14915 425 15050 396 15099 374 15062 L 363 15038 Q 350 14997 349 14940 347 14803 357 14667 367 14549 392 14433 L 399 14400 Q 430 14268 488 14176 L 411 14104 310 14002 238 13919 176 13835 170 13835 Q 111 13836 63 13810 -12 13769 -70 13707 L -90 13685 -134 13623 -146 13603 Q -204 13500 -194 13391 -205 13475 -201 13561 L -198 13607 -196 13629 -196 13630 -175 13756 -90 13815 -70 13829 55 13912 Q 119 13954 170 14009 209 14051 240 14100 301 14198 310 14308 L 311 14365 314 14415 310 14418 Q 263 14444 232 14380 212 14312 170 14252 142 14210 103 14173 19 14092 -70 14051 L -72 14050 -70 14056 -61 14076 43 14308 Q 94 14423 93 14552 92 14682 84 14810 81 14853 85 14897 L 85 14903 Q 131 14905 170 14919 251 14948 304 15028 L 310 15038 336 15082 Q 384 15174 402 15279 426 15413 413 15550 400 15688 359 15817 351 15842 336 15853 397 15933 514 15966 L 531 15970 Q 639 15996 749 15990 L 776 15988 913 15971 1041 15943 1246 15885 1299 15868 1356 15851 Q 1456 15822 1558 15805 L 1670 15789 1824 15777 1860 15777 1970 15792 Q 2026 15806 2078 15832 2196 15891 2263 16007 L 2271 16020 Q 2312 16095 2340 16177 L 2359 16238 Q 2392 16360 2384 16484 L 2373 16561 Q 2356 16642 2314 16716 L 2279 16773 2245 16818 Q 2204 16868 2156 16911 2073 16985 1975 16945 L 1961 16943 Q 1883 16925 1947 16802 L 1963 16800 2003 16798 Q 2001 16835 1984 16854 2021 16893 2110 16856 2164 16830 2203 16783 2241 16735 2265 16666 L 2276 16630 Q 2306 16522 2286 16411 L 2273 16350 Q 2245 16245 2188 16152 2114 16034 1993 15974 L 1970 15964 Q 1917 15942 1863 15935 L 1730 15941 1670 15958 1644 15968 Q 1589 15994 1499 16006 L 1355 16036 Q 1299 16052 1243 16073 L 1241 16074 995 16171 915 16201 746 16252 731 16256 Q 625 16283 518 16277 L 466 16271 Q 382 16259 309 16225 269 16207 233 16182 L 191 16261 170 16300 Q 119 16391 54 16484 -20 16591 -65 16715 L -76 16745 -98 16806 -155 16955 Q -202 17075 -260 17168 -311 17139 -283 17067 L -186 16810 Q -144 16696 -94 16587 L -88 16574 -67 16529 28 16321 Q 79 16207 146 16110 90 16056 47 15991 -5 15912 -65 15851 L -90 15827 -127 15794 -139 15869 Q -159 16003 -197 16135 -225 16230 -303 16262 -347 16204 -323 16127 L -254 15927 Q -220 15834 -192 15740 L -330 15626 -341 15635 Q -384 15673 -430 15706 L -548 15781 -557 15785 Q -614 15816 -670 15850 L -788 15924 Q -890 15991 -965 16087 L -979 16104 Q -1056 16209 -1111 16329 -1135 16381 -1150 16436 -1169 16505 -1173 16579 L -1174 16634 Q -1092 16683 -1046 16765 -921 16858 -892 17033 -866 17184 -857 17339 -840 17382 -846 17445 L -848 17463 Q -830 17504 -831 17559 L -833 17613 Q -847 17812 -919 17999 -932 18124 -996 18247 L -1038 18327 -1057 18407 Q -1074 18478 -1106 18538 L -1115 18583 Q -1143 18687 -1159 18796 L -1180 18931 Q -1151 19027 -1156 19137 L -1160 19203 Q -1143 19264 -1150 19339 L -1162 19489 -1165 19528 Q -1142 19570 -1147 19637 -1159 19801 -1213 19956 -1238 20028 -1282 20089 -1322 20023 -1389 19981 L -1411 19985 -1420 19987 Q -1446 20002 -1440 20029 -1423 20116 -1413 20204 L -1414 20205 -1429 20218 -1456 20218 -1472 20302 Q -1469 20329 -1473 20363 -1481 20433 -1495 20500 -1502 20531 -1530 20545 L -1547 20541 -1563 20545 -1575 20546 -1523 20325 -1530 20318 -1544 20313 -1549 20319 Q -1643 20562 -1717 20819 L -1735 20882 -1734 20843 -1749 20837 Q -1755 20838 -1756 20841 L -1762 20868 Q -1774 20859 -1786 20852 L -1801 20856 -1811 20861 -1817 20881 Q -1763 20618 -1781 20345 L -1751 20280 Q -1622 20026 -1577 19746 -1582 19702 -1576 19653 -1552 19441 -1580 19232 L -1617 18954 -1638 18807 Q -1755 18620 -1777 18394 L -1778 18378 Q -1700 18300 -1594 18257 L -1602 18240 -1618 18220 -1699 18214 -1700 18215 Q -1723 17970 -1823 17736 L -1860 17724 -1862 17728 -1880 17738 Q -1865 17586 -1879 17432 -1886 17511 -1899 17591 -1918 17440 -1972 17308 L -1984 17310 Q -2003 17314 -2022 17321 L -2013 17394 -2028 17358 -2037 17358 -2017 17409 -2017 17412 -2009 17437 -2005 17491 -2086 17374 -2127 17345 Q -2180 17298 -2223 17242 -2334 17096 -2416 16932 L -2476 16820 Q -2530 16725 -2552 16622 L -2564 16609 -2627 16528 Q -2675 16528 -2719 16449 -2829 16251 -2844 16026 -2855 15862 -2857 15691 -2858 15576 -2822 15473 L -2871 15377 -2891 15325 Q -2918 15250 -2930 15175 -2970 15185 -2987 15227 -3035 15343 -3028 15486 L -3013 15759 Q -3004 15898 -3027 16032 -3048 16159 -3085 16284 L -3093 16312 Q -3127 16422 -3171 16528 -3228 16666 -3250 16564 -3243 16506 -3223 16448 -3184 16333 -3168 16212 L -3141 15952 Q -3131 15817 -3129 15680 -3127 15561 -3138 15443 L -3154 15213 Q -3161 15075 -3153 14940 -3145 14820 -3090 14713 L -3083 14700 Q -3019 14584 -2994 14455 L -2994 14453 Q -2969 14321 -2985 14185 -3000 14056 -2994 13927 -2988 13798 -2947 13675 -2909 13562 -2891 13444 L -2890 13438 Q -2866 13290 -2838 13185 L -2857 13121 -2890 12997 -2918 12858 -2961 12606 -3007 12353 -3007 12352 -3009 12341 Q -3035 12214 -3071 12088 L -3090 12023 -3141 11822 -3189 11580 -3207 11628 Q -3247 11754 -3249 11894 -3250 12026 -3223 12153 L -3222 12159 Q -3199 12264 -3185 12370 L -3179 12425 Q -3166 12562 -3174 12698 -3182 12836 -3205 12972 L -3253 13231 -3270 13307 Q -3293 13399 -3321 13467 L -3336 13484 -3353 13498 Q -3436 13418 -3387 13277 -3350 13170 -3328 13059 L -3324 13037 -3290 12812 Q -3273 12684 -3274 12555 L -3276 12462 -3287 12282 -3299 12169 -3299 12165 Q -3307 12107 -3318 12050 -3344 11917 -3350 11779 -3355 11656 -3348 11534 -3341 11405 -3324 11276 -3309 11161 -3282 11047 L -3271 11002 -3271 10996 Q -3275 10883 -3289 10809 L -3290 10800 Q -3316 10672 -3367 10550 -3422 10422 -3461 10289 -3497 10167 -3514 10040 -3529 9925 -3522 9809 -3515 9679 -3478 9555 -3437 9423 -3384 9295 -3337 9183 -3270 9083 L -3257 9064 -3180 8962 Q -3167 8892 -3165 8859 -3163 8789 -3174 8719 L -3208 8457 -3219 8337 M -1344 -14847 L -1409 -14847 -1484 -14842 Q -1716 -14845 -1665 -14615 -1652 -14554 -1662 -14497 -1710 -14211 -1524 -14009 L -1519 -13911 Q -1513 -13854 -1476 -13811 -1423 -13749 -1356 -13794 -1240 -13872 -1261 -14023 L -1225 -14031 -1211 -14034 Q -1149 -14093 -1128 -14178 -1086 -14341 -1101 -14510 -1124 -14758 -1344 -14847 M -2979 -13517 L -2973 -13502 -2977 -13513 -2979 -13517 M -1328 -10930 L -1306 -11152 Q -1283 -11367 -1416 -11510 L -1481 -11510 -1511 -11486 -1534 -11467 -1558 -11726 Q -1572 -11859 -1617 -11982 -1639 -12042 -1637 -12103 -1629 -12316 -1761 -12459 -1840 -12474 -1887 -12412 L -1872 -12602 Q -1859 -12739 -1966 -12794 L -1966 -12792 -2002 -12786 Q -2024 -12776 -2030 -12754 -2060 -12648 -2063 -12538 -2077 -12524 -2080 -12506 L -2095 -12409 -2130 -12392 Q -2146 -12384 -2149 -12370 -2237 -12012 -2270 -11639 -2280 -11531 -2302 -11426 -2334 -11276 -2195 -11247 -2147 -11237 -2128 -11281 -2048 -11468 -1998 -11664 -1946 -11608 -1880 -11600 -1873 -11511 -1881 -11426 -1895 -11272 -1736 -11305 L -1737 -11262 Q -1747 -11061 -1714 -10873 -1740 -10815 -1719 -10756 -1714 -10744 -1715 -10733 -1718 -10609 -1603 -10604 L -1612 -10452 Q -1614 -10425 -1604 -10403 -1545 -10268 -1435 -10375 -1419 -10391 -1413 -10412 -1359 -10588 -1343 -10775 L -1340 -10803 -1337 -10811 -1335 -10814 Q -1316 -10861 -1324 -10910 L -1328 -10930 M -2675 -5494 L -2654 -5432 Q -2593 -5273 -2441 -5245 -2415 -5261 -2402 -5290 -2294 -5550 -2344 -5828 L -2337 -5839 Q -2331 -5849 -2328 -5861 -2327 -5866 -2329 -5871 L -2338 -5880 -2354 -5889 Q -2375 -5879 -2398 -5875 L -2401 -5875 -2403 -5882 Q -2417 -5991 -2513 -6018 L -2613 -6015 Q -2720 -5903 -2714 -5734 L -2713 -5720 -2715 -5717 Q -2751 -5658 -2735 -5590 -2722 -5531 -2675 -5494 M -2056 -9543 L -2059 -9535 -2085 -9482 Q -2122 -9473 -2142 -9442 L -2145 -9431 -2157 -9323 Q -2267 -9167 -2250 -8966 -2236 -8793 -2081 -8827 -1998 -8791 -1908 -8809 -1867 -8844 -1841 -8892 -1781 -9005 -1788 -9140 -1802 -9391 -2034 -9460 L -2034 -9469 Q -2019 -9503 -2020 -9535 L -2031 -9546 -2049 -9545 -2056 -9543 M -3044 -5185 L -3052 -5185 -3067 -5184 -3066 -5191 Q -3067 -5195 -3077 -5183 -3087 -5200 -3103 -5262 -3062 -5232 -3044 -5185 M -546 -2331 Q -539 -2466 -551 -2603 -564 -2742 -671 -2803 L -693 -2799 -704 -2796 -724 -2777 -740 -2757 -730 -2659 -756 -2714 Q -798 -2831 -899 -2858 -911 -2981 -936 -3101 -984 -3333 -1204 -3346 L -1247 -3314 Q -1270 -3288 -1282 -3256 -1378 -2985 -1378 -2688 -1378 -2585 -1383 -2484 -1390 -2323 -1294 -2224 L -1229 -2229 -1214 -2232 -1214 -2234 -1204 -2239 -1193 -2235 -1185 -2225 -1171 -2214 -1128 -2213 -1117 -2217 -1053 -2282 Q -1037 -2300 -1031 -2325 L -1011 -2332 -1006 -2263 Q -970 -1835 -989 -1412 -992 -1355 -956 -1312 -878 -1219 -816 -1322 -785 -1372 -775 -1431 L -753 -1580 -711 -1577 Q -616 -1655 -588 -1780 L -577 -1838 -571 -1875 Q -499 -1923 -482 -2029 L -477 -2061 Q -450 -2094 -442 -2138 -432 -2194 -457 -2246 L -459 -2249 Q -488 -2307 -546 -2331 M -1894 -3042 L -1898 -3049 -1894 -3041 -1894 -3042 M -1888 -3012 L -1893 -3039 -1899 -3050 -1887 -2999 -1888 -3012 M -3015 -1856 L -3001 -1837 Q -3022 -1803 -3057 -1780 -3042 -1910 -3015 -1856 L -3017 -1858 -3013 -1851 -3014 -1853 -3015 -1856 M -2229 -2950 L -2229 -2954 -2230 -2955 -2229 -2950 M -2327 2005 Q -2318 2120 -2266 2221 -2249 2254 -2215 2241 -2098 2199 -2088 2058 -2038 2023 -2031 1962 -2013 1810 -2031 1659 L -1997 1617 Q -1978 1595 -1995 1573 -2009 1564 -2025 1559 L -2042 1558 -2051 1567 -2071 1587 -2077 1594 -2087 1590 Q -2138 1555 -2196 1540 L -2225 1545 -2236 1548 Q -2316 1611 -2329 1706 -2353 1732 -2365 1767 -2381 1810 -2383 1872 -2386 1940 -2340 1992 L -2327 2005 M -1793 4170 L -1726 4164 Q -1632 4150 -1642 4065 L -1654 4055 -1668 4043 -1680 4043 Q -1605 3908 -1610 3752 L -1600 3741 -1581 3720 -1592 3709 -1602 3717 -1632 3741 Q -1675 3742 -1703 3774 -1768 3765 -1815 3806 L -1844 3804 Q -2012 3802 -2017 3959 L -2023 4005 Q -2023 4077 -1971 4127 -1921 4178 -1849 4179 L -1793 4170 M -329 2798 L -333 2817 -326 2787 -329 2798 M -1972 5885 Q -1967 5846 -1971 5798 L -1978 5732 Q -2001 5555 -2164 5626 L -2196 5626 Q -2222 5604 -2232 5572 -2352 5161 -2464 4742 -2471 4716 -2460 4691 -2394 4541 -2541 4493 L -2549 4483 Q -2574 4454 -2613 4453 L -2642 4459 Q -2668 4465 -2685 4486 -2808 4495 -2867 4605 L -2942 4753 Q -2958 4787 -2940 4817 -2879 4921 -2764 4856 L -2750 4867 -2732 4878 -2653 4878 -2636 4866 Q -2600 4834 -2581 4849 -2549 4935 -2537 5023 -2485 5419 -2282 5755 -2312 5809 -2313 5865 -2323 5893 -2323 5924 -2323 5985 -2284 6034 -2245 6082 -2184 6094 L -2182 6095 Q -2114 6108 -2055 6071 -1996 6033 -1980 5966 L -1978 5958 Q -1967 5920 -1972 5885 M -2920 6663 L -2920 6662 -2922 6655 -2920 6663 M -2919 6665 L -2919 6664 -2918 6670 -2918 6668 -2919 6665 M -2977 9687 Q -2927 9803 -2912 9938 L -2890 10170 -2889 10183 Q -2879 10315 -2887 10448 -2892 10531 -2869 10592 -2816 10556 -2784 10491 -2749 10423 -2723 10349 -2698 10277 -2681 10204 -2732 10103 -2748 9960 L -2776 9695 Q -2789 9566 -2786 9433 L -2828 9498 -2890 9584 Q -2931 9638 -2977 9687 M -2333 9057 L -2334 9057 -2332 9073 -2333 9057 M -117 10817 L -194 10664 Q -213 10774 -194 10910 -175 11043 -137 11175 L -90 11312 -70 11359 -38 11427 79 11655 170 11814 206 11870 310 12031 353 12098 360 12108 Q 399 12096 400 11993 400 11856 349 11727 L 309 11627 250 11477 219 11435 170 11364 96 11245 Q 35 11140 -13 11030 L -65 10917 -70 10908 -91 10866 -117 10817 M -2085 11588 L -2071 11621 -2070 11621 -2085 11588 M -2890 11086 Q -2918 11141 -2933 11202 -2966 11332 -2979 11470 -2990 11592 -2969 11714 -2948 11841 -2901 11961 L -2890 11990 Q -2850 12103 -2847 12203 L -2811 12231 -2812 12167 Q -2815 12079 -2837 11995 -2867 11878 -2865 11757 -2861 11603 -2843 11448 L -2823 11350 Q -2767 11159 -2854 11024 L -2890 11086 M -2206 10862 Q -2245 10839 -2290 10871 L -2309 10887 Q -2338 10915 -2358 10948 L -2370 10967 Q -2409 11040 -2409 11132 L -2398 11405 Q -2391 11498 -2370 11590 L -2353 11657 -2352 11659 -2290 11864 -2273 11915 -2247 11998 -2226 11906 Q -2195 11772 -2221 11634 -2246 11503 -2285 11373 L -2290 11355 Q -2321 11235 -2290 11114 L -2287 11102 Q -2248 10964 -2206 10862 M -957 10612 L -963 10597 -963 10614 -957 10612 M -970 11809 L -1065 11684 Q -1051 11908 -1049 12044 -1047 12170 -1055 12296 -1064 12421 -1086 12542 L -1135 12785 -1150 12844 -1160 12876 -1150 12921 Q -1126 13023 -1089 13119 -1042 13242 -970 13348 L -969 13349 Q -903 13445 -805 13485 L -769 13410 Q -709 13283 -671 13151 L -670 13148 Q -649 13070 -638 12992 -631 12935 -630 12878 L -630 12677 -670 12745 -690 12778 -783 12916 Q -862 13025 -921 13129 -957 13044 -902 12952 -834 12837 -789 12716 -743 12594 -714 12468 -686 12347 -697 12250 -720 12190 -754 12134 L -782 12089 Q -823 12226 -853 12361 -884 12499 -951 12611 L -970 12627 -987 12640 -988 12629 Q -997 12549 -970 12465 L -968 12459 Q -926 12335 -905 12209 -885 12089 -857 11971 L -893 11917 -970 11809 M -1440 12858 L -1437 12866 -1440 12857 -1440 12858 M -1348 13460 Q -1363 13563 -1371 13668 -1382 13807 -1333 13935 -1306 14004 -1259 14048 -1254 13963 -1210 13883 -1191 13873 -1166 13837 -1137 13975 -1181 14098 L -1150 14109 -1143 14111 Q -1080 14128 -1015 14133 -1030 14032 -993 13898 L -970 13824 -963 13806 -970 13804 Q -1066 13768 -1150 13707 L -1205 13663 Q -1303 13578 -1348 13460 M -172 13275 Q -136 13357 -90 13426 L -70 13455 -22 13515 Q -3 13536 39 13541 L 21 13489 Q -15 13377 -23 13259 -31 13137 -45 13043 -57 13029 -70 13030 L -90 13041 -108 13066 Q -143 13156 -172 13275 M -2455 12240 L -2490 12153 -2552 11984 -2561 11957 Q -2582 12093 -2591 12230 -2601 12365 -2569 12496 -2538 12628 -2492 12753 L -2490 12759 -2478 12788 Q -2488 12753 -2490 12717 L -2490 12684 -2485 12641 Q -2458 12497 -2402 12391 -2425 12314 -2455 12240 M -1761 12219 L -1757 12247 -1750 12246 -1761 12219 M -2153 12926 L -2153 12929 -2149 12927 -2153 12926 M -1770 14792 L -1772 14792 -1770 14793 -1750 14800 Q -1659 14832 -1570 14876 L -1565 14878 -1570 14829 -1581 14736 Q -1663 14771 -1750 14788 L -1770 14792 M -1658 14401 L -1717 14497 Q -1676 14517 -1624 14515 L -1658 14401 M -2677 14091 L -2669 14093 -2669 14092 -2658 14012 -2666 14046 -2677 14091 M -1770 15075 L -1777 15074 -1784 15095 -1815 15196 -1816 15318 -1770 15384 -1750 15418 -1726 15462 Q -1668 15575 -1659 15702 -1651 15824 -1659 15948 -1620 15997 -1598 16068 L -1582 16108 -1577 16047 -1570 15992 Q -1553 15887 -1513 15787 -1478 15701 -1430 15623 L -1384 15554 -1345 15501 Q -1354 15430 -1380 15363 -1399 15315 -1430 15274 -1478 15209 -1554 15159 L -1563 15177 -1570 15187 Q -1583 15202 -1597 15192 -1595 15148 -1590 15142 -1670 15093 -1750 15078 L -1770 15075 M -430 14368 Q -448 14430 -454 14494 -447 14544 -430 14590 -400 14668 -339 14732 -229 14846 -119 14854 L -130 14776 Q -152 14649 -221 14536 -290 14424 -407 14365 L -426 14356 -430 14368 M -1150 14327 L -1201 14336 -1247 14342 Q -1271 14472 -1339 14559 -1390 14624 -1430 14665 L -1489 14716 Q -1483 14795 -1486 14876 L -1486 14887 -1487 14893 -1483 14890 -1430 14943 Q -1364 15016 -1323 15097 -1264 15216 -1237 15349 L -1225 15332 Q -1183 15272 -1150 15208 -1123 15155 -1102 15098 -1058 14976 -1037 14849 -1015 14717 -1034 14581 -1054 14443 -1022 14307 L -1150 14327 M -744 14832 L -744 14833 Q -785 14763 -816 14672 -859 14546 -870 14415 -904 14576 -925 14747 L -945 14932 Q -952 15005 -970 15075 -993 15164 -1033 15247 -1077 15336 -1136 15416 L -1150 15436 -1166 15458 -1226 15523 Q -1234 15649 -1248 15787 L -1252 15861 Q -1252 15967 -1216 16045 -1207 16066 -1214 16081 -1221 16096 -1244 16105 -1321 16051 -1310 15880 L -1308 15858 Q -1302 15738 -1303 15633 -1371 15747 -1411 15876 L -1429 15939 Q -1455 16038 -1469 16140 L -1477 16202 Q -1424 16255 -1382 16323 -1316 16375 -1271 16456 -1258 16392 -1237 16331 -1200 16222 -1150 16133 L -1143 16122 -1143 16121 Q -1088 16028 -1014 15956 L -967 15913 Q -894 15850 -770 15760 L -670 15687 -608 15643 -549 15602 -431 15520 Q -491 15434 -550 15317 L -555 15307 Q -614 15188 -655 15062 L -670 15018 Q -703 14922 -742 14836 L -744 14832 M -1515 14195 Q -1538 14238 -1571 14279 L -1588 14301 -1587 14303 -1570 14343 Q -1540 14419 -1523 14495 -1472 14473 -1430 14436 -1382 14393 -1347 14330 -1391 14315 -1430 14285 L -1435 14281 Q -1483 14243 -1515 14195 M -26 15376 L -28 15382 Q 92 15465 148 15598 L 170 15645 Q 198 15701 226 15737 274 15622 296 15478 318 15341 250 15224 214 15163 170 15121 122 15075 64 15052 L 48 15118 -26 15376 M -177 15226 Q -138 15135 -124 15034 L -119 14996 Q -228 15033 -356 14974 -319 15046 -270 15109 L -177 15226 M 283 1442 Q 282 1521 259 1597 L 196 1788 195 1790 Q 169 1867 132 1941 L 131 1943 111 1972 110 1973 96 1988 99 1973 139 1777 140 1776 142 1763 143 1761 Q 160 1675 192 1593 L 192 1592 200 1573 284 1367 283 1440 283 1442 M 907 2303 L 876 2320 875 2321 808 2353 807 2354 714 2391 712 2391 636 2406 632 2406 629 2406 512 2399 353 2377 328 2372 326 2372 317 2368 Q 297 2353 276 2345 L 290 2338 302 2332 304 2331 Q 374 2296 449 2275 542 2248 638 2244 L 639 2244 663 2243 664 2243 757 2251 Q 800 2259 841 2276 L 840 2276 907 2303 M 115 2368 L 222 2379 234 2371 Q 246 2362 259 2355 L 263 2357 Q 321 2385 222 2379 181 2403 134 2403 L 99 2400 97 2381 115 2368 M 510 11763 L 426 11681 Q 482 11743 510 11827 L 526 11885 Q 549 11996 510 12091 L 478 12150 Q 454 12185 419 12199 L 492 12306 510 12332 Q 566 12414 607 12501 661 12613 680 12734 700 12867 723 13000 743 13119 750 13240 L 751 13259 752 13273 Q 833 13249 903 13308 L 910 13312 Q 1008 13360 932 13416 L 910 13398 Q 830 13341 750 13402 L 748 13404 747 13404 748 13404 Q 741 13470 727 13534 L 667 13800 Q 638 13922 614 14048 L 750 14164 805 14212 910 14301 999 14370 Q 1106 14449 1215 14521 L 1250 14544 1350 14605 1428 14648 Q 1542 14710 1670 14748 L 1674 14749 Q 1760 14774 1850 14781 L 1939 14783 1970 14782 2190 14761 2270 14743 2350 14716 2371 14707 2350 14671 2270 14537 2202 14432 Q 2131 14326 2072 14213 2013 14101 1985 13976 L 1970 13915 Q 1947 13824 1916 13734 L 1850 13529 1840 13495 Q 1802 13364 1752 13234 1715 13139 1668 13050 L 1636 12990 1521 12792 Q 1496 12692 1449 12765 1420 12841 1394 12948 1368 13051 1350 13158 L 1343 13200 Q 1323 13326 1324 13453 1324 13525 1350 13588 1373 13644 1418 13692 1511 13795 1516 13934 1521 14072 1508 14179 1490 14305 1436 14243 1445 14109 1435 13978 1426 13866 1350 13787 L 1311 13752 Q 1275 13724 1250 13690 1203 13626 1194 13540 1180 13406 1190 13272 L 1203 13007 1211 12777 Q 1215 12672 1206 12568 1196 12443 1127 12339 1050 12225 956 12129 L 910 12084 Q 837 12016 754 11959 L 750 11957 Q 639 11881 540 11791 L 510 11763 M 518 13562 L 510 13573 Q 436 13676 357 13750 L 412 13836 Q 457 13899 510 13954 L 530 13974 Q 547 13931 553 13876 568 13743 570 13610 L 569 13504 Q 540 13531 518 13562 M 270 12362 L 170 12235 115 12172 Q 134 12279 162 12402 L 170 12438 211 12653 Q 233 12786 279 12913 L 310 12990 Q 347 13074 393 13143 397 13171 371 13193 340 13169 310 13133 L 279 13092 Q 213 12994 170 12884 130 12780 118 12668 103 12537 52 12441 L 57 12576 Q 62 12686 79 12793 L 108 12979 Q 121 13069 147 13159 L 170 13239 214 13381 258 13509 310 13471 470 13367 510 13346 Q 531 13335 553 13326 536 13204 510 13088 L 509 13081 443 12828 377 12590 Q 355 12501 310 12423 L 270 12362 M -1383 17568 Q -1384 17775 -1279 17966 L -1275 17976 Q -1231 17905 -1210 17814 -1214 17716 -1237 17626 L -1321 17456 -1362 17523 -1383 17568";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([34,34,34,1]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(2.56341552734375,0,0,2.56341552734375,-1966,-20892);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.4666666666666667,tocolor(ctrans.apply([102,102,102,1])));
	grd.addColorStop(1.0,tocolor(ctrans.apply([34,34,34,1])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M -141 -17284 L -129 -17264 -139 -17256 -127 -17260 -127 -17259 Q -115 -17229 -126 -17197 L -105 -17206 -34 -17233 4 -17248 3 -17247 53 -17266 52 -17266 201 -17317 200 -17317 Q 301 -17351 402 -17388 L 594 -17454 657 -17473 656 -17473 816 -17525 Q 941 -17571 1069 -17602 L 1068 -17602 1330 -17666 1575 -17726 1702 -17761 1827 -17801 Q 1947 -17844 2071 -17883 L 2070 -17883 2224 -17935 2328 -17970 Q 2449 -18013 2557 -18079 L 2558 -18079 Q 2633 -18124 2622 -18212 L 2614 -18242 Q 2597 -18268 2561 -18282 2468 -18316 2357 -18332 2325 -18337 2304 -18362 2283 -18388 2284 -18420 2284 -18452 2307 -18476 L 2353 -18525 2352 -18525 2410 -18584 2409 -18584 Q 2509 -18689 2624 -18766 L 2849 -18910 2850 -18910 2983 -18996 3068 -19057 3273 -19215 3339 -19270 3453 -19369 3637 -19526 Q 3729 -19602 3828 -19702 3912 -19789 3939 -19929 3958 -20040 3858 -20108 L 3781 -20074 Q 3666 -20031 3559 -19965 L 3327 -19829 3327 -19828 Q 3214 -19765 3107 -19696 2989 -19620 2860 -19556 L 2861 -19556 2645 -19445 2409 -19321 2410 -19321 2403 -19318 2208 -19213 2208 -19214 2187 -19202 2186 -19202 Q 2093 -19152 2001 -19098 L 1999 -19097 1989 -19091 Q 1883 -19029 1774 -18970 L 1571 -18853 1572 -18853 Q 1470 -18791 1345 -18728 L 1124 -18607 Q 1017 -18544 905 -18484 L 721 -18381 690 -18363 Q 580 -18297 472 -18234 L 472 -18233 264 -18108 152 -18038 151 -18038 54 -17979 Q -18 -17937 -94 -17887 -141 -17843 -175 -17835 L -221 -17829 Q -254 -17833 -275 -17858 -290 -17876 -294 -17897 L -307 -17913 Q -322 -17939 -318 -17968 L -314 -17999 -314 -18000 Q -298 -18131 -290 -18265 L -290 -18267 -289 -18291 Q -283 -18424 -296 -18540 L -298 -18555 Q -312 -18659 -343 -18748 -353 -18777 -342 -18805 -332 -18834 -305 -18850 -274 -18870 -247 -18907 L -247 -18908 Q -137 -19063 -214 -19265 -226 -19294 -216 -19322 -207 -19352 -181 -19368 L -160 -19384 Q -159 -19409 -143 -19429 -128 -19450 -104 -19459 L -81 -19464 Q -50 -19732 61 -19951 88 -20004 99 -20049 L 99 -20048 104 -20083 Q 106 -20109 100 -20129 L 98 -20134 Q 32 -20392 230 -20502 L 235 -20504 Q 247 -20539 249 -20569 L 249 -20570 Q 251 -20616 224 -20652 207 -20663 196 -20679 L 192 -20684 186 -20690 187 -20689 Q 184 -20692 180 -20694 L 181 -20694 155 -20711 154 -20711 139 -20720 -33 -20813 Q -176 -20887 -442 -20927 -725 -20969 -999 -20992 L -1520 -21018 -1521 -21018 Q -1764 -21023 -2054 -21019 -2341 -21014 -2621 -20977 -2902 -20940 -3122 -20890 -3330 -20843 -3459 -20766 -3570 -20700 -3593 -20673 L -3596 -20666 -3597 -20665 -3600 -20659 Q -3651 -20562 -3601 -20476 -3590 -20458 -3589 -20436 -3587 -20384 -3575 -20338 -3556 -20259 -3508 -20197 -3498 -20183 -3493 -20165 -3489 -20148 -3491 -20131 -3537 -19829 -3431 -19690 -3415 -19670 -3412 -19644 -3393 -19473 -3356 -19365 L -3356 -19364 -3350 -19347 -3350 -19348 -3312 -19234 Q -3306 -19216 -3308 -19197 -3310 -19179 -3320 -19162 -3383 -19059 -3359 -18982 -3337 -18931 -3275 -18889 L -3252 -18866 Q -3214 -18811 -3193 -18747 -3165 -18660 -3170 -18555 -3172 -18521 -3198 -18496 -3206 -18485 -3195 -18470 -3183 -18454 -3179 -18435 -3175 -18417 -3180 -18398 L -3187 -18364 -3187 -18366 Q -3209 -18264 -3216 -18161 L -3216 -18160 -3220 -18016 -3220 -18015 -3219 -17961 Q -3218 -17928 -3239 -17902 -3261 -17877 -3294 -17872 -3327 -17868 -3355 -17887 L -3393 -17914 -3392 -17914 -3484 -17974 -3483 -17974 -3678 -18102 -3799 -18183 -3802 -18185 -3803 -18173 -3803 -18065 -3803 -18061 -3822 -18065 -3859 -18062 -3825 -18096 -3877 -18130 -3812 -18196 -3887 -18213 -3887 -18341 -3824 -18301 -3629 -18174 Q -3535 -18110 -3437 -18047 L -3344 -17985 -3305 -17958 -3306 -18015 -3303 -18166 Q -3295 -18276 -3272 -18384 L -3264 -18418 Q -3324 -18498 -3257 -18560 -3252 -18648 -3276 -18721 -3292 -18773 -3323 -18817 -3411 -18876 -3440 -18951 -3482 -19062 -3394 -19207 L -3432 -19320 -3438 -19337 Q -3478 -19452 -3498 -19635 -3630 -19795 -3577 -20144 -3636 -20220 -3659 -20317 -3673 -20371 -3676 -20432 -3751 -20558 -3676 -20699 L -3675 -20701 -3666 -20718 Q -3642 -20757 -3503 -20840 -3365 -20924 -3141 -20974 -2917 -21025 -2632 -21063 -2348 -21101 -2055 -21105 -1764 -21110 -1519 -21105 L -992 -21078 -430 -21012 Q -145 -20970 8 -20889 L 182 -20795 198 -20786 234 -20762 241 -20757 258 -20741 269 -20726 272 -20729 Q 341 -20659 336 -20565 332 -20508 302 -20442 L 274 -20427 Q 134 -20345 182 -20156 194 -20120 191 -20077 L 183 -20028 Q 170 -19975 138 -19912 25 -19687 0 -19408 -13 -19365 -74 -19378 -77 -19333 -134 -19296 -38 -19047 -177 -18857 -216 -18803 -261 -18776 -228 -18679 -212 -18566 L -210 -18550 Q -196 -18428 -203 -18287 L -204 -18262 Q -212 -18124 -228 -17989 L -232 -17957 Q -210 -17948 -210 -17915 L -183 -17933 Q -176 -17927 -147 -17956 L 10 -18054 107 -18112 218 -18181 428 -18308 645 -18437 677 -18456 864 -18560 Q 974 -18619 1079 -18681 1184 -18744 1306 -18805 1427 -18867 1527 -18927 L 1732 -19046 Q 1840 -19105 1945 -19166 L 1958 -19173 2145 -19278 2167 -19290 2366 -19396 2369 -19398 2604 -19522 2822 -19634 Q 2946 -19695 3060 -19769 3169 -19839 3284 -19904 L 3514 -20039 Q 3628 -20110 3750 -20155 3872 -20201 3903 -20182 4056 -20081 4024 -19913 3992 -19745 3890 -19641 3787 -19538 3692 -19459 L 3511 -19304 3394 -19204 3327 -19148 Q 3230 -19070 3119 -18987 L 3032 -18925 2894 -18836 Q 2780 -18767 2673 -18694 2565 -18622 2471 -18524 L 2415 -18466 2370 -18418 Q 2490 -18400 2591 -18363 2661 -18337 2690 -18282 2704 -18256 2708 -18222 2725 -18079 2602 -18005 2486 -17934 2356 -17889 L 2252 -17853 2097 -17801 1855 -17720 1727 -17678 1596 -17642 1350 -17582 1089 -17518 Q 966 -17488 845 -17444 L 681 -17390 620 -17371 432 -17307 227 -17235 82 -17185 34 -17167 -73 -17125 -98 -17115 -99 -17115 -134 -17102 -153 -17093 -155 -17092 -138 -17002 -121 -17006 Q -57 -17022 -37 -17032 L 6 -17046 51 -17055 63 -17057 121 -17067 199 -17081 Q 275 -17087 349 -17109 L 516 -17155 831 -17237 Q 1221 -17332 1569 -17396 L 1773 -17435 2152 -17514 2239 -17533 2548 -17591 Q 2708 -17616 2818 -17643 2927 -17670 3050 -17680 L 3290 -17699 3442 -17713 3571 -17732 Q 3633 -17743 3690 -17712 3718 -17583 3785 -17471 3817 -17417 3812 -17379 3806 -17341 3763 -17319 3644 -17257 3511 -17212 3381 -17167 3248 -17128 3123 -17092 2997 -17065 L 2758 -17021 2502 -16975 2492 -16973 Q 2374 -16948 2258 -16913 L 2034 -16846 1831 -16786 Q 1801 -16741 1821 -16718 1834 -16704 1868 -16700 2044 -16677 2219 -16708 L 2678 -16784 Q 2975 -16831 3286 -16838 3369 -16679 3336 -16473 3324 -16397 3229 -16365 2927 -16264 2612 -16201 2530 -16185 2448 -16180 2270 -16171 2169 -16061 2252 -16029 2347 -16011 2478 -15987 2614 -15983 2653 -15982 2673 -15957 2723 -15892 2751 -15784 2773 -15702 2718 -15648 2622 -15552 2485 -15522 L 2219 -15472 1960 -15451 Q 1854 -15451 1784 -15381 1703 -15299 1771 -15161 1832 -15038 1804 -14907 1774 -14764 1613 -14795 1482 -14820 1364 -14888 1245 -14956 1132 -15035 L 1131 -15036 Q 1065 -15081 1031 -15055 1021 -15048 1014 -15034 L 1010 -15026 1009 -15025 Q 998 -14998 995 -14952 L 994 -14932 Q 991 -14791 894 -14698 785 -14595 654 -14674 540 -14742 452 -14848 431 -14873 403 -14854 316 -14794 237 -14715 180 -14657 118 -14652 66 -14648 10 -14681 L -186 -14797 Q -222 -14672 -237 -14552 L -254 -14375 -260 -14275 Q -251 -14252 -246 -14205 -225 -14021 -266 -13840 L -312 -13619 -348 -13452 -354 -13409 -333 -13393 Q -306 -13371 -286 -13340 -247 -13280 -239 -13187 -228 -13054 -235 -12920 L -241 -12785 -245 -12647 Q -246 -12557 -257 -12462 L -218 -12342 Q -191 -12253 -177 -12151 L -171 -12103 Q -157 -11974 -150 -11846 -143 -11719 -145 -11590 -147 -11526 -161 -11450 -175 -11374 -201 -11287 L -236 -11184 Q -194 -11168 -169 -11109 L -169 -11108 Q -108 -10965 -205 -10879 L -196 -10852 Q -158 -10723 -210 -10598 -249 -10505 -322 -10447 -209 -10366 -195 -10218 -182 -10075 -260 -9957 -284 -9921 -251 -9867 L -221 -9804 Q -191 -9719 -208 -9624 -222 -9551 -248 -9483 -269 -9428 -299 -9376 -357 -9273 -331 -9203 -262 -9215 -230 -9159 -206 -9117 -205 -9033 -203 -8946 -224 -8873 -239 -8824 -263 -8781 -284 -8742 -273 -8665 -263 -8596 -311 -8559 -239 -8502 -243 -8393 -245 -8348 -266 -8328 -287 -8308 -327 -8313 L -330 -8313 -337 -8314 -331 -8308 Q -274 -8259 -244 -8192 -220 -8137 -213 -8071 -201 -7940 -219 -7810 -234 -7710 -293 -7660 -308 -7648 -325 -7639 L -300 -7601 Q -250 -7522 -211 -7429 -206 -7326 -214 -7208 L -223 -6985 Q -226 -6851 -244 -6719 L -284 -6459 -302 -6349 -324 -6230 Q -348 -6095 -391 -5964 L -461 -5742 -485 -5666 Q -409 -5676 -366 -5640 -323 -5603 -313 -5520 -300 -5411 -390 -5353 -274 -5239 -315 -5076 -340 -4977 -425 -4938 -382 -4822 -467 -4733 -525 -4672 -503 -4643 -421 -4534 -407 -4390 -398 -4296 -442 -4237 -384 -4201 -382 -3984 L -382 -3945 -372 -3779 Q -300 -3745 -246 -3701 -254 -3594 -251 -3471 -248 -3334 -253 -3198 L -260 -3047 -303 -2824 -321 -2700 Q -204 -2758 -127 -2610 -53 -2469 -154 -2366 -204 -2314 -253 -2302 -234 -2278 -211 -2229 -161 -2246 -102 -2242 L -90 -2226 -64 -2205 Q -73 -2178 -90 -2153 L -104 -2136 Q -150 -2082 -240 -2045 L -248 -2042 -241 -2039 Q -269 -1951 -295 -1889 -269 -1879 -266 -1846 -260 -1799 -287 -1771 -205 -1654 -302 -1560 -282 -1510 -291 -1466 L -213 -1405 -211 -1400 Q -197 -1350 -233 -1266 L -239 -1250 Q -204 -1126 -214 -983 -218 -925 -231 -884 -167 -791 -167 -632 -167 -499 -223 -435 -180 -417 -181 -359 L -260 -233 -311 -156 -325 -136 Q -310 -119 -293 -28 -280 39 -311 79 -223 181 -205 324 -189 454 -216 582 -242 702 -308 800 -199 908 -251 1058 L -282 1150 Q -215 1279 -241 1418 -260 1520 -224 1653 -165 1781 -149 1919 -133 2050 -135 2185 -138 2318 -133 2451 -130 2522 -133 2593 L -68 2481 -89 2207 Q -98 2073 -71 1939 L -30 1740 -27 1726 Q -6 1626 30 1531 L 39 1508 Q 89 1383 142 1258 L 210 1100 231 1050 Q 276 944 307 834 339 717 350 597 L 365 417 380 594 Q 401 811 432 1028 462 1235 456 1445 454 1548 424 1647 L 359 1845 Q 329 1934 286 2019 267 2058 236 2091 L 210 2118 194 2135 Q 145 2185 133 2230 157 2213 184 2198 L 210 2184 227 2176 Q 311 2133 402 2108 514 2076 630 2071 L 660 2070 790 2081 Q 850 2092 907 2116 1035 2170 1163 2205 L 1240 2214 1256 2213 1242 2227 1131 2340 Q 1055 2423 954 2474 L 878 2511 Q 826 2534 773 2553 707 2578 638 2579 L 630 2579 488 2570 329 2548 280 2538 Q 241 2527 214 2507 L 210 2510 186 2511 171 2658 Q 149 2817 116 2972 92 3085 30 3164 L -30 3225 Q -62 3251 -101 3272 -135 3290 -199 3306 -166 3354 -140 3413 -89 3534 -152 3662 L -227 3797 Q -169 3907 -195 4054 -213 4165 -266 4261 L -267 4261 Q -166 4355 -200 4500 -198 4556 -187 4595 -149 4728 -170 4866 -190 4999 -230 5130 -267 5254 -284 5383 -301 5519 -303 5656 -306 5780 -274 5899 L -268 5920 -256 5964 -255 5966 -255 5968 -242 6032 -241 6035 -241 6039 Q -229 6113 -229 6188 -228 6326 -298 6416 -292 6446 -289 6477 -275 6610 -308 6742 L -368 7001 Q -384 7080 -382 7162 L -382 7168 -382 7180 Q -338 7274 -309 7396 -285 7495 -294 7595 L -306 7669 Q -334 7797 -370 7925 L -378 7954 -355 8184 -338 8337 -2838 8337 -2854 8311 -2884 8337 -3219 8337 -3226 8185 Q -3229 8055 -3209 7926 -3190 7804 -3178 7681 -3167 7556 -3128 7438 -3094 7334 -3073 7227 L -3064 7178 -3062 7166 Q -3044 7044 -3055 6921 -3066 6802 -3084 6720 L -3086 6711 -3087 6705 -3088 6700 -3089 6696 -3089 6694 -3090 6692 -3090 6691 -3088 6689 -3092 6684 Q -3132 6633 -3150 6571 -3160 6536 -3163 6497 -3174 6361 -3160 6259 L -3187 6170 -3187 6168 -3201 6107 -3201 6103 -3210 6048 -3215 5995 -3222 5888 -3233 5728 -3242 5469 Q -3242 5405 -3279 5381 -3319 5354 -3330 5315 -3338 5284 -3330 5246 -3322 5209 -3298 5165 L -3298 5164 -3291 5151 Q -3261 5100 -3265 5054 L -3266 5046 Q -3272 5013 -3295 4983 L -3330 4935 Q -3390 4847 -3423 4747 -3466 4617 -3367 4527 L -3330 4497 Q -3244 4436 -3150 4450 L -3134 4453 Q -3059 4370 -2994 4318 L -2993 4318 Q -3024 4280 -3045 4238 -3108 4110 -3095 4001 L -3150 4023 -3249 4055 -3330 4072 Q -3405 4079 -3458 4053 -3410 4058 -3380 4014 L -3330 3935 Q -3290 3868 -3258 3797 -3216 3705 -3150 3630 -3125 3601 -3096 3575 -3047 3531 -2996 3493 L -2950 3467 -2900 3427 -2950 3460 -2996 3493 -3042 3511 Q -3100 3529 -3150 3531 -3224 3532 -3279 3494 -3221 3420 -3150 3364 L -3084 3317 Q -3013 3273 -2950 3255 L -2911 3245 -2892 3242 -2911 3241 -2913 3240 -2950 3233 -2985 3234 Q -3034 3240 -3083 3235 -3118 3232 -3150 3218 -3177 3206 -3202 3186 -3270 3132 -3277 3046 -3289 2892 -3330 2746 L -3356 2661 Q -3414 2490 -3566 2422 -3500 2379 -3407 2387 L -3330 2400 Q -3240 2422 -3163 2475 L -3197 2402 Q -3226 2318 -3221 2242 -3228 2182 -3200 2118 L -3245 2038 Q -3275 1979 -3315 1922 L -3330 1900 Q -3437 1736 -3459 1538 -3494 1242 -3494 942 L -3498 553 -3501 395 -3462 553 Q -3440 630 -3387 683 -3355 715 -3330 751 -3283 820 -3262 905 -3229 1039 -3238 1179 -3247 1314 -3232 1446 -3204 1416 -3150 1409 L -3149 1409 -3150 1405 Q -3169 1333 -3157 1252 L -3150 1219 Q -3139 1177 -3116 1140 -3137 1116 -3150 1084 L -3161 1047 Q -3182 954 -3150 877 -3134 838 -3103 804 L -3150 731 -3165 705 Q -3232 585 -3251 448 L -3252 446 Q -3272 307 -3212 184 -3180 118 -3133 75 L -3124 67 -3135 49 Q -3151 18 -3145 -12 -3140 -45 -3107 -75 -3169 -159 -3215 -250 L -3216 -252 -3235 -326 -3234 -337 -3228 -355 -3186 -395 Q -3219 -505 -3187 -606 -3199 -642 -3204 -682 L -3207 -714 Q -3215 -847 -3127 -920 -3175 -941 -3195 -998 -3245 -1143 -3172 -1257 L -3181 -1270 -3183 -1273 -3185 -1275 -3186 -1277 -3217 -1379 -3214 -1392 -3209 -1406 -3120 -1497 Q -3141 -1534 -3141 -1589 -3190 -1663 -3147 -1744 L -3170 -1779 Q -3219 -1882 -3150 -1926 -3167 -2003 -3137 -2054 L -3234 -2114 Q -3272 -2134 -3294 -2165 -3343 -2233 -3315 -2264 -3289 -2295 -3187 -2290 -3213 -2306 -3239 -2337 -3327 -2442 -3308 -2579 -3283 -2748 -3109 -2722 L -3134 -2795 Q -3168 -2913 -3171 -3018 L -3162 -3290 Q -3154 -3416 -3155 -3543 -3156 -3666 -3162 -3784 -3096 -3805 -3028 -3842 L -3020 -3967 -2869 -3974 Q -3071 -4026 -3041 -4175 -3140 -4230 -3130 -4355 -3118 -4498 -2998 -4563 -3143 -4546 -3222 -4670 -3290 -4776 -3299 -4901 -3309 -5044 -3206 -5123 -3244 -5151 -3238 -5210 -3223 -5335 -3105 -5354 L -3041 -5358 Q -3048 -5442 -3061 -5519 L -3104 -5770 Q -3128 -5907 -3158 -6044 -3185 -6172 -3199 -6303 -3213 -6435 -3234 -6568 -3251 -6686 -3242 -6806 L -3226 -7035 Q -3218 -7149 -3199 -7265 L -3192 -7323 Q -3179 -7371 -3136 -7444 -3182 -7549 -3124 -7661 L -3144 -7702 Q -3193 -7827 -3159 -7963 -3127 -8093 -3077 -8178 -3121 -8210 -3145 -8279 -3192 -8407 -3166 -8542 -3134 -8709 -3165 -8784 -3219 -8917 -3113 -9031 -3009 -9145 -3077 -9241 L -3085 -9251 Q -3148 -9330 -3188 -9437 -3237 -9566 -3200 -9697 -3165 -9821 -3113 -9917 -3153 -9974 -3191 -10053 -3252 -10179 -3210 -10311 -3169 -10436 -3048 -10474 -3117 -10531 -3139 -10627 -3170 -10766 -3129 -10902 L -3109 -10960 Q -3137 -11032 -3143 -11094 -3154 -11191 -3114 -11263 -3148 -11285 -3179 -11325 -3251 -11420 -3285 -11535 -3323 -11665 -3336 -11800 -3348 -11926 -3337 -12051 -3327 -12178 -3301 -12308 L -3269 -12445 -3237 -12562 -3231 -12581 -3235 -12582 Q -3219 -12745 -3227 -12869 L -3228 -12886 Q -3235 -13014 -3232 -13142 -3229 -13280 -3166 -13395 L -3149 -13422 -3134 -13441 -3142 -13465 Q -3143 -13478 -3135 -13482 L -3135 -13485 -3134 -13581 Q -3134 -13646 -3141 -13710 L -3152 -13783 -3153 -13792 -3173 -13875 Q -3215 -14028 -3205 -14189 -3224 -14219 -3235 -14250 L -3280 -14364 Q -3331 -14482 -3340 -14616 L -3345 -14732 -3437 -14674 Q -3527 -14617 -3606 -14671 L -3647 -14708 Q -3721 -14787 -3801 -14847 -3827 -14866 -3846 -14841 L -3887 -14792 -3887 -15212 -3803 -15153 -3803 -15151 -3803 -14943 Q -3778 -14937 -3750 -14917 L -3749 -14916 Q -3663 -14852 -3584 -14766 L -3583 -14766 -3557 -14743 Q -3523 -14722 -3483 -14747 L -3392 -14805 Q -3366 -14823 -3334 -14818 -3303 -14814 -3281 -14791 -3260 -14768 -3259 -14736 L -3253 -14622 -3253 -14621 Q -3245 -14503 -3200 -14398 L -3200 -14397 -3154 -14279 -3153 -14278 -3133 -14237 Q -3117 -14213 -3118 -14184 -3128 -14037 -3089 -13898 L -3068 -13809 -3067 -13799 -3055 -13720 -3055 -13719 Q -3047 -13651 -3047 -13580 L -3047 -13579 -3048 -13485 -3048 -13484 -3048 -13482 -3051 -13462 Q -3046 -13446 -3049 -13429 -3052 -13404 -3069 -13384 L -3078 -13372 -3090 -13354 -3090 -13353 Q -3143 -13256 -3145 -13140 -3148 -13016 -3141 -12891 L -3141 -12890 -3140 -12874 Q -3133 -12755 -3146 -12601 -3142 -12578 -3148 -12556 L -3154 -12537 -3154 -12536 -3185 -12424 -3186 -12424 -3216 -12291 Q -3241 -12166 -3251 -12044 L -3251 -12043 Q -3261 -11926 -3250 -11808 -3238 -11681 -3202 -11559 -3172 -11460 -3110 -11377 L -3069 -11337 Q -3039 -11319 -3030 -11285 L -3029 -11281 -3024 -11296 Q -3011 -11325 -2982 -11339 L -2963 -11348 Q -2937 -11364 -2907 -11359 -2878 -11354 -2857 -11332 -2837 -11310 -2835 -11279 -2833 -11250 -2849 -11224 L -2863 -11204 Q -2884 -11176 -2918 -11169 -2953 -11162 -2982 -11182 L -2993 -11189 Q -3019 -11207 -3028 -11237 L -3029 -11243 -3038 -11222 Q -3065 -11171 -3057 -11104 L -3057 -11103 Q -3052 -11051 -3028 -10991 -3017 -10960 -3028 -10929 L -3046 -10877 Q -3080 -10763 -3054 -10646 -3039 -10580 -2993 -10540 -2969 -10520 -2963 -10488 -2958 -10456 -2975 -10429 -2992 -10401 -3022 -10391 -3101 -10366 -3128 -10284 L -3127 -10285 Q -3159 -10185 -3113 -10090 -3078 -10019 -3042 -9966 -3028 -9946 -3026 -9922 -3025 -9898 -3037 -9876 -3084 -9788 -3116 -9673 L -3117 -9673 Q -3146 -9570 -3107 -9467 -3072 -9374 -3017 -9305 L -3010 -9296 -3006 -9291 Q -2892 -9144 -3049 -8972 -3117 -8900 -3085 -8816 L -3085 -8817 Q -3042 -8727 -3081 -8525 -3103 -8414 -3064 -8309 L -3063 -8307 Q -3050 -8268 -3026 -8248 -2999 -8228 -2992 -8195 -2986 -8163 -3002 -8134 -3047 -8058 -3075 -7942 -3102 -7833 -3063 -7733 L -3063 -7734 -3049 -7704 Q -3039 -7685 -3038 -7663 -3038 -7641 -3047 -7621 -3085 -7547 -3057 -7478 -3048 -7459 -3049 -7439 -3051 -7418 -3061 -7400 -3096 -7341 -3108 -7302 L -3108 -7300 -3112 -7265 -3113 -7251 Q -3132 -7139 -3139 -7029 L -3156 -6799 -3155 -6799 Q -3164 -6689 -3148 -6580 L -3148 -6581 Q -3127 -6446 -3113 -6312 -3100 -6186 -3073 -6062 -3043 -5924 -3019 -5785 L -3018 -5784 -2976 -5534 -2975 -5533 Q -2962 -5453 -2955 -5364 -2953 -5339 -2965 -5317 -2977 -5295 -2999 -5282 -3022 -5270 -3047 -5271 L -3092 -5268 -3091 -5268 Q -3145 -5258 -3152 -5199 L -3152 -5201 -3154 -5192 Q -3132 -5176 -3124 -5150 -3115 -5124 -3123 -5097 -3132 -5071 -3153 -5054 -3219 -5001 -3212 -4907 -3205 -4804 -3149 -4716 -3099 -4638 -3008 -4649 -2977 -4653 -2951 -4635 -2925 -4619 -2915 -4589 -2906 -4559 -2918 -4530 -2930 -4502 -2957 -4487 -3037 -4444 -3044 -4348 -3049 -4281 -2999 -4250 -2974 -4237 -2962 -4211 -2950 -4185 -2956 -4158 -2960 -4087 -2847 -4058 -2817 -4050 -2798 -4024 -2780 -3998 -2783 -3967 -2786 -3935 -2808 -3913 -2830 -3891 -2861 -3888 L -2940 -3882 -2942 -3839 Q -2943 -3817 -2955 -3797 -2967 -3777 -2987 -3766 -3030 -3742 -3072 -3724 L -3068 -3543 Q -3067 -3413 -3075 -3284 L -3084 -3020 -3084 -3018 Q -3081 -2924 -3051 -2819 L -3051 -2820 -3028 -2752 Q -3018 -2723 -3028 -2693 -3038 -2664 -3065 -2648 -3092 -2632 -3122 -2636 -3209 -2650 -3222 -2567 L -3222 -2566 Q -3236 -2468 -3173 -2393 L -3172 -2392 -3142 -2364 Q -3117 -2349 -3106 -2321 -3096 -2294 -3104 -2265 -3113 -2237 -3137 -2220 -3161 -2203 -3191 -2204 L -3214 -2205 -3193 -2190 Q -3137 -2160 -3087 -2125 -3060 -2106 -3053 -2073 -3046 -2041 -3062 -2012 -3074 -1985 -3065 -1944 -3060 -1918 -3070 -1893 -3080 -1868 -3103 -1853 -3105 -1843 -3092 -1816 L -3091 -1815 -3082 -1801 Q -3065 -1781 -3061 -1754 -3058 -1728 -3070 -1704 -3089 -1669 -3069 -1637 -3055 -1615 -3054 -1589 -3054 -1559 -3044 -1539 -3028 -1508 -3037 -1475 -3046 -1442 -3075 -1423 -3119 -1397 -3131 -1370 -3132 -1348 -3111 -1321 L -3099 -1304 Q -3086 -1283 -3085 -1257 -3085 -1232 -3099 -1210 -3148 -1129 -3113 -1026 -3107 -1007 -3092 -999 -3065 -987 -3050 -960 -3036 -933 -3042 -903 -3048 -873 -3071 -853 -3126 -805 -3120 -719 L -3120 -718 -3118 -694 -3118 -693 -3104 -633 Q -3096 -607 -3104 -580 -3128 -503 -3103 -420 -3094 -390 -3106 -361 -3119 -333 -3146 -318 L -3149 -321 -3138 -289 Q -3095 -205 -3038 -127 -3019 -101 -3021 -68 -3024 -36 -3047 -13 L -3060 4 -3058 10 -3059 9 -3053 18 Q -3034 45 -3038 78 -3043 111 -3068 133 L -3070 135 -3074 139 Q -3110 172 -3134 222 -3182 319 -3167 430 L -3166 436 Q -3148 557 -3089 663 L -3075 687 -3032 755 Q -3015 779 -3017 809 -3019 838 -3038 861 -3059 884 -3070 911 -3091 964 -3076 1028 L -3076 1029 -3069 1053 -3052 1081 Q -3033 1102 -3030 1131 -3027 1160 -3042 1185 -3058 1211 -3066 1241 L -3071 1265 Q -3081 1328 -3066 1384 L -3065 1386 -3065 1387 Q -3059 1411 -3066 1435 -3074 1459 -3094 1476 -3114 1492 -3139 1495 L -3141 1496 Q -3160 1498 -3170 1506 -3194 1530 -3228 1532 -3262 1533 -3288 1511 -3315 1489 -3318 1455 -3334 1316 -3324 1174 L -3324 1173 Q -3316 1047 -3346 926 -3363 856 -3401 800 L -3408 790 -3407 942 Q -3407 1237 -3373 1528 L -3373 1529 Q -3353 1706 -3258 1852 L -3244 1873 Q -3201 1935 -3168 1999 L -3126 2074 Q -3115 2092 -3113 2113 -3112 2133 -3120 2153 -3139 2194 -3135 2232 L -3134 2248 Q -3138 2308 -3115 2374 L -3115 2373 -3089 2431 Q -3074 2457 -3078 2487 -3082 2517 -3104 2538 -3127 2559 -3157 2561 -3188 2563 -3212 2546 -3276 2502 -3350 2484 L -3351 2484 Q -3303 2548 -3274 2633 L -3274 2634 -3246 2723 Q -3204 2877 -3191 3039 -3187 3088 -3148 3119 L -3147 3119 -3115 3139 -3075 3149 -3074 3149 Q -3035 3153 -2995 3148 L -2997 3149 -2943 3147 -2894 3156 -2892 3156 -2864 3160 -2851 3196 -2833 3235 -2816 3284 -2826 3298 Q -2848 3324 -2882 3328 L -2895 3330 -2896 3330 -2924 3337 -2925 3338 Q -2978 3354 -3038 3391 L -3038 3390 -3096 3432 -3104 3438 -3068 3429 -3040 3418 -2999 3389 -2998 3388 -2945 3354 Q -2917 3336 -2884 3342 -2852 3348 -2831 3374 -2811 3400 -2813 3434 -2816 3466 -2840 3490 -2869 3517 -2902 3539 -2926 3555 -2951 3568 L -3038 3640 -3037 3639 -3085 3687 Q -3143 3753 -3179 3833 -3210 3900 -3247 3965 L -3180 3942 -3179 3941 -3128 3922 -3069 3919 Q -3040 3928 -3022 3954 -3005 3980 -3009 4012 -3018 4098 -2967 4200 L -2926 4263 Q -2905 4290 -2907 4324 -2909 4357 -2934 4381 L -2939 4385 -2941 4387 Q -3001 4435 -3069 4511 L -3107 4536 -3152 4538 -3163 4536 Q -3224 4528 -3280 4568 L -3308 4591 -3309 4591 Q -3366 4644 -3341 4720 -3312 4808 -3258 4887 L -3227 4930 -3226 4930 Q -3189 4979 -3181 5033 L -3181 5032 -3179 5045 -3179 5046 Q -3171 5116 -3216 5195 L -3216 5194 -3220 5203 -3220 5201 -3222 5205 Q -3239 5237 -3245 5264 L -3246 5292 -3231 5309 Q -3156 5350 -3155 5469 L -3146 5722 -3146 5723 -3135 5882 -3135 5883 -3128 5989 -3124 6038 -3116 6087 -3116 6088 -3116 6091 -3115 6094 -3115 6096 -3103 6146 -3103 6149 -3078 6230 Q -3071 6250 -3074 6271 -3087 6365 -3077 6490 L -3077 6491 -3067 6547 Q -3054 6593 -3024 6631 L -3024 6630 -3014 6645 Q -3001 6666 -3002 6690 L -3003 6683 -3005 6675 -3006 6671 -3006 6672 -3009 6660 -3011 6657 -3038 6760 -3036 6758 Q -3010 6738 -3003 6706 L -3002 6690 -3001 6694 -2999 6703 -2999 6702 Q -2981 6788 -2969 6913 -2957 7046 -2976 7179 L -2978 7192 -2988 7244 Q -3010 7356 -3046 7465 -3082 7574 -3092 7689 L -3092 7690 Q -3104 7815 -3123 7940 -3142 8061 -3139 8183 L -3137 8251 -2917 8251 -2906 8242 Q -2886 8227 -2862 8225 -2837 8223 -2815 8234 L -2792 8251 -435 8251 -441 8193 -441 8192 -464 7963 -461 7931 -453 7902 Q -418 7776 -390 7651 L -380 7587 Q -372 7501 -393 7417 L -393 7416 Q -420 7303 -460 7217 -468 7201 -468 7184 L -469 7172 -469 7171 -469 7164 -469 7159 Q -470 7070 -452 6984 L -392 6721 Q -363 6604 -375 6487 L -375 6486 -383 6432 -382 6396 Q -378 6378 -366 6363 -315 6294 -315 6189 L -315 6188 Q -316 6120 -326 6053 L -327 6049 -327 6046 -338 5990 -339 5988 -339 5986 -339 5987 -340 5985 -351 5945 -357 5922 Q -392 5791 -389 5655 L -389 5654 Q -387 5513 -370 5373 L -370 5372 Q -352 5236 -313 5106 L -312 5105 Q -274 4980 -255 4853 -237 4734 -270 4619 -284 4571 -286 4503 L -284 4481 Q -262 4386 -326 4325 -343 4308 -350 4286 -357 4263 -351 4240 L -339 4213 Q -295 4132 -280 4040 L -280 4039 Q -260 3924 -303 3837 -314 3816 -313 3794 -313 3770 -300 3751 -262 3689 -229 3624 -185 3533 -219 3447 L -219 3448 Q -241 3397 -270 3355 -287 3331 -286 3303 -285 3274 -266 3251 -248 3228 -220 3222 -168 3209 -141 3196 -111 3179 -85 3158 L -38 3111 Q 12 3046 32 2954 64 2802 86 2647 L 86 2646 99 2505 Q 101 2476 121 2454 140 2432 169 2426 L 189 2425 210 2421 Q 240 2419 266 2438 281 2448 303 2455 L 304 2455 341 2463 500 2485 630 2493 631 2493 637 2493 Q 691 2492 743 2472 L 744 2472 843 2432 842 2432 915 2397 Q 1002 2353 1067 2282 L 1068 2281 1078 2271 Q 976 2239 874 2196 825 2176 774 2166 L 773 2166 662 2157 635 2158 634 2158 Q 528 2162 426 2191 L 426 2192 Q 343 2215 266 2253 L 265 2254 Q 257 2257 250 2261 L 226 2274 Q 203 2286 183 2301 161 2316 134 2317 106 2317 84 2301 61 2285 52 2260 42 2234 50 2208 64 2144 132 2075 L 132 2076 147 2059 148 2058 173 2032 174 2032 208 1981 209 1980 Q 249 1901 277 1818 L 278 1816 341 1622 Q 368 1535 370 1444 L 370 1443 Q 375 1240 347 1041 L 342 1006 311 1084 290 1134 222 1293 222 1292 120 1540 119 1541 111 1562 Q 77 1650 58 1744 L 58 1745 55 1758 55 1759 Q 33 1857 14 1956 -11 2079 -2 2201 L 18 2474 Q 21 2502 6 2526 L -57 2635 Q -72 2661 -100 2673 L -156 2676 Q -185 2667 -203 2643 -221 2618 -219 2589 L -219 2455 Q -225 2319 -221 2184 L -221 2183 Q -220 2054 -235 1930 L -235 1929 Q -249 1804 -302 1689 L -307 1676 Q -349 1521 -326 1402 -306 1292 -359 1190 L -368 1157 Q -370 1139 -364 1122 L -333 1031 -332 1030 Q -299 932 -369 862 -391 839 -394 809 -397 778 -380 752 -323 667 -300 564 -277 450 -291 335 -306 219 -376 136 -397 112 -397 82 -398 51 -379 26 -374 12 -378 -11 L -378 -12 -390 -79 Q -410 -102 -411 -132 -413 -163 -394 -188 L -383 -203 -383 -204 -333 -280 -277 -367 -297 -390 Q -312 -415 -309 -442 -307 -470 -288 -492 -254 -538 -253 -632 -254 -760 -302 -835 -314 -851 -316 -871 -320 -891 -313 -910 -304 -943 -300 -989 -291 -1116 -322 -1226 -331 -1254 -320 -1281 L -312 -1300 Q -292 -1348 -294 -1376 L -311 -1382 Q -346 -1390 -364 -1420 -383 -1450 -376 -1484 -373 -1505 -382 -1528 -392 -1553 -386 -1578 -381 -1604 -362 -1622 -320 -1666 -358 -1722 -376 -1748 -373 -1779 -371 -1806 -354 -1826 L -363 -1835 Q -377 -1854 -380 -1877 -384 -1901 -374 -1922 -355 -1970 -334 -2033 L -334 -2041 Q -335 -2068 -319 -2090 -305 -2112 -280 -2122 L -268 -2126 -273 -2125 -231 -2145 -184 -2147 -140 -2155 -150 -2164 -152 -2166 -172 -2190 -169 -2192 -168 -2194 -167 -2195 -125 -2167 -146 -2232 -161 -2203 -167 -2195 -179 -2203 -172 -2190 Q -195 -2165 -231 -2145 L -245 -2150 Q -275 -2163 -289 -2192 L -321 -2249 Q -340 -2273 -339 -2303 -339 -2333 -320 -2356 -302 -2380 -273 -2386 -246 -2395 -216 -2426 -160 -2487 -203 -2570 -238 -2636 -283 -2622 -312 -2608 -343 -2616 -374 -2624 -392 -2650 -411 -2677 -407 -2708 L -388 -2841 -346 -3056 -339 -3201 Q -335 -3335 -337 -3469 -340 -3569 -335 -3659 -369 -3682 -409 -3700 -431 -3711 -444 -3731 -458 -3751 -459 -3775 L -468 -3939 -468 -3946 -468 -3983 Q -470 -4135 -488 -4164 -509 -4177 -520 -4199 -531 -4221 -528 -4245 -527 -4269 -512 -4289 -488 -4325 -493 -4381 L -493 -4382 Q -505 -4501 -572 -4591 L -572 -4590 Q -653 -4663 -529 -4792 -482 -4843 -506 -4908 -518 -4940 -505 -4971 -492 -5002 -461 -5016 -413 -5040 -399 -5097 -370 -5211 -450 -5291 -470 -5310 -475 -5336 -480 -5362 -469 -5386 -459 -5411 -437 -5425 -392 -5455 -399 -5509 L -399 -5510 Q -404 -5553 -422 -5574 -441 -5585 -473 -5580 -503 -5576 -529 -5591 -555 -5607 -566 -5635 -577 -5664 -567 -5692 L -543 -5767 -543 -5768 -473 -5990 -473 -5991 Q -432 -6116 -409 -6245 L -387 -6364 -388 -6363 -369 -6473 -329 -6730 -329 -6731 Q -312 -6858 -309 -6986 L -309 -6987 Q -308 -7101 -300 -7213 L -300 -7214 Q -293 -7318 -297 -7409 -331 -7488 -374 -7555 L -396 -7590 Q -411 -7611 -411 -7635 -412 -7660 -400 -7682 -387 -7704 -365 -7715 L -349 -7726 -348 -7727 Q -314 -7760 -304 -7822 -288 -7942 -299 -8062 L -299 -8063 Q -304 -8114 -323 -8157 L -323 -8156 Q -346 -8206 -388 -8243 L -392 -8247 -393 -8248 Q -414 -8266 -421 -8293 -428 -8320 -417 -8346 -406 -8373 -382 -8387 -359 -8402 -331 -8400 L -329 -8400 Q -328 -8459 -364 -8491 -386 -8508 -393 -8533 -402 -8559 -393 -8585 -385 -8611 -364 -8627 -356 -8637 -358 -8652 L -358 -8653 Q -375 -8766 -339 -8822 L -338 -8824 Q -319 -8858 -307 -8897 -290 -8958 -291 -9031 -292 -9088 -306 -9117 L -317 -9118 Q -347 -9113 -374 -9128 -401 -9144 -412 -9172 -457 -9272 -374 -9418 L -374 -9419 Q -348 -9465 -328 -9514 -305 -9575 -293 -9639 L -293 -9640 Q -280 -9711 -302 -9775 L -302 -9774 -325 -9822 -325 -9823 Q -392 -9932 -332 -10005 L -332 -10004 Q -271 -10097 -281 -10210 -291 -10318 -372 -10377 -395 -10393 -404 -10419 -413 -10446 -405 -10472 -397 -10498 -375 -10515 -320 -10560 -290 -10631 -250 -10728 -279 -10827 L -279 -10828 -286 -10848 Q -296 -10873 -289 -10899 -283 -10926 -262 -10943 -215 -10992 -246 -11069 L -247 -11070 -249 -11075 -267 -11103 Q -300 -11116 -314 -11148 -329 -11181 -317 -11214 L -284 -11312 Q -260 -11394 -246 -11465 L -246 -11466 Q -233 -11534 -232 -11592 -229 -11717 -236 -11841 L -257 -12094 -262 -12138 -262 -12139 Q -276 -12235 -301 -12317 L -339 -12433 Q -345 -12453 -343 -12472 -333 -12562 -331 -12648 L -331 -12649 -327 -12788 -321 -12924 Q -315 -13052 -325 -13179 L -325 -13180 Q -331 -13249 -359 -13294 L -387 -13326 -389 -13327 -401 -13336 Q -420 -13349 -430 -13369 -441 -13390 -440 -13413 L -432 -13472 -432 -13473 Q -413 -13552 -397 -13634 L -397 -13635 -350 -13859 Q -313 -14026 -332 -14195 L -341 -14244 -346 -14278 -341 -14381 -341 -14382 -323 -14563 -323 -14562 Q -307 -14689 -269 -14821 -262 -14848 -240 -14865 -219 -14882 -192 -14884 -165 -14886 -141 -14871 L 54 -14755 Q 83 -14738 111 -14738 L 111 -14739 Q 144 -14744 176 -14775 L 176 -14776 Q 261 -14861 354 -14925 L 355 -14925 Q 448 -14989 518 -14903 L 519 -14903 Q 597 -14809 699 -14748 772 -14704 834 -14760 L 835 -14761 Q 906 -14830 908 -14934 911 -15089 979 -15125 1050 -15197 1182 -15106 1291 -15029 1407 -14963 1512 -14902 1629 -14880 L 1630 -14880 Q 1703 -14866 1720 -14925 1741 -15027 1694 -15122 L 1694 -15123 Q 1595 -15324 1723 -15442 1817 -15537 1960 -15537 L 2205 -15557 2206 -15557 2467 -15606 Q 2579 -15631 2657 -15709 L 2658 -15709 Q 2676 -15730 2668 -15761 L 2668 -15762 Q 2646 -15844 2610 -15896 2468 -15901 2332 -15926 L 2331 -15926 Q 2228 -15946 2138 -15980 2111 -15991 2096 -16015 2080 -16040 2083 -16069 2086 -16098 2106 -16119 2227 -16255 2443 -16266 L 2444 -16266 2595 -16286 2596 -16286 Q 2905 -16348 3202 -16447 3241 -16460 3251 -16486 3274 -16632 3231 -16750 2955 -16740 2692 -16698 L 2234 -16623 Q 2046 -16589 1857 -16614 1783 -16624 1758 -16660 L 1757 -16661 Q 1684 -16719 1759 -16833 1776 -16860 1807 -16869 L 2009 -16929 2234 -16996 2233 -16996 Q 2352 -17032 2474 -17057 L 2475 -17058 2485 -17060 2486 -17060 2745 -17106 2979 -17149 3224 -17211 3483 -17293 3484 -17294 Q 3610 -17337 3723 -17395 L 3724 -17396 3725 -17396 3711 -17427 3711 -17426 Q 3649 -17530 3617 -17647 L 3587 -17647 3586 -17647 3452 -17627 3451 -17627 3297 -17613 3296 -17612 3057 -17594 Q 2941 -17584 2838 -17559 2725 -17531 2561 -17506 L 2257 -17448 2171 -17429 1790 -17350 1585 -17311 Q 1239 -17247 852 -17153 L 539 -17072 538 -17072 373 -17026 374 -17026 Q 291 -17002 206 -16995 L 206 -16994 145 -16984 142 -16983 73 -16971 68 -16970 64 -16969 27 -16962 -4 -16952 Q -31 -16939 -100 -16922 L -101 -16922 -118 -16918 -165 -16920 Q -189 -16928 -204 -16947 -220 -16966 -223 -16990 L -239 -17070 Q -247 -17102 -233 -17130 L -227 -17141 Q -253 -17146 -272 -17165 L -273 -17165 Q -287 -17179 -293 -17196 -267 -17231 -226 -17249 L -207 -17259 -206 -17259 -152 -17280 -141 -17284 M -2999 2530 Q -3013 2570 -3045 2601 -3076 2629 -3113 2641 L -3119 2610 Q -3119 2574 -3093 2549 -3068 2523 -3032 2523 -3015 2523 -2999 2530 M -260 3144 L -240 3138 -182 3119 -182 3120 -139 3091 -108 3060 -116 3100 Q -124 3132 -150 3151 -177 3170 -210 3167 -240 3164 -260 3144 M -118 2766 L -180 2759 -186 2757 -161 2754 Q -138 2754 -118 2766 M -3887 -17486 L -3858 -17396 -3860 -17385 -3862 -17375 -3865 -17364 -3887 -17356 -3887 -17486 M -3887 -17154 Q -3848 -17132 -3803 -17124 L -3803 -17095 -3803 -17076 -3752 -17058 -3523 -16974 -3524 -16974 Q -3442 -16945 -3287 -16877 -3262 -16866 -3247 -16842 -3233 -16818 -3236 -16790 L -3237 -16779 -3243 -16705 Q -3245 -16681 -3258 -16661 -3273 -16642 -3295 -16632 L -3341 -16626 Q -3494 -16648 -3576 -16675 -3690 -16712 -3803 -16752 L -3803 -16717 -3803 -16635 -3803 -16628 -3865 -16630 -3887 -16619 -3887 -16855 Q -3833 -16855 -3775 -16834 -3662 -16794 -3549 -16757 -3472 -16732 -3329 -16712 L -3323 -16786 -3322 -16798 Q -3473 -16865 -3553 -16893 L -3782 -16977 -3887 -17012 -3887 -17154 M -157 -17278 L -164 -17276 -171 -17272 -162 -17276 -157 -17278 M -207 -17228 L -212 -17226 -211 -17226 -207 -17228 M -167 -16756 L -172 -16763 Q -190 -16786 -189 -16815 -189 -16845 -171 -16868 -154 -16891 -125 -16899 L -120 -16900 Q -87 -16910 -56 -16893 -26 -16876 -15 -16843 -6 -16813 -17 -16785 L -167 -16756 M -103 -16815 L -97 -16817 -103 -16815 M -2934 -11254 L -2921 -11273 -2945 -11261 -2934 -11254 M -399 -372 L -398 -368 Q -388 -336 -401 -306 -415 -277 -444 -263 L -399 -372 M -2943 6892 L -2943 6891 Q -2943 6859 -2922 6835 -2902 6811 -2870 6806 -2839 6800 -2812 6817 -2785 6834 -2774 6864 L -2774 6865 Q -2764 6897 -2777 6927 -2790 6957 -2820 6971 L -2882 6975 Q -2914 6965 -2930 6937 L -2936 6925 -2943 6892 M -2856 6891 L -2856 6892 -2856 6893 -2856 6891";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([34,34,34,0.32941177]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(2.56341552734375,0,0,2.56341552734375,-1966,-20892);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.4666666666666667,tocolor(ctrans.apply([102,102,102,0.32941177])));
	grd.addColorStop(1.0,tocolor(ctrans.apply([34,34,34,0.32941177])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M -3887 -18213 L -3812 -18196 -3877 -18130 -3887 -18137 -3887 -18213";
	ctx.fillStyle=tocolor(ctrans.apply([102,102,102,0.6627451]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -3803 -18061 Q -3716 -18040 -3661 -17987 -3596 -17924 -3577 -17815 -3573 -17795 -3588 -17780 -3652 -17711 -3717 -17757 L -3753 -17792 Q -3738 -17744 -3731 -17696 -3724 -17649 -3725 -17601 L -3717 -17597 Q -3590 -17541 -3644 -17400 L -3671 -17331 Q -3563 -17284 -3595 -17188 -3611 -17139 -3662 -17128 L -3681 -17124 Q -3747 -17113 -3803 -17124 -3848 -17132 -3887 -17154 L -3887 -17356 -3865 -17364 -3862 -17375 -3860 -17385 -3858 -17396 -3887 -17486 -3887 -18055 -3879 -18061 -3859 -18062 -3822 -18065 -3803 -18061 M -3717 -16616 L -3607 -16528 Q -3555 -16483 -3581 -16422 -3591 -16413 -3604 -16408 -3665 -16387 -3717 -16423 L -3728 -16432 -3717 -16388 Q -3655 -16124 -3675 -15843 -3679 -15794 -3717 -15784 L -3725 -15783 -3717 -15669 Q -3710 -15555 -3710 -15443 -3669 -15353 -3585 -15283 -3565 -15267 -3574 -15241 L -3574 -15240 -3533 -15192 Q -3512 -15164 -3539 -15140 -3619 -15070 -3717 -15105 -3747 -15116 -3779 -15137 L -3803 -15153 -3887 -15212 -3887 -16619 -3865 -16630 -3803 -16628 -3732 -16627 -3717 -16616 M -502 -149 Q -571 -30 -663 76 -760 9 -907 10 L -858 -44 Q -853 -103 -851 -163 -871 -219 -822 -255 -803 -269 -786 -271 -752 -253 -727 -227 -739 -369 -673 -481 -630 -554 -546 -552 L -533 -575 Q -527 -603 -498 -611 L -489 -613 -456 -622 -456 -624 Q -388 -587 -384 -528 L -379 -510 Q -369 -460 -392 -394 L -399 -372 -444 -263 -502 -149 M -658 80 Q -518 105 -522 265 L -522 276 -527 261 Q -572 142 -658 80 M -531 403 Q -543 497 -567 589 -611 757 -711 890 L -716 892 -676 801 -611 636 Q -580 554 -564 470 L -531 403 M -959 1050 L -991 1088 -1009 1092 Q -998 1067 -978 1047 L -968 1038 -959 1050 M -1210 497 L -1213 494 -1229 473 -1229 462 -1228 441 -1225 430 -1218 419 -1212 412 -1210 497 M 76 -16805 L 213 -16839 Q 286 -16848 302 -16781 L 303 -16771 Q 180 -16651 -8 -16630 -110 -16618 -209 -16589 -421 -16527 -621 -16570 L -624 -16580 -625 -16591 -625 -16602 Q -462 -16702 -259 -16740 L -223 -16747 -167 -16756 -17 -16785 76 -16805 M -358 -17134 Q -387 -17069 -438 -17015 L -480 -17022 Q -486 -17024 -492 -17029 -498 -17262 -320 -17419 L -287 -17446 -247 -17443 Q -182 -17356 -286 -17281 L -313 -17254 Q -326 -17237 -331 -17214 -341 -17172 -358 -17134 M -1268 -18073 L -1258 -18061 -1243 -18040 -1241 -18019 Q -1237 -18004 -1240 -17986 -1149 -17936 -1132 -17812 -1112 -17663 -1205 -17531 -1280 -17426 -1387 -17357 -1438 -17325 -1459 -17379 -1467 -17400 -1459 -17422 L -1451 -17432 -1441 -17443 -1447 -17464 -1463 -17487 -1465 -17497 -1466 -17508 Q -1497 -17528 -1504 -17562 L -1506 -17584 Q -1673 -17674 -1563 -17855 -1488 -17979 -1344 -18019 L -1337 -18040 Q -1333 -18058 -1319 -18069 L -1311 -18072 -1305 -18074 -1304 -18076 -1268 -18073 M -1427 -17825 L -1435 -17792 -1434 -17789 Q -1401 -17823 -1423 -17826 L -1427 -17825 M -2746 -18411 L -2728 -18389 Q -2716 -18375 -2718 -18357 -2667 -18331 -2613 -18314 -2541 -18172 -2562 -18012 -2592 -17793 -2764 -17670 L -2883 -17677 Q -3011 -17882 -2970 -18130 -2943 -18300 -2804 -18407 L -2797 -18410 -2790 -18412 -2790 -18414 -2746 -18411 M -2818 -17868 Q -2828 -17836 -2827 -17803 L -2825 -17792 Q -2804 -17784 -2790 -17807 L -2817 -17870 -2818 -17868 M -2355 -16846 L -2336 -16814 Q -2206 -16720 -2273 -16548 -2324 -16417 -2434 -16348 -2493 -16311 -2552 -16347 -2576 -16343 -2598 -16325 L -2642 -16300 -2664 -16307 -2663 -16318 -2656 -16339 -2671 -16347 Q -2717 -16321 -2768 -16332 -2919 -16459 -2810 -16640 -2760 -16725 -2688 -16792 -2632 -16846 -2558 -16837 L -2526 -16840 Q -2473 -16854 -2434 -16882 L -2387 -16879 Q -2366 -16866 -2355 -16846 M -2646 -16630 L -2643 -16652 -2645 -16659 -2653 -16656 Q -2710 -16577 -2732 -16483 L -2736 -16472 Q -2696 -16458 -2656 -16501 -2657 -16565 -2646 -16630 M -1697 -15892 L -1678 -15883 Q -1611 -15807 -1616 -15710 L -1617 -15678 Q -1522 -15616 -1513 -15494 L -1513 -15483 Q -1354 -15438 -1240 -15335 -1225 -15322 -1219 -15300 -1181 -15158 -1295 -15049 -1485 -14866 -1686 -15012 L -1703 -15030 Q -1844 -15024 -1862 -15145 -1897 -15180 -1907 -15232 L -1912 -15264 -2079 -15280 -2091 -15293 Q -2124 -15375 -2087 -15460 -2075 -15488 -2068 -15520 -2010 -15813 -1721 -15901 L -1697 -15892 M -1344 -14847 Q -1124 -14758 -1101 -14510 -1086 -14341 -1128 -14178 -1149 -14093 -1211 -14034 L -1225 -14031 -1261 -14023 Q -1240 -13872 -1356 -13794 -1423 -13749 -1476 -13811 -1513 -13854 -1519 -13911 L -1524 -14009 Q -1710 -14211 -1662 -14497 -1652 -14554 -1665 -14615 -1716 -14845 -1484 -14842 L -1409 -14847 -1344 -14847 M -1340 -10803 L -1343 -10775 Q -1359 -10588 -1413 -10412 -1419 -10391 -1435 -10375 -1545 -10268 -1604 -10403 -1614 -10425 -1612 -10452 L -1603 -10604 Q -1718 -10609 -1715 -10733 -1714 -10744 -1719 -10756 -1740 -10815 -1714 -10873 -1747 -11061 -1737 -11262 L -1736 -11305 Q -1895 -11272 -1881 -11426 -1873 -11511 -1880 -11600 -1946 -11608 -1998 -11664 -2048 -11468 -2128 -11281 -2147 -11237 -2195 -11247 -2334 -11276 -2302 -11426 -2280 -11531 -2270 -11639 -2237 -12012 -2149 -12370 -2146 -12384 -2130 -12392 L -2095 -12409 -2080 -12506 Q -2077 -12524 -2063 -12538 -2060 -12648 -2030 -12754 -2024 -12776 -2002 -12786 L -1966 -12792 -1966 -12794 Q -1859 -12739 -1872 -12602 L -1887 -12412 Q -1840 -12474 -1761 -12459 -1629 -12316 -1637 -12103 -1639 -12042 -1617 -11982 -1572 -11859 -1558 -11726 L -1534 -11467 -1511 -11486 -1481 -11510 -1416 -11510 Q -1283 -11367 -1306 -11152 L -1328 -10930 -1340 -10803 M -2056 -9543 L -2049 -9545 -2031 -9546 -2020 -9535 Q -2019 -9503 -2034 -9469 L -2034 -9460 Q -1802 -9391 -1788 -9140 -1781 -9005 -1841 -8892 -1867 -8844 -1908 -8809 -1998 -8791 -2081 -8827 -2236 -8793 -2250 -8966 -2267 -9167 -2157 -9323 L -2145 -9431 -2142 -9442 Q -2122 -9473 -2085 -9482 L -2059 -9535 -2056 -9543 M -2713 -5720 L -2714 -5734 Q -2720 -5903 -2613 -6015 L -2513 -6018 Q -2417 -5991 -2403 -5882 L -2401 -5875 -2398 -5875 Q -2375 -5879 -2354 -5889 L -2338 -5880 -2329 -5871 Q -2327 -5866 -2328 -5861 -2331 -5849 -2337 -5839 L -2344 -5828 Q -2294 -5550 -2402 -5290 -2415 -5261 -2441 -5245 -2593 -5273 -2654 -5432 L -2675 -5494 Q -2708 -5602 -2713 -5720 M -477 -2061 L -482 -2029 Q -499 -1923 -571 -1875 L -577 -1838 -588 -1780 Q -616 -1655 -711 -1577 L -753 -1580 -775 -1431 Q -785 -1372 -816 -1322 -878 -1219 -956 -1312 -992 -1355 -989 -1412 -970 -1835 -1006 -2263 L -1011 -2332 -1031 -2325 Q -1037 -2300 -1053 -2282 L -1117 -2217 -1128 -2213 -1171 -2214 -1185 -2225 -1193 -2235 -1204 -2239 -1214 -2234 -1214 -2232 -1229 -2229 -1294 -2224 Q -1390 -2323 -1383 -2484 -1378 -2585 -1378 -2688 -1378 -2985 -1282 -3256 -1270 -3288 -1247 -3314 L -1204 -3346 Q -984 -3333 -936 -3101 -911 -2981 -899 -2858 -798 -2831 -756 -2714 L -730 -2659 -740 -2757 -724 -2777 -704 -2796 -693 -2799 -671 -2803 Q -564 -2742 -551 -2603 -539 -2466 -546 -2331 L -546 -2319 Q -462 -2215 -477 -2061";
	ctx.fillStyle=tocolor(ctrans.apply([102,102,102,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -663 76 L -658 80 Q -572 142 -527 261 L -522 276 Q -505 336 -530 399 L -531 403 -564 470 Q -580 554 -611 636 L -676 801 -716 892 Q -769 1000 -840 1095 L -905 1095 Q -937 1077 -959 1050 L -968 1038 -970 1035 -989 997 Q -1002 958 -1020 922 -1047 909 -1078 882 L -1092 864 -1096 854 -1099 846 Q -1227 787 -1209 622 -1205 581 -1208 537 L -1210 497 -1212 412 Q -1212 311 -1199 215 -1196 190 -1171 188 L -1142 188 -1142 185 -1138 175 -1128 164 -1114 152 -1096 125 Q -1061 43 -970 16 L -959 12 -907 10 Q -760 9 -663 76 M -2816 3284 L -2833 3235 Q -2801 3297 -2752 3330 L -2737 3380 Q -2773 3331 -2815 3288 L -2816 3284 M -2329 1706 Q -2316 1611 -2236 1548 L -2225 1545 -2196 1540 Q -2138 1555 -2087 1590 L -2077 1594 -2071 1587 -2051 1567 -2042 1558 -2025 1559 Q -2009 1564 -1995 1573 -1978 1595 -1997 1617 L -2031 1659 Q -2013 1810 -2031 1962 -2038 2023 -2088 2058 -2098 2199 -2215 2241 -2249 2254 -2266 2221 -2318 2120 -2327 2005 L -2329 1965 -2332 1749 -2329 1706";
	ctx.fillStyle=tocolor(ctrans.apply([96,96,96,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -2892 3067 Q -2915 2973 -2919 2878 -2920 2849 -2897 2828 L -2890 2826 -2873 2823 -2872 2821 Q -2811 2876 -2767 2949 L -2746 2852 Q -2739 2827 -2715 2816 L -2707 2810 Q -2564 2843 -2603 3000 -2609 3023 -2606 3050 -2585 3243 -2521 3426 -2484 3530 -2576 3575 -2637 3604 -2667 3547 -2703 3479 -2727 3409 L -2737 3380 -2752 3330 Q -2801 3297 -2833 3235 L -2851 3196 -2864 3160 -2892 3067 M -2017 3959 Q -2012 3802 -1844 3804 L -1815 3806 Q -1768 3765 -1703 3774 -1675 3742 -1632 3741 L -1602 3717 -1592 3709 -1581 3720 -1600 3741 -1610 3752 Q -1605 3908 -1680 4043 L -1668 4043 -1654 4055 -1642 4065 Q -1632 4150 -1726 4164 L -1793 4170 -1934 4155 -1952 4132 -1977 4101 -1975 4091 -1970 4077 Q -2019 4041 -2017 3961 L -2017 3959";
	ctx.fillStyle=tocolor(ctrans.apply([88,88,88,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -2313 5865 Q -2312 5809 -2282 5755 -2485 5419 -2537 5023 -2549 4935 -2581 4849 -2600 4834 -2636 4866 L -2653 4878 -2732 4878 -2750 4867 -2764 4856 Q -2879 4921 -2940 4817 -2958 4787 -2942 4753 L -2867 4605 Q -2808 4495 -2685 4486 -2668 4465 -2642 4459 L -2613 4453 Q -2574 4454 -2549 4483 L -2541 4493 Q -2394 4541 -2460 4691 -2471 4716 -2464 4742 -2352 5161 -2232 5572 -2222 5604 -2196 5626 L -2164 5626 Q -2001 5555 -1978 5732 L -1971 5798 Q -1967 5846 -1972 5885 -1996 6037 -2182 6041 -2253 6043 -2285 5979 -2314 5921 -2313 5865";
	ctx.fillStyle=tocolor(ctrans.apply([81,81,81,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -2493 -20904 L -2296 -20923 -1721 -20942 -951 -20911 -704 -20893 Q -296 -20875 63 -20713 87 -20703 101 -20676 L 101 -20675 105 -20676 138 -20672 151 -20660 159 -20651 Q 154 -20626 143 -20608 107 -20552 7 -20560 L 2 -20560 -31 -20557 Q -108 -20488 -232 -20477 -426 -20459 -613 -20399 -715 -20367 -790 -20389 -1059 -20339 -1335 -20366 -1890 -20262 -2470 -20323 L -2976 -20382 Q -3087 -20397 -3196 -20427 L -3336 -20461 Q -3388 -20472 -3429 -20498 L -3444 -20500 -3459 -20509 -3483 -20522 -3498 -20532 -3502 -20543 -3503 -20548 Q -3515 -20554 -3527 -20561 L -3532 -20583 -3533 -20592 -3534 -20593 Q -3546 -20628 -3527 -20658 -3501 -20701 -3448 -20688 L -3448 -20690 -3428 -20684 Q -3410 -20698 -3389 -20709 -3342 -20793 -3233 -20774 L -3226 -20772 -3220 -20771 -3184 -20780 -3142 -20796 Q -2980 -20855 -2795 -20864 L -2786 -20865 -2786 -20866 -2765 -20864 -2493 -20904";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([102,102,102,1]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.17626953125,0,0,0.17626953125,-2572,-21569);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.0,tocolor(ctrans.apply([124,162,186,1])));
	grd.addColorStop(1.0,tocolor(ctrans.apply([102,102,102,1])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M -1282 20089 Q -1243 20152 -1231 20237 -1204 20431 -1256 20617 -1288 20728 -1350 20826 -1487 21037 -1706 21164 L -1752 21194 Q -1827 21470 -1885 21749 L -1888 21764 -1879 21764 Q -1717 21997 -1804 22258 -1857 22417 -1978 22546 -1989 22682 -1927 22807 -1917 22828 -1920 22852 L -1913 22861 Q -1902 22874 -1904 22890 L -1895 22899 -1889 22908 -1982 22911 Q -2042 22836 -2066 22755 -2098 22981 -2117 23208 -2148 23581 -2056 23941 -1976 24249 -1838 24538 -1748 24727 -1737 24930 -1725 25153 -1811 25360 L -1847 25451 Q -1911 25614 -2066 25570 -2123 25554 -2139 25496 -2150 25456 -2152 25413 -2091 25313 -1966 25348 -1945 25362 -1932 25382 -1804 25138 -1839 24859 -1845 24812 -1864 24766 -2006 24410 -2128 24046 -2187 23870 -2202 23686 -2230 23322 -2184 22960 -2157 22745 -2123 22531 L -2155 22599 Q -2229 22969 -2312 23340 -2332 23429 -2325 23521 -2299 23856 -2147 24164 -2106 24247 -2091 24341 -2066 24497 -2072 24644 -1997 24818 -1991 25004 L -2015 25041 -2059 25041 -2077 25023 -2090 24948 -2111 24914 Q -2210 25299 -2551 25605 L -2716 25767 Q -2796 25853 -2846 25959 -2674 26250 -2425 25996 L -2400 25990 Q -2540 26209 -2803 26158 -2874 26089 -2952 26027 -2924 25729 -2683 25509 -2318 25174 -2225 24708 -2488 24189 -2549 23607 -2561 23487 -2546 23366 -2474 22795 -2184 22280 -2132 22188 -2097 22088 L -2084 22046 -2083 22046 Q -2067 21993 -2056 21940 L -2065 21919 -2059 21916 -2051 21918 -2051 21914 -2037 21834 -2044 21832 Q -2140 21684 -2134 21540 -2281 21855 -2400 22179 -2495 22439 -2515 22715 L -2530 22936 Q -2541 22885 -2537 22828 L -2537 22809 -2543 22800 -2549 22790 Q -2545 22444 -2444 22114 -2392 21942 -2319 21777 L -2009 21075 -1985 21020 -1971 20922 Q -1971 20608 -1987 20298 -1995 20148 -2011 19999 L -2018 19967 Q -2052 19809 -2092 19650 -2202 19208 -2139 18753 L -2135 18745 Q -2134 18610 -2124 18476 -2109 18262 -2031 18059 L -2028 18053 -2010 17860 Q -1994 17672 -2005 17491 L -2009 17437 -2017 17412 -2017 17409 -2037 17358 -2028 17358 -2013 17394 -2022 17321 Q -2003 17314 -1984 17310 L -1972 17308 Q -1918 17440 -1899 17591 -1886 17511 -1879 17432 -1865 17586 -1880 17738 L -1862 17728 -1860 17724 -1823 17736 Q -1723 17970 -1700 18215 L -1699 18214 -1618 18220 -1602 18240 -1594 18257 Q -1700 18300 -1778 18378 L -1788 18387 Q -1785 18468 -1832 18529 -1842 18542 -1860 18548 L -1896 18530 -1916 18548 -1921 18584 Q -1928 18613 -1942 18641 L -1953 18660 -1962 18665 Q -2052 19314 -1849 19956 -1821 20044 -1806 20136 -1789 20241 -1781 20345 -1763 20618 -1817 20881 L -1811 20861 -1801 20856 -1786 20852 Q -1774 20859 -1762 20868 L -1756 20841 Q -1755 20838 -1749 20837 L -1734 20843 -1735 20882 -1717 20819 Q -1643 20562 -1549 20319 L -1544 20313 -1530 20318 -1523 20325 -1575 20546 -1659 20863 -1618 20833 Q -1522 20765 -1471 20654 L -1405 20505 Q -1398 20353 -1413 20204 -1423 20116 -1440 20029 -1446 20002 -1420 19987 L -1411 19985 -1389 19981 Q -1322 20023 -1282 20089 M -1918 21914 L -2006 22381 -2006 22380 Q -1974 22331 -1932 22288 -1878 22146 -1896 22001 -1902 21957 -1918 21914 M -2415 23296 L -2376 23103 Q -2407 23214 -2420 23327 L -2415 23296 M -1119 25561 Q -1081 25518 -1025 25501 L -980 25486 Q -907 25477 -853 25523 L -848 25530 Q -776 25566 -735 25644 L -709 25705 -713 25717 -717 25729 -721 25737 Q -787 25768 -829 25712 L -860 25661 -903 25647 -924 25637 Q -1071 25708 -1118 25595 -1125 25579 -1119 25561 M -2325 23980 Q -2392 23848 -2418 23706 -2391 23922 -2303 24142 L -2208 24363 Q -2230 24166 -2325 23980 M -2049 25466 L -2044 25475 Q -2017 25498 -1991 25472 -1979 25457 -2010 25438 L -2047 25438 Q -2058 25450 -2049 25466 M -1692 25988 Q -1773 26298 -2111 26235 -2170 26225 -2222 26199 L -2226 26187 -2230 26163 -2345 26155 Q -2349 26155 -2353 26151 L -2327 26117 Q -2299 26083 -2262 26079 -2195 26069 -2148 26106 -2110 26100 -2063 26117 L -1995 26120 Q -1944 26107 -1896 26085 -1813 26047 -1768 25968 L -1753 25962 -1752 25960 -1716 25964 -1701 25977 -1692 25988 M -781 26103 Q -771 26300 -566 26310 L -554 26322 -542 26334 -539 26346 -538 26358 -538 26370 Q -675 26497 -820 26342 -913 26242 -907 26116 -985 26131 -1059 26070 L -1102 26072 Q -1137 26093 -1155 26131 L -1163 26134 -1179 26139 -1201 26129 -1215 26119 -1215 26107 -1215 26083 -1215 26071 Q -1189 26051 -1174 26024 L -1159 25999 Q -1135 25985 -1107 25978 L -1083 25972 Q -961 25961 -901 26067 L -900 26059 Q -866 26019 -820 25992 L -812 25988 Q -773 25980 -746 26008 L -737 26019 Q -725 26054 -753 26079 L -781 26103";
	ctx.fillStyle=tocolor(ctrans.apply([39,39,39,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape9(ctx,ctrans,frame,ratio,time){
	var pathData="M -100 -6519 L -100 7272 -1600 7272 -1600 -6519 Q -850 -6438 -100 -6519";
	var grd=ctx.createLinearGradient(-1600.0,1070.0,-100.0,1070.0);
	grd.addColorStop(0.0,tocolor(ctrans.apply([0,0,0,0.0])));
	grd.addColorStop(0.27058823529411763,tocolor(ctrans.apply([0,0,0,1])));
	grd.addColorStop(0.4666666666666667,tocolor(ctrans.apply([0,0,0,1])));
	grd.addColorStop(0.6862745098039216,tocolor(ctrans.apply([0,0,0,1])));
	grd.addColorStop(1.0,tocolor(ctrans.apply([0,0,0,0.0])));
	ctx.fillStyle = grd;
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite10(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 1;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape9",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function shape11(ctx,ctrans,frame,ratio,time){
	var pathData="M 1095 -1585 Q 1152 -1504 1202 -1414 L 1289 -1238 1317 -1172 1290 -1195 1203 -1266 1098 -1345 Q 1037 -1390 978 -1427 1021 -1531 1054 -1641 L 1095 -1585 M 904 -1040 Q 937 -1088 963 -1139 1041 -1035 1103 -921 1147 -839 1183 -752 1142 -777 1104 -808 992 -899 904 -1040 M -575 327 Q -552 278 -547 140 -550 119 -532 53 L -501 140 Q -463 249 -435 356 -334 210 -316 61 -255 246 -235 447 L -267 428 Q -339 390 -436 361 L -435 356 -436 361 -501 344 -575 327 M -265 1025 L -278 1168 Q -287 1283 -308 1375 L -396 1211 Q -450 1104 -488 984 L -497 955 -460 974 Q -371 1016 -265 1025 M 553 963 Q 536 1073 487 1162 430 1266 346 1339 L 347 1282 Q 351 1127 334 1024 456 1035 553 963 M 309 521 Q 289 428 288 251 L 288 154 317 240 330 276 Q 363 363 401 444 L 401 445 402 445 401 445 330 499 Q 310 513 309 521 M 403 442 Q 455 309 486 172 L 488 171 530 384 526 386 474 413 Q 429 441 405 442 L 403 442 M 132 -590 L 152 -594 Q 112 -534 85 -477 38 -375 -20 -278 L -39 -317 -57 -357 Q -119 -494 -171 -587 -56 -580 87 -587 L 132 -590 M 933 -48 L 933 -46 932 -43 930 -44 925 -47 933 -48 M 404 821 Q 359 821 360 786 385 649 497 571 536 543 576 527 684 544 604 675 537 786 404 821 M -982 -1131 L -975 -1135 -966 -1120 -904 -1025 -965 -960 -1108 -819 -1192 -743 -1249 -694 -1215 -756 -1192 -797 -1108 -939 -982 -1131 M -1108 -1571 L -1078 -1614 Q -1039 -1543 -1010 -1440 -1057 -1362 -1108 -1294 -1149 -1240 -1192 -1193 -1289 -1087 -1398 -1016 L -1406 -1018 -1398 -1043 Q -1382 -1097 -1357 -1149 -1282 -1302 -1192 -1445 L -1108 -1571 M -436 735 L -501 690 -546 641 Q -635 498 -501 525 L -466 534 Q -393 551 -325 599 L -314 607 Q -257 654 -243 740 -229 833 -366 770 L -436 735";
	ctx.fillStyle=tocolor(ctrans.apply([0,153,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 95 -1340 Q 117 -1175 40 -1059 -110 -996 -193 -1118 L -214 -1152 -215 -1154 Q -221 -1205 -214 -1254 L -195 -1326 -189 -1342 Q -88 -1582 -72 -1844 L 95 -1340 M 201 -1686 L 330 -1487 431 -1326 Q 430 -1199 345 -1197 L 330 -1194 Q 276 -1185 264 -1223 176 -1481 201 -1686 M 646 -1599 Q 634 -1478 576 -1502 388 -1579 417 -1829 538 -1729 646 -1599 M -506 -1358 Q -495 -1402 -455 -1452 -413 -1531 -345 -1700 -364 -1515 -359 -1326 -394 -1160 -496 -1275 L -505 -1297 Q -514 -1326 -506 -1358 M -606 -1431 Q -659 -1391 -691 -1421 -806 -1619 -532 -1844 -577 -1615 -606 -1431";
	ctx.fillStyle=tocolor(ctrans.apply([0,204,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -1250 -33 L -1250 -105 -1250 -133 -1192 -283 -1142 -393 -1108 -459 Q -1066 -539 -1017 -615 L -964 -685 Q -886 -771 -776 -809 L -693 -760 Q -602 -703 -511 -629 L -501 -621 -351 -486 Q -273 -409 -214 -332 L -189 -298 Q -146 -238 -115 -177 L 115 -191 189 -295 Q 254 -386 330 -481 L 432 -607 Q 565 -768 764 -779 L 791 -780 Q 1010 -656 1107 -412 L 1118 -382 Q 1158 -269 1172 -150 L 1179 -38 1179 -33 Q 1211 -1 1204 67 1159 44 1109 44 1022 43 920 113 L 888 122 Q 753 167 797 289 L 764 291 Q 722 296 666 320 606 345 530 384 L 488 171 487 168 487 171 486 172 Q 455 309 403 442 L 402 443 401 444 Q 363 363 330 276 L 317 240 288 154 288 251 Q 289 428 309 521 235 556 189 641 175 667 163 699 114 830 109 894 142 944 189 976 244 1012 318 1022 L 330 1024 334 1024 Q 351 1127 347 1282 L 346 1339 Q 430 1266 487 1162 536 1073 553 963 L 565 953 Q 668 867 737 752 L 764 708 886 504 Q 1039 665 993 916 L 901 1011 Q 851 1061 840 1136 815 1310 764 1442 L 722 1537 Q 657 1507 576 1513 452 1522 330 1517 L 303 1515 Q 260 1512 224 1497 L 189 1478 Q 116 1427 87 1311 86 1249 111 1183 146 1144 166 1088 L -56 1088 Q -56 1119 -28 1126 103 1157 37 1311 -3 1473 -143 1463 L -188 1460 -214 1459 Q -312 1454 -408 1458 L -501 1470 Q -597 1489 -692 1539 L -718 1519 Q -740 1485 -755 1445 -782 1375 -786 1289 -799 1031 -962 892 L -1007 858 Q -1018 760 -1017 718 -981 678 -962 639 -918 549 -962 462 L -967 453 -962 448 -892 380 Q -878 488 -838 586 -785 714 -679 818 -622 873 -563 914 L -501 953 -497 955 -488 984 Q -450 1104 -396 1211 L -308 1375 Q -287 1283 -278 1168 L -265 1025 -214 1027 -210 1027 -188 1027 Q -63 1022 44 958 58 981 41 867 23 753 -62 623 -112 546 -174 493 L -188 481 Q -201 470 -214 461 L -235 447 Q -255 246 -316 61 -334 210 -435 356 -463 249 -501 140 L -532 53 Q -550 119 -547 140 -552 278 -575 327 -692 302 -812 327 -822 208 -854 162 -816 -25 -962 -4 L -1019 10 -1025 7 -1026 7 Q -1067 -15 -1105 -26 L -1108 -27 -1192 -39 -1250 -33 M 933 -48 Q 971 -498 764 -479 L 708 -467 Q 531 -409 331 -162 556 -200 764 -124 846 -94 925 -47 L 930 -44 932 -43 933 -46 933 -48 M -864 -171 L -833 -173 -501 -161 -407 -153 -306 -144 -354 -212 -414 -283 -501 -373 -598 -459 -719 -550 -727 -547 Q -888 -489 -941 -248 -966 -222 -956 -194 -949 -171 -920 -148 -906 -167 -864 -171";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([102,102,102,1]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.12628173828125,0,0,0.12628173828125,50,1088);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.0,tocolor(ctrans.apply([168,183,223,1])));
	grd.addColorStop(1.0,tocolor(ctrans.apply([102,102,102,1])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M 1204 67 L 1216 74 Q 1254 95 1288 134 L 1302 151 1342 209 Q 1441 439 1422 730 L 1410 828 Q 1399 880 1381 915 1436 965 1410 1056 1359 1030 1307 1017 L 1222 1005 1110 1014 1049 1031 Q 980 1072 959 1166 895 1444 777 1621 L 764 1638 Q 603 1841 330 1845 L 316 1845 189 1845 -188 1837 -214 1836 -231 1835 Q -378 1829 -501 1798 -595 1774 -675 1735 -745 1688 -782 1615 L -800 1571 -962 1096 -975 1057 Q -997 1043 -1019 1033 -1062 1011 -1108 1001 L -1192 992 Q -1290 991 -1396 1037 L -1415 1045 Q -1414 1002 -1396 969 -1384 947 -1365 930 L -1396 827 -1405 783 Q -1439 611 -1411 426 L -1396 341 Q -1371 217 -1328 115 -1294 34 -1250 -33 L -1192 -39 -1108 -27 -1105 -26 Q -1067 -15 -1026 7 L -1029 13 -1025 12 -1020 10 -1019 10 -962 -4 Q -816 -25 -854 162 -822 208 -812 327 -851 346 -892 380 L -962 448 -967 453 -962 462 Q -918 549 -962 639 -981 678 -1017 718 -1018 760 -1007 858 L -962 892 Q -799 1031 -786 1289 -782 1375 -755 1445 -740 1485 -718 1519 L -692 1539 Q -597 1489 -501 1470 L -408 1458 Q -312 1454 -214 1459 L -188 1460 -143 1463 Q -3 1473 37 1311 103 1157 -28 1126 -56 1119 -56 1088 L 166 1088 Q 146 1144 111 1183 86 1249 87 1311 116 1427 189 1478 L 224 1497 Q 260 1512 303 1515 L 330 1517 Q 452 1522 576 1513 657 1507 722 1537 L 764 1442 Q 815 1310 840 1136 851 1061 901 1011 L 993 916 Q 1039 665 886 504 862 479 833 456 829 401 841 370 811 326 797 289 753 167 888 122 L 920 113 Q 1022 43 1109 44 1159 44 1204 67 M 189 1732 L 202 1731 330 1715 Q 438 1696 532 1663 502 1612 447 1604 L 330 1589 189 1578 174 1577 -91 1561 -188 1559 -214 1560 -358 1575 Q -514 1602 -417 1674 L -315 1701 -214 1721 -188 1725 Q -9 1749 189 1732 M -692 1539 L -677 1550 Q -675 1540 -692 1539";
	ctx.fillStyle=tocolor(ctrans.apply([111,113,119,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 727 376 Q 752 419 750 477 748 610 674 724 605 831 472 887 400 917 330 913 276 910 224 887 237 802 330 676 411 566 521 484 618 410 727 376 M 404 821 Q 537 786 604 675 684 544 576 527 536 543 497 571 385 649 360 786 359 821 404 821 M -594 428 L -501 441 Q -420 457 -345 486 -287 508 -243 546 L -214 573 -188 605 -154 662 Q -89 794 -64 908 L -171 910 -188 910 -214 910 Q -329 902 -425 839 L -485 797 -501 784 Q -571 729 -632 665 -730 563 -782 419 L -594 428 M -436 735 L -366 770 Q -229 833 -243 740 -257 654 -314 607 L -325 599 Q -393 551 -466 534 L -501 525 Q -635 498 -546 641 L -501 690 -436 735";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -812 327 Q -692 302 -575 327 L -501 344 -436 361 Q -339 390 -267 428 L -235 447 -214 461 Q -201 470 -188 481 L -174 493 Q -112 546 -62 623 23 753 41 867 58 981 44 958 -63 1022 -188 1027 L -210 1027 -214 1027 -265 1025 Q -371 1016 -460 974 L -497 955 -501 953 -563 914 Q -622 873 -679 818 -785 714 -838 586 -878 488 -892 380 -851 346 -812 327 M 886 504 L 764 708 737 752 Q 668 867 565 953 L 553 963 Q 456 1035 334 1024 L 330 1024 318 1022 Q 244 1012 189 976 142 944 109 894 114 830 163 699 175 667 189 641 235 556 309 521 310 513 330 499 L 401 445 402 445 405 442 Q 429 441 474 413 L 526 386 530 384 Q 606 345 666 320 722 296 764 291 L 797 289 Q 811 326 841 370 829 401 833 456 862 479 886 504 M 925 -47 Q 846 -94 764 -124 556 -200 331 -162 531 -409 708 -467 L 764 -479 Q 971 -498 933 -48 L 925 -47 M 727 376 Q 618 410 521 484 411 566 330 676 237 802 224 887 276 910 330 913 400 917 472 887 605 831 674 724 748 610 750 477 752 419 727 376 M 189 1732 Q -9 1749 -188 1725 L -214 1721 -315 1701 -417 1674 Q -514 1602 -358 1575 L -214 1560 -188 1559 -91 1561 174 1577 189 1578 330 1589 447 1604 Q 502 1612 532 1663 438 1696 330 1715 L 202 1731 189 1732 M -864 -171 Q -906 -167 -920 -148 -949 -171 -956 -194 -966 -222 -941 -248 -888 -489 -727 -547 L -719 -550 -598 -459 -501 -373 -414 -283 -354 -212 -306 -144 -407 -153 -501 -161 -833 -173 -864 -171 M -594 428 L -782 419 Q -730 563 -632 665 -571 729 -501 784 L -485 797 -425 839 Q -329 902 -214 910 L -188 910 -171 910 -64 908 Q -89 794 -154 662 L -188 605 -214 573 -243 546 Q -287 508 -345 486 -420 457 -501 441 L -594 428";
	ctx.fillStyle=tocolor(ctrans.apply([68,68,68,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite12(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 20;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 1:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-1,0,1,-242,256,256,256,256)),1,0,0,time);
			break;
		case 2:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-3,-1,2,-228,256,256,256,256)),1,0,0,time);
			break;
		case 3:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-4,-1,4,-215,256,256,256,256)),1,0,0,time);
			break;
		case 4:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-5,-1,5,-201,256,256,256,256)),1,0,0,time);
			break;
		case 5:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-6,-1,6,-188,256,256,256,256)),1,0,0,time);
			break;
		case 6:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-8,-2,7,-174,256,256,256,256)),1,0,0,time);
			break;
		case 7:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-9,-2,8,-161,256,256,256,256)),1,0,0,time);
			break;
		case 8:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-10,-2,10,-148,256,256,256,256)),1,0,0,time);
			break;
		case 9:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-11,-2,11,-134,256,256,256,256)),1,0,0,time);
			break;
		case 10:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-13,-3,12,-121,256,256,256,256)),1,0,0,time);
			break;
		case 11:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-14,-3,13,-107,256,256,256,256)),1,0,0,time);
			break;
		case 12:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-15,-3,15,-94,256,256,256,256)),1,0,0,time);
			break;
		case 13:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-16,-3,16,-81,256,256,256,256)),1,0,0,time);
			break;
		case 14:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-18,-4,17,-67,256,256,256,256)),1,0,0,time);
			break;
		case 15:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-19,-4,18,-54,256,256,256,256)),1,0,0,time);
			break;
		case 16:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-20,-4,19,-40,256,256,256,256)),1,0,0,time);
			break;
		case 17:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-21,-4,21,-27,256,256,256,256)),1,0,0,time);
			break;
		case 18:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-23,-5,22,-13,256,256,256,256)),1,0,0,time);
			break;
		case 19:
			place("shape11",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(-24,-5,23,0,256,256,256,256)),1,0,0,time);
			break;
	}
}

function shape13(ctx,ctrans,frame,ratio,time){
	var pathData="M 1347 -3036 Q 1366 -3043 1375 -3060 1668 -3063 1662 -2760 1651 -2182 1652 -1598 1719 -1611 1786 -1630 1939 -1674 2050 -1775 2346 -1811 2349 -1535 2350 -1443 2286 -1375 2134 -1214 1914 -1149 1782 -1110 1649 -1092 1644 -741 1630 -390 1621 -158 1508 37 1466 109 1400 145 1056 164 1093 -164 1147 -630 1158 -1103 1078 -1117 997 -1138 788 -1194 675 -1360 567 -1519 703 -1652 782 -1729 904 -1680 1033 -1628 1163 -1601 1169 -2071 1195 -2536 1208 -2769 1289 -2980 1304 -3021 1347 -3036 M 847 -1786 Q 715 -1596 536 -1761 471 -1821 395 -1860 L 330 -1855 269 -1812 Q 215 -1776 180 -1720 335 -1415 646 -1238 756 -1176 826 -1072 1062 -721 1014 -297 1002 -198 972 -100 843 321 427 416 149 480 -129 422 -427 359 -633 126 -687 65 -722 -4 -777 29 -837 54 -1183 195 -1522 24 -1618 -25 -1691 -89 L -1706 225 Q -1712 399 -1744 567 -1787 794 -2036 733 -2146 707 -2170 596 -2202 451 -2203 300 L -2210 408 Q -2212 438 -2233 463 -2385 649 -2583 481 -2660 417 -2661 315 L -2663 -27 Q -2997 92 -3354 -14 -3591 -84 -3662 -316 -3692 -415 -3696 -520 -3706 -760 -3612 -978 L -3557 -1104 Q -3475 -1293 -3311 -1400 -3272 -1425 -3220 -1430 -3192 -1422 -3170 -1411 -3118 -1439 -3060 -1460 L -2975 -1450 Q -2834 -1301 -3016 -1146 -3115 -1061 -3172 -959 -3212 -844 -3242 -725 L -3246 -707 Q -3251 -646 -3245 -580 L -3235 -565 -3204 -521 -3195 -510 Q -2911 -468 -2653 -564 L -2640 -870 Q -2610 -1465 -2561 -2055 -2513 -2645 -2425 -3228 -2406 -3355 -2330 -3450 -2315 -3693 -2128 -3810 -2107 -3823 -2080 -3825 -1859 -3779 -1926 -3561 -1983 -3373 -2000 -3177 L -2027 -2875 Q -2084 -2291 -2126 -1705 -2159 -1257 -2170 -805 L -2129 -811 -2115 -947 Q -2052 -1536 -1956 -2116 -1861 -2693 -1777 -3272 -1743 -3513 -1604 -3698 -1562 -3754 -1500 -3750 -1224 -3652 -1320 -3356 L -1337 -3285 Q -1430 -2702 -1499 -2115 L -1556 -1613 Q -1359 -1651 -1170 -1715 -849 -1722 -913 -1429 -928 -1357 -992 -1317 -1157 -1212 -1279 -1061 -1499 -788 -1313 -506 -1265 -432 -1170 -431 -904 -428 -767 -663 -648 -868 -644 -1105 -641 -1254 -545 -1363 -422 -1503 -248 -1409 -90 -1324 -103 -1140 -132 -713 -357 -379 L -300 -324 Q -33 -1 375 -120 648 -435 422 -790 361 -887 263 -957 -191 -1282 -142 -1814 -132 -1918 -60 -1996 135 -2207 400 -2220 730 -2185 858 -1878 878 -1831 847 -1786 M 3108 -1151 Q 3194 -1110 3193 -1015 3191 -781 2939 -837 2834 -860 2736 -907 2600 -972 2485 -885 2442 -619 2497 -349 2545 -116 2446 85 2433 110 2407 116 2135 181 2112 -84 2090 -335 2025 -578 1955 -841 2005 -1103 2010 -1131 2036 -1149 2133 -1216 2240 -1160 L 2254 -1171 Q 2338 -1244 2442 -1280 L 2480 -1300 Q 2809 -1297 3108 -1151 M 2576 -1583 Q 2538 -1601 2538 -1645 2542 -1814 2735 -1800 L 2780 -1800 Q 3408 -1851 3894 -1486 4093 -1338 4205 -1113 4469 -587 4233 -68 4086 257 3744 372 3371 498 3016 359 2771 263 2668 13 2506 -379 2875 -630 3172 -832 3531 -732 3783 -661 3965 -475 4003 -765 3854 -1018 3571 -1495 2990 -1495 2765 -1495 2576 -1583 M 2965 -251 L 2955 -235 Q 3071 89 3445 36 3630 10 3780 -115 3596 -435 3235 -430 3057 -405 2965 -251 M 6153 -1989 Q 6142 -1947 6110 -1915 5821 -1820 5745 -2109 5724 -2189 5780 -2250 5839 -2314 5920 -2310 6230 -2280 6153 -1989 M 4764 -2809 Q 4775 -2832 4796 -2835 4824 -2839 4820 -2860 5090 -2852 5084 -2560 5073 -2092 5043 -1625 5333 -1638 5615 -1720 5930 -1744 5873 -1454 5861 -1390 5815 -1345 5430 -1212 5014 -1204 4981 -699 4978 -190 4977 -36 4940 110 4996 300 4819 374 4707 420 4637 339 4546 234 4534 94 4485 -488 4522 -1076 L 4533 -1241 Q 4344 -1288 4201 -1418 4086 -1523 4184 -1638 4246 -1712 4353 -1688 L 4563 -1649 Q 4588 -1956 4619 -2262 4648 -2554 4764 -2809 M 5421 -831 Q 5475 -1149 5760 -1220 5981 -1167 5889 -940 5800 -717 5815 -471 5830 -236 6048 -259 6104 -265 6159 -281 6054 -558 6213 -874 6359 -1163 6654 -1303 L 6801 -1367 Q 6886 -1402 6970 -1400 7298 -1423 7487 -1249 7761 -1494 7985 -1775 8255 -1867 8295 -1605 8304 -1546 8305 -1485 8524 -1647 8681 -1421 8742 -1332 8760 -1222 8811 -916 8870 -615 9064 -1051 9005 -1508 8988 -1643 9017 -1778 9044 -1898 9150 -1940 9463 -1939 9474 -1621 9476 -1574 9497 -1529 9752 -991 10231 -623 10430 -470 10540 -263 10563 -219 10549 -169 10474 90 10168 50 L 10089 46 Q 9580 62 9085 0 8961 297 8656 170 8545 123 8524 6 8481 -241 8420 -475 8383 -260 8374 -40 8370 70 8300 150 8065 266 7974 48 7925 -70 7916 -200 7886 -647 7888 -1100 7888 -1146 7880 -1190 L 7660 -980 7672 -946 Q 7792 -588 7555 -275 7162 245 6523 95 6484 86 6449 70 6146 206 5818 151 5720 134 5645 64 5317 -240 5395 -684 L 5421 -831 M 7213 -882 Q 7125 -966 6990 -955 6796 -814 6625 -650 6615 -640 6600 -635 6508 -374 6787 -343 6835 -338 6884 -353 7229 -457 7255 -782 7213 -812 7213 -882 M 9290 -445 L 9285 -430 9775 -380 Q 9718 -473 9601 -587 9487 -700 9400 -805 L 9290 -445 M -2939 -1616 Q -3160 -1561 -3215 -1802 -3253 -1972 -3100 -2045 -2841 -2044 -2824 -1784 -2815 -1648 -2939 -1616 M -2179 -296 L -2183 -129 -2172 -299 -2179 -296";
	ctx.fillStyle=tocolor(ctrans.apply([255,204,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape14(ctx,ctrans,frame,ratio,time){
	var pathData="M 1347 -3036 Q 1366 -3043 1375 -3060 1668 -3063 1662 -2760 1651 -2182 1652 -1598 1719 -1611 1786 -1630 1939 -1674 2050 -1775 2346 -1811 2349 -1535 2350 -1443 2286 -1375 2134 -1214 1914 -1149 1782 -1110 1649 -1092 1644 -741 1630 -390 1621 -158 1508 37 1466 109 1400 145 1056 164 1093 -164 1147 -630 1158 -1103 1078 -1117 997 -1138 788 -1194 675 -1360 567 -1519 703 -1652 782 -1729 904 -1680 1033 -1628 1163 -1601 1169 -2071 1195 -2536 1208 -2769 1289 -2980 1304 -3021 1347 -3036 M 847 -1786 Q 715 -1596 536 -1761 471 -1821 395 -1860 L 330 -1855 269 -1812 Q 215 -1776 180 -1720 335 -1415 646 -1238 756 -1176 826 -1072 1062 -721 1014 -297 1002 -198 972 -100 843 321 427 416 149 480 -129 422 -427 359 -633 126 -687 65 -722 -4 -777 29 -837 54 -1183 195 -1522 24 -1618 -25 -1691 -89 L -1706 225 Q -1712 399 -1744 567 -1787 794 -2036 733 -2146 707 -2170 596 -2202 451 -2203 300 L -2210 408 Q -2212 438 -2233 463 -2385 649 -2583 481 -2660 417 -2661 315 L -2663 -27 Q -2997 92 -3354 -14 -3591 -84 -3662 -316 -3692 -415 -3696 -520 -3706 -760 -3612 -978 L -3557 -1104 Q -3475 -1293 -3311 -1400 -3272 -1425 -3220 -1430 -3192 -1422 -3170 -1411 -3118 -1439 -3060 -1460 L -2975 -1450 Q -2834 -1301 -3016 -1146 -3115 -1061 -3172 -959 -3212 -844 -3242 -725 L -3246 -707 Q -3251 -646 -3245 -580 L -3235 -565 -3204 -521 -3195 -510 Q -2911 -468 -2653 -564 L -2640 -870 Q -2610 -1465 -2561 -2055 -2513 -2645 -2425 -3228 -2406 -3355 -2330 -3450 -2315 -3693 -2128 -3810 -2107 -3823 -2080 -3825 -1859 -3779 -1926 -3561 -1983 -3373 -2000 -3177 L -2027 -2875 Q -2084 -2291 -2126 -1705 -2159 -1257 -2170 -805 L -2129 -811 -2115 -947 Q -2052 -1536 -1956 -2116 -1861 -2693 -1777 -3272 -1743 -3513 -1604 -3698 -1562 -3754 -1500 -3750 -1224 -3652 -1320 -3356 L -1337 -3285 Q -1430 -2702 -1499 -2115 L -1556 -1613 Q -1359 -1651 -1170 -1715 -849 -1722 -913 -1429 -928 -1357 -992 -1317 -1157 -1212 -1279 -1061 -1499 -788 -1313 -506 -1265 -432 -1170 -431 -904 -428 -767 -663 -648 -868 -644 -1105 -641 -1254 -545 -1363 -422 -1503 -248 -1409 -90 -1324 -103 -1140 -132 -713 -357 -379 L -300 -324 Q -33 -1 375 -120 648 -435 422 -790 361 -887 263 -957 -191 -1282 -142 -1814 -132 -1918 -60 -1996 135 -2207 400 -2220 730 -2185 858 -1878 878 -1831 847 -1786 M 2576 -1583 Q 2538 -1601 2538 -1645 2542 -1814 2735 -1800 L 2780 -1800 Q 3408 -1851 3894 -1486 4093 -1338 4205 -1113 4469 -587 4233 -68 4086 257 3744 372 3371 498 3016 359 2771 263 2668 13 2506 -379 2875 -630 3172 -832 3531 -732 3783 -661 3965 -475 4003 -765 3854 -1018 3571 -1495 2990 -1495 2765 -1495 2576 -1583 M 3108 -1151 Q 3194 -1110 3193 -1015 3191 -781 2939 -837 2834 -860 2736 -907 2600 -972 2485 -885 2442 -619 2497 -349 2545 -116 2446 85 2433 110 2407 116 2135 181 2112 -84 2090 -335 2025 -578 1955 -841 2005 -1103 2010 -1131 2036 -1149 2133 -1216 2240 -1160 L 2254 -1171 Q 2338 -1244 2442 -1280 L 2480 -1300 Q 2809 -1297 3108 -1151 M 2965 -251 L 2955 -235 Q 3071 89 3445 36 3630 10 3780 -115 3596 -435 3235 -430 3057 -405 2965 -251 M 6153 -1989 Q 6142 -1947 6110 -1915 5821 -1820 5745 -2109 5724 -2189 5780 -2250 5839 -2314 5920 -2310 6230 -2280 6153 -1989 M 4764 -2809 Q 4775 -2832 4796 -2835 4824 -2839 4820 -2860 5090 -2852 5084 -2560 5073 -2092 5043 -1625 5333 -1638 5615 -1720 5930 -1744 5873 -1454 5861 -1390 5815 -1345 5430 -1212 5014 -1204 4981 -699 4978 -190 4977 -36 4940 110 4996 300 4819 374 4707 420 4637 339 4546 234 4534 94 4485 -488 4522 -1076 L 4533 -1241 Q 4344 -1288 4201 -1418 4086 -1523 4184 -1638 4246 -1712 4353 -1688 L 4563 -1649 Q 4588 -1956 4619 -2262 4648 -2554 4764 -2809 M 5421 -831 Q 5475 -1149 5760 -1220 5981 -1167 5889 -940 5800 -717 5815 -471 5830 -236 6048 -259 6104 -265 6159 -281 6054 -558 6213 -874 6359 -1163 6654 -1303 L 6801 -1367 Q 6886 -1402 6970 -1400 7298 -1423 7487 -1249 7761 -1494 7985 -1775 8255 -1867 8295 -1605 8304 -1546 8305 -1485 8524 -1647 8681 -1421 8742 -1332 8760 -1222 8811 -916 8870 -615 9064 -1051 9005 -1508 8988 -1643 9017 -1778 9044 -1898 9150 -1940 9463 -1939 9474 -1621 9476 -1574 9497 -1529 9752 -991 10231 -623 10430 -470 10540 -263 10563 -219 10549 -169 10474 90 10168 50 L 10089 46 Q 9580 62 9085 0 8961 297 8656 170 8545 123 8524 6 8481 -241 8420 -475 8383 -260 8374 -40 8370 70 8300 150 8065 266 7974 48 7925 -70 7916 -200 7886 -647 7888 -1100 7888 -1146 7880 -1190 L 7660 -980 7672 -946 Q 7792 -588 7555 -275 7162 245 6523 95 6484 86 6449 70 6146 206 5818 151 5720 134 5645 64 5317 -240 5395 -684 L 5421 -831 M 7213 -882 Q 7125 -966 6990 -955 6796 -814 6625 -650 6615 -640 6600 -635 6508 -374 6787 -343 6835 -338 6884 -353 7229 -457 7255 -782 7213 -812 7213 -882 M 9290 -445 L 9285 -430 9775 -380 Q 9718 -473 9601 -587 9487 -700 9400 -805 L 9290 -445 M -2939 -1616 Q -3160 -1561 -3215 -1802 -3253 -1972 -3100 -2045 -2841 -2044 -2824 -1784 -2815 -1648 -2939 -1616 M -2179 -296 L -2183 -129 -2172 -299 -2179 -296";
	ctx.fillStyle=tocolor(ctrans.apply([255,204,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape15(ctx,ctrans,frame,ratio,time){
	var pathData="M 1350 -3133 Q 1372 -3141 1375 -3160 1692 -3149 1664 -2815 1615 -2239 1573 -1661 1711 -1692 1845 -1748 1891 -1767 1925 -1785 2247 -1806 2212 -1512 2199 -1400 2094 -1348 1830 -1219 1549 -1180 1539 -815 1558 -446 1573 -161 1471 89 1453 131 1408 148 1166 235 1092 14 1056 -91 1055 -205 1048 -695 1076 -1179 L 952 -1199 Q 631 -1260 590 -1552 576 -1653 665 -1702 829 -1792 990 -1679 1043 -1642 1108 -1632 1145 -2103 1190 -2574 1212 -2808 1266 -3037 1283 -3108 1350 -3133 M 325 -2195 Q 750 -2211 810 -1812 816 -1772 779 -1752 645 -1681 529 -1794 447 -1872 335 -1835 L 324 -1822 245 -1760 225 -1700 Q 204 -1640 229 -1580 L 240 -1550 Q 452 -1346 706 -1194 820 -1126 890 -1012 1094 -681 1024 -295 925 255 438 458 328 504 200 507 -354 519 -588 36 L -611 -18 Q -751 77 -945 120 -1307 200 -1607 16 L -1631 1 -1626 149 Q -1615 363 -1696 547 -1765 703 -1955 641 -2156 574 -2140 368 -2116 71 -2115 -230 -2112 -829 -2038 -1416 -1964 -2000 -1919 -2586 -1876 -3134 -1660 -3631 L -1640 -3665 Q -1596 -3690 -1540 -3688 L -1540 -3690 Q -1290 -3605 -1352 -3312 -1413 -3024 -1435 -2730 -1478 -2144 -1531 -1560 L -1536 -1504 Q -1396 -1663 -1210 -1760 -906 -1778 -940 -1502 -955 -1382 -1041 -1292 -1191 -1136 -1270 -934 -1342 -750 -1350 -555 L -1343 -542 -1320 -510 -1300 -480 Q -999 -388 -867 -647 -727 -920 -675 -1223 -664 -1280 -621 -1321 -437 -1494 -290 -1298 -189 -1164 -207 -991 -231 -764 -281 -541 L -283 -530 Q -203 -508 -160 -430 -65 -260 57 -115 78 -90 112 -86 377 -48 476 -299 553 -493 486 -689 463 -759 404 -808 L 119 -1045 Q -302 -1396 -95 -1891 -15 -2082 188 -2159 259 -2186 325 -2195 M 2870 -1355 Q 3193 -1379 3244 -1088 3261 -988 3181 -921 3035 -798 2895 -910 2492 -892 2450 -507 2431 -325 2438 -146 2444 -6 2432 139 2409 409 2123 354 2029 336 2000 246 1956 111 1952 -35 1938 -495 1898 -951 1869 -1271 2188 -1239 2263 -1232 2300 -1165 2559 -1328 2870 -1353 L 2870 -1355 M 2562 -1562 Q 2432 -1702 2587 -1810 2706 -1893 2860 -1890 3471 -1937 3967 -1556 L 4036 -1499 Q 4017 -1586 4128 -1682 4181 -1728 4262 -1716 L 4560 -1684 4577 -2210 Q 4585 -2546 4724 -2838 L 4740 -2870 4758 -2878 4809 -2907 4810 -2910 Q 5124 -2921 5088 -2624 5031 -2156 5006 -1681 5253 -1696 5497 -1745 5617 -1769 5710 -1820 6013 -1834 5984 -1547 5971 -1416 5848 -1371 5550 -1264 5230 -1259 L 4990 -1256 Q 4976 -757 4983 -255 4986 3 4975 255 4844 476 4619 326 4529 267 4522 160 4486 -434 4525 -1026 L 4539 -1258 4450 -1260 Q 4291 -1263 4175 -1348 4537 -888 4377 -309 4203 321 3557 441 3304 488 3072 380 2592 156 2647 -360 2686 -728 3054 -826 3283 -888 3491 -798 3621 -743 3743 -669 L 3920 -555 Q 3986 -807 3817 -1020 3751 -1104 3666 -1173 3205 -1550 2625 -1532 2590 -1531 2562 -1562 M 3080 -270 L 3080 -255 Q 3328 82 3685 -120 3476 -366 3155 -390 3079 -352 3080 -270 M 6179 -2182 Q 6238 -2070 6151 -1979 L 6130 -1955 Q 5874 -1851 5743 -2073 5700 -2145 5731 -2228 5764 -2312 5840 -2345 6081 -2367 6179 -2182 M 5421 -892 Q 5503 -1157 5740 -1230 5995 -1156 5845 -909 5642 -573 5890 -255 5993 -284 6093 -323 6062 -435 6083 -562 6109 -716 6185 -852 6309 -1072 6512 -1226 6731 -1393 6985 -1475 7152 -1508 7254 -1384 L 7255 -1380 Q 7368 -1327 7446 -1251 7659 -1434 7827 -1662 7916 -1784 8045 -1841 8100 -1865 8160 -1849 8263 -1822 8289 -1704 8310 -1609 8300 -1510 8704 -1595 8816 -1228 8862 -1077 8880 -930 8994 -1340 8978 -1771 8973 -1885 9079 -1932 9105 -1943 9110 -1960 9427 -1954 9439 -1626 9441 -1565 9464 -1505 9629 -1069 10019 -800 10274 -623 10400 -335 10406 -276 10403 -216 10399 -117 10330 -40 10030 109 9696 36 L 9521 6 9025 -50 Q 8829 206 8565 38 8491 -10 8481 -97 8455 -321 8447 -546 8439 -772 8420 -995 8258 -569 8297 -95 8320 182 8032 144 7980 137 7952 92 7870 -46 7879 -216 7895 -538 7897 -860 7899 -1041 7890 -1220 7766 -1057 7604 -954 7622 -860 7614 -749 7584 -331 7257 -61 7158 21 7037 67 6633 221 6343 10 L 6300 50 Q 5973 311 5618 86 5553 45 5515 -23 5282 -438 5421 -892 M 6661 -590 L 6650 -575 6647 -516 6640 -470 Q 6779 -379 6945 -488 7092 -583 7149 -749 7197 -886 7130 -975 6863 -831 6661 -590 M 9234 -566 L 9230 -550 Q 9466 -488 9730 -465 9507 -621 9342 -831 9321 -858 9310 -850 L 9234 -566 M -3280 -1490 L -3261 -1498 -3211 -1527 -3210 -1530 Q -2888 -1538 -2954 -1234 -2973 -1147 -3041 -1086 -3286 -865 -3320 -540 -3169 -344 -2947 -525 -2814 -633 -2676 -622 L -2657 -915 Q -2618 -1509 -2567 -2101 -2515 -2696 -2448 -3287 -2424 -3496 -2338 -3685 -2313 -3740 -2261 -3755 L -2260 -3760 Q -1975 -3754 -2010 -3460 -2080 -2877 -2113 -2291 L -2170 -1106 -2216 80 Q -2223 263 -2320 410 -2596 532 -2654 266 -2695 81 -2701 -106 -2803 -58 -2910 -22 -3361 131 -3638 -215 -3812 -433 -3762 -717 -3709 -1018 -3516 -1256 -3410 -1386 -3280 -1490 M -2810 -1740 Q -2816 -1641 -2890 -1575 -3141 -1484 -3212 -1742 -3240 -1846 -3218 -1954 -3195 -2065 -3100 -2105 -2844 -2105 -2813 -1847 -2806 -1795 -2810 -1740";
	ctx.fillStyle=tocolor(ctrans.apply([255,204,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape16(ctx,ctrans,frame,ratio,time){
	var pathData="M 1637 -2100 L 1634 -1704 Q 1800 -1748 1960 -1800 2121 -1843 2230 -1740 2377 -1600 2274 -1424 L 2240 -1365 Q 1939 -1229 1623 -1175 L 1616 -915 1596 -360 Q 1587 -163 1559 28 1540 149 1416 179 1165 240 1123 11 1096 -134 1101 -285 L 1132 -1141 902 -1158 Q 849 -1164 801 -1193 586 -1321 589 -1560 589 -1609 601 -1645 533 -1669 475 -1725 L 455 -1728 360 -1730 Q 262 -1536 473 -1414 745 -1257 883 -989 1103 -564 893 -139 644 365 80 400 -26 406 -123 369 -408 259 -590 20 -648 -35 -678 -91 -795 -16 -943 22 -1346 126 -1571 -185 -1617 -249 -1650 -315 -1657 -119 -1655 80 -1652 319 -1736 540 L -1770 614 -1789 625 -1875 679 Q -2252 697 -2231 324 L -2156 -844 Q -2135 -1139 -2078 -1429 -1963 -2012 -1868 -2598 -1820 -2891 -1800 -3186 -1782 -3458 -1678 -3703 L -1660 -3750 Q -1650 -3753 -1642 -3758 L -1591 -3787 -1590 -3790 Q -1266 -3784 -1288 -3445 -1325 -2857 -1411 -2277 L -1555 -1280 Q -1443 -1482 -1268 -1644 -1192 -1714 -1100 -1710 -829 -1648 -964 -1408 L -1143 -1090 Q -1273 -861 -1249 -607 -1245 -568 -1220 -534 -1114 -385 -958 -515 -728 -708 -712 -1020 L -698 -1275 Q -688 -1439 -540 -1505 -180 -1510 -199 -1150 -217 -808 -351 -502 -176 -467 -57 -311 -36 -283 -4 -266 44 -241 85 -200 375 -233 469 -514 517 -660 450 -800 172 -991 -23 -1259 -143 -1422 -143 -1625 -142 -2035 230 -2180 L 633 -2146 Q 687 -2139 732 -2110 922 -1988 906 -1782 L 898 -1738 Q 965 -1714 1016 -1661 1073 -1602 1152 -1603 1173 -2129 1185 -2655 1191 -2904 1336 -3081 L 1375 -3120 Q 1660 -3127 1651 -2835 1640 -2471 1637 -2100 M 3098 -1213 Q 3137 -1192 3158 -1152 3261 -952 3074 -835 2958 -762 2850 -832 2745 -900 2620 -882 L 2460 -860 Q 2403 -599 2440 -322 2466 -132 2389 32 2321 179 2150 120 1988 64 1989 -105 1990 -277 1963 -450 1911 -790 1954 -1123 1962 -1184 2010 -1225 L 2055 -1232 Q 2286 -1224 2510 -1310 2831 -1360 3098 -1213 M 2531 -1579 Q 2482 -1601 2481 -1655 2479 -1831 2660 -1850 L 2920 -1865 Q 3553 -1899 3997 -1491 4202 -1302 4303 -1042 4511 -502 4220 18 4154 135 4054 229 3576 676 2978 397 2887 354 2817 278 2490 -77 2607 -526 2623 -588 2672 -633 2805 -757 2987 -784 3493 -860 3930 -630 3901 -906 3739 -1132 3495 -1473 3060 -1472 2773 -1471 2531 -1579 M 3095 -315 L 3065 -305 Q 3158 41 3513 -28 3645 -54 3730 -150 3462 -348 3115 -320 L 3095 -315 M 5129 -2588 Q 5085 -2293 5088 -1990 L 5090 -1785 Q 5352 -1800 5605 -1855 5927 -1875 5896 -1582 5876 -1392 5682 -1367 L 5092 -1308 5090 -805 Q 5087 -520 5091 -235 5096 61 4931 295 4894 347 4845 375 4497 402 4502 65 L 4505 -235 Q 4511 -783 4523 -1329 4320 -1369 4131 -1459 4082 -1482 4069 -1536 4031 -1683 4145 -1775 4337 -1786 4537 -1785 4554 -2198 4590 -2606 4616 -2911 4880 -2970 5177 -2905 5129 -2588 M 6160 -2092 Q 6181 -2008 6116 -1949 5966 -1812 5773 -1938 5591 -2057 5720 -2232 5756 -2281 5800 -2300 6098 -2348 6160 -2092 M 5416 -940 Q 5500 -1131 5660 -1220 5974 -1207 5867 -912 5826 -799 5816 -680 5801 -490 5840 -305 5957 -317 6073 -362 6045 -521 6100 -711 6247 -1220 6773 -1333 L 7035 -1395 Q 7313 -1432 7514 -1289 7610 -1422 7719 -1545 L 7783 -1627 Q 7882 -1769 8018 -1860 8082 -1903 8169 -1896 8210 -1893 8242 -1863 8359 -1753 8350 -1595 L 8648 -1572 Q 8684 -1568 8710 -1541 8923 -1314 8884 -984 8870 -858 8870 -730 L 8870 -480 Q 8976 -768 9011 -1070 L 9040 -1295 Q 8923 -1551 8999 -1816 9029 -1925 9125 -1965 9452 -1962 9482 -1631 9502 -1410 9625 -1216 9708 -1084 9826 -984 9884 -935 9952 -895 10230 -735 10422 -492 10555 -323 10506 -129 10455 74 10243 116 9955 174 9672 93 9410 18 9160 -5 8994 312 8667 144 8531 74 8472 -66 8427 -174 8415 -290 8409 -2 8175 107 8100 142 8009 119 7966 109 7944 69 7852 -94 7887 -289 7924 -494 7926 -705 7928 -946 7920 -1185 7830 -1107 7736 -1009 7789 -865 7749 -693 7695 -458 7534 -272 7108 217 6477 111 6418 101 6367 66 5997 279 5576 136 5485 105 5443 16 5303 -279 5332 -612 5347 -783 5416 -940 M 6895 -910 Q 6561 -793 6577 -461 L 6580 -445 Q 6776 -328 6989 -488 7163 -620 7235 -815 7067 -878 6895 -910 M 9364 -506 L 9360 -495 Q 9488 -467 9630 -470 9506 -534 9415 -641 9406 -651 9405 -640 9390 -572 9364 -506 M -3255 -555 Q -2983 -551 -2730 -660 L -2711 -890 Q -2655 -1476 -2587 -2060 -2518 -2656 -2424 -3248 -2382 -3513 -2260 -3748 -2214 -3837 -2120 -3830 -1859 -3758 -1929 -3452 L -1947 -3351 Q -2035 -2769 -2092 -2181 L -2207 -1012 Q -2264 -425 -2233 174 -2228 272 -2237 369 -2252 534 -2400 604 -2735 618 -2747 279 L -2752 -106 Q -3119 2 -3501 -96 -3580 -116 -3640 -175 -3813 -344 -3776 -591 -3734 -873 -3585 -1122 -3424 -1393 -3145 -1515 -2860 -1529 -2913 -1264 -2928 -1189 -2978 -1129 -3078 -1011 -3155 -880 -3240 -734 -3270 -570 L -3255 -555 M -2880 -1675 Q -3143 -1605 -3198 -1892 -3231 -2071 -3060 -2090 -2766 -2021 -2843 -1738 -2853 -1700 -2880 -1675";
	ctx.fillStyle=tocolor(ctrans.apply([255,204,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite17(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 8;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape13",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("shape14",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 2:
			place("shape15",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 3:
			place("shape15",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 4:
			place("shape16",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 5:
			place("shape16",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 6:
			place("shape15",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 7:
			place("shape15",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function button19(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 4;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			break;
	}
}

function shape20(ctx,ctrans,frame,ratio,time){
	var pathData="M -1400 1266 L -1408 1242 Q -1409 1229 -1401 1225 L -1400 1126 Q -1399 1023 -1418 923 -1426 877 -1439 832 L -1453 775 -1465 701 Q -1477 610 -1471 518 L -1462 432 -1418 462 Q -1308 542 -1255 661 L -1250 673 -1251 660 -1276 457 Q -1295 319 -1328 186 -1360 56 -1349 -77 -1279 -42 -1215 27 -1224 -57 -1222 -146 -1213 -424 -1252 -678 -1293 -938 -1357 -1180 -1426 -1443 -1301 -1669 L -1309 -1682 Q -1359 -1770 -1416 -1892 L -1418 -1896 Q -1531 -2144 -1437 -2402 L -1418 -2410 Q -1312 -2456 -1214 -2455 L -1130 -2446 Q -1084 -2436 -1041 -2414 L -997 -2390 -984 -2351 -822 -1876 -804 -1832 Q -767 -1759 -697 -1712 -617 -1673 -523 -1649 -400 -1618 -253 -1612 L -236 -1611 -210 -1610 167 -1602 294 -1602 308 -1602 Q 581 -1606 742 -1809 L 755 -1826 Q 873 -2003 937 -2281 958 -2375 1027 -2416 L 1088 -2433 1200 -2442 1285 -2430 Q 1337 -2417 1388 -2391 L 1405 -2358 Q 1496 -2169 1405 -1926 L 1397 -1906 1286 -1640 Q 1411 -1500 1329 -1187 1303 -1087 1286 -985 1258 -819 1256 -649 1253 -372 1221 -103 L 1203 12 1200 27 1203 20 Q 1242 -69 1286 -62 1300 -60 1314 -49 1334 117 1321 249 L 1295 515 1286 592 1265 723 1286 679 Q 1336 577 1405 461 L 1415 444 Q 1454 378 1474 432 1483 455 1488 502 1509 686 1468 867 1442 978 1422 1088 L 1397 1212 1386 1255 1380 1298 Q 1346 1254 1286 1246 L 1279 1245 1257 1243 1203 1229 1157 1207 1088 1156 Q 1025 1097 985 1011 975 981 939 976 830 958 742 1045 L 725 1063 722 1060 Q 675 996 617 941 514 843 396 823 L 414 783 418 775 515 543 526 505 528 490 742 386 753 381 Q 871 321 979 244 L 1026 200 Q 1047 173 1057 141 L 1088 73 Q 1135 -37 1115 -146 1198 -278 1184 -419 1170 -569 1099 -678 1111 -787 1088 -894 L 1076 -941 Q 1033 -1083 956 -1181 989 -1244 1017 -1317 1058 -1423 1088 -1519 L 1101 -1562 Q 1103 -1589 1095 -1614 L 1093 -1619 1088 -1612 Q 1061 -1577 1032 -1517 972 -1393 872 -1298 L 843 -1328 Q 827 -1433 858 -1541 L 875 -1590 889 -1642 Q 907 -1708 892 -1770 836 -1716 799 -1633 L 742 -1506 691 -1397 649 -1404 504 -1419 Q 399 -1414 308 -1364 280 -1349 254 -1329 L 167 -1264 37 -1167 Q -28 -1243 -122 -1309 -164 -1340 -210 -1362 L -236 -1374 Q -296 -1399 -362 -1411 -457 -1427 -523 -1415 -559 -1409 -586 -1394 L -646 -1397 -680 -1479 Q -731 -1610 -797 -1706 -806 -1752 -858 -1776 -870 -1661 -810 -1530 -737 -1370 -835 -1295 -879 -1356 -930 -1456 -954 -1503 -984 -1543 L -1041 -1609 -1077 -1641 Q -1068 -1549 -1041 -1459 L -1020 -1397 -984 -1289 Q -962 -1214 -955 -1160 L -984 -1132 Q -1017 -1098 -1041 -1053 -1064 -1011 -1079 -959 -1117 -827 -1099 -707 L -1118 -651 -1130 -620 Q -1170 -510 -1163 -391 -1156 -286 -1130 -206 L -1106 -146 Q -1083 -47 -1041 62 L -1029 92 -1015 124 -998 162 -984 192 -977 206 Q -881 291 -753 347 L -523 450 -509 456 Q -487 466 -474 479 -414 603 -369 737 L -356 775 -337 831 Q -445 843 -523 896 L -567 932 Q -621 983 -665 1051 -735 978 -847 979 -917 979 -971 1010 L -976 1012 -984 1017 Q -1015 1036 -1041 1067 L -1062 1094 Q -1093 1139 -1130 1162 -1169 1186 -1214 1187 -1334 1188 -1400 1266 M 1186 1816 Q 1135 1811 1090 1855 L 1088 1857 Q 977 1965 949 2088 884 2111 814 2124 L 742 2137 589 2160 565 2087 Q 548 2048 528 2016 L 461 1859 Q 437 1815 425 1730 469 1708 521 1686 L 469 1572 613 1481 Q 652 1456 692 1430 L 742 1401 Q 818 1362 899 1349 L 1063 1402 1088 1470 1152 1669 Q 1174 1744 1186 1816 M -941 2039 L -984 2030 -997 2027 -1041 2015 Q -1095 1995 -1130 1959 -1168 1919 -1185 1859 -1147 1758 -1137 1607 L -1130 1550 Q -1110 1441 -1041 1403 L -1037 1401 -984 1377 Q -927 1354 -869 1342 L -827 1350 Q -732 1370 -635 1413 -579 1438 -530 1465 L -523 1469 Q -477 1494 -438 1521 L -438 1694 Q -338 1714 -379 1866 -429 1969 -451 2075 L -481 2050 Q -496 2109 -523 2169 L -537 2198 Q -658 2184 -790 2116 L -941 2039 M -1214 -2171 Q -1254 -2158 -1266 -2096 -1305 -1885 -1225 -1705 L -1215 -1684 -1214 -1685 Q -1166 -1698 -1130 -1720 L -1104 -1738 Q -1062 -1772 -1041 -1821 -1008 -1897 -1023 -2009 -1028 -2048 -1041 -2078 -1068 -2144 -1130 -2165 L -1187 -2175 -1214 -2171 M -1130 -1119 L -1117 -1106 Q -1032 -1156 -1077 -1195 L -1130 -1202 Q -1208 -1205 -1130 -1119 M -1214 -1016 Q -1266 -1011 -1214 -945 L -1199 -928 Q -1166 -891 -1137 -936 -1132 -943 -1130 -949 -1124 -966 -1130 -984 L -1142 -1009 -1214 -1016 M 252 -331 L 308 -333 482 -341 Q 612 -348 742 -343 L 755 -343 871 -326 Q 802 -316 742 -262 L 737 -258 Q 639 -168 547 -68 431 59 338 26 L 308 -13 261 -68 Q 212 -123 167 -137 108 -156 58 -103 -16 -167 -60 -132 -152 -60 -210 -15 L -219 -8 -236 7 Q -332 80 -438 -31 L -523 -113 -628 -202 Q -736 -289 -864 -315 L -865 -315 -897 -320 -865 -319 -660 -331 -523 -343 -402 -350 -236 -345 -210 -342 -153 -335 -114 -457 -83 -541 -82 -542 -16 -708 Q -1 -744 22 -757 129 -721 167 -607 L 180 -556 247 -331 247 -329 252 -331 M 1208 -1685 Q 1238 -1765 1286 -1997 L 1293 -2033 Q 1323 -2181 1285 -2171 1259 -2164 1202 -2082 L 1184 -2057 Q 1024 -1820 1203 -1687 L 1207 -1684 1208 -1684 1208 -1685 M 1057 -1145 Q 1073 -1117 1088 -1103 1143 -1052 1180 -1192 1124 -1201 1088 -1176 1070 -1165 1057 -1145 M 1136 -958 Q 1151 -918 1154 -872 L 1203 -910 Q 1235 -942 1203 -953 L 1136 -958 M 167 254 Q 186 286 194 335 L 167 336 Q 83 328 116 206 147 221 167 254 M -113 355 Q -138 216 -35 178 -35 329 -113 355";
	ctx.fillStyle=tocolor(ctrans.apply([51,51,51,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -1214 -2171 L -1187 -2175 -1130 -2165 Q -1068 -2144 -1041 -2078 -1028 -2048 -1023 -2009 -1008 -1897 -1041 -1821 -1062 -1772 -1104 -1738 L -1130 -1720 Q -1166 -1698 -1214 -1685 L -1215 -1684 -1225 -1705 Q -1305 -1885 -1266 -2096 -1254 -2158 -1214 -2171 M -369 -1063 Q -322 -1044 -282 -1014 L -236 -975 -210 -948 Q -155 -888 -110 -805 L -109 -799 -210 -784 -222 -782 -236 -780 -488 -770 -523 -772 Q -638 -782 -747 -821 -874 -867 -984 -937 -917 -1002 -783 -1058 -728 -1081 -670 -1092 -763 -990 -628 -883 -574 -840 -523 -838 -458 -835 -398 -897 -333 -964 -369 -1063 M 1203 -1687 Q 1024 -1820 1184 -2057 L 1202 -2082 Q 1259 -2164 1285 -2171 1323 -2181 1293 -2033 L 1286 -1997 Q 1238 -1765 1208 -1685 L 1203 -1687 M 818 -1032 L 873 -1007 Q 939 -973 1000 -951 990 -901 909 -845 842 -800 742 -776 L 694 -766 Q 561 -744 425 -760 363 -768 308 -784 237 -806 180 -843 235 -907 308 -960 L 367 -1001 Q 429 -1040 497 -1057 430 -933 566 -851 660 -795 742 -845 769 -861 794 -889 849 -949 818 -1032";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 1380 1298 Q 1481 1363 1495 1520 1506 1653 1499 1787 L 1489 2060 Q 1488 2150 1477 2245 L 1418 2083 Q 1353 1911 1295 1877 L 1286 1872 1203 1825 1186 1816 Q 1174 1744 1152 1669 L 1088 1470 1063 1402 899 1349 874 1311 782 1155 742 1089 725 1064 725 1063 742 1045 Q 830 958 939 976 975 981 985 1011 1025 1097 1088 1156 L 1157 1207 1203 1229 1257 1243 1279 1245 1286 1246 Q 1346 1254 1380 1298 M 565 2087 Q 486 2203 463 2333 445 2339 446 2384 386 2316 308 2258 275 2233 239 2210 L 167 2165 15 2067 Q -99 2050 -210 2070 L -236 2076 -258 2081 Q -388 2116 -523 2190 L -537 2198 -706 2331 Q -772 2381 -804 2455 -809 2365 -826 2274 -852 2138 -941 2039 L -790 2116 Q -658 2184 -537 2198 L -523 2169 Q -496 2109 -481 2050 L -451 2075 Q -429 1969 -379 1866 -338 1714 -438 1694 L -438 1521 Q -477 1494 -523 1469 L -530 1465 -523 1453 -469 1358 -409 1251 Q -354 1153 -236 1127 L -229 1125 -229 1124 -236 1107 -277 998 -337 831 -356 775 -369 737 Q -414 603 -474 479 -487 466 -509 456 L -523 450 -753 347 Q -881 291 -977 206 L -984 192 -998 162 -1015 124 -1029 92 -1041 62 Q -1083 -47 -1106 -146 L -1130 -206 Q -1156 -286 -1163 -391 -1170 -510 -1130 -620 L -1118 -651 -1099 -707 Q -1076 -647 -1041 -595 L -984 -527 -932 -481 Q -823 -395 -681 -423 L -523 -453 -423 -471 -236 -506 -210 -512 -164 -523 -83 -542 -83 -541 -114 -457 -153 -335 -210 -342 -236 -345 -402 -350 -523 -343 -660 -331 -865 -319 -897 -320 -865 -315 -864 -315 Q -736 -289 -628 -202 L -523 -113 -438 -31 Q -332 80 -236 7 L -219 -8 -210 -15 Q -152 -60 -60 -132 -16 -167 58 -103 108 -156 167 -137 212 -123 261 -68 L 308 -13 338 26 Q 431 59 547 -68 639 -168 737 -258 L 742 -262 Q 802 -316 871 -326 L 755 -343 742 -343 Q 612 -348 482 -341 L 308 -333 252 -331 247 -331 180 -556 Q 191 -539 221 -533 263 -513 308 -497 359 -480 416 -470 L 676 -430 742 -426 Q 842 -429 936 -474 1051 -530 1088 -636 L 1099 -678 Q 1170 -569 1184 -419 1198 -278 1115 -146 1135 -37 1088 73 L 1057 141 Q 1047 173 1026 200 L 979 244 Q 871 321 753 381 L 742 386 528 490 526 505 515 543 418 775 414 783 396 823 Q 349 927 309 1036 L 308 1039 279 1125 308 1133 Q 427 1168 500 1266 L 555 1349 Q 592 1415 613 1481 L 469 1572 521 1686 Q 469 1708 425 1730 437 1815 461 1859 L 528 2016 Q 548 2048 565 2087 M -1185 1859 Q -1198 1849 -1214 1846 -1267 1834 -1348 1899 -1387 1930 -1418 1970 -1469 2036 -1497 2126 L -1501 2125 Q -1485 1962 -1493 1838 -1501 1701 -1498 1565 -1495 1427 -1432 1312 L -1418 1289 -1400 1266 Q -1334 1188 -1214 1187 -1169 1186 -1130 1162 -1093 1139 -1062 1094 L -1041 1067 Q -1015 1036 -984 1017 L -976 1012 -971 1010 Q -917 979 -847 979 -735 978 -665 1051 -692 1091 -715 1138 L -768 1244 -827 1350 -869 1342 Q -927 1354 -984 1377 L -1037 1401 -1041 1403 Q -1110 1441 -1130 1550 L -1137 1607 Q -1147 1758 -1185 1859 M -586 -1394 Q -559 -1409 -523 -1415 -457 -1427 -362 -1411 -296 -1399 -236 -1374 L -210 -1362 Q -164 -1340 -122 -1309 -28 -1243 37 -1167 L 167 -1264 254 -1329 Q 280 -1349 308 -1364 399 -1414 504 -1419 L 649 -1404 595 -1397 Q 466 -1361 359 -1276 L 308 -1232 Q 237 -1166 186 -1081 L 167 -1049 73 -872 8 -872 -39 -971 Q -97 -1092 -174 -1201 L -210 -1245 -236 -1270 Q -298 -1326 -381 -1352 -451 -1375 -523 -1386 L -586 -1394 M -369 -1063 Q -436 -1092 -517 -1099 L -523 -1099 -670 -1092 Q -728 -1081 -783 -1058 -917 -1002 -984 -937 -928 -1043 -838 -1130 -735 -1229 -604 -1269 L -523 -1281 Q -433 -1281 -357 -1212 -285 -1146 -236 -1065 L -210 -1017 -198 -992 -110 -805 Q -155 -888 -210 -948 L -236 -975 -282 -1014 Q -322 -1044 -369 -1063 M -107 -799 Q -125 -710 -210 -677 L -236 -669 -255 -665 Q -382 -643 -505 -661 L -523 -664 -770 -712 Q -903 -743 -984 -833 L -996 -847 Q -1040 -903 -984 -937 -874 -867 -747 -821 -638 -782 -523 -772 L -488 -770 -236 -780 -222 -782 -210 -784 -109 -799 -107 -799 M -984 -225 L -1013 -189 Q -1040 -67 -984 41 L -968 69 Q -934 124 -919 170 -796 265 -639 328 -579 352 -523 379 -479 399 -438 422 -341 475 -245 512 L -236 548 -233 559 -210 641 -168 775 -157 809 -67 1060 Q -37 1142 -21 1212 L 130 1205 167 1102 192 1024 271 775 276 759 308 642 333 516 336 502 Q 460 467 577 395 L 742 297 807 259 956 170 997 100 Q 1059 -26 1033 -161 1011 -273 912 -232 822 -195 742 -133 L 687 -86 Q 592 3 484 72 380 138 308 153 L 273 157 Q 219 132 167 98 111 60 58 12 34 21 10 36 -96 103 -210 150 L -222 155 -236 154 Q -370 144 -473 61 L -523 20 -687 -108 Q -797 -193 -919 -232 -957 -244 -984 -225 M 497 -1057 Q 429 -1040 367 -1001 L 308 -960 Q 235 -907 180 -843 237 -806 308 -784 363 -768 425 -760 561 -744 694 -766 L 742 -776 Q 842 -800 909 -845 990 -901 1000 -951 939 -973 873 -1007 L 818 -1032 742 -1056 611 -1071 497 -1057 M 308 -1089 Q 371 -1190 473 -1251 601 -1329 725 -1244 L 742 -1232 Q 843 -1160 922 -1061 L 1000 -951 Q 1041 -943 1036 -911 1016 -778 868 -734 L 742 -701 616 -677 352 -687 308 -699 Q 206 -737 180 -843 223 -938 293 -1064 L 308 -1089";
	ctx.fillStyle=tocolor(ctrans.apply([102,102,102,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -670 -1092 L -523 -1099 -517 -1099 Q -436 -1092 -369 -1063 -333 -964 -398 -897 -458 -835 -523 -838 -574 -840 -628 -883 -763 -990 -670 -1092 M 818 -1032 Q 849 -949 794 -889 769 -861 742 -845 660 -795 566 -851 430 -933 497 -1057 L 611 -1071 742 -1056 818 -1032 M -236 1127 L -229 1124 -229 1125 -236 1127";
	ctx.fillStyle=tocolor(ctrans.apply([0,153,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -109 -799 L -110 -805 -108 -799 -109 -799 M -476 310 L -496 301 -523 289 Q -604 253 -681 211 L -740 178 Q -800 143 -847 96 -889 54 -921 2 -961 -63 -969 -139 -940 -157 -887 -131 L -815 -87 -703 -10 Q -646 25 -585 56 L -523 91 -503 104 Q -431 151 -371 211 -328 254 -294 306 L -264 435 Q -359 363 -468 314 L -471 298 -476 310 M 374 301 L 490 211 581 141 644 93 Q 692 57 742 22 L 781 -4 807 -22 899 -86 965 -140 Q 982 -121 985 -67 L 904 36 805 129 779 150 742 180 632 266 593 296 Q 544 333 492 364 423 404 347 433 L 373 306 374 301";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -665 1051 Q -621 983 -567 932 L -523 896 Q -445 843 -337 831 L -277 998 -236 1107 -229 1124 -236 1127 Q -354 1153 -409 1251 L -469 1358 -523 1453 -530 1465 Q -579 1438 -635 1413 -732 1370 -827 1350 L -768 1244 -715 1138 Q -692 1091 -665 1051 M -1099 -707 Q -1117 -827 -1079 -959 -1064 -1011 -1041 -1053 -1017 -1098 -984 -1132 L -955 -1160 Q -962 -1214 -984 -1289 L -1020 -1397 -1041 -1459 Q -1068 -1549 -1077 -1641 L -1041 -1609 -984 -1543 Q -954 -1503 -930 -1456 -879 -1356 -835 -1295 -737 -1370 -810 -1530 -870 -1661 -858 -1776 -806 -1752 -797 -1706 -731 -1610 -680 -1479 L -646 -1397 -586 -1394 -523 -1386 Q -451 -1375 -381 -1352 -298 -1326 -236 -1270 L -210 -1245 -174 -1201 Q -97 -1092 -39 -971 L 8 -872 73 -872 167 -1049 186 -1081 Q 237 -1166 308 -1232 L 359 -1276 Q 466 -1361 595 -1397 L 649 -1404 691 -1397 742 -1506 799 -1633 Q 836 -1716 892 -1770 907 -1708 889 -1642 L 875 -1590 858 -1541 Q 827 -1433 843 -1328 L 872 -1298 Q 972 -1393 1032 -1517 1061 -1577 1088 -1612 L 1095 -1614 Q 1103 -1589 1101 -1562 L 1088 -1519 Q 1058 -1423 1017 -1317 989 -1244 956 -1181 1033 -1083 1076 -941 L 1088 -894 Q 1111 -787 1099 -678 L 1088 -636 Q 1051 -530 936 -474 842 -429 742 -426 L 676 -430 416 -470 Q 359 -480 308 -497 263 -513 221 -533 L 180 -556 167 -607 Q 129 -721 22 -757 -1 -744 -16 -708 L -82 -542 -83 -542 -164 -523 -210 -512 -236 -506 -423 -471 -523 -453 -681 -423 Q -823 -395 -932 -481 L -984 -527 -1041 -595 Q -1076 -647 -1099 -707 M 396 823 Q 514 843 617 941 675 996 722 1060 L 725 1064 742 1089 782 1155 874 1311 899 1349 Q 818 1362 742 1401 L 692 1430 Q 652 1456 613 1481 592 1415 555 1349 L 500 1266 Q 427 1168 308 1133 L 279 1125 308 1039 309 1036 Q 349 927 396 823 M -110 -805 L -198 -992 -210 -1017 -236 -1065 Q -285 -1146 -357 -1212 -433 -1281 -523 -1281 L -604 -1269 Q -735 -1229 -838 -1130 -928 -1043 -984 -937 -1040 -903 -996 -847 L -984 -833 Q -903 -743 -770 -712 L -523 -664 -505 -661 Q -382 -643 -255 -665 L -236 -669 -210 -677 Q -125 -710 -107 -799 L -107 -800 -110 -805 M -1214 -1016 L -1142 -1009 -1130 -984 Q -1124 -966 -1130 -949 -1132 -943 -1137 -936 -1166 -891 -1199 -928 L -1214 -945 Q -1266 -1011 -1214 -1016 M -1130 -1119 Q -1208 -1205 -1130 -1202 L -1077 -1195 Q -1032 -1156 -1117 -1106 L -1130 -1119 M -984 -225 Q -957 -244 -919 -232 -797 -193 -687 -108 L -523 20 -473 61 Q -370 144 -236 154 L -222 155 -210 150 Q -96 103 10 36 34 21 58 12 111 60 167 98 219 132 273 157 L 308 153 Q 380 138 484 72 592 3 687 -86 L 742 -133 Q 822 -195 912 -232 1011 -273 1033 -161 1059 -26 997 100 L 956 170 807 259 742 297 577 395 Q 460 467 336 502 L 333 516 308 642 276 759 271 775 192 1024 167 1102 130 1205 -21 1212 Q -37 1142 -67 1060 L -157 809 -168 775 -210 641 -233 559 -236 548 -245 512 Q -341 475 -438 422 -479 399 -523 379 -579 352 -639 328 -796 265 -919 170 -934 124 -968 69 L -984 41 Q -1040 -67 -1013 -189 L -984 -225 M -468 314 Q -359 363 -264 435 L -294 306 Q -328 254 -371 211 -431 151 -503 104 L -523 91 -585 56 Q -646 25 -703 -10 L -815 -87 -887 -131 Q -940 -157 -969 -139 -961 -63 -921 2 -889 54 -847 96 -800 143 -740 178 L -681 211 Q -604 253 -523 289 L -496 301 -476 310 -468 314 M 1057 -1145 Q 1070 -1165 1088 -1176 1124 -1201 1180 -1192 1143 -1052 1088 -1103 1073 -1117 1057 -1145 M 308 -1089 L 293 -1064 Q 223 -938 180 -843 206 -737 308 -699 L 352 -687 616 -677 742 -701 868 -734 Q 1016 -778 1036 -911 1041 -943 1000 -951 L 922 -1061 Q 843 -1160 742 -1232 L 725 -1244 Q 601 -1329 473 -1251 371 -1190 308 -1089 M 373 306 L 347 433 Q 423 404 492 364 544 333 593 296 L 632 266 742 180 779 150 805 129 904 36 985 -67 Q 982 -121 965 -140 L 899 -86 807 -22 781 -4 742 22 Q 692 57 644 93 L 581 141 490 211 374 301 367 306 373 306 M 1136 -958 L 1203 -953 Q 1235 -942 1203 -910 L 1154 -872 Q 1151 -918 1136 -958 M 167 254 Q 147 221 116 206 83 328 167 336 L 194 335 Q 186 286 167 254 M -113 355 Q -35 329 -35 178 -138 216 -113 355";
	ctx.fillStyle=tocolor(ctrans.apply([255,153,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite21(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 20;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(9,9,13,-255,256,256,256,256)),1,0,0,time);
			break;
		case 1:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(9,9,12,-242,256,256,256,256)),1,0,0,time);
			break;
		case 2:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(8,8,12,-228,256,256,256,256)),1,0,0,time);
			break;
		case 3:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(8,8,11,-215,256,256,256,256)),1,0,0,time);
			break;
		case 4:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(7,7,10,-201,256,256,256,256)),1,0,0,time);
			break;
		case 5:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(7,7,10,-188,256,256,256,256)),1,0,0,time);
			break;
		case 6:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(6,6,9,-174,256,256,256,256)),1,0,0,time);
			break;
		case 7:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(6,6,8,-161,256,256,256,256)),1,0,0,time);
			break;
		case 8:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(5,5,8,-148,256,256,256,256)),1,0,0,time);
			break;
		case 9:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(5,5,7,-134,256,256,256,256)),1,0,0,time);
			break;
		case 10:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(4,4,6,-121,256,256,256,256)),1,0,0,time);
			break;
		case 11:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(4,4,5,-107,256,256,256,256)),1,0,0,time);
			break;
		case 12:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(3,3,5,-94,256,256,256,256)),1,0,0,time);
			break;
		case 13:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(3,3,4,-81,256,256,256,256)),1,0,0,time);
			break;
		case 14:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(2,2,3,-67,256,256,256,256)),1,0,0,time);
			break;
		case 15:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(2,2,3,-54,256,256,256,256)),1,0,0,time);
			break;
		case 16:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(1,1,2,-40,256,256,256,256)),1,0,0,time);
			break;
		case 17:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(1,1,1,-27,256,256,256,256)),1,0,0,time);
			break;
		case 18:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,1,-13,256,256,256,256)),1,0,0,time);
			break;
		case 19:
			place("shape20",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
	}
}

function shape22(ctx,ctrans,frame,ratio,time){
	var pathData="M -3352 1425 Q -3049 1486 -2762 1441";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape23(ctx,ctrans,frame,ratio,time){
	var pathData="M -3352 1425 Q -2756 1545 -2226 1256";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape24(ctx,ctrans,frame,ratio,time){
	var pathData="M -3352 1425 Q -2731 1550 -2182 1231 -2024 1139 -1889 1027";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape25(ctx,ctrans,frame,ratio,time){
	var pathData="M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1519 695 -1343 311 -1195 -12 -1223 -111";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape26(ctx,ctrans,frame,ratio,time){
	var pathData="M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1775 544 -1620 145 -1551 -32 -1418 -106 -1062 -303 -1343 311 -1519 695 -1822 969 L -1830 1061";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape27(ctx,ctrans,frame,ratio,time){
	var pathData="M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1775 544 -1620 145 -1551 -32 -1418 -106 -1062 -303 -1343 311 -1519 695 -1822 969 L -1834 1109 Q -1868 1622 -1845 2137 L -1840 2275";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape28(ctx,ctrans,frame,ratio,time){
	var pathData="M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1775 544 -1620 145 -1551 -32 -1418 -106 -1062 -303 -1343 311 -1519 695 -1822 969 L -1834 1109 Q -1868 1622 -1845 2137 L -1838 2367 Q -1831 2896 -1898 3418 -1950 3828 -2122 3471 -2326 3046 -2131 2697";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape29(ctx,ctrans,frame,ratio,time){
	var pathData="M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1775 544 -1620 145 -1551 -32 -1418 -106 -1062 -303 -1343 311 -1519 695 -1822 969 L -1834 1109 Q -1868 1622 -1845 2137 L -1838 2367 Q -1564 2130 -1308 1876 M -1885 2407 Q -2415 2860 -2122 3471 -1950 3828 -1898 3418 -1831 2896 -1838 2367 L -1885 2407 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape30(ctx,ctrans,frame,ratio,time){
	var pathData="M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1775 544 -1620 145 -1551 -32 -1418 -106 -1062 -303 -1343 311 -1519 695 -1822 969 L -1834 1109 Q -1868 1622 -1845 2137 L -1838 2367 Q -1415 2002 -1036 1595 -815 1359 -659 1086 -515 834 -425 550 -302 161 -314 -245 M -1885 2407 Q -2415 2860 -2122 3471 -1950 3828 -1898 3418 -1831 2896 -1838 2367 L -1885 2407 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape31(ctx,ctrans,frame,ratio,time){
	var pathData="M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1775 544 -1620 145 -1551 -32 -1418 -106 -1062 -303 -1343 311 -1519 695 -1822 969 L -1834 1109 Q -1868 1622 -1845 2137 L -1838 2367 Q -1415 2002 -1036 1595 -815 1359 -659 1086 -645 373 -314 -245 -302 161 -425 550 -515 834 -659 1086 -665 1404 -608 1741 L -605 1756 M -1885 2407 Q -2415 2860 -2122 3471 -1950 3828 -1898 3418 -1831 2896 -1838 2367 L -1885 2407 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape32(ctx,ctrans,frame,ratio,time){
	var pathData="M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1775 544 -1620 145 -1551 -32 -1418 -106 -1062 -303 -1343 311 -1519 695 -1822 969 L -1834 1109 Q -1868 1622 -1845 2137 L -1838 2367 Q -1415 2002 -1036 1595 -815 1359 -659 1086 -645 373 -314 -245 -302 161 -425 550 -515 834 -659 1086 -665 1404 -608 1741 -562 2011 -353 1884 -109 1737 -32 1466 M -1885 2407 Q -2415 2860 -2122 3471 -1950 3828 -1898 3418 -1831 2896 -1838 2367 L -1885 2407 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape33(ctx,ctrans,frame,ratio,time){
	var pathData="M 234 1541 Q 198 1333 -32 1466 -196 2087 139 1845 245 1769 240 1611 L 236 1553 235 1546 234 1541 M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1775 544 -1620 145 -1551 -32 -1418 -106 -1062 -303 -1343 311 -1519 695 -1822 969 L -1834 1109 Q -1868 1622 -1845 2137 L -1838 2367 Q -1415 2002 -1036 1595 -815 1359 -659 1086 -645 373 -314 -245 -302 161 -425 550 -515 834 -659 1086 -665 1404 -608 1741 -562 2011 -353 1884 -109 1737 -32 1466 -211 1579 -188 1657 M -1885 2407 Q -2415 2860 -2122 3471 -1950 3828 -1898 3418 -1831 2896 -1838 2367 L -1885 2407 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape34(ctx,ctrans,frame,ratio,time){
	var pathData="M 236 1553 L 235 1546 234 1541 Q 198 1333 -32 1466 -196 2087 139 1845 245 1769 240 1611 L 236 1553 Q 347 2206 580 1722 M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1775 544 -1620 145 -1551 -32 -1418 -106 -1062 -303 -1343 311 -1519 695 -1822 969 L -1834 1109 Q -1868 1622 -1845 2137 L -1838 2367 Q -1415 2002 -1036 1595 -815 1359 -659 1086 -645 373 -314 -245 -302 161 -425 550 -515 834 -659 1086 -665 1404 -608 1741 -562 2011 -353 1884 -109 1737 -32 1466 -211 1579 -188 1657 M -1885 2407 Q -2415 2860 -2122 3471 -1950 3828 -1898 3418 -1831 2896 -1838 2367 L -1885 2407 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape35(ctx,ctrans,frame,ratio,time){
	var pathData="M 236 1553 L 235 1546 234 1541 Q 198 1333 -32 1466 -196 2087 139 1845 245 1769 240 1611 L 236 1553 Q 358 2272 628 1611 912 1642 1049 2018 M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1775 544 -1620 145 -1551 -32 -1418 -106 -1062 -303 -1343 311 -1519 695 -1822 969 L -1834 1109 Q -1868 1622 -1845 2137 L -1838 2367 Q -1415 2002 -1036 1595 -815 1359 -659 1086 -645 373 -314 -245 -302 161 -425 550 -515 834 -659 1086 -665 1404 -608 1741 -562 2011 -353 1884 -109 1737 -32 1466 -211 1579 -188 1657 M -1885 2407 Q -2415 2860 -2122 3471 -1950 3828 -1898 3418 -1831 2896 -1838 2367 L -1885 2407 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape36(ctx,ctrans,frame,ratio,time){
	var pathData="M 1535 279 L 1532 415 M 236 1553 L 235 1546 234 1541 Q 198 1333 -32 1466 -196 2087 139 1845 245 1769 240 1611 L 236 1553 Q 358 2272 628 1611 876 1638 1012 1928 M 1000 2068 Q 764 2043 720 1885 M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1775 544 -1620 145 -1551 -32 -1418 -106 -1062 -303 -1343 311 -1519 695 -1822 969 L -1834 1109 Q -1868 1622 -1845 2137 L -1838 2367 Q -1415 2002 -1036 1595 -815 1359 -659 1086 -645 373 -314 -245 -302 161 -425 550 -515 834 -659 1086 -665 1404 -608 1741 -562 2011 -353 1884 -109 1737 -32 1466 -211 1579 -188 1657 M -1885 2407 Q -2415 2860 -2122 3471 -1950 3828 -1898 3418 -1831 2896 -1838 2367 L -1885 2407 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape37(ctx,ctrans,frame,ratio,time){
	var pathData="M 236 1553 L 235 1546 234 1541 Q 198 1333 -32 1466 -196 2087 139 1845 245 1769 240 1611 L 236 1553 Q 358 2272 628 1611 932 1644 1067 2072 770 2064 720 1885 M 1535 279 Q 1530 659 1486 1037 M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1775 544 -1620 145 -1551 -32 -1418 -106 -1062 -303 -1343 311 -1519 695 -1822 969 L -1834 1109 Q -1868 1622 -1845 2137 L -1838 2367 Q -1415 2002 -1036 1595 -815 1359 -659 1086 -645 373 -314 -245 -302 161 -425 550 -515 834 -659 1086 -665 1404 -608 1741 -562 2011 -353 1884 -109 1737 -32 1466 -211 1579 -188 1657 M -1885 2407 Q -2415 2860 -2122 3471 -1950 3828 -1898 3418 -1831 2896 -1838 2367 L -1885 2407 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape38(ctx,ctrans,frame,ratio,time){
	var pathData="M 236 1553 L 235 1546 234 1541 Q 198 1333 -32 1466 -196 2087 139 1845 245 1769 240 1611 L 236 1553 Q 358 2272 628 1611 932 1644 1067 2072 770 2064 720 1885 M 1535 279 Q 1527 852 1432 1419 1377 1741 1347 2062 M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1775 544 -1620 145 -1551 -32 -1418 -106 -1062 -303 -1343 311 -1519 695 -1822 969 L -1834 1109 Q -1868 1622 -1845 2137 L -1838 2367 Q -1415 2002 -1036 1595 -815 1359 -659 1086 -645 373 -314 -245 -302 161 -425 550 -515 834 -659 1086 -665 1404 -608 1741 -562 2011 -353 1884 -109 1737 -32 1466 -211 1579 -188 1657 M -1885 2407 Q -2415 2860 -2122 3471 -1950 3828 -1898 3418 -1831 2896 -1838 2367 L -1885 2407 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape39(ctx,ctrans,frame,ratio,time){
	var pathData="M 1535 279 Q 1527 852 1432 1419 1377 1741 1347 2062 1401 1777 1701 1746 1859 1729 1903 1907 M 236 1553 L 235 1546 234 1541 Q 198 1333 -32 1466 -196 2087 139 1845 245 1769 240 1611 L 236 1553 Q 358 2272 628 1611 932 1644 1067 2072 770 2064 720 1885 M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1775 544 -1620 145 -1551 -32 -1418 -106 -1062 -303 -1343 311 -1519 695 -1822 969 L -1834 1109 Q -1868 1622 -1845 2137 L -1838 2367 Q -1415 2002 -1036 1595 -815 1359 -659 1086 -645 373 -314 -245 -302 161 -425 550 -515 834 -659 1086 -665 1404 -608 1741 -562 2011 -353 1884 -109 1737 -32 1466 -211 1579 -188 1657 M -1885 2407 Q -2415 2860 -2122 3471 -1950 3828 -1898 3418 -1831 2896 -1838 2367 L -1885 2407 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape40(ctx,ctrans,frame,ratio,time){
	var pathData="M 1535 279 Q 1527 852 1432 1419 1377 1741 1347 2062 1401 1777 1701 1746 1879 1727 1912 1956 1989 2485 2358 2331 M 236 1553 L 235 1546 234 1541 Q 198 1333 -32 1466 -196 2087 139 1845 245 1769 240 1611 L 236 1553 Q 358 2272 628 1611 932 1644 1067 2072 770 2064 720 1885 M -3352 1425 Q -2731 1550 -2182 1231 -1984 1116 -1822 969 -1775 544 -1620 145 -1551 -32 -1418 -106 -1062 -303 -1343 311 -1519 695 -1822 969 L -1834 1109 Q -1868 1622 -1845 2137 L -1838 2367 Q -1415 2002 -1036 1595 -815 1359 -659 1086 -645 373 -314 -245 -302 161 -425 550 -515 834 -659 1086 -665 1404 -608 1741 -562 2011 -353 1884 -109 1737 -32 1466 -211 1579 -188 1657 M -1885 2407 Q -2415 2860 -2122 3471 -1950 3828 -1898 3418 -1831 2896 -1838 2367 L -1885 2407 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape41(ctx,ctrans,frame,ratio,time){
	var pathData="M -429 -159 Q -588 149 -634 497 -679 826 -704 1157 L -706 1202 Q -539 1025 -395 828 -188 546 -129 195 -66 -182 -316 -225 -389 -237 -429 -159 M -1246 291 Q -1090 -171 -1412 -187 -1718 88 -1810 389 -1911 720 -1903 1065 L -1901 1152 Q -1722 1037 -1579 873 -1355 616 -1246 291 M -1901 1152 Q -1895 1445 -1895 1738 -1895 2015 -1871 2289 L -1869 2287 -1347 1807 -849 1344 -706 1202 Q -722 1529 -584 1807 -540 1896 -431 1867 -159 1797 -30 1560 L -15 1516 Q -111 1567 -156 1648 M -3352 1441 Q -3120 1466 -2761 1433 -2434 1402 -2130 1273 -2009 1222 -1901 1152 M -1871 2289 Q -2130 2531 -2192 2891 -2252 3243 -2063 3600 -1844 3453 -1830 3126 -1816 2790 -1855 2452 L -1871 2289 M 1536 280 Q 1532 566 1504 897 1477 1213 1439 1531 1397 1887 1333 2217 1363 2128 1453 1940 1514 1811 1645 1767 1772 1724 1795 1890 1840 2221 2078 2370 2161 2422 2257 2355 2440 2228 2601 2072 M -30 1560 Q -161 1946 124 1831 225 1791 231 1672 L 232 1658 220 1591 M -15 1516 Q 246 1297 232 1658 321 2104 587 1739 665 1632 658 1498 L 1033 2034 Q 834 2074 784 1913";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape42(ctx,ctrans,frame,ratio,time){
	var pathData="M 1551 283 Q 1545 549 1515 917 L 1461 1582 Q 1440 1845 1426 2108 1453 1982 1590 1812 1669 1713 1755 1787 1970 1972 2046 2266 2125 2572 2372 2379 L 2789 2043 M 256 1585 Q 171 1288 -15 1532 -216 2032 150 1836 304 1754 256 1585 M 282 1649 Q 407 2116 630 1666 681 1562 643 1464 845 1670 999 1932 1144 2178 940 2079 824 2022 752 1923 M -252 206 Q -150 -177 -421 -162 -621 247 -665 599 -697 854 -718 1111 -622 978 -534 841 -342 544 -252 206 M -1255 223 Q -1093 -263 -1500 -78 -1574 -44 -1615 39 -1767 354 -1831 700 -1859 852 -1873 1006 -1728 901 -1599 773 -1358 534 -1255 223 M -1873 1006 Q -1891 1192 -1889 1381 -1886 1738 -1842 2090 -1824 2228 -1815 2367 L -1390 1915 Q -1157 1669 -942 1403 -825 1259 -718 1111 -725 1195 -690 1566 -655 1937 -467 1911 -279 1884 -108 1641 M -156 1679 Q -137 1571 -15 1532 M -3337 1444 Q -3106 1560 -2713 1424 -2409 1319 -2128 1166 -1995 1094 -1873 1006 M -1815 2367 L -1878 2433 Q -1993 2556 -2064 2706 -2215 3020 -2170 3358 -2115 3771 -1979 3487 -1823 3161 -1810 2802 -1802 2583 -1815 2367 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape43(ctx,ctrans,frame,ratio,time){
	var pathData="M -421 -77 Q -527 81 -568 272 -637 595 -689 923 -707 1040 -712 1157 -520 934 -384 669 -223 354 -223 -6 -224 -370 -421 -77 M -203 1623 Q -148 1518 -31 1529 295 1270 257 1694 L 254 1720 Q 410 2095 578 1637 858 1698 1031 2029 1104 2167 935 2093 769 2020 674 1862 M -82 1653 Q -589 2052 -675 1620 -721 1389 -712 1157 L -783 1235 Q -1016 1482 -1236 1739 -1460 2001 -1710 2239 -1813 2337 -1902 2447 -1875 2674 -1857 2902 -1827 3271 -2049 3559 -2141 3678 -2207 3428 -2296 3096 -2127 2784 -2029 2604 -1902 2447 L -1929 2229 Q -1974 1885 -1975 1535 -1976 1296 -1945 1060 -2046 1127 -2158 1180 -2432 1310 -2720 1403 -3067 1516 -3368 1391 M -1919 887 L -1945 1060 Q -1773 942 -1638 781 -1408 508 -1295 167 -1172 -204 -1483 -69 -1676 15 -1749 228 -1859 551 -1919 887 M 1536 295 L 1505 851 Q 1488 1162 1458 1472 1423 1827 1345 2172 1405 2021 1519 1842 1585 1737 1698 1770 1933 1841 1944 2136 1958 2512 2291 2325 2476 2220 2601 2087 M -31 1529 Q -224 2032 153 1853 236 1814 254 1720 L 235 1672";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=4.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function sprite44(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 27;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape22",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("shape23",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 2:
			place("shape24",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 3:
			place("shape25",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 4:
			place("shape26",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 5:
			place("shape27",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 6:
			place("shape28",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 7:
			place("shape29",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 8:
			place("shape30",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 9:
			place("shape31",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 10:
			place("shape32",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 11:
			place("shape33",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 12:
			place("shape34",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 13:
			place("shape35",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 14:
			place("shape36",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 15:
			place("shape37",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 16:
			place("shape38",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 17:
			place("shape39",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 18:
			place("shape40",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 19:
			place("shape41",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 20:
			place("shape41",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 21:
			place("shape42",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 22:
			place("shape42",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 23:
			place("shape43",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 24:
			place("shape43",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 25:
			place("shape42",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 26:
			place("shape42",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function button46(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 4;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			break;
	}
}

function shape47(ctx,ctrans,frame,ratio,time){
	var pathData="M -838 3313 L -837 3315 -839 3316 -838 3313";
	ctx.fillStyle=tocolor(ctrans.apply([153,153,102,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 216 -1799 Q 298 -1685 188 -1721 130 -1806 216 -1799 M 151 -1636 Q 172 -1601 109 -1540 111 -1509 80 -1497 64 -1511 43 -1512 L 42 -1512 Q 32 -1553 66 -1590 64 -1641 102 -1667 130 -1658 144 -1645 L 151 -1636 M 231 -1935 Q 348 -1886 245 -1863 163 -1891 203 -1951 L 231 -1935";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 160 -1641 L 151 -1636 153 -1643 160 -1641";
	ctx.fillStyle=tocolor(ctrans.apply([213,83,4,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -926 -1878 Q -918 -2010 -915 -2143 -912 -2272 -914 -2402 -917 -2539 -908 -2675 -900 -2808 -899 -2941 -897 -3067 -885 -3209 -834 -3271 -811 -3308 -779 -3382 -713 -3432 L -544 -3565 -530 -3573 Q -395 -3647 -265 -3682 L -243 -3687 -217 -3693 Q -106 -3713 8 -3696 L 160 -3598 232 -3553 301 -3505 Q 379 -3447 439 -3379 437 -3279 438 -3135 L 437 -2876 Q 436 -2750 444 -2625 L 460 -2359 Q 468 -2227 463 -2093 L 461 -1971 324 -1957 Q 319 -1981 301 -1992 L 297 -1994 Q 209 -2033 203 -1951 L 160 -1977 73 -2028 Q 62 -2168 73 -2292 L 160 -2300 Q 202 -2314 241 -2344 L 301 -2556 311 -2594 Q 341 -2720 353 -2848 367 -2882 365 -2913 363 -2952 335 -2987 L 301 -3031 Q 236 -3116 177 -3203 L 160 -3228 Q 97 -3325 44 -3437 -54 -3344 -139 -3239 L -217 -3130 -243 -3087 -281 -3017 -282 -3015 -314 -2942 Q -344 -2868 -363 -2789 -393 -2659 -390 -2524 L -388 -2444 -382 -2251 Q -376 -2115 -380 -1978 L -355 -1887 -293 -1687 Q -264 -1592 -243 -1490 L -238 -1467 -234 -1448 -217 -1471 Q -138 -1565 -35 -1497 L -18 -1485 24 -1440 Q 38 -1417 44 -1389 -79 -1468 -134 -1318 L -140 -1290 Q -142 -1253 -99 -1234 -6 -1194 30 -1288 88 -1141 -68 -1093 -155 -1066 -199 -1123 L -196 -872 Q -198 -747 -215 -607 L -217 -596 Q -227 -517 -243 -441 L -267 -338 Q -301 -209 -325 -154 L -326 -153 -325 -153 -323 -153 Q -273 -154 -243 -130 -227 -118 -217 -99 -193 -57 -196 19 -198 74 -217 120 -227 144 -243 165 -271 203 -315 232 -441 314 -494 158 -535 37 -512 -89 -487 -222 -443 -349 -400 -473 -409 -606 -417 -723 -436 -828 L -441 -856 -466 -1045 Q -480 -1178 -507 -1309 L -530 -1409 Q -551 -1490 -581 -1569 -627 -1690 -695 -1800 -764 -1913 -926 -1878 M 88 1683 L -14 1678 Q -44 1545 -83 1412 L -121 1269 152 1248 Q 144 1363 112 1500 90 1595 88 1683";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 24 -1440 L -18 -1485 -35 -1497 Q 24 -1523 42 -1512 L 43 -1512 48 -1496 Q 47 -1477 24 -1440 M 203 -1951 Q 209 -2033 297 -1994 L 301 -1992 Q 319 -1981 324 -1957 L 301 -1942 233 -1938 Q 218 -1943 203 -1951 M 245 -1863 Q 312 -1776 216 -1799 165 -1858 245 -1863 M 188 -1721 Q 232 -1629 160 -1641 L 153 -1643 144 -1645 Q 115 -1725 160 -1725 L 188 -1721 M 596 -980 Q 545 -950 511 -965 410 -1058 525 -1109 653 -1116 596 -980 M -737 -809 Q -828 -914 -703 -951 -661 -971 -625 -928 -589 -873 -622 -827 -685 -770 -737 -809";
	ctx.fillStyle=tocolor(ctrans.apply([0,153,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 461 -1971 Q 593 -1945 721 -1906 L 735 -1901 Q 846 -1866 935 -1820 968 -1748 983 -1682 978 -1617 1008 -1563 989 -1475 987 -1346 L 985 -1094 982 -829 Q 979 -701 1015 -491 1050 -281 1076 -171 L 1081 -143 Q 1087 -98 1081 -30 1073 66 1040 207 1016 336 977 467 L 944 580 998 655 1027 692 1081 775 1111 829 Q 1150 905 1196 976 L 1256 1062 1279 1094 Q 1343 1187 1402 1305 1462 1393 1509 1499 L 1516 1515 Q 1521 1618 1513 1736 L 1509 1808 Q 1505 1883 1504 1959 1501 2093 1483 2225 L 1443 2485 1403 2714 Q 1379 2849 1336 2980 L 1279 3161 1266 3202 1242 3278 1196 3421 1188 3445 1101 3704 Q 1095 3671 1081 3642 1058 3595 1011 3560 905 3481 779 3495 L 735 3505 727 3500 735 3485 771 3418 Q 833 3301 855 3167 877 3033 876 2893 875 2762 855 2635 835 2507 792 2383 L 735 2240 690 2146 631 2042 Q 596 1987 557 1935 476 1827 363 1757 L 314 1731 301 1725 Q 230 1693 160 1693 L 145 1693 88 1683 Q 90 1595 112 1500 144 1363 152 1248 L -121 1269 -83 1412 Q -44 1545 -14 1678 L -57 1681 Q -146 1692 -217 1736 L -218 1736 -243 1752 Q -351 1820 -415 1882 L -436 1904 -530 2016 -586 2091 Q -641 2167 -690 2249 L -722 2302 Q -787 2413 -832 2534 -876 2657 -888 2786 -900 2918 -884 3051 -868 3183 -838 3313 L -839 3316 Q -939 3263 -991 3348 -1007 3374 -1019 3415 -1040 3489 -1027 3548 L -1048 3540 Q -1097 3523 -1137 3528 -1185 3532 -1221 3568 L -1254 3610 Q -1271 3588 -1314 3586 -1321 3502 -1334 3425 L -1377 3174 -1425 2928 -1431 2900 Q -1458 2772 -1472 2641 -1486 2509 -1507 2376 -1524 2258 -1515 2138 L -1499 1909 Q -1491 1795 -1472 1679 -1472 1649 -1465 1621 -1455 1583 -1425 1528 L -1409 1500 -1270 1313 -1221 1251 -1137 1155 -1104 1120 -1048 1062 -991 1001 -919 924 -956 772 -991 632 -1048 400 -1106 156 Q -1098 21 -1100 -117 L -1099 -376 Q -1097 -498 -1101 -620 L -1115 -892 Q -1124 -1015 -1136 -1130 L -1137 -1134 Q -1149 -1183 -1171 -1238 -1203 -1333 -1192 -1473 L -1137 -1481 -1133 -1483 Q -1079 -1503 -1048 -1537 -996 -1595 -1011 -1692 -1018 -1739 -1048 -1771 L -1084 -1801 -1048 -1823 -991 -1852 -926 -1878 Q -764 -1913 -695 -1800 -627 -1690 -581 -1569 -551 -1490 -530 -1409 L -507 -1309 Q -480 -1178 -466 -1045 L -441 -856 -436 -828 Q -417 -723 -409 -606 -400 -473 -443 -349 -487 -222 -512 -89 -535 37 -494 158 -441 314 -315 232 -271 203 -243 165 -227 144 -217 120 -198 74 -196 19 -193 -57 -217 -99 -227 -118 -243 -130 -273 -154 -323 -153 L -325 -154 Q -301 -209 -267 -338 L -243 -441 Q -227 -517 -217 -596 L -215 -607 Q -198 -747 -196 -872 L -199 -1123 Q -155 -1066 -68 -1093 88 -1141 30 -1288 -6 -1194 -99 -1234 -142 -1253 -140 -1290 L -134 -1318 Q -79 -1468 44 -1389 38 -1417 24 -1440 47 -1477 48 -1496 L 43 -1512 Q 64 -1511 80 -1497 111 -1509 109 -1540 172 -1601 151 -1636 L 160 -1641 Q 232 -1629 188 -1721 298 -1685 216 -1799 312 -1776 245 -1863 348 -1886 231 -1935 L 233 -1938 301 -1942 324 -1957 461 -1971 M -35 -1497 Q -138 -1565 -217 -1471 L -234 -1448 -238 -1467 -243 -1490 Q -264 -1592 -293 -1687 L -355 -1887 -380 -1978 Q -376 -2115 -382 -2251 L -388 -2444 -390 -2524 Q -393 -2659 -363 -2789 -344 -2868 -314 -2942 L -243 -2929 -217 -2927 Q -109 -2921 -28 -2963 -110 -3026 -217 -3023 L -243 -3021 -281 -3015 -281 -3017 -243 -3087 -217 -3130 -139 -3239 Q -54 -3344 44 -3437 97 -3325 160 -3228 L 177 -3203 Q 236 -3116 301 -3031 L 335 -2987 Q 363 -2952 365 -2913 367 -2882 353 -2848 341 -2720 311 -2594 L 301 -2556 241 -2344 Q 202 -2314 160 -2300 L 73 -2292 Q 62 -2168 73 -2028 L 160 -1977 203 -1951 Q 163 -1891 245 -1863 165 -1858 216 -1799 130 -1806 188 -1721 L 160 -1725 Q 115 -1725 144 -1645 130 -1658 102 -1667 64 -1641 66 -1590 32 -1553 42 -1512 24 -1523 -35 -1497 M 365 -2913 Q 334 -2933 301 -2944 L 160 -2950 152 -2949 Q 150 -2927 160 -2913 172 -2897 202 -2892 L 301 -2887 Q 331 -2895 365 -2913 M 160 -2585 L 141 -2596 Q 23 -2656 -100 -2596 14 -2559 160 -2543 L 209 -2539 Q 189 -2566 160 -2585 M 596 -980 Q 653 -1116 525 -1109 410 -1058 511 -965 545 -950 596 -980 M -737 -809 Q -685 -770 -622 -827 -589 -873 -625 -928 -661 -971 -703 -951 -828 -914 -737 -809 M -689 -405 L -707 -175 Q -715 -49 -711 77 -661 440 -612 687 -619 494 -616 429 -611 347 -616 278 L -620 238 -621 227 -636 84 -661 -182 Q -672 -317 -689 -405";
	ctx.fillStyle=tocolor(ctrans.apply([51,51,51,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 160 -2585 Q 189 -2566 209 -2539 L 160 -2543 Q 14 -2559 -100 -2596 23 -2656 141 -2596 L 160 -2585";
	ctx.fillStyle=tocolor(ctrans.apply([96,96,96,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -314 -2942 L -282 -3015 -281 -3015 -243 -3021 -217 -3023 Q -110 -3026 -28 -2963 -109 -2921 -217 -2927 L -243 -2929 -314 -2942 M 365 -2913 Q 331 -2895 301 -2887 L 202 -2892 Q 172 -2897 160 -2913 150 -2927 152 -2949 L 160 -2950 301 -2944 Q 334 -2933 365 -2913";
	ctx.fillStyle=tocolor(ctrans.apply([39,39,39,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite48(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 20;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 1:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-242,256,256,256,256)),1,0,0,time);
			break;
		case 2:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-228,256,256,256,256)),1,0,0,time);
			break;
		case 3:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-215,256,256,256,256)),1,0,0,time);
			break;
		case 4:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-201,256,256,256,256)),1,0,0,time);
			break;
		case 5:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-188,256,256,256,256)),1,0,0,time);
			break;
		case 6:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-174,256,256,256,256)),1,0,0,time);
			break;
		case 7:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-161,256,256,256,256)),1,0,0,time);
			break;
		case 8:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-148,256,256,256,256)),1,0,0,time);
			break;
		case 9:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-134,256,256,256,256)),1,0,0,time);
			break;
		case 10:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-121,256,256,256,256)),1,0,0,time);
			break;
		case 11:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-107,256,256,256,256)),1,0,0,time);
			break;
		case 12:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-94,256,256,256,256)),1,0,0,time);
			break;
		case 13:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-81,256,256,256,256)),1,0,0,time);
			break;
		case 14:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-67,256,256,256,256)),1,0,0,time);
			break;
		case 15:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-54,256,256,256,256)),1,0,0,time);
			break;
		case 16:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-40,256,256,256,256)),1,0,0,time);
			break;
		case 17:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-27,256,256,256,256)),1,0,0,time);
			break;
		case 18:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-13,256,256,256,256)),1,0,0,time);
			break;
		case 19:
			place("shape47",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
	}
}

function shape49(ctx,ctrans,frame,ratio,time){
	var pathData="M 3173 -10401 Q 4241 -9880 4269 -8656 L 4280 -7975 Q 5278 -8569 5904 -7663 6073 -7420 6052 -7120 6034 -6855 5985 -6597 L 6301 -6562 Q 6645 -6249 6591 -5781 6579 -5678 6570 -5567 6505 -5793 6407 -6087 6361 -6228 6281 -6353 6031 -6379 5757 -6353 5767 -6946 5566 -7486 5509 -7637 5355 -7714 4524 -7724 4089 -7051 4034 -7033 3978 -7033 3900 -7033 3821 -7051 3672 -7464 3784 -7953 3859 -8283 3843 -8622 3807 -9364 3189 -9734 2852 -9936 2533 -9696 1455 -8886 782 -7701 454 -7122 256 -6492 256 -6483 260 -6481 292 -6457 328 -6440 482 -6128 145 -6119 54 -6117 -36 -6143 83 -7328 782 -8368 1119 -8870 1507 -9333 1962 -9876 2548 -10278 2889 -10327 3173 -10401 M 4765 3035 Q 4632 1753 5319 630 5332 609 5351 592 5826 584 5848 1131 5883 1972 5755 2807 5634 3594 5195 4211 5112 4328 4985 4378 4631 4306 4413 4012 3856 2332 4320 594 4744 -992 5969 -2047 6175 -2224 6405 -2305 L 6514 -2287 Q 6958 -1616 6918 -767 6834 1010 6498 2746 6244 4058 5461 5113 5042 5677 4346 5848 3732 5999 3322 6424 3233 6516 3200 6650 2974 7554 3450 8310 3490 8374 3549 8426 4317 8449 4750 7737 5119 7128 5216 6420 L 5229 6411 5289 6420 Q 5295 7928 4039 8742 3670 8982 3360 8673 2923 8238 2846 7595 2732 6647 3318 5940 3542 5670 3908 5606 5000 5414 5540 4472 5721 4157 5838 3809 6327 2354 6540 843 6731 -518 6449 -1833 5401 -1316 4928 -179 4212 1542 4498 3354 4585 3909 5034 3876 5088 3872 5117 3810 5718 2510 5496 1099 5487 1045 5471 993 5004 1950 4819 3044 L 4765 3035 M 2301 7247 Q 2073 8867 754 9780 -351 10545 -1646 10367 -2930 10191 -3684 9114 -4601 7805 -4834 6213 -5014 4986 -5088 3751 -5182 2182 -5973 819 -6198 651 -6447 766 -6964 2076 -6557 3429 L -6511 3593 Q -6492 3666 -6540 3733 L -6638 3733 Q -7225 2191 -6599 645 -6569 570 -6523 505 L -6227 417 Q -5569 664 -5337 1396 -5194 1845 -5091 2305 -4711 4011 -4523 5754 -4327 7567 -3099 8879 -2053 9997 -591 9540 1307 8946 1582 7031 1713 6121 1097 5460 -115 5356 -450 6574 -622 7198 -85 7501 384 7382 399 6908 L 328 6856 278 6891 133 6873 Q -92 6465 317 6158 968 6109 978 6838 991 7869 61 8266 -152 8356 -399 8268 -929 8078 -1040 7502 -1388 5682 128 4639 222 4574 334 4526 1511 4015 2025 5185 2453 6163 2301 7247";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,0.5019608]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 3672 -5835 Q 3704 -5812 3740 -5794 4544 -4426 4315 -2806 4128 -1484 3515 -307 3487 -254 3443 -211 L 3347 -246 Q 3329 -272 3320 -301 3313 -324 3314 -350 3802 -1793 3750 -3334 3726 -4057 3396 -4695 3024 -4500 2870 -3983 2417 -2459 2443 -856 3406 477 3247 2132 3162 3018 2550 3645 2102 4105 1481 3907 1414 3835 1342 3781 1165 3648 1132 3436 L 1086 3384 Q 1074 3357 1076 3332 1085 3199 1060 3070 L 1090 3066 Q 1115 3078 1132 3104 L 1230 3131 Q 1448 3171 1625 3296 2440 3235 2551 2430 2674 1538 2331 710 2125 214 1802 -176 1666 -341 1659 -560 1605 -2244 1960 -3867 2082 -4419 2334 -4916 2636 -5511 3181 -5847 L 3668 -5847 Q 3668 -5838 3672 -5835 M 1315 -682 Q 1270 -431 1179 -188 813 799 -135 851 L -168 868 Q 268 2062 237 3350 228 3742 143 4121 132 4144 114 4153 89 4167 57 4167 L -262 1675 Q -295 1414 -377 1165 -414 1051 -428 940 -642 964 -845 940 -1009 1575 -1468 2020 -1568 2116 -1674 2025 -2077 1681 -1839 1154 L -1773 997 -1785 1050 Q -1446 237 -1352 -629 -1434 -450 -1562 385 -1436 -732 -1790 -1252 -2144 -1773 -2431 -1657 -3165 -1640 -3372 -557 -3470 -47 -3382 424 -3187 731 -2857 957 -2320 1325 -2743 1795 -2773 1829 -2817 1852 L -3017 1837 Q -3335 2317 -3268 2912 -3204 3483 -2673 3456 -2558 3353 -2487 3222 -2332 2937 -2464 2639 -2480 2623 -2498 2616 L -2693 2533 -2728 2576 Q -2797 2654 -2816 2760 L -2831 2850 -2804 2897 -2762 2987 -2747 3008 Q -2711 3032 -2669 3047 L -2643 3094 Q -2634 3115 -2630 3138 L -2646 3181 -2675 3229 -2792 3259 Q -2922 3139 -2955 2953 -3019 2591 -2759 2321 L -2633 2321 Q -2055 2642 -2227 3342 -2361 3887 -2883 4044 -2964 4068 -3058 4021 -3646 3730 -3719 3035 -3789 2371 -3542 1761 -4422 973 -4533 -250 -4643 -1464 -4012 -2467 -3582 -3149 -2816 -3216 -2140 -3282 -1786 -2748 -1470 -2270 -1323 -1615 -1346 -2188 -1452 -2736 -1418 -2945 -1258 -3095 L -1208 -3116 -1201 -3123 -1197 -3128 -1193 -3140 -951 -3125 Q -721 -2843 -645 -2490 L -642 -2490 Q -410 -2753 -134 -2959 20 -2959 172 -2966 L 173 -2974 Q 1197 -2936 1377 -1907 1445 -1518 1383 -1130 1371 -1057 1351 -992 1343 -841 1315 -682 M 4819 3044 L 4803 3138 4782 3227 Q 4772 3186 4768 3144 L 4767 3139 Q 4763 3087 4765 3035 L 4819 3044 M 1357 551 Q 1860 774 1793 1369 1726 1958 1196 2190 953 2297 776 2129 377 1749 488 1199 611 588 1191 475 1281 471 1346 537 L 1357 551 M 920 1262 Q 871 1374 922 1489 L 962 1580 1172 1595 Q 1320 1494 1376 1324 L 1395 1277 Q 1335 1044 1094 1126 1019 1171 950 1225 932 1239 920 1262 M -3070 -1878 Q -3445 -1691 -3592 -1146 -3650 -931 -3660 -706 -3574 -1051 -3416 -1374 -3273 -1666 -3070 -1878 M 438 -901 Q -212 -568 -629 101 L -671 167 -547 139 Q -276 82 -22 -38 133 -211 271 -396 439 -620 438 -901";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite50(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 20;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 1:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-242,256,256,256,256)),1,0,0,time);
			break;
		case 2:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-228,256,256,256,256)),1,0,0,time);
			break;
		case 3:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-215,256,256,256,256)),1,0,0,time);
			break;
		case 4:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-201,256,256,256,256)),1,0,0,time);
			break;
		case 5:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-188,256,256,256,256)),1,0,0,time);
			break;
		case 6:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-174,256,256,256,256)),1,0,0,time);
			break;
		case 7:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-161,256,256,256,256)),1,0,0,time);
			break;
		case 8:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-148,256,256,256,256)),1,0,0,time);
			break;
		case 9:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-134,256,256,256,256)),1,0,0,time);
			break;
		case 10:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-121,256,256,256,256)),1,0,0,time);
			break;
		case 11:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-107,256,256,256,256)),1,0,0,time);
			break;
		case 12:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-94,256,256,256,256)),1,0,0,time);
			break;
		case 13:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-81,256,256,256,256)),1,0,0,time);
			break;
		case 14:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-67,256,256,256,256)),1,0,0,time);
			break;
		case 15:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-54,256,256,256,256)),1,0,0,time);
			break;
		case 16:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-40,256,256,256,256)),1,0,0,time);
			break;
		case 17:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-27,256,256,256,256)),1,0,0,time);
			break;
		case 18:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,-13,256,256,256,256)),1,0,0,time);
			break;
		case 19:
			place("shape49",canvas,ctx,[1.0,0.0,0.0,1.0,-482.0,-7676.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
	}
}

function button52(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 4;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			break;
	}
}

function shape53(ctx,ctrans,frame,ratio,time){
	var pathData="M 651 810 Q 633 843 628 889 573 846 528 926 502 972 467 1009 361 831 508 799 579 784 651 810 M 169 -782 L 192 -753 Q 286 -647 307 -513 315 -461 276 -445 200 -412 169 -467 152 -496 149 -550 142 -665 145 -781 L 146 -822 169 -782 M 747 402 Q 784 334 793 421 787 552 744 636 L 720 676 685 658 Q 697 674 670 659 L 672 654 Q 703 532 744 411 L 747 402 M 167 853 Q 61 690 169 740 L 204 758 Q 258 789 275 845 285 880 297 903 240 964 169 856 L 167 853 M 512 535 Q 545 406 570 349 628 485 571 647 554 698 520 701 479 664 512 535";
	ctx.fillStyle=tocolor(ctrans.apply([0,153,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 467 1009 Q 414 1064 340 1097 L 310 1093 232 1085 169 1082 5 1094 2 1095 Q -48 973 -179 939 L -208 933 -234 930 Q -329 922 -413 974 -457 939 -521 961 L -528 963 Q -556 974 -580 988 -652 916 -712 817 L -726 794 Q -796 674 -828 543 L -828 541 -829 539 Q -859 409 -875 277 -891 144 -879 12 -867 -117 -823 -240 -778 -361 -713 -472 L -681 -525 -577 -683 -521 -758 -427 -870 -406 -892 Q -342 -954 -234 -1022 L -209 -1038 -208 -1038 Q -137 -1082 -48 -1093 L -5 -1096 97 -1091 154 -1081 169 -1081 Q 239 -1081 310 -1049 L 323 -1043 372 -1017 Q 485 -947 566 -839 L 640 -732 699 -628 744 -534 801 -391 Q 844 -267 864 -139 884 -12 885 119 886 259 864 393 842 527 780 644 L 744 711 736 726 730 736 Q 677 758 651 810 579 784 508 799 361 831 467 1009 M 176 -302 Q 63 -321 -49 -277 -129 -246 -193 -192 L -219 -169 -257 -130 Q -345 -31 -382 101 -419 230 -415 366 -412 464 -383 557 -344 686 -252 787 L -219 818 -193 836 Q -114 881 -40 812 -114 881 -193 836 L -219 818 -252 787 Q -344 686 -383 557 -412 464 -415 366 -419 230 -382 101 -345 -31 -257 -130 L -219 -169 -193 -192 Q -129 -246 -49 -277 63 -321 176 -302 M -521 733 Q -560 678 -577 609 -609 476 -607 337 -606 207 -562 84 -539 20 -506 -38 L -434 -143 Q -346 -250 -222 -306 L -219 -307 -193 -318 Q -89 -361 10 -367 6 -468 20 -568 38 -690 75 -805 38 -690 20 -568 6 -468 10 -367 -89 -361 -193 -318 L -219 -307 -222 -306 Q -346 -250 -434 -143 L -506 -38 Q -539 20 -562 84 -606 207 -607 337 -609 476 -577 609 -560 678 -521 733 M 169 -782 L 146 -822 145 -781 Q 142 -665 149 -550 152 -496 169 -467 200 -412 276 -445 315 -461 307 -513 286 -647 192 -753 L 169 -782 M 286 -774 L 325 -714 Q 397 -593 420 -453 473 -488 560 -467 696 -435 730 -290 759 -164 741 -35 723 93 633 184 513 305 445 157 389 32 443 -96 468 -155 527 -150 619 -142 591 -41 545 121 492 -22 545 121 591 -41 619 -142 527 -150 468 -155 443 -96 389 32 445 157 513 305 633 184 723 93 741 -35 759 -164 730 -290 696 -435 560 -467 473 -488 420 -453 397 -593 325 -714 L 286 -774 M 747 402 L 744 411 Q 703 532 672 654 L 670 659 Q 697 674 685 658 L 720 676 744 636 Q 787 552 793 421 784 334 747 402 M 512 535 Q 479 664 520 701 554 698 571 647 628 485 570 349 545 406 512 535 M 167 853 L 169 856 Q 240 964 297 903 285 880 275 845 258 789 204 758 L 169 740 Q 61 690 167 853";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([51,51,51,1]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.09124755859375,0,0,0.09124755859375,176,-302);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.0,tocolor(ctrans.apply([101,108,125,1])));
	grd.addColorStop(1.0,tocolor(ctrans.apply([51,51,51,1])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M 75 -805 Q 38 -690 20 -568 6 -468 10 -367 -89 -361 -193 -318 L -219 -307 -222 -306 Q -346 -250 -434 -143 L -506 -38 Q -539 20 -562 84 -606 207 -607 337 -609 476 -577 609 -560 678 -521 733 M -40 812 Q -114 881 -193 836 L -219 818 -252 787 Q -344 686 -383 557 -412 464 -415 366 -419 230 -382 101 -345 -31 -257 -130 L -219 -169 -193 -192 Q -129 -246 -49 -277 63 -321 176 -302 M 492 -22 Q 545 121 591 -41 619 -142 527 -150 468 -155 443 -96 389 32 445 157 513 305 633 184 723 93 741 -35 759 -164 730 -290 696 -435 560 -467 473 -488 420 -453 397 -593 325 -714 L 286 -774";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([102,102,102,1]));
	ctx.lineWidth=1.5;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

	var pathData="M -233 932 L -207 935 -178 941 Q -47 975 3 1097 L 9 1112 7 1096 170 1084 233 1087 311 1095 341 1099 Q 415 1066 468 1011 503 974 529 928 574 848 629 891 634 845 652 812 678 760 731 738 L 745 733 789 723 Q 915 709 1021 788 1068 823 1091 870 1105 899 1111 932 L 1198 673 1206 649 1252 506 1289 504 Q 1407 507 1424 652 1437 761 1347 819 1463 933 1422 1096 1397 1195 1312 1234 1350 1335 1289 1417 L 1270 1439 Q 1212 1500 1234 1529 1267 1573 1289 1623 1322 1696 1330 1782 1339 1876 1295 1935 L 1294 1934 1289 1932 Q 1256 1913 1206 1910 L 1201 1910 1201 1908 1200 1910 1176 1950 Q 1139 2002 1091 2041 1036 2085 967 2112 857 2154 745 2133 L 696 2121 Q 562 2080 468 1971 382 1871 402 1738 411 1664 357 1657 345 1614 311 1600 L 284 1592 170 1580 11 1575 -207 1590 -233 1593 -252 1596 Q -265 1631 -265 1653 L -289 1647 Q -329 1686 -299 1702 L -381 1828 -472 1948 -520 1952 -595 1950 Q -681 1942 -780 1999 L -828 2023 Q -672 2286 -939 2364 -953 2255 -952 2217 L -981 2215 -1038 2211 -1127 2199 -1132 2198 Q -1177 2186 -1211 2170 -1327 2113 -1304 1997 -1403 1942 -1393 1817 -1381 1674 -1261 1609 -1351 1620 -1415 1576 -1455 1549 -1485 1502 -1553 1396 -1562 1271 -1572 1128 -1469 1049 -1507 1021 -1501 962 -1489 865 -1415 832 -1394 822 -1368 818 L -1304 814 Q -1261 816 -1244 838 L -1211 796 Q -1175 760 -1127 756 -1087 751 -1038 768 L -1017 776 Q -1030 717 -1009 643 -997 602 -981 576 -929 491 -829 544 L -827 545 Q -795 676 -725 796 L -711 819 Q -651 918 -579 990 -555 976 -527 965 L -520 963 Q -456 941 -412 976 -328 924 -233 932 M -963 1665 L -966 1659 -967 1661 -963 1665";
	ctx.fillStyle=tocolor(ctrans.apply([102,102,102,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function character54(ctx,ctrans,frame,ratio,time){
}

function morphshape55(ctx,ctrans,frame,ratio,time){
	var pathData="M -4140 -4140 138 138 Q -4140 -4140 1853 1853 -2927 -2927 3066 3066 -1715 -1715 4278 4278 0 0 4278 4278 1715 1715 4278 4278 2927 2927 3066 3066 4140 4140 1853 1853 4140 4140 138 138 4140 4140 -1577 -1577 2927 2927 -2789 -2789 1715 1715 -4002 -4002 0 0 -4002 -4002 -1715 -1715 -4002 -4002 -2927 -2927 -2789 -2789 -4140 -4140 -1577 -1577 -4140 -4140 138 138";
	drawMorphPath(ctx,pathData,ratio,false);
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(102+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.2560882568359375+ratio*(0)/65535,0.0+ratio*(0)/65535,0.0+ratio*(0)/65535,0.2560882568359375+ratio*(0)/65535,0.0+ratio*(0)/65535,138.0+ratio*(0)/65535);
	var grd=ctx.createRadialGradient(0.0+ratio*(0)/65535,0,0,0,0,16384);
	var s = 0.01568627450980392+ratio*(0.33725490196078434)/65535;
	if(s<0) s = 0;
	if(s>1) s = 1;
	grd.addColorStop(s,tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(102+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)])));
	var s = 0.2627450980392157+ratio*(0.6235294117647059)/65535;
	if(s<0) s = 0;
	if(s>1) s = 1;
	grd.addColorStop(s,tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(102+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(255+ratio*(-255)/65535))/255)])));
	var s = 0.6235294117647059+ratio*(0.3764705882352941)/65535;
	if(s<0) s = 0;
	if(s>1) s = 1;
	grd.addColorStop(s,tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(102+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M -4140 -4140 138 138 Q -4140 -4140 -1577 -1577 -2927 -2927 -2789 -2789 -1715 -1715 -4002 -4002 0 0 -4002 -4002 1715 1715 -4002 -4002 2927 2927 -2789 -2789 4140 4140 -1577 -1577 4140 4140 138 138 4140 4140 1853 1853 2927 2927 3066 3066 1715 1715 4278 4278 0 0 4278 4278 -1715 -1715 4278 4278 -2927 -2927 3066 3066 -4140 -4140 1853 1853 -4140 -4140 138 138 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function shape56(ctx,ctrans,frame,ratio,time){
	var pathData="M 2927 -2789 Q 4140 -1577 4140 138 4140 1853 2927 3066 1715 4278 0 4278 -1715 4278 -2927 3066 -4140 1853 -4140 138 -4140 -1577 -2927 -2789 -1715 -4002 0 -4002 1715 -4002 2927 -2789";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([0,102,255,0.0]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.2560882568359375,0,0,0.2560882568359375,0,138);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.35294117647058826,tocolor(ctrans.apply([0,102,255,0.0])));
	grd.addColorStop(0.8862745098039215,tocolor(ctrans.apply([0,102,255,0.0])));
	grd.addColorStop(1.0,tocolor(ctrans.apply([0,102,255,0.0])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
}

function sprite57(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 50;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,1337,time);
			break;
		case 2:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,2675,time);
			break;
		case 3:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,4012,time);
			break;
		case 4:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,5350,time);
			break;
		case 5:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,6687,time);
			break;
		case 6:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,8025,time);
			break;
		case 7:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,9362,time);
			break;
		case 8:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,10700,time);
			break;
		case 9:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,12037,time);
			break;
		case 10:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,13375,time);
			break;
		case 11:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,14712,time);
			break;
		case 12:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,16050,time);
			break;
		case 13:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,17387,time);
			break;
		case 14:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,18725,time);
			break;
		case 15:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,20062,time);
			break;
		case 16:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21400,time);
			break;
		case 17:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,22737,time);
			break;
		case 18:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,24074,time);
			break;
		case 19:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,25412,time);
			break;
		case 20:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,26749,time);
			break;
		case 21:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,28087,time);
			break;
		case 22:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,29424,time);
			break;
		case 23:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,30762,time);
			break;
		case 24:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,32099,time);
			break;
		case 25:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,33437,time);
			break;
		case 26:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,34774,time);
			break;
		case 27:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,36112,time);
			break;
		case 28:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,37449,time);
			break;
		case 29:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,38787,time);
			break;
		case 30:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,40124,time);
			break;
		case 31:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,41462,time);
			break;
		case 32:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,42799,time);
			break;
		case 33:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,44136,time);
			break;
		case 34:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,45474,time);
			break;
		case 35:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,46811,time);
			break;
		case 36:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,48149,time);
			break;
		case 37:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,49486,time);
			break;
		case 38:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,50824,time);
			break;
		case 39:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,52161,time);
			break;
		case 40:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,53499,time);
			break;
		case 41:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,54836,time);
			break;
		case 42:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,56174,time);
			break;
		case 43:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,57511,time);
			break;
		case 44:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,58849,time);
			break;
		case 45:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,60186,time);
			break;
		case 46:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,61524,time);
			break;
		case 47:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,62861,time);
			break;
		case 48:
			place("morphshape55",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,64199,time);
			break;
		case 49:
			place("shape56",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function sprite58(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 20;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 1:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-242,256,256,256,256)),1,0,0,time);
			break;
		case 2:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-228,256,256,256,256)),1,0,0,time);
			break;
		case 3:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-215,256,256,256,256)),1,0,0,time);
			break;
		case 4:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-201,256,256,256,256)),1,0,0,time);
			break;
		case 5:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-188,256,256,256,256)),1,0,0,time);
			break;
		case 6:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-174,256,256,256,256)),1,0,0,time);
			place("sprite57",canvas,ctx,[0.754364013671875,0.0,0.0,0.9714508056640625,0.0,-162.0],ctrans.merge(new cxform(0,37,60,-28,256,256,256,256)),1,(0+time)%50,6,time);
			break;
		case 7:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-161,256,256,256,256)),1,0,0,time);
			place("sprite57",canvas,ctx,[0.754364013671875,0.0,0.0,0.9714508056640625,0.0,-162.0],ctrans.merge(new cxform(0,37,60,-28,256,256,256,256)),1,(1+time)%50,6,time);
			break;
		case 8:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-147,256,256,256,256)),1,0,0,time);
			place("sprite57",canvas,ctx,[0.754364013671875,0.0,0.0,0.9714508056640625,0.0,-162.0],ctrans.merge(new cxform(0,37,60,-28,256,256,256,256)),1,(2+time)%50,6,time);
			break;
		case 9:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-134,256,256,256,256)),1,0,0,time);
			place("sprite57",canvas,ctx,[0.754364013671875,0.0,0.0,0.9714508056640625,0.0,-162.0],ctrans.merge(new cxform(0,37,60,-28,256,256,256,256)),1,(3+time)%50,6,time);
			break;
		case 10:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-121,256,256,256,256)),1,0,0,time);
			place("sprite57",canvas,ctx,[0.754364013671875,0.0,0.0,0.9714508056640625,0.0,-162.0],ctrans.merge(new cxform(0,37,60,-28,256,256,256,256)),1,(4+time)%50,6,time);
			break;
		case 11:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-107,256,256,256,256)),1,0,0,time);
			place("sprite57",canvas,ctx,[0.754364013671875,0.0,0.0,0.9714508056640625,0.0,-162.0],ctrans.merge(new cxform(0,37,60,-28,256,256,256,256)),1,(5+time)%50,6,time);
			break;
		case 12:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-94,256,256,256,256)),1,0,0,time);
			place("sprite57",canvas,ctx,[0.754364013671875,0.0,0.0,0.9714508056640625,0.0,-162.0],ctrans.merge(new cxform(0,37,60,-28,256,256,256,256)),1,(6+time)%50,6,time);
			break;
		case 13:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-80,256,256,256,256)),1,0,0,time);
			place("sprite57",canvas,ctx,[0.754364013671875,0.0,0.0,0.9714508056640625,0.0,-162.0],ctrans.merge(new cxform(0,37,60,-28,256,256,256,256)),1,(7+time)%50,6,time);
			break;
		case 14:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-67,256,256,256,256)),1,0,0,time);
			place("sprite57",canvas,ctx,[0.754364013671875,0.0,0.0,0.9714508056640625,0.0,-162.0],ctrans.merge(new cxform(0,37,60,-28,256,256,256,256)),1,(8+time)%50,6,time);
			break;
		case 15:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-53,256,256,256,256)),1,0,0,time);
			place("sprite57",canvas,ctx,[0.754364013671875,0.0,0.0,0.9714508056640625,0.0,-162.0],ctrans.merge(new cxform(0,37,60,-28,256,256,256,256)),1,(9+time)%50,6,time);
			break;
		case 16:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-40,256,256,256,256)),1,0,0,time);
			place("sprite57",canvas,ctx,[0.754364013671875,0.0,0.0,0.9714508056640625,0.0,-162.0],ctrans.merge(new cxform(0,37,60,-28,256,256,256,256)),1,(10+time)%50,6,time);
			break;
		case 17:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-26,256,256,256,256)),1,0,0,time);
			place("sprite57",canvas,ctx,[0.754364013671875,0.0,0.0,0.9714508056640625,0.0,-162.0],ctrans.merge(new cxform(0,37,60,-28,256,256,256,256)),1,(11+time)%50,6,time);
			break;
		case 18:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-13,256,256,256,256)),1,0,0,time);
			place("sprite57",canvas,ctx,[0.754364013671875,0.0,0.0,0.9714508056640625,0.0,-162.0],ctrans.merge(new cxform(0,37,60,-28,256,256,256,256)),1,(12+time)%50,6,time);
			break;
		case 19:
			place("shape53",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("sprite57",canvas,ctx,[0.754364013671875,0.0,0.0,0.9714508056640625,0.0,-162.0],ctrans.merge(new cxform(0,37,60,-28,256,256,256,256)),1,(13+time)%50,6,time);
			break;
	}
}

function shape59(ctx,ctrans,frame,ratio,time){
	var pathData="M 794 -11 L 853 -7 Q 896 39 908 104 L 913 159 1394 480 Q 1423 499 1415 534 1398 614 1320 648 1090 747 905 611 877 591 880 554 890 451 994 499 L 1000 510 1009 532 Q 1138 578 1267 528 1089 422 883 314 825 598 546 616 494 619 470 572 399 431 480 285 424 273 351 244 340 454 186 600 168 617 143 622 L 3 639 Q -71 607 -126 551 L -130 529 Q -137 499 -152 473 -235 569 -340 636 -487 674 -570 551 -595 452 -573 351 -563 310 -540 277 -649 267 -769 281 -733 517 -955 618 -1033 653 -1120 639 -1392 488 -1245 234 -1188 134 -1080 129 -961 125 -854 166 -675 184 -503 159 L -451 163 -441 174 -425 196 Q -440 310 -472 421 -484 463 -470 506 L -458 516 -429 536 Q -268 514 -201 359 -184 319 -181 277 L -174 266 -145 233 -96 233 Q -56 318 -43 420 L -30 488 Q 124 588 209 413 273 283 210 166 L 210 155 Q 208 132 213 111 L 214 100 222 89 240 70 247 68 288 70 Q 400 187 572 170 651 287 563 430 538 470 565 510 814 437 767 176 757 121 757 63 L 761 18 769 8 779 -4 794 -9 794 -11 M -2026 -1364 L -1989 -1360 -1978 -1348 -1963 -1327 -1962 -1316 Q -1961 -1299 -1967 -1283 L -1975 -1272 -1985 -1260 Q -1991 -1257 -1996 -1256 L -2033 -1257 -2047 -1269 -2055 -1279 -2058 -1301 -2059 -1334 -2051 -1345 -2041 -1356 -2026 -1362 -2026 -1364 M -1952 -1013 L -1930 -1005 Q -1869 -575 -1796 -142 -1765 43 -1723 225 L -1645 580 Q -1550 526 -1464 458 L -1416 462 -1402 474 -1394 484 Q -1400 556 -1481 598 -1553 636 -1619 687 -1486 1114 -1558 1551 -1562 1575 -1575 1597 -1716 1765 -1882 1601 -2112 1374 -2016 1063 -1942 822 -1741 665 -1837 235 -1917 -199 -1991 -603 -1978 -1005 L -1970 -1008 -1952 -1013 M -1087 212 L -1102 211 Q -1300 372 -1098 521 L -1083 532 Q -873 552 -866 347 -864 304 -895 273 L -1061 240 -1087 212 M -1723 772 Q -1988 1009 -1929 1348 -1900 1515 -1745 1589 -1639 1545 -1636 1412 -1629 1084 -1717 771 L -1723 772";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 362 -1607 Q 623 -1558 593 -1329 715 -1159 619 -956 680 -726 533 -593 480 -330 255 -358 133 -119 -107 -276 -342 -288 -284 -487 -336 -481 -369 -520 -529 -703 -442 -937 -553 -1144 -404 -1276 -456 -1544 -246 -1543 -205 -1782 45 -1791 303 -1867 362 -1607 M 128 -1274 Q 68 -1205 18 -1189 -13 -1074 -101 -1027 L -125 -959 Q 57 -1009 57 -799 62 -1085 256 -1058 129 -1128 128 -1274 M -1070 -1804 Q -1005 -1690 -1092 -1613 -1076 -1548 -1105 -1473 -1099 -1428 -1132 -1369 -1178 -1316 -1216 -1253 -1112 -1258 -1118 -1147 -1028 -1451 -816 -1270 -710 -1189 -816 -1071 -718 -1046 -730 -933 -609 -1002 -556 -874 -527 -855 -552 -792 -638 -580 -710 -725 -776 -653 -827 -657 -810 -590 -862 -499 L -869 -488 Q -789 -273 -996 -198 -1050 -178 -1071 -229 L -1080 -260 -1106 -265 Q -1251 -316 -1173 -489 -1212 -544 -1196 -606 -1258 -624 -1303 -670 -1468 -546 -1494 -735 -1628 -771 -1584 -861 -1599 -901 -1606 -951 L -1608 -995 Q -1630 -1017 -1641 -1056 -1700 -1268 -1559 -1349 -1549 -1400 -1506 -1436 -1528 -1509 -1484 -1547 L -1460 -1582 Q -1437 -1658 -1372 -1701 -1350 -1887 -1212 -1787 -1099 -1848 -1070 -1804";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape60(ctx,ctrans,frame,ratio,time){
	var pathData="M 750 -44 Q 934 215 1219 347 1374 418 1430 559 1442 590 1421 620 1399 653 1359 661 1084 718 883 556 867 543 876 521 L 896 502 938 477 Q 1091 522 1245 532 969 412 772 192 791 378 702 545 657 627 591 691 420 707 381 530 349 387 391 244 L 240 218 Q 263 471 45 583 -8 610 -75 592 -111 583 -134 553 -155 526 -163 492 -239 696 -455 687 -587 557 -558 366 -548 300 -544 233 -664 252 -788 285 -748 458 -868 589 -905 629 -957 653 L -995 673 Q -1274 680 -1323 416 -1334 361 -1316 307 -1262 134 -1069 107 -975 31 -865 140 L -847 159 -448 96 Q -402 206 -439 340 -476 470 -400 573 -265 527 -212 376 -191 317 -200 251 L -195 241 -174 218 -126 218 Q -79 313 -57 428 -48 476 -8 503 L 37 499 Q 139 387 133 233 L 129 133 94 77 Q 83 55 92 33 187 -28 279 76 348 155 468 127 546 109 540 184 537 225 523 264 475 410 532 551 L 540 555 554 554 Q 691 390 679 177 L 665 -11 673 -22 701 -46 702 -48 750 -44 M -1981 -1382 Q -1933 -1377 -1897 -1341 L -1889 -1331 -1887 -1308 -1889 -1286 Q -1932 -1262 -1984 -1302 L -2007 -1316 Q -2020 -1330 -2017 -1349 L -2011 -1371 -1999 -1376 -1982 -1380 -1981 -1382 M -1907 -1005 L -1896 -1011 -1878 -1016 Q -1804 -932 -1795 -799 -1764 -358 -1694 77 -1655 327 -1608 577 -1566 557 -1523 525 L -1516 523 -1497 525 -1487 537 -1482 547 Q -1540 601 -1582 669 -1482 1088 -1460 1523 -1452 1675 -1586 1744 -1881 1746 -1957 1455 -2052 1091 -1807 791 L -1723 691 Q -1799 267 -1861 -162 -1921 -580 -1911 -994 L -1907 -1005 M -1195 474 Q -1147 536 -1069 562 -852 526 -894 315 -899 291 -910 270 L -951 249 Q -982 236 -1006 214 L -1020 211 Q -1245 221 -1215 427 -1212 452 -1195 474 M -1627 1615 Q -1561 1435 -1604 1236 L -1693 828 Q -1929 1095 -1850 1426 -1805 1614 -1627 1615";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 336 -1637 Q 595 -1633 620 -1372 631 -1264 665 -1157 676 -1122 678 -1083 692 -874 629 -680 L 618 -640 Q 577 -475 417 -396 401 -356 366 -334 318 -304 273 -270 L 221 -264 147 -259 Q -38 -147 -232 -294 -343 -379 -322 -514 -488 -620 -510 -803 -523 -915 -470 -1013 -582 -1341 -318 -1557 L -266 -1598 -240 -1622 Q -111 -1776 74 -1830 264 -1825 332 -1648 L 336 -1637 M 195 -1046 L 196 -1101 Q 139 -1121 87 -1166 L 70 -1172 Q 31 -1145 -15 -1140 L -52 -1138 Q -43 -1109 -56 -1083 -75 -1047 -78 -1005 -38 -986 -1 -946 L 37 -913 55 -913 Q 113 -976 196 -1002 L 195 -1046 M -1621 -1332 L -1542 -1401 Q -1560 -1524 -1459 -1572 L -1423 -1586 Q -1418 -1700 -1362 -1795 -1349 -1818 -1324 -1830 -1238 -1817 -1168 -1841 -1125 -1846 -1090 -1823 L -1072 -1811 Q -1038 -1736 -1063 -1657 -1072 -1628 -1098 -1611 -1056 -1479 -1100 -1346 -1112 -1310 -1135 -1279 L -1133 -1272 -1109 -1268 Q -939 -1436 -768 -1266 -722 -1220 -731 -1153 -741 -1088 -717 -1031 -528 -973 -547 -758 -562 -589 -732 -643 L -773 -631 Q -791 -621 -813 -617 -814 -586 -837 -563 -856 -543 -880 -529 -868 -467 -888 -409 -899 -378 -921 -351 -936 -179 -1123 -242 -1263 -290 -1252 -440 -1246 -509 -1220 -573 L -1222 -583 -1228 -595 -1239 -606 Q -1406 -529 -1540 -636 -1675 -743 -1623 -913 -1736 -1080 -1672 -1264 -1658 -1305 -1621 -1332 M -1272 -1616 L -1272 -1617 -1275 -1615 -1272 -1616";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape61(ctx,ctrans,frame,ratio,time){
	var pathData="M 673 -22 L 701 -46 702 -48 750 -44 Q 934 215 1219 347 1374 418 1430 559 1442 590 1421 620 1399 653 1359 661 1084 718 883 556 867 543 876 521 L 896 502 938 477 Q 1091 522 1245 532 969 412 772 192 791 378 702 545 657 627 591 691 420 707 381 530 349 387 391 244 L 240 218 Q 263 471 45 583 -8 610 -75 592 -111 583 -134 553 -155 526 -163 492 -239 696 -455 687 -587 557 -558 366 -548 300 -544 233 -664 252 -788 285 -748 458 -868 589 -905 629 -957 653 L -995 673 Q -1274 680 -1323 416 -1334 361 -1316 307 -1262 134 -1069 107 -975 31 -865 140 L -847 159 -448 96 Q -402 206 -439 340 -476 470 -400 573 -265 527 -212 376 -191 317 -200 251 L -195 241 -174 218 -126 218 Q -79 313 -57 428 -48 476 -8 503 L 37 499 Q 139 387 133 233 L 129 133 94 77 Q 83 55 92 33 187 -28 279 76 348 155 468 127 546 109 540 184 537 225 523 264 475 410 532 551 L 540 555 554 554 Q 691 390 679 177 L 665 -11 673 -22 M -1999 -1376 L -1982 -1380 -1981 -1382 Q -1933 -1377 -1897 -1341 L -1889 -1331 -1887 -1308 -1889 -1286 Q -1932 -1262 -1984 -1302 L -2007 -1316 Q -2020 -1330 -2017 -1349 L -2011 -1371 -1999 -1376 M -1896 -1011 L -1878 -1016 Q -1804 -932 -1795 -799 -1764 -358 -1694 77 -1655 327 -1608 577 -1566 557 -1523 525 L -1516 523 -1497 525 -1487 537 -1482 547 Q -1540 601 -1582 669 -1482 1088 -1460 1523 -1452 1675 -1586 1744 -1881 1746 -1957 1455 -2052 1091 -1807 791 L -1723 691 Q -1799 267 -1861 -162 -1921 -580 -1911 -994 L -1907 -1005 -1896 -1011 M -1195 474 Q -1147 536 -1069 562 -852 526 -894 315 -899 291 -910 270 L -951 249 Q -982 236 -1006 214 L -1020 211 Q -1245 221 -1215 427 -1212 452 -1195 474 M -1627 1615 Q -1561 1435 -1604 1236 L -1693 828 Q -1929 1095 -1850 1426 -1805 1614 -1627 1615";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 332 -1648 L 336 -1637 Q 595 -1633 620 -1372 631 -1264 665 -1157 676 -1122 678 -1083 692 -874 629 -680 L 618 -640 Q 577 -475 417 -396 401 -356 366 -334 318 -304 273 -270 L 221 -264 147 -259 Q -38 -147 -232 -294 -343 -379 -322 -514 -488 -620 -510 -803 -523 -915 -470 -1013 -582 -1341 -318 -1557 L -266 -1598 -240 -1622 Q -111 -1776 74 -1830 264 -1825 332 -1648 M 196 -1101 Q 139 -1121 87 -1166 L 70 -1172 Q 31 -1145 -15 -1140 L -52 -1138 Q -43 -1109 -56 -1083 -75 -1047 -78 -1005 -38 -986 -1 -946 L 37 -913 55 -913 Q 113 -976 196 -1002 L 195 -1046 196 -1101 M -1621 -1332 L -1542 -1401 Q -1560 -1524 -1459 -1572 L -1423 -1586 Q -1418 -1700 -1362 -1795 -1349 -1818 -1324 -1830 -1238 -1817 -1168 -1841 -1125 -1846 -1090 -1823 L -1072 -1811 Q -1038 -1736 -1063 -1657 -1072 -1628 -1098 -1611 -1056 -1479 -1100 -1346 -1112 -1310 -1135 -1279 L -1133 -1272 -1109 -1268 Q -939 -1436 -768 -1266 -722 -1220 -731 -1153 -741 -1088 -717 -1031 -528 -973 -547 -758 -562 -589 -732 -643 L -773 -631 Q -791 -621 -813 -617 -814 -586 -837 -563 -856 -543 -880 -529 -868 -467 -888 -409 -899 -378 -921 -351 -936 -179 -1123 -242 -1263 -290 -1252 -440 -1246 -509 -1220 -573 L -1222 -583 -1228 -595 -1239 -606 Q -1406 -529 -1540 -636 -1675 -743 -1623 -913 -1736 -1080 -1672 -1264 -1658 -1305 -1621 -1332 M -1272 -1616 L -1272 -1617 -1275 -1615 -1272 -1616";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape62(ctx,ctrans,frame,ratio,time){
	var pathData="M 643 -89 Q 882 276 1294 450 1436 510 1353 624 1320 670 1263 676 1035 702 857 569 L 854 558 Q 851 541 857 525 L 865 515 879 503 1227 551 Q 900 407 650 151 670 395 614 627 578 777 432 776 306 586 356 352 L 378 245 Q 389 195 388 144 286 133 173 96 179 272 149 445 133 535 85 610 -94 646 -181 492 -222 598 -332 703 L -370 728 Q -579 690 -579 466 -578 313 -544 166 L -754 266 Q -665 513 -853 669 -875 687 -903 693 -1192 751 -1299 495 -1330 418 -1310 334 -1269 162 -1093 93 -936 31 -825 155 -611 123 -440 -22 L -388 -22 -371 1 -359 22 Q -454 204 -456 410 -458 506 -429 599 L -421 608 -403 621 -381 621 Q -331 579 -298 522 L -281 499 Q -257 422 -250 343 L -237 288 Q -249 262 -249 233 L -248 188 -240 178 -218 155 -167 155 Q -109 291 -63 440 -48 489 3 506 L 25 503 Q 98 352 95 181 93 121 96 59 75 41 69 14 66 -2 66 -19 L 74 -29 92 -48 303 1 417 11 484 7 Q 527 107 505 230 474 410 471 595 471 631 491 654 586 439 572 192 564 62 572 -63 L 580 -74 591 -85 605 -90 606 -92 643 -89 M -1941 -1397 Q -1899 -1350 -1872 -1295 L -1874 -1286 Q -1880 -1281 -1886 -1279 L -1907 -1279 -1974 -1345 Q -1983 -1368 -1970 -1387 L -1959 -1401 -1941 -1397 M -1841 -1035 Q -1825 -1015 -1817 -991 L -1811 -979 Q -1758 -553 -1663 -128 -1591 188 -1534 506 -1492 525 -1449 488 L -1416 499 -1508 588 Q -1416 1002 -1406 1441 -1404 1569 -1469 1678 -1500 1728 -1556 1752 -1866 1755 -1946 1456 -2088 924 -1660 591 L -1645 580 Q -1716 152 -1817 -274 -1905 -644 -1900 -1016 L -1893 -1028 -1889 -1035 -1881 -1038 -1863 -1042 -1841 -1035 M -1213 318 Q -1258 511 -1064 582 -907 640 -838 523 -788 438 -814 339 -823 306 -847 277 -972 243 -1069 185 -1152 227 -1203 306 L -1213 318 M -1526 1281 Q -1547 1047 -1588 816 -1603 734 -1630 684 -1993 1025 -1816 1492 -1757 1648 -1593 1637 -1508 1477 -1526 1281";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 151 -1671 Q 216 -1675 295 -1700 441 -1675 450 -1527 452 -1491 436 -1460 L 466 -1438 484 -1427 Q 585 -1347 573 -1217 566 -1147 536 -1083 676 -877 558 -641 516 -558 443 -506 472 -321 282 -270 134 -231 66 -351 -115 -258 -244 -414 -521 -461 -474 -729 L -466 -809 -450 -831 -429 -854 Q -492 -978 -470 -1129 -457 -1223 -388 -1286 -405 -1394 -335 -1477 -291 -1529 -222 -1530 -179 -1665 -65 -1738 -19 -1767 29 -1774 111 -1750 147 -1681 L 151 -1671 M 146 -1157 L 151 -1179 Q 94 -1203 29 -1190 19 -1144 -15 -1112 L -26 -1101 -31 -1079 -34 -1068 -60 -1046 Q -37 -993 -40 -935 L -45 -913 Q 3 -877 103 -861 130 -932 183 -989 L 199 -1002 Q 133 -1069 146 -1157 M -704 -1050 Q -701 -1008 -714 -972 L -695 -950 -684 -939 Q -485 -924 -531 -728 -547 -657 -613 -624 -695 -582 -773 -632 -787 -608 -807 -589 L -836 -554 Q -784 -429 -869 -333 L -928 -277 -925 -244 Q -922 -221 -932 -200 L -935 -192 Q -1144 -131 -1222 -340 -1249 -413 -1194 -469 L -1256 -570 Q -1276 -600 -1275 -636 -1384 -605 -1513 -641 -1523 -643 -1527 -655 -1548 -720 -1556 -787 L -1596 -841 Q -1613 -868 -1601 -898 L -1608 -909 -1616 -920 Q -1597 -1047 -1618 -1166 -1627 -1214 -1627 -1264 -1612 -1279 -1603 -1297 L -1567 -1342 Q -1537 -1348 -1508 -1361 L -1494 -1368 -1494 -1412 -1494 -1467 -1469 -1502 -1434 -1534 -1420 -1538 -1401 -1545 -1403 -1567 -1409 -1589 -1416 -1611 -1414 -1621 -1405 -1634 -1402 -1645 -1401 -1656 -1401 -1667 Q -1373 -1696 -1357 -1732 -1341 -1769 -1301 -1778 L -1301 -1789 -1301 -1800 -1301 -1811 -1283 -1833 -1271 -1843 -1257 -1848 Q -1165 -1845 -1103 -1788 L -1094 -1778 Q -1087 -1714 -1116 -1661 -1136 -1624 -1165 -1589 -1168 -1573 -1155 -1555 L -1124 -1512 Q -1113 -1437 -1136 -1371 -1151 -1328 -1176 -1290 -1180 -1273 -1170 -1256 L -1139 -1212 -1136 -1201 -1135 -1190 -1135 -1179 -1098 -1175 Q -1110 -1273 -1069 -1353 -1050 -1389 -1020 -1416 -860 -1429 -818 -1269 -810 -1240 -810 -1209 -780 -1205 -759 -1179 L -725 -1138 Q -706 -1096 -704 -1050 M -375 -1181 L -370 -1179 -370 -1190 -375 -1181";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape63(ctx,ctrans,frame,ratio,time){
	var pathData="M 74 -29 L 92 -48 303 1 417 11 484 7 Q 527 107 505 230 474 410 471 595 471 631 491 654 586 439 572 192 564 62 572 -63 L 580 -74 591 -85 605 -90 606 -92 643 -89 Q 882 276 1294 450 1436 510 1353 624 1320 670 1263 676 1035 702 857 569 L 854 558 Q 851 541 857 525 L 865 515 879 503 1227 551 Q 900 407 650 151 670 395 614 627 578 777 432 776 306 586 356 352 L 378 245 Q 389 195 388 144 286 133 173 96 179 272 149 445 133 535 85 610 -94 646 -181 492 -222 598 -332 703 L -370 728 Q -579 690 -579 466 -578 313 -544 166 L -754 266 Q -665 513 -853 669 -875 687 -903 693 -1192 751 -1299 495 -1330 418 -1310 334 -1269 162 -1093 93 -936 31 -825 155 -611 123 -440 -22 L -388 -22 -371 1 -359 22 Q -454 204 -456 410 -458 506 -429 599 L -421 608 -403 621 -381 621 Q -331 579 -298 522 L -281 499 Q -257 422 -250 343 L -237 288 Q -249 262 -249 233 L -248 188 -240 178 -218 155 -167 155 Q -109 291 -63 440 -48 489 3 506 L 25 503 Q 98 352 95 181 93 121 96 59 75 41 69 14 66 -2 66 -19 L 74 -29 M -1959 -1401 L -1941 -1397 Q -1899 -1350 -1872 -1295 L -1874 -1286 Q -1880 -1281 -1886 -1279 L -1907 -1279 -1974 -1345 Q -1983 -1368 -1970 -1387 L -1959 -1401 M -1893 -1028 L -1889 -1035 -1881 -1038 -1863 -1042 -1841 -1035 Q -1825 -1015 -1817 -991 L -1811 -979 Q -1758 -553 -1663 -128 -1591 188 -1534 506 -1492 525 -1449 488 L -1416 499 -1508 588 Q -1416 1002 -1406 1441 -1404 1569 -1469 1678 -1500 1728 -1556 1752 -1866 1755 -1946 1456 -2088 924 -1660 591 L -1645 580 Q -1716 152 -1817 -274 -1905 -644 -1900 -1016 L -1893 -1028 M -1213 318 Q -1258 511 -1064 582 -907 640 -838 523 -788 438 -814 339 -823 306 -847 277 -972 243 -1069 185 -1152 227 -1203 306 L -1213 318 M -1526 1281 Q -1547 1047 -1588 816 -1603 734 -1630 684 -1993 1025 -1816 1492 -1757 1648 -1593 1637 -1508 1477 -1526 1281";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 295 -1700 Q 441 -1675 450 -1527 452 -1491 436 -1460 L 466 -1438 484 -1427 Q 585 -1347 573 -1217 566 -1147 536 -1083 676 -877 558 -641 516 -558 443 -506 472 -321 282 -270 134 -231 66 -351 -115 -258 -244 -414 -521 -461 -474 -729 L -466 -809 -450 -831 -429 -854 Q -492 -978 -470 -1129 -457 -1223 -388 -1286 -405 -1394 -335 -1477 -291 -1529 -222 -1530 -179 -1665 -65 -1738 -19 -1767 29 -1774 111 -1750 147 -1681 L 151 -1671 Q 216 -1675 295 -1700 M 146 -1157 L 151 -1179 Q 94 -1203 29 -1190 19 -1144 -15 -1112 L -26 -1101 -31 -1079 -34 -1068 -60 -1046 Q -37 -993 -40 -935 L -45 -913 Q 3 -877 103 -861 130 -932 183 -989 L 199 -1002 Q 133 -1069 146 -1157 M -704 -1050 Q -701 -1008 -714 -972 L -695 -950 -684 -939 Q -485 -924 -531 -728 -547 -657 -613 -624 -695 -582 -773 -632 -787 -608 -807 -589 L -836 -554 Q -784 -429 -869 -333 L -928 -277 -925 -244 Q -922 -221 -932 -200 L -935 -192 Q -1144 -131 -1222 -340 -1249 -413 -1194 -469 L -1256 -570 Q -1276 -600 -1275 -636 -1384 -605 -1513 -641 -1523 -643 -1527 -655 -1548 -720 -1556 -787 L -1596 -841 Q -1613 -868 -1601 -898 L -1608 -909 -1616 -920 Q -1597 -1047 -1618 -1166 -1627 -1214 -1627 -1264 -1612 -1279 -1603 -1297 L -1567 -1342 Q -1537 -1348 -1508 -1361 L -1494 -1368 -1494 -1412 -1494 -1467 -1469 -1502 -1434 -1534 -1420 -1538 -1401 -1545 -1403 -1567 -1409 -1589 -1416 -1611 -1414 -1621 -1405 -1634 -1402 -1645 -1401 -1656 -1401 -1667 Q -1373 -1696 -1357 -1732 -1341 -1769 -1301 -1778 L -1301 -1789 -1301 -1800 -1301 -1811 -1283 -1833 -1271 -1843 -1257 -1848 Q -1165 -1845 -1103 -1788 L -1094 -1778 Q -1087 -1714 -1116 -1661 -1136 -1624 -1165 -1589 -1168 -1573 -1155 -1555 L -1124 -1512 Q -1113 -1437 -1136 -1371 -1151 -1328 -1176 -1290 -1180 -1273 -1170 -1256 L -1139 -1212 -1136 -1201 -1135 -1190 -1135 -1179 -1098 -1175 Q -1110 -1273 -1069 -1353 -1050 -1389 -1020 -1416 -860 -1429 -818 -1269 -810 -1240 -810 -1209 -780 -1205 -759 -1179 L -725 -1138 Q -706 -1096 -704 -1050 M -375 -1181 L -370 -1179 -370 -1190 -375 -1181";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape64(ctx,ctrans,frame,ratio,time){
	var pathData="M 673 -22 L 701 -46 702 -48 750 -44 Q 934 215 1219 347 1374 418 1430 559 1442 590 1421 620 1399 653 1359 661 1084 718 883 556 867 543 876 521 L 896 502 938 477 Q 1091 522 1245 532 969 412 772 192 791 378 702 545 657 627 591 691 420 707 381 530 349 387 391 244 L 240 218 Q 263 471 45 583 -8 610 -75 592 -111 583 -134 553 -155 526 -163 492 -239 696 -455 687 -587 557 -558 366 -548 300 -544 233 -664 252 -788 285 -748 458 -868 589 -905 629 -957 653 L -995 673 Q -1274 680 -1323 416 -1334 361 -1316 307 -1262 134 -1069 107 -975 31 -865 140 L -847 159 -448 96 Q -402 206 -439 340 -476 470 -400 573 -265 527 -212 376 -191 317 -200 251 L -195 241 -174 218 -126 218 Q -79 313 -57 428 -48 476 -8 503 L 37 499 Q 139 387 133 233 L 129 133 94 77 Q 83 55 92 33 187 -28 279 76 348 155 468 127 546 109 540 184 537 225 523 264 475 410 532 551 L 540 555 554 554 Q 691 390 679 177 L 665 -11 673 -22 M -1999 -1376 L -1982 -1380 -1981 -1382 Q -1933 -1377 -1897 -1341 L -1889 -1331 -1887 -1308 -1889 -1286 Q -1932 -1262 -1984 -1302 L -2007 -1316 Q -2020 -1330 -2017 -1349 L -2011 -1371 -1999 -1376 M -1896 -1011 L -1878 -1016 Q -1804 -932 -1795 -799 -1764 -358 -1694 77 -1655 327 -1608 577 -1566 557 -1523 525 L -1516 523 -1497 525 -1487 537 -1482 547 Q -1540 601 -1582 669 -1482 1088 -1460 1523 -1452 1675 -1586 1744 -1881 1746 -1957 1455 -2052 1091 -1807 791 L -1723 691 Q -1799 267 -1861 -162 -1921 -580 -1911 -994 L -1907 -1005 -1896 -1011 M -1195 474 Q -1147 536 -1069 562 -852 526 -894 315 -899 291 -910 270 L -951 249 Q -982 236 -1006 214 L -1020 211 Q -1245 221 -1215 427 -1212 452 -1195 474 M -1627 1615 Q -1561 1435 -1604 1236 L -1693 828 Q -1929 1095 -1850 1426 -1805 1614 -1627 1615";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 336 -1637 Q 595 -1633 620 -1372 631 -1264 665 -1157 676 -1122 678 -1083 692 -874 629 -680 L 618 -640 Q 577 -475 417 -396 401 -356 366 -334 318 -304 273 -270 L 221 -264 147 -259 Q -38 -147 -232 -294 -343 -379 -322 -514 -488 -620 -510 -803 -523 -915 -470 -1013 -582 -1341 -318 -1557 L -266 -1598 -240 -1622 Q -111 -1776 74 -1830 264 -1825 332 -1648 L 336 -1637 M 87 -1166 L 70 -1172 Q 31 -1145 -15 -1140 L -52 -1138 Q -43 -1109 -56 -1083 -75 -1047 -78 -1005 -38 -986 -1 -946 L 37 -913 55 -913 Q 113 -976 196 -1002 L 195 -1046 196 -1101 Q 139 -1121 87 -1166 M -1621 -1332 L -1542 -1401 Q -1560 -1524 -1459 -1572 L -1423 -1586 Q -1418 -1700 -1362 -1795 -1349 -1818 -1324 -1830 -1238 -1817 -1168 -1841 -1125 -1846 -1090 -1823 L -1072 -1811 Q -1038 -1736 -1063 -1657 -1072 -1628 -1098 -1611 -1056 -1479 -1100 -1346 -1112 -1310 -1135 -1279 L -1133 -1272 -1109 -1268 Q -939 -1436 -768 -1266 -722 -1220 -731 -1153 -741 -1088 -717 -1031 -528 -973 -547 -758 -562 -589 -732 -643 L -773 -631 Q -791 -621 -813 -617 -814 -586 -837 -563 -856 -543 -880 -529 -868 -467 -888 -409 -899 -378 -921 -351 -936 -179 -1123 -242 -1263 -290 -1252 -440 -1246 -509 -1220 -573 L -1222 -583 -1228 -595 -1239 -606 Q -1406 -529 -1540 -636 -1675 -743 -1623 -913 -1736 -1080 -1672 -1264 -1658 -1305 -1621 -1332 M -1272 -1616 L -1272 -1617 -1275 -1615 -1272 -1616";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape65(ctx,ctrans,frame,ratio,time){
	var pathData="M 673 -22 L 701 -46 702 -48 750 -44 Q 934 215 1219 347 1374 418 1430 559 1442 590 1421 620 1399 653 1359 661 1084 718 883 556 867 543 876 521 L 896 502 938 477 Q 1091 522 1245 532 969 412 772 192 791 378 702 545 657 627 591 691 420 707 381 530 349 387 391 244 L 240 218 Q 263 471 45 583 -8 610 -75 592 -111 583 -134 553 -155 526 -163 492 -239 696 -455 687 -587 557 -558 366 -548 300 -544 233 -664 252 -788 285 -748 458 -868 589 -905 629 -957 653 L -995 673 Q -1274 680 -1323 416 -1334 361 -1316 307 -1262 134 -1069 107 -975 31 -865 140 L -847 159 -448 96 Q -402 206 -439 340 -476 470 -400 573 -265 527 -212 376 -191 317 -200 251 L -195 241 -174 218 -126 218 Q -79 313 -57 428 -48 476 -8 503 L 37 499 Q 139 387 133 233 L 129 133 94 77 Q 83 55 92 33 187 -28 279 76 348 155 468 127 546 109 540 184 537 225 523 264 475 410 532 551 L 540 555 554 554 Q 691 390 679 177 L 665 -11 673 -22 M -1999 -1376 L -1982 -1380 -1981 -1382 Q -1933 -1377 -1897 -1341 L -1889 -1331 -1887 -1308 -1889 -1286 Q -1932 -1262 -1984 -1302 L -2007 -1316 Q -2020 -1330 -2017 -1349 L -2011 -1371 -1999 -1376 M -1896 -1011 L -1878 -1016 Q -1804 -932 -1795 -799 -1764 -358 -1694 77 -1655 327 -1608 577 -1566 557 -1523 525 L -1516 523 -1497 525 -1487 537 -1482 547 Q -1540 601 -1582 669 -1482 1088 -1460 1523 -1452 1675 -1586 1744 -1881 1746 -1957 1455 -2052 1091 -1807 791 L -1723 691 Q -1799 267 -1861 -162 -1921 -580 -1911 -994 L -1907 -1005 -1896 -1011 M -1195 474 Q -1147 536 -1069 562 -852 526 -894 315 -899 291 -910 270 L -951 249 Q -982 236 -1006 214 L -1020 211 Q -1245 221 -1215 427 -1212 452 -1195 474 M -1627 1615 Q -1561 1435 -1604 1236 L -1693 828 Q -1929 1095 -1850 1426 -1805 1614 -1627 1615";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 332 -1648 L 336 -1637 Q 595 -1633 620 -1372 631 -1264 665 -1157 676 -1122 678 -1083 692 -874 629 -680 L 618 -640 Q 577 -475 417 -396 401 -356 366 -334 318 -304 273 -270 L 221 -264 147 -259 Q -38 -147 -232 -294 -343 -379 -322 -514 -488 -620 -510 -803 -523 -915 -470 -1013 -582 -1341 -318 -1557 L -266 -1598 -240 -1622 Q -111 -1776 74 -1830 264 -1825 332 -1648 M 196 -1101 Q 139 -1121 87 -1166 L 70 -1172 Q 31 -1145 -15 -1140 L -52 -1138 Q -43 -1109 -56 -1083 -75 -1047 -78 -1005 -38 -986 -1 -946 L 37 -913 55 -913 Q 113 -976 196 -1002 L 195 -1046 196 -1101 M -1621 -1332 L -1542 -1401 Q -1560 -1524 -1459 -1572 L -1423 -1586 Q -1418 -1700 -1362 -1795 -1349 -1818 -1324 -1830 -1238 -1817 -1168 -1841 -1125 -1846 -1090 -1823 L -1072 -1811 Q -1038 -1736 -1063 -1657 -1072 -1628 -1098 -1611 -1056 -1479 -1100 -1346 -1112 -1310 -1135 -1279 L -1133 -1272 -1109 -1268 Q -939 -1436 -768 -1266 -722 -1220 -731 -1153 -741 -1088 -717 -1031 -528 -973 -547 -758 -562 -589 -732 -643 L -773 -631 Q -791 -621 -813 -617 -814 -586 -837 -563 -856 -543 -880 -529 -868 -467 -888 -409 -899 -378 -921 -351 -936 -179 -1123 -242 -1263 -290 -1252 -440 -1246 -509 -1220 -573 L -1222 -583 -1228 -595 -1239 -606 Q -1406 -529 -1540 -636 -1675 -743 -1623 -913 -1736 -1080 -1672 -1264 -1658 -1305 -1621 -1332 M -1272 -1616 L -1272 -1617 -1275 -1615 -1272 -1616";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite66(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 8;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape59",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("shape59",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 2:
			place("shape60",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 3:
			place("shape61",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 4:
			place("shape62",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 5:
			place("shape63",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 6:
			place("shape64",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 7:
			place("shape65",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function button68(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 4;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			break;
	}
}

function shape69(ctx,ctrans,frame,ratio,time){
	var pathData="M -293 -992 Q -293 -1014 -280 -1049 L -261 -1052 -235 -1055 -17 -1070 142 -1065 256 -1053 283 -1045 Q 317 -1031 329 -988 L 283 -985 253 -976 Q 199 -959 142 -950 56 -939 -36 -948 L -235 -978 -261 -984 -293 -992 M 374 -907 Q 354 -774 440 -674 534 -565 668 -524 L 717 -512 Q 829 -491 939 -533 1008 -560 1063 -604 1111 -643 1148 -695 L 1172 -735 1178 -735 Q 1228 -732 1261 -713 L 1266 -711 1267 -710 Q 1330 -671 1327 -418 L 1262 -410 1261 -410 1178 -388 1165 -384 1164 -384 1164 -388 1161 -443 1063 -441 1003 -432 990 -181 Q 980 -48 955 83 928 227 924 345 L 894 351 Q 872 256 866 147 L 717 205 673 221 Q 670 313 683 402 697 502 717 578 L 759 718 717 717 Q 709 720 708 728 L 705 728 Q 708 702 695 655 687 628 599 660 599 639 597 652 592 614 551 552 508 576 497 605 L 484 596 Q 527 516 428 473 374 505 358 563 L 358 562 Q 370 447 283 444 L 270 444 Q 218 461 213 491 200 412 162 329 226 308 283 270 L 368 199 Q 525 42 525 -180 525 -402 368 -559 L 283 -629 Q 217 -673 142 -695 70 -716 -11 -716 -133 -716 -235 -669 L -261 -656 Q -330 -619 -390 -559 -547 -402 -547 -180 -547 42 -390 199 -330 259 -261 296 L -235 309 Q -176 336 -110 348 -172 415 -168 538 -180 456 -235 446 L -261 445 -297 452 Q -353 473 -351 535 L -351 540 -352 535 Q -358 507 -391 505 -417 504 -471 536 -517 563 -511 594 -522 588 -542 581 L -548 582 Q -647 600 -612 697 L -653 661 Q -712 673 -721 696 -693 576 -679 444 -666 314 -627 206 -738 161 -845 150 L -862 261 -886 257 Q -927 123 -938 -16 L -963 -245 -967 -281 Q -700 -359 -856 -622 L -808 -646 Q -709 -703 -623 -695 L -548 -693 -500 -697 Q -451 -758 -409 -817 L -327 -943 -261 -914 -235 -905 Q -150 -875 -53 -862 44 -849 142 -857 L 170 -860 283 -879 374 -907";
	ctx.fillStyle=tocolor(ctrans.apply([51,51,51,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 329 -988 Q 383 -981 374 -907 L 283 -879 170 -860 142 -857 Q 44 -849 -53 -862 -150 -875 -235 -905 L -261 -914 -327 -943 Q -357 -959 -317 -998 L -293 -992 -261 -984 -235 -978 -36 -948 Q 56 -939 142 -950 199 -959 253 -976 L 283 -985 329 -988 M 1121 1071 L 1120 1071 1063 1043 989 990 Q 1030 979 1063 959 1125 922 1157 855 1111 815 1063 788 L 1047 779 1063 765 Q 1128 704 1178 624 L 1208 572 Q 1224 541 1240 523 1246 592 1261 665 L 1290 777 1319 890 Q 1290 904 1261 884 L 1253 877 Q 1221 950 1178 1007 L 1121 1071 M 162 329 L 142 335 Q 70 356 -11 356 L -110 348 Q -176 336 -235 309 L -261 296 Q -330 259 -390 199 -547 42 -547 -180 -547 -402 -390 -559 -330 -619 -261 -656 L -235 -669 Q -133 -716 -11 -716 70 -716 142 -695 217 -673 283 -629 L 368 -559 Q 525 -402 525 -180 525 42 368 199 L 283 270 Q 226 308 162 329 M -973 976 L -1009 995 -1066 1018 -1127 1030 -1128 1030 -1153 993 -1155 990 Q -1204 915 -1239 836 L -1318 832 Q -1310 791 -1290 743 L -1239 623 -1188 509 -1155 556 -1148 568 Q -1109 636 -1066 695 L -1009 766 -994 783 -1009 786 -1066 796 -1116 804 Q -1100 862 -1066 904 -1042 934 -1009 956 L -973 976 M 305 -503 L 283 -523 Q 219 -581 142 -609 70 -635 -13 -635 -136 -635 -235 -577 L -261 -561 Q -298 -536 -331 -503 -463 -371 -463 -185 -463 1 -331 133 -298 166 -261 191 L -235 208 Q -136 265 -13 265 70 265 142 239 219 211 283 154 L 305 133 Q 437 1 437 -185 437 -371 305 -503";
	ctx.fillStyle=tocolor(ctrans.apply([51,153,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 1327 -418 L 1337 -252 Q 1409 -218 1463 -174 1455 -67 1458 56 1461 193 1456 329 L 1449 480 1406 703 Q 1394 765 1388 827 L 1384 875 Q 1335 961 1261 1012 1225 1037 1184 1053 L 1178 1056 1121 1071 1178 1007 Q 1221 950 1253 877 L 1261 884 Q 1290 904 1319 890 L 1290 777 1261 665 Q 1246 592 1240 523 1224 541 1208 572 L 1178 624 Q 1128 704 1063 765 L 1047 779 1063 788 Q 1111 815 1157 855 1125 922 1063 959 1030 979 989 990 982 950 918 913 923 886 893 834 864 787 809 818 850 764 759 718 L 717 578 Q 697 502 683 402 670 313 673 221 L 717 205 866 147 Q 872 256 894 351 L 924 345 Q 928 227 955 83 980 -48 990 -181 L 1003 -432 1063 -441 1161 -443 1164 -388 1164 -384 1165 -384 1178 -388 1261 -410 1262 -410 1327 -418 M -721 696 Q -749 710 -741 730 L -739 735 -752 742 -757 732 Q -876 755 -841 837 L -841 839 -833 854 -844 840 Q -919 878 -894 935 L -893 936 -880 959 -901 940 Q -945 953 -963 985 L -973 976 -1009 956 Q -1042 934 -1066 904 -1100 862 -1116 804 L -1066 796 -1009 786 -994 783 -1009 766 -1066 695 Q -1109 636 -1148 568 L -1155 556 -1188 509 -1239 623 -1290 743 Q -1310 791 -1318 832 L -1239 836 Q -1204 915 -1155 990 L -1170 1004 -1239 962 -1375 868 -1400 805 -1425 732 -1443 661 Q -1460 582 -1462 509 -1462 372 -1453 237 -1445 111 -1446 -16 -1447 -139 -1453 -257 L -1443 -260 Q -1382 -281 -1319 -315 L -1311 -440 -1239 -442 -1160 -447 -1155 -446 -1066 -434 -1009 -430 -980 -428 Q -981 -390 -967 -281 L -963 -245 -938 -16 Q -927 123 -886 257 L -883 266 Q -876 298 -879 336 L -862 263 -862 261 -845 150 Q -738 161 -627 206 -666 314 -679 444 -693 576 -721 696 M 305 -503 Q 437 -371 437 -185 437 1 305 133 L 283 154 Q 219 211 142 239 70 265 -13 265 -136 265 -235 208 L -261 191 Q -298 166 -331 133 -463 1 -463 -185 -463 -371 -331 -503 -298 -536 -261 -561 L -235 -577 Q -136 -635 -13 -635 70 -635 142 -609 219 -581 283 -523 L 305 -503 M 283 -453 L 269 -468 Q 212 -525 142 -554 72 -583 -10 -583 -137 -583 -235 -514 L -261 -494 -290 -468 Q -405 -352 -405 -188 -405 -24 -290 91 L -261 118 -235 138 Q -137 207 -10 207 72 207 142 178 212 149 269 91 L 283 77 Q 385 -34 385 -188 385 -342 283 -453";
	ctx.fillStyle=tocolor(ctrans.apply([102,102,102,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 283 -453 Q 385 -342 385 -188 385 -34 283 77 L 269 91 Q 212 149 142 178 72 207 -10 207 -137 207 -235 138 L -261 118 -290 91 Q -405 -24 -405 -188 -405 -352 -290 -468 L -261 -494 -235 -514 Q -137 -583 -10 -583 72 -583 142 -554 212 -525 269 -468 L 283 -453 M 243 -287 L 244 -277 Q 245 -227 273 -203 L 280 -208 Q 316 -297 238 -356 L 237 -355 Q 229 -350 221 -347 L 221 -336 Q 223 -308 243 -287 M 211 -395 L 210 -400 Q 199 -436 166 -445 L 165 -444 160 -440 159 -436 165 -431 Q 185 -413 196 -388 L 208 -392 211 -395";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.02508544921875,0,0,0.02508544921875,0,-194);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.0,tocolor(ctrans.apply([101,108,125,1])));
	grd.addColorStop(1.0,tocolor(ctrans.apply([0,0,0,1])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M 211 -395 L 208 -392 196 -388 Q 185 -413 165 -431 L 159 -436 160 -440 165 -444 166 -445 Q 199 -436 210 -400 L 211 -395 M 243 -287 Q 223 -308 221 -336 L 221 -347 Q 229 -350 237 -355 L 238 -356 Q 316 -297 280 -208 L 273 -203 Q 245 -227 244 -277 L 243 -287";
	ctx.fillStyle=tocolor(ctrans.apply([95,102,118,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function character70(ctx,ctrans,frame,ratio,time){
}

function sprite71(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 20;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 1:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-242,256,256,256,256)),1,0,0,time);
			break;
		case 2:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-228,256,256,256,256)),1,0,0,time);
			break;
		case 3:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-215,256,256,256,256)),1,0,0,time);
			break;
		case 4:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-201,256,256,256,256)),1,0,0,time);
			break;
		case 5:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-188,256,256,256,256)),1,0,0,time);
			break;
		case 6:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-174,256,256,256,256)),1,0,0,time);
			break;
		case 7:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-161,256,256,256,256)),1,0,0,time);
			break;
		case 8:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-148,256,256,256,256)),1,0,0,time);
			break;
		case 9:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-134,256,256,256,256)),1,0,0,time);
			break;
		case 10:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-121,256,256,256,256)),1,0,0,time);
			break;
		case 11:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-107,256,256,256,256)),1,0,0,time);
			break;
		case 12:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-94,256,256,256,256)),1,0,0,time);
			break;
		case 13:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-81,256,256,256,256)),1,0,0,time);
			break;
		case 14:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-67,256,256,256,256)),1,0,0,time);
			break;
		case 15:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-54,256,256,256,256)),1,0,0,time);
			break;
		case 16:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-40,256,256,256,256)),1,0,0,time);
			break;
		case 17:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-27,256,256,256,256)),1,0,0,time);
			break;
		case 18:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-13,256,256,256,256)),1,0,0,time);
			break;
		case 19:
			place("shape69",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
	}
}

function shape72(ctx,ctrans,frame,ratio,time){
	var pathData="M 1432 -997 Q 1268 -760 1103 -486 1366 -708 1690 -862 L 1743 -924 1811 -997 1925 -1018 Q 2205 -1235 2541 -1362 2261 -1201 2024 -997 L 2063 -1011 Q 3486 -1082 3988 212 4537 1624 3607 2839 3014 3614 2344 4337 2146 4552 2063 4830 2063 4851 2073 4865 2169 5000 2312 5088 2337 5103 2358 5125 3512 5203 4322 5997 4800 6465 4687 7139 4634 7459 4452 7728 4004 8393 3374 8921 3100 9150 2920 9463 2920 9568 2934 9671 2968 9907 3045 10137 3073 10220 3088 10305 3846 11294 4310 12442 4695 13394 4775 14395 4817 14917 4764 15440 4733 15740 4596 16015 4504 16201 4325 16305 4185 16386 4015 16384 L 3978 16430 Q 3938 16489 3888 16539 L 3874 16553 3818 16567 Q 3783 16553 3759 16528 3727 16496 3706 16454 3706 16433 3716 16419 L 3832 16244 Q 3823 15716 3827 15149 3837 14042 3363 13026 3251 12784 3131 12551 L 2278 10896 Q 2377 11209 2551 11515 L 2569 11555 2499 11611 Q 2158 11064 2061 10470 2009 10352 1975 10226 1927 10050 1907 9882 1905 10202 1965 10516 1536 9492 2201 8601 2273 8504 2365 8455 2457 8352 2567 8255 3200 7696 3648 7001 3702 6917 3692 6809 3024 6240 2140 6147 2376 6360 2631 6553 2646 6564 2653 6585 2254 6401 1942 6127 1770 6097 1626 5989 L 1504 5893 Q 1678 6204 1913 6495 1923 6507 1923 6528 1599 6183 1384 5782 1202 5601 1102 5403 1107 5805 1243 6208 L 1249 6248 Q 965 5720 1011 5163 972 5008 977 4843 881 5198 871 5602 870 5644 856 5686 702 4545 1466 3652 1909 2958 2481 2356 2900 1915 3026 1324 3155 718 2696 339 2228 -48 1812 473 1440 938 1131 1443 L 1387 1176 Q 1396 1165 1418 1165 1211 1521 920 1805 L 903 1834 Q 725 2160 483 2403 727 2225 940 1994 L 954 1980 996 2022 Q 616 2512 94 2715 L 22 2758 Q 210 2694 393 2611 -38 3035 -650 3062 -282 3146 126 3145 133 3145 140 3159 -496 3267 -1067 3083 -1334 3091 -1557 3012 L -1429 3181 Q -1418 3194 -1418 3215 -1669 3077 -1875 2838 -2095 2669 -2258 2384 -2359 2207 -2480 2057 -2432 2130 -2415 2218 -2429 2239 -2448 2245 -2478 2253 -2514 2246 -2917 1774 -3498 1633 L -3829 1726 Q -3911 1768 -4027 1801 -4105 1824 -4170 1864 -3946 1775 -3693 1728 -3638 1718 -3595 1699 L -3552 1741 Q -3993 1849 -4363 2059 -4455 2191 -4573 2304 -4663 2707 -4602 3120 L -4144 3302 Q -4131 3307 -4124 3328 -4124 3349 -4130 3368 -4138 3392 -4151 3413 L -4166 3441 Q -4393 3504 -4545 3479 L -4541 3491 Q -4290 3621 -3957 3562 L -3857 3539 Q -3721 3566 -3675 3693 -3869 3818 -4053 3854 -3819 3897 -3577 3901 -3373 3904 -3169 3890 -2817 3625 -2545 3870 -2531 3883 -2524 3904 -2564 4052 -2722 4094 L -2825 4120 Q -2777 4155 -2733 4198 -2656 4275 -2703 4376 L -2736 4439 -2444 4379 Q -2369 4361 -2313 4423 -2383 4859 -2928 4893 L -3283 4915 Q -3492 4929 -3684 4913 -3235 5059 -2707 5030 -2425 5014 -2284 5192 -2026 5056 -1783 4872 -2051 5124 -2364 5357 -2102 5280 -1840 5153 -2338 5522 -2935 5606 -3418 5731 -3990 5587 -5029 5326 -5535 4377 -5698 4072 -5727 3722 -5782 3055 -5719 2400 L -5900 2367 Q -6233 2290 -6456 2046 -6537 1957 -6598 1863 -6788 2348 -6776 2858 -6701 3559 -6465 4242 -6459 4261 -6459 4282 -6370 4443 -6332 4619 -6577 4270 -6728 3887 -6643 4182 -6543 4465 -6557 4493 -6578 4500 L -6669 4507 Q -7308 3253 -7219 1811 -7301 1186 -7103 556 L -7100 552 -7082 462 Q -7069 400 -7062 337 -6984 242 -6925 125 L -6908 84 Q -6796 17 -6707 -80 L -6683 -98 -6641 -56 Q -6765 135 -6847 340 -6786 307 -6719 286 -6599 88 -6388 -69 L -6346 -98 -6339 -91 Q -6459 -1163 -6040 -2234 L -5977 -2386 Q -5899 -2613 -5793 -2837 -5484 -3744 -4797 -4488 L -4549 -4745 -4493 -4757 -4465 -4759 -4962 -3987 Q -5112 -3751 -5242 -3507 L -5142 -3610 Q -4983 -3865 -4774 -4085 L -4732 -4043 -4879 -3829 Q -4389 -3738 -4611 -3232 -4792 -2820 -4935 -2397 -4803 -2594 -4630 -2776 L -4605 -2794 -4563 -2752 Q -4672 -2614 -4766 -2470 L -4503 -2456 Q -4272 -2238 -4541 -2029 -4632 -1958 -4700 -1866 -4521 -1832 -4493 -1637 -4480 -1548 -4447 -1501 L -4432 -1511 Q -4276 -1563 -4222 -1417 -4231 -1203 -4432 -1059 L -4573 -954 -4544 -913 -4475 -827 -4464 -785 Q -4461 -764 -4461 -743 L -4461 -715 Q -4391 -694 -4327 -660 -4236 -611 -4208 -504 L -4212 -463 Q -4238 -314 -4377 -252 -4584 8 -4676 302 -4451 82 -4142 -14 -4142 7 -4150 24 -4163 49 -4184 70 L -4188 112 -4198 155 -4381 239 -4457 350 Q -4108 189 -3722 135 -3714 134 -3707 127 -3686 148 -3676 173 -3672 183 -3679 197 L -3869 254 Q -3524 232 -3153 330 L -2598 337 Q -2570 358 -2538 371 -2278 475 -2022 590 -2237 593 -2622 516 L -2651 511 Q -2500 579 -2360 661 -2015 774 -1690 964 L -1690 1187 Q -1445 1443 -1255 1761 -1206 1844 -1138 1922 -761 1744 -501 1393 L -492 1390 Q -574 1653 -744 1810 -544 1719 -374 1589 -68 1211 139 771 344 130 744 -407 561 -18 418 383 560 106 746 -123 924 -569 1305 -941 L 1347 -983 1404 -994 1432 -997 M -2649 1895 Q -2597 1928 -2556 1967 L -2575 1945 Q -2681 1868 -2794 1808 -2721 1849 -2649 1895 M -6307 141 L -6332 -31 Q -6478 101 -6585 256 -6458 239 -6315 262 L -6307 141 M -5034 3497 L -5040 3484 -5038 3497 -5037 3497 -5034 3497";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape73(ctx,ctrans,frame,ratio,time){
	var pathData="M 329 -194 Q 270 -128 242 1 L 206 1 206 -314 1171 -314 1171 1 1134 1 Q 1106 -128 1048 -194 989 -260 882 -282 L 882 558 999 558 999 590 377 590 377 558 494 558 494 -282 Q 387 -260 329 -194 M 1667 -208 L 1667 491 Q 1667 537 1685 557 1702 577 1743 577 1812 577 1812 486 L 1812 -212 Q 1812 -300 1743 -300 1667 -300 1667 -208 M 2107 -213 Q 2243 -84 2243 140 2243 351 2109 485 1976 618 1744 618 1512 618 1372 487 1232 356 1232 133 1232 -84 1370 -213 1506 -343 1736 -343 1971 -343 2107 -213 M 2644 -275 Q 2612 -248 2612 -204 2612 -170 2632 -149 2652 -127 2709 -96 2909 15 2973 64 3037 112 3062 167 3087 221 3087 294 3087 404 3029 477 2970 551 2870 585 2768 618 2687 618 2560 618 2450 532 L 2328 627 2328 246 2363 246 2363 250 Q 2363 344 2399 409 2434 473 2509 524 2584 575 2662 575 2733 575 2777 546 2820 516 2820 469 2820 441 2802 418 2784 393 2754 374 2723 353 2614 296 2360 163 2360 -24 2360 -159 2459 -248 2558 -339 2706 -339 L 2812 -326 Q 2869 -314 2946 -266 L 3070 -359 3070 -25 3037 -25 Q 3035 -159 2934 -231 2832 -303 2725 -303 2675 -303 2644 -275 M -3256 -314 L -2520 -314 Q -2400 -314 -2342 -290 -2284 -266 -2249 -201 -2215 -136 -2215 -58 -2215 28 -2255 100 -2296 172 -2375 199 -2454 225 -2595 225 L -2755 225 -2755 558 -2631 558 -2631 590 -3256 590 -3256 558 -3148 558 -3148 -282 -3256 -282 -3256 -314 M -2755 -282 L -2755 194 -2706 194 Q -2611 194 -2611 95 L -2611 -142 Q -2611 -204 -2620 -234 -2629 -264 -2645 -272 -2663 -282 -2705 -282 L -2755 -282 M -2132 -314 L -1561 -314 -1561 -282 -1632 -282 -1632 104 -1473 104 -1473 -282 -1539 -282 -1539 -314 -979 -314 -979 -282 -1086 -282 -1086 558 -979 558 -979 590 -1539 590 -1539 558 -1473 558 -1473 134 -1632 134 -1632 558 -1561 558 -1561 590 -2132 590 -2132 558 -2025 558 -2025 -282 -2132 -282 -2132 -314 M -462 -208 L -462 491 Q -462 537 -444 557 -427 577 -386 577 -317 577 -317 486 L -317 -212 Q -317 -300 -386 -300 -462 -300 -462 -208 M -393 -343 Q -158 -343 -22 -213 114 -84 114 140 114 351 -20 485 -153 618 -385 618 -617 618 -757 487 -897 356 -897 133 -897 -84 -759 -213 -623 -343 -393 -343";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape74(ctx,ctrans,frame,ratio,time){
	var pathData="M 256 -30 L 220 -30 220 -345 1185 -345 1185 -30 1148 -30 Q 1120 -159 1062 -225 1003 -291 896 -313 L 896 527 1013 527 1013 559 391 559 391 527 508 527 508 -313 Q 401 -291 343 -225 284 -159 256 -30 M 1644 -202 L 1644 497 Q 1644 543 1662 563 1679 583 1720 583 1789 583 1789 492 L 1789 -206 Q 1789 -294 1720 -294 1644 -294 1644 -202 M 2084 -207 Q 2220 -78 2220 146 2220 357 2086 491 1953 624 1721 624 1489 624 1349 493 1209 362 1209 139 1209 -78 1347 -207 1483 -337 1713 -337 1948 -337 2084 -207 M -3242 -345 L -2506 -345 Q -2386 -345 -2328 -321 -2270 -297 -2235 -232 -2201 -167 -2201 -89 -2201 -3 -2241 69 -2282 141 -2361 168 -2440 194 -2581 194 L -2741 194 -2741 527 -2617 527 -2617 559 -3242 559 -3242 527 -3134 527 -3134 -313 -3242 -313 -3242 -345 M -2631 -303 Q -2649 -313 -2691 -313 L -2741 -313 -2741 163 -2692 163 Q -2597 163 -2597 64 L -2597 -173 Q -2597 -235 -2606 -265 -2615 -295 -2631 -303 M -2081 -271 L -1510 -271 -1510 -239 -1581 -239 -1581 147 -1422 147 -1422 -239 -1488 -239 -1488 -271 -928 -271 -928 -239 -1035 -239 -1035 601 -928 601 -928 633 -1488 633 -1488 601 -1422 601 -1422 177 -1581 177 -1581 601 -1510 601 -1510 633 -2081 633 -2081 601 -1974 601 -1974 -239 -2081 -239 -2081 -271 M -485 -202 L -485 497 Q -485 543 -467 563 -450 583 -409 583 -340 583 -340 492 L -340 -206 Q -340 -294 -409 -294 -485 -294 -485 -202 M -416 -337 Q -181 -337 -45 -207 91 -78 91 146 91 357 -43 491 -176 624 -408 624 -640 624 -780 493 -920 362 -920 139 -920 -78 -782 -207 -646 -337 -416 -337";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 2658 -306 Q 2626 -279 2626 -235 2626 -201 2646 -180 2666 -158 2723 -127 2923 -16 2987 33 3051 81 3076 136 3101 190 3101 263 3101 373 3043 446 2984 520 2884 554 2782 587 2701 587 2574 587 2464 501 L 2342 596 2342 215 2377 215 2377 219 Q 2377 313 2413 378 2448 442 2523 493 2598 544 2676 544 2747 544 2791 515 2834 485 2834 438 2834 410 2816 387 2798 362 2768 343 2737 322 2628 265 2374 132 2374 -55 2374 -190 2473 -279 2572 -370 2720 -370 L 2826 -357 Q 2883 -345 2960 -297 L 3084 -390 3084 -56 3051 -56 Q 3049 -190 2948 -262 2846 -334 2739 -334 2689 -334 2658 -306";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape75(ctx,ctrans,frame,ratio,time){
	var pathData="M 281 -194 Q 222 -128 194 1 L 158 1 158 -314 1123 -314 1123 1 1086 1 Q 1058 -128 1000 -194 941 -260 834 -282 L 834 558 951 558 951 590 329 590 329 558 446 558 446 -282 Q 339 -260 281 -194 M 2096 -176 Q 2232 -47 2232 177 2232 388 2098 522 1965 655 1733 655 1501 655 1361 524 1221 393 1221 170 1221 -47 1359 -176 1495 -306 1725 -306 1960 -306 2096 -176 M 1656 -171 L 1656 528 Q 1656 574 1674 594 1691 614 1732 614 1801 614 1801 523 L 1801 -175 Q 1801 -263 1732 -263 1656 -263 1656 -171 M -2619 -272 Q -2637 -282 -2679 -282 L -2729 -282 -2729 194 -2680 194 Q -2585 194 -2585 95 L -2585 -142 Q -2585 -204 -2594 -234 -2603 -264 -2619 -272 M -2494 -314 Q -2374 -314 -2316 -290 -2258 -266 -2223 -201 -2189 -136 -2189 -58 -2189 28 -2229 100 -2270 172 -2349 199 -2428 225 -2569 225 L -2729 225 -2729 558 -2605 558 -2605 590 -3230 590 -3230 558 -3122 558 -3122 -282 -3230 -282 -3230 -314 -2494 -314 M -2180 -314 L -1609 -314 -1609 -282 -1680 -282 -1680 104 -1521 104 -1521 -282 -1587 -282 -1587 -314 -1027 -314 -1027 -282 -1134 -282 -1134 558 -1027 558 -1027 590 -1587 590 -1587 558 -1521 558 -1521 134 -1680 134 -1680 558 -1609 558 -1609 590 -2180 590 -2180 558 -2073 558 -2073 -282 -2180 -282 -2180 -314 M -404 -306 Q -169 -306 -33 -176 103 -47 103 177 103 388 -31 522 -164 655 -396 655 -628 655 -768 524 -908 393 -908 170 -908 -47 -770 -176 -634 -306 -404 -306 M -473 -171 L -473 528 Q -473 574 -455 594 -438 614 -397 614 -328 614 -328 523 L -328 -175 Q -328 -263 -397 -263 -473 -263 -473 -171";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 2633 -312 Q 2601 -285 2601 -241 2601 -207 2621 -186 2641 -164 2698 -133 2898 -22 2962 27 3026 75 3051 130 3076 184 3076 257 3076 367 3018 440 2959 514 2859 548 2757 581 2676 581 2549 581 2439 495 L 2317 590 2317 209 2352 209 2352 213 Q 2352 307 2388 372 2423 436 2498 487 2573 538 2651 538 2722 538 2766 509 2809 479 2809 432 2809 404 2791 381 2773 356 2743 337 2712 316 2603 259 2349 126 2349 -61 2349 -196 2448 -285 2547 -376 2695 -376 L 2801 -363 Q 2858 -351 2935 -303 L 3059 -396 3059 -62 3026 -62 Q 3024 -196 2923 -268 2821 -340 2714 -340 2664 -340 2633 -312";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape76(ctx,ctrans,frame,ratio,time){
	var pathData="M 3658 -7282 Q 3667 -7291 3676 -7291 L 3765 -7282 Q 3828 -6050 3599 -4807 3547 -4521 3514 -4230 3493 -4042 3462 -3855 3636 -2991 4432 -2921 4560 -2909 4682 -2982 6746 -4194 8138 -6068 L 8192 -6015 Q 7633 -4594 6758 -3288 6261 -2547 6229 -1676 6186 -548 7370 -457 8597 -362 9831 -304 9842 -304 9851 -250 8629 176 7356 583 6641 811 6320 1455 6129 1837 6181 2281 6353 3748 7127 5033 7294 5310 7406 5604 L 7369 5710 7353 5747 7210 5747 Q 6135 4409 4747 3337 L 4408 3319 4337 3373 Q 3718 5320 3915 7383 3940 7648 3909 7922 3899 8005 3872 8085 L 3712 8103 3658 8049 Q 3520 5897 2392 4066 2251 3837 2042 3650 1928 3548 1802 3462 1529 3515 1231 3605 -79 5027 -768 6818 L -821 6871 -911 6871 -964 6818 Q -620 5335 -802 3825 -910 2936 -1827 3124 -2912 3347 -3861 3954 -4773 4538 -5640 5176 L -5801 5086 Q -4247 3667 -3341 1757 -3320 1713 -3320 1660 -4649 361 -6584 296 -6860 287 -7139 250 L -7193 143 Q -6028 -663 -5369 -1919 -5162 -2314 -5288 -2737 -5614 -3825 -6089 -4860 -6322 -5370 -6550 -5854 L -6497 -5961 -6372 -5961 Q -5078 -4171 -2963 -3498 -2538 -3499 -2142 -3659 -1426 -4359 -1281 -5418 -1186 -6109 -1198 -6818 -1207 -7441 -1152 -8045 L -1107 -8049 Q -827 -6130 -168 -4293 122 -3487 902 -3371 1259 -3319 1500 -3589 2720 -4960 3415 -6687 3514 -6933 3569 -7193 L 3658 -7282 M 2480 -2481 Q 1927 -1486 864 -1239 794 -1223 713 -1247 95 -1434 -148 -2087 -209 -2251 -286 -2410 -350 -1790 -735 -1305 -872 -1133 -1036 -982 -2951 -770 -4302 -2178 -4193 -1681 -4258 -1164 -4283 -964 -4373 -786 -3168 -646 -2286 362 -1808 907 -1946 1660 -1274 1128 -447 1178 85 1547 246 2142 272 2239 321 2320 1086 1183 2316 1583 2420 1617 2526 1690 3116 2094 3444 2695 3474 2302 3685 1962 3757 1847 3855 1749 4417 1620 4854 1963 4805 1351 5116 757 5166 661 5245 569 5329 470 5443 410 4431 -113 4584 -1194 4608 -1357 4658 -1517 4037 -977 3212 -1035 2458 -1422 2529 -2266 2543 -2442 2480 -2481 M -1333 -4745 L -1350 -4764 -1357 -4712 -1333 -4745 M -1082 -7070 L -1022 -7070 Q -1049 -7258 -1089 -7336 L -1082 -7070 M 9068 -163 L 9070 -147 9173 -161 Q 9120 -170 9068 -163";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite77(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 11;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape72",canvas,ctx,[-0.4495086669921875,-0.1803436279296875,-0.019683837890625,1.077667236328125,12568.0,-534.0],ctrans.merge(new cxform(-255,-255,-255,-255,256,256,256,256)),1,0,0,time);
			place("shape73",canvas,ctx,[1.0,0.0,0.0,1.0,138.0,505.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 1:
			place("shape72",canvas,ctx,[-0.3494720458984375,-0.4710845947265625,-0.0142974853515625,1.0621185302734375,10770.0,-534.0],ctrans.merge(new cxform(-204,-204,-204,-204,256,256,256,256)),1,0,0,time);
			place("shape73",canvas,ctx,[1.0,0.0,0.0,1.0,138.0,505.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 2:
			place("shape72",canvas,ctx,[-0.057586669921875,-0.68798828125,-0.0097198486328125,1.046630859375,8972.0,-533.0],ctrans.merge(new cxform(-153,-153,-153,-153,256,256,256,256)),1,0,0,time);
			place("shape74",canvas,ctx,[1.0,0.0,0.0,1.0,138.0,505.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 3:
			place("shape72",canvas,ctx,[0.35491943359375,-0.7088165283203125,-0.0052337646484375,1.0310821533203125,7173.0,-534.0],ctrans.merge(new cxform(-102,-102,-102,-102,256,256,256,256)),1,0,0,time);
			place("shape74",canvas,ctx,[1.0,0.0,0.0,1.0,138.0,505.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 4:
			place("shape72",canvas,ctx,[0.762908935546875,-0.469024658203125,-9.1552734375E-4,1.0155487060546875,5375.0,-535.0],ctrans.merge(new cxform(-51,-51,-51,-51,256,256,256,256)),1,0,0,time);
			place("shape75",canvas,ctx,[1.0,0.0,0.0,1.0,138.0,505.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			place("shape76",canvas,ctx,[0.7866058349609375,0.0,0.0,0.7866058349609375,-192.0,634.0],ctrans,1,0,0,time);
			break;
		case 5:
			place("shape72",canvas,ctx,[1.0,0.0,0.0,1.0,3577.0,-535.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("shape75",canvas,ctx,[1.0,0.0,0.0,1.0,138.0,505.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			place("shape76",canvas,ctx,[0.4434661865234375,0.0,0.0,0.4434661865234375,-192.0,414.0],ctrans.merge(new cxform(0,0,0,-186,256,256,256,256)),1,0,0,time);
			break;
		case 6:
			place("shape72",canvas,ctx,[1.0,0.0,0.0,1.0,3577.0,-535.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("shape74",canvas,ctx,[1.0,0.0,0.0,1.0,138.0,505.0],ctrans.merge(new cxform(0,0,0,-127,256,256,256,256)),1,0,0,time);
			place("shape76",canvas,ctx,[1.0,0.0,0.0,1.0,-192.0,414.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 7:
			place("shape72",canvas,ctx,[1.0,0.0,0.0,1.0,3577.0,-535.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("shape74",canvas,ctx,[1.0,0.0,0.0,1.0,138.0,505.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 8:
			place("shape72",canvas,ctx,[1.0,0.0,0.0,1.0,3577.0,-535.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("shape73",canvas,ctx,[1.0,0.0,0.0,1.0,138.0,505.0],ctrans,1,0,0,time);
			break;
		case 9:
			place("shape72",canvas,ctx,[1.0,0.0,0.0,1.0,3577.0,-535.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("shape73",canvas,ctx,[1.0,0.0,0.0,1.0,138.0,505.0],ctrans,1,0,0,time);
			break;
		case 10:
			place("shape72",canvas,ctx,[1.0,0.0,0.0,1.0,3577.0,-535.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("shape74",canvas,ctx,[1.0,0.0,0.0,1.0,138.0,505.0],ctrans,1,0,0,time);
			break;
	}
}

function button79(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 4;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			break;
	}
}

function shape80(ctx,ctrans,frame,ratio,time){
	var pathData="M 336 -459 L 336 -460 Q 369 -490 408 -512 581 -165 550 293 L 539 460 Q 521 769 476 1017 455 1134 521 1238 581 1336 556 1444 538 1557 375 1527 L 359 1526 Q 189 1474 91 1349 L 80 1345 48 902 47 885 Q -14 1047 29 1263 49 1363 -2 1395 -194 1531 -415 1414 L -429 1411 Q -394 1258 -394 1099 -394 1023 -407 934 -437 713 -492 499 -503 459 -544 426 -625 -69 -438 -452 L -403 -413 -403 -409 -403 -405 -400 -401 -394 -390 -385 -387 -384 -386 -382 -380 Q -467 -122 -511 179 -505 279 -480 360 -470 393 -460 386 -429 368 -423 244 -409 -30 -314 -133 -279 -143 -277 -117 -265 23 -292 183 -324 371 -334 547 -355 907 -282 1214 L -292 1218 Q -451 1441 -150 1395 20 1338 -40 1096 -91 895 9 836 26 826 47 820 L 49 821 Q 89 828 101 857 189 1074 195 1312 L 199 1325 Q 312 1449 490 1427 350 1224 408 834 461 474 353 171 284 -25 277 -215 385 -127 420 45 453 204 500 283 L 507 294 507 278 Q 500 -132 336 -459";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -382 -380 L -382 -379 -379 -384 -370 -387 -362 -385 -357 -387 -348 -385 -342 -377 -341 -371 Q -296 -345 -247 -330 -12 -245 122 -38 253 166 258 428 263 719 49 821 L 47 820 Q 26 826 9 836 -282 804 -334 547 -324 371 -292 183 -265 23 -277 -117 -279 -143 -314 -133 -409 -30 -423 244 -429 368 -460 386 -470 393 -480 360 -505 279 -511 179 -467 -122 -382 -380 M 507 278 L 507 294 500 283 507 278";
	ctx.fillStyle=tocolor(ctrans.apply([254,254,254,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -247 -330 Q -69 -278 154 -377 242 -416 311 -466 L 316 -455 325 -454 334 -456 336 -459 Q 500 -132 507 278 L 500 283 Q 453 204 420 45 385 -127 277 -215 284 -25 353 171 461 474 408 834 350 1224 490 1427 312 1449 199 1325 L 195 1312 Q 189 1074 101 857 89 828 49 821 263 719 258 428 253 166 122 -38 -12 -245 -247 -330 M 9 836 Q -91 895 -40 1096 20 1338 -150 1395 -451 1441 -292 1218 L -282 1214 Q -355 907 -334 547 -282 804 9 836";
	ctx.fillStyle=tocolor(ctrans.apply([168,184,200,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 470 -1001 Q 479 -688 174 -689 L 158 -689 Q 12 -740 -6 -919 L -6 -935 Q 93 -1178 353 -1094 431 -1069 470 -1001 M 437 -713 Q 565 -915 503 -1214 442 -1326 314 -1382 -81 -1556 -433 -1346 L -437 -1332 Q -492 -1256 -532 -1165 L -532 -1149 Q -539 -939 -492 -782 -432 -585 -286 -475 L -282 -464 Q -155 -377 -236 -557 -223 -618 -169 -632 -4 -671 12 -593 20 -556 -6 -492 -15 -443 -57 -432 L -80 -426 -56 -427 Q 178 -439 352 -609 402 -657 437 -713 M 360 -532 L 365 -532 365 -535 360 -532 M 336 -502 L 338 -512 336 -515 329 -509 334 -504 335 -503 336 -502 M 175 -1497 Q 479 -1429 601 -1181 633 -780 400 -561 L 398 -559 398 -558 397 -552 407 -533 407 -531 Q 412 -515 410 -494 L 407 -487 399 -485 Q 395 -485 393 -488 L 390 -496 386 -500 386 -501 383 -500 379 -499 380 -498 379 -491 373 -486 365 -487 358 -492 359 -489 360 -481 356 -477 364 -465 365 -458 361 -451 353 -450 347 -454 334 -472 320 -490 314 -496 313 -497 310 -495 307 -484 307 -480 Q 238 -430 150 -391 -73 -292 -251 -344 -304 -360 -352 -389 L -352 -390 -353 -394 -364 -412 -365 -411 -387 -373 -390 -362 -395 -356 -403 -355 -409 -360 -409 -368 -407 -377 -407 -378 -406 -382 -399 -410 -401 -410 Q -406 -411 -408 -414 L -419 -404 Q -422 -401 -426 -401 L -433 -403 -437 -410 -434 -417 -412 -435 -411 -436 -411 -437 -406 -462 -404 -468 -404 -469 -406 -463 -412 -439 -412 -435 -413 -438 -417 -435 -423 -435 -425 -436 -429 -431 -437 -430 -443 -435 -443 -443 -434 -470 -429 -477 -428 -482 -426 -490 -432 -493 -432 -496 -437 -504 -444 -507 Q -617 -740 -614 -1149 L -614 -1165 Q -453 -1638 175 -1497 M -85 -1063 Q -105 -1016 -124 -1082 L -138 -1116 Q -21 -1210 -85 -1063 M -515 -1017 Q -328 -1222 -249 -943 L -250 -887 Q -255 -806 -351 -804 -519 -816 -516 -1001 L -515 -1017 M -387 -448 L -388 -444 -387 -444 -385 -445 -387 -448";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 470 -1001 Q 431 -1069 353 -1094 93 -1178 -6 -935 L -6 -919 Q 12 -740 158 -689 L 174 -689 Q 479 -688 470 -1001 M -492 -782 Q -539 -939 -532 -1149 L -532 -1165 Q -492 -1256 -437 -1332 L -433 -1346 Q -81 -1556 314 -1382 442 -1326 503 -1214 565 -915 437 -713 268 -588 12 -593 -4 -671 -169 -632 -223 -618 -236 -557 -406 -618 -492 -782 M -515 -1017 L -516 -1001 Q -519 -816 -351 -804 -255 -806 -250 -887 L -249 -943 Q -328 -1222 -515 -1017 M -85 -1063 Q -21 -1210 -138 -1116 L -124 -1082 Q -105 -1016 -85 -1063";
	ctx.fillStyle=tocolor(ctrans.apply([254,254,254,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 437 -713 Q 402 -657 352 -609 178 -439 -56 -427 L -57 -432 Q -15 -443 -6 -492 20 -556 12 -593 268 -588 437 -713 M -236 -557 Q -155 -377 -282 -464 L -286 -475 Q -432 -585 -492 -782 -406 -618 -236 -557";
	ctx.fillStyle=tocolor(ctrans.apply([168,184,200,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite81(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 1;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape80",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function shape82(ctx,ctrans,frame,ratio,time){
	var pathData="M -75 -2689 L 0 -2690 Q 917 -2690 1614 -2155 1763 -2041 1902 -1902 L 1990 -1810 1203 -1079 1142 -1143 Q 669 -1616 0 -1616 L -42 -1615 -75 -2689 M 2450 1131 Q 2400 1238 2340 1340 2181 1611 1950 1853 L 1172 1112 Q 1308 969 1403 810 L 1469 685 2450 1131";
	ctx.fillStyle=tocolor(ctrans.apply([51,153,204,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -42 -1615 L 0 -1616 Q 669 -1616 1142 -1143 L 1203 -1079 Q 1616 -624 1616 0 L 1614 90 Q 1598 410 1469 685 L 1403 810 Q 1308 969 1172 1112 L 1142 1142 Q 688 1597 55 1615 L 0 1616 Q -669 1616 -1143 1142 L -1164 1121 Q -1585 686 -1614 90 L -1616 0 Q -1616 -358 -1481 -659 L -1416 -786 Q -1318 -961 -1170 -1115 L -1143 -1143 Q -684 -1601 -42 -1615";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 1990 -1810 Q 2690 -1050 2690 0 2690 615 2450 1131 L 1469 685 Q 1598 410 1614 90 L 1616 0 Q 1616 -624 1203 -1079 L 1990 -1810 M 1950 1853 L 1902 1902 Q 1145 2659 87 2689 L 55 1615 Q 688 1597 1142 1142 L 1172 1112 1950 1853 M -1951 1852 Q -2690 1079 -2690 0 -2690 -600 -2461 -1105 L -1481 -659 Q -1616 -358 -1616 0 L -1614 90 Q -1585 686 -1164 1121 L -1951 1852";
	ctx.fillStyle=tocolor(ctrans.apply([0,204,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -1948 -1855 L -1902 -1902 Q -1763 -2041 -1614 -2155 -946 -2668 -75 -2689 L -42 -1615 Q -684 -1601 -1143 -1143 L -1170 -1115 -1948 -1855";
	ctx.fillStyle=tocolor(ctrans.apply([0,102,153,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 87 2689 L 0 2690 Q -1114 2690 -1902 1902 L -1951 1852 -1164 1121 -1143 1142 Q -669 1616 0 1616 L 55 1615 87 2689 M -2461 -1105 Q -2413 -1213 -2353 -1316 -2190 -1602 -1948 -1855 L -1170 -1115 Q -1318 -961 -1416 -786 L -1481 -659 -2461 -1105";
	ctx.fillStyle=tocolor(ctrans.apply([0,102,204,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite83(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 5;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape82",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("shape82",canvas,ctx,[-0.9781494140625,-0.207916259765625,0.207916259765625,-0.9781494140625,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 2:
			place("shape82",canvas,ctx,[0.913543701171875,0.40673828125,-0.40673828125,0.913543701171875,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 3:
			place("shape82",canvas,ctx,[-0.80902099609375,-0.5877838134765625,0.5877838134765625,-0.80902099609375,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 4:
			place("shape82",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function shape84(ctx,ctrans,frame,ratio,time){
	var pathData="M 595 -2252 L 596 -2253 595 -2248 595 -2252 M 701 -2184 L 704 -2184 704 -2183 701 -2183 701 -2184";
	ctx.fillStyle=tocolor(ctrans.apply([0,204,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 456 678 L 457 680 456 679 456 678 M 704 -2183 L 701 -2183 704 -2183 M 595 -2247 L 594 -2247 594 -2248 594 -2252 595 -2252 595 -2248 595 -2247 M -505 -2293 Q -494 -2265 -510 -2266 L -505 -2293 M -355 -2372 L -346 -2352 -352 -2350 -355 -2372";
	ctx.fillStyle=tocolor(ctrans.apply([0,51,102,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 345 -2353 L 345 -2352 344 -2351 Q 323 -2291 279 -2318 L 263 -2330 Q 224 -2365 213 -2392 L 212 -2396 212 -2398 232 -2403 Q 255 -2409 212 -2431 223 -2454 266 -2468 L 279 -2468 Q 366 -2465 354 -2350 L 351 -2372 349 -2366 345 -2353 M -180 -2409 L -178 -2402 -178 -2401 Q -179 -2349 -206 -2331 L -239 -2312 Q -253 -2306 -265 -2303 -316 -2295 -345 -2351 L -346 -2352 -355 -2372 -355 -2377 Q -357 -2439 -301 -2460 L -265 -2467 -239 -2466 Q -197 -2458 -180 -2409 M -510 -2266 L -510 -2265 Q -523 -2214 -552 -2203 -578 -2194 -616 -2215 -651 -2312 -552 -2330 L -546 -2331 -515 -2318 -510 -2304 -505 -2293 -510 -2266 M -756 -2170 Q -689 -2037 -819 -2055 L -837 -2058 -845 -2073 -845 -2075 Q -880 -2157 -761 -2180 L -756 -2170 M -884 -1953 L -868 -1934 Q -855 -1916 -856 -1901 -864 -1792 -932 -1812 L -933 -1814 Q -948 -1842 -977 -1835 -988 -1893 -967 -1927 -949 -1959 -905 -1972 L -884 -1953 M -1048 -1627 Q -1039 -1586 -1070 -1571 -1081 -1566 -1098 -1564 -1194 -1638 -1085 -1706 L -1070 -1681 Q -1053 -1650 -1048 -1627 M -1105 -1435 L -1070 -1411 Q -979 -1340 -1070 -1275 L -1113 -1276 -1124 -1285 -1159 -1330 Q -1179 -1369 -1159 -1397 -1144 -1419 -1105 -1435 M -1056 -1153 Q -996 -1057 -1048 -1026 L -1070 -1017 -1082 -1015 Q -1210 -1077 -1098 -1156 L -1070 -1153 -1056 -1153 M -1034 -923 L -1013 -893 Q -979 -836 -1013 -798 -1026 -784 -1049 -772 -1059 -762 -1070 -760 L -1072 -759 -1082 -760 -1092 -764 Q -1156 -796 -1155 -831 -1155 -866 -1091 -905 L -1079 -912 -1070 -911 -1063 -911 Q -1048 -913 -1034 -923 M -1063 -629 Q -1024 -589 -1013 -560 -1004 -538 -1013 -522 -1021 -509 -1043 -501 L -1070 -495 -1090 -493 Q -1170 -597 -1070 -627 L -1063 -629 M -1028 -315 L -1013 -307 Q -940 -264 -993 -192 L -1013 -174 Q -1043 -152 -1070 -161 L -1076 -163 Q -1121 -195 -1120 -227 -1119 -259 -1070 -291 L -1064 -295 -1028 -315 M -971 -106 Q -944 -198 -900 -262 -890 -168 -889 -63 L -891 55 -842 -57 -839 -62 -819 -103 -826 -55 Q -844 87 -819 227 -784 147 -747 33 -781 224 -743 429 L -741 437 -725 486 -720 431 -720 425 Q -710 338 -682 277 -688 355 -686 431 -683 568 -655 701 -636 578 -589 450 -608 634 -557 804 L -555 809 -555 810 -553 805 -552 802 Q -516 704 -488 579 -487 713 -419 868 -408 810 -377 725 -360 878 -282 980 L -280 982 -265 968 -239 947 Q -156 883 -50 860 L -12 858 -13 816 Q -69 690 -136 601 19 616 138 603 L 138 614 Q 73 720 15 831 L 16 859 Q 81 857 138 873 199 890 249 928 L 274 948 336 846 Q 340 893 360 939 428 832 431 687 L 431 678 432 615 456 678 456 679 457 680 Q 474 732 488 802 493 830 503 852 L 519 815 Q 557 715 560 572 L 560 567 560 566 Q 561 524 554 486 L 579 566 579 567 618 709 620 716 626 752 636 713 636 712 Q 664 583 664 450 L 664 442 662 335 691 442 713 519 718 535 726 563 740 529 741 526 741 525 Q 777 423 775 293 L 776 293 820 371 832 296 Q 847 180 849 62 L 884 119 888 65 888 64 898 -125 Q 901 -170 892 -212 901 -175 921 -139 L 921 -138 932 -120 947 -99 Q 953 -60 998 -9 1023 -11 1041 -19 L 1059 16 Q 1083 70 1059 98 1039 121 986 125 863 138 944 218 1082 346 931 398 751 408 879 527 1014 614 890 715 842 737 819 694 800 658 792 630 743 691 728 744 L 713 697 705 680 Q 693 697 688 722 653 890 574 824 564 851 547 874 522 922 518 976 489 961 482 918 449 1003 389 1040 392 1009 374 997 L 334 1019 341 1042 Q 351 1083 349 1136 L 345 1183 279 1232 Q 232 1264 209 1269 L 233 1320 279 1421 298 1463 317 1505 Q 340 1559 285 1570 L 279 1571 211 1569 156 1731 Q 146 1756 116 1654 85 1552 72 1557 59 1562 91 2162 L 91 2167 86 2261 Q 79 2400 8 2584 -16 2388 8 2233 31 2077 -54 2160 L -63 2045 Q -75 1907 -129 1785 -183 1664 -193 1563 L -194 1548 -199 1552 Q -212 1561 -230 1570 L -239 1574 -265 1578 Q -284 1574 -292 1546 -313 1472 -265 1427 L -239 1407 -237 1406 Q -213 1400 -193 1360 -178 1328 -165 1276 -209 1270 -239 1251 L -265 1229 Q -287 1205 -297 1170 L -289 1123 -281 1026 -445 925 Q -445 961 -482 999 -496 908 -552 860 L -547 861 -551 859 -552 859 -574 847 -575 846 -576 845 -579 843 Q -673 788 -725 709 -725 748 -731 780 L -758 722 -759 721 Q -781 666 -787 614 -788 655 -869 672 -1019 637 -896 536 -872 528 -856 517 -783 467 -886 360 -902 373 -931 381 -993 364 -1013 338 L -1022 312 -1013 282 Q -999 256 -963 226 -927 209 -932 202 L -932 201 Q -896 156 -973 104 -985 117 -1013 112 L -1019 110 Q -1057 82 -1070 56 -1082 31 -1070 8 L -1055 -12 -1013 -17 Q -999 -23 -989 -32 -966 -56 -971 -106 M 1030 -199 Q 945 -285 1030 -350 1046 -338 1059 -334 L 1076 -331 Q 1134 -198 1074 -192 L 1059 -192 1030 -199 M 1023 -472 Q 939 -557 1051 -623 L 1059 -619 Q 1098 -602 1118 -614 1138 -490 1097 -465 1082 -456 1059 -460 1043 -463 1023 -472 M 1052 -764 L 1015 -779 Q 968 -846 1029 -915 L 1059 -891 Q 1085 -879 1110 -901 1158 -770 1101 -759 L 1059 -762 1052 -764 M 1058 -1025 Q 970 -1091 1059 -1143 L 1063 -1145 1065 -1147 Q 1107 -1131 1131 -1137 1148 -1126 1149 -1094 1152 -1026 1124 -1012 1101 -1001 1059 -1024 L 1058 -1025 M 1050 -1296 Q 981 -1373 1059 -1419 L 1095 -1436 Q 1120 -1417 1138 -1433 1167 -1315 1122 -1292 L 1059 -1293 1050 -1296 M 1081 -1552 L 1059 -1554 Q 1040 -1561 1016 -1585 988 -1664 1049 -1684 L 1059 -1687 1093 -1691 Q 1134 -1694 1126 -1642 1116 -1574 1091 -1557 L 1081 -1552 M 957 -1836 Q 938 -1823 908 -1852 819 -1937 884 -1971 909 -1978 914 -1999 978 -1962 985 -1922 979 -1866 965 -1845 L 957 -1836 M 805 -2094 Q 767 -2093 744 -2118 L 713 -2157 Q 703 -2173 704 -2183 L 755 -2194 Q 846 -2148 805 -2094 M 594 -2247 Q 592 -2208 541 -2204 474 -2261 493 -2307 504 -2336 547 -2360 588 -2298 593 -2260 L 591 -2251 594 -2252 594 -2248 594 -2247 M 282 -1093 L 279 -1095 223 -1145 279 -1198 Q 356 -1260 455 -1281 586 -1309 709 -1259 L 713 -1257 Q 830 -1210 899 -1124 L 856 -1078 Q 816 -1130 744 -1172 L 713 -1188 Q 611 -1235 497 -1199 372 -1159 282 -1093 M 279 -545 Q 290 -519 279 -486 L 258 -443 Q 243 -418 216 -412 212 -522 166 -614 259 -593 279 -545 M -445 48 L -488 -3 Q -449 -61 -380 -118 -321 -168 -265 -223 L -239 -249 -186 -305 Q -77 -269 65 -274 L 138 -281 Q 180 -289 216 -305 L 279 -247 413 -121 Q 511 -26 483 50 393 16 288 -60 L 279 -66 Q 214 -111 138 -129 L 51 -141 Q -88 -148 -212 -89 L -239 -76 -265 -62 Q -364 -11 -445 48 M 93 974 L -177 1004 Q -217 1096 -136 1161 -40 1169 107 1158 L 138 1158 202 1169 Q 228 1146 236 1125 L 239 1112 239 1110 Q 244 982 138 973 L 93 974 M -878 -1091 L -912 -1124 Q -824 -1214 -696 -1264 -625 -1292 -552 -1296 L -432 -1286 Q -330 -1265 -265 -1206 L -239 -1179 -214 -1146 -239 -1110 -258 -1087 -259 -1087 -265 -1092 Q -314 -1129 -399 -1164 -473 -1194 -552 -1194 L -661 -1180 Q -791 -1148 -878 -1091 M -202 -585 Q -172 -612 -122 -606 -154 -524 -158 -420 -213 -432 -239 -452 -286 -487 -239 -547 L -202 -585";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 282 -1093 Q 372 -1159 497 -1199 611 -1235 713 -1188 L 744 -1172 Q 816 -1130 856 -1078 797 -1029 713 -1013 L 702 -1011 Q 569 -988 441 -1022 348 -1047 282 -1093 M 483 50 Q 458 101 396 91 L 324 77 279 69 138 50 65 45 Q -70 39 -201 52 L -239 56 -265 57 -445 48 Q -364 -11 -265 -62 L -239 -76 -212 -89 Q -88 -148 51 -141 L 138 -129 Q 214 -111 279 -66 L 288 -60 Q 393 16 483 50 M 93 974 L 138 973 Q 244 982 239 1110 L 239 1112 236 1125 Q 228 1146 202 1169 L 138 1158 107 1158 Q -40 1169 -136 1161 -217 1096 -177 1004 L 93 974 M -878 -1091 Q -791 -1148 -661 -1180 L -552 -1194 Q -473 -1194 -399 -1164 -314 -1129 -265 -1092 L -259 -1087 -258 -1087 -259 -1086 -265 -1080 Q -338 -1004 -436 -992 L -552 -986 Q -627 -987 -700 -1003 -804 -1027 -878 -1091";
	ctx.fillStyle=tocolor(ctrans.apply([0,153,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 143 606 L 138 614 138 603 143 606 M 713 -877 L 726 -880 726 -877 713 -877";
	ctx.fillStyle=tocolor(ctrans.apply([255,102,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -829 -2047 L -822 -2036 Q -769 -1949 -884 -1953 L -897 -1976 -898 -1977 Q -923 -2034 -848 -2072 L -837 -2058 -829 -2047 M -1098 -1564 Q -1079 -1542 -1070 -1524 -1050 -1485 -1070 -1459 -1081 -1445 -1105 -1435 -1205 -1499 -1098 -1564 M -1043 -501 L -1013 -468 Q -965 -401 -1013 -333 L -1028 -315 Q -1053 -304 -1070 -305 -1094 -306 -1102 -330 L -1126 -365 Q -1178 -455 -1090 -493 L -1070 -495 -1043 -501 M 1030 -350 Q 950 -429 1023 -472 1043 -463 1059 -460 1082 -456 1097 -465 1118 -335 1076 -331 L 1059 -334 Q 1046 -338 1030 -350 M 1095 -1436 Q 1078 -1449 1059 -1477 1045 -1513 1059 -1534 1066 -1545 1081 -1552 L 1093 -1554 Q 1181 -1564 1167 -1501 1156 -1449 1138 -1433 1120 -1417 1095 -1436 M 884 -1971 Q 730 -1949 805 -2094 860 -2125 889 -2078 919 -2026 914 -1999 909 -1978 884 -1971 M 726 -877 Q 730 -793 717 -713 L 713 -688 668 -448 Q 640 -311 589 -181 554 -267 489 -319 499 -335 525 -408 550 -482 558 -604 L 570 -869 713 -877 726 -877 M -669 -877 Q -611 -871 -555 -876 -570 -720 -555 -578 L -552 -554 Q -535 -431 -481 -319 L -552 -235 -574 -211 -643 -392 Q -688 -521 -694 -657 -700 -798 -718 -885 L -669 -877";
	ctx.fillStyle=tocolor(ctrans.apply([255,153,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -346 -2352 L -352 -2350 -346 -2352 M -819 -2055 L -829 -2047 -837 -2058 -819 -2055";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([51,51,51,1]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.24261474609375,0,0,0.24261474609375,-51,1566);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.2823529411764706,tocolor(ctrans.apply([51,51,51,1])));
	grd.addColorStop(0.7098039215686275,tocolor(ctrans.apply([51,51,51,1])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M -932 -1812 Q -869 -1688 -996 -1715 L -1013 -1746 Q -1026 -1780 -1014 -1803 L -1013 -1805 Q -1003 -1823 -977 -1835 -952 -1818 -932 -1812 M -1070 -1275 Q -995 -1190 -1056 -1153 L -1070 -1153 -1098 -1156 Q -1198 -1174 -1113 -1276 L -1070 -1275 M -1048 -1026 Q -986 -984 -1034 -923 -1048 -913 -1063 -911 L -1070 -911 -1079 -912 -1087 -914 -1100 -920 Q -1217 -983 -1082 -1015 L -1070 -1017 -1048 -1026 M -1049 -772 L -1013 -721 Q -992 -680 -1013 -655 -1028 -638 -1063 -629 L -1068 -631 -1070 -632 Q -1189 -684 -1085 -751 L -1072 -759 -1070 -760 Q -1059 -762 -1049 -772 M -993 -192 Q -975 -142 -971 -106 L -989 -32 Q -999 -23 -1013 -17 L -1055 -12 -1070 -23 Q -1152 -90 -1076 -163 L -1070 -161 Q -1043 -152 -1013 -174 L -993 -192 M 947 -99 Q 945 -110 946 -120 L 948 -130 Q 959 -174 1030 -199 L 1059 -192 1074 -192 Q 1109 -71 1059 -30 L 1041 -19 Q 1023 -11 998 -9 953 -60 947 -99 M 1051 -623 Q 947 -708 1052 -764 L 1059 -762 1101 -759 Q 1127 -744 1132 -711 1145 -633 1118 -614 1098 -602 1059 -619 L 1051 -623 M 1029 -915 Q 974 -993 1058 -1025 L 1059 -1024 Q 1101 -1001 1124 -1012 1155 -972 1140 -943 1125 -915 1110 -901 1085 -879 1059 -891 L 1029 -915 M 1065 -1147 L 1063 -1148 1059 -1152 Q 976 -1223 1050 -1296 L 1059 -1293 1122 -1292 Q 1148 -1286 1155 -1259 1182 -1150 1131 -1137 1107 -1131 1065 -1147 M 1036 -1727 Q 1021 -1714 986 -1721 898 -1768 957 -1836 L 968 -1841 1021 -1843 Q 1063 -1751 1036 -1727 M 986 125 Q 1060 242 944 218 863 138 986 125 M -963 226 Q -994 220 -1013 210 -1077 178 -1019 110 L -1013 112 Q -985 117 -973 104 -896 156 -932 201 L -963 226";
	ctx.fillStyle=tocolor(ctrans.apply([153,102,51,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -616 -2215 Q -568 -2157 -674 -2124 -730 -2154 -743 -2177 L -745 -2182 Q -753 -2202 -725 -2216 -716 -2239 -657 -2251 L -616 -2215 M 701 -2183 Q 694 -2137 634 -2166 594 -2217 595 -2247 L 595 -2248 596 -2253 Q 683 -2284 691 -2257 704 -2210 701 -2184 L 701 -2183";
	ctx.fillStyle=tocolor(ctrans.apply([255,204,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -352 -2350 Q -343 -2249 -510 -2266 -494 -2265 -505 -2293 L -504 -2304 Q -503 -2311 -515 -2318 -521 -2349 -475 -2376 -421 -2408 -395 -2407 -362 -2405 -356 -2377 L -355 -2372 -352 -2350 M 480 -2316 L 443 -2267 Q 358 -2305 354 -2349 370 -2407 424 -2439 523 -2396 480 -2316";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 931 398 Q 1025 534 879 527 751 408 931 398 M -896 536 Q -982 508 -990 470 -1000 431 -931 381 -902 373 -886 360 -783 467 -856 517 -872 528 -896 536";
	ctx.fillStyle=tocolor(ctrans.apply([102,51,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 518 -2058 Q 568 -1958 610 -1830 641 -1737 651 -1645 L 574 -1667 503 -1677 Q 472 -1806 406 -1927 L 458 -2000 460 -2002 484 -2027 518 -2058 M -653 -1653 Q -619 -1774 -567 -1888 L -552 -1919 Q -509 -2002 -452 -2051 -420 -2022 -371 -1959 -426 -1862 -461 -1736 L -473 -1677 -516 -1676 -552 -1673 -653 -1653";
	ctx.fillStyle=tocolor(ctrans.apply([140,95,28,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 212 -2431 Q 255 -2409 232 -2403 L 212 -2398 212 -2396 213 -2392 Q 224 -2365 263 -2330 L 279 -2318 Q 323 -2291 344 -2351 L 345 -2352 345 -2353 354 -2350 354 -2349 Q 358 -2305 443 -2267 L 480 -2316 493 -2307 Q 474 -2261 541 -2204 592 -2208 594 -2247 L 595 -2247 Q 594 -2217 634 -2166 694 -2137 701 -2183 L 704 -2183 Q 703 -2173 713 -2157 L 744 -2118 Q 767 -2093 805 -2094 730 -1949 884 -1971 819 -1937 908 -1852 938 -1823 957 -1836 898 -1768 986 -1721 1021 -1714 1036 -1727 L 1049 -1684 Q 988 -1664 1016 -1585 1040 -1561 1059 -1554 L 1081 -1552 Q 1066 -1545 1059 -1534 1045 -1513 1059 -1477 1078 -1449 1095 -1436 L 1059 -1419 Q 981 -1373 1050 -1296 976 -1223 1059 -1152 L 1063 -1148 1065 -1147 1063 -1145 1059 -1143 Q 970 -1091 1058 -1025 974 -993 1029 -915 968 -846 1015 -779 L 1052 -764 Q 947 -708 1051 -623 939 -557 1023 -472 950 -429 1030 -350 945 -285 1030 -199 959 -174 948 -130 L 946 -120 Q 945 -110 947 -99 L 932 -120 921 -138 921 -139 Q 901 -175 892 -212 901 -170 898 -125 L 888 64 888 65 884 119 849 62 Q 847 180 832 296 L 820 371 776 293 775 292 775 293 Q 777 423 741 525 L 741 526 740 529 726 563 718 535 713 519 691 442 662 335 664 442 664 450 Q 664 583 636 712 L 636 713 626 752 620 716 618 709 579 567 579 566 554 486 Q 561 524 560 566 L 560 567 560 572 Q 557 715 519 815 L 503 852 Q 493 830 488 802 474 732 457 680 L 456 678 432 615 431 678 431 687 Q 428 832 360 939 340 893 336 846 L 274 948 249 928 Q 199 890 138 873 81 857 16 859 L 15 831 Q 73 720 138 614 L 143 606 145 602 138 603 Q 19 616 -136 601 -69 690 -13 816 L -12 858 -50 860 Q -156 883 -239 947 L -265 968 -282 980 Q -360 878 -377 725 -408 810 -419 868 -487 713 -488 579 -516 704 -552 802 L -557 804 Q -608 634 -589 450 -636 578 -655 701 -683 568 -686 431 -688 355 -682 277 -710 338 -720 425 L -720 431 -725 486 -741 437 -743 429 Q -781 224 -747 33 -784 147 -819 227 -844 87 -826 -55 L -819 -103 -839 -62 -842 -57 -891 55 -889 -63 Q -890 -168 -900 -262 -944 -198 -971 -106 -975 -142 -993 -192 -940 -264 -1013 -307 L -1028 -315 -1013 -333 Q -965 -401 -1013 -468 L -1043 -501 Q -1021 -509 -1013 -522 -1004 -538 -1013 -560 -1024 -589 -1063 -629 -1028 -638 -1013 -655 -992 -680 -1013 -721 L -1049 -772 Q -1026 -784 -1013 -798 -979 -836 -1013 -893 L -1034 -923 Q -986 -984 -1048 -1026 -996 -1057 -1056 -1153 -995 -1190 -1070 -1275 -979 -1340 -1070 -1411 L -1105 -1435 Q -1081 -1445 -1070 -1459 -1050 -1485 -1070 -1524 -1079 -1542 -1098 -1564 -1081 -1566 -1070 -1571 -1039 -1586 -1048 -1627 -1036 -1667 -1013 -1696 L -996 -1715 Q -869 -1688 -932 -1812 -864 -1792 -856 -1901 -855 -1916 -868 -1934 L -884 -1953 Q -769 -1949 -822 -2036 L -829 -2047 -819 -2055 Q -689 -2037 -756 -2170 L -743 -2177 Q -730 -2154 -674 -2124 -568 -2157 -616 -2215 -578 -2194 -552 -2203 -523 -2214 -510 -2265 L -510 -2266 Q -343 -2249 -352 -2350 L -346 -2352 -345 -2351 Q -316 -2295 -265 -2303 -253 -2306 -239 -2312 L -206 -2331 Q -179 -2349 -178 -2401 L -178 -2402 -180 -2409 -79 -2441 98 -2447 212 -2431 M 518 -2058 L 484 -2027 460 -2002 458 -2000 406 -1927 Q 472 -1806 503 -1677 L 574 -1667 651 -1645 Q 641 -1737 610 -1830 568 -1958 518 -2058 M 856 -1078 L 899 -1124 Q 830 -1210 713 -1257 L 709 -1259 Q 586 -1309 455 -1281 356 -1260 279 -1198 L 223 -1145 279 -1095 282 -1093 Q 348 -1047 441 -1022 569 -988 702 -1011 L 713 -1013 Q 797 -1029 856 -1078 M 713 -877 L 570 -869 558 -604 Q 550 -482 525 -408 499 -335 489 -319 554 -267 589 -181 640 -311 668 -448 L 713 -688 717 -713 Q 730 -793 726 -877 L 726 -880 713 -877 M 483 50 Q 511 -26 413 -121 L 279 -247 216 -305 Q 180 -289 138 -281 L 65 -274 Q -77 -269 -186 -305 L -239 -249 -265 -223 Q -321 -168 -380 -118 -449 -61 -488 -3 L -445 48 -265 57 -239 56 -201 52 Q -70 39 65 45 L 138 50 279 69 324 77 396 91 Q 458 101 483 50 M 279 -545 Q 259 -593 166 -614 212 -522 216 -412 243 -418 258 -443 L 279 -486 Q 290 -519 279 -545 M -653 -1653 L -552 -1673 -516 -1676 -473 -1677 -461 -1736 Q -426 -1862 -371 -1959 -420 -2022 -452 -2051 -509 -2002 -552 -1919 L -567 -1888 Q -619 -1774 -653 -1653 M -258 -1087 L -239 -1110 -214 -1146 -239 -1179 -265 -1206 Q -330 -1265 -432 -1286 L -552 -1296 Q -625 -1292 -696 -1264 -824 -1214 -912 -1124 L -878 -1091 Q -804 -1027 -700 -1003 -627 -987 -552 -986 L -436 -992 Q -338 -1004 -265 -1080 L -259 -1086 -258 -1087 M -202 -585 L -239 -547 Q -286 -487 -239 -452 -213 -432 -158 -420 -154 -524 -122 -606 -172 -612 -202 -585 M -669 -877 L -718 -885 Q -700 -798 -694 -657 -688 -521 -643 -392 L -574 -211 -552 -235 -481 -319 Q -535 -431 -552 -554 L -555 -578 Q -570 -720 -555 -876 -611 -871 -669 -877";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([102,102,102,1]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.22686767578125,0,0,0.22686767578125,100,-2717);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.0,tocolor(ctrans.apply([51,51,51,1])));
	grd.addColorStop(1.0,tocolor(ctrans.apply([102,102,102,1])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
}

function shape85(ctx,ctrans,frame,ratio,time){
	var pathData="M 875 -1739 L 5203 10152 Q 5083 13133 4505 12925 3926 12716 3057 12051 L 308 -1739 Q 623 -1998 870 -1744 L 875 -1739";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([0,204,255,0.0]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.9384765625,0,0,0.9384765625,308,-1739);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.0,tocolor(ctrans.apply([0,153,255,1])));
	grd.addColorStop(0.9450980392156862,tocolor(ctrans.apply([0,204,255,0.0])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M -858 -1759 Q -492 -1965 -241 -1754 L -2706 12921 Q -5882 14644 -5959 10601 L -1961 979 -860 -1757 -858 -1759";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([0,204,255,0.0]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.9686279296875,0,0,0.9686279296875,-241,-1754);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.0,tocolor(ctrans.apply([0,153,255,1])));
	grd.addColorStop(0.9450980392156862,tocolor(ctrans.apply([0,204,255,0.0])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
}

function sprite86(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 20;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 1:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-242,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 2:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-228,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 3:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-215,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(0,0,0,-253,256,256,256,256)),1,0,0,time);
			break;
		case 4:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-201,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(0,0,1,-251,256,256,256,256)),1,0,0,time);
			break;
		case 5:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-188,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(0,0,1,-247,256,256,256,256)),1,0,0,time);
			break;
		case 6:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-174,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(0,0,2,-243,256,256,256,256)),1,0,0,time);
			break;
		case 7:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-161,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(-1,0,3,-238,256,256,256,256)),1,0,0,time);
			break;
		case 8:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-148,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(-1,1,4,-231,256,256,256,256)),1,0,0,time);
			break;
		case 9:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-134,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(-1,1,5,-224,256,256,256,256)),1,0,0,time);
			break;
		case 10:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-121,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(-1,1,7,-216,256,256,256,256)),1,0,0,time);
			break;
		case 11:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-107,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(-2,1,8,-207,256,256,256,256)),1,0,0,time);
			break;
		case 12:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-94,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(-2,1,10,-196,256,256,256,256)),1,0,0,time);
			break;
		case 13:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-81,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(-2,2,12,-185,256,256,256,256)),1,0,0,time);
			break;
		case 14:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-67,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(-3,2,14,-173,256,256,256,256)),1,0,0,time);
			break;
		case 15:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-54,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(-3,2,16,-160,256,256,256,256)),1,0,0,time);
			break;
		case 16:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-40,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(-3,3,19,-146,256,256,256,256)),1,0,0,time);
			break;
		case 17:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-27,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(-4,3,21,-131,256,256,256,256)),1,0,0,time);
			break;
		case 18:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-13,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(-4,4,24,-115,256,256,256,256)),1,0,0,time);
			break;
		case 19:
			place("shape84",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("shape85",canvas,ctx,[1.0,0.0,0.0,1.0,-26.0,663.0],ctrans.merge(new cxform(-5,4,27,-98,256,256,256,256)),1,0,0,time);
			break;
	}
}

function shape87(ctx,ctrans,frame,ratio,time){
	var pathData="M 360 -999 L 370 -1003 Q 414 -951 408 -870 401 -788 403 -705 L 400 -648 633 -636 Q 646 -634 648 -620 658 -523 541 -541 L 517 -542 392 -533 Q 396 -334 407 -136 412 -58 380 5 297 0 311 -101 324 -203 316 -303 305 -429 250 -543 L 245 -558 Q 213 -575 190 -603 L 188 -618 187 -633 Q 199 -657 225 -668 L 332 -653 348 -980 352 -995 360 -999 M 40 -678 L 49 -681 50 -683 75 -680 82 -672 92 -658 Q 47 -514 -66 -411 L -80 -398 Q -114 -387 -130 -415 L 28 -662 40 -678 M 10 -233 L -8 -238 -28 -240 Q -96 -218 -106 -143 L -108 -135 Q -79 -125 -33 -162 -4 -185 15 -210 L 16 -218 14 -225 10 -233 M 214 -63 Q 64 87 -126 7 -156 -6 -175 -33 -204 -145 -142 -244 -107 -300 -43 -315 102 -318 82 -193 73 -134 12 -104 L -85 -58 Q 63 -18 154 -152 174 -183 207 -160 269 -119 214 -63 M 583 -359 L 627 -368 Q 806 -361 808 -183 810 -18 676 64 610 105 540 67 473 31 462 -38 448 -127 531 -149 602 -167 670 -147 L 707 -138 Q 721 -156 719 -180 716 -227 697 -270 622 -319 540 -270 L 515 -275 Q 508 -276 502 -280 L 498 -288 495 -303 495 -310 Q 533 -343 583 -359 M 600 -23 Q 642 -17 670 -40 626 -80 557 -60 562 -39 587 -29 L 600 -23 M 948 537 Q 1016 698 936 860 889 955 823 875 811 861 820 844 872 737 864 625 863 604 852 587 758 581 707 683 689 718 674 755 L 652 815 640 830 602 832 587 817 Q 629 601 622 375 620 295 652 237 685 392 677 560 L 677 567 Q 777 433 928 515 L 948 537 M 497 480 L 492 481 462 480 458 472 446 448 437 435 402 431 380 435 374 450 364 487 362 495 Q 419 571 504 630 535 651 533 690 528 790 443 859 L 415 877 Q 316 904 256 836 192 764 247 693 255 683 268 686 325 697 332 759 L 337 775 342 777 387 777 Q 402 762 419 749 L 460 710 461 702 462 687 462 672 Q 391 616 330 555 284 509 301 445 319 376 390 360 520 363 499 475 L 497 480 M 39 694 L 15 700 8 708 -1 722 -5 730 2 745 20 775 87 777 95 763 110 732 105 718 85 690 82 688 65 688 60 690 39 694 M 130 600 Q 133 486 27 484 -2 484 -26 499 L -50 512 -64 505 -78 492 Q -40 408 57 405 178 423 206 550 249 746 110 872 L 84 883 Q 27 885 -11 869 -102 973 -235 930 L -253 915 Q -321 810 -308 677 -285 463 -200 262 L -162 168 Q -151 138 -125 127 L -110 130 -103 138 -98 145 -198 529 Q -240 684 -190 835 -134 842 -88 784 L -84 780 -90 725 Q -89 631 0 606 L 130 600 M -863 -615 L -818 -615 Q -682 -490 -580 -335 -540 -562 -434 -771 L -425 -790 Q -415 -817 -390 -828 -292 -821 -273 -708 -225 -416 -241 -116 L -246 110 Q -245 175 -281 228 L -298 245 -343 245 Q -398 192 -375 108 L -365 58 Q -333 -238 -360 -535 L -370 -593 Q -472 -384 -487 -151 -492 -77 -565 -103 -600 -116 -614 -152 L -646 -213 -753 -373 Q -713 -110 -699 158 -697 192 -725 210 L -758 210 Q -796 151 -808 75 L -902 -517 Q -912 -581 -863 -615 M -684 494 Q -701 561 -692 626 -603 618 -510 625 -418 640 -467 716 -482 738 -510 738 L -661 731 Q -623 819 -571 895 -564 905 -572 919 L -583 932 -588 933 -618 932 Q -721 839 -758 722 L -884 704 -900 695 -902 687 -902 680 -900 665 -777 637 Q -784 577 -777 513 -756 325 -565 302 -340 327 -345 550 -346 593 -389 586 -457 577 -459 500 -461 433 -529 413 -655 377 -684 494";
	ctx.fillStyle=tocolor(ctrans.apply([0,153,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape88(ctx,ctrans,frame,ratio,time){
	var pathData="M 417 -540 L 432 -173 Q 433 -77 400 5 318 -1 327 -101 333 -172 321 -243 298 -374 243 -495 L 203 -591 Q 190 -623 220 -643 L 250 -653 345 -660 Q 342 -801 358 -937 L 362 -950 367 -952 380 -955 395 -950 Q 423 -816 415 -673 L 415 -660 Q 534 -659 644 -617 663 -610 665 -587 669 -544 630 -523 595 -513 577 -533 L 417 -540 M 80 -723 Q 136 -660 71 -580 L -41 -453 Q -90 -402 -120 -453 -8 -575 73 -718 L 80 -723 M 17 -293 L -20 -293 Q -84 -251 -97 -180 L -98 -173 Q -47 -164 5 -212 33 -238 27 -278 L 24 -285 17 -293 M 25 -149 Q -18 -123 -65 -105 -3 -24 101 -105 146 -140 182 -183 L 215 -183 Q 262 -115 179 -59 L 145 -36 Q 22 45 -93 -35 -182 -96 -160 -200 -136 -313 -30 -363 116 -365 82 -227 70 -176 25 -149 M 591 -338 L 637 -345 Q 786 -338 822 -191 850 -79 768 -2 662 99 535 26 451 -21 489 -114 513 -174 580 -177 670 -182 747 -133 751 -168 738 -199 718 -247 672 -273 L 572 -266 555 -263 547 -256 539 -251 530 -248 Q 522 -250 516 -255 L 502 -268 Q 530 -318 591 -338 M 570 -82 L 565 -75 Q 568 -60 586 -51 L 595 -45 Q 636 -29 682 -45 658 -91 587 -91 L 582 -90 570 -82 M 947 569 Q 985 751 878 887 868 900 844 893 815 884 818 855 824 798 839 740 L 849 675 Q 851 618 832 565 733 551 688 650 L 587 885 555 887 545 880 Q 545 795 566 706 615 497 612 280 612 237 635 212 L 647 215 Q 684 373 650 537 L 650 545 Q 743 406 895 495 936 519 947 569 M 442 432 Q 415 420 385 432 337 545 461 596 486 607 499 633 562 763 451 869 380 937 298 877 193 799 261 699 273 680 297 679 399 673 365 765 L 352 773 342 780 348 786 370 802 377 807 Q 396 808 412 798 434 783 445 757 L 445 742 Q 445 727 452 712 458 697 452 682 L 447 675 437 660 430 647 Q 303 597 311 460 316 390 380 372 509 356 519 460 L 517 467 512 471 500 473 482 470 Q 469 443 442 432 M 97 385 Q 301 506 212 732 174 830 85 876 26 907 -31 885 L -75 913 -113 935 Q -300 956 -316 775 -333 576 -269 383 -216 225 -123 92 L -122 85 -120 77 -110 71 -100 67 -89 73 -80 80 Q -105 218 -155 359 -217 533 -230 717 -225 773 -200 822 L -195 830 -173 840 Q -138 835 -109 818 -123 788 -120 748 -108 595 60 596 113 596 160 625 168 613 164 597 156 568 154 537 L 152 530 117 492 Q 95 473 67 462 L 57 465 17 472 -4 485 -35 510 -60 509 -85 500 -88 492 -90 477 -90 470 Q -52 430 -3 403 20 390 47 384 L 47 382 97 385 M 59 688 L 40 687 Q 2 691 -27 713 L -33 720 -35 735 -33 780 -28 787 -20 795 -13 802 75 802 105 762 122 735 Q 105 696 59 688 M -874 -554 Q -889 -581 -870 -606 -834 -650 -795 -601 -707 -490 -626 -375 L -588 -323 Q -551 -546 -447 -743 -435 -766 -415 -778 -309 -761 -288 -646 -254 -466 -252 -280 -250 -42 -297 184 -299 196 -313 196 -405 194 -388 91 -364 -55 -356 -207 -345 -423 -389 -627 L -395 -643 Q -478 -402 -518 -151 -519 -143 -529 -141 -621 -126 -638 -225 -706 -298 -758 -381 L -778 -410 -734 56 -725 122 -731 129 -740 135 -757 131 -768 125 Q -807 -136 -829 -401 -836 -484 -874 -554 M -570 405 Q -729 466 -660 627 L -647 658 -498 664 Q -479 665 -477 685 -467 784 -572 757 L -607 749 -558 860 Q -541 898 -543 937 L -545 942 -558 947 Q -656 868 -711 743 L -888 722 -906 707 -915 699 -920 692 -922 685 -923 677 -915 662 -910 655 -901 651 -900 650 -743 654 -753 617 Q -785 477 -707 367 -695 350 -676 338 -620 302 -560 295 -399 336 -352 507 -345 535 -352 562 -374 640 -446 584 L -461 561 Q -487 476 -546 421 -557 411 -570 405";
	ctx.fillStyle=tocolor(ctrans.apply([0,204,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -874 -554 Q -889 -581 -870 -606 -834 -650 -795 -601 -707 -490 -626 -375 L -588 -323 Q -551 -546 -447 -743 -435 -766 -415 -778 -309 -761 -288 -646 -254 -466 -252 -280 -250 -42 -297 184 -299 196 -313 196 -405 194 -388 91 -364 -55 -356 -207 -345 -423 -389 -627 L -395 -643 Q -478 -402 -518 -151 -519 -143 -529 -141 -621 -126 -638 -225 -706 -298 -758 -381 L -778 -410 -734 56 -725 122 -731 129 -740 135 -757 131 -768 125 Q -807 -136 -829 -401 -836 -484 -874 -554";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=1.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

	var pathData="M 417 -540 L 432 -173 Q 433 -77 400 5 318 -1 327 -101 333 -172 321 -243 298 -374 243 -495 L 203 -591 Q 190 -623 220 -643 L 250 -653 345 -660 Q 342 -801 358 -937 L 362 -950 367 -952 380 -955 395 -950 Q 423 -816 415 -673 L 415 -660 Q 534 -659 644 -617 663 -610 665 -587 669 -544 630 -523 595 -513 577 -533 L 417 -540 M 80 -723 Q 136 -660 71 -580 L -41 -453 Q -90 -402 -120 -453 -8 -575 73 -718 L 80 -723 M 17 -293 L -20 -293 Q -84 -251 -97 -180 L -98 -173 Q -47 -164 5 -212 33 -238 27 -278 L 24 -285 17 -293 M 25 -149 Q -18 -123 -65 -105 -3 -24 101 -105 146 -140 182 -183 L 215 -183 Q 262 -115 179 -59 L 145 -36 Q 22 45 -93 -35 -182 -96 -160 -200 -136 -313 -30 -363 116 -365 82 -227 70 -176 25 -149 M 591 -338 L 637 -345 Q 786 -338 822 -191 850 -79 768 -2 662 99 535 26 451 -21 489 -114 513 -174 580 -177 670 -182 747 -133 751 -168 738 -199 718 -247 672 -273 L 572 -266 555 -263 547 -256 539 -251 530 -248 Q 522 -250 516 -255 L 502 -268 Q 530 -318 591 -338 M 570 -82 L 565 -75 Q 568 -60 586 -51 L 595 -45 Q 636 -29 682 -45 658 -91 587 -91 L 582 -90 570 -82 M 947 569 Q 985 751 878 887 868 900 844 893 815 884 818 855 824 798 839 740 L 849 675 Q 851 618 832 565 733 551 688 650 L 587 885 555 887 545 880 Q 545 795 566 706 615 497 612 280 612 237 635 212 L 647 215 Q 684 373 650 537 L 650 545 Q 743 406 895 495 936 519 947 569 M 442 432 Q 415 420 385 432 337 545 461 596 486 607 499 633 562 763 451 869 380 937 298 877 193 799 261 699 273 680 297 679 399 673 365 765 L 352 773 342 780 348 786 370 802 377 807 Q 396 808 412 798 434 783 445 757 L 445 742 Q 445 727 452 712 458 697 452 682 L 447 675 437 660 430 647 Q 303 597 311 460 316 390 380 372 509 356 519 460 L 517 467 512 471 500 473 482 470 Q 469 443 442 432 M 97 385 Q 301 506 212 732 174 830 85 876 26 907 -31 885 L -75 913 -113 935 Q -300 956 -316 775 -333 576 -269 383 -216 225 -123 92 L -122 85 -120 77 -110 71 -100 67 -89 73 -80 80 Q -105 218 -155 359 -217 533 -230 717 -225 773 -200 822 L -195 830 -173 840 Q -138 835 -109 818 -123 788 -120 748 -108 595 60 596 113 596 160 625 168 613 164 597 156 568 154 537 L 152 530 117 492 Q 95 473 67 462 L 57 465 17 472 -4 485 -35 510 -60 509 -85 500 -88 492 -90 477 -90 470 Q -52 430 -3 403 20 390 47 384 L 47 382 97 385 M 59 688 L 40 687 Q 2 691 -27 713 L -33 720 -35 735 -33 780 -28 787 -20 795 -13 802 75 802 105 762 122 735 Q 105 696 59 688 M -570 405 Q -729 466 -660 627 L -647 658 -498 664 Q -479 665 -477 685 -467 784 -572 757 L -607 749 -558 860 Q -541 898 -543 937 L -545 942 -558 947 Q -656 868 -711 743 L -888 722 -906 707 -915 699 -920 692 -922 685 -923 677 -915 662 -910 655 -901 651 -900 650 -743 654 -753 617 Q -785 477 -707 367 -695 350 -676 338 -620 302 -560 295 -399 336 -352 507 -345 535 -352 562 -374 640 -446 584 L -461 561 Q -487 476 -546 421 -557 411 -570 405 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=1.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape89(ctx,ctrans,frame,ratio,time){
	var pathData="M 392 -1048 Q 425 -962 421 -860 417 -760 420 -660 558 -683 676 -633 690 -627 689 -610 686 -565 640 -564 L 425 -560 453 -141 Q 461 -20 438 91 L 425 107 Q 331 90 342 -16 350 -87 343 -158 L 316 -428 Q 310 -500 292 -570 215 -598 212 -668 267 -732 337 -670 347 -840 347 -1013 347 -1029 357 -1043 L 365 -1047 369 -1049 370 -1050 392 -1048 M 75 -703 L 82 -695 87 -672 90 -665 Q 48 -498 -95 -390 L -125 -390 Q -144 -401 -145 -420 -38 -534 32 -675 L 62 -703 70 -703 75 -703 M 77 -183 Q 30 -125 -36 -90 L -60 -78 Q -38 -14 46 -37 59 -41 65 -55 89 -115 135 -158 229 -139 183 -42 107 113 -59 62 -80 55 -98 40 -237 -82 -155 -259 L -130 -292 Q -93 -326 -45 -338 100 -322 79 -190 L 77 -183 M 752 -300 Q 642 -308 540 -255 L 523 -262 517 -268 Q 542 -300 579 -324 624 -354 670 -373 L 775 -370 Q 945 -248 859 -56 788 103 615 99 605 98 597 90 460 26 498 -131 507 -167 542 -180 L 605 -198 Q 701 -183 773 -119 L 787 -98 Q 796 -99 801 -111 817 -159 814 -210 L 812 -225 808 -233 Q 791 -268 760 -293 L 752 -300 M 604 -27 L 617 -13 Q 668 0 717 -23 717 -39 701 -54 L 695 -65 Q 658 -89 615 -93 L 587 -88 587 -73 587 -50 Q 592 -37 604 -27 M 898 917 Q 888 930 864 923 835 914 838 885 L 858 718 870 615 Q 857 586 830 570 702 584 660 724 632 817 582 897 L 555 897 545 890 Q 556 756 573 619 L 605 304 Q 609 253 629 209 633 201 640 200 L 652 205 Q 676 402 638 602 L 637 617 Q 687 524 785 477 957 468 974 630 992 796 898 917 M 467 412 L 461 406 450 397 445 392 387 395 Q 371 427 378 463 386 504 417 537 563 595 536 754 528 802 505 845 376 973 265 833 192 739 280 665 L 317 665 Q 338 674 344 695 351 723 335 747 L 337 755 339 762 Q 344 779 355 792 L 362 800 389 795 Q 414 788 435 772 451 748 455 720 460 681 447 645 L 441 638 432 630 Q 414 617 392 612 325 560 323 477 321 440 325 402 L 330 395 335 387 365 352 370 351 379 349 380 347 Q 456 336 506 388 L 512 395 512 402 511 410 505 432 499 436 490 440 478 434 470 427 468 420 467 412 M 70 390 Q 184 407 214 529 266 741 76 843 34 865 -5 859 -19 884 -55 904 L -121 939 -209 942 -250 922 Q -268 912 -268 890 -319 758 -289 610 -253 430 -191 259 -167 195 -125 142 L -120 141 -111 139 -110 137 Q -89 142 -86 165 L -85 172 Q -219 433 -227 727 L -223 795 -189 838 -188 840 -158 845 Q -129 816 -96 796 L -111 752 Q -117 710 -113 670 -1 529 152 617 156 566 134 520 118 485 95 455 19 447 -33 507 L -48 522 -56 525 -70 525 -76 517 -78 510 Q -35 423 64 392 L 70 390 M 57 680 L 12 680 Q -6 687 -18 702 L -25 710 -25 725 -23 740 -11 755 -8 762 Q 54 780 97 732 87 706 67 688 L 57 680 M -925 -643 Q -862 -663 -819 -610 L -687 -451 Q -632 -385 -583 -313 -542 -598 -419 -867 -403 -903 -373 -925 L -345 -923 Q -304 -827 -301 -713 L -291 -412 -272 -1 -261 60 Q -232 158 -308 225 L -383 225 Q -452 159 -429 52 -366 -240 -377 -540 -379 -612 -387 -682 L -393 -728 Q -479 -455 -495 -167 L -493 -92 Q -489 -48 -530 -28 -628 -40 -644 -149 -647 -169 -657 -188 -723 -320 -825 -428 -762 -173 -732 87 -728 123 -753 147 L -761 150 -785 150 Q -816 86 -830 8 -883 -291 -955 -586 -966 -629 -925 -643 M -32 -233 L -45 -238 -60 -233 -63 -225 -68 -218 -88 -203 -95 -164 -98 -143 Q -39 -146 -18 -215 -21 -227 -32 -233 M -649 456 Q -665 535 -660 613 L -650 612 -468 615 -459 623 Q -404 680 -470 727 L -642 734 Q -618 835 -570 930 L -570 942 -576 948 -590 955 Q -677 873 -703 747 L -707 726 Q -788 711 -863 677 L -864 670 -862 662 -858 655 Q -833 638 -804 633 L -718 620 Q -724 495 -690 372 L -653 342 -595 297 -550 296 -550 295 Q -356 293 -321 485 -299 606 -405 571 -419 566 -419 550 -420 384 -580 397 -638 401 -649 456";
	ctx.fillStyle=tocolor(ctrans.apply([0,153,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape90(ctx,ctrans,frame,ratio,time){
	var pathData="M 402 -1058 L 411 -1050 417 -1043 409 -668 405 -645 Q 415 -639 425 -638 L 671 -616 Q 691 -614 699 -594 717 -542 670 -513 538 -499 407 -513 L 405 -78 Q 404 -7 410 64 417 152 347 170 311 180 308 144 L 252 -357 Q 242 -435 203 -504 188 -530 181 -561 172 -610 216 -623 273 -640 335 -645 L 358 -1028 365 -1050 372 -1055 375 -1057 380 -1060 402 -1058 M 59 -679 L 72 -673 Q 90 -642 83 -605 L 77 -583 57 -568 47 -560 Q 32 -502 -7 -454 L -15 -440 -55 -419 -63 -413 -135 -415 -137 -423 -138 -430 -138 -438 -70 -498 -57 -527 -45 -543 Q -41 -586 -18 -624 L -5 -640 Q -5 -672 25 -682 L 40 -685 59 -679 M 42 -160 Q -13 -107 -90 -85 -26 -12 57 -95 L 100 -134 Q 179 -197 192 -104 198 -64 166 -34 28 97 -137 9 L -153 -7 Q -252 -171 -100 -300 L -93 -303 Q -67 -304 -53 -315 88 -327 65 -201 61 -178 42 -160 M 680 -375 Q 872 -353 874 -163 875 -89 833 -31 713 135 515 57 475 41 460 -3 417 -130 554 -174 687 -217 752 -113 759 -166 745 -218 732 -271 675 -280 591 -260 512 -256 505 -255 497 -263 L 497 -270 498 -277 502 -285 Q 553 -346 634 -365 L 680 -375 M 577 -30 Q 626 -14 670 -38 L 649 -68 645 -73 Q 610 -90 575 -73 L 562 -65 Q 557 -49 570 -36 L 577 -30 M 921 526 Q 981 666 940 814 929 852 910 885 L 889 907 Q 766 901 815 784 862 675 817 570 L 790 570 Q 688 711 629 874 622 894 601 889 526 869 553 790 616 610 613 417 611 329 622 245 L 630 241 640 237 651 243 660 250 669 512 670 527 Q 758 412 888 489 911 502 921 526 M 412 427 Q 401 441 401 457 400 487 410 517 L 423 532 446 560 447 562 464 569 479 580 482 582 Q 507 583 523 601 L 542 625 547 670 542 745 Q 500 850 398 879 335 898 285 862 163 806 231 688 257 643 309 651 384 663 371 739 L 360 770 Q 355 790 385 792 L 430 787 446 755 475 712 475 705 475 690 477 667 474 663 Q 452 657 439 640 L 437 637 412 632 Q 313 551 311 430 310 395 328 365 355 321 400 317 556 319 548 467 546 487 530 497 L 524 500 492 500 Q 473 489 469 469 462 442 440 427 L 435 426 412 427 M 67 396 L 67 395 Q 181 400 195 516 L 211 629 Q 235 789 105 878 84 893 59 898 1 910 -41 900 -78 936 -133 946 -270 970 -281 843 -285 804 -292 766 L -296 707 Q -285 490 -213 285 L -190 229 Q -167 184 -135 147 L -133 146 -121 144 -120 142 Q -93 149 -88 177 L -88 185 Q -205 451 -214 740 -215 765 -204 792 -193 817 -188 845 -154 848 -125 835 L -144 790 Q -164 722 -114 669 -22 571 120 582 L 119 544 Q 114 510 97 480 22 443 -35 502 L -40 507 -50 510 -62 504 -70 497 -72 490 -73 482 -73 475 Q -51 444 -17 425 L 25 400 67 396 M 70 702 Q 14 701 -23 740 L -30 747 -28 755 -26 762 -25 770 -17 777 -6 785 0 790 Q 46 796 86 768 L 90 762 Q 97 752 90 738 L 70 702 M -920 -559 Q -923 -570 -914 -579 L -893 -595 -848 -595 Q -667 -447 -560 -243 -477 -499 -410 -769 L -403 -790 -389 -803 -365 -818 Q -283 -800 -283 -703 L -278 -613 Q -250 -350 -275 -88 -233 60 -276 202 -280 215 -294 218 -367 236 -406 168 -425 136 -418 98 -371 -186 -373 -480 -373 -511 -383 -540 -455 -346 -502 -143 -506 -126 -520 -115 -605 -124 -649 -212 -683 -283 -750 -330 -688 -89 -729 148 -732 163 -748 162 -806 158 -804 87 -802 12 -818 -63 L -920 -559 M -48 -236 L -70 -230 Q -98 -201 -108 -162 L -110 -140 Q -28 -151 2 -235 L -8 -240 -38 -240 -48 -236 M -540 275 Q -373 308 -336 481 -326 525 -354 562 -410 636 -443 554 L -458 505 Q -472 440 -520 395 L -563 385 Q -751 454 -702 654 -593 653 -490 625 -401 657 -458 734 L -463 740 Q -571 752 -676 742 -637 852 -570 950 L -573 957 -575 965 -574 971 -569 980 -565 987 -565 991 -582 986 -588 980 -615 977 Q -729 867 -768 730 L -891 699 -900 690 Q -860 645 -790 651 L -784 652 Q -792 592 -788 528 -776 341 -587 284 L -540 275";
	ctx.fillStyle=tocolor(ctrans.apply([0,204,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -920 -559 Q -923 -570 -914 -579 L -893 -595 -848 -595 Q -667 -447 -560 -243 -477 -499 -410 -769 L -403 -790 -389 -803 -365 -818 Q -283 -800 -283 -703 L -278 -613 Q -250 -350 -275 -88 -233 60 -276 202 -280 215 -294 218 -367 236 -406 168 -425 136 -418 98 -371 -186 -373 -480 -373 -511 -383 -540 -455 -346 -502 -143 -506 -126 -520 -115 -605 -124 -649 -212 -683 -283 -750 -330 -688 -89 -729 148 -732 163 -748 162 -806 158 -804 87 -802 12 -818 -63 L -920 -559";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=1.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

	var pathData="M 402 -1058 L 411 -1050 417 -1043 409 -668 405 -645 Q 415 -639 425 -638 L 671 -616 Q 691 -614 699 -594 717 -542 670 -513 538 -499 407 -513 L 405 -78 Q 404 -7 410 64 417 152 347 170 311 180 308 144 L 252 -357 Q 242 -435 203 -504 188 -530 181 -561 172 -610 216 -623 273 -640 335 -645 L 358 -1028 365 -1050 372 -1055 375 -1057 380 -1060 402 -1058 M 59 -679 L 72 -673 Q 90 -642 83 -605 L 77 -583 57 -568 47 -560 Q 32 -502 -7 -454 L -15 -440 -55 -419 -63 -413 -135 -415 -137 -423 -138 -430 -138 -438 -70 -498 -57 -527 -45 -543 Q -41 -586 -18 -624 L -5 -640 Q -5 -672 25 -682 L 40 -685 59 -679 M 42 -160 Q -13 -107 -90 -85 -26 -12 57 -95 L 100 -134 Q 179 -197 192 -104 198 -64 166 -34 28 97 -137 9 L -153 -7 Q -252 -171 -100 -300 L -93 -303 Q -67 -304 -53 -315 88 -327 65 -201 61 -178 42 -160 M 680 -375 Q 872 -353 874 -163 875 -89 833 -31 713 135 515 57 475 41 460 -3 417 -130 554 -174 687 -217 752 -113 759 -166 745 -218 732 -271 675 -280 591 -260 512 -256 505 -255 497 -263 L 497 -270 498 -277 502 -285 Q 553 -346 634 -365 L 680 -375 M 577 -30 Q 626 -14 670 -38 L 649 -68 645 -73 Q 610 -90 575 -73 L 562 -65 Q 557 -49 570 -36 L 577 -30 M 921 526 Q 981 666 940 814 929 852 910 885 L 889 907 Q 766 901 815 784 862 675 817 570 L 790 570 Q 688 711 629 874 622 894 601 889 526 869 553 790 616 610 613 417 611 329 622 245 L 630 241 640 237 651 243 660 250 669 512 670 527 Q 758 412 888 489 911 502 921 526 M 412 427 Q 401 441 401 457 400 487 410 517 L 423 532 446 560 447 562 464 569 479 580 482 582 Q 507 583 523 601 L 542 625 547 670 542 745 Q 500 850 398 879 335 898 285 862 163 806 231 688 257 643 309 651 384 663 371 739 L 360 770 Q 355 790 385 792 L 430 787 446 755 475 712 475 705 475 690 477 667 474 663 Q 452 657 439 640 L 437 637 412 632 Q 313 551 311 430 310 395 328 365 355 321 400 317 556 319 548 467 546 487 530 497 L 524 500 492 500 Q 473 489 469 469 462 442 440 427 L 435 426 412 427 M 67 396 L 67 395 Q 181 400 195 516 L 211 629 Q 235 789 105 878 84 893 59 898 1 910 -41 900 -78 936 -133 946 -270 970 -281 843 -285 804 -292 766 L -296 707 Q -285 490 -213 285 L -190 229 Q -167 184 -135 147 L -133 146 -121 144 -120 142 Q -93 149 -88 177 L -88 185 Q -205 451 -214 740 -215 765 -204 792 -193 817 -188 845 -154 848 -125 835 L -144 790 Q -164 722 -114 669 -22 571 120 582 L 119 544 Q 114 510 97 480 22 443 -35 502 L -40 507 -50 510 -62 504 -70 497 -72 490 -73 482 -73 475 Q -51 444 -17 425 L 25 400 67 396 M 70 702 Q 14 701 -23 740 L -30 747 -28 755 -26 762 -25 770 -17 777 -6 785 0 790 Q 46 796 86 768 L 90 762 Q 97 752 90 738 L 70 702 M -48 -236 L -70 -230 Q -98 -201 -108 -162 L -110 -140 Q -28 -151 2 -235 L -8 -240 -38 -240 -48 -236 M -540 275 Q -373 308 -336 481 -326 525 -354 562 -410 636 -443 554 L -458 505 Q -472 440 -520 395 L -563 385 Q -751 454 -702 654 -593 653 -490 625 -401 657 -458 734 L -463 740 Q -571 752 -676 742 -637 852 -570 950 L -573 957 -575 965 -574 971 -569 980 -565 987 -565 991 -582 986 -588 980 -615 977 Q -729 867 -768 730 L -891 699 -900 690 Q -860 645 -790 651 L -784 652 Q -792 592 -788 528 -776 341 -587 284 L -540 275 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,1]));
	ctx.lineWidth=1.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function sprite91(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 6;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape87",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("shape88",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 2:
			place("shape89",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 3:
			place("shape90",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 4:
			place("shape89",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 5:
			place("shape88",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function button93(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 4;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			break;
	}
}

function shape94(ctx,ctrans,frame,ratio,time){
	var pathData="M 622 -1502 L 624 -1503 Q 644 -1513 690 -1503 L 707 -1462 Q 715 -1434 707 -1415 693 -1380 624 -1375 L 608 -1375 Q 510 -1435 622 -1502 M 86 -1102 Q -45 -1183 112 -1215 148 -1203 163 -1186 183 -1163 163 -1130 L 149 -1111 Q 122 -1079 86 -1102 M -1714 -1509 L -1709 -1504 Q -1646 -1440 -1709 -1390 L -1738 -1372 Q -1782 -1398 -1793 -1422 -1801 -1440 -1793 -1455 -1779 -1484 -1714 -1509 M -1102 -1129 L -1134 -1103 Q -1144 -1095 -1154 -1092 -1184 -1081 -1210 -1107 -1289 -1186 -1139 -1215 L -1102 -1202 Q -1053 -1176 -1102 -1129";
	ctx.fillStyle=tocolor(ctrans.apply([153,204,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -1351 -2037 L -1310 -2037 -1351 -2026 -1351 -2037";
	ctx.fillStyle=tocolor(ctrans.apply([51,153,102,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 956 1049 Q 989 1097 1015 1156 1066 1277 1003 1405 L 937 1525 928 1540 866 1631 853 1651 Q 823 1695 806 1743 782 1811 782 1887 789 1982 707 2015 L 694 2019 Q 654 2007 624 1987 L 590 1956 Q 492 1843 543 1753 L 623 1589 624 1587 650 1533 707 1406 734 1323 707 1280 Q 675 1242 624 1227 L 512 1219 509 1220 291 1228 Q 228 1230 206 1265 191 1287 193 1321 260 1421 253 1529 222 1582 163 1593 L 112 1595 -42 1362 -53 1523 -53 1545 -53 1551 -59 1587 Q -69 1650 -88 1711 L -102 1758 -157 1941 Q -125 2051 -190 2088 L -271 2075 Q -357 2046 -356 1954 L -352 1905 Q -328 1750 -399 1667 L -412 1669 Q -429 1672 -437 1688 -468 1746 -475 1826 L -475 1827 Q -479 1876 -473 1934 -466 1997 -506 2043 -596 2144 -636 2026 -660 1956 -673 1868 -682 1807 -694 1748 -734 1782 -789 1798 L -815 1804 -843 1808 Q -1020 1828 -959 1710 -1032 1773 -1056 1780 L -1102 1791 Q -1234 1813 -1168 1688 L -1197 1644 Q -1239 1589 -1297 1542 L -1340 1509 Q -1450 1432 -1525 1321 L -1563 1264 -1620 1170 -1658 1100 -1709 986 -1710 983 Q -1733 918 -1747 850 -1765 758 -1793 664 L -1815 594 Q -1857 467 -1877 353 L -1882 350 Q -1953 304 -1997 236 L -2008 218 -2042 145 Q -2071 61 -2066 -15 -2070 -50 -2062 -86 L -2045 -139 -2059 -163 Q -2053 -323 -2062 -381 -2080 -512 -2105 -645 -2126 -761 -2077 -811 -2049 -841 -1997 -847 L -1994 -848 Q -1950 -801 -1916 -741 -1845 -614 -1879 -518 -1925 -429 -1920 -299 L -1888 -320 Q -1844 -346 -1793 -358 L -1770 -363 -1709 -370 -1620 -368 -1563 -359 -1519 -348 Q -1444 -326 -1387 -269 L -1304 -180 Q -1293 -291 -1320 -436 -1333 -501 -1336 -562 -1337 -583 -1293 -591 -1223 -604 -1172 -579 L -1154 -569 -1102 -526 Q -1065 -487 -1046 -435 -1020 -513 -930 -475 -856 -458 -815 -417 L -789 -382 -778 -357 -780 -65 Q -643 -145 -500 -129 L -412 -111 Q -334 -86 -291 -36 -301 -152 -271 -253 L -254 -302 -240 -331 Q -191 -419 -67 -450 L -63 -450 -45 -438 -43 -437 Q -1 -410 40 -410 44 -350 34 -298 L 19 -245 Q -18 -150 -2 -15 14 114 23 244 33 378 35 510 L 34 783 Q 32 906 11 1020 L 0 1074 0 1076 11 1078 114 993 163 946 Q 230 871 266 773 314 641 322 515 258 457 212 383 179 330 163 273 144 205 151 130 154 95 163 63 168 44 176 27 L 163 -5 146 -51 Q 102 -176 34 -298 106 -312 163 -349 198 -372 227 -402 299 -317 377 -154 440 -182 509 -192 L 522 -194 624 -190 Q 668 -181 707 -158 737 -141 765 -115 L 751 -194 Q 727 -335 782 -462 L 837 -589 Q 850 -610 931 -604 L 937 -590 Q 964 -530 981 -467 998 -404 1006 -338 1022 -207 1020 -72 1017 61 1022 194 L 1022 336 1010 467 994 583 993 586 Q 953 703 954 824 L 937 895 908 991 937 1024 956 1049 M 370 -72 Q 251 -70 248 36 329 154 420 -2 463 -75 370 -72 M 571 328 Q 538 315 509 312 412 302 349 402 370 448 416 425 461 401 518 418 573 436 602 490 630 544 636 545 701 521 686 467 678 399 624 358 601 340 571 328 M 804 63 L 795 25 707 2 624 -9 Q 531 16 580 139 L 624 170 Q 657 185 707 181 756 177 821 155 L 804 63 M -1997 -43 Q -2040 -17 -2007 57 L -1997 75 Q -1971 109 -1916 96 -1810 43 -1893 -58 -1965 -64 -1997 -43 M -1620 -47 Q -1712 21 -1631 140 L -1620 155 Q -1596 182 -1563 191 L -1513 194 Q -1396 191 -1377 34 -1367 -54 -1462 -72 L -1563 -75 -1577 -72 Q -1602 -61 -1620 -47 M -1045 -432 L -1046 -435 Q -1054 -412 -1055 -379 -1068 -297 -1068 -202 -1067 -72 -1069 57 -1071 156 -1102 248 L -1103 251 Q -1115 347 -1154 469 L -1175 524 Q -1184 622 -1157 762 -1138 861 -1102 953 L -1075 1017 -962 1259 Q -901 1385 -817 1494 L -815 1497 -789 1531 -729 1616 Q -748 1478 -755 1343 -762 1223 -789 1110 L -795 1085 -815 1005 -860 811 Q -921 757 -960 679 -1024 553 -1013 409 -1006 329 -979 256 L -977 250 Q -986 221 -985 187 L -978 -79 Q -978 -224 -1004 -307 -1047 -356 -1046 -426 L -1045 -432 M -274 156 Q -304 139 -359 141 -393 151 -415 166 -489 218 -426 333 L -415 348 -404 356 -377 366 Q -307 383 -271 340 -243 306 -236 235 -231 183 -266 160 L -274 156 M -718 486 Q -762 496 -792 515 L -818 535 Q -865 581 -858 665 -854 719 -818 748 L -809 754 -789 766 -780 769 Q -677 803 -575 700 -471 595 -560 511 L -588 488 -591 486 Q -632 456 -718 486 M -272 782 L -223 731 Q -330 705 -373 774 -417 842 -350 824 -306 813 -272 782 M -240 669 L -239 670 -240 669 M -1619 298 L -1617 283 -1646 257 Q -1677 232 -1745 225 L -1835 210 Q -1901 263 -1829 287 L -1793 314 Q -1756 337 -1709 352 L -1672 362 Q -1639 352 -1629 332 L -1619 298";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 370 -72 Q 463 -75 420 -2 329 154 248 36 251 -70 370 -72 M 804 63 L 821 155 Q 756 177 707 181 657 185 624 170 L 580 139 Q 531 16 624 -9 L 707 2 795 25 804 63 M 571 328 Q 601 340 624 358 678 399 686 467 701 521 636 545 630 544 602 490 573 436 518 418 461 401 416 425 370 448 349 402 412 302 509 312 538 315 571 328 M -1997 -43 Q -1965 -64 -1893 -58 -1810 43 -1916 96 -1971 109 -1997 75 L -2007 57 Q -2040 -17 -1997 -43 M -1620 -47 Q -1602 -61 -1577 -72 L -1563 -75 -1462 -72 Q -1367 -54 -1377 34 -1396 191 -1513 194 L -1563 191 Q -1596 182 -1620 155 L -1631 140 Q -1712 21 -1620 -47 M -272 782 Q -306 813 -350 824 -417 842 -373 774 -330 705 -223 731 L -272 782 M -718 486 Q -632 456 -591 486 L -588 488 -560 511 Q -471 595 -575 700 -677 803 -780 769 L -789 766 -809 754 -818 748 Q -854 719 -858 665 -865 581 -818 535 L -792 515 Q -762 496 -718 486 M -274 156 L -266 160 Q -231 183 -236 235 -243 306 -271 340 -307 383 -377 366 L -404 356 -415 348 -426 333 Q -489 218 -415 166 -393 151 -359 141 -304 139 -274 156 M -1619 298 L -1629 332 Q -1639 352 -1672 362 L -1709 352 Q -1756 337 -1793 314 L -1829 287 Q -1901 263 -1835 210 L -1745 225 Q -1677 232 -1646 257 L -1617 283 -1619 298";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -240 669 L -239 670 -240 669";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([107,107,107,1]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.19873046875,0,0,0.19873046875,-1519,-348);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.2196078431372549,tocolor(ctrans.apply([255,255,255,1])));
	grd.addColorStop(1.0,tocolor(ctrans.apply([107,107,107,1])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M 1513 -1753 L 1520 -1840 1527 -1754 1513 -1753 M -1703 1794 L -1706 1800 -1709 1791 -1703 1794";
	ctx.fillStyle=tocolor(ctrans.apply([153,153,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 1022 336 L 1087 224 1066 -50 Q 1057 -184 1084 -318 L 1128 -531 Q 1151 -643 1194 -749 L 1297 -999 1314 -1038 1386 -1207 Q 1431 -1313 1462 -1423 1494 -1540 1505 -1660 L 1513 -1753 1527 -1754 Q 1549 -1492 1587 -1229 1617 -1022 1611 -812 1609 -709 1579 -610 L 1514 -412 1513 -409 Q 1483 -322 1441 -238 1422 -199 1391 -166 L 1349 -122 1314 -80 Q 1295 -53 1288 -27 L 1314 -44 1339 -59 Q 1423 -106 1513 -135 L 1557 -149 Q 1684 -185 1815 -187 1944 -190 2062 -141 2149 -105 2235 -76 L 2318 -52 2411 -44 Q 2351 13 2286 83 L 2235 133 Q 2178 182 2109 217 L 2062 241 1928 296 Q 1862 321 1793 322 L 1643 313 1513 295 1484 291 Q 1411 281 1369 250 1356 262 1341 254 L 1326 401 1314 482 Q 1296 600 1271 715 1227 923 1054 1015 1020 1033 956 1049 L 937 1024 908 991 937 895 954 824 972 727 993 586 994 583 1010 467 1022 336 M -1297 1542 Q -1418 1549 -1533 1611 L -1563 1629 Q -1594 1649 -1620 1674 -1675 1725 -1703 1794 L -1709 1791 Q -1737 1696 -1725 1607 -1756 1641 -1793 1668 -1820 1687 -1850 1702 -1894 1725 -1940 1744 L -1997 1767 -2094 1798 Q -2223 1835 -2303 1796 -2255 1801 -2225 1757 -2155 1653 -2103 1540 -2062 1450 -1997 1376 L -1941 1318 -1878 1265 -1841 1236 -1883 1253 -1887 1254 Q -1946 1273 -1997 1274 -2070 1274 -2124 1237 -2067 1164 -1997 1109 L -1929 1060 Q -1857 1015 -1793 997 L -1756 988 -1737 985 -1756 984 -1758 983 -1793 976 -1830 977 Q -1879 983 -1928 978 -1964 975 -1997 960 L -2047 929 Q -2115 875 -2122 789 -2138 590 -2201 404 -2259 233 -2411 165 -2345 122 -2252 130 -2116 143 -2008 218 L -1997 236 Q -1953 304 -1882 350 L -1877 353 Q -1857 467 -1815 594 L -1793 664 Q -1765 758 -1747 850 -1733 918 -1710 983 L -1709 986 -1658 1100 -1620 1170 -1563 1264 -1525 1321 Q -1450 1432 -1340 1509 L -1297 1542 M -2059 -163 L -2090 -219 Q -2120 -278 -2160 -335 -2280 -507 -2304 -719 -2339 -1015 -2339 -1315 L -2346 -1862 -2307 -1704 Q -2285 -1627 -2232 -1574 -2139 -1482 -2107 -1352 -2074 -1218 -2083 -1078 -2092 -943 -2077 -811 -2126 -761 -2105 -645 -2080 -512 -2062 -381 -2053 -323 -2059 -163 M 509 -1962 Q 555 -1924 569 -1863 599 -1732 535 -1610 L 509 -1566 Q 450 -1476 354 -1420 262 -1366 163 -1343 L 105 -1332 -52 -1323 Q -46 -1416 -106 -1501 -179 -1605 -271 -1575 L -317 -1552 -341 -1603 Q -318 -1608 -271 -1640 L -205 -1689 -201 -1736 Q -138 -1605 11 -1585 L 163 -1581 Q 223 -1587 282 -1603 411 -1638 462 -1774 516 -1913 409 -2021 459 -2002 505 -1966 L 509 -1962 M 126 -1956 Q 163 -1952 157 -1923 128 -1783 -26 -1847 -53 -1962 61 -1955 86 -1960 126 -1956 M -1351 -2037 L -1351 -2026 Q -1436 -1999 -1494 -1937 -1590 -1834 -1539 -1710 -1483 -1576 -1333 -1574 L -1102 -1588 -1061 -1595 Q -923 -1619 -839 -1749 L -847 -1702 Q -837 -1667 -815 -1643 L -789 -1621 Q -759 -1602 -715 -1596 -728 -1544 -743 -1512 L -789 -1542 -815 -1553 Q -893 -1576 -965 -1500 -1026 -1435 -1045 -1312 L -1102 -1307 Q -1206 -1305 -1307 -1346 -1430 -1396 -1523 -1493 L -1563 -1539 Q -1596 -1580 -1620 -1625 L -1655 -1702 Q -1700 -1825 -1620 -1918 L -1602 -1937 -1563 -1969 Q -1473 -2035 -1354 -2037 L -1351 -2037 M -1102 -1811 L -1103 -1811 Q -1231 -1809 -1253 -1918 -1216 -2009 -1110 -1955 L -1102 -1949 Q -960 -1844 -1102 -1811 M -1745 1170 L -1793 1202 -1841 1236 -1793 1209 -1745 1170";
	ctx.fillStyle=tocolor(ctrans.apply([0,153,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 636 -2027 Q 650 -2090 707 -2078 742 -2070 794 -2034 745 -1978 707 -1973 665 -1969 636 -2027 M 707 -1761 L 708 -1783 Q 771 -1813 862 -1775 862 -1620 707 -1686 L 701 -1689 707 -1761 M 377 -1181 Q 271 -1227 392 -1287 419 -1311 447 -1284 522 -1213 421 -1179 L 377 -1181 M -1793 -1783 Q -1767 -1726 -1793 -1704 -1827 -1676 -1949 -1705 -1964 -1841 -1793 -1783 M -1793 -2074 Q -1750 -2051 -1721 -1991 -1759 -1976 -1793 -1980 -1861 -1989 -1916 -2076 -1845 -2102 -1793 -2074 M -1484 -1287 Q -1348 -1213 -1462 -1159 -1502 -1166 -1516 -1195 -1566 -1303 -1484 -1287";
	ctx.fillStyle=tocolor(ctrans.apply([0,204,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape95(ctx,ctrans,frame,ratio,time){
	var pathData="M 975 -1025 L 986 -1014 Q 989 -986 980 -959 977 -950 979 -939 L 957 -892 988 -869 Q 1002 -857 1008 -838 1005 -588 1051 -341 1091 -125 882 -62 L 746 -57 746 -34 Q 745 26 711 69 707 97 686 121 769 108 842 63 L 864 62 864 60 Q 913 57 928 99 L 932 110 Q 888 209 805 251 L 757 310 745 342 Q 698 436 731 533 757 608 801 677 L 804 682 Q 950 753 922 913 913 961 895 1005 854 1102 825 1204 806 1271 774 1335 818 1381 816 1443 814 1476 785 1493 757 1489 734 1477 L 740 1487 Q 750 1504 769 1512 848 1547 785 1603 705 1602 651 1538 478 1575 297 1593 232 1619 171 1654 L 103 1656 101 1655 Q 60 1682 -7 1691 -117 1705 -223 1688 L -357 1667 Q -427 1656 -412 1590 L -455 1590 -492 1493 Q -492 1343 -523 1195 L -556 990 -577 785 Q -586 682 -600 580 -615 465 -694 386 L -702 388 -709 395 -707 398 -712 404 -713 401 Q -701 382 -681 365 L -631 378 Q -840 85 -765 -273 -744 -373 -683 -439 L -739 -535 Q -750 -557 -752 -583 -762 -707 -737 -820 L -819 -902 -821 -910 -808 -924 -789 -933 -789 -935 Q -750 -923 -716 -898 L -713 -907 -689 -912 -688 -914 Q -622 -882 -655 -809 L -660 -799 Q -639 -704 -656 -605 L -660 -583 -618 -540 -609 -542 Q -526 -607 -392 -584 L -358 -580 Q -272 -526 -237 -435 -216 -408 -198 -376 -156 -303 -122 -226 -61 -87 -111 60 -131 121 -161 176 L -163 205 -165 229 -142 225 Q -64 262 -45 343 L -45 337 -28 315 -20 304 Q -10 255 19 216 L 30 204 Q 56 212 72 233 75 238 30 204 49 342 47 448 L 48 469 46 473 Q 52 508 49 549 21 975 -76 1392 -80 1412 -90 1430 L -86 1494 Q -83 1542 -93 1570 L -63 1576 Q -27 1562 12 1558 L 23 1547 Q 2 1479 10 1411 L 39 1313 Q 62 1231 70 1152 113 1089 177 1036 137 975 118 908 L 109 908 96 896 88 886 Q 85 833 100 785 L 102 731 Q 114 583 242 531 L 253 520 Q 305 330 431 177 431 126 448 76 L 455 53 412 16 Q 284 -123 283 -317 L 284 -334 Q 252 -367 233 -418 184 -549 167 -680 156 -695 154 -713 150 -740 156 -767 L 164 -777 175 -788 185 -795 197 -793 Q 197 -812 217 -824 L 225 -827 246 -831 Q 365 -730 421 -572 L 457 -593 Q 490 -610 519 -616 L 569 -597 591 -587 595 -576 595 -565 594 -555 617 -501 Q 672 -459 703 -395 731 -399 749 -411 844 -431 908 -399 L 861 -706 Q 841 -810 904 -881 903 -952 951 -1019 L 957 -1029 975 -1025 M 1566 -1501 L 1575 -1503 Q 1555 -1302 1523 -1094 1497 -926 1426 -768 1345 -587 1286 -396 L 1266 -339 1252 -332 1238 -339 Q 1327 -656 1451 -957 1480 -1028 1491 -1105 1520 -1307 1566 -1501 M 39 -898 L 55 -867 Q 8 -696 10 -514 L 12 -511 Q 64 -383 42 -264 L -6 -256 -27 -278 Q -33 -293 -31 -310 L -31 -321 -42 -332 -46 -370 -48 -372 -51 -382 -52 -382 -52 -385 -52 -386 Q -64 -401 -66 -418 L -66 -422 -67 -422 Q -237 -528 -155 -723 -113 -823 -45 -907 L -31 -912 -31 -914 27 -910 39 -898 M 744 -182 L 745 -181 753 -174 846 -181 902 -223 925 -242 923 -263 Q 866 -232 793 -227 L 742 -217 744 -182 M 1340 -216 Q 1274 -117 1202 -37 1332 -303 1594 -435 1724 -501 1870 -457 1925 -440 1979 -456 L 2107 -483 Q 2119 -457 2082 -442 L 2078 -440 Q 1889 -390 1695 -433 1619 -450 1552 -412 1423 -340 1340 -216 M 1291 1 L 1299 -1 Q 1269 174 1205 344 L 1202 354 Q 1177 369 1173 398 1151 377 1181 317 1237 205 1256 85 L 1274 53 1273 42 1270 31 1291 1 M 348 805 Q 347 827 354 852 L 364 908 Q 413 968 378 1036 367 1057 347 1069 L 330 1096 Q 337 1117 317 1151 L 238 1283 Q 259 1325 246 1393 424 1315 620 1292 L 665 1292 Q 685 1179 715 1066 742 964 799 875 749 804 669 766 L 661 766 Q 522 769 387 801 L 348 805 M 30 1221 L 42 1198 Q 19 1282 2 1367 L -2 1362 Q 18 1292 30 1221 M -2079 -1697 Q -2080 -1379 -1997 -1075 -1956 -922 -1878 -792 L -1885 -774 -1888 -770 -1906 -774 Q -2141 -1152 -2106 -1604 -2101 -1664 -2079 -1697 M -1746 -1000 Q -1750 -983 -1763 -968 -1760 -951 -1767 -936 L -1781 -903 -1778 -892 -1777 -882 -1784 -871 -1791 -860 Q -1790 -827 -1792 -795 -1793 -770 -1813 -752 L -1838 -752 -1849 -763 Q -1854 -927 -1829 -1088 -1825 -1115 -1838 -1142 -1860 -1191 -1842 -1237 L -1830 -1243 -1810 -1250 -1809 -1252 -1773 -1248 Q -1709 -1138 -1746 -1000 M -1651 -204 Q -1738 -469 -1536 -691 -1498 -732 -1450 -734 L -1390 -731 -1349 -741 Q -1173 -701 -1125 -533 L -1085 -575 -1090 -712 Q -1097 -834 -1039 -930 L -1044 -935 -1044 -946 -1044 -968 Q -1024 -986 -1012 -1011 L -1008 -1022 -976 -1037 -976 -1040 -954 -1032 Q -922 -940 -938 -850 -905 -752 -917 -636 -929 -528 -918 -421 -895 -188 -944 43 L -947 60 Q -943 75 -942 95 L -938 140 -938 142 -891 294 Q -847 320 -810 361 -777 398 -734 424 L -728 428 -721 413 -716 424 Q -696 469 -686 515 L -680 548 -678 580 -677 585 -674 589 -662 674 -657 680 Q -640 710 -640 744 L -636 755 -626 790 Q -618 956 -593 1118 L -566 1281 -580 1281 -609 1259 -609 1263 Q -609 1274 -621 1279 -546 1386 -571 1518 L -580 1537 -588 1538 -624 1537 -638 1526 Q -657 1422 -686 1320 -690 1304 -685 1289 L -683 1287 Q -746 1281 -783 1208 -811 1153 -849 1102 -986 925 -1109 739 -1203 599 -1348 472 -1525 118 -1515 -72 L -1515 -73 Q -1572 -80 -1627 -156 -1642 -177 -1651 -204 M -1459 -461 L -1461 -461 Q -1481 -414 -1485 -364 L -1486 -353 Q -1465 -401 -1459 -461 M -1313 721 L -1308 711 -1288 689 -1281 685 -1242 689 Q -1115 807 -1039 963 -997 1049 -921 1110 -861 1159 -848 1229 -844 1255 -868 1271 L -929 1271 -940 1260 -961 1228 -1155 1034 -1158 1023 -1163 1001 Q -1188 980 -1196 949 L -1206 904 -1280 801 -1313 753 -1313 743 -1313 732 -1313 721 M -1527 752 L -1518 760 Q -1635 894 -1769 1012 L -1777 1012 Q -1678 877 -1560 765 L -1543 746 Q -1534 748 -1527 752 M -1342 919 L -1333 930 -1328 940 -1333 961 -1339 972 -1357 983 -1375 983 -1385 972 Q -1384 950 -1371 929 L -1367 922 -1360 920 -1342 919 M -310 1526 L -256 1527 -267 1344 Q -281 1418 -303 1491 L -311 1509 -310 1526 M -1662 301 Q -1734 293 -1784 218 -1820 146 -1844 67 -1849 52 -1834 56 -1784 183 -1684 276 L -1662 301";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,0.23137255]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function character96(ctx,ctrans,frame,ratio,time){
}

function sprite97(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 20;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 1:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,0,0,-242,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-240,256,256,256,256)),1,0,0,time);
			break;
		case 2:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,1,0,-228,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-225,256,256,256,256)),1,0,0,time);
			break;
		case 3:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,1,1,-215,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-210,256,256,256,256)),1,0,0,time);
			break;
		case 4:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,2,1,-201,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-196,256,256,256,256)),1,0,0,time);
			break;
		case 5:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,2,1,-188,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-181,256,256,256,256)),1,0,0,time);
			break;
		case 6:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,3,1,-174,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-166,256,256,256,256)),1,0,0,time);
			break;
		case 7:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,3,1,-161,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-151,256,256,256,256)),1,0,0,time);
			break;
		case 8:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,4,2,-148,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-136,256,256,256,256)),1,0,0,time);
			break;
		case 9:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,4,2,-134,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-121,256,256,256,256)),1,0,0,time);
			break;
		case 10:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,5,2,-121,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-107,256,256,256,256)),1,0,0,time);
			break;
		case 11:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,5,2,-107,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-92,256,256,256,256)),1,0,0,time);
			break;
		case 12:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,6,3,-94,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-77,256,256,256,256)),1,0,0,time);
			break;
		case 13:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,6,3,-81,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-62,256,256,256,256)),1,0,0,time);
			break;
		case 14:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,7,3,-67,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-47,256,256,256,256)),1,0,0,time);
			break;
		case 15:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,7,3,-54,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-32,256,256,256,256)),1,0,0,time);
			break;
		case 16:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,8,3,-40,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-18,256,256,256,256)),1,0,0,time);
			break;
		case 17:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,8,4,-27,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,-3,256,256,256,256)),1,0,0,time);
			break;
		case 18:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,9,4,-13,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,12,256,256,256,256)),1,0,0,time);
			break;
		case 19:
			place("shape94",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans.merge(new cxform(0,9,4,0,256,256,256,256)),1,0,0,time);
			place("shape95",canvas,ctx,[1.0,0.0,0.0,1.0,-129.0,460.0],ctrans.merge(new cxform(0,0,0,27,256,256,256,256)),1,0,0,time);
			break;
	}
}

function shape98(ctx,ctrans,frame,ratio,time){
	var pathData="M 1347 -1295 Q 1285 -1078 1238 -855 1209 -720 1217 -578 L 1229 -560 1225 -556 Q 1263 -477 1159 -419 1134 -404 1104 -399 L 1037 -392 Q 1002 -411 1000 -448 L 1000 -476 Q 1054 -583 1174 -577 1187 -935 1320 -1271 1328 -1293 1347 -1295 M 17 -151 L 22 -206 25 -289 Q 38 -324 42 -363 49 -434 67 -502 115 -478 129 -430 140 -395 138 -358 124 -105 239 131 269 192 252 253 241 294 201 317 14 424 -105 253 -135 209 -140 156 -157 -47 17 -151 M 488 -293 Q 436 -327 470 -382 L 494 -408 Q 609 -394 547 -305 L 535 -293 488 -293 M 497 -163 Q 447 -4 489 161 518 277 554 389 568 433 535 466 L 516 488 Q 367 495 352 337 340 220 375 103 L 442 -120 485 -169 488 -172 497 -163 M 731 -123 Q 812 -159 894 -169 1139 -143 1165 95 1186 288 999 356 738 450 608 211 566 134 581 46 596 -34 662 -83 694 -106 731 -123 M 742 -14 Q 697 179 888 171 964 168 991 100 1016 39 982 -16 931 -99 835 -88 782 -70 751 -24 L 742 -14 M 116 228 L 125 218 Q 111 106 61 3 53 -14 45 -8 19 17 1 48 L -5 57 Q -34 158 42 225 L 116 228 M 320 952 L 321 950 Q 385 942 442 978 519 878 603 780 L 536 774 Q 357 793 184 780 167 922 138 1056 136 1067 119 1071 35 1089 -17 1034 L -20 1006 -17 997 Q 26 952 94 956 98 853 111 751 115 726 128 705 393 750 659 699 L 674 695 674 693 689 701 696 708 Q 645 825 554 933 L 494 1015 Q 489 1029 497 1044 L 501 1053 Q 497 1075 482 1090 L 476 1096 Q 385 1129 336 1062 308 1052 290 1025 L 287 1006 287 987 Q 296 963 320 952 M -411 -1636 L -396 -1633 Q -316 -1423 -277 -1195 -276 -1191 -278 -1186 L -273 -1178 -259 -1168 Q -251 -1062 -371 -1053 L -377 -1043 -380 -1037 -430 -1037 -439 -1047 Q -438 -1070 -440 -1093 L -439 -1112 Q -392 -1178 -312 -1183 -371 -1403 -414 -1628 L -411 -1636 M -291 398 L -284 389 -281 324 Q -277 286 -293 265 -349 280 -403 303 L -427 311 -435 321 -441 331 -442 339 Q -398 420 -299 408 L -291 398 M -207 463 Q -216 485 -238 499 -350 567 -460 489 -562 417 -531 298 -512 222 -425 201 L -403 194 -309 156 Q -352 -20 -540 23 -807 84 -1055 198 -1062 201 -1072 191 L -1075 184 Q -775 -29 -408 -70 -240 -28 -194 149 -151 313 -207 463 M -808 361 Q -937 435 -1053 528 L -1065 538 -1059 556 -1054 575 -1053 584 Q -922 488 -801 371 -784 354 -808 361 M -581 294 Q -575 331 -601 360 -670 437 -745 508 -696 535 -655 574 L -647 581 -625 581 Q -482 537 -435 669 -394 786 -505 829 -574 856 -628 814 -695 760 -693 674 L -798 571 -805 563 Q -907 652 -1019 730 -974 845 -1049 920 -1064 935 -1089 925 -1131 908 -1136 862 -1143 795 -1162 731 -1200 598 -1186 471 -1184 447 -1164 430 -976 269 -752 191 -603 167 -581 294 M -1230 969 Q -1197 1196 -1135 1422 -1070 1481 -1148 1578 -1238 1693 -1312 1584 -1339 1545 -1312 1504 -1267 1437 -1201 1408 -1258 1197 -1248 984 L -1248 975 -1236 970 -1230 969";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape99(ctx,ctrans,frame,ratio,time){
	var pathData="M 1344 -1268 L 1340 -1260 Q 1254 -982 1239 -691 L 1232 -570 Q 1224 -405 1058 -372 989 -359 973 -427 954 -512 1035 -555 L 1115 -595 1182 -603 Q 1190 -895 1277 -1173 1299 -1243 1352 -1283 L 1344 -1268 M 65 -557 L 79 -559 80 -560 Q 149 -515 136 -419 117 -270 151 -130 183 -1 225 122 L 233 157 Q 254 299 126 340 L 75 342 Q -107 309 -131 123 -157 -73 32 -145 27 -342 47 -534 48 -547 60 -555 L 65 -557 M 50 -30 Q -24 -2 -25 77 L -25 85 Q -19 96 -19 107 L -20 130 Q -13 140 -11 152 L -10 167 Q 25 253 122 240 132 111 73 -11 L 58 -28 50 -30 M 457 -140 Q 460 -71 451 3 436 118 495 223 559 337 537 458 531 493 496 498 391 516 370 416 L 355 355 Q 294 157 357 -43 384 -109 445 -143 L 457 -140 M 549 -297 Q 525 -267 487 -283 409 -318 452 -392 472 -427 510 -425 626 -391 549 -297 M 705 -105 Q 801 -201 940 -195 1071 -159 1145 -37 1195 47 1166 136 1134 235 1052 307 1017 322 976 325 872 332 768 322 720 317 686 281 551 138 644 -24 668 -68 705 -105 M 907 -88 L 865 -88 Q 721 -39 702 93 L 705 115 Q 802 159 917 160 L 974 117 Q 990 100 995 77 981 16 949 -36 L 907 -88 M 202 697 Q 375 747 561 697 L 680 665 695 670 Q 713 737 648 794 545 884 475 1000 485 1119 358 1080 274 1053 282 973 286 940 318 933 376 921 430 950 497 845 587 757 L 595 750 Q 393 797 195 755 L 193 792 195 807 Q 175 891 164 975 L 173 999 Q 187 1046 145 1077 45 1109 -25 1068 L -60 1042 -68 1032 -72 1027 Q -90 1006 -71 983 L -67 979 Q -54 949 -23 946 1 935 30 935 L 118 933 Q 115 861 135 787 141 766 153 745 L 162 730 Q 156 715 158 700 L 162 685 170 680 180 677 198 691 202 697 M -380 -1610 L -292 -1242 -290 -1228 Q -210 -1144 -291 -1076 -382 -1000 -460 -1064 -474 -1076 -471 -1096 -456 -1181 -361 -1190 L -320 -1198 -324 -1205 -330 -1213 -417 -1616 Q -421 -1633 -408 -1633 L -390 -1618 -380 -1610 M -352 -35 Q -159 32 -139 234 -125 374 -196 492 -210 515 -236 526 -397 596 -500 461 -590 344 -499 229 -470 192 -423 176 -337 147 -253 182 L -253 177 -261 155 -265 132 Q -320 42 -429 27 -586 5 -732 62 -897 126 -1055 207 L -1071 202 -1085 190 Q -897 20 -641 -41 -617 -47 -603 -58 -471 -76 -352 -35 M -293 385 L -268 377 Q -252 353 -242 326 -230 295 -243 285 -306 317 -380 337 L -388 342 -373 365 -363 377 Q -329 396 -293 385 M -755 202 Q -610 204 -625 346 -627 371 -641 393 -680 456 -730 505 -677 589 -560 588 -501 587 -475 641 -431 730 -490 802 -613 882 -683 760 -697 735 -697 705 L -693 682 Q -727 642 -770 610 L -815 577 Q -918 663 -1038 725 -1011 819 -1053 893 -1058 901 -1069 898 -1127 885 -1150 826 -1178 757 -1188 682 -1233 566 -1185 453 L -1172 436 Q -1053 360 -940 268 -889 227 -825 215 L -755 203 -755 202 M -733 305 Q -932 333 -1063 497 L -1070 505 -1069 542 -1063 602 -1058 622 Q -887 503 -749 348 -726 322 -733 305 M -1255 907 L -1248 915 Q -1240 1189 -1135 1437 -1103 1514 -1178 1576 -1271 1654 -1308 1548 -1314 1530 -1310 1512 -1277 1472 -1235 1447 -1208 1442 -1180 1447 -1264 1201 -1275 927 L -1275 912 -1260 908 -1255 907";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape100(ctx,ctrans,frame,ratio,time){
	var pathData="M 1340 -1305 Q 1349 -1315 1362 -1313 1296 -1035 1275 -750 L 1272 -743 Q 1260 -594 1237 -451 1235 -436 1221 -426 1120 -345 1005 -404 991 -411 989 -428 977 -530 1091 -546 L 1172 -563 Q 1222 -848 1280 -1139 1297 -1227 1340 -1305 M 120 -505 L 134 -499 140 -493 Q 173 -252 220 -7 228 33 244 71 311 234 165 317 123 342 75 326 32 311 10 275 -130 138 -33 -31 5 -96 70 -138 36 -289 72 -438 L 75 -453 87 -468 92 -475 93 -482 100 -498 107 -502 120 -505 M 72 -28 Q 22 20 16 92 L 15 100 Q 39 174 97 220 L 132 222 140 215 Q 140 99 91 -14 83 -32 72 -28 M 479 -426 L 482 -428 Q 624 -423 581 -299 570 -267 537 -253 409 -248 433 -366 442 -411 479 -426 M 490 -183 L 515 -180 522 -172 532 -158 Q 482 -19 516 121 547 245 568 373 575 422 571 472 562 562 477 535 417 517 406 451 380 306 384 157 388 -20 480 -178 L 485 -180 489 -181 490 -183 M 835 -160 L 842 -165 847 -168 917 -165 Q 1000 -131 1078 -90 1151 -50 1174 27 1186 69 1186 112 1186 338 973 417 834 469 730 389 557 256 635 55 691 -89 827 -153 L 835 -160 M 852 -73 L 822 -68 Q 727 3 693 112 688 127 690 142 715 226 793 267 L 825 287 Q 1005 295 1024 124 L 1022 87 Q 1013 33 980 -10 954 -20 933 -39 L 927 -45 Q 889 -54 855 -71 L 852 -73 M 400 721 L 645 687 650 682 657 677 669 676 670 675 684 681 690 687 Q 697 697 696 710 L 697 725 Q 633 878 529 1008 L 487 1060 Q 424 1136 334 1100 302 1087 277 1054 227 989 300 954 L 351 950 Q 483 989 555 863 L 584 814 625 740 Q 568 737 479 759 308 800 155 732 L 150 731 137 732 Q 175 912 90 1067 L 79 1075 Q -25 1093 -31 1004 -34 952 20 950 L 75 947 99 775 105 752 117 745 122 732 130 717 126 709 122 695 Q 161 682 212 701 303 736 400 721 M -420 -1668 Q -366 -1622 -349 -1543 -310 -1357 -263 -1175 -219 -1096 -312 -1043 -422 -981 -441 -1087 -448 -1120 -415 -1138 -369 -1163 -318 -1175 -370 -1343 -410 -1519 -424 -1577 -445 -1634 L -448 -1648 -444 -1655 -438 -1663 -421 -1666 -420 -1668 M -377 92 Q -431 61 -490 45 -750 92 -993 201 L -1023 209 -1035 212 -1047 208 -1053 202 Q -828 8 -525 -43 -244 -22 -177 247 -153 343 -198 420 -257 614 -453 557 L -490 534 Q -615 409 -525 254 -506 220 -472 199 -399 155 -313 157 -335 116 -377 92 M -268 342 L -268 320 -267 312 Q -265 302 -270 300 -348 291 -412 335 L -420 342 -420 365 -420 372 -418 387 -397 411 -380 437 -348 442 Q -301 423 -285 374 -280 357 -268 342 M -782 388 L -765 365 -762 335 Q -763 325 -767 317 -771 308 -780 315 -925 372 -1065 439 L -1073 445 Q -1062 477 -1063 512 -1065 558 -1056 602 L -1055 607 Q -921 523 -803 412 L -782 388 M -659 347 Q -669 433 -720 505 L -666 558 -628 595 Q -495 538 -439 685 -423 727 -438 770 -460 832 -526 845 -661 871 -666 739 L -673 702 -795 589 -810 575 Q -921 652 -1043 715 -1013 822 -1051 923 -1054 931 -1063 931 -1150 933 -1140 836 -1137 810 -1144 784 -1188 590 -1156 395 -1149 357 -1107 346 -1027 326 -957 281 -877 229 -790 207 -643 204 -659 347 M -1265 912 L -1260 905 -1253 897 -1243 894 -1243 892 -1213 895 Q -1180 957 -1184 1038 -1187 1110 -1176 1181 -1156 1305 -1094 1415 -1061 1475 -1092 1536 -1110 1572 -1141 1599 -1242 1686 -1306 1578 -1324 1549 -1307 1518 -1275 1457 -1210 1426 L -1195 1415 Q -1267 1187 -1269 942 L -1265 912";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite101(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 4;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape98",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("shape99",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 2:
			place("shape100",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 3:
			place("shape99",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function button103(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 4;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			break;
	}
}

function shape104(ctx,ctrans,frame,ratio,time){
	var pathData="M -1637 -13 L -1630 -14 -1632 -10 -1637 -13";
	ctx.fillStyle=tocolor(ctrans.apply([0,153,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -2057 -20927 L -2023 -20920 -2019 -20915 Q -2055 -20895 -2061 -20924 L -2057 -20927 M -2116 -20921 L -2111 -20915 Q -2160 -20893 -2157 -20935 -2156 -20942 -2145 -20938 L -2116 -20921 M -184 -20846 L -181 -20846 Q -165 -20839 -151 -20829 L -146 -20823 -154 -20821 -177 -20823 -188 -20844 -184 -20846 M -27 -20570 Q 0 -20557 13 -20533 L 23 -20520 3 -20513 -12 -20517 Q -30 -20541 -33 -20570 L -27 -20570 M -257 -20509 Q -227 -20475 -223 -20428 L -223 -20417 Q -242 -20416 -251 -20463 L -254 -20474 Q -275 -20482 -270 -20505 -268 -20512 -257 -20509 M -69 -20528 Q -69 -20516 -74 -20508 L -85 -20501 -86 -20512 -89 -20524 -96 -20536 -92 -20543 -75 -20536 -69 -20528 M -165 -20509 L -150 -20497 -147 -20474 -146 -20463 -137 -20450 -135 -20440 -145 -20442 -158 -20451 Q -161 -20480 -174 -20507 L -165 -20509 M -3443 -20627 L -3435 -20616 Q -3452 -20589 -3469 -20616 L -3465 -20633 -3454 -20639 -3443 -20627 M -3494 -19853 L -3477 -19857 Q -3450 -19828 -3441 -19788 L -3438 -19776 -3461 -19765 Q -3489 -19804 -3500 -19845 L -3494 -19853 M -3433 -19848 L -3419 -19834 -3461 -19837 Q -3491 -19886 -3505 -19943 L -3500 -19949 Q -3464 -19902 -3433 -19848 M -3492 -19765 L -3474 -19741 -3469 -19730 Q -3512 -19696 -3520 -19762 L -3515 -19768 -3492 -19765 M -3494 -19644 L -3488 -19634 Q -3492 -19623 -3499 -19614 -3502 -19611 -3507 -19611 L -3542 -19646 -3533 -19653 -3507 -19657 -3494 -19644 M -3290 -19090 Q -3296 -19083 -3308 -19082 L -3327 -19101 Q -3329 -19127 -3300 -19121 L -3293 -19120 Q -3276 -19104 -3290 -19090 M -3601 -17730 L -3596 -17719 -3604 -17699 -3615 -17693 Q -3632 -17718 -3629 -17746 L -3623 -17754 -3601 -17730 M -3695 -17739 Q -3714 -17752 -3723 -17786 -3725 -17796 -3718 -17800 L -3694 -17792 -3688 -17785 -3690 -17762 -3695 -17739 M -3695 -16610 Q -3687 -16582 -3713 -16563 L -3722 -16553 -3722 -16541 -3722 -16530 -3753 -16526 Q -3732 -16573 -3698 -16609 L -3695 -16610 M -3767 -16594 L -3772 -16583 -3799 -16572 -3770 -16638 -3757 -16641 Q -3752 -16618 -3767 -16594 M -3668 -16533 L -3665 -16534 -3662 -16510 -3661 -16499 Q -3676 -16468 -3707 -16465 -3699 -16485 -3680 -16499 L -3673 -16529 -3668 -16533 M -3700 -15869 L -3692 -15858 Q -3701 -15853 -3712 -15850 L -3722 -15851 -3722 -15872 -3715 -15881 -3700 -15869 M -3586 -15845 L -3580 -15835 -3594 -15820 -3603 -15820 Q -3625 -15833 -3612 -15852 L -3603 -15858 -3586 -15845 M -426 -19281 L -382 -19262 -376 -19254 Q -411 -19225 -435 -19278 -437 -19284 -426 -19281 M -350 -19170 L -346 -19166 Q -392 -19142 -403 -19175 L -399 -19177 -350 -19170 M -683 -18318 L -657 -18292 -660 -18287 -672 -18285 -699 -18287 -711 -18312 -710 -18322 -683 -18318 M -520 -18639 L -515 -18629 -517 -18620 Q -522 -18615 -530 -18613 -530 -18633 -539 -18650 L -534 -18652 -520 -18639 M -591 -18153 L -650 -18149 -650 -18160 -645 -18164 -596 -18157 Q -593 -18157 -591 -18153 M -3118 -18003 L -3112 -18007 -3097 -17995 -3088 -17973 -3082 -17961 -3085 -17957 -3105 -17961 Q -3120 -17980 -3118 -18003 M -3143 -17961 L -3123 -17939 -3108 -17926 -3139 -17923 Q -3139 -17942 -3149 -17959 L -3143 -17961 M -3005 -16088 L -2993 -16077 Q -3003 -16056 -3042 -16087 -3046 -16090 -3039 -16092 L -3005 -16088 M -458 -17698 L -453 -17692 Q -475 -17680 -499 -17677 -496 -17691 -483 -17698 L -477 -17702 -476 -17704 -458 -17698 M -458 -17606 L -453 -17600 Q -517 -17571 -514 -17619 -514 -17626 -503 -17623 L -458 -17606 M -473 -17528 L -469 -17524 Q -526 -17493 -541 -17533 L -538 -17535 -473 -17528 M -443 -16945 L -438 -16940 Q -474 -16922 -480 -16949 L -476 -16952 -443 -16945 M -473 -17052 L -469 -17048 Q -529 -17020 -528 -17059 L -526 -17063 -473 -17052 M -321 -3602 L -320 -3601 -311 -3591 -321 -3588 Q -346 -3585 -355 -3623 L -350 -3626 -321 -3602 M 1079 2320 L 1078 2322 1077 2322 Q 891 2309 700 2252 L 706 2249 719 2252 Q 855 2216 982 2172 L 1000 2178 1005 2184 Q 856 2245 723 2253 L 1080 2316 1079 2320 M -1305 -16215 L -1256 -16208 -1251 -16204 Q -1298 -16179 -1309 -16213 L -1305 -16215 M -1401 -16212 L -1397 -16215 -1363 -16208 -1359 -16204 Q -1395 -16184 -1401 -16212 M 1510 -15317 L 1534 -15323 1534 -15325 1568 -15318 1573 -15314 1507 -15297 1442 -15279 1404 -15291 1510 -15317 M -538 -16123 L -488 -16116 -484 -16112 Q -531 -16089 -541 -16121 L -538 -16123 M -503 -16184 Q -529 -16182 -529 -16207 L -526 -16219 -499 -16215 -494 -16204 -484 -16192 -503 -16184 M 2765 -19146 L 2770 -19135 2747 -19116 Q 2711 -19115 2712 -19147 2724 -19165 2747 -19159 L 2755 -19158 2765 -19146 M 2885 -19185 L 2885 -19177 2876 -19170 2858 -19170 Q 2836 -19184 2858 -19201 L 2862 -19204 2885 -19185 M 3211 -17623 L 3229 -17599 3234 -17589 Q 3240 -17561 3217 -17570 L 3211 -17577 Q 3201 -17597 3201 -17619 3200 -17626 3211 -17623 M 3115 -17600 L 3130 -17588 3138 -17577 Q 3126 -17550 3109 -17591 3107 -17597 3115 -17600 M 2486 -16353 L 2522 -16334 2524 -16327 2521 -16318 Q 2517 -16313 2509 -16311 2489 -16324 2483 -16347 L 2486 -16353 M 3262 -19736 L 3265 -19726 Q 3230 -19708 3231 -19768 3231 -19775 3242 -19772 L 3262 -19736 M 1515 -15402 L 1508 -15390 1446 -15344 1419 -15344 Q 1452 -15370 1478 -15411 L 1488 -15433 1504 -15436 1511 -15436 Q 1526 -15421 1515 -15402 M 1445 -15232 L 1450 -15222 Q 1455 -15195 1427 -15191 L 1404 -15199 1406 -15233 1408 -15241 1416 -15243 1435 -15245 1445 -15232 M -417 -15210 L -403 -15221 -378 -15214 -369 -15206 -366 -15197 -376 -15191 -415 -15202 -417 -15210 M -415 -15156 L -350 -15134 -346 -15129 Q -402 -15107 -418 -15154 L -415 -15156 M -346 -15279 Q -367 -15254 -403 -15292 L -399 -15294 -351 -15286 -346 -15279 M -419 -13917 L -373 -13913 -370 -13904 -380 -13894 Q -403 -13901 -422 -13913 L -419 -13917 M -415 -13990 L -407 -13982 Q -369 -13987 -346 -13963 -401 -13932 -430 -13974 -448 -13991 -430 -14000 L -426 -14001 -415 -13990 M -3001 -12378 L -2983 -12343 -2978 -12332 -3001 -12320 -3028 -12387 Q -3031 -12393 -3020 -12389 L -3001 -12378 M -3039 -11928 L -3035 -11929 -3032 -11906 -3032 -11895 Q -3052 -11872 -3062 -11849 L -3078 -11856 Q -3073 -11883 -3051 -11902 -3055 -11922 -3039 -11928 M -442 -13740 L -429 -13727 -426 -13717 Q -462 -13723 -480 -13742 L -476 -13744 -442 -13740 M -435 -13275 L -430 -13284 -415 -13276 -415 -13268 Q -448 -13232 -435 -13275 M -507 -13307 Q -515 -13332 -492 -13333 L -484 -13334 Q -461 -13301 -499 -13301 -503 -13301 -507 -13307 M -1209 -13740 L -1205 -13729 -1201 -13717 Q -1207 -13675 -1251 -13671 -1246 -13692 -1228 -13706 L -1218 -13735 -1213 -13740 -1209 -13740 M -1162 -13636 L -1167 -13625 -1190 -13610 Q -1179 -13651 -1156 -13688 L -1148 -13694 Q -1146 -13665 -1162 -13636 M -1086 -13648 Q -1099 -13608 -1134 -13582 L -1144 -13579 Q -1122 -13609 -1111 -13644 L -1105 -13652 -1086 -13648 M -1456 -12340 L -1451 -12336 Q -1487 -12316 -1493 -12344 L -1489 -12347 -1456 -12340 M -392 -12520 L -469 -12505 -463 -12515 -452 -12526 -446 -12529 -445 -12532 -396 -12524 -392 -12520 M -409 -12465 L -407 -12459 -476 -12455 -478 -12463 -465 -12474 -409 -12465 M -804 -11988 L -802 -11998 -775 -11994 -773 -11983 -772 -11960 -762 -11947 -760 -11937 Q -797 -11940 -804 -11988 M -3366 -15186 L -3362 -15191 Q -3339 -15159 -3323 -15120 L -3323 -15110 Q -3374 -15130 -3366 -15186 M -3373 -15137 Q -3352 -15110 -3338 -15080 L -3331 -15068 -3339 -15052 Q -3367 -15089 -3379 -15135 L -3373 -15137 M -300 -11661 Q -285 -11645 -300 -11630 -305 -11624 -315 -11622 L -334 -11645 Q -328 -11668 -300 -11661 M -305 -11564 L -300 -11553 -334 -11538 -343 -11550 -346 -11561 -322 -11575 -315 -11576 -305 -11564 M -1163 -11530 Q -1174 -11496 -1198 -11463 L -1205 -11461 Q -1203 -11500 -1172 -11527 L -1163 -11530 M -1167 -11472 L -1148 -11468 Q -1152 -11445 -1161 -11423 L -1167 -11415 Q -1176 -11437 -1171 -11464 L -1167 -11472 M -1117 -11438 L -1119 -11427 -1128 -11415 Q -1133 -11375 -1162 -11345 L -1171 -11334 -1205 -11323 Q -1159 -11372 -1130 -11433 -1127 -11441 -1117 -11438 M -1102 -11376 Q -1104 -11340 -1135 -11310 -1138 -11307 -1144 -11307 -1134 -11344 -1110 -11373 L -1102 -11376 M -933 -10655 Q -928 -10631 -945 -10610 L -952 -10602 Q -962 -10626 -941 -10652 L -933 -10655 M -952 -10724 L -943 -10712 -940 -10701 -997 -10635 Q -1000 -10632 -1006 -10632 -992 -10675 -965 -10714 -960 -10721 -952 -10724 M -889 -10575 L -883 -10567 Q -886 -10540 -912 -10546 L -910 -10552 -910 -10574 -906 -10582 -889 -10575 M -498 -10681 L -495 -10670 -506 -10650 Q -509 -10647 -515 -10647 L -523 -10670 -530 -10682 -521 -10688 -507 -10693 -498 -10681 M -3143 -11150 L -3134 -11127 -3128 -11115 -3131 -11112 -3147 -11115 -3167 -11159 -3158 -11161 -3143 -11150 M -3185 -8733 Q -3184 -8740 -3174 -8737 L -3153 -8700 -3151 -8690 Q -3186 -8672 -3185 -8733 M -3108 -8667 L -3093 -8656 -3078 -8644 -3112 -8629 -3128 -8641 -3143 -8652 -3115 -8666 -3108 -8667 M -488 -9320 Q -488 -9223 -458 -9134 L -461 -9128 Q -525 -9210 -494 -9318 L -488 -9320 M -534 -9189 Q -552 -9200 -557 -9214 L -553 -9216 -535 -9210 -518 -9201 -507 -9165 -503 -9143 Q -518 -9144 -524 -9166 L -534 -9189 M -580 -9182 L -553 -9101 -549 -9090 Q -562 -9076 -584 -9097 L -614 -9155 -599 -9178 -584 -9181 -580 -9182 M -498 -8919 Q -495 -8915 -495 -8909 -521 -8889 -538 -8917 -545 -8942 -522 -8943 L -515 -8944 -498 -8919 M -504 -8856 L -499 -8852 Q -535 -8832 -541 -8860 L -538 -8863 -504 -8856 M -461 -7347 L -452 -7335 -449 -7324 -469 -7290 -476 -7278 -492 -7271 -495 -7278 -488 -7290 Q -486 -7315 -473 -7336 L -461 -7347 M -491 -7379 L -499 -7367 -518 -7374 Q -520 -7393 -502 -7403 L -488 -7401 Q -488 -7390 -491 -7379 M -411 -7294 Q -405 -7277 -407 -7259 L -407 -7248 Q -416 -7224 -438 -7225 -427 -7256 -423 -7290 -422 -7297 -411 -7294 M -1204 -6756 L -1209 -6746 -1236 -6734 -1207 -6800 -1194 -6803 Q -1189 -6780 -1204 -6756 M -1240 -6895 Q -1232 -6868 -1258 -6848 L -1267 -6838 -1267 -6826 -1267 -6815 -1282 -6811 -1282 -6834 -1282 -6846 -1243 -6894 -1240 -6895 M -3177 -7189 L -3166 -7192 -3162 -7195 -3142 -7170 -3139 -7160 Q -3163 -7136 -3185 -7183 L -3177 -7189 M -3084 -7215 L -3078 -7206 Q -3078 -7195 -3083 -7186 -3085 -7181 -3093 -7179 L -3094 -7191 -3097 -7202 -3104 -7215 -3101 -7222 Q -3091 -7220 -3084 -7215 M -3009 -4405 L -3047 -4393 Q -3057 -4412 -3049 -4436 -3046 -4442 -3035 -4439 L -3017 -4416 -3009 -4405 M -3005 -4355 Q -3040 -4360 -3058 -4380 L -3055 -4382 -3020 -4378 -3007 -4364 -3005 -4355 M -2641 -3267 L -2641 -3265 -2665 -3271 -2641 -3267 M -561 -5794 L -555 -5784 -545 -5771 -564 -5763 -580 -5767 -591 -5791 -587 -5798 -561 -5794 M -814 -4719 Q -820 -4698 -845 -4692 -850 -4709 -845 -4735 L -845 -4746 -829 -4753 -822 -4754 -815 -4730 -814 -4719 M -691 -4638 L -687 -4639 Q -679 -4622 -679 -4604 L -680 -4593 Q -697 -4573 -726 -4558 L -745 -4554 -703 -4612 Q -707 -4631 -691 -4638 M -762 -4690 L -752 -4681 Q -754 -4669 -761 -4662 -766 -4656 -775 -4654 L -789 -4697 Q -790 -4703 -779 -4700 L -762 -4690 M -332 -3501 L -323 -3491 -322 -3484 Q -330 -3478 -342 -3476 -362 -3493 -373 -3516 -376 -3521 -365 -3518 L -332 -3501 M -496 -3631 Q -493 -3631 -492 -3633 L -476 -3622 -457 -3610 -463 -3602 Q -472 -3597 -484 -3595 L -500 -3619 Q -506 -3630 -496 -3631 M -455 -3554 L -445 -3545 Q -484 -3512 -482 -3553 L -476 -3560 -455 -3554 M -956 -2359 L -929 -2356 -912 -2331 -910 -2321 Q -942 -2298 -956 -2354 L -956 -2359 M -923 -2392 Q -925 -2386 -933 -2383 -1016 -2392 -984 -2422 L -983 -2425 Q -957 -2429 -946 -2414 -939 -2406 -925 -2402 -921 -2396 -923 -2392 M -2460 -3883 L -2452 -3871 Q -2495 -3881 -2540 -3929 L -2532 -3935 -2522 -3938 Q -2519 -3938 -2517 -3940 -2485 -3915 -2460 -3883 M -2498 -3150 Q -2522 -3143 -2532 -3163 -2537 -3142 -2550 -3122 L -2552 -3115 Q -2527 -3121 -2517 -3100 -2493 -3067 -2540 -3077 -2561 -3090 -2571 -3112 -2562 -3149 -2537 -3178 L -2536 -3178 -2537 -3182 -2537 -3188 -2510 -3184 -2506 -3173 -2498 -3150 M -2549 -3038 L -2540 -3027 Q -2554 -3002 -2587 -3039 L -2578 -3045 -2564 -3050 -2549 -3038 M -857 -1275 L -852 -1270 -926 -1280 -924 -1291 -917 -1293 -857 -1275 M -891 -1196 L -864 -1189 -861 -1180 -871 -1170 Q -918 -1175 -944 -1204 L -940 -1208 -891 -1196 M -1182 -763 L -1145 -740 -1140 -733 -1154 -717 -1163 -717 -1198 -740 -1193 -757 -1182 -763 M -1345 -208 L -1336 -199 Q -1374 -166 -1372 -207 L -1366 -215 -1345 -208 M -300 -759 L -280 -737 -269 -725 -300 -713 -331 -750 Q -337 -759 -327 -761 L -327 -763 -300 -759 M -358 -680 L -357 -687 -330 -683 -315 -658 -315 -648 Q -351 -637 -358 -680 M -346 -621 Q -339 -593 -318 -572 -315 -570 -315 -564 -356 -569 -373 -616 L -373 -625 -346 -621 M -753 125 L -752 123 -729 127 -718 138 -703 150 -708 160 -722 169 -745 165 -756 154 -768 142 -765 134 -753 125 M -326 1925 L -328 1919 Q -327 1916 -323 1915 L -319 1914 Q -296 1922 -274 1932 L -269 1937 -277 1939 -315 1937 -326 1925 M -2993 1968 L -2986 1968 -2978 1980 -2970 1991 Q -2982 2024 -3008 1991 L -3016 1980 -3004 1970 -2993 1968 M -1827 2264 L -1808 2267 -1797 2279 -1788 2290 Q -1788 2296 -1791 2299 L -1804 2306 -1830 2268 -1827 2264 M -1839 2325 L -1834 2336 -1837 2345 Q -1842 2350 -1850 2352 -1862 2307 -1890 2269 L -1884 2267 Q -1853 2291 -1839 2325 M -3063 2018 L -3062 2030 Q -3094 2030 -3108 1991 L -3085 1984 -3078 1983 Q -3066 1999 -3063 2018 M -254 2030 Q -300 2054 -311 2021 L -307 2018 -258 2025 -254 2030 M -247 2147 L -261 2156 -288 2152 -297 2140 -300 2129 -294 2120 -277 2110 -254 2114 -243 2126 -238 2137 -247 2147 M -1359 3691 Q -1377 3714 -1401 3678 L -1397 3676 -1364 3684 -1359 3691 M -3565 722 L -3584 645 Q -3599 632 -3596 615 L -3592 607 -3573 610 -3566 633 Q -3516 814 -3452 991 L -3450 1002 Q -3427 1023 -3419 1048 -3486 970 -3525 856 L -3565 722 M -3563 1041 L -3557 1040 -3542 1052 Q -3531 1123 -3500 1190 L -3496 1201 -3496 1210 Q -3500 1215 -3507 1217 -3540 1149 -3552 1078 L -3553 1067 -3562 1067 Q -3595 1063 -3567 1043 L -3563 1041 M -657 5214 Q -631 5239 -596 5248 L -591 5253 Q -655 5271 -666 5218 -667 5211 -657 5214 M -699 5333 Q -701 5320 -691 5321 L -687 5322 -671 5344 -664 5352 -618 5364 -626 5383 -668 5379 Q -695 5360 -699 5333 M 244 1068 L 249 1078 218 1090 Q 189 1074 203 1050 L 207 1040 226 1044 244 1068 M 200 1179 L 199 1190 Q 193 1210 174 1196 L 165 1186 175 1165 188 1155 200 1179 M 337 1370 L 349 1382 Q 346 1403 330 1417 L 318 1428 315 1439 314 1447 284 1447 Q 299 1421 322 1401 324 1389 329 1379 L 337 1370 M 353 1431 L 362 1444 364 1454 Q 343 1476 309 1491 L 299 1493 Q 291 1464 322 1458 327 1443 338 1437 L 353 1431 M 307 1527 Q 344 1533 361 1567 L 360 1573 356 1575 330 1573 303 1536 Q 300 1530 307 1527 M 679 2160 Q 611 2226 514 2226 L 514 2222 Q 591 2206 661 2167 669 2162 679 2160 M 525 2084 Q 495 2128 436 2150 L 422 2153 Q 462 2117 509 2086 L 525 2084 M 521 2295 Q 643 2340 750 2416 L 759 2425 757 2436 752 2441 744 2437 Q 636 2352 518 2297 L 521 2295 M 337 2264 Q 514 2378 647 2545 L 652 2552 644 2554 621 2552 Q 500 2386 333 2266 L 337 2264";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -3191 -20042 Q -3105 -20068 -3018 -20076 L -2934 -20079 -2801 -20068 -2688 -20042 Q -2568 -20007 -2472 -20042 -2411 -20088 -2339 -20113 -2208 -20161 -2040 -20140 L -2028 -20138 -1999 -20134 Q -1822 -20104 -1637 -20117 L -1496 -20134 -1468 -20139 Q -1282 -20172 -1208 -20042 -1125 -19945 -1062 -19975 -1040 -19986 -1020 -20012 L -736 -20043 -626 -20057 -541 -20069 -490 -20077 -399 -20092 -288 -20114 Q -133 -20149 -144 -20042 -212 -20005 -288 -19986 L -399 -19969 -432 -19968 -541 -19961 -626 -19950 -734 -19926 Q -822 -19901 -895 -19861 L -906 -19855 Q -941 -19785 -960 -19702 -990 -19566 -1062 -19458 -1125 -19366 -1219 -19295 -1349 -19198 -1496 -19130 -1565 -19099 -1637 -19073 L -1672 -19062 Q -1846 -19005 -2018 -19027 L -2040 -19031 Q -2117 -19044 -2193 -19072 -2267 -19099 -2329 -19137 -2492 -19235 -2582 -19404 -2705 -19635 -2759 -19887 L -2799 -19904 -2934 -19956 -3018 -19986 -3191 -20042 M -3948 -16708 Q -3916 -16682 -3882 -16661 -3730 -16567 -3862 -16493 -3903 -16471 -3948 -16462 L -3948 -16708 M -3948 -15949 L -3946 -15949 -3864 -15977 -3766 -15997 -3720 -16002 Q -3618 -16014 -3521 -15957 -3441 -15911 -3399 -15839 L -3399 -15826 -3399 -15659 -3400 -15393 Q -3401 -15256 -3412 -15120 L -3420 -14952 -3529 -14945 Q -3662 -14961 -3766 -15046 L -3769 -15049 Q -3876 -15136 -3936 -15214 L -3948 -15190 -3948 -15949 M -3586 -15845 L -3603 -15858 -3612 -15852 Q -3625 -15833 -3603 -15820 L -3594 -15820 -3580 -15835 -3586 -15845 M -3700 -15869 L -3715 -15881 -3722 -15872 -3722 -15851 -3712 -15850 Q -3701 -15853 -3692 -15858 L -3700 -15869 M -1496 -19642 L -1625 -19841 Q -1650 -19636 -1562 -19378 -1550 -19340 -1496 -19349 L -1481 -19352 Q -1396 -19354 -1395 -19481 L -1496 -19642 M -1180 -19754 Q -1288 -19884 -1409 -19984 -1438 -19734 -1250 -19657 -1192 -19633 -1180 -19754 M -1062 -18634 Q -854 -18654 -894 -18198 -977 -18248 -1062 -18279 -1270 -18355 -1495 -18317 -1295 -18564 -1118 -18622 L -1062 -18634 M -1352 -17742 L -1300 -17769 -1160 -17835 Q -1104 -17859 -1062 -17864 L -1029 -17866 Q -1015 -17829 -985 -17785 -997 -17754 -993 -17699 L -940 -17651 -1062 -17447 -1089 -17403 Q -1158 -17288 -1261 -17202 L -1273 -17192 Q -1370 -17120 -1492 -17131 L -1496 -17131 -1508 -17133 Q -1582 -17143 -1637 -17179 -1684 -17211 -1717 -17261 -1712 -17325 -1663 -17456 L -1637 -17514 Q -1591 -17599 -1517 -17634 -1516 -17642 -1496 -17656 -1472 -17675 -1421 -17704 L -1352 -17742 M -2021 -19481 L -2040 -19409 Q -2047 -19360 -2041 -19309 L -2040 -19307 -2019 -19273 Q -1936 -19151 -1786 -19214 -1709 -19330 -1731 -19495 L -1898 -19999 Q -1914 -19737 -2015 -19497 L -2021 -19481 M -2331 -19452 L -2322 -19430 Q -2220 -19315 -2185 -19481 -2190 -19670 -2171 -19855 -2239 -19686 -2281 -19607 -2321 -19557 -2332 -19513 -2340 -19481 -2331 -19452 M -2432 -19586 Q -2403 -19770 -2358 -19999 -2632 -19774 -2517 -19576 -2485 -19546 -2432 -19586 M -2545 -18705 Q -2428 -18625 -2327 -18528 -2249 -18453 -2180 -18367 L -2132 -18299 -2327 -18316 -2659 -18328 Q -2727 -18328 -2746 -18303 -2769 -18349 -2767 -18403 -2713 -18650 -2545 -18705 M -2638 -17828 Q -2518 -17853 -2401 -17828 L -2327 -17811 -2262 -17794 Q -2165 -17765 -2093 -17727 L -2061 -17708 -2040 -17694 -2014 -17674 -2000 -17662 Q -1938 -17609 -1888 -17532 -1803 -17402 -1785 -17288 -1768 -17174 -1782 -17197 -1889 -17133 -2014 -17128 L -2036 -17128 -2040 -17128 -2091 -17130 Q -2197 -17139 -2286 -17181 L -2323 -17200 -2327 -17202 -2389 -17241 Q -2448 -17282 -2505 -17337 -2611 -17441 -2664 -17569 -2704 -17667 -2718 -17775 -2677 -17809 -2638 -17828 M -2014 -17550 L -2040 -17582 -2069 -17609 Q -2113 -17647 -2171 -17669 -2246 -17698 -2327 -17714 L -2420 -17727 -2608 -17736 Q -2556 -17592 -2458 -17490 -2397 -17426 -2327 -17371 L -2311 -17358 -2251 -17316 Q -2155 -17253 -2040 -17245 L -2014 -17245 -1997 -17245 -1890 -17247 Q -1915 -17361 -1980 -17493 L -2014 -17550 M -2991 -16883 L -2934 -16873 Q -2872 -16852 -2845 -16786 -2832 -16756 -2827 -16717 -2812 -16605 -2845 -16529 -2866 -16480 -2908 -16446 L -2934 -16428 Q -2970 -16406 -3018 -16393 L -3019 -16392 -3029 -16413 Q -3109 -16593 -3070 -16804 -3058 -16866 -3018 -16879 L -2991 -16883 M -601 -16395 Q -780 -16528 -620 -16765 L -602 -16790 Q -545 -16872 -519 -16879 -481 -16889 -511 -16741 L -518 -16705 Q -566 -16473 -596 -16393 L -601 -16395 M -2014 -16596 L -1917 -16594 -1652 -16578 -1637 -16577 -1496 -16566 -1379 -16551 Q -1324 -16543 -1294 -16492 -1388 -16459 -1496 -16440 L -1624 -16424 -1637 -16423 Q -1835 -16406 -2014 -16430 L -2040 -16434 -2141 -16454 -2243 -16481 Q -2340 -16553 -2184 -16580 L -2040 -16595 -2014 -16596 M -2788 -15645 Q -2721 -15710 -2587 -15766 -2532 -15789 -2474 -15800 -2567 -15698 -2432 -15591 -2378 -15548 -2327 -15546 -2262 -15543 -2202 -15605 -2137 -15672 -2173 -15771 -2126 -15752 -2086 -15722 L -2040 -15683 -2014 -15656 Q -1959 -15596 -1914 -15513 L -1913 -15507 -2014 -15492 -2026 -15490 -2040 -15488 -2292 -15478 -2327 -15480 Q -2442 -15490 -2551 -15529 -2678 -15575 -2788 -15645 M -495 -4939 Q -457 -4838 -518 -4756 L -537 -4734 Q -595 -4673 -573 -4644 -540 -4600 -518 -4550 -485 -4477 -477 -4391 -468 -4297 -512 -4238 L -513 -4239 -518 -4241 Q -551 -4260 -601 -4263 L -606 -4263 -607 -4263 -631 -4223 Q -668 -4171 -716 -4132 -771 -4088 -840 -4061 -950 -4019 -1062 -4040 L -1111 -4052 Q -1245 -4093 -1339 -4202 -1425 -4302 -1405 -4435 -1396 -4509 -1450 -4516 -1462 -4559 -1496 -4573 L -1523 -4581 -1637 -4593 -1796 -4598 -2014 -4583 -2040 -4580 -2059 -4577 Q -2072 -4542 -2072 -4520 L -2096 -4526 Q -2136 -4487 -2106 -4471 L -2188 -4345 Q -2269 -4338 -2327 -4385 L -2349 -4406 Q -2439 -4366 -2543 -4367 -2713 -4370 -2770 -4508 L -2773 -4514 -2774 -4512 -2788 -4499 Q -2815 -4474 -2845 -4464 L -2934 -4466 Q -2970 -4479 -3008 -4508 L -3018 -4516 Q -3047 -4540 -3065 -4566 L -3068 -4564 Q -3158 -4553 -3222 -4597 -3262 -4624 -3292 -4671 -3360 -4777 -3369 -4902 -3379 -5045 -3276 -5124 -3314 -5152 -3308 -5211 -3296 -5308 -3222 -5341 L -3175 -5355 -3111 -5359 Q -3068 -5357 -3051 -5335 L -3018 -5377 Q -2982 -5413 -2934 -5417 -2894 -5422 -2845 -5405 L -2824 -5397 Q -2837 -5456 -2816 -5530 -2804 -5571 -2788 -5597 -2736 -5682 -2636 -5629 L -2634 -5628 Q -2602 -5497 -2532 -5377 L -2518 -5354 Q -2458 -5255 -2386 -5183 L -2334 -5208 -2327 -5210 Q -2263 -5232 -2219 -5197 -2289 -5136 -2303 -4990 -2307 -4950 -2327 -4916 -2338 -4896 -2355 -4879 -2446 -4782 -2594 -4783 -2677 -4702 -2615 -4650 -2677 -4702 -2594 -4783 -2446 -4782 -2355 -4879 -2338 -4896 -2327 -4916 -2307 -4950 -2303 -4990 -2289 -5136 -2219 -5197 -2135 -5249 -2040 -5241 L -2014 -5238 -1985 -5232 Q -1854 -5198 -1804 -5076 L -1798 -5061 -1800 -5077 -1637 -5089 -1574 -5086 -1496 -5078 -1466 -5074 Q -1392 -5107 -1339 -5162 -1304 -5199 -1278 -5245 -1233 -5325 -1178 -5282 -1173 -5328 -1155 -5361 -1129 -5413 -1076 -5435 L -1062 -5440 -1018 -5450 Q -892 -5464 -786 -5385 -739 -5350 -716 -5303 -702 -5274 -696 -5241 -690 -5204 -694 -5161 -698 -5122 -711 -5095 -648 -5093 -601 -5068 -550 -5041 -518 -4987 L -507 -4967 -495 -4939 M -1076 -17678 Q -1074 -17736 -1099 -17779 -1208 -17745 -1305 -17671 -1415 -17589 -1496 -17479 -1589 -17353 -1602 -17268 -1550 -17245 -1496 -17242 -1426 -17238 -1354 -17268 -1221 -17324 -1152 -17431 -1078 -17545 -1076 -17678 M -173 -16816 L -167 -16818 -151 -16824 65 -16901 89 -16909 288 -16976 313 -16985 Q 434 -17027 559 -17054 L 820 -17112 837 -17116 1010 -17155 1071 -17170 1208 -17198 1307 -17212 Q 1444 -17228 1579 -17256 L 1611 -17262 1833 -17300 1930 -17313 2014 -17324 2083 -17332 2343 -17365 2391 -17371 2563 -17396 2609 -17404 2880 -17457 Q 3008 -17485 3141 -17478 3263 -17471 3150 -17376 3085 -17320 2999 -17298 L 2761 -17236 2563 -17182 2508 -17167 2391 -17133 2277 -17099 2014 -17019 2012 -17019 1930 -16995 1753 -16949 Q 1680 -16931 1611 -16905 1550 -16884 1493 -16856 1371 -16829 1354 -16692 1340 -16583 1465 -16558 L 1611 -16538 Q 1674 -16534 1739 -16536 L 1930 -16550 1992 -16558 2014 -16561 2250 -16600 2391 -16626 2523 -16648 2563 -16653 2781 -16660 Q 2985 -16649 2815 -16543 2735 -16494 2640 -16474 L 2563 -16458 2394 -16418 2391 -16417 Q 2268 -16386 2149 -16343 L 2014 -16290 1930 -16253 1899 -16239 Q 1761 -16174 1759 -16040 1759 -16003 1791 -15976 1854 -15922 1930 -15901 L 2014 -15887 2027 -15887 Q 2159 -15883 2263 -15800 2352 -15728 2227 -15669 2124 -15620 2014 -15602 L 1970 -15596 1930 -15592 1696 -15578 Q 1647 -15576 1611 -15561 1531 -15526 1522 -15421 L 1510 -15317 1404 -15291 1442 -15279 1507 -15297 1477 -15157 Q 1430 -14977 1302 -15048 1249 -15077 1220 -15130 L 1208 -15150 Q 1144 -15256 1045 -15325 L 1010 -15346 970 -15365 Q 889 -15359 837 -15289 812 -15256 794 -15207 747 -15079 678 -14970 649 -14926 613 -14953 502 -15034 440 -15153 L 403 -15221 Q 358 -15167 288 -15108 L 223 -15056 Q 161 -15008 89 -14981 30 -14959 -36 -14952 -147 -14940 -227 -14990 L -232 -14993 -287 -15027 -287 -15365 Q -287 -15485 -262 -15603 -246 -15684 -220 -15753 -139 -15914 -45 -15964 21 -16000 89 -16008 129 -16014 171 -16009 L 288 -15993 326 -15984 414 -15956 Q 458 -15943 606 -15914 L 798 -15881 837 -15886 Q 931 -15907 870 -15986 L 837 -16018 798 -16039 Q 708 -16080 624 -16135 471 -16236 610 -16301 713 -16349 837 -16386 L 873 -16397 Q 865 -16435 837 -16455 795 -16485 710 -16474 L 460 -16465 Q 387 -16468 324 -16500 L 288 -16522 Q 227 -16571 288 -16628 L 345 -16668 Q 456 -16732 546 -16840 436 -16886 305 -16842 L 288 -16836 89 -16773 61 -16765 Q -22 -16740 -83 -16756 -141 -16783 -166 -16808 L -173 -16816 M 1445 -15232 L 1435 -15245 1416 -15243 1408 -15241 1406 -15233 1404 -15199 1427 -15191 Q 1455 -15195 1450 -15222 L 1445 -15232 M 1515 -15402 Q 1526 -15421 1511 -15436 L 1504 -15436 1488 -15433 1478 -15411 Q 1452 -15370 1419 -15344 L 1446 -15344 1508 -15390 1515 -15402 M -1557 -15039 L -1552 -15039 -1496 -15041 -1322 -15049 Q -1192 -15056 -1062 -15051 L -1049 -15051 -933 -15034 Q -1002 -15024 -1062 -14970 L -1067 -14966 -1257 -14776 Q -1373 -14649 -1466 -14682 L -1485 -14754 -1496 -14805 Q -1520 -14911 -1551 -15018 L -1557 -15037 -1557 -15039 M -2023 -14716 L -2040 -14701 Q -2136 -14628 -2242 -14739 L -2327 -14821 -2432 -14910 Q -2540 -14997 -2668 -15023 L -2669 -15023 -2701 -15028 -2669 -15027 -2464 -15039 -2327 -15051 -2206 -15058 -2040 -15053 -2014 -15050 -1957 -15043 -1992 -14914 -2014 -14819 -2037 -14717 -2040 -14703 -2023 -14716 M -986 -15740 L -931 -15715 Q -865 -15681 -804 -15659 -814 -15609 -895 -15553 -962 -15508 -1062 -15484 L -1110 -15474 Q -1243 -15452 -1379 -15468 L -1496 -15492 Q -1567 -15514 -1624 -15551 -1569 -15615 -1496 -15668 L -1437 -15709 Q -1375 -15748 -1307 -15765 -1374 -15641 -1238 -15559 -1144 -15503 -1062 -15553 -1035 -15569 -1010 -15597 -955 -15657 -986 -15740 M -1637 -14372 Q -1721 -14380 -1688 -14502 -1657 -14487 -1637 -14454 -1618 -14422 -1610 -14373 L -1637 -14372 M -1917 -14353 Q -1942 -14492 -1839 -14530 -1839 -14379 -1917 -14353 M -2631 -13358 Q -2536 -13338 -2439 -13295 -2383 -13270 -2334 -13243 L -2327 -13239 Q -2281 -13214 -2242 -13187 L -2242 -13014 Q -2142 -12994 -2183 -12842 -2233 -12739 -2255 -12633 L -2285 -12658 Q -2300 -12599 -2327 -12539 L -2341 -12510 -2327 -12518 Q -2192 -12592 -2062 -12627 L -2040 -12632 -2014 -12638 Q -1903 -12658 -1789 -12641 L -1637 -12543 -1565 -12498 -1496 -12450 Q -1418 -12392 -1358 -12324 L -1359 -12080 Q -1358 -11950 -1360 -11821 -1361 -11695 -1353 -11570 L -1337 -11304 Q -1329 -11172 -1334 -11038 L -1336 -10916 -1473 -10902 Q -1478 -10926 -1496 -10937 L -1500 -10939 Q -1588 -10978 -1594 -10896 L -1637 -10922 -1724 -10973 Q -1735 -11113 -1724 -11237 L -1637 -11245 Q -1595 -11259 -1556 -11289 -1523 -11395 -1496 -11501 L -1486 -11539 Q -1456 -11665 -1444 -11793 -1430 -11827 -1432 -11858 -1434 -11897 -1462 -11932 L -1496 -11976 -1620 -12148 -1637 -12173 Q -1700 -12270 -1753 -12382 -1851 -12289 -1936 -12184 L -2014 -12075 -2040 -12032 -2078 -11962 -2079 -11960 -2078 -11960 -2040 -11966 -2014 -11968 Q -1907 -11971 -1837 -11898 -1906 -11866 -2014 -11872 L -2040 -11874 -2111 -11887 Q -2141 -11813 -2160 -11734 -2190 -11604 -2187 -11469 L -2185 -11389 -2179 -11196 Q -2173 -11060 -2177 -10923 L -2152 -10832 -2090 -10632 Q -2061 -10537 -2040 -10435 L -2031 -10393 -2014 -10416 Q -1935 -10510 -1832 -10442 L -1815 -10430 Q -1789 -10410 -1773 -10385 -1759 -10362 -1753 -10334 -1876 -10413 -1931 -10263 -1953 -10204 -1896 -10179 -1803 -10139 -1767 -10233 -1709 -10086 -1865 -10038 -1952 -10011 -1996 -10068 L -1993 -9817 Q -1995 -9692 -2012 -9552 L -2014 -9541 Q -2024 -9462 -2040 -9386 L -2064 -9283 Q -2098 -9154 -2122 -9099 L -2123 -9098 -2122 -9098 -2120 -9098 Q -2070 -9099 -2040 -9075 -2024 -9063 -2014 -9044 -1990 -9002 -1993 -8926 -1995 -8871 -2014 -8825 -2024 -8801 -2040 -8780 -2068 -8742 -2112 -8713 -2238 -8631 -2291 -8787 -2332 -8908 -2309 -9034 -2284 -9167 -2240 -9294 -2197 -9418 -2206 -9551 -2214 -9668 -2233 -9773 L -2238 -9801 -2263 -9990 Q -2277 -10123 -2304 -10254 L -2327 -10354 Q -2348 -10435 -2378 -10514 -2424 -10635 -2492 -10745 -2561 -10858 -2723 -10823 -2715 -10955 -2712 -11088 -2709 -11217 -2711 -11347 -2714 -11484 -2705 -11620 -2697 -11753 -2696 -11886 -2694 -12012 -2682 -12154 -2631 -12216 -2608 -12253 -2576 -12327 -2510 -12377 -2403 -12458 -2341 -12510 -2462 -12524 -2594 -12592 L -2745 -12669 -2788 -12678 -2801 -12681 -2845 -12693 Q -2899 -12713 -2934 -12749 -2972 -12789 -2989 -12849 -2951 -12950 -2941 -13101 L -2934 -13158 Q -2914 -13267 -2845 -13305 L -2841 -13307 -2788 -13331 Q -2731 -13354 -2673 -13366 L -2631 -13358 M -1239 -12621 Q -1256 -12660 -1276 -12692 L -1343 -12849 Q -1367 -12893 -1379 -12978 -1335 -13000 -1283 -13022 L -1335 -13136 -1191 -13227 -1112 -13278 -1062 -13307 Q -986 -13346 -905 -13359 L -741 -13306 -716 -13238 -652 -13039 Q -630 -12964 -618 -12892 -669 -12897 -714 -12853 L -716 -12851 Q -827 -12743 -855 -12620 -920 -12597 -990 -12584 L -1062 -12571 -1215 -12548 -1239 -12621 M -2637 -13014 Q -2528 -12996 -2424 -12949 L -2327 -12905 -2183 -12842 -2327 -12905 -2424 -12949 Q -2528 -12996 -2637 -13014 M -2242 -13014 Q -2276 -13032 -2327 -13050 L -2386 -13069 Q -2539 -13114 -2630 -13122 -2539 -13114 -2386 -13069 L -2327 -13050 Q -2276 -13032 -2242 -13014 M -2104 -8990 Q -2194 -8907 -2162 -9062 -2154 -9096 -2123 -9098 -2154 -9096 -2162 -9062 -2194 -8907 -2104 -8990 M -2079 -11960 L -2111 -11887 -2079 -11960 M -2658 -12885 Q -2552 -12864 -2463 -12798 L -2327 -12693 -2285 -12658 -2327 -12693 -2463 -12798 Q -2552 -12864 -2658 -12885 M -1637 -11858 L -1664 -11881 -1637 -11895 -1496 -11889 Q -1463 -11878 -1432 -11858 -1466 -11840 -1496 -11832 -1554 -11817 -1637 -11858 M -912 -12792 L -1027 -12756 -1062 -12744 Q -1172 -12709 -1276 -12692 -1172 -12709 -1062 -12744 L -1027 -12756 -912 -12792 M -934 -13007 Q -994 -12975 -1062 -12947 L -1105 -12931 Q -1232 -12884 -1343 -12849 -1232 -12884 -1105 -12931 L -1062 -12947 Q -994 -12975 -934 -13007 M -941 -13158 L -1062 -13110 -1142 -13080 -1283 -13022 -1142 -13080 -1062 -13110 -941 -13158 M -1456 -12340 L -1489 -12347 -1493 -12344 Q -1487 -12316 -1451 -12336 L -1456 -12340 M -1286 -9910 Q -1387 -10003 -1272 -10054 -1144 -10061 -1201 -9925 -1252 -9895 -1286 -9910 M -2031 -10393 L -2026 -10365 -2014 -10286 Q -2000 -10186 -1996 -10084 L -1996 -10068 -1996 -10084 Q -2000 -10186 -2014 -10286 L -2026 -10365 -2031 -10393 M -2422 -9873 Q -2386 -9818 -2419 -9772 -2482 -9715 -2534 -9754 -2625 -9859 -2500 -9896 -2458 -9916 -2422 -9873 M -1811 -7267 Q -1841 -7400 -1880 -7533 L -1918 -7676 -1645 -7697 Q -1653 -7582 -1685 -7445 -1707 -7350 -1709 -7262 L -1811 -7267 M -2378 -5175 L -2386 -5183 -2378 -5175 M -2817 -5311 Q -2814 -5347 -2788 -5372 L -2773 -5385 Q -2641 -5475 -2577 -5303 L -2518 -5354 -2577 -5303 Q -2641 -5475 -2773 -5385 L -2788 -5372 Q -2814 -5347 -2817 -5311 M -1767 -4959 L -1798 -5061 -1767 -4959 M -2386 -5183 Q -2432 -5154 -2464 -5110 -2553 -5204 -2683 -5244 -2736 -5260 -2788 -5260 L -2845 -5254 Q -2890 -5245 -2934 -5223 L -2945 -5217 -3018 -5169 Q -3088 -5114 -3097 -5052 -3088 -5114 -3018 -5169 L -2945 -5217 -2934 -5223 Q -2890 -5245 -2845 -5254 L -2788 -5260 Q -2736 -5260 -2683 -5244 -2553 -5204 -2464 -5110 -2432 -5154 -2386 -5183 M -661 -4564 Q -621 -4531 -601 -4486 L -594 -4468 Q -560 -4367 -601 -4275 L -606 -4265 -607 -4263 -606 -4265 -601 -4275 Q -560 -4367 -594 -4468 L -601 -4486 Q -621 -4531 -661 -4564 M -3075 -4736 Q -3117 -4642 -3065 -4566 -3117 -4642 -3075 -4736 M -1566 -3037 Q -1561 -3067 -1509 -3084 L -1496 -3084 Q -1409 -3081 -1421 -2966 -1422 -2997 -1424 -2988 L -1426 -2982 -1428 -2990 -1426 -2982 -1430 -2969 -1430 -2968 -1431 -2967 Q -1452 -2907 -1496 -2934 L -1512 -2946 Q -1551 -2981 -1562 -3008 L -1563 -3012 -1566 -3037 M -1948 -2978 Q -1954 -2965 -1981 -2947 -1998 -2935 -2014 -2928 L -2040 -2919 Q -2091 -2911 -2120 -2967 L -2121 -2968 -2130 -2988 -2130 -2993 Q -2132 -3055 -2076 -3076 L -2040 -3083 -2014 -3082 Q -1959 -3072 -1947 -2990 L -1948 -2978 M -2280 -2909 L -2285 -2881 Q -2298 -2830 -2327 -2819 -2353 -2810 -2391 -2831 -2426 -2928 -2327 -2946 L -2321 -2947 -2290 -2934 -2285 -2920 -2280 -2909 M -2040 -4022 L -2014 -4042 Q -1916 -4111 -1789 -4111 -1707 -4111 -1637 -4082 -1567 -4053 -1510 -3996 L -1496 -3981 Q -1394 -3870 -1394 -3716 -1394 -3562 -1496 -3451 L -1510 -3437 Q -1567 -3379 -1637 -3350 -1707 -3321 -1789 -3321 -1916 -3321 -2014 -3390 L -2040 -3410 -2069 -3437 Q -2184 -3552 -2184 -3716 -2184 -3880 -2069 -3996 L -2040 -4022 M -876 -5225 Q -850 -5201 -822 -5222 -792 -5245 -813 -5270 -922 -5406 -976 -5223 -1019 -5077 -879 -5044 -759 -5016 -716 -5087 L -711 -5095 -716 -5087 Q -759 -5016 -879 -5044 -1019 -5077 -976 -5223 -922 -5406 -813 -5270 -792 -5245 -822 -5222 -850 -5201 -876 -5225 M -814 -4719 L -815 -4730 -822 -4754 -829 -4753 -845 -4746 -845 -4735 Q -850 -4709 -845 -4692 -820 -4698 -814 -4719 M -1149 -4672 Q -1215 -4633 -1186 -4727 -1168 -4786 -1130 -4754 -1045 -4683 -1165 -4606 -1261 -4544 -1304 -4644 -1355 -4760 -1334 -4896 -1309 -5060 -1466 -5074 -1309 -5060 -1334 -4896 -1355 -4760 -1304 -4644 -1261 -4544 -1165 -4606 -1045 -4683 -1130 -4754 -1168 -4786 -1186 -4727 -1215 -4633 -1149 -4672 M -762 -4690 L -779 -4700 Q -790 -4703 -789 -4697 L -775 -4654 Q -766 -4656 -761 -4662 -754 -4669 -752 -4681 L -762 -4690 M -691 -4638 Q -707 -4631 -703 -4612 L -745 -4554 -726 -4558 Q -697 -4573 -680 -4593 L -679 -4604 Q -679 -4622 -687 -4639 L -691 -4638 M -1181 -2868 L -1181 -2864 -1181 -2863 Q -1183 -2824 -1234 -2820 -1301 -2877 -1282 -2923 -1271 -2952 -1228 -2976 -1187 -2914 -1182 -2876 L -1184 -2867 -1181 -2868 M -970 -2710 Q -1008 -2709 -1031 -2734 L -1062 -2773 Q -1072 -2789 -1071 -2799 L -1020 -2810 Q -929 -2764 -970 -2710 M -861 -2615 Q -797 -2578 -790 -2538 -796 -2482 -810 -2461 L -818 -2452 Q -837 -2439 -867 -2468 -956 -2553 -891 -2587 -866 -2594 -861 -2615 M -637 -2049 Q -608 -1931 -653 -1908 L -716 -1909 -725 -1912 Q -794 -1989 -716 -2035 -701 -2045 -680 -2052 -655 -2033 -637 -2049 M -2531 -2786 Q -2464 -2653 -2594 -2671 L -2612 -2674 -2620 -2689 -2620 -2691 Q -2655 -2773 -2536 -2796 L -2531 -2786 M -2680 -2588 L -2659 -2569 -2643 -2550 Q -2630 -2532 -2631 -2517 -2639 -2408 -2707 -2428 L -2708 -2430 Q -2723 -2458 -2752 -2451 -2763 -2509 -2742 -2543 -2724 -2575 -2680 -2588 M -2860 -2322 L -2845 -2297 Q -2828 -2266 -2823 -2243 -2814 -2202 -2845 -2187 L -2873 -2180 Q -2969 -2254 -2860 -2322 M -2880 -2051 L -2845 -2027 Q -2754 -1956 -2845 -1891 L -2888 -1892 -2899 -1901 Q -2923 -1925 -2934 -1946 -2954 -1985 -2934 -2013 -2919 -2035 -2880 -2051 M -2014 -1795 L -1989 -1762 -2014 -1726 -2033 -1703 -2034 -1703 -2040 -1708 Q -2089 -1745 -2174 -1780 -2248 -1810 -2327 -1810 L -2436 -1796 Q -2566 -1764 -2653 -1707 L -2687 -1740 Q -2599 -1830 -2471 -1880 -2400 -1908 -2327 -1912 L -2207 -1902 Q -2105 -1881 -2040 -1822 L -2014 -1795 M -1933 -1036 Q -1988 -1048 -2014 -1068 -2061 -1103 -2014 -1163 L -1977 -1201 Q -1947 -1228 -1897 -1222 -1929 -1140 -1933 -1036 M -2220 -568 L -2263 -619 Q -2224 -677 -2155 -734 -2096 -784 -2040 -839 L -2014 -865 -1961 -921 Q -1852 -885 -1710 -890 L -1637 -897 Q -1595 -905 -1559 -921 L -1496 -863 -1362 -737 Q -1264 -642 -1292 -566 -1382 -600 -1487 -676 L -1496 -682 Q -1561 -727 -1637 -745 L -1724 -757 Q -1863 -764 -1987 -705 L -2014 -692 -2040 -678 Q -2139 -627 -2220 -568 M -1066 -1875 L -1062 -1873 Q -945 -1826 -876 -1740 -896 -1714 -919 -1694 -959 -1746 -1031 -1788 L -1062 -1804 Q -1164 -1851 -1278 -1815 -1403 -1775 -1493 -1709 L -1496 -1711 -1552 -1761 -1496 -1814 Q -1419 -1876 -1320 -1897 -1189 -1925 -1066 -1875 M -1496 -1102 Q -1502 -1082 -1517 -1059 -1532 -1034 -1559 -1028 -1563 -1138 -1609 -1230 -1516 -1209 -1496 -1161 -1485 -1135 -1496 -1102 M -2788 2181 L -2687 2184 Q -2592 2202 -2602 2290 -2621 2447 -2738 2450 L -2788 2447 Q -2821 2438 -2845 2411 L -2856 2396 Q -2937 2277 -2845 2209 -2827 2195 -2802 2184 L -2788 2181 M -1637 2606 L -1648 2591 Q -1711 2476 -1637 2424 -1615 2409 -1581 2399 -1526 2397 -1496 2414 -1455 2436 -1461 2491 -1468 2562 -1496 2596 -1532 2639 -1602 2622 -1623 2620 -1637 2606 M -2080 2923 Q -2087 2839 -2040 2793 L -2014 2773 Q -1984 2754 -1940 2744 -1854 2714 -1813 2744 -1682 2836 -1800 2956 -1902 3059 -2005 3025 L -2014 3022 -2040 3006 Q -2076 2977 -2080 2923 M -2422 3900 L -2393 3944 Q -2459 4069 -2327 4047 L -2281 4036 Q -2257 4029 -2184 3966 -2245 4084 -2068 4064 L -2040 4060 -2014 4054 Q -1959 4038 -1919 4004 -2024 4144 -2002 4289 -1992 4353 -1963 4408 -1984 4380 -2014 4356 L -2034 4341 -2040 4337 Q -2151 4263 -2280 4247 L -2327 4243 Q -2437 4235 -2529 4260 -2637 4203 -2593 4064 -2548 3925 -2422 3900 M -3222 2213 Q -3190 2192 -3118 2198 -3035 2299 -3141 2352 -3196 2365 -3222 2331 L -3232 2313 Q -3265 2239 -3222 2213 M -2842 2539 L -2844 2554 -2854 2588 Q -2864 2608 -2897 2618 L -2934 2608 Q -2981 2593 -3018 2570 L -3054 2543 Q -3126 2519 -3060 2466 L -2970 2481 Q -2902 2488 -2871 2513 L -2842 2539 M -1327 4014 L -1313 3967 Q -1294 3906 -1284 3843 L -1278 3807 -1278 3801 -1278 3779 -1267 3618 -1113 3851 -1062 3849 Q -1003 3838 -972 3785 -965 3677 -1032 3577 -1034 3543 -1019 3521 -942 3503 -872 3558 -749 3656 -723 3773 -764 3775 -810 3806 -849 3832 -873 3874 -947 3998 -1062 3966 L -1086 3958 Q -1232 3900 -1327 4014 M -430 2281 L -421 2319 Q -409 2367 -404 2411 -469 2433 -518 2437 -568 2441 -601 2426 -625 2415 -645 2395 -694 2272 -601 2247 -583 2242 -518 2258 L -430 2281 M -654 2584 Q -624 2596 -601 2614 -547 2655 -539 2723 -524 2777 -589 2801 L -623 2746 Q -652 2692 -707 2674 -764 2657 -809 2681 -855 2704 -876 2658 -813 2558 -716 2568 -687 2571 -654 2584 M -977 2292 Q -974 2186 -855 2184 -762 2181 -805 2254 -896 2410 -977 2292 M -1595 3032 Q -1552 2963 -1445 2989 L -1494 3040 Q -1528 3071 -1572 3082 -1639 3100 -1595 3032 M -1063 5653 L -1087 5786 -1091 5827 -1092 5831 -1092 5834 -1097 5922 Q -1099 5990 -1094 6058 -1057 6093 -1089 6160 -1179 6349 -1180 6056 L -1180 6042 Q -1153 5997 -1151 5922 L -1152 5831 -1152 5827 -1152 5820 Q -1154 5690 -1188 5563 -1218 5446 -1279 5361 -1458 5181 -1366 5013 -1300 4992 -1281 5020 -1219 5059 -1193 5129 -1101 5381 -1063 5649 L -1063 5653 M -1802 5194 Q -1783 5287 -1772 5382 -1758 5500 -1769 5620 -1781 5757 -1751 5892 -1722 6023 -1698 6153 L -1681 6230 Q -1699 6473 -1794 6733 -1842 6863 -1861 6947 L -1890 6704 Q -1895 6585 -1916 6467 L -1960 6202 Q -1979 6079 -1972 5956 -1965 5820 -1947 5684 -1931 5563 -1889 5450 -1842 5324 -1802 5194";
	ctx.fillStyle=tocolor(ctrans.apply([78,78,78,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -144 -20042 Q -125 -19746 -139 -19579 -154 -19413 -144 -19379 -83 -19366 -70 -19409 -45 -19688 68 -19913 L 89 -19958 Q 138 -20075 112 -20157 59 -20364 232 -20443 312 -20618 202 -20730 L 189 -20742 171 -20758 164 -20763 128 -20787 89 -20809 -62 -20890 Q -152 -20938 -287 -20972 L -399 -20996 -500 -21013 -525 -21017 -617 -21030 -755 -21047 -1062 -21079 -1491 -21104 -1589 -21106 -1637 -21107 -2039 -21107 -2043 -21107 -2125 -21106 -2356 -21097 -2702 -21064 -2818 -21047 -2934 -21029 -3018 -21015 -3168 -20985 -3211 -20975 -3246 -20967 Q -3446 -20918 -3573 -20841 -3712 -20758 -3736 -20719 L -3746 -20700 Q -3821 -20559 -3746 -20433 -3738 -20263 -3647 -20145 -3588 -20157 -3535 -20131 -3545 -19852 -3568 -19636 -3548 -19453 -3508 -19338 L -3464 -19208 Q -3429 -19251 -3402 -19297 -3302 -19468 -3298 -19682 -3295 -19858 -3231 -19978 L -3191 -20042 Q -3105 -20068 -3018 -20076 L -2934 -20079 -2801 -20068 -2688 -20042 Q -2568 -20007 -2472 -20042 -2411 -20088 -2339 -20113 -2208 -20161 -2040 -20140 L -2028 -20138 -1999 -20134 Q -1822 -20104 -1637 -20117 L -1496 -20134 -1468 -20139 Q -1282 -20172 -1208 -20042 -1125 -19945 -1062 -19975 -1040 -19986 -1020 -20012 L -736 -20043 -626 -20057 -541 -20069 -490 -20077 -399 -20092 -288 -20114 Q -133 -20149 -144 -20042 -212 -20005 -288 -19986 L -399 -19969 -432 -19968 -541 -19961 -626 -19950 -734 -19926 Q -822 -19901 -895 -19861 L -906 -19855 Q -941 -19785 -960 -19702 -990 -19566 -1062 -19458 -1125 -19366 -1219 -19295 -1349 -19198 -1496 -19130 -1565 -19099 -1637 -19073 L -1672 -19062 Q -1846 -19005 -2018 -19027 L -2040 -19031 Q -2117 -19044 -2193 -19072 -2267 -19099 -2329 -19137 -2492 -19235 -2582 -19404 -2705 -19635 -2759 -19887 L -2799 -19904 -2934 -19956 -3018 -19986 -3191 -20042 M -3948 -18336 L -3894 -18302 -3769 -18222 -3699 -18175 -3507 -18048 -3375 -17959 Q -3379 -18063 -3373 -18167 -3364 -18294 -3334 -18419 -3394 -18499 -3327 -18561 -3319 -18711 -3393 -18818 -3612 -18965 -3464 -19208 M -3948 -17141 L -3821 -17103 -3766 -17088 -3682 -17075 -3610 -17061 -3556 -17051 -3503 -17040 -3464 -17026 Q -3443 -17014 -3383 -16985 L -3383 -17053 -3381 -17108 Q -3376 -17182 -3355 -17245 L -3334 -17298 Q -3360 -17320 -3364 -17362 L -3369 -17421 Q -3433 -17510 -3524 -17570 -3628 -17638 -3741 -17695 L -3767 -17710 Q -3824 -17750 -3830 -17816 -3837 -17899 -3767 -17881 L -3760 -17879 Q -3638 -17842 -3519 -17786 -3425 -17742 -3366 -17765 L -3369 -17843 Q -3548 -17930 -3734 -18052 L -3768 -18075 -3948 -18202 M -3375 -17959 L -3372 -17894 -3369 -17843 M -3369 -17421 L -3346 -17387 -3325 -17346 M -3948 -17449 L -3929 -17441 Q -3850 -17403 -3766 -17373 L -3738 -17363 Q -3657 -17335 -3576 -17321 -3521 -17311 -3468 -17287 -3431 -17269 -3391 -17258 L -3367 -17249 M -3948 -17321 L -3898 -17301 -3766 -17250 -3708 -17229 Q -3618 -17198 -3529 -17161 L -3406 -17109 M -3948 -16856 Q -3898 -16854 -3845 -16835 L -3766 -16807 -3619 -16758 Q -3542 -16733 -3399 -16713 L -3393 -16787 -3392 -16799 Q -3543 -16866 -3623 -16894 L -3766 -16946 -3852 -16978 -3948 -17011 M -3334 -17298 L -3308 -17328 Q -3279 -17354 -3231 -17372 -3265 -17544 -3237 -17729 L -3222 -17814 Q -3177 -18035 -3076 -18188 L -3076 -18288 -3018 -18438 -2968 -18548 -2934 -18614 -2843 -18770 -2790 -18840 Q -2712 -18926 -2602 -18964 -2464 -18888 -2327 -18776 L -2177 -18641 Q -2099 -18564 -2040 -18487 L -2015 -18453 Q -1972 -18393 -1941 -18332 L -1711 -18346 -1637 -18450 Q -1572 -18541 -1496 -18636 L -1394 -18762 Q -1261 -18923 -1062 -18934 L -1035 -18935 Q -816 -18811 -719 -18567 L -708 -18537 Q -668 -18424 -654 -18305 -647 -18248 -647 -18188 M -3948 -16708 Q -3916 -16682 -3882 -16661 -3730 -16567 -3862 -16493 -3903 -16471 -3948 -16462 M -3948 -15949 L -3946 -15949 -3864 -15977 -3766 -15997 -3720 -16002 Q -3618 -16014 -3521 -15957 -3441 -15911 -3399 -15839 L -3399 -15826 -3399 -15659 -3400 -15393 Q -3401 -15256 -3412 -15120 L -3420 -14952 -3420 -14869 -3415 -14733 -3410 -14617 Q -3401 -14483 -3350 -14365 L -3305 -14251 Q -3294 -14220 -3275 -14190 L -3266 -14276 -3222 -14246 Q -3112 -14166 -3059 -14047 L -3054 -14035 -3055 -14048 Q -3065 -14149 -3080 -14251 -3099 -14389 -3132 -14522 -3164 -14652 -3153 -14785 -3083 -14750 -3019 -14681 -3028 -14765 -3026 -14854 -3017 -15132 -3056 -15386 -3097 -15646 -3161 -15888 -3230 -16151 -3105 -16377 L -3113 -16390 Q -3163 -16478 -3220 -16600 L -3222 -16604 Q -3335 -16852 -3241 -17110 -3240 -17153 -3222 -17186 L -3191 -17225 -3222 -17328 -3231 -17372 M -3383 -16985 L -3392 -16799 M -1029 -17866 Q -1078 -18001 -906 -18042 -804 -18112 -717 -18111 -660 -18111 -610 -18081 -565 -18055 -524 -18004 L -484 -17946 Q -385 -17716 -404 -17425 L -416 -17327 -399 -17320 Q -331 -17292 -288 -17235 L -282 -17227 -276 -17290 Q -247 -17374 -234 -17394 -158 -17506 -42 -17577 22 -17616 89 -17651 L 193 -17702 Q 277 -17741 288 -17815 L 289 -17823 288 -17856 Q 278 -17905 213 -17886 L 89 -17846 Q 20 -17823 -47 -17793 -153 -17746 -218 -17775 L -256 -17801 -273 -17822 Q -274 -17888 -280 -17916 -280 -17936 -288 -17947 L -302 -17958 -288 -18081 Q -278 -18183 -273 -18288 -268 -18394 -275 -18490 L -288 -18603 Q -303 -18696 -331 -18777 -309 -18790 -288 -18810 L -247 -18858 Q -108 -19048 -204 -19297 -254 -19417 -288 -19535 -326 -19667 -343 -19797 M -624 -19569 Q -578 -19485 -537 -19393 L -509 -19327 -536 -19350 -623 -19421 -728 -19500 Q -789 -19545 -848 -19582 -805 -19686 -772 -19796 L -731 -19740 Q -674 -19659 -624 -19569 M -723 -19076 Q -785 -19190 -863 -19294 -889 -19243 -922 -19195 -834 -19054 -722 -18963 -684 -18932 -643 -18907 -679 -18994 -723 -19076 M -144 -19379 Q -147 -19334 -204 -19297 M -1496 -19642 L -1625 -19841 Q -1650 -19636 -1562 -19378 -1550 -19340 -1496 -19349 L -1481 -19352 Q -1396 -19354 -1395 -19481 L -1496 -19642 M -1180 -19754 Q -1288 -19884 -1409 -19984 -1438 -19734 -1250 -19657 -1192 -19633 -1180 -19754 M -1062 -18634 Q -854 -18654 -894 -18198 -977 -18248 -1062 -18279 -1270 -18355 -1495 -18317 -1295 -18564 -1118 -18622 L -1062 -18634 M -1517 -17634 Q -1537 -17727 -1538 -17904 L -1538 -18001 -1509 -17915 -1496 -17879 Q -1463 -17791 -1426 -17713 -1372 -17844 -1340 -17983 L -1339 -17987 -1338 -17984 Q -1326 -17921 -1309 -17785 L -1352 -17742 -1300 -17769 -1160 -17835 Q -1104 -17859 -1062 -17864 L -1029 -17866 Q -1015 -17829 -985 -17785 -965 -17840 -892 -17814 M -273 -17822 L -250 -17823 Q -228 -17829 -212 -17849 -64 -17916 89 -18002 L 185 -18059 288 -18124 422 -18213 Q 505 -18270 626 -18336 L 837 -18454 893 -18486 1010 -18552 1181 -18648 1208 -18663 1447 -18796 1611 -18880 1685 -18915 1889 -19010 1928 -19028 2014 -19069 2138 -19131 2379 -19257 2391 -19263 2563 -19357 2603 -19379 Q 2709 -19438 2805 -19485 2901 -19532 2990 -19566 3078 -19600 3154 -19596 3229 -19593 3208 -19457 3186 -19321 2936 -19152 2690 -18986 2563 -18890 L 2559 -18887 2391 -18763 2317 -18711 2136 -18583 2014 -18497 1961 -18460 1930 -18439 Q 1873 -18402 1816 -18373 L 1754 -18340 1930 -18334 Q 1979 -18321 2014 -18290 2060 -18251 2084 -18184 2131 -18146 2014 -18078 L 1930 -18036 1914 -18028 Q 1744 -17952 1611 -17898 L 1518 -17862 Q 1365 -17804 1208 -17756 L 1145 -17737 1010 -17694 837 -17633 814 -17624 597 -17535 396 -17448 Q 343 -17425 288 -17404 L 189 -17370 89 -17342 14 -17328 Q -45 -17318 -102 -17294 -142 -17276 -185 -17265 L -209 -17257 -211 -17256 -248 -17243 Q -261 -17237 -277 -17229 L -281 -17227 Q -257 -17192 -242 -17148 L -225 -17093 -223 -17094 Q -213 -17099 -204 -17103 L -169 -17116 -168 -17116 -143 -17126 -36 -17168 89 -17213 157 -17236 288 -17281 362 -17308 Q 485 -17354 611 -17391 L 775 -17445 837 -17466 Q 923 -17495 1010 -17517 L 1019 -17519 1208 -17566 1280 -17583 1526 -17643 1611 -17666 1785 -17721 1930 -17770 2014 -17798 2027 -17802 2286 -17890 2391 -17931 Q 2464 -17964 2532 -18006 L 2563 -18027 Q 2653 -18100 2638 -18223 2629 -18302 2563 -18343 L 2521 -18364 Q 2460 -18387 2391 -18402 L 2300 -18419 2391 -18515 2401 -18525 Q 2478 -18605 2563 -18667 L 2603 -18695 Q 2710 -18768 2824 -18837 2938 -18907 3049 -18988 L 3257 -19149 3337 -19216 3441 -19305 3622 -19460 3657 -19490 Q 3736 -19558 3820 -19642 3922 -19746 3954 -19914 3986 -20082 3833 -20183 3802 -20202 3680 -20156 L 3658 -20147 Q 3548 -20104 3444 -20040 L 3337 -19976 3214 -19905 2990 -19770 Q 2876 -19696 2752 -19635 L 2563 -19538 2534 -19523 2391 -19447 2299 -19399 2097 -19291 2014 -19246 1927 -19196 1875 -19167 Q 1770 -19106 1662 -19047 L 1611 -19018 1457 -18928 Q 1357 -18868 1236 -18806 L 1208 -18792 Q 1102 -18738 1010 -18683 L 1009 -18682 Q 925 -18632 837 -18584 L 794 -18561 Q 684 -18503 575 -18438 L 358 -18309 288 -18268 148 -18182 89 -18145 -60 -18055 -217 -17957 Q -246 -17928 -253 -17934 L -280 -17916 Q -251 -17945 -217 -17957 M -906 -18042 Q -774 -17981 -716 -17873 -688 -17821 -677 -17757 M -2021 -19481 L -2040 -19409 Q -2047 -19360 -2041 -19309 L -2040 -19307 -2019 -19273 Q -1936 -19151 -1786 -19214 -1709 -19330 -1731 -19495 L -1898 -19999 Q -1914 -19737 -2015 -19497 L -2021 -19481 M -2331 -19452 Q -2340 -19481 -2332 -19513 -2321 -19557 -2281 -19607 -2239 -19686 -2171 -19855 -2190 -19670 -2185 -19481 -2220 -19315 -2322 -19430 L -2331 -19452 M -2432 -19586 Q -2403 -19770 -2358 -19999 -2632 -19774 -2517 -19576 -2485 -19546 -2432 -19586 M -2904 -19769 L -2934 -19726 -3018 -19600 Q -3108 -19457 -3183 -19304 L -3224 -19198 -3234 -19165 -3224 -19171 Q -3115 -19242 -3018 -19348 -2975 -19395 -2934 -19449 -2883 -19517 -2836 -19595 -2865 -19698 -2904 -19769 M -3075 -18849 L -3018 -18898 -2934 -18974 Q -2861 -19043 -2791 -19115 L -2730 -19180 -2792 -19275 -2803 -19294 -2808 -19286 -2934 -19094 -3018 -18952 -3041 -18911 -3075 -18849 M -2545 -18705 Q -2428 -18625 -2327 -18528 -2249 -18453 -2180 -18367 L -2132 -18299 -2327 -18316 -2659 -18328 Q -2727 -18328 -2746 -18303 -2769 -18349 -2767 -18403 -2713 -18650 -2545 -18705 M -3076 -18188 L -3018 -18194 -2934 -18182 Q -2894 -18170 -2852 -18148 L -2846 -18145 -2845 -18145 -2788 -18159 Q -2642 -18180 -2680 -17993 -2648 -17947 -2638 -17828 -2518 -17853 -2401 -17828 -2378 -17877 -2373 -18015 L -2358 -18102 -2327 -18015 Q -2289 -17906 -2261 -17799 -2160 -17945 -2142 -18094 -2081 -17909 -2061 -17708 L -2040 -17694 -2014 -17674 -2000 -17662 Q -1938 -17609 -1888 -17532 -1803 -17402 -1785 -17288 -1768 -17174 -1782 -17197 -1889 -17133 -2014 -17128 L -2036 -17128 -2040 -17128 -2091 -17130 -2104 -16987 Q -2113 -16872 -2134 -16780 L -2222 -16944 Q -2276 -17051 -2314 -17171 L -2323 -17200 -2327 -17202 -2389 -17241 Q -2448 -17282 -2505 -17337 -2611 -17441 -2664 -17569 -2704 -17667 -2718 -17775 L -2788 -17707 -2793 -17702 -2788 -17693 Q -2744 -17606 -2788 -17516 -2807 -17477 -2843 -17437 -2844 -17395 -2833 -17297 L -2788 -17263 Q -2625 -17124 -2612 -16866 -2608 -16780 -2581 -16710 -2566 -16670 -2544 -16636 -2512 -16641 -2519 -16616 L -2518 -16616 Q -2423 -16666 -2327 -16685 L -2234 -16697 Q -2138 -16701 -2040 -16696 L -2014 -16695 -1969 -16692 Q -1829 -16682 -1789 -16844 -1723 -16998 -1854 -17029 -1882 -17036 -1882 -17067 L -1660 -17067 Q -1680 -17011 -1715 -16972 -1734 -16919 -1739 -16844 -1710 -16728 -1637 -16677 -1621 -16666 -1602 -16658 -1566 -16643 -1523 -16640 L -1496 -16638 Q -1374 -16633 -1250 -16642 -1169 -16648 -1104 -16618 L -1062 -16713 Q -1011 -16845 -986 -17019 -975 -17094 -925 -17144 L -833 -17239 Q -787 -17490 -940 -17651 L -1062 -17447 -1089 -17403 Q -1158 -17288 -1261 -17202 L -1273 -17192 Q -1290 -17082 -1339 -16993 -1396 -16889 -1480 -16816 L -1479 -16873 Q -1475 -17028 -1492 -17131 L -1496 -17131 -1508 -17133 Q -1582 -17143 -1637 -17179 -1684 -17211 -1717 -17261 -1712 -17325 -1663 -17456 L -1637 -17514 Q -1591 -17599 -1517 -17634 -1516 -17642 -1496 -17656 -1472 -17675 -1421 -17704 L -1352 -17742 M -3004 -18030 Q -2980 -18074 -2934 -18104 -2900 -18127 -2855 -18142 L -2851 -18143 -2846 -18145 M -2904 -17872 L -2845 -17945 -2788 -17997 Q -2718 -18048 -2680 -17993 M -1674 -18749 L -1741 -18632 Q -1788 -18530 -1846 -18433 L -1883 -18512 Q -1945 -18649 -1997 -18742 -1882 -18735 -1739 -18742 L -1674 -18749 M -2014 -17550 L -2040 -17582 -2069 -17609 Q -2113 -17647 -2171 -17669 -2246 -17698 -2327 -17714 L -2420 -17727 -2608 -17736 Q -2556 -17592 -2458 -17490 -2397 -17426 -2327 -17371 L -2311 -17358 -2251 -17316 Q -2155 -17253 -2040 -17245 L -2014 -17245 -1997 -17245 -1890 -17247 Q -1915 -17361 -1980 -17493 L -2014 -17550 M -2401 -17828 L -2327 -17811 -2262 -17794 Q -2165 -17765 -2093 -17727 L -2061 -17708 M -2327 -17630 Q -2461 -17657 -2372 -17514 -2356 -17489 -2327 -17465 -2300 -17443 -2262 -17420 -2231 -17403 -2192 -17385 -2055 -17322 -2069 -17415 -2083 -17501 -2140 -17548 L -2151 -17556 Q -2219 -17604 -2292 -17621 L -2327 -17630 M -2091 -17130 Q -2197 -17139 -2286 -17181 L -2323 -17200 M -3241 -17110 L -3222 -17118 Q -3116 -17164 -3018 -17163 L -2934 -17154 Q -2888 -17144 -2845 -17122 L -2801 -17098 -2788 -17059 -2626 -16584 -2608 -16540 Q -2571 -16467 -2501 -16420 -2421 -16381 -2327 -16357 -2204 -16326 -2057 -16320 L -2040 -16319 -2014 -16318 -1637 -16310 -1510 -16310 -1496 -16310 Q -1223 -16314 -1062 -16517 L -1049 -16534 Q -931 -16711 -867 -16989 -846 -17083 -777 -17124 L -716 -17141 -604 -17150 -519 -17138 Q -467 -17125 -416 -17099 -390 -17190 -445 -17240 -484 -17259 -520 -17271 -564 -17286 -604 -17291 -663 -17299 -716 -17289 -778 -17277 -833 -17239 M -3191 -17225 Q -3139 -17279 -3018 -17294 L -2934 -17299 -2845 -17297 -2833 -17297 M -2991 -16883 L -3018 -16879 Q -3058 -16866 -3070 -16804 -3109 -16593 -3029 -16413 L -3019 -16392 -3018 -16393 Q -2970 -16406 -2934 -16428 L -2908 -16446 Q -2866 -16480 -2845 -16529 -2812 -16605 -2827 -16717 -2832 -16756 -2845 -16786 -2872 -16852 -2934 -16873 L -2991 -16883 M -2243 -16481 L -2327 -16511 Q -2436 -16554 -2518 -16616 L -2519 -16616 -2544 -16636 M -3019 -14681 L -3018 -14680 -2934 -14630 -2845 -14574 -2802 -14546 -2819 -14584 -2833 -14616 -2845 -14646 Q -2887 -14755 -2910 -14854 L -2934 -14914 Q -2960 -14994 -2967 -15099 -2974 -15218 -2934 -15328 L -2922 -15359 -2903 -15415 Q -2921 -15535 -2883 -15667 -2868 -15719 -2845 -15761 -2821 -15806 -2788 -15840 L -2759 -15868 Q -2766 -15922 -2788 -15997 L -2824 -16105 -2845 -16167 Q -2872 -16257 -2881 -16349 L -2845 -16317 -2788 -16251 Q -2758 -16211 -2734 -16164 -2683 -16064 -2639 -16003 -2541 -16078 -2614 -16238 -2674 -16369 -2662 -16484 -2610 -16460 -2601 -16414 -2535 -16318 -2484 -16187 L -2450 -16105 -2390 -16102 -2327 -16123 Q -2261 -16135 -2166 -16119 -2100 -16107 -2040 -16082 L -2014 -16070 Q -1968 -16048 -1926 -16017 -1832 -15951 -1767 -15875 L -1637 -15972 -1550 -16037 -1496 -16072 Q -1405 -16122 -1300 -16127 L -1155 -16112 -1113 -16105 -1062 -16214 -1005 -16341 Q -968 -16424 -912 -16478 -897 -16416 -915 -16350 L -929 -16298 -946 -16249 Q -977 -16141 -961 -16036 L -932 -16006 Q -832 -16101 -772 -16225 L -716 -16320 -711 -16327 -709 -16322 Q -701 -16297 -703 -16270 L -716 -16227 Q -746 -16131 -787 -16025 -815 -15952 -848 -15889 -771 -15791 -728 -15649 L -716 -15602 Q -693 -15495 -705 -15386 -634 -15277 -620 -15127 -606 -14986 -689 -14854 -669 -14745 -716 -14635 L -747 -14567 Q -757 -14535 -778 -14508 -747 -14526 -716 -14553 -660 -14601 -604 -14681 L -601 -14696 -583 -14811 Q -551 -15080 -548 -15357 -546 -15527 -518 -15693 -501 -15795 -475 -15895 -393 -16208 -518 -16348 -563 -16368 -596 -16392 L -597 -16392 -601 -16395 Q -780 -16528 -620 -16765 L -602 -16790 Q -545 -16872 -519 -16879 -481 -16889 -511 -16741 L -518 -16705 Q -566 -16473 -596 -16393 L -596 -16392 M -3019 -16392 L -3105 -16377 M -2934 -15910 Q -3012 -15913 -2934 -15827 L -2921 -15814 Q -2836 -15864 -2881 -15903 L -2934 -15910 M -2014 -16596 L -2040 -16595 -2184 -16580 Q -2340 -16553 -2243 -16481 L -2141 -16454 -2040 -16434 -2014 -16430 Q -1835 -16406 -1637 -16423 L -1624 -16424 -1496 -16440 Q -1388 -16459 -1294 -16492 -1324 -16543 -1379 -16551 L -1496 -16566 -1637 -16577 -1652 -16578 -1917 -16594 -2014 -16596 M -2390 -16102 L -2327 -16094 Q -2255 -16083 -2185 -16060 -2102 -16034 -2040 -15978 L -2014 -15953 -1978 -15909 Q -1901 -15800 -1843 -15679 L -1796 -15580 -1731 -15580 -1637 -15757 -1618 -15789 Q -1567 -15874 -1496 -15940 L -1445 -15984 Q -1338 -16069 -1209 -16105 L -1155 -16112 M -1914 -15513 L -2002 -15700 -2014 -15725 -2040 -15773 Q -2089 -15854 -2161 -15920 -2237 -15989 -2327 -15989 L -2408 -15977 Q -2539 -15937 -2642 -15838 -2732 -15751 -2788 -15645 -2721 -15710 -2587 -15766 -2532 -15789 -2474 -15800 L -2327 -15807 -2321 -15807 Q -2240 -15800 -2173 -15771 -2126 -15752 -2086 -15722 L -2040 -15683 -2014 -15656 Q -1959 -15596 -1914 -15513 L -1911 -15508 -1911 -15507 Q -1929 -15418 -2014 -15385 L -2040 -15377 -2059 -15373 Q -2186 -15351 -2309 -15369 L -2327 -15372 -2574 -15420 Q -2707 -15451 -2788 -15541 L -2800 -15555 Q -2844 -15611 -2788 -15645 -2678 -15575 -2551 -15529 -2442 -15490 -2327 -15480 L -2292 -15478 -2040 -15488 -2026 -15490 -2014 -15492 -1913 -15507 -1912 -15507 -1911 -15508 M -168 -17116 L -169 -17116 M -277 -17229 L -282 -17227 -281 -17227 M -225 -17093 L -208 -17003 -191 -17007 Q -127 -17023 -107 -17033 L -64 -17047 -7 -17058 51 -17068 89 -17077 129 -17082 Q 205 -17088 279 -17110 L 288 -17112 Q 524 -17180 761 -17238 L 837 -17256 1010 -17296 1208 -17340 1499 -17397 1611 -17418 1930 -17482 2014 -17500 2082 -17515 2391 -17578 2478 -17592 2563 -17606 2748 -17644 Q 2857 -17671 2980 -17681 L 3220 -17700 3337 -17710 3372 -17714 3501 -17733 Q 3563 -17744 3620 -17713 3634 -17650 3657 -17590 3681 -17529 3715 -17472 3779 -17364 3693 -17320 L 3657 -17302 Q 3554 -17251 3441 -17213 L 3337 -17178 3178 -17129 2927 -17066 2688 -17022 2563 -17001 2422 -16974 2391 -16967 2188 -16914 2014 -16862 1964 -16847 1930 -16837 1761 -16787 Q 1712 -16712 1798 -16701 L 1930 -16691 2014 -16693 2149 -16709 2391 -16750 2563 -16778 2608 -16785 Q 2905 -16832 3216 -16839 3299 -16680 3266 -16474 3254 -16398 3159 -16366 2867 -16268 2563 -16206 L 2542 -16202 2391 -16182 2378 -16181 Q 2200 -16172 2099 -16062 2182 -16030 2277 -16012 L 2391 -15995 2544 -15984 2563 -15982 Q 2588 -15976 2603 -15958 2653 -15893 2681 -15785 2703 -15703 2648 -15649 2609 -15610 2563 -15581 2496 -15541 2415 -15523 L 2391 -15518 2149 -15473 2014 -15457 1930 -15453 1890 -15452 Q 1784 -15452 1714 -15382 1633 -15300 1701 -15162 1762 -15039 1734 -14908 1711 -14798 1611 -14791 L 1543 -14796 Q 1412 -14821 1294 -14889 L 1208 -14940 1062 -15036 Q 1033 -15056 1010 -15062 927 -15086 924 -14933 921 -14802 837 -14712 L 824 -14699 Q 715 -14596 584 -14675 470 -14743 382 -14849 361 -14874 333 -14855 L 288 -14822 Q 225 -14774 167 -14716 129 -14678 89 -14662 18 -14636 -60 -14682 L -256 -14798 -288 -14668 -307 -14553 Q -325 -14416 -330 -14276 -321 -14253 -316 -14206 -295 -14022 -336 -13841 L -382 -13620 -407 -13496 -418 -13453 -424 -13410 Q -323 -13345 -309 -13188 -298 -13055 -305 -12921 L -315 -12648 Q -316 -12558 -327 -12463 L -288 -12343 Q -255 -12234 -241 -12104 -227 -11975 -220 -11847 -213 -11720 -215 -11591 -219 -11463 -271 -11288 L -288 -11236 -306 -11185 -288 -11175 Q -258 -11156 -239 -11109 -178 -10966 -275 -10880 L -266 -10853 Q -228 -10724 -280 -10599 L -288 -10581 Q -326 -10500 -392 -10448 -331 -10404 -298 -10340 L -288 -10317 Q -270 -10272 -265 -10219 -256 -10124 -288 -10040 -303 -10000 -327 -9962 L -330 -9958 Q -351 -9927 -329 -9883 L -321 -9868 Q -300 -9833 -288 -9795 -262 -9714 -278 -9625 L -288 -9579 Q -300 -9529 -319 -9481 -340 -9428 -369 -9377 -427 -9274 -401 -9204 -316 -9219 -288 -9131 -276 -9092 -275 -9034 -273 -8961 -288 -8898 -302 -8835 -333 -8782 -354 -8743 -343 -8666 -333 -8597 -381 -8560 -309 -8503 -313 -8394 -317 -8304 -397 -8314 L -400 -8314 -407 -8315 -401 -8309 Q -310 -8230 -288 -8107 L -283 -8072 Q -271 -7945 -288 -7818 L -289 -7811 Q -307 -7687 -395 -7640 -335 -7552 -288 -7446 L -281 -7430 Q -276 -7327 -284 -7209 L -288 -7137 -293 -6986 Q -296 -6852 -314 -6720 L -354 -6460 -394 -6231 Q -418 -6096 -461 -5965 L -518 -5784 -531 -5743 -555 -5667 -518 -5669 Q -400 -5666 -383 -5521 -370 -5412 -460 -5354 -344 -5240 -385 -5077 -410 -4978 -495 -4939 -457 -4838 -518 -4756 L -537 -4734 Q -595 -4673 -573 -4644 -540 -4600 -518 -4550 -485 -4477 -477 -4391 -468 -4297 -512 -4238 -449 -4199 -452 -3946 L -442 -3780 Q -370 -3746 -316 -3702 L -321 -3602 M -321 -3588 L -321 -3472 Q -318 -3335 -323 -3199 L -330 -3048 -373 -2825 -391 -2701 Q -335 -2729 -288 -2709 -237 -2688 -197 -2611 -123 -2470 -224 -2367 -256 -2334 -288 -2317 -306 -2308 -323 -2303 L -288 -2245 -281 -2230 -172 -2243 Q -165 -2229 -134 -2206 -164 -2114 -288 -2055 L -310 -2046 -311 -2040 Q -339 -1952 -365 -1890 -339 -1880 -336 -1847 -330 -1800 -357 -1772 -275 -1655 -372 -1561 -352 -1511 -361 -1467 -307 -1454 -288 -1417 -267 -1377 -288 -1307 L -303 -1267 -309 -1251 Q -295 -1200 -288 -1146 -278 -1068 -284 -984 L -288 -945 Q -293 -911 -301 -885 L -288 -864 Q -237 -775 -237 -633 -237 -506 -288 -442 L -293 -436 -291 -435 -288 -433 Q -250 -415 -251 -360 L -288 -300 -381 -157 -395 -137 Q -380 -120 -363 -29 -350 38 -381 78 -315 155 -288 256 -279 288 -275 323 -259 453 -286 581 L -288 590 Q -315 705 -378 799 -269 907 -321 1057 L -352 1149 Q -285 1278 -311 1417 -330 1519 -294 1652 L -288 1666 Q -261 1726 -244 1789 -227 1852 -219 1918 -203 2049 -205 2184 -208 2317 -203 2450 -200 2521 -203 2592 L -138 2480 -159 2206 Q -168 2072 -141 1938 L -97 1725 Q -74 1613 -31 1507 L 72 1257 89 1218 161 1049 Q 206 943 237 833 269 716 280 596 L 288 503 295 416 Q 318 721 362 1027 392 1234 386 1444 384 1547 354 1646 L 289 1844 288 1847 Q 258 1934 216 2018 197 2057 166 2090 L 124 2134 Q 103 2155 89 2176 70 2203 63 2229 L 89 2212 114 2197 Q 198 2150 288 2121 L 332 2107 Q 459 2071 590 2069 719 2066 837 2115 924 2151 1010 2180 L 1093 2204 1186 2212 1079 2320 M 1077 2322 L 1061 2339 1010 2389 Q 953 2438 884 2473 L 837 2497 703 2552 Q 637 2577 568 2578 L 418 2569 288 2551 259 2547 Q 186 2537 144 2506 131 2518 116 2510 L 101 2657 89 2738 Q 71 2856 46 2971 2 3179 -171 3271 -205 3289 -269 3305 -236 3353 -210 3412 -159 3533 -222 3661 L -288 3781 -297 3796 -288 3814 Q -241 3918 -265 4053 -273 4102 -288 4149 -307 4207 -337 4260 -306 4289 -288 4322 -246 4398 -270 4499 -268 4555 -257 4594 -219 4727 -240 4865 -257 4977 -288 5088 L -300 5129 Q -326 5216 -342 5305 L -354 5382 Q -371 5518 -373 5655 -376 5779 -344 5898 L -338 5919 -326 5963 Q -306 6213 -335 6449 L -360 6703 M -209 -17257 Q -190 -17276 -185 -17265 M -416 -17099 L -399 -17066 Q -308 -16877 -399 -16634 L -407 -16614 -518 -16348 M -445 -17240 Q -427 -17275 -416 -17327 M -1076 -17678 Q -1074 -17736 -1099 -17779 -1208 -17745 -1305 -17671 -1415 -17589 -1496 -17479 -1589 -17353 -1602 -17268 -1550 -17245 -1496 -17242 -1426 -17238 -1354 -17268 -1221 -17324 -1152 -17431 -1078 -17545 -1076 -17678 M -985 -17785 Q -997 -17754 -993 -17699 L -940 -17651 M -1329 -17584 Q -1441 -17506 -1466 -17369 -1481 -17344 -1422 -17334 -1289 -17369 -1222 -17480 -1142 -17611 -1250 -17628 L -1329 -17584 M -1492 -17131 Q -1370 -17120 -1273 -17192 M -1104 -16618 L -1136 -16564 Q -1210 -16522 -1294 -16492 M -1062 -15940 Q -961 -15868 -882 -15769 -837 -15713 -804 -15659 -763 -15651 -768 -15619 -788 -15486 -936 -15442 L -1062 -15409 -1188 -15385 -1452 -15395 -1496 -15407 Q -1598 -15445 -1624 -15551 -1581 -15646 -1511 -15772 L -1496 -15797 Q -1433 -15898 -1331 -15959 -1203 -16037 -1079 -15952 L -1062 -15940 M -208 -17003 Q -201 -16900 -173 -16816 L -167 -16818 -151 -16824 65 -16901 89 -16909 288 -16976 313 -16985 Q 434 -17027 559 -17054 L 820 -17112 837 -17116 1010 -17155 1071 -17170 1208 -17198 1307 -17212 Q 1444 -17228 1579 -17256 L 1611 -17262 1833 -17300 1930 -17313 2014 -17324 2083 -17332 2343 -17365 2391 -17371 2563 -17396 2609 -17404 2880 -17457 Q 3008 -17485 3141 -17478 3263 -17471 3150 -17376 3085 -17320 2999 -17298 L 2761 -17236 2563 -17182 2508 -17167 2391 -17133 2277 -17099 2014 -17019 2012 -17019 1930 -16995 1753 -16949 Q 1680 -16931 1611 -16905 1550 -16884 1493 -16856 1371 -16829 1354 -16692 1340 -16583 1465 -16558 L 1611 -16538 Q 1674 -16534 1739 -16536 L 1930 -16550 1992 -16558 2014 -16561 2250 -16600 2391 -16626 2523 -16648 2563 -16653 2781 -16660 Q 2985 -16649 2815 -16543 2735 -16494 2640 -16474 L 2563 -16458 2394 -16418 2391 -16417 Q 2268 -16386 2149 -16343 L 2014 -16290 1930 -16253 1899 -16239 Q 1761 -16174 1759 -16040 1759 -16003 1791 -15976 1854 -15922 1930 -15901 L 2014 -15887 2027 -15887 Q 2159 -15883 2263 -15800 2352 -15728 2227 -15669 2124 -15620 2014 -15602 L 1970 -15596 1930 -15592 1696 -15578 Q 1647 -15576 1611 -15561 1531 -15526 1522 -15421 L 1510 -15317 M 1507 -15297 L 1477 -15157 Q 1430 -14977 1302 -15048 1249 -15077 1220 -15130 L 1208 -15150 Q 1144 -15256 1045 -15325 L 1010 -15346 970 -15365 Q 889 -15359 837 -15289 812 -15256 794 -15207 747 -15079 678 -14970 649 -14926 613 -14953 502 -15034 440 -15153 L 403 -15221 Q 358 -15167 288 -15108 L 223 -15056 Q 161 -15008 89 -14981 30 -14959 -36 -14952 -147 -14940 -227 -14990 L -232 -14993 -287 -15027 -288 -15021 Q -300 -14954 -292 -14869 -289 -14839 -301 -14826 L -288 -14818 -256 -14798 M -173 -16816 L -166 -16808 Q -141 -16783 -83 -16756 -22 -16740 61 -16765 L 89 -16773 288 -16836 305 -16842 Q 436 -16886 546 -16840 456 -16732 345 -16668 L 288 -16628 Q 227 -16571 288 -16522 L 324 -16500 Q 387 -16468 460 -16465 L 710 -16474 Q 795 -16485 837 -16455 865 -16435 873 -16397 L 837 -16386 Q 713 -16349 610 -16301 471 -16236 624 -16135 708 -16080 798 -16039 L 837 -16018 870 -15986 Q 931 -15907 837 -15886 L 798 -15881 606 -15914 Q 458 -15943 414 -15956 L 326 -15984 288 -15993 171 -16009 Q 129 -16014 89 -16008 21 -16000 -45 -15964 -139 -15914 -220 -15753 -246 -15684 -262 -15603 -287 -15485 -287 -15365 L -287 -15027 M -716 -15884 L -747 -15853 -716 -15811 Q -661 -15760 -624 -15900 -680 -15909 -716 -15884 M -2638 -17828 Q -2677 -17809 -2718 -17775 M -3568 -19636 Q -3700 -19796 -3647 -20145 M -601 -15661 L -668 -15666 Q -653 -15626 -650 -15580 L -601 -15618 Q -569 -15650 -601 -15661 M -933 -15034 L -824 -15025 Q -750 -15003 -716 -14939 -706 -14920 -699 -14897 L -689 -14854 M -705 -15386 Q -709 -15364 -716 -15344 -753 -15238 -868 -15182 -962 -15137 -1062 -15134 L -1128 -15138 -1388 -15178 Q -1445 -15188 -1496 -15205 L -1583 -15241 Q -1613 -15247 -1624 -15264 L -1557 -15039 -1552 -15039 -1496 -15041 -1322 -15049 Q -1192 -15056 -1062 -15051 L -1049 -15051 -933 -15034 Q -1002 -15024 -1062 -14970 L -1067 -14966 -1257 -14776 Q -1373 -14649 -1466 -14682 L -1496 -14721 -1543 -14776 Q -1592 -14831 -1637 -14845 -1696 -14864 -1746 -14811 -1820 -14875 -1864 -14840 L -2014 -14723 -2023 -14716 -2040 -14701 Q -2136 -14628 -2242 -14739 L -2327 -14821 -2432 -14910 Q -2540 -14997 -2668 -15023 L -2669 -15023 -2701 -15028 Q -2749 -15032 -2788 -15015 -2819 -15003 -2845 -14977 -2869 -14954 -2888 -14920 -2908 -14883 -2910 -14854 M -986 -15740 Q -955 -15657 -1010 -15597 -1035 -15569 -1062 -15553 -1144 -15503 -1238 -15559 -1374 -15641 -1307 -15765 -1375 -15748 -1437 -15709 L -1496 -15668 Q -1569 -15615 -1624 -15551 -1567 -15514 -1496 -15492 L -1379 -15468 Q -1243 -15452 -1110 -15474 L -1062 -15484 Q -962 -15508 -895 -15553 -814 -15609 -804 -15659 -865 -15681 -931 -15715 L -986 -15740 -1062 -15764 -1193 -15779 -1307 -15765 M -1557 -15039 L -1557 -15037 -1551 -15018 Q -1520 -14911 -1496 -14805 L -1485 -14754 -1466 -14682 M -819 -14775 Q -822 -14829 -839 -14848 L -905 -14794 Q -893 -14751 -900 -14672 -856 -14721 -819 -14775 M -2068 -14273 Q -2163 -14345 -2272 -14394 L -2280 -14398 -2300 -14407 -2327 -14419 Q -2408 -14455 -2485 -14497 L -2544 -14530 Q -2604 -14565 -2651 -14612 -2693 -14654 -2725 -14706 -2765 -14771 -2773 -14847 -2744 -14865 -2691 -14839 -2659 -14825 -2619 -14795 L -2507 -14718 -2389 -14652 -2327 -14617 -2307 -14604 Q -2235 -14557 -2175 -14497 -2132 -14454 -2098 -14402 L -2068 -14273 -2049 -14196 -2040 -14160 -2037 -14149 -2014 -14067 -1972 -13933 -1961 -13899 -1871 -13648 Q -1841 -13566 -1825 -13496 L -1674 -13503 Q -1658 -13543 -1637 -13606 L -1612 -13684 -1533 -13933 -1528 -13949 -1496 -14066 -1471 -14192 -1468 -14206 -1457 -14275 -1431 -14402 -1437 -14402 -1430 -14407 -1314 -14497 -1223 -14567 -1160 -14615 -1062 -14686 -1023 -14712 -997 -14730 -905 -14794 M -1468 -14206 Q -1344 -14241 -1227 -14313 L -1062 -14411 -997 -14449 Q -908 -14500 -848 -14538 -829 -14563 -807 -14608 -745 -14734 -771 -14869 -793 -14981 -892 -14940 -982 -14903 -1062 -14841 L -1117 -14794 Q -1212 -14705 -1320 -14636 -1424 -14570 -1496 -14555 L -1531 -14551 Q -1585 -14576 -1637 -14610 -1693 -14648 -1746 -14696 L -1794 -14672 Q -1900 -14605 -2014 -14558 L -2026 -14553 -2040 -14554 Q -2174 -14564 -2277 -14647 L -2327 -14688 Q -2408 -14754 -2491 -14816 -2601 -14901 -2723 -14940 -2761 -14952 -2788 -14933 -2805 -14921 -2817 -14897 -2844 -14775 -2788 -14667 L -2772 -14639 Q -2738 -14584 -2723 -14538 -2600 -14443 -2443 -14380 L -2327 -14329 -2242 -14286 Q -2145 -14233 -2049 -14196 M -900 -14672 Q -946 -14623 -999 -14579 L -1025 -14558 -1062 -14528 -1172 -14442 -1211 -14412 Q -1260 -14375 -1312 -14344 -1381 -14304 -1457 -14275 M -1023 -14712 Q -1011 -14657 -1021 -14582 L -1025 -14558 M -1160 -14615 L -1172 -14442 M -1430 -14407 L -1431 -14402 M -2069 -14021 Q -2074 -14054 -2089 -14086 -2152 -14216 -2278 -14229 -2218 -14105 -2173 -13971 L -2160 -13933 -2141 -13877 -2081 -13710 -2040 -13601 -2033 -13583 -2014 -13535 -1983 -13460 -1934 -13333 -1894 -13210 Q -1881 -13166 -1875 -13123 -1798 -13041 -1667 -13078 -1644 -13101 -1637 -13130 -1631 -13156 -1637 -13187 L -1594 -13336 -1573 -13417 -1525 -13583 -1496 -13669 -1495 -13672 Q -1455 -13781 -1408 -13885 L -1390 -13925 -1386 -13933 Q -1332 -14053 -1289 -14165 -1282 -14183 -1278 -14203 L -1276 -14218 -1300 -14207 Q -1431 -14146 -1451 -13992 M -1276 -14218 L -1062 -14322 -1051 -14327 Q -933 -14387 -825 -14464 -797 -14484 -778 -14508 M -1314 -14497 Q -1306 -14423 -1312 -14344 M -604 -14681 L -601 -14688 Q -562 -14777 -518 -14770 -504 -14768 -490 -14757 -470 -14591 -483 -14459 L -509 -14193 -518 -14116 Q -527 -14046 -539 -13985 L -518 -14029 Q -468 -14131 -399 -14247 L -389 -14264 Q -350 -14330 -330 -14276 M -690 -14157 Q -691 -14169 -675 -14168 M -711 -14085 L -689 -14090 M -704 -14028 L -716 -13989 -727 -13933 -729 -13921 Q -751 -13763 -819 -13697 -779 -13611 -716 -13552 -684 -13523 -647 -13501 L -601 -13479 -547 -13465 -525 -13463 -518 -13462 Q -458 -13454 -424 -13410 M -2903 -15415 Q -2880 -15355 -2845 -15303 L -2788 -15235 -2736 -15189 Q -2627 -15103 -2485 -15131 L -2327 -15161 -2227 -15179 -2040 -15214 -2014 -15220 -1968 -15231 -1887 -15250 -1886 -15250 -1820 -15416 Q -1805 -15452 -1782 -15465 -1675 -15429 -1637 -15315 L -1624 -15264 -1583 -15241 M -2474 -15800 Q -2567 -15698 -2432 -15591 -2378 -15548 -2327 -15546 -2262 -15543 -2202 -15605 -2137 -15672 -2173 -15771 M -2023 -14716 L -2040 -14703 -2037 -14717 -2014 -14819 -1992 -14914 -1957 -15043 -2014 -15050 -2040 -15053 -2206 -15058 -2327 -15051 -2464 -15039 -2669 -15027 -2701 -15028 M -1957 -15043 L -1918 -15165 -1887 -15249 -1886 -15250 M -1782 -15465 Q -1752 -15337 -1749 -15206 L -1746 -14933 -1746 -14811 M -3018 -15724 Q -3070 -15719 -3018 -15653 L -3003 -15636 Q -2970 -15599 -2941 -15644 L -2934 -15657 Q -2928 -15674 -2934 -15692 L -2946 -15717 -3018 -15724 M -2691 -14839 Q -2693 -14700 -2651 -14612 M -2802 -14546 L -2788 -14516 -2781 -14502 Q -2685 -14417 -2557 -14361 L -2327 -14258 -2313 -14252 Q -2291 -14242 -2278 -14229 M -2507 -14718 Q -2514 -14593 -2485 -14497 M -2934 -14234 L -2924 -14236 M -2924 -14171 L -2910 -14171 M -3275 -14190 Q -3281 -14098 -3269 -14007 L -3257 -13933 -3243 -13876 -3222 -13785 Q -3203 -13685 -3204 -13582 L -3205 -13483 Q -3213 -13479 -3212 -13466 L -3204 -13442 Q -3138 -13520 -3018 -13521 -2973 -13522 -2934 -13546 -2897 -13569 -2866 -13614 L -2845 -13641 Q -2819 -13672 -2788 -13691 L -2780 -13696 -2788 -13715 -2798 -13742 -2845 -13870 -2848 -13880 -2867 -13933 -2869 -13939 Q -2892 -14007 -2903 -14077 L -2910 -14121 M -1637 -14372 L -1610 -14373 Q -1618 -14422 -1637 -14454 -1657 -14487 -1688 -14502 -1721 -14380 -1637 -14372 M -2307 -14604 L -2275 -14410 -2272 -14394 M -1917 -14353 Q -1942 -14492 -1839 -14530 -1839 -14379 -1917 -14353 M -2334 -13243 L -2327 -13255 -2273 -13350 -2213 -13457 Q -2158 -13555 -2040 -13581 L -2033 -13583 M -2141 -13877 Q -2249 -13865 -2327 -13812 L -2371 -13776 Q -2425 -13725 -2469 -13657 L -2519 -13570 -2572 -13464 -2631 -13358 Q -2536 -13338 -2439 -13295 -2383 -13270 -2334 -13243 L -2327 -13239 Q -2281 -13214 -2242 -13187 L -2242 -13014 Q -2142 -12994 -2183 -12842 -2233 -12739 -2255 -12633 L -2285 -12658 Q -2300 -12599 -2327 -12539 L -2341 -12510 -2327 -12518 Q -2192 -12592 -2062 -12627 L -2040 -12632 -2014 -12638 Q -1903 -12658 -1789 -12641 L -1637 -12543 -1565 -12498 -1496 -12450 Q -1418 -12392 -1358 -12324 -1359 -12369 -1341 -12375 -1318 -12505 -1239 -12621 -1256 -12660 -1276 -12692 L -1343 -12849 Q -1367 -12893 -1379 -12978 -1335 -13000 -1283 -13022 L -1335 -13136 -1191 -13227 Q -1212 -13293 -1249 -13359 L -1304 -13442 Q -1377 -13540 -1496 -13575 L -1525 -13583 M -2630 -13122 Q -2539 -13114 -2386 -13069 L -2327 -13050 Q -2276 -13032 -2242 -13014 M -2183 -12842 L -2327 -12905 -2424 -12949 Q -2528 -12996 -2637 -13014 M -2780 -13696 L -2775 -13698 Q -2721 -13729 -2651 -13729 -2539 -13730 -2469 -13657 M -3111 -5359 Q -3118 -5443 -3131 -5520 L -3174 -5771 -3222 -6017 -3228 -6045 Q -3255 -6173 -3269 -6304 -3283 -6436 -3304 -6569 -3321 -6687 -3312 -6807 L -3296 -7036 Q -3288 -7150 -3269 -7266 -3269 -7296 -3262 -7324 -3252 -7362 -3222 -7417 L -3206 -7445 -3222 -7495 Q -3231 -7539 -3222 -7584 -3215 -7623 -3194 -7662 L -3214 -7703 -3222 -7725 Q -3260 -7840 -3229 -7964 L -3222 -7991 Q -3192 -8103 -3147 -8179 -3191 -8211 -3215 -8280 L -3222 -8300 Q -3260 -8419 -3236 -8543 -3226 -8596 -3222 -8640 -3217 -8692 -3222 -8731 -3226 -8762 -3235 -8785 -3277 -8889 -3222 -8980 L -3183 -9032 Q -3079 -9146 -3147 -9242 -3189 -9293 -3222 -9356 L -3258 -9438 Q -3307 -9567 -3270 -9698 -3249 -9772 -3222 -9836 L -3183 -9918 -3222 -9979 -3261 -10054 Q -3322 -10180 -3280 -10312 -3260 -10372 -3222 -10412 -3181 -10455 -3118 -10475 -3187 -10532 -3209 -10628 L -3222 -10728 -3222 -10766 Q -3219 -10835 -3199 -10903 L -3179 -10961 Q -3250 -11144 -3184 -11264 L -3222 -11295 -3249 -11326 Q -3321 -11421 -3355 -11536 -3393 -11666 -3406 -11801 -3418 -11927 -3407 -12052 -3397 -12179 -3371 -12309 -3347 -12431 -3307 -12563 L -3305 -12583 Q -3289 -12746 -3297 -12870 -3305 -13007 -3302 -13143 -3299 -13281 -3236 -13396 L -3222 -13419 -3204 -13442 M -2989 -12849 Q -2951 -12950 -2941 -13101 L -2934 -13158 Q -2914 -13267 -2845 -13305 L -2841 -13307 -2788 -13331 Q -2731 -13354 -2673 -13366 L -2631 -13358 M -2989 -12849 Q -2972 -12789 -2934 -12749 -2899 -12713 -2845 -12693 L -2801 -12681 -2788 -12678 -2745 -12669 -2594 -12592 Q -2462 -12524 -2341 -12510 -2403 -12458 -2510 -12377 -2576 -12327 -2608 -12253 -2631 -12216 -2682 -12154 -2694 -12012 -2696 -11886 -2697 -11753 -2705 -11620 -2714 -11484 -2711 -11347 -2709 -11217 -2712 -11088 -2715 -10955 -2723 -10823 -2561 -10858 -2492 -10745 -2424 -10635 -2378 -10514 -2348 -10435 -2327 -10354 L -2304 -10254 Q -2277 -10123 -2263 -9990 L -2238 -9801 -2233 -9773 Q -2214 -9668 -2206 -9551 -2197 -9418 -2240 -9294 -2284 -9167 -2309 -9034 -2332 -8908 -2291 -8787 -2238 -8631 -2112 -8713 -2068 -8742 -2040 -8780 -2024 -8801 -2014 -8825 -1995 -8871 -1993 -8926 -1990 -9002 -2014 -9044 -2024 -9063 -2040 -9075 -2070 -9099 -2120 -9098 L -2122 -9098 -2123 -9098 Q -2154 -9096 -2162 -9062 -2194 -8907 -2104 -8990 M -2745 -12669 Q -2656 -12570 -2630 -12434 -2613 -12343 -2608 -12253 M -3307 -12563 L -3301 -12582 Q -3273 -12672 -3222 -12738 -3191 -12778 -3152 -12809 -3071 -12874 -3018 -12862 -3002 -12859 -2989 -12849 M -3032 -11836 L -3018 -11857 Q -2977 -11910 -2946 -11817 L -2934 -11769 Q -2925 -11717 -2934 -11667 -2944 -11615 -2974 -11565 -2994 -11532 -3018 -11530 -3043 -11529 -3073 -11564 -3156 -11663 -3165 -11793 -3174 -11924 -3141 -12052 -3111 -12166 -3018 -12232 L -2998 -12245 Q -2963 -12267 -2934 -12261 -2897 -12255 -2870 -12201 L -2845 -12145 Q -2808 -12056 -2793 -11958 L -2788 -11922 Q -2775 -11819 -2781 -11714 -2783 -11680 -2788 -11647 -2803 -11545 -2841 -11449 L -2845 -11439 Q -2876 -11365 -2934 -11314 -2960 -11292 -2991 -11274 L -3004 -11255 -3018 -11235 -3083 -11141 Q -3143 -11057 -3179 -10961 M -2285 -12658 L -2327 -12693 -2463 -12798 Q -2552 -12864 -2658 -12885 M -2111 -11887 L -2079 -11960 -2078 -11962 -2040 -12032 -2014 -12075 -1936 -12184 Q -1851 -12289 -1753 -12382 -1700 -12270 -1637 -12173 L -1620 -12148 -1496 -11976 -1462 -11932 Q -1434 -11897 -1432 -11858 -1430 -11827 -1444 -11793 -1456 -11665 -1486 -11539 L -1496 -11501 Q -1523 -11395 -1556 -11289 -1595 -11259 -1637 -11245 L -1724 -11237 Q -1735 -11113 -1724 -10973 L -1637 -10922 -1594 -10896 Q -1588 -10978 -1500 -10939 L -1496 -10937 Q -1478 -10926 -1473 -10902 L -1336 -10916 -1334 -11038 Q -1329 -11172 -1337 -11304 L -1353 -11570 Q -1361 -11695 -1360 -11821 -1358 -11950 -1359 -12080 L -1358 -12324 M -1837 -11898 Q -1906 -11866 -2014 -11872 L -2040 -11874 -2111 -11887 Q -2141 -11813 -2160 -11734 -2190 -11604 -2187 -11469 L -2185 -11389 Q -2112 -11356 -2040 -11328 L -2014 -11318 -1933 -11290 Q -1819 -11253 -1750 -11241 L -1724 -11237 M -905 -13359 L -741 -13306 -716 -13238 -652 -13039 Q -630 -12964 -618 -12892 L -601 -12883 -518 -12836 -509 -12831 Q -451 -12797 -386 -12625 L -327 -12463 M -819 -13697 Q -829 -13727 -865 -13732 -974 -13750 -1062 -13663 L -1079 -13645 -1079 -13644 -1062 -13619 -1022 -13553 -930 -13397 -905 -13359 Q -986 -13346 -1062 -13307 L -1112 -13278 -1191 -13227 M -1408 -13885 Q -1290 -13865 -1187 -13767 -1129 -13712 -1082 -13648 L -1079 -13644 M -1283 -13022 L -1142 -13080 -1062 -13110 -941 -13158 M -1343 -12849 Q -1232 -12884 -1105 -12931 L -1062 -12947 Q -994 -12975 -934 -13007 M -1276 -12692 Q -1172 -12709 -1062 -12744 L -1027 -12756 -912 -12792 M -618 -12892 Q -669 -12897 -714 -12853 L -716 -12851 Q -827 -12743 -855 -12620 -920 -12597 -990 -12584 L -1062 -12571 -1215 -12548 -1239 -12621 M -797 -11887 Q -875 -12014 -889 -11843 -901 -11700 -786 -11628 -746 -11603 -716 -11612 -683 -11623 -663 -11676 -617 -11798 -626 -11930 -635 -12053 -674 -12172 -690 -12220 -716 -12258 -764 -12329 -844 -12366 -935 -12407 -986 -12322 -1051 -12211 -1051 -12081 -1052 -11943 -1033 -11806 -1016 -11678 -977 -11554 -943 -11442 -890 -11337 -828 -11215 -737 -11114 L -716 -11091 Q -658 -11032 -601 -11001 -568 -10983 -534 -10974 L -518 -10971 Q -450 -10959 -403 -11002 L -379 -11031 Q -342 -11087 -306 -11185 M -3948 -15190 L -3936 -15214 Q -3876 -15136 -3769 -15049 L -3766 -15046 Q -3662 -14961 -3529 -14945 L -3420 -14952 M -3415 -14733 L -3507 -14675 Q -3621 -14603 -3717 -14709 L -3766 -14758 Q -3817 -14808 -3871 -14848 -3897 -14867 -3916 -14842 L -3948 -14803 M -275 -10880 L -288 -10907 Q -326 -10977 -403 -11002 M -1432 -11858 Q -1466 -11840 -1496 -11832 -1554 -11817 -1637 -11858 M -1113 -11326 Q -1222 -11240 -1143 -11095 -1098 -11014 -1062 -11018 -1032 -11021 -1008 -11082 -989 -11131 -1010 -11183 -1032 -11238 -1062 -11277 L -1113 -11326 M -1336 -10916 Q -1204 -10890 -1076 -10851 L -1062 -10846 Q -951 -10811 -862 -10765 -829 -10693 -814 -10627 L -807 -10674 Q -792 -10739 -729 -10752 L -716 -10754 Q -631 -10768 -601 -10723 -578 -10687 -589 -10614 -592 -10594 -601 -10584 -611 -10574 -628 -10577 -759 -10602 -654 -10665 M -1581 -10744 Q -1667 -10751 -1609 -10666 -1499 -10630 -1581 -10744 -1632 -10803 -1552 -10808 -1634 -10836 -1594 -10896 L -1564 -10883 -1496 -10887 Q -1484 -10893 -1473 -10902 M -1552 -10808 Q -1449 -10831 -1566 -10880 L -1594 -10896 M -1581 -10744 Q -1485 -10721 -1552 -10808 M -1286 -9910 Q -1252 -9895 -1201 -9925 -1144 -10061 -1272 -10054 -1387 -10003 -1286 -9910 M -1624 -9687 Q -1575 -9632 -1496 -9586 L -1424 -9549 Q -1296 -9489 -1167 -9532 L -1099 -9551 -1062 -9578 Q -996 -9639 -979 -9760 -960 -9894 -1034 -10006 L -1062 -10049 -1164 -10212 M -814 -10627 Q -819 -10562 -789 -10508 -765 -10465 -717 -10430 L -716 -10429 Q -660 -10389 -601 -10380 L -518 -10385 Q -489 -10392 -460 -10406 -423 -10424 -392 -10448 M -789 -10508 Q -808 -10420 -810 -10291 L -812 -10039 Q -812 -9907 -815 -9774 -818 -9646 -782 -9436 -747 -9226 -721 -9116 L -716 -9088 Q -710 -9043 -716 -8975 -724 -8879 -757 -8738 -781 -8609 -820 -8478 L -853 -8365 -799 -8290 -770 -8253 Q -746 -8236 -716 -8232 -666 -8226 -601 -8257 L -583 -8266 -518 -8295 Q -456 -8318 -407 -8315 M -1739 -11692 Q -1701 -11680 -1660 -11675 M -1637 -11530 Q -1608 -11511 -1588 -11484 L -1637 -11488 Q -1783 -11504 -1897 -11541 -1774 -11601 -1656 -11541 L -1637 -11530 M -1832 -11470 Q -1776 -11424 -1688 -11434 M -2031 -10393 L -2040 -10435 Q -2061 -10537 -2090 -10632 L -2152 -10832 -2177 -10923 Q -2173 -11060 -2179 -11196 L -2185 -11389 M -2991 -11274 L -3015 -11262 -3018 -11260 Q -3110 -11219 -3184 -11264 M -2934 -11210 Q -2948 -11172 -2952 -11124 -2955 -11086 -2934 -11066 -2917 -11051 -2886 -11047 L -2845 -11049 Q -2811 -11057 -2788 -11088 L -2779 -11102 Q -2699 -11239 -2788 -11300 -2803 -11311 -2824 -11319 L -2845 -11310 Q -2908 -11278 -2934 -11210 M -2932 -10701 Q -2879 -10584 -2934 -10582 -2962 -10581 -3018 -10610 L -3019 -10611 Q -3023 -10663 -3018 -10698 -3005 -10789 -2934 -10770 -2914 -10765 -2889 -10751 L -2881 -10746 -2845 -10768 -2788 -10797 -2723 -10823 M -2881 -10746 L -2845 -10716 Q -2815 -10684 -2808 -10637 -2793 -10540 -2845 -10482 -2876 -10448 -2930 -10428 L -2934 -10426 -2989 -10418 Q -3000 -10278 -2968 -10183 -2946 -10128 -2934 -10079 L -2933 -10075 Q -2921 -9960 -2912 -9837 L -2898 -9565 Q -2894 -9443 -2896 -9321 L -2897 -9062 Q -2895 -8924 -2903 -8789 L -2845 -8545 -2788 -8313 -2753 -8173 -2716 -8021 Q -2710 -7954 -2683 -7876 L -2612 -7681 -2541 -7483 Q -2506 -7383 -2497 -7280 -2485 -7147 -2497 -7014 -2508 -6903 -2487 -6696 -2438 -6778 -2383 -6854 L -2327 -6929 -2233 -7041 -2212 -7063 Q -2212 -7140 -2224 -7210 -2246 -7341 -2276 -7474 L -2327 -7727 -2328 -7733 -2361 -7919 -2373 -7985 Q -2397 -8121 -2409 -8258 -2458 -8505 -2508 -8868 -2512 -8994 -2504 -9120 L -2486 -9350 Q -2469 -9262 -2458 -9127 L -2433 -8861 -2418 -8718 -2417 -8707 -2413 -8667 Q -2408 -8598 -2413 -8516 -2416 -8451 -2409 -8258 M -2989 -10418 L -3018 -10421 -3046 -10431 Q -3087 -10449 -3118 -10475 M -3118 -10198 Q -3120 -10073 -3183 -9918 M -2031 -10393 L -2014 -10416 Q -1935 -10510 -1832 -10442 -1773 -10468 -1755 -10457 -1765 -10498 -1731 -10535 -1733 -10586 -1695 -10612 -1667 -10603 -1653 -10590 -1682 -10670 -1637 -10670 L -1609 -10666 Q -1565 -10574 -1637 -10586 L -1644 -10588 -1653 -10590 -1646 -10581 Q -1625 -10546 -1688 -10485 -1686 -10454 -1717 -10442 -1733 -10456 -1754 -10457 -1748 -10452 -1749 -10441 -1750 -10422 -1773 -10385 -1759 -10362 -1753 -10334 -1876 -10413 -1931 -10263 -1953 -10204 -1896 -10179 -1803 -10139 -1767 -10233 -1709 -10086 -1865 -10038 -1952 -10011 -1996 -10068 L -1993 -9817 Q -1995 -9692 -2012 -9552 L -2014 -9541 Q -2024 -9462 -2040 -9386 L -2064 -9283 Q -2098 -9154 -2122 -9099 L -2123 -9098 M -1754 -10457 L -1755 -10457 M -1731 -10535 Q -1667 -10535 -1688 -10485 M -1832 -10442 L -1815 -10430 Q -1789 -10410 -1773 -10385 M -1996 -10068 L -1996 -10084 Q -2000 -10186 -2014 -10286 L -2026 -10365 -2031 -10393 M -2422 -9873 Q -2458 -9916 -2500 -9896 -2625 -9859 -2534 -9754 -2482 -9715 -2419 -9772 -2386 -9818 -2422 -9873 M -2630 -10075 Q -2750 -9998 -2771 -9861 -2791 -9728 -2751 -9601 -2708 -9465 -2584 -9398 -2534 -9371 -2483 -9361 -2408 -9348 -2329 -9374 L -2327 -9374 Q -2270 -9394 -2242 -9421 M -3147 -8179 Q -3090 -8153 -3018 -8167 -2978 -8175 -2934 -8195 L -2927 -8199 Q -2878 -8222 -2845 -8249 -2819 -8270 -2802 -8294 M -2716 -8021 L -2788 -7944 -2845 -7883 -2901 -7825 -2934 -7790 -3018 -7694 -3067 -7632 -3206 -7445 M -1739 -8631 Q -1748 -8586 -1716 -8568 -1698 -8569 -1702 -8588 M -401 -9204 Q -389 -9173 -359 -9149 M -1099 -9551 L -1114 -9306 -1125 -9055 Q -1131 -8930 -1142 -8811 L -1164 -8624 Q -1182 -8501 -1205 -8380 -1230 -8243 -1258 -8107 -1284 -7977 -1316 -7848 L -1382 -7588 -1452 -7329 -1483 -7214 Q -1458 -7203 -1434 -7188 -1321 -7118 -1240 -7010 L -1166 -6903 Q -1181 -6946 -1181 -7007 -1181 -7144 -1169 -7280 L -1152 -7496 -1143 -7538 Q -1121 -7640 -1082 -7739 L -1062 -7788 -984 -7977 Q -931 -8101 -893 -8230 L -853 -8365 M -770 -8253 L -716 -8170 -686 -8116 Q -647 -8040 -601 -7969 L -541 -7883 -518 -7851 Q -454 -7758 -395 -7640 M -1709 -7262 L -1652 -7252 -1637 -7338 -1601 -7491 Q -1566 -7614 -1496 -7723 L -1486 -7739 Q -1417 -7844 -1329 -7898 M -1652 -7252 L -1637 -7252 Q -1567 -7252 -1496 -7220 L -1483 -7214 M -1166 -6903 L -1107 -6799 -1062 -6705 -1005 -6562 Q -962 -6438 -942 -6310 -922 -6183 -921 -6052 -920 -5912 -942 -5778 -964 -5644 -1026 -5527 L -1062 -5460 -1070 -5445 -1076 -5435 -1062 -5440 -1018 -5450 Q -892 -5464 -786 -5385 -739 -5350 -716 -5303 -702 -5274 -696 -5241 L -609 -5500 -601 -5524 -555 -5667 M -1614 -6924 L -1637 -6953 -1660 -6993 -1661 -6952 Q -1664 -6836 -1657 -6721 -1654 -6667 -1637 -6638 -1606 -6583 -1530 -6616 -1491 -6632 -1499 -6684 -1520 -6818 -1614 -6924 M -1329 -6217 Q -1276 -6074 -1230 -6236 -1202 -6337 -1294 -6345 -1353 -6350 -1378 -6291 -1432 -6163 -1376 -6038 -1308 -5890 -1188 -6011 -1098 -6102 -1080 -6230 -1062 -6359 -1091 -6485 -1125 -6630 -1261 -6662 -1348 -6683 -1401 -6648 -1424 -6788 -1496 -6909 L -1535 -6969 M -1811 -7267 Q -1841 -7400 -1880 -7533 L -1918 -7676 -1645 -7697 Q -1653 -7582 -1685 -7445 -1707 -7350 -1709 -7262 L -1811 -7267 -1854 -7264 Q -1943 -7253 -2014 -7209 L -2015 -7209 -2040 -7193 Q -2148 -7125 -2212 -7063 M -2361 -7919 L -2327 -7901 Q -2227 -7843 -2150 -7760 -2091 -7697 -2040 -7623 L -2014 -7585 -1993 -7551 Q -1920 -7430 -1878 -7318 L -1854 -7264 M -3194 -7662 Q -3169 -7618 -3133 -7597 M -2634 -5628 L -2634 -5630 -2635 -5632 Q -2665 -5762 -2681 -5894 -2697 -6027 -2685 -6159 -2673 -6288 -2629 -6411 -2584 -6532 -2519 -6643 L -2487 -6696 M -1861 -5383 Q -1935 -5314 -2014 -5359 -2027 -5367 -2040 -5377 L -2073 -5408 Q -2165 -5509 -2204 -5638 -2233 -5731 -2236 -5829 -2240 -5965 -2203 -6094 -2166 -6226 -2078 -6325 L -2040 -6364 -2014 -6387 Q -1950 -6441 -1870 -6472 -1758 -6516 -1645 -6497 M -1746 -7000 Q -1783 -6885 -1801 -6763 -1815 -6663 -1811 -6562 -1910 -6556 -2014 -6513 L -2040 -6502 -2043 -6501 Q -2167 -6445 -2255 -6338 -2296 -6288 -2327 -6233 -2360 -6175 -2383 -6111 -2427 -5988 -2428 -5858 -2430 -5719 -2398 -5586 -2381 -5517 -2342 -5462 M -2386 -5183 L -2378 -5175 M -2219 -5197 Q -2263 -5232 -2327 -5210 L -2334 -5208 -2386 -5183 Q -2458 -5255 -2518 -5354 L -2577 -5303 Q -2641 -5475 -2773 -5385 L -2788 -5372 Q -2814 -5347 -2817 -5311 M -2219 -5197 Q -2289 -5136 -2303 -4990 -2307 -4950 -2327 -4916 -2338 -4896 -2355 -4879 -2446 -4782 -2594 -4783 -2677 -4702 -2615 -4650 M -1798 -5061 L -1804 -5076 Q -1854 -5198 -1985 -5232 L -2014 -5238 -2040 -5241 Q -2135 -5249 -2219 -5197 M -1637 -5431 L -1602 -5413 Q -1548 -5382 -1531 -5326 L -1509 -5268 Q -1566 -5207 -1637 -5315 L -1639 -5318 Q -1745 -5481 -1637 -5431 M -1798 -5061 L -1767 -4959 M -1800 -5077 L -1637 -5089 -1574 -5086 -1496 -5078 -1466 -5074 Q -1392 -5107 -1339 -5162 -1445 -5340 -1298 -5372 -1227 -5387 -1155 -5361 -1129 -5413 -1076 -5435 M -1804 -5076 L -1801 -5077 -1800 -5077 M -3111 -5359 Q -3068 -5357 -3051 -5335 L -3018 -5377 Q -2982 -5413 -2934 -5417 -2894 -5422 -2845 -5405 L -2824 -5397 Q -2837 -5456 -2816 -5530 -2804 -5571 -2788 -5597 -2736 -5682 -2636 -5629 L -2634 -5628 Q -2602 -5497 -2532 -5377 L -2518 -5354 M -3097 -5052 Q -3088 -5114 -3018 -5169 L -2945 -5217 -2934 -5223 Q -2890 -5245 -2845 -5254 L -2788 -5260 Q -2736 -5260 -2683 -5244 -2553 -5204 -2464 -5110 -2432 -5154 -2386 -5183 M -3068 -4564 Q -3158 -4553 -3222 -4597 -3262 -4624 -3292 -4671 -3360 -4777 -3369 -4902 -3379 -5045 -3276 -5124 -3314 -5152 -3308 -5211 -3296 -5308 -3222 -5341 L -3175 -5355 -3111 -5359 M -3065 -4566 Q -3047 -4540 -3018 -4516 L -3008 -4508 Q -2970 -4479 -2934 -4466 L -2845 -4464 Q -2815 -4474 -2788 -4499 L -2774 -4512 -2773 -4514 -2770 -4508 Q -2713 -4370 -2543 -4367 -2439 -4366 -2349 -4406 L -2327 -4385 Q -2269 -4338 -2188 -4345 L -2106 -4471 Q -2136 -4487 -2096 -4526 L -2072 -4520 Q -2072 -4542 -2059 -4577 L -2040 -4580 -2014 -4583 -1796 -4598 -1637 -4593 -1523 -4581 -1496 -4573 Q -1462 -4559 -1450 -4516 -1396 -4509 -1405 -4435 -1425 -4302 -1339 -4202 -1245 -4093 -1111 -4052 L -1062 -4040 Q -950 -4019 -840 -4061 -771 -4088 -716 -4132 -668 -4171 -631 -4223 L -607 -4263 -606 -4265 -601 -4275 Q -560 -4367 -594 -4468 L -601 -4486 Q -621 -4531 -661 -4564 M -3065 -4566 Q -3117 -4642 -3075 -4736 M -3068 -4564 Q -3188 -4499 -3200 -4356 -3210 -4231 -3111 -4176 -3134 -4060 -3018 -4003 L -2939 -3975 -2934 -3974 -2845 -3962 -2788 -3958 -2759 -3956 Q -2760 -3918 -2746 -3809 -2479 -3887 -2635 -4150 -2709 -4122 -2788 -4130 L -2831 -4138 -2845 -4141 Q -2898 -4156 -2934 -4184 -2995 -4232 -3011 -4320 M -3566 633 L -3571 394 -3532 552 Q -3510 629 -3457 682 -3364 774 -3332 904 -3299 1038 -3308 1178 -3317 1313 -3302 1445 -3274 1415 -3222 1409 L -3219 1408 -3222 1396 Q -3238 1327 -3227 1251 L -3222 1226 Q -3211 1179 -3186 1139 -3209 1114 -3222 1078 L -3231 1046 Q -3251 956 -3222 881 -3206 839 -3173 803 L -3222 727 -3235 704 Q -3302 583 -3322 445 -3342 306 -3282 183 -3257 131 -3222 93 L -3194 66 Q -3247 -10 -3177 -76 L -3222 -141 Q -3257 -195 -3285 -251 -3338 -354 -3256 -396 -3289 -506 -3257 -607 -3269 -643 -3274 -683 -3292 -817 -3222 -896 L -3197 -921 Q -3211 -927 -3222 -936 -3251 -958 -3265 -999 -3311 -1133 -3253 -1239 L -3242 -1258 -3251 -1271 Q -3337 -1388 -3222 -1477 L -3190 -1498 Q -3211 -1535 -3211 -1590 L -3222 -1609 Q -3252 -1670 -3222 -1736 L -3217 -1745 -3222 -1750 -3240 -1780 Q -3288 -1881 -3222 -1925 L -3220 -1927 -3222 -1937 Q -3230 -1982 -3222 -2018 L -3207 -2055 -3222 -2065 -3304 -2115 Q -3342 -2135 -3364 -2166 -3461 -2301 -3257 -2291 -3283 -2307 -3309 -2338 -3397 -2443 -3378 -2580 -3356 -2727 -3222 -2726 L -3179 -2723 -3204 -2796 -3222 -2867 Q -3239 -2946 -3241 -3019 -3241 -3156 -3232 -3291 -3224 -3417 -3225 -3544 -3226 -3667 -3232 -3785 L -3222 -3788 Q -3161 -3809 -3098 -3843 L -3090 -3968 -3018 -3970 -2939 -3975 Q -2952 -3944 -2950 -3896 L -2935 -3623 -2934 -3608 -2917 -3378 M -2635 -4150 Q -2611 -4160 -2587 -4174 -2488 -4231 -2402 -4223 L -2327 -4221 -2279 -4225 Q -2230 -4286 -2188 -4345 M -2072 -4520 L -2040 -4512 -2014 -4506 -1815 -4476 Q -1723 -4467 -1637 -4478 L -1526 -4504 -1496 -4513 -1450 -4516 M -1947 -2990 Q -1951 -3113 -1889 -3180 -1955 -3192 -2014 -3219 L -2040 -3232 Q -2109 -3269 -2169 -3329 -2326 -3486 -2326 -3708 -2326 -3930 -2169 -4087 -2109 -4147 -2040 -4184 L -2014 -4197 Q -1912 -4244 -1790 -4244 -1709 -4244 -1637 -4223 -1562 -4201 -1496 -4157 -1451 -4127 -1411 -4087 -1254 -3930 -1254 -3708 -1254 -3486 -1411 -3329 -1451 -3289 -1496 -3258 -1553 -3220 -1617 -3199 -1579 -3116 -1566 -3037 -1561 -3067 -1509 -3084 L -1496 -3084 Q -1409 -3081 -1421 -2966 L -1421 -2965 Q -1405 -3023 -1351 -3055 -1252 -3012 -1295 -2932 -1308 -2909 -1332 -2883 -1417 -2921 -1421 -2965 L -1422 -2970 -1426 -2982 -1430 -2969 -1430 -2968 -1431 -2967 Q -1452 -2907 -1496 -2934 L -1512 -2946 Q -1551 -2981 -1562 -3008 -1550 -2881 -1637 -2798 L -1662 -2777 Q -1742 -2716 -1831 -2767 -1955 -2837 -1948 -2978 -1954 -2965 -1981 -2947 -1998 -2935 -2014 -2928 L -2040 -2919 Q -2091 -2911 -2120 -2967 L -2121 -2968 -2130 -2988 -2127 -2966 Q -2118 -2865 -2285 -2882 -2269 -2881 -2280 -2909 L -2285 -2881 Q -2298 -2830 -2327 -2819 -2353 -2810 -2391 -2831 -2343 -2773 -2449 -2740 -2505 -2770 -2518 -2793 L -2520 -2798 Q -2528 -2818 -2500 -2832 -2472 -2952 -2458 -3084 -2445 -3214 -2406 -3322 -2517 -3367 -2624 -3378 -2631 -3321 -2641 -3267 L -2641 -3265 -2658 -3192 Q -2655 -3230 -2662 -3262 L -2665 -3271 Q -2706 -3405 -2717 -3544 L -2742 -3773 -2746 -3809 M -2040 -4022 L -2014 -4042 Q -1916 -4111 -1789 -4111 -1707 -4111 -1637 -4082 -1567 -4053 -1510 -3996 L -1496 -3981 Q -1394 -3870 -1394 -3716 -1394 -3562 -1496 -3451 L -1510 -3437 Q -1567 -3379 -1637 -3350 -1707 -3321 -1789 -3321 -1916 -3321 -2014 -3390 L -2040 -3410 -2069 -3437 Q -2184 -3552 -2184 -3716 -2184 -3880 -2069 -3996 L -2040 -4022 M -2040 -4089 L -2014 -4105 Q -1915 -4163 -1792 -4163 -1709 -4163 -1637 -4137 -1560 -4109 -1496 -4051 L -1474 -4031 Q -1342 -3899 -1342 -3713 -1342 -3527 -1474 -3395 L -1496 -3374 Q -1560 -3317 -1637 -3289 -1709 -3263 -1792 -3263 -1915 -3263 -2014 -3320 L -2040 -3337 Q -2077 -3362 -2110 -3395 -2242 -3527 -2242 -3713 -2242 -3899 -2110 -4031 -2077 -4064 -2040 -4089 M -2106 -4471 Q -2074 -4455 -2040 -4442 L -2014 -4433 Q -1929 -4403 -1832 -4390 -1735 -4377 -1637 -4385 L -1609 -4388 -1496 -4407 -1405 -4435 M -711 -5095 L -716 -5087 Q -759 -5016 -879 -5044 -1019 -5077 -976 -5223 -922 -5406 -813 -5270 -792 -5245 -822 -5222 -850 -5201 -876 -5225 M -696 -5241 Q -690 -5204 -694 -5161 -698 -5122 -711 -5095 -648 -5093 -601 -5068 -550 -5041 -518 -4987 L -507 -4967 -495 -4939 M -1059 -5769 L -1062 -5760 Q -1103 -5639 -1134 -5517 L -1136 -5512 Q -1109 -5497 -1121 -5513 L -1086 -5495 -1062 -5535 Q -1019 -5619 -1013 -5750 -1022 -5837 -1059 -5769 M -1236 -5822 Q -1178 -5686 -1235 -5524 -1252 -5473 -1286 -5470 -1327 -5507 -1294 -5636 -1261 -5765 -1236 -5822 M -1339 -5162 Q -1304 -5199 -1278 -5245 -1233 -5325 -1178 -5282 -1173 -5328 -1155 -5361 M -1466 -5074 Q -1309 -5060 -1334 -4896 -1355 -4760 -1304 -4644 -1261 -4544 -1165 -4606 -1045 -4683 -1130 -4754 -1168 -4786 -1186 -4727 -1215 -4633 -1149 -4672 M -607 -4263 L -606 -4263 -601 -4263 Q -551 -4260 -518 -4241 L -513 -4239 -512 -4238 M -1182 -2876 Q -1180 -2889 -1180 -2868 -1092 -2900 -1084 -2873 -1071 -2826 -1074 -2800 L -1071 -2800 -1062 -2811 -1020 -2810 -1062 -2950 Q -1082 -3026 -1096 -3126 -1109 -3215 -1106 -3307 L -1062 -3323 -913 -3381 Q -907 -3272 -885 -3177 L -855 -3183 Q -851 -3301 -824 -3445 -799 -3576 -789 -3709 -779 -3835 -776 -3960 L -716 -3969 -618 -3971 -615 -3916 -615 -3912 -614 -3912 -601 -3916 Q -564 -3929 -518 -3938 L -517 -3938 -452 -3946 M -615 -3912 L -607 -3709 Q -602 -3570 -621 -3435 L -625 -3371 M -442 -3780 L -438 -3680 Q -433 -3550 -447 -3421 -461 -3285 -495 -3156 M -1562 -3008 L -1563 -3012 -1566 -3037 Q -1569 -3024 -1562 -3008 M -1426 -2982 L -1428 -2990 -1426 -2982 -1424 -2988 Q -1422 -2997 -1421 -2966 L -1422 -2970 -1426 -2982 M -1071 -2799 L -1074 -2799 Q -1081 -2753 -1141 -2782 -1181 -2833 -1180 -2863 L -1180 -2864 -1180 -2868 -1181 -2868 -1181 -2864 -1181 -2863 Q -1183 -2824 -1234 -2820 -1301 -2877 -1282 -2923 -1271 -2952 -1228 -2976 -1187 -2914 -1182 -2876 L -1181 -2868 -1184 -2867 -1182 -2876 M -970 -2710 Q -1008 -2709 -1031 -2734 L -1062 -2773 Q -1072 -2789 -1071 -2799 L -1071 -2800 -1020 -2810 Q -929 -2764 -970 -2710 -915 -2741 -886 -2694 -856 -2642 -861 -2615 -797 -2578 -790 -2538 -749 -2549 -716 -2569 -654 -2606 -622 -2673 -668 -2713 -716 -2740 L -732 -2749 -716 -2763 Q -651 -2824 -601 -2904 L -571 -2956 Q -555 -2987 -539 -3005 L -518 -2863 -489 -2751 Q -471 -2694 -460 -2638 -489 -2624 -518 -2644 L -526 -2651 Q -558 -2578 -601 -2521 L -658 -2457 -601 -2472 -595 -2475 Q -554 -2491 -518 -2516 -444 -2567 -395 -2653 L -391 -2701 M -1071 -2799 L -1020 -2810 M -970 -2710 Q -1045 -2565 -891 -2587 -866 -2594 -861 -2615 M -1566 -1524 Q -1621 -1621 -1637 -1734 L -1642 -1783 Q -1647 -1859 -1638 -1933 L -1637 -1936 -1632 -1943 -1632 -1944 Q -1630 -1999 -1617 -2051 -1586 -2171 -1496 -2232 L -1454 -2257 Q -1367 -2299 -1272 -2293 -1303 -2422 -1369 -2543 L -1317 -2616 -1315 -2618 -1291 -2643 -1257 -2674 Q -1207 -2574 -1165 -2446 -1134 -2353 -1124 -2261 L -1062 -2235 Q -1011 -2212 -962 -2179 -882 -2125 -833 -2070 M -1632 -1944 Q -1609 -1984 -1577 -2015 -1542 -2050 -1496 -2072 L -1436 -2096 Q -1305 -2136 -1173 -2115 -1115 -2106 -1062 -2085 -992 -2059 -929 -2012 -859 -1960 -833 -1883 M -891 -2587 Q -956 -2553 -867 -2468 -837 -2439 -818 -2452 L -810 -2461 Q -796 -2482 -790 -2538 L -716 -2485 -659 -2457 -658 -2457 M -1272 -2293 L -1201 -2283 -1124 -2261 M -531 -2322 Q -626 -2329 -551 -2210 -534 -2183 -518 -2175 -487 -2159 -460 -2207 -407 -2298 -518 -2320 L -531 -2322 M -323 -2303 Q -387 -2288 -448 -2342 -527 -2413 -424 -2457 -289 -2515 -348 -2388 -391 -2387 -395 -2394 M -659 -2457 L -716 -2454 -754 -2459 Q -712 -2367 -739 -2343 L -726 -2300 -716 -2303 -682 -2307 Q -641 -2310 -649 -2258 -659 -2190 -684 -2173 L -694 -2168 -682 -2170 Q -594 -2180 -608 -2117 -619 -2065 -637 -2049 -608 -1931 -653 -1908 -627 -1902 -620 -1875 -593 -1766 -644 -1753 -627 -1742 -626 -1710 -623 -1642 -651 -1628 -620 -1588 -635 -1559 -650 -1531 -665 -1517 -617 -1386 -674 -1375 -648 -1360 -643 -1327 -630 -1249 -657 -1230 -637 -1106 -678 -1081 -657 -951 -699 -947 -641 -814 -701 -808 -666 -687 -716 -646 L -734 -635 -716 -600 Q -692 -546 -716 -518 -736 -495 -789 -491 -715 -374 -831 -398 -693 -270 -844 -218 -750 -82 -896 -89 -761 -2 -885 99 -933 121 -956 78 L -983 14 Q -1032 75 -1047 128 -1055 97 -1062 81 L -1070 64 Q -1082 81 -1087 106 -1122 274 -1201 208 -1211 235 -1228 258 -1145 235 -1062 224 L -970 213 -927 212 -898 214 -889 216 -848 224 -841 226 -818 233 -816 235 Q -766 254 -720 290 L -716 294 Q -670 332 -656 393 -626 524 -690 646 L -716 690 Q -775 780 -871 836 -963 890 -1062 913 L -1120 924 -1277 933 -1277 934 Q -1280 973 -1294 1014 -1328 1113 -1394 1185 M -754 -2459 L -807 -2457 -818 -2452 Q -877 -2384 -789 -2337 -754 -2330 -739 -2343 M -726 -2300 Q -787 -2280 -759 -2201 -735 -2177 -716 -2170 L -694 -2168 -716 -2150 Q -730 -2129 -716 -2093 -697 -2065 -680 -2052 -655 -2033 -637 -2049 M -725 -1912 Q -794 -1989 -716 -2035 -701 -2045 -680 -2052 M -281 -2230 L -288 -2228 Q -357 -2203 -408 -2140 -495 -2032 -518 -1947 L -524 -1920 -518 -1925 Q -439 -1995 -318 -2043 L -310 -2046 M -2130 -2988 L -2130 -2993 Q -2132 -3055 -2076 -3076 L -2040 -3083 -2014 -3082 Q -1959 -3072 -1947 -2990 L -1948 -2978 M -2290 -2934 Q -2296 -2965 -2250 -2992 -2196 -3024 -2170 -3023 -2137 -3021 -2131 -2993 L -2130 -2988 M -1617 -3199 L -1637 -3193 Q -1709 -3172 -1790 -3172 L -1889 -3180 M -3098 -3843 L -3097 -3695 -3085 -3421 Q -3081 -3296 -3054 -3177 M -2967 -3019 L -3018 -2905 -3069 -2785 Q -3089 -2737 -3097 -2696 L -3018 -2692 Q -2997 -2643 -2969 -2595 L -2934 -2538 -2932 -2535 -2907 -2498 -2906 -2498 -2845 -2510 -2788 -2533 -2752 -2552 -2788 -2572 Q -2821 -2594 -2845 -2624 -2879 -2666 -2895 -2724 L -2845 -2732 -2788 -2742 -2773 -2745 -2788 -2762 -2845 -2833 Q -2888 -2892 -2927 -2960 L -2934 -2972 -2967 -3019 M -2531 -2786 L -2536 -2796 Q -2655 -2773 -2620 -2691 L -2620 -2689 -2612 -2674 -2594 -2671 Q -2464 -2653 -2531 -2786 M -2500 -2832 Q -2491 -2855 -2432 -2867 -2405 -2848 -2391 -2831 -2426 -2928 -2327 -2946 L -2321 -2947 -2290 -2934 Q -2278 -2927 -2279 -2920 L -2280 -2909 -2285 -2920 -2290 -2934 M -2680 -2588 Q -2724 -2575 -2742 -2543 -2763 -2509 -2752 -2451 -2723 -2458 -2708 -2430 L -2707 -2428 Q -2639 -2408 -2631 -2517 -2630 -2532 -2643 -2550 L -2659 -2569 -2680 -2588 M -2659 -2569 Q -2544 -2565 -2597 -2652 L -2612 -2674 -2623 -2688 Q -2698 -2650 -2673 -2593 L -2672 -2592 -2659 -2569 M -3257 -2291 L -3229 -2279 -3222 -2277 Q -3162 -2265 -3103 -2332 L -3103 -2333 Q -3027 -2421 -3109 -2497 -3158 -2543 -3213 -2513 L -3222 -2507 Q -3287 -2467 -3222 -2409 L -3217 -2405 Q -3129 -2332 -3147 -2415 M -3179 -2723 L -3154 -2660 -3018 -2566 -2949 -2524 -2941 -2519 -2934 -2515 -2907 -2498 M -2860 -2322 Q -2969 -2254 -2873 -2180 L -2845 -2187 Q -2814 -2202 -2823 -2243 -2828 -2266 -2845 -2297 L -2860 -2322 M -3207 -2055 Q -3145 -2012 -3093 -1959 L -3018 -1884 -3135 -2113 Q -3180 -2200 -3222 -2253 L -3234 -2267 -3237 -2271 -3257 -2291 M -3040 -2171 L -3018 -2198 Q -2960 -2278 -3018 -2336 -3051 -2320 -3073 -2301 -3137 -2247 -3093 -2175 -3071 -2137 -3040 -2171 M -2873 -2180 Q -2980 -2115 -2880 -2051 -2856 -2061 -2845 -2075 -2825 -2101 -2845 -2140 L -2873 -2180 M -2880 -2051 Q -2919 -2035 -2934 -2013 -2954 -1985 -2934 -1946 -2923 -1925 -2899 -1901 L -2888 -1892 -2845 -1891 Q -2754 -1956 -2845 -2027 L -2880 -2051 M -2788 -2362 L -2771 -2331 Q -2644 -2304 -2707 -2428 -2727 -2434 -2752 -2451 -2778 -2439 -2788 -2421 L -2789 -2419 Q -2801 -2396 -2788 -2362 M -2771 -2331 L -2788 -2312 Q -2811 -2283 -2823 -2243 M -2716 -1898 Q -2620 -1989 -2494 -2059 -2415 -2103 -2327 -2116 L -2249 -2122 Q -2138 -2121 -2040 -2077 L -2014 -2064 -1989 -2051 Q -1953 -2031 -1922 -1998 -1891 -1965 -1865 -1920 -1869 -1982 -1882 -2042 -1908 -2162 -2014 -2225 L -2040 -2240 -2044 -2242 Q -2142 -2291 -2248 -2293 L -2291 -2292 -2327 -2289 -2428 -2269 Q -2487 -2254 -2543 -2227 -2643 -2180 -2730 -2078 M -2906 -2498 L -2845 -2457 Q -2818 -2438 -2802 -2423 M -2428 -2269 Q -2394 -2390 -2342 -2504 L -2327 -2535 Q -2284 -2618 -2227 -2667 -2195 -2638 -2146 -2575 -2201 -2478 -2236 -2352 L -2248 -2293 M -2014 -1795 L -2040 -1822 Q -2105 -1881 -2207 -1902 L -2327 -1912 Q -2400 -1908 -2471 -1880 -2599 -1830 -2687 -1740 L -2653 -1707 Q -2566 -1764 -2436 -1796 L -2327 -1810 Q -2248 -1810 -2174 -1780 -2089 -1745 -2040 -1708 L -2034 -1703 -2033 -1703 -2014 -1726 -1989 -1762 -2014 -1795 M -1865 -1920 Q -1861 -1848 -1871 -1775 -1890 -1628 -1947 -1546 M -1976 -1675 L -2014 -1630 -2040 -1607 Q -2097 -1560 -2181 -1528 -2253 -1500 -2327 -1493 L -2330 -1492 Q -2345 -1336 -2330 -1194 L -2327 -1170 Q -2310 -1047 -2256 -935 L -2327 -851 -2349 -827 -2418 -1008 Q -2463 -1137 -2469 -1273 -2475 -1414 -2493 -1501 -2568 -1518 -2630 -1560 M -2653 -1707 Q -2579 -1643 -2475 -1619 -2402 -1603 -2327 -1602 L -2211 -1608 Q -2113 -1620 -2040 -1696 L -2034 -1702 -2033 -1703 M -1933 -1036 Q -1988 -1048 -2014 -1068 -2061 -1103 -2014 -1163 L -1977 -1201 Q -1947 -1228 -1897 -1222 -1929 -1140 -1933 -1036 M -2845 -1891 Q -2770 -1806 -2831 -1769 -2771 -1673 -2823 -1642 -2761 -1600 -2809 -1539 L -2788 -1509 Q -2754 -1452 -2788 -1414 -2801 -1400 -2824 -1388 -2800 -1360 -2788 -1337 -2767 -1296 -2788 -1271 -2803 -1254 -2838 -1245 -2799 -1205 -2788 -1176 -2779 -1154 -2788 -1138 -2796 -1125 -2818 -1117 L -2788 -1084 Q -2740 -1017 -2788 -949 L -2803 -931 -2788 -923 Q -2715 -880 -2768 -808 -2750 -758 -2746 -722 -2719 -814 -2675 -878 -2665 -784 -2664 -679 L -2666 -561 -2617 -673 -2614 -678 -2594 -719 -2601 -671 Q -2619 -529 -2594 -389 -2559 -469 -2522 -583 -2556 -392 -2518 -187 L -2516 -179 Q -2510 -153 -2500 -130 L -2495 -185 -2495 -191 Q -2485 -278 -2457 -339 -2463 -261 -2461 -185 -2458 -48 -2430 85 -2411 -38 -2364 -166 -2383 18 -2332 188 L -2330 193 -2330 194 -2328 189 -2327 186 Q -2291 88 -2263 -37 -2262 97 -2194 252 -2183 194 -2152 109 -2135 262 -2057 364 L -2055 366 -2040 352 -2014 331 Q -1931 267 -1825 244 L -1787 242 -1775 244 Q -1780 219 -1788 200 -1844 74 -1911 -15 -1756 0 -1637 -13 L -1630 -14 -1632 -10 -1637 -2 Q -1702 104 -1760 215 L -1775 244 -1759 243 Q -1694 241 -1637 257 -1576 274 -1526 312 L -1501 332 -1439 230 Q -1435 277 -1415 323 -1347 216 -1344 71 L -1344 62 -1343 -1 Q -1330 27 -1319 62 L -1319 63 -1318 64 Q -1301 116 -1287 186 L -1272 236 -1256 199 Q -1218 99 -1215 -44 L -1215 -49 -1215 -50 Q -1214 -92 -1221 -130 L -1196 -50 -1196 -49 -1157 93 -1155 100 -1149 136 -1139 97 -1139 96 Q -1111 -33 -1111 -166 L -1111 -174 -1113 -281 -1084 -174 -1062 -97 -1057 -81 -1049 -53 -1035 -87 -1034 -90 -1034 -91 Q -998 -193 -1000 -323 L -1000 -324 -1006 -418 Q -991 -381 -1000 -324 L -999 -323 -955 -245 -943 -320 Q -928 -436 -926 -554 -925 -615 -941 -669 M -2330 -1492 Q -2386 -1487 -2444 -1493 L -2493 -1501 M -3220 -1927 Q -3098 -1885 -3018 -1797 L -3005 -1782 Q -2968 -1714 -3018 -1697 L -3068 -1691 -3115 -1695 Q -3182 -1706 -3217 -1745 M -2888 -1892 Q -2973 -1790 -2873 -1772 L -2845 -1769 -2831 -1769 M -3211 -1590 Q -3170 -1648 -3121 -1648 -3073 -1648 -3018 -1591 L -3017 -1590 Q -2999 -1571 -3002 -1558 -2970 -1497 -2975 -1457 -2981 -1421 -3018 -1402 -3005 -1330 -3005 -1251 -3006 -1209 -3017 -1171 L -3017 -1169 -3016 -1136 -3016 -1135 -3018 -1101 Q -3023 -1058 -3039 -1014 L -3018 -1006 Q -2974 -988 -2949 -949 L -2934 -920 -2920 -872 -2916 -841 Q -2916 -801 -2934 -769 -2948 -746 -2972 -727 -2996 -708 -3018 -697 -3112 -652 -3183 -755 M -2823 -1642 L -2845 -1633 -2857 -1631 Q -2992 -1599 -2875 -1536 L -2854 -1528 -2845 -1527 -2838 -1527 Q -2823 -1529 -2809 -1539 M -3002 -1558 Q -3005 -1549 -3018 -1542 L -3033 -1537 Q -3128 -1512 -3211 -1590 M -2854 -1528 L -2866 -1521 Q -2930 -1482 -2930 -1447 -2931 -1412 -2867 -1380 L -2847 -1375 -2845 -1376 -2824 -1388 M -2873 -1772 Q -2985 -1693 -2857 -1631 M -2847 -1375 L -2860 -1367 Q -2964 -1300 -2845 -1248 L -2838 -1245 -2845 -1243 Q -2945 -1213 -2865 -1109 L -2845 -1111 -2818 -1117 M -3242 -1258 L -3222 -1225 Q -3172 -1132 -3175 -1021 L -3176 -971 M -3190 -1498 Q -3164 -1450 -3104 -1432 -3116 -1312 -3103 -1166 -3090 -1025 -3032 -1136 L -3018 -1169 -3017 -1171 M -2803 -931 L -2845 -907 Q -2894 -875 -2895 -843 -2896 -811 -2851 -779 L -2845 -777 Q -2818 -768 -2788 -790 L -2768 -808 M -2788 -633 L -2830 -628 -2845 -608 Q -2857 -585 -2845 -560 -2832 -534 -2794 -506 L -2788 -504 Q -2760 -499 -2748 -512 -2721 -539 -2764 -648 -2774 -639 -2788 -633 M -2764 -648 Q -2741 -672 -2746 -722 L -2764 -648 M -2865 -1109 Q -2953 -1071 -2901 -981 L -2877 -946 Q -2869 -922 -2845 -921 L -2803 -931 M -3197 -921 L -3165 -960 Q -3116 -1009 -3079 -977 -3054 -955 -3035 -894 -3009 -810 -3082 -810 -3152 -811 -3192 -909 L -3197 -921 M -3155 -537 Q -3102 -497 -3042 -467 L -3018 -456 -2934 -425 -2925 -423 Q -2886 -412 -2860 -389 L -2845 -372 Q -2828 -346 -2824 -303 L -2845 -303 -2934 -316 Q -2977 -328 -3018 -348 -3065 -372 -3110 -408 -3142 -424 -3164 -453 -3184 -477 -3196 -511 -3190 -549 -3155 -537 M -2967 -612 L -3018 -602 -3068 -604 Q -3064 -542 -3018 -514 -2986 -496 -2934 -493 L -2932 -493 -2934 -498 Q -2956 -553 -2967 -612 M -2851 -779 Q -2927 -706 -2845 -639 L -2830 -628 M -3257 -607 L -3222 -527 Q -3198 -487 -3165 -453 -3193 -419 -3190 -403 -3122 -324 -3018 -288 L -2970 -275 -2947 -269 -2934 -265 Q -2877 -245 -2845 -207 L -2838 -198 -2823 -134 Q -2802 -38 -2795 71 L -2845 85 -2903 88 -2934 86 Q -2979 81 -3018 65 -3064 46 -3102 12 -3154 31 -3194 66 M -3177 -76 L -3138 -26 -3102 12 M -2838 -198 L -2845 -196 -2934 -189 -3018 -197 Q -3060 -206 -3100 -222 -3180 -253 -3222 -318 -3244 -352 -3256 -396 M -2794 -506 Q -2852 -438 -2788 -406 -2769 -396 -2738 -390 L -2707 -415 Q -2671 -460 -2748 -512 M -2797 -304 Q -2797 -290 -2788 -278 -2768 -252 -2706 -235 -2677 -243 -2661 -256 -2602 -303 -2707 -414 -2702 -407 -2738 -390 -2774 -360 -2788 -334 L -2797 -304 M -2706 -235 Q -2775 -185 -2765 -146 -2757 -108 -2671 -80 -2647 -88 -2631 -99 -2558 -149 -2661 -256 M -2671 -80 Q -2794 21 -2644 56 -2563 39 -2562 -2 -2562 -40 -2631 -99 M -2220 -568 L -2263 -619 Q -2224 -677 -2155 -734 -2096 -784 -2040 -839 L -2014 -865 -1961 -921 Q -1852 -885 -1710 -890 L -1637 -897 Q -1595 -905 -1559 -921 L -1496 -863 -1362 -737 Q -1264 -642 -1292 -566 -1317 -515 -1379 -525 L -1451 -539 -1496 -547 -1637 -566 -1710 -571 Q -1845 -577 -1976 -564 L -2014 -560 -2040 -559 -2220 -568 Q -2139 -627 -2040 -678 L -2014 -692 -1987 -705 Q -1863 -764 -1724 -757 L -1637 -745 Q -1561 -727 -1496 -682 L -1487 -676 Q -1382 -600 -1292 -566 M -2177 -439 Q -2112 -404 -2040 -384 L -2014 -377 -1918 -363 Q -1785 -351 -1652 -357 L -1637 -358 -1496 -378 Q -1441 -390 -1390 -410 M -388 -1625 Q -526 -1710 -517 -1547 -488 -1534 -460 -1534 -406 -1535 -372 -1561 -352 -1592 -388 -1625 M -365 -1890 Q -480 -1891 -518 -1810 -532 -1780 -536 -1738 L -518 -1737 Q -399 -1731 -357 -1772 M -725 -1912 L -716 -1909 -653 -1908 M -926 -554 L -891 -497 -887 -551 -887 -552 -877 -741 Q -874 -786 -883 -828 -874 -791 -854 -755 L -854 -754 -843 -736 -828 -715 -829 -736 -827 -746 Q -816 -790 -745 -815 -830 -901 -745 -966 -825 -1045 -752 -1088 -836 -1173 -724 -1239 -828 -1324 -723 -1380 L -760 -1395 Q -807 -1462 -746 -1531 -801 -1609 -717 -1641 -805 -1707 -716 -1759 L -712 -1761 -710 -1763 -712 -1764 -716 -1768 Q -799 -1839 -725 -1912 M -710 -1763 Q -668 -1747 -644 -1753 M -717 -1641 L -716 -1640 Q -674 -1617 -651 -1628 M -746 -1531 L -716 -1507 Q -690 -1495 -665 -1517 M -517 -1547 L -518 -1545 Q -545 -1501 -559 -1417 -560 -1268 -549 -1136 -546 -1090 -524 -1064 L -518 -1074 Q -447 -1194 -452 -1352 -375 -1402 -361 -1467 M -674 -1375 L -716 -1378 -723 -1380 M -678 -1081 L -716 -1076 -752 -1088 M -724 -1239 L -716 -1235 Q -677 -1218 -657 -1230 M -309 -1251 Q -356 -1134 -357 -1007 -373 -971 -371 -955 L -365 -921 Q -360 -843 -432 -807 -512 -768 -518 -824 L -518 -846 -515 -867 Q -481 -1050 -357 -1007 M -1066 -1875 Q -1189 -1925 -1320 -1897 -1419 -1876 -1496 -1814 L -1552 -1761 -1496 -1711 -1493 -1709 Q -1403 -1775 -1278 -1815 -1164 -1851 -1062 -1804 L -1031 -1788 Q -959 -1746 -919 -1694 -896 -1714 -876 -1740 -945 -1826 -1062 -1873 L -1066 -1875 M -1530 -1654 L -1496 -1619 Q -1423 -1552 -1317 -1513 -1261 -1492 -1205 -1485 L -1062 -1493 -1049 -1496 Q -980 -1513 -919 -1546 M -1493 -1709 Q -1427 -1663 -1334 -1638 -1206 -1604 -1073 -1627 L -1062 -1629 Q -978 -1645 -919 -1694 M -1496 -1102 Q -1502 -1082 -1517 -1059 -1532 -1034 -1559 -1028 -1563 -1138 -1609 -1230 -1516 -1209 -1496 -1161 -1485 -1135 -1496 -1102 M -1205 -1485 Q -1208 -1342 -1217 -1220 -1225 -1098 -1250 -1024 -1276 -951 -1286 -935 -1221 -883 -1186 -797 -1135 -927 -1107 -1064 L -1062 -1304 -1058 -1329 Q -1045 -1410 -1049 -1496 M -831 -398 Q -912 -361 -915 -316 -919 -271 -844 -218 -1024 -208 -896 -89 -1012 -88 -983 14 M -745 -966 L -716 -950 -699 -947 M -745 -815 L -716 -808 -701 -808 M -734 -635 Q -752 -627 -777 -625 -895 -568 -789 -491 -912 -478 -831 -398 M -524 -1064 Q -572 -1035 -601 -988 -634 -935 -642 -858 -653 -756 -601 -711 -570 -685 -518 -678 L -502 -677 Q -431 -672 -393 -740 M -518 -604 L -481 -604 -518 -576 Q -561 -547 -601 -533 L -639 -525 -604 -619 -601 -618 Q -564 -606 -518 -604 M -381 78 Q -445 14 -514 -22 L -518 -20 -576 12 -601 23 Q -663 48 -716 45 L -761 35 Q -750 -55 -716 -151 L -697 -201 Q -690 -275 -601 -321 L -668 -295 Q -738 -292 -697 -367 -656 -407 -601 -441 L -593 -446 -518 -483 Q -431 -517 -352 -504 -357 -429 -423 -402 L -518 -357 -550 -342 -518 -349 Q -408 -373 -323 -410 L -293 -436 Q -323 -285 -456 -222 -488 -207 -518 -198 L -601 -184 Q -652 -183 -697 -201 M -601 -321 L -600 -321 -553 -342 -550 -342 -600 -321 M -395 -137 Q -445 -68 -514 -22 M -828 -715 Q -822 -676 -777 -625 M -518 178 Q -575 166 -589 229 -560 287 -518 283 -480 278 -431 222 -483 186 -518 178 M -518 570 Q -363 636 -363 481 -454 443 -517 473 L -518 495 -524 567 -518 570 M -535 753 Q -581 743 -601 753 L -603 754 Q -715 821 -617 881 L -601 881 Q -532 876 -518 841 -510 822 -518 794 -523 776 -535 753 M -378 799 L -393 820 Q -451 899 -510 948 -497 963 -503 1005 -407 1050 -352 1149 M -1228 258 Q -1253 306 -1257 360 -1286 345 -1293 302 -1326 387 -1386 424 -1383 393 -1401 381 L -1441 403 Q -1420 407 -1434 426 -1424 467 -1426 520 -1363 651 -1214 671 L -1062 675 -943 653 Q -814 618 -763 482 -709 343 -816 235 L -841 226 M -1164 301 Q -1278 294 -1251 409 -1097 473 -1068 333 -1062 304 -1099 300 -1139 296 -1164 301 M -1501 332 L -1496 336 -1451 380 -1441 403 -1434 426 M -1539 509 L -1536 496 -1536 494 Q -1531 366 -1637 357 L -1682 358 -1952 388 Q -1992 480 -1911 545 -1815 553 -1668 542 L -1637 542 -1573 553 Q -1547 530 -1539 509 M -1426 520 L -1430 567 -1496 616 Q -1543 648 -1566 653 L -1542 704 Q -1518 688 -1496 681 -1404 651 -1331 755 -1271 840 -1277 933 M -1542 704 L -1496 805 -1477 847 -1458 889 Q -1435 943 -1490 954 L -1496 955 -1564 953 -1619 1115 Q -1629 1140 -1659 1038 -1690 936 -1703 941 -1716 946 -1684 1546 -1669 1477 -1637 1415 L -1578 1323 Q -1541 1276 -1496 1248 -1432 1208 -1351 1206 -1215 1202 -1104 1275 L -1062 1306 Q -1006 1353 -970 1415 -941 1270 -819 1206 -764 1177 -716 1184 -653 1192 -603 1264 L -601 1267 Q -526 1378 -540 1515 -549 1608 -601 1640 -642 1665 -710 1653 L -716 1652 Q -790 1635 -789 1559 -789 1433 -716 1484 M -1564 953 Q -1602 932 -1557 848 -1536 808 -1509 862 -1500 881 -1502 905 M -1139 1154 Q -1103 1177 -1076 1145 L -1062 1126 Q -1042 1093 -1062 1070 -1077 1053 -1113 1041 -1270 1073 -1139 1154 M -1286 1645 Q -1262 1601 -1352 1597 -1419 1594 -1421 1667 -1425 1814 -1292 1806 L -1289 1805 -1288 1806 -1260 1802 Q -1112 1776 -1121 1616 -1130 1451 -1279 1448 -1405 1445 -1496 1516 L -1515 1531 Q -1625 1627 -1580 1772 L -1574 1789 Q -1550 1854 -1496 1901 L -1465 1925 Q -1416 1837 -1292 1806 L -1288 1806 -1270 1818 -1268 1819 Q -1226 1846 -1185 1846 -1181 1906 -1191 1958 -1119 1944 -1062 1907 -1027 1884 -998 1854 L -964 1811 -896 1709 -919 1663 Q -968 1543 -970 1415 M -1574 1789 Q -1595 1829 -1593 1861 -1588 1955 -1637 2012 -1668 2048 -1722 2070 -1813 2105 -1868 2030 -1946 1926 -1930 1797 -1949 1862 -2003 1899 L -2005 2191 Q -1868 2111 -1725 2127 L -1637 2145 Q -1559 2170 -1516 2220 -1526 2104 -1496 2003 L -1479 1954 -1465 1925 M -896 1709 Q -840 1799 -732 1807 L -716 1808 -601 1799 Q -554 1787 -518 1761 L -501 1747 M -833 1839 Q -783 1896 -716 1905 -665 1912 -603 1890 M -998 1854 Q -926 1939 -848 2102 -785 2074 -716 2064 L -703 2062 -601 2066 Q -557 2075 -518 2098 -488 2115 -460 2141 L -474 2062 Q -498 1921 -443 1794 L -388 1667 Q -375 1646 -294 1652 M -778 972 Q -806 945 -833 969 -954 1029 -848 1075 L -804 1077 Q -703 1043 -778 972 M -2562 -2 Q -2556 50 -2534 105 L -2533 106 -2506 164 Q -2500 132 -2500 93 -2448 172 -2354 227 L -2351 229 -2350 230 -2349 231 -2327 243 -2322 245 -2327 244 Q -2271 292 -2257 383 -2220 345 -2220 309 L -2056 410 -2055 366 M -2327 244 L -2353 239 Q -2430 224 -2509 220 L -2535 219 -2576 230 Q -2661 257 -2719 319 -2815 422 -2764 546 -2708 680 -2558 682 L -2327 668 -2286 661 Q -2148 637 -2064 507 L -2056 410 M -2335 301 Q -2441 247 -2478 338 -2456 447 -2328 445 L -2327 445 Q -2185 412 -2327 307 L -2335 301 M -2535 219 L -2579 219 Q -2698 221 -2788 287 L -2827 319 -2845 338 Q -2925 431 -2880 554 L -2845 631 Q -2821 676 -2788 717 L -2748 763 Q -2655 860 -2532 910 -2431 951 -2327 949 L -2270 944 Q -2251 821 -2190 756 -2118 680 -2040 703 L -2014 714 -1968 744 Q -1953 712 -1940 660 -1984 654 -2014 635 L -2040 613 Q -2062 589 -2072 554 L -2064 507 M -2579 1393 Q -2542 1299 -2445 1242 -2406 1219 -2365 1206 L -2327 1196 Q -2258 1181 -2183 1193 L -2167 1196 Q -2098 1210 -2040 1247 L -2014 1264 -1956 1317 Q -1903 1375 -1868 1444 -1845 1492 -1829 1544 L -1838 1429 Q -1850 1291 -1904 1169 -1958 1048 -1968 947 L -1969 932 -2005 954 -2014 958 -2040 962 Q -2059 958 -2067 930 -2088 856 -2040 811 L -2014 791 -2012 790 Q -1988 784 -1968 744 M -2005 897 Q -2019 865 -1976 844 -1896 881 -1969 932 M -2946 265 Q -2975 205 -3018 182 -3070 154 -3141 180 -3086 267 -3018 276 -2984 280 -2946 265 M -3173 803 L -3078 923 -3075 1027 Q -3147 1076 -3186 1139 M -2934 752 L -2939 747 Q -3004 772 -3018 801 -3026 816 -3018 834 -3007 858 -2963 884 L -2934 866 Q -2871 816 -2934 752 M -3018 552 Q -2992 530 -3018 473 -3189 415 -3174 551 -3052 580 -3018 552 M -3219 1408 Q -3175 1455 -3141 1515 -3070 1642 -3104 1738 -3074 1773 -3038 1795 L -3018 1806 Q -2977 1826 -2934 1830 L -2845 1820 -2793 1799 -2788 1797 Q -2676 1740 -2619 1611 -2573 1503 -2603 1402 L -2603 1401 -2620 1356 Q -2672 1242 -2788 1224 L -2824 1221 -2845 1221 Q -2898 1223 -2934 1244 -2996 1280 -3010 1371 -3030 1510 -2934 1599 L -2923 1608 Q -2886 1639 -2845 1635 L -2822 1630 -2788 1615 Q -2733 1581 -2766 1508 -2777 1484 -2788 1470 -2819 1430 -2845 1478 L -2860 1515 M -2687 1097 Q -2573 1043 -2709 969 -2791 953 -2741 1061 -2727 1090 -2687 1097 M -3104 1738 Q -3150 1827 -3145 1957 -3130 1945 -3113 1936 -3069 1910 -3018 1898 L -2995 1893 -2934 1886 -2845 1888 -2788 1897 -2744 1908 Q -2669 1930 -2612 1987 -2562 2036 -2529 2076 -2518 1965 -2545 1820 -2558 1755 -2561 1694 -2562 1673 -2518 1665 -2448 1652 -2397 1677 -2420 1579 -2327 1495 L -2300 1473 Q -2184 1384 -2052 1476 L -2040 1485 Q -2026 1495 -2014 1506 -1927 1581 -1920 1682 -1915 1748 -1930 1797 M -2359 1153 L -2327 1127 Q -2278 1080 -2327 1054 -2341 1047 -2364 1041 -2514 1070 -2435 1149 -2409 1175 -2379 1164 L -2359 1153 M -2397 1677 L -2379 1687 -2327 1730 Q -2290 1769 -2271 1821 -2245 1743 -2155 1781 -2137 1772 -2123 1748 -2106 1718 -2112 1691 -2156 1509 -2249 1659 M -2280 1877 L -2271 1830 -2271 1821 Q -2279 1844 -2280 1877 -2293 1959 -2293 2054 L -2294 2313 Q -2296 2412 -2327 2504 L -2328 2507 Q -2340 2603 -2379 2725 -2390 2760 -2400 2780 -2409 2878 -2382 3018 -2363 3117 -2327 3209 L -2300 3273 -2187 3515 Q -2126 3641 -2042 3750 L -2040 3753 -2014 3787 -1954 3872 Q -1973 3734 -1980 3599 -1987 3479 -2014 3366 L -2020 3341 -2040 3261 -2085 3067 Q -2146 3013 -2185 2935 -2249 2809 -2238 2665 -2231 2585 -2204 2512 L -2202 2506 Q -2211 2477 -2210 2443 L -2203 2177 Q -2203 2032 -2229 1949 -2272 1900 -2271 1830 L -2270 1824 -2271 1821 M -2155 1781 Q -2081 1798 -2040 1839 L -2014 1874 -2003 1899 M -1829 1544 Q -1744 1461 -1767 1617 -1791 1772 -1767 1968 -1696 1784 -1689 1645 L -1684 1551 -1684 1546 M -2270 944 Q -2240 1056 -2158 1159 M -2005 2191 L -2014 2204 -2040 2241 -2151 2405 Q -2182 2453 -2202 2506 M -2080 2923 Q -2076 2977 -2040 3006 L -2014 3022 -2005 3025 Q -1902 3059 -1800 2956 -1682 2836 -1813 2744 -1854 2714 -1940 2744 -1984 2754 -2014 2773 L -2040 2793 Q -2087 2839 -2080 2923 M -1637 2606 Q -1623 2620 -1602 2622 -1532 2639 -1496 2596 -1468 2562 -1461 2491 -1455 2436 -1496 2414 -1526 2397 -1581 2399 -1615 2409 -1637 2424 -1711 2476 -1648 2591 L -1637 2606 M -2788 2181 L -2802 2184 Q -2827 2195 -2845 2209 -2937 2277 -2856 2396 L -2845 2411 Q -2821 2438 -2788 2447 L -2738 2450 Q -2621 2447 -2602 2290 -2592 2202 -2687 2184 L -2788 2181 M -2529 2076 Q -2467 2172 -2488 2313 -2509 2453 -2590 2563 -2666 2664 -2788 2674 L -2809 2675 -2845 2674 -2934 2663 -3018 2641 -3102 2609 Q -3082 2723 -3040 2850 L -3018 2920 Q -2990 3014 -2972 3106 -2958 3174 -2935 3239 L -2934 3242 -2883 3356 -2845 3426 -2788 3520 -2750 3577 Q -2675 3688 -2565 3765 L -2522 3798 Q -2464 3845 -2422 3900 L -2393 3944 Q -2459 4069 -2327 4047 L -2281 4036 Q -2257 4029 -2184 3966 -2265 3897 -2327 3818 L -2356 3778 Q -2430 3673 -2491 3562 L -2551 3448 M -3222 2213 Q -3265 2239 -3232 2313 L -3222 2331 Q -3196 2365 -3141 2352 -3035 2299 -3118 2198 -3190 2192 -3222 2213 M -3302 1445 Q -3351 1495 -3330 1611 -3305 1744 -3287 1875 -3278 1933 -3284 2093 L -3270 2117 Q -3253 2077 -3222 2036 L -3210 2020 Q -3180 1983 -3145 1957 M -2842 2539 L -2844 2554 -2854 2588 Q -2864 2608 -2897 2618 L -2934 2608 Q -2981 2593 -3018 2570 L -3054 2543 Q -3126 2519 -3060 2466 L -2970 2481 Q -2902 2488 -2871 2513 L -2842 2539 M -3102 2609 L -3107 2606 Q -3178 2560 -3222 2492 L -3233 2474 Q -3341 2399 -3477 2386 -3570 2378 -3636 2421 -3484 2489 -3426 2660 -3363 2846 -3347 3045 -3340 3131 -3272 3185 -3248 3204 -3222 3216 -3189 3231 -3153 3234 -3104 3239 -3055 3233 L -3018 3232 -2983 3239 -2981 3240 -2962 3241 -2935 3239 M -3162 6683 Q -3205 6629 -3222 6563 L -3233 6496 Q -3244 6360 -3230 6258 L -3257 6169 -3257 6167 -3271 6106 -3271 6102 -3280 6047 -3285 5994 -3303 5727 -3312 5468 Q -3312 5404 -3349 5380 -3449 5314 -3368 5164 L -3368 5163 -3361 5150 Q -3331 5099 -3335 5053 L -3336 5045 Q -3342 5012 -3365 4982 -3451 4873 -3493 4746 -3536 4616 -3437 4526 -3335 4432 -3222 4449 L -3204 4452 Q -3129 4369 -3064 4317 L -3063 4317 Q -3094 4279 -3115 4237 -3178 4109 -3165 4000 L -3222 4023 -3319 4054 Q -3448 4091 -3528 4052 -3480 4057 -3450 4013 -3380 3909 -3328 3796 -3287 3706 -3222 3632 L -3166 3574 -3103 3521 -3066 3492 -3108 3509 -3112 3510 Q -3171 3529 -3222 3530 -3295 3530 -3349 3493 -3292 3420 -3222 3365 L -3154 3316 Q -3082 3271 -3018 3253 L -2981 3244 -2962 3241 M -2970 3426 L -3018 3458 -3066 3492 Q -3041 3480 -3018 3465 L -2970 3426 M -3165 4000 Q -3119 3981 -3075 3958 -3045 3943 -3018 3924 L -2950 3863 -2934 3843 -2899 3791 Q -2861 3725 -2845 3650 M -2522 3798 Q -2643 3805 -2758 3867 L -2788 3885 -2845 3930 Q -2903 3984 -2931 4056 -2873 4067 -2862 4117 L -2845 4173 Q -2824 4225 -2788 4268 -2756 4305 -2712 4335 -2595 4413 -2450 4394 -2382 4385 -2327 4405 -2267 4426 -2222 4482 -2141 4583 -2126 4714 -2108 4865 -2184 4965 M -2085 3067 L -2040 3102 -2014 3118 -2006 3122 Q -1889 3186 -1753 3190 L -1637 3181 Q -1565 3166 -1499 3130 L -1496 3129 Q -1381 3065 -1346 2937 -1314 2814 -1313 2687 -1312 2558 -1357 2435 -1403 2310 -1496 2235 L -1516 2220 M -1954 3872 Q -1934 3936 -1919 4004 -1907 4063 -1898 4124 -1885 4212 -1861 4282 -1821 4400 -1731 4299 -1691 4253 -1698 4190 -1704 4132 -1700 4083 L -1700 4082 Q -1693 4002 -1662 3944 -1654 3928 -1637 3925 L -1624 3923 Q -1553 4006 -1577 4161 L -1581 4210 Q -1582 4302 -1496 4331 L -1415 4344 Q -1350 4307 -1382 4197 L -1327 4014 -1313 3967 Q -1294 3906 -1284 3843 L -1278 3807 -1278 3801 -1278 3779 -1267 3618 -1255 3519 -1225 3332 -1225 3330 -1214 3276 Q -1193 3162 -1191 3039 L -1190 2766 Q -1192 2634 -1202 2500 -1211 2370 -1227 2241 -1243 2106 -1206 2011 L -1191 1958 Q -1123 2080 -1079 2205 L -1062 2251 -1049 2283 -1062 2319 -1074 2386 Q -1081 2461 -1062 2529 -1046 2586 -1013 2639 -967 2713 -903 2771 L -831 2828 Q -776 2865 -716 2877 -661 2888 -601 2878 L -575 2873 -518 2856 Q -458 2835 -409 2802 M -430 2281 L -518 2258 Q -583 2242 -601 2247 -694 2272 -645 2395 -625 2415 -601 2426 -568 2441 -518 2437 -469 2433 -404 2411 -409 2367 -421 2319 L -430 2281 -460 2141 M -654 2584 Q -624 2596 -601 2614 -547 2655 -539 2723 -524 2777 -589 2801 L -623 2746 Q -652 2692 -707 2674 -764 2657 -809 2681 -855 2704 -876 2658 -813 2558 -716 2568 -687 2571 -654 2584 M -848 2102 Q -899 2124 -946 2158 -1017 2210 -1049 2283 M -203 2592 Q -206 2658 -215 2723 L -231 2839 -232 2842 -231 2839 -48 2632 89 2463 120 2421 180 2335 M -409 2572 Q -393 2503 -404 2411 M -138 2480 L -64 2363 Q -12 2283 63 2229 M -977 2292 Q -896 2410 -805 2254 -762 2181 -855 2184 -974 2186 -977 2292 M -1214 3334 L -1111 3249 -1062 3202 Q -995 3127 -959 3029 -911 2897 -903 2771 M -1595 3032 Q -1639 3100 -1572 3082 -1528 3071 -1494 3040 L -1445 2989 Q -1552 2963 -1595 3032 M -1019 3521 Q -997 3486 -934 3484 L -716 3476 -713 3475 -601 3483 Q -550 3498 -518 3536 -502 3555 -491 3579 L -518 3662 -575 3789 -601 3843 -602 3845 -682 4009 Q -733 4099 -635 4212 L -601 4243 Q -571 4263 -531 4275 L -518 4271 Q -436 4238 -443 4143 L -451 4095 M -1327 4014 Q -1232 3900 -1086 3958 L -1062 3966 Q -947 3998 -873 3874 -849 3832 -810 3806 -764 3775 -723 3773 -749 3656 -872 3558 -942 3503 -1019 3521 -1034 3543 -1032 3577 -965 3677 -972 3785 -1003 3838 -1062 3849 L -1113 3851 -1267 3618 M -232 2842 L -253 2983 -271 3080 -288 3151 -317 3247 -288 3280 -269 3305 M -602 3845 Q -653 3774 -716 3773 L -723 3773 M -443 4143 Q -443 4067 -419 3999 -402 3951 -372 3907 L -359 3887 -297 3796 M -271 3080 Q -272 2959 -232 2842 M -3565 722 L -3564 941 -3563 1041 M -3562 1067 Q -3557 1303 -3529 1537 -3505 1749 -3385 1921 -3345 1978 -3315 2037 L -3284 2093 -3287 2170 -3270 2117 M -3233 2474 L -3267 2401 Q -3296 2317 -3291 2241 -3295 2206 -3287 2170 M -2856 7081 L -2892 6978 Q -2892 6970 -2925 6893 -2938 6857 -2978 6771 L -3018 6669 -3051 6569 Q -3095 6427 -3045 6306 L -3018 6251 Q -2987 6198 -2943 6170 L -3018 6093 -3062 6032 Q -3139 5912 -3092 5772 -3071 5708 -3045 5656 -3016 5503 -3132 5412 -3184 5372 -3222 5324 -3268 5265 -3295 5194 -3322 5124 -3335 5053 M -419 3999 Q -394 4038 -376 4080 -341 4164 -337 4260 M -1250 4368 Q -1233 4239 -1099 4183 L -1062 4165 Q -999 4128 -955 4070 -910 4011 -846 3975 -784 3940 -744 3984 L -722 4002 -716 4005 -682 4009 M -722 4002 Q -891 4103 -825 4249 -789 4330 -716 4366 -673 4386 -618 4392 L -601 4394 Q -553 4402 -518 4425 -459 4463 -441 4545 -419 4645 -467 4735 M -601 4663 L -587 4664 -566 4670 M -601 4579 L -574 4593 -539 4599 M -601 4767 Q -585 4789 -546 4799 M -1437 4526 Q -1409 4593 -1300 4569 M -927 4326 Q -921 4435 -930 4569 -938 4706 -962 4843 -984 4977 -972 5116 -960 5250 -918 5382 L -831 5625 Q -783 5748 -754 5878 -725 6012 -737 6151 -781 6337 -912 6484 -790 6680 -777 6977 M -1063 5653 L -1087 5786 -1091 5827 -1092 5831 -1092 5834 -1097 5922 Q -1099 5990 -1094 6058 -1057 6093 -1089 6160 -1179 6349 -1180 6056 L -1180 6042 Q -1153 5997 -1151 5922 L -1152 5831 -1152 5827 -1152 5820 Q -1154 5690 -1188 5563 -1218 5446 -1279 5361 -1458 5181 -1366 5013 -1300 4992 -1281 5020 -1219 5059 -1193 5129 -1101 5381 -1063 5649 L -1063 5653 -1062 5650 -1062 5649 Q -1047 5582 -1027 5526 -1047 5322 -1091 5060 -1118 4894 -1094 4733 M -1568 6933 Q -1596 6771 -1578 6604 L -1545 6320 -1526 6181 -1496 6026 -1480 5922 -1446 5648 Q -1431 5519 -1447 5389 -1461 5282 -1496 5181 L -1514 5133 Q -1571 4991 -1617 4937 L -1637 4898 Q -1676 4835 -1755 4792 -1778 4780 -1804 4769 -1888 4733 -1929 4647 -1967 4566 -2014 4502 L -2040 4469 M -481 4965 L -518 5150 -530 5209 Q -556 5334 -563 5461 -571 5591 -566 5720 -561 5856 -518 5984 M -409 5906 L -395 5906 -381 5906 M -2422 3900 Q -2548 3925 -2593 4064 -2637 4203 -2529 4260 -2437 4235 -2327 4243 L -2280 4247 Q -2151 4263 -2040 4337 L -2034 4341 -2014 4356 Q -1984 4380 -1963 4408 -1992 4353 -2002 4289 -2024 4144 -1919 4004 -1959 4038 -2014 4054 L -2040 4060 -2068 4064 Q -2245 4084 -2184 3966 M -1963 4408 L -1942 4442 -1939 4447 -1880 4512 Q -1809 4576 -1803 4670 M -1700 4083 Q -1663 4198 -1645 4341 -1627 4481 -1671 4611 -1697 4686 -1731 4742 M -2931 4056 L -2934 4047 Q -2962 3952 -2950 3863 M -2752 5425 Q -2756 5339 -2752 5253 -2745 5124 -2731 4996 -2716 4866 -2788 4792 L -2802 4778 -2788 4731 -2783 4706 -2780 4689 -2779 4685 -2779 4683 -2778 4667 -2778 4663 -2778 4655 Q -2779 4626 -2788 4601 -2804 4555 -2845 4521 L -2848 4518 -2934 4446 -3018 4366 -3045 4338 -3055 4326 -3057 4324 -3058 4323 -3063 4317 M -2809 6079 L -2796 6070 -2845 6022 -2908 5950 -2934 5911 Q -2976 5834 -2944 5754 L -2934 5733 -2923 5715 Q -2887 5608 -2877 5490 -2866 5357 -2895 5227 -2908 5167 -2934 5113 -2966 5046 -3018 4989 -3043 4962 -3045 4922 -3050 4832 -3018 4757 -2999 4711 -2966 4670 L -2934 4639 Q -2892 4612 -2860 4663 M -3204 4452 L -3222 4472 -3236 4488 Q -3329 4596 -3242 4718 L -3222 4749 Q -3160 4853 -3184 4972 -3214 5122 -3086 5216 -3045 5246 -3018 5284 -2969 5353 -2968 5447 -2967 5510 -2989 5562 L -3018 5606 -3045 5656 M -2779 4683 L -2779 4684 -2777 4685 Q -2774 4687 -2770 4690 -2671 4765 -2591 4854 L -2404 5055 Q -2358 5105 -2327 5161 -2294 5221 -2279 5288 -2249 5416 -2236 5546 -2234 5566 -2237 5584 L -2237 5585 -2249 5619 Q -2260 5715 -2297 5824 L -2327 5893 Q -2371 5976 -2444 6036 L -2646 6207 Q -2627 6233 -2614 6263 -2491 6206 -2384 6124 L -2327 6074 Q -2262 6008 -2221 5924 L -2220 5923 -2214 5909 -2211 5903 Q -2167 5796 -2173 5677 L -2174 5587 Q -2172 5495 -2154 5404 -2127 5267 -2057 5144 M -2796 6070 L -2788 6064 Q -2697 5997 -2627 5901 -2546 5791 -2514 5657 -2482 5521 -2524 5392 -2564 5270 -2617 5153 -2656 5064 -2637 4972 M -1802 5194 Q -1783 5287 -1772 5382 -1758 5500 -1769 5620 -1781 5757 -1751 5892 -1722 6023 -1698 6153 L -1681 6230 Q -1699 6473 -1794 6733 -1842 6863 -1861 6947 -1712 7179 -1830 7413 -1866 7485 -1856 7566 M -1940 4929 Q -1845 5008 -1815 5137 L -1802 5194 Q -1842 5324 -1889 5450 -1931 5563 -1947 5684 -1965 5820 -1972 5956 -1979 6079 -1960 6202 L -1916 6467 Q -1895 6585 -1890 6704 L -1861 6947 M -2403 7609 Q -2392 7517 -2365 7429 -2282 7169 -2155 6977 L -2123 6895 Q -2081 6767 -2148 6659 -2222 6540 -2200 6402 -2179 6265 -2210 6132 -2238 6012 -2218 5924 L -2214 5909 M -2590 7595 Q -2599 7397 -2503 7313 -2432 7209 -2404 7086 -2376 6961 -2386 6833 -2397 6700 -2399 6567 -2400 6428 -2372 6294 L -2342 6186 M -2796 6070 L -2795 6071 -2794 6072 -2788 6077 -2718 6134 Q -2675 6166 -2646 6207 M -2943 6170 L -2934 6177 -2886 6213 -2845 6244 Q -2813 6271 -2788 6304 L -2777 6319 -2776 6320 Q -2747 6365 -2728 6419 -2684 6548 -2678 6683 -2673 6815 -2703 6939 M -2777 6319 L -2788 6327 Q -2818 6348 -2845 6381 -2885 6429 -2920 6501 L -2934 6532 Q -2981 6643 -2978 6771 M -2614 6263 Q -2595 6307 -2589 6359 -2573 6494 -2590 6631 -2581 6794 -2630 6870 -2661 6923 -2666 7009 M -3219 6158 L -3212 6158 M -3212 6093 L -3197 6093 M -3150 6697 L -3141 6707 -3131 6717 Q -3086 6761 -3050 6813 L -3018 6863 M -3134 7177 Q -3113 7049 -3125 6920 -3136 6801 -3154 6719 M -2259 7581 Q -2185 7288 -2008 7328 -2017 7504 -2072 7624 M -2990 6917 Q -2933 7040 -2943 7179 M -633 5883 Q -546 6127 -558 6416 -567 6614 -561 6818 M -912 6484 Q -958 6536 -1016 6583 -1253 6777 -1073 7039 -998 7149 -964 7250 M -1545 6320 Q -1509 6573 -1356 6811 -1213 7034 -1237 7307 M 120 2421 L 116 2510";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([20,20,20,0.7529412]));
	ctx.lineWidth=1.5;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape105(ctx,ctrans,frame,ratio,time){
	var pathData="M 6140 4810 Q 6158 4838 6149 4878 L 6146 4901 6143 4929 Q 6159 4908 6178 4891 L 6178 6569 6198 6569 6198 6856 6172 6960 6195 7001 6197 7001 6198 6998 6198 7007 Q 6259 7133 6249 7266 6328 7383 6308 7564 6289 7735 6198 7847 L 6198 42219 6173 42190 Q 6157 42169 6161 42143 6113 41912 6122 41656 6124 41577 6111 41499 6023 40968 5604 40580 5449 40437 5471 40228 5483 40122 5522 40020 5040 39586 5346 39053 5394 38968 5451 38897 5210 38595 5120 38158 4969 37420 5738 37130 5777 37115 5808 37080 5862 36721 5764 36374 5722 36228 5736 36072 5759 35806 5868 35550 5814 35444 5779 35342 5284 34921 5358 34285 4938 34042 4669 33636 4450 33303 4465 32910 4059 33049 3636 32900 L 3440 32826 Q 2957 32630 2565 32302 2177 32421 1916 32096 1836 31996 1768 31890 1577 31881 1383 31967 1315 31997 1234 31989 1037 31968 945 31778 L 898 31687 Q 631 31734 477 31517 431 31452 351 31474 -103 31596 -353 31923 L -353 29604 Q -60 29679 40 29977 359 30055 518 30343 543 30387 557 30435 L 572 30449 594 30458 Q 859 30368 1130 30406 1431 30052 1914 30179 1993 29977 2134 29807 2220 29703 2365 29698 2790 29063 3581 29133 3760 29148 3904 29240 L 3934 29240 Q 4093 29106 4279 29039 L 4202 28987 Q 3849 28739 3734 28337 L 3733 28332 Q 3723 28314 3722 28290 L 3720 28213 Q 3703 28158 3696 28099 3632 27523 3949 27038 4196 26662 4613 26487 4647 26377 4709 26287 4680 26204 4674 26123 L 4653 26109 Q 4524 26022 4514 25867 4484 25378 4871 25066 5040 24550 5586 24560 L 5602 24534 Q 5645 24464 5695 24403 L 5684 24353 Q 5654 24195 5612 24036 5416 23308 5651 22669 5570 22547 5512 22413 5367 22080 5281 21730 5108 21025 5513 20398 5546 20347 5582 20299 5276 19773 5629 19234 5694 19133 5748 19023 L 5769 18985 Q 5671 18661 5644 18316 5588 17602 5899 16965 5924 16912 5954 16863 5767 16624 5814 16300 5783 16243 5758 16182 5669 15970 5669 15762 L 5632 15720 Q 4837 14751 5427 13711 5351 13306 5527 12956 5429 12611 5654 12229 L 5650 12159 Q 5636 11613 5788 11089 5807 11019 5772 10948 5635 10671 5550 10372 5469 10084 5539 9790 5566 9674 5608 9567 5547 9440 5521 9298 5487 9117 5510 8939 5243 8677 5167 8298 5085 7884 5299 7512 5347 7429 5407 7350 5438 7308 5476 7274 5480 7065 5558 6859 5596 6754 5645 6653 L 5660 6628 Q 5660 6526 5669 6423 5677 6316 5709 6213 L 5721 6179 5682 6101 Q 5648 6043 5642 5975 5620 5741 5698 5531 5756 5373 5892 5274 5846 5130 5880 4976 5915 4816 6035 4707 6067 4678 6106 4658 L 6133 4643 6178 4649 6178 4775 6140 4810 M 2285 30166 L 2271 30200 2378 30073 Q 2312 30099 2285 30166 M 5480 33566 L 5493 33581 5493 33570 5480 33566";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 5802 5487 L 5793 5499 Q 5727 5581 5683 5676 5703 5690 5714 5715 L 5720 5730 Q 5674 5840 5645 5951 L 5710 5955 Q 5765 6076 5706 6231 5669 6328 5673 6435 5680 6651 5653 6857 5689 6995 5660 7125 L 5690 7231 Q 5696 7253 5685 7275 5576 7315 5559 7180 L 5555 7165 5527 7135 Q 5504 7314 5494 7497 5482 7710 5487 7925 5488 7951 5475 7972 L 5485 8031 Q 5498 8110 5425 8150 L 5315 8155 Q 5167 8078 5155 7916 5131 8118 5200 8322 5258 8262 5340 8220 5393 8226 5414 8275 L 5420 8290 Q 5411 8366 5364 8423 L 5335 8455 5325 8489 5370 8528 5400 8522 5400 8520 Q 5508 8579 5529 8703 5562 8771 5564 8850 5565 8896 5526 8905 5522 9002 5523 9100 L 5526 9220 5555 9265 Q 5588 9302 5608 9340 L 5632 9283 Q 5638 9271 5649 9262 L 5659 9259 5659 9257 5684 9260 5691 9268 5702 9282 Q 5694 9313 5695 9342 L 5697 9372 5692 9380 5679 9395 Q 5649 9646 5624 9901 5722 9974 5676 10134 5655 10205 5643 10278 L 5628 10365 Q 5693 10404 5718 10468 L 5745 10470 Q 5789 10531 5817 10597 5836 10603 5842 10622 L 5844 10630 5842 10637 5837 10648 Q 5893 10814 5859 11012 L 5856 11037 5853 11222 5824 11792 5814 11807 Q 5811 11938 5820 12070 L 5817 12092 5809 12095 5799 12092 5796 12000 5773 12270 Q 5755 12468 5707 12656 5694 12706 5655 12729 5670 12953 5694 13176 5700 13236 5648 13268 5513 13351 5452 13245 L 5420 13447 Q 5394 13607 5424 13763 5472 14016 5530 14267 5551 14355 5515 14434 5545 14525 5496 14600 5479 14625 5450 14639 5292 14647 5231 14491 5014 13939 5055 13335 5081 12972 5145 12614 5205 12282 5073 11964 5060 11932 5061 11894 5072 11297 5210 10721 L 5230 10639 Q 5186 10295 5197 9945 5203 9732 5288 9539 5279 9478 5276 9415 L 5273 9326 Q 5158 9127 5086 8905 5051 8798 5056 8684 5060 8598 5082 8525 4848 8255 4888 7893 4919 7612 5093 7415 5108 7361 5140 7315 5174 7235 5200 7154 5137 7062 5113 6957 5033 6596 5263 6309 5223 5746 5597 5300 5711 5164 5851 5056 5749 5237 5772 5447 L 5781 5463 Q 5788 5479 5802 5487 M 5395 7474 Q 5376 7549 5360 7625 L 5392 7698 5395 7474 M 5580 14809 Q 5812 14886 5669 15099 L 5628 15160 Q 5727 15240 5719 15401 L 5717 15524 Q 5768 15566 5755 15648 5745 15713 5740 15780 L 5750 15837 Q 5774 15962 5788 16089 L 5837 16517 Q 5843 16443 5855 16371 5862 16332 5899 16329 5941 16337 5940 16379 L 5939 16386 Q 5970 16524 5968 16671 5964 16969 5990 17263 6006 17438 5998 17608 L 5987 17631 Q 5990 17661 6000 17691 L 6002 17714 5997 17721 5994 17726 5989 17728 5979 17731 5965 17725 5957 17719 5944 17666 5942 17646 Q 5894 17613 5877 17559 L 5875 17560 Q 5905 17690 5842 17811 5830 17834 5810 17854 L 5753 17863 5752 18084 Q 5769 18182 5769 18283 L 5862 18978 Q 5898 19242 5840 19489 5849 19587 5788 19668 L 5750 19714 Q 5769 19814 5749 19879 5786 19964 5805 20059 5916 20166 5817 20281 L 5790 20314 Q 5688 20321 5619 20286 L 5622 20333 Q 5627 20431 5648 20530 5686 20704 5780 20858 L 5776 20874 Q 5770 20898 5750 20913 L 5740 20916 5733 20916 Q 5700 21080 5519 20973 5422 20916 5356 20823 5090 20453 5120 19982 5122 19948 5127 19915 5017 19832 4930 19710 4733 19432 4805 19099 4294 18792 4137 18239 4108 18138 4127 18034 4199 17640 4451 17346 4434 17278 4431 17200 4425 17018 4504 16859 4531 16804 4568 16756 4519 16451 4648 16137 4764 15853 4919 15589 5159 15179 5490 14844 5530 14804 5580 14809 M 5775 22358 Q 5650 22534 5623 22746 5612 22830 5657 22901 L 5734 23029 Q 5845 23220 5635 23323 L 5606 23334 5604 23338 Q 5551 23495 5537 23654 L 5560 23648 Q 5711 23706 5676 23886 5651 24014 5634 24143 5645 24136 5660 24133 5806 24199 5794 24384 L 5761 24817 Q 5755 24886 5682 24874 5597 24861 5564 24799 L 5559 24811 5540 24843 5533 24872 Q 5522 24902 5525 24933 L 5515 24948 5490 24978 5454 24978 5446 25003 Q 5440 25021 5419 25022 L 5358 25019 5355 25058 5265 25075 Q 5326 25192 5403 25302 5418 25324 5409 25353 5391 25410 5345 25443 5080 25468 4951 25185 4866 24997 4814 24800 4716 24429 4858 24073 4905 23957 4997 23870 5038 23831 5085 23798 4996 23338 5395 23078 5186 22587 5551 22185 L 5592 22134 Q 5642 22062 5720 22058 5921 22153 5775 22358 M 4641 26688 Q 4630 27113 4776 27502 L 4775 27528 Q 4634 27605 4540 27448 L 4460 27306 Q 4328 27062 4334 26763 4347 26072 4970 25784 5155 25806 5049 25945 L 5000 25998 Q 4802 26173 4701 26410 4644 26544 4641 26688 M 2856 29611 Q 2842 29695 2804 29770 L 2780 29798 2750 29801 2725 29798 Q 2608 29413 2841 29064 3078 28707 3500 28633 L 3569 28639 Q 3613 28636 3660 28638 L 3754 28650 3776 28540 Q 3833 28290 3955 28073 L 3974 28066 3975 28063 4035 28068 Q 4110 28194 4053 28358 4027 28433 4007 28509 4102 28383 4240 28283 L 4325 28288 Q 4467 28441 4309 28616 4237 28696 4187 28786 4329 28685 4520 28648 4720 28708 4595 28876 4535 28956 4441 28989 4334 29027 4277 29104 4333 29246 4329 29398 4329 29424 4310 29443 4285 29604 4151 29495 L 4134 29476 4095 29523 4070 29527 4060 29908 Q 4080 29953 4071 29998 4061 30050 4010 30073 3907 30086 3882 29993 L 3875 29963 Q 3753 29806 3759 29588 L 3770 29366 Q 3740 29341 3701 29331 3469 29270 3266 29344 3189 29371 3124 29425 3000 29530 2922 29401 L 2908 29372 Q 2876 29491 2856 29611 M 550 29633 Q 615 29751 640 29878 L 650 29896 Q 729 30040 757 30192 1021 30356 1124 30673 L 1137 30728 Q 1168 30916 1070 31058 L 1005 31058 986 31043 971 31028 960 31013 Q 944 30681 739 30467 L 740 30473 744 30489 745 30503 734 30513 705 30518 690 30503 689 30489 685 30473 682 30472 Q 663 30540 600 30593 L 578 30590 Q 560 30620 520 30633 L 487 30620 Q 478 30616 470 30608 L 462 30532 Q 426 30496 406 30438 L 371 30400 Q 197 30179 15 29965 -57 29880 -140 29813 L -140 29468 -148 29463 -236 29418 Q -454 29319 -285 29191 -262 29173 -240 29168 -189 29184 -140 29202 L -140 29073 Q 234 29108 432 29444 486 29535 527 29631 L 550 29633 M 710 31331 Q 762 31391 828 31437 1067 31602 1356 31587 1404 31584 1423 31638 L 1445 31696 Q 1463 31665 1500 31668 L 1873 31890 Q 2169 32060 2508 32109 2536 32113 2560 32132 L 2584 32152 Q 2675 32156 2761 32183 2785 32191 2795 32217 2931 32566 3256 32727 L 3239 32679 Q 3221 32617 3276 32579 L 3300 32563 Q 3445 32591 3562 32707 L 3607 32746 Q 3756 32732 3903 32699 3875 32537 3924 32388 3930 32368 3950 32354 L 3985 32328 4000 32325 4040 32318 Q 4183 32368 4198 32537 L 4208 32608 Q 4293 32580 4378 32561 4606 32509 4728 32663 4762 32707 4727 32752 4663 32832 4577 32874 L 4577 32893 4579 32980 Q 4636 33011 4678 33059 L 4694 33083 Q 4906 33119 5085 33229 5126 33255 5103 33300 5077 33349 5040 33380 5248 33407 5152 33602 5099 33709 5053 33822 L 5092 33925 Q 5290 34063 5529 34003 5717 33955 5717 34148 5717 34250 5639 34323 5510 34442 5470 34572 L 5470 34573 5508 34621 5526 34647 5545 34653 Q 5577 34695 5564 34743 L 5555 34773 5470 34791 Q 5480 34838 5493 34885 L 5516 34935 5571 35026 5577 35014 Q 5596 34978 5630 34963 5873 34961 5834 35205 5809 35362 5793 35520 5847 35587 5913 35645 6040 35757 6115 35898 6063 35967 5995 35978 L 6001 36003 Q 6006 36098 5930 36153 L 5766 36131 Q 5767 36259 5774 36387 5779 36464 5797 36539 5892 36933 6073 37292 6139 37423 6000 37480 5915 37515 5852 37451 5529 37125 5440 36658 5392 36410 5388 36154 4836 35907 4625 35330 4417 34762 4512 34171 4536 34024 4587 33890 4502 33768 4442 33616 4386 33472 4348 33323 4145 33229 4027 33033 3598 33127 3158 33054 2988 33026 2859 32900 2674 32721 2555 32493 1977 32655 1505 32330 1378 32243 1301 32115 1240 32013 1185 31908 802 31854 485 31588 274 31844 77 32130 -21 32272 -140 32388 L -140 31691 30 31468 46 31464 80 31458 Q 116 31479 139 31503 181 31429 245 31368 252 31315 272 31262 301 31188 370 31164 567 31164 710 31331 M 4759 33572 Q 4818 33494 4889 33430 L 4808 33422 4672 33403 Q 4708 33491 4759 33572";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,0.19215687]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 5851 5056 L 5852 5054 5896 4986 5916 4967 Q 5969 4881 6070 4845 L 6100 4835 Q 6122 4837 6138 4846 L 6178 4837 6178 4938 6163 4953 Q 6151 4994 6112 5025 L 6104 5032 Q 6072 5127 6072 5227 6072 5250 6054 5265 L 6052 5272 6049 5287 6046 5294 6034 5302 6025 5301 6012 5295 6009 5287 6007 5272 5998 5260 5990 5285 5979 5293 5960 5300 5935 5284 5932 5319 5927 5335 5926 5357 5922 5372 5914 5375 5909 5376 5901 5429 Q 5899 5443 5884 5450 L 5884 5451 5852 5450 5843 5437 5827 5477 5821 5483 5809 5490 5802 5487 Q 5788 5479 5781 5463 L 5772 5447 Q 5749 5237 5851 5056";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,0.36078432]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 3919 2784 L 3832 2780 3571 2796 Q 3121 2840 2715 2660 2599 2609 2529 2502 2337 2207 2401 1862 2466 1510 2702 1239 2937 968 3294 889 L 3608 829 Q 3781 826 3925 880 3547 682 3100 717 L 2767 742 Q 2180 782 1717 1131 L 1628 1211 Q 1388 1464 1381 1808 1378 1924 1406 2036 1429 2129 1469 2216 1495 2273 1530 2326 1698 2584 1975 2732 2400 2959 2781 3250 L 2820 3290 Q 3024 3571 2915 3907 2828 4177 2641 4393 2444 4619 2211 4810 1935 5036 1607 5164 1422 5236 1227 5211 949 5175 741 4986 693 4942 651 4889 446 4636 333 4335 260 4142 222 3943 181 3731 202 3518 237 3169 499 2927 673 2766 897 2824 L 938 2844 Q 1126 2982 1145 3219 1162 3430 1071 3614 995 3768 835 3830 L 803 3827 791 3816 784 3807 780 3798 742 3792 703 3788 663 3778 658 3772 665 3767 671 3766 710 3768 784 3769 Q 933 3685 993 3524 1043 3390 1041 3249 1039 3025 851 2905 621 2916 490 3115 447 3180 412 3249 292 3487 305 3756 322 4086 455 4391 593 4709 849 4936 1108 5166 1443 5084 1651 5033 1824 4905 L 2156 4644 2360 4463 Q 2554 4277 2694 4050 2874 3756 2730 3455 2673 3338 2561 3271 2120 3009 1696 2722 1439 2548 1327 2270 1242 2059 1249 1833 1264 1407 1571 1102 1881 796 2316 699 2747 604 3185 610 3570 603 3932 723 4185 807 4313 1031 4411 1201 4391 1401 4369 1630 4239 1815 4180 1900 4093 1955 L 4087 1957 4048 1958 4032 1968 4019 1977 4007 1984 3984 1981 3976 1970 3974 1962 Q 4038 1892 4098 1815 4062 1809 4041 1781 3948 1741 3944 1605 3942 1529 3905 1462 3765 1206 3469 1297 3150 1396 3063 1698 3027 1826 3056 1955 3116 2212 3361 2314 3500 2371 3651 2378 L 4067 2392 Q 4190 2394 4297 2423 4401 2327 4515 2241 4540 1930 4646 1636 L 4711 1457 Q 4816 1171 4983 913 5066 786 5188 719 L 5203 728 5210 735 Q 5112 904 5021 1087 4935 1260 4893 1447 4827 1740 4797 2039 4959 1929 5126 1826 L 5156 1820 5253 1764 5256 1744 5257 1741 5268 1679 5233 1707 5232 1703 5236 1698 5240 1693 5269 1675 Q 5297 1546 5352 1422 5374 1371 5418 1329 5444 1305 5475 1290 5719 1311 5812 1511 5915 1737 5946 1974 5953 2027 5966 2080 6003 2231 5831 2269 L 5660 2312 5473 2362 Q 5483 2438 5529 2516 5559 2568 5616 2609 5743 2617 5748 2509 5750 2478 5769 2452 5796 2461 5814 2490 5839 2529 5826 2568 5849 2746 5624 2735 5530 2730 5466 2664 5356 2551 5319 2413 5209 2426 5067 2392 5025 2381 5001 2350 4878 2197 5055 2122 5095 2105 5141 2095 L 5246 2064 Q 5233 1920 5251 1782 L 5182 1827 5169 1837 5170 1856 5169 1865 4786 2161 4783 2200 4772 2382 Q 4759 2637 4883 2848 4914 2899 4976 2904 5119 2914 5243 2823 5320 2766 5404 2726 5458 2700 5512 2732 5575 2952 5370 3088 5079 3281 4772 3120 4754 3159 4728 3195 4662 3287 4580 3366 4401 3540 4203 3692 3931 3972 3899 4355 3883 4542 3937 4725 3999 4931 4116 5112 L 4124 5124 Q 4200 5225 4326 5231 L 4614 5240 Q 4974 5211 5328 5120 5686 5029 5941 4973 6082 4942 6178 4932 L 6178 5123 Q 6136 5169 6029 5196 5858 5238 5620 5308 L 5193 5427 Q 4974 5485 4752 5527 L 5125 5708 Q 5431 5857 5517 6180 5614 6547 5577 6932 5558 7121 5512 7305 L 5469 7459 5453 7510 5444 7537 5434 7568 Q 5393 7687 5343 7802 L 5317 7866 Q 5293 7928 5240 7946 L 5220 7974 5217 7974 5310 8151 5297 8170 Q 5162 8082 5108 7914 L 5062 7786 Q 4961 7531 4913 7264 4867 7008 5002 6802 L 5002 6793 5002 6783 5021 6764 Q 4850 6510 4847 6220 4464 6082 4060 6018 L 3971 6004 Q 3868 5990 3776 5960 3439 5853 3231 5544 3103 5354 3064 5128 3030 4933 3046 4731 3067 4474 3115 4222 3191 3822 3387 3466 3535 3197 3780 2933 L 3919 2784 M 5505 1463 Q 5382 1719 5396 2012 L 5396 2022 Q 5503 2011 5601 1967 5646 1718 5524 1468 5517 1455 5505 1463 M 5253 1764 L 5251 1782 5253 1764 M 4074 2791 L 4033 2836 3938 2948 Q 3832 3106 3751 3282 3677 3445 3590 3599 L 3579 3611 3578 3614 Q 3667 3526 3767 3448 L 4276 3053 4295 3005 Q 4306 2958 4305 2909 L 4310 2860 Q 4221 2797 4084 2791 L 4074 2791 M 4508 2379 L 4408 2462 Q 4462 2486 4511 2518 4506 2449 4508 2379 M 3306 7720 L 3310 7720 3302 7825 3287 7826 3278 7817 3306 7720 M 3220 4058 L 3228 3988 3229 3979 3230 3975 Q 3191 4099 3165 4228 3088 4602 3129 4988 3172 5394 3483 5660 3717 5860 4027 5900 4428 5951 4816 6059 L 4857 6071 4862 6033 4877 5955 4748 5890 4564 5796 Q 4429 5729 4222 5654 4016 5579 3887 5477 3710 5403 3552 5271 3432 5171 3341 5045 3306 4996 3277 4942 3202 4803 3185 4645 3173 4538 3177 4430 L 3220 4058 M 4893 6084 Q 5065 6144 5206 6254 5093 6070 4912 5973 4899 6028 4893 6084 M 4888 6235 Q 4897 6443 5000 6643 5033 6708 5079 6764 5069 6792 5040 6802 L 5040 6812 5040 6822 Q 4938 6985 4960 7187 4979 7363 5036 7535 5082 7672 5139 7804 5140 7768 5153 7728 5165 7693 5188 7663 5275 7321 5308 6970 5326 6786 5302 6608 5273 6541 5236 6477 5157 6341 5013 6283 L 4888 6235";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,0.36078432]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 3919 2784 L 3832 2780 3571 2796 Q 3121 2840 2715 2660 2599 2609 2529 2502 2337 2207 2401 1862 2466 1510 2702 1239 2937 968 3294 889 L 3608 829 Q 3781 826 3925 880 3547 682 3100 717 L 2767 742 Q 2180 782 1717 1131 L 1628 1211 Q 1388 1464 1381 1808 1378 1924 1406 2036 1429 2129 1469 2216 1495 2273 1530 2326 1698 2584 1975 2732 2400 2959 2781 3250 L 2820 3290 Q 3024 3571 2915 3907 2828 4177 2641 4393 2444 4619 2211 4810 1935 5036 1607 5164 1422 5236 1227 5211 949 5175 741 4986 693 4942 651 4889 446 4636 333 4335 260 4142 222 3943 181 3731 202 3518 237 3169 499 2927 673 2766 897 2824 L 938 2844 Q 1126 2982 1145 3219 1162 3430 1071 3614 995 3768 835 3830 L 803 3827 791 3816 784 3807 780 3798 742 3792 703 3788 663 3778 658 3772 665 3767 671 3766 710 3768 784 3769 Q 933 3685 993 3524 1043 3390 1041 3249 1039 3025 851 2905 621 2916 490 3115 447 3180 412 3249 292 3487 305 3756 322 4086 455 4391 593 4709 849 4936 1108 5166 1443 5084 1651 5033 1824 4905 L 2156 4644 2360 4463 Q 2554 4277 2694 4050 2874 3756 2730 3455 2673 3338 2561 3271 2120 3009 1696 2722 1439 2548 1327 2270 1242 2059 1249 1833 1264 1407 1571 1102 1881 796 2316 699 2747 604 3185 610 3570 603 3932 723 4185 807 4313 1031 4411 1201 4391 1401 4369 1630 4239 1815 4180 1900 4093 1955 L 4087 1957 4048 1958 4032 1968 4019 1977 4007 1984 3984 1981 3976 1970 3974 1962 Q 4038 1892 4098 1815 4062 1809 4041 1781 3948 1741 3944 1605 3942 1529 3905 1462 3765 1206 3469 1297 3150 1396 3063 1698 3027 1826 3056 1955 3116 2212 3361 2314 3500 2371 3651 2378 L 4067 2392 Q 4190 2394 4297 2423 4401 2327 4515 2241 4540 1930 4646 1636 L 4711 1457 Q 4816 1171 4983 913 5066 786 5188 719 L 5203 728 5210 735 Q 5112 904 5021 1087 4935 1260 4893 1447 4827 1740 4797 2039 4959 1929 5126 1826 L 5156 1820 5253 1764 5256 1744 5257 1741 5268 1679 M 5269 1675 Q 5297 1546 5352 1422 5374 1371 5418 1329 5444 1305 5475 1290 5719 1311 5812 1511 5915 1737 5946 1974 5953 2027 5966 2080 6003 2231 5831 2269 L 5660 2312 5473 2362 Q 5483 2438 5529 2516 5559 2568 5616 2609 5743 2617 5748 2509 5750 2478 5769 2452 5796 2461 5814 2490 5839 2529 5826 2568 5849 2746 5624 2735 5530 2730 5466 2664 5356 2551 5319 2413 5209 2426 5067 2392 5025 2381 5001 2350 4878 2197 5055 2122 5095 2105 5141 2095 L 5246 2064 Q 5233 1920 5251 1782 L 5182 1827 5169 1837 5170 1856 5169 1865 4786 2161 4783 2200 4772 2382 Q 4759 2637 4883 2848 4914 2899 4976 2904 5119 2914 5243 2823 5320 2766 5404 2726 5458 2700 5512 2732 5575 2952 5370 3088 5079 3281 4772 3120 M 5505 1463 Q 5382 1719 5396 2012 L 5396 2022 Q 5503 2011 5601 1967 5646 1718 5524 1468 5517 1455 5505 1463 M 5251 1782 L 5253 1764 M 4074 2791 L 4033 2836 3938 2948 Q 3832 3106 3751 3282 3677 3445 3590 3599 L 3579 3611 3578 3614 Q 3667 3526 3767 3448 L 4276 3053 4295 3005 Q 4306 2958 4305 2909 L 4310 2860 Q 4221 2797 4084 2791 L 4074 2791 M 4508 2379 L 4408 2462 Q 4462 2486 4511 2518 4506 2449 4508 2379 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([20,20,20,0.43137255]));
	ctx.lineWidth=1.5;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

	var pathData="M 10040 5540 Q 10047 5535 10056 5532 L 10080 5525 Q 10137 5536 10135 5595 L 10135 5610 10128 5623 10105 5650 Q 10060 5666 10030 5630 10021 5601 10029 5571 L 10040 5540 M 5359 5505 L 5392 5443 Q 5598 5066 6010 5015 L 6100 5016 6150 5020 6168 5036 6189 5065 6195 5080 Q 6118 5191 5980 5228 5920 5304 5815 5355 L 5799 5383 Q 5811 5450 5769 5530 L 5737 5597 Q 5739 5621 5728 5655 L 5720 5684 Q 5797 5708 5842 5777 L 5845 5790 Q 5804 5831 5751 5855 L 5748 5867 Q 5729 5939 5726 6015 L 5722 6150 5740 6147 5740 6145 Q 5794 6157 5799 6215 L 5800 6230 Q 5754 6261 5716 6297 L 5703 6587 Q 5721 6628 5724 6671 5760 6709 5802 6743 5971 6884 5774 6947 5729 6961 5689 6933 L 5686 7013 Q 5684 7055 5662 7090 5649 7111 5632 7116 L 5724 7223 Q 5760 7270 5719 7314 L 5699 7333 Q 5768 7391 5841 7443 5863 7458 5853 7487 5787 7670 5590 7557 L 5547 7531 5545 7535 5549 7549 5540 7575 5531 7571 5523 7767 5515 7795 5497 7812 Q 5491 7824 5495 7835 L 5502 7872 5496 7877 5482 7880 Q 5473 7870 5471 7858 L 5469 7845 5465 7855 5450 7885 5438 7885 5445 7966 5511 8111 Q 5536 8162 5572 8203 5647 8290 5615 8390 5562 8418 5516 8414 5555 8592 5610 8768 5678 8983 5656 9201 L 5666 9213 5680 9204 5765 9209 Q 5869 9310 5830 9410 5953 9560 6058 9717 6076 9743 6053 9767 5937 9886 5787 9754 5705 9682 5635 9604 L 5596 9639 5576 9670 5599 9761 Q 5614 9813 5615 9869 L 5610 9899 Q 5622 9946 5650 9990 5664 10012 5655 10034 L 5643 10047 5620 10059 Q 5568 10034 5548 9975 L 5541 9957 Q 5549 10259 5605 10552 5634 10710 5754 10826 5762 10796 5773 10768 L 5782 10692 5787 10685 5799 10672 5805 10670 5809 10669 5809 10667 5820 10668 5829 10653 5849 10641 5849 10640 Q 5927 10681 5896 10782 5875 10851 5861 10922 L 5859 10955 5836 11376 5857 11397 5854 11404 5845 11417 5903 11457 Q 5937 11478 5950 11514 6016 11544 6054 11605 L 6060 11619 6043 11648 Q 6025 11675 6000 11694 5904 11686 5820 11661 L 5915 11724 Q 5928 11754 5925 11784 L 5915 11829 Q 5862 11853 5811 11856 L 5806 12140 5804 12485 5809 12498 Q 5828 12550 5825 12604 5860 12636 5859 12679 5859 12703 5865 12724 5852 12751 5820 12746 L 5800 12743 Q 5797 12879 5807 13013 5877 13086 5851 13182 5842 13216 5815 13239 L 5802 13242 Q 5676 13260 5610 13139 L 5585 13120 Q 5659 13214 5743 13301 5768 13328 5742 13357 5678 13428 5603 13411 L 5625 13424 Q 5730 13437 5825 13474 L 5839 13504 Q 5860 13549 5835 13594 5727 13652 5595 13604 L 5504 13599 Q 5544 13879 5633 14148 5641 14172 5620 14189 5635 14227 5656 14260 5671 14285 5660 14309 L 5654 14315 5625 14319 Q 5601 14294 5588 14260 L 5570 14214 Q 5533 14196 5501 14171 5585 14347 5713 14496 5802 14599 5690 14674 5589 14645 5510 14585 L 5545 14694 5557 14708 Q 5712 14733 5672 14908 5843 14998 5735 15132 5715 15157 5680 15157 5592 15156 5530 15089 L 5523 15087 5367 15225 5368 15235 5369 15244 5390 15229 5405 15225 5440 15219 Q 5559 15273 5537 15364 5651 15403 5626 15506 L 5633 15513 5647 15439 5654 15431 5669 15428 5669 15426 5694 15429 Q 5734 15525 5716 15640 L 5709 15714 5701 15915 5707 15925 5740 15919 Q 5885 16000 5851 16202 5837 16291 5850 16381 L 5878 16600 5888 16571 Q 5892 16561 5909 16555 L 5909 16554 Q 5982 16595 5976 16694 5967 16844 5966 16994 5965 17293 5989 17586 5994 17642 5990 17699 5989 17714 5974 17721 L 5942 17721 5934 17714 5927 17706 5904 17558 5890 17579 Q 5878 17621 5897 17670 L 5910 17714 5903 17728 5890 17744 5865 17744 Q 5836 17705 5828 17654 L 5823 17622 Q 5725 17653 5685 17543 L 5683 17538 5716 17908 Q 5727 18025 5755 18139 5765 18184 5741 18216 5812 18430 5932 18613 5977 18682 6053 18701 6267 18752 6150 18932 L 6125 18969 Q 6022 18995 5935 18992 L 5922 19002 5875 19044 5803 19047 5814 19165 Q 5870 19212 5827 19297 L 5841 19435 Q 5852 19537 5855 19639 5855 19660 5834 19669 L 5802 19669 5780 19632 5779 19641 5772 19628 5757 19584 5730 19567 Q 5741 19603 5722 19643 5712 19665 5694 19679 5611 19989 5571 20310 5671 20404 5807 20461 5820 20466 5830 20478 L 5831 20481 5890 20493 5903 20510 5910 20523 5878 20543 5825 20558 5816 20574 5810 20588 5785 20604 5770 20613 Q 5646 20600 5544 20553 L 5522 20713 5522 20718 Q 5680 20917 5860 21093 L 5883 21110 5895 21123 5896 21138 5885 21168 5860 21178 5830 21168 Q 5640 21143 5499 20977 5482 21440 5637 21880 5738 22168 5975 22362 5995 22378 5996 22409 5998 22494 5935 22554 5835 22581 5742 22549 L 5737 22558 5916 22762 Q 5952 22802 5917 22848 5818 22981 5677 22855 L 5675 22891 Q 5661 23189 5669 23484 5674 23623 5663 23761 L 5654 23776 5668 23911 5704 24040 Q 5733 24058 5745 24081 5798 24118 5790 24212 5788 24237 5776 24257 L 5783 24278 5797 24325 Q 5917 24423 5913 24573 5911 24630 5865 24663 L 5851 24666 5854 24683 Q 5877 24707 5890 24738 L 5882 24750 5860 24763 5848 24759 5845 24763 5846 24778 5850 24793 5855 24808 5853 24822 5845 24838 5840 24848 5830 24851 5800 24848 5788 24832 5776 24803 5775 24793 5720 24756 5742 24806 5737 24813 5724 24829 5694 24829 Q 5652 24770 5624 24701 L 5619 24689 Q 5573 24654 5547 24602 5335 24856 5361 25203 5369 25308 5285 25368 5071 25385 5017 25158 L 5002 25094 Q 4898 25493 5004 25911 5047 26082 5060 26253 5080 26377 4996 26375 5109 26506 5227 26627 5251 26651 5225 26684 L 5190 26718 5120 26718 5040 26673 Q 4997 26665 4935 26673 4806 26583 4706 26476 4628 26685 4595 26916 4579 27028 4592 27143 4606 27268 4545 27368 L 4570 27487 Q 4577 27525 4555 27558 L 4534 27562 Q 4521 27594 4478 27601 4329 27625 4273 27480 L 4249 27424 Q 4156 27227 4130 27033 3940 27254 3849 27551 3795 27730 3825 27922 3844 28037 3874 28150 3970 28062 4100 28018 4292 28080 4160 28230 L 4099 28288 Q 4020 28351 3971 28436 L 3980 28457 4013 28416 Q 4032 28395 4050 28383 4266 28427 4216 28662 4200 28738 4191 28815 4279 28924 4388 29017 4423 29047 4409 29093 4393 29143 4345 29168 L 4255 29168 4250 29165 Q 4219 29216 4179 29231 L 4180 29248 Q 4241 29299 4298 29360 4323 29387 4304 29423 4288 29454 4255 29468 L 4200 29468 Q 4237 29755 4334 30029 4340 30045 4330 30068 L 4305 30083 4290 30093 Q 4194 30071 4125 30017 4021 30114 3889 29960 3602 29623 3558 29185 L 3476 29155 Q 3444 29144 3428 29125 3166 29212 3092 29509 L 3032 29743 Q 3009 29830 2989 29919 2959 30055 2877 30158 2865 30173 2843 30168 2694 30131 2739 29969 2764 29877 2765 29778 2765 29747 2770 29718 2755 29389 2935 29091 3049 28901 3264 28802 3392 28743 3520 28728 L 3583 28728 Q 3610 28601 3661 28479 3577 28252 3522 28014 3505 27943 3503 27868 3487 27183 4026 26754 L 4138 26676 Q 4173 26485 4273 26297 4346 26159 4445 26055 4400 25934 4375 25801 4351 25673 4365 25547 4392 25293 4545 25087 4601 25011 4667 24951 4772 24595 5027 24297 5118 24191 5248 24134 L 5304 24111 Q 5143 23723 5092 23299 5035 22831 5206 22419 L 5138 22307 Q 4823 21772 4837 21154 4843 20887 4908 20628 4970 20378 5106 20177 5091 20064 5106 19948 4981 19865 4902 19701 4807 19505 4813 19294 4814 19261 4835 19234 L 4761 19163 Q 4558 19136 4390 18997 4251 18883 4178 18723 3925 18169 4135 17603 4244 17307 4448 17065 4325 16826 4315 16544 4295 15950 4626 15458 4766 15251 4948 15087 4831 14721 4931 14354 4865 14197 4842 14023 4789 13607 4903 13217 4794 13055 4763 12849 4723 12583 4762 12326 4728 12291 4700 12252 4419 11874 4391 11418 4378 11212 4475 11024 4599 10784 4840 10654 4818 10190 5043 9792 5107 9677 5202 9581 L 5222 9561 Q 5233 9476 5247 9392 L 5309 9042 Q 5263 8904 5242 8754 5237 8722 5235 8690 5194 8542 5167 8392 5106 8337 5068 8250 5004 8106 4990 7958 4974 7790 5031 7644 4959 7406 4954 7145 4950 6970 5006 6809 4868 6550 4875 6225 4879 6019 4974 5842 5104 5602 5359 5505 M 5207 10533 Q 5220 10521 5234 10511 L 5213 10407 Q 5207 10469 5207 10533 M 5200 11041 L 5210 11039 5205 10970 Q 5178 11026 5167 11085 5177 11064 5190 11045 L 5200 11041 M 5589 11788 L 5588 11793 5589 11794 5589 11788 M 5699 12027 L 5702 11904 5696 12024 5699 12027 M 5702 12685 L 5659 12685 5660 12689 5712 12821 5702 12685 M 5205 14798 L 5220 14881 5248 14864 5233 14842 5205 14798 M 4982 15651 Q 4829 15871 4766 16120 4835 15927 4928 15746 4953 15697 4982 15651 M 5633 18090 Q 5650 18092 5665 18099 L 5655 18060 5619 18072 5629 18090 5633 18090 M 39 29500 L 135 29562 Q 245 29648 336 29777 468 29965 608 30148 L 592 30046 635 30116 694 30251 692 30257 701 30268 Q 764 30434 797 30611 L 804 30643 805 30643 785 30646 675 30653 78 29985 Q -21 29872 -140 29782 L -140 29423 Q -75 29441 -14 29470 L 39 29500 M 620 31128 Q 820 31138 932 31267 L 935 31278 974 31310 985 31323 981 31326 930 31318 907 31345 Q 890 31361 870 31373 529 31306 315 31597 L 154 31806 -140 32172 -140 31758 -63 31657 Q 173 31370 482 31184 550 31143 620 31128 M 5319 34266 Q 5336 34392 5387 34510 5447 34650 5517 34784 5611 34860 5638 34997 L 5653 35020 5753 35094 Q 5926 35218 6037 35377 6064 35416 6041 35459 6013 35510 5965 35533 5856 35513 5756 35474 5843 35761 5917 36045 L 5917 36069 5922 36094 Q 5939 36139 5968 36179 5983 36199 5985 36223 L 5977 36235 5940 36263 Q 5896 36240 5867 36198 L 5825 36198 Q 5775 36163 5729 36123 L 5710 36108 Q 5514 36080 5397 35901 L 5339 35815 Q 5015 35332 4972 34764 4824 34530 4811 34244 4799 33982 4935 33782 L 4955 33763 5045 33763 Q 5086 33804 5112 33852 L 5140 33848 Q 5305 33920 5284 34129 L 5284 34133 Q 5309 34194 5319 34266 M 5449 35298 L 5445 35295 5451 35311 5449 35298 M 2890 31928 Q 2935 31934 2980 31913 2993 31918 3002 31927 L 3025 31953 Q 3017 32006 2956 32018 L 2925 32028 Q 2905 32139 2790 32149 2718 32156 2675 32203 2022 32254 1433 31947 1310 31882 1311 31753 1313 31625 1440 31618 1789 31748 2154 31841 2497 31928 2846 31914 2868 31913 2890 31928 M 6017 40413 L 6009 40639 Q 6171 40699 6144 40910 6125 41057 6132 41207 6145 41496 6173 41784 6240 41868 6287 41966 6321 42036 6273 42102 L 6218 42184 6236 42319 Q 6238 42332 6230 42347 6244 42423 6249 42498 6251 42542 6215 42567 L 6205 42570 6145 42567 Q 6162 42787 6192 43008 6199 43063 6150 43092 L 6104 43080 Q 6125 43147 6155 43215 6255 43444 6264 43682 6265 43715 6256 43747 6237 43814 6175 43847 L 6100 43847 6076 43831 Q 6050 43809 6045 43777 5997 43567 5959 43298 5920 43028 5798 42713 5675 42398 5900 42042 5664 41819 5582 41499 5530 41299 5602 41102 5691 40859 5702 40602 5710 40402 5767 40218 5781 40172 5820 40152 6029 40180 6017 40413 M 5920 41430 L 5906 41181 Q 5885 41308 5920 41430";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,0.2901961]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function morphshape106(ctx,ctrans,frame,ratio,time){
	var pathData="M -3522 -3322 -875 -1081 L -3522 -3324 -875 -1077 Q -3550 -3451 -578 -683 -3140 -3270 -460 -454 L -3044 -3201 -435 -381 Q -2683 -2967 -352 -178 -2333 -2505 -430 -223 -2250 -2425 -448 -234 -2181 -2346 -480 -245 -1920 -1961 -600 -312 -1858 -1847 -910 -531 -1831 -1788 -1048 -644 -1830 -1800 -1177 -797 -1827 -1820 -1414 -1050 -1913 -1887 -1618 -1259 -1996 -1939 -1815 -1424 -2136 -2020 -1836 -1562 -2220 -2075 -1849 -1655 -2325 -2148 -1799 -1723 -2648 -2324 -1626 -1884 -2802 -2609 -1700 -1904 -2949 -2955 -1773 -1923 -3225 -3077 -1474 -1707 -3495 -3181 -1173 -1514 -3522 -3322 -875 -1081";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(108+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3522 -3322 -875 -1081 Q -3495 -3181 -1173 -1514 -3225 -3077 -1474 -1707 -2949 -2955 -1773 -1923 -2802 -2609 -1700 -1904 -2648 -2324 -1626 -1884 -2325 -2148 -1799 -1723 -2220 -2075 -1849 -1655 -2136 -2020 -1836 -1562 -1996 -1939 -1815 -1424 -1913 -1887 -1618 -1259 -1827 -1820 -1414 -1050 -1830 -1800 -1177 -797 -1831 -1788 -1048 -644 -1858 -1847 -910 -531 -1920 -1961 -600 -312 -2181 -2346 -480 -245 -2250 -2425 -448 -234 -2333 -2505 -430 -223 -2683 -2967 -352 -178 -3044 -3201 -435 -381 L -3140 -3270 -460 -454 Q -3550 -3451 -578 -683 -3522 -3324 -875 -1077 -3495 -3181 -1173 -1514 -3225 -3077 -1474 -1707 -2949 -2955 -1773 -1923 -2802 -2609 -1700 -1904 -2648 -2324 -1626 -1884 -2325 -2148 -1799 -1723 -2220 -2075 -1849 -1655 -2136 -2020 -1836 -1562 -1996 -1939 -1815 -1424 -1913 -1887 -1618 -1259 -1827 -1820 -1414 -1050 -1830 -1800 -1177 -797 -1831 -1788 -1048 -644 -1858 -1847 -910 -531 -1920 -1961 -600 -312 -2181 -2346 -480 -245 -2250 -2425 -448 -234 -2333 -2505 -430 -223 -2683 -2967 -352 -178 -3044 -3201 -435 -381 L -3140 -3270 -460 -454 Q -3550 -3451 -578 -683 -3522 -3324 -875 -1077 L -3522 -3322 -875 -1081 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(102+ratio*(0)/65535))/255)]));
	ctx.lineWidth=1.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape107(ctx,ctrans,frame,ratio,time){
	var pathData="M -3390 -3410 -1039 -1034 L -3390 -3410 -1039 -1030 -3381 -3410 -993 -947 -3377 -3410 -978 -929 -3367 -3410 -930 -839 -3365 -3402 -924 -829 Q -3361 -3396 -902 -786 -3358 -3380 -880 -745 -3354 -3350 -839 -667 -3350 -3297 -799 -622 L -3338 -3277 -786 -607 Q -3316 -3231 -765 -576 -3300 -3170 -739 -567 L -3297 -3120 -710 -562 -3290 -3066 -679 -564 -3272 -3034 -664 -567 -3270 -3032 -664 -567 Q -3240 -2966 -664 -577 -3210 -2932 -664 -614 -3190 -2901 -686 -647 -3183 -2897 -713 -701 -3177 -2894 -737 -746 -3182 -2899 -764 -791 L -3184 -2903 -780 -821 Q -3197 -2919 -835 -921 -3209 -2957 -889 -1010 -3225 -3004 -954 -1118 -3240 -3085 -1019 -1209 L -3246 -3145 -1053 -1214 -3250 -3190 -1079 -1214 -3275 -3238 -1087 -1206 Q -3298 -3279 -1091 -1195 -3320 -3315 -1094 -1171 L -3344 -3350 -1089 -1144 -3375 -3386 -1079 -1105 -3377 -3390 -1076 -1099 -3380 -3390 -1070 -1085 -3387 -3391 -1056 -1060 -3387 -3393 -1054 -1058 -3389 -3399 -1047 -1049 -3390 -3410 -1039 -1034";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3390 -3410 -1039 -1034 L -3389 -3399 -1047 -1049 -3387 -3393 -1054 -1058 -3387 -3391 -1056 -1060 -3380 -3390 -1070 -1085 -3377 -3390 -1076 -1099 -3375 -3386 -1079 -1105 -3344 -3350 -1089 -1144 -3320 -3315 -1094 -1171 Q -3298 -3279 -1091 -1195 -3275 -3238 -1087 -1206 L -3250 -3190 -1079 -1214 -3246 -3145 -1053 -1214 -3240 -3085 -1019 -1209 Q -3225 -3004 -954 -1118 -3209 -2957 -889 -1010 -3197 -2919 -835 -921 -3184 -2903 -780 -821 L -3182 -2899 -764 -791 Q -3177 -2894 -737 -746 -3183 -2897 -713 -701 -3190 -2901 -686 -647 -3210 -2932 -664 -614 -3240 -2966 -664 -577 -3270 -3032 -664 -567 L -3272 -3034 -664 -567 -3290 -3066 -679 -564 -3297 -3120 -710 -562 -3300 -3170 -739 -567 Q -3316 -3231 -765 -576 -3338 -3277 -786 -607 L -3350 -3297 -799 -622 Q -3354 -3350 -839 -667 -3358 -3380 -880 -745 -3361 -3396 -902 -786 -3365 -3402 -924 -829 L -3367 -3410 -930 -839 -3377 -3410 -978 -929 -3381 -3410 -993 -947 -3390 -3410 -1039 -1030 -3390 -3410 -1039 -1034 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape108(ctx,ctrans,frame,ratio,time){
	var pathData="M -3410 -3330 -1034 -824 L -3410 -3330 -1034 -822 Q -3410 -3331 -981 -776 -3410 -3319 -929 -734 -3410 -3310 -884 -699 -3410 -3292 -839 -667 L -3402 -3288 -829 -659 -3390 -3265 -775 -626 -3380 -3250 -745 -607 Q -3330 -3188 -617 -532 -3217 -3112 -578 -470 -3170 -3073 -562 -439 -3112 -3027 -561 -457 -3073 -2991 -564 -471 -3034 -2967 -567 -488 -2905 -2887 -586 -545 -2897 -2935 -701 -633 -2894 -2951 -748 -662 -2900 -2980 -795 -694 L -2903 -2981 -821 -714 -2905 -2981 -831 -724 Q -2930 -2994 -978 -847 -3003 -3105 -1099 -904 L -3013 -3105 -1113 -919 Q -3049 -3110 -1161 -974 -3085 -3146 -1209 -1006 -3115 -3163 -1212 -1021 -3145 -3187 -1214 -1030 L -3163 -3200 -1215 -1034 -3165 -3200 -1215 -1032 -3238 -3260 -1206 -1019 Q -3326 -3309 -1183 -958 -3390 -3324 -1099 -879 L -3391 -3329 -1060 -848 -3399 -3330 -1049 -836 -3410 -3330 -1034 -824";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3410 -3330 -1034 -824 L -3399 -3330 -1049 -836 -3391 -3329 -1060 -848 -3390 -3324 -1099 -879 Q -3326 -3309 -1183 -958 -3238 -3260 -1206 -1019 L -3165 -3200 -1215 -1032 -3163 -3200 -1215 -1034 -3145 -3187 -1214 -1030 Q -3115 -3163 -1212 -1021 -3085 -3146 -1209 -1006 -3049 -3110 -1161 -974 -3013 -3105 -1113 -919 L -3003 -3105 -1099 -904 Q -2930 -2994 -978 -847 -2905 -2981 -831 -724 L -2903 -2981 -821 -714 -2900 -2980 -795 -694 Q -2894 -2951 -748 -662 -2897 -2935 -701 -633 -2905 -2887 -586 -545 -3034 -2967 -567 -488 -3073 -2991 -564 -471 -3112 -3027 -561 -457 -3170 -3073 -562 -439 -3217 -3112 -578 -470 -3330 -3188 -617 -532 -3380 -3250 -745 -607 L -3390 -3265 -775 -626 -3402 -3288 -829 -659 -3410 -3292 -839 -667 Q -3410 -3310 -884 -699 -3410 -3319 -929 -734 -3410 -3331 -981 -776 -3410 -3330 -1034 -822 L -3410 -3330 -1034 -824 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape109(ctx,ctrans,frame,ratio,time){
	var pathData="M -3330 -3254 -824 -824 L -3330 -3254 -824 -818 Q -3332 -3252 -711 -764 -3265 -3240 -626 -711 -3223 -3230 -571 -677 -3172 -3220 -523 -644 L -3112 -3190 -470 -611 Q -3073 -3173 -439 -596 -3027 -3156 -457 -582 -2963 -3133 -482 -568 -2936 -3110 -516 -554 -2921 -3097 -536 -557 -2918 -3085 -559 -559 -2916 -3078 -576 -568 -2920 -3072 -594 -576 -2926 -3066 -619 -590 -2944 -3060 -647 -604 L -2980 -3073 -694 -628 -2981 -3084 -724 -639 Q -2986 -3099 -766 -653 -3001 -3120 -800 -659 L -3012 -3124 -821 -670 Q -3043 -3135 -872 -694 -3103 -3155 -904 -714 L -3105 -3155 -904 -714 -3105 -3157 -919 -722 -3107 -3159 -935 -730 Q -3121 -3169 -1010 -764 -3200 -3178 -1034 -798 L -3200 -3178 -1032 -800 -3260 -3186 -1019 -831 -3278 -3190 -994 -849 -3299 -3210 -958 -864 -3307 -3219 -939 -863 -3324 -3250 -882 -854 -3330 -3254 -824 -824";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3330 -3254 -824 -824 L -3324 -3250 -882 -854 -3307 -3219 -939 -863 -3299 -3210 -958 -864 -3278 -3190 -994 -849 -3260 -3186 -1019 -831 -3200 -3178 -1032 -800 -3200 -3178 -1034 -798 Q -3121 -3169 -1010 -764 -3107 -3159 -935 -730 L -3105 -3157 -919 -722 -3105 -3155 -904 -714 -3103 -3155 -904 -714 Q -3043 -3135 -872 -694 -3012 -3124 -821 -670 L -3001 -3120 -800 -659 Q -2986 -3099 -766 -653 -2981 -3084 -724 -639 L -2980 -3073 -694 -628 -2944 -3060 -647 -604 Q -2926 -3066 -619 -590 -2920 -3072 -594 -576 -2916 -3078 -576 -568 -2918 -3085 -559 -559 -2921 -3097 -536 -557 -2936 -3110 -516 -554 -2963 -3133 -482 -568 -3027 -3156 -457 -582 -3073 -3173 -439 -596 -3112 -3190 -470 -611 L -3172 -3220 -523 -644 Q -3223 -3230 -571 -677 -3265 -3240 -626 -711 -3332 -3252 -711 -764 -3330 -3254 -824 -818 L -3330 -3254 -824 -824 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape110(ctx,ctrans,frame,ratio,time){
	var pathData="M -3254 -3342 -824 -757 L -3254 -3342 -820 -757 Q -3253 -3318 -774 -646 -3244 -3212 -729 -578 L -3237 -3144 -697 -527 Q -3228 -3085 -670 -475 -3220 -3018 -644 -462 -3187 -2914 -604 -443 -3147 -2791 -576 -518 -3128 -2734 -565 -552 -3110 -2730 -554 -606 -3099 -2728 -556 -628 -3089 -2736 -558 -654 L -3085 -2738 -559 -660 -3072 -2753 -576 -707 -3060 -2779 -604 -776 -3070 -2803 -623 -830 Q -3088 -2837 -649 -903 -3120 -2883 -659 -963 L -3124 -2903 -670 -987 Q -3135 -2955 -694 -1048 -3155 -3021 -714 -1094 L -3159 -3056 -730 -1117 -3159 -3060 -730 -1119 Q -3171 -3175 -774 -1117 -3182 -3255 -817 -1024 -3185 -3263 -829 -995 -3188 -3259 -841 -965 L -3190 -3258 -849 -948 Q -3199 -3259 -856 -924 -3208 -3275 -863 -904 L -3210 -3275 -864 -904 -3219 -3298 -863 -889 Q -3235 -3330 -858 -865 -3250 -3341 -854 -831 -3252 -3351 -839 -798 -3254 -3342 -824 -757";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3254 -3342 -824 -757 Q -3252 -3351 -839 -798 -3250 -3341 -854 -831 -3235 -3330 -858 -865 -3219 -3298 -863 -889 L -3210 -3275 -864 -904 -3208 -3275 -863 -904 Q -3199 -3259 -856 -924 -3190 -3258 -849 -948 L -3188 -3259 -841 -965 Q -3185 -3263 -829 -995 -3182 -3255 -817 -1024 -3171 -3175 -774 -1117 -3159 -3060 -730 -1119 L -3159 -3056 -730 -1117 -3155 -3021 -714 -1094 Q -3135 -2955 -694 -1048 -3124 -2903 -670 -987 L -3120 -2883 -659 -963 Q -3088 -2837 -649 -903 -3070 -2803 -623 -830 L -3060 -2779 -604 -776 -3072 -2753 -576 -707 -3085 -2738 -559 -660 -3089 -2736 -558 -654 Q -3099 -2728 -556 -628 -3110 -2730 -554 -606 -3128 -2734 -565 -552 -3147 -2791 -576 -518 -3187 -2914 -604 -443 -3220 -3018 -644 -462 -3228 -3085 -670 -475 -3237 -3144 -697 -527 L -3244 -3212 -729 -578 Q -3253 -3318 -774 -646 -3254 -3342 -820 -757 L -3254 -3342 -824 -757 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape111(ctx,ctrans,frame,ratio,time){
	var pathData="M -3342 -3240 -757 -889 L -3342 -3240 -755 -889 Q -3336 -3240 -727 -874 -3324 -3240 -702 -860 -3290 -3239 -628 -814 -3212 -3238 -578 -769 L -3162 -3235 -542 -739 -3144 -3224 -527 -727 -3134 -3221 -519 -723 -3089 -3205 -488 -694 Q -2958 -3149 -417 -629 -2791 -3086 -518 -575 -2727 -3060 -557 -554 -2730 -3035 -621 -534 L -2734 -3035 -646 -549 -2736 -3035 -654 -553 -2751 -3040 -700 -579 Q -2773 -3066 -767 -607 -2803 -3092 -830 -635 -2890 -3157 -1016 -720 -3060 -3160 -1119 -828 L -3128 -3160 -1108 -864 -3157 -3150 -1098 -879 -3183 -3140 -1085 -894 -3208 -3139 -1069 -909 Q -3232 -3136 -1046 -928 -3255 -3142 -1024 -945 L -3260 -3155 -973 -969 -3259 -3159 -965 -971 Q -3256 -3170 -945 -975 -3262 -3180 -927 -979 L -3275 -3196 -904 -973 -3275 -3198 -904 -972 Q -3334 -3226 -871 -953 -3344 -3220 -816 -919 L -3346 -3230 -786 -904 -3342 -3240 -757 -889";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3342 -3240 -757 -889 L -3346 -3230 -786 -904 -3344 -3220 -816 -919 Q -3334 -3226 -871 -953 -3275 -3198 -904 -972 L -3275 -3196 -904 -973 -3262 -3180 -927 -979 Q -3256 -3170 -945 -975 -3259 -3159 -965 -971 L -3260 -3155 -973 -969 -3255 -3142 -1024 -945 Q -3232 -3136 -1046 -928 -3208 -3139 -1069 -909 L -3183 -3140 -1085 -894 -3157 -3150 -1098 -879 -3128 -3160 -1108 -864 -3060 -3160 -1119 -828 Q -2890 -3157 -1016 -720 -2803 -3092 -830 -635 -2773 -3066 -767 -607 -2751 -3040 -700 -579 L -2736 -3035 -654 -553 -2734 -3035 -646 -549 -2730 -3035 -621 -534 Q -2727 -3060 -557 -554 -2791 -3086 -518 -575 -2958 -3149 -417 -629 -3089 -3205 -488 -694 L -3134 -3221 -519 -723 -3144 -3224 -527 -727 -3162 -3235 -542 -739 -3212 -3238 -578 -769 Q -3290 -3239 -628 -814 -3324 -3240 -702 -860 -3336 -3240 -727 -874 -3342 -3240 -755 -889 L -3342 -3240 -757 -889 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape112(ctx,ctrans,frame,ratio,time){
	var pathData="M -3240 -3326 -889 -892 L -3240 -3308 -860 -851 Q -3243 -3263 -799 -759 -3235 -3195 -739 -700 L -3221 -3173 -723 -683 -3205 -3134 -694 -657 Q -3165 -3062 -652 -616 -3125 -2970 -611 -604 L -3105 -2941 -593 -631 -3099 -2930 -587 -644 Q -3077 -2878 -568 -653 -3056 -2862 -550 -700 -3045 -2855 -542 -721 -3035 -2853 -534 -741 L -3035 -2852 -549 -764 Q -3038 -2852 -564 -788 -3040 -2860 -579 -811 L -3054 -2870 -592 -834 Q -3068 -2867 -607 -872 -3082 -2878 -622 -903 -3142 -2924 -694 -1034 -3156 -3025 -783 -1134 L -3158 -3044 -795 -1150 Q -3159 -3085 -830 -1189 -3160 -3142 -864 -1185 L -3156 -3150 -868 -1184 -3150 -3163 -879 -1176 -3140 -3184 -894 -1162 -3139 -3205 -909 -1148 Q -3134 -3241 -943 -1115 -3155 -3276 -969 -1083 L -3180 -3302 -979 -1052 -3189 -3309 -976 -1042 -3198 -3316 -972 -1031 Q -3226 -3343 -953 -989 -3220 -3338 -919 -940 L -3230 -3334 -904 -916 -3240 -3326 -889 -892";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3240 -3326 -889 -892 L -3230 -3334 -904 -916 -3220 -3338 -919 -940 Q -3226 -3343 -953 -989 -3198 -3316 -972 -1031 L -3189 -3309 -976 -1042 -3180 -3302 -979 -1052 -3155 -3276 -969 -1083 Q -3134 -3241 -943 -1115 -3139 -3205 -909 -1148 L -3140 -3184 -894 -1162 -3150 -3163 -879 -1176 -3156 -3150 -868 -1184 -3160 -3142 -864 -1185 Q -3159 -3085 -830 -1189 -3158 -3044 -795 -1150 L -3156 -3025 -783 -1134 Q -3142 -2924 -694 -1034 -3082 -2878 -622 -903 -3068 -2867 -607 -872 -3054 -2870 -592 -834 L -3040 -2860 -579 -811 Q -3038 -2852 -564 -788 -3035 -2852 -549 -764 L -3035 -2853 -534 -741 Q -3045 -2855 -542 -721 -3056 -2862 -550 -700 -3077 -2878 -568 -653 -3099 -2930 -587 -644 L -3105 -2941 -593 -631 -3125 -2970 -611 -604 Q -3165 -3062 -652 -616 -3205 -3134 -694 -657 L -3221 -3173 -723 -683 -3235 -3195 -739 -700 Q -3243 -3263 -799 -759 -3240 -3308 -860 -851 L -3240 -3326 -889 -892 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape113(ctx,ctrans,frame,ratio,time){
	var pathData="M -3326 -3315 -892 -1118 Q -3225 -3412 -638 -862 -2970 -3120 -604 -744 L -2941 -3104 -631 -715 -2930 -3095 -644 -699 Q -2878 -3008 -653 -678 -2862 -2920 -700 -674 -2837 -2902 -771 -687 -2870 -2885 -834 -700 -2867 -2877 -872 -707 -2878 -2870 -903 -714 -2924 -2849 -1034 -775 -3025 -2846 -1134 -834 -3035 -2845 -1142 -857 -3044 -2853 -1150 -873 -3088 -2956 -1192 -1075 -3150 -3150 -1184 -1204 -3244 -3190 -1130 -1204 -3309 -3230 -1042 -1204 -3359 -3291 -975 -1179 -3326 -3315 -892 -1118";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3326 -3315 -892 -1118 Q -3359 -3291 -975 -1179 -3309 -3230 -1042 -1204 -3244 -3190 -1130 -1204 -3150 -3150 -1184 -1204 -3088 -2956 -1192 -1075 -3044 -2853 -1150 -873 -3035 -2845 -1142 -857 -3025 -2846 -1134 -834 -2924 -2849 -1034 -775 -2878 -2870 -903 -714 -2867 -2877 -872 -707 -2870 -2885 -834 -700 -2837 -2902 -771 -687 -2862 -2920 -700 -674 -2878 -3008 -653 -678 -2930 -3095 -644 -699 L -2941 -3104 -631 -715 -2970 -3120 -604 -744 Q -3225 -3412 -638 -862 -3326 -3315 -892 -1118 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape114(ctx,ctrans,frame,ratio,time){
	var pathData="M -3315 -3301 -1118 -1099 L -3317 -3301 -1116 -1099 Q -3398 -3349 -896 -928 -3192 -3245 -779 -774 -3160 -3215 -760 -758 -3120 -3186 -744 -742 L -3104 -3162 -715 -735 -3095 -3148 -699 -732 -3073 -3130 -694 -729 -3053 -3113 -690 -717 Q -2994 -3059 -682 -688 -2936 -3015 -675 -724 L -2920 -3010 -674 -737 -2920 -3010 -674 -739 -2905 -3006 -686 -755 -2891 -3005 -696 -769 -2885 -2999 -700 -771 Q -2877 -2991 -707 -773 -2870 -2984 -714 -777 -2857 -2952 -753 -793 -2851 -2956 -790 -833 -2847 -2959 -812 -850 -2846 -2961 -834 -866 -2845 -2966 -857 -883 -2853 -2971 -873 -900 -2910 -3003 -984 -996 -2995 -3100 -1073 -1059 -3015 -3089 -1093 -1081 -3034 -3092 -1112 -1104 -3063 -3097 -1137 -1137 -3092 -3115 -1162 -1164 -3106 -3127 -1173 -1172 -3120 -3141 -1183 -1176 L -3150 -3171 -1204 -1184 -3184 -3200 -1204 -1189 -3186 -3200 -1204 -1187 -3230 -3237 -1204 -1181 -3238 -3245 -1200 -1179 Q -3292 -3288 -1175 -1148 -3315 -3301 -1118 -1099";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3315 -3301 -1118 -1099 Q -3292 -3288 -1175 -1148 -3238 -3245 -1200 -1179 L -3230 -3237 -1204 -1181 -3186 -3200 -1204 -1187 -3184 -3200 -1204 -1189 -3150 -3171 -1204 -1184 -3120 -3141 -1183 -1176 Q -3106 -3127 -1173 -1172 -3092 -3115 -1162 -1164 -3063 -3097 -1137 -1137 -3034 -3092 -1112 -1104 -3015 -3089 -1093 -1081 -2995 -3100 -1073 -1059 -2910 -3003 -984 -996 -2853 -2971 -873 -900 -2845 -2966 -857 -883 -2846 -2961 -834 -866 -2847 -2959 -812 -850 -2851 -2956 -790 -833 -2857 -2952 -753 -793 -2870 -2984 -714 -777 -2877 -2991 -707 -773 -2885 -2999 -700 -771 L -2891 -3005 -696 -769 -2905 -3006 -686 -755 -2920 -3010 -674 -739 -2920 -3010 -674 -737 -2936 -3015 -675 -724 Q -2994 -3059 -682 -688 -3053 -3113 -690 -717 L -3073 -3130 -694 -729 -3095 -3148 -699 -732 -3104 -3162 -715 -735 -3120 -3186 -744 -742 Q -3160 -3215 -760 -758 -3192 -3245 -779 -774 -3398 -3349 -896 -928 -3317 -3301 -1116 -1099 L -3315 -3301 -1118 -1099 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape115(ctx,ctrans,frame,ratio,time){
	var pathData="M -3301 -3380 -1099 -970 L -3301 -3380 -1099 -968 Q -3344 -3343 -946 -756 -3265 -3110 -806 -769 -3255 -3113 -790 -741 -3245 -3095 -774 -727 L -3241 -3090 -770 -723 Q -3190 -3010 -738 -670 -3130 -2940 -729 -701 L -3113 -2922 -717 -711 Q -3068 -2882 -718 -737 -3023 -2846 -719 -792 L -3015 -2839 -724 -804 Q -3012 -2835 -731 -814 -3010 -2836 -737 -823 L -3010 -2836 -739 -823 -3006 -2839 -755 -843 -3005 -2841 -769 -861 Q -2951 -2849 -782 -917 -2956 -2867 -833 -964 -2971 -2931 -976 -1129 -3100 -3120 -1059 -1185 -3089 -3148 -1081 -1192 -3092 -3175 -1104 -1199 -3096 -3208 -1131 -1204 -3109 -3240 -1154 -1209 L -3115 -3255 -1164 -1205 Q -3127 -3272 -1172 -1198 -3141 -3289 -1176 -1192 -3171 -3326 -1183 -1174 -3200 -3348 -1189 -1146 L -3200 -3350 -1187 -1144 Q -3223 -3367 -1183 -1122 -3245 -3376 -1179 -1093 -3288 -3392 -1148 -1041 -3301 -3380 -1099 -970";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3301 -3380 -1099 -970 Q -3288 -3392 -1148 -1041 -3245 -3376 -1179 -1093 -3223 -3367 -1183 -1122 -3200 -3350 -1187 -1144 L -3200 -3348 -1189 -1146 Q -3171 -3326 -1183 -1174 -3141 -3289 -1176 -1192 -3127 -3272 -1172 -1198 -3115 -3255 -1164 -1205 L -3109 -3240 -1154 -1209 Q -3096 -3208 -1131 -1204 -3092 -3175 -1104 -1199 -3089 -3148 -1081 -1192 -3100 -3120 -1059 -1185 -2971 -2931 -976 -1129 -2956 -2867 -833 -964 -2951 -2849 -782 -917 -3005 -2841 -769 -861 L -3006 -2839 -755 -843 -3010 -2836 -739 -823 -3010 -2836 -737 -823 Q -3012 -2835 -731 -814 -3015 -2839 -724 -804 L -3023 -2846 -719 -792 Q -3068 -2882 -718 -737 -3113 -2922 -717 -711 L -3130 -2940 -729 -701 Q -3190 -3010 -738 -670 -3241 -3090 -770 -723 L -3245 -3095 -774 -727 Q -3255 -3113 -790 -741 -3265 -3110 -806 -769 -3344 -3343 -946 -756 -3301 -3380 -1099 -968 L -3301 -3380 -1099 -970 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape116(ctx,ctrans,frame,ratio,time){
	var pathData="M -3380 -3295 -970 -904 Q -3374 -3282 -932 -889 -3361 -3276 -901 -872 -3303 -3241 -758 -777 -3110 -3176 -769 -737 -3113 -3162 -738 -730 -3090 -3149 -723 -723 -3022 -3114 -678 -716 -2961 -3080 -694 -709 -2899 -3041 -711 -742 -2846 -3049 -792 -787 -2835 -3051 -809 -795 -2836 -3052 -823 -803 L -2836 -3053 -825 -805 Q -2864 -3107 -1140 -965 -3180 -3220 -1199 -1059 L -3230 -3249 -1207 -1053 -3240 -3253 -1209 -1052 -3261 -3260 -1203 -1049 Q -3313 -3283 -1186 -1035 -3343 -3291 -1152 -1008 -3400 -3307 -1089 -957 -3380 -3295 -970 -904";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3380 -3295 -970 -904 Q -3400 -3307 -1089 -957 -3343 -3291 -1152 -1008 -3313 -3283 -1186 -1035 -3261 -3260 -1203 -1049 L -3240 -3253 -1209 -1052 -3230 -3249 -1207 -1053 -3180 -3220 -1199 -1059 Q -2864 -3107 -1140 -965 -2836 -3053 -825 -805 L -2836 -3052 -823 -803 Q -2835 -3051 -809 -795 -2846 -3049 -792 -787 -2899 -3041 -711 -742 -2961 -3080 -694 -709 -3022 -3114 -678 -716 -3090 -3149 -723 -723 -3113 -3162 -738 -730 -3110 -3176 -769 -737 -3303 -3241 -758 -777 -3361 -3276 -901 -872 -3374 -3282 -932 -889 -3380 -3295 -970 -904 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape117(ctx,ctrans,frame,ratio,time){
	var pathData="M -3295 -3329 -904 -1009 Q -3282 -3336 -889 -982 -3276 -3332 -872 -960 -3261 -3323 -832 -916 -3242 -3270 -800 -889 L -3236 -3268 -792 -875 -3230 -3265 -783 -859 -3222 -3249 -774 -846 Q -3170 -3167 -715 -789 -3088 -3090 -709 -729 L -3080 -3085 -709 -715 -3071 -3076 -717 -702 Q -3053 -3055 -736 -678 -3049 -3035 -759 -654 -3045 -3004 -780 -654 -3053 -2973 -805 -654 L -3055 -2970 -809 -654 Q -3085 -2898 -898 -761 -3134 -3002 -967 -867 -3172 -3057 -1019 -924 -3220 -3117 -1059 -969 L -3249 -3148 -1053 -991 -3260 -3166 -1049 -1003 Q -3283 -3198 -1035 -1022 -3291 -3229 -1008 -1040 L -3299 -3280 -965 -1064 -3299 -3281 -963 -1061 -3300 -3300 -949 -1054 Q -3297 -3323 -926 -1037 -3295 -3329 -904 -1009";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3295 -3329 -904 -1009 Q -3297 -3323 -926 -1037 -3300 -3300 -949 -1054 L -3299 -3281 -963 -1061 -3299 -3280 -965 -1064 -3291 -3229 -1008 -1040 Q -3283 -3198 -1035 -1022 -3260 -3166 -1049 -1003 L -3249 -3148 -1053 -991 -3220 -3117 -1059 -969 Q -3172 -3057 -1019 -924 -3134 -3002 -967 -867 -3085 -2898 -898 -761 -3055 -2970 -809 -654 L -3053 -2973 -805 -654 Q -3045 -3004 -780 -654 -3049 -3035 -759 -654 -3053 -3055 -736 -678 -3071 -3076 -717 -702 L -3080 -3085 -709 -715 -3088 -3090 -709 -729 Q -3170 -3167 -715 -789 -3222 -3249 -774 -846 L -3230 -3265 -783 -859 -3236 -3268 -792 -875 -3242 -3270 -800 -889 Q -3261 -3323 -832 -916 -3276 -3332 -872 -960 -3282 -3336 -889 -982 -3295 -3329 -904 -1009 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape118(ctx,ctrans,frame,ratio,time){
	var pathData="M -3329 -3335 -1009 -959 L -3329 -3335 -1009 -957 -3332 -3333 -990 -930 -3333 -3329 -979 -915 -3332 -3320 -967 -899 Q -3330 -3307 -958 -892 -3328 -3297 -949 -882 -3325 -3292 -943 -877 -3323 -3290 -937 -869 L -3317 -3290 -927 -854 -3310 -3288 -919 -840 -3302 -3285 -911 -824 -3270 -3248 -889 -788 -3268 -3235 -875 -774 -3265 -3225 -863 -764 -3265 -3225 -859 -764 -3249 -3211 -846 -749 Q -3167 -3110 -789 -652 -3090 -2977 -729 -623 -3085 -2961 -714 -619 -3076 -2945 -702 -616 L -3068 -2933 -692 -614 Q -3058 -2908 -680 -610 -3048 -2894 -668 -631 L -3035 -2881 -654 -653 Q -3002 -2857 -654 -692 -2970 -2844 -654 -730 -2898 -2794 -761 -884 -3002 -2944 -867 -996 L -3045 -3020 -910 -1044 -3055 -3029 -918 -1060 Q -3110 -3075 -967 -1154 -3170 -3180 -1005 -1159 L -3172 -3180 -1007 -1157 -3195 -3214 -1021 -1153 -3207 -3230 -1027 -1149 Q -3232 -3264 -1040 -1131 -3256 -3274 -1053 -1094 L -3280 -3284 -1064 -1060 -3281 -3286 -1061 -1056 -3300 -3297 -1054 -1030 Q -3323 -3313 -1037 -993 -3329 -3335 -1009 -959";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3329 -3335 -1009 -959 Q -3323 -3313 -1037 -993 -3300 -3297 -1054 -1030 L -3281 -3286 -1061 -1056 -3280 -3284 -1064 -1060 -3256 -3274 -1053 -1094 Q -3232 -3264 -1040 -1131 -3207 -3230 -1027 -1149 L -3195 -3214 -1021 -1153 -3172 -3180 -1007 -1157 -3170 -3180 -1005 -1159 Q -3110 -3075 -967 -1154 -3055 -3029 -918 -1060 L -3045 -3020 -910 -1044 -3002 -2944 -867 -996 Q -2898 -2794 -761 -884 -2970 -2844 -654 -730 -3002 -2857 -654 -692 -3035 -2881 -654 -653 L -3048 -2894 -668 -631 Q -3058 -2908 -680 -610 -3068 -2933 -692 -614 L -3076 -2945 -702 -616 Q -3085 -2961 -714 -619 -3090 -2977 -729 -623 -3167 -3110 -789 -652 -3249 -3211 -846 -749 L -3265 -3225 -859 -764 -3265 -3225 -863 -764 -3268 -3235 -875 -774 -3270 -3248 -889 -788 -3302 -3285 -911 -824 -3310 -3288 -919 -840 -3317 -3290 -927 -854 -3323 -3290 -937 -869 Q -3325 -3292 -943 -877 -3328 -3297 -949 -882 -3330 -3307 -958 -892 -3332 -3320 -967 -899 L -3333 -3329 -979 -915 -3332 -3333 -990 -930 -3329 -3335 -1009 -957 -3329 -3335 -1009 -959 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape119(ctx,ctrans,frame,ratio,time){
	var pathData="M -3335 -3230 -959 -829 L -3335 -3230 -955 -829 -3333 -3214 -930 -817 -3332 -3213 -926 -817 -3329 -3209 -915 -815 -3320 -3199 -899 -808 Q -3307 -3192 -892 -802 -3297 -3186 -882 -797 -3292 -3182 -877 -793 -3290 -3179 -869 -790 L -3290 -3173 -854 -784 -3288 -3168 -840 -778 -3285 -3162 -824 -769 -3265 -3155 -804 -754 -3249 -3155 -788 -739 -3233 -3155 -772 -724 -3225 -3146 -764 -715 -3218 -3140 -756 -709 -3168 -3092 -712 -695 Q -3136 -3071 -687 -686 -3101 -3055 -669 -669 -3072 -3053 -654 -647 -3041 -3052 -642 -625 L -3000 -3045 -628 -594 -2961 -3063 -619 -569 -2933 -3074 -614 -549 -2915 -3080 -614 -539 Q -2902 -3074 -618 -530 -2894 -3068 -631 -522 L -2888 -3060 -641 -515 Q -2842 -3019 -713 -482 -2834 -2975 -775 -495 -2827 -2962 -824 -523 -2843 -2966 -868 -554 -2873 -2976 -956 -629 -2990 -2985 -1026 -704 L -3006 -2996 -1036 -718 -3020 -3000 -1044 -722 -3029 -3011 -1060 -732 Q -3075 -3059 -1154 -773 -3180 -3107 -1159 -814 L -3180 -3107 -1157 -814 -3214 -3127 -1153 -829 -3230 -3137 -1149 -835 Q -3264 -3158 -1131 -849 -3274 -3178 -1094 -863 L -3294 -3210 -1037 -884 -3298 -3211 -1028 -880 -3311 -3222 -999 -858 -3335 -3230 -959 -829";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3335 -3230 -959 -829 L -3311 -3222 -999 -858 -3298 -3211 -1028 -880 -3294 -3210 -1037 -884 -3274 -3178 -1094 -863 Q -3264 -3158 -1131 -849 -3230 -3137 -1149 -835 L -3214 -3127 -1153 -829 -3180 -3107 -1157 -814 -3180 -3107 -1159 -814 Q -3075 -3059 -1154 -773 -3029 -3011 -1060 -732 L -3020 -3000 -1044 -722 -3006 -2996 -1036 -718 -2990 -2985 -1026 -704 Q -2873 -2976 -956 -629 -2843 -2966 -868 -554 -2827 -2962 -824 -523 -2834 -2975 -775 -495 -2842 -3019 -713 -482 -2888 -3060 -641 -515 L -2894 -3068 -631 -522 Q -2902 -3074 -618 -530 -2915 -3080 -614 -539 L -2933 -3074 -614 -549 -2961 -3063 -619 -569 -3000 -3045 -628 -594 -3041 -3052 -642 -625 Q -3072 -3053 -654 -647 -3101 -3055 -669 -669 -3136 -3071 -687 -686 -3168 -3092 -712 -695 L -3218 -3140 -756 -709 -3225 -3146 -764 -715 -3233 -3155 -772 -724 -3249 -3155 -788 -739 -3265 -3155 -804 -754 -3285 -3162 -824 -769 -3288 -3168 -840 -778 -3290 -3173 -854 -784 -3290 -3179 -869 -790 Q -3292 -3182 -877 -793 -3297 -3186 -882 -797 -3307 -3192 -892 -802 -3320 -3199 -899 -808 L -3329 -3209 -915 -815 -3332 -3213 -926 -817 -3333 -3214 -930 -817 -3335 -3230 -955 -829 -3335 -3230 -959 -829 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape120(ctx,ctrans,frame,ratio,time){
	var pathData="M -3230 -3315 -829 -804 L -3213 -3302 -817 -789 -3213 -3302 -817 -788 -3186 -3290 -798 -759 Q -3166 -3269 -780 -745 -3155 -3249 -754 -731 L -3155 -3245 -747 -729 -3155 -3240 -739 -720 -3155 -3238 -735 -716 -3155 -3232 -724 -708 -3140 -3222 -709 -693 -3124 -3215 -705 -684 -3094 -3209 -695 -655 -3092 -3209 -695 -651 -3080 -3205 -689 -639 Q -3066 -3193 -681 -625 -3055 -3182 -669 -612 L -3052 -3157 -625 -581 -3052 -3155 -621 -579 -3045 -3131 -596 -580 -3045 -3127 -594 -581 -3063 -3103 -569 -580 -3072 -3090 -551 -574 -3078 -3080 -541 -564 -3080 -3080 -539 -564 Q -3072 -3070 -524 -554 -3060 -3060 -515 -544 L -3046 -3050 -506 -534 Q -3031 -3035 -496 -533 -3015 -3020 -493 -532 L -3003 -3010 -491 -534 -2993 -3016 -491 -542 -2975 -3032 -495 -552 Q -2962 -3055 -523 -568 -2966 -3077 -554 -583 L -2977 -3135 -630 -629 -2979 -3137 -646 -644 -2983 -3150 -680 -674 -2985 -3150 -696 -689 -2985 -3151 -704 -695 -2996 -3153 -718 -707 -3000 -3155 -722 -719 -3018 -3166 -739 -736 Q -3069 -3194 -780 -792 -3119 -3245 -821 -824 L -3131 -3246 -830 -839 -3143 -3250 -840 -854 -3159 -3265 -851 -869 -3184 -3290 -868 -874 -3200 -3302 -878 -863 -3210 -3308 -884 -853 -3211 -3310 -880 -849 -3222 -3315 -858 -830 -3230 -3315 -829 -804";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3230 -3315 -829 -804 L -3222 -3315 -858 -830 -3211 -3310 -880 -849 -3210 -3308 -884 -853 -3200 -3302 -878 -863 -3184 -3290 -868 -874 -3159 -3265 -851 -869 -3143 -3250 -840 -854 -3131 -3246 -830 -839 -3119 -3245 -821 -824 Q -3069 -3194 -780 -792 -3018 -3166 -739 -736 L -3000 -3155 -722 -719 -2996 -3153 -718 -707 -2985 -3151 -704 -695 -2985 -3150 -696 -689 -2983 -3150 -680 -674 -2979 -3137 -646 -644 -2977 -3135 -630 -629 -2966 -3077 -554 -583 Q -2962 -3055 -523 -568 -2975 -3032 -495 -552 L -2993 -3016 -491 -542 -3003 -3010 -491 -534 -3015 -3020 -493 -532 Q -3031 -3035 -496 -533 -3046 -3050 -506 -534 L -3060 -3060 -515 -544 Q -3072 -3070 -524 -554 -3080 -3080 -539 -564 L -3078 -3080 -541 -564 -3072 -3090 -551 -574 -3063 -3103 -569 -580 -3045 -3127 -594 -581 -3045 -3131 -596 -580 -3052 -3155 -621 -579 -3052 -3157 -625 -581 -3055 -3182 -669 -612 Q -3066 -3193 -681 -625 -3080 -3205 -689 -639 L -3092 -3209 -695 -651 -3094 -3209 -695 -655 -3124 -3215 -705 -684 -3140 -3222 -709 -693 -3155 -3232 -724 -708 -3155 -3238 -735 -716 -3155 -3240 -739 -720 -3155 -3245 -747 -729 -3155 -3249 -754 -731 Q -3166 -3269 -780 -745 -3186 -3290 -798 -759 L -3213 -3302 -817 -788 -3213 -3302 -817 -789 -3230 -3315 -829 -804 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape121(ctx,ctrans,frame,ratio,time){
	var pathData="M -3315 -3410 -804 -919 L -3314 -3410 -803 -919 -3302 -3409 -788 -895 -3295 -3408 -772 -875 -3290 -3406 -759 -856 -3286 -3405 -755 -844 -3273 -3389 -747 -831 -3245 -3347 -729 -802 -3238 -3334 -716 -794 -3230 -3320 -704 -784 -3215 -3314 -684 -747 -3211 -3303 -663 -722 -3209 -3296 -655 -708 -3205 -3294 -639 -687 -3199 -3295 -633 -679 Q -3177 -3280 -606 -625 -3155 -3256 -579 -589 L -3131 -3239 -580 -565 Q -3110 -3219 -587 -543 -3090 -3195 -574 -530 L -3080 -3183 -564 -525 Q -3065 -3157 -549 -514 -3050 -3127 -534 -513 L -3020 -3088 -532 -515 -3010 -3072 -534 -518 -3016 -3060 -542 -520 -3028 -3045 -550 -524 Q -3038 -3037 -557 -539 -3048 -3032 -564 -555 L -3058 -3030 -570 -569 -3064 -3041 -574 -583 -3135 -3132 -629 -653 -3135 -3140 -636 -659 -3137 -3142 -644 -669 -3150 -3147 -674 -710 -3150 -3151 -689 -730 -3153 -3156 -707 -754 -3155 -3158 -719 -760 -3166 -3165 -736 -785 Q -3194 -3192 -792 -869 -3245 -3251 -824 -916 L -3246 -3267 -839 -928 -3250 -3284 -854 -939 -3265 -3303 -869 -949 -3290 -3335 -874 -961 -3302 -3355 -863 -967 -3306 -3365 -857 -969 -3311 -3374 -847 -963 Q -3317 -3388 -832 -948 -3316 -3402 -815 -933 L -3315 -3410 -804 -919";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3315 -3410 -804 -919 L -3316 -3402 -815 -933 Q -3317 -3388 -832 -948 -3311 -3374 -847 -963 L -3306 -3365 -857 -969 -3302 -3355 -863 -967 -3290 -3335 -874 -961 -3265 -3303 -869 -949 -3250 -3284 -854 -939 -3246 -3267 -839 -928 -3245 -3251 -824 -916 Q -3194 -3192 -792 -869 -3166 -3165 -736 -785 L -3155 -3158 -719 -760 -3153 -3156 -707 -754 -3150 -3151 -689 -730 -3150 -3147 -674 -710 -3137 -3142 -644 -669 -3135 -3140 -636 -659 -3135 -3132 -629 -653 -3064 -3041 -574 -583 -3058 -3030 -570 -569 -3048 -3032 -564 -555 Q -3038 -3037 -557 -539 -3028 -3045 -550 -524 L -3016 -3060 -542 -520 -3010 -3072 -534 -518 -3020 -3088 -532 -515 -3050 -3127 -534 -513 Q -3065 -3157 -549 -514 -3080 -3183 -564 -525 L -3090 -3195 -574 -530 Q -3110 -3219 -587 -543 -3131 -3239 -580 -565 L -3155 -3256 -579 -589 Q -3177 -3280 -606 -625 -3199 -3295 -633 -679 L -3205 -3294 -639 -687 -3209 -3296 -655 -708 -3211 -3303 -663 -722 -3215 -3314 -684 -747 -3230 -3320 -704 -784 -3238 -3334 -716 -794 -3245 -3347 -729 -802 -3273 -3389 -747 -831 -3286 -3405 -755 -844 -3290 -3406 -759 -856 -3295 -3408 -772 -875 -3302 -3409 -788 -895 -3314 -3410 -803 -919 -3315 -3410 -804 -919 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape122(ctx,ctrans,frame,ratio,time){
	var pathData="M -3410 -3435 -919 -1014 L -3408 -3430 -875 -964 -3407 -3428 -867 -956 -3405 -3420 -844 -927 -3389 -3415 -831 -910 Q -3354 -3401 -807 -868 -3320 -3379 -784 -833 -3320 -3359 -751 -807 -3303 -3340 -722 -782 -3291 -3324 -703 -767 -3295 -3309 -679 -753 -3279 -3270 -622 -721 -3254 -3220 -585 -699 -3236 -3201 -559 -678 -3213 -3183 -543 -657 -3176 -3153 -516 -614 -3128 -3110 -513 -584 L -3075 -3050 -517 -584 -3045 -3021 -524 -602 Q -3038 -3010 -537 -613 -3034 -3005 -551 -629 L -3032 -3005 -555 -631 -3030 -3002 -569 -647 -3041 -3001 -583 -661 Q -3089 -2997 -620 -729 -3136 -3036 -657 -787 L -3140 -3038 -659 -791 -3152 -3083 -740 -864 -3156 -3091 -754 -876 Q -3199 -3191 -932 -1043 -3365 -3372 -969 -1054 L -3368 -3380 -966 -1054 -3370 -3380 -966 -1052 -3374 -3388 -963 -1050 -3391 -3415 -945 -1044 -3402 -3428 -933 -1028 -3402 -3428 -933 -1028 -3410 -3435 -919 -1014";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3410 -3435 -919 -1014 L -3402 -3428 -933 -1028 -3402 -3428 -933 -1028 -3391 -3415 -945 -1044 -3374 -3388 -963 -1050 -3370 -3380 -966 -1052 -3368 -3380 -966 -1054 -3365 -3372 -969 -1054 Q -3199 -3191 -932 -1043 -3156 -3091 -754 -876 L -3152 -3083 -740 -864 -3140 -3038 -659 -791 -3136 -3036 -657 -787 Q -3089 -2997 -620 -729 -3041 -3001 -583 -661 L -3030 -3002 -569 -647 -3032 -3005 -555 -631 -3034 -3005 -551 -629 Q -3038 -3010 -537 -613 -3045 -3021 -524 -602 L -3075 -3050 -517 -584 -3128 -3110 -513 -584 Q -3176 -3153 -516 -614 -3213 -3183 -543 -657 -3236 -3201 -559 -678 -3254 -3220 -585 -699 -3279 -3270 -622 -721 -3295 -3309 -679 -753 -3291 -3324 -703 -767 -3303 -3340 -722 -782 -3320 -3359 -751 -807 -3320 -3379 -784 -833 -3354 -3401 -807 -868 -3389 -3415 -831 -910 L -3405 -3420 -844 -927 -3407 -3428 -867 -956 -3408 -3430 -875 -964 -3410 -3435 -919 -1014 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape123(ctx,ctrans,frame,ratio,time){
	var pathData="M -3435 -3365 -1014 -899 L -3435 -3365 -1012 -899 Q -3435 -3363 -983 -879 -3428 -3361 -956 -859 -3417 -3357 -908 -826 -3398 -3353 -868 -794 -3379 -3350 -830 -764 -3353 -3350 -798 -734 -3322 -3323 -761 -707 -3281 -3303 -733 -676 L -3220 -3270 -699 -633 -3183 -3236 -657 -603 -3177 -3230 -648 -599 Q -3148 -3197 -611 -599 -3110 -3164 -584 -599 L -3062 -3130 -584 -599 -3050 -3122 -584 -606 Q -3015 -3103 -597 -623 -3005 -3095 -629 -644 -2997 -3085 -669 -670 -3003 -3089 -706 -701 -3010 -3092 -749 -731 -3036 -3094 -787 -760 L -3046 -3095 -802 -774 -3058 -3103 -822 -790 -3083 -3118 -864 -822 Q -3178 -3181 -1033 -937 -3351 -3320 -1052 -944 L -3368 -3329 -1054 -939 -3380 -3331 -1054 -937 -3380 -3331 -1052 -937 -3415 -3351 -1044 -918 -3424 -3357 -1033 -912 -3428 -3359 -1028 -909 -3435 -3365 -1014 -899";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3435 -3365 -1014 -899 L -3428 -3359 -1028 -909 -3424 -3357 -1033 -912 -3415 -3351 -1044 -918 -3380 -3331 -1052 -937 -3380 -3331 -1054 -937 -3368 -3329 -1054 -939 -3351 -3320 -1052 -944 Q -3178 -3181 -1033 -937 -3083 -3118 -864 -822 L -3058 -3103 -822 -790 -3046 -3095 -802 -774 -3036 -3094 -787 -760 Q -3010 -3092 -749 -731 -3003 -3089 -706 -701 -2997 -3085 -669 -670 -3005 -3095 -629 -644 -3015 -3103 -597 -623 -3050 -3122 -584 -606 L -3062 -3130 -584 -599 -3110 -3164 -584 -599 Q -3148 -3197 -611 -599 -3177 -3230 -648 -599 L -3183 -3236 -657 -603 -3220 -3270 -699 -633 -3281 -3303 -733 -676 Q -3322 -3323 -761 -707 -3353 -3350 -798 -734 -3379 -3350 -830 -764 -3398 -3353 -868 -794 -3417 -3357 -908 -826 -3428 -3361 -956 -859 -3435 -3363 -983 -879 -3435 -3365 -1012 -899 L -3435 -3365 -1014 -899 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function shape124(ctx,ctrans,frame,ratio,time){
	var pathData="M -3350 -734 Q -3350 -764 -3353 -794 L -3365 -899 -3357 -912 -3329 -939 -3320 -944 Q -3163 -936 -3103 -790 L -3095 -774 -3089 -701 Q -3081 -639 -3130 -599 L -3230 -599 Q -3273 -631 -3303 -676 -3323 -707 -3350 -734";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite125(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 54;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("morphshape107",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("morphshape107",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 2:
			place("morphshape107",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 3:
			place("morphshape108",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 4:
			place("morphshape108",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 5:
			place("morphshape108",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 6:
			place("morphshape109",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 7:
			place("morphshape109",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,16384,time);
			break;
		case 8:
			place("morphshape109",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,32768,time);
			break;
		case 9:
			place("morphshape109",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,49152,time);
			break;
		case 10:
			place("morphshape110",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 11:
			place("morphshape110",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,16384,time);
			break;
		case 12:
			place("morphshape110",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,32768,time);
			break;
		case 13:
			place("morphshape110",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,49152,time);
			break;
		case 14:
			place("morphshape111",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 15:
			place("morphshape111",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,16384,time);
			break;
		case 16:
			place("morphshape111",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,32768,time);
			break;
		case 17:
			place("morphshape111",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,49152,time);
			break;
		case 18:
			place("morphshape112",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 19:
			place("morphshape112",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 20:
			place("morphshape112",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 21:
			place("morphshape113",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 22:
			place("morphshape113",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 23:
			place("morphshape113",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 24:
			place("morphshape114",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 25:
			place("morphshape114",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,32768,time);
			break;
		case 26:
			place("morphshape115",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 27:
			place("morphshape115",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 28:
			place("morphshape115",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 29:
			place("morphshape116",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 30:
			place("morphshape116",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 31:
			place("morphshape116",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 32:
			place("morphshape117",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 33:
			place("morphshape117",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 34:
			place("morphshape117",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 35:
			place("morphshape118",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 36:
			place("morphshape118",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 37:
			place("morphshape118",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 38:
			place("morphshape119",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 39:
			place("morphshape119",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,16384,time);
			break;
		case 40:
			place("morphshape119",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,32768,time);
			break;
		case 41:
			place("morphshape119",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,49152,time);
			break;
		case 42:
			place("morphshape120",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 43:
			place("morphshape120",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,32768,time);
			break;
		case 44:
			place("morphshape121",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 45:
			place("morphshape121",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 46:
			place("morphshape121",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 47:
			place("morphshape122",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 48:
			place("morphshape122",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 49:
			place("morphshape122",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 50:
			place("morphshape123",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 51:
			place("morphshape123",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 52:
			place("morphshape123",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 53:
			place("shape124",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function morphshape126(ctx,ctrans,frame,ratio,time){
	var pathData="M -3322 -3417 -1081 -1027 L -3322 -3417 -1079 -1027 Q -3473 -3455 -617 -597 -3162 -3150 -351 -378 -2927 -2843 -180 -184 -2493 -2515 -225 -269 -2419 -2446 -235 -287 -2346 -2382 -245 -317 -1922 -2142 -319 -431 -1826 -1968 -578 -719 -1790 -1909 -675 -818 -1800 -1877 -797 -915 -1824 -1792 -1104 -1175 -1917 -1909 -1347 -1422 -1961 -1962 -1462 -1534 -2020 -2033 -1562 -1607 -2136 -2178 -1759 -1756 -2337 -2398 -1844 -1747 -2457 -2551 -1894 -1734 -2607 -2659 -1904 -1701 -2705 -2759 -1900 -1671 -2802 -2821 -1896 -1623 -2989 -2926 -1864 -1543 -3063 -3088 -1734 -1514 L -3098 -3163 -1667 -1504 Q -3195 -3377 -1471 -1484 -3322 -3417 -1081 -1027";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(108+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3322 -3417 -1081 -1027 Q -3195 -3377 -1471 -1484 -3098 -3163 -1667 -1504 L -3063 -3088 -1734 -1514 Q -2989 -2926 -1864 -1543 -2802 -2821 -1896 -1623 -2705 -2759 -1900 -1671 -2607 -2659 -1904 -1701 -2457 -2551 -1894 -1734 -2337 -2398 -1844 -1747 -2136 -2178 -1759 -1756 -2020 -2033 -1562 -1607 -1961 -1962 -1462 -1534 -1917 -1909 -1347 -1422 -1824 -1792 -1104 -1175 -1800 -1877 -797 -915 -1790 -1909 -675 -818 -1826 -1968 -578 -719 -1922 -2142 -319 -431 -2346 -2382 -245 -317 -2419 -2446 -235 -287 -2493 -2515 -225 -269 -2927 -2843 -180 -184 -3162 -3150 -351 -378 -3473 -3455 -617 -597 -3322 -3417 -1079 -1027 M -3322 -3417 -1081 -1027 Q -3195 -3377 -1471 -1484 -3098 -3163 -1667 -1504 L -3063 -3088 -1734 -1514 Q -2989 -2926 -1864 -1543 -2802 -2821 -1896 -1623 -2705 -2759 -1900 -1671 -2607 -2659 -1904 -1701 -2457 -2551 -1894 -1734 -2337 -2398 -1844 -1747 -2136 -2178 -1759 -1756 -2020 -2033 -1562 -1607 -1961 -1962 -1462 -1534 -1917 -1909 -1347 -1422 -1824 -1792 -1104 -1175 -1800 -1877 -797 -915 -1790 -1909 -675 -818 -1826 -1968 -578 -719 -1922 -2142 -319 -431 -2346 -2382 -245 -317 -2419 -2446 -235 -287 -2493 -2515 -225 -269 -2927 -2843 -180 -184 -3162 -3150 -351 -378 -3473 -3455 -617 -597 -3322 -3417 -1079 -1027 L -3322 -3417 -1081 -1027 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(102+ratio*(0)/65535))/255)]));
	ctx.lineWidth=1.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape127(ctx,ctrans,frame,ratio,time){
	var pathData="M -3417 -3483 -1027 -1253 Q -3457 -3571 -571 -657 -3150 -3134 -378 -567 -2843 -2698 -184 -478 -2515 -2478 -269 -505 -2188 -2258 -354 -532 -1968 -2029 -719 -891 -1749 -1801 -1084 -1251 -1909 -1951 -1422 -1446 -2070 -2101 -1761 -1642 -2398 -2367 -1747 -1731 -2693 -2633 -1722 -1821 -2821 -2741 -1623 -1798 -2949 -2932 -1525 -1805 -3163 -3122 -1504 -1812 -3377 -3395 -1484 -1849 -3417 -3483 -1027 -1253";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(108+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3417 -3483 -1027 -1253 Q -3377 -3395 -1484 -1849 -3163 -3122 -1504 -1812 -2949 -2932 -1525 -1805 -2821 -2741 -1623 -1798 -2693 -2633 -1722 -1821 -2398 -2367 -1747 -1731 -2070 -2101 -1761 -1642 -1909 -1951 -1422 -1446 -1749 -1801 -1084 -1251 -1968 -2029 -719 -891 -2188 -2258 -354 -532 -2515 -2478 -269 -505 -2843 -2698 -184 -478 -3150 -3134 -378 -567 -3457 -3571 -571 -657 -3417 -3483 -1027 -1253 -3377 -3395 -1484 -1849 -3163 -3122 -1504 -1812 -2949 -2932 -1525 -1805 -2821 -2741 -1623 -1798 -2693 -2633 -1722 -1821 -2398 -2367 -1747 -1731 -2070 -2101 -1761 -1642 -1909 -1951 -1422 -1446 -1749 -1801 -1084 -1251 -1968 -2029 -719 -891 -2188 -2258 -354 -532 -2515 -2478 -269 -505 -2843 -2698 -184 -478 -3150 -3134 -378 -567 -3457 -3571 -571 -657 -3417 -3483 -1027 -1253 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(102+ratio*(0)/65535))/255)]));
	ctx.lineWidth=1.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape128(ctx,ctrans,frame,ratio,time){
	var pathData="M -3483 -3465 -1253 -976 Q -3571 -3518 -657 -494 -3134 -2947 -567 -497 -2698 -2377 -478 -500 -2478 -2251 -505 -569 -2258 -2125 -532 -638 -2029 -1979 -891 -764 -1801 -1835 -1251 -889 -1951 -1893 -1446 -1276 -2101 -1952 -1642 -1664 -2367 -2116 -1731 -1792 -2633 -2281 -1821 -1922 -2741 -2696 -1798 -1814 -2932 -3112 -1805 -1706 -3122 -3262 -1812 -1582 -3395 -3412 -1849 -1459 -3483 -3465 -1253 -976";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(108+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3483 -3465 -1253 -976 Q -3395 -3412 -1849 -1459 -3122 -3262 -1812 -1582 -2932 -3112 -1805 -1706 -2741 -2696 -1798 -1814 -2633 -2281 -1821 -1922 -2367 -2116 -1731 -1792 -2101 -1952 -1642 -1664 -1951 -1893 -1446 -1276 -1801 -1835 -1251 -889 -2029 -1979 -891 -764 -2258 -2125 -532 -638 -2478 -2251 -505 -569 -2698 -2377 -478 -500 -3134 -2947 -567 -497 -3571 -3518 -657 -494 -3483 -3465 -1253 -976 -3395 -3412 -1849 -1459 -3122 -3262 -1812 -1582 -2932 -3112 -1805 -1706 -2741 -2696 -1798 -1814 -2633 -2281 -1821 -1922 -2367 -2116 -1731 -1792 -2101 -1952 -1642 -1664 -1951 -1893 -1446 -1276 -1801 -1835 -1251 -889 -2029 -1979 -891 -764 -2258 -2125 -532 -638 -2478 -2251 -505 -569 -2698 -2377 -478 -500 -3134 -2947 -567 -497 -3571 -3518 -657 -494 -3483 -3465 -1253 -976 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(102+ratio*(0)/65535))/255)]));
	ctx.lineWidth=1.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape129(ctx,ctrans,frame,ratio,time){
	var pathData="M -3465 -3381 -976 -1152 Q -3518 -3457 -494 -572 -2947 -3150 -497 -378 -2377 -2843 -500 -184 -2251 -2515 -569 -269 -2125 -2188 -638 -354 -1979 -1968 -764 -719 -1835 -1749 -889 -1084 -1893 -1909 -1276 -1422 -1952 -2070 -1664 -1761 -2116 -2625 -1792 -1739 -2281 -2693 -1922 -1722 -2696 -2796 -1814 -1708 -3112 -2900 -1706 -1695 -3262 -3103 -1582 -1714 -3412 -3306 -1459 -1734 -3465 -3381 -976 -1152";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(108+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3465 -3381 -976 -1152 Q -3412 -3306 -1459 -1734 -3262 -3103 -1582 -1714 -3112 -2900 -1706 -1695 -2696 -2796 -1814 -1708 -2281 -2693 -1922 -1722 -2116 -2625 -1792 -1739 -1952 -2070 -1664 -1761 -1893 -1909 -1276 -1422 -1835 -1749 -889 -1084 -1979 -1968 -764 -719 -2125 -2188 -638 -354 -2251 -2515 -569 -269 -2377 -2843 -500 -184 -2947 -3150 -497 -378 -3518 -3457 -494 -572 -3465 -3381 -976 -1152 -3412 -3306 -1459 -1734 -3262 -3103 -1582 -1714 -3112 -2900 -1706 -1695 -2696 -2796 -1814 -1708 -2281 -2693 -1922 -1722 -2116 -2625 -1792 -1739 -1952 -2070 -1664 -1761 -1893 -1909 -1276 -1422 -1835 -1749 -889 -1084 -1979 -1968 -764 -719 -2125 -2188 -638 -354 -2251 -2515 -569 -269 -2377 -2843 -500 -184 -2947 -3150 -497 -378 -3518 -3457 -494 -572 -3465 -3381 -976 -1152 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(102+ratio*(0)/65535))/255)]));
	ctx.lineWidth=1.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape130(ctx,ctrans,frame,ratio,time){
	var pathData="M -3381 -3522 -1152 -875 Q -3457 -3550 -572 -578 -3150 -3140 -378 -460 -2843 -2730 -184 -342 -2515 -2333 -269 -430 -2188 -1936 -354 -518 -1968 -1858 -719 -910 -1749 -1781 -1084 -1303 -1909 -1913 -1422 -1618 -2070 -2046 -1761 -1933 -2625 -2325 -1739 -1799 -2693 -2650 -1722 -1625 -2796 -2802 -1708 -1700 -2900 -2955 -1695 -1776 -3103 -3225 -1714 -1474 -3306 -3495 -1734 -1173 -3381 -3522 -1152 -875";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(108+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -3381 -3522 -1152 -875 Q -3306 -3495 -1734 -1173 -3103 -3225 -1714 -1474 -2900 -2955 -1695 -1776 -2796 -2802 -1708 -1700 -2693 -2650 -1722 -1625 -2625 -2325 -1739 -1799 -2070 -2046 -1761 -1933 -1909 -1913 -1422 -1618 -1749 -1781 -1084 -1303 -1968 -1858 -719 -910 -2188 -1936 -354 -518 -2515 -2333 -269 -430 -2843 -2730 -184 -342 -3150 -3140 -378 -460 -3457 -3550 -572 -578 -3381 -3522 -1152 -875 -3306 -3495 -1734 -1173 -3103 -3225 -1714 -1474 -2900 -2955 -1695 -1776 -2796 -2802 -1708 -1700 -2693 -2650 -1722 -1625 -2625 -2325 -1739 -1799 -2070 -2046 -1761 -1933 -1909 -1913 -1422 -1618 -1749 -1781 -1084 -1303 -1968 -1858 -719 -910 -2188 -1936 -354 -518 -2515 -2333 -269 -430 -2843 -2730 -184 -342 -3150 -3140 -378 -460 -3457 -3550 -572 -578 -3381 -3522 -1152 -875 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(102+ratio*(0)/65535))/255)]));
	ctx.lineWidth=1.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function shape131(ctx,ctrans,frame,ratio,time){
	var pathData="M -1913 -1618 Q -1781 -1303 -1858 -910 -1936 -518 -2333 -430 -2730 -342 -3140 -460 -3550 -578 -3522 -875 -3495 -1173 -3225 -1474 -2955 -1776 -2802 -1700 -2650 -1625 -2325 -1799 -2046 -1933 -1913 -1618";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,0.42352942]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -1913 -1618 Q -1781 -1303 -1858 -910 -1936 -518 -2333 -430 -2730 -342 -3140 -460 -3550 -578 -3522 -875 -3495 -1173 -3225 -1474 -2955 -1776 -2802 -1700 -2650 -1625 -2325 -1799 -2046 -1933 -1913 -1618 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([0,0,0,0.4]));
	ctx.lineWidth=1.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function sprite132(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 54;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("morphshape106",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(0+time)%54,0,time);
			break;
		case 1:
			place("morphshape106",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,9362,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(1+time)%54,0,time);
			break;
		case 2:
			place("morphshape106",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,18725,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(2+time)%54,0,time);
			break;
		case 3:
			place("morphshape106",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,28087,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(3+time)%54,0,time);
			break;
		case 4:
			place("morphshape106",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,37449,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(4+time)%54,0,time);
			break;
		case 5:
			place("morphshape106",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,46811,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(5+time)%54,0,time);
			break;
		case 6:
			place("morphshape106",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,56174,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(6+time)%54,0,time);
			break;
		case 7:
			place("morphshape126",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(7+time)%54,0,time);
			break;
		case 8:
			place("morphshape126",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,9362,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(8+time)%54,0,time);
			break;
		case 9:
			place("morphshape126",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,18725,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(9+time)%54,0,time);
			break;
		case 10:
			place("morphshape126",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,28087,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(10+time)%54,0,time);
			break;
		case 11:
			place("morphshape126",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,37449,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(11+time)%54,0,time);
			break;
		case 12:
			place("morphshape126",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,46811,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(12+time)%54,0,time);
			break;
		case 13:
			place("morphshape126",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,56174,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(13+time)%54,0,time);
			break;
		case 14:
			place("morphshape127",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(14+time)%54,0,time);
			break;
		case 15:
			place("morphshape127",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,8192,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(15+time)%54,0,time);
			break;
		case 16:
			place("morphshape127",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,16384,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(16+time)%54,0,time);
			break;
		case 17:
			place("morphshape127",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,24576,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(17+time)%54,0,time);
			break;
		case 18:
			place("morphshape127",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,32768,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(18+time)%54,0,time);
			break;
		case 19:
			place("morphshape127",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,40960,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(19+time)%54,0,time);
			break;
		case 20:
			place("morphshape127",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,49152,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(20+time)%54,0,time);
			break;
		case 21:
			place("morphshape127",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,57344,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(21+time)%54,0,time);
			break;
		case 22:
			place("morphshape128",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(22+time)%54,0,time);
			break;
		case 23:
			place("morphshape128",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,7282,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(23+time)%54,0,time);
			break;
		case 24:
			place("morphshape128",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,14564,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(24+time)%54,0,time);
			break;
		case 25:
			place("morphshape128",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(25+time)%54,0,time);
			break;
		case 26:
			place("morphshape128",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,29127,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(26+time)%54,0,time);
			break;
		case 27:
			place("morphshape128",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,36409,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(27+time)%54,0,time);
			break;
		case 28:
			place("morphshape128",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(28+time)%54,0,time);
			break;
		case 29:
			place("morphshape128",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,50972,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(29+time)%54,0,time);
			break;
		case 30:
			place("morphshape128",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,58254,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(30+time)%54,0,time);
			break;
		case 31:
			place("morphshape129",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(31+time)%54,0,time);
			break;
		case 32:
			place("morphshape129",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,5958,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(32+time)%54,0,time);
			break;
		case 33:
			place("morphshape129",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,11916,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(33+time)%54,0,time);
			break;
		case 34:
			place("morphshape129",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,17873,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(34+time)%54,0,time);
			break;
		case 35:
			place("morphshape129",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,23831,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(35+time)%54,0,time);
			break;
		case 36:
			place("morphshape129",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,29789,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(36+time)%54,0,time);
			break;
		case 37:
			place("morphshape129",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,35747,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(37+time)%54,0,time);
			break;
		case 38:
			place("morphshape129",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,41705,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(38+time)%54,0,time);
			break;
		case 39:
			place("morphshape129",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,47663,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(39+time)%54,0,time);
			break;
		case 40:
			place("morphshape129",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,53620,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(40+time)%54,0,time);
			break;
		case 41:
			place("morphshape129",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,59578,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(41+time)%54,0,time);
			break;
		case 42:
			place("morphshape130",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(42+time)%54,0,time);
			break;
		case 43:
			place("morphshape130",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,5958,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(43+time)%54,0,time);
			break;
		case 44:
			place("morphshape130",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,11916,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(44+time)%54,0,time);
			break;
		case 45:
			place("morphshape130",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,17873,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(45+time)%54,0,time);
			break;
		case 46:
			place("morphshape130",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,23831,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(46+time)%54,0,time);
			break;
		case 47:
			place("morphshape130",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,29789,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(47+time)%54,0,time);
			break;
		case 48:
			place("morphshape130",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,35747,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(48+time)%54,0,time);
			break;
		case 49:
			place("morphshape130",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,41705,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(49+time)%54,0,time);
			break;
		case 50:
			place("morphshape130",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,47663,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(50+time)%54,0,time);
			break;
		case 51:
			place("morphshape130",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,53620,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(51+time)%54,0,time);
			break;
		case 52:
			place("morphshape130",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,59578,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(52+time)%54,0,time);
			break;
		case 53:
			place("shape131",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			place("sprite125",canvas,ctx,[1.0,0.0,0.0,1.0,5.0,27.0],ctrans.merge(new cxform(0,0,0,-204,256,256,256,256)),1,(53+time)%54,0,time);
			break;
	}
}

function morphshape133(ctx,ctrans,frame,ratio,time){
	var pathData="M -4658 -4654 -704 -823 Q -4661 -4661 -594 -717 -4565 -4615 -539 -646 -4440 -4561 -468 -564 -4320 -4434 -476 -530 -4182 -4277 -485 -488 -4049 -4165 -598 -553 -4019 -4136 -624 -570 -3980 -4110 -629 -594 -3936 -4075 -669 -627 -3904 -4045 -719 -673 L -3895 -4035 -738 -689 Q -3898 -4016 -778 -721 -3906 -4008 -813 -759 -3942 -3976 -989 -904 -4080 -4044 -1053 -1026 -4097 -4053 -1060 -1041 -4114 -4069 -1067 -1053 -4175 -4124 -1088 -1092 -4254 -4192 -1090 -1085 L -4350 -4278 -1077 -1061 -4400 -4320 -1064 -1046 Q -4472 -4380 -1034 -1025 -4533 -4444 -983 -993 -4640 -4579 -889 -980 -4655 -4635 -737 -854 -4657 -4642 -720 -837 -4658 -4654 -704 -823 M -4719 -4697 -739 -647 L -4719 -4697 -737 -647 Q -4725 -4671 -677 -596 -4696 -4635 -627 -556 -4617 -4552 -493 -463 -4502 -4416 -451 -434 -4401 -4298 -415 -409 -4274 -4189 -449 -456 -4250 -4165 -456 -467 -4227 -4143 -463 -479 -4010 -3945 -539 -589 -3876 -3939 -705 -825 L -3865 -3939 -719 -843 Q -3856 -3938 -775 -898 -3865 -3946 -830 -951 L -3867 -3948 -840 -961 Q -3910 -3981 -1054 -1158 -4076 -4199 -1118 -1153 L -4097 -4223 -1125 -1145 Q -4180 -4314 -1151 -1118 -4290 -4405 -1144 -1092 L -4349 -4461 -1136 -1078 Q -4444 -4561 -1116 -1052 -4528 -4633 -1054 -982 L -4575 -4671 -1015 -938 Q -4699 -4776 -901 -802 -4719 -4697 -739 -647 M -3580 -3634 -959 -1205 Q -3552 -3648 -726 -948 -3331 -3397 -749 -878 L -3300 -3355 -754 -870 Q -3259 -3283 -801 -861 -3205 -3217 -829 -894 L -3197 -3211 -837 -898 Q -3116 -3096 -919 -961 -3086 -3024 -1017 -1066 -3065 -2972 -1085 -1140 -3069 -2975 -1159 -1224 -3067 -2976 -1182 -1249 -3065 -2982 -1204 -1274 L -3083 -2987 -1217 -1294 -3085 -2987 -1219 -1296 Q -3097 -3004 -1267 -1351 -3139 -3038 -1296 -1391 L -3150 -3046 -1304 -1400 Q -3208 -3090 -1306 -1447 -3265 -3160 -1307 -1474 -3300 -3198 -1307 -1488 -3335 -3238 -1307 -1493 L -3340 -3248 -1304 -1495 Q -3381 -3300 -1287 -1492 -3418 -3352 -1263 -1490 -3469 -3425 -1231 -1469 -3513 -3477 -1188 -1423 -3529 -3479 -1171 -1420 -3545 -3521 -1154 -1399 -3567 -3597 -1088 -1356 -3576 -3622 -1019 -1275 -3578 -3632 -989 -1243 -3580 -3634 -959 -1205 M -3620 -3679 -1044 -1183 L -3620 -3679 -1042 -1183 Q -3623 -3682 -990 -1122 -3619 -3670 -939 -1064 L -3617 -3664 -917 -1040 Q -3605 -3634 -829 -960 -3566 -3568 -776 -905 -3484 -3410 -663 -770 -3280 -3223 -704 -846 L -3274 -3217 -708 -848 Q -3187 -3099 -769 -903 -3117 -3027 -843 -989 -3020 -2944 -946 -1089 -2998 -2923 -1046 -1230 -2987 -2914 -1099 -1293 -2997 -2941 -1151 -1347 -3018 -3017 -1259 -1496 -3130 -3154 -1364 -1545 -3232 -3245 -1383 -1577 -3322 -3362 -1364 -1565 -3401 -3451 -1347 -1538 -3471 -3531 -1300 -1482 -3497 -3562 -1281 -1461 -3522 -3584 -1262 -1430 L -3530 -3588 -1254 -1418 -3534 -3607 -1226 -1393 Q -3545 -3631 -1189 -1359 -3581 -3659 -1135 -1293 -3595 -3676 -1088 -1241 -3620 -3679 -1044 -1183 M -4155 -4292 -958 -898 L -4155 -4290 -958 -896 -4166 -4277 -935 -883 -4171 -4269 -922 -875 Q -4186 -4239 -867 -872 -4136 -4209 -834 -870 -4123 -4197 -827 -875 -4111 -4193 -821 -886 L -4104 -4192 -818 -890 Q -4068 -4186 -805 -908 -4042 -4187 -827 -928 L -4032 -4192 -837 -935 -4025 -4197 -845 -943 -4008 -4197 -872 -958 -3994 -4214 -911 -980 Q -3992 -4234 -933 -978 -4023 -4253 -972 -976 -4045 -4269 -988 -963 -4082 -4284 -999 -951 -4129 -4299 -1002 -930 -4155 -4292 -958 -898 M -3191 -3351 -1154 -1328 L -3191 -3351 -1154 -1326 -3174 -3347 -1145 -1305 Q -3157 -3329 -1141 -1286 -3141 -3308 -1155 -1279 -3113 -3277 -1180 -1268 -3106 -3239 -1201 -1280 -3099 -3219 -1221 -1290 -3111 -3214 -1238 -1311 -3124 -3205 -1256 -1348 -3165 -3221 -1272 -1389 L -3174 -3230 -1271 -1400 -3185 -3238 -1266 -1409 -3224 -3293 -1231 -1416 Q -3239 -3320 -1203 -1390 -3213 -3347 -1174 -1365 L -3191 -3351 -1154 -1328";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -4155 -4292 -958 -898 L -4155 -4290 -958 -896 -4166 -4277 -935 -883 -4171 -4269 -922 -875 Q -4186 -4239 -867 -872 -4136 -4209 -834 -870 -4123 -4197 -827 -875 -4111 -4193 -821 -886 L -4104 -4192 -818 -890 Q -4068 -4186 -805 -908 -4042 -4187 -827 -928 L -4032 -4192 -837 -935 -4025 -4197 -845 -943 -4008 -4197 -872 -958 -3994 -4214 -911 -980 Q -3992 -4234 -933 -978 -4023 -4253 -972 -976 -4045 -4269 -988 -963 -4082 -4284 -999 -951 -4129 -4299 -1002 -930 -4155 -4292 -958 -898 M -4658 -4654 -704 -823 Q -4661 -4661 -594 -717 -4565 -4615 -539 -646 -4440 -4561 -468 -564 -4320 -4434 -476 -530 -4182 -4277 -485 -488 -4049 -4165 -598 -553 -4019 -4136 -624 -570 -3980 -4110 -629 -594 -3936 -4075 -669 -627 -3904 -4045 -719 -673 L -3895 -4035 -738 -689 Q -3898 -4016 -778 -721 -3906 -4008 -813 -759 -3942 -3976 -989 -904 -4080 -4044 -1053 -1026 -4097 -4053 -1060 -1041 -4114 -4069 -1067 -1053 -4175 -4124 -1088 -1092 -4254 -4192 -1090 -1085 L -4350 -4278 -1077 -1061 -4400 -4320 -1064 -1046 Q -4472 -4380 -1034 -1025 -4533 -4444 -983 -993 -4640 -4579 -889 -980 -4655 -4635 -737 -854 -4657 -4642 -720 -837 -4658 -4654 -704 -823 M -3191 -3351 -1154 -1328 L -3191 -3351 -1154 -1326 -3174 -3347 -1145 -1305 Q -3157 -3329 -1141 -1286 -3141 -3308 -1155 -1279 -3113 -3277 -1180 -1268 -3106 -3239 -1201 -1280 -3099 -3219 -1221 -1290 -3111 -3214 -1238 -1311 -3124 -3205 -1256 -1348 -3165 -3221 -1272 -1389 L -3174 -3230 -1271 -1400 -3185 -3238 -1266 -1409 -3224 -3293 -1231 -1416 Q -3239 -3320 -1203 -1390 -3213 -3347 -1174 -1365 L -3191 -3351 -1154 -1328 M -3580 -3634 -959 -1205 Q -3552 -3648 -726 -948 -3331 -3397 -749 -878 L -3300 -3355 -754 -870 Q -3259 -3283 -801 -861 -3205 -3217 -829 -894 L -3197 -3211 -837 -898 Q -3116 -3096 -919 -961 -3086 -3024 -1017 -1066 -3065 -2972 -1085 -1140 -3069 -2975 -1159 -1224 -3067 -2976 -1182 -1249 -3065 -2982 -1204 -1274 L -3083 -2987 -1217 -1294 -3085 -2987 -1219 -1296 Q -3097 -3004 -1267 -1351 -3139 -3038 -1296 -1391 L -3150 -3046 -1304 -1400 Q -3208 -3090 -1306 -1447 -3265 -3160 -1307 -1474 -3300 -3198 -1307 -1488 -3335 -3238 -1307 -1493 L -3340 -3248 -1304 -1495 Q -3381 -3300 -1287 -1492 -3418 -3352 -1263 -1490 -3469 -3425 -1231 -1469 -3513 -3477 -1188 -1423 -3529 -3479 -1171 -1420 -3545 -3521 -1154 -1399 -3567 -3597 -1088 -1356 -3576 -3622 -1019 -1275 -3578 -3632 -989 -1243 -3580 -3634 -959 -1205";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -4719 -4697 -739 -647 Q -4699 -4776 -901 -802 -4575 -4671 -1015 -938 L -4528 -4633 -1054 -982 Q -4444 -4561 -1116 -1052 -4349 -4461 -1136 -1078 L -4290 -4405 -1144 -1092 Q -4180 -4314 -1151 -1118 -4097 -4223 -1125 -1145 L -4076 -4199 -1118 -1153 Q -3910 -3981 -1054 -1158 -3867 -3948 -840 -961 L -3865 -3946 -830 -951 Q -3856 -3938 -775 -898 -3865 -3939 -719 -843 L -3876 -3939 -705 -825 Q -4010 -3945 -539 -589 -4227 -4143 -463 -479 -4250 -4165 -456 -467 -4274 -4189 -449 -456 -4401 -4298 -415 -409 -4502 -4416 -451 -434 -4617 -4552 -493 -463 -4696 -4635 -627 -556 -4725 -4671 -677 -596 -4719 -4697 -737 -647 L -4719 -4697 -739 -647 M -4658 -4654 -704 -823 Q -4657 -4642 -720 -837 -4655 -4635 -737 -854 -4640 -4579 -889 -980 -4533 -4444 -983 -993 -4472 -4380 -1034 -1025 -4400 -4320 -1064 -1046 L -4350 -4278 -1077 -1061 -4254 -4192 -1090 -1085 Q -4175 -4124 -1088 -1092 -4114 -4069 -1067 -1053 -4097 -4053 -1060 -1041 -4080 -4044 -1053 -1026 -3942 -3976 -989 -904 -3906 -4008 -813 -759 -3898 -4016 -778 -721 -3895 -4035 -738 -689 L -3904 -4045 -719 -673 Q -3936 -4075 -669 -627 -3980 -4110 -629 -594 -4019 -4136 -624 -570 -4049 -4165 -598 -553 -4182 -4277 -485 -488 -4320 -4434 -476 -530 -4440 -4561 -468 -564 -4565 -4615 -539 -646 -4661 -4661 -594 -717 -4658 -4654 -704 -823 -4657 -4642 -720 -837 -4655 -4635 -737 -854 -4640 -4579 -889 -980 -4533 -4444 -983 -993 -4472 -4380 -1034 -1025 -4400 -4320 -1064 -1046 L -4350 -4278 -1077 -1061 -4254 -4192 -1090 -1085 Q -4175 -4124 -1088 -1092 -4114 -4069 -1067 -1053 -4097 -4053 -1060 -1041 -4080 -4044 -1053 -1026 -3942 -3976 -989 -904 -3906 -4008 -813 -759 -3898 -4016 -778 -721 -3895 -4035 -738 -689 L -3904 -4045 -719 -673 Q -3936 -4075 -669 -627 -3980 -4110 -629 -594 -4019 -4136 -624 -570 -4049 -4165 -598 -553 -4182 -4277 -485 -488 -4320 -4434 -476 -530 -4440 -4561 -468 -564 -4565 -4615 -539 -646 -4661 -4661 -594 -717 -4658 -4654 -704 -823 M -4155 -4292 -958 -898 Q -4129 -4299 -1002 -930 -4082 -4284 -999 -951 -4045 -4269 -988 -963 -4023 -4253 -972 -976 -3992 -4234 -933 -978 -3994 -4214 -911 -980 L -4008 -4197 -872 -958 -4025 -4197 -845 -943 -4032 -4192 -837 -935 -4042 -4187 -827 -928 Q -4068 -4186 -805 -908 -4104 -4192 -818 -890 L -4111 -4193 -821 -886 Q -4123 -4197 -827 -875 -4136 -4209 -834 -870 -4186 -4239 -867 -872 -4171 -4269 -922 -875 L -4166 -4277 -935 -883 -4155 -4290 -958 -896 -4155 -4292 -958 -898 Q -4129 -4299 -1002 -930 -4082 -4284 -999 -951 -4045 -4269 -988 -963 -4023 -4253 -972 -976 -3992 -4234 -933 -978 -3994 -4214 -911 -980 L -4008 -4197 -872 -958 -4025 -4197 -845 -943 -4032 -4192 -837 -935 -4042 -4187 -827 -928 Q -4068 -4186 -805 -908 -4104 -4192 -818 -890 L -4111 -4193 -821 -886 Q -4123 -4197 -827 -875 -4136 -4209 -834 -870 -4186 -4239 -867 -872 -4171 -4269 -922 -875 L -4166 -4277 -935 -883 -4155 -4290 -958 -896 -4155 -4292 -958 -898 M -3620 -3679 -1044 -1183 Q -3595 -3676 -1088 -1241 -3581 -3659 -1135 -1293 -3545 -3631 -1189 -1359 -3534 -3607 -1226 -1393 L -3530 -3588 -1254 -1418 -3522 -3584 -1262 -1430 Q -3497 -3562 -1281 -1461 -3471 -3531 -1300 -1482 -3401 -3451 -1347 -1538 -3322 -3362 -1364 -1565 -3232 -3245 -1383 -1577 -3130 -3154 -1364 -1545 -3018 -3017 -1259 -1496 -2997 -2941 -1151 -1347 -2987 -2914 -1099 -1293 -2998 -2923 -1046 -1230 -3020 -2944 -946 -1089 -3117 -3027 -843 -989 -3187 -3099 -769 -903 -3274 -3217 -708 -848 L -3280 -3223 -704 -846 Q -3484 -3410 -663 -770 -3566 -3568 -776 -905 -3605 -3634 -829 -960 -3617 -3664 -917 -1040 L -3619 -3670 -939 -1064 Q -3623 -3682 -990 -1122 -3620 -3679 -1042 -1183 L -3620 -3679 -1044 -1183 M -3580 -3634 -959 -1205 Q -3578 -3632 -989 -1243 -3576 -3622 -1019 -1275 -3567 -3597 -1088 -1356 -3545 -3521 -1154 -1399 -3529 -3479 -1171 -1420 -3513 -3477 -1188 -1423 -3469 -3425 -1231 -1469 -3418 -3352 -1263 -1490 -3381 -3300 -1287 -1492 -3340 -3248 -1304 -1495 L -3335 -3238 -1307 -1493 Q -3300 -3198 -1307 -1488 -3265 -3160 -1307 -1474 -3208 -3090 -1306 -1447 -3150 -3046 -1304 -1400 L -3139 -3038 -1296 -1391 Q -3097 -3004 -1267 -1351 -3085 -2987 -1219 -1296 L -3083 -2987 -1217 -1294 -3065 -2982 -1204 -1274 Q -3067 -2976 -1182 -1249 -3069 -2975 -1159 -1224 -3065 -2972 -1085 -1140 -3086 -3024 -1017 -1066 -3116 -3096 -919 -961 -3197 -3211 -837 -898 L -3205 -3217 -829 -894 Q -3259 -3283 -801 -861 -3300 -3355 -754 -870 L -3331 -3397 -749 -878 Q -3552 -3648 -726 -948 -3580 -3634 -959 -1205 -3578 -3632 -989 -1243 -3576 -3622 -1019 -1275 -3567 -3597 -1088 -1356 -3545 -3521 -1154 -1399 -3529 -3479 -1171 -1420 -3513 -3477 -1188 -1423 -3469 -3425 -1231 -1469 -3418 -3352 -1263 -1490 -3381 -3300 -1287 -1492 -3340 -3248 -1304 -1495 L -3335 -3238 -1307 -1493 Q -3300 -3198 -1307 -1488 -3265 -3160 -1307 -1474 -3208 -3090 -1306 -1447 -3150 -3046 -1304 -1400 L -3139 -3038 -1296 -1391 Q -3097 -3004 -1267 -1351 -3085 -2987 -1219 -1296 L -3083 -2987 -1217 -1294 -3065 -2982 -1204 -1274 Q -3067 -2976 -1182 -1249 -3069 -2975 -1159 -1224 -3065 -2972 -1085 -1140 -3086 -3024 -1017 -1066 -3116 -3096 -919 -961 -3197 -3211 -837 -898 L -3205 -3217 -829 -894 Q -3259 -3283 -801 -861 -3300 -3355 -754 -870 L -3331 -3397 -749 -878 Q -3552 -3648 -726 -948 -3580 -3634 -959 -1205 M -3191 -3351 -1154 -1328 L -3213 -3347 -1174 -1365 Q -3239 -3320 -1203 -1390 -3224 -3293 -1231 -1416 L -3185 -3238 -1266 -1409 -3174 -3230 -1271 -1400 -3165 -3221 -1272 -1389 Q -3124 -3205 -1256 -1348 -3111 -3214 -1238 -1311 -3099 -3219 -1221 -1290 -3106 -3239 -1201 -1280 -3113 -3277 -1180 -1268 -3141 -3308 -1155 -1279 -3157 -3329 -1141 -1286 -3174 -3347 -1145 -1305 L -3191 -3351 -1154 -1326 -3191 -3351 -1154 -1328 -3213 -3347 -1174 -1365 Q -3239 -3320 -1203 -1390 -3224 -3293 -1231 -1416 L -3185 -3238 -1266 -1409 -3174 -3230 -1271 -1400 -3165 -3221 -1272 -1389 Q -3124 -3205 -1256 -1348 -3111 -3214 -1238 -1311 -3099 -3219 -1221 -1290 -3106 -3239 -1201 -1280 -3113 -3277 -1180 -1268 -3141 -3308 -1155 -1279 -3157 -3329 -1141 -1286 -3174 -3347 -1145 -1305 L -3191 -3351 -1154 -1326 -3191 -3351 -1154 -1328 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape134(ctx,ctrans,frame,ratio,time){
	var pathData="M -4654 -4628 -823 -768 L -4654 -4628 -823 -766 Q -4660 -4619 -735 -682 -4629 -4557 -671 -626 -4587 -4477 -586 -554 -4481 -4380 -545 -520 L -4434 -4327 -530 -509 Q -4391 -4285 -522 -505 -4349 -4246 -515 -521 -4266 -4173 -508 -552 -4198 -4109 -536 -601 -4101 -4003 -576 -683 -4035 -3980 -689 -799 -4016 -3974 -721 -833 -4008 -3974 -759 -869 -3999 -3975 -799 -907 -3998 -3983 -837 -948 -3995 -4005 -938 -1059 -4044 -4113 -1026 -1085 L -4069 -4146 -1053 -1091 Q -4109 -4197 -1081 -1095 -4165 -4247 -1086 -1098 L -4192 -4272 -1085 -1086 Q -4245 -4323 -1069 -1062 -4298 -4377 -1053 -1045 -4335 -4401 -1039 -1038 -4372 -4447 -1026 -1060 -4408 -4482 -1009 -1044 -4444 -4518 -993 -1020 -4579 -4630 -980 -940 -4635 -4629 -854 -798 -4642 -4628 -837 -783 -4654 -4628 -823 -768 M -4697 -4663 -647 -832 L -4697 -4663 -647 -830 Q -4628 -4685 -512 -688 -4493 -4579 -457 -581 L -4416 -4518 -434 -531 Q -4335 -4456 -417 -490 -4258 -4381 -433 -477 -4223 -4345 -441 -471 -4189 -4310 -456 -476 L -4160 -4283 -469 -481 Q -4073 -4199 -514 -501 -4020 -4122 -582 -542 -3943 -3999 -679 -606 -3939 -3951 -825 -723 -3939 -3940 -857 -749 -3939 -3933 -888 -778 -3943 -3926 -920 -806 -3946 -3922 -951 -835 -3950 -3918 -982 -862 -3959 -3917 -1008 -890 -4009 -3909 -1157 -1058 -4199 -4044 -1153 -1136 L -4223 -4063 -1145 -1146 -4251 -4094 -1137 -1160 -4263 -4102 -1133 -1167 -4277 -4112 -1129 -1175 -4427 -4262 -1088 -1178 Q -4433 -4267 -1086 -1175 -4439 -4272 -1084 -1174 L -4461 -4291 -1078 -1169 -4506 -4334 -1065 -1149 -4518 -4342 -1059 -1143 -4536 -4361 -1051 -1137 -4550 -4374 -1043 -1130 -4562 -4382 -1037 -1123 Q -4624 -4456 -999 -1106 -4671 -4511 -938 -1072 -4776 -4637 -802 -995 -4697 -4663 -647 -832 M -3634 -3656 -1205 -1287 Q -3646 -3729 -992 -1119 -3476 -3579 -908 -1007 -3440 -3544 -890 -981 -3397 -3509 -878 -965 -3298 -3427 -850 -926 -3211 -3342 -898 -939 -3144 -3280 -935 -948 -3092 -3217 -986 -984 -3054 -3170 -1022 -1011 -3024 -3138 -1066 -1043 -2951 -3058 -1171 -1125 -2987 -3072 -1294 -1244 L -3001 -3078 -1331 -1279 Q -3045 -3104 -1431 -1394 -3160 -3182 -1474 -1446 -3240 -3240 -1504 -1484 -3336 -3334 -1492 -1495 L -3390 -3384 -1477 -1493 Q -3439 -3434 -1457 -1484 -3482 -3485 -1418 -1462 -3625 -3603 -1363 -1409 -3634 -3656 -1205 -1287 M -3679 -3710 -1183 -1310 Q -3683 -3734 -1110 -1242 -3664 -3730 -1040 -1181 -3634 -3724 -960 -1104 -3568 -3673 -905 -1037 L -3522 -3639 -871 -1000 Q -3380 -3514 -779 -877 -3217 -3366 -848 -887 -3148 -3306 -880 -891 -3095 -3242 -922 -917 -3007 -3143 -993 -957 -2962 -3076 -1093 -1039 -2934 -3030 -1156 -1095 -2923 -3012 -1230 -1155 -2914 -2995 -1293 -1210 -2941 -3003 -1347 -1268 -2974 -3011 -1413 -1326 -3019 -3042 -1459 -1387 -3145 -3133 -1587 -1562 -3362 -3324 -1565 -1566 L -3428 -3389 -1541 -1563 Q -3481 -3444 -1517 -1551 -3531 -3498 -1482 -1527 L -3565 -3536 -1453 -1508 -3588 -3566 -1418 -1487 -3612 -3579 -1385 -1453 Q -3674 -3675 -1295 -1406 -3679 -3710 -1183 -1310 M -4292 -4218 -898 -948 L -4292 -4218 -898 -946 -4277 -4214 -883 -933 -4269 -4206 -875 -925 Q -4239 -4177 -872 -901 -4209 -4138 -870 -905 -4198 -4130 -874 -907 -4194 -4122 -883 -908 L -4192 -4116 -890 -914 -4190 -4109 -896 -920 -4188 -4102 -910 -928 -4187 -4097 -920 -935 -4187 -4095 -928 -943 -4192 -4095 -935 -947 -4197 -4095 -943 -961 -4197 -4097 -950 -971 -4197 -4100 -958 -981 -4214 -4115 -980 -1005 -4239 -4139 -983 -1018 Q -4244 -4150 -980 -1020 -4253 -4160 -976 -1022 L -4266 -4179 -968 -1023 -4291 -4217 -937 -993 Q -4297 -4218 -920 -970 -4292 -4218 -898 -948 M -3351 -3238 -1328 -1398 L -3347 -3255 -1305 -1381 Q -3303 -3291 -1259 -1335 -3239 -3240 -1280 -1295 L -3230 -3232 -1287 -1289 Q -3218 -3219 -1296 -1280 -3214 -3207 -1311 -1279 -3209 -3189 -1333 -1277 -3211 -3173 -1355 -1293 L -3217 -3155 -1385 -1313 -3230 -3148 -1400 -1324 Q -3241 -3140 -1413 -1337 -3293 -3153 -1416 -1386 -3320 -3169 -1390 -1402 -3347 -3207 -1365 -1414 -3349 -3223 -1346 -1411 -3351 -3238 -1328 -1398";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -4292 -4218 -898 -948 L -4292 -4218 -898 -946 -4277 -4214 -883 -933 -4269 -4206 -875 -925 Q -4239 -4177 -872 -901 -4209 -4138 -870 -905 -4198 -4130 -874 -907 -4194 -4122 -883 -908 L -4192 -4116 -890 -914 -4190 -4109 -896 -920 -4188 -4102 -910 -928 -4187 -4097 -920 -935 -4187 -4095 -928 -943 -4192 -4095 -935 -947 -4197 -4095 -943 -961 -4197 -4097 -950 -971 -4197 -4100 -958 -981 -4214 -4115 -980 -1005 -4239 -4139 -983 -1018 Q -4244 -4150 -980 -1020 -4253 -4160 -976 -1022 L -4266 -4179 -968 -1023 -4291 -4217 -937 -993 Q -4297 -4218 -920 -970 -4292 -4218 -898 -948 M -4654 -4628 -823 -768 L -4654 -4628 -823 -766 Q -4660 -4619 -735 -682 -4629 -4557 -671 -626 -4587 -4477 -586 -554 -4481 -4380 -545 -520 L -4434 -4327 -530 -509 Q -4391 -4285 -522 -505 -4349 -4246 -515 -521 -4266 -4173 -508 -552 -4198 -4109 -536 -601 -4101 -4003 -576 -683 -4035 -3980 -689 -799 -4016 -3974 -721 -833 -4008 -3974 -759 -869 -3999 -3975 -799 -907 -3998 -3983 -837 -948 -3995 -4005 -938 -1059 -4044 -4113 -1026 -1085 L -4069 -4146 -1053 -1091 Q -4109 -4197 -1081 -1095 -4165 -4247 -1086 -1098 L -4192 -4272 -1085 -1086 Q -4245 -4323 -1069 -1062 -4298 -4377 -1053 -1045 -4335 -4401 -1039 -1038 -4372 -4447 -1026 -1060 -4408 -4482 -1009 -1044 -4444 -4518 -993 -1020 -4579 -4630 -980 -940 -4635 -4629 -854 -798 -4642 -4628 -837 -783 -4654 -4628 -823 -768 M -3351 -3238 -1328 -1398 L -3347 -3255 -1305 -1381 Q -3303 -3291 -1259 -1335 -3239 -3240 -1280 -1295 L -3230 -3232 -1287 -1289 Q -3218 -3219 -1296 -1280 -3214 -3207 -1311 -1279 -3209 -3189 -1333 -1277 -3211 -3173 -1355 -1293 L -3217 -3155 -1385 -1313 -3230 -3148 -1400 -1324 Q -3241 -3140 -1413 -1337 -3293 -3153 -1416 -1386 -3320 -3169 -1390 -1402 -3347 -3207 -1365 -1414 -3349 -3223 -1346 -1411 -3351 -3238 -1328 -1398 M -3634 -3656 -1205 -1287 Q -3646 -3729 -992 -1119 -3476 -3579 -908 -1007 -3440 -3544 -890 -981 -3397 -3509 -878 -965 -3298 -3427 -850 -926 -3211 -3342 -898 -939 -3144 -3280 -935 -948 -3092 -3217 -986 -984 -3054 -3170 -1022 -1011 -3024 -3138 -1066 -1043 -2951 -3058 -1171 -1125 -2987 -3072 -1294 -1244 L -3001 -3078 -1331 -1279 Q -3045 -3104 -1431 -1394 -3160 -3182 -1474 -1446 -3240 -3240 -1504 -1484 -3336 -3334 -1492 -1495 L -3390 -3384 -1477 -1493 Q -3439 -3434 -1457 -1484 -3482 -3485 -1418 -1462 -3625 -3603 -1363 -1409 -3634 -3656 -1205 -1287";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -4697 -4663 -647 -832 Q -4776 -4637 -802 -995 -4671 -4511 -938 -1072 -4624 -4456 -999 -1106 -4562 -4382 -1037 -1123 L -4550 -4374 -1043 -1130 -4536 -4361 -1051 -1137 -4518 -4342 -1059 -1143 -4506 -4334 -1065 -1149 -4461 -4291 -1078 -1169 -4439 -4272 -1084 -1174 Q -4433 -4267 -1086 -1175 -4427 -4262 -1088 -1178 L -4277 -4112 -1129 -1175 -4263 -4102 -1133 -1167 -4251 -4094 -1137 -1160 -4223 -4063 -1145 -1146 -4199 -4044 -1153 -1136 Q -4009 -3909 -1157 -1058 -3959 -3917 -1008 -890 -3950 -3918 -982 -862 -3946 -3922 -951 -835 -3943 -3926 -920 -806 -3939 -3933 -888 -778 -3939 -3940 -857 -749 -3939 -3951 -825 -723 -3943 -3999 -679 -606 -4020 -4122 -582 -542 -4073 -4199 -514 -501 -4160 -4283 -469 -481 L -4189 -4310 -456 -476 Q -4223 -4345 -441 -471 -4258 -4381 -433 -477 -4335 -4456 -417 -490 -4416 -4518 -434 -531 L -4493 -4579 -457 -581 Q -4628 -4685 -512 -688 -4697 -4663 -647 -830 L -4697 -4663 -647 -832 M -4654 -4628 -823 -768 Q -4642 -4628 -837 -783 -4635 -4629 -854 -798 -4579 -4630 -980 -940 -4444 -4518 -993 -1020 -4408 -4482 -1009 -1044 -4372 -4447 -1026 -1060 -4335 -4401 -1039 -1038 -4298 -4377 -1053 -1045 -4245 -4323 -1069 -1062 -4192 -4272 -1085 -1086 L -4165 -4247 -1086 -1098 Q -4109 -4197 -1081 -1095 -4069 -4146 -1053 -1091 L -4044 -4113 -1026 -1085 Q -3995 -4005 -938 -1059 -3998 -3983 -837 -948 -3999 -3975 -799 -907 -4008 -3974 -759 -869 -4016 -3974 -721 -833 -4035 -3980 -689 -799 -4101 -4003 -576 -683 -4198 -4109 -536 -601 -4266 -4173 -508 -552 -4349 -4246 -515 -521 -4391 -4285 -522 -505 -4434 -4327 -530 -509 L -4481 -4380 -545 -520 Q -4587 -4477 -586 -554 -4629 -4557 -671 -626 -4660 -4619 -735 -682 -4654 -4628 -823 -766 L -4654 -4628 -823 -768 Q -4642 -4628 -837 -783 -4635 -4629 -854 -798 -4579 -4630 -980 -940 -4444 -4518 -993 -1020 -4408 -4482 -1009 -1044 -4372 -4447 -1026 -1060 -4335 -4401 -1039 -1038 -4298 -4377 -1053 -1045 -4245 -4323 -1069 -1062 -4192 -4272 -1085 -1086 L -4165 -4247 -1086 -1098 Q -4109 -4197 -1081 -1095 -4069 -4146 -1053 -1091 L -4044 -4113 -1026 -1085 Q -3995 -4005 -938 -1059 -3998 -3983 -837 -948 -3999 -3975 -799 -907 -4008 -3974 -759 -869 -4016 -3974 -721 -833 -4035 -3980 -689 -799 -4101 -4003 -576 -683 -4198 -4109 -536 -601 -4266 -4173 -508 -552 -4349 -4246 -515 -521 -4391 -4285 -522 -505 -4434 -4327 -530 -509 L -4481 -4380 -545 -520 Q -4587 -4477 -586 -554 -4629 -4557 -671 -626 -4660 -4619 -735 -682 -4654 -4628 -823 -766 L -4654 -4628 -823 -768 M -4292 -4218 -898 -948 Q -4297 -4218 -920 -970 -4291 -4217 -937 -993 L -4266 -4179 -968 -1023 -4253 -4160 -976 -1022 Q -4244 -4150 -980 -1020 -4239 -4139 -983 -1018 L -4214 -4115 -980 -1005 -4197 -4100 -958 -981 -4197 -4097 -950 -971 -4197 -4095 -943 -961 -4192 -4095 -935 -947 -4187 -4095 -928 -943 -4187 -4097 -920 -935 -4188 -4102 -910 -928 -4190 -4109 -896 -920 -4192 -4116 -890 -914 -4194 -4122 -883 -908 Q -4198 -4130 -874 -907 -4209 -4138 -870 -905 -4239 -4177 -872 -901 -4269 -4206 -875 -925 L -4277 -4214 -883 -933 -4292 -4218 -898 -946 -4292 -4218 -898 -948 Q -4297 -4218 -920 -970 -4291 -4217 -937 -993 L -4266 -4179 -968 -1023 -4253 -4160 -976 -1022 Q -4244 -4150 -980 -1020 -4239 -4139 -983 -1018 L -4214 -4115 -980 -1005 -4197 -4100 -958 -981 -4197 -4097 -950 -971 -4197 -4095 -943 -961 -4192 -4095 -935 -947 -4187 -4095 -928 -943 -4187 -4097 -920 -935 -4188 -4102 -910 -928 -4190 -4109 -896 -920 -4192 -4116 -890 -914 -4194 -4122 -883 -908 Q -4198 -4130 -874 -907 -4209 -4138 -870 -905 -4239 -4177 -872 -901 -4269 -4206 -875 -925 L -4277 -4214 -883 -933 -4292 -4218 -898 -946 -4292 -4218 -898 -948 M -3679 -3710 -1183 -1310 Q -3674 -3675 -1295 -1406 -3612 -3579 -1385 -1453 L -3588 -3566 -1418 -1487 -3565 -3536 -1453 -1508 -3531 -3498 -1482 -1527 Q -3481 -3444 -1517 -1551 -3428 -3389 -1541 -1563 L -3362 -3324 -1565 -1566 Q -3145 -3133 -1587 -1562 -3019 -3042 -1459 -1387 -2974 -3011 -1413 -1326 -2941 -3003 -1347 -1268 -2914 -2995 -1293 -1210 -2923 -3012 -1230 -1155 -2934 -3030 -1156 -1095 -2962 -3076 -1093 -1039 -3007 -3143 -993 -957 -3095 -3242 -922 -917 -3148 -3306 -880 -891 -3217 -3366 -848 -887 -3380 -3514 -779 -877 -3522 -3639 -871 -1000 L -3568 -3673 -905 -1037 Q -3634 -3724 -960 -1104 -3664 -3730 -1040 -1181 -3683 -3734 -1110 -1242 -3679 -3710 -1183 -1310 M -3634 -3656 -1205 -1287 Q -3625 -3603 -1363 -1409 -3482 -3485 -1418 -1462 -3439 -3434 -1457 -1484 -3390 -3384 -1477 -1493 L -3336 -3334 -1492 -1495 Q -3240 -3240 -1504 -1484 -3160 -3182 -1474 -1446 -3045 -3104 -1431 -1394 -3001 -3078 -1331 -1279 L -2987 -3072 -1294 -1244 Q -2951 -3058 -1171 -1125 -3024 -3138 -1066 -1043 -3054 -3170 -1022 -1011 -3092 -3217 -986 -984 -3144 -3280 -935 -948 -3211 -3342 -898 -939 -3298 -3427 -850 -926 -3397 -3509 -878 -965 -3440 -3544 -890 -981 -3476 -3579 -908 -1007 -3646 -3729 -992 -1119 -3634 -3656 -1205 -1287 -3625 -3603 -1363 -1409 -3482 -3485 -1418 -1462 -3439 -3434 -1457 -1484 -3390 -3384 -1477 -1493 L -3336 -3334 -1492 -1495 Q -3240 -3240 -1504 -1484 -3160 -3182 -1474 -1446 -3045 -3104 -1431 -1394 -3001 -3078 -1331 -1279 L -2987 -3072 -1294 -1244 Q -2951 -3058 -1171 -1125 -3024 -3138 -1066 -1043 -3054 -3170 -1022 -1011 -3092 -3217 -986 -984 -3144 -3280 -935 -948 -3211 -3342 -898 -939 -3298 -3427 -850 -926 -3397 -3509 -878 -965 -3440 -3544 -890 -981 -3476 -3579 -908 -1007 -3646 -3729 -992 -1119 -3634 -3656 -1205 -1287 M -3351 -3238 -1328 -1398 Q -3349 -3223 -1346 -1411 -3347 -3207 -1365 -1414 -3320 -3169 -1390 -1402 -3293 -3153 -1416 -1386 -3241 -3140 -1413 -1337 -3230 -3148 -1400 -1324 L -3217 -3155 -1385 -1313 -3211 -3173 -1355 -1293 Q -3209 -3189 -1333 -1277 -3214 -3207 -1311 -1279 -3218 -3219 -1296 -1280 -3230 -3232 -1287 -1289 L -3239 -3240 -1280 -1295 Q -3303 -3291 -1259 -1335 -3347 -3255 -1305 -1381 L -3351 -3238 -1328 -1398 Q -3349 -3223 -1346 -1411 -3347 -3207 -1365 -1414 -3320 -3169 -1390 -1402 -3293 -3153 -1416 -1386 -3241 -3140 -1413 -1337 -3230 -3148 -1400 -1324 L -3217 -3155 -1385 -1313 -3211 -3173 -1355 -1293 Q -3209 -3189 -1333 -1277 -3214 -3207 -1311 -1279 -3218 -3219 -1296 -1280 -3230 -3232 -1287 -1289 L -3239 -3240 -1280 -1295 Q -3303 -3291 -1259 -1335 -3347 -3255 -1305 -1381 L -3351 -3238 -1328 -1398 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape135(ctx,ctrans,frame,ratio,time){
	var pathData="M -4628 -4634 -768 -725 L -4627 -4630 -757 -717 -4624 -4624 -739 -703 Q -4609 -4576 -673 -686 -4557 -4529 -626 -679 -4477 -4446 -554 -683 -4380 -4364 -520 -687 -4309 -4314 -495 -700 -4246 -4265 -521 -726 L -4225 -4247 -530 -736 Q -4198 -4227 -543 -745 -4173 -4207 -558 -754 -4141 -4178 -580 -765 -4109 -4151 -601 -778 -4022 -4084 -668 -811 -3992 -4024 -755 -858 L -3986 -4019 -774 -872 -3981 -4012 -794 -888 -3976 -4017 -826 -910 -3974 -4017 -857 -933 -3976 -4033 -896 -963 -3979 -4037 -927 -985 -3983 -4054 -950 -1005 Q -4009 -4137 -1071 -1033 -4138 -4225 -1090 -1031 L -4220 -4292 -1098 -1025 -4247 -4314 -1098 -1020 Q -4309 -4369 -1066 -1006 -4377 -4416 -1045 -984 -4401 -4445 -1038 -969 -4447 -4473 -1060 -954 -4586 -4556 -999 -900 -4619 -4612 -879 -812 -4633 -4638 -829 -772 -4628 -4634 -768 -725 M -4663 -4662 -832 -771 L -4664 -4662 -824 -771 Q -4676 -4684 -736 -693 -4639 -4616 -661 -663 -4617 -4578 -619 -647 -4579 -4539 -581 -641 -4522 -4477 -523 -643 -4449 -4415 -495 -644 L -4381 -4361 -477 -657 -4283 -4286 -481 -679 Q -4199 -4220 -501 -700 -4122 -4157 -542 -729 -4041 -4098 -584 -757 -3993 -4041 -649 -791 -3951 -3988 -705 -822 -3933 -3975 -778 -876 L -3931 -3973 -786 -884 Q -3919 -3964 -837 -932 -3917 -3973 -890 -970 -3911 -3991 -1013 -1049 -3983 -4089 -1088 -1080 -4025 -4143 -1132 -1083 -4094 -4197 -1160 -1078 L -4102 -4205 -1167 -1078 -4112 -4215 -1175 -1076 -4262 -4333 -1178 -1054 Q -4267 -4338 -1175 -1053 -4272 -4343 -1174 -1052 L -4334 -4393 -1149 -1037 -4336 -4395 -1147 -1037 -4342 -4399 -1143 -1035 -4361 -4414 -1137 -1030 -4374 -4428 -1130 -1025 -4382 -4438 -1123 -1021 Q -4625 -4611 -1067 -948 -4663 -4662 -832 -771 M -3656 -3695 -1287 -1172 Q -3729 -3712 -1119 -1078 -3579 -3624 -1007 -1038 -3404 -3320 -877 -1027 -3217 -3142 -984 -1268 -3036 -3108 -1088 -1417 -3078 -3275 -1279 -1424 -3123 -3322 -1479 -1425 -3327 -3369 -1488 -1425 -3330 -3471 -1491 -1407 -3332 -3552 -1493 -1345 L -3384 -3593 -1493 -1307 Q -3583 -3678 -1456 -1265 -3656 -3695 -1287 -1172 M -3710 -3730 -1310 -1209 L -3710 -3730 -1308 -1209 Q -3733 -3745 -1245 -1158 -3730 -3728 -1188 -1108 -3725 -3694 -1084 -1004 -3639 -3604 -1000 -990 -3596 -3562 -958 -992 -3551 -3520 -931 -993 -3418 -3399 -854 -1017 -3263 -3287 -909 -1068 L -3242 -3270 -917 -1076 Q -3143 -3185 -957 -1118 -3076 -3139 -1039 -1185 -3006 -3094 -1124 -1249 -3001 -3084 -1217 -1335 -3002 -3081 -1239 -1354 -3002 -3090 -1261 -1368 -3009 -3121 -1322 -1421 -3042 -3165 -1387 -1452 -3113 -3249 -1523 -1511 -3244 -3379 -1556 -1490 -3317 -3439 -1560 -1480 -3389 -3499 -1563 -1457 L -3413 -3517 -1557 -1450 Q -3476 -3567 -1541 -1429 -3536 -3603 -1508 -1396 -3560 -3620 -1495 -1378 -3577 -3636 -1475 -1361 L -3579 -3644 -1460 -1349 -3615 -3662 -1431 -1315 Q -3682 -3711 -1386 -1271 -3710 -3730 -1310 -1209 M -4218 -4237 -948 -953 L -4214 -4237 -933 -938 Q -4177 -4231 -894 -901 -4122 -4197 -908 -878 L -4109 -4167 -920 -877 -4102 -4159 -928 -880 -4095 -4147 -943 -895 Q -4093 -4143 -1027 -910 -4179 -4140 -1023 -924 -4198 -4132 -1008 -961 -4217 -4202 -993 -983 -4218 -4225 -970 -972 -4218 -4237 -948 -953 M -3238 -3382 -1398 -1323 L -3238 -3382 -1398 -1321 -3255 -3379 -1381 -1301 Q -3269 -3375 -1362 -1282 -3269 -3372 -1344 -1263 -3270 -3349 -1316 -1233 -3234 -3312 -1291 -1245 L -3232 -3310 -1289 -1247 -3222 -3302 -1284 -1253 Q -3196 -3276 -1271 -1275 -3173 -3266 -1293 -1295 -3119 -3246 -1347 -1337 -3203 -3355 -1414 -1348 -3221 -3369 -1413 -1335 -3238 -3382 -1398 -1323";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -4218 -4237 -948 -953 L -4214 -4237 -933 -938 Q -4177 -4231 -894 -901 -4122 -4197 -908 -878 L -4109 -4167 -920 -877 -4102 -4159 -928 -880 -4095 -4147 -943 -895 Q -4093 -4143 -1027 -910 -4179 -4140 -1023 -924 -4198 -4132 -1008 -961 -4217 -4202 -993 -983 -4218 -4225 -970 -972 -4218 -4237 -948 -953 M -4628 -4634 -768 -725 L -4627 -4630 -757 -717 -4624 -4624 -739 -703 Q -4609 -4576 -673 -686 -4557 -4529 -626 -679 -4477 -4446 -554 -683 -4380 -4364 -520 -687 -4309 -4314 -495 -700 -4246 -4265 -521 -726 L -4225 -4247 -530 -736 Q -4198 -4227 -543 -745 -4173 -4207 -558 -754 -4141 -4178 -580 -765 -4109 -4151 -601 -778 -4022 -4084 -668 -811 -3992 -4024 -755 -858 L -3986 -4019 -774 -872 -3981 -4012 -794 -888 -3976 -4017 -826 -910 -3974 -4017 -857 -933 -3976 -4033 -896 -963 -3979 -4037 -927 -985 -3983 -4054 -950 -1005 Q -4009 -4137 -1071 -1033 -4138 -4225 -1090 -1031 L -4220 -4292 -1098 -1025 -4247 -4314 -1098 -1020 Q -4309 -4369 -1066 -1006 -4377 -4416 -1045 -984 -4401 -4445 -1038 -969 -4447 -4473 -1060 -954 -4586 -4556 -999 -900 -4619 -4612 -879 -812 -4633 -4638 -829 -772 -4628 -4634 -768 -725 M -3238 -3382 -1398 -1323 L -3238 -3382 -1398 -1321 -3255 -3379 -1381 -1301 Q -3269 -3375 -1362 -1282 -3269 -3372 -1344 -1263 -3270 -3349 -1316 -1233 -3234 -3312 -1291 -1245 L -3232 -3310 -1289 -1247 -3222 -3302 -1284 -1253 Q -3196 -3276 -1271 -1275 -3173 -3266 -1293 -1295 -3119 -3246 -1347 -1337 -3203 -3355 -1414 -1348 -3221 -3369 -1413 -1335 -3238 -3382 -1398 -1323 M -3656 -3695 -1287 -1172 Q -3729 -3712 -1119 -1078 -3579 -3624 -1007 -1038 -3404 -3320 -877 -1027 -3217 -3142 -984 -1268 -3036 -3108 -1088 -1417 -3078 -3275 -1279 -1424 -3123 -3322 -1479 -1425 -3327 -3369 -1488 -1425 -3330 -3471 -1491 -1407 -3332 -3552 -1493 -1345 L -3384 -3593 -1493 -1307 Q -3583 -3678 -1456 -1265 -3656 -3695 -1287 -1172";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -4663 -4662 -832 -771 Q -4625 -4611 -1067 -948 -4382 -4438 -1123 -1021 L -4374 -4428 -1130 -1025 -4361 -4414 -1137 -1030 -4342 -4399 -1143 -1035 -4336 -4395 -1147 -1037 -4334 -4393 -1149 -1037 -4272 -4343 -1174 -1052 Q -4267 -4338 -1175 -1053 -4262 -4333 -1178 -1054 L -4112 -4215 -1175 -1076 -4102 -4205 -1167 -1078 -4094 -4197 -1160 -1078 Q -4025 -4143 -1132 -1083 -3983 -4089 -1088 -1080 -3911 -3991 -1013 -1049 -3917 -3973 -890 -970 -3919 -3964 -837 -932 -3931 -3973 -786 -884 L -3933 -3975 -778 -876 Q -3951 -3988 -705 -822 -3993 -4041 -649 -791 -4041 -4098 -584 -757 -4122 -4157 -542 -729 -4199 -4220 -501 -700 -4283 -4286 -481 -679 L -4381 -4361 -477 -657 -4449 -4415 -495 -644 Q -4522 -4477 -523 -643 -4579 -4539 -581 -641 -4617 -4578 -619 -647 -4639 -4616 -661 -663 -4676 -4684 -736 -693 -4664 -4662 -824 -771 L -4663 -4662 -832 -771 M -4628 -4634 -768 -725 Q -4633 -4638 -829 -772 -4619 -4612 -879 -812 -4586 -4556 -999 -900 -4447 -4473 -1060 -954 -4401 -4445 -1038 -969 -4377 -4416 -1045 -984 -4309 -4369 -1066 -1006 -4247 -4314 -1098 -1020 L -4220 -4292 -1098 -1025 -4138 -4225 -1090 -1031 Q -4009 -4137 -1071 -1033 -3983 -4054 -950 -1005 L -3979 -4037 -927 -985 -3976 -4033 -896 -963 -3974 -4017 -857 -933 -3976 -4017 -826 -910 -3981 -4012 -794 -888 -3986 -4019 -774 -872 -3992 -4024 -755 -858 Q -4022 -4084 -668 -811 -4109 -4151 -601 -778 -4141 -4178 -580 -765 -4173 -4207 -558 -754 -4198 -4227 -543 -745 -4225 -4247 -530 -736 L -4246 -4265 -521 -726 Q -4309 -4314 -495 -700 -4380 -4364 -520 -687 -4477 -4446 -554 -683 -4557 -4529 -626 -679 -4609 -4576 -673 -686 -4624 -4624 -739 -703 L -4627 -4630 -757 -717 -4628 -4634 -768 -725 Q -4633 -4638 -829 -772 -4619 -4612 -879 -812 -4586 -4556 -999 -900 -4447 -4473 -1060 -954 -4401 -4445 -1038 -969 -4377 -4416 -1045 -984 -4309 -4369 -1066 -1006 -4247 -4314 -1098 -1020 L -4220 -4292 -1098 -1025 -4138 -4225 -1090 -1031 Q -4009 -4137 -1071 -1033 -3983 -4054 -950 -1005 L -3979 -4037 -927 -985 -3976 -4033 -896 -963 -3974 -4017 -857 -933 -3976 -4017 -826 -910 -3981 -4012 -794 -888 -3986 -4019 -774 -872 -3992 -4024 -755 -858 Q -4022 -4084 -668 -811 -4109 -4151 -601 -778 -4141 -4178 -580 -765 -4173 -4207 -558 -754 -4198 -4227 -543 -745 -4225 -4247 -530 -736 L -4246 -4265 -521 -726 Q -4309 -4314 -495 -700 -4380 -4364 -520 -687 -4477 -4446 -554 -683 -4557 -4529 -626 -679 -4609 -4576 -673 -686 -4624 -4624 -739 -703 L -4627 -4630 -757 -717 -4628 -4634 -768 -725 M -4218 -4237 -948 -953 Q -4218 -4225 -970 -972 -4217 -4202 -993 -983 -4198 -4132 -1008 -961 -4179 -4140 -1023 -924 -4093 -4143 -1027 -910 -4095 -4147 -943 -895 L -4102 -4159 -928 -880 -4109 -4167 -920 -877 -4122 -4197 -908 -878 Q -4177 -4231 -894 -901 -4214 -4237 -933 -938 L -4218 -4237 -948 -953 Q -4218 -4225 -970 -972 -4217 -4202 -993 -983 -4198 -4132 -1008 -961 -4179 -4140 -1023 -924 -4093 -4143 -1027 -910 -4095 -4147 -943 -895 L -4102 -4159 -928 -880 -4109 -4167 -920 -877 -4122 -4197 -908 -878 Q -4177 -4231 -894 -901 -4214 -4237 -933 -938 L -4218 -4237 -948 -953 M -3710 -3730 -1310 -1209 Q -3682 -3711 -1386 -1271 -3615 -3662 -1431 -1315 L -3579 -3644 -1460 -1349 -3577 -3636 -1475 -1361 Q -3560 -3620 -1495 -1378 -3536 -3603 -1508 -1396 -3476 -3567 -1541 -1429 -3413 -3517 -1557 -1450 L -3389 -3499 -1563 -1457 Q -3317 -3439 -1560 -1480 -3244 -3379 -1556 -1490 -3113 -3249 -1523 -1511 -3042 -3165 -1387 -1452 -3009 -3121 -1322 -1421 -3002 -3090 -1261 -1368 -3002 -3081 -1239 -1354 -3001 -3084 -1217 -1335 -3006 -3094 -1124 -1249 -3076 -3139 -1039 -1185 -3143 -3185 -957 -1118 -3242 -3270 -917 -1076 L -3263 -3287 -909 -1068 Q -3418 -3399 -854 -1017 -3551 -3520 -931 -993 -3596 -3562 -958 -992 -3639 -3604 -1000 -990 -3725 -3694 -1084 -1004 -3730 -3728 -1188 -1108 -3733 -3745 -1245 -1158 -3710 -3730 -1308 -1209 L -3710 -3730 -1310 -1209 M -3656 -3695 -1287 -1172 Q -3583 -3678 -1456 -1265 -3384 -3593 -1493 -1307 L -3332 -3552 -1493 -1345 Q -3330 -3471 -1491 -1407 -3327 -3369 -1488 -1425 -3123 -3322 -1479 -1425 -3078 -3275 -1279 -1424 -3036 -3108 -1088 -1417 -3217 -3142 -984 -1268 -3404 -3320 -877 -1027 -3579 -3624 -1007 -1038 -3729 -3712 -1119 -1078 -3656 -3695 -1287 -1172 -3583 -3678 -1456 -1265 -3384 -3593 -1493 -1307 L -3332 -3552 -1493 -1345 Q -3330 -3471 -1491 -1407 -3327 -3369 -1488 -1425 -3123 -3322 -1479 -1425 -3078 -3275 -1279 -1424 -3036 -3108 -1088 -1417 -3217 -3142 -984 -1268 -3404 -3320 -877 -1027 -3579 -3624 -1007 -1038 -3729 -3712 -1119 -1078 -3656 -3695 -1287 -1172 M -3238 -3382 -1398 -1323 Q -3221 -3369 -1413 -1335 -3203 -3355 -1414 -1348 -3119 -3246 -1347 -1337 -3173 -3266 -1293 -1295 -3196 -3276 -1271 -1275 -3222 -3302 -1284 -1253 L -3232 -3310 -1289 -1247 -3234 -3312 -1291 -1245 Q -3270 -3349 -1316 -1233 -3269 -3372 -1344 -1263 -3269 -3375 -1362 -1282 -3255 -3379 -1381 -1301 L -3238 -3382 -1398 -1321 -3238 -3382 -1398 -1323 Q -3221 -3369 -1413 -1335 -3203 -3355 -1414 -1348 -3119 -3246 -1347 -1337 -3173 -3266 -1293 -1295 -3196 -3276 -1271 -1275 -3222 -3302 -1284 -1253 L -3232 -3310 -1289 -1247 -3234 -3312 -1291 -1245 Q -3270 -3349 -1316 -1233 -3269 -3372 -1344 -1263 -3269 -3375 -1362 -1282 -3255 -3379 -1381 -1301 L -3238 -3382 -1398 -1321 -3238 -3382 -1398 -1323 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape136(ctx,ctrans,frame,ratio,time){
	var pathData="M -4634 -4587 -725 -901 L -4634 -4587 -725 -897 -4630 -4588 -717 -889 -4624 -4589 -703 -874 Q -4538 -4592 -673 -777 -4456 -4535 -675 -703 -4384 -4485 -677 -638 -4314 -4404 -704 -618 -4280 -4362 -717 -613 -4247 -4321 -736 -608 L -4207 -4276 -754 -612 Q -4113 -4174 -790 -630 -4034 -4103 -851 -729 L -4024 -4097 -858 -738 -4019 -4086 -872 -755 -4012 -4078 -888 -769 -4017 -4067 -910 -795 -4017 -4058 -933 -820 -4033 -4050 -963 -852 -4037 -4047 -975 -868 -4037 -4049 -985 -879 -4054 -4050 -1005 -899 Q -4115 -4062 -1026 -969 -4179 -4111 -1030 -1023 L -4292 -4196 -1025 -1104 Q -4389 -4287 -1006 -1147 -4464 -4392 -960 -1140 -4553 -4518 -905 -1100 -4612 -4563 -812 -993 -4638 -4581 -772 -952 -4634 -4587 -725 -901 M -4662 -4624 -771 -883 L -4662 -4624 -771 -881 Q -4684 -4632 -693 -807 -4616 -4605 -663 -746 -4575 -4588 -646 -705 -4533 -4555 -640 -670 -4474 -4506 -642 -619 -4415 -4450 -644 -593 -4319 -4359 -664 -551 -4229 -4250 -699 -578 -4151 -4161 -729 -600 -4077 -4105 -770 -670 L -4041 -4079 -791 -706 Q -3984 -4040 -824 -765 -3973 -4026 -884 -824 -3944 -3995 -1034 -950 -4089 -4080 -1080 -1074 L -4153 -4124 -1079 -1130 -4167 -4139 -1079 -1135 -4310 -4289 -1060 -1180 -4395 -4383 -1037 -1177 -4446 -4440 -1017 -1162 Q -4512 -4508 -988 -1137 -4559 -4548 -944 -1081 -4632 -4612 -876 -991 -4662 -4624 -771 -883 M -3695 -3825 -1172 -1056 Q -3712 -3767 -1078 -981 -3624 -3682 -1038 -971 L -3535 -3590 -1040 -978 Q -3428 -3494 -1050 -1001 -3339 -3404 -1096 -1043 -3226 -3266 -1154 -1149 -3142 -3384 -1272 -1270 -3111 -3470 -1413 -1354 -3265 -3597 -1424 -1357 L -3275 -3607 -1424 -1357 -3369 -3703 -1425 -1365 -3405 -3743 -1417 -1371 -3446 -3782 -1404 -1373 Q -3503 -3840 -1383 -1327 -3552 -3864 -1345 -1277 L -3593 -3883 -1307 -1219 Q -3678 -3891 -1265 -1141 -3695 -3825 -1172 -1056 M -3730 -3902 -1209 -1092 L -3730 -3902 -1207 -1092 Q -3745 -3883 -1157 -1043 -3728 -3843 -1108 -1010 L -3716 -3818 -1077 -992 Q -3662 -3706 -965 -922 -3520 -3589 -993 -932 -3431 -3504 -1010 -939 -3348 -3417 -1042 -988 -3320 -3392 -1054 -1002 -3293 -3370 -1066 -1018 L -3287 -3365 -1068 -1022 Q -3135 -3222 -1137 -1133 -3096 -3307 -1278 -1288 L -3084 -3347 -1335 -1328 Q -3081 -3362 -1354 -1340 -3090 -3376 -1368 -1351 L -3114 -3413 -1404 -1376 Q -3147 -3457 -1445 -1402 -3190 -3504 -1467 -1413 L -3242 -3561 -1487 -1420 Q -3303 -3631 -1502 -1431 -3379 -3701 -1490 -1441 L -3415 -3742 -1482 -1445 -3451 -3779 -1470 -1442 -3469 -3792 -1464 -1435 -3485 -3801 -1460 -1420 -3517 -3819 -1450 -1395 Q -3620 -3915 -1408 -1320 -3662 -3923 -1315 -1220 -3711 -3928 -1271 -1160 -3730 -3902 -1209 -1092 M -4237 -4269 -953 -1000 L -4237 -4269 -953 -998 -4237 -4269 -938 -982 -4233 -4269 -923 -963 -4224 -4264 -905 -940 Q -4210 -4243 -891 -925 -4197 -4219 -878 -923 L -4167 -4184 -877 -928 -4159 -4172 -880 -933 -4152 -4163 -888 -943 -4149 -4159 -892 -948 -4147 -4158 -895 -954 -4140 -4153 -924 -988 Q -4133 -4152 -957 -1027 -4162 -4192 -985 -1053 L -4186 -4222 -988 -1055 -4210 -4245 -979 -1035 Q -4227 -4257 -968 -1017 -4237 -4269 -953 -1000 M -3382 -3546 -1323 -1278 Q -3380 -3572 -1312 -1212 -3379 -3510 -1301 -1185 L -3372 -3464 -1263 -1187 Q -3349 -3346 -1233 -1265 -3302 -3504 -1253 -1316 -3221 -3509 -1321 -1314 -3299 -3514 -1370 -1313 -3347 -3537 -1363 -1301 -3382 -3546 -1323 -1278";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -4237 -4269 -953 -1000 L -4237 -4269 -953 -998 -4237 -4269 -938 -982 -4233 -4269 -923 -963 -4224 -4264 -905 -940 Q -4210 -4243 -891 -925 -4197 -4219 -878 -923 L -4167 -4184 -877 -928 -4159 -4172 -880 -933 -4152 -4163 -888 -943 -4149 -4159 -892 -948 -4147 -4158 -895 -954 -4140 -4153 -924 -988 Q -4133 -4152 -957 -1027 -4162 -4192 -985 -1053 L -4186 -4222 -988 -1055 -4210 -4245 -979 -1035 Q -4227 -4257 -968 -1017 -4237 -4269 -953 -1000 M -4634 -4587 -725 -901 L -4634 -4587 -725 -897 -4630 -4588 -717 -889 -4624 -4589 -703 -874 Q -4538 -4592 -673 -777 -4456 -4535 -675 -703 -4384 -4485 -677 -638 -4314 -4404 -704 -618 -4280 -4362 -717 -613 -4247 -4321 -736 -608 L -4207 -4276 -754 -612 Q -4113 -4174 -790 -630 -4034 -4103 -851 -729 L -4024 -4097 -858 -738 -4019 -4086 -872 -755 -4012 -4078 -888 -769 -4017 -4067 -910 -795 -4017 -4058 -933 -820 -4033 -4050 -963 -852 -4037 -4047 -975 -868 -4037 -4049 -985 -879 -4054 -4050 -1005 -899 Q -4115 -4062 -1026 -969 -4179 -4111 -1030 -1023 L -4292 -4196 -1025 -1104 Q -4389 -4287 -1006 -1147 -4464 -4392 -960 -1140 -4553 -4518 -905 -1100 -4612 -4563 -812 -993 -4638 -4581 -772 -952 -4634 -4587 -725 -901 M -3382 -3546 -1323 -1278 Q -3380 -3572 -1312 -1212 -3379 -3510 -1301 -1185 L -3372 -3464 -1263 -1187 Q -3349 -3346 -1233 -1265 -3302 -3504 -1253 -1316 -3221 -3509 -1321 -1314 -3299 -3514 -1370 -1313 -3347 -3537 -1363 -1301 -3382 -3546 -1323 -1278 M -3695 -3825 -1172 -1056 Q -3712 -3767 -1078 -981 -3624 -3682 -1038 -971 L -3535 -3590 -1040 -978 Q -3428 -3494 -1050 -1001 -3339 -3404 -1096 -1043 -3226 -3266 -1154 -1149 -3142 -3384 -1272 -1270 -3111 -3470 -1413 -1354 -3265 -3597 -1424 -1357 L -3275 -3607 -1424 -1357 -3369 -3703 -1425 -1365 -3405 -3743 -1417 -1371 -3446 -3782 -1404 -1373 Q -3503 -3840 -1383 -1327 -3552 -3864 -1345 -1277 L -3593 -3883 -1307 -1219 Q -3678 -3891 -1265 -1141 -3695 -3825 -1172 -1056";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -4662 -4624 -771 -883 Q -4632 -4612 -876 -991 -4559 -4548 -944 -1081 -4512 -4508 -988 -1137 -4446 -4440 -1017 -1162 L -4395 -4383 -1037 -1177 -4310 -4289 -1060 -1180 -4167 -4139 -1079 -1135 -4153 -4124 -1079 -1130 -4089 -4080 -1080 -1074 Q -3944 -3995 -1034 -950 -3973 -4026 -884 -824 -3984 -4040 -824 -765 -4041 -4079 -791 -706 L -4077 -4105 -770 -670 Q -4151 -4161 -729 -600 -4229 -4250 -699 -578 -4319 -4359 -664 -551 -4415 -4450 -644 -593 -4474 -4506 -642 -619 -4533 -4555 -640 -670 -4575 -4588 -646 -705 -4616 -4605 -663 -746 -4684 -4632 -693 -807 -4662 -4624 -771 -881 L -4662 -4624 -771 -883 M -4634 -4587 -725 -901 Q -4638 -4581 -772 -952 -4612 -4563 -812 -993 -4553 -4518 -905 -1100 -4464 -4392 -960 -1140 -4389 -4287 -1006 -1147 -4292 -4196 -1025 -1104 L -4179 -4111 -1030 -1023 Q -4115 -4062 -1026 -969 -4054 -4050 -1005 -899 L -4037 -4049 -985 -879 -4037 -4047 -975 -868 -4033 -4050 -963 -852 -4017 -4058 -933 -820 -4017 -4067 -910 -795 -4012 -4078 -888 -769 -4019 -4086 -872 -755 -4024 -4097 -858 -738 -4034 -4103 -851 -729 Q -4113 -4174 -790 -630 -4207 -4276 -754 -612 L -4247 -4321 -736 -608 Q -4280 -4362 -717 -613 -4314 -4404 -704 -618 -4384 -4485 -677 -638 -4456 -4535 -675 -703 -4538 -4592 -673 -777 -4624 -4589 -703 -874 L -4630 -4588 -717 -889 -4634 -4587 -725 -897 -4634 -4587 -725 -901 Q -4638 -4581 -772 -952 -4612 -4563 -812 -993 -4553 -4518 -905 -1100 -4464 -4392 -960 -1140 -4389 -4287 -1006 -1147 -4292 -4196 -1025 -1104 L -4179 -4111 -1030 -1023 Q -4115 -4062 -1026 -969 -4054 -4050 -1005 -899 L -4037 -4049 -985 -879 -4037 -4047 -975 -868 -4033 -4050 -963 -852 -4017 -4058 -933 -820 -4017 -4067 -910 -795 -4012 -4078 -888 -769 -4019 -4086 -872 -755 -4024 -4097 -858 -738 -4034 -4103 -851 -729 Q -4113 -4174 -790 -630 -4207 -4276 -754 -612 L -4247 -4321 -736 -608 Q -4280 -4362 -717 -613 -4314 -4404 -704 -618 -4384 -4485 -677 -638 -4456 -4535 -675 -703 -4538 -4592 -673 -777 -4624 -4589 -703 -874 L -4630 -4588 -717 -889 -4634 -4587 -725 -897 -4634 -4587 -725 -901 M -4237 -4269 -953 -1000 Q -4227 -4257 -968 -1017 -4210 -4245 -979 -1035 L -4186 -4222 -988 -1055 -4162 -4192 -985 -1053 Q -4133 -4152 -957 -1027 -4140 -4153 -924 -988 L -4147 -4158 -895 -954 -4149 -4159 -892 -948 -4152 -4163 -888 -943 -4159 -4172 -880 -933 -4167 -4184 -877 -928 -4197 -4219 -878 -923 Q -4210 -4243 -891 -925 -4224 -4264 -905 -940 L -4233 -4269 -923 -963 -4237 -4269 -938 -982 -4237 -4269 -953 -998 -4237 -4269 -953 -1000 Q -4227 -4257 -968 -1017 -4210 -4245 -979 -1035 L -4186 -4222 -988 -1055 -4162 -4192 -985 -1053 Q -4133 -4152 -957 -1027 -4140 -4153 -924 -988 L -4147 -4158 -895 -954 -4149 -4159 -892 -948 -4152 -4163 -888 -943 -4159 -4172 -880 -933 -4167 -4184 -877 -928 -4197 -4219 -878 -923 Q -4210 -4243 -891 -925 -4224 -4264 -905 -940 L -4233 -4269 -923 -963 -4237 -4269 -938 -982 -4237 -4269 -953 -998 -4237 -4269 -953 -1000 M -3730 -3902 -1209 -1092 Q -3711 -3928 -1271 -1160 -3662 -3923 -1315 -1220 -3620 -3915 -1408 -1320 -3517 -3819 -1450 -1395 L -3485 -3801 -1460 -1420 -3469 -3792 -1464 -1435 -3451 -3779 -1470 -1442 -3415 -3742 -1482 -1445 -3379 -3701 -1490 -1441 Q -3303 -3631 -1502 -1431 -3242 -3561 -1487 -1420 L -3190 -3504 -1467 -1413 Q -3147 -3457 -1445 -1402 -3114 -3413 -1404 -1376 L -3090 -3376 -1368 -1351 Q -3081 -3362 -1354 -1340 -3084 -3347 -1335 -1328 L -3096 -3307 -1278 -1288 Q -3135 -3222 -1137 -1133 -3287 -3365 -1068 -1022 L -3293 -3370 -1066 -1018 Q -3320 -3392 -1054 -1002 -3348 -3417 -1042 -988 -3431 -3504 -1010 -939 -3520 -3589 -993 -932 -3662 -3706 -965 -922 -3716 -3818 -1077 -992 L -3728 -3843 -1108 -1010 Q -3745 -3883 -1157 -1043 -3730 -3902 -1207 -1092 L -3730 -3902 -1209 -1092 M -3695 -3825 -1172 -1056 Q -3678 -3891 -1265 -1141 -3593 -3883 -1307 -1219 L -3552 -3864 -1345 -1277 Q -3503 -3840 -1383 -1327 -3446 -3782 -1404 -1373 L -3405 -3743 -1417 -1371 -3369 -3703 -1425 -1365 -3275 -3607 -1424 -1357 -3265 -3597 -1424 -1357 Q -3111 -3470 -1413 -1354 -3142 -3384 -1272 -1270 -3226 -3266 -1154 -1149 -3339 -3404 -1096 -1043 -3428 -3494 -1050 -1001 -3535 -3590 -1040 -978 L -3624 -3682 -1038 -971 Q -3712 -3767 -1078 -981 -3695 -3825 -1172 -1056 -3678 -3891 -1265 -1141 -3593 -3883 -1307 -1219 L -3552 -3864 -1345 -1277 Q -3503 -3840 -1383 -1327 -3446 -3782 -1404 -1373 L -3405 -3743 -1417 -1371 -3369 -3703 -1425 -1365 -3275 -3607 -1424 -1357 -3265 -3597 -1424 -1357 Q -3111 -3470 -1413 -1354 -3142 -3384 -1272 -1270 -3226 -3266 -1154 -1149 -3339 -3404 -1096 -1043 -3428 -3494 -1050 -1001 -3535 -3590 -1040 -978 L -3624 -3682 -1038 -971 Q -3712 -3767 -1078 -981 -3695 -3825 -1172 -1056 M -3382 -3546 -1323 -1278 Q -3347 -3537 -1363 -1301 -3299 -3514 -1370 -1313 -3221 -3509 -1321 -1314 -3302 -3504 -1253 -1316 -3349 -3346 -1233 -1265 -3372 -3464 -1263 -1187 L -3379 -3510 -1301 -1185 Q -3380 -3572 -1312 -1212 -3382 -3546 -1323 -1278 -3347 -3537 -1363 -1301 -3299 -3514 -1370 -1313 -3221 -3509 -1321 -1314 -3302 -3504 -1253 -1316 -3349 -3346 -1233 -1265 -3372 -3464 -1263 -1187 L -3379 -3510 -1301 -1185 Q -3380 -3572 -1312 -1212 -3382 -3546 -1323 -1278 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape137(ctx,ctrans,frame,ratio,time){
	var pathData="M -4587 -4634 -901 -725 L -4587 -4634 -897 -725 -4588 -4630 -889 -717 -4589 -4624 -874 -703 Q -4592 -4538 -777 -673 -4535 -4456 -703 -675 -4485 -4384 -638 -677 -4404 -4314 -618 -704 -4362 -4280 -613 -717 -4321 -4247 -608 -736 L -4276 -4207 -612 -754 Q -4174 -4113 -630 -790 -4103 -4034 -729 -851 L -4097 -4024 -738 -858 -4086 -4019 -755 -872 -4078 -4012 -769 -888 -4067 -4017 -795 -910 -4058 -4017 -820 -933 -4050 -4033 -852 -963 -4047 -4037 -868 -975 -4049 -4037 -879 -985 -4050 -4054 -899 -1005 Q -4062 -4115 -969 -1026 -4111 -4179 -1023 -1030 L -4196 -4292 -1104 -1025 Q -4287 -4389 -1147 -1006 -4392 -4464 -1140 -960 -4518 -4553 -1100 -905 -4563 -4612 -993 -812 -4581 -4638 -952 -772 -4587 -4634 -901 -725 M -4624 -4662 -883 -771 Q -4632 -4684 -807 -693 -4605 -4616 -746 -663 -4588 -4575 -705 -646 -4555 -4533 -670 -640 -4506 -4474 -619 -642 -4450 -4415 -593 -644 -4359 -4319 -551 -664 -4250 -4229 -578 -699 -4161 -4151 -600 -729 -4105 -4077 -670 -770 L -4079 -4041 -706 -791 Q -4040 -3984 -765 -824 -4026 -3973 -824 -884 -3995 -3944 -950 -1034 -4080 -4089 -1074 -1080 L -4124 -4153 -1130 -1079 -4139 -4167 -1135 -1079 -4289 -4310 -1180 -1060 -4383 -4395 -1177 -1037 -4440 -4446 -1162 -1017 Q -4508 -4512 -1137 -988 -4548 -4559 -1081 -944 -4612 -4632 -991 -876 -4624 -4662 -883 -771 M -3825 -3695 -1056 -1172 Q -3767 -3712 -981 -1078 -3682 -3624 -971 -1038 L -3590 -3535 -978 -1040 Q -3494 -3428 -1001 -1050 -3404 -3339 -1043 -1096 -3266 -3226 -1149 -1154 -3384 -3142 -1270 -1272 -3470 -3111 -1354 -1413 -3597 -3265 -1357 -1424 L -3607 -3275 -1357 -1424 -3703 -3369 -1365 -1425 -3743 -3405 -1371 -1417 -3782 -3446 -1373 -1404 Q -3840 -3503 -1327 -1383 -3864 -3552 -1277 -1345 L -3883 -3593 -1219 -1307 Q -3891 -3678 -1141 -1265 -3825 -3695 -1056 -1172 M -3902 -3730 -1092 -1209 L -3902 -3730 -1092 -1207 Q -3883 -3745 -1043 -1157 -3843 -3728 -1010 -1108 L -3818 -3716 -992 -1077 Q -3706 -3662 -922 -965 -3589 -3520 -932 -993 -3504 -3431 -939 -1010 -3417 -3348 -988 -1042 -3392 -3320 -1002 -1054 -3370 -3293 -1018 -1066 L -3365 -3287 -1022 -1068 Q -3222 -3135 -1133 -1137 -3307 -3096 -1288 -1278 L -3347 -3084 -1328 -1335 Q -3362 -3081 -1340 -1354 -3376 -3090 -1351 -1368 L -3413 -3114 -1376 -1404 Q -3457 -3147 -1402 -1445 -3504 -3190 -1413 -1467 L -3561 -3242 -1420 -1487 Q -3631 -3303 -1431 -1502 -3701 -3379 -1441 -1490 L -3742 -3415 -1445 -1482 -3779 -3451 -1442 -1470 -3792 -3469 -1435 -1464 -3801 -3485 -1420 -1460 -3819 -3517 -1395 -1450 Q -3915 -3620 -1320 -1408 -3923 -3662 -1220 -1315 -3928 -3711 -1160 -1271 -3902 -3730 -1092 -1209 M -4269 -4383 -1000 -945 L -4269 -4383 -996 -945 -4269 -4382 -990 -938 -4269 -4358 -963 -914 -4266 -4344 -944 -900 -4264 -4342 -940 -900 Q -4222 -4289 -910 -896 -4172 -4264 -933 -936 L -4165 -4259 -941 -945 -4159 -4260 -948 -957 -4155 -4270 -970 -975 -4154 -4273 -978 -979 Q -4150 -4288 -1007 -992 -4163 -4302 -1029 -1005 L -4184 -4330 -1053 -1007 -4198 -4342 -1053 -1008 Q -4210 -4342 -1054 -1007 -4222 -4360 -1055 -1000 L -4249 -4379 -1029 -975 -4269 -4383 -1000 -945 M -3546 -3489 -1278 -1348 L -3546 -3489 -1278 -1346 -3552 -3489 -1259 -1325 -3554 -3489 -1242 -1310 Q -3553 -3461 -1204 -1272 -3510 -3423 -1185 -1271 -3487 -3401 -1186 -1271 -3464 -3376 -1187 -1283 L -3455 -3364 -1193 -1290 -3443 -3360 -1203 -1298 Q -3361 -3310 -1269 -1398 -3475 -3429 -1317 -1403 L -3504 -3451 -1316 -1393 -3538 -3487 -1292 -1363 -3546 -3489 -1278 -1348";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -4269 -4383 -1000 -945 L -4269 -4383 -996 -945 -4269 -4382 -990 -938 -4269 -4358 -963 -914 -4266 -4344 -944 -900 -4264 -4342 -940 -900 Q -4222 -4289 -910 -896 -4172 -4264 -933 -936 L -4165 -4259 -941 -945 -4159 -4260 -948 -957 -4155 -4270 -970 -975 -4154 -4273 -978 -979 Q -4150 -4288 -1007 -992 -4163 -4302 -1029 -1005 L -4184 -4330 -1053 -1007 -4198 -4342 -1053 -1008 Q -4210 -4342 -1054 -1007 -4222 -4360 -1055 -1000 L -4249 -4379 -1029 -975 -4269 -4383 -1000 -945 M -4587 -4634 -901 -725 L -4587 -4634 -897 -725 -4588 -4630 -889 -717 -4589 -4624 -874 -703 Q -4592 -4538 -777 -673 -4535 -4456 -703 -675 -4485 -4384 -638 -677 -4404 -4314 -618 -704 -4362 -4280 -613 -717 -4321 -4247 -608 -736 L -4276 -4207 -612 -754 Q -4174 -4113 -630 -790 -4103 -4034 -729 -851 L -4097 -4024 -738 -858 -4086 -4019 -755 -872 -4078 -4012 -769 -888 -4067 -4017 -795 -910 -4058 -4017 -820 -933 -4050 -4033 -852 -963 -4047 -4037 -868 -975 -4049 -4037 -879 -985 -4050 -4054 -899 -1005 Q -4062 -4115 -969 -1026 -4111 -4179 -1023 -1030 L -4196 -4292 -1104 -1025 Q -4287 -4389 -1147 -1006 -4392 -4464 -1140 -960 -4518 -4553 -1100 -905 -4563 -4612 -993 -812 -4581 -4638 -952 -772 -4587 -4634 -901 -725 M -3546 -3489 -1278 -1348 L -3546 -3489 -1278 -1346 -3552 -3489 -1259 -1325 -3554 -3489 -1242 -1310 Q -3553 -3461 -1204 -1272 -3510 -3423 -1185 -1271 -3487 -3401 -1186 -1271 -3464 -3376 -1187 -1283 L -3455 -3364 -1193 -1290 -3443 -3360 -1203 -1298 Q -3361 -3310 -1269 -1398 -3475 -3429 -1317 -1403 L -3504 -3451 -1316 -1393 -3538 -3487 -1292 -1363 -3546 -3489 -1278 -1348 M -3825 -3695 -1056 -1172 Q -3767 -3712 -981 -1078 -3682 -3624 -971 -1038 L -3590 -3535 -978 -1040 Q -3494 -3428 -1001 -1050 -3404 -3339 -1043 -1096 -3266 -3226 -1149 -1154 -3384 -3142 -1270 -1272 -3470 -3111 -1354 -1413 -3597 -3265 -1357 -1424 L -3607 -3275 -1357 -1424 -3703 -3369 -1365 -1425 -3743 -3405 -1371 -1417 -3782 -3446 -1373 -1404 Q -3840 -3503 -1327 -1383 -3864 -3552 -1277 -1345 L -3883 -3593 -1219 -1307 Q -3891 -3678 -1141 -1265 -3825 -3695 -1056 -1172";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -4624 -4662 -883 -771 Q -4612 -4632 -991 -876 -4548 -4559 -1081 -944 -4508 -4512 -1137 -988 -4440 -4446 -1162 -1017 L -4383 -4395 -1177 -1037 -4289 -4310 -1180 -1060 -4139 -4167 -1135 -1079 -4124 -4153 -1130 -1079 -4080 -4089 -1074 -1080 Q -3995 -3944 -950 -1034 -4026 -3973 -824 -884 -4040 -3984 -765 -824 -4079 -4041 -706 -791 L -4105 -4077 -670 -770 Q -4161 -4151 -600 -729 -4250 -4229 -578 -699 -4359 -4319 -551 -664 -4450 -4415 -593 -644 -4506 -4474 -619 -642 -4555 -4533 -670 -640 -4588 -4575 -705 -646 -4605 -4616 -746 -663 -4632 -4684 -807 -693 -4624 -4662 -883 -771 M -4587 -4634 -901 -725 Q -4581 -4638 -952 -772 -4563 -4612 -993 -812 -4518 -4553 -1100 -905 -4392 -4464 -1140 -960 -4287 -4389 -1147 -1006 -4196 -4292 -1104 -1025 L -4111 -4179 -1023 -1030 Q -4062 -4115 -969 -1026 -4050 -4054 -899 -1005 L -4049 -4037 -879 -985 -4047 -4037 -868 -975 -4050 -4033 -852 -963 -4058 -4017 -820 -933 -4067 -4017 -795 -910 -4078 -4012 -769 -888 -4086 -4019 -755 -872 -4097 -4024 -738 -858 -4103 -4034 -729 -851 Q -4174 -4113 -630 -790 -4276 -4207 -612 -754 L -4321 -4247 -608 -736 Q -4362 -4280 -613 -717 -4404 -4314 -618 -704 -4485 -4384 -638 -677 -4535 -4456 -703 -675 -4592 -4538 -777 -673 -4589 -4624 -874 -703 L -4588 -4630 -889 -717 -4587 -4634 -897 -725 -4587 -4634 -901 -725 Q -4581 -4638 -952 -772 -4563 -4612 -993 -812 -4518 -4553 -1100 -905 -4392 -4464 -1140 -960 -4287 -4389 -1147 -1006 -4196 -4292 -1104 -1025 L -4111 -4179 -1023 -1030 Q -4062 -4115 -969 -1026 -4050 -4054 -899 -1005 L -4049 -4037 -879 -985 -4047 -4037 -868 -975 -4050 -4033 -852 -963 -4058 -4017 -820 -933 -4067 -4017 -795 -910 -4078 -4012 -769 -888 -4086 -4019 -755 -872 -4097 -4024 -738 -858 -4103 -4034 -729 -851 Q -4174 -4113 -630 -790 -4276 -4207 -612 -754 L -4321 -4247 -608 -736 Q -4362 -4280 -613 -717 -4404 -4314 -618 -704 -4485 -4384 -638 -677 -4535 -4456 -703 -675 -4592 -4538 -777 -673 -4589 -4624 -874 -703 L -4588 -4630 -889 -717 -4587 -4634 -897 -725 -4587 -4634 -901 -725 M -4269 -4383 -1000 -945 L -4249 -4379 -1029 -975 -4222 -4360 -1055 -1000 Q -4210 -4342 -1054 -1007 -4198 -4342 -1053 -1008 L -4184 -4330 -1053 -1007 -4163 -4302 -1029 -1005 Q -4150 -4288 -1007 -992 -4154 -4273 -978 -979 L -4155 -4270 -970 -975 -4159 -4260 -948 -957 -4165 -4259 -941 -945 -4172 -4264 -933 -936 Q -4222 -4289 -910 -896 -4264 -4342 -940 -900 L -4266 -4344 -944 -900 -4269 -4358 -963 -914 -4269 -4382 -990 -938 -4269 -4383 -996 -945 -4269 -4383 -1000 -945 -4249 -4379 -1029 -975 -4222 -4360 -1055 -1000 Q -4210 -4342 -1054 -1007 -4198 -4342 -1053 -1008 L -4184 -4330 -1053 -1007 -4163 -4302 -1029 -1005 Q -4150 -4288 -1007 -992 -4154 -4273 -978 -979 L -4155 -4270 -970 -975 -4159 -4260 -948 -957 -4165 -4259 -941 -945 -4172 -4264 -933 -936 Q -4222 -4289 -910 -896 -4264 -4342 -940 -900 L -4266 -4344 -944 -900 -4269 -4358 -963 -914 -4269 -4382 -990 -938 -4269 -4383 -996 -945 -4269 -4383 -1000 -945 M -3902 -3730 -1092 -1209 Q -3928 -3711 -1160 -1271 -3923 -3662 -1220 -1315 -3915 -3620 -1320 -1408 -3819 -3517 -1395 -1450 L -3801 -3485 -1420 -1460 -3792 -3469 -1435 -1464 -3779 -3451 -1442 -1470 -3742 -3415 -1445 -1482 -3701 -3379 -1441 -1490 Q -3631 -3303 -1431 -1502 -3561 -3242 -1420 -1487 L -3504 -3190 -1413 -1467 Q -3457 -3147 -1402 -1445 -3413 -3114 -1376 -1404 L -3376 -3090 -1351 -1368 Q -3362 -3081 -1340 -1354 -3347 -3084 -1328 -1335 L -3307 -3096 -1288 -1278 Q -3222 -3135 -1133 -1137 -3365 -3287 -1022 -1068 L -3370 -3293 -1018 -1066 Q -3392 -3320 -1002 -1054 -3417 -3348 -988 -1042 -3504 -3431 -939 -1010 -3589 -3520 -932 -993 -3706 -3662 -922 -965 -3818 -3716 -992 -1077 L -3843 -3728 -1010 -1108 Q -3883 -3745 -1043 -1157 -3902 -3730 -1092 -1207 L -3902 -3730 -1092 -1209 M -3825 -3695 -1056 -1172 Q -3891 -3678 -1141 -1265 -3883 -3593 -1219 -1307 L -3864 -3552 -1277 -1345 Q -3840 -3503 -1327 -1383 -3782 -3446 -1373 -1404 L -3743 -3405 -1371 -1417 -3703 -3369 -1365 -1425 -3607 -3275 -1357 -1424 -3597 -3265 -1357 -1424 Q -3470 -3111 -1354 -1413 -3384 -3142 -1270 -1272 -3266 -3226 -1149 -1154 -3404 -3339 -1043 -1096 -3494 -3428 -1001 -1050 -3590 -3535 -978 -1040 L -3682 -3624 -971 -1038 Q -3767 -3712 -981 -1078 -3825 -3695 -1056 -1172 -3891 -3678 -1141 -1265 -3883 -3593 -1219 -1307 L -3864 -3552 -1277 -1345 Q -3840 -3503 -1327 -1383 -3782 -3446 -1373 -1404 L -3743 -3405 -1371 -1417 -3703 -3369 -1365 -1425 -3607 -3275 -1357 -1424 -3597 -3265 -1357 -1424 Q -3470 -3111 -1354 -1413 -3384 -3142 -1270 -1272 -3266 -3226 -1149 -1154 -3404 -3339 -1043 -1096 -3494 -3428 -1001 -1050 -3590 -3535 -978 -1040 L -3682 -3624 -971 -1038 Q -3767 -3712 -981 -1078 -3825 -3695 -1056 -1172 M -3546 -3489 -1278 -1348 L -3538 -3487 -1292 -1363 -3504 -3451 -1316 -1393 -3475 -3429 -1317 -1403 Q -3361 -3310 -1269 -1398 -3443 -3360 -1203 -1298 L -3455 -3364 -1193 -1290 -3464 -3376 -1187 -1283 Q -3487 -3401 -1186 -1271 -3510 -3423 -1185 -1271 -3553 -3461 -1204 -1272 -3554 -3489 -1242 -1310 L -3552 -3489 -1259 -1325 -3546 -3489 -1278 -1346 -3546 -3489 -1278 -1348 -3538 -3487 -1292 -1363 -3504 -3451 -1316 -1393 -3475 -3429 -1317 -1403 Q -3361 -3310 -1269 -1398 -3443 -3360 -1203 -1298 L -3455 -3364 -1193 -1290 -3464 -3376 -1187 -1283 Q -3487 -3401 -1186 -1271 -3510 -3423 -1185 -1271 -3553 -3461 -1204 -1272 -3554 -3489 -1242 -1310 L -3552 -3489 -1259 -1325 -3546 -3489 -1278 -1346 -3546 -3489 -1278 -1348 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape138(ctx,ctrans,frame,ratio,time){
	var pathData="M -4634 -4607 -725 -1003 L -4634 -4609 -725 -997 -4630 -4611 -717 -991 -4624 -4616 -703 -975 Q -4469 -4664 -649 -792 -4326 -4499 -700 -673 -4286 -4455 -714 -640 -4247 -4405 -736 -630 L -4207 -4358 -754 -625 -4156 -4296 -776 -632 Q -4086 -4202 -809 -654 -4019 -4124 -872 -723 L -4012 -4112 -888 -736 -4017 -4095 -910 -757 -4017 -4080 -933 -780 -4033 -4063 -963 -809 -4037 -4052 -985 -834 -4054 -4045 -1005 -854 Q -4168 -3993 -1044 -999 -4292 -4123 -1025 -1095 -4394 -4216 -1005 -1162 -4472 -4334 -955 -1162 L -4495 -4367 -939 -1160 Q -4547 -4436 -901 -1135 -4587 -4502 -848 -1102 L -4612 -4543 -812 -1082 Q -4629 -4567 -786 -1061 -4633 -4584 -756 -1032 -4634 -4594 -740 -1016 -4634 -4607 -725 -1003 M -4662 -4663 -771 -968 Q -4684 -4678 -693 -891 -4616 -4658 -663 -819 L -4610 -4656 -661 -811 Q -4516 -4620 -623 -691 -4415 -4521 -644 -633 L -4370 -4471 -655 -609 Q -4216 -4287 -693 -537 -4077 -4131 -770 -654 L -4041 -4091 -791 -688 Q -3984 -4037 -824 -739 -3973 -4010 -884 -801 -3953 -3974 -984 -884 -4011 -3985 -1038 -985 -4027 -3988 -1049 -1008 -4042 -3998 -1060 -1027 L -4089 -4028 -1080 -1074 Q -4245 -4136 -1086 -1220 -4395 -4336 -1037 -1219 L -4423 -4369 -1027 -1218 Q -4469 -4421 -1010 -1210 -4506 -4469 -986 -1184 L -4523 -4492 -974 -1168 -4531 -4496 -968 -1160 -4535 -4497 -964 -1153 Q -4581 -4558 -928 -1135 -4613 -4599 -880 -1085 L -4648 -4652 -813 -1020 -4662 -4663 -771 -968 M -3695 -3792 -1172 -1360 Q -3712 -3842 -1078 -1263 -3624 -3825 -1038 -1176 -3530 -3808 -1035 -1089 -3448 -3725 -1055 -1012 -3337 -3628 -1083 -923 -3249 -3496 -1155 -979 -3192 -3416 -1201 -1014 -3142 -3351 -1268 -1076 -3110 -3257 -1406 -1170 -3252 -3271 -1422 -1303 L -3275 -3275 -1424 -1329 -3317 -3292 -1425 -1378 -3369 -3333 -1425 -1415 Q -3460 -3415 -1408 -1478 -3534 -3524 -1358 -1467 L -3538 -3529 -1355 -1465 -3552 -3558 -1340 -1461 Q -3554 -3587 -1326 -1454 -3593 -3615 -1307 -1447 -3657 -3687 -1276 -1424 -3692 -3774 -1188 -1365 L -3695 -3792 -1172 -1360 M -3730 -3867 -1209 -1243 L -3730 -3867 -1209 -1241 Q -3745 -3872 -1158 -1183 -3728 -3858 -1108 -1131 -3701 -3838 -1027 -1059 -3640 -3785 -1000 -998 -3591 -3735 -979 -941 -3520 -3665 -993 -932 L -3508 -3651 -995 -930 Q -3397 -3526 -1019 -920 -3287 -3401 -1068 -977 -3125 -3231 -1141 -1059 -3090 -3211 -1298 -1247 L -3084 -3209 -1335 -1285 Q -3081 -3212 -1354 -1305 -3090 -3215 -1368 -1325 L -3102 -3222 -1387 -1350 Q -3192 -3289 -1520 -1532 -3379 -3482 -1490 -1533 L -3431 -3539 -1478 -1530 Q -3474 -3588 -1467 -1522 -3553 -3679 -1432 -1490 -3628 -3776 -1391 -1451 -3662 -3823 -1315 -1379 -3711 -3861 -1271 -1321 -3730 -3867 -1209 -1243 M -4383 -4294 -945 -1049 L -4383 -4296 -945 -1043 -4382 -4300 -938 -1039 -4360 -4310 -914 -1006 -4344 -4309 -900 -985 Q -4311 -4302 -897 -954 -4289 -4264 -911 -930 -4272 -4233 -922 -931 -4259 -4203 -945 -932 -4259 -4182 -962 -940 -4270 -4174 -975 -960 -4286 -4157 -990 -999 -4302 -4161 -1005 -1026 -4322 -4165 -1006 -1055 -4342 -4195 -1006 -1071 -4361 -4231 -1005 -1075 -4379 -4267 -975 -1079 L -4383 -4294 -945 -1049 M -3489 -3583 -1348 -1319 L -3489 -3583 -1346 -1319 -3489 -3587 -1325 -1289 -3489 -3586 -1310 -1270 Q -3446 -3577 -1252 -1196 -3380 -3470 -1281 -1209 -3372 -3458 -1286 -1211 -3364 -3450 -1290 -1216 L -3360 -3438 -1298 -1227 -3354 -3431 -1310 -1240 Q -3317 -3384 -1398 -1361 -3429 -3496 -1403 -1377 L -3449 -3524 -1393 -1380 -3453 -3529 -1391 -1380 -3487 -3577 -1363 -1338 -3489 -3583 -1348 -1319";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -4383 -4294 -945 -1049 L -4383 -4296 -945 -1043 -4382 -4300 -938 -1039 -4360 -4310 -914 -1006 -4344 -4309 -900 -985 Q -4311 -4302 -897 -954 -4289 -4264 -911 -930 -4272 -4233 -922 -931 -4259 -4203 -945 -932 -4259 -4182 -962 -940 -4270 -4174 -975 -960 -4286 -4157 -990 -999 -4302 -4161 -1005 -1026 -4322 -4165 -1006 -1055 -4342 -4195 -1006 -1071 -4361 -4231 -1005 -1075 -4379 -4267 -975 -1079 L -4383 -4294 -945 -1049 M -4634 -4607 -725 -1003 L -4634 -4609 -725 -997 -4630 -4611 -717 -991 -4624 -4616 -703 -975 Q -4469 -4664 -649 -792 -4326 -4499 -700 -673 -4286 -4455 -714 -640 -4247 -4405 -736 -630 L -4207 -4358 -754 -625 -4156 -4296 -776 -632 Q -4086 -4202 -809 -654 -4019 -4124 -872 -723 L -4012 -4112 -888 -736 -4017 -4095 -910 -757 -4017 -4080 -933 -780 -4033 -4063 -963 -809 -4037 -4052 -985 -834 -4054 -4045 -1005 -854 Q -4168 -3993 -1044 -999 -4292 -4123 -1025 -1095 -4394 -4216 -1005 -1162 -4472 -4334 -955 -1162 L -4495 -4367 -939 -1160 Q -4547 -4436 -901 -1135 -4587 -4502 -848 -1102 L -4612 -4543 -812 -1082 Q -4629 -4567 -786 -1061 -4633 -4584 -756 -1032 -4634 -4594 -740 -1016 -4634 -4607 -725 -1003 M -3489 -3583 -1348 -1319 L -3489 -3583 -1346 -1319 -3489 -3587 -1325 -1289 -3489 -3586 -1310 -1270 Q -3446 -3577 -1252 -1196 -3380 -3470 -1281 -1209 -3372 -3458 -1286 -1211 -3364 -3450 -1290 -1216 L -3360 -3438 -1298 -1227 -3354 -3431 -1310 -1240 Q -3317 -3384 -1398 -1361 -3429 -3496 -1403 -1377 L -3449 -3524 -1393 -1380 -3453 -3529 -1391 -1380 -3487 -3577 -1363 -1338 -3489 -3583 -1348 -1319 M -3695 -3792 -1172 -1360 Q -3712 -3842 -1078 -1263 -3624 -3825 -1038 -1176 -3530 -3808 -1035 -1089 -3448 -3725 -1055 -1012 -3337 -3628 -1083 -923 -3249 -3496 -1155 -979 -3192 -3416 -1201 -1014 -3142 -3351 -1268 -1076 -3110 -3257 -1406 -1170 -3252 -3271 -1422 -1303 L -3275 -3275 -1424 -1329 -3317 -3292 -1425 -1378 -3369 -3333 -1425 -1415 Q -3460 -3415 -1408 -1478 -3534 -3524 -1358 -1467 L -3538 -3529 -1355 -1465 -3552 -3558 -1340 -1461 Q -3554 -3587 -1326 -1454 -3593 -3615 -1307 -1447 -3657 -3687 -1276 -1424 -3692 -3774 -1188 -1365 L -3695 -3792 -1172 -1360";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -4662 -4663 -771 -968 L -4648 -4652 -813 -1020 -4613 -4599 -880 -1085 Q -4581 -4558 -928 -1135 -4535 -4497 -964 -1153 L -4531 -4496 -968 -1160 -4523 -4492 -974 -1168 -4506 -4469 -986 -1184 Q -4469 -4421 -1010 -1210 -4423 -4369 -1027 -1218 L -4395 -4336 -1037 -1219 Q -4245 -4136 -1086 -1220 -4089 -4028 -1080 -1074 L -4042 -3998 -1060 -1027 Q -4027 -3988 -1049 -1008 -4011 -3985 -1038 -985 -3953 -3974 -984 -884 -3973 -4010 -884 -801 -3984 -4037 -824 -739 -4041 -4091 -791 -688 L -4077 -4131 -770 -654 Q -4216 -4287 -693 -537 -4370 -4471 -655 -609 L -4415 -4521 -644 -633 Q -4516 -4620 -623 -691 -4610 -4656 -661 -811 L -4616 -4658 -663 -819 Q -4684 -4678 -693 -891 -4662 -4663 -771 -968 M -4634 -4607 -725 -1003 Q -4634 -4594 -740 -1016 -4633 -4584 -756 -1032 -4629 -4567 -786 -1061 -4612 -4543 -812 -1082 L -4587 -4502 -848 -1102 Q -4547 -4436 -901 -1135 -4495 -4367 -939 -1160 L -4472 -4334 -955 -1162 Q -4394 -4216 -1005 -1162 -4292 -4123 -1025 -1095 -4168 -3993 -1044 -999 -4054 -4045 -1005 -854 L -4037 -4052 -985 -834 -4033 -4063 -963 -809 -4017 -4080 -933 -780 -4017 -4095 -910 -757 -4012 -4112 -888 -736 -4019 -4124 -872 -723 Q -4086 -4202 -809 -654 -4156 -4296 -776 -632 L -4207 -4358 -754 -625 -4247 -4405 -736 -630 Q -4286 -4455 -714 -640 -4326 -4499 -700 -673 -4469 -4664 -649 -792 -4624 -4616 -703 -975 L -4630 -4611 -717 -991 -4634 -4609 -725 -997 -4634 -4607 -725 -1003 Q -4634 -4594 -740 -1016 -4633 -4584 -756 -1032 -4629 -4567 -786 -1061 -4612 -4543 -812 -1082 L -4587 -4502 -848 -1102 Q -4547 -4436 -901 -1135 -4495 -4367 -939 -1160 L -4472 -4334 -955 -1162 Q -4394 -4216 -1005 -1162 -4292 -4123 -1025 -1095 -4168 -3993 -1044 -999 -4054 -4045 -1005 -854 L -4037 -4052 -985 -834 -4033 -4063 -963 -809 -4017 -4080 -933 -780 -4017 -4095 -910 -757 -4012 -4112 -888 -736 -4019 -4124 -872 -723 Q -4086 -4202 -809 -654 -4156 -4296 -776 -632 L -4207 -4358 -754 -625 -4247 -4405 -736 -630 Q -4286 -4455 -714 -640 -4326 -4499 -700 -673 -4469 -4664 -649 -792 -4624 -4616 -703 -975 L -4630 -4611 -717 -991 -4634 -4609 -725 -997 -4634 -4607 -725 -1003 M -4383 -4294 -945 -1049 L -4379 -4267 -975 -1079 Q -4361 -4231 -1005 -1075 -4342 -4195 -1006 -1071 -4322 -4165 -1006 -1055 -4302 -4161 -1005 -1026 -4286 -4157 -990 -999 -4270 -4174 -975 -960 -4259 -4182 -962 -940 -4259 -4203 -945 -932 -4272 -4233 -922 -931 -4289 -4264 -911 -930 -4311 -4302 -897 -954 -4344 -4309 -900 -985 L -4360 -4310 -914 -1006 -4382 -4300 -938 -1039 -4383 -4296 -945 -1043 -4383 -4294 -945 -1049 -4379 -4267 -975 -1079 Q -4361 -4231 -1005 -1075 -4342 -4195 -1006 -1071 -4322 -4165 -1006 -1055 -4302 -4161 -1005 -1026 -4286 -4157 -990 -999 -4270 -4174 -975 -960 -4259 -4182 -962 -940 -4259 -4203 -945 -932 -4272 -4233 -922 -931 -4289 -4264 -911 -930 -4311 -4302 -897 -954 -4344 -4309 -900 -985 L -4360 -4310 -914 -1006 -4382 -4300 -938 -1039 -4383 -4296 -945 -1043 -4383 -4294 -945 -1049 M -3730 -3867 -1209 -1243 Q -3711 -3861 -1271 -1321 -3662 -3823 -1315 -1379 -3628 -3776 -1391 -1451 -3553 -3679 -1432 -1490 -3474 -3588 -1467 -1522 -3431 -3539 -1478 -1530 L -3379 -3482 -1490 -1533 Q -3192 -3289 -1520 -1532 -3102 -3222 -1387 -1350 L -3090 -3215 -1368 -1325 Q -3081 -3212 -1354 -1305 -3084 -3209 -1335 -1285 L -3090 -3211 -1298 -1247 Q -3125 -3231 -1141 -1059 -3287 -3401 -1068 -977 -3397 -3526 -1019 -920 -3508 -3651 -995 -930 L -3520 -3665 -993 -932 Q -3591 -3735 -979 -941 -3640 -3785 -1000 -998 -3701 -3838 -1027 -1059 -3728 -3858 -1108 -1131 -3745 -3872 -1158 -1183 -3730 -3867 -1209 -1241 L -3730 -3867 -1209 -1243 M -3695 -3792 -1172 -1360 L -3692 -3774 -1188 -1365 Q -3657 -3687 -1276 -1424 -3593 -3615 -1307 -1447 -3554 -3587 -1326 -1454 -3552 -3558 -1340 -1461 L -3538 -3529 -1355 -1465 -3534 -3524 -1358 -1467 Q -3460 -3415 -1408 -1478 -3369 -3333 -1425 -1415 L -3317 -3292 -1425 -1378 -3275 -3275 -1424 -1329 -3252 -3271 -1422 -1303 Q -3110 -3257 -1406 -1170 -3142 -3351 -1268 -1076 -3192 -3416 -1201 -1014 -3249 -3496 -1155 -979 -3337 -3628 -1083 -923 -3448 -3725 -1055 -1012 -3530 -3808 -1035 -1089 -3624 -3825 -1038 -1176 -3712 -3842 -1078 -1263 -3695 -3792 -1172 -1360 L -3692 -3774 -1188 -1365 Q -3657 -3687 -1276 -1424 -3593 -3615 -1307 -1447 -3554 -3587 -1326 -1454 -3552 -3558 -1340 -1461 L -3538 -3529 -1355 -1465 -3534 -3524 -1358 -1467 Q -3460 -3415 -1408 -1478 -3369 -3333 -1425 -1415 L -3317 -3292 -1425 -1378 -3275 -3275 -1424 -1329 -3252 -3271 -1422 -1303 Q -3110 -3257 -1406 -1170 -3142 -3351 -1268 -1076 -3192 -3416 -1201 -1014 -3249 -3496 -1155 -979 -3337 -3628 -1083 -923 -3448 -3725 -1055 -1012 -3530 -3808 -1035 -1089 -3624 -3825 -1038 -1176 -3712 -3842 -1078 -1263 -3695 -3792 -1172 -1360 M -3489 -3583 -1348 -1319 L -3487 -3577 -1363 -1338 -3453 -3529 -1391 -1380 -3449 -3524 -1393 -1380 -3429 -3496 -1403 -1377 Q -3317 -3384 -1398 -1361 -3354 -3431 -1310 -1240 L -3360 -3438 -1298 -1227 -3364 -3450 -1290 -1216 Q -3372 -3458 -1286 -1211 -3380 -3470 -1281 -1209 -3446 -3577 -1252 -1196 -3489 -3586 -1310 -1270 L -3489 -3587 -1325 -1289 -3489 -3583 -1346 -1319 -3489 -3583 -1348 -1319 -3487 -3577 -1363 -1338 -3453 -3529 -1391 -1380 -3449 -3524 -1393 -1380 -3429 -3496 -1403 -1377 Q -3317 -3384 -1398 -1361 -3354 -3431 -1310 -1240 L -3360 -3438 -1298 -1227 -3364 -3450 -1290 -1216 Q -3372 -3458 -1286 -1211 -3380 -3470 -1281 -1209 -3446 -3577 -1252 -1196 -3489 -3586 -1310 -1270 L -3489 -3587 -1325 -1289 -3489 -3583 -1346 -1319 -3489 -3583 -1348 -1319 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape139(ctx,ctrans,frame,ratio,time){
	var pathData="M -4607 -4658 -1003 -704 L -4609 -4658 -999 -704 Q -4639 -4661 -909 -594 -4619 -4565 -834 -539 -4595 -4441 -742 -468 -4499 -4321 -673 -476 -4409 -4202 -607 -483 -4296 -4087 -632 -568 L -4260 -4049 -641 -598 Q -4228 -4019 -651 -624 -4200 -3980 -665 -629 -4157 -3936 -688 -669 -4124 -3904 -722 -719 L -4116 -3895 -732 -734 Q -4075 -3902 -777 -821 -4050 -3928 -840 -887 -3987 -3995 -995 -1059 -4123 -4194 -1095 -1085 -4166 -4257 -1126 -1087 -4214 -4320 -1143 -1089 -4227 -4335 -1147 -1082 -4239 -4350 -1150 -1077 L -4280 -4400 -1158 -1064 -4367 -4495 -1160 -1013 Q -4442 -4573 -1130 -958 -4517 -4624 -1100 -861 -4558 -4647 -1075 -809 -4584 -4654 -1032 -747 -4594 -4656 -1016 -725 -4607 -4658 -1003 -704 M -4663 -4719 -968 -739 L -4663 -4719 -968 -737 Q -4672 -4725 -921 -677 -4669 -4696 -876 -627 L -4656 -4650 -811 -560 Q -4612 -4533 -663 -418 -4471 -4356 -609 -434 -4412 -4295 -586 -439 -4356 -4227 -582 -463 -4237 -4086 -575 -512 -4131 -3980 -654 -599 -4066 -3916 -703 -652 -4030 -3865 -764 -719 -4004 -3855 -806 -781 -3992 -3867 -854 -840 -3977 -3884 -915 -926 -3985 -3921 -985 -987 -3988 -3937 -1008 -1009 -3998 -3953 -1027 -1031 -4083 -4063 -1179 -1159 -4243 -4290 -1211 -1144 -4306 -4365 -1215 -1139 -4369 -4433 -1218 -1109 -4415 -4482 -1211 -1088 -4457 -4528 -1190 -1054 L -4469 -4539 -1184 -1045 -4492 -4560 -1168 -1027 -4496 -4570 -1160 -1019 -4497 -4575 -1153 -1015 Q -4558 -4635 -1135 -960 -4599 -4671 -1085 -894 -4626 -4695 -1052 -849 -4652 -4708 -1020 -799 L -4663 -4719 -968 -739 M -3792 -3580 -1360 -959 L -3792 -3580 -1360 -957 Q -3892 -3550 -1166 -717 -3725 -3314 -1012 -752 L -3713 -3300 -1002 -754 Q -3665 -3259 -962 -801 -3608 -3205 -958 -829 -3556 -3160 -954 -873 -3496 -3130 -979 -921 -3416 -3082 -1014 -998 -3353 -3071 -1074 -1085 -3325 -3067 -1102 -1121 -3306 -3069 -1133 -1159 L -3288 -3065 -1169 -1204 -3282 -3085 -1187 -1219 Q -3269 -3097 -1229 -1267 -3270 -3139 -1277 -1296 L -3270 -3150 -1287 -1304 -3271 -3166 -1303 -1304 Q -3275 -3203 -1341 -1305 -3292 -3239 -1378 -1306 -3326 -3287 -1414 -1307 -3364 -3335 -1437 -1307 L -3372 -3340 -1441 -1304 Q -3440 -3414 -1476 -1272 -3529 -3480 -1465 -1218 L -3598 -3530 -1452 -1170 -3614 -3545 -1447 -1154 Q -3682 -3567 -1425 -1088 -3740 -3576 -1383 -1019 L -3774 -3580 -1365 -977 -3792 -3580 -1360 -959 M -3867 -3620 -1243 -1044 L -3867 -3620 -1237 -1044 Q -3870 -3623 -1185 -991 -3859 -3619 -1138 -939 -3841 -3610 -1062 -836 -3785 -3567 -998 -776 -3730 -3522 -936 -713 -3651 -3439 -930 -698 -3570 -3359 -924 -701 -3492 -3280 -943 -704 -3450 -3241 -954 -731 -3409 -3205 -973 -761 -3351 -3161 -999 -802 -3310 -3117 -1038 -843 -3225 -3016 -1117 -951 -3211 -2998 -1247 -1056 -3205 -2988 -1301 -1111 -3222 -3001 -1350 -1165 -3270 -3025 -1481 -1266 -3382 -3130 -1518 -1364 -3449 -3215 -1540 -1367 -3539 -3299 -1530 -1369 -3609 -3372 -1518 -1357 -3679 -3437 -1490 -1321 -3736 -3486 -1467 -1294 -3795 -3534 -1414 -1226 -3819 -3545 -1389 -1189 -3846 -3581 -1334 -1135 -3863 -3595 -1293 -1088 -3867 -3620 -1243 -1044 M -4294 -4205 -1049 -932 L -4294 -4207 -1049 -926 Q -4337 -4226 -976 -844 -4248 -4132 -930 -832 -4226 -4107 -930 -831 -4205 -4089 -930 -852 -4183 -4071 -939 -872 -4174 -4063 -960 -890 -4133 -4034 -1054 -956 -4258 -4179 -1084 -974 -4279 -4197 -1074 -961 -4294 -4205 -1049 -932 M -3583 -3343 -1319 -1154 L -3583 -3343 -1314 -1154 Q -3589 -3348 -1277 -1131 -3582 -3340 -1254 -1109 L -3573 -3328 -1236 -1096 -3555 -3310 -1219 -1079 Q -3528 -3280 -1204 -1079 -3478 -3250 -1209 -1079 L -3470 -3246 -1209 -1083 Q -3447 -3235 -1212 -1100 -3431 -3224 -1240 -1117 L -3421 -3215 -1267 -1139 Q -3415 -3221 -1289 -1154 -3416 -3227 -1307 -1168 -3418 -3239 -1339 -1184 -3441 -3250 -1357 -1199 -3462 -3276 -1374 -1200 -3507 -3301 -1379 -1201 L -3540 -3320 -1374 -1194 Q -3575 -3339 -1360 -1179 -3583 -3343 -1319 -1154";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -4294 -4205 -1049 -932 L -4294 -4207 -1049 -926 Q -4337 -4226 -976 -844 -4248 -4132 -930 -832 -4226 -4107 -930 -831 -4205 -4089 -930 -852 -4183 -4071 -939 -872 -4174 -4063 -960 -890 -4133 -4034 -1054 -956 -4258 -4179 -1084 -974 -4279 -4197 -1074 -961 -4294 -4205 -1049 -932 M -4607 -4658 -1003 -704 L -4609 -4658 -999 -704 Q -4639 -4661 -909 -594 -4619 -4565 -834 -539 -4595 -4441 -742 -468 -4499 -4321 -673 -476 -4409 -4202 -607 -483 -4296 -4087 -632 -568 L -4260 -4049 -641 -598 Q -4228 -4019 -651 -624 -4200 -3980 -665 -629 -4157 -3936 -688 -669 -4124 -3904 -722 -719 L -4116 -3895 -732 -734 Q -4075 -3902 -777 -821 -4050 -3928 -840 -887 -3987 -3995 -995 -1059 -4123 -4194 -1095 -1085 -4166 -4257 -1126 -1087 -4214 -4320 -1143 -1089 -4227 -4335 -1147 -1082 -4239 -4350 -1150 -1077 L -4280 -4400 -1158 -1064 -4367 -4495 -1160 -1013 Q -4442 -4573 -1130 -958 -4517 -4624 -1100 -861 -4558 -4647 -1075 -809 -4584 -4654 -1032 -747 -4594 -4656 -1016 -725 -4607 -4658 -1003 -704 M -3583 -3343 -1319 -1154 L -3583 -3343 -1314 -1154 Q -3589 -3348 -1277 -1131 -3582 -3340 -1254 -1109 L -3573 -3328 -1236 -1096 -3555 -3310 -1219 -1079 Q -3528 -3280 -1204 -1079 -3478 -3250 -1209 -1079 L -3470 -3246 -1209 -1083 Q -3447 -3235 -1212 -1100 -3431 -3224 -1240 -1117 L -3421 -3215 -1267 -1139 Q -3415 -3221 -1289 -1154 -3416 -3227 -1307 -1168 -3418 -3239 -1339 -1184 -3441 -3250 -1357 -1199 -3462 -3276 -1374 -1200 -3507 -3301 -1379 -1201 L -3540 -3320 -1374 -1194 Q -3575 -3339 -1360 -1179 -3583 -3343 -1319 -1154 M -3792 -3580 -1360 -959 L -3792 -3580 -1360 -957 Q -3892 -3550 -1166 -717 -3725 -3314 -1012 -752 L -3713 -3300 -1002 -754 Q -3665 -3259 -962 -801 -3608 -3205 -958 -829 -3556 -3160 -954 -873 -3496 -3130 -979 -921 -3416 -3082 -1014 -998 -3353 -3071 -1074 -1085 -3325 -3067 -1102 -1121 -3306 -3069 -1133 -1159 L -3288 -3065 -1169 -1204 -3282 -3085 -1187 -1219 Q -3269 -3097 -1229 -1267 -3270 -3139 -1277 -1296 L -3270 -3150 -1287 -1304 -3271 -3166 -1303 -1304 Q -3275 -3203 -1341 -1305 -3292 -3239 -1378 -1306 -3326 -3287 -1414 -1307 -3364 -3335 -1437 -1307 L -3372 -3340 -1441 -1304 Q -3440 -3414 -1476 -1272 -3529 -3480 -1465 -1218 L -3598 -3530 -1452 -1170 -3614 -3545 -1447 -1154 Q -3682 -3567 -1425 -1088 -3740 -3576 -1383 -1019 L -3774 -3580 -1365 -977 -3792 -3580 -1360 -959";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -4663 -4719 -968 -739 L -4652 -4708 -1020 -799 Q -4626 -4695 -1052 -849 -4599 -4671 -1085 -894 -4558 -4635 -1135 -960 -4497 -4575 -1153 -1015 L -4496 -4570 -1160 -1019 -4492 -4560 -1168 -1027 -4469 -4539 -1184 -1045 -4457 -4528 -1190 -1054 Q -4415 -4482 -1211 -1088 -4369 -4433 -1218 -1109 -4306 -4365 -1215 -1139 -4243 -4290 -1211 -1144 -4083 -4063 -1179 -1159 -3998 -3953 -1027 -1031 -3988 -3937 -1008 -1009 -3985 -3921 -985 -987 -3977 -3884 -915 -926 -3992 -3867 -854 -840 -4004 -3855 -806 -781 -4030 -3865 -764 -719 -4066 -3916 -703 -652 -4131 -3980 -654 -599 -4237 -4086 -575 -512 -4356 -4227 -582 -463 -4412 -4295 -586 -439 -4471 -4356 -609 -434 -4612 -4533 -663 -418 -4656 -4650 -811 -560 L -4669 -4696 -876 -627 Q -4672 -4725 -921 -677 -4663 -4719 -968 -737 L -4663 -4719 -968 -739 M -4607 -4658 -1003 -704 Q -4594 -4656 -1016 -725 -4584 -4654 -1032 -747 -4558 -4647 -1075 -809 -4517 -4624 -1100 -861 -4442 -4573 -1130 -958 -4367 -4495 -1160 -1013 L -4280 -4400 -1158 -1064 -4239 -4350 -1150 -1077 Q -4227 -4335 -1147 -1082 -4214 -4320 -1143 -1089 -4166 -4257 -1126 -1087 -4123 -4194 -1095 -1085 -3987 -3995 -995 -1059 -4050 -3928 -840 -887 -4075 -3902 -777 -821 -4116 -3895 -732 -734 L -4124 -3904 -722 -719 Q -4157 -3936 -688 -669 -4200 -3980 -665 -629 -4228 -4019 -651 -624 -4260 -4049 -641 -598 L -4296 -4087 -632 -568 Q -4409 -4202 -607 -483 -4499 -4321 -673 -476 -4595 -4441 -742 -468 -4619 -4565 -834 -539 -4639 -4661 -909 -594 -4609 -4658 -999 -704 L -4607 -4658 -1003 -704 Q -4594 -4656 -1016 -725 -4584 -4654 -1032 -747 -4558 -4647 -1075 -809 -4517 -4624 -1100 -861 -4442 -4573 -1130 -958 -4367 -4495 -1160 -1013 L -4280 -4400 -1158 -1064 -4239 -4350 -1150 -1077 Q -4227 -4335 -1147 -1082 -4214 -4320 -1143 -1089 -4166 -4257 -1126 -1087 -4123 -4194 -1095 -1085 -3987 -3995 -995 -1059 -4050 -3928 -840 -887 -4075 -3902 -777 -821 -4116 -3895 -732 -734 L -4124 -3904 -722 -719 Q -4157 -3936 -688 -669 -4200 -3980 -665 -629 -4228 -4019 -651 -624 -4260 -4049 -641 -598 L -4296 -4087 -632 -568 Q -4409 -4202 -607 -483 -4499 -4321 -673 -476 -4595 -4441 -742 -468 -4619 -4565 -834 -539 -4639 -4661 -909 -594 -4609 -4658 -999 -704 L -4607 -4658 -1003 -704 M -4294 -4205 -1049 -932 Q -4279 -4197 -1074 -961 -4258 -4179 -1084 -974 -4133 -4034 -1054 -956 -4174 -4063 -960 -890 -4183 -4071 -939 -872 -4205 -4089 -930 -852 -4226 -4107 -930 -831 -4248 -4132 -930 -832 -4337 -4226 -976 -844 -4294 -4207 -1049 -926 L -4294 -4205 -1049 -932 Q -4279 -4197 -1074 -961 -4258 -4179 -1084 -974 -4133 -4034 -1054 -956 -4174 -4063 -960 -890 -4183 -4071 -939 -872 -4205 -4089 -930 -852 -4226 -4107 -930 -831 -4248 -4132 -930 -832 -4337 -4226 -976 -844 -4294 -4207 -1049 -926 L -4294 -4205 -1049 -932 M -3867 -3620 -1243 -1044 Q -3863 -3595 -1293 -1088 -3846 -3581 -1334 -1135 -3819 -3545 -1389 -1189 -3795 -3534 -1414 -1226 -3736 -3486 -1467 -1294 -3679 -3437 -1490 -1321 -3609 -3372 -1518 -1357 -3539 -3299 -1530 -1369 -3449 -3215 -1540 -1367 -3382 -3130 -1518 -1364 -3270 -3025 -1481 -1266 -3222 -3001 -1350 -1165 -3205 -2988 -1301 -1111 -3211 -2998 -1247 -1056 -3225 -3016 -1117 -951 -3310 -3117 -1038 -843 -3351 -3161 -999 -802 -3409 -3205 -973 -761 -3450 -3241 -954 -731 -3492 -3280 -943 -704 -3570 -3359 -924 -701 -3651 -3439 -930 -698 -3730 -3522 -936 -713 -3785 -3567 -998 -776 -3841 -3610 -1062 -836 -3859 -3619 -1138 -939 -3870 -3623 -1185 -991 -3867 -3620 -1237 -1044 L -3867 -3620 -1243 -1044 M -3792 -3580 -1360 -959 L -3774 -3580 -1365 -977 -3740 -3576 -1383 -1019 Q -3682 -3567 -1425 -1088 -3614 -3545 -1447 -1154 L -3598 -3530 -1452 -1170 -3529 -3480 -1465 -1218 Q -3440 -3414 -1476 -1272 -3372 -3340 -1441 -1304 L -3364 -3335 -1437 -1307 Q -3326 -3287 -1414 -1307 -3292 -3239 -1378 -1306 -3275 -3203 -1341 -1305 -3271 -3166 -1303 -1304 L -3270 -3150 -1287 -1304 -3270 -3139 -1277 -1296 Q -3269 -3097 -1229 -1267 -3282 -3085 -1187 -1219 L -3288 -3065 -1169 -1204 -3306 -3069 -1133 -1159 Q -3325 -3067 -1102 -1121 -3353 -3071 -1074 -1085 -3416 -3082 -1014 -998 -3496 -3130 -979 -921 -3556 -3160 -954 -873 -3608 -3205 -958 -829 -3665 -3259 -962 -801 -3713 -3300 -1002 -754 L -3725 -3314 -1012 -752 Q -3892 -3550 -1166 -717 -3792 -3580 -1360 -957 L -3792 -3580 -1360 -959 -3774 -3580 -1365 -977 -3740 -3576 -1383 -1019 Q -3682 -3567 -1425 -1088 -3614 -3545 -1447 -1154 L -3598 -3530 -1452 -1170 -3529 -3480 -1465 -1218 Q -3440 -3414 -1476 -1272 -3372 -3340 -1441 -1304 L -3364 -3335 -1437 -1307 Q -3326 -3287 -1414 -1307 -3292 -3239 -1378 -1306 -3275 -3203 -1341 -1305 -3271 -3166 -1303 -1304 L -3270 -3150 -1287 -1304 -3270 -3139 -1277 -1296 Q -3269 -3097 -1229 -1267 -3282 -3085 -1187 -1219 L -3288 -3065 -1169 -1204 -3306 -3069 -1133 -1159 Q -3325 -3067 -1102 -1121 -3353 -3071 -1074 -1085 -3416 -3082 -1014 -998 -3496 -3130 -979 -921 -3556 -3160 -954 -873 -3608 -3205 -958 -829 -3665 -3259 -962 -801 -3713 -3300 -1002 -754 L -3725 -3314 -1012 -752 Q -3892 -3550 -1166 -717 -3792 -3580 -1360 -957 L -3792 -3580 -1360 -959 M -3583 -3343 -1319 -1154 Q -3575 -3339 -1360 -1179 -3540 -3320 -1374 -1194 L -3507 -3301 -1379 -1201 Q -3462 -3276 -1374 -1200 -3441 -3250 -1357 -1199 -3418 -3239 -1339 -1184 -3416 -3227 -1307 -1168 -3415 -3221 -1289 -1154 -3421 -3215 -1267 -1139 L -3431 -3224 -1240 -1117 Q -3447 -3235 -1212 -1100 -3470 -3246 -1209 -1083 L -3478 -3250 -1209 -1079 Q -3528 -3280 -1204 -1079 -3555 -3310 -1219 -1079 L -3573 -3328 -1236 -1096 -3582 -3340 -1254 -1109 Q -3589 -3348 -1277 -1131 -3583 -3343 -1314 -1154 L -3583 -3343 -1319 -1154 Q -3575 -3339 -1360 -1179 -3540 -3320 -1374 -1194 L -3507 -3301 -1379 -1201 Q -3462 -3276 -1374 -1200 -3441 -3250 -1357 -1199 -3418 -3239 -1339 -1184 -3416 -3227 -1307 -1168 -3415 -3221 -1289 -1154 -3421 -3215 -1267 -1139 L -3431 -3224 -1240 -1117 Q -3447 -3235 -1212 -1100 -3470 -3246 -1209 -1083 L -3478 -3250 -1209 -1079 Q -3528 -3280 -1204 -1079 -3555 -3310 -1219 -1079 L -3573 -3328 -1236 -1096 -3582 -3340 -1254 -1109 Q -3589 -3348 -1277 -1131 -3583 -3343 -1314 -1154 L -3583 -3343 -1319 -1154 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function shape140(ctx,ctrans,frame,ratio,time){
	var pathData="M -3340 -1304 Q -3448 -1258 -3530 -1170 L -3545 -1154 Q -3567 -1088 -3576 -1019 L -3580 -959 Q -3550 -710 -3300 -754 -3259 -801 -3205 -829 -3059 -973 -3069 -1159 L -3065 -1204 -3085 -1219 Q -3097 -1267 -3139 -1296 L -3150 -1304 -3335 -1307 -3340 -1304 M -3581 -1135 L -3575 -1164 Q -3545 -1189 -3534 -1226 L -3530 -1254 Q -3362 -1407 -3130 -1364 -2863 -1114 -3117 -843 -3189 -767 -3280 -704 -3593 -641 -3619 -939 -3623 -991 -3620 -1044 -3595 -1088 -3581 -1135 M -3300 -1204 L -3250 -1199 -3227 -1168 -3215 -1139 -3227 -1111 Q -3237 -1094 -3250 -1079 L -3310 -1079 -3328 -1096 -3340 -1109 Q -3348 -1131 -3343 -1154 -3339 -1179 -3320 -1194 L -3309 -1198 -3301 -1201 -3300 -1204 M -4350 -1077 L -4400 -1064 Q -4650 -959 -4658 -704 -4661 -594 -4565 -539 -4298 -387 -4049 -598 -4019 -624 -3980 -629 -3936 -669 -3904 -719 L -3895 -734 Q -3924 -1115 -4320 -1089 -4335 -1082 -4350 -1077 M -4290 -1144 Q -3934 -1168 -3867 -840 -3855 -781 -3865 -719 -4001 -542 -4227 -463 -4534 -355 -4696 -627 -4726 -678 -4719 -739 -4696 -929 -4528 -1054 -4419 -1135 -4290 -1144 M -4092 -848 Q -4107 -831 -4132 -832 -4231 -837 -4205 -932 -4190 -988 -4133 -987 -4005 -947 -4092 -848";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -3340 -1304 L -3335 -1307 -3150 -1304 -3139 -1296 Q -3097 -1267 -3085 -1219 L -3065 -1204 -3069 -1159 Q -3059 -973 -3205 -829 -3259 -801 -3300 -754 -3550 -710 -3580 -959 L -3576 -1019 Q -3567 -1088 -3545 -1154 L -3530 -1170 Q -3448 -1258 -3340 -1304 M -4350 -1077 Q -4335 -1082 -4320 -1089 -3924 -1115 -3895 -734 L -3904 -719 Q -3936 -669 -3980 -629 -4019 -624 -4049 -598 -4298 -387 -4565 -539 -4661 -594 -4658 -704 -4650 -959 -4400 -1064 L -4350 -1077 M -3300 -1204 L -3301 -1201 -3309 -1198 -3320 -1194 Q -3339 -1179 -3343 -1154 -3348 -1131 -3340 -1109 L -3328 -1096 -3310 -1079 -3250 -1079 Q -3237 -1094 -3227 -1111 L -3215 -1139 -3227 -1168 -3250 -1199 -3300 -1204 M -4092 -848 Q -4005 -947 -4133 -987 -4190 -988 -4205 -932 -4231 -837 -4132 -832 -4107 -831 -4092 -848";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite141(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 63;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("morphshape133",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("morphshape133",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,7282,time);
			break;
		case 2:
			place("morphshape133",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,14564,time);
			break;
		case 3:
			place("morphshape133",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 4:
			place("morphshape133",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,29127,time);
			break;
		case 5:
			place("morphshape133",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,36409,time);
			break;
		case 6:
			place("morphshape133",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 7:
			place("morphshape133",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,50972,time);
			break;
		case 8:
			place("morphshape133",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,58254,time);
			break;
		case 9:
			place("morphshape134",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 10:
			place("morphshape134",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,7282,time);
			break;
		case 11:
			place("morphshape134",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,14564,time);
			break;
		case 12:
			place("morphshape134",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 13:
			place("morphshape134",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,29127,time);
			break;
		case 14:
			place("morphshape134",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,36409,time);
			break;
		case 15:
			place("morphshape134",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 16:
			place("morphshape134",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,50972,time);
			break;
		case 17:
			place("morphshape134",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,58254,time);
			break;
		case 18:
			place("morphshape135",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 19:
			place("morphshape135",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,7282,time);
			break;
		case 20:
			place("morphshape135",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,14564,time);
			break;
		case 21:
			place("morphshape135",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 22:
			place("morphshape135",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,29127,time);
			break;
		case 23:
			place("morphshape135",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,36409,time);
			break;
		case 24:
			place("morphshape135",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 25:
			place("morphshape135",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,50972,time);
			break;
		case 26:
			place("morphshape135",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,58254,time);
			break;
		case 27:
			place("morphshape136",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 28:
			place("morphshape136",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,5958,time);
			break;
		case 29:
			place("morphshape136",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,11916,time);
			break;
		case 30:
			place("morphshape136",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,17873,time);
			break;
		case 31:
			place("morphshape136",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,23831,time);
			break;
		case 32:
			place("morphshape136",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,29789,time);
			break;
		case 33:
			place("morphshape136",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,35747,time);
			break;
		case 34:
			place("morphshape136",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,41705,time);
			break;
		case 35:
			place("morphshape136",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,47663,time);
			break;
		case 36:
			place("morphshape136",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,53620,time);
			break;
		case 37:
			place("morphshape136",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,59578,time);
			break;
		case 38:
			place("morphshape137",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 39:
			place("morphshape137",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,8192,time);
			break;
		case 40:
			place("morphshape137",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,16384,time);
			break;
		case 41:
			place("morphshape137",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,24576,time);
			break;
		case 42:
			place("morphshape137",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,32768,time);
			break;
		case 43:
			place("morphshape137",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,40960,time);
			break;
		case 44:
			place("morphshape137",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,49152,time);
			break;
		case 45:
			place("morphshape137",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,57344,time);
			break;
		case 46:
			place("morphshape138",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 47:
			place("morphshape138",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,8192,time);
			break;
		case 48:
			place("morphshape138",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,16384,time);
			break;
		case 49:
			place("morphshape138",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,24576,time);
			break;
		case 50:
			place("morphshape138",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,32768,time);
			break;
		case 51:
			place("morphshape138",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,40960,time);
			break;
		case 52:
			place("morphshape138",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,49152,time);
			break;
		case 53:
			place("morphshape138",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,57344,time);
			break;
		case 54:
			place("morphshape139",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 55:
			place("morphshape139",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,8192,time);
			break;
		case 56:
			place("morphshape139",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,16384,time);
			break;
		case 57:
			place("morphshape139",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,24576,time);
			break;
		case 58:
			place("morphshape139",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,32768,time);
			break;
		case 59:
			place("morphshape139",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,40960,time);
			break;
		case 60:
			place("morphshape139",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,49152,time);
			break;
		case 61:
			place("morphshape139",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,57344,time);
			break;
		case 62:
			place("shape140",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function sprite142(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 1;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("sprite132",canvas,ctx,[0.0,-0.697723388671875,0.697723388671875,0.0,368.0,-2341.0],ctrans.merge(new cxform(0,0,0,-61,256,256,256,256)),1,(0+time)%54,0,time);
			place("sprite132",canvas,ctx,[0.0,-1.0600128173828125,1.0600128173828125,0.0,777.0,-3345.0],ctrans.merge(new cxform(0,0,0,-24,256,256,256,256)),1,(0+time)%54,0,time);
			place("sprite141",canvas,ctx,[0.7960662841796875,0.0,0.0,0.7960662841796875,2704.0,172.0],ctrans.merge(new cxform(23,111,255,-200,256,256,256,256)),1,(0+time)%63,0,time);
			break;
	}
}

function shape143(ctx,ctrans,frame,ratio,time){
	var pathData="M 120 -790 L 142 -788 Q 247 -682 299 -547 L 305 -525 300 -518 290 -503 293 -480 297 -450 Q 280 -439 278 -463 L 277 -493 Q 244 -575 188 -643 L 160 -665 Q 166 -410 132 -162 124 -103 104 -50 109 -19 81 24 56 64 10 76 L -25 81 Q -74 94 -118 50 L -118 42 -120 35 -130 27 Q -142 -62 -54 -110 -45 -115 -38 -123 L -21 -126 -20 -128 Q 32 -132 59 -117 82 -331 91 -548 L 105 -780 112 -785 115 -787 120 -790";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape144(ctx,ctrans,frame,ratio,time){
	var pathData="M -79 -250 L -79 -256 -78 -260 -74 -264 -71 -267 -53 -259 -48 -250 -47 -245 Q 23 -219 72 -165 L 77 -158 80 -126 80 -118 Q 63 -133 44 -158 L 32 -174 Q -14 -184 -46 -212 -22 -40 21 137 66 167 10 232 L -21 267 -50 267 -74 243 -74 211 -74 196 Q -49 153 -9 130 -54 -51 -69 -236 L -79 -250";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape145(ctx,ctrans,frame,ratio,time){
	var pathData="M -29 -246 Q 111 -263 129 -147 141 -68 104 -5 L 99 -3 81 -9 72 -15 76 -23 83 -31 91 -39 Q 114 -114 84 -179 74 -201 48 -204 L -13 -209 Q -16 -88 -9 30 -6 76 -6 123 L -2 123 Q 13 177 -33 220 L -45 234 Q -88 254 -132 248 -138 158 -42 125 L -30 121 -48 -118 Q -56 -197 -29 -246";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape146(ctx,ctrans,frame,ratio,time){
	var pathData="M 179 -297 Q 138 -86 141 141 L 140 149 133 155 124 157 122 139 118 149 Q 72 190 23 152 17 89 81 84 L 81 83 116 85 Q 107 -39 130 -162 53 -95 -35 -39 L -44 -32 -65 -32 -72 -39 Q -64 8 -66 59 L -66 194 -65 211 Q -47 257 -94 288 L -102 295 -155 298 -163 290 -171 282 -171 274 -171 258 -179 250 Q -158 198 -99 189 L -81 191 Q -87 49 -96 -92 L -107 -103 Q -106 -116 -98 -126 L -92 -130 Q -16 -142 61 -208 L 166 -300 179 -297 M 144 -226 L 145 -241 Q 43 -166 -62 -95 -73 -89 -82 -89 L -72 -40 Q 20 -120 131 -191 L 134 -194 136 -193 144 -226";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape147(ctx,ctrans,frame,ratio,time){
	var pathData="M 160 75 L 156 81 158 91 137 107 Q 127 133 103 148 L 92 155 47 152 Q 38 138 40 120 L 41 97 69 70 Q 84 48 105 30 L 110 25 123 26 Q 102 -98 95 -225 70 -204 51 -177 L 39 -166 Q -18 -89 -97 -32 L -66 284 -63 288 -52 304 Q -61 350 -100 378 L -110 389 -113 390 -131 389 -138 380 -139 375 -140 374 -158 367 -165 343 -163 312 Q -143 282 -107 271 L -102 269 -87 271 Q -97 114 -125 -36 L -126 -39 -125 -39 -140 -111 -139 -119 -133 -123 -121 -129 100 -389 113 -387 Q 116 -160 161 59 L 164 67 160 75 M 94 -246 L 91 -323 89 -331 Q -14 -221 -105 -103 L -99 -51 -91 -55 17 -175 23 -182 Q 55 -206 78 -242 L 84 -249 94 -246";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite148(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 64;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape143",canvas,ctx,[0.3053436279296875,0.0,0.0,0.3053436279296875,-725.0,5.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 1:
			place("shape143",canvas,ctx,[0.3683013916015625,0.0080413818359375,-0.0080413818359375,0.3683013916015625,-798.0,-134.0],ctrans.merge(new cxform(0,0,0,-232,256,256,256,256)),1,0,0,time);
			break;
		case 2:
			place("shape143",canvas,ctx,[0.4310302734375,0.0188446044921875,-0.0188446044921875,0.4310302734375,-826.0,-292.0],ctrans.merge(new cxform(0,0,0,-209,256,256,256,256)),1,0,0,time);
			break;
		case 3:
			place("shape143",canvas,ctx,[0.493408203125,0.032379150390625,-0.032379150390625,0.493408203125,-817.0,-451.0],ctrans.merge(new cxform(0,0,0,-185,256,256,256,256)),1,0,0,time);
			break;
		case 4:
			place("shape143",canvas,ctx,[0.5553741455078125,0.04864501953125,-0.04864501953125,0.5553741455078125,-781.0,-607.0],ctrans.merge(new cxform(0,0,0,-162,256,256,256,256)),1,0,0,time);
			break;
		case 5:
			place("shape143",canvas,ctx,[0.6168212890625,0.0676422119140625,-0.0676422119140625,0.6168212890625,-719.0,-751.0],ctrans.merge(new cxform(0,0,0,-139,256,256,256,256)),1,0,0,time);
			break;
		case 6:
			place("shape143",canvas,ctx,[0.6776885986328125,0.08935546875,-0.08935546875,0.6776885986328125,-632.0,-881.0],ctrans.merge(new cxform(0,0,0,-116,256,256,256,256)),1,0,0,time);
			break;
		case 7:
			place("shape143",canvas,ctx,[0.7378387451171875,0.1137237548828125,-0.1137237548828125,0.7378387451171875,-530.0,-1002.0],ctrans.merge(new cxform(0,0,0,-93,256,256,256,256)),1,0,0,time);
			break;
		case 8:
			place("shape143",canvas,ctx,[0.797210693359375,0.1407928466796875,-0.1407928466796875,0.797210693359375,-427.0,-1122.0],ctrans.merge(new cxform(0,0,0,-70,256,256,256,256)),1,0,0,time);
			break;
		case 9:
			place("shape143",canvas,ctx,[0.8556976318359375,0.170501708984375,-0.170501708984375,0.8556976318359375,-324.0,-1241.0],ctrans.merge(new cxform(0,0,0,-46,256,256,256,256)),1,0,0,time);
			break;
		case 10:
			place("shape143",canvas,ctx,[0.9132537841796875,0.20281982421875,-0.20281982421875,0.9132537841796875,-220.0,-1360.0],ctrans.merge(new cxform(0,0,0,-23,256,256,256,256)),1,0,0,time);
			break;
		case 11:
			place("shape143",canvas,ctx,[0.970367431640625,0.238433837890625,-0.238433837890625,0.970367431640625,-115.0,-1477.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 12:
			place("shape143",canvas,ctx,[0.9641265869140625,0.2589874267578125,-0.2589874267578125,0.9641265869140625,-12.0,-1600.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[0.602996826171875,0.0,0.0,0.602996826171875,-1342.0,106.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 13:
			place("shape143",canvas,ctx,[0.9580078125,0.280120849609375,-0.280120849609375,0.9580078125,81.0,-1735.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[0.636077880859375,0.0,0.0,0.636077880859375,-1279.0,-42.0],ctrans.merge(new cxform(0,0,0,-246,256,256,256,256)),1,0,0,time);
			break;
		case 14:
			place("shape143",canvas,ctx,[0.9514617919921875,0.301116943359375,-0.301116943359375,0.9514617919921875,165.0,-1874.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[0.669158935546875,0.0,0.0,0.669158935546875,-1221.0,-192.0],ctrans.merge(new cxform(0,0,0,-236,256,256,256,256)),1,0,0,time);
			break;
		case 15:
			place("shape143",canvas,ctx,[0.944427490234375,0.3219451904296875,-0.3219451904296875,0.944427490234375,241.0,-2016.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[0.7022552490234375,0.0,0.0,0.7022552490234375,-1166.0,-344.0],ctrans.merge(new cxform(0,0,0,-227,256,256,256,256)),1,0,0,time);
			break;
		case 16:
			place("shape143",canvas,ctx,[0.935791015625,0.3456878662109375,-0.3456878662109375,0.935791015625,304.0,-2165.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[0.7353363037109375,0.0,0.0,0.7353363037109375,-1116.0,-495.0],ctrans.merge(new cxform(0,0,0,-217,256,256,256,256)),1,0,0,time);
			break;
		case 17:
			place("shape143",canvas,ctx,[0.9278411865234375,0.3661651611328125,-0.3661651611328125,0.9278411865234375,349.0,-2320.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[0.7684173583984375,0.0,0.0,0.7684173583984375,-1072.0,-650.0],ctrans.merge(new cxform(0,0,0,-208,256,256,256,256)),1,0,0,time);
			break;
		case 18:
			place("shape143",canvas,ctx,[0.92022705078125,0.38751220703125,-0.38751220703125,0.92022705078125,374.0,-2480.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[0.8014984130859375,0.0,0.0,0.8014984130859375,-1035.0,-806.0],ctrans.merge(new cxform(0,0,0,-198,256,256,256,256)),1,0,0,time);
			break;
		case 19:
			place("shape143",canvas,ctx,[0.8849334716796875,0.3859405517578125,-0.3859405517578125,0.8849334716796875,376.0,-2576.0],ctrans.merge(new cxform(0,0,0,-28,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[0.8345794677734375,0.0,0.0,0.8345794677734375,-1004.0,-964.0],ctrans.merge(new cxform(0,0,0,-189,256,256,256,256)),1,0,0,time);
			break;
		case 20:
			place("shape143",canvas,ctx,[0.8506927490234375,0.38458251953125,-0.38458251953125,0.8506927490234375,372.0,-2674.0],ctrans.merge(new cxform(0,0,0,-57,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[0.8676605224609375,0.0,0.0,0.8676605224609375,-984.0,-1123.0],ctrans.merge(new cxform(0,0,0,-180,256,256,256,256)),1,0,0,time);
			break;
		case 21:
			place("shape143",canvas,ctx,[0.816650390625,0.3823699951171875,-0.3823699951171875,0.8166351318359375,358.0,-2769.0],ctrans.merge(new cxform(0,0,0,-85,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[0.9007568359375,0.0,0.0,0.9007568359375,-975.0,-1284.0],ctrans.merge(new cxform(0,0,0,-170,256,256,256,256)),1,0,0,time);
			break;
		case 22:
			place("shape143",canvas,ctx,[0.7815704345703125,0.3818817138671875,-0.3818817138671875,0.7815704345703125,339.0,-2864.0],ctrans.merge(new cxform(0,0,0,-113,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[0.933837890625,0.0,0.0,0.933837890625,-978.0,-1444.0],ctrans.merge(new cxform(0,0,0,-161,256,256,256,256)),1,0,0,time);
			break;
		case 23:
			place("shape143",canvas,ctx,[0.748016357421875,0.3779296875,-0.3779144287109375,0.74798583984375,312.0,-2956.0],ctrans.merge(new cxform(0,0,0,-142,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[0.9669189453125,0.0,0.0,0.9669189453125,-992.0,-1603.0],ctrans.merge(new cxform(0,0,0,-151,256,256,256,256)),1,0,0,time);
			break;
		case 24:
			place("shape143",canvas,ctx,[0.714630126953125,0.3731231689453125,-0.3731231689453125,0.714630126953125,280.0,-3046.0],ctrans.merge(new cxform(0,0,0,-170,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[1.0,0.0,0.0,1.0,-1015.0,-1761.0],ctrans.merge(new cxform(0,0,0,-142,256,256,256,256)),1,0,0,time);
			break;
		case 25:
			place("shape143",canvas,ctx,[0.68157958984375,0.36749267578125,-0.3674774169921875,0.68157958984375,240.0,-3134.0],ctrans.merge(new cxform(0,0,0,-198,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[0.99786376953125,-0.0621337890625,0.0621337890625,0.99786376953125,-1050.0,-1915.0],ctrans.merge(new cxform(0,0,0,-132,256,256,256,256)),1,0,0,time);
			break;
		case 26:
			place("shape143",canvas,ctx,[0.6488037109375,0.361053466796875,-0.361053466796875,0.6488037109375,190.0,-3219.0],ctrans.merge(new cxform(0,0,0,-227,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[0.9914398193359375,-0.1272735595703125,0.1272735595703125,0.9914398193359375,-1117.0,-2054.0],ctrans.merge(new cxform(0,0,0,-123,256,256,256,256)),1,0,0,time);
			break;
		case 27:
			place("shape143",canvas,ctx,[0.6163330078125,0.3558502197265625,-0.3558349609375,0.6163330078125,138.0,-3298.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			place("shape144",canvas,ctx,[0.9807891845703125,-0.1918792724609375,0.1918792724609375,0.9807891845703125,-1260.0,-2128.0],ctrans.merge(new cxform(0,0,0,-113,256,256,256,256)),1,0,0,time);
			break;
		case 28:
			place("shape144",canvas,ctx,[0.9659271240234375,-0.2556610107421875,0.2556610107421875,0.9659271240234375,-1421.0,-2155.0],ctrans.merge(new cxform(0,0,0,-104,256,256,256,256)),1,0,0,time);
			break;
		case 29:
			place("shape144",canvas,ctx,[0.946929931640625,-0.3183441162109375,0.3183441162109375,0.946929931640625,-1585.0,-2169.0],ctrans.merge(new cxform(0,0,0,-94,256,256,256,256)),1,0,0,time);
			break;
		case 30:
			place("shape144",canvas,ctx,[0.9238739013671875,-0.3796539306640625,0.3796539306640625,0.9238739013671875,-1749.0,-2178.0],ctrans.merge(new cxform(0,0,0,-85,256,256,256,256)),1,0,0,time);
			break;
		case 31:
			place("shape144",canvas,ctx,[0.8968658447265625,-0.4393463134765625,0.4393463134765625,0.8968658447265625,-1911.0,-2186.0],ctrans.merge(new cxform(0,0,0,-75,256,256,256,256)),1,0,0,time);
			break;
		case 32:
			place("shape144",canvas,ctx,[0.86602783203125,-0.5,0.5,0.86602783203125,-2070.0,-2196.0],ctrans.merge(new cxform(0,0,0,-66,256,256,256,256)),1,0,0,time);
			place("shape145",canvas,ctx,[1.0,0.0,0.0,1.0,135.0,836.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 33:
			place("shape144",canvas,ctx,[0.94293212890625,-0.329833984375,0.3298492431640625,0.94293212890625,-2218.0,-2236.0],ctrans.merge(new cxform(0,0,0,-93,256,256,256,256)),1,0,0,time);
			place("shape145",canvas,ctx,[1.0,0.0,0.0,1.0,232.0,794.0],ctrans.merge(new cxform(0,0,0,-191,256,256,256,256)),1,0,0,time);
			break;
		case 34:
			place("shape144",canvas,ctx,[0.98846435546875,-0.148101806640625,0.148101806640625,0.98846435546875,-2266.0,-2371.0],ctrans.merge(new cxform(0,0,0,-120,256,256,256,256)),1,0,0,time);
			place("shape145",canvas,ctx,[1.0,0.0,0.0,1.0,330.0,751.0],ctrans.merge(new cxform(0,0,0,-127,256,256,256,256)),1,0,0,time);
			break;
		case 35:
			place("shape144",canvas,ctx,[0.9992523193359375,0.0355224609375,-0.0355072021484375,0.9992523193359375,-2184.0,-2506.0],ctrans.merge(new cxform(0,0,0,-147,256,256,256,256)),1,0,0,time);
			place("shape145",canvas,ctx,[1.0,0.0,0.0,1.0,427.0,709.0],ctrans.merge(new cxform(0,0,0,-64,256,256,256,256)),1,0,0,time);
			break;
		case 36:
			place("shape144",canvas,ctx,[0.9744873046875,0.221160888671875,-0.2211456298828125,0.9744873046875,-2067.0,-2618.0],ctrans.merge(new cxform(0,0,0,-174,256,256,256,256)),1,0,0,time);
			place("shape145",canvas,ctx,[1.0,0.0,0.0,1.0,524.0,666.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 37:
			place("shape144",canvas,ctx,[0.9156036376953125,0.399017333984375,-0.399017333984375,0.9156036376953125,-1931.0,-2705.0],ctrans.merge(new cxform(0,0,0,-201,256,256,256,256)),1,0,0,time);
			place("shape145",canvas,ctx,[0.9981842041015625,-0.0570526123046875,0.0570526123046875,0.9981842041015625,621.0,624.0],ctrans.merge(new cxform(0,0,0,-28,256,256,256,256)),1,0,0,time);
			place("shape146",canvas,ctx,[0.70721435546875,-0.4083099365234375,0.4083099365234375,0.70721435546875,-469.0,287.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 38:
			place("shape144",canvas,ctx,[0.8246307373046875,0.5629119873046875,-0.562896728515625,0.8246307373046875,-1790.0,-2779.0],ctrans.merge(new cxform(0,0,0,-228,256,256,256,256)),1,0,0,time);
			place("shape145",canvas,ctx,[0.99310302734375,-0.113922119140625,0.113922119140625,0.99310302734375,719.0,581.0],ctrans.merge(new cxform(0,0,0,-57,256,256,256,256)),1,0,0,time);
			place("shape146",canvas,ctx,[0.767791748046875,-0.355499267578125,0.355499267578125,0.767791748046875,-384.0,198.0],ctrans.merge(new cxform(0,0,0,-212,256,256,256,256)),1,0,0,time);
			break;
		case 39:
			place("shape144",canvas,ctx,[0.7071075439453125,0.7071075439453125,-0.7071075439453125,0.7071075439453125,-1644.0,-2845.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			place("shape145",canvas,ctx,[0.98480224609375,-0.1704254150390625,0.1704254150390625,0.98480224609375,816.0,539.0],ctrans.merge(new cxform(0,0,0,-85,256,256,256,256)),1,0,0,time);
			place("shape146",canvas,ctx,[0.8238067626953125,-0.300201416015625,0.300201416015625,0.8238067626953125,-298.0,110.0],ctrans.merge(new cxform(0,0,0,-170,256,256,256,256)),1,0,0,time);
			break;
		case 40:
			place("shape145",canvas,ctx,[0.9725341796875,-0.22955322265625,0.22955322265625,0.9725341796875,913.0,496.0],ctrans.merge(new cxform(0,0,0,-113,256,256,256,256)),1,0,0,time);
			place("shape146",canvas,ctx,[0.8773651123046875,-0.232208251953125,0.232208251953125,0.8773651123046875,-214.0,23.0],ctrans.merge(new cxform(0,0,0,-127,256,256,256,256)),1,0,0,time);
			break;
		case 41:
			place("shape145",canvas,ctx,[0.957672119140625,-0.2847137451171875,0.2847137451171875,0.957672119140625,1011.0,454.0],ctrans.merge(new cxform(0,0,0,-142,256,256,256,256)),1,0,0,time);
			place("shape146",canvas,ctx,[0.9245758056640625,-0.160003662109375,0.160003662109375,0.9245758056640625,-130.0,-68.0],ctrans.merge(new cxform(0,0,0,-85,256,256,256,256)),1,0,0,time);
			break;
		case 42:
			place("shape145",canvas,ctx,[0.938568115234375,-0.3420257568359375,0.3420257568359375,0.938568115234375,1108.0,411.0],ctrans.merge(new cxform(0,0,0,-170,256,256,256,256)),1,0,0,time);
			place("shape146",canvas,ctx,[0.9654388427734375,-0.08447265625,0.08447265625,0.9654388427734375,-44.0,-155.0],ctrans.merge(new cxform(0,0,0,-43,256,256,256,256)),1,0,0,time);
			break;
		case 43:
			place("shape145",canvas,ctx,[0.9173431396484375,-0.39508056640625,0.39508056640625,0.9173431396484375,1205.0,369.0],ctrans.merge(new cxform(0,0,0,-198,256,256,256,256)),1,0,0,time);
			place("shape146",canvas,ctx,[1.0,0.0,0.0,1.0,41.0,-245.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 44:
			place("shape145",canvas,ctx,[0.8931427001953125,-0.4468536376953125,0.4468536376953125,0.8931427001953125,1303.0,326.0],ctrans.merge(new cxform(0,0,0,-227,256,256,256,256)),1,0,0,time);
			place("shape146",canvas,ctx,[1.04986572265625,0.06536865234375,-0.06536865234375,1.04986572265625,93.0,-301.0],ctrans.merge(new cxform(0,0,0,-21,256,256,256,256)),1,0,0,time);
			break;
		case 45:
			place("shape145",canvas,ctx,[0.86602783203125,-0.5,0.5,0.86602783203125,1400.0,284.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			place("shape146",canvas,ctx,[1.0943145751953125,0.144134521484375,-0.144134521484375,1.0943145751953125,146.0,-355.0],ctrans.merge(new cxform(0,0,0,-43,256,256,256,256)),1,0,0,time);
			break;
		case 46:
			place("shape146",canvas,ctx,[1.134124755859375,0.2255859375,-0.2255859375,1.134124755859375,198.0,-412.0],ctrans.merge(new cxform(0,0,0,-64,256,256,256,256)),1,0,0,time);
			break;
		case 47:
			place("shape146",canvas,ctx,[1.1672821044921875,0.3089599609375,-0.3089599609375,1.1672821044921875,250.0,-468.0],ctrans.merge(new cxform(0,0,0,-85,256,256,256,256)),1,0,0,time);
			break;
		case 48:
			place("shape146",canvas,ctx,[1.1923370361328125,0.4051971435546875,-0.4051971435546875,1.1923370361328125,302.0,-524.0],ctrans.merge(new cxform(0,0,0,-106,256,256,256,256)),1,0,0,time);
			break;
		case 49:
			place("shape146",canvas,ctx,[1.2127532958984375,0.502349853515625,-0.502349853515625,1.2127532958984375,355.0,-580.0],ctrans.merge(new cxform(0,0,0,-127,256,256,256,256)),1,0,0,time);
			place("shape147",canvas,ctx,[0.86602783203125,-0.5,0.5,0.86602783203125,-955.0,473.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
		case 50:
			place("shape146",canvas,ctx,[1.224029541015625,0.599609375,-0.599609375,1.224029541015625,407.0,-635.0],ctrans.merge(new cxform(0,0,0,-149,256,256,256,256)),1,0,0,time);
			place("shape147",canvas,ctx,[1.0358428955078125,-0.4736480712890625,0.473663330078125,1.0358428955078125,-956.0,472.0],ctrans.merge(new cxform(0,0,0,-212,256,256,256,256)),1,0,0,time);
			break;
		case 51:
			place("shape146",canvas,ctx,[1.2247467041015625,0.7084503173828125,-0.7084503173828125,1.2247467041015625,460.0,-691.0],ctrans.merge(new cxform(0,0,0,-170,256,256,256,256)),1,0,0,time);
			place("shape147",canvas,ctx,[1.20770263671875,-0.4226531982421875,0.4226531982421875,1.20770263671875,-956.0,473.0],ctrans.merge(new cxform(0,0,0,-170,256,256,256,256)),1,0,0,time);
			break;
		case 52:
			place("shape146",canvas,ctx,[1.221435546875,0.8161468505859375,-0.8161468505859375,1.221435546875,511.0,-747.0],ctrans.merge(new cxform(0,0,0,-191,256,256,256,256)),1,0,0,time);
			place("shape147",canvas,ctx,[1.3791046142578125,-0.339202880859375,0.3392181396484375,1.3791046142578125,-956.0,471.0],ctrans.merge(new cxform(0,0,0,-127,256,256,256,256)),1,0,0,time);
			break;
		case 53:
			place("shape146",canvas,ctx,[1.2067718505859375,0.922027587890625,-0.922027587890625,1.2067718505859375,564.0,-802.0],ctrans.merge(new cxform(0,0,0,-212,256,256,256,256)),1,0,0,time);
			place("shape147",canvas,ctx,[1.54364013671875,-0.2318115234375,0.2318115234375,1.54364013671875,-955.0,472.0],ctrans.merge(new cxform(0,0,0,-85,256,256,256,256)),1,0,0,time);
			break;
		case 54:
			place("shape146",canvas,ctx,[1.1794281005859375,1.0373077392578125,-1.0373077392578125,1.1794281005859375,615.0,-858.0],ctrans.merge(new cxform(0,0,0,-234,256,256,256,256)),1,0,0,time);
			place("shape147",canvas,ctx,[1.69903564453125,-0.0969085693359375,0.096923828125,1.69903564453125,-956.0,471.0],ctrans.merge(new cxform(0,0,0,-43,256,256,256,256)),1,0,0,time);
			break;
		case 55:
			place("shape146",canvas,ctx,[1.1493072509765625,1.1493072509765625,-1.1493072509765625,1.1493072509765625,668.0,-914.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			place("shape147",canvas,ctx,[1.8414154052734375,0.065460205078125,-0.065460205078125,1.8414154052734375,-955.0,472.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 56:
			place("shape147",canvas,ctx,[1.9662322998046875,0.251617431640625,-0.251617431640625,1.9662322998046875,-1039.0,474.0],ctrans.merge(new cxform(0,0,0,-32,256,256,256,256)),1,0,0,time);
			break;
		case 57:
			place("shape147",canvas,ctx,[2.069610595703125,0.4689178466796875,-0.4689178466796875,2.069610595703125,-1121.0,473.0],ctrans.merge(new cxform(0,0,0,-64,256,256,256,256)),1,0,0,time);
			break;
		case 58:
			place("shape147",canvas,ctx,[2.150543212890625,0.7010345458984375,-0.7010345458984375,2.150543212890625,-1206.0,473.0],ctrans.merge(new cxform(0,0,0,-96,256,256,256,256)),1,0,0,time);
			break;
		case 59:
			place("shape147",canvas,ctx,[2.2018585205078125,0.959014892578125,-0.959014892578125,2.2018585205078125,-1287.0,473.0],ctrans.merge(new cxform(0,0,0,-127,256,256,256,256)),1,0,0,time);
			break;
		case 60:
			place("shape147",canvas,ctx,[2.2265472412109375,1.225555419921875,-1.225555419921875,2.2265472412109375,-1372.0,473.0],ctrans.merge(new cxform(0,0,0,-159,256,256,256,256)),1,0,0,time);
			break;
		case 61:
			place("shape147",canvas,ctx,[2.2147979736328125,1.5115509033203125,-1.5115509033203125,2.2147979736328125,-1456.0,473.0],ctrans.merge(new cxform(0,0,0,-191,256,256,256,256)),1,0,0,time);
			break;
		case 62:
			place("shape147",canvas,ctx,[2.1737060546875,1.79888916015625,-1.79888916015625,2.1737060546875,-1540.0,473.0],ctrans.merge(new cxform(0,0,0,-223,256,256,256,256)),1,0,0,time);
			break;
		case 63:
			place("shape147",canvas,ctx,[2.097686767578125,2.097686767578125,-2.097686767578125,2.097686767578125,-1622.0,472.0],ctrans.merge(new cxform(0,0,0,-255,256,256,256,256)),1,0,0,time);
			break;
	}
}

function button150(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 4;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("sprite142",canvas,ctx,[0.60333251953125,0.0,0.0,0.60333251953125,-409.0,1848.0],ctrans.merge(new cxform(0,0,0,-38,256,256,256,256)),1,(0+time)%1,0,time);
			place("sprite142",canvas,ctx,[0.465606689453125,-0.2272491455078125,0.496002197265625,0.282745361328125,-226.0,2514.0],ctrans.merge(new cxform(-255,-255,-255,-65,256,256,256,256)),1,(0+time)%1,0,time);
			break;
	}
}

function shape151(ctx,ctrans,frame,ratio,time){
	var pathData="M 370 5795 L 382 5791 387 5792 393 5790 438 5795 Q 454 5802 463 5821 L 465 5828 Q 450 5831 441 5836 L 414 5852 404 5859 402 5846 Q 396 5817 377 5819 L 370 5820 Q 361 5822 357 5831 352 5840 353 5861 L 353 5873 356 5891 356 5898 357 5896 Q 374 5870 391 5868 L 424 5874 429 5877 445 5879 460 5868 466 5864 472 5873 473 5883 Q 475 5898 469 5910 L 448 5930 436 5934 420 5933 399 5926 394 5922 383 5918 377 5918 373 5917 Q 366 5918 365 5924 362 5930 364 5946 L 363 5959 Q 366 5984 373 5993 L 393 6004 400 6002 Q 412 5999 418 5991 424 5980 422 5966 L 420 5960 417 5949 453 5952 479 5942 483 5940 Q 486 5937 492 5935 L 493 5946 Q 493 5976 472 5999 L 458 6011 435 6021 425 6024 417 6025 413 6026 408 6027 393 6029 379 6029 355 6027 347 6028 335 6028 325 6030 307 6037 297 6046 282 6034 285 6027 295 5992 294 5950 290 5919 286 5898 284 5887 274 5859 264 5845 255 5836 262 5819 282 5822 307 5820 332 5811 358 5799 370 5795 M 538 5916 L 522 5918 518 5889 517 5877 553 5880 589 5877 589 5904 591 5915 571 5914 553 5914 538 5916 M 720 5811 L 723 5830 Q 714 5836 713 5845 L 713 5865 714 5873 717 5893 717 5905 721 5898 729 5885 737 5872 739 5868 745 5851 Q 747 5840 737 5837 L 747 5817 764 5827 780 5831 812 5837 832 5834 840 5852 832 5858 828 5863 822 5871 817 5887 813 5897 812 5899 809 5913 806 5928 801 5970 803 5999 808 6022 822 6034 811 6054 803 6050 781 6042 758 6035 738 6033 715 6034 710 6015 719 6011 729 6000 732 5995 736 5979 748 5903 750 5895 738 5916 722 5942 678 6023 668 6021 655 5885 657 5876 645 5914 641 5928 639 5939 636 5961 635 5974 Q 639 5992 649 5999 L 640 6019 621 6008 606 6004 591 6003 575 6005 571 5985 591 5972 611 5940 618 5920 624 5896 628 5881 631 5876 631 5873 632 5869 634 5851 632 5827 624 5812 635 5793 650 5804 670 5809 676 5810 682 5812 690 5813 696 5814 710 5813 720 5811 M 894 5926 L 900 5928 904 5931 905 5931 908 5927 919 5904 920 5881 918 5873 929 5864 945 5875 959 5882 961 5882 964 5883 970 5885 976 5887 987 5890 1004 5894 1015 5893 1021 5907 1015 5911 1007 5923 1000 5955 998 5981 995 6029 Q 994 6040 996 6049 L 1000 6068 1002 6078 1006 6089 996 6100 988 6094 973 6084 954 6076 939 6074 921 6074 914 6057 921 6052 930 6045 935 6032 936 6027 938 6017 939 6013 926 6020 914 6019 906 6015 896 6007 896 6003 894 6009 Q 887 6031 902 6047 L 905 6052 892 6064 885 6057 872 6048 858 6043 845 6039 833 6043 826 6027 835 6021 855 6006 869 5989 878 5976 873 5972 860 5975 857 5981 Q 843 5969 850 5950 L 853 5941 858 5934 Q 866 5926 876 5925 L 894 5926 M 940 5915 L 927 5942 922 5950 921 5955 922 5959 930 5984 933 5989 933 5990 937 5988 940 5986 942 5981 943 5968 945 5913 942 5913 940 5915 M 1112 5935 L 1127 5945 1143 5955 1173 5966 1182 5969 1182 5985 Q 1170 5987 1163 5995 1155 6001 1146 6018 L 1142 6026 1117 6083 1111 6095 1109 6103 Q 1105 6123 1112 6139 L 1100 6151 Q 1084 6132 1064 6122 L 1056 6118 1042 6112 1022 6109 1020 6092 1046 6079 1067 6045 1077 6026 1097 5971 Q 1101 5953 1094 5941 L 1105 5929 1112 5935 M 1250 6018 L 1279 6043 Q 1295 6054 1314 6057 L 1312 6075 Q 1300 6076 1293 6083 1283 6091 1272 6111 L 1244 6159 1239 6167 1235 6179 1229 6191 1229 6199 1232 6213 1240 6222 Q 1249 6228 1258 6226 L 1272 6215 1274 6208 1275 6200 1274 6197 1278 6190 1283 6180 1289 6177 1294 6174 1309 6176 1325 6179 1327 6182 1326 6195 1321 6210 1315 6223 1297 6244 1273 6252 Q 1250 6257 1227 6241 L 1209 6227 1208 6226 1196 6213 1175 6197 1170 6193 1161 6190 1145 6184 1146 6162 1164 6161 1183 6140 1192 6128 1201 6112 1206 6106 1222 6077 1232 6050 1232 6035 1229 6020 1242 6009 1250 6018";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape152(ctx,ctrans,frame,ratio,time){
	var pathData="M -2 -2518 Q 35 -2485 4 -2449 L -5 -2442 Q -36 -2438 -52 -2464 L -54 -2476 -53 -2493 Q -40 -2515 -15 -2518 L -15 -2519 -2 -2518 M -324 -2394 L -311 -2393 Q -287 -2374 -304 -2352 L -310 -2348 Q -331 -2342 -344 -2358 L -345 -2375 -337 -2390 -332 -2391 -324 -2394";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -402 -2308 L -412 -2339 -412 -2342 Q -407 -2374 -396 -2393 -313 -2435 -262 -2370 -307 -2264 -399 -2296 L -402 -2308 M -2 -2518 L -15 -2519 -15 -2518 Q -40 -2515 -53 -2493 L -54 -2476 -52 -2464 Q -36 -2438 -5 -2442 L 4 -2449 Q 35 -2485 -2 -2518 M -14 -2394 L -71 -2393 Q -182 -2430 -89 -2514 5 -2568 53 -2489 44 -2414 -14 -2394 M -324 -2394 L -332 -2391 -337 -2390 -345 -2375 -344 -2358 Q -331 -2342 -310 -2348 L -304 -2352 Q -287 -2374 -311 -2393 L -324 -2394";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 416 -3099 Q 290 -3094 239 -3185 190 -3274 216 -3366 240 -3471 332 -3445 L 336 -3444 Q 358 -3439 376 -3398 L 391 -3361 395 -3352 Q 427 -3281 481 -3229 L 478 -3187 478 -3185 Q 472 -3156 456 -3134 L 451 -3128 416 -3099";
	ctx.fillStyle=tocolor(ctrans.apply([231,221,211,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 332 -3445 Q 322 -3468 318 -3502 313 -3583 380 -3631 476 -3668 575 -3672 L 664 -3685 721 -3689 Q 806 -3706 789 -3599 790 -3573 821 -3549 897 -3533 921 -3444 L 892 -3334 Q 938 -3300 965 -3239 950 -3174 922 -3128 L 906 -3099 Q 957 -3011 891 -2924 837 -2854 802 -2793 L 796 -2784 Q 760 -2711 728 -2626 L 656 -2446 Q 617 -2358 559 -2282 499 -2205 447 -2121 403 -2051 381 -1978 L 378 -1966 382 -1978 372 -1945 355 -1848 Q 358 -1829 344 -1734 330 -1637 323 -1540 L 315 -1454 307 -1393 295 -1314 275 -1185 Q 227 -1249 162 -1222 96 -1196 78 -1343 59 -1490 54 -1592 L 46 -1792 Q 42 -1889 66 -1999 L 95 -2052 Q 44 -2032 14 -1864 -15 -1696 -11 -1561 L 2 -1278 Q 11 -1131 -120 -1097 -252 -1063 -316 -1141 -381 -1219 -374 -1347 L -364 -1595 Q -361 -1715 -327 -1857 -294 -1998 -276 -2011 L -239 -2015 Q -210 -2026 -216 -2056 L -217 -2062 -217 -2063 -217 -2064 -218 -2065 -217 -2066 -216 -2065 -215 -2065 -212 -2063 -203 -2058 Q -125 -2021 -45 -2060 23 -2093 58 -2149 68 -2094 97 -2055 L 138 -2139 145 -2153 149 -2163 173 -2212 240 -2339 331 -2504 Q 375 -2588 430 -2666 487 -2747 532 -2829 L 536 -2842 Q 458 -2867 443 -2960 L 416 -3099 451 -3128 456 -3134 Q 472 -3156 478 -3185 L 478 -3187 481 -3229 Q 427 -3281 395 -3352 L 391 -3361 376 -3398 Q 358 -3439 336 -3444 L 332 -3445 M 194 -856 L 180 -790 Q 162 -695 157 -599 152 -500 158 -404 L 172 -209 176 -74 190 76 199 251 222 449 246 637 272 831 300 1019 329 1206 354 1373 Q 363 1446 366 1451 379 1517 392 1631 402 1721 418 1811 L 454 2005 Q 471 2096 481 2186 L 501 2371 522 2552 550 2736 576 2921 Q 588 3016 625 3110 661 3204 705 3278 L 816 3441 Q 858 3524 836 3612 813 3700 626 3734 439 3767 410 3739 380 3710 347 3698 313 3686 243 3648 173 3610 80 3515 35 3494 51 3456 61 3397 86 3346 L 100 3269 Q 112 3181 116 3092 L 124 2903 Q 128 2804 122 2706 L 114 2519 Q 112 2428 115 2353 117 2278 103 2159 89 2039 82 1943 L 65 1751 42 1558 15 1368 -11 1181 Q -23 1085 -44 990 -66 888 -72 830 -98 636 -117 534 L -153 350 Q -172 255 -194 186 L -224 372 -244 561 -255 741 -260 936 -255 1121 Q -249 1216 -250 1311 L -254 1431 Q -253 1501 -244 1590 -234 1687 -234 1792 -235 1897 -229 1987 L -218 2168 -207 2351 -195 2541 -180 2731 Q -171 2825 -153 2917 -135 3010 -105 3096 -75 3181 -54 3256 -41 3280 -39 3326 -69 3394 -141 3420 L -296 3471 Q -366 3490 -430 3527 -494 3563 -580 3566 L -764 3563 Q -866 3558 -950 3511 -974 3457 -959 3396 -915 3310 -861 3242 L -759 3106 -679 2988 -668 2964 Q -640 2898 -629 2818 -616 2723 -610 2643 L -604 2453 -599 2246 -590 2061 -581 1872 -576 1719 -575 1572 -572 1395 Q -571 1306 -573 1225 L -576 1050 -577 857 Q -573 771 -577 676 L -580 490 -582 315 -581 145 Q -578 59 -581 -17 L -592 -3 Q -606 17 -629 23 -736 31 -815 -8 -833 -41 -794 -48 -734 -34 -686 -64 -686 -93 -654 -94 -659 -123 -667 -152 -696 -260 -639 -325 -673 -341 -669 -377 -696 -465 -739 -554 L -820 -729 -892 -913 Q -920 -987 -927 -1054 -946 -1151 -904 -1219 L -878 -1258 Q -819 -1337 -766 -1420 -715 -1502 -680 -1572 -621 -1668 -587 -1755 L -543 -1875 Q -510 -1970 -414 -1989 L -384 -1999 Q -408 -1967 -431 -1882 -454 -1798 -457 -1633 L -459 -1402 -459 -1401 Q -532 -1306 -594 -1234 -633 -1189 -664 -1139 L -690 -1113 Q -681 -1018 -657 -922 L -598 -707 Q -562 -588 -547 -569 L -544 -559 -540 -588 Q -533 -638 -512 -698 -481 -793 -457 -889 -443 -947 -436 -1007 L -434 -1027 -436 -1004 Q -357 -938 -206 -916 -55 -895 215 -941 L 194 -856 M 689 -3517 Q 600 -3515 514 -3521 492 -3513 487 -3497 L 476 -3485 Q 426 -3427 395 -3352 426 -3427 476 -3485 L 487 -3497 Q 492 -3513 514 -3521 600 -3515 689 -3517 M 783 -3114 L 708 -3116 Q 622 -3072 524 -3041 462 -3061 456 -3134 462 -3061 524 -3041 622 -3072 708 -3116 L 783 -3114 M 760 -3295 Q 681 -3323 604 -3328 542 -3244 478 -3185 542 -3244 604 -3328 681 -3323 760 -3295 M 759 -2908 L 755 -2908 Q 656 -2900 553 -2923 508 -2974 524 -3041 508 -2974 553 -2923 656 -2900 755 -2908 L 759 -2908 793 -2917 759 -2908 Q 708 -2833 614 -2842 708 -2833 759 -2908 M 95 -2052 L 96 -2054 95 -2052 96 -2054 97 -2055 96 -2054 95 -2052 M -436 -1007 L -436 -1004 -436 -1007 M -574 -53 L -574 -54 -577 -225 Q -578 -308 -571 -381 L -547 -569 -571 -381 Q -578 -308 -577 -225 L -574 -54 -574 -53 -581 -17 Q -574 -30 -574 -44 L -574 -53 M -199 131 L -194 186 Q -221 172 -249 131 -306 50 -314 -49 -306 50 -249 131 -221 172 -194 186 L -199 131 M -690 -1113 Q -711 -1148 -739 -1169 -711 -1148 -690 -1113 M -475 -1590 Q -476 -1533 -464 -1439 L -459 -1402 -464 -1439 Q -476 -1533 -475 -1590";
	var grd=ctx.createLinearGradient(-965.0,0.0,965.0,0.0);
	grd.addColorStop(0.0,tocolor(ctrans.apply([231,221,211,1])));
	grd.addColorStop(0.984313725490196,tocolor(ctrans.apply([249,245,242,1])));
	ctx.fillStyle = grd;
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -283 -2113 Q -311 -2139 -334 -2172 -382 -2241 -399 -2296 -307 -2264 -262 -2370 -313 -2435 -396 -2393 L -422 -2378 -424 -2381 Q -432 -2410 -442 -2529 -453 -2648 -412 -2723 -372 -2798 -269 -2823 -165 -2849 -76 -2818 12 -2788 62 -2715 114 -2638 124 -2544 135 -2447 120 -2343 L 97 -2240 70 -2169 58 -2149 Q 23 -2093 -45 -2060 -125 -2021 -203 -2058 L -212 -2063 -215 -2065 -216 -2065 -217 -2066 -218 -2066 -258 -2092 -283 -2113 M -14 -2394 Q 44 -2414 53 -2489 5 -2568 -89 -2514 -182 -2430 -71 -2393 L -14 -2394";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([249,245,242,1]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.0421142578125,0,0,0.0421142578125,-227,-2148);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.0,tocolor(ctrans.apply([231,221,211,1])));
	grd.addColorStop(0.984313725490196,tocolor(ctrans.apply([249,245,242,1])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M 510 -1646 Q 558 -1558 522 -1467 464 -1362 345 -1327 L 295 -1314 307 -1393 315 -1454 Q 347 -1459 375 -1471 488 -1521 510 -1646";
	ctx.fillStyle=tocolor(ctrans.apply([51,51,51,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 500 -1309 L 500 -1308 501 -1304 497 -1297 490 -1290 484 -1267 481 -1259 Q 473 -1255 473 -1265 L 474 -1274 478 -1278 480 -1287 480 -1292 493 -1309 497 -1313 500 -1309 M 481 -1661 L 481 -1657 487 -1648 481 -1642 475 -1655 Q 469 -1723 447 -1788 L 450 -1788 Q 477 -1727 481 -1661 M 495 -1369 L 496 -1355 497 -1351 487 -1346 Q 480 -1359 488 -1372 L 490 -1374 495 -1369 M 469 -1305 L 465 -1310 462 -1315 454 -1316 448 -1313 Q 445 -1295 458 -1285 472 -1277 472 -1265 L 472 -1263 469 -1261 450 -1260 445 -1269 434 -1283 434 -1310 Q 433 -1324 442 -1328 464 -1328 480 -1310 L 481 -1307 480 -1305 469 -1305";
	ctx.fillStyle=tocolor(ctrans.apply([0,153,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 497 -1297 L 488 -1266 484 -1267 490 -1290 497 -1297";
	ctx.fillStyle=tocolor(ctrans.apply([53,67,87,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 382 -1978 Q 478 -1808 510 -1646 488 -1521 375 -1471 347 -1459 315 -1454 L 323 -1540 Q 330 -1637 344 -1734 358 -1829 355 -1848 L 372 -1945 382 -1978 M 522 -1467 Q 518 -1390 500 -1309 L 497 -1313 493 -1309 480 -1292 480 -1287 478 -1278 474 -1274 473 -1265 Q 473 -1255 481 -1259 L 484 -1267 488 -1266 459 -1180 Q 386 -1073 275 -1185 L 295 -1314 345 -1327 Q 464 -1362 522 -1467 M -318 -2013 Q -314 -2072 -283 -2113 L -258 -2092 -218 -2066 -218 -2065 -217 -2064 -217 -2063 -217 -2062 -216 -2056 Q -210 -2026 -239 -2015 L -276 -2011 -318 -2013 M 97 -2240 Q 131 -2234 173 -2212 L 149 -2163 145 -2153 138 -2139 97 -2055 Q 68 -2094 58 -2149 L 70 -2169 97 -2240 M 481 -1661 Q 477 -1727 450 -1788 L 447 -1788 Q 469 -1723 475 -1655 L 481 -1642 487 -1648 481 -1657 481 -1661 M 469 -1305 L 480 -1305 481 -1307 480 -1310 Q 464 -1328 442 -1328 433 -1324 434 -1310 L 434 -1283 445 -1269 450 -1260 469 -1261 472 -1263 472 -1265 Q 472 -1277 458 -1285 445 -1295 448 -1313 L 454 -1316 462 -1315 465 -1310 469 -1305 M 495 -1369 L 490 -1374 488 -1372 Q 480 -1359 487 -1346 L 497 -1351 496 -1355 495 -1369";
	ctx.fillStyle=tocolor(ctrans.apply([51,75,106,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 459 -1180 L 471 -1168 Q 438 -1069 370 -972 302 -876 194 -856 L 215 -941 Q -55 -895 -206 -916 -357 -938 -436 -1004 L -434 -1027 -436 -1007 Q -447 -994 -448 -1060 L -459 -1401 -459 -1402 -457 -1633 Q -454 -1798 -431 -1882 -408 -1967 -384 -1999 -340 -2016 -318 -2013 L -276 -2011 Q -294 -1998 -327 -1857 -361 -1715 -364 -1595 L -374 -1347 Q -381 -1219 -316 -1141 -252 -1063 -120 -1097 11 -1131 2 -1278 L -11 -1561 Q -15 -1696 14 -1864 44 -2032 95 -2052 L 66 -1999 Q 42 -1889 46 -1792 L 54 -1592 Q 59 -1490 78 -1343 96 -1196 162 -1222 227 -1249 275 -1185 386 -1073 459 -1180";
	ctx.fillStyle=tocolor(ctrans.apply([63,61,54,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 332 -3445 Q 322 -3468 318 -3502 313 -3583 380 -3631 476 -3668 575 -3672 L 664 -3685 721 -3689 Q 806 -3706 789 -3599 790 -3573 821 -3549 897 -3533 921 -3444 L 892 -3334 Q 938 -3300 965 -3239 950 -3174 922 -3128 L 906 -3099 Q 957 -3011 891 -2924 837 -2854 802 -2793 L 796 -2784 Q 760 -2711 728 -2626 L 656 -2446 Q 617 -2358 559 -2282 499 -2205 447 -2121 403 -2051 381 -1978 L 378 -1966 382 -1978 Q 478 -1808 510 -1646 558 -1558 522 -1467 518 -1390 500 -1309 M 497 -1297 L 488 -1266 459 -1180 471 -1168 Q 438 -1069 370 -972 302 -876 194 -856 L 180 -790 Q 162 -695 157 -599 152 -500 158 -404 L 172 -209 176 -74 190 76 199 251 222 449 246 637 272 831 300 1019 329 1206 354 1373 Q 363 1446 366 1451 379 1517 392 1631 402 1721 418 1811 L 454 2005 Q 471 2096 481 2186 L 501 2371 522 2552 550 2736 576 2921 Q 588 3016 625 3110 661 3204 705 3278 L 816 3441 Q 858 3524 836 3612 813 3700 626 3734 439 3767 410 3739 380 3710 347 3698 313 3686 243 3648 173 3610 80 3515 35 3494 51 3456 61 3397 86 3346 L 100 3269 Q 112 3181 116 3092 L 124 2903 Q 128 2804 122 2706 L 114 2519 Q 112 2428 115 2353 117 2278 103 2159 89 2039 82 1943 L 65 1751 42 1558 15 1368 -11 1181 Q -23 1085 -44 990 -66 888 -72 830 -98 636 -117 534 L -153 350 Q -172 255 -194 186 L -224 372 -244 561 -255 741 -260 936 -255 1121 Q -249 1216 -250 1311 L -254 1431 Q -253 1501 -244 1590 -234 1687 -234 1792 -235 1897 -229 1987 L -218 2168 -207 2351 -195 2541 -180 2731 Q -171 2825 -153 2917 -135 3010 -105 3096 -75 3181 -54 3256 -41 3280 -39 3326 -69 3394 -141 3420 L -296 3471 Q -366 3490 -430 3527 -494 3563 -580 3566 L -764 3563 Q -866 3558 -950 3511 -974 3457 -959 3396 -915 3310 -861 3242 L -759 3106 -679 2988 -668 2964 Q -640 2898 -629 2818 -616 2723 -610 2643 L -604 2453 -599 2246 -590 2061 -581 1872 -576 1719 -575 1572 -572 1395 Q -571 1306 -573 1225 L -576 1050 -577 857 Q -573 771 -577 676 L -580 490 -582 315 -581 145 Q -578 59 -581 -17 L -592 -3 Q -606 17 -629 23 -736 31 -815 -8 -833 -41 -794 -48 -734 -34 -686 -64 -686 -93 -654 -94 -659 -123 -667 -152 -696 -260 -639 -325 -673 -341 -669 -377 -696 -465 -739 -554 L -820 -729 -892 -913 Q -920 -987 -927 -1054 -946 -1151 -904 -1219 L -878 -1258 Q -819 -1337 -766 -1420 -715 -1502 -680 -1572 -621 -1668 -587 -1755 L -543 -1875 Q -510 -1970 -414 -1989 L -384 -1999 Q -340 -2016 -318 -2013 -314 -2072 -283 -2113 -311 -2139 -334 -2172 -382 -2241 -399 -2296 M -412 -2342 L -423 -2378 -424 -2381 Q -432 -2410 -442 -2529 -453 -2648 -412 -2723 -372 -2798 -269 -2823 -165 -2849 -76 -2818 12 -2788 62 -2715 114 -2638 124 -2544 135 -2447 120 -2343 L 97 -2240 Q 131 -2234 173 -2212 L 240 -2339 331 -2504 Q 375 -2588 430 -2666 487 -2747 532 -2829 M 536 -2842 Q 458 -2867 443 -2960 L 416 -3099 Q 290 -3094 239 -3185 190 -3274 216 -3366 240 -3471 332 -3445 L 336 -3444 Q 358 -3439 376 -3398 L 391 -3361 395 -3352 Q 426 -3427 476 -3485 L 487 -3497 Q 492 -3513 514 -3521 600 -3515 689 -3517 M 478 -3185 Q 472 -3156 456 -3134 462 -3061 524 -3041 622 -3072 708 -3116 L 783 -3114 M 395 -3352 Q 427 -3281 481 -3229 L 478 -3187 478 -3185 Q 542 -3244 604 -3328 681 -3323 760 -3295 M 456 -3134 L 451 -3128 416 -3099 M 793 -2917 L 759 -2908 Q 708 -2833 614 -2842 M 524 -3041 Q 508 -2974 553 -2923 656 -2900 755 -2908 L 759 -2908 M 58 -2149 Q 68 -2094 97 -2055 L 138 -2139 145 -2153 149 -2163 173 -2212 M 97 -2240 L 70 -2169 58 -2149 Q 23 -2093 -45 -2060 -125 -2021 -203 -2058 L -212 -2063 -215 -2065 -216 -2065 -217 -2066 -218 -2066 -258 -2092 -283 -2113 M -218 -2065 L -217 -2064 -217 -2063 -217 -2062 -216 -2056 Q -210 -2026 -239 -2015 L -276 -2011 Q -294 -1998 -327 -1857 -361 -1715 -364 -1595 L -374 -1347 Q -381 -1219 -316 -1141 -252 -1063 -120 -1097 11 -1131 2 -1278 L -11 -1561 Q -15 -1696 14 -1864 44 -2032 95 -2052 L 96 -2054 97 -2055 M 96 -2054 L 95 -2052 66 -1999 Q 42 -1889 46 -1792 L 54 -1592 Q 59 -1490 78 -1343 96 -1196 162 -1222 227 -1249 275 -1185 L 295 -1314 307 -1393 315 -1454 323 -1540 Q 330 -1637 344 -1734 358 -1829 355 -1848 L 372 -1945 382 -1978 M 522 -1467 Q 464 -1362 345 -1327 L 295 -1314 M 510 -1646 Q 488 -1521 375 -1471 347 -1459 315 -1454 M 459 -1180 Q 386 -1073 275 -1185 M -436 -1004 Q -357 -938 -206 -916 -55 -895 215 -941 L 194 -856 M -423 -2378 L -422 -2378 -396 -2393 M -218 -2066 L -218 -2065 M -276 -2011 L -318 -2013 M -384 -1999 Q -408 -1967 -431 -1882 -454 -1798 -457 -1633 L -459 -1402 -459 -1401 -448 -1060 Q -447 -994 -436 -1007 -443 -947 -457 -889 -481 -793 -512 -698 -533 -638 -540 -588 L -544 -559 -547 -569 -571 -381 Q -578 -308 -577 -225 L -574 -54 -574 -53 -574 -44 Q -574 -30 -581 -17 L -574 -53 M -436 -1004 L -436 -1007 M -459 -1402 L -459 -1401 Q -532 -1306 -594 -1234 -633 -1189 -664 -1139 L -690 -1113 Q -681 -1018 -657 -922 L -598 -707 Q -562 -588 -547 -569 L -540 -588 M -459 -1402 L -464 -1439 Q -476 -1533 -475 -1590 M -739 -1169 Q -711 -1148 -690 -1113 M -314 -49 Q -306 50 -249 131 -221 172 -194 186 L -199 131";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([88,81,76,1]));
	ctx.lineWidth=1.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

	var pathData="M -399 -2296 L -402 -2308 -412 -2339 -412 -2342 Q -407 -2374 -396 -2393 -313 -2435 -262 -2370 -307 -2264 -399 -2296 M -14 -2394 Q 44 -2414 53 -2489 5 -2568 -89 -2514 -182 -2430 -71 -2393 L -14 -2394 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([88,81,76,1]));
	ctx.lineWidth=1.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function morphshape153(ctx,ctrans,frame,ratio,time){
	var pathData="M -174 -174 2 2 Q -175 -175 30 28 -164 -166 57 51 -158 -161 91 83 -140 -125 117 77 L -124 -110 117 74 Q -30 -37 111 49 53 35 81 24 134 123 51 -9 165 151 -30 -66 L 174 157 -59 -93 Q 169 156 -75 -112 165 139 -91 -116 158 127 -107 -114 139 115 -116 -113 L 116 104 -115 -87 Q 99 82 -67 -47 46 29 -24 -15 0 -14 3 7 -65 -73 10 10 -117 -123 14 4 -173 -173 -4 -2 L -174 -174 2 2";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(102+ratio*(0)/65535),Math.round(102+ratio*(0)/65535),Math.round(102+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -173 -168 -4 -2 Q -120 -118 14 14 -65 -65 10 10 -4 -4 6 6 46 46 -24 -24 94 94 -54 -54 116 116 -115 -115 L 54 54 -79 -79 Q -4 -4 -35 -35 -88 -88 -31 -16 -164 -128 -27 -9 -173 -168 -4 -2";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -174 -174 2 2 L -173 -173 -4 -2 Q -156 -134 -27 -8 -88 -95 -31 -14 -1 -19 -37 -32 54 33 -79 -64 L 116 86 -115 -101 139 108 -116 -112 Q 160 123 -105 -114 166 139 -89 -116 170 155 -74 -113 174 156 -59 -96 L 164 151 -29 -66 Q 133 123 51 -10 53 35 81 24 -32 -37 111 49 -126 -110 117 74 L -140 -123 117 77 Q -159 -161 91 84 -166 -166 55 51 -175 -174 30 29 -174 -174 2 6";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(88+ratio*(0)/65535),Math.round(81+ratio*(0)/65535),Math.round(76+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	ctx.lineWidth=1.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

	var pathData="M -174 -174 2 2 L -173 -173 -4 -2 Q -117 -123 14 4 -65 -73 10 10 0 -14 3 7 46 29 -24 -15 99 82 -67 -47 116 104 -115 -87 L 139 115 -116 -113 Q 158 127 -107 -114 165 139 -91 -116 169 156 -75 -112 174 157 -59 -93 L 165 151 -30 -66 Q 134 123 51 -9 53 35 81 24 -30 -37 111 49 -124 -110 117 74 L -140 -125 117 77 Q -158 -161 91 83 -164 -166 57 51 -175 -175 30 28 -174 -174 2 2 M -173 -168 -4 -2 Q -164 -128 -27 -9 -88 -88 -31 -16 -4 -4 -35 -35 54 54 -79 -79 L 116 116 -115 -115 Q 94 94 -54 -54 46 46 -24 -24 -4 -4 6 6 -65 -65 10 10 -120 -118 14 14 -173 -168 -4 -2 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(88+ratio*(-88)/65535),Math.round(81+ratio*(-81)/65535),Math.round(76+ratio*(-76)/65535),((Math.round(255+ratio*(-255)/65535))/255)]));
	ctx.lineWidth=1.0+ratio*(-1)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function shape154(ctx,ctrans,frame,ratio,time){
	var pathData="M -168 -2 Q -118 14 -65 10 -4 6 46 -24 94 -54 116 -115 L 139 -116 Q 166 -110 151 -66 122 -8 31 26 L -110 74 Q -160 89 -166 51 -175 30 -174 2 L -173 -4 -168 -2";
	ctx.fillStyle=tocolor(ctrans.apply([102,102,102,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 116 -115 Q 94 -54 46 -24 -4 6 -65 10 -118 14 -168 -2 L -88 -16 Q -4 -35 54 -79 L 116 -115";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 116 -115 L 54 -79 Q -4 -35 -88 -16 L -168 -2 -173 -4 -174 2 Q -175 30 -166 51 -160 89 -110 74 L 31 26 Q 122 -8 151 -66 166 -110 139 -116 L 116 -115 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([88,81,76,1]));
	ctx.lineWidth=1.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape155(ctx,ctrans,frame,ratio,time){
	var pathData="M 154 -52 L 139 -52 Q 49 -81 -16 -72 -82 -63 -146 -22";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([88,81,76,1]));
	ctx.lineWidth=1.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function morphshape156(ctx,ctrans,frame,ratio,time){
	var pathData="M -174 -174 2 2 Q -175 -175 28 30 -166 -164 51 57 -161 -158 83 91 -125 -140 77 117 L -110 -124 74 117 Q -37 -30 49 111 35 53 24 81 123 134 -9 51 151 165 -66 -30 L 157 174 -93 -59 Q 156 169 -112 -75 139 165 -116 -91 127 158 -114 -107 115 139 -113 -116 L 104 116 -87 -115 Q 82 99 -47 -67 29 46 -15 -24 -14 0 7 3 -73 -65 10 10 -123 -117 4 14 -173 -173 -2 -4 L -174 -174 2 2";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(102+ratio*(0)/65535),Math.round(102+ratio*(0)/65535),Math.round(102+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -168 -173 -2 -4 Q -118 -120 14 14 -65 -65 10 10 -4 -4 6 6 46 46 -24 -24 94 94 -54 -54 116 116 -115 -115 L 54 54 -79 -79 Q -4 -4 -35 -35 -88 -88 -16 -31 -128 -164 -9 -27 -168 -173 -2 -4";
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	drawMorphPath(ctx,pathData,ratio,false);

	ctx.fill("evenodd");
	var pathData="M -174 -174 2 2 L -173 -173 -2 -4 Q -134 -156 -8 -27 -95 -88 -14 -31 -19 -1 -32 -37 33 54 -64 -79 L 86 116 -101 -115 108 139 -112 -116 Q 123 160 -114 -105 139 166 -116 -89 155 170 -113 -74 156 174 -96 -59 L 151 164 -66 -29 Q 123 133 -10 51 35 53 24 81 -37 -32 49 111 -110 -126 74 117 L -123 -140 77 117 Q -161 -159 84 91 -166 -166 51 55 -174 -175 29 30 -174 -174 6 2";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(88+ratio*(0)/65535),Math.round(81+ratio*(0)/65535),Math.round(76+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)]));
	ctx.lineWidth=1.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

	var pathData="M -174 -174 2 2 L -173 -173 -2 -4 Q -123 -117 4 14 -73 -65 10 10 -14 0 7 3 29 46 -15 -24 82 99 -47 -67 104 116 -87 -115 L 115 139 -113 -116 Q 127 158 -114 -107 139 165 -116 -91 156 169 -112 -75 157 174 -93 -59 L 151 165 -66 -30 Q 123 134 -9 51 35 53 24 81 -37 -30 49 111 -110 -124 74 117 L -125 -140 77 117 Q -161 -158 83 91 -166 -164 51 57 -175 -175 28 30 -174 -174 2 2 M -168 -173 -2 -4 Q -128 -164 -9 -27 -88 -88 -16 -31 -4 -4 -35 -35 54 54 -79 -79 L 116 116 -115 -115 Q 94 94 -54 -54 46 46 -24 -24 -4 -4 6 6 -65 -65 10 10 -118 -120 14 14 -168 -173 -2 -4 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(88+ratio*(-88)/65535),Math.round(81+ratio*(-81)/65535),Math.round(76+ratio*(-76)/65535),((Math.round(255+ratio*(-255)/65535))/255)]));
	ctx.lineWidth=1.0+ratio*(-1)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function shape157(ctx,ctrans,frame,ratio,time){
	var pathData="M 116 -115 Q 94 -54 46 -24 -4 6 -65 10 -120 14 -173 -4 -164 -27 -88 -31 -4 -35 54 -79 L 116 -115";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -173 -4 Q -120 14 -65 10 -4 6 46 -24 94 -54 116 -115 L 139 -116 Q 166 -110 174 -59 148 46 53 81 -35 113 -140 117 -160 89 -166 51 -175 30 -174 2 L -173 -4";
	ctx.fillStyle=tocolor(ctrans.apply([102,102,102,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 116 -115 L 54 -79 Q -4 -35 -88 -31 -164 -27 -173 -4 L -174 2 Q -175 30 -166 51 -160 89 -140 117 -35 113 53 81 148 46 174 -59 166 -110 139 -116 L 116 -115 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([88,81,76,1]));
	ctx.lineWidth=1.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function sprite158(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 320;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("morphshape153",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("morphshape153",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 2:
			place("morphshape153",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 3:
			place("shape154",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 4:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 5:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 6:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 7:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 8:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 9:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 10:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 11:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 12:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 13:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 14:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 15:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 16:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 17:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 18:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 19:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 20:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 21:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 22:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 23:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 24:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 25:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 26:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 27:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 28:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 29:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 30:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 31:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 32:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 33:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 34:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 35:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 36:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 37:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 38:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 39:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 40:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 41:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 42:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 43:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 44:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 45:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 46:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 47:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 48:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 49:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 50:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 51:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 52:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 53:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 54:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 55:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 56:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 57:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 58:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 59:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 60:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 61:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 62:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 63:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 64:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 65:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 66:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 67:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 68:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 69:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 70:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 71:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 72:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 73:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 74:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 75:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 76:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 77:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 78:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 79:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 80:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 81:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 82:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 83:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 84:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 85:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 86:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 87:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 88:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 89:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 90:
			place("shape155",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 91:
			place("morphshape156",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 92:
			place("morphshape156",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 93:
			place("morphshape156",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 94:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 95:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 96:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 97:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 98:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 99:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 100:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 101:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 102:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 103:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 104:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 105:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 106:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 107:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 108:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 109:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 110:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 111:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 112:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 113:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 114:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 115:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 116:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 117:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 118:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 119:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 120:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 121:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 122:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 123:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 124:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 125:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 126:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 127:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 128:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 129:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 130:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 131:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 132:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 133:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 134:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 135:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 136:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 137:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 138:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 139:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 140:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 141:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 142:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 143:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 144:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 145:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 146:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 147:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 148:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 149:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 150:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 151:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 152:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 153:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 154:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 155:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 156:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 157:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 158:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 159:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 160:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 161:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 162:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 163:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 164:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 165:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 166:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 167:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 168:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 169:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 170:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 171:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 172:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 173:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 174:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 175:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 176:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 177:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 178:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 179:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 180:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 181:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 182:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 183:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 184:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 185:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 186:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 187:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 188:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 189:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 190:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 191:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 192:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 193:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 194:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 195:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 196:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 197:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 198:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 199:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 200:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 201:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 202:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 203:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 204:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 205:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 206:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 207:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 208:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 209:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 210:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 211:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 212:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 213:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 214:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 215:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 216:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 217:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 218:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 219:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 220:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 221:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 222:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 223:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 224:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 225:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 226:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 227:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 228:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 229:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 230:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 231:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 232:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 233:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 234:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 235:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 236:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 237:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 238:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 239:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 240:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 241:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 242:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 243:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 244:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 245:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 246:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 247:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 248:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 249:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 250:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 251:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 252:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 253:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 254:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 255:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 256:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 257:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 258:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 259:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 260:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 261:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 262:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 263:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 264:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 265:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 266:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 267:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 268:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 269:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 270:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 271:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 272:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 273:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 274:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 275:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 276:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 277:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 278:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 279:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 280:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 281:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 282:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 283:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 284:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 285:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 286:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 287:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 288:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 289:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 290:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 291:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 292:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 293:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 294:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 295:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 296:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 297:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 298:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 299:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 300:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 301:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 302:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 303:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 304:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 305:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 306:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 307:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 308:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 309:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 310:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 311:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 312:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 313:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 314:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 315:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 316:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 317:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 318:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 319:
			place("shape157",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function shape159(ctx,ctrans,frame,ratio,time){
	var pathData="M -219 116 L -232 70 Q -227 38 -216 19 -133 -23 -82 42 -127 148 -219 116 M 91 -102 Q 185 -156 233 -77 224 -2 166 18 L 109 19 Q -2 -18 91 -102";
	ctx.fillStyle=tocolor(ctrans.apply([170,163,157,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 91 -102 Q -2 -18 109 19 L 166 18 Q 224 -2 233 -77 185 -156 91 -102 M -219 116 Q -127 148 -82 42 -133 -23 -216 19 -227 38 -232 70 L -219 116 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([88,81,76,1]));
	ctx.lineWidth=1.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape160(ctx,ctrans,frame,ratio,time){
	var pathData="M -82 42 Q -136 92 -221 97 L -232 70 Q -227 38 -216 19 -133 -23 -82 42 M 73 -20 Q 8 -22 91 -102 185 -156 233 -77 224 -62 166 -39 138 -18 73 -20";
	ctx.fillStyle=tocolor(ctrans.apply([170,163,157,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 73 -20 Q 138 -18 166 -39 224 -62 233 -77 185 -156 91 -102 8 -22 73 -20 M -82 42 Q -133 -23 -216 19 -227 38 -232 70 L -221 97 Q -136 92 -82 42 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([88,81,76,1]));
	ctx.lineWidth=1.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape161(ctx,ctrans,frame,ratio,time){
	var pathData="M -82 42 Q -163 18 -223 81 -227 90 -232 70 -227 38 -216 19 -133 -23 -82 42 M 233 -77 L 149 -75 Q 124 -68 68 -35 11 -2 91 -102 185 -156 233 -77";
	ctx.fillStyle=tocolor(ctrans.apply([170,163,157,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 233 -77 Q 185 -156 91 -102 11 -2 68 -35 124 -68 149 -75 L 233 -77 M -82 42 Q -133 -23 -216 19 -227 38 -232 70 -227 90 -223 81 -163 18 -82 42 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([88,81,76,1]));
	ctx.lineWidth=1.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function shape162(ctx,ctrans,frame,ratio,time){
	var pathData="M 106 -110 L 79 -87 91 -102 106 -110 M 151 -123 Q 202 -129 233 -77 187 -121 151 -123";
	ctx.fillStyle=tocolor(ctrans.apply([170,163,157,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 106 -110 L 79 -87 Q 14 -6 57 -61 L 79 -87 91 -102 106 -110 Q 125 -123 143 -123 L 151 -123 Q 202 -129 233 -77 187 -121 151 -123 130 -121 106 -110 M -82 42 Q -133 -23 -216 19 -227 38 -232 70";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([88,81,76,1]));
	ctx.lineWidth=1.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function sprite163(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 107;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape159",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("shape160",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 2:
			place("shape161",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 3:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 4:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 5:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 6:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 7:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 8:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 9:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 10:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 11:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 12:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 13:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 14:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 15:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 16:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 17:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 18:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 19:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 20:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 21:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 22:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 23:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 24:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 25:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 26:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 27:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 28:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 29:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 30:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 31:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 32:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 33:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 34:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 35:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 36:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 37:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 38:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 39:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 40:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 41:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 42:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 43:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 44:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 45:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 46:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 47:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 48:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 49:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 50:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 51:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 52:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 53:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 54:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 55:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 56:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 57:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 58:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 59:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 60:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 61:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 62:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 63:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 64:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 65:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 66:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 67:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 68:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 69:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 70:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 71:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 72:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 73:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 74:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 75:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 76:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 77:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 78:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 79:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 80:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 81:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 82:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 83:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 84:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 85:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 86:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 87:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 88:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 89:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 90:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 91:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 92:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 93:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 94:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 95:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 96:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 97:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 98:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 99:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 100:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 101:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 102:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 103:
			place("shape162",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 104:
			place("shape161",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 105:
			place("shape160",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 106:
			place("shape159",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function shape164(ctx,ctrans,frame,ratio,time){
	var pathData="M 889 -3610 L 780 -3596 769 -3582 776 -3535 777 -3525 Q 805 -3483 848 -3456 923 -3439 982 -3394 L 983 -3389 979 -3379 883 -3385 Q 848 -3310 934 -3266 L 945 -3259 946 -3255 946 -3253 1001 -3239 Q 1023 -3235 1031 -3217 L 1049 -3199 1051 -3195 1048 -3187 1042 -3182 1021 -3196 Q 1002 -3177 967 -3192 948 -3171 912 -3163 L 896 -3159 895 -3159 897 -3156 Q 887 -3125 888 -3089 L 888 -3079 Q 950 -3054 1018 -3033 1027 -3030 1025 -3019 L 1024 -3009 Q 1042 -2970 1022 -2921 L 967 -2794 920 -2702 Q 847 -2577 819 -2438 L 814 -2418 Q 796 -2351 759 -2292 687 -2130 569 -1999 L 489 -1823 Q 469 -1781 455 -1739 394 -1560 319 -1387 L 171 -1058 146 -1008 Q 91 -901 81 -769 71 -638 85 -483 99 -328 59 -245 19 -163 62 -251 55 -122 81 -79 95 -55 115 -37 194 36 201 145 L 204 179 259 559 283 685 Q 325 872 357 1060 L 375 1189 382 1252 391 1316 Q 409 1356 419 1402 L 435 1475 518 1850 Q 555 2037 595 2655 L 604 2784 602 2775 602 2774 601 2765 601 2762 599 2760 600 2765 597 2772 596 2774 596 2776 Q 605 2827 604 2925 603 3100 561 3136 L 540 3162 Q 491 3288 571 3402 596 3410 609 3441 714 3574 899 3550 1078 3527 1085 3507 1111 3533 1073 3575 L 1051 3606 Q 892 3687 709 3683 671 3682 652 3647 L 649 3641 Q 557 3663 516 3655 L 481 3650 -200 3716 Q -415 3730 -629 3718 -783 3719 -935 3690 L -1064 3660 -1082 3648 -1081 3639 -1076 3629 -1069 3619 -1059 3616 -1069 3613 -1074 3602 -1076 3593 -1075 3584 -1073 3574 -764 3435 -749 3430 Q -709 3427 -669 3431 L -671 3427 -672 3427 Q -695 3407 -695 3373 L -696 3363 -696 3358 -695 3356 -691 3355 -698 3333 -700 3319 -671 3291 -669 3290 -645 3249 -643 3247 -642 3247 -603 3176 Q -559 3098 -498 3036 L -499 3032 -500 3018 -429 2946 -443 2957 -442 2949 -443 2947 -403 2896 -382 2846 -365 2759 -354 2623 -340 2505 -339 2398 -339 2103 -335 2101 Q -336 1941 -314 1786 L -311 1782 -306 1777 -307 1767 Q -310 1683 -303 1602 -324 1585 -321 1543 -310 1403 -312 1260 -314 1067 -306 875 L -303 731 -301 614 -306 568 Q -314 545 -312 517 L -304 389 Q -321 266 -320 139 L -317 47 Q -306 13 -311 -25 L -312 -34 -309 -39 -304 -46 -305 -80 -315 -98 Q -328 -75 -364 -68 L -463 -64 Q -504 -68 -540 -86 L -549 -93 -550 -98 -551 -112 -544 -122 -533 -132 Q -476 -125 -421 -132 L -421 -137 Q -413 -164 -387 -179 L -386 -179 Q -405 -267 -398 -362 -396 -379 -381 -387 L -381 -406 Q -380 -418 -389 -425 -410 -467 -416 -511 L -419 -521 -421 -531 -455 -613 -466 -635 -472 -651 -484 -675 -490 -675 Q -547 -759 -579 -852 -624 -983 -654 -1119 -672 -1200 -647 -1280 -633 -1327 -602 -1366 -555 -1427 -514 -1492 -452 -1592 -397 -1693 -350 -1780 -315 -1875 L -307 -1895 -170 -2024 -156 -2039 -63 -2070 -55 -2077 Q 1 -2089 55 -2110 L 52 -2118 54 -2127 76 -2129 Q 49 -2135 23 -2144 L 20 -2149 19 -2154 18 -2159 Q -10 -2177 -30 -2206 L -34 -2213 -50 -2237 Q -90 -2274 -103 -2324 L -106 -2328 -108 -2331 -109 -2335 Q -125 -2346 -131 -2363 L -130 -2367 -124 -2375 -131 -2398 -135 -2398 -143 -2456 -137 -2458 -136 -2458 -133 -2461 -131 -2461 -130 -2456 -129 -2462 -127 -2472 -113 -2486 -111 -2487 -119 -2489 -120 -2483 -123 -2478 -125 -2476 -132 -2472 -134 -2473 -134 -2472 -136 -2467 -140 -2462 -152 -2462 -155 -2466 -156 -2466 -161 -2463 -166 -2468 -171 -2473 Q -180 -2547 -176 -2622 L -176 -2632 -170 -2640 Q -175 -2689 -169 -2741 L -168 -2746 -158 -2749 -155 -2749 -150 -2744 -147 -2739 Q -148 -2688 -139 -2640 L -131 -2606 Q -118 -2556 -93 -2508 L -91 -2504 -94 -2494 -95 -2491 -96 -2490 -93 -2489 -87 -2484 -86 -2479 -86 -2470 Q -110 -2442 -97 -2407 L -94 -2398 Q -71 -2385 -62 -2362 -37 -2375 -16 -2396 L -12 -2401 -17 -2406 -15 -2416 -12 -2421 -4 -2422 -1 -2422 1 -2420 1 -2423 3 -2424 3 -2425 4 -2425 1 -2433 3 -2438 5 -2440 6 -2441 14 -2440 16 -2435 17 -2430 49 -2408 Q 88 -2389 170 -2388 253 -2388 185 -2354 L 164 -2349 192 -2335 198 -2332 199 -2328 201 -2331 Q 236 -2313 275 -2309 L 290 -2309 314 -2308 316 -2305 318 -2303 318 -2301 318 -2300 318 -2298 317 -2297 317 -2295 309 -2271 307 -2267 Q 287 -2235 260 -2208 L 262 -2206 307 -2236 315 -2233 318 -2230 315 -2215 314 -2210 307 -2203 320 -2202 324 -2197 331 -2188 301 -2139 329 -2082 341 -2090 344 -2095 347 -2100 Q 436 -2164 488 -2262 L 536 -2347 729 -2671 Q 779 -2759 817 -2851 L 825 -2866 Q 824 -2880 833 -2890 L 838 -2895 847 -2896 849 -2897 846 -2898 799 -2927 Q 789 -2924 775 -2927 L 752 -2953 751 -2954 741 -2972 739 -2972 Q 699 -3015 710 -3072 699 -3103 691 -3135 683 -3163 705 -3182 L 706 -3187 707 -3192 708 -3195 704 -3193 703 -3190 700 -3185 677 -3179 662 -3179 656 -3183 607 -3193 588 -3193 Q 544 -3218 518 -3256 498 -3273 485 -3299 483 -3323 488 -3346 479 -3374 479 -3405 478 -3448 495 -3487 L 499 -3490 509 -3495 519 -3492 Q 530 -3454 527 -3409 525 -3381 532 -3352 565 -3286 635 -3266 L 662 -3262 Q 685 -3284 700 -3311 L 705 -3320 Q 650 -3388 602 -3463 589 -3483 589 -3508 L 587 -3594 Q 586 -3624 600 -3645 L 600 -3647 599 -3657 Q 618 -3684 642 -3703 L 642 -3705 650 -3714 655 -3719 663 -3722 663 -3723 671 -3719 677 -3709 679 -3705 676 -3695 673 -3690 Q 659 -3632 720 -3606 L 722 -3605 743 -3630 755 -3641 Q 828 -3647 892 -3625 L 893 -3620 892 -3615 889 -3610 M 820 -3137 L 823 -3142 783 -3144 784 -3138 786 -3126 787 -3127 Q 801 -3132 811 -3119 L 812 -3118 820 -3137 M 711 -3542 L 717 -3549 709 -3548 710 -3542 711 -3542 M 733 -3208 L 729 -3223 724 -3217 732 -3209 732 -3208 733 -3208 M 200 -2610 L 224 -2617 264 -2612 277 -2609 281 -2604 283 -2600 281 -2595 277 -2590 Q 213 -2601 170 -2556 L 167 -2552 165 -2545 165 -2542 164 -2540 162 -2538 163 -2514 163 -2509 165 -2506 170 -2494 172 -2492 172 -2491 Q 203 -2476 235 -2467 L 236 -2457 233 -2448 Q 162 -2423 119 -2484 L 119 -2489 119 -2494 116 -2499 113 -2504 115 -2518 118 -2528 123 -2530 124 -2530 124 -2532 140 -2567 Q 150 -2591 174 -2603 L 176 -2605 200 -2610 M 153 -2507 L 155 -2500 158 -2498 157 -2500 155 -2502 155 -2507 153 -2507 M 59 -2360 L 55 -2361 55 -2360 59 -2360 M 139 -2121 L 118 -2122 128 -2119 139 -2121 M 278 -2178 L 244 -2150 259 -2157 278 -2178 M 858 -2896 L 853 -2897 858 -2894 858 -2896 M 19 -100 L 17 -98 19 -99 19 -100 M 38 243 L 28 316 18 442 Q 1 634 6 827 L 20 1212 Q 22 1253 13 1290 17 1343 14 1397 L 14 1406 11 1412 20 1459 27 1523 27 1529 Q 39 1559 38 1597 L 41 1650 36 1659 30 1674 25 1675 15 1675 4 1661 -6 1651 -7 1646 -7 1642 -7 1637 Q -20 1595 -38 1555 L -44 1541 -45 1540 Q -50 1529 -60 1521 -139 1526 -151 1612 L -183 1839 -177 2121 Q -171 2313 -177 2506 L -179 2564 Q -187 2706 -156 2842 L -129 2945 -128 2950 -116 2950 -110 2955 Q -102 2963 -100 2974 L -102 2979 Q -104 2990 -113 2997 L -167 3007 -169 3018 -171 3027 -243 3139 Q -276 3218 -287 3300 L -268 3343 Q -246 3379 -206 3392 L -202 3395 Q -147 3384 -93 3363 L 29 3317 Q 58 3300 88 3285 L 150 3256 167 3263 171 3261 Q 206 3254 209 3285 171 3331 116 3358 -10 3453 -148 3529 L -184 3561 -178 3578 -174 3582 -127 3579 -130 3577 243 3478 328 3409 328 3406 326 3404 323 3402 321 3392 322 3390 323 3388 322 3382 321 3382 317 3377 Q 339 3285 367 3193 L 371 3150 Q 379 3003 390 2857 L 387 2807 Q 382 2733 389 2661 L 382 2524 Q 381 2403 388 2283 L 384 2180 384 2178 374 2110 372 2093 Q 351 1980 338 1865 324 1739 324 1613 L 317 1605 284 1260 276 1214 269 1161 Q 263 1130 264 1102 L 234 932 224 920 Q 213 870 212 822 L 201 763 199 741 190 665 140 416 Q 134 379 134 342 L 134 337 129 301 Q 115 250 107 198 89 170 84 136 L 76 120 74 116 73 121 40 236 38 243 M 592 2701 L 591 2690 588 2673 592 2701 M 634 2525 Q 647 2762 632 2795 L 634 2525 M 396 3505 L 415 3507 405 3495 396 3505 M -419 -1208 Q -418 -1198 -431 -1187 L -451 -1190 -479 -1201 -496 -1200 -500 -1195 -522 -1162 -532 -1152 -535 -1134 Q -508 -1070 -492 -998 -471 -903 -438 -812 L -362 -609 Q -322 -587 -297 -551 -293 -704 -230 -841 -197 -940 -171 -1040 L -155 -1190 -159 -1233 Q -170 -1309 -172 -1386 L -172 -1387 -179 -1424 -180 -1428 -179 -1430 -188 -1460 Q -223 -1433 -248 -1395 -276 -1353 -311 -1312 -355 -1260 -408 -1215 -414 -1210 -419 -1208 M -309 -505 L -311 -476 -304 -476 -301 -473 -297 -486 -297 -500 -309 -505 M -524 -929 L -526 -935 -523 -924 -520 -917 -524 -929 M -591 3475 L -588 3479 -550 3472 -589 3467 -591 3475 M -559 3509 L -568 3508 -566 3512 -559 3509";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,0.27058825]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape165(ctx,ctrans,frame,ratio,time){
	var pathData="M 867 -3423 L 871 -3422 Q 869 -3393 857 -3362 L 850 -3340 847 -3338 Q 841 -3336 838 -3341 L 864 -3418 865 -3421 867 -3422 867 -3423 M 842 -3406 Q 842 -3379 827 -3353 L 826 -3351 824 -3350 821 -3351 Q 822 -3375 834 -3398 L 838 -3405 838 -3407 842 -3406 M 803 -3396 L 803 -3397 807 -3396 809 -3389 810 -3386 806 -3377 806 -3374 Q 804 -3369 798 -3369 L 794 -3370 800 -3392 801 -3394 802 -3396 803 -3396 M 641 -3259 Q 645 -3252 642 -3243 L 640 -3241 Q 634 -3248 639 -3258 L 641 -3259 M 621 -3213 L 619 -3215 Q 608 -3239 610 -3266 L 610 -3268 615 -3271 616 -3272 619 -3269 620 -3251 618 -3252 615 -3246 621 -3213 M 688 -2601 L 688 -2598 688 -2594 687 -2591 686 -2590 684 -2589 680 -2590 676 -2594 674 -2597 674 -2599 675 -2604 677 -2605 681 -2606 685 -2603 688 -2601 M 665 -2541 L 664 -2538 662 -2536 653 -2536 651 -2538 648 -2543 649 -2545 651 -2548 652 -2549 Q 660 -2549 664 -2543 L 665 -2541 M 654 -2502 L 656 -2501 657 -2498 655 -2493 Q 633 -2489 627 -2510 L 628 -2511 632 -2512 633 -2513 654 -2502 M 316 -1914 Q 303 -1893 279 -1891 L 277 -1893 276 -1896 308 -1919 311 -1919 312 -1919 315 -1916 316 -1914 M 309 -1876 L 285 -1858 Q 276 -1855 274 -1863 L 299 -1883 300 -1884 305 -1884 308 -1879 309 -1876 M 286 -1842 L 290 -1840 292 -1839 288 -1829 287 -1827 282 -1828 280 -1830 283 -1837 284 -1839 285 -1841 286 -1841 286 -1842 M 94 -792 L 100 -789 94 -781 91 -781 94 -792 M 118 -815 L 117 -823 113 -828 114 -830 117 -833 119 -834 120 -834 120 -835 124 -834 126 -832 125 -827 125 -825 118 -815 M 130 -800 Q 127 -778 110 -758 L 99 -742 84 -732 92 -744 125 -799 126 -800 130 -800 M 75 -691 L 75 -693 82 -699 75 -691 M 335 1514 L 340 1516 341 1521 340 1526 315 1569 314 1571 311 1572 305 1567 304 1565 328 1517 331 1513 335 1514 M 287 1539 L 292 1529 293 1527 295 1525 296 1525 296 1524 300 1525 303 1528 288 1561 287 1564 283 1569 282 1570 280 1570 275 1570 273 1568 273 1565 273 1560 279 1552 285 1550 286 1541 287 1539 M 415 3087 Q 426 3089 430 3100 L 431 3102 430 3105 428 3106 427 3107 Q 406 3102 415 3088 L 415 3087 M 417 3122 L 413 3126 409 3129 Q 385 3122 375 3101 L 374 3097 378 3095 380 3094 381 3094 416 3120 417 3122 M 780 3485 L 784 3486 789 3496 790 3498 Q 794 3540 768 3572 L 765 3574 762 3573 777 3512 777 3489 778 3487 779 3486 780 3486 780 3485 M 727 3518 L 729 3518 733 3517 Q 738 3523 736 3532 L 736 3534 731 3538 726 3537 726 3520 727 3518 M -107 -2796 L -105 -2794 -122 -2773 -124 -2773 -125 -2778 -125 -2780 -117 -2792 -114 -2796 -112 -2797 -111 -2797 -111 -2798 -107 -2796 M -56 -2772 L -57 -2767 -58 -2762 -61 -2760 -63 -2758 -67 -2759 -69 -2761 -67 -2766 -65 -2768 -65 -2770 -65 -2773 -64 -2774 -63 -2775 -59 -2774 -56 -2772 M -81 -2782 L -83 -2772 -85 -2768 Q -91 -2764 -94 -2770 L -87 -2784 -86 -2785 -82 -2783 -81 -2782 M -651 -436 L -661 -433 -665 -438 -665 -440 -664 -443 -663 -444 -661 -445 -653 -438 -651 -436 M -647 -405 L -643 -404 -632 -397 -631 -395 -632 -391 -635 -388 -649 -395 -650 -397 -651 -400 -651 -402 -651 -404 -648 -404 -647 -405 M -147 116 L -143 117 -141 119 Q -151 156 -168 192 L -169 196 -170 199 -171 200 -173 201 -178 200 -180 198 Q -170 160 -153 123 L -150 119 -149 117 -147 117 -147 116 M -126 163 L -125 165 Q -134 195 -151 223 L -153 225 -157 225 -159 223 -136 163 -135 161 -129 160 -128 160 -126 163 M -108 214 Q -98 230 -113 243 L -114 245 -119 244 -121 242 -117 228 -115 225 -115 218 -114 216 -109 214 -108 214 M -914 3394 L -899 3374 -897 3371 -893 3372 -891 3375 -890 3377 Q -906 3396 -906 3420 L -906 3425 -903 3430 -902 3432 Q -907 3444 -918 3435 L -915 3401 -914 3394 M -816 3400 L -813 3400 -809 3401 -806 3404 -806 3425 -807 3430 -810 3431 -813 3432 -820 3428 -820 3412 -821 3407 -818 3402 -816 3400 M -868 3391 L -863 3389 -862 3389 Q -854 3404 -857 3423 L -858 3425 -860 3427 -863 3428 -870 3424 -868 3393 -868 3391 M -326 3045 L -326 3050 -327 3055 -328 3056 -332 3057 -351 3044 -354 3041 -356 3034 -352 3029 -328 3043 -326 3045";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,0.39215687]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 621 -3213 L 615 -3246 618 -3252 620 -3251 633 -3249 Q 632 -3227 643 -3204 L 648 -3195 635 -3186 Q 633 -3186 630 -3189 L 621 -3213 M 100 -789 L 94 -792 88 -794 90 -802 97 -812 102 -826 106 -830 109 -833 113 -828 117 -823 118 -815 103 -787 100 -789 M 82 -699 L 89 -705 100 -712 115 -703 90 -677 79 -672 67 -678 75 -691 82 -699 M 279 1552 L 273 1553 270 1535 270 1526 283 1511 291 1505 300 1514 Q 291 1525 287 1539 L 286 1541 285 1550 279 1552 M -906 -1108 L -902 -1099 -890 -1090 -914 -1087 Q -938 -1134 -934 -1187 L -929 -1190 Q -928 -1146 -906 -1108";
	ctx.fillStyle=tocolor(ctrans.apply([0,0,0,0.67058825]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite166(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 1;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape152",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			place("sprite158",canvas,ctx,[1.0,0.0,0.0,1.0,-120.0,-2212.0],ctrans,1,(0+time)%320,0,time);
			place("sprite163",canvas,ctx,[1.0,0.0,0.0,1.0,-179.0,-2412.0],ctrans,1,(0+time)%107,0,time);
			place("shape164",canvas,ctx,[1.0,0.0,0.0,1.0,-265.0,79.0],ctrans.merge(new cxform(0,0,27,13,256,256,256,256)),1,0,0,time);
			place("shape165",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function shape167(ctx,ctrans,frame,ratio,time){
	var pathData="M 339 -21 L 346 -18 Q 357 -7 348 26 345 37 348 47 374 51 398 68 L 458 119 Q 551 195 711 205 940 195 1021 150 1067 124 1107 72 L 1109 73 1112 64 1119 34 1128 34 1129 39 Q 1153 59 1158 84 L 1161 136 1157 194 1160 194 1162 204 1156 226 Q 1183 327 1199 554 L 1210 768 Q 1230 813 1229 877 L 1229 893 1296 1316 1304 1353 1398 1749 Q 1415 1915 1454 2119 1485 2282 1527 2455 L 1576 2623 Q 1602 2727 1682 2880 L 1821 3136 Q 1772 3159 1728 3187 L 1771 3300 1782 3325 1770 3334 Q 1717 3380 1687 3433 L 1692 3448 1706 3484 1689 3502 1660 3535 1607 3578 Q 1519 3631 1344 3631 1203 3631 1071 3577 L 1023 3558 1011 3545 Q 941 3468 880 3452 L 871 3450 862 3443 852 3447 Q 785 3439 695 3474 571 3461 482 3392 L 408 3368 306 3330 304 3333 299 3347 251 3327 Q 205 3311 166 3305 L 132 3291 Q 81 3266 81 3253 L 113 3207 90 3184 36 3132 98 2851 Q 127 2729 168 2503 191 2378 209 2192 L 237 1884 237 1587 243 1435 243 1400 266 1171 Q 280 1011 280 895 280 727 297 619 L 305 575 310 231 Q 305 207 305 169 L 304 111 303 105 303 103 302 99 300 62 Q 300 30 303 23 307 12 331 -13 L 339 -21 M 1125 93 L 1118 97 Q 1109 137 1024 179 915 232 768 232 L 727 230 694 226 Q 530 215 457 153 405 90 354 58 L 369 69 349 75 Q 333 75 330 60 L 330 42 332 27 Q 319 49 319 61 319 79 334 124 L 329 129 332 145 334 179 369 225 Q 397 262 422 279 492 325 714 325 905 325 980 294 1029 274 1140 201 L 1143 135 1129 66 1125 93 M 1254 1288 Q 1253 1863 1391 2485 1502 2988 1633 3261 1502 2988 1391 2485 1253 1863 1254 1288 M 1587 2695 Q 1623 2780 1650 2905 1672 3006 1672 3040 1672 3006 1650 2905 1623 2780 1587 2695 M 294 1350 Q 295 1446 323 2061 349 2642 349 2851 349 2956 339 2996 318 3078 304 3187 L 304 3249 315 3244 304 3249 304 3187 Q 318 3078 339 2996 349 2956 349 2851 349 2642 323 2061 295 1446 294 1350 M 253 1435 L 270 1865 248 2106 Q 225 2308 225 2351 L 227 2805 Q 221 2871 117 3177 221 2871 227 2805 L 225 2351 Q 225 2308 248 2106 L 270 1865 253 1435 M 864 643 L 872 795 876 912 Q 876 1083 859 1371 841 1659 841 1816 841 2290 930 2635 L 1000 2883 Q 1037 3019 1050 3136 1037 3019 1000 2883 L 930 2635 Q 841 2290 841 1816 841 1659 859 1371 876 1083 876 912 L 872 795 864 643";
	ctx.fillStyle=tocolor(ctrans.apply([11,28,55,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 1125 93 L 1129 66 1143 135 1140 201 Q 1029 274 980 294 905 325 714 325 492 325 422 279 397 262 369 225 L 334 179 332 145 329 129 334 124 Q 319 79 319 61 319 49 332 27 L 330 42 330 60 Q 333 75 349 75 L 369 69 354 58 Q 405 90 457 153 530 215 694 226 L 727 230 768 232 Q 915 232 1024 179 1109 137 1118 97 L 1125 93";
	ctx.fillStyle=tocolor(ctrans.apply([63,137,254,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 1050 3136 Q 1037 3019 1000 2883 L 930 2635 Q 841 2290 841 1816 841 1659 859 1371 876 1083 876 912 L 872 795 864 643 M 117 3177 Q 221 2871 227 2805 L 225 2351 Q 225 2308 248 2106 L 270 1865 253 1435 M 315 3244 L 304 3249 304 3187 Q 318 3078 339 2996 349 2956 349 2851 349 2642 323 2061 295 1446 294 1350 M 1672 3040 Q 1672 3006 1650 2905 1623 2780 1587 2695 M 1633 3261 Q 1502 2988 1391 2485 1253 1863 1254 1288";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([7,19,38,1]));
	ctx.lineWidth=1.0;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

	var pathData="M 339 -21 L 346 -18 Q 357 -7 348 26 345 37 348 47 374 51 398 68 L 458 119 Q 551 195 711 205 940 195 1021 150 1067 124 1107 72 L 1109 73 1112 64 1119 34 1128 34 1129 39 Q 1153 59 1158 84 L 1161 136 1157 194 1160 194 1162 204 1156 226 Q 1183 327 1199 554 L 1210 768 Q 1230 813 1229 877 L 1229 893 1296 1316 1304 1353 1398 1749 Q 1415 1915 1454 2119 1485 2282 1527 2455 L 1576 2623 Q 1602 2727 1682 2880 L 1821 3136 Q 1772 3159 1728 3187 L 1771 3300 1782 3325 1770 3334 Q 1717 3380 1687 3433 L 1692 3448 1706 3484 1689 3502 1660 3535 1607 3578 Q 1519 3631 1344 3631 1203 3631 1071 3577 L 1023 3558 1011 3545 Q 941 3468 880 3452 L 871 3450 862 3443 852 3447 Q 785 3439 695 3474 571 3461 482 3392 L 408 3368 306 3330 304 3333 299 3347 251 3327 Q 205 3311 166 3305 L 132 3291 Q 81 3266 81 3253 L 113 3207 90 3184 36 3132 98 2851 Q 127 2729 168 2503 191 2378 209 2192 L 237 1884 237 1587 243 1435 243 1400 266 1171 Q 280 1011 280 895 280 727 297 619 L 305 575 310 231 Q 305 207 305 169 L 304 111 303 105 303 103 302 99 300 62 Q 300 30 303 23 307 12 331 -13 L 339 -21 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([51,51,51,1]));
	ctx.lineWidth=0.5;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

	var pathData="M 1290 1756 Q 1356 2103 1418 2349 1499 2674 1602 2943 L 1600 2952 1596 2952 Q 1411 2450 1285 1756 L 1290 1756 M 868 2427 L 871 2437 865 2471 858 2514 849 2515 Q 846 2506 846 2490 L 847 2455 Q 851 2429 865 2428 L 868 2427 M 1136 2584 L 1137 2612 1128 2691 1114 2695 1115 2649 1119 2610 Q 1119 2577 1108 2560 L 1114 2559 Q 1132 2570 1136 2584 M 919 2628 L 909 2637 865 2600 798 2592 Q 676 2592 665 2643 L 746 2830 Q 811 2982 818 3017 L 889 2936 Q 946 2876 981 2866 L 989 2868 991 2878 924 2944 Q 848 3021 807 3078 L 784 3029 Q 774 2990 758 2966 738 2915 738 2900 L 738 2898 709 2839 Q 643 2711 643 2658 L 645 2640 645 2639 649 2629 Q 673 2572 804 2572 L 882 2581 Q 892 2587 919 2628 M 1145 2767 L 1146 2778 1101 2838 Q 1051 2900 1035 2940 L 1029 2943 1017 2943 Q 1014 2943 1014 2934 1014 2920 1108 2787 1057 2779 1010 2752 971 2730 948 2703 968 2701 1016 2730 1071 2762 1143 2766 L 1145 2767 M 605 2401 Q 610 2381 622 2373 L 620 2377 618 2389 678 2512 Q 678 2536 654 2539 L 654 2538 657 2527 629 2479 601 2426 605 2401 M 227 2691 L 228 2701 209 2766 183 2841 177 2842 201 2768 Q 215 2723 216 2691 L 222 2688 227 2691 M 151 2966 Q 143 2991 129 2994 L 108 2988 106 2967 Q 106 2953 115 2929 L 124 2890 Q 142 2882 151 2903 L 156 2934 151 2966 M 493 3312 Q 382 3289 343 3262 L 337 3257 342 3207 561 3276 Q 599 3287 635 3319 683 3344 814 3334 951 3359 1028 3416 1102 3470 1269 3498 L 1269 3502 1425 3501 Q 1526 3476 1575 3449 1627 3423 1638 3387 L 1656 3446 1661 3458 Q 1647 3479 1618 3497 1564 3531 1446 3556 L 1446 3561 1347 3560 1248 3556 1248 3555 Q 1084 3528 1006 3471 925 3413 834 3396 L 806 3398 777 3402 Q 629 3385 583 3355 526 3319 493 3312 M 314 3200 L 313 3211 312 3199 314 3200 M 81 3063 L 150 3114 124 3177 117 3189 116 3186 123 3175 99 3156 100 3154 51 3119 65 3050 81 3063 M 1757 3045 L 1772 3071 1784 3099 Q 1742 3120 1729 3151 L 1707 3095 1707 3087 1748 3050 1757 3045 M 1836 3030 L 1832 3020 1836 3019 1836 3030 M 157 3168 Q 157 3175 168 3183 181 3191 201 3193 L 201 3194 Q 240 3209 312 3216 L 307 3274 Q 171 3253 124 3219 L 122 3217 154 3165 157 3168 M 1656 3129 L 1638 3150 Q 1616 3081 1617 3037 L 1621 3036 Q 1642 3047 1659 3117 L 1656 3129 M 1732 3243 L 1752 3301 1709 3332 Q 1678 3359 1675 3384 L 1667 3384 1646 3328 Q 1659 3302 1690 3275 L 1732 3243";
	ctx.fillStyle=tocolor(ctrans.apply([63,137,254,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite168(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 4;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape167",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("shape167",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 2:
			place("shape167",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 3:
			place("shape167",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function morphshape169(ctx,ctrans,frame,ratio,time){
	var pathData="M -373 -373 -299 -299 Q -385 -385 -227 -227 -353 -353 -163 -163 -324 -324 -105 -105 -265 -265 -83 -83 L -201 -201 -61 -61 -173 -173 -59 -59 -169 -169 -44 -44 Q -149 -149 26 26 -141 -141 99 99 L -140 -140 106 106 Q -138 -138 153 153 -99 -99 177 177 L -98 -98 178 178 -55 -55 208 208 -57 -57 213 213 -57 -57 215 215 -63 -63 222 222 Q -114 -114 292 292 -178 -178 401 401 L -232 -232 492 492 -234 -234 497 497 -253 -253 535 535 Q -259 -259 549 549 -240 -240 516 516 -222 -222 482 482 -227 -227 518 518 -232 -232 553 553 -220 -220 579 579 -208 -208 605 605 -163 -163 628 628 -119 -119 651 651 -81 -81 653 653 L 2 2 643 643 Q 48 48 632 632 66 66 597 597 L 85 85 554 554 89 89 543 543 120 120 460 460 155 155 374 374 163 163 357 357 Q 186 186 316 316 201 201 271 271 L 247 247 192 192 266 266 164 164 286 286 140 140 Q 323 323 98 98 335 335 44 44 348 348 -16 -16 314 314 -60 -60 L 349 349 -126 -126 372 372 -183 -183 Q 380 380 -211 -211 364 364 -235 -235 341 341 -270 -270 311 311 -298 -298 L 312 312 -312 -312 318 318 -335 -335 Q 332 332 -362 -362 334 334 -392 -392 338 338 -449 -449 293 293 -483 -483 253 253 -514 -514 209 209 -539 -539 197 197 -564 -564 200 200 -593 -593 204 204 -635 -635 166 166 -647 -647 L 163 163 -645 -645 92 92 -651 -651 12 12 -636 -636 -30 -30 -630 -630 -141 -141 -616 -616 Q -187 -187 -608 -608 -220 -220 -577 -577 -236 -236 -561 -561 -245 -245 -541 -541 L -246 -246 -540 -540 Q -260 -260 -515 -515 -264 -264 -487 -487 -272 -272 -437 -437 -239 -239 -401 -401 L -231 -231 -391 -391 -230 -230 -389 -389 -232 -232 -391 -391 Q -254 -254 -419 -419 -292 -292 -412 -412 L -316 -316 -399 -399 Q -337 -337 -390 -390 -350 -350 -369 -369 L -359 -359 -343 -343 -373 -373 -299 -299";
	drawMorphPath(ctx,pathData,ratio,false);
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(102+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.05755615234375+ratio*(3.0517578125E-4)/65535,0.0+ratio*(0)/65535,0.0+ratio*(0)/65535,0.05755615234375+ratio*(3.0517578125E-4)/65535,-17.0+ratio*(-26)/65535,-277.0+ratio*(-7)/65535);
	var grd=ctx.createRadialGradient(0.0+ratio*(0)/65535,0,0,0,0,16384);
	var s = 0.0+ratio*(0.043137254901960784)/65535;
	if(s<0) s = 0;
	if(s>1) s = 1;
	grd.addColorStop(s,tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(122+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(199+ratio*(56)/65535))/255)])));
	var s = 0.6313725490196078+ratio*(0.06274509803921569)/65535;
	if(s<0) s = 0;
	if(s>1) s = 1;
	grd.addColorStop(s,tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(102+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M -373 -373 -299 -299 L -359 -359 -343 -343 -350 -350 -369 -369 Q -337 -337 -390 -390 -316 -316 -399 -399 L -292 -292 -412 -412 Q -254 -254 -419 -419 -232 -232 -391 -391 L -230 -230 -389 -389 -231 -231 -391 -391 -239 -239 -401 -401 Q -272 -272 -437 -437 -264 -264 -487 -487 -260 -260 -515 -515 -246 -246 -540 -540 L -245 -245 -541 -541 Q -236 -236 -561 -561 -220 -220 -577 -577 -187 -187 -608 -608 -141 -141 -616 -616 L -30 -30 -630 -630 12 12 -636 -636 92 92 -651 -651 163 163 -645 -645 166 166 -647 -647 Q 204 204 -635 -635 200 200 -593 -593 197 197 -564 -564 209 209 -539 -539 253 253 -514 -514 293 293 -483 -483 338 338 -449 -449 334 334 -392 -392 332 332 -362 -362 318 318 -335 -335 L 312 312 -312 -312 311 311 -298 -298 Q 341 341 -270 -270 364 364 -235 -235 380 380 -211 -211 372 372 -183 -183 L 349 349 -126 -126 314 314 -60 -60 Q 348 348 -16 -16 335 335 44 44 323 323 98 98 286 286 140 140 L 266 266 164 164 247 247 192 192 201 201 271 271 Q 186 186 316 316 163 163 357 357 L 155 155 374 374 120 120 460 460 89 89 543 543 85 85 554 554 66 66 597 597 Q 48 48 632 632 2 2 643 643 L -81 -81 653 653 Q -119 -119 651 651 -163 -163 628 628 -208 -208 605 605 -220 -220 579 579 -232 -232 553 553 -227 -227 518 518 -222 -222 482 482 -240 -240 516 516 -259 -259 549 549 -253 -253 535 535 L -234 -234 497 497 -232 -232 492 492 -178 -178 401 401 Q -114 -114 292 292 -63 -63 222 222 L -57 -57 215 215 -57 -57 213 213 -55 -55 208 208 -98 -98 178 178 -99 -99 177 177 Q -138 -138 153 153 -140 -140 106 106 L -141 -141 99 99 Q -149 -149 26 26 -169 -169 -44 -44 L -173 -173 -59 -59 -201 -201 -61 -61 -265 -265 -83 -83 Q -324 -324 -105 -105 -353 -353 -163 -163 -385 -385 -227 -227 -373 -373 -299 -299 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function morphshape170(ctx,ctrans,frame,ratio,time){
	var pathData="M -373 -373 -299 -299 Q -385 -385 -227 -227 -353 -353 -163 -163 -324 -324 -105 -105 -265 -265 -83 -83 L -201 -201 -61 -61 -173 -173 -59 -59 -169 -169 -44 -44 Q -149 -149 26 26 -141 -141 99 99 L -140 -140 106 106 Q -138 -138 153 153 -99 -99 177 177 L -98 -98 178 178 -55 -55 208 208 -57 -57 213 213 -57 -57 215 215 -63 -63 222 222 Q -114 -114 292 292 -178 -178 401 401 L -232 -232 492 492 -234 -234 497 497 -253 -253 535 535 Q -259 -259 549 549 -240 -240 516 516 -222 -222 482 482 -227 -227 518 518 -232 -232 553 553 -220 -220 579 579 -208 -208 605 605 -163 -163 628 628 -119 -119 651 651 -81 -81 653 653 L 2 2 643 643 Q 48 48 632 632 66 66 597 597 L 85 85 554 554 89 89 543 543 120 120 460 460 155 155 374 374 163 163 357 357 Q 186 186 316 316 201 201 271 271 L 247 247 192 192 266 266 164 164 286 286 140 140 Q 323 323 98 98 335 335 44 44 348 348 -16 -16 314 314 -60 -60 L 349 349 -126 -126 372 372 -183 -183 Q 380 380 -211 -211 364 364 -235 -235 341 341 -270 -270 311 311 -298 -298 L 312 312 -312 -312 318 318 -335 -335 Q 332 332 -362 -362 334 334 -392 -392 338 338 -449 -449 293 293 -483 -483 253 253 -514 -514 209 209 -539 -539 197 197 -564 -564 200 200 -593 -593 204 204 -635 -635 166 166 -647 -647 L 163 163 -645 -645 92 92 -651 -651 12 12 -636 -636 -30 -30 -630 -630 -141 -141 -616 -616 Q -187 -187 -608 -608 -220 -220 -577 -577 -236 -236 -561 -561 -245 -245 -541 -541 L -246 -246 -540 -540 Q -260 -260 -515 -515 -264 -264 -487 -487 -272 -272 -437 -437 -239 -239 -401 -401 L -231 -231 -391 -391 -230 -230 -389 -389 -232 -232 -391 -391 Q -254 -254 -419 -419 -292 -292 -412 -412 L -316 -316 -399 -399 Q -337 -337 -390 -390 -350 -350 -369 -369 L -359 -359 -343 -343 -373 -373 -299 -299";
	drawMorphPath(ctx,pathData,ratio,false);
	ctx.fillStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(102+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.057861328125+ratio*(9.1552734375E-4)/65535,0.0+ratio*(0)/65535,0.0+ratio*(0)/65535,0.057861328125+ratio*(9.1552734375E-4)/65535,-43.0+ratio*(-29)/65535,-284.0+ratio*(-16)/65535);
	var grd=ctx.createRadialGradient(0.0+ratio*(0)/65535,0,0,0,0,16384);
	var s = 0.043137254901960784+ratio*(0.38823529411764707)/65535;
	if(s<0) s = 0;
	if(s>1) s = 1;
	grd.addColorStop(s,tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(122+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(255+ratio*(0)/65535))/255)])));
	var s = 0.6941176470588235+ratio*(0.2901960784313725)/65535;
	if(s<0) s = 0;
	if(s>1) s = 1;
	grd.addColorStop(s,tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(102+ratio*(0)/65535),Math.round(255+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M -373 -373 -299 -299 L -359 -359 -343 -343 -350 -350 -369 -369 Q -337 -337 -390 -390 -316 -316 -399 -399 L -292 -292 -412 -412 Q -254 -254 -419 -419 -232 -232 -391 -391 L -230 -230 -389 -389 -231 -231 -391 -391 -239 -239 -401 -401 Q -272 -272 -437 -437 -264 -264 -487 -487 -260 -260 -515 -515 -246 -246 -540 -540 L -245 -245 -541 -541 Q -236 -236 -561 -561 -220 -220 -577 -577 -187 -187 -608 -608 -141 -141 -616 -616 L -30 -30 -630 -630 12 12 -636 -636 92 92 -651 -651 163 163 -645 -645 166 166 -647 -647 Q 204 204 -635 -635 200 200 -593 -593 197 197 -564 -564 209 209 -539 -539 253 253 -514 -514 293 293 -483 -483 338 338 -449 -449 334 334 -392 -392 332 332 -362 -362 318 318 -335 -335 L 312 312 -312 -312 311 311 -298 -298 Q 341 341 -270 -270 364 364 -235 -235 380 380 -211 -211 372 372 -183 -183 L 349 349 -126 -126 314 314 -60 -60 Q 348 348 -16 -16 335 335 44 44 323 323 98 98 286 286 140 140 L 266 266 164 164 247 247 192 192 201 201 271 271 Q 186 186 316 316 163 163 357 357 L 155 155 374 374 120 120 460 460 89 89 543 543 85 85 554 554 66 66 597 597 Q 48 48 632 632 2 2 643 643 L -81 -81 653 653 Q -119 -119 651 651 -163 -163 628 628 -208 -208 605 605 -220 -220 579 579 -232 -232 553 553 -227 -227 518 518 -222 -222 482 482 -240 -240 516 516 -259 -259 549 549 -253 -253 535 535 L -234 -234 497 497 -232 -232 492 492 -178 -178 401 401 Q -114 -114 292 292 -63 -63 222 222 L -57 -57 215 215 -57 -57 213 213 -55 -55 208 208 -98 -98 178 178 -99 -99 177 177 Q -138 -138 153 153 -140 -140 106 106 L -141 -141 99 99 Q -149 -149 26 26 -169 -169 -44 -44 L -173 -173 -59 -59 -201 -201 -61 -61 -265 -265 -83 -83 Q -324 -324 -105 -105 -353 -353 -163 -163 -385 -385 -227 -227 -373 -373 -299 -299 Z";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),Math.round(0+ratio*(0)/65535),((Math.round(0+ratio*(0)/65535))/255)]));
	ctx.lineWidth=0.0+ratio*(0)/65535;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawMorphPath(ctx,pathData,ratio,true,scaleMode);

}

function shape171(ctx,ctrans,frame,ratio,time){
	var pathData="M 166 -647 Q 204 -635 200 -593 197 -564 209 -539 253 -514 293 -483 338 -449 334 -392 332 -362 318 -335 L 312 -312 311 -298 Q 341 -270 364 -235 380 -211 372 -183 L 349 -126 314 -60 Q 348 -16 335 44 323 98 286 140 L 266 164 247 192 201 271 Q 186 316 163 357 L 155 374 120 460 89 543 85 554 66 597 Q 48 632 2 643 L -81 653 Q -119 651 -163 628 -208 605 -220 579 -232 553 -227 518 -222 482 -240 516 -259 549 -253 535 L -234 497 -232 492 -178 401 Q -114 292 -63 222 L -57 215 -57 213 -55 208 -98 178 -99 177 Q -138 153 -140 106 L -141 99 Q -149 26 -169 -44 L -173 -59 -201 -61 -265 -83 Q -324 -105 -353 -163 -385 -227 -373 -299 L -359 -343 -350 -369 Q -337 -390 -316 -399 L -292 -412 Q -254 -419 -232 -391 L -230 -389 -231 -391 -239 -401 Q -272 -437 -264 -487 -260 -515 -246 -540 L -245 -541 Q -236 -561 -220 -577 -187 -608 -141 -616 L -30 -630 12 -636 92 -651 163 -645 166 -647";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([0,102,255,0.0]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.05877685546875,0,0,0.05877685546875,-72,-300);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.43137254901960786,tocolor(ctrans.apply([0,122,255,1])));
	grd.addColorStop(0.984313725490196,tocolor(ctrans.apply([0,102,255,0.0])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
}

function sprite172(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 20;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("morphshape169",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("morphshape169",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,7282,time);
			break;
		case 2:
			place("morphshape169",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,14564,time);
			break;
		case 3:
			place("morphshape169",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,21845,time);
			break;
		case 4:
			place("morphshape169",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,29127,time);
			break;
		case 5:
			place("morphshape169",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,36409,time);
			break;
		case 6:
			place("morphshape169",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,43691,time);
			break;
		case 7:
			place("morphshape169",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,50972,time);
			break;
		case 8:
			place("morphshape169",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,58254,time);
			break;
		case 9:
			place("morphshape170",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 10:
			place("morphshape170",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,6554,time);
			break;
		case 11:
			place("morphshape170",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,13107,time);
			break;
		case 12:
			place("morphshape170",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,19661,time);
			break;
		case 13:
			place("morphshape170",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,26214,time);
			break;
		case 14:
			place("morphshape170",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,32768,time);
			break;
		case 15:
			place("morphshape170",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,39322,time);
			break;
		case 16:
			place("morphshape170",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,45875,time);
			break;
		case 17:
			place("morphshape170",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,52429,time);
			break;
		case 18:
			place("morphshape170",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,58982,time);
			break;
		case 19:
			place("shape171",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function shape173(ctx,ctrans,frame,ratio,time){
	var pathData="M 6 -415 Q 0 -415 -4 -418 L -6 -424 Q -23 -432 -15 -449 L -9 -451 Q 7 -441 6 -424 L 6 -415 M -27 -472 Q -14 -438 -18 -399 L -18 -390 -22 -382 -30 -372 -46 -372 -55 -381 -54 -454 -52 -463 -48 -469 -45 -472 -43 -473 -43 -475 -27 -472 M -40 -121 Q -30 -105 -34 -85 L -37 -75 -41 -69 Q -47 -65 -55 -63 -71 -88 -59 -117 L -55 -124 -40 -121 M -16 51 L -9 58 Q -6 74 -16 85 L -24 94 Q -48 114 -64 88 -57 63 -31 48 L -30 46 -16 51 M -372 300 L -357 303 Q -347 333 -352 367 L -354 376 -361 383 -372 385 Q -386 365 -382 340 L -381 331 -389 321 -391 312 -387 308 -373 302 -372 300 M -179 3618 L -180 3627 Q -223 3523 -225 3394 -225 3388 -217 3391 -205 3506 -179 3618 M 1331 582 L 1349 585 1370 604 1379 612 1379 619 1367 628 Q 1323 620 1317 579 L 1321 579 1331 582";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape174(ctx,ctrans,frame,ratio,time){
	var pathData="M 18 -327 L 13 -310 13 -309 18 -309 Q 23 -296 20 -282 L 15 -263 6 -274 0 -291 -6 -300 -9 -300 Q -41 -319 -36 -353 L -30 -366 Q -2 -361 14 -335 L 18 -327 M 1508 706 L 1514 715 1492 725 Q 1464 709 1456 679 L 1463 673 1483 670 1508 706 M -97 70 L -101 79 -122 94 -134 88 -102 20 -98 16 -88 25 Q -89 49 -97 70 M -122 185 L -113 167 -110 158 -106 142 -98 134 -79 140 -85 158 -88 176 -96 184 -110 191 -122 185 M -363 490 L -348 488 -334 543 -333 552 Q -348 571 -363 543 -368 521 -365 497 L -363 491 -363 490 M -162 3760 L -140 3763 Q -141 3797 -131 3828 -128 3836 -128 3845 L -130 3852 -140 3857 Q -139 3828 -152 3801 L -156 3784 -164 3765 -162 3760";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape175(ctx,ctrans,frame,ratio,time){
	var pathData="M 118 -203 L 125 -196 Q 105 -156 58 -203 L 59 -212 61 -221 64 -227 73 -227 79 -227 Q 97 -212 118 -203 M 1630 818 L 1626 820 1602 821 Q 1557 803 1571 771 L 1575 767 Q 1606 787 1630 814 L 1630 818 M -9 -88 Q -4 -65 -6 -42 L -6 -33 -8 -26 Q -12 -22 -18 -21 L -18 -57 -18 -66 -27 -85 -24 -91 -9 -88 M -192 106 Q -190 135 -216 153 L -223 158 Q -245 174 -256 152 -255 131 -232 125 L -217 102 -214 94 Q -206 96 -199 100 L -192 106 M -183 228 L -180 228 Q -175 246 -183 264 L -186 273 -207 306 Q -225 295 -221 273 L -220 264 -210 255 -208 246 -207 237 -192 228 -183 228 M -313 746 L -314 755 Q -343 744 -342 709 L -334 702 -326 700 Q -314 722 -313 746 M -85 4051 L -75 4068 -67 4078 -69 4105 -73 4112 -79 4096 -82 4087 -97 4069 -104 4060 -97 4056 -89 4053 -85 4051";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape176(ctx,ctrans,frame,ratio,time){
	var pathData="M 180 -169 L 186 -163 189 -160 212 -152 220 -145 Q 198 -120 162 -133 145 -143 145 -160 145 -169 152 -171 L 153 -172 180 -169 M 1724 870 L 1764 879 1770 885 1773 888 1797 896 1801 900 Q 1756 909 1717 890 1693 877 1709 867 L 1724 870 M 6 167 L -4 164 -6 158 Q -23 150 -15 132 L -9 131 Q 7 141 6 158 L 6 167 M -289 167 L -287 173 Q -318 219 -372 220 L -375 216 Q -347 186 -311 164 L -308 161 -289 167 M -223 352 Q -210 378 -220 406 L -223 412 -226 414 -241 412 Q -251 387 -242 360 L -238 349 -223 352 M -319 901 L -317 909 Q -325 930 -337 917 L -342 909 Q -346 894 -338 883 L -326 882 -319 901 M -30 4333 L -16 4415 -15 4424 Q -48 4416 -54 4355 -56 4330 -46 4324 L -30 4333";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape177(ctx,ctrans,frame,ratio,time){
	var pathData="M 263 -130 Q 292 -117 327 -116 L 333 -112 325 -95 317 -87 287 -94 259 -100 251 -109 244 -118 257 -128 263 -130 M 1980 921 Q 1982 921 1984 924 1942 942 1910 909 L 1925 903 1929 900 Q 1951 916 1980 921 M 14 230 L 18 237 14 252 6 258 5 249 3 240 -3 230 0 224 14 230 M -427 197 L -420 207 -418 216 Q -437 259 -488 219 -467 197 -430 199 L -427 197 M -229 510 L -223 518 Q -218 532 -220 546 L -223 555 -227 561 -238 564 -243 546 -244 537 -255 518 -256 509 -252 503 -238 500 -229 510 M -336 1109 L -339 1118 Q -356 1103 -348 1067 -347 1061 -339 1064 -331 1086 -336 1109 M -27 4557 Q -26 4591 -48 4618 -50 4621 -55 4621 -54 4589 -45 4557 L -37 4548 -27 4557";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape178(ctx,ctrans,frame,ratio,time){
	var pathData="M 435 -21 L 443 -15 438 -6 430 3 Q 382 -2 378 -42 L 382 -44 391 -45 397 -45 Q 415 -30 435 -21 M 2116 943 L 2118 949 Q 2092 973 2082 941 2079 930 2090 931 L 2116 943 M 14 432 L 18 440 16 457 12 464 -4 424 Q -5 419 3 421 L 14 432 M -534 288 L -525 288 -522 288 Q -529 335 -561 377 L -568 379 -571 361 -574 352 -551 305 -549 297 -534 288 M -207 634 L -199 643 -192 652 -188 670 -183 679 -201 694 -217 691 Q -231 666 -215 641 L -207 634 M -357 1285 Q -354 1311 -372 1330 L -378 1336 Q -394 1326 -382 1312 L -375 1303 Q -377 1290 -371 1280 L -366 1276 -357 1285 M -104 4745 L -101 4754 Q -114 4799 -165 4802 L -119 4757 Q -122 4742 -110 4736 L -107 4736 -104 4745";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape179(ctx,ctrans,frame,ratio,time){
	var pathData="M 2242 948 L 2249 955 2247 972 2243 982 2219 973 Q 2210 958 2222 949 L 2227 945 2228 943 2242 948 M 443 113 L 433 103 431 56 433 46 461 49 473 85 476 103 472 107 443 113 M 3 608 L -3 612 Q -13 599 -6 580 L 0 573 7 583 9 591 3 608 M -573 492 L -577 500 -598 500 Q -598 467 -586 437 L -583 431 -582 429 -568 428 Q -556 459 -573 492 M -177 779 L -159 807 -156 815 -177 828 -198 800 Q -202 780 -183 779 L -177 779 M -419 1473 L -421 1482 Q -448 1472 -429 1429 L -424 1427 Q -415 1449 -419 1473 M -223 4811 L -221 4830 -223 4845 Q -246 4855 -253 4833 L -243 4815 -238 4808 -223 4811";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape180(ctx,ctrans,frame,ratio,time){
	var pathData="M 2368 982 L 2377 991 2375 997 2362 1003 Q 2348 994 2351 980 L 2356 973 2368 982 M 446 216 Q 442 181 457 147 459 141 467 143 L 476 152 480 188 479 197 458 216 446 216 M 15 803 L -3 794 Q -8 773 -6 752 -5 746 3 749 L 7 776 6 785 15 803 M -592 580 L -586 573 -577 582 -574 619 -574 628 -592 640 Q -603 611 -592 580 M -131 882 Q -122 898 -101 901 L -95 906 -96 924 -101 934 Q -130 935 -149 912 -150 898 -141 887 L -131 882 M -442 1636 L -444 1709 -445 1718 -456 1716 -461 1709 Q -463 1669 -455 1631 L -452 1627 -442 1636";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape181(ctx,ctrans,frame,ratio,time){
	var pathData="M 449 243 L 455 261 458 270 440 298 436 303 419 300 412 294 411 276 412 267 431 243 433 240 449 243 M 9 1006 L 8 1024 6 1033 4 1040 -6 1045 Q -11 1025 -6 1004 L 0 997 9 1006 M -568 670 L -554 698 -552 706 -564 718 -571 718 -586 709 -586 691 -586 682 -573 671 -568 670 M -133 1006 L -131 1000 -131 999 -116 997 Q -105 1018 -112 1043 L -113 1052 -128 1061 Q -136 1034 -133 1006 M -443 1909 L -445 1918 -458 1930 Q -468 1898 -454 1868 L -449 1864 Q -437 1886 -443 1909 M -712 4975 L -714 4984 -741 5002 -766 4990 -732 4969 -727 4955 -720 4948 -711 4957 -712 4975";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape182(ctx,ctrans,frame,ratio,time){
	var pathData="M 24 -430 Q -9 -402 -16 -455 L -12 -460 6 -457 20 -438 24 -430 M -135 1100 L -134 1109 Q -139 1126 -159 1130 -163 1118 -159 1097 L -159 1088 -146 1083 -140 1082 -135 1100 M -442 2085 Q -447 2110 -437 2132 L -439 2136 Q -462 2116 -470 2085 L -463 2080 -452 2076 -442 2085 M -840 5041 L -836 5045 Q -868 5048 -893 5065 L -897 5063 Q -894 5044 -873 5036 L -870 5035 -870 5033 -840 5041 M 418 334 Q 425 352 415 370 L 412 376 409 378 394 376 Q 381 360 384 340 L 385 331 403 325 409 325 418 334 M 29 1319 L 34 1327 20 1336 15 1333 8 1306 12 1300 29 1319";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape183(ctx,ctrans,frame,ratio,time){
	var pathData="M 117 -283 L 119 -275 Q 83 -269 68 -312 65 -321 76 -318 104 -309 117 -283 M 424 483 L 406 485 380 457 375 449 379 433 385 422 400 425 Q 417 445 427 471 L 427 479 424 483 M 92 1577 L 92 1585 86 1588 70 1585 57 1558 Q 50 1546 64 1548 82 1558 92 1577 M -175 1213 L -168 1221 Q -176 1247 -201 1258 L -212 1255 -220 1249 -207 1220 -207 1212 -203 1207 -195 1204 -189 1203 -175 1213 M -436 2397 L -439 2403 Q -449 2394 -446 2378 L -445 2370 -458 2351 -457 2327 Q -457 2322 -449 2324 -435 2359 -436 2397";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape184(ctx,ctrans,frame,ratio,time){
	var pathData="M 211 -125 L 214 -118 211 -111 Q 208 -107 201 -106 173 -136 170 -170 L 174 -172 Q 189 -147 211 -125 M 525 535 L 525 540 Q 496 574 461 537 L 459 528 461 512 476 512 482 512 Q 505 522 525 535 M 95 1794 L 97 1812 98 1821 92 1833 79 1827 Q 67 1810 78 1792 L 86 1785 95 1794 M -235 1297 L -229 1306 Q -227 1329 -233 1351 L -235 1358 -238 1359 -253 1358 Q -272 1320 -247 1291 L -244 1288 -235 1297 M -435 2639 L -439 2645 Q -457 2623 -451 2594 L -449 2588 -448 2586 -433 2585 Q -421 2610 -435 2639";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape185(ctx,ctrans,frame,ratio,time){
	var pathData="M 245 -30 L 256 -21 268 7 272 16 255 28 247 28 Q 218 0 228 -34 L 235 -39 245 -30 M 632 588 L 616 594 589 594 564 574 562 567 Q 568 562 574 559 L 579 557 580 555 Q 609 561 629 581 L 632 588 M 58 2109 L 57 2163 55 2172 Q 30 2158 43 2107 L 49 2100 58 2109 M -22 -375 L -24 -366 -46 -363 Q -56 -397 -52 -436 L -52 -445 -36 -456 -30 -457 Q -15 -419 -22 -375 M -256 1458 L -256 1467 -275 1476 Q -285 1455 -280 1431 L -278 1424 -277 1423 -262 1421 Q -252 1437 -256 1458 M -404 2827 L -403 2836 -417 2847 -424 2845 Q -444 2820 -431 2795 L -427 2791 Q -410 2806 -404 2827 M -1473 5209 L -1471 5214 Q -1484 5229 -1507 5229 L -1520 5223 -1498 5209 -1493 5204 -1492 5202 Q -1481 5204 -1473 5209";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape186(ctx,ctrans,frame,ratio,time){
	var pathData="M 15 -257 L -9 -245 -18 -254 -24 -263 -24 -272 -24 -281 -30 -281 Q -57 -296 -44 -315 L -30 -318 -21 -311 -18 -312 -6 -303 -1 -284 0 -275 7 -267 15 -257 M -261 1583 L -259 1591 Q -264 1617 -290 1600 -302 1583 -293 1564 L -290 1558 -289 1556 -281 1555 -275 1555 -261 1583 M -429 3042 L -433 3051 -447 3048 -452 3042 -450 3006 -449 3000 -448 2998 -433 2997 Q -423 3017 -429 3042 M -1611 5257 L -1608 5257 -1623 5302 -1626 5311 -1648 5336 Q -1660 5317 -1649 5292 L -1648 5284 Q -1642 5264 -1620 5257 L -1611 5257 M 266 152 L 269 149 280 159 287 167 292 203 293 213 278 225 Q 268 215 270 200 L 272 182 267 174 256 164 266 152 M 720 537 Q 742 546 761 558 L 763 564 Q 742 584 712 568 L 705 561 707 553 717 540 720 537 M 5 2527 L 3 2536 Q -13 2521 -6 2484 L 3 2482 Q 8 2504 5 2527";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape187(ctx,ctrans,frame,ratio,time){
	var pathData="M 68 -220 L 70 -212 61 -208 43 -209 34 -218 24 -227 27 -234 37 -242 55 -239 68 -220 M 886 621 L 891 631 884 637 870 640 Q 823 623 838 589 L 842 585 Q 872 593 886 621 M 289 400 L 287 409 276 407 272 400 Q 269 369 274 340 275 334 284 337 293 367 289 400 M -287 1677 L -293 1673 Q -299 1653 -281 1652 L -275 1652 Q -257 1678 -287 1677 M -21 2966 Q -12 2997 -16 3030 L -18 3039 -29 3036 -33 3030 Q -36 2999 -31 2969 -30 2964 -21 2966 M -438 3163 L -433 3169 Q -428 3193 -447 3213 L -455 3218 Q -467 3208 -458 3194 L -452 3185 Q -449 3172 -455 3159 L -452 3157 Q -444 3159 -438 3163 M -1700 5429 L -1701 5466 -1703 5475 -1713 5472 -1718 5466 Q -1720 5444 -1713 5424 L -1709 5420 -1700 5429";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape188(ctx,ctrans,frame,ratio,time){
	var pathData="M 171 -194 L 171 -187 Q 126 -156 104 -206 L 115 -217 128 -221 Q 155 -212 171 -194 M 909 728 L 924 766 922 773 Q 919 792 894 776 L 883 740 879 731 892 720 897 718 909 728 M 265 630 L 263 640 252 637 247 631 Q 245 599 250 570 251 564 259 567 269 598 265 630 M -48 3317 L -49 3309 Q -65 3299 -57 3283 L -46 3281 -30 3290 Q -23 3309 -30 3327 L -33 3336 Q -50 3337 -48 3317 M -471 3414 L -476 3421 Q -493 3399 -487 3370 L -485 3363 -485 3362 -470 3360 Q -458 3386 -471 3414 M -1718 5554 L -1715 5563 -1727 5566 -1739 5560 Q -1749 5548 -1746 5532 L -1745 5523 -1733 5518 -1727 5517 Q -1717 5533 -1718 5554";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape189(ctx,ctrans,frame,ratio,time){
	var pathData="M 300 -194 L 302 -187 Q 261 -167 229 -203 L 230 -212 232 -221 235 -227 244 -227 250 -227 300 -194 M 912 861 L 914 897 912 906 908 913 897 915 Q 884 885 899 856 L 903 852 912 861 M 229 800 Q 227 814 231 828 L 232 837 Q 219 853 214 873 L 198 867 215 798 220 791 229 800 M -5 3661 L -3 3669 -12 3685 -18 3687 -25 3669 -30 3660 -24 3655 -12 3651 -5 3661";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape190(ctx,ctrans,frame,ratio,time){
	var pathData="M 375 -157 L 382 -148 380 -121 378 -112 357 -109 Q 343 -134 359 -159 L 366 -166 375 -157 M 180 1055 Q 187 1083 178 1110 L 177 1118 175 1125 165 1130 Q 156 1091 165 1053 L 171 1046 180 1055 M 881 1055 L 879 1064 848 1070 853 1024 855 1015 867 1010 873 1009 Q 886 1030 881 1055 M 50 4104 L 52 4111 Q 27 4108 15 4084 13 4071 17 4059 L 28 4057 Q 33 4084 50 4104 M -44 -391 L -49 -384 Q -66 -406 -60 -436 L -58 -442 -58 -443 -43 -445 Q -31 -419 -44 -391";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape191(ctx,ctrans,frame,ratio,time){
	var pathData="M 380 -3 L 378 6 Q 370 26 354 13 345 -14 363 -37 L 369 -39 Q 382 -23 380 -3 M 105 1389 L 101 1397 Q 88 1398 87 1379 L 86 1370 103 1309 Q 104 1304 113 1306 132 1348 105 1389 M 858 1158 L 858 1167 830 1191 Q 816 1184 815 1167 L 833 1133 834 1132 842 1130 848 1130 Q 859 1142 858 1158 M 82 4496 L 83 4514 86 4523 79 4536 67 4526 65 4517 64 4508 Q 46 4498 62 4491 L 73 4487 82 4496 M -55 -290 Q -54 -296 -46 -293 -41 -271 -44 -248 L -44 -246 -40 -242 -40 -212 -40 -206 -41 -203 -43 -196 -40 -193 Q -35 -167 -38 -139 L -40 -130 -61 -130 -62 -148 Q -81 -181 -57 -230 L -53 -247 -52 -248 Q -59 -263 -55 -290";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape192(ctx,ctrans,frame,ratio,time){
	var pathData="M 339 137 L 324 149 Q 314 137 317 121 L 317 113 Q 324 106 331 102 L 336 100 Q 345 112 341 128 L 339 137 M 769 1255 L 769 1246 782 1240 787 1240 Q 797 1251 793 1267 L 790 1276 Q 780 1300 751 1300 756 1280 769 1264 L 769 1255 M 92 1582 L 89 1591 Q 61 1567 81 1522 L 86 1518 95 1527 Q 102 1555 92 1582 M 82 4805 L 79 4814 Q 72 4813 68 4808 L 64 4793 Q 49 4779 58 4762 L 64 4760 79 4769 Q 84 4786 82 4805 M -53 72 L -52 67 Q -57 45 -54 22 L -49 16 -37 25 -27 34 -25 43 -24 61 Q -34 77 -53 72";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape193(ctx,ctrans,frame,ratio,time){
	var pathData="M 314 206 Q 324 218 321 234 L 320 243 316 250 305 258 293 252 Q 286 230 296 211 L 299 203 314 206 M 698 1370 L 699 1361 708 1352 720 1349 726 1349 Q 733 1365 719 1386 L 717 1394 690 1397 Q 700 1383 698 1370 M 95 1758 Q 91 1778 102 1795 L 104 1803 Q 90 1810 76 1785 74 1767 81 1752 L 86 1749 95 1758 M 55 5157 L 55 5166 53 5173 43 5178 Q 46 5144 35 5113 L 40 5111 Q 58 5131 55 5157 M -40 255 L -37 282 -37 291 Q -50 307 -55 328 L -70 322 -54 253 -49 246 -40 255";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape194(ctx,ctrans,frame,ratio,time){
	var pathData="M 266 364 Q 278 390 268 418 L 266 425 263 426 247 425 Q 237 400 246 372 L 250 361 266 364 M 645 1420 L 647 1412 659 1410 665 1409 Q 677 1421 668 1436 L 662 1446 Q 645 1462 626 1458 634 1438 645 1420 M 101 1961 L 116 1979 122 1988 Q 119 2008 126 2026 L 122 2030 Q 99 2028 98 2009 78 1978 98 1961 L 101 1961 M 21 5490 L 24 5526 24 5535 6 5547 Q -5 5519 6 5488 L 12 5481 21 5490 M -91 479 L -88 488 Q -107 512 -107 543 L -110 549 -119 515 -119 506 -105 473 Q -103 467 -95 470 L -91 479";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape195(ctx,ctrans,frame,ratio,time){
	var pathData="M 251 546 L 253 555 235 567 223 558 Q 213 542 216 521 L 217 512 Q 224 506 233 502 L 238 500 Q 250 521 251 546 M 618 1480 L 620 1488 592 1497 Q 586 1482 604 1473 L 610 1470 618 1480 M 140 2314 L 134 2321 Q 114 2286 117 2240 L 122 2233 Q 157 2267 140 2314 M 13 6032 L 12 6041 Q 7 6058 -12 6062 L -12 5993 -12 5984 0 5979 6 5978 Q 16 6003 13 6032 M -130 797 L -134 803 Q -151 768 -141 727 L -131 725 Q -121 760 -130 797";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape196(ctx,ctrans,frame,ratio,time){
	var pathData="M 251 635 L 244 631 Q 229 610 256 609 L 263 609 Q 285 637 251 635 M 128 2500 Q 138 2516 135 2536 L 134 2545 123 2564 119 2573 107 2576 102 2507 Q 99 2493 113 2494 L 128 2500 M 21 6296 L 18 6305 5 6299 0 6293 Q 0 6271 10 6252 L 15 6250 Q 28 6273 21 6296 M -104 1046 L -101 1055 Q -148 1053 -125 996 -124 993 -119 991 L -104 1046";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape197(ctx,ctrans,frame,ratio,time){
	var pathData="M -257 -590 L -253 -581 Q -282 -523 -329 -533 L -274 -603 -265 -609 -257 -590 M -76 1297 L -76 1306 -67 1315 Q -69 1331 -58 1343 L -73 1343 -91 1315 Q -99 1294 -93 1273 -91 1267 -82 1270 -76 1283 -76 1297 M 339 679 L 363 697 361 705 354 715 333 715 Q 317 705 316 688 316 680 323 678 L 324 676 339 679 M 82 2854 L 79 2863 67 2876 Q 60 2844 71 2813 L 76 2809 Q 85 2831 82 2854 M 31 6635 L 33 6653 34 6662 41 6672 43 6681 Q 2 6673 11 6627 L 15 6626 31 6635";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape198(ctx,ctrans,frame,ratio,time){
	var pathData="M -351 -499 L -348 -490 -345 -481 Q -344 -464 -360 -454 L -362 -427 -366 -421 Q -376 -430 -374 -445 L -375 -454 -366 -472 -361 -497 -351 -499 M -1 1637 L 6 1645 8 1655 9 1664 18 1673 3 1679 -7 1673 -9 1667 -26 1611 -21 1609 -1 1637 M -6 7032 L 6 7041 Q 14 7059 14 7077 L 15 7086 12 7090 -3 7086 -11 7071 -12 7062 -18 7053 -24 7044 -11 7033 -6 7032 M 500 728 L 516 737 511 744 501 752 479 749 470 739 464 731 466 725 Q 473 720 482 718 L 500 728 M 45 3145 L 43 3154 Q 14 3135 26 3079 L 31 3069 49 3064 52 3063 45 3145";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape199(ctx,ctrans,frame,ratio,time){
	var pathData="M 3 -409 L -6 -417 -18 -427 -21 -464 -18 -475 Q 15 -466 37 -436 L 43 -427 39 -418 31 -409 3 -409 M -414 -363 L -412 -369 -412 -371 -397 -372 Q -386 -352 -389 -327 L -387 -318 -409 -309 Q -418 -335 -414 -363 M -28 7435 L -30 7444 -43 7456 Q -50 7424 -39 7394 L -33 7389 Q -25 7411 -28 7435 M 592 731 L 610 740 626 749 621 756 610 764 589 761 580 752 568 743 572 737 Q 581 732 592 731 M 104 1970 L 101 1979 Q 84 1976 85 1951 L 86 1942 64 1915 Q 69 1900 86 1905 L 92 1906 Q 118 1935 104 1970 M 18 3324 Q 30 3350 17 3378 L 12 3384 Q -6 3356 -7 3324 -8 3314 3 3318 L 18 3324";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape200(ctx,ctrans,frame,ratio,time){
	var pathData="M 128 -372 Q 143 -345 170 -325 L 177 -318 165 -300 137 -300 Q 121 -310 112 -326 L 107 -336 110 -354 113 -369 113 -371 122 -372 128 -372 M 803 746 L 796 753 726 746 729 743 803 746 M 108 2257 L 104 2267 101 2312 98 2318 Q 96 2229 104 2133 104 2128 113 2130 125 2196 108 2257 M 33 3581 L 31 3590 17 3585 12 3578 Q 16 3549 3 3524 14 3513 31 3518 43 3548 33 3581 M -371 -203 L -366 -193 -365 -166 -363 -148 -370 -142 -384 -139 Q -391 -152 -391 -166 L -391 -184 Q -403 -206 -408 -231 L -403 -239 Q -382 -226 -371 -203 M -45 7830 L -43 7838 Q -65 7841 -66 7804 -67 7799 -58 7801 L -45 7830";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape201(ctx,ctrans,frame,ratio,time){
	var pathData="M 223 -257 L 223 -212 223 -203 Q 214 -185 195 -178 L 183 -184 Q 187 -220 203 -252 L 208 -260 223 -257 M 951 696 L 940 703 903 691 Q 924 669 958 670 969 684 951 696 M 30 2578 L 24 2585 Q 16 2550 29 2509 31 2503 40 2506 54 2544 30 2578 M 51 3857 L 49 3866 31 3875 Q 15 3854 25 3830 L 28 3824 28 3822 37 3821 43 3821 Q 55 3837 51 3857 M -337 -91 L -329 -81 Q -324 -64 -327 -45 L -329 -27 -334 -20 -348 -15 Q -359 -26 -358 -42 L -357 -60 -369 -88 -369 -97 -365 -105 -361 -109 -360 -112 -345 -109 -337 -91 M -55 8150 Q -44 8176 -45 8204 L -49 8220 -77 8143 Q -79 8138 -70 8141 L -55 8150";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape202(ctx,ctrans,frame,ratio,time){
	var pathData="M 162 -112 Q 164 -83 138 -66 L 131 -60 128 -59 113 -60 106 -70 104 -78 Q 115 -104 137 -121 L 140 -124 154 -119 162 -112 M 1032 624 Q 1028 623 1025 618 1042 600 1068 592 L 1077 591 Q 1090 633 1032 624 M 92 4045 Q 97 4058 94 4072 L 92 4081 81 4079 76 4072 76 4063 76 4054 Q 63 4043 69 4031 L 73 4027 85 4037 92 4045 M -30 -478 Q -23 -461 -24 -442 L -24 -424 -32 -417 -43 -415 -55 -470 -52 -481 -30 -478 M -290 88 Q -291 108 -305 122 -307 125 -311 125 L -325 89 -333 79 -333 61 -333 52 -340 42 -342 34 -338 30 -324 23 -323 22 -308 25 -293 79 -290 88 M -37 2754 L -29 2764 -27 2773 -40 2791 Q -47 2834 -77 2866 L -79 2872 -90 2872 -91 2866 -60 2793 -58 2785 -49 2776 -44 2761 -40 2757 -37 2754 M -85 8607 L -85 8616 -104 8626 Q -114 8587 -109 8544 L -107 8538 -106 8536 -91 8535 Q -81 8569 -85 8607";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape203(ctx,ctrans,frame,ratio,time){
	var pathData="M 58 -36 Q 68 -20 64 0 L 61 10 31 28 17 23 9 16 40 -36 43 -39 58 -36 M 1226 565 L 1233 570 1154 572 Q 1144 571 1152 562 1155 559 1160 558 L 1226 565 M 147 4281 L 147 4290 128 4299 115 4253 116 4248 134 4245 140 4245 Q 150 4261 147 4281 M -24 -272 Q -19 -236 -21 -200 L -21 -190 -46 -181 -51 -202 Q -71 -228 -51 -267 L -49 -275 -36 -286 -30 -287 -28 -276 -24 -272 M -333 158 Q -320 184 -330 212 L -333 222 -342 227 -354 234 Q -359 204 -351 165 L -348 155 -333 158 M -154 3218 L -156 3227 Q -179 3155 -154 3066 -152 3061 -143 3063 -156 3137 -154 3218 M -73 8810 L -67 8819 Q -83 8839 -107 8807 L -85 8802 -79 8801 -73 8810";
	ctx.fillStyle=tocolor(ctrans.apply([255,255,255,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite204(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 61;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape173",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("shape173",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 2:
			place("shape174",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 3:
			place("shape174",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 4:
			place("shape175",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 5:
			place("shape175",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 6:
			place("shape176",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 7:
			place("shape176",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 8:
			place("shape177",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 9:
			place("shape177",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 10:
			place("shape178",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 11:
			place("shape178",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 12:
			place("shape179",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 13:
			place("shape179",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 14:
			place("shape180",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 15:
			place("shape180",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 16:
			place("shape181",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 17:
			place("shape181",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 18:
			place("shape182",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 19:
			place("shape182",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 20:
			place("shape183",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 21:
			place("shape183",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 22:
			place("shape184",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 23:
			place("shape184",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 24:
			place("shape185",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 25:
			place("shape185",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 26:
			place("shape186",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 27:
			place("shape186",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 28:
			place("shape187",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 29:
			place("shape187",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 30:
			place("shape188",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 31:
			place("shape188",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 32:
			place("shape189",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 33:
			place("shape189",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 34:
			place("shape190",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 35:
			place("shape190",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 36:
			place("shape191",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 37:
			place("shape191",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 38:
			place("shape192",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 39:
			place("shape192",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 40:
			place("shape193",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 41:
			place("shape193",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 42:
			place("shape194",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 43:
			place("shape194",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 44:
			place("shape195",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 45:
			place("shape195",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 46:
			place("shape196",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 47:
			place("shape196",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 48:
			place("shape197",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 49:
			place("shape197",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 50:
			place("shape198",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 51:
			place("shape198",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 52:
			place("shape199",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 53:
			place("shape199",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 54:
			place("shape200",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 55:
			place("shape200",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 56:
			place("shape201",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 57:
			place("shape201",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 58:
			place("shape202",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 59:
			place("shape202",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 60:
			place("shape203",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function shape205(ctx,ctrans,frame,ratio,time){
	var pathData="M -123 -37 Q -109 12 -121 62 -52 81 -9 141 8 165 2 195 -4 234 -17 271 L -18 275 -19 284 -19 289 Q 20 330 40 382 L 46 408 Q 51 455 17 488 L 13 494 Q 3 514 1 537 L 2 538 2 540 2 542 2 544 Q 22 597 11 653 L 0 681 -53 775 -68 795 -139 898 -144 906 -168 953 -201 1032 Q -201 1059 -225 1056 L -231 1050 -224 1017 -218 1003 -219 1002 -222 991 Q -214 961 -198 933 L -195 927 Q -188 901 -170 879 -158 848 -136 821 L -122 805 -117 794 -104 779 -77 737 -69 724 -66 720 -23 631 -21 617 -36 536 -35 520 Q -24 469 7 429 L 10 418 Q 3 372 -30 337 -46 319 -54 297 L -55 285 Q -53 251 -40 218 -30 193 -37 168 L -45 155 Q -83 109 -139 97 L -143 94 Q -168 75 -158 42 -143 -3 -166 -41 L -258 -39 Q -354 -10 -459 -1 -521 4 -565 49 -576 59 -581 72 -595 110 -586 150 -583 164 -591 175 -552 188 -536 231 L -535 233 -531 224 -503 183 Q -467 131 -415 96 L -409 94 -302 75 Q -258 70 -220 89 -211 93 -213 103 L -221 115 -309 110 Q -367 111 -414 137 L -422 143 Q -464 187 -497 241 L -518 269 -441 387 -434 398 -432 403 Q -403 377 -382 343 L -370 323 Q -362 308 -344 302 -302 287 -257 288 -203 295 -166 332 -163 335 -163 341 -165 351 -173 357 -202 358 -227 335 L -235 330 Q -292 309 -346 340 L -400 415 Q -410 428 -423 437 -428 464 -444 488 L -458 508 -459 509 -460 511 Q -439 542 -407 557 L -374 559 -353 553 -299 534 -281 525 -246 510 Q -237 504 -227 500 L -203 494 Q -162 489 -133 515 L -131 517 Q -123 545 -152 542 L -164 538 -209 533 Q -270 568 -337 591 L -392 598 -393 599 Q -402 624 -401 652 -378 684 -335 685 L -321 688 Q -269 704 -216 689 L -188 684 -168 685 -158 684 -118 673 Q -107 671 -103 682 -98 703 -119 711 L -143 720 -146 721 -155 735 Q -192 776 -246 785 L -285 793 Q -315 800 -312 772 -310 760 -298 757 L -209 731 -195 725 -197 725 Q -269 746 -343 723 L -379 712 Q -417 700 -430 665 L -434 642 Q -435 614 -424 590 L -430 588 -441 581 -479 535 -483 537 -487 539 -483 552 -475 589 Q -468 606 -464 625 L -440 726 Q -431 764 -391 775 -339 789 -305 829 L -295 842 Q -282 862 -304 872 L -323 869 -378 824 -381 822 -390 836 Q -430 897 -477 954 L -484 961 -497 958 Q -495 942 -482 927 L -474 916 -411 810 -429 802 Q -476 779 -486 724 L -501 651 -524 557 -525 550 -567 542 Q -581 536 -597 533 -656 519 -699 477 L -702 474 Q -748 413 -744 335 L -738 286 -727 254 Q -701 201 -654 167 L -642 164 -624 165 -626 151 -626 103 Q -622 34 -564 -3 -518 -33 -463 -39 L -264 -72 -244 -73 -177 -76 Q -135 -78 -123 -37 M -127 229 Q -108 238 -118 260 L -128 272 -137 272 Q -152 254 -135 232 L -133 230 -127 229 M -84 219 L -82 223 -100 277 -102 283 -109 286 -113 287 Q -120 262 -106 236 L -92 217 -86 217 -84 219 M -66 207 L -62 204 Q -42 206 -50 227 L -71 289 -79 297 -86 297 -89 295 -92 292 Q -86 253 -69 215 L -68 209 -66 207 M -322 412 Q -329 382 -313 361 -293 366 -297 389 -300 406 -291 420 -282 434 -283 449 L -284 452 -287 454 -289 455 Q -313 448 -320 422 L -322 412 M -671 228 L -692 266 Q -711 299 -709 337 L -698 403 Q -684 451 -639 472 L -577 496 -516 506 -511 505 -489 493 -483 487 -476 479 -462 456 -458 444 -465 426 Q -466 415 -474 406 -525 349 -560 280 L -594 216 Q -611 213 -620 198 -654 197 -671 228";
	ctx.fillStyle=tocolor(ctrans.apply([88,81,76,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape206(ctx,ctrans,frame,ratio,time){
	var pathData="M -123 -37 Q -109 12 -121 62 -52 81 -9 141 8 165 2 195 -4 234 -17 271 L -18 275 -19 284 -19 289 Q 20 330 40 382 L 46 408 Q 51 455 17 488 L 13 494 Q 3 514 1 537 L 2 538 2 540 2 542 2 544 Q 22 597 11 653 L 0 681 -53 775 -68 795 -139 898 -144 906 -168 953 -201 1032 Q -201 1059 -225 1056 L -231 1050 -224 1017 -218 1003 -219 1002 -222 991 Q -214 961 -198 933 L -195 927 Q -188 901 -170 879 -158 848 -136 821 L -122 805 -117 794 -104 779 -77 737 -69 724 -66 720 -23 631 -21 617 -36 536 -35 520 Q -24 469 7 429 L 10 418 Q 3 372 -30 337 -46 319 -54 297 L -55 285 Q -53 251 -40 218 -30 193 -37 168 L -45 155 Q -83 109 -139 97 L -143 94 Q -168 75 -158 42 -143 -3 -166 -41 L -258 -39 Q -354 -10 -459 -1 -521 4 -565 49 -576 59 -581 72 -595 110 -586 150 -583 164 -591 175 -552 188 -536 231 L -535 233 -531 224 -503 183 Q -467 131 -415 96 L -409 94 -302 75 Q -258 70 -220 89 -211 93 -213 103 L -221 115 -309 110 Q -367 111 -414 137 L -422 143 Q -464 187 -497 241 L -518 269 -441 387 -434 398 -432 403 Q -403 377 -382 343 L -370 323 Q -362 308 -344 302 -302 287 -257 288 -203 295 -166 332 -163 335 -163 341 -165 351 -173 357 -202 358 -227 335 L -235 330 Q -292 309 -346 340 L -400 415 Q -410 428 -423 437 -428 464 -444 488 L -458 508 -459 509 -460 511 Q -439 542 -407 557 L -374 559 -353 553 -299 534 -281 525 -246 510 Q -237 504 -227 500 L -203 494 Q -162 489 -133 515 L -131 517 Q -123 545 -152 542 L -164 538 -209 533 Q -270 568 -337 591 L -392 598 -393 599 Q -402 624 -401 652 -378 684 -335 685 L -321 688 Q -269 704 -216 689 L -188 684 -168 685 -158 684 -118 673 Q -107 671 -103 682 -98 703 -119 711 L -143 720 -146 721 -155 735 Q -192 776 -246 785 L -285 793 Q -315 800 -312 772 -310 760 -298 757 L -209 731 -195 725 -197 725 Q -269 746 -343 723 L -379 712 Q -417 700 -430 665 L -434 642 Q -435 614 -424 590 L -430 588 -441 581 -479 535 -483 537 -487 539 -483 552 -475 589 Q -468 606 -464 625 L -440 726 Q -431 764 -391 775 -339 789 -305 829 L -295 842 Q -282 862 -304 872 L -323 869 -378 824 -381 822 -390 836 Q -430 897 -477 954 L -484 961 -497 958 Q -495 942 -482 927 L -474 916 -411 810 -429 802 Q -476 779 -486 724 L -501 651 -524 557 -525 550 -567 542 Q -581 536 -597 533 -656 519 -699 477 L -702 474 Q -748 413 -744 335 L -738 286 -727 254 Q -701 201 -654 167 L -642 164 -624 165 -626 151 -626 103 Q -622 34 -564 -3 -518 -33 -463 -39 L -264 -72 -244 -73 -177 -76 Q -135 -78 -123 -37 M -133 230 L -127 229 Q -108 238 -118 260 L -128 272 -137 272 Q -152 254 -135 232 L -133 230 M -82 223 L -100 277 -102 283 -109 286 -113 287 Q -120 262 -106 236 L -92 217 -86 217 -84 219 -82 223 M -62 204 Q -42 206 -50 227 L -71 289 -79 297 -86 297 -89 295 -92 292 Q -86 253 -69 215 L -68 209 -66 207 -62 204 M -322 412 Q -329 382 -313 361 -293 366 -297 389 -300 406 -291 420 -282 434 -283 449 L -284 452 -287 454 -289 455 Q -313 448 -320 422 L -322 412 M -671 228 L -692 266 Q -711 299 -709 337 L -698 403 Q -684 451 -639 472 L -577 496 -516 506 -511 505 -489 493 -483 487 -476 479 -462 456 -458 444 -465 426 Q -466 415 -474 406 -525 349 -560 280 L -594 216 Q -611 213 -620 198 -654 197 -671 228";
	ctx.fillStyle=tocolor(ctrans.apply([88,81,76,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape207(ctx,ctrans,frame,ratio,time){
	var pathData="M -117 -37 Q -104 4 -115 45 L -62 82 Q -51 87 -42 95 16 141 0 210 L -8 241 -19 292 17 314 Q 38 328 47 351 67 401 37 448 13 485 0 526 L 3 538 Q 38 575 19 623 L 9 652 1 675 -28 739 Q -60 802 -113 850 -171 903 -190 981 -197 1010 -218 1032 -242 1034 -236 1012 -218 947 -187 886 -174 860 -157 837 L -101 768 Q -72 738 -56 700 L -43 669 Q -23 625 -19 579 -61 535 -31 484 -7 444 9 401 17 380 3 362 -13 340 -41 331 L -58 314 Q -63 299 -60 283 -52 236 -34 193 -37 148 -74 120 -86 111 -100 105 -137 91 -150 57 L -152 34 Q -147 11 -150 -11 -154 -47 -189 -42 L -320 -20 -452 2 Q -500 9 -540 34 L -570 58 Q -589 75 -589 98 L -588 110 Q -584 140 -590 170 -552 183 -527 223 L -470 121 Q -453 93 -423 102 L -374 90 -323 79 -256 81 Q -230 83 -236 107 -239 118 -250 119 L -268 115 Q -342 113 -413 136 L -433 139 -468 194 -501 252 -507 261 -498 281 Q -472 341 -434 396 L -432 398 -428 393 Q -395 359 -374 315 -370 307 -362 304 -327 290 -291 289 -239 303 -190 324 -175 331 -177 347 -179 364 -196 359 L -219 351 Q -251 337 -282 328 -317 319 -350 337 -369 388 -412 424 L -431 441 Q -436 475 -455 504 -449 515 -450 530 L -450 532 Q -424 557 -390 567 L -362 564 -349 564 Q -300 557 -258 533 L -213 507 -191 497 -181 495 Q -145 498 -124 524 -120 529 -123 535 L -131 546 Q -157 547 -183 536 -249 581 -323 597 L -374 606 -383 625 Q -390 635 -388 648 L -364 673 -347 679 Q -265 685 -183 683 L -170 683 -163 683 -149 677 -119 665 -114 663 Q -87 671 -104 694 L -115 704 Q -135 718 -157 719 L -158 719 Q -209 771 -281 793 L -308 791 Q -319 786 -313 776 -306 765 -292 762 -244 751 -206 722 L -245 726 Q -321 736 -391 714 -404 710 -409 697 L -420 673 Q -438 641 -419 609 L -414 599 Q -451 591 -477 562 L -489 541 -497 548 Q -486 557 -483 576 L -472 621 -453 688 -438 731 Q -425 760 -395 773 -336 768 -314 821 L -308 832 Q -298 845 -296 860 -295 869 -303 875 -333 875 -342 844 -348 822 -366 807 L -389 808 Q -419 875 -459 935 L -483 968 Q -490 988 -504 1006 L -509 1010 -511 1011 -518 1011 -520 1009 -523 1006 -497 951 -492 944 Q -466 881 -433 821 L -420 799 -446 778 Q -500 718 -513 638 -515 621 -523 606 -532 585 -531 564 L -568 563 Q -642 539 -689 479 -736 419 -743 344 -746 308 -740 273 -735 234 -710 205 L -678 178 Q -663 168 -648 163 L -627 163 -627 76 -622 59 Q -580 -9 -504 -26 L -336 -59 -274 -70 -193 -83 Q -133 -90 -117 -37 M -121 230 Q -109 245 -124 261 L -128 265 -129 266 -137 265 -138 264 -140 262 Q -141 248 -134 235 L -128 230 -121 230 M -107 233 L -105 220 Q -104 217 -100 216 L -96 215 Q -79 227 -89 249 L -96 266 Q -101 279 -112 283 L -113 285 -116 287 -117 286 -116 282 Q -122 264 -112 244 L -107 233 M -58 204 L -56 206 -55 215 -55 218 -78 287 -79 291 -83 293 -83 295 -84 296 -86 298 -86 297 -85 293 -86 291 -87 289 Q -80 244 -62 204 L -61 203 -58 204 M -306 374 Q -304 370 -299 370 -282 380 -282 403 L -282 430 -286 439 -286 444 -285 449 -286 447 -289 442 Q -310 432 -313 405 -315 388 -306 374 M -598 207 L -640 201 Q -672 216 -690 243 L -698 261 Q -715 335 -685 405 L -667 439 Q -623 502 -548 523 -536 526 -526 518 -477 479 -468 419 -515 366 -540 298 -551 269 -567 242 -579 221 -598 207";
	ctx.fillStyle=tocolor(ctrans.apply([88,81,76,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape208(ctx,ctrans,frame,ratio,time){
	var pathData="M -117 -37 Q -104 4 -115 45 L -62 82 Q -51 87 -42 95 16 141 0 210 L -8 241 -19 292 17 314 Q 38 328 47 351 67 401 37 448 13 485 0 526 L 3 538 Q 38 575 19 623 L 9 652 1 675 -28 739 Q -60 802 -113 850 -171 903 -190 981 -197 1010 -218 1032 -242 1034 -236 1012 -218 947 -187 886 -174 860 -157 837 L -101 768 Q -72 738 -56 700 L -43 669 Q -23 625 -19 579 -61 535 -31 484 -7 444 9 401 17 380 3 362 -13 340 -41 331 L -58 314 Q -63 299 -60 283 -52 236 -34 193 -37 148 -74 120 -86 111 -100 105 -137 91 -150 57 L -152 34 Q -147 11 -150 -11 -154 -47 -189 -42 L -320 -20 -452 2 Q -500 9 -540 34 L -570 58 Q -589 75 -589 98 L -588 110 Q -584 140 -590 170 -552 183 -527 223 L -470 121 Q -453 93 -423 102 L -374 90 -323 79 -256 81 Q -230 83 -236 107 -239 118 -250 119 L -268 115 Q -342 113 -413 136 L -433 139 -468 194 -501 252 -507 261 -498 281 Q -472 341 -434 396 L -432 398 -428 393 Q -395 359 -374 315 -370 307 -362 304 -327 290 -291 289 -239 303 -190 324 -175 331 -177 347 -179 364 -196 359 L -219 351 Q -251 337 -282 328 -317 319 -350 337 -369 388 -412 424 L -431 441 Q -436 475 -455 504 -449 515 -450 530 L -450 532 Q -424 557 -390 567 L -362 564 -349 564 Q -300 557 -258 533 L -213 507 -191 497 -181 495 Q -145 498 -124 524 -120 529 -123 535 L -131 546 Q -157 547 -183 536 -249 581 -323 597 L -374 606 -383 625 Q -390 635 -388 648 L -364 673 -347 679 Q -265 685 -183 683 L -170 683 -163 683 -149 677 -119 665 -114 663 Q -87 671 -104 694 L -115 704 Q -135 718 -157 719 L -158 719 Q -209 771 -281 793 L -308 791 Q -319 786 -313 776 -306 765 -292 762 -244 751 -206 722 L -245 726 Q -321 736 -391 714 -404 710 -409 697 L -420 673 Q -438 641 -419 609 L -414 599 Q -451 591 -477 562 L -489 541 -497 548 Q -486 557 -483 576 L -472 621 -453 688 -438 731 Q -425 760 -395 773 -336 768 -314 821 L -308 832 Q -298 845 -296 860 -295 869 -303 875 -333 875 -342 844 -348 822 -366 807 L -389 808 Q -419 875 -459 935 L -483 968 Q -490 988 -504 1006 L -509 1010 -511 1011 -518 1011 -520 1009 -523 1006 -497 951 -492 944 Q -466 881 -433 821 L -420 799 -446 778 Q -500 718 -513 638 -515 621 -523 606 -532 585 -531 564 L -568 563 Q -642 539 -689 479 -736 419 -743 344 -746 308 -740 273 -735 234 -710 205 L -678 178 Q -663 168 -648 163 L -627 163 -627 76 -622 59 Q -580 -9 -504 -26 L -336 -59 -274 -70 -193 -83 Q -133 -90 -117 -37 M -107 233 L -105 220 Q -104 217 -100 216 L -96 215 Q -79 227 -89 249 L -96 266 Q -101 279 -112 283 L -113 285 -116 287 -117 286 -116 282 Q -122 264 -112 244 L -107 233 M -128 230 L -121 230 Q -109 245 -124 261 L -128 265 -129 266 -137 265 -138 264 -140 262 Q -141 248 -134 235 L -128 230 M -58 204 L -56 206 -55 215 -55 218 -78 287 -79 291 -83 293 -83 295 -84 296 -86 298 -86 297 -85 293 -86 291 -87 289 Q -80 244 -62 204 L -61 203 -58 204 M -306 374 Q -304 370 -299 370 -282 380 -282 403 L -282 430 -286 439 -286 444 -285 449 -286 447 -289 442 Q -310 432 -313 405 -315 388 -306 374 M -598 207 L -640 201 Q -672 216 -690 243 L -698 261 Q -715 335 -685 405 L -667 439 Q -623 502 -548 523 -536 526 -526 518 -477 479 -468 419 -515 366 -540 298 -551 269 -567 242 -579 221 -598 207";
	ctx.fillStyle=tocolor(ctrans.apply([88,81,76,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape209(ctx,ctrans,frame,ratio,time){
	var pathData="M -135 -54 Q -116 -20 -120 22 L -120 48 Q -89 68 -54 84 -20 99 -3 133 22 182 4 235 -7 266 -11 298 35 328 49 380 56 408 39 432 L 16 468 Q -4 501 -3 539 34 590 8 648 L -9 689 -33 753 Q -52 800 -97 829 L -108 837 -118 847 Q -118 857 -127 867 L -134 878 -173 980 -176 986 -200 1017 -207 1017 -209 1016 -211 1014 -212 1009 -212 1002 -201 986 Q -212 957 -201 926 L -177 870 Q -144 811 -86 773 -72 764 -67 748 L -21 604 -19 597 Q -26 572 -38 549 L -41 537 Q -42 473 0 423 24 395 2 368 L -10 351 Q -37 336 -51 310 L -52 302 -31 197 Q -28 184 -31 171 -43 129 -81 113 -117 98 -147 79 L -154 68 Q -161 32 -158 -6 -156 -34 -177 -52 L -248 -42 -275 -34 Q -377 -12 -481 1 L -509 9 Q -545 27 -574 54 -606 84 -598 128 L -596 139 -590 181 Q -566 193 -548 214 -544 217 -543 222 L -533 240 -524 228 -502 198 -460 137 Q -438 105 -405 88 -397 84 -388 83 L -221 73 Q -189 73 -200 100 L -204 105 -335 117 -349 119 -394 123 Q -398 123 -402 126 L -427 156 -512 270 -517 275 -508 308 -504 321 Q -486 364 -447 391 -434 400 -432 414 L -419 399 -322 303 Q -305 288 -285 284 -211 280 -151 321 -147 324 -149 329 -156 352 -179 342 L -213 329 -288 326 -299 332 -376 409 -424 451 Q -432 456 -440 451 L -441 450 -443 453 Q -446 479 -459 500 L -454 514 -444 536 Q -428 555 -404 566 L -400 562 Q -368 545 -331 544 -294 542 -259 527 L -243 519 -220 501 -205 499 -205 498 Q -164 506 -133 531 -120 541 -132 552 L -135 554 Q -167 547 -197 531 L -203 532 Q -226 563 -265 571 L -294 577 -367 590 -380 592 -385 626 Q -387 646 -396 665 -329 697 -253 702 L -234 704 Q -183 682 -125 677 -96 675 -103 700 -105 708 -113 708 L -150 713 -158 733 Q -200 799 -280 797 -297 797 -308 786 -314 779 -308 771 -297 760 -280 761 -223 763 -188 722 -208 728 -227 737 L -238 739 Q -336 735 -420 689 L -424 685 Q -440 665 -426 642 L -422 631 -414 593 Q -458 584 -481 541 L -485 531 -492 536 Q -479 545 -474 565 -466 596 -466 629 -466 686 -443 738 -424 768 -387 775 -345 782 -321 818 L -304 834 Q -280 851 -299 868 -328 861 -349 839 -364 824 -383 816 L -387 814 Q -390 824 -399 834 -424 863 -442 897 -461 932 -485 964 -490 969 -496 971 L -499 975 -500 976 -501 977 -505 977 -506 974 -506 971 -504 967 -503 966 Q -479 899 -432 845 -431 827 -421 808 L -417 801 -454 783 -465 773 Q -507 714 -506 641 -505 604 -517 571 L -523 558 -524 544 -543 539 -582 531 Q -614 531 -639 513 -654 502 -660 485 -671 453 -692 425 L -729 369 Q -741 349 -741 325 -742 286 -727 250 L -711 218 Q -693 187 -659 172 L -625 167 -623 168 Q -633 118 -622 69 L -619 60 Q -586 10 -532 -16 L -491 -29 -400 -43 Q -294 -58 -193 -86 -155 -89 -135 -54 M -132 225 Q -113 240 -130 264 L -132 266 -141 267 -145 263 -147 262 Q -148 241 -135 226 L -132 225 M -58 208 L -56 210 -55 212 -67 256 -70 261 -75 261 -75 263 -78 268 -79 267 -78 261 Q -79 236 -67 212 L -63 207 -58 208 M -96 220 L -91 220 -89 222 -88 224 Q -84 233 -89 240 L -92 245 Q -92 259 -98 272 L -102 276 -111 276 -112 275 -114 273 Q -112 249 -102 227 L -99 222 -97 220 -96 220 M -314 364 Q -297 374 -298 397 L -297 408 Q -291 431 -298 452 L -306 452 Q -332 413 -321 368 L -318 365 -314 364 M -631 200 L -636 200 Q -687 219 -699 271 L -706 306 Q -712 357 -673 394 L -664 404 Q -636 443 -619 488 L -514 506 Q -488 487 -474 457 L -468 449 -468 434 -464 421 -510 375 Q -535 347 -545 311 -553 277 -567 246 -587 212 -627 202 L -631 200";
	ctx.fillStyle=tocolor(ctrans.apply([88,81,76,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function shape210(ctx,ctrans,frame,ratio,time){
	var pathData="M -135 -54 Q -116 -20 -120 22 L -120 48 Q -89 68 -54 84 -20 99 -3 133 22 182 4 235 -7 266 -11 298 35 328 49 380 56 408 39 432 L 16 468 Q -4 501 -3 539 34 590 8 648 L -9 689 -33 753 Q -52 800 -97 829 L -108 837 -118 847 Q -118 857 -127 867 L -134 878 -173 980 -176 986 -200 1017 -207 1017 -209 1016 -211 1014 -212 1009 -212 1002 -201 986 Q -212 957 -201 926 L -177 870 Q -144 811 -86 773 -72 764 -67 748 L -21 604 -19 597 Q -26 572 -38 549 L -41 537 Q -42 473 0 423 24 395 2 368 L -10 351 Q -37 336 -51 310 L -52 302 -31 197 Q -28 184 -31 171 -43 129 -81 113 -117 98 -147 79 L -154 68 Q -161 32 -158 -6 -156 -34 -177 -52 L -248 -42 -275 -34 Q -377 -12 -481 1 L -509 9 Q -545 27 -574 54 -606 84 -598 128 L -596 139 -590 181 Q -566 193 -548 214 -544 217 -543 222 L -533 240 -524 228 -502 198 -460 137 Q -438 105 -405 88 -397 84 -388 83 L -221 73 Q -189 73 -200 100 L -204 105 -335 117 -349 119 -394 123 Q -398 123 -402 126 L -427 156 -512 270 -517 275 -508 308 -504 321 Q -486 364 -447 391 -434 400 -432 414 L -419 399 -322 303 Q -305 288 -285 284 -211 280 -151 321 -147 324 -149 329 -156 352 -179 342 L -213 329 -288 326 -299 332 -376 409 -424 451 Q -432 456 -440 451 L -441 450 -443 453 Q -446 479 -459 500 L -454 514 -444 536 Q -428 555 -404 566 L -400 562 Q -368 545 -331 544 -294 542 -259 527 L -243 519 -220 501 -205 499 -205 498 Q -164 506 -133 531 -120 541 -132 552 L -135 554 Q -167 547 -197 531 L -203 532 Q -226 563 -265 571 L -294 577 -367 590 -380 592 -385 626 Q -387 646 -396 665 -329 697 -253 702 L -234 704 Q -183 682 -125 677 -96 675 -103 700 -105 708 -113 708 L -150 713 -158 733 Q -200 799 -280 797 -297 797 -308 786 -314 779 -308 771 -297 760 -280 761 -223 763 -188 722 -208 728 -227 737 L -238 739 Q -336 735 -420 689 L -424 685 Q -440 665 -426 642 L -422 631 -414 593 Q -458 584 -481 541 L -485 531 -492 536 Q -479 545 -474 565 -466 596 -466 629 -466 686 -443 738 -424 768 -387 775 -345 782 -321 818 L -304 834 Q -280 851 -299 868 -328 861 -349 839 -364 824 -383 816 L -387 814 Q -390 824 -399 834 -424 863 -442 897 -461 932 -485 964 -490 969 -496 971 L -499 975 -500 976 -501 977 -505 977 -506 974 -506 971 -504 967 -503 966 Q -479 899 -432 845 -431 827 -421 808 L -417 801 -454 783 -465 773 Q -507 714 -506 641 -505 604 -517 571 L -523 558 -524 544 -543 539 -582 531 Q -614 531 -639 513 -654 502 -660 485 -671 453 -692 425 L -729 369 Q -741 349 -741 325 -742 286 -727 250 L -711 218 Q -693 187 -659 172 L -625 167 -623 168 Q -633 118 -622 69 L -619 60 Q -586 10 -532 -16 L -491 -29 -400 -43 Q -294 -58 -193 -86 -155 -89 -135 -54 M -132 225 Q -113 240 -130 264 L -132 266 -141 267 -145 263 -147 262 Q -148 241 -135 226 L -132 225 M -58 208 L -56 210 -55 212 -67 256 -70 261 -75 261 -75 263 -78 268 -79 267 -78 261 Q -79 236 -67 212 L -63 207 -58 208 M -96 220 L -91 220 -89 222 -88 224 Q -84 233 -89 240 L -92 245 Q -92 259 -98 272 L -102 276 -111 276 -112 275 -114 273 Q -112 249 -102 227 L -99 222 -97 220 -96 220 M -314 364 Q -297 374 -298 397 L -297 408 Q -291 431 -298 452 L -306 452 Q -332 413 -321 368 L -318 365 -314 364 M -631 200 L -636 200 Q -687 219 -699 271 L -706 306 Q -712 357 -673 394 L -664 404 Q -636 443 -619 488 L -514 506 Q -488 487 -474 457 L -468 449 -468 434 -464 421 -510 375 Q -535 347 -545 311 -553 277 -567 246 -587 212 -627 202 L -631 200";
	ctx.fillStyle=tocolor(ctrans.apply([88,81,76,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function sprite211(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 6;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("sprite172",canvas,ctx,[1.0,0.0,0.0,1.0,-344.0,594.0],ctrans,1,(0+time)%20,0,time);
			place("sprite204",canvas,ctx,[1.0,0.0,0.0,1.0,-163.0,1172.0],ctrans.merge(new cxform(0,13,129,46,256,256,256,256)),1,(0+time)%61,0,time);
			place("shape205",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 1:
			place("sprite172",canvas,ctx,[1.0,0.0,0.0,1.0,-344.0,594.0],ctrans,1,(1+time)%20,0,time);
			place("sprite204",canvas,ctx,[1.0,0.0,0.0,1.0,-163.0,1172.0],ctrans.merge(new cxform(0,13,129,46,256,256,256,256)),1,(1+time)%61,0,time);
			place("shape206",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 2:
			place("sprite172",canvas,ctx,[1.0,0.0,0.0,1.0,-344.0,594.0],ctrans,1,(2+time)%20,0,time);
			place("sprite204",canvas,ctx,[1.0,0.0,0.0,1.0,-163.0,1172.0],ctrans.merge(new cxform(0,13,129,46,256,256,256,256)),1,(2+time)%61,0,time);
			place("shape207",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 3:
			place("sprite172",canvas,ctx,[1.0,0.0,0.0,1.0,-344.0,594.0],ctrans,1,(3+time)%20,0,time);
			place("sprite204",canvas,ctx,[1.0,0.0,0.0,1.0,-163.0,1172.0],ctrans.merge(new cxform(0,13,129,46,256,256,256,256)),1,(3+time)%61,0,time);
			place("shape208",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 4:
			place("sprite172",canvas,ctx,[1.0,0.0,0.0,1.0,-344.0,594.0],ctrans,1,(4+time)%20,0,time);
			place("sprite204",canvas,ctx,[1.0,0.0,0.0,1.0,-163.0,1172.0],ctrans.merge(new cxform(0,13,129,46,256,256,256,256)),1,(4+time)%61,0,time);
			place("shape209",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
		case 5:
			place("sprite172",canvas,ctx,[1.0,0.0,0.0,1.0,-344.0,594.0],ctrans,1,(5+time)%20,0,time);
			place("sprite204",canvas,ctx,[1.0,0.0,0.0,1.0,-163.0,1172.0],ctrans.merge(new cxform(0,13,129,46,256,256,256,256)),1,(5+time)%61,0,time);
			place("shape210",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function button213(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 4;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("sprite166",canvas,ctx,[1.059326171875,0.0,0.0,1.059326171875,196.0,-49.0],ctrans.merge(new cxform(-5,-5,4,0,256,256,256,256)),1,(0+time)%1,0,time);
			place("sprite168",canvas,ctx,[1.0,0.0,0.0,1.0,-749.0,-552.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,(0+time)%4,0,time);
			break;
	}
}

function shape214(ctx,ctrans,frame,ratio,time){
	var pathData="M -1871 -301 Q -1823 -433 -1692 -472 -1561 -512 -1434 -453 -1308 -396 -1271 -238 -1235 -82 -1287 59 -1339 199 -1462 246 -1586 292 -1691 215 -1797 138 -1858 -16 -1919 -170 -1871 -301";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([43,75,126,1]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.047119140625,0,0,0.047119140625,-1358,-475);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.6862745098039216,tocolor(ctrans.apply([52,114,216,1])));
	grd.addColorStop(0.8156862745098039,tocolor(ctrans.apply([43,75,126,1])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M -1700 -435 L -1702 -432 Q -1803 -400 -1808 -299 L -1803 -261 Q -1799 -246 -1801 -230 -1811 -211 -1828 -199 L -1843 -189 Q -1848 -181 -1856 -174 L -1858 -172 -1860 -140 Q -1861 -125 -1865 -111 -1874 -120 -1871 -141 L -1868 -176 -1823 -222 -1816 -228 -1811 -234 -1817 -312 Q -1819 -351 -1793 -381 -1757 -423 -1707 -445 L -1702 -443 -1700 -441 -1700 -435 M -1629 -466 L -1589 -469 Q -1492 -478 -1452 -396 -1437 -365 -1452 -336 L -1451 -333 -1447 -327 -1440 -322 Q -1390 -316 -1367 -273 L -1356 -243 -1357 -240 -1358 -237 -1358 -235 -1358 -232 -1357 -229 -1358 -228 -1361 -229 -1364 -232 -1364 -235 -1364 -237 Q -1378 -279 -1414 -299 L -1460 -321 -1461 -324 -1464 -333 -1464 -342 Q -1444 -392 -1490 -429 -1532 -464 -1589 -460 L -1637 -461 -1639 -463 -1629 -466 M -1739 -348 L -1738 -345 -1737 -343 -1737 -340 -1754 -327 -1757 -334 -1761 -340 -1761 -343 -1760 -345 -1760 -348 -1751 -353 -1742 -350 -1739 -348 M -1743 -309 L -1728 -321 -1714 -299 -1712 -296 -1702 -285 -1701 -282 -1696 -279 -1695 -276 -1694 -273 -1694 -270 -1695 -268 -1698 -264 -1705 -264 -1743 -309 M -1833 -355 Q -1868 -320 -1881 -275 -1889 -248 -1888 -216 L -1888 -213 -1886 -213 Q -1852 -219 -1843 -253 L -1841 -256 Q -1839 -269 -1844 -282 L -1847 -292 -1856 -292 Q -1873 -281 -1871 -261 L -1870 -256 Q -1860 -267 -1849 -265 -1852 -256 -1865 -248 -1871 -246 -1875 -252 L -1877 -274 -1864 -293 -1858 -298 -1845 -300 -1841 -297 Q -1832 -278 -1833 -257 L -1837 -248 Q -1847 -217 -1879 -202 L -1893 -202 -1896 -207 -1898 -210 Q -1906 -299 -1839 -356 L -1836 -358 -1833 -355 M -1811 -191 L -1808 -194 -1801 -193 -1776 -96 -1761 -97 Q -1732 -97 -1712 -83 -1691 -68 -1691 -47 -1691 -26 -1712 -12 -1727 -1 -1746 2 L -1720 72 -1618 55 -1616 61 Q -1617 75 -1597 76 L -1591 70 -1589 66 -1587 61 -1586 46 -1552 35 Q -1548 54 -1527 56 -1519 52 -1517 42 -1516 30 -1518 23 L -1457 -5 -1437 -15 -1445 -82 -1490 -80 Q -1519 -86 -1529 -109 -1539 -132 -1525 -158 -1509 -184 -1478 -197 L -1463 -203 -1474 -256 Q -1479 -280 -1490 -300 L -1489 -303 -1486 -308 -1480 -309 -1480 -310 -1479 -309 Q -1447 -267 -1438 -207 L -1418 -206 Q -1388 -200 -1378 -177 -1368 -154 -1383 -128 -1396 -106 -1421 -92 L -1421 -90 -1417 -58 -1417 -57 -1416 -47 -1415 -30 -1415 -29 -1413 -30 -1402 58 Q -1439 100 -1485 136 -1503 151 -1522 155 L -1525 157 -1528 157 -1535 162 -1543 161 -1544 162 Q -1627 166 -1702 141 L -1705 141 -1706 139 -1758 50 -1774 2 Q -1795 -1 -1811 -12 -1831 -26 -1831 -47 -1831 -68 -1811 -83 L -1796 -90 -1814 -188 -1811 -191 M -1773 -76 L -1782 -75 Q -1800 -70 -1802 -52 -1806 -21 -1773 -19 -1755 -20 -1749 -36 -1738 -70 -1773 -76 M -1373 -375 Q -1363 -363 -1366 -348 L -1368 -346 -1373 -343 -1378 -346 -1381 -348 -1381 -351 -1380 -354 -1380 -357 -1389 -372 -1397 -385 -1412 -385 Q -1404 -331 -1347 -316 L -1330 -315 -1327 -317 -1325 -320 Q -1336 -373 -1380 -411 L -1422 -438 Q -1431 -441 -1431 -450 L -1426 -454 -1423 -456 Q -1345 -427 -1314 -350 L -1313 -347 Q -1305 -339 -1305 -327 -1305 -313 -1313 -302 -1374 -290 -1412 -340 -1429 -363 -1427 -392 -1415 -411 -1391 -400 L -1373 -375 M -1594 -388 L -1594 -391 -1592 -393 -1585 -398 -1575 -397 -1573 -394 -1569 -389 -1570 -364 -1598 -369 -1598 -379 -1596 -382 -1594 -385 -1594 -388 M -1578 -347 L -1573 -343 Q -1579 -318 -1593 -295 -1598 -287 -1606 -295 L -1599 -348 -1578 -347 M -1452 -174 Q -1472 -168 -1474 -149 -1478 -114 -1442 -112 -1421 -112 -1415 -130 -1402 -169 -1442 -176 L -1452 -174 M -1275 -177 L -1273 -177 -1269 -178 -1269 -179 -1261 -173 -1259 -171 -1256 -142 -1256 -136 Q -1284 -132 -1280 -166 L -1275 -177 M -1389 -46 Q -1361 -58 -1336 -78 L -1316 -93 -1317 -62 Q -1348 -5 -1390 45 L -1400 -38 -1389 -46 M -1277 -49 L -1274 -46 Q -1270 11 -1299 65 L -1307 84 Q -1311 96 -1321 103 L -1324 103 -1320 51 Q -1295 2 -1281 -49 L -1281 -50 -1277 -49 M -1399 99 L -1401 104 -1418 123 -1442 148 -1461 168 -1478 180 -1484 184 -1486 184 -1501 189 -1507 188 -1506 179 -1505 177 -1479 161 -1472 155 -1472 153 -1471 151 -1463 146 -1454 138 -1401 85 -1399 99 M -1538 184 L -1532 185 -1530 187 -1528 189 -1528 191 -1527 194 -1527 196 -1528 198 -1531 202 Q -1593 204 -1652 188 L -1659 174 -1648 174 -1540 185 -1538 184 M -1819 81 L -1818 82 -1820 82 -1819 81 M -1795 95 L -1808 75 -1759 75 -1728 131 Q -1763 116 -1795 95";
	ctx.fillStyle=tocolor(ctrans.apply([255,207,29,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -1452 -174 L -1442 -176 Q -1402 -169 -1415 -130 -1421 -112 -1442 -112 -1478 -114 -1474 -149 -1472 -168 -1452 -174";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([43,75,126,1]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.00360107421875,0,0,0.00360107421875,-1442,-128);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.4666666666666667,tocolor(ctrans.apply([0,0,0,1])));
	grd.addColorStop(0.6509803921568628,tocolor(ctrans.apply([43,75,126,1])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M -1773 -76 Q -1738 -70 -1749 -36 -1755 -20 -1773 -19 -1806 -21 -1802 -52 -1800 -70 -1782 -75 L -1773 -76";
	drawPath(ctx,pathData,false);
	ctx.fillStyle=tocolor(ctrans.apply([43,75,126,1]));
	ctx.fill("evenodd");
	ctx.save();
	ctx.clip();
	ctx.transform(0.003204345703125,0,0,0.003204345703125,-1773,-34);
	var grd=ctx.createRadialGradient(0.0,0,0,0,0,16384);
	grd.addColorStop(0.4666666666666667,tocolor(ctrans.apply([0,0,0,1])));
	grd.addColorStop(0.6509803921568628,tocolor(ctrans.apply([43,75,126,1])));
	ctx.fillStyle = grd;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
}

function sprite215(ctx,ctrans,frame,ratio,time){
	var clips = [];
	var frame_cnt = 1;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape214",canvas,ctx,[1.0,0.0,0.0,1.0,0.0,0.0],ctrans,1,0,0,time);
			break;
	}
}

function shape216(ctx,ctrans,frame,ratio,time){
	var pathData="M 1829 4065 L 1831 4076 Q 1831 4091 1828 4086 L 1815 4092 1797 4076 Q 1797 4068 1800 4064 L 1827 4062 1829 4065";
	ctx.fillStyle=tocolor(ctrans.apply([56,130,248,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
}

function main(ctx,ctrans,frame,ratio,time){
	ctx.save();
	ctx.transform(1,0,0,1,0.0,0.0);
	var clips = [];
	var frame_cnt = 2;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape1",canvas,ctx,[0.05,0.0,0.0,0.05,0.0,0.0],ctrans,1,0,0,time);
			place("sprite5",canvas,ctx,[0.052030181884765624,0.0,0.0,0.08890304565429688,179.05,80.4],ctrans.merge(new cxform(180,111,236,0,256,256,256,164)),1,(0+time)%3,0,time);
			break;
		case 1:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,0.0,0.0],ctrans,1,0,0,time);
			place("shape7",canvas,ctx,[0.017852783203125,0.0,0.0,0.018067169189453124,72.4,2238.9],ctrans.merge(new cxform(-29,-29,-1,-144,256,256,256,256)),1,0,0,time);
			place("shape8",canvas,ctx,[0.0403106689453125,0.0,0.0,0.0403106689453125,154.2,1214.65],ctrans.merge(new cxform(-33,-24,-5,0,256,256,256,256)),1,0,0,time);
			place("sprite10",canvas,ctx,[-0.07257537841796875,0.0,0.0,0.08456954956054688,22.2,943.8],ctrans.merge(new cxform(-135,-10,-10,-204,256,256,256,256)),1,(0+time)%1,1,time);
			place("button19",canvas,ctx,[0.0403106689453125,0.0,0.0,0.0403106689453125,82.9,482.2],ctrans,1,0,1,time);
			place("button46",canvas,ctx,[0.0403106689453125,0.0,0.0,0.0403106689453125,84.4,622.0],ctrans.merge(new cxform(-51,0,23,0,256,256,256,256)),1,0,1,time);
			place("button52",canvas,ctx,[0.0403106689453125,0.0,0.0,0.0403106689453125,82.3,856.55],ctrans.merge(new cxform(37,37,51,0,256,256,256,256)),1,0,1,time);
			place("button68",canvas,ctx,[0.0403106689453125,0.0,0.0,0.0403106689453125,84.35,965.95],ctrans,1,0,1,time);
			place("button79",canvas,ctx,[0.0403106689453125,0.0,0.0,0.0403106689453125,82.05,1068.1],ctrans.merge(new cxform(-5,-5,-5,0,256,256,256,256)),1,0,1,time);
			place("button93",canvas,ctx,[0.0403106689453125,0.0,0.0,0.0403106689453125,83.25,1179.35],ctrans.merge(new cxform(-10,13,27,0,256,256,256,256)),1,0,1,time);
			place("button103",canvas,ctx,[0.0403106689453125,0.0,0.0,0.0403106689453125,109.75,1308.8],ctrans.merge(new cxform(-5,9,0,0,256,256,256,256)),1,0,1,time);
			place("shape104",canvas,ctx,[0.0403106689453125,0.0,0.0,0.0403106689453125,157.15,1214.8],ctrans.merge(new cxform(-10,-5,4,-56,256,256,256,256)),1,0,0,time);
			place("shape105",canvas,ctx,[0.05,0.0,0.0,0.05,0.0,0.0],ctrans,1,0,0,time);
			place("button150",canvas,ctx,[0.0472747802734375,0.0,0.0,0.0472747802734375,69.0,267.15],ctrans,1,0,1,time);
			place("shape151",canvas,ctx,[0.05,0.0,0.0,0.05,0.0,0.0],ctrans,1,0,0,time);
			place("button213",canvas,ctx,[0.05,0.0,0.0,0.05,104.15,201.3],ctrans,1,0,1,time);
			place("sprite215",canvas,ctx,[0.05487060546875,0.0,0.0,0.05487060546875,51.25,79.55],ctrans.merge(new cxform(-14,-10,0,0,256,256,256,256)),1,(0+time)%1,1,time);
			place("shape216",canvas,ctx,[0.05,0.0,0.0,0.05,0.0,0.0],ctrans,1,0,0,time);
			place("sprite168",canvas,ctx,[0.05,0.0,0.0,0.05,66.6,173.6],ctrans,1,(0+time)%4,1,time);
			break;
	}
	ctx.restore();
}

var frame = -1;
var time = 0;
var frames = [];
frames.push(1);

var backgroundColor = "#ffffff";
var originalWidth = 303;
var originalHeight= 2280;
function nextFrame(ctx,ctrans){
	var oldframe = frame;
	frame = (frame+1)%frames.length;
	if(frame==oldframe){time++;}else{time=0;};
	drawFrame();
}

function drawFrame(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.save();
	ctx.transform(canvas.width/originalWidth,0,0,canvas.height/originalHeight,0,0);
	main(ctx,ctrans,frames[frame],0,time);
	ctx.restore();
}




const characters = {shape1:shape1,font2:font2,text3:text3,text4:text4,sprite5:sprite5,shape6:shape6,shape7:shape7,shape8:shape8,shape9:shape9,sprite10:sprite10,shape11:shape11,sprite12:sprite12,shape13:shape13,shape14:shape14,shape15:shape15,shape16:shape16,sprite17:sprite17,button19:button19,shape20:shape20,sprite21:sprite21,shape22:shape22,shape23:shape23,shape24:shape24,shape25:shape25,shape26:shape26,shape27:shape27,shape28:shape28,shape29:shape29,shape30:shape30,shape31:shape31,shape32:shape32,shape33:shape33,shape34:shape34,shape35:shape35,shape36:shape36,shape37:shape37,shape38:shape38,shape39:shape39,shape40:shape40,shape41:shape41,shape42:shape42,shape43:shape43,sprite44:sprite44,button46:button46,shape47:shape47,sprite48:sprite48,shape49:shape49,sprite50:sprite50,button52:button52,shape53:shape53,morphshape55:morphshape55,shape56:shape56,sprite57:sprite57,sprite58:sprite58,shape59:shape59,shape60:shape60,shape61:shape61,shape62:shape62,shape63:shape63,shape64:shape64,shape65:shape65,sprite66:sprite66,button68:button68,shape69:shape69,sprite71:sprite71,shape72:shape72,shape73:shape73,shape74:shape74,shape75:shape75,shape76:shape76,sprite77:sprite77,button79:button79,shape80:shape80,sprite81:sprite81,shape82:shape82,sprite83:sprite83,shape84:shape84,shape85:shape85,sprite86:sprite86,shape87:shape87,shape88:shape88,shape89:shape89,shape90:shape90,sprite91:sprite91,button93:button93,shape94:shape94,shape95:shape95,sprite97:sprite97,shape98:shape98,shape99:shape99,shape100:shape100,sprite101:sprite101,button103:button103,shape104:shape104,shape105:shape105,morphshape106:morphshape106,morphshape107:morphshape107,morphshape108:morphshape108,morphshape109:morphshape109,morphshape110:morphshape110,morphshape111:morphshape111,morphshape112:morphshape112,morphshape113:morphshape113,morphshape114:morphshape114,morphshape115:morphshape115,morphshape116:morphshape116,morphshape117:morphshape117,morphshape118:morphshape118,morphshape119:morphshape119,morphshape120:morphshape120,morphshape121:morphshape121,morphshape122:morphshape122,morphshape123:morphshape123,shape124:shape124,sprite125:sprite125,morphshape126:morphshape126,morphshape127:morphshape127,morphshape128:morphshape128,morphshape129:morphshape129,morphshape130:morphshape130,shape131:shape131,sprite132:sprite132,morphshape133:morphshape133,morphshape134:morphshape134,morphshape135:morphshape135,morphshape136:morphshape136,morphshape137:morphshape137,morphshape138:morphshape138,morphshape139:morphshape139,shape140:shape140,sprite141:sprite141,sprite142:sprite142,shape143:shape143,shape144:shape144,shape145:shape145,shape146:shape146,shape147:shape147,sprite148:sprite148,button150:button150,shape151:shape151,shape152:shape152,morphshape153:morphshape153,shape154:shape154,shape155:shape155,morphshape156:morphshape156,shape157:shape157,sprite158:sprite158,shape159:shape159,shape160:shape160,shape161:shape161,shape162:shape162,sprite163:sprite163,shape164:shape164,shape165:shape165,sprite166:sprite166,shape167:shape167,sprite168:sprite168,morphshape169:morphshape169,morphshape170:morphshape170,shape171:shape171,sprite172:sprite172,shape173:shape173,shape174:shape174,shape175:shape175,shape176:shape176,shape177:shape177,shape178:shape178,shape179:shape179,shape180:shape180,shape181:shape181,shape182:shape182,shape183:shape183,shape184:shape184,shape185:shape185,shape186:shape186,shape187:shape187,shape188:shape188,shape189:shape189,shape190:shape190,shape191:shape191,shape192:shape192,shape193:shape193,shape194:shape194,shape195:shape195,shape196:shape196,shape197:shape197,shape198:shape198,shape199:shape199,shape200:shape200,shape201:shape201,shape202:shape202,shape203:shape203,sprite204:sprite204,shape205:shape205,shape206:shape206,shape207:shape207,shape208:shape208,shape209:shape209,shape210:shape210,sprite211:sprite211,button213:button213,shape214:shape214,sprite215:sprite215,shape216:shape216};

/* Native timeline controller. */
var paused = false;
var selectedButton = '';
var buttonState = 1;
var selectedAt = 0;
var buttonRecords = {"19": [{"name": "sprite12", "states": [false, true, true, false], "depth": 1, "matrix": [1.0, 0.0, 0.0, 1.0, 20.0, 20.0], "color": [0, 0, 0, 0, 256, 256, 256, 256]}, {"name": "shape11", "states": [false, false, false, true], "depth": 1, "matrix": [1.0, 0.0, 0.0, 1.0, 20.0, 20.0], "color": [0, 0, 0, -255, 256, 256, 256, 256]}, {"name": "sprite17", "states": [false, true, false, false], "depth": 3, "matrix": [0.1746521, -0.10018921, 0.02835083, 0.15888977, 2807.0, 140.0], "color": [0, -144, -19, -153, 0, 0, 0, 256]}, {"name": "sprite17", "states": [false, true, false, false], "depth": 5, "matrix": [0.1746521, -0.10018921, 0.02835083, 0.15888977, 2793.0, 182.0], "color": [-140, 199, 255, 255, 0, 0, 0, 256]}], "46": [{"name": "sprite21", "states": [false, true, true, false], "depth": 1, "matrix": [1.0, 0.0, 0.0, 1.0, 0.0, 0.0], "color": [37, 23, 18, 0, 256, 256, 256, 256]}, {"name": "shape20", "states": [false, false, false, true], "depth": 1, "matrix": [1.0, 0.0, 0.0, 1.0, 0.0, 0.0], "color": [46, 32, 31, -255, 256, 256, 256, 256]}, {"name": "sprite44", "states": [false, true, false, false], "depth": 3, "matrix": [0.39585876, -0.07208252, 0.0, 0.39585876, 2604.0, 431.0], "color": [255, 255, 255, -167, 0, 0, 0, 256]}, {"name": "sprite44", "states": [false, true, false, false], "depth": 5, "matrix": [0.39585876, -0.07208252, 0.0, 0.39585876, 2624.0, 413.0], "color": [51, 51, 51, 0, 0, 0, 0, 256]}], "52": [{"name": "sprite48", "states": [false, true, true, false], "depth": 1, "matrix": [1.0, 0.0, 0.0, 1.0, 60.0, -60.0], "color": [0, 0, 0, 0, 256, 256, 256, 256]}, {"name": "shape47", "states": [false, false, false, true], "depth": 1, "matrix": [1.0, 0.0, 0.0, 1.0, 60.0, -60.0], "color": [0, 0, 0, -255, 256, 256, 256, 256]}, {"name": "sprite50", "states": [false, true, false, false], "depth": 3, "matrix": [0.19055176, 0.0, 0.006790161, 0.13298035, 3274.0, 1201.0], "color": [-237, -255, -218, -116, 256, 256, 256, 256]}, {"name": "sprite50", "states": [false, true, false, false], "depth": 5, "matrix": [0.1778717, 0.0, 0.0063171387, 0.12414551, 3256.0, 1157.0], "color": [-56, -38, 106, 0, 256, 256, 256, 256]}], "68": [{"name": "sprite58", "states": [false, true, true, false], "depth": 1, "matrix": [1.0, 0.0, 0.0, 1.0, 0.0, 0.0], "color": [-24, -10, 13, 0, 256, 256, 256, 256]}, {"name": "shape53", "states": [false, false, false, true], "depth": 2, "matrix": [1.0, 0.0, 0.0, 1.0, 0.0, 0.0], "color": [-24, -10, 13, -255, 256, 256, 256, 256]}, {"name": "sprite66", "states": [false, true, false, false], "depth": 5, "matrix": [0.5191803, 0.0, 0.0, 0.5191803, 3333.0, 453.0], "color": [0, 0, 0, 0, 256, 256, 256, 256]}, {"name": "sprite57", "states": [false, false, true, false], "depth": 5, "matrix": [0.76571655, 0.0, 0.0, 0.9361572, 19.0, -82.0], "color": [0, 32, 78, -70, 256, 256, 256, 256]}], "79": [{"name": "sprite71", "states": [false, true, true, false], "depth": 1, "matrix": [1.0, 0.0, 0.0, 1.0, 87.0, 107.0], "color": [0, 0, 0, 0, 256, 256, 256, 256]}, {"name": "shape69", "states": [false, false, false, true], "depth": 1, "matrix": [1.0, 0.0, 0.0, 1.0, 87.0, 107.0], "color": [0, 0, 0, -255, 256, 256, 256, 256]}, {"name": "sprite77", "states": [false, true, false, false], "depth": 3, "matrix": [0.30387878, 0.0, 0.0, 0.30387878, 3194.0, -13.0], "color": [0, 0, 0, 0, 256, 256, 256, 256]}], "93": [{"name": "sprite81", "states": [false, true, true, false], "depth": 1, "matrix": [0.38180542, 0.0, 0.0, 0.57514954, 3999.0, -170.0], "color": [125, 125, 143, -10, 256, 256, 256, 256]}, {"name": "shape84", "states": [false, false, false, true], "depth": 1, "matrix": [1.0, 0.0, 0.0, 1.0, 60.0, 260.0], "color": [0, 0, 0, -255, 256, 256, 256, 256]}, {"name": "sprite83", "states": [false, true, true, false], "depth": 4, "matrix": [0.040237427, 0.0, 0.0, 0.06059265, 4087.0, -694.0], "color": [55, 27, 41, -75, 256, 256, 256, 256]}, {"name": "sprite86", "states": [false, true, true, false], "depth": 6, "matrix": [1.0, 0.0, 0.0, 1.0, 60.0, 260.0], "color": [0, 0, 0, 0, 256, 256, 256, 256]}, {"name": "sprite91", "states": [false, true, false, false], "depth": 9, "matrix": [1.0820007, 0.0, -0.1010437, 1.0497894, 2722.0, -242.0], "color": [-167, 185, 255, -172, -256, -256, -100, 256]}, {"name": "sprite91", "states": [false, true, false, false], "depth": 11, "matrix": [0.9788208, 0.0, -0.091415405, 0.9215088, 2725.0, -208.0], "color": [0, 0, 0, 0, 256, 256, 256, 256]}], "103": [{"name": "sprite97", "states": [false, true, true, false], "depth": 1, "matrix": [1.0, 0.0, 0.0, 1.0, -53.0, -73.0], "color": [0, 0, 0, 0, 256, 256, 256, 256]}, {"name": "shape94", "states": [false, false, false, true], "depth": 1, "matrix": [1.0, 0.0, 0.0, 1.0, -53.0, -73.0], "color": [0, 0, 0, -255, 256, 256, 256, 256]}, {"name": "shape95", "states": [false, false, false, true], "depth": 2, "matrix": [1.0, 0.0, 0.0, 1.0, -182.0, 387.0], "color": [0, 0, 0, -255, 256, 256, 256, 256]}, {"name": "sprite101", "states": [false, true, false, false], "depth": 4, "matrix": [0.7637024, -0.33546448, 0.33546448, 0.7637024, 2410.0, -2284.0], "color": [0, 0, 0, 0, 256, 256, 256, 256]}], "150": [{"name": "sprite142", "states": [true, false, false, false], "depth": 1, "matrix": [0.6033325, 0.0, 0.0, 0.6033325, -409.0, 1848.0], "color": [0, 0, 0, -38, 256, 256, 256, 256]}, {"name": "sprite142", "states": [false, true, true, false], "depth": 1, "matrix": [0.6033325, 0.0, 0.0, 0.6033325, -409.0, 1848.0], "color": [0, 0, 0, 0, 256, 256, 256, 256]}, {"name": "morphshape106", "states": [false, false, false, true], "depth": 1, "matrix": [0.0, -0.42095947, 0.42095947, 0.0, -187.0, 436.0], "color": [0, 0, 0, -61, 256, 256, 256, 256]}, {"name": "morphshape107", "states": [false, false, false, true], "depth": 2, "matrix": [0.0, -0.42095947, 0.42095947, 0.0, -176.0, 434.0], "color": [0, 0, 0, -265, 256, 256, 256, 256]}, {"name": "morphshape106", "states": [false, false, false, true], "depth": 3, "matrix": [0.0, -0.6395416, 0.6395416, 0.0, 60.0, -170.0], "color": [0, 0, 0, -24, 256, 256, 256, 256]}, {"name": "morphshape107", "states": [false, false, false, true], "depth": 4, "matrix": [0.0, -0.6395416, 0.6395416, 0.0, 77.0, -173.0], "color": [0, 0, 0, -228, 256, 256, 256, 256]}, {"name": "morphshape133", "states": [false, false, false, true], "depth": 5, "matrix": [0.48028564, 0.0, 0.0, 0.48028564, 1222.0, 1952.0], "color": [23, 111, 255, -200, 256, 256, 256, 256]}, {"name": "morphshape106", "states": [false, false, false, true], "depth": 6, "matrix": [-0.34606934, -0.19728088, 0.32485962, -0.15855408, -1216.0, 1768.0], "color": [-255, -255, -255, -112, 256, 256, 256, 256]}, {"name": "morphshape107", "states": [false, false, false, true], "depth": 7, "matrix": [-0.34606934, -0.19728088, 0.32485962, -0.15855408, -1209.0, 1763.0], "color": [-255, -255, -255, -316, 256, 256, 256, 256]}, {"name": "morphshape106", "states": [false, false, false, true], "depth": 8, "matrix": [-0.5257721, -0.29971313, 0.49354553, -0.2408905, -1523.0, 1391.0], "color": [-255, -255, -255, -75, 256, 256, 256, 256]}, {"name": "sprite142", "states": [true, false, false, false], "depth": 9, "matrix": [0.4656067, -0.22724915, 0.4960022, 0.28274536, -226.0, 2514.0], "color": [-255, -255, -255, -65, 256, 256, 256, 256]}, {"name": "sprite142", "states": [false, true, true, false], "depth": 9, "matrix": [0.4656067, -0.22724915, 0.4960022, 0.28274536, -226.0, 2514.0], "color": [-255, -255, -255, -51, 256, 256, 256, 256]}, {"name": "morphshape107", "states": [false, false, false, true], "depth": 9, "matrix": [-0.5257721, -0.29971313, 0.49354553, -0.2408905, -1513.0, 1383.0], "color": [-255, -255, -255, -279, 256, 256, 256, 256]}, {"name": "morphshape133", "states": [false, false, false, true], "depth": 10, "matrix": [0.37065125, -0.1809082, 0.39485168, 0.2250824, 1118.0, 1949.0], "color": [-232, -144, 0, -251, 256, 256, 256, 256]}, {"name": "sprite148", "states": [false, true, false, false], "depth": 17, "matrix": [0.47062683, 0.0, 0.0, 0.47062683, -314.0, 1158.0], "color": [0, 0, 0, 0, 256, 256, 256, 256]}], "213": [{"name": "sprite166", "states": [true, true, true, false], "depth": 1, "matrix": [1.0593262, 0.0, 0.0, 1.0593262, 196.0, -49.0], "color": [-5, -5, 4, 0, 256, 256, 256, 256]}, {"name": "shape152", "states": [false, false, false, true], "depth": 1, "matrix": [1.0593262, 0.0, 0.0, 1.0593262, 196.0, -49.0], "color": [-5, -5, 4, 0, 256, 256, 256, 256]}, {"name": "morphshape153", "states": [false, false, false, true], "depth": 2, "matrix": [1.0593262, 0.0, 0.0, 1.0593262, 69.0, -2392.0], "color": [-5, -5, 4, 0, 256, 256, 256, 256]}, {"name": "shape159", "states": [false, false, false, true], "depth": 3, "matrix": [1.0593262, 0.0, 0.0, 1.0593262, 6.0, -2604.0], "color": [-5, -5, 4, 0, 256, 256, 256, 256]}, {"name": "shape164", "states": [false, false, false, true], "depth": 4, "matrix": [1.0593262, 0.0, 0.0, 1.0593262, -85.0, 35.0], "color": [-5, -5, 31, 13, 256, 256, 256, 256]}, {"name": "shape165", "states": [false, false, false, true], "depth": 5, "matrix": [1.0593262, 0.0, 0.0, 1.0593262, 196.0, -49.0], "color": [-5, -5, 4, 0, 256, 256, 256, 256]}, {"name": "shape167", "states": [false, false, false, true], "depth": 7, "matrix": [1.0, 0.0, 0.0, 1.0, -749.0, -550.0], "color": [0, 0, 0, 0, 256, 256, 256, 256]}, {"name": "sprite168", "states": [true, false, false, false], "depth": 9, "matrix": [1.0, 0.0, 0.0, 1.0, -749.0, -552.0], "color": [0, 0, 0, 0, 256, 256, 256, 256]}, {"name": "sprite168", "states": [false, true, false, false], "depth": 9, "matrix": [1.0, 0.0, 0.0, 1.0, -748.0, -551.0], "color": [0, 0, 0, 0, 256, 256, 256, 256]}, {"name": "sprite168", "states": [false, false, true, false], "depth": 9, "matrix": [1.0, 0.0, 0.0, 1.0, -750.0, -553.0], "color": [0, 0, 0, 0, 256, 256, 256, 256]}, {"name": "sprite211", "states": [false, true, false, false], "depth": 12, "matrix": [1.0510712, 0.0, 0.0, 1.0587006, 1181.0, -3898.0], "color": [0, 0, 0, -126, 256, 256, 256, 256]}]};
var buttonInstances = {};
var instanceSequence = 0;
var soundHandler = null;
var clipSounds = {"58": {"soundId": 54, "frame": 0}, "71": {"soundId": 70, "frame": 0}, "97": {"soundId": 96, "frame": 0}};
var spriteTiming = {"5": {"count": 3, "stop": false, "loopFrom": 0}, "10": {"count": 1, "stop": false, "loopFrom": 0}, "12": {"count": 20, "stop": true, "loopFrom": 0}, "17": {"count": 8, "stop": false, "loopFrom": 0}, "21": {"count": 20, "stop": true, "loopFrom": 0}, "44": {"count": 27, "stop": false, "loopFrom": 19}, "48": {"count": 20, "stop": true, "loopFrom": 0}, "50": {"count": 20, "stop": true, "loopFrom": 0}, "57": {"count": 50, "stop": true, "loopFrom": 0}, "58": {"count": 20, "stop": true, "loopFrom": 0}, "66": {"count": 8, "stop": false, "loopFrom": 0}, "71": {"count": 20, "stop": true, "loopFrom": 0}, "77": {"count": 11, "stop": false, "loopFrom": 7}, "81": {"count": 1, "stop": false, "loopFrom": 0}, "83": {"count": 5, "stop": false, "loopFrom": 0}, "86": {"count": 20, "stop": true, "loopFrom": 0}, "91": {"count": 6, "stop": false, "loopFrom": 0}, "97": {"count": 20, "stop": true, "loopFrom": 0}, "101": {"count": 4, "stop": false, "loopFrom": 0}, "125": {"count": 54, "stop": false, "loopFrom": 0}, "132": {"count": 54, "stop": false, "loopFrom": 0}, "141": {"count": 63, "stop": false, "loopFrom": 0}, "142": {"count": 1, "stop": false, "loopFrom": 0}, "148": {"count": 64, "stop": false, "loopFrom": 0}, "158": {"count": 320, "stop": false, "loopFrom": 0}, "163": {"count": 107, "stop": false, "loopFrom": 0}, "166": {"count": 1, "stop": false, "loopFrom": 0}, "168": {"count": 4, "stop": false, "loopFrom": 0}, "172": {"count": 20, "stop": true, "loopFrom": 0}, "204": {"count": 61, "stop": false, "loopFrom": 0}, "211": {"count": 6, "stop": false, "loopFrom": 0}, "215": {"count": 1, "stop": false, "loopFrom": 0}};
var spriteChildren = {"5": [[], [], []], "10": [[]], "12": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "17": [[], [], [], [], [], [], [], []], "21": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "44": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "48": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "50": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "57": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "58": [[], [], [], [], [], [], [{"character_id": 57, "depth": 3, "born_frame": 6}], [{"character_id": 57, "depth": 3, "born_frame": 6}], [{"character_id": 57, "depth": 3, "born_frame": 6}], [{"character_id": 57, "depth": 3, "born_frame": 6}], [{"character_id": 57, "depth": 3, "born_frame": 6}], [{"character_id": 57, "depth": 3, "born_frame": 6}], [{"character_id": 57, "depth": 3, "born_frame": 6}], [{"character_id": 57, "depth": 3, "born_frame": 6}], [{"character_id": 57, "depth": 3, "born_frame": 6}], [{"character_id": 57, "depth": 3, "born_frame": 6}], [{"character_id": 57, "depth": 3, "born_frame": 6}], [{"character_id": 57, "depth": 3, "born_frame": 6}], [{"character_id": 57, "depth": 3, "born_frame": 6}], [{"character_id": 57, "depth": 3, "born_frame": 6}]], "66": [[], [], [], [], [], [], [], []], "71": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "77": [[], [], [], [], [], [], [], [], [], [], []], "81": [[]], "83": [[], [], [], [], []], "86": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "91": [[], [], [], [], [], []], "97": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "101": [[], [], [], []], "125": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "132": [[{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}], [{"character_id": 125, "depth": 2, "born_frame": 0}]], "141": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "142": [[{"character_id": 132, "depth": 1, "born_frame": 0}, {"character_id": 132, "depth": 4, "born_frame": 0}, {"character_id": 141, "depth": 7, "born_frame": 0}]], "148": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "158": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "163": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "166": [[{"character_id": 158, "depth": 2, "born_frame": 0}, {"character_id": 163, "depth": 4, "born_frame": 0}]], "168": [[], [], [], []], "172": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "204": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []], "211": [[{"character_id": 172, "depth": 1, "born_frame": 0}, {"character_id": 204, "depth": 3, "born_frame": 0}], [{"character_id": 172, "depth": 1, "born_frame": 0}, {"character_id": 204, "depth": 3, "born_frame": 0}], [{"character_id": 172, "depth": 1, "born_frame": 0}, {"character_id": 204, "depth": 3, "born_frame": 0}], [{"character_id": 172, "depth": 1, "born_frame": 0}, {"character_id": 204, "depth": 3, "born_frame": 0}], [{"character_id": 172, "depth": 1, "born_frame": 0}, {"character_id": 204, "depth": 3, "born_frame": 0}], [{"character_id": 172, "depth": 1, "born_frame": 0}, {"character_id": 204, "depth": 3, "born_frame": 0}]], "215": [[]], "main": [[{"character_id": 5, "depth": 2, "born_frame": 0}], [{"character_id": 10, "depth": 8, "born_frame": 1}, {"character_id": 215, "depth": 92, "born_frame": 1}, {"character_id": 168, "depth": 96, "born_frame": 1}]]};
var drawingStack = [];
var sampledSprites = {};
function resolveTimeline(id, elapsed) {
  const timing = spriteTiming[id];
  const age = Math.max(0, Math.floor(elapsed));
  if (timing.stop) return Math.min(age, timing.count - 1);
  if (age < timing.count) return age;
  return timing.loopFrom + ((age - timing.loopFrom) % (timing.count - timing.loopFrom));
}
for (const [id, timing] of Object.entries(spriteTiming)) {
  const original = characters['sprite' + id];
  characters['sprite' + id] = function(context, transform, frame, ratio, currentTime) {
    const sampledFrame = resolveTimeline(id, currentTime);
    sampledSprites[id] = {frame: sampledFrame, age: currentTime};
    drawingStack.push({id, frame: sampledFrame, age: currentTime, occurrences: {}});
    try { return original(context, transform, sampledFrame, ratio, currentTime); }
    finally { drawingStack.pop(); }
  };
}
var originalPlace = place;
place = function(name, targetCanvas, context, matrix, transform, blend, frame, ratio, age) {
  const parent = drawingStack[drawingStack.length - 1];
  if (parent && name.startsWith('sprite')) {
    const id = Number(name.slice(6));
    const occurrence = parent.occurrences[id] || 0;
    parent.occurrences[id] = occurrence + 1;
    const records = (spriteChildren[parent.id]?.[parent.frame] || [])
      .filter(record => record.character_id === id);
    const record = records[occurrence];
    if (record) age = Math.max(0, parent.age - record.born_frame);
  }
  return originalPlace(name, targetCanvas, context, matrix, transform, blend, frame, ratio, age);
};
for (const [id, records] of Object.entries(buttonRecords)) {
  characters['button' + id] = function(context, transform, unusedFrame, ratio, currentTime) {
    const state = selectedButton === id ? buttonState : 0;
    const previous = buttonInstances[id] || {};
    const current = {};
    const pendingSounds = [];
    for (const record of records) {
      if (!record.states[state]) continue;
      const prior = previous[record.depth];
      const retained = prior?.name === record.name;
      const instance = retained ? prior : {name: record.name, born: currentTime, sequence: ++instanceSequence};
      current[record.depth] = instance;
      const clipId = record.name.startsWith('sprite') ? record.name.slice(6) : '';
      const sound = clipSounds[clipId];
      if (!retained && sound) pendingSounds.push({...sound, spriteId: Number(clipId),
        buttonId: Number(id), depth: record.depth, instance: instance.sequence});
      const elapsed = Math.max(0, currentTime - instance.born);
      const tint = transform.merge(new cxform(...record.color));
      place(record.name, canvas, context, record.matrix, tint, 1, elapsed, 0, elapsed);
    }
    buttonInstances[id] = current;
    if (soundHandler) for (const event of pendingSounds) soundHandler(event);
  };
}
const api = {
  setButton(id, state = 1) {
    id = String(id);
    if (!(id in buttonRecords)) throw new Error('Unknown extracted button ' + id);
    if (selectedButton !== id || buttonState !== state) {
      selectedButton = id;
      buttonState = state;
      selectedAt = time;
    }
    drawFrame();
  },
  clearButton(id) {
    if (id === undefined || selectedButton === String(id)) {
      selectedButton = '';
      selectedAt = time;
      drawFrame();
    }
  },
  getState() {
    return {button: selectedButton, state: buttonState, frame: time,
      elapsed: Math.max(0, time - selectedAt), paused,
      sprites: Object.fromEntries(Object.entries(sampledSprites).map(([id, value]) => [id, {...value}]))};
  },
  setSoundHandler(callback) {
    if (callback !== null && typeof callback !== 'function') throw new TypeError('Expected a function or null');
    soundHandler = callback;
  },
  setPaused(value) { paused = Boolean(value); },
  advance(frames = 1) { time += frames; drawFrame(); },
  resolveTimeline,
};

/* Native scheduler and lifecycle. */
nextFrame(ctx,ctrans);
const timer = window.setInterval(function(){if(!paused)nextFrame(ctx,ctrans);},1000/30);
api.destroy = function(){paused=true;window.clearInterval(timer);soundHandler=null;};
return api;
};
