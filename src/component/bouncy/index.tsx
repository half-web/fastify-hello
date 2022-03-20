import { useEffect } from 'react';

export default function RenderCanvas() {
    useEffect(() => {
        const go = new Go();
        fetch('/wasm/bouncy.wasm')
            .then((response) => response.arrayBuffer())
            .then((bytes) => WebAssembly.instantiate(bytes, go.importObject))
            .then((obj) => {
                go.run(obj.instance);
            });
    });

    return <canvas id="bouncy" className="half-web-background"></canvas>;
}
