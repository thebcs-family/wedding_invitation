declare global {
  interface Window {
    daum: {
      roughmap: {
        Lander: new (options: {
          timestamp: string;
          key: string;
          mapWidth: string;
          mapHeight: string;
        }) => {
          render: () => void;
        };
      };
    };
  }
}

export {}; 