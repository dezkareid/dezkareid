declare global {
    interface Window {
        google: any;
    }
}
interface GMLoaderParams {
    key: string;
}
declare function gMLoader({ key }: GMLoaderParams): Promise<any>;
export default gMLoader;
