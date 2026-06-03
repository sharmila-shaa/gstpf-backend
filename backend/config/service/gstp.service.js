const GSTP_API_URL =
    process.env.GSTP_API_URL ||
    "https://services.gst.gov.in/services/api/search/gstp";

async function fetchGSTPractitioners({
    name = "",
    state = "",
    district = "",
    pincode = ""
}) {
    const payload = {
        searchType: "A",
        trpNam: name || null,
        stCd: state || null,
        dstCd: district || null,
        pinCd: pincode ? String(pincode) : null
    };

    console.log("GST Portal payload:", payload);

    const response = await fetch(GSTP_API_URL, {
        method: "POST",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json;charset=UTF-8",
            Origin: "https://services.gst.gov.in",
            Referer: "https://services.gst.gov.in/services/locategstp"
        },
        body: JSON.stringify(payload)
    });

    const responseText = await response.text();

    let data;

    try {
        data = JSON.parse(responseText);
    } catch {
        throw new Error(
            `GST Portal returned a non-JSON response. HTTP ${response.status}`
        );
    }

    if (!response.ok) {
        throw new Error(
            `GST Portal API failed. HTTP ${response.status}`
        );
    }

    if (data.errorCode) {
        throw new Error(
            `GST Portal rejected the request: ${data.errorCode}`
        );
    }

    return Array.isArray(data) ? data : [];
}

module.exports = {
    fetchGSTPractitioners
};