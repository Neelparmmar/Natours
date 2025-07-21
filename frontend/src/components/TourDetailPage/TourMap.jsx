import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TourMap = ({ locations }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!locations || locations.length === 0) return;

    mapboxgl.accessToken =
      "pk.eyJ1Ijoiam9uYXNzY2htZWR0bWFubiIsImEiOiJjam54ZmM5N3gwNjAzM3dtZDNxYTVlMnd2In0.ytpI7V7w7cyT1Kq5rT9Z1A";

    const geojson = {
      type: "FeatureCollection",
      features: locations.map((loc) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: loc.coordinates,
        },
        properties: {
          description: loc.description,
          day: loc.day,
        },
      })),
    };

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/jonasschmedtmann/cjnxfn3zk7bj52rpegdltx58h",
      scrollZoom: true,
    });

    const bounds = new mapboxgl.LngLatBounds();

    geojson.features.forEach((marker) => {
      const el = document.createElement("div");
      el.className = "marker";

      new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

      new mapboxgl.Popup({ offset: 30, closeOnClick: false })
        .setLngLat(marker.geometry.coordinates)
        .setHTML(
          `<p>Day ${marker.properties.day} : ${marker.properties.description}</p>`
        )
        .addTo(map);

      bounds.extend(marker.geometry.coordinates);
    });

    map.fitBounds(bounds, {
      padding: { top: 200, bottom: 150, left: 50, right: 50 },
    });

    map.on("load", function () {
      map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: geojson.features.map((f) => f.geometry.coordinates),
            },
          },
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#55c57a",
          "line-opacity": 0.6,
          "line-width": 3,
        },
      });
    });

    return () => map.remove();
  }, [locations]);

  return <div ref={mapContainerRef} id="map" />;
};

export default TourMap;
