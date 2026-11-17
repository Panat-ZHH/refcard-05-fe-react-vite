import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import Wishlist from "./components/Wishlist";
import TripList from "./components/TripList";
import {useWishlist} from "./components/wishlistContext.jsx";
import VersionFooter from "./components/VersionFooter.jsx";

export default function App() {
    return (
        <div className="container">
            <header className="container h3">
                RefCard 05 - Business Trips - Frontend Development with React and Java Spring

            </header>
            <Wishlist/>
            <TripList/>
            <WishlistTest/>
            <VersionFooter/>
        </div>


    );
}

function WishlistTest() {
    const {wishlist} = useWishlist()
    return (
        <div className="container">
            <header className="container h3">Wishlist-Test</header>
            <ul className="list-unstyled">
                {wishlist.map((item) => {
                    return (
                        <li key={item.id}>
                            {item.id} - {item.title} {item.description}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
