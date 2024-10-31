import DT_PalIcons from "../../game/client/Content/Pal/DataTable/Character/DT_PalCharacterIconDataTable.json"
import DT_PalStats from "../../game/client/Content/Pal/DataTable/Character/DT_PalMonsterParameter.json"
import DT_PalUniqueBreeding from "../../game/client/Content/Pal/DataTable/Character/DT_PalCombiUnique.json"
import DT_PalDropItem from "../../game/client/Content/Pal/DataTable/Character/DT_PalDropItem.json"
import DT_ActiveSkills from "../../game/client/Content/Pal/DataTable/Waza/DT_WazaDataTable.json"
import DT_PalActiveSkillMappings from "../../game/client/Content/Pal/DataTable/Waza/DT_WazaMasterLevel.json"
import L10N_PalNames from "../../game/client/Content/L10N/en/Pal/DataTable/Text/DT_PalNameText.json"
import L10N_PartnerSkillDescs from "../../game/client/Content/L10N/en/Pal/DataTable/Text/DT_PalFirstActivatedInfoText.json"
import L10N_PartnerSkillNames from "../../game/client/Content/L10N/en/Pal/DataTable/Text/DT_SkillNameText.json"
import L10N_ItemNameText from "../../game/client/Content/L10N/en/Pal/DataTable/Text/DT_ItemNameText.json"
import L10N_SkillNameText from "../../game/client/Content/L10N/en/Pal/DataTable/Text/DT_SkillNameText.json"
import DA_StaticItemDataAsset from "../../game/client/Content/Pal/DataAsset/Item/DA_StaticItemDataAsset.json"
import { replaceTags } from "./utils"

function getIsRideable(palIndex) {
    // Possible files for determining if pal is rideable
    // L10N/en/Pal/DataTable/Text/DT_PalFirstActivatedInfoText.json "can be ridden"
    // Pal/Blueprint/Character/Monster/PalActorBP/{PAL_ID}/BP_{PAL_ID}.json search for "riding" or "Ride" or "Saddle"... search for "RideMarker"
    // Pal/Blueprint/Character/Monster/PalActorBP/{PAL_ID}/BS_Move_{PAL_ID}_Riding.json DOES NOT EXIST FOR ALPACA DESPITE BEING RIDEABLE
    // Pal/DataTable/Technology/DT_TechnologyRecipeUnlock.json has skill unlocks

    // Hard coded for now because there is no clear indicator that is consistent across multiple files
    const rideablePals = {
        GroundMount: [
            "20", // Rushoar
            "36", // Melpaca
            "26", // Direhowl
            "37", // Eikthyrdeer
            "52", // Grintale
            "55", // Chillet
            "56", // Univolt
            "42", // Arsox
            "64", // Dinossom
            "86", // Broncherry
            "89", // Kingpaca
            "65B", // Surfent Terra
            "66", // Maraith
            "33", // Mossanda
            "33B", // Mossanda Lux
            "37B", // Eikthyrdeer Terra
            "93", // Fenglope
            "60", // Rayhound
            "86B", // Broncherry Aqua
            "90", // Mammorest
            "59", // Reindrix
            "64B", // Dinossom Lux
            "61", // Kitsun
            "58", // Pyrin
            "88", // Reptyro
            "84", // Blazehowl
            "58B", // Pyrin Noct
            "84B", // Blazehowl Noct
            "88", // Ice Reptyro
            "96", // Blazamut
            "103", // Grizzbolt
            "89B", // Ice Kingpaca
            "91", // Wumpo
            "90B", // Mammorest Cryst
            "85", // Relaxaurus
            "91B", // Wumpo Botan
            "85B", // Relaxaurus Lux
            "108", // Paladius
            "109", // Necromus
        ],
        SwimmingMount: [
            "65", // Surfent
            "82", // Azurobe
            "101", // Jormuntide
            "101B", // Jormuntide Ignis
        ],
        FlyingMount: [
            "38", // Nitewing
            "71", // Vanwyrm
            "80", // Elphidran
            "80B", // Elphidran Aqua
            "97", // Helzephyr
            "73", // Beakon
            "95", // Quivern
            "74", // Ragnahawk
            "105", // Faleris
            "102", // Suzaku
            "71B", // Vanwyrm Cryst
            "102B", // Suzaku Aqua
            "98", // Astegon
            "107", // Shadowbeak
            "110", // Frostallion
            "110B", // Frostallion Noct
            "111", // Jetragon
        ],
        GlidingMount: [
            "25", // Celeray
            "23", // Killamari
            "32", // Hangyu
            "47", // Galeclaw
            "32B", // Hangyu Cryst
        ]
    }

    const result = {
        GroundMount: false,
        SwimmingMount: false,
        FlyingMount: false,
        GlidingMount: false
    }

    Object.entries(rideablePals).forEach(([key, values]) => {
        if (values.includes(palIndex)) result[key] = true
    })

    return result
}

