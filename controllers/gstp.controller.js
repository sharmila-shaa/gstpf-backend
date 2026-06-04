const pool = require("../neon");

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

        let query = `
            SELECT
                enrollment_no,
                name,
                pincode,
                mobile_no,
                email_id,
                state_code,
                state_name,
                district_code,
                district_name,
                address,
                status
            FROM gst_practitioners
            WHERE 1 = 1
        `;

        const values = [];

        if (name) {
            values.push(`%${name}%`);
            query += ` AND name ILIKE $${values.length}`;
        }

        if (state) {
            values.push(state);
            query += `
                AND (
                    state_code = $${values.length}
                    OR state_name ILIKE $${values.length}
                )
            `;
        }

        if (district) {
            values.push(district);
            query += `
                AND (
                    district_code = $${values.length}
                    OR district_name ILIKE $${values.length}
                )
            `;
        }

        if (pincode) {
            values.push(pincode);
            query += ` AND pincode = $${values.length}`;
        }

        query += ` ORDER BY name ASC`;

        const result = await pool.query(query, values);

        return res.status(200).json(result.rows);

    } catch (error) {
        console.error("GSTP SEARCH ERROR:", error.message);

        return res.status(500).json({
            success: false,
            error: "Unable to fetch GST Practitioner records"
        });
    }
};