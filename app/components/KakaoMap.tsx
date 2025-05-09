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
          content: '<div style="padding:2px;">히엘플레이스<br>15-4, Gwanjeo-nam-ro 12beon-gil</div>'
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
    <div className="bg-white p-4 rounded-lg shadow-lg h-full flex items-center justify-center flex-col">
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      <div className="flex justify-center items-center w-full mt-4 bg-[#fafbfc] border border-[#e5e7eb] rounded-b-lg">
        <a
          href="https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%20%EC%84%9C%EA%B5%AC%20%EA%B4%80%EC%A0%80%EB%82%A8%EB%A1%9C12%EB%B2%88%EA%B8%B8%2015-4%201%EC%B8%B5/address/14175002.8025859,4341168.4539059,%EB%8C%80%EC%A0%84%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%84%9C%EA%B5%AC%20%EA%B4%80%EC%A0%80%EB%82%A8%EB%A1%9C12%EB%B2%88%EA%B8%B8%2015-4,new?c=15.00,0,0,0,dh&isCorrectAnswer=true"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center flex-1 justify-center py-3 gap-2 hover:bg-gray-100 transition"
          style={{ minWidth: 0 }}
        >
          <img src="/images/icon_navermap.png" alt="네이버 지도" className="w-5 h-5" />
          <span className="text-sm font-medium text-gray-800">네이버 지도</span>
        </a>
        <div className="w-px h-6 bg-gray-300 mx-2" />
        <a
          href="https://map.kakao.com/?q=%EB%8C%80%EC%A0%84%20%EC%84%9C%EA%B5%AC%20%EA%B4%80%EC%A0%80%EB%82%A8%EB%A1%9C12%EB%B2%88%EA%B8%B8%2015-4%201%EC%B8%B5"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center flex-1 justify-center py-3 gap-2 hover:bg-gray-100 transition"
          style={{ minWidth: 0 }}
        >
          <img src="/images/icon_kakaonavi.png" alt="카카오 네비" className="w-5 h-5" />
          <span className="text-sm font-medium text-gray-800">카카오 네비</span>
        </a>
      </div>
    </div>
  );
};

export default KakaoMap; 