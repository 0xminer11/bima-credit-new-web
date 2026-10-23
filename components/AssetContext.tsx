"use client";
import { createContext, useContext } from "react";
import { HERO_ASSETS, type HeroAsset } from "@/lib/content";

/** The asset currently shown in the H1 rotator. The loan preview follows it. */
export const AssetContext = createContext<{ asset: HeroAsset; index: number }>({ asset: HERO_ASSETS[0], index: 0 });
export const useHeroAsset = () => useContext(AssetContext);
