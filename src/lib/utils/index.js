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

// Shrinks each entries[] object to only have the necessary keys for displaying in a list, i.e. name and icon.
export function getBriefArr(arr) {
    return arr.map(data => getBriefData(data))
}

export function getBriefData(fullData) {
    const { id, name, type, subtypes, elements, icon, role, charId, gender, rarity, category, weak_attribute_damage_up, all_attribute_damage_resist } = fullData || {}
    return { id, name, type, subtypes, elements, icon, role, charId, gender, rarity, category, elePower: weak_attribute_damage_up || all_attribute_damage_resist || undefined }
}