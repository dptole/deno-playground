/*
  Namespaces & Getters/Setters
*/

// https://stackoverflow.com/a/61048983
async function prompt(question: string = "") {
  const buf = new Uint8Array(1024);
  await Deno.stdout.write(new TextEncoder().encode(question + " "));
  const n: number = <number> await Deno.stdin.read(buf);
  const answer = new TextDecoder().decode(buf.subarray(0, n));
  return answer.trim();
}

async function confirm(question: string = ""): Promise<boolean> {
  const answer = await prompt(question + " [y/s/ok]");
  return /^ *([ys]|ok) *$/i.test(answer);
}

async function choose(
  question: string = "",
  options: string[],
): Promise<string> {
  System.log(question);
  let selected: string | null = null;

  while (!options.includes(selected as string)) {
    if (selected !== null) {
      System.log("Wrong option!");
    }

    selected = await prompt(options.join(", ") + ":");
  }

  return selected as string;
}

namespace System {
  export function log(...args: any[]) {
    console.log(...args);
    sleep(0.12);
  }

  export function logBattleTurn(number: number) {
    log("Turn", number, "-".repeat(60 - number.toString().length + 1));
  }

  export function sleep(seconds: number) {
    const wakeMeUpAt = Date.now() + seconds * 1e3;
    while (Date.now() < wakeMeUpAt);
  }

  export namespace RNG {
    type Dice10 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

    export function isGood() {
      return Math.random() > 0.3;
    }

    export function choice(choices: any[]): any | undefined {
      return choices[choices.length * Math.random() >> 0];
    }

    export function stats() {
      return 2 + (Math.random() * 10 >> 0);
    }

    export function level(level?: number) {
      if (typeof level === "number" && level > 0) {
        return level;
      }

      return 5 + (Math.random() * 5 >> 0);
    }

    export function money() {
      return 5_000 + (Math.random() * 10_000 >> 0);
    }

    export function lif(level: number) {
      let lif = 15;

      for (let i = 0; i < level; i++) {
        lif += 3 + (Math.random() * 7);
      }

      return lif >> 0;
    }

    export function d10(): Dice10 {
      return ((Math.random() * 10) + 1) as Dice10;
    }

    export function range(number: number): number {
      return Math.random() * number >> 0;
    }
  }

  export namespace Audio {
    /*
      Multiple exports
    */
    export function newPlayer(playerName: string) {
      System.log(playerName, "started the journey!");
    }

    export function catchAttempt(playerName: string, pokemon: string) {
      System.log(playerName, "threw a pokeball at", pokemon + "!");
    }

    export function pokemonCaught(playerName: string, pokemon: string) {
      System.log("Bling...");
      System.sleep(1);
      System.log("Bling...");
      System.sleep(1);
      System.log("Bling!");
      System.sleep(1);
      System.log(playerName, "caught", pokemon + "!");
    }

    export function pokemonRanAway(pokemon: string) {
      System.log("Bling...");
      System.sleep(1);
      System.log("Bling...");
      System.sleep(1);
      System.log("Poof!");
      System.sleep(1);
      System.log(pokemon, "ran away!");
    }

    export function battleStarts() {
      System.log("~~~ Nana Nana Nana Nana na ~~~");
    }

    export function trainerSummonPokemon(trainer: Player, pokemon: Pokemon) {
      System.log(trainer.name, ":", pokemon.name, "I choose you!");
    }
  }

  export namespace Video {
    interface DrawingPlan {
      title: string;
      lines: string[];
    }

    enum TableEdgesEnum {
      LEFT,
      BOTH,
      RIGHT,
      NONE,
    }

    const paddingLeft = " ";
    const paddingRight = " ";

    function getTextMaxWidth(lines: string[]): number {
      return Math.max(
        ...lines.map((line) => (paddingLeft + line + paddingRight).length),
      );
    }

    function normalizeTextMaxWidth(textMaxWidth: number): number {
      return textMaxWidth < 0 ? 0 : textMaxWidth;
    }

