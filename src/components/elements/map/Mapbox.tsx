'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';

import clsxm from "@/lib/clsxm";
import { LinkInterface } from "@/lib/interfaces";

import { pingToServers } from '@/components/elements/map/Pingdata';


type MarkerType = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  color: string;
  link?: LinkInterface;
};
type MarkerTypeWithPing = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  color: string;
  link?: LinkInterface;
  ping: string | null;
};

const Map = dynamic(() => import('react-map-gl').then((mod) => mod.Map));
const Popup = dynamic(() => import('react-map-gl').then((mod) => mod.Popup));
const Marker = dynamic(() => import('react-map-gl').then((mod) => mod.Marker));

const Mapbox = ({ className, mapbox_public_key, latitude, longitude, zoom, style, markers }: {
  className?: string;
  mapbox_public_key: string;
  latitude: number;
  longitude: number;
  zoom: number;
  style: string;
  markers?: MarkerTypeWithPing[];
}) => {
  
  const [popupInfo, setPopupInfo] = useState<MarkerTypeWithPing | null>(null);
  const [pinged, setPinged] = useState<null | number>(null)
  const pins = useMemo(
    () =>
      markers?.map((marker) => (
        <Marker
          key={`marker-${marker.id}-${marker.name}`}
          longitude={marker.longitude}
          latitude={marker.latitude}
          style={{ display: 'flex' }}
          onClick={e => {
            setPinged(null)
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(marker)
            pingToServers(marker)
              .then((res) => {
                setPinged(res.medianPingTime)
              })
              .catch(err => {
                console.log(err)
                setPinged(9999)
              })
              // .then((datafetched:any) =>{
              //   marker.ping = datafetched.medianPingTime
              //   setPinged(datafetched.medianPingTime)         
              // })
              // .catch(err => {
              //   console.log(err)
              //   setPinged('9999')
              // })
            
          }}
        >
          <span className="w-3 h-3 rounded-full cursor-pointer" style={{ backgroundColor: marker.color }} ></span>
        </Marker>
      )),
    [markers]
  );
  

  return (
    <div className={clsxm(className)}>
      <Map
        mapboxAccessToken={mapbox_public_key}
        initialViewState={{
          longitude,
          latitude,
          zoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={style}
        interactive={false}
        // cooperativeGestures
      >
        {pins}

        {popupInfo && (
          <Popup
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            onClose={() => {
              setPopupInfo(null)
              setPinged(null)
            }}
            closeButton={false}
            className='[&>.mapboxgl-popup-content]:rounded-lg [&>.mapboxgl-popup-content]:bg-carbon-200 [&>.mapboxgl-popup-content]:p-3 [&>.mapboxgl-popup-tip]:!border-t-carbon-200 font-primary text-base text-carbon-900'
          >
            <p>{popupInfo.name}</p>
{/*               
              {popupInfo.link && <Link
                href={popupInfo.link.href}
                openNewTab={popupInfo.link.open_new_tab}
                style={popupInfo.link.style}
                variant={popupInfo.link.variant}
                icon={popupInfo.link.icon}
                direction={popupInfo.link.direction}
                rel={popupInfo.link.relationship}
              >{popupInfo.link.name}</Link>} */}
              {pinged
                ? <p>Ping: {pinged}ms</p>
                : <p>Ping:  Loading...</p>
              }
            
          </Popup>
        )}
      </Map>
    </div>
  )
}

export default Mapbox;