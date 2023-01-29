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

/*
 * kh - keep highest
 * kl - keep lowest
 * check, save (con, int), custom roll
 */
function roll(amount = 1, die, bonus = null, mod = null, skill = null, roll = rolls.CHECK, type = rollTypes.NORMAL) {
  // only accept integers and strings
  if (
    !Number.isInteger(die) ||
    !Number.isInteger(amount) ||
    (!Number.isInteger(bonus) && bonus !== null)
  ) {
    console.error("Invalid integer input");
    return undefined;
  }
  if (typeof type !== "string" || typeof roll !== "string" || (typeof skill !== "string" && skill !== null) || (typeof mod !== "string" && mod !== null)) {
    console.error("Invalid string input");
    return undefined;
  }

  // trim input strings
  type = type.trim();
  roll = roll.trim();
  mod = mod.trim();
  // round arguments
  amount = Math.round(amount);
  die = Math.round(die);

  // limit die value between 1-20 and amount value between 1-100
  die = (die > 20 ? 20 : die) || (die < 1 ? 1 : die);
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
  for (let i = 0; i < amount; i++) {
    let roll = random(1, die);
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
    var ability = ``;
    rollColor = `${chalk.whiteBright(ability+":")} ${chalk.red(roll)}`;
  }
  else if (roll === rolls.TO_HIT) {
    var ability = ``;
    rollColor = `${chalk.whiteBright(ability+":")} ${chalk.blue(roll)}`;
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

roll(1, 20, 3, modifiers.CHA, skills.ACROBATICS, rolls.DAMAGE, rollTypes.ADVANTAGE);
