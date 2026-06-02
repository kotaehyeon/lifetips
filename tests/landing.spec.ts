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
    await expect(
      page.getByRole("heading", { name: /내게 맞는 혜택 간단 체크/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /혜택 경험 나누기/i }),
    ).toBeVisible();
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
    await expect(page.getByRole("link", { name: /복지로 기초연금 상세/i })).toBeVisible();
  });

  test("shows recommendations after the self-check form is submitted", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByLabel(/만 65세 이상이거나 곧 만 65세가 됩니다/i).check();
    await page.getByLabel(/건강보험료나 병원비 환급이 궁금합니다/i).check();
    await page.getByRole("button", { name: /추천 혜택 보기/i }).click();

    await expect(
      page.getByRole("heading", { name: /기초연금과 시니어 기본 혜택을 먼저 보세요/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /기초연금 안내 열기/i })).toBeVisible();
  });

  test("lets the user add a board post", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByLabel("닉네임").fill("테스트유저");
    await page.getByLabel("주제").selectOption("통신비 감면");
    await page
      .getByLabel("내용")
      .fill("통신비 감면 대상 여부를 확인한 뒤 어떤 서류가 필요한지 궁금합니다.");
    await page.getByRole("button", { name: /경험 남기기/i }).click();

    await expect(
      page.getByText(/경험이 저장되었습니다. 최근 글 목록에서 바로 확인할 수 있어요./i),
    ).toBeVisible();
    await expect(page.getByText("테스트유저")).toBeVisible();
  });
});