function getPartnerSkillDesc(palIdString) {
    return L10N_PartnerSkillDescs[0]
        .Rows[`PAL_FIRST_SPAWN_DESC_${palIdString}`]?.TextData.LocalizedString
        .replace("\r\n", " ")
        .replace(/<([^>\s]+)\s+id=\|([^|]+)\|\/>/g, (match, tagName, tagContent) => {
            return replaceTags(match, tagName, tagContent);
        })
}

function getPartnerSkillName(palIdString) {
    return L10N_PartnerSkillNames[0].Rows[`PARTNERSKILL_${palIdString}`]?.TextData.LocalizedString
}

function getDropTables(palIdString) {
    return Object.values(DT_PalDropItem[0].Rows)
        .filter(dropTable => dropTable.CharacterID === palIdString)
        .map(dropTable => {
            [1,2,3,4,5].forEach(itemNumber => {
                let itemName = "NO TEXT"
                let icon = ""
                const itemId = dropTable[`ItemId${itemNumber}`]
                if (itemId && itemId !== "None") {
                    itemName = L10N_ItemNameText[0].Rows[`ITEM_NAME_${itemId}`].TextData.LocalizedString
                    const iconObject = DA_StaticItemDataAsset.find(obj => obj.Properties.ID === itemId)
                    icon = iconObject.Properties.IconTexture.AssetPathName.replace("/Game", "").split(".")[0] + ".png"
                }
                dropTable[`ItemName${itemNumber}`] = itemName
                dropTable[`ItemIcon${itemNumber}`] = icon
            })

            return dropTable
        })
}

function getActiveSkills(palIdString) {
    return Object.values(DT_PalActiveSkillMappings[0].Rows)
        .filter(skillUnlockObj => skillUnlockObj.PalID === palIdString)
        .map(skillUnlockObj => {
            const skillData = Object.values(DT_ActiveSkills[0].Rows).find(obj => obj.WazaType === skillUnlockObj.WazaID)
            const skillId = skillUnlockObj.WazaID.split("::").pop()
            const name = L10N_SkillNameText[0].Rows[`ACTION_SKILL_${skillId}`].TextData.LocalizedString
            return {
                ...skillUnlockObj,
                ...skillData,
                skillId,
                name
            }
        })
}

// Because devs are doing typos here and there, WindChimes cannot get the image because Windchimes is the key
const PalIcons = Object.entries(DT_PalIcons[0].Rows).reduce((acc, [key, value]) => {
    acc[key.toLowerCase()] = value.Icon.AssetPathName.replace("/Game", "").split(".")[0] + ".png"
    return acc
}, {})
PalIcons.none = "/Pal/Texture/PalIcon/Normal/T_dummy_icon.png"
PalIcons.plantslime_flower = "/Pal/Texture/PalIcon/Normal/T_PlantSlime_icon_normal.png" // temp fix, missing icon

