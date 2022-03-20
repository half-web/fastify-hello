interface Position {
    x: number;
    y: number;
    z: number;
}

export default function DrawInception(el: string) {
    const TRAIL_PLAN = ['u', 'r', 'd', 'b', 'r', 'c'];
    const canvas = document.querySelector(el) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const trails: Trail[] = [];
    const time_now = new Date().getTime();
    let time_pre = time_now;
    const camera = { x: 0, y: 0, z: 0 };

    function pointCopy(src: Position, dst: Position) {
        dst.x = src.x;
        dst.y = src.y;
        dst.z = src.z;

        return dst;
    }

    function quadIn(
        t: number,
        b: Position,
        c: Position,
        d: number,
        dst: Position,
    ) {
        t /= d;
        dst.x = (c.x - b.x) * t * t + b.x;
        dst.y = (c.y - b.y) * t * t + b.y;
        dst.z = (c.z - b.z) * t * t + b.z;
    }

    function perspective(point: Position, camera: Position, dst: Position) {
        const dz = point.z - camera.z;

        if (dz > 0) {
            dst.x = (point.x - camera.x) / dz;
            dst.y = (point.y - camera.y) / dz;

            return true;
        }

        return false;
    }

    function updateScene() {
        let i;
        const time_now = new Date().getTime();
        const time_d = time_now - time_pre;

        for (i = 0; i < trails.length; i++) {
            trails[i].update(time_now);
        }
        camera.x += (trails[0].pos.x - camera.x - 50) * 0.0002 * time_d;
        console.log(camera);
        // camera.y += (trails[0].pos.y - camera.y - 300) * 0.00002 * time_d;
        time_pre = time_now;
    }

    function drawScene(ctx: CanvasRenderingContext2D) {
        let i;
        ctx.clearRect(
            -canvas.width / 2,
            -canvas.height / 2,
            canvas.width,
            canvas.height,
        );

        for (i = 0; i < trails.length; i++) {
            trails[i].draw(ctx, camera);
        }
    }

    class Trail {
        pos: Position;
        start: Position;
        goal: Position;
        vertexes: Position[];
        plan_i: number;
        sz: number;
        start_time!: number;
        take_time!: number;
        constructor(pos: Position, t: number, plan_i: number) {
            this.pos = { x: 0, y: 0, z: 0 };
            this.start = { x: 0, y: 0, z: 0 };
            this.goal = { x: 0, y: 0, z: 0 };
            this.vertexes = [];
            pointCopy(pos, this.pos);
            pointCopy(pos, this.start);
            pointCopy(pos, this.goal);
            this.plan_i = plan_i % TRAIL_PLAN.length || 0;
            this.sz = pos.z;
            this.setNextGoal(t);
        }

        setNextGoal(t: number) {
            pointCopy(this.goal, this.start);
            this.plan_i = (this.plan_i + 1) % TRAIL_PLAN.length;

            switch (TRAIL_PLAN[this.plan_i]) {
                case 'r':
                    this.goal.x += Math.random() * 50 + 50;
                    break;
                case 'u':
                    this.goal.y -= Math.random() * 250 + 100;
                    break;
                case 'd':
                    this.goal.y = 0;
                    break;
                case 'b':
                    this.goal.z += Math.random() * 1;
                    break;
                case 'c':
                    this.goal.z = this.sz;
                    break;
                default:
                    break;
            }
            this.start_time = t;
            this.take_time = 100 + Math.random() * 100;
            this.vertexes.push(pointCopy(this.start, { x: 0, y: 0, z: 0 }));

            if (this.vertexes.length > 100) {
                this.vertexes.splice(0, this.vertexes.length - 100);
            }
        }

        update(t: number) {
            quadIn(
                t - this.start_time,
                this.start,
                this.goal,
                this.take_time,
                this.pos,
            );

            if (t - this.start_time > this.take_time) {
                this.setNextGoal(this.start_time + this.take_time);
                this.update(t);
            }
        }

        draw(ctx: CanvasRenderingContext2D, camera: Position) {
            let i;
            const ps = { x: 0, y: 0, z: 0 };
            ctx.beginPath();

            if (perspective(this.vertexes[0], camera, ps)) {
                ctx.moveTo(ps.x, ps.y);
            }

            for (i = 1; i < this.vertexes.length; i++) {
                if (perspective(this.vertexes[i], camera, ps)) {
                    ctx.strokeStyle =
                        'rgba(0,0,0,' +
                        2 / (this.vertexes[i].z - camera.z) +
                        ')';
                    ctx.lineTo(ps.x, ps.y);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(ps.x, ps.y);
                }
            }

            if (perspective(this.pos, camera, ps)) {
                ctx.strokeStyle =
                    'rgba(0,0,0,' + 2 / (this.pos.z - camera.z) + ')';
                ctx.lineTo(ps.x, ps.y);
                ctx.stroke();
            }
        }
    }

    function resize() {
        // camera.x = 0;
        camera.y = 100 - window.innerHeight;
        camera.z = -2;

        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        if (ctx) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
        }
    }

    function draw() {
        requestAnimationFrame(function () {
            updateScene();
            drawScene(ctx);
            draw();
        });
    }

    function init() {
        for (let i = 0; i < 8; i++) {
            trails.push(
                new Trail(
                    {
                        x: Math.random() * 50 - 25,
                        y: Math.random() * 50 - 25,
                        z: i,
                    },
                    time_now,
                    i,
                ),
            );
        }
        window.addEventListener('resize', resize);
        resize();
        draw();
    }

    init();
}
