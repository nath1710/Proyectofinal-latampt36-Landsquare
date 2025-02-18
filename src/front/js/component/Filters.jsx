import { faChevronDown, faEraser, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

const Filters = ({ announcements, setFilteredAnnouncements, setFilteredFavoritesAnnouncements }) => {
    const [priceDropdownVisible, setPriceDropdownVisible] = useState(false);
    const [areaDropdownVisible, setAreaDropdownVisible] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minArea, setMinArea] = useState('');
    const [maxArea, setMaxArea] = useState('');
    const [locationInput, setLocationInput] = useState('');

    const formatNumber = (number) => {
        if (!number) return '';
        return new Intl.NumberFormat('en-US').format(number);
    };

    const formatToK = (number) => {
        if (!number) return '';
        if (number >= 1000000) {
            return `${(number / 1000000).toFixed(1)}M`.replace('.0', '');
        } else if (number >= 1000) {
            return `${(number / 1000).toFixed(1)}K`.replace('.0', '');
        }
        return number.toString();
    };
    const togglePriceDropdown = () => {
        setPriceDropdownVisible(!priceDropdownVisible);
        if (!priceDropdownVisible) {
            setAreaDropdownVisible(false);
        };
    };
    const toggleAreaDropdown = () => {
        setAreaDropdownVisible(!areaDropdownVisible);
        if (!areaDropdownVisible) {
            setPriceDropdownVisible(false);
        };
    };

    const handleButtonClick = (type, value) => {
        if (type === 'min') {
            setMinPrice(value);
        } else if (type === 'max') {
            setMaxPrice(value);
        }
    };
    const clearFilterLocation = () => {
        setLocationInput('');

        setFilteredAnnouncements(announcements);
        setFilteredFavoritesAnnouncements(announcements);

        console.log("Filters Location cleared. All announcements reset.");
    };
    const clearFilterPrice = () => {
        setMinPrice('');
        setMaxPrice('');

        setFilteredAnnouncements(announcements);
        setFilteredFavoritesAnnouncements(announcements);

        console.log("Filters Price cleared. All announcements reset.");
    };
    const clearFilterArea = () => {
        setLocationInput('');
        setMinArea('');
        setMaxArea('');

        setFilteredAnnouncements(announcements);
        setFilteredFavoritesAnnouncements(announcements);

        console.log("Filters Area cleared. All announcements reset.");
    };
    const clearAllFilters = () => {
        setLocationInput('');
        setMinPrice('');
        setMaxPrice('');
        setMinArea('');
        setMaxArea('');

        setFilteredAnnouncements(announcements);
        setFilteredFavoritesAnnouncements(announcements);

        console.log("All filters cleared. All announcements reset.");
    };

    const filterAnnouncements = () => {
        let filtered = announcements;

        if (locationInput) {
            filtered = filtered.filter(announcement =>
                announcement.location.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(locationInput.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
            );
        }
        if (minPrice || maxPrice) {
            filtered = filtered.filter(announcement => {
                const price = Number(announcement.price);
                const min = Number(minPrice);
                const max = Number(maxPrice);

                // console.log({ price, min, max });

                if (minPrice === "0" && maxPrice === "Any") {
                    setMinPrice('')
                    setMaxPrice('')
                    setPriceDropdownVisible(false)
                }

                if (min && max) {
                    setPriceDropdownVisible(false)
                    return price >= min && price <= max;
                } else if (min) {
                    return price >= min;
                } else if (max) {
                    return price <= max;
                }
            });
        }
        if (minArea || maxArea) {
            filtered = filtered.filter(announcement => {
                const size = Number(announcement.size);
                const min = Number(minArea);
                const max = Number(maxArea);

                if (minArea === "0" && maxArea === "Any") {
                    setMinArea('')
                    setMaxArea('')
                    setAreaDropdownVisible(false)
                }

                if (min && max) {
                    setAreaDropdownVisible(false)
                    return size >= min && size <= max;
                } else if (min) {
                    return size >= min;
                } else if (max) {
                    return size <= max;
                }
            });
        }
        if (filtered.length > 0) {
            setFilteredAnnouncements(filtered)
        }

        // console.log(filtered)
    }
    useEffect(() => {
        filterAnnouncements();
    }, [minPrice, maxPrice, minArea, maxArea, locationInput]);

    return (
        <div className='d-flex bg-white'>
            <div className="input-group flex-nowrap p-1 w-25">
                <input type="text" onKeyDown={filterAnnouncements} value={locationInput} onChange={(e) => setLocationInput(e.target.value)} className="form-control" placeholder="Introduzca un Estado, Condado, Ciudad o ID" aria-label="Username" aria-describedby="addon-wrapping" />
                <span className="input-group-text" id="addon-wrapping"
                    onClick={() => clearFilterLocation()}
                    style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon style={{ color: "rgb(23, 75, 64)" }} icon={faEraser} />
                </span>
            </div>
            {/* PRICE FILTER*/}
            <div className="values dropdown p-1">
                <button
                    className="dropdown-toggle form-control"
                    id="range-dropdown-toggle"
                    onClick={togglePriceDropdown}
                >
                    {minPrice || maxPrice
                        ? `${minPrice ? `$${formatToK(minPrice)}` : ''} - ${maxPrice ? maxPrice == "Any" ? "Any" : `$${formatToK(maxPrice)}` : ''}`
                        : 'Precio'} <FontAwesomeIcon style={{ color: "rgb(23, 75, 64)" }} icon={faChevronDown} />
                </button>
                <div
                    className={`dropdown-menu values-menu ${priceDropdownVisible ? 'show' : ''
                        }`}
                    id="range-dropdown-menu"
                    style={{ width: "300px" }}
                >
                    <div className='d-flex gap-3'>
                        <div className="values-section dropdown-section">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Precio mínimo"
                                value={minPrice ? `$${formatNumber(minPrice)}` : ''}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/[^\d]/g, '');
                                    setMinPrice(rawValue || '');
                                }}
                            />
                            <button
                                className="values-item dropdown-item"
                                data-type="min"
                                data-value="0"
                                onClick={() => handleButtonClick('min', '0')}
                            >
                                $0
                            </button>
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
                                placeholder="Precio máximo"
                                value={maxPrice ? maxPrice == "Any" ? "Any" : `$${formatNumber(maxPrice)}` : ''}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/[^\d]/g, '');
                                    setMaxPrice(rawValue || '');
                                }}
                            />
                            <button
                                className="values-item dropdown-item"
                                data-type="max"
                                data-value="Any"
                                onClick={() => handleButtonClick('max', 'Any')}
                            >
                                Any
                            </button>
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
            {/* AREA FILTER*/}
            <div className="values dropdown p-1">
                <button
                    className="dropdown-toggle form-control"
                    id="range-dropdown-toggle"
                    onClick={toggleAreaDropdown}
                >
                    {minArea || maxArea
                        ? `${minArea ? `${formatToK(minArea)} mt²` : ''} - ${maxArea ? maxArea == "Any" ? "Any" : `${formatToK(maxArea)} mt²` : ''}`
                        : 'Area'} <FontAwesomeIcon style={{ color: "rgb(23, 75, 64)" }} icon={faChevronDown} />
                </button>
                <div
                    className={`dropdown-menu values-menu ${areaDropdownVisible ? 'show' : ''}`}
                    id="range-dropdown-menu"
                    style={{ width: "300px" }}
                >
                    <div className="d-flex gap-3">
                        <div className="values-section dropdown-section">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Min Area (mt²)"
                                value={minArea ? `${formatNumber(minArea)} mt²` : ''}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/[^\d]/g, '');
                                    setMinArea(rawValue || '');
                                }}
                            />
                            <button
                                className="values-item dropdown-item"
                                data-type="min"
                                data-value="0"
                                onClick={() => setMinArea('0')}
                            >
                                0 mt²
                            </button>
                            <button
                                className="values-item dropdown-item"
                                data-type="min"
                                data-value="50"
                                onClick={() => setMinArea('50')}
                            >
                                50 mt²
                            </button>
                            <button
                                className="values-item dropdown-item"
                                data-type="min"
                                data-value="100"
                                onClick={() => setMinArea('100')}
                            >
                                100 mt²
                            </button>
                            <button
                                className="values-item dropdown-item"
                                data-type="min"
                                data-value="200"
                                onClick={() => setMinArea('200')}
                            >
                                200 mt²
                            </button>
                        </div>
                        <span className="pt-2">-</span>
                        <div className="values-section dropdown-section">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Max Area (mt²)"
                                value={maxArea ? maxArea == "Any" ? "Any" : `${formatNumber(maxArea)} mt²` : ''}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/[^\d]/g, '');
                                    setMaxArea(rawValue || '');
                                }}
                            />
                            <button
                                className="values-item dropdown-item"
                                data-type="max"
                                data-value="Any"
                                onClick={() => setMaxArea('Any')}
                            >
                                Any
                            </button>
                            <button
                                className="values-item dropdown-item"
                                data-type="max"
                                data-value="300"
                                onClick={() => setMaxArea('300')}
                            >
                                300 mt²
                            </button>
                            <button
                                className="values-item dropdown-item"
                                data-type="max"
                                data-value="500"
                                onClick={() => setMaxArea('500')}
                            >
                                500 mt²
                            </button>
                            <button
                                className="values-item dropdown-item"
                                data-type="max"
                                data-value="1000"
                                onClick={() => setMaxArea('1000')}
                            >
                                1000 mt²
                            </button>
                        </div>
                    </div>

                </div>

            </div>
            <div className="p-1">
                <button
                    className=" border btn d-flex align-items-center gap-2"
                    onClick={clearAllFilters}
                    style={{ cursor: "pointer", color: "rgb(23, 75, 64)" }}
                >
                    <FontAwesomeIcon icon={faTrash} />
                    Borrar todos los filtros
                </button>
            </div>
        </div>
    );
};

export default Filters;