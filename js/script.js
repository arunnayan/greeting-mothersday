/*
* File Name / balloon.js
* Created Date / Sep 14, (My Birthday) 2020
* Aurhor / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
* Inspired / Twitter's birthday balloon.
*/

/*
  Common Tool.
*/

class Tool {
  // random number.
  static randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  // random color rgb.
  static randomColorRGB() {
    return (
      "rgb(" +
      this.randomNumber(0, 255) +
      ", " +
      this.randomNumber(0, 255) +
      ", " +
      this.randomNumber(0, 255) +
      ")"
    );
  }
  // random color hsl.
  static randomColorHSL(hue, saturation, lightness) {
    return (
      "hsl(" +
      hue +
      ", " +
      saturation +
      "%, " +
      lightness +
      "%)"
    );
  }
  // gradient color.
  static gradientColor(ctx, cr, cg, cb, ca, x, y, r) {
    const col = cr + "," + cg + "," + cb;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(" + col + ", " + (ca * 1) + ")");
    g.addColorStop(0.5, "rgba(" + col + ", " + (ca * 0.5) + ")");
    g.addColorStop(1, "rgba(" + col + ", " + (ca * 0) + ")");
    return g;
  }
}

/*
  When want to use angle.
*/

class Angle {
  constructor(angle) {
    this.a = angle;
    this.rad = this.a * Math.PI / 180;
  }

  incDec(num) {
    this.a += num;
    this.rad = this.a * Math.PI / 180;
    return this.rad;
  }
}

/*
  When want to use controller.
*/

class Controller {
  constructor(id) {
    this.id = document.getElementById(id);
  }
  getVal() {
    return this.id.value;
  }
}

/*
  When want to use time.
*/

class Time {
  constructor(time) {
    this.startTime = time;
    this.lastTime;
    this.elapsedTime;
  }

  getElapsedTime() {
    this.lastTime = Date.now();
    this.elapsedTime = (this.startTime - this.lastTime) * -1;
    return this.elapsedTime;
  }
}

let canvas;
let offCanvas;

class Canvas {
  constructor(bool) {
    // create canvas.
    this.canvas = document.createElement("canvas");
    // if on screen.
    if (bool === true) {
      this.canvas.style.position = 'fixed';
      this.canvas.style.display = 'block';
      this.canvas.style.top = 0;
      this.canvas.style.left = 0;
      document.getElementsByTagName("body")[0].appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    // mouse infomation.
    this.mouseX = null;
    this.mouseY = null;
    // colors
    this.colorPallet = ['rgb(173, 67, 230)', 'rgb(251, 211, 43)', 'rgb(244, 80, 122)', 'rgb(65, 175, 249)', 'rgb(96, 255, 204)'];
    // shape
    this.shapeNum = 80;
    this.shapeMaxSize = 100;
    this.shapes = [];
    // particle
    this.particles = [];
    // data
    this.data;
    this.textPosArr = [];
    // text
    this.fontSize = 500;
    this.text = 'HAPPY BIRTHDAY!';
    this.randomMax = 80;
    // size
    if (this.width < 768) {
      this.fontSize = 500;
      this.shapeNum = 50;
      this.randomMax = 20;
      this.shapeMaxSize = 80;
      this.text = 'Grats!';
    }
  }
  
  // init, render, resize
  init() {
    for (let i = 0; i < this.height; i += 4) {
      for (let j = 0; j < this.width; j += 4) {
        let oI = (j + i * this.width) * 4 + 3;
        if (this.data[oI] > 0) {
          const arr = [j, i];
          this.textPosArr.push(arr);
        }
      }
    }
    for (let i = 0; i < this.shapeNum; i++) {
      const s = new Shape(this.ctx, Tool.randomNumber(0, this.width), Tool.randomNumber(this.height, this.height * 2), this.colorPallet[Tool.randomNumber(0, this.colorPallet.length - 1)]);
      this.shapes.push(s);
    }
  }

  offInit() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.font = this.fontSize + "px sans-selif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const t = ctx.measureText(this.text);
    if (t.width > this.width * 0.95) {
      this.fontSize--;
      this.offInit();
      return;
    }
    ctx.fillText(this.text, this.width / 2, this.height / 2);
    canvas.data = ctx.getImageData(0, 0, this.width, this.height).data;
    ctx.restore();
  }

