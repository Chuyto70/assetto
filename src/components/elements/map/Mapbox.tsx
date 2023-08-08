'use client';

import { Map, Marker, Popup } from "mapbox-gl";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { createRoot } from 'react-dom/client';

import 'mapbox-gl/dist/mapbox-gl.css';

import clsxm from "@/lib/clsxm";
import { LinkInterface } from "@/lib/interfaces";

type MarkerType = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  color: string;
  link?: LinkInterface;
};

const Mapbox = ({ className, mapbox_public_key, latitude, longitude, zoom, style, markers }: {
  className?: string;
  mapbox_public_key: string;
  latitude: number;
  longitude: number;
  zoom: number;
  style: string;
  markers?: MarkerType[];
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapElement = useRef<Map | null>(null);
  const markerList = useRef<Marker[]>([]);

  const createPopup = (marker: MarkerType) => {
    const popup = new Popup({ closeButton: false }).setHTML(marker.link ? `<a target='${marker.link.open_new_tab ? '_blank' : ''}' href='${marker.link.href}'>${marker.link.name}</a>` : `<p>${marker.name}</p>`);
    popup.addClassName('[&>.mapboxgl-popup-content]:rounded-lg [&>.mapboxgl-popup-content]:bg-carbon-200 [&>.mapboxgl-popup-content]:p-3 [&>.mapboxgl-popup-tip]:!border-t-carbon-200 font-primary text-base text-carbon-900');
    return popup;
  };

  const createMarkers = useCallback(() => {
    if (!markers) return;
    markers.forEach((el) => {
      if (!mapElement.current) return;
      const element = document.createElement('div');
      element.className = 'flex';

      const markerComponent = (
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: el.color }} ></span>
      );

      const markerPortal = createPortal(markerComponent, element);
      createRoot(element).render(markerPortal);

      markerList.current?.push(new Marker({
        color: el.color,
        element,
      })
        .setLngLat([el.longitude, el.latitude])
        .setPopup(createPopup(el))
        .addTo(mapElement.current));
    });

    return () => {
      markerList.current.forEach((marker) => {
        marker.remove();
      });
    }
  }, [markers]);

  useEffect(() => {
    if (!mapContainer.current) return;
    mapElement.current = new Map({
      container: mapContainer.current,
      style,
      center: [longitude, latitude],
      zoom,
      accessToken: mapbox_public_key
    });
    createMarkers();

    return () => {
      if (!mapElement.current) return;
      mapElement.current.remove();
    }
  }, [createMarkers, latitude, longitude, mapbox_public_key, style, zoom]);

  return (
    <div
      ref={mapContainer}
      className={clsxm(className)}
    >
    </div>
  )
}

export default Mapbox;