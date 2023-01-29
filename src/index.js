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
  STRENGTH: "STR",
  DEXTERITY: "DEX",
  CONSTITUTION: "COM",
  INTELLIGENCE: "INT",
  WISDOM: "WIS",
  CHARISMA: "CHA",
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
function roll(
  amount = 1,
  die,
  bonus = null,
  ability = null,
  mod = null,
  skill = null,
  roll = null,
  type = null
) {
  // only accept integers and strings
  checkValidInputTypes();

  function checkValidInputTypes() {
    if (
      !Number.isInteger(die) ||
      !Number.isInteger(amount) ||
      (!Number.isInteger(bonus) && bonus !== null)
    ) {
      console.error("Invalid integer input");
      return undefined;
    }
    if (
      (typeof ability !== "string" && ability !== null) ||
      (typeof mod !== "string" && mod !== null) ||
      (typeof skill !== "string" && skill !== null) ||
      (typeof roll !== "string" && roll !== null) ||
      (typeof type !== "string" && type !== null)
    ) {
      console.error("Invalid string input");
      return undefined;
    }
  }
  function checkValidRoll() {
    if (roll === rolls.CHECK) {
      // CHECK - ADV, NORMAL, DIS (WITH SKILL AND WITH BONUS)
      if (
        ability === null &&
        mod === null &&
        skill !== null &&
        (type === rollTypes.ADVANTAGE ||
          type === rollTypes.NORMAL ||
          type === rollTypes.DISADVANTAGE)
      ) {
        return true;
      } else {
        console.error(
          `Invalid input - a ${roll} roll must only have a skill specified, and only use the roll types ${rollTypes.ADVANTAGE}, ${rollTypes.NORMAL} and ${rollTypes.DISADVANTAGE}`
        );
        return false;
      }
    } else if (roll === rolls.SAVE) {
      // SAVE - ADV, NORMAL, DIS (WITH MOD AND BONUS)
      if (
        ability === null &&
        mod !== null &&
        skill === null &&
        (type === rollTypes.ADVANTAGE ||
          type === rollTypes.NORMAL ||
          type === rollTypes.DISADVANTAGE)
      ) {
        return true;
      } else {
        console.error(
          `Invalid input - a ${roll} roll must only have a modifier specified, and only use the roll types ${rollTypes.ADVANTAGE}, ${rollTypes.NORMAL} and ${rollTypes.DISADVANTAGE}`
        );
        return false;
      }
    } else if (roll === rolls.DAMAGE) {
      // DAMAGE - CRIT or FLAT ROLL (WITH ABILITY)
      if (
        ability !== null &&
        mod === null &&
        skill === null &&
        (type === rollTypes.CRIT || type === rollTypes.FLAT_ROLL)
      ) {
        return true;
      } else {
        console.error(
          `Invalid input - a ${roll} must only have an ability specified, and only use the roll types ${rollTypes.CRIT} and ${rollTypes.FLAT_ROLL}`
        );
        return false;
      }
    } else if (roll === rolls.TO_HIT) {
      // TO HIT - ADV, NORMAL, DIS (WITH ABILITY)
      if (
        ability !== null &&
        mod === null &&
        skill === null &&
        (type === rollTypes.ADVANTAGE ||
          type === rollTypes.NORMAL ||
          type === rollTypes.DISADVANTAGE)
      ) {
        return true;
      } else {
        console.error(
          `Invalid input - a ${roll} must only have an ability specified, and only use the roll types ${rollTypes.ADVANTAGE}, ${rollTypes.NORMAL} and ${rollTypes.DISADVANTAGE}`
        );
        return false;
      }
    } else if (roll === rolls.INITIATIVE) {
      // INITIATIVE - ADV, NORMAL, DIS (WITH BONUS)
      if (
        ability === null &&
        mod === null &&
        skill === null &&
        (type === rollTypes.ADVANTAGE ||
          type === rollTypes.NORMAL ||
          type === rollTypes.DISADVANTAGE)
      ) {
        return true;
      } else {
        console.error(
          `Invalid input - a ${roll} must have no extra arguments specified, and only use the roll types ${rollTypes.ADVANTAGE}, ${rollTypes.NORMAL} and ${rollTypes.DISADVANTAGE}`
        );
        return false;
      }
    }
  }

  if (!checkValidRoll()) {
    return undefined;
  }
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
    rollColor = `${chalk.whiteBright(skill.toUpperCase() + ":")} ${chalk.magenta(roll)}`;
  } else if (roll === rolls.SAVE) {
    rollColor = `${chalk.whiteBright(mod.toUpperCase() + ":")} ${chalk.green(roll)}`;
  } else if (roll === rolls.DAMAGE) {
    rollColor = `${chalk.whiteBright(ability.toUpperCase() + ":")} ${chalk.red(
      roll
    )}`;
  } else if (roll === rolls.TO_HIT) {
    rollColor = `${chalk.whiteBright(ability.toUpperCase() + ":")} ${chalk.blue(
      roll
    )}`;
  } else if (roll === rolls.INITIATIVE) {
    rollColor = `${chalk.whiteBright(roll + ":")} ${chalk
      .hex("#eba023")
      .visible("ROLL")}`;
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

// change value for each property, either integer, string or null
const input = {
  amount: 1,
  die: 20,
  bonus: 3,
  ability: "asd",
  mod: modifiers.CHARISMA,
  skill: null,
  roll: rolls.SAVE,
  type: rollTypes.ADVANTAGE,
};

roll(
  input.amount,
  input.die,
  input.bonus,
  input.ability,
  input.mod,
  input.skill,
  input.roll,
  input.type
);
