declare global {
    interface Window {
        google: unknown;
    }
}
interface GMLoaderParameters {
    key: string;
}
declare function gMLoader({ key }: GMLoaderParameters): Promise<unknown>;
export default gMLoader;
