

// შენი API Key - მხოლოდ ტესტისთვის!
const AI_API_KEY = "key-აქ";

// ჩატი ღიაა თუ დახურული
let isChatOpen = false;

// ====================================================
// ჩატის HTML-ის შექმნა და გვერდზე დამატება
// ====================================================
function createChatWidget() {
  const widget = document.createElement("div");
  widget.id = "ai-chat-widget";

  widget.innerHTML = `
    <!-- ჩატის გახსნის ღილაკი (ლურჯი ბურთი) -->
    <button id="ai-chat-toggle" onclick="toggleChat()" title="AI Assistant">
     <svg width="64px" height="64px" viewBox="-512 -512 2048.00 2048.00" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M885.8 383.8h-90.4c12.3 15.8 19.7 35.6 19.7 57.1v194c0 51.3-42 93.2-93.2 93.2H494.1c12.1 31 42.2 53.1 77.4 53.1h314.3c45.6 0 83-37.3 83-83V466.8c-0.1-45.7-37.4-83-83-83z" fill="#FFB89A"></path><path d="M780.7 582.4V286.3c0-74.2-60.7-134.9-134.9-134.9H198.2c-74.2 0-134.9 60.7-134.9 134.9v296.1c0 70.5 54.8 128.7 123.8 134.4 0 0-20 155.4 4.9 155.4s188.4-154.9 188.4-154.9h265.3c74.3 0 135-60.7 135-134.9z m-424.1 74.9l-17.4 16.4c-0.3 0.3-34.5 32.7-73.2 67.1-8.5 7.5-16.2 14.3-23.3 20.5 1.9-20.9 3.9-36.6 3.9-36.8l8-62.3L192 657c-38.5-3.2-68.7-36-68.7-74.6V286.3c0-19.9 7.8-38.6 22.1-52.8 14.2-14.2 33-22.1 52.8-22.1h447.6c19.9 0 38.6 7.8 52.8 22.1 14.2 14.2 22.1 33 22.1 52.8v296.1c0 19.9-7.8 38.6-22.1 52.8-14.2 14.2-33 22.1-52.8 22.1H356.6z" fill="#45484C"></path><path d="M830.3 337.9c-16.2-3.3-32.1 7.1-35.4 23.3-3.3 16.2 7.1 32.1 23.3 35.4 39 8 67.3 42.7 67.3 82.5v177c0 41.6-31.1 77.5-72.3 83.4l-32.7 4.7 7.8 32.1c2 8.1 3.9 16.8 5.8 25.3-17.6-16.4-37.3-35.2-55.2-52.7l-8.7-8.6H562.5c-21.9 0-36.6-1.4-47.2-8.6-13.7-9.3-32.4-5.8-41.7 7.9-9.3 13.7-5.8 32.4 7.9 41.7 25.7 17.5 55.3 19 81 19h143.2c10 9.7 27.3 26.3 45 42.8 16.2 15.1 29.6 27.1 39.8 35.9 20 17 29.3 23.1 41.6 23.1 9.7 0 18.7-4.4 24.8-12.1 10.1-12.9 10.2-29.1 0.5-78.7-1.4-7.2-2.9-14.2-4.3-20.6 54.4-21.1 92.4-74.3 92.4-134.6v-177c0.1-68-48.4-127.4-115.2-141.2z" fill="#45484C"></path><path d="M434.6 602.8c-35.9 0-71-17.1-98.8-48.1-24.6-27.5-39.3-61.6-39.3-91.4v-29.7l29.7-0.3c0.4 0 36.2-0.4 95.4-0.4 16.6 0 30 13.4 30 30s-13.4 30-30 30c-22.3 0-41.2 0.1-56.2 0.1 3.8 7.1 8.8 14.5 15.1 21.6 16 17.9 35.7 28.1 54.1 28.1s38.1-10.3 54.1-28.1c6.5-7.3 11.6-14.9 15.4-22.2-13.7-2.8-24.1-15-24-29.5 0.1-16.5 13.5-29.9 30-29.9h0.1c27.1 0.1 32.5 0.2 33.6 0.3l28.9 1.1v28.9c0 29.8-14.7 63.9-39.3 91.4-27.9 31-62.9 48.1-98.8 48.1z m107.1-109.5z" fill="#33CC99"></path></g></svg>
      <!-- წითელი წერტილი პირველი ჩატვირთვისას -->
      <span id="chat-notification-dot"></span>
    </button>

    <!-- ჩატის ფანჯარა -->
    <div id="ai-chat-window" class="chat-hidden">

      <!-- header -->
      <div id="ai-chat-header">
        <span>🤖 Digital Store AI</span>
        <button onclick="toggleChat()" id="ai-chat-close">✕</button>
      </div>

      <!-- შეტყობინებების ზონა -->
      <div id="ai-chat-messages">
        <div class="ai-message">
          გამარჯობა! 👋 მე ვარ Digital Store-ის AI ასისტენტი.<br>
          შემიძლია დაგეხმარო პროდუქტის მოძებნაში.<br>
          <small>💡 შეგიძლია სთხოვო კალათაში დამატებაც!</small>
        </div>
      </div>

      <!-- input ზონა -->
      <div id="ai-chat-input-area">
        <input
          type="text"
          id="ai-chat-input"
          placeholder="მაგ: gaming ლეპტოპი..."
          onkeydown="if(event.key==='Enter') sendChatMessage()"
        />
        <button id="ai-chat-send" onclick="sendChatMessage()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
          </svg>
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(widget);
  addChatStyles();
}

// ====================================================
// ჩატის გახსნა / დახურვა
// ====================================================
function toggleChat() {
  isChatOpen = !isChatOpen;
  const chatWindow = document.getElementById("ai-chat-window");
  const dot = document.getElementById("chat-notification-dot");

  if (isChatOpen) {
    chatWindow.classList.remove("chat-hidden");
    chatWindow.classList.add("chat-visible");
    if (dot) dot.style.display = "none"; // წერტილი ქრება გახსნისას
    document.getElementById("ai-chat-input").focus();
  } else {
    chatWindow.classList.remove("chat-visible");
    chatWindow.classList.add("chat-hidden");
  }
}

// ====================================================
// შეტყობინების გაგზავნა
// ====================================================
async function sendChatMessage() {
  const input = document.getElementById("ai-chat-input");
  const messagesDiv = document.getElementById("ai-chat-messages");
  const sendBtn = document.getElementById("ai-chat-send");
  const value = input.value.trim();

  if (!value) return;

  // მომხმარებლის შეტყობინება
  addMessage(messagesDiv, value, "user");
  input.value = "";
  sendBtn.disabled = true;

  // "ფიქრობს..." ინდიკატორი
  const thinkingEl = addMessage(messagesDiv, "ფიქრობს...", "ai");

  try {
    // პროდუქტების ჩამოტვირთვა API-დან
    const productsResponse = await fetch(
      "https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38"
    );

    if (!productsResponse.ok) throw new Error("პროდუქტები ვერ ჩაიტვირთა");

    const productsData = await productsResponse.json();
    const products = productsData.products;

    // AI-სთვის გამარტივებული სია (id ჩათვლით - კალათისთვის)
    const simplified = products.map((p) => ({
      id: p._id,
      title: p.title,
      brand: p.brand,
      category: p.category.name,
      price: p.price.current,
      currency: p.price.currency,
      rating: p.rating,
      stock: p.stock,
      description: p.description,
    }));

    const prompt = `
შენ ხარ Digital Store-ის AI Assistant.

მომხმარებელს შეუძლია ქართულად ან ინგლისურად დაწეროს.
გაიგე რას ეძებს და შესაბამისი პროდუქტები აარჩიე.

წესები:
1. გამოიყენე მხოლოდ მოცემული სია
2. არ მოიგონო პროდუქტები
3. მაქსიმუმ 3 რეკომენდაცია
4. უპასუხე ქართულად
5. stock 0 ან ნაკლები = მარაგში არ არის
6. თუ მომხმარებელი ითხოვს კალათაში დამატებას, ბოლოში დაამატე:
   CART_ACTION: {"id": "პროდუქტის_id", "title": "სახელი"}
   (მხოლოდ მაშინ როცა კალათას ახსენებს!)

ფორმატი:
პროდუქტი: [სახელი]
ბრენდი: [ბრენდი]
ფასი: [ფასი] [ვალუტა]
რეიტინგი: [რეიტინგი]
მარაგი: [stock]
მიზეზი: [მოკლე ახსნა]
---

პროდუქტები:
${JSON.stringify(simplified, null, 2)}

მომხმარებლის მოთხოვნა: "${value}"
`;

    // Claude AI გამოძახება
    const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "anthropic-dangerous-direct-browser-access": "true",
        "x-api-key": AI_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6", // sonnet = opus-ზე ~5x იაფი
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiResponse.ok) {
      const err = await aiResponse.json();
      throw new Error(err.error?.message ?? "AI შეცდომა");
    }

    const aiData = await aiResponse.json();
    const responseText = aiData.content?.[0]?.text;

    if (!responseText) throw new Error("პასუხი ვერ მივიღე");

    // "ფიქრობს..." წაშლა
    thinkingEl.remove();

    // კალათის ღილაკი საჭიროა?
    if (responseText.includes("CART_ACTION:")) {
      const parts = responseText.split("CART_ACTION:");
      const visibleText = parts[0].trim();

      try {
        const actionData = JSON.parse(parts[1].trim());

        addMessage(messagesDiv, visibleText, "ai");

        // კალათაში დამატების ღილაკი
        const btnDiv = document.createElement("div");
        btnDiv.className = "ai-message";
        btnDiv.innerHTML = `
          <button
            onclick="addToCartFromChat('${actionData.id}', '${actionData.title}', this)"
            style="
              background:#2563eb;color:white;border:none;
              padding:8px 14px;border-radius:8px;cursor:pointer;
              font-size:13px;margin-top:6px;
            ">
            🛒 კალათაში დამატება: ${actionData.title}
          </button>
        `;
        messagesDiv.appendChild(btnDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

      } catch {
        addMessage(messagesDiv, visibleText, "ai");
      }

    } else {
      addMessage(messagesDiv, responseText, "ai");
    }

  } catch (error) {
    thinkingEl.remove();
    addMessage(messagesDiv, `შეცდომა: ${error.message}`, "ai");
  } finally {
    sendBtn.disabled = false;
    document.getElementById("ai-chat-input").focus();
  }
}

// ====================================================
// ჩატიდან კალათაში დამატება
// addToCart მოდის cart_script.js-იდან
// თუ cart_script.js არ არის მიბმული - ღილაკი მაინც გამოჩნდება
// ====================================================
async function addToCartFromChat(productId, productTitle, button) {
  button.disabled = true;
  button.textContent = "ემატება...";

  // ვამოწმებთ addToCart ფუნქცია არსებობს თუ არა (cart_script.js მიბმულია?)
  if (typeof addToCart === "function") {
    await addToCart(productId);
    button.textContent = "✅ დამატებულია!";
    button.style.background = "#16a34a";
  } else {
    // cart_script.js არ არის - გადავამისამართოთ login გვერდზე
    alert("გთხოვთ გაიაროთ ავტორიზაცია კალათის გამოსაყენებლად");
    button.disabled = false;
    button.textContent = `🛒 კალათაში დამატება: ${productTitle}`;
  }
}

// ====================================================
// შეტყობინების DOM-ში დამატება
// ====================================================
function addMessage(container, text, type) {
  const div = document.createElement("div");
  div.className = type === "user" ? "user-message" : "ai-message";

  // ხაზებად დავყოთ (XSS-ის თავიდან ასაცილებლად innerText)
  text.split("\n").forEach((line, i, arr) => {
    const span = document.createElement("span");
    span.innerText = line;
    div.appendChild(span);
    if (i < arr.length - 1) div.appendChild(document.createElement("br"));
  });

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

// ====================================================
// CSS სტილები - პირდაპირ JS-ში რომ ცალკე CSS არ დაგჭირდეს
// ====================================================
function addChatStyles() {
  const style = document.createElement("style");
  style.textContent = `
    #ai-chat-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: sans-serif;
    }

    /* გახსნის ღილაკი */
    #ai-chat-toggle {
      width: 65px;
      height: 65px;
      border-radius: 50%;
      background: rgba(0, 128, 0, 0.3294117647);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(37,99,235,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: transform 0.2s;
      z-index:99999999;
    }

    #ai-chat-toggle:hover { transform: scale(1.08); }

    /* წითელი წერტილი */
    #chat-notification-dot {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 12px;
      height: 12px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid white;
    }

    /* ჩატის ფანჯარა */
    #ai-chat-window {
      position: absolute;
      bottom: 70px;
      right: 0;
      width: 320px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: opacity 0.25s, transform 0.25s;
    }

    .chat-hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateY(16px) scale(0.97);
    }

    .chat-visible {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0) scale(1);
    }

    #ai-chat-header {
      background: #2563eb;
      color: white;
      padding: 14px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      font-size: 15px;
    }

    #ai-chat-close {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }

    #ai-chat-messages {
      padding: 14px;
      height: 300px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: #f8fafc;
    }

    .ai-message {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px 12px 12px 2px;
      padding: 10px 12px;
      font-size: 13px;
      line-height: 1.5;
      color: #1e293b;
      max-width: 90%;
      align-self: flex-start;
    }

    .user-message {
      background: #2563eb;
      color: white;
      border-radius: 12px 12px 2px 12px;
      padding: 10px 12px;
      font-size: 13px;
      line-height: 1.5;
      max-width: 90%;
      align-self: flex-end;
    }

    #ai-chat-input-area {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid #e2e8f0;
      background: white;
    }

    #ai-chat-input {
      flex: 1;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 13px;
      outline: none;
    }

    #ai-chat-input:focus { border-color: #2563eb; }

    #ai-chat-send {
      background: #2563eb;
      border: none;
      border-radius: 8px;
      width: 38px;
      height: 38px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    #ai-chat-send:disabled { opacity: 0.5; cursor: not-allowed; }

    /* მობილური */
    @media (max-width: 480px) {
      #ai-chat-window {
        width: calc(100vw - 32px);
        right: -8px;
      }
    }
  `;
  document.head.appendChild(style);
}

// ====================================================
// გაშვება
// ====================================================
window.addEventListener("DOMContentLoaded", createChatWidget);