const pals = Object.entries(DT_PalStats[0].Rows)
    .filter(([key, value]) => value.ZukanIndex > 0) // && !["boss_", "gym_"].some(prefix => key.toLowerCase().includes(prefix))
    .map(([key, value]) => {
        const palIndex = value.ZukanIndex + value.ZukanIndexSuffix
        const nameKey = value.OverrideNameTextID !== "None" ? value.OverrideNameTextID : `PAL_NAME_${key}`
        const nameLocalized = L10N_PalNames[0].Rows[nameKey]?.TextData.LocalizedString
        // const name = nameLocalized.toLowerCase().includes("_text") ? key : nameLocalized // the name might be "en_text" "zh_Hans_Text" etc. for unfilled values
        const name = nameLocalized
        const icon = PalIcons[value.BPClass.toLowerCase()]

        const isRideable = getIsRideable(palIndex)
        const partnerSkillDesc = getPartnerSkillDesc(key)
        const partnerSkillName = getPartnerSkillName(key)
        const dropTables = getDropTables(key)
        const activeSkills = getActiveSkills(key)

        return {
            key,
            text: {
                name: name ?? "NO TEXT",
                partnerSkillName,
                partnerSkillDesc
            },
            assets: {
                icon
            },
            dropTables,
            activeSkills,
            ...isRideable,
            ...value,
        }
    })

// Some pals can only be bred with certain parents.
const DT_uniqueBreeding = Object.values(DT_PalUniqueBreeding[0].Rows)

// Some pals can only be acquired through breeding and do not have a spawn location.
const breedOnlyPals = [
    "80B", // Elphidran Aqua
    "102B", // Suzaku Aqua
    "88B", // Ice Reptyro
    "110B" // Frostallion Noct
]

// Create an array with all breeding combinations, because it's more complicated to get the parents given a child because of the pal indexing.
// i.e. Anubis (570) and Cattiva (1460) results in 1015. Robinquill (1020) and Felbat (1010) are the closest, but Robinquill is picked because it appears first in the DataTable.
export const allBreedingCombinations = pals.reduce((acc, pal1) => {
    pals.forEach((pal2) => {
        const child = getChild(pal1, pal2);
        const isBreedingExclusive = breedOnlyPals.includes(child.ZukanIndex + child.ZukanIndexSuffix)
        const isUnique = DT_uniqueBreeding.some(combi => combi.ChildCharacterID === child.key)

        if (!isCombiAlreadyInList(acc, pal1, pal2)) {
            acc.push({
                isUnique,
                isBreedingExclusive,
                parent1: pal1,
                parent2: pal2,
                child,
            });
        }
    });
    return acc
}, []);

// Don't repeat combinations, i.e. Anubis + Chikipi and Chikipi + Anubis
function isCombiAlreadyInList(list, pal1, pal2) {
    return list.some((combi) =>
        (combi.parent1.key === pal1.key && combi.parent2.key === pal2.key)
        || (combi.parent1.key === pal2.key && combi.parent2.key === pal1.key))
}

// Check all pals to see which one has the closest breeding power to the target breeding power.
export function getChild(parent1, parent2) {

    // If this parent combination is unique, return the unique child
    const uniqueParentCombi =
        DT_uniqueBreeding.find(combi =>
            combi.ParentTribeA === parent1.Tribe && combi.ParentTribeB === parent2.Tribe
            || combi.ParentTribeA === parent2.Tribe && combi.ParentTribeB === parent1.Tribe
        )

    if (uniqueParentCombi) {
        return pals.find(pal => pal.key === uniqueParentCombi.ChildCharacterID);
    }

    const child_bp = Math.floor(
        (parent1.CombiRank + parent2.CombiRank + 1) / 2,
    );

    // Find the pal whose BP is the closest to the target BP
    // If multiple pals are the same distance, do not replace (defaulting to the one that occurs first in the game's DataTable)
    return pals.reduce((acc, curr) => {
        const accDiff = Math.abs(acc.CombiRank - child_bp);
        const currDiff = Math.abs(curr.CombiRank - child_bp);

        // If the child requires a special parent combination to breed, do not replace acc
        const childRequiresUniqueCombi = DT_uniqueBreeding.some(combi => combi.ChildCharacterID === curr.key)

        if (accDiff > currDiff && !childRequiresUniqueCombi) {
            acc = curr
        }
        return acc;
    }, pals[137]);
}

// console.log(getChild(pals.find(pal => pal.text.name === "Relaxaurus"), pals.find(pal => pal.text.name === "Sparkit")))

export default pals