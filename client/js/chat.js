const query = (obj) =>
	Object.keys(obj)
		.map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]))
		.join("&");
const url_prefix = document.querySelector("body").getAttribute("data-urlprefix");
const markdown = window.markdownit({html:true})
                      .use(texmath, { engine: katex,
                                      delimiters: 'dollars',
                                      katexOptions: { macros: {"\\RR": "\\mathbb{R}"} } } );
const message_box = document.getElementById(`messages`);
const message_input = document.getElementById(`message-input`);
const box_conversations = document.querySelector(`.top`);
const spinner = box_conversations.querySelector(".spinner");
const stop_generating = document.querySelector(`.stop-generating`);
const send_button = document.querySelector(`#send-button`);
const user_image = `<img src="${url_prefix}/assets/img/user.png" alt="User Avatar">`;
const gpt_image = `<img src="${url_prefix}/assets/img/gpt.png" alt="GPT Avatar">`;
let prompt_lock = false;

hljs.addPlugin(new CopyButtonPlugin());

message_input.addEventListener("blur", () => {
	window.scrollTo(0, 0);
});

message_input.addEventListener("focus", () => {
	document.documentElement.scrollTop = document.documentElement.scrollHeight;
});

const delete_conversations = async () => {
	localStorage.clear();
	await new_conversation();
};

const handle_ask = async () => {
	message_input.style.height = `80px`;
	window.scrollTo(0, 0);
	let message = message_input.value;
	if (message.length > 0) {
		message_input.value = ``;
		message_input.dispatchEvent(new Event("input"));
		await ask_gpt(message);
	}
};

const remove_cancel_button = async () => {
	stop_generating.classList.add(`stop-generating-hiding`);
	setTimeout(() => {
		stop_generating.classList.remove(`stop-generating-hiding`);
		stop_generating.classList.add(`stop-generating-hidden`);
	}, 300);
};

const ask_gpt = async (message) => {
	try {
		message_input.value = ``;
		message_input.innerHTML = ``;
		message_input.innerText = ``;
		add_conversation(window.conversation_id, message.substr(0, 40));
		window.scrollTo(0, 0);
		window.controller = new AbortController();
		model = document.getElementById("model");
		provider = document.getElementById("provider");
		prompt_lock = true;
		window.text = ``;
		window.token = message_id();
		stop_generating.classList.remove(`stop-generating-hidden`);
		add_user_message_box(message);
		message_box.scrollTop = message_box.scrollHeight;
		window.scrollTo(0, 0);

		await new Promise((r) => setTimeout(r, 500));
		window.scrollTo(0, 0);		
		message_box.innerHTML += DOMPurify.sanitize(`
			<div class="message">
				<div class="avatar-container">
					${gpt_image}
				</div>
				<div class="content" id="gpt_${window.token}">
					<div id="cursor"></div>
				</div>
			</div>
		`);
		message_box.scrollTop = message_box.scrollHeight;
		window.scrollTo(0, 0);

		await new Promise((r) => setTimeout(r, 1000));
		window.scrollTo(0, 0);

		const response = await fetch(`${url_prefix}/backend-api/v2/conversation`, {
			method: `POST`,
			signal: window.controller.signal,
			headers: {
				"content-type": `application/json`,
				accept: `text/event-stream`,
			},
			body: JSON.stringify({
				temperature: 0.2,
				top_k: 10,
				typical_p: 0.8,
				no_repeat_n: 2,
				early_stopping: true,
				frequency_WPF_penalty: 2.0,
				max_tokens: 2048,
				conversation_id: window.conversation_id,
				action: `_ask`,
				model: model.options[model.selectedIndex].value,
				provider: provider.options[provider.selectedIndex].value,
				meta: {
					id: window.token,
					content: {
						conversation: await get_conversation(window.conversation_id),
						internet_access: true,
						content_type: "text",
						parts: [
							{
								content: message,
								role: "user",
							},
						],
					},
				},
			}),
		});

		const reader = response.body.getReader();

		while (true) {
			const { value, done } = await reader.read();
			if (done) break;
			chunk = decodeUnicode(new TextDecoder().decode(value));
			text += chunk;
			document.getElementById(`gpt_${window.token}`).innerHTML = markdown.render(text);
			document.querySelectorAll(`code`).forEach((el) => {
				hljs.highlightElement(el);
			});
			window.scrollTo(0, 0);
			message_box.scrollTo({ top: message_box.scrollHeight, behavior: "auto" });
		}		

		add_message(window.conversation_id, "user", message);
		add_message(window.conversation_id, "assistant", text);
		message_box.scrollTop = message_box.scrollHeight;

		await remove_cancel_button();
		prompt_lock = false;

		await load_conversations(20, 0);
		window.scrollTo(0, 0);
	} catch (e) {
		add_message(window.conversation_id, "user", message);
		message_box.scrollTop = message_box.scrollHeight;
		await remove_cancel_button();
		prompt_lock = false;
		await load_conversations(20, 0);

		console.log(e);

		let cursorDiv = document.getElementById(`cursor`);
		if (cursorDiv) cursorDiv.parentNode.removeChild(cursorDiv);

		if (e.name != `AbortError`) {
			let error_message = `oops ! something went wrong, please try again / reload. [stacktrace in console]`;

			document.getElementById(`gpt_${window.token}`).innerHTML = error_message;
			add_message(window.conversation_id, "assistant", error_message);
		} else {
			document.getElementById(`gpt_${window.token}`).innerHTML += ` [aborted]`;
			add_message(window.conversation_id, "assistant", text + ` [aborted]`);
		}

		window.scrollTo(0, 0);
	}
};

