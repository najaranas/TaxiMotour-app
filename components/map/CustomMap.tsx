import React, { useState, useEffect, useRef } from "react";
import { Image, StyleSheet, View } from "react-native";
import * as MapLibreRN from "@maplibre/maplibre-react-native";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { MapProps, RouteData } from "@/types/Types";
import { COLORS } from "@/constants/theme";
import { routeService, apiUtils } from "@/services/api";
import * as Location from "expo-location";
import { LocationIcon, TargetIcon } from "../common/SvgIcons";
import { MaterialIndicator } from "react-native-indicators";

export default function CustomMap({ roadData, viewPadding }: MapProps) {
  console.log("roadData", roadData);
  console.log("viewPadding");

  const mapRef = useRef<MapLibreRN.MapViewRef>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const mapCameraRef = useRef<MapLibreRN.CameraRef>(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState<RouteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log("routeGeoJSON", routeGeoJSON);
  useEffect(() => {
    if (roadData && roadData.length >= 2) {
      fetchRoute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadData]);

  const fetchRoute = async () => {
    if (!roadData || roadData.length < 2) return;

    setIsLoading(true);
    setError(null);

    try {
      const startCoords: [number, number] = [
        roadData[0].lon!,
        roadData[0].lat!,
      ];
      const endCoords: [number, number] = [roadData[1].lon!, roadData[1].lat!];
      if (
        !apiUtils.validateCoordinates(startCoords[0], startCoords[1]) ||
        !apiUtils.validateCoordinates(endCoords[0], endCoords[1])
      ) {
        throw new Error("Invalid coordinates");
      }
      const data = await routeService.fetchRoute(startCoords, endCoords);

      setRouteGeoJSON(data);
    } catch (error) {
      console.error("Route fetching error:", error);
      setError(apiUtils.handleApiError(error, "Failed to fetch route"));
    } finally {
      setIsLoading(false);
    }
  };

  const mapStyleUrl = process.env.EXPO_PUBLIC_MAPTILER_MAP_API
    ? `https://api.maptiler.com/maps/streets/style.json?key=${process.env.EXPO_PUBLIC_MAPTILER_MAP_API}`
    : "https://api.maptiler.com/maps/streets/style.json";

  console.log("locationd", location);
  return (
    <View style={styles.mapContainer}>
      <MapLibreRN.MapView
        ref={mapRef}
        style={styles.map}
        compassEnabled={false}
        mapStyle={mapStyleUrl}>
        {/* Taxi 2 Marker */}
        <MapLibreRN.PointAnnotation id="taxi2" coordinate={[10.1815, 36.8065]}>
          <View style={styles.motoMarker}>
            <Image
              source={require("../../assets/icons/moto-forza-icon.png")}
              style={styles.motoIcon}
            />
          </View>
        </MapLibreRN.PointAnnotation>

        {/* Route Layer  */}
        {routeGeoJSON && (
          <MapLibreRN.ShapeSource id="route" shape={routeGeoJSON}>
            <MapLibreRN.LineLayer
              id="lineLayerBackground"
              style={{
                lineColor: COLORS.routeBlue,
                lineWidth: horizontalScale(10),
                lineCap: "round",
                lineJoin: "round",
              }}
            />
            <MapLibreRN.LineLayer
              id="lineLayer"
              style={{
                lineColor: COLORS.routeBlueLight,
                lineWidth: horizontalScale(3),
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </MapLibreRN.ShapeSource>
        )}

        {/* Start Point Marker  */}
        {routeGeoJSON && routeGeoJSON.features[0]?.geometry?.coordinates[0] && (
          <MapLibreRN.PointAnnotation
            id="routeStart"
            coordinate={routeGeoJSON.features[0].geometry.coordinates[0]}>
            <LocationIcon
              bold
              size={horizontalScale(35)}
              color={COLORS.danger}
            />
          </MapLibreRN.PointAnnotation>
        )}

        {/* End Point Marker */}
        {routeGeoJSON && routeGeoJSON.features[0]?.geometry?.coordinates && (
          <MapLibreRN.PointAnnotation
            id="routeEnd"
            coordinate={
              routeGeoJSON.features[0].geometry.coordinates[
                routeGeoJSON.features[0].geometry.coordinates.length - 1
              ]
            }>
            <TargetIcon size={horizontalScale(35)} color={COLORS.primary} />
          </MapLibreRN.PointAnnotation>
        )}

        {/* Default Camera (when no route) */}
        {!routeGeoJSON && (
          <MapLibreRN.Camera
            followUserLocation={location !== null}
            zoomLevel={2}
            centerCoordinate={[10.17226, 36.8104]}
          />
        )}

        {/* Route Camera (when route is loaded) */}
        {routeGeoJSON && routeGeoJSON.features[0]?.geometry?.coordinates && (
          <MapLibreRN.Camera
            ref={mapCameraRef}
            followUserLocation={false}
            bounds={{
              ne: [
                Math.max(
                  ...routeGeoJSON.features[0].geometry.coordinates.map(
                    (coord) => coord[0]
                  )
                ),
                Math.max(
                  ...routeGeoJSON.features[0].geometry.coordinates.map(
                    (coord) => coord[1]
                  )
                ),
              ],
              sw: [
                Math.min(
                  ...routeGeoJSON.features[0].geometry.coordinates.map(
                    (coord) => coord[0]
                  )
                ),
                Math.min(
                  ...routeGeoJSON.features[0].geometry.coordinates.map(
                    (coord) => coord[1]
                  )
                ),
              ],
              ...(viewPadding
                ? viewPadding
                : {
                    paddingLeft: horizontalScale(50),
                    paddingRight: horizontalScale(50),
                    paddingTop: verticalScale(50),
                    paddingBottom: verticalScale(200),
                  }),
            }}
          />
        )}
      </MapLibreRN.MapView>

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <MaterialIndicator
            size={moderateScale(30)}
            color={COLORS.secondary}
            key="loading"
          />
        </View>
      )}

      {/* Error Message */}
      {error && (
        <View style={styles.errorOverlay}>
          <View style={styles.errorContainer}>
            <Image
              source={require("../../assets/icons/moto-forza-icon.png")}
              style={styles.errorIcon}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  taxiMarker: {
    backgroundColor: COLORS.secondary,
    padding: 5,
    borderRadius: 5,
  },
  taxiDot: {
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  motoMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  motoIcon: {
    height: verticalScale(40),
    aspectRatio: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  errorOverlay: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  errorContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorIcon: {
    width: 24,
    height: 24,
  },
  // startMarker: {
  //
  // },
  endDot: {
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
});
