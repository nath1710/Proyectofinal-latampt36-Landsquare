import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkEmpty } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkFilled } from "@fortawesome/free-solid-svg-icons";

const LandCard = ({ land, toggleFavorite, isFavorite }) => {
    console.log(land)
    return (
        <div className="land-card">
            <div className="d-flex justify-content-between"><h3>{land.title}</h3>
                <span
                    className={`favorite-btn ${isFavorite ? "favorite" : ""}`}
                    onClick={() => toggleFavorite(land.id, isFavorite)}
                >
                    {isFavorite ? (
                        <FontAwesomeIcon icon={faBookmarkFilled} />
                    ) : (
                        <FontAwesomeIcon icon={faBookmarkEmpty} />
                    )}
                </span></div>
            <p>{land.location}</p>
            <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img class="d-block w-100" src="https://cdn.prod.website-files.com/65d88ce0663fbd1e37ff4fa8/661e8fa0f2dbcf2aaf37e9be_ES%20LA%20INVERSION%20EN%20TERRENOS.png" alt="First slide" />
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="https://zonafrancaoccidente.com/wp-content/uploads/2021/10/lote-o-terreno-1024x674.png" alt="Second slide" />
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="https://american-tasaciones.com.pe/wp-content/uploads/2023/06/calcular-tasacion-de-terreno.webp" alt="Third slide" />
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>

            {/* <span>${Number(land.price).toLocaleString('en-US')}</span>
            <span> • </span>
            <span>{land.size} m<sup>2</sup></span> */}
            <div className='d-flex justify-content-between'>
                <div className="d-flex flex-column ">
                    <div className="text-nowrap">
                        <span>${Number(land.price).toLocaleString('en-US')}</span>
                        <span> • </span>
                        <span>{land.size} m<sup>2</sup></span>
                    </div>
                    <div className='d-flex align-items-center'>
                        <img src="https://media.istockphoto.com/id/639805094/photo/happy-man.jpg?s=612x612&w=0&k=20&c=REx0Usczge4a0soQvp7fQgGCcFMHeORGUTpOIPW-IYA="
                            style={{
                                width: '35px', height: '35px',
                                objectFit: 'cover',
                                objectPosition: 'center'
                            }}
                            className='my-1 me-2' />
                        <div className='d-flex flex-column'>
                            <span className='fw-medium'>Bob Richard</span>
                        </div>
                    </div>
                </div>
                <div className="vr mx-3"></div>
                <div>{land.description}</div>
            </div>
        </div>
    );
};
export default LandCard;