'use client';

import { Map } from "mapbox-gl";
import { useEffect, useRef } from "react";

import 'mapbox-gl/dist/mapbox-gl.css';

import clsxm from "@/lib/clsxm";

const Mapbox = ({ className, mapbox_public_key, latitude, longitude, zoom, style }: {
  className?: string;
  mapbox_public_key: string;
  latitude: number;
  longitude: number;
  zoom: number;
  style: string;
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (map.current) return;
    if (mapContainer.current) {
      map.current = new Map({
        container: mapContainer.current,
        style,
        center: [latitude, longitude],
        zoom,
        accessToken: mapbox_public_key
      });
    }
  });

  return (
    <div
      ref={mapContainer}
      className={clsxm(className)}
    >
    </div>
  )
}

export default Mapbox;