    function planLine(
      textMaxWidth: number,
      line: string,
      edges: TableEdgesEnum = TableEdgesEnum.BOTH,
    ) {
      if (line === "-") {
        return planSeparator(textMaxWidth, edges);
      } else {
        const edgeLeft =
          (edges === TableEdgesEnum.BOTH || edges === TableEdgesEnum.LEFT
            ? "|"
            : "") + paddingLeft;
        const edgeRight = paddingRight +
          (edges === TableEdgesEnum.BOTH || edges === TableEdgesEnum.RIGHT
            ? "|"
            : "");
        return edgeLeft + line +
          " ".repeat(
            normalizeTextMaxWidth(
              textMaxWidth - line.length - paddingLeft.length -
                paddingRight.length,
            ),
          ) + edgeRight;
      }
    }

    function planSeparator(
      textMaxWidth: number,
      edges: TableEdgesEnum = TableEdgesEnum.BOTH,
    ) {
      const edgeLeft =
        edges === TableEdgesEnum.BOTH || edges === TableEdgesEnum.LEFT
          ? "+"
          : "";
      const edgeRight =
        edges === TableEdgesEnum.BOTH || edges === TableEdgesEnum.RIGHT
          ? "+"
          : "";

      return edgeLeft + "-".repeat(normalizeTextMaxWidth(textMaxWidth)) +
        edgeRight;
    }

    export function planTable(title: string, lines: string[]): string[] {
      lines = lines.length > 0 ? lines : ["Empty!"];
      lines.unshift("-");
      lines.unshift(title);
      const textMaxWidth = getTextMaxWidth(lines);
      const plans = [];

      plans.push(planSeparator(textMaxWidth));
      for (const line of lines) {
        plans.push(planLine(textMaxWidth, line));
      }
      plans.push(planSeparator(textMaxWidth));

      return plans;
    }

    function mergeDrawingPlans(
      title: string,
      drawingPlans: DrawingPlan[],
    ): DrawingPlan {
      const textMaxHeight = drawingPlans.reduce((acc, drawingPlan) => {
        return Math.max(acc, drawingPlan.lines.length);
      }, 0);

      return drawingPlans.reduce((acc, drawingPlan, index) => {
        const textMaxWidth = getTextMaxWidth(drawingPlan.lines);

        while (drawingPlan.lines.length < textMaxHeight) {
          drawingPlan.lines.push(" ".repeat(textMaxWidth));
        }

        for (let i = 0; i < drawingPlan.lines.length; i++) {
          if (!acc.lines[i]) {
            acc.lines[i] = "";
          }

          acc.lines[i] += planLine(
            textMaxWidth,
            drawingPlan.lines[i],
            index ? TableEdgesEnum.LEFT : TableEdgesEnum.NONE,
          );
        }

        return acc;
      }, {
        title: title,
        lines: [],
      });
    }

    export function drawTables(
      title: string,
      drawingPlans: DrawingPlan[],
    ): boolean {
      return drawTable(title, mergeDrawingPlans(title, drawingPlans).lines);
    }

    export function drawTable(title: string, lines: string[]): boolean {
      lines = lines.length > 0 ? lines : ["Empty!"];
      lines.unshift("-");
      lines.unshift(title);
      const textMaxWidth = getTextMaxWidth(lines);

      System.log(planSeparator(textMaxWidth));
      for (const line of lines) {
        System.log(planLine(textMaxWidth, line));
      }
      System.log(planSeparator(textMaxWidth));

      return true;
    }

    export function planPokemonStats(
      pokemon: Pokemon,
      isWild?: boolean,
    ): DrawingPlan {
      return {
        title: "Pokemon stats",
        lines: [
          pokemon.name + " Lv" + pokemon.level,
          "-",
          "Typ " + pokemon.type,
          "-",
          "Lif " + pokemon.lif + "/" + pokemon.maxLif,
        ].concat(
          isWild ? [] : [
            "Str " + pokemon.str,
            "Def " + pokemon.def,
            "Agi " + pokemon.agi,
          ],
        ),
      };
    }

    export function pokemonsStats(pokemons: Pokemon[], isWild?: boolean) {
      return drawTables(
        "Pokemons stats",
        pokemons.map((pokemon) => planPokemonStats(pokemon, isWild)),
      );
    }

    export function pokemonBattleStats(pokemons: Pokemon[]) {
      return drawTables(
        "Battling pokemons",
        pokemons.map((pokemon) => planPokemonStats(pokemon, pokemon.isWild())),
      );
    }

