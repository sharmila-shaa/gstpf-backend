const fs = require("fs");

const COOKIES = 'Lang=en; ak_bmsc=8B332070AEA55D118C7E3D8A12AD2785~000000000000000000000000000000~YAAQ1NcLF5NGtXieAQAAoNNDfh9P0iz3FV95B07qoHeeQrs4xbJj5whWGTn/OSA5PNymmO7QZE8tIsohUzvMXmgjr2h9dcKGncoeiPTeudrh5OKcGWNuI7WoqI9a/UthkT5AYIC2chT15Qoh1k1RTWoBsDICGoiIeHD9M5ztZQzhr48odz8BYB6ADtm09zYuzPj4yv4bKzHt39EOWEqpMSFQpuSh0JbS2u1ukFDoZckgaWdrs4ks1dhTBtSP6nOLetJ0/X7Zt6t0ZaIM9opLKG0TNitK+2u8h2UjJOz5GGvwBTnhRlP3B1FwwLZ4CmVneXUEjrtTRCDE3ndRF5zaYNng7+osDuE07dO7WFE0cNRPVlHQ1X3fujJ0Pl1NBob5mrs=; TS0134d082=010c0f54ddf7e09937fc1a1b2a7e57157e94adfb60c723cd580802425cf28db83f068d15c155439a1f549b17cc9684943f3a336f17; bm_sv=47CDCEA0A149474F6A0F9A7511F7F3E2~YAAQ1NcLF2Sst3ieAQAA2dVMfh+B9BoQROw3xWrBNjh8Z91pb4of1o3wwAS7Olvnj03zQ7SMVOn3IhBQj3HPQnxFEBkknHAv0tahSJdC2i+bxK2dL5a745fCVPp+mjw1dGbzTILLenBUYKnojbgxbjvJzXpzyv+mt72+3mqNudeBKACp4acZi7tdh/u7CMD0im9aFFJ4not96ZBu6x2Spa3nxtrWqigMfIJ7Tl8kP5UFl8WCMIk+sxAfUooewlyx~1';

async function fetchGSTPByPincode(pincode, stateCode = "33", districtCode = "TNCHE") {
  const url = "https://services.gst.gov.in/services/api/search/gstp";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      "Connection": "keep-alive",
      "Content-Type": "application/json;charset=UTF-8",
      "Cookie": COOKIES,
      "Origin": "https://services.gst.gov.in",
      "Referer": "https://services.gst.gov.in/services/locategstp",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0",
      "sec-ch-ua": '"Chromium";v="148", "Microsoft Edge";v="148", "Not/A)Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "Windows",
    },
    body: JSON.stringify({
      searchType: "A",
      trpNam: null,
      stCd: stateCode,
      dstCd: districtCode,
      pinCd: String(pincode),
    }),
  });

  if (!response.ok) throw new Error(`HTTP ${response.status} — ${await response.text()}`);

  const data = await response.json();

  // API returns a plain array directly (not wrapped in gstpList)
  const records = Array.isArray(data) ? data : Object.values(data);

  console.log(`[${pincode}] ${records.length} records found`);
  return records;
}

function normalizeRecord(r, pincode) {
  return {
    pincode:       pincode,
    enrollmentNo:  r.enrlNo  || "",
    name:          r.trpNam  || "",
    stateCode:     r.stCd    || "",
    districtCode:  r.dstCd   || "",
    qualification: r.qlfc    || "",
    address:       r.adr     || "",
    district:      r.dst     || "",
    city:          r.city    || "",
    pinCode:       r.pnCd    || pincode,
    mobileNo:      r.mbNo    || "",
    emailId:       r.email   || "",
    status:        r.sts     || "",
    _raw:          r,
  };
}

async function scrapeOnePincode(pincode, stateCode = "33", districtCode = "TNCHE") {
  const outputFile = `gstp_${pincode}.json`;

  if (fs.existsSync(outputFile)) {
    console.log(`[${pincode}] Already scraped — skipping (delete ${outputFile} to re-scrape)`);
    return;
  }

  console.log(`\nScraping pincode: ${pincode}`);

  try {
    const rawRecords = await fetchGSTPByPincode(String(pincode), stateCode, districtCode);
    const records = rawRecords.map((r) => normalizeRecord(r, pincode));

    const output = {
      pincode:      String(pincode),
      stateCode,
      districtCode,
      scrapedAt:    new Date().toISOString(),
      totalRecords: records.length,
      records,
    };

    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    console.log(`[${pincode}] ✓ Saved ${records.length} records → ${outputFile}`);

  } catch (err) {
    console.error(`[${pincode}] ✗ Failed — ${err.message}`);
  }
}

// ── Run ───────────────────────────────────────────────────────────────────────

// Chennai Pincodes

const chennaiPincodes = [
  "600001","600002","600003","600004","600005",
  "600006","600007","600008","600009","600010",
  "600011","600012","600013","600014","600015",
  "600016","600017","600018","600019","600020",
  "600021","600022","600023","600024","600025",
  "600026","600027","600028","600029","600030",
  "600031","600032","600033","600034","600035",
  "600036","600037","600038","600039","600040",
  "600041","600042","600043","600044","600045",
  "600046","600047","600048","600049","600050",
  "600051","600052","600053","600054","600055",
  "600056","600057","600058","600059","600060",
  "600061","600062","600063","600064","600065",
  "600066","600067","600068","600069","600070",
  "600071","600072","600073","600074","600075",
  "600076","600077","600078","600079","600080",
  "600081","600082","600083","600084","600085",
  "600086","600087","600088","600089","600090",
  "600091","600092","600093","600094","600095",
  "600096","600097","600098","600099","600100",
  "600101","600102","600103","600104","600105",
  "600106","600107","600108","600109","600110",
  "600111","600112","600113","600114","600115",
  "600116","600117","600118","600119","600120",
  "600121","600122","600123","600124","600125",
  "600126","600127","600128","600129","600130"
];

(async () => {

  for (const pincode of chennaiPincodes) {

    await scrapeOnePincode(
      pincode,
      "33",
      "TNCHE"
    );

    await new Promise(resolve =>
      setTimeout(resolve, 2000)
    );

  }

  console.log("All Chennai pincodes completed");

})();