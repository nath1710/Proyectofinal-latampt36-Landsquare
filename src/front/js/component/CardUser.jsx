import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Context } from '../store/appContext';
import '../../styles/randomStyles.css';

const CardUser = (props) => {
    const { store, actions } = useContext(Context)
    const navigate = useNavigate();

    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const modalId = `deleteModal-${props.announcementID}`;

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(process.env.BACKEND_URL + `/api/announcement/${props.announcementID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al eliminar el anuncio');
            }
            if (props.onDelete) {
                props.onDelete(props.announcementID);
            }

            navigate(0);

        } catch (error) {
            setError(error.message);
            console.error('Error deleting announcement:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className='card border shadow container-card-options' style={{ width: '18rem', height: '21rem' }}>
            <Link to={`/announcement/${props.announcementID}`}>
                <img
                    src={props.imgURL}
                    className='card-img-top'
                    alt='...'
                    style={{ height: '12rem', objectFit: 'cover' }}
                />
            </Link>

            {store.token && (
                <div className='btn-group card-options no-arrow'>
                    <button
                        type='button'
                        className='btn text-bg-success dropdown-toggle'
                        data-bs-toggle='dropdown'
                        aria-expanded='false'
                    >
                        <i className='fa-solid fa-ellipsis-vertical'></i>
                    </button>
                    <ul className='dropdown-menu dropdown-menu-end'>
                        <li>
                            <Link
                                to={`/land-settings/${props.announcementID}`}
                                className='link-offset-2 link-underline link-underline-opacity-0'
                            >
                                <button className='dropdown-item' type='button'>
                                    Editar
                                </button>
                            </Link>
                        </li>
                        <li>
                            <button
                                type='button'
                                className='dropdown-item'
                                data-bs-toggle='modal'
                                data-bs-target={`#${modalId}`}
                            >
                                Eliminar
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            <div
                className='modal fade'
                id={modalId}
                tabIndex='-1'
                aria-labelledby={`${modalId}Label`}
                aria-hidden='true'
            >
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h1 className='modal-title fs-5' id={`${modalId}Label`}>
                                Eliminar Publicación
                            </h1>
                            <button
                                type='button'
                                className='btn-close'
                                data-bs-dismiss='modal'
                                aria-label='Close'
                            />
                        </div>
                        <div className='modal-body'>
                            {error ? (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            ) : (
                                '¿Estás seguro de eliminar esta publicación?'
                            )}
                        </div>
                        <div className='modal-footer'>
                            <button
                                type='button'
                                className='btn btn-secondary'
                                data-bs-dismiss='modal'
                                disabled={isDeleting}
                            >
                                Cancelar
                            </button>
                            <button
                                type='button'
                                className='btn btn-danger'
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Eliminando...
                                    </>
                                ) : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='card-body'>
                <div className='d-flex justify-content-between mb-2'>
                    <div className='d-flex flex-column'>
                        <div className='fw-medium'>
                            <span>${props.price}</span>
                            <span> • </span>
                            <span>{props.size} m<sup>2</sup></span>
                        </div>
                        <div>
                            <span className='text-overflow-ellipsis'>{props.address}</span>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center fs-5 ms-2'>
                        <i className='fa-regular fa-heart'></i>
                    </div>
                </div>
                <div className='d-flex justify-content-between'>
                    <div className='d-flex align-items-center'>
                        <img
                            src={props.imgOwner}
                            style={{ width: '35px', height: '35px' }}
                            className='my-1 me-2'
                            alt="Owner"
                        />
                        <div className='d-flex flex-column'>
                            <span className='fw-medium'>{props.owner}</span>
                            <span className='text-overflow-ellipsis'>{props.info}</span>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center fs-5 ms-2'>
                        <i className='fa-regular fa-envelope'></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardUser;