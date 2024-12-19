import React from "react";

const Card = (props) => {
    return (        
        <div className="card border shadow" style={{width: '18rem'}}>
            <img src={props.imgURL} className="card-img-top" alt="..." />
            <div className="card-body">
                <div className='d-flex justify-content-between mb-2'>
                    <div className='d-flex flex-column'> 
                        <div className='fw-medium'>
                            <span>${props.price}</span>
                            <span> • </span>
                            <span>{props.size} m<sup>2</sup></span>
                        </div>
                        <div>
                            <span>{props.address}</span>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center fs-5'><i className="fa-regular fa-heart"></i></div>
                </div>
                <div className='d-flex justify-content-between'>
                    <div className='d-flex align-items-center'>
                        <img src={props.imgOwner}
                            style={{width:'35px', height:'35px'}}
                            className='my-1 me-2'/>
                        <div className='d-flex flex-column'>
                            <span className='fw-medium'>{props.owner}</span>
                            <span>{props.info}</span>
                        </div>
                    </div>                    
                    <div className='d-flex justify-content-center align-items-center fs-5'><i className="fa-regular fa-envelope"></i></div>
                </div>
            </div>
        </div>
    );
};

export default Card;