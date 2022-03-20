const hue = 217;
const maxStars = 1300;
export default class StarrySky {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w!: number;
    h!: number;
    stars: Star[]; //保存所有星星
    count: number; //用于计算星星
    constructor(id: string) {
        this.stars = [];
        this.count = 0;
        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.updateRect();

        const canvas2 = document.createElement('canvas');
        const ctx2 = canvas2.getContext('2d') as CanvasRenderingContext2D;
        canvas2.width = 100;
        canvas2.height = 100;
        const half = canvas2.width / 2;
        const gradient2 = ctx2.createRadialGradient(
            half,
            half,
            0,
            half,
            half,
            half,
        );

        gradient2.addColorStop(0.025, '#CCC');
        //hsl是另一种颜色的表示方式，
        //h->hue,代表色调色彩，0为red，120为green，240为blue
        //s->saturation，代表饱和度，0%-100%
        //l->lightness，代表亮度，0%为black，100%位white
        gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
        gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
        gradient2.addColorStop(1, 'transparent');

        ctx2.fillStyle = gradient2;
        ctx2.beginPath();
        ctx2.arc(half, half, half, 0, Math.PI * 2);
        ctx2.fill();

        for (let i = 0; i < maxStars; i++) {
            this.stars.push(new Star(this.ctx, canvas2, this.w, this.h));
        }
        setTimeout(() => this.animation(), 200);
        window.addEventListener('resize', () => this.updateRect());
    }

    updateRect() {
        this.w = this.canvas.width = window.innerWidth;
        this.h = this.canvas.height = window.innerHeight;
        this.stars.forEach((item) => item.updateRect(this.w, this.h));
    }

    animation() {
        //以新图像覆盖已有图像的方式进行绘制背景颜色
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = 0.5; //尾巴
        this.ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
        this.ctx.fillRect(0, 0, this.w, this.h);

        //源图像和目标图像同时显示，重叠部分叠加颜色效果
        this.ctx.globalCompositeOperation = 'lighter';

        for (let i = 1, l = this.stars.length; i < l; i++) {
            this.stars[i].draw();
        }

        //调用该方法执行动画，并且在重绘的时候调用指定的函数来更新动画
        //回调的次数通常是每秒60次
        requestAnimationFrame(() => {
            this.animation();
        });
    }
}

function random(min: number, max?: number) {
    if (!max) {
        max = min;
        min = 0;
    }

    if (min > max) {
        [min, max] = [max, min];
    }

    //返回min和max之间的一个随机值
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maxOrbit(x: number, y: number) {
    const max = Math.max(x, y);
    const diameter = Math.round(Math.sqrt(max * max + max * max));

    //星星移动范围，值越大范围越小，
    return diameter / 2;
}

class Star {
    orbitRadius!: number;
    radius!: number;
    orbitX!: number;
    orbitY!: number;
    timePassed: number;
    speed!: number;
    alpha: number;
    ctx: CanvasRenderingContext2D;
    starCanvas: HTMLCanvasElement;
    constructor(
        ctx: CanvasRenderingContext2D,
        starCanvas: HTMLCanvasElement,
        w: number,
        h: number,
    ) {
        this.ctx = ctx;
        this.starCanvas = starCanvas;
        //星星在旋转圆圈位置的角度,每次增加speed值的角度
        //利用正弦余弦算出真正的x、y位置
        this.timePassed = random(0, maxStars);
        //星星图像的透明度
        this.alpha = random(2, 10) / 10;
        this.updateRect(w, h);
    }

    updateRect(w: number, h: number) {
        //星星移动的半径
        this.orbitRadius = random(maxOrbit(w, h));
        //星星大小，半径越小，星星也越小，即外面的星星会比较大
        this.radius = random(60, this.orbitRadius) / 8;
        //所有星星都是以屏幕的中心为圆心
        this.orbitX = w / 2;
        this.orbitY = h / 2;
        //星星移动速度
        this.speed = random(this.orbitRadius) / 50000;
    }

    draw() {
        const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
        const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
        const twinkle = random(10);

        //星星每次移动会有1/10的几率变亮或者变暗
        if (twinkle === 1 && this.alpha > 0) {
            //透明度降低，变暗
            this.alpha -= 0.05;
        } else if (twinkle === 2 && this.alpha < 1) {
            //透明度升高，变亮
            this.alpha += 0.05;
        }

        this.ctx.globalAlpha = this.alpha;
        //使用canvas2作为源图像来创建星星，
        //位置在x - this.radius / 2, y - this.radius / 2
        //大小为 this.radius
        this.ctx.drawImage(
            this.starCanvas,
            x - this.radius / 2,
            y - this.radius / 2,
            this.radius,
            this.radius,
        );
        //没旋转一次，角度就会增加
        this.timePassed += this.speed;
    }
}
