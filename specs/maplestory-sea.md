MapleStorySEA는 지금 3개의 카테고리로 나눠져있음

Character Information Retrieval
Union Information Retrieval
Guild Information Retrieval

그리고 각 카테고리의 안에있는 api들의 엔드포인트, 예시값, 스키마는 아래와 같다

############################################### 은 각 엔드포인트 구간을 구분 한것이고
=============================================== 는 카테고리 구간을 구분하기 위한것이다.

MapleStory game data can be verified approximately 15 minutes after updates.
Data is available starting from April 20, 2025.
Historical data can be queried by specifying the desired date, and data from the previous day can be accessed starting at 2 AM the next day. (For example, when querying data for December 22, data from 00:00 to 24:00 on December 22 will be retrieved.)
Due to game content changes, the ocid may be updated. Please pay attention to this when updating services based on ocid.
This API provides data for MapleStory SEA.

Character
Retrieve character information

GET
/maplestorysea/v1/id
Retrieve character identifier (ocid)

Retrieves the character identifier (ocid).

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
character_name
string
(query)
Character name

character_name
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"ocid": "string"
}

Character{
ocid
string
Character identifier

}

###############################################

GET
/maplestorysea/v1/character/basic
Retrieve basic character information

Retrieves basic character information.

You can use query parameters on the retrieved character appearance image URL to change the character's actions or facial expressions.
Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"character_name": "string",
"world_name": "string",
"character_gender": "string",
"character_class": "string",
"character_class_level": "string",
"character_level": 0,
"character_exp": 0,
"character_exp_rate": "string",
"character_guild_name": "string",
"character_image": "string",
"character_date_create": "2025-01-21T00:00+08:00",
"access_flag": "string",
"liberation_quest_clear_flag": "string",
"liberation_quest_clear": "string"
}

CharacterBasic{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

character_name
string
Character name

world_name
string
World name

character_gender
string
Character gender

character_class
string
Character job

character_class_level
string
Character job advancement tier

character_level
number($int64)
Character level

character_exp
number($int64)
Experience points gained at the current level

character_exp_rate
string
Percentage of experience points at the current level

character_guild_name
string
Guild name the character belongs to

character_image
string
Character appearance image

You can use query parameters on the retrieved character appearance image URL to modify the character's action or expression.
Query parameters can be appended to the URL retrieved by the API by adding a question mark (?) followed by "Key=value" pairs.
To provide multiple query parameters, separate them with an ampersand (&) and input them as a single string.
You can input frame values ("Key=value.number") for actions and expressions to view the avatar image by frame.
Example: https://open.api.nexon.com/static/maplestorysea/character/look/ABCDEFG?action=A00.2&emotion=E00&width=200&height=200
Available query parameters for the character appearance image are as follows.
action: Actions (A00 ~ A41)
A00: stand1 (default)

- frame: 0 ~ 2
  A01: stand2
- frame: 0 ~ 2
  A02: walk1
- frame: 0 ~ 3
  A03: walk2
- frame: 0 ~ 3
  A04: prone
- frame: 0
  A05: fly
- frame: 0 ~ 1
  A06: jump
- frame: 0
  A07: sit
- frame: 0
  A08: ladder
- frame: 0 ~ 1
  A09: rope
- frame: 0 ~ 1
  A10: heal
- frame: 0 ~ 2
  A11: alert
- frame: 0 ~ 2
  A12: proneStab
- frame: 0 ~ 1
  A13: swingO1
- frame: 0 ~ 2
  A14: swingO2
- frame: 0 ~ 2
  A15: swingO3
- frame: 0 ~ 2
  A16: swingOF
- frame: 0 ~ 3
  A17: swingP1
- frame: 0 ~ 2
  A18: swingP2
- frame: 0 ~ 2
  A19: swingPF
- frame: 0 ~ 3
  A20: swingT1
- frame: 0 ~ 2
  A21: swingT2
- frame: 0 ~ 2
  A22: swingT3
- frame: 0 ~ 2
  A23: swingTF
- frame: 0 ~ 3
  A24: stabO1
- frame: 0 ~ 1
  A25: stabO2
- frame: 0 ~ 1
  A26: stabOF
- frame: 0 ~ 2
  A27: stabT1
- frame: 0 ~ 2
  A28: stabT2
- frame: 0 ~ 2
  A29: stabTF
- frame: 0 ~ 3
  A30: shoot1
- frame: 0 ~ 2
  A31: shoot2
- frame: 0 ~ 4
  A32: shootF
- frame: 0 ~ 2
  A33: dead
- frame: 0
  A34: ghostwalk
- frame: 0 ~ 3
  A35: ghoststand
- frame: 0 ~ 2
  A36: ghostjump
- frame: 0
  A37: ghostproneStab
- frame: 0 ~ 1
  A38: ghostladder
- frame: 0 ~ 1
  A39: ghostrope
- frame: 0 ~ 1
  A40: ghostfly
- frame: 0 ~ 1
  A41: ghostsit
- frame: 0 ~ 0
  emotion: Expressions (E00 ~ E24)
  E00: default (default)
- frame: 0
  E01: wink
- frame: 0
  E02: smile
- frame: 0
  E03: cry
- frame: 0
  E04: angry
- frame: 0
  E05: bewildered
- frame: 0
  E06: blink
- frame: 0 ~ 2
  E07: blaze
- frame: 0 ~ 1
  E08: bowing
- frame: 0 ~ 1
  E09: cheers
- frame: 0
  E10: chu
- frame: 0
  E11: dam
- frame: 0 ~ 1
  E12: despair
- frame: 0 ~ 1
  E13: glitter
- frame: 0 ~ 1
  E14: hit
- frame: 0
  E15: hot
- frame: 0 ~ 1
  E16: hum
- frame: 0 ~ 1
  E17: love
- frame: 0 ~ 1
  E18: oops
- frame: 0
  E19: pain
- frame: 0
  E20: troubled
- frame: 0
  E21: qBlue
- frame: 0
  E22: shine
- frame: 0
  E23: stunned
- frame: 0
  E24: vomit
- frame: 0 ~ 1
  wmotion: Weapon motions (W00 ~ W04)
  W00: Default motion (default, motion based on weapon type)
  W01: One-handed motion
  W02: Two-handed motion
  W03: Gun motion
  W04: No weapon
  width: Horizontal length (corresponding to the background size, 96 (default) ~ 1000)
  height: Vertical length (corresponding to the background size, 96 (default) ~ 1000)
  x: Horizontal coordinate of the character (coordinate range 0 < x < width, 0 is the left starting point)
  y: Vertical coordinate of the character (coordinate range 0 < y < height, 0 is the top starting point)
  character_date_create
  string
  example: 2025-01-21T00:00+08:00
  Character creation date (SGT, daily data with hours and minutes set to 0)

access_flag
string
Login status in the past 7 days (true:logged in, false:not logged in)

liberation_quest_clear_flag
string
Liberation Quest completion status (true:completed, false:not completed)

- This parameter will be deprecated and removed from the MapleStory OpenAPI after January 2026.
- Please use the newly added liberation_quest_clear parameter instead.

liberation_quest_clear
string
Liberation Quest completion status (0:not completed, 1:Genesis Weapon liberated, 2:Destiny Weapon Phase 1 liberated)

}

###############################################

GET
/maplestorysea/v1/character/popularity
Retrieve popularity information

Retrieves popularity information of a character.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"popularity": 0
}

CharacterPopularity{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

popularity
number($int64)
Character popularity

}

###############################################

GET
/maplestorysea/v1/character/stat
Retrieve comprehensive stats information

Retrieves comprehensive character stats information.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"character_class": "string",
"final_stat": [
{
"stat_name": "Minimum stat attack power",
"stat_value": "43.75"
}
],
"remain_ap": 0
}

CharacterStat{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

character_class
string
Character job

final_stat
[
Current stat information

{
stat_name
string
example: Minimum stat attack power
Stat name

stat_value
string
example: 43.75
Stat value

}
]
remain_ap
number($int64)
Remaining AP

}

###############################################

GET
/maplestorysea/v1/character/hyper-stat
Retrieve Hyper Stat information

Retrieves Hyper Stat information.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"character_class": "string",
"use_preset_no": "string",
"use_available_hyper_stat": 0,
"hyper_stat_preset_1": [
{
"stat_type": "string",
"stat_point": 0,
"stat_level": 0,
"stat_increase": "string"
}
],
"hyper_stat_preset_1_remain_point": 0,
"hyper_stat_preset_2": [
{
"stat_type": "string",
"stat_point": 0,
"stat_level": 0,
"stat_increase": "string"
}
],
"hyper_stat_preset_2_remain_point": 0,
"hyper_stat_preset_3": [
{
"stat_type": "string",
"stat_point": 0,
"stat_level": 0,
"stat_increase": "string"
}
],
"hyper_stat_preset_3_remain_point": 0
}

CharacterHyperStat{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

character_class
string
Character job

use_preset_no
string
Active preset number

use_available_hyper_stat
number($int64)
Maximum available Hyper Stat points

hyper_stat_preset_1
[
Hyper Stat information for preset 1

{
stat_type
string
Stat type

stat_point
number($int64)
Stat points to invest

stat_level
number($int64)
Stat level

stat_increase
string
Stat increases

}
]
hyper_stat_preset_1_remain_point
number($int64)
Remaining Hyper Stat points for preset 1

hyper_stat_preset_2
[
Hyper Stat information for preset 2

{
stat_type
string
Stat type

stat_point
number($int64)
Stat points to invest

stat_level
number($int64)
Stat level

stat_increase
string
Stat increases

}
]
hyper_stat_preset_2_remain_point
number($int64)
Remaining Hyper Stat points for preset 2

hyper_stat_preset_3
[
Hyper Stat information for preset 3

{
stat_type
string
Stat type

stat_point
number($int64)
Stat points to invest

stat_level
number($int64)
Stat level

stat_increase
string
Stat increases

}
]
hyper_stat_preset_3_remain_point
number($int64)
Remaining Hyper Stat points for preset 3

}

###############################################

GET
/maplestorysea/v1/character/propensity
Retrieve traits information

Retrieves traits information.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"charisma_level": 0,
"sensibility_level": 0,
"insight_level": 0,
"willingness_level": 0,
"handicraft_level": 0,
"charm_level": 0
}

CharacterPropensity{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

charisma_level
number($int64)
Ambition level

sensibility_level
number($int64)
Empathy level

insight_level
number($int64)
Insight level

willingness_level
number($int64)
Willpower level

handicraft_level
number($int64)
Diligence level

charm_level
number($int64)
Charm level

}

###############################################

GET
/maplestorysea/v1/character/ability
Retrieve Ability information

Retrieves Ability information.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"ability_grade": "string",
"ability_info": [
{
"ability_no": "string",
"ability_grade": "string",
"ability_value": "string"
}
],
"remain_fame": 0,
"preset_no": 0,
"ability_preset_1": {
"ability_preset_grade": "string",
"ability_info": [
{
"ability_no": "string",
"ability_grade": "string",
"ability_value": "string"
}
]
},
"ability_preset_2": {
"ability_preset_grade": "string",
"ability_info": [
{
"ability_no": "string",
"ability_grade": "string",
"ability_value": "string"
}
]
},
"ability_preset_3": {
"ability_preset_grade": "string",
"ability_info": [
{
"ability_no": "string",
"ability_grade": "string",
"ability_value": "string"
}
]
}
}

CharacterAbility{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

ability_grade
string
Ability grade

ability_info
[
Ability information

{
ability_no
string
Ability number

ability_grade
string
Ability grade

ability_value
string
Ability option and value

}
]
remain_fame
number($int64)
Owned Honor EXP

preset_no
number($int64)
Active ability preset number

ability_preset_1
{
description:
Complete information for Ability Preset 1

ability_preset_grade
string
Ability grade for Preset 1

ability_info
[
Information for Ability Preset 1

{
ability_no
string
Ability number

ability_grade
string
Ability grade

ability_value
string
Ability option and value

}
]
}
ability_preset_2
{
description:
Complete information for Ability Preset 2

ability_preset_grade
string
Ability grade for Preset 2

ability_info
[
Information for Ability Preset 2

{
ability_no
string
Ability number

ability_grade
string
Ability grade

ability_value
string
Ability option and value

}
]
}
ability_preset_3
{
description:
Complete information for Ability Preset 3

ability_preset_grade
string
Ability grade for Preset 3

ability_info
[
Information for Ability Preset 3

{
ability_no
string
Ability number

ability_grade
string
Ability grade

ability_value
string
Ability option and value

}
]
}
}

###############################################

GET
/maplestorysea/v1/character/item-equipment
Retrieve equipped equipment information (excluding cash items)

