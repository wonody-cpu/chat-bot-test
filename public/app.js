const chat = document.querySelector("#chat");
const form = document.querySelector("#chatForm");
const input = document.querySelector("#messageInput");
const sendButton = document.querySelector("#sendButton");
const clearButton = document.querySelector("#clearButton");

let messages = [];
let isLoading = false;

function addMessage(role, content, extraClass = "") {
  document.querySelector("#welcome")?.remove();
  const row = document.createElement("div");
  row.className = `message ${role} ${extraClass}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = content;
  row.appendChild(bubble);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
  return row;
}

function resizeInput() {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
}

async function sendMessage(text) {
  const content = text.trim();
  if (!content || isLoading) return;

  messages.push({ role: "user", content });
  addMessage("user", content);
  input.value = "";
  resizeInput();
  isLoading = true;
  sendButton.disabled = true;

  const typing = addMessage("assistant", "···", "typing");
  typing.querySelector(".bubble").innerHTML = '<span class="dots"><span>●</span><span>●</span><span>●</span></span>';

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "응답을 불러오지 못했습니다.");

    typing.remove();
    messages.push({ role: "assistant", content: data.reply });
    addMessage("assistant", data.reply);
  } catch (error) {
    typing.remove();
    addMessage("assistant", `오류가 발생했어요. ${error.message}`);
    messages.pop();
  } finally {
    isLoading = false;
    sendButton.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(input.value);
});

input.addEventListener("input", resizeInput);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => sendMessage(button.dataset.prompt));
});

clearButton.addEventListener("click", () => {
  messages = [];
  chat.innerHTML = `
    <div class="welcome" id="welcome">
      <div class="welcome-icon">✦</div>
      <h2>새 대화를 시작했어요.</h2>
      <p>궁금한 내용을 자유롭게 입력해 주세요.</p>
    </div>`;
  input.focus();
});