    export function pokemonStats(
      pokemon: Pokemon | null,
      isWild?: boolean,
    ): boolean {
      if (!pokemon) {
        return false;
      }

      const plan = planPokemonStats(pokemon, isWild);
      drawTable(plan.title, plan.lines);

      return true;
    }

    export function showInventory(inventory: Inventory) {
      const lines: string[] = [];

      const items = {} as any;

      inventory.forEachItem((item: Item) => {
        if (!items[item.name]) {
          items[item.name] = 0;
        }

        items[item.name]++;
      });

      const itemKeys: string[] = Object.keys(items);

      if (itemKeys.length > 0) {
        itemKeys.forEach((itemName) =>
          lines.push(itemName + " x" + items[itemName])
        );
      }

      drawTable("Inventory", lines);
    }

    export function drawBattleAction(pokemon: Pokemon) {
      const lines = pokemon.battleActions.actions.map((action, index) =>
        (index + 1) + ") " + action.name
      );
      drawTable(pokemon.name, lines);
    }
  }
}

enum BattleResultEnum {
  GAME_OVER,
  VICTORY,
  DEFEAT,
  NONE,
}

class BattleTurnOrder {
  readonly phases: Pokemon[][] = [];

  constructor(first: Pokemon, second: Pokemon) {
    this.phases = [
      [first, second],
      [second, first],
    ];
  }
}

class BattleResult {
  result: BattleResultEnum;

  constructor(result: BattleResultEnum) {
    this.result = result;
  }

  isGameOver() {
    return this.result === BattleResultEnum.GAME_OVER;
  }

  isVictory() {
    return this.result === BattleResultEnum.VICTORY;
  }

  isDefeat() {
    return this.result === BattleResultEnum.DEFEAT;
  }
}

class Inventory {
  #items: Item[] = [];

  add(item: Item) {
    this.#items.push(item);
  }

  has(item: Item): boolean {
    return !!~this.indexOf(item);
  }

  indexOf(item: Item): number {
    return this.#items.reduce((acc, inventoryItem, index) => {
      if (~acc) {
        return acc;
      }

      if (inventoryItem.name === item.name) {
        return index;
      }

      return acc;
    }, -1);
  }

  toss(item: Item): boolean {
    const index = this.indexOf(item);
    if (~index) {
      this.#items.splice(index, 1);
      return true;
    }

    return false;
  }

  get(item: Item): Item | null {
    const index = this.indexOf(item);
    if (~index) {
      return this.#items[index];
    }

    return null;
  }

  forEachItem(cb: (item: Item) => void) {
    this.#items.forEach((item) => cb(item));
  }

  show() {
    System.Video.showInventory(this);
  }
}

class Pokeball implements Item {
  readonly name: ItemEnum = ItemEnum.POKEBALL;
  static readonly price: number = 200;

  throw(player: Player, pokemon: Pokemon): boolean {
    player.inventory.toss(this);

    if (System.RNG.isGood()) {
      return true;
    }

    return false;
  }
}

interface Item {
  readonly name: ItemEnum;
}

enum ItemEnum {
  POKEBALL = "Pokeball",
}

class Player {
  readonly name: string;
  #money: number;
  #pokeballs: Pokeball[] = [];
  #pokemons: Pokemon[] = [];
  readonly inventory: Inventory;

  constructor(name: string) {
    this.name = name;
    this.#money = System.RNG.money();
    this.inventory = new Inventory();
  }

  withdraw(amount: number): boolean {
    if (this.#money - amount < 0) {
      System.Audio.noMoney();
      return false;
    }

    this.#money -= amount;
    System.Audio.moneyWithdraw();

    return true;
  }

  getFormattedMoney() {
    const moneyDecimalPlaces = this.#money.toString().split("");
    let formattedMoney = "";

    for (let i = 0; i < moneyDecimalPlaces.length; i++) {
      formattedMoney += moneyDecimalPlaces[i];

      if (0 === ((moneyDecimalPlaces.length - i) % 4)) {
        formattedMoney += ".";
      }
    }

    return formattedMoney;
  }

  checkMoney() {
    System.Video.drawTable("Money", [
      "P " + this.getFormattedMoney(),
    ]);
  }

