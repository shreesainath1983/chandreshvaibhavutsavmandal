const boundaryCoords = [
  { lat: 19.4203702, lng: 72.8184411 },
  { lat: 19.4169124, lng: 72.8192692 },
  { lat: 19.4114533, lng: 72.8203528 },
  { lat: 19.4100973, lng: 72.8206532 },
  { lat: 19.4078509, lng: 72.8213506 },
  { lat: 19.4081342, lng: 72.822123 },
  { lat: 19.4089842, lng: 72.8245478 },
  { lat: 19.4097836, lng: 72.8259961 },
  { lat: 19.4109069, lng: 72.8276806 },
  { lat: 19.4104515, lng: 72.8280239 },
  { lat: 19.4102087, lng: 72.8280132 },
  { lat: 19.4098545, lng: 72.8279595 },
  { lat: 19.4094295, lng: 72.8280024 },
  { lat: 19.409217, lng: 72.8283458 },
  { lat: 19.4090753, lng: 72.8286998 },
  { lat: 19.409045, lng: 72.8290968 },
  { lat: 19.4091461, lng: 72.8296761 },
  { lat: 19.4093991, lng: 72.8299658 },
  { lat: 19.4098241, lng: 72.8301911 },
  { lat: 19.4102997, lng: 72.8301697 },
  { lat: 19.4106411, lng: 72.8299612 },
  { lat: 19.4109092, lng: 72.8294247 },
  { lat: 19.4112431, lng: 72.8290278 },
  { lat: 19.4113291, lng: 72.8287569 },
  { lat: 19.4114354, lng: 72.8286952 },
  { lat: 19.4118199, lng: 72.8297359 },
  { lat: 19.4125485, lng: 72.8291458 },
  { lat: 19.4134592, lng: 72.828663 },
  { lat: 19.4136312, lng: 72.8295642 },
  { lat: 19.4139398, lng: 72.8294569 },
  { lat: 19.4139145, lng: 72.8294033 },
  { lat: 19.4142029, lng: 72.8293496 },
  { lat: 19.4140764, lng: 72.8289902 },
  { lat: 19.414552, lng: 72.8288722 },
  { lat: 19.4143294, lng: 72.8281587 },
  { lat: 19.4154627, lng: 72.8277457 },
  { lat: 19.4148809, lng: 72.8246209 },
  { lat: 19.4185742, lng: 72.8213325 },
  { lat: 19.4196619, lng: 72.820383 },
  { lat: 19.420694, lng: 72.8195623 },
  { lat: 19.4203702, lng: 72.8184411 },
];

const societies = [
  { name: "Sunshine Residency", lat: 19.4205, lng: 72.821 },
  { name: "Green Valley", lat: 19.4189, lng: 72.8234 },
  { name: "Sai Darshan Tower", lat: 19.4172, lng: 72.8198 },
];

// // Example coordinates. Replace with your societies.
//   const buildings = [
//     { name: "Society A", lat: 19.2600, lng: 72.8658 },
//     { name: "Society B", lat: 19.2605, lng: 72.8652 },
//   ];

// Example boundary coordinates
const boundary = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [72.8184411, 19.4203702],
        [72.8192692, 19.4169124],
        [72.8203528, 19.4114533],
        [72.8206532, 19.4100973],
        [72.8213506, 19.4078509],
        [72.822123, 19.4081342],
        [72.8245478, 19.4089842],
        [72.8259961, 19.4097836],
        [72.8276806, 19.4109069],
        [72.8280239, 19.4104515],
        [72.8280132, 19.4102087],
        [72.8279595, 19.4098545],
        [72.8280024, 19.4094295],
        [72.8283458, 19.409217],
        [72.8286998, 19.4090753],
        [72.8290968, 19.409045],
        [72.8296761, 19.4091461],
        [72.8299658, 19.4093991],
        [72.8301911, 19.4098241],
        [72.8301697, 19.4102997],
        [72.8299612, 19.4106411],
        [72.8294247, 19.4109092],
        [72.8290278, 19.4112431],
        [72.8287569, 19.4113291],
        [72.8286952, 19.4114354],
        [72.8297359, 19.4118199],
        [72.8291458, 19.4125485],
        [72.828663, 19.4134592],
        [72.8295642, 19.4136312],
        [72.8294569, 19.4139398],
        [72.8294033, 19.4139145],
        [72.8293496, 19.4142029],
        [72.8289902, 19.4140764],
        [72.8288722, 19.414552],
        [72.8281587, 19.4143294],
        [72.8277457, 19.4154627],
        [72.8246209, 19.4148809],
        [72.8213325, 19.4185742],
        [72.820383, 19.4196619],
        [72.8195623, 19.420694],
        [72.8184411, 19.4203702],
      ],
    ],
  },
};
// ...existing code...

