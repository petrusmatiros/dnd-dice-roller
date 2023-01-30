"use strict";

import chalk from "chalk";
const abilities = {
  NULL: null,
  MAGIC_MISSILE: "Magic Missile",
  CURE_WOUNDS: "Cure Wounds",
  DETECT_MAGIC: "Detect Magic",
  THUNDERWAVE: "Thunderwave",
  BURNING_HANDS: "Burning Hands",
  CHARM_PERSON: "Charm Person",
  FLY: "Fly",
  INVISIBILITY: "Invisibility",
  WATER_WALK: "Water Walk",
  LIGHT: "Light",
  PROTECTION_FROM_EVIL_AND_GOOD: "Protection from Evil and Good",
  SLEEP: "Sleep",
  WEB: "Web",
  FIREBALL: "Fireball",
  TELEPORT: "Teleport",
  RAISE_DEAD: "Raise Dead",
  WALL_OF_FORCE: "Wall of Force",
  DISINTEGRATE: "Disintegrate",
  ELDRITCH_BLAST: "Eldritch Blast",
  HEX: "Hex",
  DISGUISE_SELF: "Disguise Self",
  DECEITFUL_MAGIC: "Deceptive Magic",
  MYSTIC_ARCANA: "Mystic Arcanum",
  SHADOW_BOLT: "Shadow Bolt",
  UNDYING_WARD: "Undying Ward",
  MYSTIC_SHROUD: "Mystic Shroud",
  DARK_ONE_S_BLESSING: "Dark One's Blessing",
  HELLISH_REBUKE: "Hellish Rebuke",
  BLACK_BLADE: "Black Blade",
  DEVILS_SIGHT: "Devil's Sight",
  FLEE_THE_SCENE: "Flee the Scene",
  CURSE_OF_THE_OTHERWORLD: "Curse of the Otherworld",
  HEXING_BLADE: "Hexing Blade",
  PACT_OF_THE_BLADE: "Pact of the Blade",
  MYSTIC_CHAIN: "Mystic Chain",
  INFERNAL_TYRANT: "Infernal Tyrant",
  WARLOCK_S_CALL: "Warlock's Call",
  MYSTIC_GATES: "Mystic Gates",
  DARK_ONE_S_OWN_LUCK: "Dark One's Own Luck",
};

const rolls = {
  NULL: null,
  CHECK: "CHECK",
  SAVE: "SAVE",
  DAMAGE: "DAMAGE",
  TO_HIT: "TO HIT",
  INITIATIVE: "INITIATIVE",
};
const rollTypes = {
  NULL: null,
  ADVANTAGE: "ADV",
  NORMAL: "NORMAL",
  DISADVANTAGE: "DIS",
  CRIT: "CRIT",
  FLAT_ROLL: "FLAT ROLL",
};

