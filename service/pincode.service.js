const GST_STATE_CODES =
    require("../mappings/gst-state-code-map");

async function resolvePincode(pincode) {
    const url =
        `https://api.postalpincode.in/pincode/${pincode}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Unable to resolve pincode. HTTP ${response.status}`
        );
    }

    const data = await response.json();

    const result = data?.[0];

    if (
        result?.Status !== "Success" ||
        !Array.isArray(result.PostOffice) ||
        result.PostOffice.length === 0
    ) {
        throw new Error("Invalid or unavailable pincode");
    }

    const postOffice = result.PostOffice[0];

    const stateName =
        String(postOffice.State || "")
            .trim()
            .toUpperCase();

    const districtName =
        String(postOffice.District || "")
            .trim();

    const stateCode =
        GST_STATE_CODES[stateName];

    if (!stateCode) {
        throw new Error(
            `GST state code not available for ${stateName}`
        );
    }

    return {
        stateName,
        districtName,
        stateCode
    };
}

module.exports = {
    resolvePincode
};