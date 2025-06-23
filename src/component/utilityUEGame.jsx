import React from 'react';
import {getVennGame, getVennGameFromGIT} from "./dataGames";
import {getMostRecentMonday} from "./utility";

const fetchTeamData = async (teamName) => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/paulember/paulember.github.io/main/src/data/teams.json');
                                  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const teamsData = await response.json();  
    const team = teamsData.find(searchData => searchData.team === teamName);
    return team || {}; 
  } catch (error) {
    console.error('Error fetching data:', error);
    return {};
  }
};

async function getTeamData (game, dataGames_24, teamType) {
  let teamData;
  if (teamType == 'AWAY') {
    teamData = await fetchTeamData(getVennGameFromGIT(game,dataGames_24).AwayTeam);
  } else {
    teamData = await fetchTeamData(getVennGameFromGIT(game,dataGames_24).HomeTeam);
  }
  console.log("UE Game A teamData: ", teamData, "::Game: ", game, "::teamType:", teamType);
  return (teamData)

};

export {getTeamData};
