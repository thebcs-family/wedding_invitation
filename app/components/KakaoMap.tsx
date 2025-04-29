'use client';

import { useEffect } from 'react';
import { secrets } from '../config/secrets';

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = () => {
  useEffect(() => {
    // Load Kakao Maps API
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${secrets.kakao.mapApiKey}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(36.2941327,127.3362349), // Daejeon coordinates
          level: 3
        };
        const map = new window.kakao.maps.Map(container, options);
        
        // Add a marker for Hiel Place
        const marker = new window.kakao.maps.Marker({
          position: options.center,
          title: '히엘플레이스'
        });
        marker.setMap(map);

        // Add an info window
        const infowindow = new window.kakao.maps.InfoWindow({
          content: '<div style="padding:5px;">히엘플레이스<br>15-4, Gwanjeo-nam-ro 12beon-gil</div>'
        });
        infowindow.open(map, marker);
      });
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg h-full flex items-center justify-center">
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
};

export default KakaoMap; 