function spreadFullName(fullName) {
  if (!fullName || typeof fullName !== "string") {
    return { first_name: "", middle_name: "", last_name: "" };
  }

  const nameParts = fullName
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);

  if (nameParts.length === 0) {
    return { F_name: "", M_name: "", L_name: "" };
  }

  if (nameParts.length === 1) {
    return { F_name: nameParts[0], M_name: "", L_name: "" };
  }

  if (nameParts.length === 2) {
    return { F_name: nameParts[1], M_name: "", L_name: nameParts[0] };
  }

  // 3 or more words: first is last name, second is first name, rest are middle name
  return {
    first_name: nameParts[1],
    middle_name: nameParts.slice(2).join(" "),
    last_name: nameParts[0],
  };
}

const generateUserId = (users) => {
  if (users.length === 0) return 1;
  const ids = users.map((user) => user.id);
  return Math.max(...ids) + 1;
};

// Validate a 10-digit mobile number. Accepts numbers or strings; strips non-digits and
// returns true only when exactly 10 digits remain.
const validateMobile = (input) => {
  var mobileNumberPattern = /^[0-9]{10}$/;
  return mobileNumberPattern.test(input);
};

const formatDateToDDMMMYYYY = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  const mon = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${mon}-${year}`;
};

// Convert a string to camelCase: "hello world" -> "helloWorld"
const toCamelCase = (str) => {
  if (!str || typeof str !== "string") return "";
  const parts = str
    .trim()
    .replace(/[^a-zA-Z0-9\s_-]+/g, " ")
    .split(/[\s_-]+/)
    .filter(Boolean);
  if (parts.length === 0) return "";
  return parts
    .map((p, i) => {
      const s = p.toLowerCase();
      if (i === 0) return s;
      return s.charAt(0).toUpperCase() + s.slice(1);
    })
    .join("");
};

// Convert number to words in Indian numbering (Rupees and Paise)
const numberToRupeesWords = (input) => {
  if (input === null || input === undefined || input === "") return "";
  let num = Number(String(input).replace(/,/g, ""));
  if (Number.isNaN(num)) return "";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const twoDigits = (n) => {
    if (n < 20) return ones[n];
    const t = Math.floor(n / 10);
    const o = n % 10;
    return tens[t] + (o ? " " + ones[o] : "");
  };

  const threeDigits = (n) => {
    const h = Math.floor(n / 100);
    const rem = n % 100;
    return (
      (h ? ones[h] + " Hundred" + (rem ? " " : "") : "") +
      (rem ? twoDigits(rem) : "")
    );
  };

  const segments = [];
  let integerPart = Math.floor(Math.abs(num));

  if (integerPart === 0) segments.push("Zero");

  // Crores
  const crore = Math.floor(integerPart / 10000000);
  if (crore) {
    segments.push(`${twoDigits(crore)} Crore`);
    integerPart = integerPart % 10000000;
  }
  // Lakhs
  const lakh = Math.floor(integerPart / 100000);
  if (lakh) {
    segments.push(`${twoDigits(lakh)} Lakh`);
    integerPart = integerPart % 100000;
  }
  // Thousands
  const thousand = Math.floor(integerPart / 1000);
  if (thousand) {
    segments.push(`${twoDigits(thousand)} Thousand`);
    integerPart = integerPart % 1000;
  }
  // Hundreds and below
  if (integerPart) {
    segments.push(threeDigits(integerPart));
  }

  const rupeeWords = segments.filter(Boolean).join(" ");
  const result = `${rupeeWords} Rupees Only`;
  return result.trim();
};

function getFormattedDate(date, isID = false) {
  let day = date.getDate();
  let month = date.getMonth() + 1; // Month is 0-indexed, so add 1
  const year = date.getFullYear();
  // Add leading zeros if day or month is a single digit
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  return isID ? `${day}${month}${year}` : `${day}/${month}/${year}`;
}

// Generate receipt number on component mount
const generateReceiptNo = (userId, counter, date) => {
  const datePart = getFormattedDate(date, true); // Get date in DDMMYYYY format for ID
  return `${datePart}/${userId}/${counter}`;
};

const paymentModes = [
  { title: "Cash", value: "Cash" },
  { title: "GPay", value: "GPay" },
  { title: "PhonePe", value: "PhonePe" },
  { title: "Bank Transfer", value: "Bank Transfer" },
  { title: "Cheque", value: "Cheque" },
  { title: "Other mode", value: "Other mode" },
];

const eventList = [
  { title: "Ganeshutsav", value: "Ganeshutsav" },
  { title: "Navratri", value: "Navratri" },
  { title: "Holi", value: "Holi" },
  { title: "Independence Day", value: "Independence Day" },
  { title: "Republic Day", value: "Republic Day" },
  { title: "Other", value: "Other" },
];

export {
  boundary,
  societies,
  spreadFullName,
  generateUserId,
  validateMobile,
  formatDateToDDMMMYYYY,
  toCamelCase,
  numberToRupeesWords,
  generateReceiptNo,
  paymentModes,
  eventList,
};
