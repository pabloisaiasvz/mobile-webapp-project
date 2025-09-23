import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ContactView = () => {
  const unajCoords = [-34.775278, -58.267778];

  return (
    <div className="main">
      <h2>Información de Contacto</h2>
      <div className="contact-info">
        <div className="contact-section">
          <h3>Universidad Nacional Arturo Jauretche</h3>
          <p><strong>Teléfono:</strong> +54 11 4275-6100</p>
          <p><strong>Dirección:</strong> Av. Calchaquí 6200, B1888 Florencio Varela, Provincia de Buenos Aires</p>
        </div>

        <div className="map-container" style={{ height: '400px', width: '100%', marginTop: '20px', borderRadius: '12px' }}>
          <MapContainer center={unajCoords} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={unajCoords} icon={markerIcon}>
              <Popup>
                📍 Universidad Nacional Arturo Jauretche
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="contact-footer" style={{ marginTop: '1rem' }}>
          <h4>¡Gracias por usar nuestra aplicación!</h4>
          <p>Una aplicación para descubrir el mundo.</p>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