  catchPokemon(pokemon: Pokemon) {
    if (this.#pokemons.length === 0) {
      System.log(
        "Congratulations, " + pokemon.name + " will be your first pokemon!",
      );
    } else {
      System.Audio.pokemonCaught(this.name, pokemon.name);
    }

    this.#pokemons.push(pokemon);
    pokemon.setOwner(this);
  }

  showPokemons() {
    System.Video.pokemonsStats(this.#pokemons);
  }

  async choosePokemon(): Promise<Pokemon | null> {
    if (this.#pokemons.length === 0) {
      System.log("You have no pokemons!");
      return null;
    }

    const alivePokemons = this.#pokemons.filter((pokemon) =>
      pokemon.isAlive()
    ) as Pokemon[];

    if (alivePokemons.length === 0) {
      System.log("You have no life available pokemons to choose from!");
      return null;
    }

    if (alivePokemons.length === 1) {
      return this.#pokemons[0];
    }

    const pokemonNames = alivePokemons.map((alivePokemon) =>
      alivePokemon.name
    ) as string[];

    while (1) {
      const choice = await choose("Choose your pokemon:", pokemonNames);

      if (!pokemonNames.includes(choice)) {
        System.log("Pokemon not found!");
        continue;
      }

      for (let i = 0; i < alivePokemons.length; i++) {
        if (alivePokemons[i].name === choice) {
          return alivePokemons[i];
        }
      }
    }

    return null;
  }
}

interface BattleActionResult {
  readonly strength: number;
  readonly resistance: number;
  readonly pokemon: Pokemon;
  logResult(): void;
  commit(): void;
}

class BattleActionResultHit implements BattleActionResult {
  readonly strength: number;
  readonly resistance: number;
  readonly pokemon: Pokemon;

  constructor(pokemon: Pokemon, strength: number, resistance: number) {
    this.pokemon = pokemon;
    this.strength = strength;
    this.resistance = resistance;
  }

  logResult(): void {
    if (this.strength > this.resistance) {
      System.log(
        this.pokemon.name,
        "took",
        this.strength - this.resistance >> 0,
        "damage!",
      );
    } else if (this.strength - this.resistance < 0) {
      System.log(this.pokemon.name, "dodged the attack!");
    } else {
      System.log(this.pokemon.name, "blocked the attack!");
    }
  }

  commit(): void {
    if (this.strength > this.resistance) {
      this.pokemon.getHit(this.strength, this.resistance);
    }
  }
}

class BattleActionResultWeakened implements BattleActionResult {
  readonly strength: number;
  readonly resistance: number;
  readonly pokemon: Pokemon;

  constructor(pokemon: Pokemon, strength: number, resistance: number) {
    this.pokemon = pokemon;
    this.strength = strength;
    this.resistance = resistance;
  }

  logResult(): void {
    if (this.strength > this.resistance) {
      System.log(this.pokemon.name, "has become weakened!");
    } else {
      System.log(this.pokemon.name, "resisted the threat!");
    }
  }

  commit(): void {
    if (this.strength > this.resistance) {
      this.pokemon.getWeakened(this.strength, this.resistance);
    }
  }
}

class BattleActionResultScared implements BattleActionResult {
  readonly strength: number;
  readonly resistance: number;
  readonly pokemon: Pokemon;

  constructor(pokemon: Pokemon, strength: number, resistance: number) {
    this.pokemon = pokemon;
    this.strength = strength;
    this.resistance = resistance;
  }

  logResult(): void {
    if (this.strength > this.resistance) {
      System.log(this.pokemon.name, "has become scared!");
    } else {
      System.log(this.pokemon.name, "resisted the threat!");
    }
  }

  commit(): void {
    if (this.strength > this.resistance) {
      this.pokemon.getScared(this.strength, this.resistance);
    }
  }
}

interface BattleAction {
  readonly pokemon: Pokemon;
  readonly name: string;
  perform(enemy: Pokemon): BattleActionResult;
}

class BattleActions {
  readonly pokemon: Pokemon;
  readonly actions: BattleAction[];

