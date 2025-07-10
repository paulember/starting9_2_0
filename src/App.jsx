import "./App.css";

import React from "react";
import "./styles.css";

import { useState, useEffect } from "react";

import {
  parseAdd,
  randomNum,
  getLocalStorageItem,
  dataPos,
  getOutType,
  updateClass,
  parseSubtract,
  getJulianDate,
  getMondayWWFromJulian,
  alertCountDown,
  addDaysToJulian,
  getMostRecentMondayJulian,
  julianToMMDDYYYY,
} from "./component/utility";
import { getTeamData } from "./component/utilityUEGame";
import { getVennGameFromGIT } from "./component/dataGames";

import BoxRHE from "./component/boxRHE";
import useFetchTeams from "./component/useFetchTeams";
import useFetchGames from "./component/useFetchGames";

import AtBatHistoryDiv from "./component/atbatHist";
import SplashDiv from "./component/splash";
import LineupTable from "./component/lineupTable";
import StreakStats from "./component/streakStats";

import Dropdown from "./dropDown";
import Modal from "./Modal";

function handleClickHelp() {
  window.location.href = window.location.href;
}

export default function App() {
  const gameTotal = 9;

  const julianDate = new Date().getFullYear() + "_" + getJulianDate(new Date());

  const julianSeriesCompletedWW =
    localStorage.getItem("julianSeriesCompletedWW") ?? 0;

  const julianCurrentSeries = getMostRecentMondayJulian(julianDate);
  const julianNextSeries = julianToMMDDYYYY(
    addDaysToJulian(getMostRecentMondayJulian(julianDate), 8)
  );
  const mostRecentMondayWW = getMondayWWFromJulian(julianDate);

  const [lineupColorAway, setLineupColorAway] = useState("white");
  const [lineupColorHome, setLineupColorHome] = useState("white");
  const [LosingTeamHomeAway, setLosingTeamHomeAway] = useState("AWAY");
  const [lineupHeaderAway, setLineupHeaderAway] = useState("AWAY");
  const [lineupHeaderHome, setLineupHeaderHome] = useState("HOME");

  const [selectedTeam, setSelectedTeam] = useState(true);
  const [game, setGame] = useState(0);

  const [awaytdClass, setAwaytdClass] = useState([Array(10).fill(null)]);
  const [hometdClass, setHometdClass] = useState([Array(10).fill(null)]);
  const [buttonHelpClass, setButtonHelpClass] = useState("buttonNone");

  const [targetTeam, setTargetTeam] = useState([Array(8).fill(null)]);
  const [losingTeam, setLosingTeam] = useState([Array(4).fill(null)]);

  const [displayTestData, setDisplayTestData] = useState([Array(6).fill(null)]);

  const [showHideGameDetailsDiv, setShowHideGameDetailsDiv] = useState("Show ");
  const [divBlockNone, setDivBlockNone] = useState("divDisplayNone");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [startButtonLabel, setStartButtonLabel] = useState("START");
  const [nextGameButton, setNextGameButton] = useState("starting9Start");

  const [atBatHistory, setAtBatHistory] = useState([]);
  const [gameResult, setGameResult] = useState([]);

  const [LSHomeRuns, setLSHomeRuns] = useState(0);
  const [LSTriples, setLSTriples] = useState(0);
  const [LSDoubles, setLSDoubles] = useState(0);
  const [LSSingles, setLSSingles] = useState(0);
  const [LSAtBats, setLSAtBats] = useState(0);
  const [LSRBI, setLSRBI] = useState(0);
  const [LSLastGame, setLSLastGame] = useState(0);
  const [LSMostRecentGameDate, setLSMostRecentGameDate] =
    useState("2025-01-01");
  const [LSGameCount, setLSGameCount] = useState(0);
  const [seriesName, setSeriesName] = useState("");
  const seriesNameShort = seriesName.slice(2);

  const [LSStreakCurrent, setLSStreakCurrent] = useState(0);
  const [LSStreakLongest, setLSStreakLongest] = useState(0);
  const [LSStreakBreaker, setLSStreakBreaker] = useState("none");

  const [LSSnapGameCount, setLSSnapGameCount] = useState(0);
  const [LSSnapHomeRuns, setLSSnapHomeRuns] = useState(0);
  const [LSSnapTriples, setLSSnapTriples] = useState(0);
  const [LSSnapDoubles, setLSSnapDoubles] = useState(0);
  const [LSSnapSingles, setLSSnapSingles] = useState(0);
  const [LSSnapAtBats, setLSSnapAtBats] = useState(0);
  const [LSSnapRBI, setLSSnapRBI] = useState(0);

  const [processPosition, setProcessPosition] = useState("");
  const [processTeam, setProcessTeam] = useState("");

  const teamNames = useFetchTeams();
  const dataGames_24 = useFetchGames(mostRecentMondayWW);

  const [posButtonDisabled, setPosButtonDisabled] = useState(false);
  const appendAtBatHistory = (processTeam, ABResult) => {
    setAtBatHistory((atBatHistory) => [
      ...atBatHistory,
      {
        processTeam,
        ABResult,
      },
    ]);
  };

  const totalHits = parseAdd(
    parseAdd(parseAdd(LSSingles, LSHomeRuns), LSTriples),
    LSDoubles
  );
  const careerLoss = parseInt(LSGameCount) - parseInt(totalHits);
  const careerWinLoss = totalHits + "-" + careerLoss;
  const careerPCT_WL = (parseInt(totalHits) / parseInt(LSGameCount))
    .toFixed(3)
    .replace(/^0+/, "");
  const careerAVG = (parseInt(totalHits) / parseInt(LSAtBats))
    .toFixed(3)
    .replace(/^0+/, "");
  const careerSLG = (
    (parseInt(LSHomeRuns) * 4 +
      parseInt(LSTriples) * 3 +
      parseInt(LSDoubles) * 2 +
      parseInt(LSSingles)) /
    parseInt(LSAtBats)
  )
    .toFixed(3)
    .replace(/^0+/, "");

  const seriesAtBats = LSAtBats - LSSnapAtBats;
  const seriesHomeRuns = LSHomeRuns - LSSnapHomeRuns;
  const seriesTriples = LSTriples - LSSnapTriples;
  const seriesDoubles = LSDoubles - LSSnapDoubles;
  const seriesSingles = LSSingles - LSSnapSingles;
  const seriesRBI = LSRBI - LSSnapRBI;
  const seriesGames = LSGameCount - LSSnapGameCount;

  const seriesHits = parseAdd(
    parseAdd(parseAdd(seriesSingles, seriesHomeRuns), seriesTriples),
    seriesDoubles
  );
  const seriesLoss = parseInt(seriesGames) - parseInt(seriesHits);
  const seriesWinLoss = seriesHits + "-" + seriesLoss;
  const seriesPCT_WL = (parseInt(seriesHits) / parseAdd(seriesHits, seriesLoss))
    .toFixed(3)
    .replace(/^0+/, "");
  const seriesAVG = (parseInt(seriesHits) / parseInt(seriesAtBats))
    .toFixed(3)
    .replace(/^0+/, "");
  const seriesSLG = (
    (parseInt(seriesHomeRuns) * 4 +
      parseInt(seriesTriples) * 3 +
      parseInt(seriesDoubles) * 2 +
      parseInt(seriesSingles)) /
    parseInt(seriesAtBats)
  )
    .toFixed(3)
    .replace(/^0+/, "");

  const openModal = () => {
    setIsModalOpen(true);
    if (mostRecentMondayWW != julianSeriesCompletedWW) {
      setLSGameCount(parseAdd(LSGameCount, 1));
    }
    if (game >= 9) {
      localStorage.setItem("julianSeriesCompletedWW", mostRecentMondayWW);
    }
  };

  const closeModal = () => {
    handleClickNext();
  };

  useEffect(() => {
    //* retrieve Local Storage Fields on Mount
    setLSLastGame(getLocalStorageItem("LastGame"));
    setLSMostRecentGameDate(getLocalStorageItem("MostRecentGameDate"));

    setLSGameCount(getLocalStorageItem("GameCount"));

    setLSHomeRuns(getLocalStorageItem("HomeRuns"));
    setLSTriples(getLocalStorageItem("Triples"));
    setLSDoubles(getLocalStorageItem("Doubles"));
    setLSSingles(getLocalStorageItem("Singles"));
    setLSAtBats(getLocalStorageItem("AtBats"));
    setLSRBI(getLocalStorageItem("RBI"));

    setLSStreakCurrent(getLocalStorageItem("StreakCurrent"));
    setLSStreakLongest(getLocalStorageItem("StreakLongest"));
    setLSStreakBreaker(getLocalStorageItem("StreakBreaker"));

    setLSLastGame(getLocalStorageItem("LastGame"));
    setLSGameCount(getLocalStorageItem("GameCount"));

    setLSSnapAtBats(localStorage.getItem("snapAtBats"));
    setLSSnapGameCount(localStorage.getItem("snapGame"));
    setLSSnapHomeRuns(localStorage.getItem("snapHomeRuns"));
    setLSSnapTriples(localStorage.getItem("snapTriples"));
    setLSSnapDoubles(localStorage.getItem("snapDoubles"));
    setLSSnapSingles(localStorage.getItem("snapSingles"));
    setLSSnapRBI(localStorage.getItem("snapRBI"));
  }, []);

  function getHitType() {
    let rando = randomNum(0, 99);

    setLSStreakCurrent((prevVal) => parseInt(prevVal, 10) + 1);
    switch (atBatHistory.length) {
      case 0:
        setLSHomeRuns((prevVal) => parseInt(prevVal, 10) + 1);
        switch (true) {
          case rando > 97:
            setLSRBI((prevVal) => parseInt(prevVal, 10) + 4);
            return "GRAND SLAM!!";
          case rando > 87:
            setLSRBI((prevVal) => parseInt(prevVal, 10) + 3);
            return "3 Run HOMER";
          case rando > 58:
            setLSRBI((prevVal) => parseInt(prevVal, 10) + 2);
            return "2 Run HOMER";
          default:
            setLSRBI((prevVal) => parseInt(prevVal, 10) + 1);
            return "Solo HOME RUN";
        }
      case 1:
        setLSDoubles((prevVal) => parseInt(prevVal, 10) + 1);
        switch (true) {
          case rando > 98:
            setLSRBI((prevVal) => parseInt(prevVal, 10) + 3);
            return "Double, 3 RBI";
          case rando > 87:
            setLSRBI((prevVal) => parseInt(prevVal, 10) + 2);
            return "Double, 2 RBI";
          case rando > 63:
            setLSRBI((prevVal) => parseInt(prevVal, 10) + 1);
            return "Double, RBI";
          default:
            return "Double";
        }
      case 2:
        setLSSingles((prevVal) => parseInt(prevVal, 10) + 1);
        switch (true) {
          case rando > 95:
            setLSRBI((prevVal) => parseInt(prevVal, 10) + 2);
            return "Single, 2 RBI";
          case rando > 78:
            setLSRBI((prevVal) => parseInt(prevVal, 10) + 1);
            return "Single, RBI";
          default:
            return "Single";
        }
      case 3:
        setLSSingles((prevVal) => parseInt(prevVal, 10) + 1);
        switch (true) {
          case rando > 99:
            setLSRBI((prevVal) => parseInt(prevVal, 10) + 1);
            return "Single rbi";
          case rando > 0:
            return "Infield Single";
          default:
            return "Single";
        }
      default:
        setLSSingles((prevVal) => parseInt(prevVal, 10) + 1);
        return "single";
    }
  }

  function handleClickNext() {
    if (julianSeriesCompletedWW == mostRecentMondayWW) {
      if (isModalOpen) {
        alertCountDown(julianNextSeries);
      } else {
        openModal();
      }
    } else {
      setLSLastGame(localStorage.getItem("LastGame"));
      setGame(localStorage.getItem("LastGame"));
      if (game >= gameTotal) {
        setGame((prevGame) => (prevGame % gameTotal) + 1);
        window.location.href = window.location.href;
      }
      setGame((prevGame) => (prevGame % gameTotal) + 1);
      setIsModalOpen(false);
    }
  }

  useEffect(() => {
    if (atBatHistory.length < 1) {
      setButtonHelpClass("buttonHelp");
    } else {
      setButtonHelpClass("buttonNone");
      if (atBatHistory.length > 4) {
        if (!isModalOpen) {
          if (LSStreakCurrent >= LSStreakLongest) {
            // const winningTeam = targetTeam.find(team => team !== "na"); // Finds the first value that is not "na"

            let winningTeam =
              Number(getVennGameFromGIT(game, dataGames_24).AwayRunsScored) <=
              Number(getVennGameFromGIT(game, dataGames_24).HomeRunsScored)
                ? getVennGameFromGIT(game, dataGames_24).HomeTeam
                : getVennGameFromGIT(game, dataGames_24).AwayTeam;

            let headSabr = getVennGameFromGIT(game, dataGames_24).HeadLine;
            let index = headSabr ? headSabr.lastIndexOf(":") : -1;
            let gameYear =
              index !== -1 ? headSabr.substring(index - 4, index) : "";

            const streakBreaker = gameYear + " " + winningTeam;

            setLSStreakBreaker(streakBreaker);
          }
          setLSStreakCurrent(0);
          openModal();
        }
      }
    }
  }, [atBatHistory]);

  useEffect(() => {
    if (LSStreakBreaker != "none") {
      if (LSStreakCurrent > LSStreakLongest) {
        localStorage.setItem("StreakBreaker", LSStreakBreaker);
        localStorage.setItem("StreakLongest", LSStreakLongest);
      }
    }
  }, [LSStreakBreaker]);

  useEffect(() => {
    if (LSStreakCurrent > LSStreakLongest) {
      setLSStreakLongest(LSStreakCurrent);
    }
  }, [LSStreakCurrent]);

  useEffect(() => {
    const tempArray = Array(11).fill("td-posUnSelected");
    setAwaytdClass([...tempArray]);
    setHometdClass([...tempArray]);

    setPosButtonDisabled(false);
    setAtBatHistory([]);
    setGameResult("There is no Joy in Mudville");
    setShowHideGameDetailsDiv("Hide ");
    setDivBlockNone("divDisplayBlock");

    setLineupColorAway("white");
    setLineupColorHome("white");
    setLineupHeaderAway("AWAY");
    setLineupHeaderHome("HOME");

    if (game == 0) {
      setStartButtonLabel("START");
      setNextGameButton("starting9Start");
    } else if (game == 1) {
      //  if (seriesName != LSMostRecentGameDate ) {}
      setLSSnapHomeRuns(LSHomeRuns);
      setLSSnapTriples(LSTriples);
      setLSSnapDoubles(LSDoubles);
      setLSSnapSingles(LSSingles);
      setLSSnapAtBats(LSAtBats);
      setLSSnapRBI(LSRBI);
      setLSSnapGameCount(LSGameCount);

      localStorage.setItem("snapGame", LSGameCount);
      localStorage.setItem("snapHomeRuns", LSHomeRuns);
      localStorage.setItem("snapTriples", LSTriples);
      localStorage.setItem("snapDoubles", LSDoubles);
      localStorage.setItem("snapSingles", LSSingles);
      localStorage.setItem("snapAtBats", LSAtBats);
      localStorage.setItem("snapRBI", LSRBI);
      // }
    } else {
      setLSSnapAtBats(localStorage.getItem("snapAtBats"));
      setLSSnapGameCount(localStorage.getItem("snapGame"));
      setLSSnapHomeRuns(localStorage.getItem("snapHomeRuns"));
      setLSSnapTriples(localStorage.getItem("snapTriples"));
      setLSSnapDoubles(localStorage.getItem("snapDoubles"));
      setLSSnapSingles(localStorage.getItem("snapSingles"));
      setLSSnapRBI(localStorage.getItem("snapRBI"));

      setStartButtonLabel("Game");
      setNextGameButton("starting9Title");
    }

    console.log("UE game:  ", { dataGames_24 });
  }, [game]);

  useEffect(() => {
    if (game !== null && game > 0) {
      const gameData = getVennGameFromGIT(game, dataGames_24);
      const { HomeRunsScored, AwayRunsScored, HomeTeam, AwayTeam } = gameData;
      let awayTeamData = null;
      let homeTeamData = null;

      const fetchData = async () => {
        try {
          let awayTeamData = await getTeamData(game, dataGames_24, "AWAY");
          let homeTeamData = await getTeamData(game, dataGames_24, "HOME");

          if (Number(AwayRunsScored) <= Number(HomeRunsScored)) {
            setTargetTeam([HomeTeam, homeTeamData.team_2, homeTeamData.team_3]);
            setLosingTeamHomeAway("AWAY");
            setLosingTeam([
              awayTeamData.nickname,
              AwayTeam,
              awayTeamData.team_2,
              awayTeamData.team_3,
            ]);
          } else {
            setTargetTeam([AwayTeam, awayTeamData.team_2, awayTeamData.team_3]);
            setLosingTeamHomeAway("HOME");
            setLosingTeam([
              homeTeamData.nickname,
              HomeTeam,
              homeTeamData.team_2,
              homeTeamData.team_3,
            ]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [game, dataGames_24, setLosingTeamHomeAway, setTargetTeam, setLosingTeam]);

  useEffect(() => {
    const result = getVennGameFromGIT(game, dataGames_24);
    if (result) {
      setSeriesName(result.Series);
    } else {
      console.warn("Series not found for the given game.");
    }
  }, [game, dataGames_24]);

  useEffect(() => {
    setAwaytdClass(
      updateClass(
        Array.from(awaytdClass),
        "A",
        processPosition,
        game,
        dataGames_24
      )
    );
    setHometdClass(
      updateClass(
        Array.from(hometdClass),
        "H",
        processPosition,
        game,
        dataGames_24
      )
    );

    if (processPosition !== "") {
      setPosButtonDisabled(true);
    }
  }, [processPosition, dataGames_24]);

  useEffect(() => {
    if (isModalOpen) {
      localStorage.setItem("LastGame", game);
      localStorage.setItem("MostRecentGameDate", seriesName);

      localStorage.setItem("AtBats", LSAtBats);
      localStorage.setItem("Singles", LSSingles);
      localStorage.setItem("Doubles", LSDoubles);
      localStorage.setItem("Triples", LSTriples);
      localStorage.setItem("HomeRuns", LSHomeRuns);
      localStorage.setItem("RBI", LSRBI);
      localStorage.setItem("GameCount", LSGameCount);
      localStorage.setItem("StreakCurrent", LSStreakCurrent);
      localStorage.setItem("StreakLongest", LSStreakLongest.toString());
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (processTeam != null && processTeam != "") {
      if (targetTeam.includes(processTeam)) {
        setLSAtBats((prevVal) => parseInt(prevVal, 10) + 1);
        appendAtBatHistory(processTeam, getHitType());
        setGameResult("Mudville Wins!");

        openModal();
      } else {
        if (losingTeam.includes(processTeam)) {
          if (LosingTeamHomeAway == "AWAY") {
            setLineupColorAway("red");
            setLineupHeaderAway(losingTeam[0]);
          } else {
            setLineupColorHome("red");
            setLineupHeaderHome(losingTeam[0]);
          }
        }

        setPosButtonDisabled(false);
        switch (atBatHistory.length) {
          case 0:
            appendAtBatHistory(processTeam, "Strike 1");
            break;
          case 1:
            appendAtBatHistory(processTeam, "Strike 2");
            break;
          case 2:
            setLSAtBats((prevVal) => parseInt(prevVal, 10) + 1);
            appendAtBatHistory(processTeam, "Strike Out, 1 Out");
            break;
          case 3:
            setLSAtBats((prevVal) => parseInt(prevVal, 10) + 1);
            appendAtBatHistory(processTeam, getOutType() + ", 2 Outs");
            break;
          default:
            setLSAtBats((prevVal) => parseInt(prevVal, 10) + 1);
            appendAtBatHistory(processTeam, getOutType());
        }
      }
    } else {
      setPosButtonDisabled(false);
    }
  }, [processTeam]);

  function SelectButton({ isDisabled, value, onSelectClick }) {
    return (
      <button
        disabled={isDisabled}
        onClick={onSelectClick}
        style={{
          backgroundColor: isDisabled ? "initial" : "green",
          color: "white",
        }}
      >
        {value}
      </button>
    );
  }

  function handleTeamSelection(selectedValue) {
    setSelectedTeam(selectedValue);
  }
  function handlePositionSelection(selectedValue) {
    setProcessPosition(selectedValue);
  }
  function processTeamSelection() {
    setProcessTeam(selectedTeam);
  }

  function copyText() {
    const contestWon = "⚾";
    const contestLoss = "⬜";

    const share_WL_line = "Series W-L: " + seriesHits + "-" + seriesLoss;
    const share_HR = "HR:" + contestWon.repeat(seriesHomeRuns);

    const share_career = "Career: " + careerWinLoss + " HR:" + LSHomeRuns;

    const line = share_WL_line + share_HR;

    const shareLink = `https://starting9.vercel.app/`;
    const text =
      "My starting9 Stats: \n \n" +
      share_WL_line +
      " \n \n" +
      share_HR +
      " \n \n" +
      share_career +
      " \n \n" +
      "Play Starting9 here -->  \n \n" +
      shareLink;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Stats Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  }

  function ShareButton({}) {
    return (
      <button class="buttonHelp" onClick={() => copyText()}>
        Share
      </button>
    );
  }

  function StatDiv() {
    return (
      <div>
        <table>
          <tr>
            <td class="td-statHeader">
              Tell your Statistics to Shut Up! {"  "}
              {julianSeriesCompletedWW == mostRecentMondayWW && <ShareButton />}
            </td>
          </tr>
        </table>
        <table class="statTable td-statBox  alignRight">
          <tr>
            <td> W-L </td> <td> PCT </td> <td> AB </td> <td> H </td>{" "}
            <td> 2b </td>
            <td> 3b </td> <td> HR </td> <td> RBI </td> <td> AVG </td>{" "}
            <td> SLG </td>
          </tr>
          <tr>
            <td>{careerWinLoss}</td>
            <td>{careerPCT_WL}</td>
            <td>{LSAtBats}</td>
            <td>{totalHits}</td>
            <td>{LSDoubles}</td>
            <td>{LSTriples}</td>
            <td>{LSHomeRuns}</td>
            <td>{LSRBI}</td>
            <td>{careerAVG}</td>
            <td>{careerSLG}</td>
          </tr>
          <tr>
            <td>{seriesWinLoss}</td>
            <td>{seriesPCT_WL}</td>
            <td>{seriesAtBats}</td>
            <td>{seriesHits}</td>
            <td>{seriesDoubles}</td>
            <td>{seriesTriples}</td>
            <td>{seriesHomeRuns}</td>
            <td>{seriesRBI}</td>
            <td>{seriesAVG}</td>
            <td>{seriesSLG}</td>
          </tr>

          <tr></tr>

          <StreakStats
            streakCurrent={LSStreakCurrent}
            streakLongest={LSStreakLongest}
            streakBreaker={LSStreakBreaker}
          />
        </table>
        <table class="statTable td-statBox  alignRight">
          <tr>
            <td> ###prevMON {mostRecentMondayWW} </td>
            <td> #lastComp {julianSeriesCompletedWW} </td>
            <td> #game {game} </td>
          </tr>
        </table>
        Series: {seriesName}
        <p></p>
        {displayTestData}
      </div>
    );
  }

  function toggleGameDetailsDiv() {
    if (divBlockNone != "divDisplayNone") {
      setShowHideGameDetailsDiv("Show ");
      setDivBlockNone("divDisplayNone");
    } else {
      setShowHideGameDetailsDiv("Hide ");
      setDivBlockNone("divDisplayBlock");
    }
  }

  return (
    <div>
      <h2 className="starting9Title">
        <span className="starting9Label">
          <i>Starting 9</i> &emsp;&emsp;
        </span>
        <button className={nextGameButton} onClick={handleClickNext}>
          {startButtonLabel} {game !== 0 ? game : null}
        </button>
        &emsp; {seriesNameShort}
        <button className={buttonHelpClass} onClick={handleClickHelp}>
          {game !== 0 ? "About" : null}
        </button>
      </h2>

      <div>
        <SplashDiv game={game} />
      </div>

      <div>
        <LineupTable
          game={game}
          dataGames_24={dataGames_24}
          lineupHeaderAway={lineupHeaderAway}
          lineupHeaderHome={lineupHeaderHome}
          awaytdClass={awaytdClass}
          hometdClass={hometdClass}
          lineupColorAway={lineupColorAway}
          lineupColorHome={lineupColorHome}
        />
      </div>

      {!(game == null || game == 0) && (
        <div>
          Position{" "}
          <Dropdown
            options={dataPos}
            onSelectionChange={handlePositionSelection}
            isDisabled={posButtonDisabled}
          />
          <div>
            {" "}
            Team:{" "}
            <Dropdown
              options={teamNames}
              onSelectionChange={handleTeamSelection}
              isDisabled={!posButtonDisabled}
            />
          </div>
          <div id="dropdownIn">
            <SelectButton
              isDisabled={!posButtonDisabled}
              value={"Select"}
              onSelectClick={() => processTeamSelection()}
            />
          </div>
          <p></p>
          <AtBatHistoryDiv game={game} atBatHistory={atBatHistory} />
        </div>
      )}

      <p></p>
      <p></p>

      <StatDiv />

      <h2 class="starting9Title ">
        <b>
          <i> Starting 9 </i>
        </b>
      </h2>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div class="modalHeight">
          <h2 class="starting9Title">
            <b>
              <i> Starting 9 </i>{" "}
            </b>{" "}
            &emsp;&emsp;
            <button class="starting9Title" onClick={closeModal}>
              Next Game
            </button>
          </h2>

          <div>
            {atBatHistory.length > 0 && (
              <div>
                <h3 class="modalHit">
                  <div class="seriesLine">
                    {" "}
                    Series {seriesName}: Game {game}{" "}
                  </div>
                  <p> {atBatHistory[atBatHistory.length - 1].ABResult} </p>
                  <p>{gameResult}</p>
                </h3>
              </div>
            )}
          </div>
          {game >= 1 && (
            <div class={divBlockNone}>
              <BoxRHE game={game} dataGames_24={dataGames_24} />
              <p> </p>
              <AtBatHistoryDiv game={game} atBatHistory={atBatHistory} />
            </div>
          )}
          <div>
            <StatDiv />
          </div>
        </div>
        <div>
          *** Try our Wine Tasting Game{" "}
          <a
            href="https://sofasomm.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            SofaSomm{" "}
          </a>{" "}
          ***
        </div>
        <div>
          <p> </p>⚾ To see Starting9 in Action <p> </p>Check out Our Friends{" "}
          <a
            href="https://www.twitch.tv/twostrikenoise"
            target="_blank"
            rel="noreferrer"
          >
            Two Strike Noise{" "}
          </a>{" "}
          ⚾
        </div>
        <h2 class="starting9Title ">
          <b>
            <i> Starting 9 </i>
          </b>
        </h2>
      </Modal>
    </div>
  );
}