const add_user_message_box = (message) => {
	const messageDiv = createElement("div", { classNames: ["message"] });
	const avatarContainer = createElement("div", {
		classNames: ["avatar-container"],
		innerHTML: user_image,
	});
	const contentDiv = createElement("div", {
		classNames: ["content"],
		id: `user_${token}`,
		textContent: message,
	});
	messageDiv.append(avatarContainer, contentDiv);
	message_box.appendChild(messageDiv);
};

const decodeUnicode = (str) => {
	return str.replace(/\\u([a-fA-F0-9]{4})/g, function (_match, grp) {
		return String.fromCharCode(parseInt(grp, 16));
	});
};

const clear_conversations = async () => {
	const elements = box_conversations.childNodes;
	let index = elements.length;
	if (index > 0) {
		while (index--) {
			const element = elements[index];
			if (element.nodeType === Node.ELEMENT_NODE && element.tagName.toLowerCase() !== `button`) {
				box_conversations.removeChild(element);
			}
		}
	}
};

const clear_conversation = async () => {
	let messages = message_box.getElementsByTagName(`div`);

	while (messages.length > 0) {
		message_box.removeChild(messages[0]);
	}
};

const delete_conversation = async (conversation_id) => {
	localStorage.removeItem(`conversation:${conversation_id}`);

	if (window.conversation_id == conversation_id) {
		await new_conversation();
	}

	await load_conversations(20, 0, true);
};

const set_conversation = async (conversation_id) => {
	history.pushState({}, null, `${url_prefix}/chat/${conversation_id}`);
	window.conversation_id = conversation_id;

	await clear_conversation();
	await load_conversation(conversation_id);
	await load_conversations(20, 0, true);
};

const new_conversation = async () => {
	history.pushState({}, null, `${url_prefix}/chat/`);
	window.conversation_id = uuid();

	await clear_conversation();
	await load_conversations(20, 0, true);
};

const load_conversation = async (conversation_id) => {
	let conversation = await JSON.parse(localStorage.getItem(`conversation:${conversation_id}`));
	console.log(conversation, conversation_id);
	model = document.getElementById("model");
	provider = document.getElementById("provider");
	let hasModel = Array.from(model.options).some((option) => option.value === conversation.model);
	let hasProvider = Array.from(provider.options).some((option) => option.value === conversation.provider);
	if (hasModel) model.value = conversation.model;
	if (hasProvider) provider.value = conversation.provider;

	for (item of conversation.items) {
		if (is_assistant(item.role)) {
			message_box.innerHTML += DOMPurify.sanitize(load_gpt_message_box(item.content));
		} else {
			message_box.innerHTML += DOMPurify.sanitize(load_user_message_box(item.content));
		}
	}

	document.querySelectorAll(`code`).forEach((el) => {
		hljs.highlightElement(el);
	});

	message_box.scrollTo({ top: message_box.scrollHeight, behavior: "smooth" });

	setTimeout(() => {
		message_box.scrollTop = message_box.scrollHeight;
	}, 500);
};

const load_user_message_box = (content) => {
	const messageDiv = createElement("div", { classNames: ["message", "user"] });
	const avatarContainer = createElement("div", {
		classNames: ["avatar-container"],
		innerHTML: user_image,
	});
	const contentDiv = createElement("div", { classNames: ["content"] });
	const preElement = document.createElement("pre");
	preElement.textContent = content;
	contentDiv.appendChild(preElement);

	messageDiv.append(avatarContainer, contentDiv);

	return messageDiv.outerHTML;
};

const load_gpt_message_box = (content) => {
	return `
            <div class="message assistant">
                <div class="avatar-container">
                    ${gpt_image}
                </div>
                <div class="content">
                    ${markdown.render(content)}
                </div>
            </div>
        `;
};

const is_assistant = (role) => {
	return role == "assistant";
};

const get_conversation = async (conversation_id) => {
	let conversation = await JSON.parse(localStorage.getItem(`conversation:${conversation_id}`));
	return conversation.items;
};

