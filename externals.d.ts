declare module '*.less' {
    const resource: { [key: string]: string };
    export = resource;
}
declare module "*.json" {
    const value: any;
    export default value;
}