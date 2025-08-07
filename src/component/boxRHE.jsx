import { useState, useEffect } from "react";
import { getVennGame, getVennGameFromGIT } from "../component/dataGames";
import { getTeamData } from "../component/utilityUEGame";

function BoxRHE({ game, dataGames_24 }) {
  let linkSABR = "https://sabr.org/gamesproject";
  let linkAuthor = "https://sabr.org/gamesproject";
  let awayRHELine = [0, 0, 0];
  let homeRHELine = [0, 0, 0];
  let linkBox = "https://sabr.org/gamesproject";
  let gameMessage = "";
  let gameMessageLink = "";

  if (dataGames_24 && typeof dataGames_24 === "object") {
    const vennGame = getVennGameFromGIT(game, dataGames_24);

    if (vennGame) {
      linkSABR = vennGame.LinkSabr;
      linkAuthor = vennGame.Author;
      gameMessage = vennGame?.gameMessage ?? "";
      gameMessageLink = vennGame?.gameMessageLink ?? "";

      awayRHELine = [
        vennGame.AwayRunsScored || 0,
        vennGame.AwayHits || 0,
        vennGame.AwayErrors || 0,
      ];
      homeRHELine = [
        vennGame.HomeRunsScored || 0,
        vennGame.HomeHits || 0,
        vennGame.HomeErrors || 0,
      ];
      linkBox = vennGame.LinkBox;
    } else {
      console.warn("Venn game data is missing for the specified game.");
    }
  } else {
    console.error("dataGames is missing or not valid.");
  }

  const [awayTeam, setAwayTeam] = useState("");
  const [homeTeam, setHomeTeam] = useState("");
  const fetchData = async () => {
    let awayTeamData = null;
    let homeTeamData = null;

    try {
      let awayTeamData = await getTeamData(game, dataGames_24, "AWAY");
      let homeTeamData = await getTeamData(game, dataGames_24, "HOME");
      setAwayTeam(awayTeamData.nickname);
      setHomeTeam(homeTeamData.nickname);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();

  let titleWithDashes = linkSABR.replace(
    "https://sabr.org/gamesproj/game/",
    ""
  );

  if (titleWithDashes.endsWith("/")) {
    titleWithDashes = titleWithDashes.slice(0, -1);
  }
  const headLine = titleWithDashes.replace(/-/g, " ");

  let authorWithDashes = linkAuthor.replace("https://sabr.org/authors/", "");
  if (authorWithDashes.endsWith("/")) {
    authorWithDashes = authorWithDashes.slice(0, -1);
  }
  const byLine = authorWithDashes.replace(/-/g, " ");

  return (
    <>
      <h4>
        <a href={linkSABR} target="_blank" rel="noreferrer">
          {" "}
          {headLine}{" "}
        </a>
        <br></br>
        author:{" "}
        <a href={linkAuthor} target="_blank" rel="noreferrer">
          {" "}
          {byLine}{" "}
        </a>
      </h4>

      <table class="statTable td-statBox alignRight">
        <tr>
          <td class="alignLeft">{awayTeam} &emsp;</td>
          <td>{awayRHELine[0]}</td> <td>{awayRHELine[1]}</td>{" "}
          <td>{awayRHELine[2]}</td>
        </tr>
        <tr>
          <td class="alignLeft">{homeTeam} &emsp;</td>
          <td>{homeRHELine[0]}</td> <td>{homeRHELine[1]}</td>{" "}
          <td>{homeRHELine[2]}</td>
          <td>
            <a href={linkBox} target="_blank" rel="noreferrer">
              {" "}
              Box Score{" "}
            </a>
          </td>
        </tr>
      </table>
      {gameMessage && (
        <table>
          <tbody>
            <tr>
              <td className="gameQuote">
                {gameMessageLink ? (
                  <a
                    href={gameMessageLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {gameMessage}
                  </a>
                ) : (
                  gameMessage
                )}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
}

export default BoxRHE;
