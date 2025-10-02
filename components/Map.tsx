'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LocationWithHealth } from '@/lib/types';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapProps {
  locations: LocationWithHealth[];
  onLocationClick?: (locationId: string) => void;
}

function getMarkerColor(healthScore: number): string {
  if (healthScore >= 90) return '#22c55e'; // green
  if (healthScore >= 70) return '#eab308'; // yellow
  if (healthScore >= 50) return '#f97316'; // orange
  return '#ef4444'; // red
}

function createCustomIcon(healthScore: number): L.DivIcon {
  const color = getMarkerColor(healthScore);
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 12px;
      ">
        ${healthScore}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

export default function Map({ locations, onLocationClick }: MapProps) {
  const center: [number, number] = [36.5, 127.5]; // Center of South Korea

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={createCustomIcon(location.health_score)}
            eventHandlers={{
              click: () => onLocationClick?.(location.id),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{location.name}</h3>
                <p className="text-sm text-gray-600">{location.region}</p>
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">건강 점수:</span>
                    <span
                      className="font-bold text-lg"
                      style={{ color: getMarkerColor(location.health_score) }}
                    >
                      {location.health_score}점
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm">이상 신호:</span>
                    <span className="font-semibold text-red-600">
                      {location.anomaly_count}건
                    </span>
                  </div>
                  {location.last_check && (
                    <div className="text-xs text-gray-500 mt-1">
                      마지막 점검: {new Date(location.last_check).toLocaleString('ko-KR')}
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
