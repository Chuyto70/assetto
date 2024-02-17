'use client'

import { LinkInterface } from "@/lib/interfaces";

// type ServerInfo = {
//   ip: string;
//   port: number;
// };

// type ServersList = {
//   [key: string]: ServerInfo;
// };
type MarkerTypeWithPing = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  color: string;
  link?: LinkInterface;
  ping: string | null;
};
// const serversList:ServersList = {
//   'Germany':{ ip:'116.202.160.109', port: 8005},
//   'Spain': {ip: '82.223.98.34', port: 8005},
//   'Brasil':{ip: '38.54.57.165', port: 8006},
//   'Singapore': {ip: '15.235.182.140', port: 8002},
//   'United States':{ip: '104.251.122.175', port:8001},
//   'United Arab Emirates':{ip: '38.54.9.216', port: 8003},
//   'Australia': {ip: '139.99.195.119', port: 8001},
//   'Finland': {ip: '135.181.141.49', port: 8001},
//   // 'pl.assettohosting.com',
//   'Canada':{ip: '158.69.52.145', port: 8001},
//   'France':{ip: '37.187.140.88', port: 8001},
//   'Andorra':{ip: '185.194.57.158', port: 28005},
//   'United Kingdom': {ip: '145.239.206.153', port: 8001}
// }

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distancia en kilómetros
  return distance;
}


export function pingToServers(marker: MarkerTypeWithPing): Promise<{ medianPingTime: number }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = { lat: position.coords.latitude, lon: position.coords.longitude };
        const targetLocation = { lat: marker.latitude, lon: marker.longitude };
        const distance = getDistance(userLocation.lat, userLocation.lon, targetLocation.lat, targetLocation.lon);

        const speedOfLight = 299792.458; // Velocidad de la luz en kilómetros por segundo
        const latency = (distance / speedOfLight) * 10000; // Convertir a milisegundos
        const latencyStimate = { medianPingTime: Number((latency + (Math.random() * 10)).toFixed(0)) };

        resolve(latencyStimate);
      },
      (error) => {
        console.error('Error obtaining geolocation:', error);
        reject(error);
      }
    );
    }, 500)
    
  });
}
