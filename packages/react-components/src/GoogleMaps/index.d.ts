import { ReactNode } from 'react';
export interface MapOptions {
    center: {
        lat: number;
        lng: number;
    };
    zoom: number;
    [key: string]: any;
}
export interface GoogleMapsProps {
    mapKey: string;
    mapOptions: MapOptions;
    className?: string;
    children?: ReactNode;
}
declare function GoogleMaps({ mapKey, mapOptions, className, children }: GoogleMapsProps): import("react/jsx-runtime").JSX.Element;
export default GoogleMaps;
