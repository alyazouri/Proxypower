Proxy‑auto‑configuration (PAC) script optimized for PUBG Mobile in Jordan.
 *
 * This script is a cleaned‑up and more efficient version of the user’s
 * original code.  It fixes several problems that prevented matchmaking
 * (‘التجنيد باللوبي’) from working and implements best practices for PAC
 * files.  Key improvements include:
 *
 *  1.  Corrected weight arrays to match the number of ports.  In the
 *      original version, categories like LOBBY had three weights but only
 *      two ports; this caused undefined behaviour in weightedPick().
 *  2.  Converted the list of Jordanian IP ranges into integer pairs and
 *      ensured they are sorted.  This allows ipInAnyJordanRange() to exit
 *      early once the search overshoots the current range, reducing the
 *      number of comparisons for each call.  According to Microsoft’s
 *      documentation, limiting expensive checks and keeping the file small
 *      improves PAC performance【629175277604596†L447-L501】.
 *  3.  Added host = host.toLowerCase() to avoid problems due to JavaScript
 *      case sensitivity【721049932642110†L153-L167】.
 *  4.  Removed the blanket requirement that all PUBG traffic must stay
 *      within Jordan.  The original STRICT_JO_FOR setting forced both
 *      client and server to be inside Jordan, which blocked access to
 *      official PUBG servers outside Jordan.  You can toggle
 *      REQUIRE_DST_IN_JORDAN for each category to decide whether a
 *      destination must be local.
 *  5.  Grouped patterns and domains in a single object so they can be
 *      iterated efficiently and placed high‑probability checks near the top
 *      (per Forcepoint and Zscaler guidelines【629175277604596†L447-L501】).
 */
