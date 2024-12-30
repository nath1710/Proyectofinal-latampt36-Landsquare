import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkEmpty } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkFilled } from "@fortawesome/free-solid-svg-icons";

const LandCard = ({ land, toggleFavorite, isFavorite }) => {
    console.log(land)
    return (
        <div className="land-card">
            <h3>{land.title}</h3>
            <p>{land.location}</p>
            <span
                className={`favorite-btn ${isFavorite ? "favorite" : ""}`}
                onClick={() => toggleFavorite(land.id, isFavorite)}
            >
                {isFavorite ? (
                    <FontAwesomeIcon icon={faBookmarkFilled} />
                ) : (
                    <FontAwesomeIcon icon={faBookmarkEmpty} />
                )}
            </span>
            <p>{land.images}</p>
            <p>{land.price}</p>

            <p>{land.description}</p>

        </div>
    );
};
export default LandCard;