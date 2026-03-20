import { ReactNode } from 'react';
export interface MapOptions {
    center: {
        lat: number;
        lng: number;
    };
    zoom: number;
    [key: string]: unknown;
}
export interface GoogleMapsProperties {
    mapKey: string;
    mapOptions: MapOptions;
    className?: string;
    children?: ReactNode;
}
declare function GoogleMaps({ mapKey, mapOptions, className, children }: GoogleMapsProperties): import("react/jsx-runtime").JSX.Element;
export default GoogleMaps;
