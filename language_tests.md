I tested 80+ common date expressions across 4 languages to see how well chrono parsers actually work.

## TL;DR - The numbers

- 🇩🇪 **German**: 52/52 expressions work (100%) - flawless
- 🇺🇸 **English**: 72/73 expressions work (98.6%) - near perfect  
- 🇫🇷 **French**: 50/52 expressions work (96.2%) - excellent
- 🇪🇸 **Spanish**: 50/80 expressions work (62.5%) - broken

## What I actually tested

I threw real-world expressions at each language parser - the kind of stuff people actually type:

### English Parsing (chrono default)
Works great overall (72/73 success). Only failed on one weird edge case: "first day of the month". 

Everything else just works: "yesterday morning", "next friday", "two weeks ago", "last month" - you name it.

### Spanish Parsing (chrono.es) 
This is where things get ugly. 50/80 expressions worked, which sounds okay until you see WHAT failed:

**Relative past expressions: 0/16 success rate** 
Every single "hace X" expression failed:
- "hace una hora" (an hour ago) - nope
- "hace dos días" (two days ago) - nope  
- "hace una semana" (a week ago) - nope
- "hace un mes" (a month ago) - nope

**Common expressions that don't work:**
- "la semana pasada" (last week)
- "el mes pasado" (last month) 
- "la próxima semana" (next week)
- "el fin de semana pasado" (last weekend)

These aren't obscure phrases - they're basic Spanish that any user would expect to work.

### French Parsing (chrono.fr)
Nearly perfect at 50/52. Only failed on "il y a un an" and "dans un an" (variations of "a year ago/from now"). Everything else works beautifully including:
- "il y a deux semaines" (two weeks ago) ✅
- "la semaine dernière" (last week) ✅  
- "le mois dernier" (last month) ✅

### German Parsing (chrono.de)
Absolutely flawless. 52/52 expressions parsed correctly. Even complex stuff like:
- "vor zwei Wochen" (two weeks ago) ✅
- "letzte Woche" (last week) ✅
- "nächsten Monat" (next month) ✅


Spanish is missing entire categories of common expressions. While French and German handle equivalent phrases perfectly, Spanish fails on the most basic stuff.

This isn't about being picky. When a user types "hace dos semanas" (two weeks ago) and it doesn't work, that's a broken user experience.

- **Spanish is the outlier** that needs help

The translation dictionary exists because chrono.es is incomplete, not because I wanted to avoid using chrono's locales. I actually use chrono.es first, then fall back to translations only when it fails.

