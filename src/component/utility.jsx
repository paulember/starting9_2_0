import { getVennGameFromGIT } from "./dataGames";

function getLocalStorageItem(key) {
  let value = localStorage.getItem(key);

  if (value === null) {
    localStorage.setItem(key, 0);
    value = 0;
  }

  return value;
}

function parseAdd(num1, num2) {
  return parseInt(num1) + parseInt(num2);
}

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function calculatePct000(top, bottom) {
  if (bottom === 0) {
    return parseInt(bottom).toFixed(3).replace(/^0+/, "");
  }
  return (parseInt(top) / parseInt(bottom)).toFixed(3).replace(/^0+/, "");
}

const dataPos = [" ", "P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH"];

function getOutType() {
  let rando = randomNum(1, 99);
  switch (true) {
    case rando > 60:
      return "Ground Out";
    case rando > 20:
      return "Fly Out";
    case rando > 5:
      return "Pop Out";
    default:
      return "Foul Out";
  }
}

const updateClass = (
  classArray,
  prefix,
  processPosition,
  game,
  dataGames_24
) => {
  if (!dataGames_24 || typeof dataGames_24 !== "object") {
    console.error("dataGames_24 is missing or not valid.");
    return classArray; // Or handle this case as needed (e.g., return an empty array or throw an error)
  }

  return classArray.map((classItem, index) => {
    if (classItem === "td-posNewSelected") {
      return "td-posSelected";
    } else {
      const vennGame = getVennGameFromGIT(game, dataGames_24);

      if (!vennGame) {
        console.warn(
          "Venn game data is missing for the specified game and dataGames_24."
        );
        return classItem; // Handle this case as needed (e.g., return the classItem unchanged)
      }

      const vennGamePosition = getVennGameFromGIT(game, dataGames_24)[
        `${prefix}${index + 1}_Pos`
      ];
      const vennGamePositionUp = vennGamePosition
        ? vennGamePosition.toUpperCase()
        : "";

      if (processPosition === vennGamePositionUp) {
        return "td-posNewSelected";
      } else {
        return classItem;
      }
      // You may need additional checks on vennGamePosition here if it could be undefined or invalid

      //return vennGamePosition ? `td-${vennGamePosition}` : classItem;
    }
  });
};

//
// return classArray.map((classItem, index) => {
//   if (classItem === "td-posNewSelected") {
//     return "td-posSelected";
//   } else {
//     const vennGamePosition = getVennGameFromGIT(game, dataGames_24)[`${prefix}${index + 1}_Pos`];
//     const vennGamePositionUp = vennGamePosition ? vennGamePosition.toUpperCase() : '';

//     if (processPosition === vennGamePositionUp) {
//       return "td-posNewSelected";
//     } else {
//       return classItem;
//     }
//   }
// });

// };

function parseSubtract(a, b) {
  return a - b;
}

function getJulianDate(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date - startOfYear;
  const dayOfYear = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  return dayOfYear;
}

function getMostRecentMondayJulian() {
  const now = new Date();

  // Convert to New York Time (America/New_York)
  const nyTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  // If it's before 4 AM in New York → treat it as "yesterday"
  if (nyTime.getHours() < 4) {
    nyTime.setDate(nyTime.getDate() - 1);
  }

  // Get most recent Monday
  const day = nyTime.getDay(); // 0 = Sunday
  const offset = (day + 6) % 7; // how many days back to Monday
  nyTime.setDate(nyTime.getDate() - offset);

  const year = nyTime.getFullYear();

  // Calculate Julian day: days since Jan 1 of this year
  const jan1 = new Date(year, 0, 1);
  const julian = Math.floor((nyTime - jan1) / (1000 * 60 * 60 * 24)) + 1;

  return `${year}_${String(julian).padStart(3, "0")}`;
}

function getMondayWWFromJulian(julianStr) {
  const [yearStr, julianStrNum] = julianStr.split("_");
  const year = parseInt(yearStr, 10);
  const julianDay = parseInt(julianStrNum, 10);

  // Create a date from year and julian day
  const date = new Date(year, 0); // Jan 1 of given year
  date.setDate(julianDay); // Set to the julian day

  // Calculate ISO week number
  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7; // convert Sunday (0) to 7
  const weekStart = new Date(jan4);
  weekStart.setDate(jan4.getDate() - (jan4Day - 1)); // Monday of week 1

  const diffMs = date - weekStart;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7) + 1;

  return weekNumber;
}

function addDaysToJulian(julianStr, daysToAdd) {
  const [yearStr, dayStr] = julianStr.split("_");
  const year = parseInt(yearStr, 10);
  const day = parseInt(dayStr, 10);

  // Create a Date from Jan 1 + (day - 1)
  const date = new Date(year, 0, day);
  date.setDate(date.getDate() + daysToAdd);

  const newYear = date.getFullYear();
  const startOfNewYear = new Date(newYear, 0, 1);
  const newJulianDay =
    Math.floor((date - startOfNewYear) / (1000 * 60 * 60 * 24)) + 1;

  return `${newYear}_${String(newJulianDay).padStart(3, "0")}`;
}

function julianToMMDDYYYY(julianStr) {
  const [yearStr, dayStr] = julianStr.split("_");
  const year = parseInt(yearStr, 10);
  const julianDay = parseInt(dayStr, 10);

  // Create a date: Jan 1 + (julianDay - 1)
  const date = new Date(year, 0); // Jan 1
  date.setDate(julianDay);

  // Format MM/DD/YYYY
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${mm}/${dd}/${yyyy}`;
}

function getTimeUntilDailyReset() {
  const now = new Date();
  const nextReset = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1, // next day
      0,
      0,
      0,
      0 // at 00:00:00 UTC
    )
  );

  const diff = nextReset - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

function alertCountDown(julianNextSeries) {
  let countDownText = "You have Completed this Weeks Starting9\n \n";
  countDownText += "Next Series of 9 New Games Scheduled for Monday: \n \n";
  countDownText += julianNextSeries + "\n \n";

  alert(countDownText);
}

export {
  getLocalStorageItem,
  parseAdd,
  randomNum,
  calculatePct000,
  dataPos,
  getOutType,
  updateClass,
  parseSubtract,
  getJulianDate,
  getMondayWWFromJulian,
  getMostRecentMondayJulian,
  addDaysToJulian,
  julianToMMDDYYYY,
  alertCountDown,
};
