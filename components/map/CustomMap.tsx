import { useState, useEffect, useRef, useCallback } from "react";
import { Image, StyleSheet, View } from "react-native";
import * as MapLibreRN from "@maplibre/maplibre-react-native";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/styling";
import { MapProps } from "@/types/Types";
import { COLORS } from "@/constants/theme";
import * as Location from "expo-location";
import { LocationIcon, TargetIcon } from "../common/SvgIcons";
import { MaterialIndicator } from "react-native-indicators";
import { useMapStore } from "@/store/mapStore";

export default function CustomMap({ roadData, viewPadding }: MapProps) {
  console.log("roadData", roadData);
  console.log("viewPadding");

  const mapRef = useRef<MapLibreRN.MapViewRef>(null);

  const { isMapLoading, routeGeoJSON, fetchRoute, routeError } = useMapStore();
  // const [isMapLoading, setIsMapLoading] = useState(false);

  const [mylocation, setMylocation] = useState<Location.LocationObject | null>(
    null
  );
  // Control when we allow camera to follow user to avoid native error spam
  const [canFollowUser, setCanFollowUser] = useState(false);
  const mapCameraRef = useRef<MapLibreRN.CameraRef>(null);

  useEffect(() => {
    if (roadData && roadData.length >= 2) {
      fetchRoute(roadData);
    }
  }, [roadData, fetchRoute]);

  const initLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setMylocation(null);
        setCanFollowUser(false);
        return;
      }

      // Try last known first (fast, may be null)
      const last = await Location.getLastKnownPositionAsync();
      if (last) {
        setMylocation(last as Location.LocationObject);
      }

      // Start a watcher for fresher updates
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 4000,
        },
        (loc) => {
          setMylocation(loc);
          setCanFollowUser(true);
        }
      );
    } catch (e) {
      console.warn("Location init error", e);
      setCanFollowUser(false);
    }
  }, []);

  useEffect(() => {
    initLocation();
  }, [initLocation]);

  const mapStyleUrl = process.env.EXPO_PUBLIC_MAPTILER_MAP_API
    ? `https://api.maptiler.com/maps/streets/style.json?key=${process.env.EXPO_PUBLIC_MAPTILER_MAP_API}`
    : "https://api.maptiler.com/maps/streets/style.json";

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
                lineWidth: horizontalScale(6),
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
            followUserLocation={canFollowUser}
            zoomLevel={mylocation ? 14 : 2}
            centerCoordinate={
              mylocation
                ? [mylocation.coords.longitude, mylocation.coords.latitude]
                : [10.17226, 36.8104]
            }
          />
        )}

        {/* User location puck - keeps native module satisfied and gives updates */}
        <MapLibreRN.UserLocation
          visible={true}
          androidRenderMode="gps"
          onUpdate={(loc) => {
            if (loc && !canFollowUser) {
              setCanFollowUser(true);
            }
          }}
        />

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
      {isMapLoading && (
        <View style={styles.loadingOverlay}>
          <MaterialIndicator
            size={moderateScale(30)}
            color={COLORS.secondary}
            key="loading"
          />
        </View>
      )}

      {/* Error Message */}
      {routeError && (
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
