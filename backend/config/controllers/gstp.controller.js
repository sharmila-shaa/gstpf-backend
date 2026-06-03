const GSTP_SERVICE = require("../service/gstp.service");

exports.searchGSTP = async (req, res) => {
    try {
        const {
            name = "",
            state = "",
            district = "",
            pincode = ""
        } = req.query;

        if (!name && !state && !district && !pincode) {
            return res.status(400).json({
                success: false,
                error: "Enter at least one search value"
            });
        }

        const records = await GSTP_SERVICE.fetchGSTPractitioners({
            name,
            state,
            district,
            pincode
        });

        return res.status(200).json(records);

    } catch (error) {
        console.error("GSTP SEARCH ERROR:", error.message);

        return res.status(502).json({
            success: false,
            error: error.message
        });
    }
};