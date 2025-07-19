import React from "react";
function StreakStats({ streakCurrent, streakLongest, streakBreaker }) {
  // Return the table row
  return (
    <>
      <tr>
        <td colspan="5" style={{ textAlign: "left" }}>
          Hitting Streak {streakCurrent}
        </td>

        <td colspan="5">For Future Use {streakLongest}</td>
      </tr>
    </>
  );
}

export default StreakStats;
