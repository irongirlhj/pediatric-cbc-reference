/**
 * 한국 소아 CBC 연령별 참고치 데이터
 *
 * 출처: Sung JY, Seo JD, Ko DH, Park MJ, Hwang SM, Oh S, Chun S, Seong MW,
 *       Song J, Song SH, Park SS.
 *       "Establishment of Pediatric Reference Intervals for Routine Laboratory
 *        Tests in Korean Population: A Retrospective Multicenter Analysis."
 *       Ann Lab Med. 2021;41(2):155-170.
 *       https://doi.org/10.3343/alm.2021.41.2.155
 *       (Open Access, CC BY-NC 4.0)
 *
 * 원 논문 Table 1 (Sysmex XE-2100)의 값을 그대로 옮긴 것입니다.
 * 값은 논문의 원 단위로 저장하며, 국내 관례 단위 표시는 conv 로 환산합니다.
 *
 * 연령 구간은 "만 개월" 기준 반열린구간 [minM, maxM) 입니다.
 *   예) 논문의 "0-3 mo"  -> [0, 4)     (만 0~3개월)
 *       논문의 "1-6 yr"  -> [12, 84)   (만 1~6세)
 *       논문의 "7-18 yr" -> [84, 228)  (만 7~18세)
 *
 * sex: "any"(논문의 Both) | "M" | "F"
 * note: 논문 각주  "*" = 표본수<120, 비모수법 적용
 *                  "†" = robust법으로 90% CI 미산출, 정규성 통과 후 모수법 적용
 */
