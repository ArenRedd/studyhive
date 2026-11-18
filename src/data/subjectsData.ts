/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface SheetInfo {
  url: string;
  w: number;
  h: number;
}

export const SHEETS: Record<string, SheetInfo> = {
  covers: {
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_010644_837e04ca-2418-45c1-b8e0-0233265c4cd5.png&w=1744&q=85',
    w: 1744,
    h: 2336,
  },
  spines: {
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_010738_a3e47ead-18f2-4974-9468-06d16a25edc5.png&w=2688&q=85',
    w: 2688,
    h: 1152,
  },
  fix: {
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_010831_3ebb874b-93dc-433e-87ed-6299aba720f0.png&w=1520&q=85',
    w: 1520,
    h: 2688,
  },
  fix2: {
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_092020_f96bc094-db7b-46de-9298-074a24e0a3b8.png&w=1520&q=85',
    w: 1520,
    h: 2688,
  },
};

export interface CropBox {
  sheet: 'covers' | 'spines' | 'fix' | 'fix2';
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface QuestionItem {
  id: string;
  prompt: string;
}

export interface SubjectItem {
  code: string;
  shortName: string;
  fullName: string;
  examDate: string;
  session: 'FN' | 'AN';
  questions: QuestionItem[];
  tabGroup: '19–21' | '24–26' | '28 AN' | 'DEC 2';
  spine: CropBox;
  cover: CropBox;
}

export const SUBJECTS: SubjectItem[] = [
  {
    code: 'CS3691',
    shortName: 'EMBEDDED & IOT',
    fullName: 'Embedded Systems and IoT',
    examDate: '19-NOV-26',
    session: 'FN',
    questions: [],
    tabGroup: '19–21',
    spine: { sheet: 'spines', x: 266, y: 31, w: 189, h: 1089 },
    cover: { sheet: 'covers', x: 497, y: 72, w: 344, h: 659 },
  },
  {
    code: 'CS3591',
    shortName: 'COMPUTER NETWORKS',
    fullName: 'Computer Networks',
    examDate: '21-NOV-26',
    session: 'FN',
    questions: [],
    tabGroup: '19–21',
    spine: { sheet: 'spines', x: 1573, y: 31, w: 183, h: 1089 },
    cover: { sheet: 'covers', x: 1331, y: 815, w: 345, h: 675 },
  },
  {
    code: 'CB3591',
    shortName: 'SECURE SOFTWARE',
    fullName: 'Engineering Secure Software Systems',
    examDate: '24-NOV-26',
    session: 'FN',
    questions: [],
    tabGroup: '24–26',
    spine: { sheet: 'spines', x: 492, y: 31, w: 189, h: 1089 },
    cover: { sheet: 'covers', x: 914, y: 72, w: 342, h: 659 },
  },
  {
    code: 'CS3551',
    shortName: 'DISTRIBUTED COMP',
    fullName: 'Distributed Computing',
    examDate: '26-NOV-26',
    session: 'FN',
    questions: [],
    tabGroup: '24–26',
    spine: { sheet: 'fix', x: 197, y: 54, w: 324, h: 2566 },
    cover: { sheet: 'covers', x: 1332, y: 72, w: 344, h: 659 },
  },
  {
    code: 'CCS374',
    shortName: 'WEB APP SECURITY',
    fullName: 'Web Application Security',
    examDate: '28-NOV-26',
    session: 'AN',
    questions: [],
    tabGroup: '28 AN',
    spine: { sheet: 'spines', x: 44, y: 32, w: 184, h: 1088 },
    cover: { sheet: 'covers', x: 74, y: 72, w: 347, h: 659 },
  },
  {
    code: 'CCS335',
    shortName: 'CLOUD COMPUTING',
    fullName: 'Cloud Computing',
    examDate: '02-DEC-26',
    session: 'FN',
    questions: [],
    tabGroup: 'DEC 2',
    spine: { sheet: 'spines', x: 2462, y: 31, w: 188, h: 1089 },
    cover: { sheet: 'covers', x: 1331, y: 1579, w: 344, h: 677 },
  },
];

export function getCropCss(crop: CropBox): React.CSSProperties {
  const sheet = SHEETS[crop.sheet];
  const sizeX = (sheet.w / crop.w) * 100;
  const sizeY = (sheet.h / crop.h) * 100;
  const posX = (crop.x / (sheet.w - crop.w)) * 100;
  const posY = (crop.y / (sheet.h - crop.h)) * 100;

  return {
    backgroundImage: `url(${sheet.url})`,
    backgroundSize: `${sizeX.toFixed(4)}% ${sizeY.toFixed(4)}%`,
    backgroundPosition: `${posX.toFixed(4)}% ${posY.toFixed(4)}%`,
    backgroundRepeat: 'no-repeat',
  };
}

export function preloadAllSheets(): void {
  Object.values(SHEETS).forEach((s) => {
    const img = new Image();
    img.src = s.url;
  });
}
