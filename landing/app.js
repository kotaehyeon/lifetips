const yearElement = document.getElementById("current-year");

if (yearElement) {
  yearElement.textContent = `© ${new Date().getFullYear()}`;
}

const benefitRecommendations = {
  "basic-pension": {
    title: "기초연금과 시니어 기본 혜택을 먼저 보세요",
    copy:
      "만 65세 이상이거나 가까운 시기라면 기초연금, 노인일자리, 통신요금 복지할인을 함께 확인하는 것이 좋습니다.",
    links: [
      { label: "기초연금 안내 열기", href: "/pages/basic-pension.html" },
      { label: "정보 출처 보기", href: "/sources.html" },
    ],
  },
  "telecom-discount": {
    title: "통신비 감면과 공과금 절감 혜택을 먼저 보세요",
    copy:
      "매달 고정비 부담이 크다면 통신비 감면, 에너지바우처, 지자체 공공요금 감면 여부를 함께 보는 것이 좋습니다.",
    links: [
      { label: "통신비 감면 보기", href: "/pages/telecom-discount.html" },
      { label: "국가 보조금 찾기", href: "/pages/subsidy-finder.html" },
    ],
  },
  "health-refund": {
    title: "건강보험 환급금부터 확인해보세요",
    copy:
      "보험료 과오납, 본인부담상한제, 병원비 사후 환급처럼 직접 확인해야 찾는 항목이 있을 수 있습니다.",
    links: [
      { label: "건강보험 환급금 보기", href: "/pages/health-refund.html" },
      { label: "공식 출처 확인", href: "/sources.html" },
    ],
  },
  "medical-support": {
    title: "병원비 지원 제도를 먼저 확인해보세요",
    copy:
      "입원·수술이나 고액 치료가 있었다면 본인부담상한제와 재난적의료비 지원 여부를 함께 확인해보세요.",
    links: [
      { label: "병원비 지원 제도 보기", href: "/pages/medical-support.html" },
      { label: "건강보험 환급금 보기", href: "/pages/health-refund.html" },
    ],
  },
  "subsidy-finder": {
    title: "보조금24와 복지로 통합 조회를 추천합니다",
    copy:
      "생활비, 주거, 에너지, 건강, 돌봄 혜택을 한 번에 찾고 싶다면 보조금24와 복지로 기준으로 확인하는 것이 가장 효율적입니다.",
    links: [
      { label: "국가 보조금 찾기 보기", href: "/pages/subsidy-finder.html" },
      { label: "정보 출처 보기", href: "/sources.html" },
    ],
  },
};

const defaultPollState = {
  "기초연금": 2,
  "건강보험 환급금": 1,
  "통신비 감면 혜택": 1,
  "병원비 지원 제도": 1,
  "국가 보조금 찾기": 2,
};

const defaultBoardPosts = [
  {
    name: "복지궁금",
    topic: "기초연금",
    message: "부모님 생신 전에 신청 시기부터 확인해보니 준비할 서류를 미리 챙기기 좋았어요.",
    date: "최근 등록",
  },
  {
    name: "건강체크",
    topic: "건강보험 환급",
    message: "본인부담상한제 설명이 있어서 어떤 경우에 환급이 가능한지 감이 잡혔습니다.",
    date: "최근 등록",
  },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function readJsonStorage(key, fallbackValue) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallbackValue;
  } catch (error) {
    return fallbackValue;
  }
}

function writeJsonStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Ignore localStorage write errors for private browsing or quota limits.
  }
}

function setupBenefitChecker() {
  const form = document.getElementById("benefit-check-form");
  const result = document.getElementById("benefit-check-result");
  const title = document.getElementById("benefit-check-title");
  const copy = document.getElementById("benefit-check-copy");
  const links = document.getElementById("benefit-check-links");

  if (!form || !result || !title || !copy || !links) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const checkedValues = Array.from(
      form.querySelectorAll('input[name="profile"]:checked'),
    ).map((input) => input.value);

    const primaryKey = checkedValues[0] || "subsidy-finder";
    const recommendation =
      benefitRecommendations[primaryKey] || benefitRecommendations["subsidy-finder"];

    title.textContent = recommendation.title;
    copy.textContent =
      checkedValues.length > 1
        ? `${recommendation.copy} 체크한 항목이 여러 개라면 추천된 페이지부터 차례대로 확인해보세요.`
        : recommendation.copy;

    links.innerHTML = "";
    recommendation.links.forEach((item) => {
      const link = document.createElement("a");
      link.className = "inline-action";
      link.href = item.href;
      link.textContent = item.label;
      links.appendChild(link);
    });

    result.hidden = false;
  });
}

