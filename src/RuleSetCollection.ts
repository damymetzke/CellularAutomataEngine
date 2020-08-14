import { RuleSet } from "./Rulesets/Ruleset.js";
import { ConwayRuleSet } from "./Rulesets/Conway.js";
import { ImmigrationRuleSet } from "./Rulesets/Immigration.js";
import { WireWorldRuleSet } from "./Rulesets/WireWorld.js";
import { BriansBrainRuleSet } from "./Rulesets/BriansBrain.js";
import { SeedsRuleSet } from "./Rulesets/Seeds.js";
import { MazeRuleSet } from "./Rulesets/Maze.js";
import { MazectricRuleSet } from "./Rulesets/Mazectric.js";

export const RULE_SETS: RuleSet[] = [
    new ConwayRuleSet(),
    new ImmigrationRuleSet(),
    new WireWorldRuleSet(),
    new BriansBrainRuleSet(),
    new SeedsRuleSet(),
    new MazeRuleSet(),
    new MazectricRuleSet()
];