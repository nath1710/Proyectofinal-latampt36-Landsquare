import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const Filters = ({ announcements, setFilteredAnnouncements }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [locationInput, setLocationInput] = useState('');

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };
    const handleButtonClick = (type, value) => {
        if (type === 'min') {
            setMinPrice(value);
        } else if (type === 'max') {
            setMaxPrice(value);
        }
    };

    const filterAnnouncements = () => {
        let filtered = announcements;

        if (locationInput) {
            filtered = filtered.filter(announcement =>
                announcement.location.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(locationInput.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
            );
        }

        if (filtered.length > 0) {
            setFilteredAnnouncements(filtered)
        }

        console.log(filtered)
    }

    return (
        <div className='d-flex bg-white'>
            <div className="input-group flex-nowrap p-1 w-25">
                <input type="text" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} className="form-control" placeholder="Enter a State, County, City, or ID" aria-label="Username" aria-describedby="addon-wrapping" />
                <span className="input-group-text" id="addon-wrapping"
                    onClick={() => filterAnnouncements()}
                    style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </span>
            </div>
            <div className="values dropdown p-1">
                <button
                    className="dropdown-toggle form-control"
                    id="range-dropdown-toggle"
                    onClick={toggleDropdown}
                >
                    Seleccionar rango
                </button>
                <div
                    className={`dropdown-menu values-menu ${dropdownVisible ? 'show' : ''
                        }`}
                    id="range-dropdown-menu"
                    style={{ width: "300px" }}
                >
                    <div className='d-flex gap-3'>
                        <div className="values-section dropdown-section">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Min Price"
                                value={minPrice}

                            />
                            <button
                                className="values-item dropdown-item"
                                data-type="min"
                                data-value="5000"
                                onClick={() => handleButtonClick('min', '5000')}
                            >
                                $5,000
                            </button>
                            <button
                                className="values-item dropdown-item"
                                data-type="min"
                                data-value="25000"
                                onClick={() => handleButtonClick('min', '25000')}
                            >
                                $25,000
                            </button>
                            <button
                                className="values-item dropdown-item"
                                data-type="min"
                                data-value="50000"
                                onClick={() => handleButtonClick('min', '50000')}
                            >
                                $50,000
                            </button>
                        </div>
                        <span className='pt-2'>-</span>
                        <div className="values-section dropdown-section">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Max Price"
                                value={maxPrice}
                            />
                            <button
                                className="values-item dropdown-item"
                                data-type="max"
                                data-value="75000"
                                onClick={() => handleButtonClick('max', '75000')}
                            >
                                $75,000
                            </button>
                            <button
                                className="values-item dropdown-item"
                                data-type="max"
                                data-value="100000"
                                onClick={() => handleButtonClick('max', '100000')}
                            >
                                $100,000
                            </button>
                            <button
                                className="values-item dropdown-item"
                                data-type="max"
                                data-value="150000"
                                onClick={() => handleButtonClick('max', '150000')}
                            >
                                $150,000
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filters;