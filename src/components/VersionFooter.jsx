import {useEffect, useState} from "react";
import {getBackendInfo} from "./tripsService.js";

// Wird in der Pipeline aus dem Git-Tag gesetzt (Docker build-arg VITE_APP_VERSION)
const frontendVersion = import.meta.env.VITE_APP_VERSION || "dev";

/** Zeigt Frontend- und Backend-Version -> nachvollziehbar, welche Releases gerade auf ECS laufen. */
export default function VersionFooter() {
    const [backend, setBackend] = useState("...");

    useEffect(() => {
        getBackendInfo()
            .then((info) => setBackend(info?.build?.version ?? "unbekannt"))
            .catch(() => setBackend("nicht erreichbar"));
    }, []);

    return (
        <footer className="text-muted small border-top pt-2 mt-4 d-flex justify-content-between">
            <span>only for educational purposes @BBW 2026</span>
            <span data-testid="versions">
                Frontend <code>{frontendVersion}</code> · Backend <code>{backend}</code>
            </span>
        </footer>
    );
}
