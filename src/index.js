import chalk from 'chalk';
const rolls = {
  CHECK: "CHECK",
  SAVE: "SAVE",
  DAMAGE: "DAMAGE",
  TO_HIT: "TO HIT",
};
const rollTypes = {
  ADVANTAGE: "ADV",
  NORMAL: "NONE",
  DISADVANTAGE: "DIS",
  CRIT: "CRIT",
  FLAT_ROLL: "FLAT ROLL",
};

const modifiers = {
  STR: "Strength",
  DEX: "Dexterity",
  CON: "Constitution",
  INT: "Intelligence",
  WIS: "Wisdom",
  CHA: "Charisma",
};
const skills = {
  ACROBATICS: "Acrobatics",
  ANIMAL_HANDLING: "Animal Handling",
  ARCANA: "Arcana",
  ATHLETICS: "Athletics",
  DECEPTION: "Deception",
  HISTORY: "History",
  INSIGHT: "Insight",
  INTIMIDATION: "Intimidation",
  INVESTIGATION: "Investigation",
  MEDICINE: "Medicine",
  NATURE: "Nature",
  PERCEPTION: "Perception",
  PERFORMANCE: "Performance",
  PERSUASION: "Persuasion",
  RELIGION: "Religion",
  SLEIGHT_OF_HAND: "Sleight of Hand",
  STEALTH: "Stealth",
  SURVIVAL: "Survival",
};

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 * kh - keep highest
 * kl - keep lowest
 * check, save (con, int), custom roll
 */
function roll(amount = 1, die, bonus = null, type = "NONE") {
  // only accept integers
  if (
    !Number.isInteger(die) ||
    !Number.isInteger(amount) ||
    !Number.isInteger(bonus)
  ) {
    console.error("Invalid integer input");
    return undefined;
  }
  if (typeof type !== "string") {
    console.error("Invalid string input");
    return undefined;
  }
  type = type.trim();
  // round arguments
  amount = Math.round(amount);
  die = Math.round(die);

  // limit die value between 1-20 and amount value between 1-100
  die = (die > 20 ? 20 : die) || (die < 1 ? 1 : die);
  amount = (amount > 100 ? 100 : amount) || (amount < 1 ? 1 : amount);

  // check for ADVANTAGE, DISADVANTAGE, CRIT or FLAT ROLL
  console.log(`Rolling with ${type}`);
  if (type === "ADV" || type === "DIS") {
    amount = 2;
  } else if (type === "CRIT") {
    amount *= 2;
  } else if (type === "FLAT ROLL") {
    amount = 1;
  }
  console.log(`amount: ${amount}`);
  console.log(`die: d${die}`);
  // push all rolls to total
  var total = [];
  for (let i = 0; i < amount; i++) {
    let roll = random(1, die);
    total.push(roll);
  }
  // if bonus is specified, round it, limit it and push it to total
  if (bonus !== null) {
    bonus = Math.round(bonus);
    bonus = (bonus > 20 ? 20 : bonus) || (bonus < 1 ? 1 : bonus);
    // do not include bonus for CRIT or FLAT ROLL
    if (type !== "CRIT" && type !== "FLAT ROLL") {
      console.log(`bonus: ${bonus}`);
      total.push(bonus);
    }
  }
  console.log("##############################");
  // calculate sum, print out the calculation and roll format
  var result;
  var toPrint = "";
  if (type === "ADV") {
    result = Math.max(total[0], total[1]);
    if (bonus !== null) {
      result += bonus;
      toPrint = `[${total[0]},${total[1]}] + ${bonus}`;
      console.log(toPrint + ` = ${result}`);
      console.log(`${amount}d${die}kh1+${bonus}`);
    } else {
      toPrint = `[${total[0]},${total[1]}]`;
      console.log(toPrint + ` = ${result}`);
      console.log(`${amount}d${die}kh1`);
    }
  } else if (type === "DIS") {
    result = Math.min(total[0], total[1]);
    if (bonus !== null) {
      result += bonus;
      toPrint = `[${total[0]},${total[1]}] + ${bonus}`;
      console.log(toPrint + ` = ${result}`);
      console.log(`${amount}d${die}kh1+${bonus}`);
    } else {
      toPrint = `[${total[0]},${total[1]}]`;
      console.log(toPrint + ` = ${result}`);
      console.log(`${amount}d${die}kl1`);
    }
  } else if (type === "CRIT" || type === "FLAT ROLL") {
    result = total.reduce((a, b) => a + b, 0);
    total.forEach((x) => (toPrint += x + " + "));
    toPrint = toPrint.substring(0, toPrint.length - 2);
    console.log(toPrint + `= ${result}`);
    console.log(`${amount}d${die}`);
  } else if (type === "NONE") {
    result = total.reduce((a, b) => a + b, 0);
    total.forEach((x) => (toPrint += x + " + "));
    toPrint = toPrint.substring(0, toPrint.length - 2);
    console.log(toPrint + `= ${result}`);
    if (bonus !== null) {
      console.log(chalk.blue(`${amount}d${die}+${bonus}`));
    } else {
      console.log(`${amount}d${die}`);
    }
  }

  console.log("##############################");
}

roll(1, 20, 3, rollTypes.NONE);