const modifiers = {
  NULL: null,
  STRENGTH: "STR",
  DEXTERITY: "DEX",
  CONSTITUTION: "COM",
  INTELLIGENCE: "INT",
  WISDOM: "WIS",
  CHARISMA: "CHA",
};
const skills = {
  NULL: null,
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
 * @param {*} bonus added bonus based on proficiency (- or +)
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

  if (!checkValidRoll(ability, mod, skill, roll, type)) {
    return undefined;
  }
  // round arguments
  amount = Math.round(Math.abs(amount));
  die = Math.round(Math.abs(die));

  // limit die value between 4-20 and amount value between 1-100
  const minDie = 4;
  const maxDie = 20;
  const minAmount = 1;
  const maxAmount = 100;
  if (die > maxDie) {
    die = maxDie;
  } else if (die <= maxDie && die >= minDie) {
    die = die;
  } else if (die < minDie) {
    die = minDie;
  }
  const allowedDies = [4, 6, 8, 10, 12, 20];
  getNearestAllowedDie();
  function getNearestAllowedDie() {
    let randomNumber = Math.round(Math.random() * 20);
    let nearestAllowed = allowedDies.reduce((prev, curr) => {
      return Math.abs(curr - randomNumber) < Math.abs(prev - randomNumber)
        ? curr
        : prev;
    });
    die = nearestAllowed;
  }

  if (amount > maxAmount) {
    amount = maxAmount;
  } else if (amount < minAmount) {
    amount = minAmount;
  }

  // check for ADVANTAGE, DISADVANTAGE, CRIT or FLAT ROLL

  if (type === rollTypes.ADVANTAGE || type === rollTypes.DISADVANTAGE) {
    amount = 2;
    if (type === rollTypes.ADVANTAGE) {
      console.log(`Rolling with ${chalk.green("+" + type)}`);
    } else if (type === rollTypes.DISADVANTAGE) {
      console.log(`Rolling with ${chalk.red("-" + type)}`);
    }
  } else if (roll === rolls.INITIATIVE && type === rollTypes.NORMAL) {
    amount = 1;
  } else if (type === rollTypes.CRIT) {
    amount *= 2;
    console.log(`Rolling with ${chalk.blue(type)}`);
  } else if (type === rollTypes.FLAT_ROLL) {
    amount *= 1;
    console.log(`Rolling with ${chalk.whiteBright(type)}`);
  } else {
    console.log(`Rolling with ${chalk.whiteBright(type)}`);
  }

  console.log(chalk.italic(`amount: ${amount}`));
  console.log(chalk.italic(`die: d${die}`));

  // push all rolls to total
  var total = [];

  for (let i = 0; i < amount; i++) {
    let roll = random(minDie, die);
    total.push(roll);
  }
  const minBonus = 0;
  const maxBonus = 30;
  bonus = Math.round(bonus);
  if (bonus > maxBonus) {
    bonus = maxBonus;
  } else if (bonus == minBonus) {
    bonus = null;
  }
  // if bonus is specified, round it, limit it and push it to total
  if (bonus !== null) {
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
    rollColor = `${chalk.whiteBright(
      skill.toUpperCase() + ":"
    )} ${chalk.magenta(roll)}`;
  } else if (roll === rolls.SAVE) {
    rollColor = `${chalk.whiteBright(mod.toUpperCase() + ":")} ${chalk.green(
      roll
    )}`;
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
  var bonusSign = "+";
  if (bonus < minBonus) {
    bonusSign = "";
  }
  if (type === rollTypes.ADVANTAGE) {
    result = Math.max(total[0], total[1]);
    if (bonus !== null) {
      result += bonus;
      toPrint = `[${total[0]},${total[1]}] + ${bonus}`;
      console.log(chalk.whiteBright(toPrint + ` = ${chalk.bold(result)}`));
      console.log(chalk.gray(`${amount}d${die}kh1${bonusSign}${bonus}`));
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
      console.log(chalk.gray(`${amount}d${die}kl1${bonusSign}${bonus}`));
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
      console.log(chalk.gray(`${amount}d${die}${bonusSign}${bonus}`));
    } else {
      console.log(chalk.gray(`${amount}d${die}`));
    }
  }

  console.log(chalk.gray("##############################"));
}

function generateValidRandomInputs(amount = 1) {
  if (!Number.isInteger(amount)) {
    console.error("Invalid input");
    return undefined;
  }
  amount = Math.round(Math.abs(amount));
  var inputs = [];
  var valid = [];
  var minDie = 4;
  var maxDie = 20;
  var minAmount = 1;
  var maxAmount = 4;
  var minBonus = 0;
  var maxBonus = 5;
  var abilitiesArray = Object.values(abilities);
  var modifiersArray = Object.values(modifiers);
  var skillsArray = Object.values(skills);
  var rollsArray = Object.values(rolls);
  var rollTypesArray = Object.values(rollTypes);
  for (let i = 0; i < amount; i++) {
    let ability = [abilitiesArray[random(0, abilitiesArray.length - 1)], null];
    let modifier = [modifiersArray[random(0, modifiersArray.length - 1)], null];
    let skill = [skillsArray[random(0, skillsArray.length - 1)], null];
    let roll = [rollsArray[random(0, rollsArray.length - 1)], null];
    let rollType = [rollTypesArray[random(0, rollTypesArray.length - 1)], null];

    inputs.push({
      amount: random(minAmount, maxAmount),
      die: random(minDie, maxDie),
      bonus: random(minBonus, maxBonus),
      ability: ability[random(0, 1)],
      mod: modifier[random(0, 1)],
      skill: skill[random(0, 1)],
      roll: roll[random(0, 1)],
      type: rollType[random(0, 1)],
    });
  }
  for (let i = 0; i < inputs.length; i++) {
    if (
      checkValidRoll(
        inputs[i].ability,
        inputs[i].mod,
        inputs[i].skill,
        inputs[i].roll,
        inputs[i].type,
        false
      )
    ) {
      valid.push({
        amount: inputs[i].amount,
        die: inputs[i].die,
        bonus: inputs[i].bonus,
        ability: inputs[i].ability,
        mod: inputs[i].mod,
        skill: inputs[i].skill,
        roll: inputs[i].roll,
        type: inputs[i].type,
      });
    }
  }
  return valid;
}

function checkValidRoll(ability, mod, skill, roll, type, toPrint = true) {
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
      if (toPrint) {
        console.error(
          `Invalid input - a ${roll} roll must only have a skill specified, and only use the roll types ${rollTypes.ADVANTAGE}, ${rollTypes.NORMAL} and ${rollTypes.DISADVANTAGE}`
        );
      }
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
      if (toPrint) {
        console.error(
          `Invalid input - a ${roll} roll must only have a modifier specified, and only use the roll types ${rollTypes.ADVANTAGE}, ${rollTypes.NORMAL} and ${rollTypes.DISADVANTAGE}`
        );
      }
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
      if (toPrint) {
        console.error(
          `Invalid input - a ${roll} must only have an ability specified, and only use the roll types ${rollTypes.CRIT} and ${rollTypes.FLAT_ROLL}`
        );
      }
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
      if (toPrint) {
        console.error(
          `Invalid input - a ${roll} must only have an ability specified, and only use the roll types ${rollTypes.ADVANTAGE}, ${rollTypes.NORMAL} and ${rollTypes.DISADVANTAGE}`
        );
      }
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
      if (toPrint) {
        console.error(
          `Invalid input - a ${roll} must have no extra arguments specified, and only use the roll types ${rollTypes.ADVANTAGE}, ${rollTypes.NORMAL} and ${rollTypes.DISADVANTAGE}`
        );
      }
      return false;
    }
  }
}

function diceRoll(random = false) {
  if (random) {
    // Random rolls
    var inputs = generateValidRandomInputs(1000);
    console.log("\nGenerated rolls:", inputs.length);
    console.log("\n");

    for (let i = 0; i < inputs.length; i++) {
      console.log("Roll number:", i);
      console.log("-----------");
      roll(
        inputs[i].amount,
        inputs[i].die,
        inputs[i].bonus,
        inputs[i].ability,
        inputs[i].mod,
        inputs[i].skill,
        inputs[i].roll,
        inputs[i].type
      );
      console.log("---------------------------------------");
    }
  } else {
    // SINGLE ROLL
    // change value for each property, either integer, string or null

    const input = {
      amount: 4,
      die: 20,
      bonus: -1,
      ability: null,
      mod: null,
      skill: null,
      roll: rolls.INITIATIVE,
      type: rollTypes.DISADVANTAGE,
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
  }
}

diceRoll(false);
