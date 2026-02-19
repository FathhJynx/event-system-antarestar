import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Trash2, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Fix for default marker icon in Leaflet + React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface MapRoutePickerProps {
    value?: string;
    onChange: (value: string) => void;
}

const MapEvents = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

const MapController = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const MapRoutePicker = ({ value, onChange }: MapRoutePickerProps) => {
    const [points, setPoints] = useState<[number, number][]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2088, 106.8456]); // Default to Jakarta

    useEffect(() => {
        if (value) {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    setPoints(parsed);
                    if (parsed.length > 0) {
                        setMapCenter(parsed[0]);
                    }
                }
            } catch (e) {
                console.error("Failed to parse route coordinates:", e);
            }
        }
    }, [value]);

    const handleMapClick = (lat: number, lng: number) => {
        const newPoints: [number, number][] = [...points, [lat, lng]];
        setPoints(newPoints);
        onChange(JSON.stringify(newPoints));
    };

    const removePoint = (index: number) => {
        const newPoints = points.filter((_, i) => i !== index);
        setPoints(newPoints);
        onChange(JSON.stringify(newPoints));
    };

    const clearRoute = () => {
        setPoints([]);
        onChange(JSON.stringify([]));
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setMapCenter([parseFloat(lat), parseFloat(lon)]);
            }
        } catch (error) {
            console.error("Search failed:", error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search location (e.g. GBK Senayan)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                        className="pl-9"
                    />
                </div>
                <Button type="button" onClick={handleSearch} variant="secondary">Search</Button>
            </div>

            <div className="h-[400px] rounded-xl overflow-hidden border border-border relative z-0">
                <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapEvents onMapClick={handleMapClick} />
                    <MapController center={mapCenter} />

                    {points.map((point, idx) => (
                        <Marker key={`marker-${idx}`} position={point}>
                        </Marker>
                    ))}

                    {points.length > 1 && (
                        <Polyline positions={points} color="hsl(var(--primary))" weight={4} opacity={0.8} />
                    )}
                </MapContainer>

                <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={clearRoute}
                        disabled={points.length === 0}
                        className="shadow-lg"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Route
                    </Button>
                </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 border border-border">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Waypoints ({points.length})
                    </h4>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Click on map to add</span>
                </div>

                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                    {points.length === 0 ? (
                        <p className="text-xs text-center py-4 text-muted-foreground italic">No waypoints added yet.</p>
                    ) : (
                        points.map((point, idx) => (
                            <div key={`point-${idx}`} className="flex items-center justify-between bg-card border border-border p-2 rounded-lg group">
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary/10 border-primary/20 text-[10px]">
                                        {idx + 1}
                                    </Badge>
                                    <span className="text-xs font-mono text-muted-foreground">
                                        {point[0].toFixed(5)}, {point[1].toFixed(5)}
                                    </span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                                    onClick={() => removePoint(idx)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <p className="text-[11px] text-muted-foreground italic">
                Tips: Use the search to find the general area, then click on the map to define the precise route path for your event.
            </p>
        </div>
    );
};

export default MapRoutePicker;
