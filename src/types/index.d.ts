declare class Go {
    run: (instance: WebAssembly.Instance) => Promise<unknown>;
    importObject: WebAssembly.Imports;
}
interface Window {
    __: string;
}