Retrieves information about equipped equipment, excluding cash items.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"character_gender": "string",
"character_class": "string",
"preset_no": 0,
"item_equipment": [
{
"item_equipment_part": "string",
"item_equipment_slot": "string",
"item_name": "string",
"item_icon": "string",
"item_description": "string",
"item_shape_name": "string",
"item_shape_icon": "string",
"item_gender": "string",
"item_total_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"ignore_monster_armor": "string",
"all_stat": "string",
"damage": "string",
"equipment_level_decrease": 0,
"max_hp_rate": "string",
"max_mp_rate": "string"
},
"item_base_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"ignore_monster_armor": "string",
"all_stat": "string",
"max_hp_rate": "string",
"max_mp_rate": "string",
"base_equipment_level": 0
},
"potential_option_flag": "string",
"additional_potential_option_flag": "string",
"potential_option_grade": "string",
"additional_potential_option_grade": "string",
"potential_option_1": "string",
"potential_option_2": "string",
"potential_option_3": "string",
"additional_potential_option_1": "string",
"additional_potential_option_2": "string",
"additional_potential_option_3": "string",
"equipment_level_increase": 0,
"item_exceptional_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"exceptional_upgrade": 0
},
"item_add_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"damage": "string",
"all_stat": "string",
"equipment_level_decrease": 0
},
"growth_exp": 0,
"growth_level": 0,
"scroll_upgrade": "string",
"cuttable_count": "string",
"golden_hammer_flag": "string",
"scroll_resilience_count": "string",
"scroll_upgradable_count": "string",
"soul_name": "string",
"soul_option": "string",
"item_etc_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string"
},
"starforce": "string",
"starforce_scroll_flag": "string",
"item_starforce_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string"
},
"special_ring_level": 0,
"date_expire": "2023-12-21T17:28+08:00",
"freestyle_flag": "string"
}
],
"item_equipment_preset_1": [
{
"item_equipment_part": "string",
"equipment_slot": "string",
"item_name": "string",
"item_icon": "string",
"item_description": "string",
"item_shape_name": "string",
"item_shape_icon": "string",
"item_gender": "string",
"item_total_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"ignore_monster_armor": "string",
"all_stat": "string",
"damage": "string",
"equipment_level_decrease": 0,
"max_hp_rate": "string",
"max_mp_rate": "string"
},
"item_base_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"ignore_monster_armor": "string",
"all_stat": "string",
"max_hp_rate": "string",
"max_mp_rate": "string",
"base_equipment_level": 0
},
"potential_option_grade": "string",
"additional_potential_option_grade": "string",
"potential_option_1": "string",
"potential_option_2": "string",
"potential_option_3": "string",
"additional_potential_option_1": "string",
"additional_potential_option_2": "string",
"additional_potential_option_3": "string",
"equipment_level_increase": 0,
"item_exceptional_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"exceptional_upgrade": 0
},
"item_add_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"damage": "string",
"all_stat": "string",
"equipment_level_decrease": 0
},
"growth_exp": 0,
"growth_level": 0,
"scroll_upgrade": "string",
"cuttable_count": "string",
"golden_hammer_flag": "string",
"scroll_resilience_count": "string",
"scroll_upgradable_count": "string",
"soul_name": "string",
"soul_option": "string",
"item_etc_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string"
},
"starforce": "string",
"starforce_scroll_flag": "string",
"item_starforce_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string"
},
"special_ring_level": 0,
"date_expire": "2023-12-21T17:28+08:00",
"freestyle_flag": "string"
}
],
"item_equipment_preset_2": [
{
"item_equipment_part": "string",
"equipment_slot": "string",
"item_name": "string",
"item_icon": "string",
"item_description": "string",
"item_shape_name": "string",
"item_shape_icon": "string",
"item_gender": "string",
"item_total_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"ignore_monster_armor": "string",
"all_stat": "string",
"damage": "string",
"equipment_level_decrease": 0,
"max_hp_rate": "string",
"max_mp_rate": "string"
},
"item_base_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"ignore_monster_armor": "string",
"all_stat": "string",
"max_hp_rate": "string",
"max_mp_rate": "string",
"base_equipment_level": 0
},
"potential_option_grade": "string",
"additional_potential_option_grade": "string",
"potential_option_1": "string",
"potential_option_2": "string",
"potential_option_3": "string",
"additional_potential_option_1": "string",
"additional_potential_option_2": "string",
"additional_potential_option_3": "string",
"equipment_level_increase": 0,
"item_exceptional_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"exceptional_upgrade": 0
},
"item_add_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"damage": "string",
"all_stat": "string",
"equipment_level_decrease": 0
},
"growth_exp": 0,
"growth_level": 0,
"scroll_upgrade": "string",
"cuttable_count": "string",
"golden_hammer_flag": "string",
"scroll_resilience_count": "string",
"scroll_upgradable_count": "string",
"soul_name": "string",
"soul_option": "string",
"item_etc_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string"
},
"starforce": "string",
"starforce_scroll_flag": "string",
"item_starforce_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string"
},
"special_ring_level": 0,
"date_expire": "2023-12-21T17:28+08:00",
"freestyle_flag": "string"
}
],
"item_equipment_preset_3": [
{
"item_equipment_part": "string",
"equipment_slot": "string",
"item_name": "string",
"item_icon": "string",
"item_description": "string",
"item_shape_name": "string",
"item_shape_icon": "string",
"item_gender": "string",
"item_total_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"ignore_monster_armor": "string",
"all_stat": "string",
"damage": "string",
"equipment_level_decrease": 0,
"max_hp_rate": "string",
"max_mp_rate": "string"
},
"item_base_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"ignore_monster_armor": "string",
"all_stat": "string",
"max_hp_rate": "string",
"max_mp_rate": "string",
"base_equipment_level": 0
},
"potential_option_grade": "string",
"additional_potential_option_grade": "string",
"potential_option_1": "string",
"potential_option_2": "string",
"potential_option_3": "string",
"additional_potential_option_1": "string",
"additional_potential_option_2": "string",
"additional_potential_option_3": "string",
"equipment_level_increase": 0,
"item_exceptional_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"exceptional_upgrade": 0
},
"item_add_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"damage": "string",
"all_stat": "string",
"equipment_level_decrease": 0
},
"growth_exp": 0,
"growth_level": 0,
"scroll_upgrade": "string",
"cuttable_count": "string",
"golden_hammer_flag": "string",
"scroll_resilience_count": "string",
"scroll_upgradable_count": "string",
"soul_name": "string",
"soul_option": "string",
"item_etc_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string"
},
"starforce": "string",
"starforce_scroll_flag": "string",
"item_starforce_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string"
},
"special_ring_level": 0,
"date_expire": "2023-12-21T17:28+08:00",
"freestyle_flag": "string"
}
],
"title": {
"title_name": "string",
"title_icon": "string",
"title_description": "string",
"date_expire": "2023-12-21T17:28+08:00",
"date_option_expire": "2023-12-21T17:28+08:00",
"title_shape_name": "string",
"title_shape_icon": "string",
"title_shape_description": "string"
},
"medal_shape": {
"medal_shape_name": "string",
"medal_shape_icon": "string",
"medal_shape_description": "string",
"medal_shape_changed_name": "string",
"medal_shape_changed_icon": "string",
"medal_shape_changed_description": "string"
},
"dragon_equipment": [
{
"item_equipment_part": "string",
"equipment_slot": "string",
"item_name": "string",
"item_icon": "string",
"item_description": "string",
"item_shape_name": "string",
"item_shape_icon": "string",
"item_gender": "string",
"item_total_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"ignore_monster_armor": "string",
"all_stat": "string",
"damage": "string",
"equipment_level_decrease": 0,
"max_hp_rate": "string",
"max_mp_rate": "string"
},
"item_base_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"ignore_monster_armor": "string",
"all_stat": "string",
"max_hp_rate": "string",
"max_mp_rate": "string",
"base_equipment_level": 0
},
"equipment_level_increase": 0,
"item_exceptional_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string"
},
"item_add_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"damage": "string",
"all_stat": "string",
"equipment_level_decrease": 0
},
"growth_exp": 0,
"growth_level": 0,
"scroll_upgrade": "string",
"cuttable_count": "string",
"golden_hammer_flag": "string",
"scroll_resilience_count": "string",
"scroll_upgradable_count": "string",
"soul_name": "string",
"soul_option": "string",
"item_etc_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string"
},
"starforce": "string",
"starforce_scroll_flag": "string",
"item_starforce_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string"
},
"special_ring_level": 0,
"date_expire": "2023-12-21T17:28+08:00",
"freestyle_flag": "string"
}
],
"mechanic_equipment": [
{
"item_equipment_part": "string",
"equipment_slot": "string",
"item_name": "string",
"item_icon": "string",
"item_description": "string",
"item_shape_name": "string",
"item_shape_icon": "string",
"item_gender": "string",
"item_total_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"ignore_monster_armor": "string",
"all_stat": "string",
"damage": "string",
"equipment_level_decrease": 0,
"max_hp_rate": "string",
"max_mp_rate": "string"
},
"item_base_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"ignore_monster_armor": "string",
"all_stat": "string",
"max_hp_rate": "string",
"max_mp_rate": "string",
"base_equipment_level": 0
},
"equipment_level_increase": 0,
"item_exceptional_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string"
},
"item_add_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string",
"boss_damage": "string",
"damage": "string",
"all_stat": "string",
"equipment_level_decrease": 0
},
"growth_exp": 0,
"growth_level": 0,
"scroll_upgrade": "string",
"cuttable_count": "string",
"golden_hammer_flag": "string",
"scroll_resilience_count": "string",
"scroll_upgradable_count": "string",
"soul_name": "string",
"soul_option": "string",
"item_etc_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string"
},
"starforce": "string",
"starforce_scroll_flag": "string",
"item_starforce_option": {
"str": "string",
"dex": "string",
"int": "string",
"luk": "string",
"max_hp": "string",
"max_mp": "string",
"attack_power": "string",
"magic_power": "string",
"armor": "string",
"speed": "string",
"jump": "string"
},
"special_ring_level": 0,
"date_expire": "2023-12-21T17:28+08:00",
"freestyle_flag": "string"
}
]
}

