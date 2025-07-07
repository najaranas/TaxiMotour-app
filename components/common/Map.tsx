import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import * as MapLibreRN from "@maplibre/maplibre-react-native";
import { verticalScale } from "@/utils/styling";

export default function Map() {
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);

  useEffect(() => {
    fetchRoute().then(setRouteGeoJSON);
  }, []); // Empty dependency array - only run once on mount

  const fetchRoute = async () => {
    const response = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjZmMTVjNTBjZGU4MTRlZWZiNTg5MDRiZDE4MWE5NDkzIiwiaCI6Im11cm11cjY0In0=", // replace with your free key
        },
        body: JSON.stringify({
          coordinates: [
            [10.1815, 36.8065], // Tunis
            [10.3255, 36.8782], // La Marsa
          ],
        }),
      }
    );

    console.log(response);
    const data = await response.json();
    console.log(data);
    return data;
  };
  return (
    <View style={styles.mapContainer}>
      <MapLibreRN.MapView
        style={styles.map}
        compassEnabled={false}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.EXPO_PUBLIC_MAPTILER_MAP_API}`}>
        <MapLibreRN.Camera
          zoomLevel={14}
          centerCoordinate={[10.1815, 36.8065]} // Example: Tunis
        />
        <MapLibreRN.PointAnnotation id="taxi1" coordinate={[10.1819, 36.8065]}>
          <View
            style={{
              backgroundColor: "yellow",
              padding: 5,
              borderRadius: 5,
            }}
          />
        </MapLibreRN.PointAnnotation>
        <MapLibreRN.PointAnnotation id="taxi2" coordinate={[10.1815, 36.8065]}>
          <View>
            <Image
              source={require("../../assets/icons/moto-forza-icon.png")}
              style={{ height: verticalScale(40), aspectRatio: 1 }}
            />
          </View>
        </MapLibreRN.PointAnnotation>

        {routeGeoJSON && (
          <MapLibreRN.ShapeSource id="route" shape={routeGeoJSON}>
            <MapLibreRN.LineLayer
              id="lineLayer"
              style={{
                lineColor: "#007AFF",
                lineWidth: 5,
                lineCap: "round",
              }}
            />
          </MapLibreRN.ShapeSource>
        )}
      </MapLibreRN.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
