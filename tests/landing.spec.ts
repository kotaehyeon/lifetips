import { test, expect } from "@playwright/test";

test.describe("senior benefits landing", () => {
  test("shows the core approval-friendly sections on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: /시니어 생활혜택을 큰 글씨로 쉽게 확인하세요/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByText(/정부·공공기관 공개 정보를 바탕으로 정리한 생활혜택 안내/i),
    ).toBeVisible();

    const cards = [
      "정부 지원금",
      "환급금 안내",
      "통신·공과금 감면",
      "건강·병원 혜택",
    ];

    for (const card of cards) {
      await expect(page.getByRole("heading", { name: card })).toBeVisible();
    }

    await expect(
      page.getByText(/이 앱은 정부기관의 공식 앱이 아닌 민간 안내 서비스입니다/i),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "개인정보처리방침" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "정보 출처 보기" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /자주 찾는 혜택 바로 보기/i }),
    ).toBeVisible();
  });
});
