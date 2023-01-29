import chalk from "chalk";
const rolls = {
  CHECK: "CHECK",
  SAVE: "SAVE",
  DAMAGE: "DAMAGE",
  TO_HIT: "TO HIT",
  INITIATIVE: "INITIATIVE",
};
const rollTypes = {
  ADVANTAGE: "ADV",
  NORMAL: "NORMAL",
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

/**
 * Simulates a DnD 5e roll. The simulated outputs are formatted and colored based on the specified arguments.
 * 
 * Valid cases:
 * 
 * CHECK - ADV, NORMAL, DIS (WITH BONUS)
 * 
 * SAVE - ADV, NORMAL, DIS (WITH MOD AND BONUS)
 * 
 * DAMAGE - CRIT or FLAT ROLL (WITH ABILITY)
 * 
 * TO HIT- ADV, NORMAL, DIS (WITH ABILITY)
 * 
 * INITIATIVE - ADV, NORMAL, DIS (WITH BONUS)
 * 
 * 
 * @param {*} amount number of dice to roll
 * @param {*} die the type of die to roll with (d4-d20)
 * @param {*} bonus added bonus based on proficiency
 * @param {*} ability spell/attack to use
 * @param {*} mod modifier to use in saves
 * @param {*} skill skills to use for checks
 * @param {*} roll which roll to simulate
 * @param {*} type which roll type to use
 * @returns undefined if input is invalid
 */
function roll(amount = 1, die, bonus = null, ability = null, mod = null, skill = null, roll = rolls.CHECK, type = rollTypes.NORMAL) {
  // only accept integers and strings
  if (
    !Number.isInteger(die) ||
    !Number.isInteger(amount) ||
    (!Number.isInteger(bonus) && bonus !== null)
  ) {
    console.error("Invalid integer input");
    return undefined;
  }
  if (typeof type !== "string" || typeof roll !== "string" || (typeof skill !== "string" && skill !== null) || (typeof mod !== "string" && mod !== null) || (typeof ability !== "string" && ability !== null)) {
    console.error("Invalid string input");
    return undefined;
  }

  // invalid input for spells/attacks
  /* 
  Valid cases
  
  
  
  
  
  */
  // if (ability !== null && !((type === rollTypes.FLAT_ROLL || type === rollTypes.CRIT) && (roll === rolls.DAMAGE || roll === rolls.TO_HIT))) {
  //   console.error(`Spells/Attacks need to be rolled with roll types ${rollTypes.FLAT_ROLL} or ${rollTypes.CRIT} using ${rolls.TO_HIT} or ${rolls.DAMAGE}`);
  //   return undefined;
  // }

  

  function checkValidRoll(amount, die, bonus, ability, mod, skill, roll, type) {
    // CHECK - ADV, NORMAL, DIS (WITH SKILL AND WITH BONUS)
    if (!(ability === null && mod === null && skill !== null && (type === rollTypes.ADVANTAGE || type === rollTypes.NORMAL || type === rollTypes.DISADVANTAGE) && roll === rolls.CHECK)) {
      console.error(`Invalid input - a ${roll} roll must only have a skill specified, and only use the roll types ${rollTypes.ADVANTAGE}, ${rollTypes.NORMAL} and ${rollTypes.DISADVANTAGE}`);
      return false;
    }
    // SAVE - ADV, NORMAL, DIS (WITH MOD AND BONUS)
    else if (!(ability === null && mod !== null && skill === null && (type === rollTypes.ADVANTAGE || type === rollTypes.NORMAL || type === rollTypes.DISADVANTAGE) && roll === rolls.SAVE)) {
      console.error(`Invalid input - a ${roll} roll must only have a modifier specified, and only use the roll types ${rollTypes.ADVANTAGE}, ${rollTypes.NORMAL} and ${rollTypes.DISADVANTAGE}`);
      return false;
    } 
    // DAMAGE - CRIT or FLAT ROLL (WITH ABILITY)
    else if (!(ability !== null && mod === null && skill === null && (type === rollTypes.CRIT || type === rollTypes.FLAT_ROLL) && roll === rolls.DAMAGE)) {
      console.error(`Invalid input - a ${roll} must only have an ability specified, and only use the roll types ${rollTypes.CRIT} and ${rollTypes.FLAT_ROLL}`);
      return false;
    } 
    // TO HIT - ADV, NORMAL, DIS (WITH ABILITY)
    else if (!(ability !== null && mod === null && skill === null && (type === rollTypes.ADVANTAGE || type === rollTypes.NORMAL || type === rollTypes.DISADVANTAGE) && roll === rolls.TO_HIT)) {
      console.error(`Invalid input - a ${roll} must only have an ability specified, and only use the roll types ${rollTypes.ADVANTAGE}, ${rollTypes.NORMAL} and ${rollTypes.DISADVANTAGE}`);
      return false;
    } 
    // INITIATIVE - ADV, NORMAL, DIS (WITH BONUS)
    else if (!(ability === null && mod === null && skill === null && (type === rollTypes.ADVANTAGE || type === rollTypes.NORMAL || type === rollTypes.DISADVANTAGE) && roll === rolls.INITIATIVE)) {
      console.error(`Invalid input - a ${roll} must have no extra arguments specified, and only use the roll types ${rollTypes.ADVANTAGE}, ${rollTypes.NORMAL} and ${rollTypes.DISADVANTAGE}`);
      return false;
    }
    return true;
    // console.error(`An ${roll} roll should not have an ability specified and can only be used with the roll types ${rollTypes.ADVANTAGE}, ${rollTypes.NORMAL} and ${rollTypes.DISADVANTAGE}`);
    // return undefined;
  }
  
  if (!checkValidRoll(amount, die, bonus, ability, mod, skill, roll, type)) {
    return undefined;
  }
  console.log("ability:",ability) 
  console.log("mod:",mod) 
  console.log("skill:",skill) 
  console.log("roll:",roll) 
  console.log("type:",type) 
  console.log("----------")
  // round arguments
  amount = Math.round(amount);
  die = Math.round(die);

  // limit die value between 4-20 and amount value between 1-100
  die = (die > 20 ? 20 : die) || (die < 4 ? 4 : die);
  amount = (amount > 100 ? 100 : amount) || (amount < 1 ? 1 : amount);

  // check for ADVANTAGE, DISADVANTAGE, CRIT or FLAT ROLL
  
  if (type === rollTypes.ADVANTAGE || type === rollTypes.DISADVANTAGE) {
    amount = 2;
    if (type === rollTypes.ADVANTAGE) {
      console.log(`Rolling with ${chalk.green("+" + type)}`);
    } else if (type === rollTypes.DISADVANTAGE) {
      console.log(`Rolling with ${chalk.red("-" + type)}`);
    }
  } else if (type === rollTypes.CRIT) {
    amount *= 2;
    console.log(`Rolling with ${chalk.blue(type)}`);
  } else if (type === rollTypes.FLAT_ROLL) {
    amount = 1;
    console.log(`Rolling with ${chalk.whiteBright(type)}`);
  } else {
    console.log(`Rolling with ${chalk.whiteBright(type)}`);
  }

  console.log(chalk.italic(`amount: ${amount}`));
  console.log(chalk.italic(`die: d${die}`));

  // push all rolls to total
  var total = [];
  const lowestDie = 4;
  for (let i = 0; i < amount; i++) {
    let roll = random(lowestDie, die);
    total.push(roll);
  }
  // if bonus is specified, round it, limit it and push it to total
  if (bonus !== null) {
    bonus = Math.round(bonus);
    bonus = (bonus > 20 ? 20 : bonus) || (bonus < 1 ? 1 : bonus);
    // do not include bonus for CRIT or FLAT ROLL
    if (type !== rollTypes.CRIT && type !== rollTypes.FLAT_ROLL) {
      console.log(chalk.italic(`bonus: ${bonus}`));
      total.push(bonus);
    }
  }

  console.log(chalk.gray("##############################"));
  // calculate sum, print out the calculation and roll format
  var rollColor = ``;

  if (roll === rolls.CHECK) {
    rollColor = `${chalk.magenta(roll)}`;
  } 
  else if (roll === rolls.SAVE) {
    rollColor = `${chalk.green(roll)}`;
  }
  else if (roll === rolls.DAMAGE) {
    rollColor = `${chalk.whiteBright(ability.toUpperCase()+":")} ${chalk.red(roll)}`;
  }
  else if (roll === rolls.TO_HIT) {
    rollColor = `${chalk.whiteBright(ability.toUpperCase()+":")} ${chalk.blue(roll)}`;
  }
  else if (roll === rolls.INITIATIVE) {
    rollColor = `${chalk.whiteBright(roll + ":")} ${chalk.hex("#eba023").visible("ROLL")}`;
  }

  console.log(rollColor);

  var result;
  var toPrint = "";
  if (type === rollTypes.ADVANTAGE) {
    result = Math.max(total[0], total[1]);
    if (bonus !== null) {
      result += bonus;
      toPrint = `[${total[0]},${total[1]}] + ${bonus}`;
      console.log(chalk.whiteBright(toPrint + ` = ${chalk.bold(result)}`));
      console.log(chalk.gray(`${amount}d${die}kh1+${bonus}`));
    } else {
      toPrint = `[${total[0]},${total[1]}]`;
      console.log(chalk.whiteBright(toPrint + ` = ${chalk.bold(result)}`));
      console.log(chalk.gray(`${amount}d${die}kh1`));
    }
  } else if (type === rollTypes.DISADVANTAGE) {
    result = Math.min(total[0], total[1]);
    if (bonus !== null) {
      result += bonus;
      toPrint = `[${total[0]},${total[1]}] + ${bonus}`;
      console.log(chalk.whiteBright(toPrint + ` = ${chalk.bold(result)}`));
      console.log(chalk.gray(`${amount}d${die}kl1+${bonus}`));
    } else {
      toPrint = `[${total[0]},${total[1]}]`;
      console.log(chalk.whiteBright(toPrint + ` = ${chalk.bold(result)}`));
      console.log(chalk.gray(`${amount}d${die}kl1`));
    }
  } else if (type === rollTypes.CRIT || type === rollTypes.FLAT_ROLL) {
    result = total.reduce((a, b) => a + b, 0);
    total.forEach((x) => (toPrint += x + " + "));
    toPrint = toPrint.substring(0, toPrint.length - 2);
    console.log(chalk.whiteBright(toPrint + `= ${chalk.bold(result)}`));
    console.log(chalk.gray(`${amount}d${die}`));
  } else if (type === rollTypes.NORMAL) {
    result = total.reduce((a, b) => a + b, 0);
    total.forEach((x) => (toPrint += x + " + "));
    toPrint = toPrint.substring(0, toPrint.length - 2);
    console.log(chalk.whiteBright(toPrint + `= ${chalk.bold(result)}`));
    if (bonus !== null) {
      console.log(chalk.gray(`${amount}d${die}+${bonus}`));
    } else {
      console.log(chalk.gray(`${amount}d${die}`));
    }
  }

  console.log(chalk.gray("##############################"));
}

roll(1, 20, 3, "Eldritch Blast", modifiers.CHA, skills.ACROBATICS, rolls.TO_HIT, rollTypes.ADVANTAGE);
