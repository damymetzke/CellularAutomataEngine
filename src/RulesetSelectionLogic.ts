import { RuleSet } from "./Ruleset.js";
import { init } from "./GridLogic.js";
import { RULESET_MAP } from "./RuleSetCollection.js";
import { SquareGridShape } from "./GridShape.js";
import { setupUi } from "./UiController.js";

type PageData = {
    subCategories: Set<string>;
    rulesets: Set<string>;
};

let pages: { [ category: string ]: PageData; } = {};

const CATEGORY_TREE = document.getElementById("ruleset-select-window--category-tree");
const NAVIGATION_LIST = document.getElementById("ruleset-select-window--list");

function buildCategory(categories: string[]): string
{
    return categories.reduce((total, current, index) => index === 0 ? current : `${total}.${current}`, "");
}

function loadSubCategories(leafCategory: string, ...categories: string[])
{
    const fullCategory = buildCategory(categories.reverse());

    if (!(fullCategory in pages))
    {
        pages[ fullCategory ] = {
            subCategories: new Set<string>(),
            rulesets: new Set<string>()
        };
    }

    const currentPage = pages[ fullCategory ];

    currentPage.subCategories.add(leafCategory);
    if (categories.length > 0)
    {
        loadSubCategories(...<[ string ]>categories);
    }
}

export function loadPages(rulesets: RuleSet[])
{
    pages = {};

    rulesets.forEach(ruleset =>
    {
        let categoryList = ruleset.categorization.split(".");
        const rulesetName = categoryList.pop();
        const fullCategory = buildCategory(categoryList);


        if (!(fullCategory in pages))
        {
            pages[ fullCategory ] = {
                subCategories: new Set<string>(),
                rulesets: new Set<string>()
            };
        }

        const currentPage = pages[ fullCategory ];

        currentPage.rulesets.add(rulesetName);

        if (categoryList.length > 0)
        {
            loadSubCategories(...<[ string ]>categoryList.reverse());
        }
    });

    displayPage("");
}

function buildCategoryTree(category: string)
{
    const categoryList = category.split(".");
    CATEGORY_TREE.innerHTML = categoryList.reduce((total, current, index) =>
    {
        return `${total} / <span data-index="${index}">${current}</span>`;
    }, `<span data-index="-1">.</span>`);

    (<HTMLElement[]>Array.from(CATEGORY_TREE.children)).forEach(element =>
    {
        const index = Number(element.dataset.index);
        element.removeAttribute("data-index");

        const subCategory = buildCategory(categoryList.slice(0, index + 1));
        element.addEventListener("click", () =>
        {
            displayPage(subCategory);
        });
    });
}

function buildSubCategories(root: string, page: PageData)
{
    const items = Array.from(page.subCategories).sort();

    items.forEach(item =>
    {
        const newElement = document.createElement("li");
        newElement.classList.add("category");
        newElement.innerHTML = item;

        newElement.addEventListener("click", () =>
        {
            if (!root)
            {
                displayPage(item);
                return;
            }
            displayPage(`${root}.${item}`);
        });

        NAVIGATION_LIST.appendChild(newElement);
    });
}

function buildRulesets(root: string, page: PageData)
{
    const items = Array.from(page.rulesets).sort();

    items.forEach(item =>
    {
        const newElement = document.createElement("li");
        newElement.classList.add("ruleset");

        const fullCategory = !root ? item : `${root}.${item}`;
        const currentRuleset = RULESET_MAP[ fullCategory ];

        newElement.innerHTML = currentRuleset.name;

        newElement.addEventListener("click", () =>
        {
            setupUi(currentRuleset);
            init(20, currentRuleset, SquareGridShape.PLANE);
            document.getElementById("ruleset-select-window").classList.remove("visible");
        });

        NAVIGATION_LIST.appendChild(newElement);
    });
}

function displayPage(category: string)
{
    if (!(category in pages))
    {
        console.error(`page for category '${category}' not loaded`);
        return;
    }

    NAVIGATION_LIST.innerHTML = "";

    buildCategoryTree(category);
    const currentPage = pages[ category ];
    buildSubCategories(category, currentPage);
    buildRulesets(category, currentPage);
}