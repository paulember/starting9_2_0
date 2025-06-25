import React from "react";
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

function getMostRecentMondayWW() {
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
  const offset = (day + 6) % 7; // days to subtract to get to Monday
  nyTime.setDate(nyTime.getDate() - offset);

  // Compute ISO week number
  const monday = new Date(nyTime.getFullYear(), nyTime.getMonth(), nyTime.getDate());

  // ISO week calculation (based on ISO 8601: week starts Monday, week 1 has Jan 4)
  const jan4 = new Date(monday.getFullYear(), 0, 4);
  const jan4Day = jan4.getDay() || 7; // convert Sunday (0) to 7
  const weekStart = new Date(jan4);
  weekStart.setDate(jan4.getDate() - (jan4Day - 1)); // Monday of week 1

  const diffMs = monday - weekStart;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const weekNumber = Math.floor(diffDays / 7) + 1;

  return weekNumber;
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
  getMostRecentMondayWW,
};