  constructor(pokemon: Pokemon) {
    this.pokemon = pokemon;
    this.actions = [
      new BattleActionAttack(this.pokemon),
      new BattleActionLowerAttack(this.pokemon),
      new BattleActionLowerDefense(this.pokemon),
    ];
  }
}

class BattleActionAttack implements BattleAction {
  readonly pokemon: Pokemon;
  readonly name: string;

  constructor(pokemon: Pokemon) {
    this.pokemon = pokemon;
    this.name = pokemon.type + " attack";
  }

  perform(enemy: Pokemon): BattleActionResult {
    const attackPower = (this.pokemon.str +
      System.RNG.d10() * this.pokemon.getTypeMultiplier(enemy)) >> 0;
    const defensePower = (enemy.def + System.RNG.d10()) >> 0;
    return new BattleActionResultHit(enemy, attackPower, defensePower);
  }
}

class BattleActionLowerAttack implements BattleAction {
  readonly pokemon: Pokemon;
  readonly name: string = "Growl";

  constructor(pokemon: Pokemon) {
    this.pokemon = pokemon;
  }

  perform(enemy: Pokemon): BattleActionResult {
    const attackPower =
      (this.pokemon.level + System.RNG.range(enemy.agi) + System.RNG.d10()) >>
      0;
    const defensePower =
      (enemy.level + System.RNG.range(enemy.agi) + System.RNG.d10()) >> 0;
    return new BattleActionResultWeakened(enemy, attackPower, defensePower);
  }
}

class BattleActionLowerDefense implements BattleAction {
  readonly pokemon: Pokemon;
  readonly name: string = "Screech";

  constructor(pokemon: Pokemon) {
    this.pokemon = pokemon;
  }

  perform(enemy: Pokemon): BattleActionResult {
    const attackPower =
      (this.pokemon.level + System.RNG.range(enemy.agi) + System.RNG.d10()) >>
      0;
    const defensePower =
      (enemy.level + System.RNG.range(enemy.agi) + System.RNG.d10()) >> 0;
    return new BattleActionResultScared(enemy, attackPower, defensePower);
  }
}

enum PokemonType {
  ROCK = "Rock",
  THUNDER = "Thunder",
  FIRE = "Fire",
  GRASS = "Grass",
  WATER = "Water",
}

class Pokemon {
  static readonly types: PokemonType[] = [
    PokemonType.ROCK,
    PokemonType.THUNDER,
    PokemonType.FIRE,
    PokemonType.GRASS,
    PokemonType.WATER,
  ];

  readonly name: string;
  readonly type: string;
  level: number;
  lif: number;
  maxLif: number;
  str: number;
  def: number;
  agi: number;

  readonly battleActions: BattleActions;

  #owner: Player | null = null;

  constructor(name: string, level?: number, pokemonToCloneFrom?: Pokemon) {
    this.name = name;

    this.type = pokemonToCloneFrom
      ? pokemonToCloneFrom.type
      : System.RNG.choice(Pokemon.types);
    this.level = pokemonToCloneFrom
      ? pokemonToCloneFrom.level
      : System.RNG.level(level);
    this.lif = pokemonToCloneFrom
      ? pokemonToCloneFrom.lif
      : System.RNG.lif(this.level);
    this.maxLif = this.lif;
    this.str = pokemonToCloneFrom ? pokemonToCloneFrom.str : System.RNG.stats();
    this.def = pokemonToCloneFrom ? pokemonToCloneFrom.def : System.RNG.stats();
    this.agi = pokemonToCloneFrom ? pokemonToCloneFrom.agi : System.RNG.stats();

    this.battleActions = new BattleActions(this);
  }