const add_conversation = async (conversation_id, title) => {
	if (localStorage.getItem(`conversation:${conversation_id}`) == null) {
		model = document.getElementById("model");
		provider = document.getElementById("provider");
		localStorage.setItem(
			`conversation:${conversation_id}`,
			JSON.stringify({
				id: conversation_id,
				title: title,
				items: [],
				created_at: Date.now(),
				model: model.options[model.selectedIndex].value,
				provider: provider.options[provider.selectedIndex].value,
			})
		);
	}
};

const add_message = async (conversation_id, role, content) => {
	let before_adding = JSON.parse(localStorage.getItem(`conversation:${conversation_id}`));

	before_adding.items.push({
		role: role,
		content: content,
	});

	localStorage.setItem(`conversation:${conversation_id}`, JSON.stringify(before_adding));
};

const load_conversations = async (_limit, _offset, _loader) => {

	let conversations = [];
	for (let i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).startsWith("conversation:")) {
			let conversation = localStorage.getItem(localStorage.key(i));
			conversations.push(JSON.parse(conversation));
		}
	}

	conversations.sort((a, b) => b.created_at - a.created_at);
	
	await clear_conversations();

	for (conversation of conversations) {
		box_conversations.innerHTML += `
            <div class="conversation-sidebar">
                <div class="left" onclick="set_conversation('${conversation.id}')">
				<span class="material-icons-round chat">forum</span>
                    <span class="conversation-title">${conversation.title}</span>
                </div>
				<span class="material-icons-round delete" onclick="delete_conversation('${conversation.id}')">delete</span>
            </div>
        `;
	}

	document.querySelectorAll(`code`).forEach((el) => {
		hljs.highlightElement(el);
	});
};

document.getElementById(`cancelButton`).addEventListener(`click`, async () => {
	window.controller.abort();
	console.log(`aborted ${window.conversation_id}`);
});

function h2a(str1) {
	var hex = str1.toString();
	var str = "";

	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}

	return str;
};

const uuid = () => {
	return `xxxxxxxx-xxxx-4xxx-yxxx-${Date.now().toString(16)}`.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

const message_id = () => {
	random_bytes = (Math.floor(Math.random() * 1338377565) + 2956589730).toString(2);
	unix = Math.floor(Date.now() / 1000).toString(2);

	return BigInt(`0b${unix}${random_bytes}`).toString();
};

window.onload = async () => {
	load_settings_localstorage();

	conversations = 0;
	for (let i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).startsWith("conversation:")) {
			conversations += 1;
		}
	}

	if (conversations == 0) localStorage.clear();

	setTimeout(() => {
		load_conversations(20, 0);
	}, 1);

	if (!window.location.href.endsWith(`#`)) {
		if (/\/chat\/.+/.test(window.location.href.slice(url_prefix.length))) {
			await load_conversation(window.conversation_id);
		}
	}

	function isMobileDevice() {
		const userAgent = navigator.userAgent;
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
	}
		
	message_input.addEventListener("keydown", async (evt) => {
		if (prompt_lock) return;
		if (isMobileDevice()) return;
		if (evt.key === "Enter" && !evt.shiftKey) {
			evt.preventDefault();
			await handle_ask();
		}
	});

	send_button.addEventListener("click", async (event) => {
		event.preventDefault();
		if (prompt_lock) return;
		message_input.blur();
		await handle_ask();
	});

	register_settings_localstorage();
};

const register_settings_localstorage = async () => {
	settings_ids = ["model"];
	settings_elements = settings_ids.map((id) => document.getElementById(id));
	settings_elements.map((element) =>
		element.addEventListener(`change`, async (event) => {
			switch (event.target.type) {
				case "checkbox":
					localStorage.setItem(event.target.id, event.target.checked);
					break;
				case "select-one":
					localStorage.setItem(event.target.id, event.target.selectedIndex);
					break;
				default:
					console.warn("Unresolved element type");
			}
		})
	);
};


const load_settings_localstorage = async () => {
	settings_ids = ["model"];
	settings_elements = settings_ids.map((id) => document.getElementById(id));
	settings_elements.map((element) => {
		if (localStorage.getItem(element.id)) {
			switch (element.type) {
				case "checkbox":
					element.checked = localStorage.getItem(element.id) === "true";
					break;
				case "select-one":
					element.selectedIndex = parseInt(localStorage.getItem(element.id));
					break;
				default:
					console.warn("Unresolved element type");
			}
		}
	});
};

function clearTextarea(textarea) {
	textarea.style.removeProperty("height");
	textarea.style.height = `${textarea.scrollHeight + 4}px`;
	if (textarea.value.trim() === "" && textarea.value.includes("\n")) {
		textarea.value = "";
	}
};

function createElement(tag, { classNames, id, innerHTML, textContent } = {}) {
    const el = document.createElement(tag);
    if (classNames) {
        el.classList.add(...classNames);
    }
    if (id) {
        el.id = id;
    }
    if (innerHTML) {
        el.innerHTML = DOMPurify.sanitize(innerHTML);
    }
    if (textContent) {
        const preElement = document.createElement("pre");
        preElement.textContent = textContent;
        el.appendChild(preElement);
    }
    return el;
};