declare global {
    interface Window {
        google: unknown;
    }
}
interface GMLoaderParams {
    key: string;
}
declare function gMLoader({ key }: GMLoaderParams): Promise<unknown>;
export default gMLoader;
