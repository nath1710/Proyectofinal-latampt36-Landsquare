import React from "react";
import { Fragment, useState } from "react";
import {
    GoogleMap,
    InfoWindowF,
    MarkerF,
    useLoadScript,
} from "@react-google-maps/api";

// const markers = [
//     {
//         id: 1,
//         title: "Qobustan",
//         latitude: 40.0709493,
//         longitude: 49.3694411,
//     },
//     {
//         id: 2,
//         name: "Sumqayit",
//         position: { lat: 40.5788843, lng: 49.5485073 },
//     },
//     {
//         id: 3,
//         name: "Baku",
//         position: { lat: 40.3947365, lng: 49.6898045 },
//     }
// ];

const GoogleMaps = ({ location, markers = [] }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyAPeDUU2nXnDk3pF4Xa2d3dOuNbPABkPzg",
    });

    const [activeMarker, setActiveMarker] = useState(null);

    const handleActiveMarker = (marker) => {
        if (marker === activeMarker) {
            return;
        }
        setActiveMarker(marker);
    };

    return (
        <div style={{
            width: "100%", minHeight: "100%"
        }}>
            {
                isLoaded ? (
                    <GoogleMap
                        center={location ? { lat: location.lat, lng: location.lng } : { lat: 4.1347644, lng: -73.6201517 }}
                        zoom={location ? 15 : 4}
                        onClick={() => setActiveMarker(null)}
                        mapContainerStyle={{ width: "100%", minHeight: "100%" }}
                    >
                        {
                            markers.map(({ id, title, location, latitude, longitude, images, price, size }) => (
                                <MarkerF
                                    key={id}
                                    position={{ lat: latitude, lng: longitude }}
                                    onClick={() => handleActiveMarker(id)}
                                // icon={{
                                //   url:"https://t4.ftcdn.net/jpg/02/85/33/21/360_F_285332150_qyJdRevcRDaqVluZrUp8ee4H2KezU9CA.jpg",
                                //   scaledSize: { width: 50, height: 50 }
                                // }}
                                >
                                    {activeMarker === id ? (
                                        <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                                            <div className="text-black">
                                                {images && images.length > 0 && (
                                                    <div className="image-preview" style={{ width: "100%", height: "100%" }}>
                                                        <img
                                                            src={images[0]}
                                                            alt="Preview"
                                                            style={{ width: "100%", height: "170px", objectFit: "cover" }}
                                                        />
                                                    </div>
                                                )}

                                                <div className="p-3 d-flex flex-column gap-1">
                                                    <div className="text-nowrap fw-bold "><span>${Number(price).toLocaleString('en-US')}</span>
                                                        <span> • </span>
                                                        <span>{size} m<sup>2</sup></span></div>
                                                    <span>{location}</span>
                                                    <span>{title}</span>

                                                </div>
                                            </div>
                                        </InfoWindowF>
                                    ) : null}
                                </MarkerF>
                            ))
                        }
                        {location ? <MarkerF
                            position={{ lat: location.lat, lng: location.lng }}
                        >
                        </MarkerF> : null}
                    </GoogleMap >
                ) : null}
        </div >
    );
}

export default GoogleMaps;