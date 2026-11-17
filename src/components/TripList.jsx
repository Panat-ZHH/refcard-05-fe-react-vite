import {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSuitcaseRolling, faCheck, faCalendarDays, faUpload} from "@fortawesome/free-solid-svg-icons";
import {getBusinessTrips, uploadTripImage} from "./tripsService.js";
import TripImage from "./TripImage.jsx";
import {useWishlist} from "./wishlistContext.jsx";
import {formatTripDate} from "./dateUtils.js";

function TripList() {
    const [trips, setTrips] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getBusinessTrips()
            .then((response) => setTrips(response))
            .catch(() => setError("Backend nicht erreichbar"));
    }, []);

    return (
        <section className="my-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h4 className="mb-0">Business Trips</h4>
                <span className="badge text-bg-secondary">{trips.length} available</span>
            </div>

            {error && <p className="alert alert-danger">{error}</p>}
            {trips.length === 0 ? (
                <p className="alert alert-info">No business trips available at the moment.</p>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                    {trips.map((trip) => (
                        <Trip trip={trip} key={trip.id}/>
                    ))}
                </div>
            )}
        </section>
    );
}

function Trip({trip}) {
    const {id, title, description, startTrip} = trip;
    const {wishlist, dispatch} = useWishlist();
    const alreadyAdded = wishlist.some((item) => item.id === id);
    const [imageVersion, setImageVersion] = useState(null);
    const [uploadState, setUploadState] = useState(null);

    async function onUpload(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        setUploadState({busy: true});
        try {
            await uploadTripImage(id, file);
            setImageVersion(Date.now());
            setUploadState({ok: "Bild in S3 gespeichert"});
        } catch (e) {
            setUploadState({error: e.message});
        } finally {
            event.target.value = "";
        }
    }

    return (
        <div className="col">
            <div className="card h-100 shadow-sm">
                <TripImage
                    id={id}
                    title={title}
                    version={imageVersion}
                    className="card-img-top"
                    style={{height: "160px", objectFit: "cover"}}
                />
                <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-center justify-content-between">
                        <h5 className="card-title mb-0">{title}</h5>
                        <span className="badge text-bg-light border">
                            <FontAwesomeIcon icon={faCalendarDays} className="me-1"/>
                            {formatTripDate(startTrip)}
                        </span>
                    </div>
                    <p className="card-text text-muted small flex-grow-1 mt-2">{description}</p>
                    <button
                        type="button"
                        className={`btn btn-sm mt-2 ${alreadyAdded ? "btn-success" : "btn-outline-primary"}`}
                        disabled={alreadyAdded}
                        onClick={() => dispatch({type: "add", trip})}
                    >
                        <FontAwesomeIcon icon={alreadyAdded ? faCheck : faSuitcaseRolling} className="me-2"/>
                        {alreadyAdded ? "Added to wishlist" : "Add to wishlist"}
                    </button>
                    <label className="btn btn-sm btn-outline-secondary mt-2 mb-0">
                        <FontAwesomeIcon icon={faUpload} className="me-2"/>
                        {uploadState?.busy ? "Uploading..." : "Upload image"}
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            hidden
                            aria-label={`Upload image for ${title}`}
                            onChange={onUpload}
                        />
                    </label>
                    {uploadState?.ok && <small className="text-success mt-1">{uploadState.ok}</small>}
                    {uploadState?.error && <small className="text-danger mt-1">{uploadState.error}</small>}
                </div>
            </div>
        </div>
    );
}

export default TripList;