  render() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].render(i);
    }
    for(let i = 0; i < this.particles.length; i++) {
      this.particles[i].render(i);
    }
  }
  
  resize() {
    this.shapes = [];
    this.textPosArr = [];
    this.particles = [];
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    // size
    if (this.width < 768) {
      this.shapeNum = 50;
      this.shapeMaxSize = 80;
    } else {
      this.shapeNum = 80;
      this.shapeMaxSize = 100;
    }
    this.init();
  }

  offResize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    // size
    if (this.width < 768) {
      this.fontSize = 200;
      this.text = 'Grats!';
    } else {
      this.fontSize = 300;
      this.text = 'HAPPY BIRTHDAY!';
    }
    this.offInit();
  }
}

/*
  Fire class.
*/

class Shape {
  constructor(ctx, x, y, c) {
    this.ctx = ctx;
    this.init(x, y, c);
  }

  init(x, y, c) {
    this.x = x;
    this.y = y;
    this.r = Tool.randomNumber(30, canvas.shapeMaxSize);
    this.c = c;
    this.cL = 'rgb(251, 211, 43)';
    this.ga = 0.8;
    this.v = {
      x: 0,
      y: 0
    };
    this.a = new Angle(Tool.randomNumber(0, 360));
  }

  draw(i) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = this.ga;
    ctx.fillStyle = this.c;
    // balloon
    ctx.beginPath();
    ctx.moveTo(this.x + this.r / 20, this.y + this.r);
    ctx.bezierCurveTo(this.x + this.r, this.y + this.r / 3, this.x + this.r, this.y - this.r, this.x, this.y - this.r);
    ctx.bezierCurveTo(this.x - this.r, this.y - this.r, this.x - this.r, this.y + this.r / 3, this.x - this.r / 20, this.y + this.r);
    ctx.lineTo(this.x - this.r / 20, this.y + this.r + this.r / 20);
    ctx.lineTo(this.x - this.r / 20 - this.r / 20, this.y + this.r + this.r / 20);
    ctx.quadraticCurveTo(
      this.x - this.r / 20 - this.r / 10,
      this.y + this.r + this.r / 20 + this.r / 20,
      this.x - this.r / 20 - this.r / 20,
      this.y + this.r + this.r / 20 + this.r / 20 + this.r / 20
    );
    ctx.lineTo(this.x + this.r / 20 + this.r / 20, this.y + this.r + this.r / 20 + this.r / 20 + this.r / 20);
    ctx.quadraticCurveTo(
      this.x + this.r / 20 + this.r / 10,
      this.y + this.r + this.r / 20 + this.r / 20,
      this.x + this.r / 20 + this.r / 20,
      this.y + this.r + this.r / 20
    );
    ctx.lineTo(this.x + this.r / 20, this.y + this.r + this.r / 20);
    ctx.closePath();
    ctx.fill();
    // mouse hover ???
    if (ctx.isPointInPath(canvas.mouseX, canvas.mouseY)) {
      const num = Tool.randomNumber(5, canvas.randomMax);
      for (let i = 0; i < num; i++) {
        if (canvas.particles.length < canvas.textPosArr.length) {
          const p = new Particle(ctx, this.x, this.y);
          canvas.particles.push(p);
        }
      }
      if (canvas.particles.length < canvas.textPosArr.length) {
        this.init(Tool.randomNumber(0, canvas.width), Tool.randomNumber(canvas.height + 100, canvas.height * 2), this.c);
      }
    }
    // balloon
    ctx.fillStyle = this.cL;
    ctx.fillRect(this.x - this.r / 20, this.y + this.r, this.r / 10, this.r / 20);
    ctx.strokeStyle = this.cL;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.r + this.r / 20 + this.r / 20 + this.r / 20);
    ctx.lineTo(this.x, this.y + this.r + this.r / 20 + this.r);
    ctx.stroke();
    // gloss
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(this.x - this.r / 2.5, this.y - this.r / 1.5, this.r / 10, this.r / 5, 45 * Math.PI / 180, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  }

  updatePosition() {
    this.v.x = 0.5 * Math.cos(this.a.rad);
    this.v.y = 0.2 * Math.sin(this.a.rad) - 5;
    this.x += this.v.x;
    this.y += this.v.y;
    if (this.y - this.r < 0 && canvas.particles.length !== canvas.textPosArr.length) {
      this.y = 0 + this.r;
    }
  }
  
  wrapPosition() {
    if (this.y + this.r * 2 < 0) {
      this.y = Tool.randomNumber(canvas.height + this.r, canvas.height * 2);
      this.x = Tool.randomNumber(0, canvas.width);
    }
  }

  updateParams() {
    this.a.incDec(1);
  }

  render(i) {
    this.draw();
    this.updatePosition();
    this.updateParams();
    this.wrapPosition();
  }
}

