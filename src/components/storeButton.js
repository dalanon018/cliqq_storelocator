import React from 'react';

const storeButton = (props) => {
    return (
        <button
            data-id="__setLocation"
            data-storenum={props.storeNum}
            data-storename={props.storeName}
            type="button"
            className="button-set-store btn btn-success btn-lg"
        >
            Set Store{" "}
        </button>
    );
};

export default storeButton;