function renderPoll(pollState, resultElement) {
  const totalVotes = Object.values(pollState).reduce((sum, value) => sum + value, 0);

  resultElement.innerHTML = Object.entries(pollState)
    .map(([label, count]) => {
      const percent = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
      return `
        <div class="poll-bar-row">
          <div class="poll-bar-header">
            <strong>${label}</strong>
            <span>${count}표 · ${percent}%</span>
          </div>
          <div class="poll-bar-track">
            <div class="poll-bar-fill" style="width: ${percent}%"></div>
          </div>
        </div>
      `;
    })
    .join("");

  resultElement.hidden = false;
}

function setupPoll() {
  const form = document.getElementById("benefit-poll-form");
  const result = document.getElementById("benefit-poll-result");

  if (!form || !result) {
    return;
  }

  const storageKey = "lifetips-poll-state";
  const pollState = readJsonStorage(storageKey, defaultPollState);

  renderPoll(pollState, result);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const selected = form.querySelector('input[name="poll"]:checked');
    if (!selected) {
      return;
    }

    pollState[selected.value] = (pollState[selected.value] || 0) + 1;
    writeJsonStorage(storageKey, pollState);
    renderPoll(pollState, result);
    form.reset();
  });
}

function renderBoardPosts(listElement, posts) {
  listElement.innerHTML = posts
    .map(
      (post) => `
        <li class="board-post">
          <div class="board-post-top">
            <strong>${escapeHtml(post.name)}</strong>
            <span>${escapeHtml(post.topic)}</span>
          </div>
          <p class="board-post-message">${escapeHtml(post.message)}</p>
          <p class="board-post-date">${escapeHtml(post.date)}</p>
        </li>
      `,
    )
    .join("");
}

function setupBoard() {
  const form = document.getElementById("board-form");
  const list = document.getElementById("board-list");
  const feedback = document.getElementById("board-feedback");

  if (!form || !list || !feedback) {
    return;
  }

  const storageKey = "lifetips-board-posts";
  const posts = readJsonStorage(storageKey, defaultBoardPosts);

  renderBoardPosts(list, posts);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.elements.name.value.trim();
    const topic = form.elements.topic.value.trim();
    const message = form.elements.message.value.trim();

    if (!name || !topic || !message) {
      return;
    }

    posts.unshift({
      name,
      topic,
      message,
      date: new Date().toLocaleDateString("ko-KR"),
    });

    writeJsonStorage(storageKey, posts.slice(0, 8));
    renderBoardPosts(list, posts.slice(0, 8));

    feedback.hidden = false;
    feedback.textContent = "경험이 저장되었습니다. 최근 글 목록에서 바로 확인할 수 있어요.";
    form.reset();
  });
}