class Particle {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.init(x, y);
  }

  init(x, y) {
    this.xi = canvas.textPosArr[canvas.particles.length][0];
    this.x = x;
    this.yi = canvas.textPosArr[canvas.particles.length][1];
    this.y = y;
    this.r = Tool.randomNumber(2, 4);
    this.c = canvas.colorPallet[Tool.randomNumber(0, canvas.colorPallet.length - 1)];
    this.v = {
      x: 0,
      y: 0
    };
    this.random = Math.random() * Math.random();
    this.a = new Angle(Tool.randomNumber(0, 360));
    this.ac = new Angle(0);
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = this.c;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  }

  updatePosition() {
    this.v.x = this.xi - this.x;
    this.v.y = this.yi - this.y;
    if (canvas.particles.length !== canvas.textPosArr.length) {
      this.x = Math.sin(this.a.rad) * 10 + this.x;
      this.y = Math.cos(this.a.rad) * 10 + this.y;
    } else {
      if (canvas.particles.length === canvas.textPosArr.length) {
        this.c = 'hsl(' + Math.sin(this.ac.rad) * 360  + ', 80%, 60%)';
      }
    }
    this.x += this.v.x * this.random;
    this.y += this.v.y * this.random;
  }

  render() {
    this.draw();
    this.updatePosition();
    this.a.incDec(1);
    this.ac.incDec(0.1);
  }
}

(function () {
  "use strict";
  window.addEventListener("load", function () {
    canvas = new Canvas(true);
    offCanvas = new Canvas(false); 
    offCanvas.offInit();
    canvas.init();
    
    function render() {
      window.requestAnimationFrame(function () {
        canvas.render();
        render();
      });
    }
    
    render();

    // event
    window.addEventListener("resize", function () {
      offCanvas.offResize();
      canvas.resize();
    }, false);

    canvas.canvas.addEventListener('mousemove', function(e) {
      canvas.mouseX = e.clientX;
      canvas.mouseY = e.clientY;
    }, false);

    
    canvas.canvas.addEventListener('touchmove', function(e) {
      const touch = e.targetTouches[0];
      canvas.mouseX = touch.pageX;
      canvas.mouseY = touch.pageY;
    }, false);

    canvas.canvas.addEventListener('touchend', function(e) {
      canvas.mouseX = null;
      canvas.mouseY = null;
    }, false);
    
  });
})();


