import React from 'react';

const CliqqMerchantForm = () => {
    return (
        <div>
            <form id="merchant_form">
                <input type="hidden" name="storeNumber" id="storeNum" />
                <input type="hidden" name="storeName" id="storeName" />
                <input type="hidden" name="storeAddress" id="storeAddr" />
                <input type="hidden" name="orderId" id="orderId" />
            </form>
        </div>
    );
}

export default CliqqMerchantForm;