function renderDetailInteractions() {
  const containers = document.querySelectorAll("[data-detail-interactions]");

  containers.forEach((container) => {
    const topic = container.dataset.detailTopic || "생활 혜택";
    const safeKey = topic.replace(/\s+/g, "-");

    container.innerHTML = `
      <h2 class="section-title">내 상황 간단 체크</h2>
      <div class="info-box">
        <div class="info-box-label">해당되는 항목을 선택해보세요</div>
        <form class="detail-check-form" data-detail-form>
          <label class="checker-item">
            <input type="checkbox" value="대상 가능성이 있어 보여요" />
            <span>나이나 상황상 ${topic} 대상일 가능성이 있습니다</span>
          </label>
          <label class="checker-item">
            <input type="checkbox" value="서류 준비가 필요해 보여요" />
            <span>서류 준비나 자격 확인이 먼저 필요합니다</span>
          </label>
          <label class="checker-item">
            <input type="checkbox" value="공식 경로 확인이 좋아 보여요" />
            <span>공식 사이트와 주민센터 안내를 같이 확인하고 싶습니다</span>
          </label>
          <button type="submit" class="outline-btn">체크 결과 보기</button>
        </form>
        <div class="result-panel" data-detail-result hidden>
          <p class="result-label">체크 결과</p>
          <h3 class="result-title" data-detail-result-title></h3>
          <p class="result-copy" data-detail-result-copy></p>
        </div>
      </div>

      <div class="info-box detail-engagement-box">
        <div class="info-box-label">이 페이지가 도움이 되었나요?</div>
        <div class="reaction-row">
          <button type="button" class="reaction-btn" data-reaction="도움됐어요">도움됐어요</button>
          <button type="button" class="reaction-btn" data-reaction="더 궁금해요">더 궁금해요</button>
        </div>
        <p class="reaction-feedback" data-reaction-feedback hidden></p>
      </div>

      <div class="info-box detail-engagement-box">
        <div class="info-box-label">한 줄 메모 남기기</div>
        <form class="detail-note-form" data-note-form>
          <label class="field-label">
            메모
            <textarea
              name="note"
              rows="3"
              maxlength="120"
              placeholder="예: ${topic} 관련 준비할 서류 확인 필요"
              required
            ></textarea>
          </label>
          <button type="submit" class="cta-btn">메모 저장하기</button>
        </form>
        <p class="board-feedback" data-note-feedback hidden></p>
        <ul class="board-list" data-note-list></ul>
      </div>
    `;

    const detailForm = container.querySelector("[data-detail-form]");
    const detailResult = container.querySelector("[data-detail-result]");
    const detailResultTitle = container.querySelector("[data-detail-result-title]");
    const detailResultCopy = container.querySelector("[data-detail-result-copy]");
    const reactionButtons = container.querySelectorAll("[data-reaction]");
    const reactionFeedback = container.querySelector("[data-reaction-feedback]");
    const noteForm = container.querySelector("[data-note-form]");
    const noteFeedback = container.querySelector("[data-note-feedback]");
    const noteList = container.querySelector("[data-note-list]");
    const notesStorageKey = `lifetips-notes-${safeKey}`;

    const notes = readJsonStorage(notesStorageKey, []);

    const renderNotes = () => {
      noteList.innerHTML = notes
        .map(
          (note) => `
            <li class="board-post">
              <div class="board-post-top">
                <strong>${escapeHtml(topic)} 메모</strong>
                <span>${escapeHtml(note.date)}</span>
              </div>
              <p class="board-post-message">${escapeHtml(note.text)}</p>
            </li>
          `,
        )
        .join("");
    };

    renderNotes();

    detailForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const selected = Array.from(detailForm.querySelectorAll("input:checked")).map(
        (input) => input.value,
      );
      const summary = selected.length
        ? selected.join(", ")
        : "아직 선택한 항목이 없어요";

      detailResultTitle.textContent = `${topic} 확인 방향을 정리했어요`;
      detailResultCopy.textContent = `${summary}. 공식 출처 버튼과 본문 안내를 함께 보면서 대상 여부를 차근차근 확인해보세요.`;
      detailResult.hidden = false;
    });

    reactionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        reactionButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        reactionFeedback.hidden = false;
        reactionFeedback.textContent =
          button.dataset.reaction === "도움됐어요"
            ? `${topic} 페이지가 도움이 되었다고 표시했어요.`
            : `${topic} 페이지에서 더 궁금한 내용이 있다고 표시했어요.`;
      });
    });

    noteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const noteText = noteForm.elements.note.value.trim();
      if (!noteText) {
        return;
      }

      notes.unshift({
        text: noteText,
        date: new Date().toLocaleDateString("ko-KR"),
      });
      writeJsonStorage(notesStorageKey, notes.slice(0, 5));
      renderNotes();
      noteFeedback.hidden = false;
      noteFeedback.textContent = `${topic} 관련 메모가 저장되었습니다.`;
      noteForm.reset();
    });
  });
}

setupBenefitChecker();
setupPoll();
setupBoard();
renderDetailInteractions();
