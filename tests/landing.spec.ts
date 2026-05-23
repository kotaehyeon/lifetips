import { test, expect } from "@playwright/test";

test.describe("senior benefits landing", () => {
  test("shows the card-based home layout and policy links", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: /몰라서 놓치는 시니어 생활혜택 이것도 확인하세요!/i,
      }),
    ).toBeVisible();

    const cards = [
      "기초연금 안내",
      "건강보험 환급금",
      "통신비 감면 혜택",
      "병원비 지원 제도",
      "국가 보조금 찾기",
    ];

    for (const card of cards) {
      await expect(page.getByRole("link", { name: new RegExp(card, "i") })).toBeVisible();
    }

    await expect(
      page.getByText(/이 서비스는 정부기관의 공식 앱이 아닌 민간 안내 서비스입니다/i),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "개인정보처리방침" })).toBeVisible();
    await expect(page.getByRole("link", { name: "정보 출처 보기" })).toBeVisible();
  });

  test("opens a detail page from the main card list", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByRole("link", { name: /기초연금 안내/i }).click();

    await expect(page).toHaveURL(/\/pages\/basic-pension\.html$/);
    await expect(
      page.getByRole("heading", {
        name: /시니어가 먼저 챙길 기초연금 확인하세요!/i,
      }),
    ).toBeVisible();
    await expect(page.getByText(/만 65세 이상 기준 충족 시 월 최대 34만 원/i)).toBeVisible();
  });
});
