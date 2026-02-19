import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Fix for default marker icon
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface MapRouteViewProps {
    routeCoordinates?: string | null;
}

const FitBounds = ({ points }: { points: [number, number][] }) => {
    const map = useMap();
    useEffect(() => {
        if (points.length > 0) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [points, map]);
    return null;
};

const MapRouteView = ({ routeCoordinates }: MapRouteViewProps) => {
    if (!routeCoordinates) return null;

    let points: [number, number][] = [];
    try {
        points = JSON.parse(routeCoordinates);
    } catch (e) {
        console.error("Failed to parse route coordinates:", e);
        return null;
    }

    if (points.length === 0) return null;

    const center = points[0];

    return (
        <div className="space-y-4">
            <h3 className="font-display text-xl">EVENT <span className="text-gradient">ROUTE</span></h3>
            <div className="h-[400px] rounded-2xl overflow-hidden border border-border shadow-inner relative z-0">
                <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {points.map((point, idx) => (
                        <Marker key={`marker-${idx}`} position={point} />
                    ))}

                    {points.length > 1 && (
                        <Polyline positions={points} color="hsl(var(--primary))" weight={5} opacity={0.8} />
                    )}

                    <FitBounds points={points} />
                </MapContainer>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <span>Start Point</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-0.5 w-8 bg-primary opacity-50" />
                    <span>Route Path</span>
                </div>
                <div className="flex items-center gap-2 ml-auto italic">
                    {points.length} waypoints defined
                </div>
            </div>
        </div>
    );
};

export default MapRouteView;
