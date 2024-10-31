import fs from "fs"
import L10N_MapObjectNameText from "..././../game/client/Content/L10N/en/Pal/DataTable/Text/DT_MapObjectNameText.json"
import L10N_ItemNameText from "../../../game/client/Content/L10N/en/Pal/DataTable/Text/DT_ItemNameText.json"
import L10N_PalNameText from "../../../game/client/Content/L10N/en/Pal/DataTable/Text/DT_PalNameText.json"
import L10N_UI_Common_Text from "../../../game/client/Content/L10N/en/Pal/DataTable/Text/DT_UI_Common_Text.json"
import L10N_SkillNameText from "../../../game/client/Content/L10N/en/Pal/DataTable/Text/DT_SkillNameText.json"

// TODO: Can later be replaced with .find() on items, structures, etc.
export function replaceTags(match, tagName, tagContent) {
    // Perform replacement based on the tagName and tagContent
    switch (tagName) {
        case "itemName":
            return L10N_ItemNameText[0].Rows[`ITEM_NAME_${tagContent}`].TextData.LocalizedString;
        case "mapObjectName":
            return L10N_MapObjectNameText[0].Rows[`MAPOBJECT_NAME_${tagContent}`].TextData.LocalizedString;
        case "characterName":
            return L10N_PalNameText[0].Rows[`PAL_NAME_${tagContent}`].TextData.LocalizedString;
        case "uiCommon":
            return L10N_UI_Common_Text[0].Rows[tagContent].TextData.LocalizedString;
        case "activeSkillName":
            return L10N_SkillNameText[0].Rows[`ACTION_SKILL_${tagContent}`].TextData.LocalizedString;
        default:
            return match; // No modification
    }
}

// Uses linear interpolation to incrementally add missing values to an UnrealEngine array of [{ Time, Value }] objects and return them as [{ x, y }]
export function RCIM_Linear(arr) {
    return arr.reduce((acc, curr, index) => {
        let { Time: x0, Value: y0 } = curr
        const { Time: x1, Value: y1 } = arr[index + 1] || {}

        // Push the current value from the original array
        acc.push({ x: x0, y: y0 })

        // Fill in missing values from the current Time to the next Time
        let missingX = x0
        while (x1 > missingX + 1) {
            missingX++
            const missingY = y0 + (y1 - y0) * ((missingX - x0) / (x1 - x0))
            acc.push({ x: missingX, y: missingY })
        }

        return acc
    }, [])
}

export function imgPath(path) {
    if (!path) return
    return path.replace("/Game", "/Content").split(".")[0] + ".png"
}

// Shrinks each entries[] object to only have the necessary keys for displaying in a list, i.e. name and icon.
export function getBriefArr(arr) {
    return arr.map(data => getBriefData(data))
}

export function getBriefData(fullData) {
    const { id, name, icon } = fullData || {}
    return { id, name, icon }
}

// Ensure case-insensitivity as svelte's routing (or the browser?) transforms links like /Characters/UCR001 to /characters/ucr001. 
export function writeJson(dir, fileName, data) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(`${dir}/${fileName.toLowerCase()}.json`, JSON.stringify(data))
}