  clone() {
    const clonedPokemon = new Pokemon(this.name, this.level, this);
    clonedPokemon.setOwner(this.#owner);
    return clonedPokemon;
  }

  setOwner(owner: Player | null) {
    this.#owner = owner;
  }

  outOfPokeball() {
    if (this.#owner) {
      System.Audio.trainerSummonPokemon(this.#owner, this);
    }

    System.Audio.pokemonToBattle(this);
  }

  pokemonReleased() {
    System.Audio.pokemonReleased(this);
  }

  showStats(isWild?: boolean) {
    System.Video.pokemonStats(this, isWild);
  }

  isAlive(): boolean {
    return this.lif > 0;
  }

  isWild(): boolean {
    return this.#owner === null;
  }

  getAgility(): number {
    return this.agi;
  }

  static showStats(pokemons: Pokemon[]) {
    System.Video.pokemonsStats(pokemons);
  }

  static showBattleStats(pokemons: Pokemon[]) {
    System.Video.pokemonBattleStats(pokemons);
  }

  async selectBattleAction(): Promise<BattleAction> {
    System.Video.drawBattleAction(this);

    const actions = this.battleActions.actions.map((_, index) =>
      (index + 1).toString()
    );

    const actionIndex = await choose("Select your action", actions);

    return this.battleActions.actions[parseInt(actionIndex) - 1];
  }

  selectRandomBattleAction(): BattleAction {
    return System.RNG.choice(this.battleActions.actions);
  }

  async attack(enemy: Pokemon): Promise<BattleActionResult> {
    const battleAction = this.#owner
      ? await this.selectBattleAction()
      : this.selectRandomBattleAction();

    System.log(this.name, battleAction.name);

    return battleAction.perform(enemy);
  }

  getTypeMultiplier(enemy: Pokemon): number {
    if (
      (this.type === PokemonType.ROCK && enemy.type === PokemonType.THUNDER) ||
      (this.type === PokemonType.ROCK && enemy.type === PokemonType.FIRE) ||
      (this.type === PokemonType.THUNDER && enemy.type === PokemonType.WATER) ||
      (this.type === PokemonType.WATER && enemy.type === PokemonType.ROCK) ||
      (this.type === PokemonType.WATER && enemy.type === PokemonType.FIRE) ||
      (this.type === PokemonType.GRASS && enemy.type === PokemonType.ROCK) ||
      (this.type === PokemonType.GRASS && enemy.type === PokemonType.WATER) ||
      (this.type === PokemonType.FIRE && enemy.type === PokemonType.GRASS)
    ) {
      return 2;
    }

    if (
      (this.type === PokemonType.THUNDER && enemy.type === PokemonType.ROCK) ||
      (this.type === PokemonType.FIRE && enemy.type === PokemonType.ROCK) ||
      (this.type === PokemonType.WATER && enemy.type === PokemonType.THUNDER) ||
      (this.type === PokemonType.WATER && enemy.type === PokemonType.GRASS) ||
      (this.type === PokemonType.ROCK && enemy.type === PokemonType.WATER) ||
      (this.type === PokemonType.ROCK && enemy.type === PokemonType.GRASS) ||
      (this.type === PokemonType.GRASS && enemy.type === PokemonType.FIRE)
    ) {
      return 0.5;
    }

    return 1;
  }

  getHit(strength: number, resistance: number): void {
    if (strength > resistance) {
      const damage = strength - resistance >> 0;
      if (this.lif - damage < 1) {
        this.lif = 0;
      } else {
        this.lif -= damage;
      }
    }
  }

  getWeakened(strength: number, resistance: number): void {
    if (strength > resistance) {
      const damage = strength - resistance >> 0;
      if (this.str - damage < 1) {
        this.str = 0;
      } else {
        this.str -= damage;
      }
    }
  }

  getScared(strength: number, resistance: number): void {
    if (strength > resistance) {
      const damage = strength - resistance >> 0;
      if (this.def - damage < 1) {
        this.def = 0;
      } else {
        this.def -= damage;
      }
    }
  }
}

namespace Game {
  const $players: Player[] = [];

  export const players = {
    set invite(player: string) {
      $players.push(new Player(player));
    },

    get list() {
      return $players.map((player) => player.name) as string[];
    },

    set kill(player: string) {
      const index = players.indexOf(player);
      if (~index) {
        $players.splice(index, 1);
      }
    },

    indexOf(player: string): number {
      for (let i = 0; i < $players.length; i++) {
        if ($players[i].name === player) {
          return i;
        }
      }

      return -1;
    },

    exists(player: string): boolean {
      return !!~players.indexOf(player);
    },

    get(player: string): Player | null {
      const index = players.indexOf(player);
      if (!~index) {
        return null;
      }

      return $players[index];
    },
  };
}

/*
  Namespace mixin. The namespace System was extended.
*/
namespace System {
  export namespace Audio {
    export function startGame() {
      System.log("Beep boop!");
      System.log("Game started!");
    }

    export function gameOver() {
      System.log("Game over!");
      System.log("Thanks for playing!");
      if (Game.players.list.length > 0) {
        System.log("Another adventure will start in a few seconds!");
        System.sleep(10);
      }
    }

    export function battleWon(player: string) {
      System.log("You won!");
      System.log(player, ":)");
    }

    export function battleLost(player: string) {
      System.log("You lose!");
      System.log(player, ":(");
    }

    export function itemBought() {
      System.log("Mart", ":", "Thanks for shopping with us!");
    }

    export function noMoney() {
      System.log("You have not enough money!");
    }

    export function moneyWithdraw() {
      System.log("Katshinn!");
    }

    export function enterMart() {
      System.log("Mart", ":", "How can I help you?");
    }

    export function buyPokeball(amount: number) {
      const pluralSingular = "pokeball" + (amount === 1 ? "" : "s");
      System.log(
        "Mart",
        ":",
        "Do you want to buy " + amount + " " + pluralSingular + "?",
      );
    }

    export function pokemonToBattle(pokemon: Pokemon) {
      System.log(pokemon.name, ": Rawr!");
    }

    export function pokemonReleased(pokemon: Pokemon) {
      System.log(pokemon.name, ": Awnn!");
    }
  }
}

namespace World {
  const availablePokemons = [
    new Pokemon("Bulbasaur", 5),
    new Pokemon("Squirtle", 5),
    new Pokemon("Charmander", 5),
    new Pokemon("Pikachu", 5),
    new Pokemon("Onyx", 5),
    new Pokemon("Goldeen", 5),
  ];

  export function Mart(player: Player) {
    System.Audio.enterMart();

    const mart = {
      buyPokeball(amount: number): boolean {
        System.Audio.buyPokeball(amount);

        if (player.withdraw(amount * Pokeball.price)) {
          System.Audio.itemBought();
          for (let i = 0; i < amount; i++) {
            player.inventory.add(new Pokeball());
          }
          return true;
        }

        return false;
      },
    };

    return mart;
  }

  export function ProfessorOak(player: Player) {
    const oak = {
      getAvailablePokemonByName(name: string): Pokemon | null {
        const index = availablePokemons.reduce((acc, pokemon, index) => {
          return pokemon.name === name ? index : acc;
        }, -1);

        if (~index) {
          return availablePokemons[index];
        }

        return null;
      },

      async choosePokemon(): Promise<boolean> {
        const availablePokemonsNames = availablePokemons.map((pokemon) =>
          pokemon.name
        ) as string[];

        if (availablePokemonsNames.length < 1) {
          System.log(
            "Professor Oak",
            ":",
            "Hello ",
            player.name + "! I have no more pokemons for you!",
          );
          return false;
        }

        System.log(
          "Professor Oak",
          ":",
          "Hello ",
          player.name +
            "! To start your journey you must choose your first pokemon!",
        );
        let choice = "";

        Pokemon.showStats(availablePokemons);

        while (1) {
          choice = await choose(
            "Professor Oak : Here are the options:",
            availablePokemonsNames,
          );
          const selectedPokemon = oak.getAvailablePokemonByName(choice);

          if (!selectedPokemon) {
            System.log(
              "Professor Oak",
              ":",
              "There are no pokemons for you anymore!",
            );
          } else {
            const confirmed = await confirm(
              "Professor Oak : Are you sure choosing " + selectedPokemon.name +
                "?",
            );

            if (confirmed) {
              const index = availablePokemons.reduce((acc, pokemon, index) => {
                return pokemon.name === choice ? index : acc;
              }, -1);

              if (~index) {
                System.log("Professor Oak", ":", "Here you go!");
                player.catchPokemon(availablePokemons[index]);
                availablePokemons.splice(index, 1);
                return true;
              } else {
                System.log(
                  "Professor Oak",
                  ":",
                  "I'm sorry but another trainer took this pokemon a moment ago!",
                );
              }
            } else {
              System.log("Professor Oak", ":", "Very well, choose wisely!");
            }
          }
        }

        return false;
      },
    };

    return oak;
  }

  export function Woods(player: Player) {
    System.log(player.name, " went to the woods");

    const woods = {
      async findBattle(): Promise<BattleResult> {
        System.log(player.name, "is searching for a pokemon to battle");
        System.log("...");

        const availablePokemon = System.RNG.choice(availablePokemons);
        if (availablePokemon) {
          const pokemonFound = new Pokemon(
            availablePokemon.name,
            System.RNG.range(4) + 2,
          );
          return await World.Battle(player, pokemonFound).start();
        } else {
          System.log(player.name, "no pokemons were found");
          return new BattleResult(BattleResultEnum.NONE);
        }
      },
    };

    return woods;
  }

  export function Battle(player: Player, pokemonFound: Pokemon) {
    const battle = {
      async start(): Promise<BattleResult> {
        System.Audio.battleStarts();

        System.log(pokemonFound.name, "wants to battle!");
        pokemonFound.showStats(true);
        pokemonFound.outOfPokeball();

        const maybeSelectedPokemon = await player.choosePokemon();

        if (!maybeSelectedPokemon) {
          return new BattleResult(BattleResultEnum.GAME_OVER);
        }

        const originalPokemonFound = pokemonFound.clone();

        const originalSelectedPokemon = maybeSelectedPokemon as Pokemon;
        const selectedPokemon = originalSelectedPokemon.clone();
        selectedPokemon.outOfPokeball();

        let turn = 1;
        whileLabel:
        while (selectedPokemon.isAlive() && pokemonFound.isAlive()) {
          System.logBattleTurn(turn);

          const battleTurnOrder =
            selectedPokemon.getAgility() >= pokemonFound.getAgility()
              ? new BattleTurnOrder(selectedPokemon, pokemonFound)
              : new BattleTurnOrder(pokemonFound, selectedPokemon);

          Pokemon.showBattleStats([selectedPokemon, pokemonFound]); // Show only the visible stats
          //Pokemon.showStats([selectedPokemon, pokemonFound]) // Show all the stats

          for await (
            const [attackingPokemon, defendingPokemon] of battleTurnOrder.phases
          ) {
            const battleActionResult = await attackingPokemon.attack(
              defendingPokemon,
            );

            System.sleep(2);
            battleActionResult.logResult();
            battleActionResult.commit();

            if (!defendingPokemon.isAlive()) {
              break whileLabel;
            }
          }

          turn++;
          System.sleep(2);
        }

        originalSelectedPokemon.lif = selectedPokemon.lif;
        originalPokemonFound.lif = pokemonFound.lif;

        const battleResult = selectedPokemon.isAlive()
          ? new BattleResult(BattleResultEnum.VICTORY)
          : new BattleResult(BattleResultEnum.DEFEAT);

        if (battleResult.isVictory()) {
          System.Audio.battleWon(player.name);
          const pokeball = { name: ItemEnum.POKEBALL };

          if (player.inventory.has(pokeball)) {
            const willCapture = await confirm(
              "Throw a pokeball at " + originalPokemonFound.name + "?",
            );

            if (willCapture) {
              const itemPokeball = player.inventory.get(pokeball) as Pokeball;
              if (itemPokeball.throw(player, originalPokemonFound)) {
                player.catchPokemon(originalPokemonFound);
              } else {
                System.Audio.pokemonRanAway(originalPokemonFound.name);
              }
            }
          }
        } else if (battleResult.isGameOver() || battleResult.isDefeat()) {
          System.Audio.battleLost(player.name);
        }

        return battleResult;
      },
    };

    return battle;
  }
}

System.Audio.startGame();

Game.players.invite = "Ash";
Game.players.invite = "Brock";
Game.players.invite = "Misty";

for await (const playerName of Game.players.list) {
  System.log("-".repeat(70));

  const player = Game.players.get(playerName);

  if (!player) {
    System.Audio.gameOver();
    continue;
  }

  System.Audio.newPlayer(player.name);

  player.inventory.show();
  player.checkMoney();

  World.Mart(player).buyPokeball(20);
  player.inventory.show();
  player.checkMoney();

  await World.ProfessorOak(player).choosePokemon();

  const battleResult = await World.Woods(player).findBattle();

  player.showPokemons();
  player.inventory.show();

  Game.players.kill = playerName;

  System.Audio.gameOver();
}