window.REFERENCE_DATA = {
  meta: {
    title: "한국 소아 CBC 연령별 참고치",
    source:
      "Sung JY, et al. Establishment of Pediatric Reference Intervals for Routine " +
      "Laboratory Tests in Korean Population. Ann Lab Med. 2021;41(2):155-170",
    sourceUrl: "https://doi.org/10.3343/alm.2021.41.2.155",
    instrument: "Sysmex XE-2100",
    population: "국내 4개 대학병원 소아 1,031명 (0개월~18세), CLSI EP28-A3c",
    license: "CC BY-NC 4.0",
    version: "2026-07-20",
    ageRangeMonths: [0, 228],
  },

  parameters: [
    {
      code: "WBC",
      name: "백혈구",
      unit: "×10⁹/L",
      conv: { unit: "×10³/µL", factor: 1, decimals: 2 },
      brackets: [
        { minM: 0,  maxM: 4,   sex: "M",   low: 6.48, high: 16.30 },
        { minM: 0,  maxM: 4,   sex: "F",   low: 5.78, high: 15.80 },
        { minM: 4,  maxM: 12,  sex: "any", low: 4.64, high: 13.85 },
        { minM: 12, maxM: 84,  sex: "any", low: 4.85, high: 11.50 },
        { minM: 84, maxM: 228, sex: "any", low: 4.32, high: 10.22 },
      ],
    },
    {
      code: "ANC",
      name: "절대호중구수",
      unit: "×10⁹/L",
      conv: { unit: "×10³/µL", factor: 1, decimals: 2 },
      brackets: [
        { minM: 0,  maxM: 12,  sex: "any", low: 0.65, high: 3.35, note: "*" },
        { minM: 12, maxM: 228, sex: "any", low: 1.40, high: 5.76 },
      ],
    },
    {
      code: "SegNeut",
      name: "분엽핵 호중구",
      unit: "%",
      conv: { unit: "%", factor: 1, decimals: 1 },
      brackets: [
        { minM: 0,   maxM: 12,  sex: "any", low: 3.3,  high: 33.1 },
        { minM: 12,  maxM: 84,  sex: "any", low: 16.9, high: 62.2 },
        { minM: 84,  maxM: 156, sex: "any", low: 28.4, high: 64.5 },
        { minM: 156, maxM: 228, sex: "any", low: 38.3, high: 67.7 },
      ],
    },
    {
      code: "Lymph",
      name: "림프구",
      unit: "%",
      conv: { unit: "%", factor: 1, decimals: 1 },
      brackets: [
        { minM: 0,   maxM: 12,  sex: "any", low: 54.5, high: 87.6 },
        { minM: 12,  maxM: 84,  sex: "any", low: 26.9, high: 73.8 },
        { minM: 84,  maxM: 156, sex: "any", low: 29.4, high: 59.3 },
        { minM: 156, maxM: 228, sex: "any", low: 21.5, high: 51.5 },
      ],
    },
    {
      code: "Mono",
      name: "단핵구",
      unit: "%",
      conv: { unit: "%", factor: 1, decimals: 1 },
      brackets: [{ minM: 0, maxM: 228, sex: "any", low: 3.5, high: 10.4 }],
    },
    {
      code: "Eos",
      name: "호산구",
      unit: "%",
      conv: { unit: "%", factor: 1, decimals: 1 },
      brackets: [
        { minM: 0, maxM: 228, sex: "M", low: 0.3, high: 6.9 },
        { minM: 0, maxM: 228, sex: "F", low: 0.4, high: 5.7 },
      ],
    },
    {
      code: "Baso",
      name: "호염기구",
      unit: "%",
      conv: { unit: "%", factor: 1, decimals: 1 },
      brackets: [{ minM: 0, maxM: 228, sex: "any", low: 0.1, high: 0.8 }],
    },
    {
      code: "RBC",
      name: "적혈구",
      unit: "×10⁶/µL",
      conv: { unit: "×10⁶/µL", factor: 1, decimals: 2 },
      brackets: [
        { minM: 0, maxM: 4,   sex: "any", low: 3.22, high: 4.65 },
        { minM: 4, maxM: 228, sex: "M",   low: 4.16, high: 5.49 },
        { minM: 4, maxM: 228, sex: "F",   low: 4.03, high: 5.16 },
      ],
    },
    {
      code: "MCV",
      name: "평균적혈구용적",
      unit: "fL",
      conv: { unit: "fL", factor: 1, decimals: 1 },
      brackets: [
        { minM: 0,   maxM: 4,   sex: "any", low: 73.9, high: 98.3 },
        { minM: 4,   maxM: 12,  sex: "M",   low: 68.6, high: 82.8 },
        { minM: 4,   maxM: 12,  sex: "F",   low: 70.8, high: 84.6 },
        { minM: 12,  maxM: 84,  sex: "M",   low: 72.3, high: 83.4 },
        { minM: 12,  maxM: 84,  sex: "F",   low: 73.9, high: 86.1 },
        { minM: 84,  maxM: 156, sex: "M",   low: 74.7, high: 87.8 },
        { minM: 84,  maxM: 156, sex: "F",   low: 78.3, high: 89.0 },
        { minM: 156, maxM: 192, sex: "M",   low: 76.4, high: 93.3 },
        { minM: 156, maxM: 192, sex: "F",   low: 80.5, high: 94.3 },
        { minM: 192, maxM: 228, sex: "M",   low: 80.3, high: 95.2 },
        { minM: 192, maxM: 228, sex: "F",   low: 83.4, high: 95.9 },
      ],
    },
    {
      code: "MCH",
      name: "평균적혈구혈색소량",
      unit: "pg",
      conv: { unit: "pg", factor: 1, decimals: 1 },
      brackets: [
        { minM: 0,   maxM: 4,   sex: "any", low: 25.3, high: 33.7 },
        { minM: 4,   maxM: 12,  sex: "M",   low: 23.5, high: 28.6 },
        { minM: 4,   maxM: 12,  sex: "F",   low: 24.9, high: 28.2 },
        { minM: 12,  maxM: 84,  sex: "any", low: 24.6, high: 29.1 },
        { minM: 84,  maxM: 156, sex: "any", low: 26.4, high: 30.4 },
        { minM: 156, maxM: 192, sex: "any", low: 26.4, high: 32.2 },
        { minM: 192, maxM: 228, sex: "any", low: 28.0, high: 32.3 },
      ],
    },
    {
      code: "MCHC",
      name: "평균적혈구혈색소농도",
      unit: "g/L",
      conv: { unit: "g/dL", factor: 0.1, decimals: 1 },
      brackets: [
        { minM: 0,   maxM: 156, sex: "any", low: 327, high: 359 },
        { minM: 156, maxM: 228, sex: "M",   low: 325, high: 357 },
        { minM: 156, maxM: 228, sex: "F",   low: 323, high: 343 },
      ],
    },
    {
      code: "Hb",
      name: "혈색소",
      unit: "g/L",
      conv: { unit: "g/dL", factor: 0.1, decimals: 1 },
      brackets: [
        { minM: 0,   maxM: 4,   sex: "any", low: 97,  high: 134 },
        { minM: 4,   maxM: 84,  sex: "any", low: 108, high: 140 },
        { minM: 84,  maxM: 156, sex: "M",   low: 117, high: 154, note: "†" },
        { minM: 84,  maxM: 156, sex: "F",   low: 115, high: 148 },
        { minM: 156, maxM: 192, sex: "M",   low: 124, high: 164 },
        { minM: 156, maxM: 192, sex: "F",   low: 118, high: 150 },
        { minM: 192, maxM: 228, sex: "M",   low: 138, high: 170, note: "†" },
        { minM: 192, maxM: 228, sex: "F",   low: 119, high: 146, note: "†" },
      ],
    },
    {
      code: "Hct",
      name: "적혈구용적률",
      unit: "proportion of 1.0",
      conv: { unit: "%", factor: 100, decimals: 0 },
      brackets: [
        { minM: 0,   maxM: 4,   sex: "any", low: 0.31, high: 0.36 },
        { minM: 4,   maxM: 84,  sex: "any", low: 0.33, high: 0.40 },
        { minM: 84,  maxM: 156, sex: "any", low: 0.34, high: 0.43 },
        { minM: 156, maxM: 192, sex: "M",   low: 0.36, high: 0.48 },
        { minM: 156, maxM: 192, sex: "F",   low: 0.36, high: 0.44 },
        { minM: 192, maxM: 228, sex: "M",   low: 0.40, high: 0.50 },
        { minM: 192, maxM: 228, sex: "F",   low: 0.36, high: 0.42, note: "†" },
      ],
    },
    {
      code: "RDW",
      name: "적혈구분포폭",
      unit: "%",
      conv: { unit: "%", factor: 1, decimals: 1 },
      brackets: [
        { minM: 0,  maxM: 4,   sex: "any", low: 11.7, high: 16.3 },
        { minM: 4,  maxM: 84,  sex: "M",   low: 12.0, high: 14.4 },
        { minM: 4,  maxM: 84,  sex: "F",   low: 11.7, high: 14.1 },
        { minM: 84, maxM: 228, sex: "any", low: 11.7, high: 13.8 },
      ],
    },
    {
      code: "PLT",
      name: "혈소판",
      unit: "×10⁹/L",
      conv: { unit: "×10³/µL", factor: 1, decimals: 0 },
      brackets: [
        { minM: 0,   maxM: 4,   sex: "any", low: 188, high: 610 },
        { minM: 4,   maxM: 12,  sex: "any", low: 199, high: 495 },
        { minM: 12,  maxM: 156, sex: "any", low: 178, high: 414 },
        { minM: 156, maxM: 228, sex: "any", low: 165, high: 365 },
      ],
    },
    {
      code: "PCT",
      name: "혈소판용적률",
      unit: "%",
      conv: { unit: "%", factor: 1, decimals: 2 },
      brackets: [
        { minM: 0,  maxM: 12,  sex: "any", low: 0.17, high: 0.52 },
        { minM: 12, maxM: 228, sex: "any", low: 0.17, high: 0.38 },
      ],
    },
    {
      code: "MPV",
      name: "평균혈소판용적",
      unit: "fL",
      conv: { unit: "fL", factor: 1, decimals: 1 },
      brackets: [
        { minM: 0,  maxM: 84,  sex: "any", low: 7.6, high: 10.9 },
        { minM: 84, maxM: 228, sex: "any", low: 8.8, high: 11.4 },
      ],
    },
    {
      code: "PDW",
      name: "혈소판분포폭",
      unit: "%",
      conv: { unit: "%", factor: 1, decimals: 1 },
      brackets: [{ minM: 0, maxM: 228, sex: "any", low: 8.4, high: 13.3 }],
    },
    {
      code: "ESR",
      name: "적혈구침강속도",
      unit: "mm/hr",
      conv: { unit: "mm/hr", factor: 1, decimals: 0 },
      brackets: [{ minM: 0, maxM: 228, sex: "any", low: 2, high: 9 }],
    },
  ],

  footnotes: {
    "*": "표본수 < 120 이나, robust법 하한의 90% CI가 음수를 포함하고 정규성 검정을 통과하지 못해 비모수법으로 산출된 값입니다.",
    "†": "robust법으로 90% CI를 산출하지 못했으나, 정규성 검정을 통과하여 정규분포 기반 모수법을 적용한 값입니다.",
  },
};
