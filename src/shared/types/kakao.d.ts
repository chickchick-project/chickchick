interface Window {
  kakao: {
    maps: {
      load: (callback: () => void) => void;
      Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
      LatLng: new (lat: number, lng: number) => KakaoLatLng;
      Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
      CustomOverlay: new (
        options: KakaoCustomOverlayOptions,
      ) => KakaoCustomOverlay;
      InfoWindow: new (options: KakaoInfoWindowOptions) => KakaoInfoWindow;
      event: {
        addListener: (
          target: KakaoMarker | KakaoMap,
          type: string,
          handler: () => void,
        ) => void;
      };
    };
  };
}

interface KakaoInfoWindowOptions {
  content?: string;
  removable?: boolean;
  zIndex?: number;
}

interface KakaoInfoWindow {
  open: (map: KakaoMap, marker: KakaoMarker) => void;
  close: () => void;
  setContent: (content: string) => void;
  getContent: () => string;
}

interface KakaoMapOptions {
  center: KakaoLatLng;
  level?: number;
}

interface KakaoMap {
  setCenter: (latlng: KakaoLatLng) => void;
  getCenter: () => KakaoLatLng;
  setLevel: (level: number) => void;
  getLevel: () => number;
}

interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

interface KakaoMarkerOptions {
  position: KakaoLatLng;
  map?: KakaoMap;
}

interface KakaoMarker {
  setMap: (map: KakaoMap | null) => void;
  getPosition: () => KakaoLatLng;
}

interface KakaoCustomOverlayOptions {
  position: KakaoLatLng;
  content: string | HTMLElement;
  map?: KakaoMap;
  zIndex?: number;
}

interface KakaoCustomOverlay {
  setMap: (map: KakaoMap | null) => void;
}