CharacterItemEquipment{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

character_gender
string
Character gender

character_class
string
Character job

preset_no
number($int64)
Active equipment preset number

item_equipment
[
Equipment information

{
item_equipment_part
string
Equipment part name

item_equipment_slot
string
Equipment slot position

item_name
string
Equipment name

item_icon
string
Equipment icon

item_description
string
Equipment description

item_shape_name
string
Equipment type

item_shape_icon
string
Equipment type icon

item_gender
string
Gender-specific equipment

item_total_option
{
description:
Final equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

ignore_monster_armor
string
Ignore Enemy Defense (%)

all_stat
string
All Stats (%)

damage
string
Damage (%)

equipment_level_decrease
number($int64)
Equipment level decreases

max_hp_rate
string
Max HP (%)

max_mp_rate
string
Max MP (%)

}
item_base_option
{
description:
Basic equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

ignore_monster_armor
string
Ignore Enemy Defense (%)

all_stat
string
All Stats (%)

max_hp_rate
string
Max HP (%)

max_mp_rate
string
Max MP (%)

base_equipment_level
number($int64)
Basic equipment level

}
potential_option_flag
string
Potential seal status (true:sealed, false:not sealed)

additional_potential_option_flag
string
Additional potential seal status (true:sealed, false:not sealed)

potential_option_grade
string
Potential grade

additional_potential_option_grade
string
Additional potential grade

potential_option_1
string
First Potential option

potential_option_2
string
Second Potential option

potential_option_3
string
Third Potential option

additional_potential_option_1
string
First additional Potential option

additional_potential_option_2
string
Second additional Potential option

additional_potential_option_3
string
Third additional Potential option

equipment_level_increase
number($int64)
Equipment level increase

item_exceptional_option
{
description:
Exceptional equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

exceptional_upgrade
number($int64)
Number of exceptional boost applications

}
item_add_option
{
description:
Additional equipment options

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

damage
string
Damage (%)

all_stat
string
All Stats (%)

equipment_level_decrease
number($int64)
Equipment level decrease

}
growth_exp
number($int64)
Growth EXP

growth_level
number($int64)
Growth level

scroll_upgrade
string
Number of upgrade attempts

cuttable_count
string
Number of scissors usage available (Untradable, 255 for equipment without scissors usage count)

golden_hammer_flag
string
Golden Hammer refinement applied (true:applied, false:not applied)

scroll_resilience_count
string
Number of restoration attempts available

scroll_upgradable_count
string
Number of upgrades available

soul_name
string
Soul name

soul_option
string
Soul option

item_etc_option
{
description:
Miscellaneous equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

}
starforce
string
Enhancement level

starforce_scroll_flag
string
Usage status of Miraculous Equip Enhancement Scroll (true:used, false:not used)

item_starforce_option
{
description:
Equipment Star Force option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

}
special_ring_level
number($int64)
Special Skill Ring

date_expire
string
example: 2023-12-21T17:28+08:00
Equipment expiration date (SGT)

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
]
item_equipment_preset_1
[
Equipment information for Preset 1

{
item_equipment_part
string
Equipment part name

equipment_slot
string
Equipment slot position

item_name
string
Equipment name

item_icon
string
Equipment icon

item_description
string
Equipment description

item_shape_name
string
Equipment type

item_shape_icon
string
Equipment type icon

item_gender
string
Gender-specific equipment

item_total_option
{
description:
Final equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

ignore_monster_armor
string
Ignore Enemy Defense (%)

all_stat
string
All Stats (%)

damage
string
Damage (%)

equipment_level_decrease
number($int64)
Equipment level decreases

max_hp_rate
string
Max HP (%)

max_mp_rate
string
Max MP (%)

}
item_base_option
{
description:
Basic equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

ignore_monster_armor
string
Ignore Enemy Defense (%)

all_stat
string
All Stats (%)

max_hp_rate
string
Max HP (%)

max_mp_rate
string
Max MP (%)

base_equipment_level
number($int64)
Basic equipment level

}
potential_option_grade
string
Potential grade

additional_potential_option_grade
string
Additional Potential grade

potential_option_1
string
First Potential option

potential_option_2
string
Second Potential option

potential_option_3
string
Third Potential option

additional_potential_option_1
string
First additional Potential option

additional_potential_option_2
string
Second additional Potential option

additional_potential_option_3
string
Third additional Potential option

equipment_level_increase
number($int64)
Equipment level increases

item_exceptional_option
{
description:
Exceptional equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

exceptional_upgrade
number($int64)
Number of exceptional boost applications

}
item_add_option
{
description:
Additional equipment options

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

damage
string
Damage (%)

all_stat
string
All Stats (%)

equipment_level_decrease
number($int64)
Equipment level decreases

}
growth_exp
number($int64)
Growth EXP

growth_level
number($int64)
Growth level

scroll_upgrade
string
Number of upgrades

cuttable_count
string
Number of scissors usage available (Untradable, 255 for equipment without scissors usage count)

golden_hammer_flag
string
Golden Hammer refinement applied (true:applied, false:not applied)

scroll_resilience_count
string
Number of restoration attempts available

scroll_upgradable_count
string
Number of upgrades available

soul_name
string
Soul name

soul_option
string
Soul option

item_etc_option
{
description:
Miscellaneous equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

}
starforce
string
Enhancement level

starforce_scroll_flag
string
Usage status of Miraculous Equip Enhancement Scroll (true:used, false:not used)

item_starforce_option
{
description:
Equipment Star Force option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

}
special_ring_level
number($int64)
Special Skill Ring

date_expire
string
example: 2023-12-21T17:28+08:00
Equipment expiration date (SGT)

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
]
item_equipment_preset_2
[
Equipment information for preset 2

{
item_equipment_part
string
Equipment part name

equipment_slot
string
Equipment slot position

item_name
string
Equipment name

item_icon
string
Equipment icon

item_description
string
Equipment description

item_shape_name
string
Equipment type

item_shape_icon
string
Equipment type icon

item_gender
string
Gender-specific equipment

item_total_option
{
description:
Final equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

ignore_monster_armor
string
Ignore Enemy Defense (%)

all_stat
string
All Stats (%)

damage
string
Damage (%)

equipment_level_decrease
number($int64)
Equipment level decreases

max_hp_rate
string
Max HP (%)

max_mp_rate
string
Max MP (%)

}
item_base_option
{
description:
Basic equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

ignore_monster_armor
string
Ignore Enemy Defense (%)

all_stat
string
All Stats (%)

max_hp_rate
string
Max HP (%)

max_mp_rate
string
Max MP (%)

base_equipment_level
number($int64)
Basic equipment level

}
potential_option_grade
string
Potential grade

additional_potential_option_grade
string
Additional Potential grade

potential_option_1
string
First Potential option

potential_option_2
string
Second Potential option

potential_option_3
string
Third Potential option

additional_potential_option_1
string
First additional Potential option

additional_potential_option_2
string
Second additional Potential option

additional_potential_option_3
string
Third additional Potential option

equipment_level_increase
number($int64)
Equipment level increases

item_exceptional_option
{
description:
Exceptional equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

exceptional_upgrade
number($int64)
Number of exceptional boost applications

}
item_add_option
{
description:
Additional equipment options

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

damage
string
Damage (%)

all_stat
string
All Stats (%)

equipment_level_decrease
number($int64)
Equipment level decreases

}
growth_exp
number($int64)
Growth EXP

growth_level
number($int64)
Growth level

scroll_upgrade
string
Number of upgrades

cuttable_count
string
Number of scissors usage available (Untradable, 255 for equipment without scissors usage count)

golden_hammer_flag
string
Golden Hammer refinement applied (true:applied, false:not applied)

scroll_resilience_count
string
Number of restoration attempts available

scroll_upgradable_count
string
Number of upgrades available

soul_name
string
Soul name

soul_option
string
Soul option

item_etc_option
{
description:
Miscellaneous equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

}
starforce
string
Enhancement level

starforce_scroll_flag
string
Usage status of Miraculous Equip Enhancement Scroll (true:used, false:not used)

item_starforce_option
{
description:
Equipment Star Force option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

}
special_ring_level
number($int64)
Special Skill Ring

date_expire
string
example: 2023-12-21T17:28+08:00
Equipment expiration date (SGT)

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
]
item_equipment_preset_3
[
Equipment information

{
item_equipment_part
string
Equipment part name

equipment_slot
string
Equipment slot position

item_name
string
Equipment name

item_icon
string
Equipment icon

item_description
string
Equipment description

item_shape_name
string
Equipment type

item_shape_icon
string
Equipment type icon

item_gender
string
Gender-specific equipment

item_total_option
{
description:
Final equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

ignore_monster_armor
string
Ignore Enemy Defense (%)

all_stat
string
All Stats (%)

damage
string
Damage (%)

equipment_level_decrease
number($int64)
Equipment level decreases

max_hp_rate
string
Max HP (%)

max_mp_rate
string
Max MP (%)

}
item_base_option
{
description:
Basic equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

ignore_monster_armor
string
Ignore Enemy Defense (%)

all_stat
string
All Stats (%)

max_hp_rate
string
Max HP (%)

max_mp_rate
string
Max MP (%)

base_equipment_level
number($int64)
Basic equipment level

}
potential_option_grade
string
Potential grade

additional_potential_option_grade
string
Additional Potential grade

potential_option_1
string
First Potential option

potential_option_2
string
Second Potential option

potential_option_3
string
Third Potential option

additional_potential_option_1
string
First additional Potential option

additional_potential_option_2
string
Second additional Potential option

additional_potential_option_3
string
Third additional Potential option

equipment_level_increase
number($int64)
Equipment level increases

item_exceptional_option
{
description:
Exceptional equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

exceptional_upgrade
number($int64)
Number of exceptional boost applications

}
item_add_option
{
description:
Additional equipment options

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

damage
string
Damage (%)

all_stat
string
All Stats (%)

equipment_level_decrease
number($int64)
Equipment level decreases

}
growth_exp
number($int64)
Growth EXP

growth_level
number($int64)
Growth level

scroll_upgrade
string
Number of upgrades

cuttable_count
string
Number of scissors usage available (Untradable, 255 for equipment without scissors usage count)

golden_hammer_flag
string
Golden Hammer refinement applied (true:applied, false:not applied)

scroll_resilience_count
string
Number of restoration attempts available

scroll_upgradable_count
string
Number of upgrades available

soul_name
string
Soul name

soul_option
string
Soul option

item_etc_option
{
description:
Miscellaneous equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

}
starforce
string
Enhancement level

starforce_scroll_flag
string
Usage status of Miraculous Equip Enhancement Scroll (true:used, false:not used)

item_starforce_option
{
description:
Equipment Star Force option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

}
special_ring_level
number($int64)
Special Skill Ring

date_expire
string
example: 2023-12-21T17:28+08:00
Equipment expiration date (SGT)

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
]
title
{
description:
Title information

title_name
string
Title name

title_icon
string
Title icon

title_description
string
Title description

date_expire
string
example: 2023-12-21T17:28+08:00
Title validity period (SGT)

date_option_expire
string
example: 2023-12-21T17:28+08:00
Title option validity period (expired:expired, null unlimited) (SGT)

title_shape_name
string
Title equipment name registered in the appearance settings

title_shape_icon
string
Title icon registered in the appearance settings

title_shape_description
string
Title description registered in the appearance settings

}
medal_shape
{
description:
Medal appearance information registered in the appearance settings

medal_shape_name
string
Medal equipment name registered in the appearance settings

medal_shape_icon
string
Medal icon registered in the appearance settings

medal_shape_description
string
Medal description registered in the appearance settings

medal_shape_changed_name
string
Fusion Anvil-applied medal equipment name registered in the appearance settings

medal_shape_changed_icon
string
Fusion Anvil-applied medal icon registered in the appearance settings

medal_shape_changed_description
string
Fusion Anvil-applied medal description registered in the appearance settings

}
dragon_equipment
[
Evan Dragon equipment information (response provided if the character is Evan)

{
item_equipment_part
string
Equipment part name

equipment_slot
string
Equipment slot position

item_name
string
Equipment name

item_icon
string
Equipment icon

item_description
string
Equipment description

item_shape_name
string
Equipment type

item_shape_icon
string
Equipment type icon

item_gender
string
Gender-specific equipment

item_total_option
{
description:
Final equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

ignore_monster_armor
string
Ignore Enemy Defense (%)

all_stat
string
All Stats (%)

damage
string
Damage (%)

equipment_level_decrease
number($int64)
Equipment level decreases

max_hp_rate
string
Max HP (%)

max_mp_rate
string
Max MP (%)

}
item_base_option
{
description:
Basic equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

ignore_monster_armor
string
Ignore Enemy Defense (%)

all_stat
string
All Stats (%)

max_hp_rate
string
Max HP (%)

max_mp_rate
string
Max MP (%)

base_equipment_level
number($int64)
Basic equipment level

}
equipment_level_increase
number($int64)
Equipment level increases

item_exceptional_option
{
description:
Exceptional equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

}
item_add_option
{
description:
Additional equipment options

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

damage
string
Damage (%)

all_stat
string
All Stats (%)

equipment_level_decrease
number($int64)
Equipment level decreases

}
growth_exp
number($int64)
Growth EXP

growth_level
number($int64)
Growth level

scroll_upgrade
string
Number of upgrades

cuttable_count
string
Number of scissors usage available (Untradable, 255 for equipment without scissors usage count)

golden_hammer_flag
string
Golden Hammer refinement applied (true:applied, false:not applied)

scroll_resilience_count
string
Number of restoration attempts available

scroll_upgradable_count
string
Number of upgrades available

soul_name
string
Soul name

soul_option
string
Soul option

item_etc_option
{
description:
Miscellaneous equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

}
starforce
string
Enhancement level

starforce_scroll_flag
string
Usage status of Miraculous Equip Enhancement Scroll (true:used, false:not used)

item_starforce_option
{
description:
Equipment Star Force option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

}
special_ring_level
number($int64)
Special Skill Ring

date_expire
string
example: 2023-12-21T17:28+08:00
Equipment expiration date (SGT)

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
]
mechanic_equipment
[
Mechanic equipment information (response provided if the character is a Mechanic)

{
item_equipment_part
string
Equipment part name

equipment_slot
string
Equipment slot position

item_name
string
Equipment name

item_icon
string
Equipment icon

item_description
string
Equipment description

item_shape_name
string
Equipment type

item_shape_icon
string
Equipment type icon

item_gender
string
Gender-specific equipment

item_total_option
{
description:
Final equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

ignore_monster_armor
string
Ignore Enemy Defense (%)

all_stat
string
All Stats (%)

damage
string
Damage (%)

equipment_level_decrease
number($int64)
Equipment level decreases

max_hp_rate
string
Max HP (%)

max_mp_rate
string
Max MP (%)

}
item_base_option
{
description:
Basic equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

ignore_monster_armor
string
Ignore Enemy Defense (%)

all_stat
string
All Stats (%)

max_hp_rate
string
Max HP (%)

max_mp_rate
string
Max MP (%)

base_equipment_level
number($int64)
Basic equipment level

}
equipment_level_increase
number($int64)
Equipment level increases

item_exceptional_option
{
description:
Exceptional equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

}
item_add_option
{
description:
Additional equipment options

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

boss_damage
string
Boss Damage (%)

damage
string
Damage (%)

all_stat
string
All Stats (%)

equipment_level_decrease
number($int64)
Equipment level decreases

}
growth_exp
number($int64)
Growth EXP

growth_level
number($int64)
Growth level

scroll_upgrade
string
Number of upgrades

cuttable_count
string
Number of scissors usage available (Untradable, 255 for equipment without scissors usage count)

golden_hammer_flag
string
Golden Hammer refinement applied (true:applied, false:not applied)

scroll_resilience_count
string
Number of restoration attempts available

scroll_upgradable_count
string
Number of upgrades available

soul_name
string
Soul name

soul_option
string
Soul option

item_etc_option
{
description:
Miscellaneous equipment option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

}
starforce
string
Enhancement level

starforce_scroll_flag
string
Usage status of Miraculous Equip Enhancement Scroll (true:used, false:not used)

item_starforce_option
{
description:
Equipment Star Force option information

str
string
STR

dex
string
DEX

int
string
INT

luk
string
LUK

max_hp
string
Max HP

max_mp
string
Max MP

attack_power
string
Attack Power

magic_power
string
Magic ATT

armor
string
Defense

speed
string
Speed

jump
string
Jump

}
special_ring_level
number($int64)
Special Skill Ring

date_expire
string
example: 2023-12-21T17:28+08:00
Equipment expiration date (SGT)

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
]
}

###############################################

GET
/maplestorysea/v1/character/cashitem-equipment
Retrieve equipped cash item information

Retrieves equipped cash item information.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"character_gender": "string",
"character_class": "string",
"character_look_mode": "string",
"preset_no": 0,
"cash_item_equipment_base": [
{
"cash_item_equipment_part": "string",
"cash_item_equipment_slot": "string",
"cash_item_name": "string",
"cash_item_icon": "string",
"cash_item_description": "string",
"cash_item_option": [
{
"option_type": "string",
"option_value": "string"
}
],
"date_expire": "2023-12-21T17:28+08:00",
"date_option_expire": "2023-12-21T17:00+08:00",
"cash_item_label": "string",
"cash_item_coloring_prism": {
"color_range": "string",
"hue": 0,
"saturation": 0,
"value": 0
},
"item_gender": "string",
"skills": [
"string"
],
"freestyle_flag": "string"
}
],
"cash_item_equipment_preset_1": [
{
"cash_item_equipment_part": "string",
"cash_item_equipment_slot": "string",
"cash_item_name": "string",
"cash_item_icon": "string",
"cash_item_description": "string",
"cash_item_option": [
{
"option_type": "string",
"option_value": "string"
}
],
"date_expire": "2023-12-21T17:28+08:00",
"date_option_expire": "2023-12-21T17:00+08:00",
"cash_item_label": "string",
"cash_item_coloring_prism": {
"color_range": "string",
"hue": 0,
"saturation": 0,
"value": 0
},
"item_gender": "string",
"skills": [
"string"
],
"freestyle_flag": "string"
}
],
"cash_item_equipment_preset_2": [
{
"cash_item_equipment_part": "string",
"cash_item_equipment_slot": "string",
"cash_item_name": "string",
"cash_item_icon": "string",
"cash_item_description": "string",
"cash_item_option": [
{
"option_type": "string",
"option_value": "string"
}
],
"date_expire": "2023-12-21T17:28+08:00",
"date_option_expire": "2023-12-21T17:00+08:00",
"cash_item_label": "string",
"cash_item_coloring_prism": {
"color_range": "string",
"hue": 0,
"saturation": 0,
"value": 0
},
"item_gender": "string",
"skills": [
"string"
],
"freestyle_flag": "string"
}
],
"cash_item_equipment_preset_3": [
{
"cash_item_equipment_part": "string",
"cash_item_equipment_slot": "string",
"cash_item_name": "string",
"cash_item_icon": "string",
"cash_item_description": "string",
"cash_item_option": [
{
"option_type": "string",
"option_value": "string"
}
],
"date_expire": "2023-12-21T17:28+08:00",
"date_option_expire": "2023-12-21T17:00+08:00",
"cash_item_label": "string",
"cash_item_coloring_prism": {
"color_range": "string",
"hue": 0,
"saturation": 0,
"value": 0
},
"item_gender": "string",
"skills": [
"string"
],
"freestyle_flag": "string"
}
],
"additional_cash_item_equipment_base": [
{
"cash_item_equipment_part": "string",
"cash_item_equipment_slot": "string",
"cash_item_name": "string",
"cash_item_icon": "string",
"cash_item_description": "string",
"cash_item_option": [
{
"option_type": "string",
"option_value": "string"
}
],
"date_expire": "2023-12-21T17:28+08:00",
"date_option_expire": "2023-12-21T17:00+08:00",
"cash_item_label": "string",
"cash_item_coloring_prism": {
"color_range": "string",
"hue": 0,
"saturation": 0,
"value": 0
},
"item_gender": "string",
"skills": [
"string"
],
"freestyle_flag": "string"
}
],
"additional_cash_item_equipment_preset_1": [
{
"cash_item_equipment_part": "string",
"cash_item_equipment_slot": "string",
"cash_item_name": "string",
"cash_item_icon": "string",
"cash_item_description": "string",
"cash_item_option": [
{
"option_type": "string",
"option_value": "string"
}
],
"date_expire": "2023-12-21T17:28+08:00",
"date_option_expire": "2023-12-21T17:00+08:00",
"cash_item_label": "string",
"cash_item_coloring_prism": {
"color_range": "string",
"hue": 0,
"saturation": 0,
"value": 0
},
"item_gender": "string",
"skills": [
"string"
],
"freestyle_flag": "string"
}
],
"additional_cash_item_equipment_preset_2": [
{
"cash_item_equipment_part": "string",
"cash_item_equipment_slot": "string",
"cash_item_name": "string",
"cash_item_icon": "string",
"cash_item_description": "string",
"cash_item_option": [
{
"option_type": "string",
"option_value": "string"
}
],
"date_expire": "2023-12-21T17:28+08:00",
"date_option_expire": "2023-12-21T17:00+08:00",
"cash_item_label": "string",
"cash_item_coloring_prism": {
"color_range": "string",
"hue": 0,
"saturation": 0,
"value": 0
},
"item_gender": "string",
"skills": [
"string"
],
"freestyle_flag": "string"
}
],
"additional_cash_item_equipment_preset_3": [
{
"cash_item_equipment_part": "string",
"cash_item_equipment_slot": "string",
"cash_item_name": "string",
"cash_item_icon": "string",
"cash_item_description": "string",
"cash_item_option": [
{
"option_type": "string",
"option_value": "string"
}
],
"date_expire": "2023-12-21T17:28+08:00",
"date_option_expire": "2023-12-21T17:00+08:00",
"cash_item_label": "string",
"cash_item_coloring_prism": {
"color_range": "string",
"hue": 0,
"saturation": 0,
"value": 0
},
"item_gender": "string",
"skills": [
"string"
],
"freestyle_flag": "string"
}
]
}

CharacterCashItemEquipment{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

character_gender
string
Character gender

character_class
string
Character job

character_look_mode
string
Character appearance mode (0:Normal mode, 1:Beta for Zero, Dress-up mode for Angelic Buster)

preset_no
number($int64)
Preset number for equipped cash item

cash_item_equipment_base
[
Equipped cash item

{
cash_item_equipment_part
string
Cash equipment part name

cash_item_equipment_slot
string
Cash equipment slot position

cash_item_name
string
Cash equipment name

cash_item_icon
string
Cash equipment icon

cash_item_description
string
Cash equipment description

cash_item_option
[
Cash equipment option

{
option_type
string
Option type

option_value
string
Option value

}
]
date_expire
string
example: 2023-12-21T17:28+08:00
Cash equipment validity period (SGT)

date_option_expire
string
example: 2023-12-21T17:00+08:00
Cash equipment option validity period (SGT, data with minutes set to 0)

cash_item_label
string
Cash equipment label information

cash_item_coloring_prism
{
description:
Cash equipment coloring prism information

color_range
string
Coloring prism color range

hue
number($int64)
Coloring prism hue

saturation
number($int64)
Coloring prism saturation

value
number($int64)
Coloring prism brightness

}
item_gender
string
Gender compatibility for item equipment

skills
[
Skill name

string
]
freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
]
cash_item_equipment_preset_1
[
Costmetic item preset 1

{
cash_item_equipment_part
string
Cash equipment part name

cash_item_equipment_slot
string
Cash equipment slot position

cash_item_name
string
Cash equipment name

cash_item_icon
string
Cash equipment icon

cash_item_description
string
Cash equipment description

cash_item_option
[
Cash equipment option

{
option_type
string
Option type

option_value
string
Option value

}
]
date_expire
string
example: 2023-12-21T17:28+08:00
Cash equipment validity period (SGT)

date_option_expire
string
example: 2023-12-21T17:00+08:00
Cash equipment option validity period (SGT, daily data with hours and minutes set to 0)

cash_item_label
string
Cash equipment label information

cash_item_coloring_prism
{
description:
Cash equipment coloring prism information

color_range
string
Coloring prism color range

hue
number($int64)
Coloring prism hue

saturation
number($int64)
Coloring prism saturation

value
number($int64)
Coloring prism brightness

}
item_gender
string
Gender compatibility for item equipment

skills
[
Skill name

string
]
freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
]
cash_item_equipment_preset_2
[
Cosmetic item preset 2

{
cash_item_equipment_part
string
Cash equipment part name

cash_item_equipment_slot
string
Cash equipment slot position

cash_item_name
string
Cash equipment name

cash_item_icon
string
Cash equipment icon

cash_item_description
string
Cash equipment description

cash_item_option
[
Cash equipment option

{
option_type
string
Option type

option_value
string
Option value

}
]
date_expire
string
example: 2023-12-21T17:28+08:00
Cash equipment option validity period (SGT)

date_option_expire
string
example: 2023-12-21T17:00+08:00
Cash equipment option validity period (SGT, daily data with hours and minutes set to 0)

cash_item_label
string
Cash equipment label information

cash_item_coloring_prism
{
description:
Cash equipment coloring prism information

color_range
string
Coloring prism color range

hue
number($int64)
Coloring prism hue

saturation
number($int64)
Coloring prism saturation

value
number($int64)
Coloring prism brightness

}
item_gender
string
Gender compatibility for item equipment

skills
[
Skill name

string
]
freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
]
cash_item_equipment_preset_3
[
Cosmetic item preset 3

{
cash_item_equipment_part
string
Cash equipment part name

cash_item_equipment_slot
string
Cash equipment slot position

cash_item_name
string
Cash equipment name

cash_item_icon
string
Cash equipment icon

cash_item_description
string
Cash equipment description

cash_item_option
[
Cash equipment option

{
option_type
string
Option type

option_value
string
Option value

}
]
date_expire
string
example: 2023-12-21T17:28+08:00
Cash equipment option validity period (SGT)

date_option_expire
string
example: 2023-12-21T17:00+08:00
Cash equipment option validity period (SGT, daily data with hours and minutes set to 0)

cash_item_label
string
Cash equipment label information

cash_item_coloring_prism
{
description:
Cash equipment coloring prism information

color_range
string
Coloring prism color range

hue
number($int64)
Coloring prism hue

saturation
number($int64)
Coloring prism saturation

value
number($int64)
Coloring prism brightness

}
item_gender
string
Gender compatibility for item equipment

skills
[
Skill name

string
]
freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
]
additional_cash_item_equipment_base
[
Equipped cash items for Beta mode (if Zero) or Dress-up mode (if Angelic Buster)

{
cash_item_equipment_part
string
Cash equipment part name

cash_item_equipment_slot
string
Cash equipment slot position

cash_item_name
string
Cash equipment name

cash_item_icon
string
Cash equipment icon

cash_item_description
string
Cash equipment description

cash_item_option
[
Cash equipment option

{
option_type
string
Option type

option_value
string
Option value

}
]
date_expire
string
example: 2023-12-21T17:28+08:00
Cash equipment option validity period (SGT)

date_option_expire
string
example: 2023-12-21T17:00+08:00
Cash equipment option validity period (SGT, daily data with hours and minutes set to 0)

cash_item_label
string
Cash equipment label information

cash_item_coloring_prism
{
description:
Cash equipment coloring prism information

color_range
string
Coloring prism color range

hue
number($int64)
Coloring prism hue

saturation
number($int64)
Coloring prism saturation

value
number($int64)
Coloring prism brightness

}
item_gender
string
Gender compatibility for item equipment

skills
[
Skill name

string
]
freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
]
additional_cash_item_equipment_preset_1
[
Cosmetic item preset 1 for Beta mode (if Zero) or Dress-up mode (if Angelic Buster)

{
cash_item_equipment_part
string
Cash equipment part name

cash_item_equipment_slot
string
Cash equipment slot position

cash_item_name
string
Cash equipment name

cash_item_icon
string
Cash equipment icon

cash_item_description
string
Cash equipment description

cash_item_option
[
Cash equipment option

{
option_type
string
Option type

option_value
string
Option value

}
]
date_expire
string
example: 2023-12-21T17:28+08:00
Cash equipment option validity period (SGT)

date_option_expire
string
example: 2023-12-21T17:00+08:00
Cash equipment option validity period (SGT, daily data with hours and minutes set to 0)

cash_item_label
string
Cash equipment label information

cash_item_coloring_prism
{
description:
Cash equipment coloring prism information

color_range
string
Coloring prism color range

hue
number($int64)
Coloring prism hue

saturation
number($int64)
Coloring prism saturation

value
number($int64)
Coloring prism brightness

}
item_gender
string
Gender compatibility for item equipment

skills
[
Skill name

string
]
freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
]
additional_cash_item_equipment_preset_2
[
Cosmetic item preset 2 for Beta mode (if Zero) or Dress-up mode (if Angelic Buster)

{
cash_item_equipment_part
string
Cash equipment part name

cash_item_equipment_slot
string
Cash equipment slot position

cash_item_name
string
Cash equipment name

cash_item_icon
string
Cash equipment icon

cash_item_description
string
Cash equipment description

cash_item_option
[
Cash equipment option

{
option_type
string
Option type

option_value
string
Option value

}
]
date_expire
string
example: 2023-12-21T17:28+08:00
Item validity period (SGT)

date_option_expire
string
example: 2023-12-21T17:00+08:00
Cash equipment option validity period (SGT, daily data with hours and minutes set to 0)

cash_item_label
string
Cash equipment label information

cash_item_coloring_prism
{
description:
Cash equipment coloring prism information

color_range
string
Coloring prism color range

hue
number($int64)
Coloring prism hue

saturation
number($int64)
Coloring prism saturation

value
number($int64)
Coloring prism brightness

}
item_gender
string
Gender compatibility for item equipment

skills
[
Skill name

string
]
freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
]
additional_cash_item_equipment_preset_3
[
Cosmetic item preset 3 for Beta mode (if Zero) or Dress-up mode (if Angelic Buster)

{
cash_item_equipment_part
string
Cash equipment part name

cash_item_equipment_slot
string
Cash equipment slot position

cash_item_name
string
Cash equipment name

cash_item_icon
string
Cash equipment icon

cash_item_description
string
Cash equipment description

cash_item_option
[
Cash equipment option

{
option_type
string
Option type

option_value
string
Option value

}
]
date_expire
string
example: 2023-12-21T17:28+08:00
Cash equipment option validity period (SGT)

date_option_expire
string
example: 2023-12-21T17:00+08:00
Cash equipment option validity period (SGT, daily data with hours and minutes set to 0)

cash_item_label
string
Cash equipment label information

cash_item_coloring_prism
{
description:
Cash equipment coloring prism information

color_range
string
Coloring prism color range

hue
number($int64)
Coloring prism hue

saturation
number($int64)
Coloring prism saturation

value
number($int64)
Coloring prism brightness

}
item_gender
string
Gender compatibility for item equipment

skills
[
Skill name

string
]
freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
]
}

###############################################

GET
/maplestorysea/v1/character/symbol-equipment
Retrieve equipped symbol information

Retrieves information about equipped symbols.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"character_class": "string",
"symbol": [
{
"symbol_name": "string",
"symbol_icon": "string",
"symbol_description": "string",
"symbol_force": "string",
"symbol_level": 0,
"symbol_str": "string",
"symbol_dex": "string",
"symbol_int": "string",
"symbol_luk": "string",
"symbol_hp": "string",
"symbol_drop_rate": "string",
"symbol_meso_rate": "string",
"symbol_exp_rate": "string",
"symbol_growth_count": 0,
"symbol_require_growth_count": 0
}
]
}

CharacterSymbolEquipment{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

character_class
string
Character job

symbol
[
Symbol information

{
symbol_name
string
Symbol name

symbol_icon
string
Symbol icon

symbol_description
string
Symbol description

symbol_force
string
Increase in stats due to the symbol

symbol_level
number($int64)
Symbol level

symbol_str
string
Increase in Strength due to the symbol

symbol_dex
string
Increase in Dexterity due to the symbol

symbol_int
string
Increase in Intelligence due to the symbol

symbol_luk
string
Increase in Luck due to the symbol

symbol_hp
string
Increase in HP due to the symbol

symbol_drop_rate
string
Increase in item drop rate due to the symbol

symbol_meso_rate
string
Increase in Meso acquisition rate due to the symbol

symbol_exp_rate
string
Increase in EXP acquisition rate due to the symbol

symbol_growth_count
number($int64)
Current growth points

symbol_require_growth_count
number($int64)
Growth points required for the next level

}
]
}

###############################################

GET
/maplestorysea/v1/character/set-effect
Retrieve information about equipped set item effects

Retrieves information about equipped set item effects.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"set_effect": [
{
"set_name": "string",
"total_set_count": 0,
"set_effect_info": [
{
"set_count": 0,
"set_option": "string"
}
],
"set_option_full": [
{
"set_count": 0,
"set_option": "string"
}
]
}
]
}

CharacterSetEffect{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

set_effect
[
Set Item effect information

{
set_name
string
Set Item effect name

total_set_count
number($int64)
Number of Set Items (including Lucky Items)

set_effect_info
[
Active Set Item effect information

{
set_count
number($int64)
Set Item effect level (number of equipped items)

set_option
string
Set Item effect

}
]
set_option_full
[
All Set Item effect information

{
set_count
number($int64)
Set Item effect level (number of equipped items)

set_option
string
Set Item effect

}
]
}
]
}

###############################################

GET
/maplestorysea/v1/character/beauty-equipment
Retrieve equipped hair, face, and skin information

Retrieves information about equipped hair, face, and skin.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"character_gender": "string",
"character_class": "string",
"character_hair": {
"hair_name": "string",
"base_color": "string",
"mix_color": "string",
"mix_rate": "string",
"freestyle_flag": "string"
},
"character_face": {
"face_name": "string",
"base_color": "string",
"mix_color": "string",
"mix_rate": "string",
"freestyle_flag": "string"
},
"character_skin": {
"skin_name": "string",
"color_style": "string",
"hue": 0,
"saturation": 0,
"brightness": 0
},
"additional_character_hair": {
"hair_name": "string",
"base_color": "string",
"mix_color": "string",
"mix_rate": "string",
"freestyle_flag": "string"
},
"additional_character_face": {
"face_name": "string",
"base_color": "string",
"mix_color": "string",
"mix_rate": "string",
"freestyle_flag": "string"
},
"additional_character_skin": {
"skin_name": "string",
"color_style": "string",
"hue": 0,
"saturation": 0,
"brightness": 0
}
}

CharacterBeautyEquipment{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT)

character_gender
string
Character gender

character_class
string
Character job

character_hair
{
description:
Character hair information
(Alpha mode for Zero, Normal mode for Angelic Buster)

hair_name
string
Hair name

base_color
string
Base hair color

mix_color
string
Mixed hair color

mix_rate
string
Dye ratio for mixed hair color

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
character_face
{
description:
Character face information
(Alpha mode for Zero, Normal mode for Angelic Buster)

face_name
string
Face name

base_color
string
Base face color

mix_color
string
Mixed face color

mix_rate
string
Dye ratio for mixed face color

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
character_skin
{
description:
Character skin information
(Alpha mode for Zero, Normal mode for Angelic Buster)

skin_name
string
Skin name

color_style
string
Color style

hue
number($int64)
Skin hue

saturation
number($int64)
Skin saturation

brightness
number($int64)
Skin brightness

}
additional_character_hair
{
description:
Hair information applied in Beta mode for Zero or Dress-up mode for Angelic Buster

hair_name
string
Hair name

base_color
string
Base hair color

mix_color
string
Mixed hair color

mix_rate
string
Dye ratio for mixed hair color

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
additional_character_face
{
description:
Face information applied in Beta mode for Zero or Dress-up mode for Angelic Buster

face_name
string
Face name

base_color
string
Base face color

mix_color
string
Mixed face color

mix_rate
string
Dye ratio for mixed face color

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
additional_character_skin
{
description:
Skin information applied in Beta mode for Zero or Dress-up mode for Angelic Buster

skin_name
string
Skin name

color_style
string
Color style

hue
number($int64)
Skin hue

saturation
number($int64)
Skin saturation

brightness
number($int64)
Skin brightness

}
}

GET
/maplestorysea/v1/character/android-equipment
Retrieve equipped android information

Retrieves equipped android information.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"android_name": "string",
"android_nickname": "string",
"android_icon": "string",
"android_description": "string",
"android_hair": {
"hair_name": "string",
"base_color": "string",
"mix_color": "string",
"mix_rate": "string",
"freestyle_flag": "string"
},
"android_face": {
"face_name": "string",
"base_color": "string",
"mix_color": "string",
"mix_rate": "string",
"freestyle_flag": "string"
},
"android_skin": {
"skin_name": "string",
"color_style": "string",
"hue": 0,
"saturation": 0,
"brightness": 0
},
"android_cash_item_equipment": [
{
"cash_item_equipment_part": "string",
"cash_item_equipment_slot": "string",
"cash_item_name": "string",
"cash_item_icon": "string",
"cash_item_description": "string",
"cash_item_option": [
{
"option_type": "string",
"option_value": "string"
}
],
"date_expire": "2023-12-21T17:28+08:00",
"date_option_expire": "2023-12-21T17:00+08:00",
"cash_item_label": "string",
"cash_item_coloring_prism": {
"color_range": "string",
"hue": 0,
"saturation": 0,
"value": 0
},
"android_item_gender": "string",
"freestyle_flag": "string"
}
],
"android_ear_sensor_clip_flag": "string",
"android_gender": "string",
"android_grade": "string",
"android_non_humanoid_flag": "string",
"android_shop_usable_flag": "string",
"preset_no": 0,
"android_preset_1": {
"android_name": "string",
"android_nickname": "string",
"android_icon": "string",
"android_description": "string",
"android_gender": "string",
"android_grade": "string",
"android_skin": {
"skin_name": "string",
"color_style": "string",
"hue": 0,
"saturation": 0,
"brightness": 0
},
"android_hair": {
"hair_name": "string",
"base_color": "string",
"mix_color": "string",
"mix_rate": "string",
"freestyle_flag": "string"
},
"android_face": {
"face_name": "string",
"base_color": "string",
"mix_color": "string",
"mix_rate": "string",
"freestyle_flag": "string"
},
"android_ear_sensor_clip_flag": "string",
"android_non_humanoid_flag": "string",
"android_shop_usable_flag": "string"
},
"android_preset_2": {
"android_name": "string",
"android_nickname": "string",
"android_icon": "string",
"android_description": "string",
"android_gender": "string",
"android_grade": "string",
"android_skin": {
"skin_name": "string",
"color_style": "string",
"hue": 0,
"saturation": 0,
"brightness": 0
},
"android_hair": {
"hair_name": "string",
"base_color": "string",
"mix_color": "string",
"mix_rate": "string",
"freestyle_flag": "string"
},
"android_face": {
"face_name": "string",
"base_color": "string",
"mix_color": "string",
"mix_rate": "string",
"freestyle_flag": "string"
},
"android_ear_sensor_clip_flag": "string",
"android_non_humanoid_flag": "string",
"android_shop_usable_flag": "string"
},
"android_preset_3": {
"android_name": "string",
"android_nickname": "string",
"android_icon": "string",
"android_description": "string",
"android_gender": "string",
"android_grade": "string",
"android_skin": {
"skin_name": "string",
"color_style": "string",
"hue": 0,
"saturation": 0,
"brightness": 0
},
"android_hair": {
"hair_name": "string",
"base_color": "string",
"mix_color": "string",
"mix_rate": "string",
"freestyle_flag": "string"
},
"android_face": {
"face_name": "string",
"base_color": "string",
"mix_color": "string",
"mix_rate": "string",
"freestyle_flag": "string"
},
"android_ear_sensor_clip_flag": "string",
"android_non_humanoid_flag": "string",
"android_shop_usable_flag": "string"
}
}

CharacterAndroidEquipment{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

android_name
string
Android name

android_nickname
string
Android nickname

android_icon
string
Android icon

android_description
string
Android item description

android_hair
{
description:
Android hair information

hair_name
string
Android hair name

base_color
string
Android base hair color

mix_color
string
Android mixed hair color

mix_rate
string
Dye ratio for Android mixed hair color

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
android_face
{
description:
Android face information

face_name
string
Android face name

base_color
string
Android base face color

mix_color
string
Android mixed face color

mix_rate
string
Dye ratio for Android mixed face color

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
android_skin
{
description:
Android skin information

skin_name
string
Skin name

color_style
string
Color style

hue
number($int64)
Skin hue

saturation
number($int64)
Skin saturation

brightness
number($int64)
Skin brightness

}
android_cash_item_equipment
[
Android cash item equipment information

{
cash_item_equipment_part
string
Android cash item part name

cash_item_equipment_slot
string
Android cash item slot position

cash_item_name
string
Android cash item name

cash_item_icon
string
Android cash item icon

cash_item_description
string
Android cash item description

cash_item_option
[
Android cash item options

{
option_type
string
Option type

option_value
string
Option value

}
]
date_expire
string
example: 2023-12-21T17:28+08:00
Android cash item validity period (SGT)

date_option_expire
string
example: 2023-12-21T17:00+08:00
Android cash item option validity period (SGT, data with minutes set to 0)

cash_item_label
string
Android cash item label information (e.g., Special Label, Red Label, Black Label, Master Label)

cash_item_coloring_prism
{
description:
Android cash item coloring prism information

color_range
string
Coloring prism color range

hue
number($int64)
Coloring prism hue

saturation
number($int64)
Coloring prism saturation

value
number($int64)
Coloring prism brightness

}
android_item_gender
string
Gender compatibility for item equipment

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
]
android_ear_sensor_clip_flag
string
Whether the Android ear sensor clip is applied

android_gender
string
Android gender

android_grade
string
Android grade

android_non_humanoid_flag
string
Whether the Android is non-humanoid

android_shop_usable_flag
string
Whether the Android can use the general store functionality

preset_no
number($int64)
Active equipment preset number

android_preset_1
{
description:
Android information for preset 1

android_name
string
Android name

android_nickname
string
Android nickname

android_icon
string
Android icon

android_description
string
Android item description

android_gender
string
Android gender

android_grade
string
Android grade

android_skin
{
description:
Android skin information

skin_name
string
Skin name

color_style
string
Color style

hue
number($int64)
Skin hue

saturation
number($int64)
Skin saturation

brightness
number($int64)
Skin brightness

}
android_hair
{
description:
Android hair information

hair_name
string
Android hair name

base_color
string
Android base hair color

mix_color
string
Android mixed hair color

mix_rate
string
Dye ratio for Android mixed hair color

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
android_face
{
description:
Android face information

face_name
string
Android face name

base_color
string
Android base face color

mix_color
string
Android mixed face color

mix_rate
string
Dye ratio for Android mixed face color

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
android_ear_sensor_clip_flag
string
Whether the Android ear sensor clip is applied

android_non_humanoid_flag
string
Whether the Android is non-humanoid

android_shop_usable_flag
string
Whether the Android can use the general store functionality

}
android_preset_2
{
description:
Android information for preset 2

android_name
string
Android name

android_nickname
string
Android nickname

android_icon
string
Android icon

android_description
string
Android item description

android_gender
string
Android gender

android_grade
string
Android grade

android_skin
{
description:
Android skin information

skin_name
string
Skin name

color_style
string
Color style

hue
number($int64)
Skin hue

saturation
number($int64)
Skin saturation

brightness
number($int64)
Skin brightness

}
android_hair
{
description:
Android hair information

hair_name
string
Android hair name

base_color
string
Android base hair color

mix_color
string
Android mixed hair color

mix_rate
string
Dye ratio for Android mixed hair color

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
android_face
{
description:
Android face information

face_name
string
Android face name

base_color
string
Android base face color

mix_color
string
Android mixed face color

mix_rate
string
Dye ratio for Android mixed face color

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
android_ear_sensor_clip_flag
string
Whether the Android ear sensor clip is applied

android_non_humanoid_flag
string
Whether the Android is non-humanoid

android_shop_usable_flag
string
Whether the Android can use the general store functionality

}
android_preset_3
{
description:
Android information for preset 3

android_name
string
Android name

android_nickname
string
Android nickname

android_icon
string
Android icon

android_description
string
Android item description

android_gender
string
Android gender

android_grade
string
Android grade

android_skin
{
description:
Android skin information

skin_name
string
Skin name

color_style
string
Color style

hue
number($int64)
Skin hue

saturation
number($int64)
Skin saturation

brightness
number($int64)
Skin brightness

}
android_hair
{
description:
Android hair information

hair_name
string
Android hair name

base_color
string
Android base hair color

mix_color
string
Android mixed hair color

mix_rate
string
Dye ratio for Android mixed hair color

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
android_face
{
description:
Android face information

face_name
string
Android face name

base_color
string
Android base face color

mix_color
string
Android mixed face color

mix_rate
string
Dye ratio for Android mixed face color

freestyle_flag
string
Freestyle Coupon application status (0:not applied, 1:applied)

}
android_ear_sensor_clip_flag
string
Whether the Android ear sensor clip is applied

android_non_humanoid_flag
string
Whether the Android is non-humanoid

android_shop_usable_flag
string
Whether the Android can use the general store functionality

}
}

###############################################

GET
/maplestorysea/v1/character/pet-equipment
Retrieve equipped pet information

Retrieves information about equipped pets, including pet skills and equipment.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"pet_1_name": "string",
"pet_1_nickname": "string",
"pet_1_icon": "string",
"pet_1_description": "string",
"pet_1_equipment": {
"item_name": "string",
"item_icon": "string",
"item_description": "string",
"item_option": [
{
"option_type": "string",
"option_value": "string"
}
],
"scroll_upgrade": 0,
"scroll_upgradable": 0,
"item_shape": "string",
"item_shape_icon": "string"
},
"pet_1_auto_skill": {
"skill_1": "string",
"skill_1_icon": "string",
"skill_2": "string",
"skill_2_icon": "string"
},
"pet_1_pet_type": "string",
"pet_1_skill": [
"string"
],
"pet_1_date_expire": "2023-12-21T17:00+08:00",
"pet_1_appearance": "string",
"pet_1_appearance_icon": "string",
"pet_2_name": "string",
"pet_2_nickname": "string",
"pet_2_icon": "string",
"pet_2_description": "string",
"pet_2_equipment": {
"item_name": "string",
"item_icon": "string",
"item_description": "string",
"item_option": [
{
"option_type": "string",
"option_value": "string"
}
],
"scroll_upgrade": 0,
"scroll_upgradable": 0,
"item_shape": "string",
"item_shape_icon": "string"
},
"pet_2_auto_skill": {
"skill_1": "string",
"skill_1_icon": "string",
"skill_2": "string",
"skill_2_icon": "string"
},
"pet_2_pet_type": "string",
"pet_2_skill": [
"string"
],
"pet_2_date_expire": "2023-12-21T17:00+08:00",
"pet_2_appearance": "string",
"pet_2_appearance_icon": "string",
"pet_3_name": "string",
"pet_3_nickname": "string",
"pet_3_icon": "string",
"pet_3_description": "string",
"pet_3_equipment": {
"item_name": "string",
"item_icon": "string",
"item_description": "string",
"item_option": [
{
"option_type": "string",
"option_value": "string"
}
],
"scroll_upgrade": 0,
"scroll_upgradable": 0,
"item_shape": "string",
"item_shape_icon": "string"
},
"pet_3_auto_skill": {
"skill_1": "string",
"skill_1_icon": "string",
"skill_2": "string",
"skill_2_icon": "string"
},
"pet_3_pet_type": "string",
"pet_3_skill": [
"string"
],
"pet_3_date_expire": "2023-12-21T17:00+08:00",
"pet_3_appearance": "string",
"pet_3_appearance_icon": "string"
}

CharacterPetEquipment{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

pet_1_name
string
Name of pet 1

pet_1_nickname
string
Nickname of pet 1

pet_1_icon
string
Icon of pet 1

pet_1_description
string
Description of pet 1

pet_1_equipment
{
description:
Equipment information for pet 1

item_name
string
Item name

item_icon
string
Item icon

item_description
string
Item description

item_option
[
Displayed item options

{
option_type
string
Option type

option_value
string
Option value

}
]
scroll_upgrade
number($int64)
Number of upgrades

scroll_upgradable
number($int64)
Number of upgrades available

item_shape
string
Item appearance

item_shape_icon
string
Item appearance icon

}
pet_1_auto_skill
{
description:
Auto buff skill information for pet 1

skill_1
string
Auto skill registered in the first slot

skill_1_icon
string
Icon for the auto skill in the first slot

skill_2
string
Auto skill registered in the second slot

skill_2_icon
string
Icon for the auto skill in the second slot

}
pet_1_pet_type
string
Wonder pet type of pet 1

pet_1_skill
[
Skills possessed by pet 1

string
]
pet_1_date_expire
string
example: 2023-12-21T17:00+08:00
Magic time for pet 1 (SGT, data with minutes set to 0)

pet_1_appearance
string
Appearance of pet 1

pet_1_appearance_icon
string
Appearance icon of pet 1

pet_2_name
string
Name of pet 2

pet_2_nickname
string
Nickname of pet 2

pet_2_icon
string
Icon of pet 2

pet_2_description
string
Description of pet 2

pet_2_equipment
{
description:
Equipment information for pet 2

item_name
string
Item name

item_icon
string
Item icon

item_description
string
Item description

item_option
[
Displayed item options

{
option_type
string
Option type

option_value
string
Option value

}
]
scroll_upgrade
number($int64)
Number of upgrades

scroll_upgradable
number($int64)
Number of upgrades available

item_shape
string
Item appearance

item_shape_icon
string
Item appearance icon

}
pet_2_auto_skill
{
description:
Auto buff skill information for pet 2

skill_1
string
Auto skill registered in the first slot

skill_1_icon
string
Icon for the auto skill in the first slot

skill_2
string
Auto skill registered in the second slot

skill_2_icon
string
Icon for the auto skill in the second slot

}
pet_2_pet_type
string
Wonder pet type of pet 2

pet_2_skill
[
Skills possessed by pet 2

string
]
pet_2_date_expire
string
example: 2023-12-21T17:00+08:00
Magic time for pet 2 (SGT, data with minutes set to 0)

pet_2_appearance
string
Appearance of pet 2

pet_2_appearance_icon
string
Appearance icon of pet 2

pet_3_name
string
Name of pet 3

pet_3_nickname
string
Nickname of pet 3

pet_3_icon
string
Icon of pet 3

pet_3_description
string
Description of pet 3

pet_3_equipment
{
description:
Equipment information for pet 3

item_name
string
Item name

item_icon
string
Item icon

item_description
string
Item description

item_option
[
Displayed item options

{
option_type
string
Option type

option_value
string
Option value

}
]
scroll_upgrade
number($int64)
Number of upgrades

scroll_upgradable
number($int64)
Number of upgrades available

item_shape
string
Item appearance

item_shape_icon
string
Item appearance icon

}
pet_3_auto_skill
{
description:
Auto buff skill information for pet 3

skill_1
string
Auto skill registered in the first slot

skill_1_icon
string
Icon for the auto skill in the first slot

skill_2
string
Auto skill registered in the second slot

skill_2_icon
string
Icon for the auto skill in the second slot

}
pet_3_pet_type
string
Wonder pet type of pet 3

pet_3_skill
[
Skills possessed by pet 3

string
]
pet_3_date_expire
string
example: 2023-12-21T17:00+08:00
Magic time for pet 3 (SGT, data with minutes set to 0)

pet_3_appearance
string
Appearance of pet 3

pet_3_appearance_icon
string
Appearance icon of pet 3

}

###############################################

GET
/maplestorysea/v1/character/pet-equipment
Retrieve equipped pet information

Retrieves information about equipped pets, including pet skills and equipment.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"pet_1_name": "string",
"pet_1_nickname": "string",
"pet_1_icon": "string",
"pet_1_description": "string",
"pet_1_equipment": {
"item_name": "string",
"item_icon": "string",
"item_description": "string",
"item_option": [
{
"option_type": "string",
"option_value": "string"
}
],
"scroll_upgrade": 0,
"scroll_upgradable": 0,
"item_shape": "string",
"item_shape_icon": "string"
},
"pet_1_auto_skill": {
"skill_1": "string",
"skill_1_icon": "string",
"skill_2": "string",
"skill_2_icon": "string"
},
"pet_1_pet_type": "string",
"pet_1_skill": [
"string"
],
"pet_1_date_expire": "2023-12-21T17:00+08:00",
"pet_1_appearance": "string",
"pet_1_appearance_icon": "string",
"pet_2_name": "string",
"pet_2_nickname": "string",
"pet_2_icon": "string",
"pet_2_description": "string",
"pet_2_equipment": {
"item_name": "string",
"item_icon": "string",
"item_description": "string",
"item_option": [
{
"option_type": "string",
"option_value": "string"
}
],
"scroll_upgrade": 0,
"scroll_upgradable": 0,
"item_shape": "string",
"item_shape_icon": "string"
},
"pet_2_auto_skill": {
"skill_1": "string",
"skill_1_icon": "string",
"skill_2": "string",
"skill_2_icon": "string"
},
"pet_2_pet_type": "string",
"pet_2_skill": [
"string"
],
"pet_2_date_expire": "2023-12-21T17:00+08:00",
"pet_2_appearance": "string",
"pet_2_appearance_icon": "string",
"pet_3_name": "string",
"pet_3_nickname": "string",
"pet_3_icon": "string",
"pet_3_description": "string",
"pet_3_equipment": {
"item_name": "string",
"item_icon": "string",
"item_description": "string",
"item_option": [
{
"option_type": "string",
"option_value": "string"
}
],
"scroll_upgrade": 0,
"scroll_upgradable": 0,
"item_shape": "string",
"item_shape_icon": "string"
},
"pet_3_auto_skill": {
"skill_1": "string",
"skill_1_icon": "string",
"skill_2": "string",
"skill_2_icon": "string"
},
"pet_3_pet_type": "string",
"pet_3_skill": [
"string"
],
"pet_3_date_expire": "2023-12-21T17:00+08:00",
"pet_3_appearance": "string",
"pet_3_appearance_icon": "string"
}

CharacterPetEquipment{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

pet_1_name
string
Name of pet 1

pet_1_nickname
string
Nickname of pet 1

pet_1_icon
string
Icon of pet 1

pet_1_description
string
Description of pet 1

pet_1_equipment
{
description:
Equipment information for pet 1

item_name
string
Item name

item_icon
string
Item icon

item_description
string
Item description

item_option
[
Displayed item options

{
option_type
string
Option type

option_value
string
Option value

}
]
scroll_upgrade
number($int64)
Number of upgrades

scroll_upgradable
number($int64)
Number of upgrades available

item_shape
string
Item appearance

item_shape_icon
string
Item appearance icon

}
pet_1_auto_skill
{
description:
Auto buff skill information for pet 1

skill_1
string
Auto skill registered in the first slot

skill_1_icon
string
Icon for the auto skill in the first slot

skill_2
string
Auto skill registered in the second slot

skill_2_icon
string
Icon for the auto skill in the second slot

}
pet_1_pet_type
string
Wonder pet type of pet 1

pet_1_skill
[
Skills possessed by pet 1

string
]
pet_1_date_expire
string
example: 2023-12-21T17:00+08:00
Magic time for pet 1 (SGT, data with minutes set to 0)

pet_1_appearance
string
Appearance of pet 1

pet_1_appearance_icon
string
Appearance icon of pet 1

pet_2_name
string
Name of pet 2

pet_2_nickname
string
Nickname of pet 2

pet_2_icon
string
Icon of pet 2

pet_2_description
string
Description of pet 2

pet_2_equipment
{
description:
Equipment information for pet 2

item_name
string
Item name

item_icon
string
Item icon

item_description
string
Item description

item_option
[
Displayed item options

{
option_type
string
Option type

option_value
string
Option value

}
]
scroll_upgrade
number($int64)
Number of upgrades

scroll_upgradable
number($int64)
Number of upgrades available

item_shape
string
Item appearance

item_shape_icon
string
Item appearance icon

}
pet_2_auto_skill
{
description:
Auto buff skill information for pet 2

skill_1
string
Auto skill registered in the first slot

skill_1_icon
string
Icon for the auto skill in the first slot

skill_2
string
Auto skill registered in the second slot

skill_2_icon
string
Icon for the auto skill in the second slot

}
pet_2_pet_type
string
Wonder pet type of pet 2

pet_2_skill
[
Skills possessed by pet 2

string
]
pet_2_date_expire
string
example: 2023-12-21T17:00+08:00
Magic time for pet 2 (SGT, data with minutes set to 0)

pet_2_appearance
string
Appearance of pet 2

pet_2_appearance_icon
string
Appearance icon of pet 2

pet_3_name
string
Name of pet 3

pet_3_nickname
string
Nickname of pet 3

pet_3_icon
string
Icon of pet 3

pet_3_description
string
Description of pet 3

pet_3_equipment
{
description:
Equipment information for pet 3

item_name
string
Item name

item_icon
string
Item icon

item_description
string
Item description

item_option
[
Displayed item options

{
option_type
string
Option type

option_value
string
Option value

}
]
scroll_upgrade
number($int64)
Number of upgrades

scroll_upgradable
number($int64)
Number of upgrades available

item_shape
string
Item appearance

item_shape_icon
string
Item appearance icon

}
pet_3_auto_skill
{
description:
Auto buff skill information for pet 3

skill_1
string
Auto skill registered in the first slot

skill_1_icon
string
Icon for the auto skill in the first slot

skill_2
string
Auto skill registered in the second slot

skill_2_icon
string
Icon for the auto skill in the second slot

}
pet_3_pet_type
string
Wonder pet type of pet 3

pet_3_skill
[
Skills possessed by pet 3

string
]
pet_3_date_expire
string
example: 2023-12-21T17:00+08:00
Magic time for pet 3 (SGT, data with minutes set to 0)

pet_3_appearance
string
Appearance of pet 3

pet_3_appearance_icon
string
Appearance icon of pet 3

}

###############################################

GET
/maplestorysea/v1/character/skill
Retrieve skill information

Retrieves information about character skills and Hyper Skills.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
character_skill_grade
string
(query)
Job advancement tier to query

0: 0th job skills and Zero shared skills
1: 1st job skills
1.5: 1.5th job skills
2: 2nd job skills
2.5: 2.5th job skills
3: 3rd job skills
4: 4th job skills and Zero Alpha/Beta skills
hyperpassive: Hyper passive skills
hyperactive: Hyper active skills
5: 5th job skills
6: 6th job skills
Available values : 0, 1, 1.5, 2, 2.5, 3, 4, hyperpassive, hyperactive, 5, 6

1
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"character_class": "string",
"character_skill_grade": "string",
"character_skill": [
{
"skill_name": "string",
"skill_description": "string",
"skill_level": 0,
"skill_effect": "string",
"skill_effect_next": "string",
"skill_icon": "string"
}
]
}

CharacterSkill{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

character_class
string
Character job

character_skill_grade
string
Job advancement tier required to acquire the skill

character_skill
[
Skill information

{
skill_name
string
Skill name

skill_description
string
Skill description

skill_level
number($int64)
Skill level

skill_effect
string
Effect description by skill level

skill_effect_next
string
Effect description for the next skill level

skill_icon
string
Skill icon

}
]
}

###############################################

GET
/maplestorysea/v1/character/link-skill
Retrieve equipped Link Skill information

Retrieves information about equipped Link Skills.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"character_class": "string",
"character_link_skill": [
{
"skill_name": "string",
"skill_description": "string",
"skill_level": 0,
"skill_effect": "string",
"skill_effect_next": "string",
"skill_icon": "string"
}
],
"character_link_skill_preset_1": [
{
"skill_name": "string",
"skill_description": "string",
"skill_level": 0,
"skill_effect": "string",
"skill_icon": "string"
}
],
"character_link_skill_preset_2": [
{
"skill_name": "string",
"skill_description": "string",
"skill_level": 0,
"skill_effect": "string",
"skill_icon": "string"
}
],
"character_link_skill_preset_3": [
{
"skill_name": "string",
"skill_description": "string",
"skill_level": 0,
"skill_effect": "string",
"skill_icon": "string"
}
],
"character_owned_link_skill": {
"skill_name": "string",
"skill_description": "string",
"skill_level": 0,
"skill_effect": "string",
"skill_icon": "string"
},
"character_owned_link_skill_preset_1": {
"skill_name": "string",
"skill_description": "string",
"skill_level": 0,
"skill_effect": "string",
"skill_icon": "string"
},
"character_owned_link_skill_preset_2": {
"skill_name": "string",
"skill_description": "string",
"skill_level": 0,
"skill_effect": "string",
"skill_icon": "string"
},
"character_owned_link_skill_preset_3": {
"skill_name": "string",
"skill_description": "string",
"skill_level": 0,
"skill_effect": "string",
"skill_icon": "string"
}
}

CharacterLinkSkill{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

character_class
string
Character job

character_link_skill
[
Link Skill information

{
skill_name
string
Skill name

skill_description
string
Skill description

skill_level
number($int64)
Skill level

skill_effect
string
Skill effect

skill_effect_next
string
Effect for the next skill level

skill_icon
string
Skill icon

}
]
character_link_skill_preset_1
[
Link Skill information for preset 1

{
skill_name
string
Skill name

skill_description
string
Skill description

skill_level
number($int64)
Skill level

skill_effect
string
Skill effect

skill_icon
string
Skill icon

}
]
character_link_skill_preset_2
[
Link Skill information for preset 2

{
skill_name
string
Skill name

skill_description
string
Skill description

skill_level
number($int64)
Skill level

skill_effect
string
Skill effect

skill_icon
string
Skill icon

}
]
character_link_skill_preset_3
[
Link Skill information for preset 3

{
skill_name
string
Skill name

skill_description
string
Skill description

skill_level
number($int64)
Skill level

skill_effect
string
Skill effect

skill_icon
string
Skill icon

}
]
character_owned_link_skill
{
description:
My Link Skill information

skill_name
string
Skill name

skill_description
string
Skill description

skill_level
number($int64)
Skill level

skill_effect
string
Skill effect

skill_icon
string
Skill icon

}
character_owned_link_skill_preset_1
{
description:
My Link Skill information for preset 1

skill_name
string
Skill name

skill_description
string
Skill description

skill_level
number($int64)
Skill level

skill_effect
string
Skill effect

skill_icon
string
Skill icon

}
character_owned_link_skill_preset_2
{
description:
My Link Skill information for preset 2

skill_name
string
Skill name

skill_description
string
Skill description

skill_level
number($int64)
Skill level

skill_effect
string
Skill effect

skill_icon
string
Skill icon

}
character_owned_link_skill_preset_3
{
description:
My Link Skill information for preset 3

skill_name
string
Skill name

skill_description
string
Skill description

skill_level
number($int64)
Skill level

skill_effect
string
Skill effect

skill_icon
string
Skill icon

}
}

###############################################

GET
/maplestorysea/v1/character/vmatrix
Retrieve V Matrix information

Retrieves V Matrix slot and equipped Node information.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"character_class": "string",
"character_v_core_equipment": [
{
"slot_id": "string",
"slot_level": 0,
"v_core_name": "string",
"v_core_type": "string",
"v_core_level": 0,
"v_core_skill_1": "string",
"v_core_skill_2": "string",
"v_core_skill_3": "string"
}
],
"character_v_matrix_remain_slot_upgrade_point": 0
}

CharacterVMatrix{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

character_class
string
Character job

character_v_core_equipment
[
V Matrix Node information

{
slot_id
string
Slot index

slot_level
number($int64)
Slot level

v_core_name
string
Node name

v_core_type
string
Node type

v_core_level
number($int64)
Node level

v_core_skill_1
string
Name of the skill that corresponds to the node

v_core_skill_2
string
Name of the second skill that corresponds to the node (for Boost Nodes)

v_core_skill_3
string
Name of the third skill that corresponds to the node (for Boost Nodes)

}
]
character_v_matrix_remain_slot_upgrade_point
number($int64)
Remaining Matrix enhancement points for the character

}

###############################################

GET
/maplestorysea/v1/character/hexamatrix
Retrieve HEXA Node information.

Retrieves information about HEXA Nodes equipped in the HEXA Matrix.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"character_hexa_core_equipment": [
{
"hexa_core_name": "string",
"hexa_core_level": 0,
"hexa_core_type": "string",
"linked_skill": [
{
"hexa_skill_id": "string"
}
]
}
]
}

CharacterHexaMatrix{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

character_hexa_core_equipment
[
HEXA Node information

{
hexa_core_name
string
Node name

hexa_core_level
number($int64)
Node level

hexa_core_type
string
Node type

linked_skill
[
Linked skill

{
hexa_skill_id
string
HEXA Skill name

}
]
}
]
}

###############################################

GET
/maplestorysea/v1/character/hexamatrix-stat
Retrieve HEXA Matrix configured HEXA stats information

Retrieves information about HEXA stats configured in the HEXA Matrix.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"character_class": "string",
"character_hexa_stat_core": [
{
"slot_id": "string",
"main_stat_name": "string",
"sub_stat_name_1": "string",
"sub_stat_name_2": "string",
"main_stat_level": 0,
"sub_stat_level_1": 0,
"sub_stat_level_2": 0,
"stat_grade": 0
}
],
"character_hexa_stat_core_2": [
{
"slot_id": "string",
"main_stat_name": "string",
"sub_stat_name_1": "string",
"sub_stat_name_2": "string",
"main_stat_level": 0,
"sub_stat_level_1": 0,
"sub_stat_level_2": 0,
"stat_grade": 0
}
],
"character_hexa_stat_core_3": [
{
"slot_id": "string",
"main_stat_name": "string",
"sub_stat_name_1": "string",
"sub_stat_name_2": "string",
"main_stat_level": 0,
"sub_stat_level_1": 0,
"sub_stat_level_2": 0,
"stat_grade": 0
}
],
"preset_hexa_stat_core": [
{
"slot_id": "string",
"main_stat_name": "string",
"sub_stat_name_1": "string",
"sub_stat_name_2": "string",
"main_stat_level": 0,
"sub_stat_level_1": 0,
"sub_stat_level_2": 0,
"stat_grade": 0
}
],
"preset_hexa_stat_core_2": [
{
"slot_id": "string",
"main_stat_name": "string",
"sub_stat_name_1": "string",
"sub_stat_name_2": "string",
"main_stat_level": 0,
"sub_stat_level_1": 0,
"sub_stat_level_2": 0,
"stat_grade": 0
}
],
"preset_hexa_stat_core_3": [
{
"slot_id": "string",
"main_stat_name": "string",
"sub_stat_name_1": "string",
"sub_stat_name_2": "string",
"main_stat_level": 0,
"sub_stat_level_1": 0,
"sub_stat_level_2": 0,
"stat_grade": 0
}
]
}

CharacterHexaMatrixStat{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

character_class
string
Character job

character_hexa_stat_core
[
Information for HEXA Stat Node I

{
slot_id
string
Slot index

main_stat_name
string
Main Stat name

sub_stat_name_1
string
First sub stat name

sub_stat_name_2
string
Second sub stat name

main_stat_level
number($int64)
Main Stat level

sub_stat_level_1
number($int64)
First sub stat level

sub_stat_level_2
number($int64)
Second sub stat level

stat_grade
number($int64)
Stat core level

}
]
character_hexa_stat_core_2
[
Information for HEXA Stat Node II

{
slot_id
string
Slot index

main_stat_name
string
Main Stat name

sub_stat_name_1
string
First sub stat name

sub_stat_name_2
string
Second sub stat name

main_stat_level
number($int64)
Main Stat level

sub_stat_level_1
number($int64)
First sub stat level

sub_stat_level_2
number($int64)
Second sub stat level

stat_grade
number($int64)
Stat core level

}
]
character_hexa_stat_core_3
[
Information for HEXA Stat Node III

{
slot_id
string
Slot index

main_stat_name
string
Main Stat name

sub_stat_name_1
string
First sub stat name

sub_stat_name_2
string
Second sub stat name

main_stat_level
number($int64)
Main Stat level

sub_stat_level_1
number($int64)
First sub stat level

sub_stat_level_2
number($int64)
Second sub stat level

stat_grade
number($int64)
Stat core level

}
]
preset_hexa_stat_core
[
Preset HEXA Stat Node I information

{
slot_id
string
Slot index

main_stat_name
string
Main Stat name

sub_stat_name_1
string
First sub stat name

sub_stat_name_2
string
Second sub stat name

main_stat_level
number($int64)
Main Stat level

sub_stat_level_1
number($int64)
First sub stat level

sub_stat_level_2
number($int64)
Second sub stat level

stat_grade
number($int64)
Stat core level

}
]
preset_hexa_stat_core_2
[
Preset HEXA Stat Node II information

{
slot_id
string
Slot index

main_stat_name
string
Main Stat name

sub_stat_name_1
string
First sub stat name

sub_stat_name_2
string
Second sub stat name

main_stat_level
number($int64)
Main Stat level

sub_stat_level_1
number($int64)
First sub stat level

sub_stat_level_2
number($int64)
Second sub stat level

stat_grade
number($int64)
Stat core level

}
]
preset_hexa_stat_core_3
[
Preset HEXA Stat Node III information

{
slot_id
string
Slot index

main_stat_name
string
Main Stat name

sub_stat_name_1
string
First sub stat name

sub_stat_name_2
string
Second sub stat name

main_stat_level
number($int64)
Main Stat level

sub_stat_level_1
number($int64)
First sub stat level

sub_stat_level_2
number($int64)
Second sub stat level

stat_grade
number($int64)
Stat core level

}
]
}

###############################################

GET
/maplestorysea/v1/character/dojang
Retrieve Mu Lung Garden highest record information

Retrieves the character's highest record information in Mu Lung Garden.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"character_class": "string",
"world_name": "string",
"dojang_best_floor": 0,
"date_dojang_record": "2025-01-21T00:00+08:00",
"dojang_best_time": 0
}

CharacterDojang{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

character_class
string
Character job

world_name
string
World name

dojang_best_floor
number($int64)
Highest floor record in Mu Lung Garden

date_dojang_record
string
example: 2025-01-21T00:00+08:00
Achievement date of the highest Mu Lung Garden record (SGT, daily data with hours and minutes set to 0)

dojang_best_time
number($int64)
Time taken to clear the highest floor in Mu Lung Garden (in seconds)

}

===============================================================

MapleStory game data can be verified approximately 15 minutes after updates.
Data is available starting from April 20, 2025.
Historical data can be queried by specifying the desired date, and data from the previous day can be accessed starting at 2 AM the next day. (For example, when querying data for December 22, data from 00:00 to 24:00 on December 22 will be retrieved.)
Due to game content changes, the ocid may be updated. Please pay attention to this when updating services based on ocid.
This API provides data for MapleStory SEA.

Union
Retrieve Union information

GET
/maplestorysea/v1/user/union
Retrieve Union information

Retrieves Union level and Union rank information.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"union_level": 0,
"union_grade": "string",
"union_artifact_level": 0,
"union_artifact_exp": 0,
"union_artifact_point": 0
}

Union{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

union_level
number($int64)
Union level

union_grade
string
Union grade

union_artifact_level
number($int64)
Artifact level

union_artifact_exp
number($int64)
Earned Artifact EXP

union_artifact_point
number($int64)
Earned Artifact Points

}

###############################################

GET
/maplestorysea/v1/user/union-raider
Retrieve Union Raider information

Retrieves detailed information about raid member effects and capture effects deployed in the Union.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"union_raider_stat": [
"string"
],
"union_occupied_stat": [
"string"
],
"union_inner_stat": [
{
"stat_field_id": "string",
"stat_field_effect": "string"
}
],
"union_block": [
{
"block_type": "string",
"block_class": "string",
"block_level": "string",
"block_control_point": {
"x": 0,
"y": 0
},
"block_position": [
{
"x": 0,
"y": 0
}
]
}
],
"use_preset_no": 0,
"union_raider_preset_1": {
"union_raider_stat": [
"string"
],
"union_occupied_stat": [
"string"
],
"union_inner_stat": [
{
"stat_field_id": "string",
"stat_field_effect": "string"
}
],
"union_block": [
{
"block_type": "string",
"block_class": "string",
"block_level": "string",
"block_control_point": {
"x": 0,
"y": 0
},
"block_position": [
{
"x": 0,
"y": 0
}
]
}
]
},
"union_raider_preset_2": {
"union_raider_stat": [
"string"
],
"union_occupied_stat": [
"string"
],
"union_inner_stat": [
{
"stat_field_id": "string",
"stat_field_effect": "string"
}
],
"union_block": [
{
"block_type": "string",
"block_class": "string",
"block_level": "string",
"block_control_point": {
"x": 0,
"y": 0
},
"block_position": [
{
"x": 0,
"y": 0
}
]
}
]
},
"union_raider_preset_3": {
"union_raider_stat": [
"string"
],
"union_occupied_stat": [
"string"
],
"union_inner_stat": [
{
"stat_field_id": "string",
"stat_field_effect": "string"
}
],
"union_block": [
{
"block_type": "string",
"block_class": "string",
"block_level": "string",
"block_control_point": {
"x": 0,
"y": 0
},
"block_position": [
{
"x": 0,
"y": 0
}
]
}
]
},
"union_raider_preset_4": {
"union_raider_stat": [
"string"
],
"union_occupied_stat": [
"string"
],
"union_inner_stat": [
{
"stat_field_id": "string",
"stat_field_effect": "string"
}
],
"union_block": [
{
"block_type": "string",
"block_class": "string",
"block_level": "string",
"block_control_point": {
"x": 0,
"y": 0
},
"block_position": [
{
"x": 0,
"y": 0
}
]
}
]
},
"union_raider_preset_5": {
"union_raider_stat": [
"string"
],
"union_occupied_stat": [
"string"
],
"union_inner_stat": [
{
"stat_field_id": "string",
"stat_field_effect": "string"
}
],
"union_block": [
{
"block_type": "string",
"block_class": "string",
"block_level": "string",
"block_control_point": {
"x": 0,
"y": 0
},
"block_position": [
{
"x": 0,
"y": 0
}
]
}
]
}
}

UnionRaider{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

union_raider_stat
[
Union raid member effects

string
]
union_occupied_stat
[
Union raid capture effects

string
]
union_inner_stat
[
Union raider deployment

{
stat_field_id
string
Raider deployment position (0 to 7, clockwise from 11 o'clock)

stat_field_effect
string
Occupation effects over the area

}
]
union_block
[
Union Legion Block

{
block_type
string
Block shapes (Warrior, Magician, Bowman, Thief, Pirate, Maple M, Hybrid)

block_class
string
Character class corresponding to the block

block_level
string
Character level corresponding to the block

block_control_point
{
description:
Coordinates of the block's reference point:

The bottom-right square among the four central squares is positioned at x: 0, y: 0.
Moving one square to the left decreases x by 1.
Moving one square to the right increases x by 1.
Moving one square downward decreases y by 1.
Moving one square upward increases y by 1.
x
number($int64)
Block reference point X-coordinate

y
number($int64)
Block reference point Y-coordinate

}
block_position
[
Coordinates of the area occupied by the block (null if not placed)

{
x
number($int64)
Block X-coordinate

y
number($int64)
Block Y-coordinate

}
]
}
]
use_preset_no
number($int64)
Number of the preset currently in use

union_raider_preset_1
{
description:
Information for Union Preset 1

union_raider_stat
[
Union raid member effects

string
]
union_occupied_stat
[
Union raid capture effects

string
]
union_inner_stat
[
Union raider deployment

{
stat_field_id
string
Raider deployment position (0 to 7, clockwise from 11 o'clock)

stat_field_effect
string
Occupation effects over the area

}
]
union_block
[
Information about Legion Blocks

{
block_type
string
Block shapes (Warrior, Magician, Bowman, Thief, Pirate, Maple M, Hybrid)

block_class
string
Character class corresponding to the block

block_level
string
Character level corresponding to the block

block_control_point
{
description:
Coordinates of the block's reference point:

The bottom-right square among the four central squares is positioned at x: 0, y: 0.
Moving one square to the left decreases x by 1.
Moving one square to the right increases x by 1.
Moving one square downward decreases y by 1.
Moving one square upward increases y by 1.
x
number($int64)
Block reference point X-coordinate

y
number($int64)
Block reference point Y-coordinate

}
block_position
[
Coordinates of the area occupied by the block (null if not placed)

{
x
number($int64)
Block X-coordinate

y
number($int64)
Block Y-coordinate

}
]
}
]
}
union_raider_preset_2
{
description:
Information for Union Preset 2

union_raider_stat
[
Union raid member effects

string
]
union_occupied_stat
[
Union raid capture effects

string
]
union_inner_stat
[
Union raider deployment

{
stat_field_id
string
Raider deployment position (0 to 7, clockwise from 11 o'clock)

stat_field_effect
string
Occupation effects over the area

}
]
union_block
[
Information about Legion Blocks

{
block_type
string
Block shapes (Warrior, Magician, Bowman, Thief, Pirate, Maple M, Hybrid)

block_class
string
Character class corresponding to the block

block_level
string
Character level corresponding to the block

block_control_point
{
description:
Coordinates of the block's reference point:

The bottom-right square among the four central squares is positioned at x: 0, y: 0.
Moving one square to the left decreases x by 1.
Moving one square to the right increases x by 1.
Moving one square downward decreases y by 1.
Moving one square upward increases y by 1.
x
number($int64)
Block reference point X-coordinate

y
number($int64)
Block reference point Y-coordinate

}
block_position
[
Coordinates of the area occupied by the block (null if not placed)

{
x
number($int64)
Block X-coordinate

y
number($int64)
Block Y-coordinate

}
]
}
]
}
union_raider_preset_3
{
description:
Information for Union Preset 3

union_raider_stat
[
Union raid member effects

string
]
union_occupied_stat
[
Union raid capture effects

string
]
union_inner_stat
[
Union raider deployment

{
stat_field_id
string
Raider deployment position (0 to 7, clockwise from 11 o'clock)

stat_field_effect
string
Occupation effects over the area

}
]
union_block
[
Information about Legion Blocks

{
block_type
string
Block shapes (Warrior, Magician, Bowman, Thief, Pirate, Maple M, Hybrid)

block_class
string
Character class corresponding to the block

block_level
string
Character level corresponding to the block

block_control_point
{
description:
Coordinates of the block's reference point:

The bottom-right square among the four central squares is positioned at x: 0, y: 0.
Moving one square to the left decreases x by 1.
Moving one square to the right increases x by 1.
Moving one square downward decreases y by 1.
Moving one square upward increases y by 1.
x
number($int64)
Block reference point X-coordinate

y
number($int64)
Block reference point Y-coordinate

}
block_position
[
Coordinates of the area occupied by the block (null if not placed)

{
x
number($int64)
Block X-coordinate

y
number($int64)
Block Y-coordinate

}
]
}
]
}
union_raider_preset_4
{
description:
Information for Union Preset 4

union_raider_stat
[
Union raid member effects

string
]
union_occupied_stat
[
Union raid capture effects

string
]
union_inner_stat
[
Union raider deployment

{
stat_field_id
string
Raider deployment position (0 to 7, clockwise from 11 o'clock)

stat_field_effect
string
Occupation effects over the area

}
]
union_block
[
Information about Legion Blocks

{
block_type
string
Block shapes (Warrior, Magician, Bowman, Thief, Pirate, Maple M, Hybrid)

block_class
string
Character class corresponding to the block

block_level
string
Character level corresponding to the block

block_control_point
{
description:
Coordinates of the block's reference point:

The bottom-right square among the four central squares is positioned at x: 0, y: 0.
Moving one square to the left decreases x by 1.
Moving one square to the right increases x by 1.
Moving one square downward decreases y by 1.
Moving one square upward increases y by 1.
x
number($int64)
Block reference point X-coordinate

y
number($int64)
Block reference point Y-coordinate

}
block_position
[
Coordinates of the area occupied by the block (null if not placed)

{
x
number($int64)
Block X-coordinate

y
number($int64)
Block Y-coordinate

}
]
}
]
}
union_raider_preset_5
{
description:
Information for Union Preset 5

union_raider_stat
[
Union raid member effects

string
]
union_occupied_stat
[
Union raid capture effects

string
]
union_inner_stat
[
Union raider deployment

{
stat_field_id
string
Raider deployment position (0 to 7, clockwise from 11 o'clock)

stat_field_effect
string
Occupation effects over the area

}
]
union_block
[
Information about Legion Blocks

{
block_type
string
Block shapes (Warrior, Magician, Bowman, Thief, Pirate, Maple M, Hybrid)

block_class
string
Character class corresponding to the block

block_level
string
Character level corresponding to the block

block_control_point
{
description:
Coordinates of the block's reference point:

The bottom-right square among the four central squares is positioned at x: 0, y: 0.
Moving one square to the left decreases x by 1.
Moving one square to the right increases x by 1.
Moving one square downward decreases y by 1.
Moving one square upward increases y by 1.
x
number($int64)
Block reference point X-coordinate

y
number($int64)
Block reference point Y-coordinate

}
block_position
[
Coordinates of the area occupied by the block (null if not placed)

{
x
number($int64)
Block X-coordinate

y
number($int64)
Block Y-coordinate

}
]
}
]
}
}

###############################################

GET
/maplestorysea/v1/user/union-artifact
Retrieve Union Artifact information

Retrieves Union Artifact information.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"union_artifact_effect": [
{
"name": "string",
"level": 0
}
],
"union_artifact_crystal": [
{
"name": "string",
"validity_flag": "string",
"date_expire": "2023-12-21T17:28+08:00",
"level": 0,
"crystal_option_name_1": "string",
"crystal_option_name_2": "string",
"crystal_option_name_3": "string"
}
],
"union_artifact_remain_ap": 0
}

UnionArtifact{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

union_artifact_effect
[
Artifact effect information

{
name
string
Name of the artifact effect

level
number($int64)
Level of the artifact effect

}
]
union_artifact_crystal
[
Artifact crystal information

{
name
string
Name of the artifact crystal

validity_flag
string
Validity of the stat (0:Valid, 1:Invalid)

date_expire
string
example: 2023-12-21T17:28+08:00
Expiration date of the stat (SGT)

level
number($int64)
Grade of the artifact crystal

crystal_option_name_1
string
First option of the artifact crystal

crystal_option_name_2
string
Second option of the artifact crystal

crystal_option_name_3
string
Third option of the artifact crystal

}
]
union_artifact_remain_ap
number($int64)
Remaining artifact AP

}

###############################################

GET
/maplestorysea/v1/user/union-champion
Retrieve Union Champion information

Retrieves Union Champion information.
You can view data starting from December 18, 2025.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
ocid
string
(query)
Character identifier

ocid
date
string
(query)
Reference date for query (KST, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T17:28+08:00",
"union_champion": [
{
"champion_name": "string",
"champion_slot": 0,
"champion_grade": "string",
"champion_class": "string",
"champion_badge_info": [
{
"stat": "string"
}
]
}
],
"champion_badge_total_info": [
{
"stat": "string"
}
]
}

UnionChampion{
date
string
example: 2025-01-21T17:28+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

union_champion
[
Union Champion information

{
champion_name
string
Union Champion character name

champion_slot
number($int64)
Union Champion slot

champion_grade
string
Union Champion level

champion_class
string
Union Champion character's job

champion_badge_info
[
Union Champion Insignia information

{
stat
string
Union Champion Insignia information

}
]
}
]
champion_badge_total_info
[
Champion Insignia effects

{
stat
string
Union Champion Insignia effects

}
]
}

===============================================================
MapleStory game data can be verified approximately 15 minutes after updates.
Data is available starting from April 20, 2025.
Historical data can be queried by specifying the desired date, and data from the previous day can be accessed starting at 2 AM the next day. (For example, when querying data for December 22, data from 00:00 to 24:00 on December 22 will be retrieved.)
Due to game content changes, the ocid may be updated. Please pay attention to this when updating services based on ocid.
This API provides data for MapleStory SEA.
Guild
Retrieve guild information

GET
/maplestorysea/v1/guild/id
Retrieve guild identifier (oguild_id) information

Retrieves information for the guild identifier (oguild_id).

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
guild_name
string
(query)
Guild name

guild_name
world_name
string
(query)
World name

Available values : Aquila, Bootes, Cassiopeia, Draco, Burning

Aquila
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"oguild_id": "string"
}

Guild{
oguild_id
string
Guild identifier

}

###############################################

GET
/maplestorysea/v1/guild/basic
Retrieve basic information

Retrieves basic information.

Parameters
Try it out
Name Description
x-nxopen-api-key
string
(header)
API KEY

x-nxopen-api-key
oguild_id
string
(query)
Guild identifier

oguild_id
date
string
(query)
Reference date for query (SGT, YYYY-MM-DD)

date
Responses
Code DescriptionLinks
200
SUCCESS

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"date": "2025-01-21T00:00+08:00",
"world_name": "string",
"guild_name": "string",
"guild_level": 0,
"guild_fame": 0,
"guild_point": 0,
"guild_master_name": "string",
"guild_member_count": 0,
"guild_member": [
"string"
],
"guild_skill": [
{
"skill_name": "string",
"skill_description": "string",
"skill_level": 0,
"skill_effect": "string",
"skill_icon": "string"
}
],
"guild_noblesse_skill": [
{
"skill_name": "string",
"skill_description": "string",
"skill_level": 0,
"skill_effect": "string",
"skill_icon": "string"
}
]
}

GuildBasic{
date
string
example: 2025-01-21T00:00+08:00
Reference date for query (SGT, daily data with hours and minutes set to 0)

world_name
string
World name

guild_name
string
Guild name

guild_level
number($int64)
Guild level

guild_fame
number($int64)
Honor EXP

guild_point
number($int64)
Guild Points (GP)

guild_master_name
string
Character name of the Guild Master

guild_member_count
number($int64)
Number of guild members

guild_member
[
List of guild members

string
]
guild_skill
[
List of guild skills

{
skill_name
string
Skill name

skill_description
string
Skill description

skill_level
number($int64)
Skill level

skill_effect
string
Effects by skill level

skill_icon
string
Skill icon

}
]
guild_noblesse_skill
[
List of Noblesse Guild Skills

{
skill_name
string
Skill name

skill_description
string
Skill description

skill_level
number($int64)
Skill level

skill_effect
string
Effects by skill level

skill_icon
string
Skill icon

}
]
}