(function ($) {
    
    var ww = 0;
    var wh = 0;
    var maxw = 0;
    var minw = 0;
    var maxh = 0;
    var textShadowSupport = true;
    var xv = 0;
    var snowflakes = ["Happy Mothers Day Maa", "\u2746","✯","❤","&#x1f49d","❤HAPPY❤","❤MAA❤"];
    var prevTime;
    var absMax = 100;
    var flakeCount = 0;
    
    $(init);

    function init()
    {
        var detectSize = function ()
        {
            ww = $(window).width();
            wh = $(window).height();
            
            maxw = ww + 300;
            minw = -300;
            maxh = wh + 300;
        };
        
        detectSize();
        
        $(window).resize(detectSize);
        
        if (!$('body').css('textShadow'))
        {
            textShadowSupport = false;
        }
        
        /* Should work in Windows 7 /*
        if (/windows/i.test(navigator.userAgent))
        {
            snowflakes = ['*']; // Windows sucks and doesn't have Unicode chars installed
            //snowflakes = ['T']; //No FF support for Wingdings
        }
        */
        
        // FF seems to just be able to handle like 50... 25 with rotation
        // Safari seems fine with 150+... 75 with rotation
        var i = 50;
        while (i--)
        {
            addFlake(true);
        }
        
        prevTime = new Date().getTime();
        setInterval(move, 50);
    }

    function addFlake(initial)
    {
        flakeCount++;
        
        var sizes = [
            {
                r: 1.0,
                css: {
                    fontSize: 15 + Math.floor(Math.random() * 20) + 'px',
                    textShadow: '9999px 0 0 rgba(238, 238, 238, 0.5)'
                },
                v: 2
            },
            {
                r: 0.6,
                css: {
                    fontSize: 50 + Math.floor(Math.random() * 20) + 'px',
                    textShadow: '9999px 0 2px #eee'
                },
                v: 6
            },
            {
                r: 0.2,
                css: {
                    fontSize: 90 + Math.floor(Math.random() * 30) + 'px',
                    textShadow: '9999px 0 6px #eee'
                },
                v: 12
            },
            {
                r: 0.1,
                css: {
                    fontSize: 150 + Math.floor(Math.random() * 50) + 'px',
                    textShadow: '9999px 0 24px #eee'
                },
                v: 20
            }
        ];
    
        var $nowflake = $('<span class="winternetz">' + snowflakes[Math.floor(Math.random() * snowflakes.length)] + '</span>').css(
            {
                /*fontFamily: 'Wingdings',*/
                color: '#eee',
                display: 'block',
                position: 'fixed',
                background: 'transparent',
                width: 'auto',
                height: 'auto',
                margin: '0',
                padding: '0',
                textAlign: 'left',
                zIndex: 9999
            }
        );
        
        if (textShadowSupport)
        {
            $nowflake.css('textIndent', '-9999px');
        }
        
        var r = Math.random();
    
        var i = sizes.length;
        
        var v = 0;
        
        while (i--)
        {
            if (r < sizes[i].r)
            {
                v = sizes[i].v;
                $nowflake.css(sizes[i].css);
                break;
            }
        }
    
        var x = (-300 + Math.floor(Math.random() * (ww + 300)));
        
        var y = 0;
        if (typeof initial == 'undefined' || !initial)
        {
            y = -300;
        }
        else
        {
            y = (-300 + Math.floor(Math.random() * (wh + 300)));
        }
    
        $nowflake.css(
            {
                left: x + 'px',
                top: y + 'px'
            }
        );
        
        $nowflake.data('x', x);
        $nowflake.data('y', y);
        $nowflake.data('v', v);
        $nowflake.data('half_v', Math.round(v * 0.5));
        
        $('body').append($nowflake);
    }
    
    function move()
    {
        if (Math.random() > 0.8)
        {
            xv += -1 + Math.random() * 2;
            
            if (Math.abs(xv) > 3)
            {
                xv = 3 * (xv / Math.abs(xv));
            }
        }
        
        // Throttle code
        var newTime = new Date().getTime();
        var diffTime = newTime - prevTime;
        prevTime = newTime;
        
        if (diffTime < 55 && flakeCount < absMax)
        {
            addFlake();
        }
        else if (diffTime > 150)
        {
            $('span.winternetz:first').remove();
            flakeCount--;
        }
        
        $('span.winternetz').each(
            function ()
            {
                var x = $(this).data('x');
                var y = $(this).data('y');
                var v = $(this).data('v');
                var half_v = $(this).data('half_v');
                
                y += v;
                
                x += Math.round(xv * v);
                x += -half_v + Math.round(Math.random() * v);
                
                // because flakes are rotating, the origin could be +/- the size of the flake offset
                if (x > maxw)
                {
                    x = -300;
                }
                else if (x < minw)
                {
                    x = ww;
                }
                
                if (y > maxh)
                {
                    $(this).remove();
                    flakeCount--;
                    
                    addFlake();
                }
                else
                {
                    $(this).data('x', x);
                    $(this).data('y', y);

                    $(this).css(
                        {
                            left: x + 'px',
                            top: y + 'px'
                        }
                    );
                    
                    // only spin biggest three flake sizes
                    if (v >= 6)
                    {
                        $(this).animate({rotate: '+=' + half_v + 'deg'}, 0);
                    }
                }
            }
        );
    }
})(jQuery);
