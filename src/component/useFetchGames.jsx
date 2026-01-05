import { useEffect, useState } from "react";

function useFetchGames(mostRecentMonday) {
  const [gamesGIT, setGamesGIT] = useState([]);

  useEffect(() => {
    const gamesFile =
      "https://raw.githubusercontent.com/paulember/paulember.github.io/main/src/data/starting9/games" +
      mostRecentMonday +
      ".json";
    /*
      "https://raw.githubusercontent.com/paulember/paulember.github.io/refs/heads/main/src/data/starting9/gamesTEST.json";
      */
    fetch(gamesFile)
      .then((response) => {
        if (!response.ok) {
          throw new Error("useFetchGames: Network response was not ok");
        }
        return response.json();
      })
      .then((dataGamesGIT) => {
        setGamesGIT(dataGamesGIT);
        console.log(
          "useFetchGames: Fetch of GamesGIT completed at:",
          new Date(),
          " data: ",
          dataGamesGIT
        );
      })
      .catch((error) => {
        console.error("useFetchGames: Error fetching data:", error);
      });
  }, []);

  return gamesGIT;
}

export default useFetchGames;
