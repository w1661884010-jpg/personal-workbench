import assert from "node:assert/strict";
import test from "node:test";
import {
  isThemePreference,
  nextThemePreference,
  resolveTheme,
  themePreferences,
} from "../app/lib/theme.ts";

test("theme preference cycles through system, dark, light, and back to system", () => {
  assert.deepEqual(themePreferences, ["system", "dark", "light"]);
  assert.equal(nextThemePreference("system"), "dark");
  assert.equal(nextThemePreference("dark"), "light");
  assert.equal(nextThemePreference("light"), "system");
});

test("system theme follows the operating system while explicit choices win", () => {
  assert.equal(resolveTheme("system", true), "dark");
  assert.equal(resolveTheme("system", false), "light");
  assert.equal(resolveTheme("dark", false), "dark");
  assert.equal(resolveTheme("light", true), "light");
});

test("stored theme values are accepted only when they belong to the supported schema", () => {
  for (const preference of themePreferences) assert.equal(isThemePreference(preference), true);
  for (const invalid of [null, "", "auto", "sepia", 1, {}]) assert.equal(isThemePreference(invalid), false);
});
