'use server'

import { exec } from "child_process";
type ServerInfo = {
  ip: string;
};

type ServersList = {
  [key: string]: ServerInfo;
};
const serversList:ServersList = {
  'Germany':{ ip:'116.202.160.109'},
  'Spain': {ip: '82.223.98.34'},
  'Brasil':{ip: '38.54.57.165'},
  'Singapore': {ip: '15.235.182.140'},
  'United States':{ip: '104.251.122.175'},
  'United Arab Emirates':{ip: '38.54.9.216'},
  'Australia': {ip: '139.99.195.119'},
  'Finland': {ip: '135.181.141.49'},
  // 'pl.assettohosting.com',
  'Canada':{ip: '158.69.52.145'},
  'France':{ip: '37.187.140.88'},
  'Andorra':{ip: '185.194.57.158'},
  'United Kingdom': {ip: '145.239.206.153'}
}
export async function pingToServers(name:string) {
  name.trim()
  const ip = serversList[name].ip
  if(ip) {

    return new Promise((resolve, reject) => {
      const command = `ping -n 1 ${ip}`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve({ medianPingTime: '9999' });
        }
        const match = stdout.match(/Media = (\d+)ms/);
        if (match) {
          const medianPingTime = match[1];
          resolve({ medianPingTime });
        } else {
          resolve({ medianPingTime: '9999' });
        }

      });
    });
  }else {
    return { medianPingTime: '9999' }
  }
  

}
