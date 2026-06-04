// const fs = require("fs");
// const pool = require("../config//neon");

// const stateMap = {
//     "33": "Tamil Nadu"
// };

// const districtMap = {
//     "TNCHE": "Chennai"
// };

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function importFiles() {
//     const files = fs.readdirSync("./");

//     const jsonFiles = files.filter(
//         file =>
//             file.startsWith("gstp_") &&
//             file.endsWith(".json")
//     );

//     console.log(`Found ${jsonFiles.length} files`);

//     for (const file of jsonFiles) {
//         const data = JSON.parse(
//             fs.readFileSync(file, "utf8")
//         );

//         const records = data.records || [];

//         for (const row of records) {
//             const stateCode = row.stateCode || row._raw?.stCd || "";
//             const stateName = stateMap[stateCode] || "";

//             const districtCode =
//                 row.districtCode ||
//                 row._raw?.dstCd ||
//                 row._raw?.adrs?.district ||
//                 "";

//             const districtName =
//                 districtMap[districtCode] || "";

//             const address =
//                 row.address ||
//                 row._raw?.adrs?.addr ||
//                 "";

//             const status =
//                 row.status ||
//                 row._raw?.status ||
//                 "";

//             try {
//                 await pool.query(
//                     `
//                     INSERT INTO gst_practitioners
//                     (
//                         enrollment_no,
//                         name,
//                         pincode,
//                         mobile_no,
//                         email_id,
//                         state_code,
//                         state_name,
//                         district_code,
//                         district_name,
//                         address,
//                         status,
//                         raw_data
//                     )
//                     VALUES
//                     (
//                         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
//                     )
//                     `,
//                     [
//                         row.enrollmentNo,
//                         row.name,
//                         row.pincode,
//                         row._raw?.cntctNo || row.mobileNo || "",
//                         row._raw?.emailId || row.emailId || "",
//                         stateCode,
//                         stateName,
//                         districtCode,
//                         districtName,
//                         address,
//                         status,
//                         JSON.stringify(row)
//                     ]
//                 );

//                 await sleep(50);

//             } catch (err) {
//                 console.log("Insert failed:", row.enrollmentNo, err.message);
//             }
//         }

//         console.log(`${file} imported`);
//     }

//     console.log("Import Completed");

//     await pool.end();
// }

// importFiles();
const fs = require("fs");
const path = require("path");
const pool = require("../neon");

const stateMap = {
    "33": "Tamil Nadu"
};

const districtMap = {
    "TNCHE": "Chennai"
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function importFiles() {
    const dataFolder = path.join(__dirname, "../");

    const files = fs.readdirSync(dataFolder);

    const jsonFiles = files.filter(
        file =>
            file.startsWith("gstp_") &&
            file.endsWith(".json")
    );

    console.log(`Found ${jsonFiles.length} files`);

    for (const file of jsonFiles) {
        const filePath = path.join(dataFolder, file);

        const data = JSON.parse(
            fs.readFileSync(filePath, "utf8")
        );

        const records = data.records || [];

        for (const row of records) {
            const stateCode =
                row.stateCode ||
                row._raw?.stCd ||
                "";

            const stateName =
                stateMap[stateCode] || "";

            const districtCode =
                row.districtCode ||
                row._raw?.dstCd ||
                row._raw?.adrs?.district ||
                "";

            const districtName =
                districtMap[districtCode] || "";

            const address =
                row.address ||
                row._raw?.adrs?.addr ||
                "";

            const status =
                row.status ||
                row._raw?.status ||
                "";

            try {
                await pool.query(
                    `
                    INSERT INTO gst_practitioners
                    (
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
                        status,
                        raw_data
                    )
                    VALUES
                    (
                        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
                    )
                    `,
                    [
                        row.enrollmentNo,
                        row.name,
                        row.pincode,
                        row._raw?.cntctNo || row.mobileNo || "",
                        row._raw?.emailId || row.emailId || "",
                        stateCode,
                        stateName,
                        districtCode,
                        districtName,
                        address,
                        status,
                        JSON.stringify(row)
                    ]
                );

                await sleep(50);

            } catch (err) {
                console.log("Insert failed:", row.enrollmentNo, err.message);
            }
        }

        console.log(`${file} imported`);
    }

    console.log("Import Completed");

    await pool.end();
}

importFiles();