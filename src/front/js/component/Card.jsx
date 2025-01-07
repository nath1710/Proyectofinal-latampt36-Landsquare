import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Context } from '../store/appContext';
import '../../styles/randomStyles.css';

const Card = (props) => {
    const { store, actions } = useContext(Context)
    const navigate = useNavigate();

    const handleDelete = () => {
        alert('Closeeee')
    };

    return (
        <div className='card border shadow container-card-options' style={{ width: '18rem', height: '21rem' }}>
            <img
                src={props.imgURL}
                className='card-img-top'
                alt='...'
                style={{ height: '12rem', objectFit: 'cover' }}
            />

            {store.token ?
                <div className='btn-group card-options'>
                    <button type='button' className='btn btn-warning dropdown-toggle' data-bs-toggle='dropdown' aria-expanded='false'>
                        <i className='fa-solid fa-ellipsis-vertical'></i>
                    </button>
                    <ul className='dropdown-menu dropdown-menu-end'>
                        <li><Link to='/'><button className='dropdown-item' type='button'>Editar</button></Link></li>
                        <li><button className='dropdown-item' type='button' onClick={handleDelete}>Eliminar</button></li>
                    </ul>
                </div>
                :
                <button className='btn btn-danger' type='button' ></button>
            }


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
                    <div className='d-flex justify-content-center align-items-center fs-5 ms-2'><i className='fa-regular fa-heart'></i></div>
                </div>
                <div className='d-flex justify-content-between'>
                    <div className='d-flex align-items-center' >
                        <img src={props.imgOwner}
                            style={{ width: '35px', height: '35px' }}
                            className='my-1 me-2' />
                        <div className='d-flex flex-column'>
                            <span className='fw-medium'>{props.owner}</span>
                            <span className='text-overflow-ellipsis'>{props.info}</span>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center fs-5 ms-2'><i className='fa-regular fa-envelope'></i></div>
                </div>
            </div>
        </div>
    );
};

export default Card;