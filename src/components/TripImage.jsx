import {useState} from "react";
import {tripImageUrl} from "./tripsService.js";

const imgsFolder = import.meta.env.VITE_IMGS || "items";

/**
 * Zeigt das Bild eines Trips aus dem Backend (S3). Liefert das Backend keines (404) oder ist es
 * nicht erreichbar, wird auf das statische Bild aus public/images zurueckgefallen.
 */
export default function TripImage({id, title, version, className, style}) {
    const [failed, setFailed] = useState(false);
    const src = failed ? `images/${imgsFolder}/${id}.jpg` : tripImageUrl(id, version);
    return (
        <img
            src={src}
            className={className}
            style={style}
            alt={title}
            data-source={failed ? "static" : "backend"}
            onError={() => !failed && setFailed(true)}
        />
    );
}
