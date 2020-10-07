
import _ from "lodash";

export const dateFromObjectId = (objectId) => {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};

export const getJudged = (charinfo) => {
  var judged = 0;

  for (var opponent in charinfo) {
    if (charinfo[opponent] !== -100) {
      judged++;
    }
  }

  return judged;
}

export const formatName = (charname, db) => {
  for (var i = 0; i < db.length; i++) {
    if (db[i].id === charname) {
      return db[i].name;
    }
  }
};

export const charNameOrUniverse = (character, val) => {
  if (_.includes(character.opponent.toLowerCase(), val.toLowerCase())) {
    return true;
  }

  return false;
};

export const formatInfo = (charInfo, target) => {
  var charArr = [];

  for (var c in charInfo) {
    if (c !== target) {
      continue;
    }

    var characterObj = {
      id: c,
      judged: 0
    };

    for (var opponent in charInfo[c]) {
      if (charInfo[c][opponent] !== -100) {
        characterObj.judged++;
      }
    }

    if (characterObj.judged === 0) {
      continue;
    }

    charArr.push(characterObj);
  }

  return charArr;
}

export const judgeTier = (score) => {
  // tier thresholds
  var tierThresholds = [
    [
      'E', -0.3
    ],
    [
      'D', -0.1
    ],
    [
      'C', 0
    ],
    [
      'B', 0.2
    ],
    [
      'A', 0.4
    ],
    [
      'S', 0.6
    ]
  ];

  if (score >= tierThresholds[5][1]) {
    return {tier: 'S', desc: 'Highly Dangerous'}
  } else if (score >= tierThresholds[4][1]) {
    return {tier: 'A', desc: 'Dangerous'}
  } else if (score >= tierThresholds[3][1]) {
    return {tier: 'B', desc: 'Substantial'}
  } else if (score >= tierThresholds[2][1]) {
    return {tier: 'C', desc: 'Moderate'}
  } else if (score >= tierThresholds[1][1]) {
    return {tier: 'D', desc: 'Weak'}
  } else if (score >= tierThresholds[0][1]) {
    return {tier: 'E', desc: 'Relatively Harmless'}
  }
}

export const judgeRating = (difficulty) => {
  var tierThresholds = [
    [
      'E', -0.3
    ],
    [
      'D', -0.1
    ],
    [
      'C', 0
    ],
    [
      'B', 0.1
    ],
    [
      'A', 0.3
    ]
  ];

  if (difficulty <= -0.1) {
    return {status: 'LOSE', warning: false, error: true, positive: false}
  } else if (difficulty == '0.0') {
    return {status: 'N/A', warning: false, error: false, positive: false}
  } else if (difficulty > -0.1 && difficulty < 0.1) {
    return {status: 'EVEN', warning: true, error: false, positive: false}
  } else if (difficulty >= 0.1) {
    return {status: 'WIN', warning: false, error: false, positive: true}
  }
}

export const judgeColors = (rating) => {
  if (rating === -2) {
    return 'red';
  }

  if (rating === -1) {
    return 'yellow';
  }

  if (rating === 0) {
    return 'blue';
  }

  if (rating === 1) {
    return 'teal';
  }

  if (rating === 2) {
    return 'green';
  }

  return 'grey';
}

export const formatWeight = (rating) => {
  if (rating === 1) {
    return '+1';
  }

  if (rating === 2) {
    return '+2';
  }

  return rating;
}
