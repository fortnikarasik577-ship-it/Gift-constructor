/**
 * Конструктор подарунків & Адмін-панель
 * Повна реалізація:
 * 1. Додавання подарунка
 * 2. Редагування подарунка
 * 3. Видалення подарунка
 * 4. Збереження змін у LocalStorage
 * 5. Перевірка введених даних (комплексна валідація)
 * 6. Відповідність даних (синхронізація, перевірка дублікатів, цілісність)
 */

document.addEventListener('DOMContentLoaded', () => {
	// =========================================================================
	// 1. Початкові константи та базові дані
	// =========================================================================
	const STORAGE_KEY = 'gift_constructor_items_v2';

	const occasionLabels = {
		"ДН": "День Народження (ДН)",
		"НР": "Новий Рік (НР)",
		"8Б": "8 Березня (8Б)",
		"Весілля": "Весілля"
	};

	const imgPool = {
		spa: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80",
		sweets: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80",
		coffee: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80",
		flowers: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80",
		tech: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80",
		watches: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80",
		leather: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
		wine: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=80",
		cozy: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&q=80",
		perfume: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80",
		celebration: "assets/images/celebration.jpg"
	};

	const initialGiftsData = [
		// Мама
		{
			id: "gift-mama-dn",
			recipient: "Мама",
			occasion: "ДН",
			badge: "СПА & Догляд",
			title: "СПА-набір затишку та догляду для Мами",
			desc: "Ароматична соєва свічка, натуральна косметика ручної роботи, трав'яний чай та вітальна листівка.",
			img: imgPool.spa,
			priceFactor: 0.9
		},
		{
			id: "gift-mama-nr",
			recipient: "Мама",
			occasion: "НР",
			badge: "Зимовий затишок",
			title: "Новорічний затишний набір для Мами",
			desc: "Теплий вовняний плед, різдвяний мед із горіхами, керамічна чашка та свічка кориця-апельсин.",
			img: imgPool.cozy,
			priceFactor: 0.85
		},
		{
			id: "gift-mama-8b",
			recipient: "Мама",
			occasion: "8Б",
			badge: "Весняний",
			title: "Букет тюльпанів & Шоколадне асорті",
			desc: "Ніжний весняний букет та коробка авторських крафтових цукерок.",
			img: imgPool.flowers,
			priceFactor: 0.85
		},
		{
			id: "gift-mama-wedding",
			recipient: "Мама",
			occasion: "Весілля",
			badge: "Елегантність",
			title: "Елегантний кришталевий сет",
			desc: "Вишукана ваза з кришталю, набір келихів та вітальний бокс.",
			img: imgPool.wine,
			priceFactor: 1.0
		},

		// Тато
		{
			id: "gift-tato-dn",
			recipient: "Тато",
			occasion: "ДН",
			badge: "Стиль",
			title: "Шкіряний портмоне & Ремінь",
			desc: "Набір із натуральної шкіри ручної роботи в подарунковій дерев'яній коробці.",
			img: imgPool.leather,
			priceFactor: 0.9
		},
		{
			id: "gift-tato-nr",
			recipient: "Тато",
			occasion: "НР",
			badge: "Затишок",
			title: "Зимовий термос-сет для Тата",
			desc: "Якісний термос з нержавіючої сталі, вовняний шарф та зимові шкіряні рукавички.",
			img: imgPool.cozy,
			priceFactor: 0.85
		},
		{
			id: "gift-tato-8b",
			recipient: "Тато",
			occasion: "8Б",
			badge: "Кавоман",
			title: "Набір поціновувача кави",
			desc: "Гейзерна кавоварка, свіжообсмажені зерна Арабіки та термокружка.",
			img: imgPool.coffee,
			priceFactor: 0.95
		},
		{
			id: "gift-tato-wedding",
			recipient: "Тато",
			occasion: "Весілля",
			badge: "Преміум",
			title: "Класичний годинник з гравіюванням",
			desc: "Елегантний наручний годинник із пам'ятним гравіюванням.",
			img: imgPool.watches,
			priceFactor: 1.15
		},

		// Сестра
		{
			id: "gift-sestra-dn",
			recipient: "Сестра",
			occasion: "ДН",
			badge: "Beauty",
			title: "Б'юті-бокс трендової косметики",
			desc: "Набір популярних засобів для догляду за шкірою, дзеркало з підсвіткою та косметичка.",
			img: imgPool.spa,
			priceFactor: 0.9
		},
		{
			id: "gift-sestra-nr",
			recipient: "Сестра",
			occasion: "НР",
			badge: "Party",
			title: "Новорічний святковий сет",
			desc: "Гірлянда, святкова піжама, зволожуюча маска та солодощі.",
			img: imgPool.sweets,
			priceFactor: 0.85
		},
		{
			id: "gift-sestra-8b",
			recipient: "Сестра",
			occasion: "8Б",
			badge: "Весна",
			title: "Квітково-ароматичний набір",
			desc: "Свічка з дерев'яним ґнотом, парфумований спрей та букет весняних квітів.",
			img: imgPool.perfume,
			priceFactor: 0.9
		},
		{
			id: "gift-sestra-wedding",
			recipient: "Сестра",
			occasion: "Весілля",
			badge: "Шик",
			title: "Шовковий халат & Парфум",
			desc: "Ніжний натуральний шовковий халат та легкий вечірній парфум.",
			img: imgPool.perfume,
			priceFactor: 1.1
		},

		// Брат
		{
			id: "gift-brat-dn",
			recipient: "Брат",
			occasion: "ДН",
			badge: "Tech",
			title: "Геймерський або Tech-набір",
			desc: "Бездротова миша, килимок з RGB-підсвіткою та портативний павербанк.",
			img: imgPool.tech,
			priceFactor: 0.9
		},
		{
			id: "gift-brat-nr",
			recipient: "Брат",
			occasion: "НР",
			badge: "Зима",
			title: "Теплий зимовий худі & Навушники",
			desc: "Затишна толстовка оверсайз та бездротові навушники.",
			img: imgPool.cozy,
			priceFactor: 0.95
		},
		{
			id: "gift-brat-8b",
			recipient: "Брат",
			occasion: "8Б",
			badge: "Стиль",
			title: "Чоловічий портмоне-стиль",
			desc: "Мінімалістичний кардхолдер та стильна ключниця з шкіри.",
			img: imgPool.leather,
			priceFactor: 0.85
		},
		{
			id: "gift-brat-wedding",
			recipient: "Брат",
			occasion: "Весілля",
			badge: "Преміум",
			title: "Стильні запонки & Елітний годинник",
			desc: "Срібні запонки та класичний наручний годинник у подарунковому футлярі.",
			img: imgPool.watches,
			priceFactor: 1.2
		}
	];

	// =========================================================================
	// 2. Стан додатку (State)
	// =========================================================================
	let giftsList = [];
	let deleteTargetId = null;

	// Елементи навігації
	const tabConstructor = document.getElementById('tabConstructor');
	const tabAdmin = document.getElementById('tabAdmin');
	const constructorView = document.getElementById('constructorView');
	const adminView = document.getElementById('adminView');
	const adminGiftCountBadge = document.getElementById('adminGiftCountBadge');

	// Елементи конструктора
	const form = document.getElementById('giftForm');
	const recipientSelect = document.getElementById('recipientSelect');
	const occasionSelect = document.getElementById('occasionSelect');
	const budgetInput = document.getElementById('budgetInput');
	const errorMessage = document.getElementById('errorMessage');
	const rezultatContainer = document.getElementById('rezultatContainer');
	const emptyStateContent = document.querySelector('.empty-state-content');
	const resultCard = document.getElementById('resultCard');

	// Елементи статистики адмінки
	const statTotalGifts = document.getElementById('statTotalGifts');
	const statTotalRecipients = document.getElementById('statTotalRecipients');
	const statTotalOccasions = document.getElementById('statTotalOccasions');
	const statLastSavedTime = document.getElementById('statLastSavedTime');

	// Елементи фільтрації адмінки
	const adminSearchInput = document.getElementById('adminSearchInput');
	const adminFilterRecipient = document.getElementById('adminFilterRecipient');
	const adminFilterOccasion = document.getElementById('adminFilterOccasion');
	const giftsTableBody = document.getElementById('giftsTableBody');
	const filteredGiftsCount = document.getElementById('filteredGiftsCount');
	const noGiftsFound = document.getElementById('noGiftsFound');

	// Кнопки тулбару адмінки
	const btnOpenAddModal = document.getElementById('btnOpenAddModal');
	const btnSaveStorage = document.getElementById('btnSaveStorage');

	// Модальне вікно редактора подарунка
	const giftModal = document.getElementById('giftModal');
	const modalTitle = document.getElementById('modalTitle');
	const modalCloseBtn = document.getElementById('modalCloseBtn');
	const modalCancelBtn = document.getElementById('modalCancelBtn');
	const giftEditorForm = document.getElementById('giftEditorForm');
	const editGiftId = document.getElementById('editGiftId');
	const conflictAlert = document.getElementById('conflictAlert');
	const conflictAlertText = document.getElementById('conflictAlertText');

	// Поля редактора
	const giftRecipientInput = document.getElementById('giftRecipientInput');
	const giftOccasionInput = document.getElementById('giftOccasionInput');
	const giftTitleInput = document.getElementById('giftTitleInput');
	const giftBadgeInput = document.getElementById('giftBadgeInput');
	const giftDescInput = document.getElementById('giftDescInput');
	const giftImgInput = document.getElementById('giftImgInput');
	const giftPriceFactorInput = document.getElementById('giftPriceFactorInput');
	const existingRecipientsList = document.getElementById('existingRecipientsList');
	const existingOccasionsList = document.getElementById('existingOccasionsList');

	// Елементи живого прев'ю в модалці
	const previewBadge = document.getElementById('previewBadge');
	const previewImage = document.getElementById('previewImage');
	const previewRecipient = document.getElementById('previewRecipient');
	const previewOccasion = document.getElementById('previewOccasion');
	const previewTitle = document.getElementById('previewTitle');
	const previewDesc = document.getElementById('previewDesc');
	const previewFactor = document.getElementById('previewFactor');

	// Модальне вікно видалення
	const deleteConfirmModal = document.getElementById('deleteConfirmModal');
	const deleteItemInfo = document.getElementById('deleteItemInfo');
	const deleteCloseBtn = document.getElementById('deleteCloseBtn');
	const deleteCancelBtn = document.getElementById('deleteCancelBtn');
	const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');

	// Контейнер сповіщень
	const toastContainer = document.getElementById('toastContainer');

	// =========================================================================
	// 3. Ініціалізація та завантаження сховища (Вимога 4: Збереження змін)
	// =========================================================================
	function loadGiftsFromStorage() {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length > 0) {
					// Валідація та нормалізація завантажених даних (Вимога 6)
					giftsList = parsed.map(item => normalizeGiftItem(item)).filter(Boolean);
					return;
				}
			}
		} catch (e) {
			console.error("Помилка при читанні з LocalStorage:", e);
		}

		// Якщо немає або пошкоджено — завантажуємо початкову базу
		giftsList = JSON.parse(JSON.stringify(initialGiftsData));
		saveGiftsToStorage(false);
	}

	function saveGiftsToStorage(showToastFeedback = true) {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(giftsList));
			updateSaveStatusTimestamp();
			if (showToastFeedback) {
				showToast("💾 Зміни успішно збережено в системі!", "success");
			}
		} catch (e) {
			console.error("Помилка збереження в LocalStorage:", e);
			showToast("⚠️ Помилка збереження даних!", "danger");
		}
	}

	function updateSaveStatusTimestamp() {
		const now = new Date();
		const timeStr = now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
		if (statLastSavedTime) {
			statLastSavedTime.textContent = `Збережено: ${timeStr}`;
		}
	}

	// =========================================================================
	// 4. Валідація та нормалізація даних (Вимоги 5 та 6)
	// =========================================================================
	function sanitizeString(str) {
		if (typeof str !== 'string') return '';
		return str.trim();
	}

	function escapeHtml(str) {
		if (typeof str !== 'string') return '';
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	function normalizeGiftItem(item) {
		if (!item || typeof item !== 'object') return null;
		return {
			id: item.id || `gift_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
			recipient: sanitizeString(item.recipient) || "Універсальний",
			occasion: sanitizeString(item.occasion) || "ДН",
			badge: sanitizeString(item.badge) || "Подарунок",
			title: sanitizeString(item.title) || "Подарунковий набір",
			desc: sanitizeString(item.desc) || "Чудовий подарунок на свято.",
			img: sanitizeString(item.img) || imgPool.celebration,
			priceFactor: typeof item.priceFactor === 'number' && item.priceFactor > 0 ? item.priceFactor : 0.9
		};
	}

	/**
	 * Комплексна перевірка введених даних форми редактора (Вимога 5)
	 */
	function validateGiftFormData(data) {
		const errors = {};

		// Отримувач
		if (!data.recipient || data.recipient.length < 2) {
			errors.recipient = "Вкажіть отримувача (мінімум 2 літери)";
		}

		// Подія
		if (!data.occasion || data.occasion.length < 1) {
			errors.occasion = "Вкажіть подію";
		}

		// Назва
		if (!data.title || data.title.length < 3) {
			errors.title = "Назва має містити щонайменше 3 символи";
		} else if (data.title.length > 120) {
			errors.title = "Назва занадто довга (максимум 120 символів)";
		}

		// Бейдж
		if (!data.badge || data.badge.length < 2) {
			errors.badge = "Вкажіть категорію/бейдж (мін. 2 символи)";
		}

		// Опис
		if (!data.desc || data.desc.length < 10) {
			errors.desc = "Опис має бути інформативним (мінімум 10 символів)";
		}

		// URL зображення
		if (!data.img) {
			errors.img = "Вкажіть URL або шлях до фото";
		} else if (!/^https?:\/\/.+/i.test(data.img) && !data.img.startsWith('assets/')) {
			errors.img = "URL має починатися з http://, https:// або assets/";
		}

		// Коефіцієнт ціни
		const factor = parseFloat(data.priceFactor);
		if (isNaN(factor) || factor <= 0.05 || factor > 3.0) {
			errors.priceFactor = "Вкажіть коефіцієнт від 0.1 до 3.0";
		}

		return errors;
	}

	function displayFormErrors(errors) {
		const fieldIds = [
			{ id: 'giftRecipientInput', errId: 'errRecipient', key: 'recipient' },
			{ id: 'giftOccasionInput', errId: 'errOccasion', key: 'occasion' },
			{ id: 'giftTitleInput', errId: 'errTitle', key: 'title' },
			{ id: 'giftBadgeInput', errId: 'errBadge', key: 'badge' },
			{ id: 'giftDescInput', errId: 'errDesc', key: 'desc' },
			{ id: 'giftImgInput', errId: 'errImg', key: 'img' },
			{ id: 'giftPriceFactorInput', errId: 'errPriceFactor', key: 'priceFactor' }
		];

		let firstInvalidField = null;

		fieldIds.forEach(({ id, errId, key }) => {
			const input = document.getElementById(id);
			const errSpan = document.getElementById(errId);
			if (input && errSpan) {
				if (errors[key]) {
					input.classList.add('invalid');
					errSpan.textContent = errors[key];
					if (!firstInvalidField) firstInvalidField = input;
				} else {
					input.classList.remove('invalid');
					errSpan.textContent = '';
				}
			}
		});

		if (firstInvalidField) {
			firstInvalidField.focus();
		}
	}

	function clearFormErrors() {
		displayFormErrors({});
	}

	/**
	 * Перевірка відповідності та конфлікту пари (Отримувач + Подія) (Вимога 6)
	 */
	function checkConflictData(recipient, occasion, currentId) {
		if (!recipient || !occasion) {
			conflictAlert.style.display = 'none';
			return null;
		}

		const cleanRec = recipient.trim().toLowerCase();
		const cleanOcc = occasion.trim().toLowerCase();

		const existing = giftsList.find(item =>
			item.recipient.trim().toLowerCase() === cleanRec &&
			item.occasion.trim().toLowerCase() === cleanOcc &&
			item.id !== currentId
		);

		if (existing) {
			conflictAlert.style.display = 'flex';
			conflictAlertText.innerHTML = `⚠️ Для <strong>${escapeHtml(recipient)}</strong> на подію <strong>${escapeHtml(occasion)}</strong> вже зареєстровано подарунок: «<em>${escapeHtml(existing.title)}</em>». При збереженні він буде оновлений цим записом.`;
			return existing;
		} else {
			conflictAlert.style.display = 'none';
			return null;
		}
	}

	// =========================================================================
	// 5. Синхронізація селектів Конструктора (Вимога 6)
	// =========================================================================
	function syncConstructorDropdowns() {
		// Збираємо унікальних отримувачів з поточної бази
		const defaultRecipients = ["Мама", "Тато", "Сестра", "Брат", "Колега", "Бабуся", "Дідусь", "Кохана людина", "Подруга", "Друг", "Хлопець", "Дівчина"];
		const dbRecipients = giftsList.map(g => g.recipient);
		const allRecipients = Array.from(new Set([...defaultRecipients, ...dbRecipients])).filter(Boolean);

		// Зберігаємо поточний вибір
		const currentSelectedRecipient = recipientSelect.value;
		recipientSelect.innerHTML = '<option value="">-- Оберіть отримувача --</option>';
		allRecipients.forEach(rec => {
			const opt = document.createElement('option');
			opt.value = rec;
			opt.textContent = rec;
			if (rec === currentSelectedRecipient) opt.selected = true;
			recipientSelect.appendChild(opt);
		});

		// Збираємо унікальні події
		const defaultOccasions = ["ДН", "НР", "8Б", "Весілля"];
		const dbOccasions = giftsList.map(g => g.occasion);
		const allOccasions = Array.from(new Set([...defaultOccasions, ...dbOccasions])).filter(Boolean);

		const currentSelectedOccasion = occasionSelect.value;
		occasionSelect.innerHTML = '<option value="">-- Оберіть подію --</option>';
		allOccasions.forEach(occ => {
			const opt = document.createElement('option');
			opt.value = occ;
			opt.textContent = occasionLabels[occ] ? occasionLabels[occ] : occ;
			if (occ === currentSelectedOccasion) opt.selected = true;
			occasionSelect.appendChild(opt);
		});

		// Синхронізуємо datalist у модалці
		if (existingRecipientsList) {
			existingRecipientsList.innerHTML = allRecipients.map(r => `<option value="${escapeHtml(r)}">`).join('');
		}
		if (existingOccasionsList) {
			existingOccasionsList.innerHTML = allOccasions.map(o => `<option value="${escapeHtml(o)}">`).join('');
		}

		// Синхронізуємо фільтри в адмінці
		syncAdminFilters(allRecipients, allOccasions);
	}

	function syncAdminFilters(recipients, occasions) {
		const currentRecFilter = adminFilterRecipient.value;
		const currentOccFilter = adminFilterOccasion.value;

		adminFilterRecipient.innerHTML = '<option value="">Всі отримувачі</option>';
		recipients.forEach(r => {
			const opt = document.createElement('option');
			opt.value = r;
			opt.textContent = r;
			if (r === currentRecFilter) opt.selected = true;
			adminFilterRecipient.appendChild(opt);
		});

		adminFilterOccasion.innerHTML = '<option value="">Всі події</option>';
		occasions.forEach(o => {
			const opt = document.createElement('option');
			opt.value = o;
			opt.textContent = occasionLabels[o] ? occasionLabels[o] : o;
			if (o === currentOccFilter) opt.selected = true;
			adminFilterOccasion.appendChild(opt);
		});
	}

	// =========================================================================
	// 6. Оновлення та рендеринг Адмін-панелі
	// =========================================================================
	function updateAdminUI() {
		// Оновлюємо лічильники статистики
		const totalGifts = giftsList.length;
		const uniqueRecipients = new Set(giftsList.map(g => g.recipient.trim().toLowerCase())).size;
		const uniqueOccasions = new Set(giftsList.map(g => g.occasion.trim().toLowerCase())).size;

		if (statTotalGifts) statTotalGifts.textContent = totalGifts;
		if (statTotalRecipients) statTotalRecipients.textContent = uniqueRecipients;
		if (statTotalOccasions) statTotalOccasions.textContent = uniqueOccasions;
		if (adminGiftCountBadge) adminGiftCountBadge.textContent = totalGifts;

		renderGiftsTable();
	}

	function renderGiftsTable() {
		const searchQuery = adminSearchInput.value.trim().toLowerCase();
		const filterRecipient = adminFilterRecipient.value;
		const filterOccasion = adminFilterOccasion.value;

		const filtered = giftsList.filter(item => {
			const matchesSearch = !searchQuery ||
				item.title.toLowerCase().includes(searchQuery) ||
				item.desc.toLowerCase().includes(searchQuery) ||
				item.badge.toLowerCase().includes(searchQuery);

			const matchesRecipient = !filterRecipient || item.recipient === filterRecipient;
			const matchesOccasion = !filterOccasion || item.occasion === filterOccasion;

			return matchesSearch && matchesRecipient && matchesOccasion;
		});

		filteredGiftsCount.textContent = filtered.length;

		if (filtered.length === 0) {
			giftsTableBody.innerHTML = '';
			noGiftsFound.style.display = 'block';
			return;
		}

		noGiftsFound.style.display = 'none';

		giftsTableBody.innerHTML = filtered.map(gift => {
			const occasionText = occasionLabels[gift.occasion] || gift.occasion;
			const factorText = Number(gift.priceFactor || 0.9).toFixed(2) + 'x';

			return `
				<tr data-id="${gift.id}">
					<td>
						<img src="${escapeHtml(gift.img)}" alt="${escapeHtml(gift.title)}" class="table-gift-thumb" onerror="this.src='${imgPool.celebration}'">
					</td>
					<td>
						<span class="badge-tag badge-recipient">👤 ${escapeHtml(gift.recipient)}</span>
					</td>
					<td>
						<span class="badge-tag badge-occasion">🎉 ${escapeHtml(occasionText)}</span>
					</td>
					<td>
						<span class="badge-tag badge-category">${escapeHtml(gift.badge)}</span>
					</td>
					<td>
						<div class="table-gift-title">${escapeHtml(gift.title)}</div>
						<div class="table-gift-desc">${escapeHtml(gift.desc)}</div>
					</td>
					<td>
						<span class="table-factor-tag">${factorText}</span>
					</td>
					<td class="th-actions">
						<div class="row-actions">
							<button type="button" class="action-btn test-btn" data-action="test" data-id="${gift.id}" title="Протестувати в конструкторі">
								👁️ Тест
							</button>
							<button type="button" class="action-btn edit-btn" data-action="edit" data-id="${gift.id}" title="Редагувати подарунок">
								✏️ Редагувати
							</button>
							<button type="button" class="action-btn delete-btn" data-action="delete" data-id="${gift.id}" title="Видалити подарунок">
								🗑️
							</button>
						</div>
					</td>
				</tr>
			`;
		}).join('');
	}

	// =========================================================================
	// 7. Робота з модальним вікном (Додавання та Редагування: Вимоги 1 та 2)
	// =========================================================================
	function openAddGiftModal() {
		editGiftId.value = '';
		modalTitle.textContent = '➕ Додати новий подарунок';
		giftEditorForm.reset();
		giftPriceFactorInput.value = '0.9';
		giftImgInput.value = imgPool.spa;
		clearFormErrors();
		conflictAlert.style.display = 'none';
		updateLivePreview();
		giftModal.style.display = 'flex';
		giftRecipientInput.focus();
	}

	function openEditGiftModal(id) {
		const gift = giftsList.find(g => g.id === id);
		if (!gift) return;

		editGiftId.value = gift.id;
		modalTitle.textContent = '✏️ Редагування подарунка';
		clearFormErrors();

		giftRecipientInput.value = gift.recipient;
		giftOccasionInput.value = gift.occasion;
		giftTitleInput.value = gift.title;
		giftBadgeInput.value = gift.badge;
		giftDescInput.value = gift.desc;
		giftImgInput.value = gift.img;
		giftPriceFactorInput.value = gift.priceFactor;

		checkConflictData(gift.recipient, gift.occasion, gift.id);
		updateLivePreview();
		giftModal.style.display = 'flex';
		giftTitleInput.focus();
	}

	function closeModal() {
		giftModal.style.display = 'none';
		clearFormErrors();
	}

	function updateLivePreview() {
		const rec = giftRecipientInput.value.trim() || 'Отримувач';
		const occ = giftOccasionInput.value.trim() || 'Подія';
		const title = giftTitleInput.value.trim() || 'Назва подарунка';
		const badge = giftBadgeInput.value.trim() || 'Категорія';
		const desc = giftDescInput.value.trim() || 'Тут буде відображатися опис вашого подарунка...';
		const img = giftImgInput.value.trim() || imgPool.celebration;
		const factor = parseFloat(giftPriceFactorInput.value) || 0.9;

		previewBadge.textContent = badge;
		previewRecipient.textContent = rec;
		previewOccasion.textContent = occasionLabels[occ] ? occ : occ;
		previewTitle.textContent = title;
		previewDesc.textContent = desc;
		previewFactor.textContent = factor.toFixed(2) + 'x';

		// Оновлюємо картинку з обробкою помилки
		previewImage.onerror = () => { previewImage.src = imgPool.celebration; };
		previewImage.src = img;
	}

	// Інтерактивне оновлення живого прев'ю та перевірки конфліктів при введенні
	[giftRecipientInput, giftOccasionInput, giftTitleInput, giftBadgeInput, giftDescInput, giftImgInput, giftPriceFactorInput].forEach(inp => {
		if (inp) {
			inp.addEventListener('input', () => {
				updateLivePreview();
				inp.classList.remove('invalid');
				const errSpan = document.getElementById(inp.id.replace('Input', '').replace('gift', 'err'));
				if (errSpan) errSpan.textContent = '';

				if (inp === giftRecipientInput || inp === giftOccasionInput) {
					checkConflictData(giftRecipientInput.value, giftOccasionInput.value, editGiftId.value);
				}
			});
		}
	});

	// Кнопки швидких пресетів фото
	const presetButtons = document.getElementById('presetButtons');
	if (presetButtons) {
		presetButtons.addEventListener('click', (e) => {
			const btn = e.target.closest('.preset-btn');
			if (btn && btn.dataset.url) {
				giftImgInput.value = btn.dataset.url;
				giftImgInput.classList.remove('invalid');
				const errSpan = document.getElementById('errImg');
				if (errSpan) errSpan.textContent = '';
				updateLivePreview();
			}
		});
	}

	// Відправка форми додавання / редагування
	giftEditorForm.addEventListener('submit', (e) => {
		e.preventDefault();

		const formData = {
			recipient: giftRecipientInput.value.trim(),
			occasion: giftOccasionInput.value.trim(),
			title: giftTitleInput.value.trim(),
			badge: giftBadgeInput.value.trim(),
			desc: giftDescInput.value.trim(),
			img: giftImgInput.value.trim(),
			priceFactor: parseFloat(giftPriceFactorInput.value)
		};

		// 1. Перевірка введених даних (Вимога 5)
		const validationErrors = validateGiftFormData(formData);
		if (Object.keys(validationErrors).length > 0) {
			displayFormErrors(validationErrors);
			showToast("⚠️ Перевірте правильність заповнення полів форми!", "danger");
			return;
		}

		clearFormErrors();

		const currentId = editGiftId.value;

		// 2. Відповідність даних: перевірка чи оновлюємо існуючий або дублікат (Вимога 6)
		const conflictItem = checkConflictData(formData.recipient, formData.occasion, currentId);

		if (currentId) {
			// РЕДАГУВАННЯ ПОДАРУНКА (Вимога 2)
			const index = giftsList.findIndex(g => g.id === currentId);
			if (index !== -1) {
				giftsList[index] = {
					...giftsList[index],
					...formData
				};
				saveGiftsToStorage(false);
				showToast(`✏️ Подарунок «${escapeHtml(formData.title)}» успішно оновлено!`, "success");
			}
		} else {
			// ДОДАВАННЯ ПОДАРУНКА (Вимога 1)
			if (conflictItem) {
				// Якщо вже був подарунок для цієї пари, замінюємо або оновлюємо
				const idx = giftsList.findIndex(g => g.id === conflictItem.id);
				if (idx !== -1) {
					giftsList[idx] = {
						...giftsList[idx],
						...formData
					};
					saveGiftsToStorage(false);
					showToast(`🔄 Оновлено існуючий подарунок для ${escapeHtml(formData.recipient)} (${escapeHtml(formData.occasion)})`, "success");
				}
			} else {
				const newGift = {
					id: `gift_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
					...formData
				};
				giftsList.unshift(newGift);
				saveGiftsToStorage(false);
				showToast(`🎉 Новий подарунок «${escapeHtml(formData.title)}» успішно додано!`, "success");
			}
		}

		closeModal();
		syncConstructorDropdowns();
		updateAdminUI();
	});

	// =========================================================================
	// 8. Видалення подарунка (Вимога 3)
	// =========================================================================
	function openDeleteModal(id) {
		const gift = giftsList.find(g => g.id === id);
		if (!gift) return;

		deleteTargetId = id;
		deleteItemInfo.innerHTML = `
			<div><strong>${escapeHtml(gift.title)}</strong></div>
			<div style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">
				Для: <strong>${escapeHtml(gift.recipient)}</strong> • Подія: <strong>${escapeHtml(occasionLabels[gift.occasion] || gift.occasion)}</strong>
			</div>
		`;
		deleteConfirmModal.style.display = 'flex';
	}

	function closeDeleteModal() {
		deleteConfirmModal.style.display = 'none';
		deleteTargetId = null;
	}

	deleteConfirmBtn.addEventListener('click', () => {
		if (!deleteTargetId) return;

		const target = giftsList.find(g => g.id === deleteTargetId);
		const title = target ? target.title : 'Подарунок';

		giftsList = giftsList.filter(g => g.id !== deleteTargetId);
		saveGiftsToStorage(false);

		showToast(`🗑️ Подарунок «${escapeHtml(title)}» видалено!`, "danger");

		closeDeleteModal();
		syncConstructorDropdowns();
		updateAdminUI();

		// Якщо видалений подарунок зараз показаний у конструкторі — очищаємо результат
		if (resultCard && resultCard.style.display !== 'none') {
			renderResultCard(recipientSelect.value, occasionSelect.value, parseFloat(budgetInput.value));
		}
	});

	deleteCloseBtn.addEventListener('click', closeDeleteModal);
	deleteCancelBtn.addEventListener('click', closeDeleteModal);

	// =========================================================================
	// 9. Дії в таблиці адмінки (Event Delegation)
	// =========================================================================
	giftsTableBody.addEventListener('click', (e) => {
		const btn = e.target.closest('.action-btn');
		if (!btn) return;

		const action = btn.dataset.action;
		const id = btn.dataset.id;

		if (action === 'edit') {
			openEditGiftModal(id);
		} else if (action === 'delete') {
			openDeleteModal(id);
		} else if (action === 'test') {
			// Перемикаємося в Конструктор і одразу тестуємо цей подарунок
			const gift = giftsList.find(g => g.id === id);
			if (gift) {
				switchToTab('constructor');
				recipientSelect.value = gift.recipient;
				occasionSelect.value = gift.occasion;
				budgetInput.value = '1000';
				errorMessage.style.display = 'none';
				renderResultCard(gift.recipient, gift.occasion, 1000);
				showToast(`🔍 Відкрито для перегляду: «${escapeHtml(gift.title)}»`, "success");
			}
		}
	});

	// Пошук та фільтри в адмінці
	adminSearchInput.addEventListener('input', renderGiftsTable);
	adminFilterRecipient.addEventListener('change', renderGiftsTable);
	adminFilterOccasion.addEventListener('change', renderGiftsTable);

	// Кнопка відкриття модалки додавання
	btnOpenAddModal.addEventListener('click', openAddGiftModal);
	modalCloseBtn.addEventListener('click', closeModal);
	modalCancelBtn.addEventListener('click', closeModal);

	// Примусове збереження (Вимога 4)
	btnSaveStorage.addEventListener('click', () => {
		saveGiftsToStorage(true);
	});

	// Закриття модалок при кліку поза вікном
	window.addEventListener('click', (e) => {
		if (e.target === giftModal) closeModal();
		if (e.target === deleteConfirmModal) closeDeleteModal();
	});

	// Закриття по Esc
	window.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			closeModal();
			closeDeleteModal();
		}
	});

	// =========================================================================
	// 10. Клієнтська логіка: Конструктор подарунків
	// =========================================================================

	// Очищення помилок конструктора при зміні полів
	[recipientSelect, occasionSelect, budgetInput].forEach(element => {
		if (element) {
			element.addEventListener('input', () => {
				element.classList.remove('invalid');
				if (recipientSelect.value && occasionSelect.value && budgetInput.value > 0) {
					errorMessage.style.display = 'none';
				}
			});
		}
	});

	// Сабміт форми конструктора
	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const recipient = recipientSelect.value;
		const occasion = occasionSelect.value;
		const budget = parseFloat(budgetInput.value);

		let hasError = false;

		if (!recipient) {
			recipientSelect.classList.add('invalid');
			hasError = true;
		} else {
			recipientSelect.classList.remove('invalid');
		}

		if (!occasion) {
			occasionSelect.classList.add('invalid');
			hasError = true;
		} else {
			occasionSelect.classList.remove('invalid');
		}

		if (!budget || budget <= 0 || isNaN(budget)) {
			budgetInput.classList.add('invalid');
			hasError = true;
		} else {
			budgetInput.classList.remove('invalid');
		}

		if (hasError) {
			errorMessage.style.display = 'block';
			errorMessage.textContent = '⚠️ Будь ласка, заповніть усі поля форми!';
			return;
		}

		errorMessage.style.display = 'none';
		renderResultCard(recipient, occasion, budget);
	});

	// Відображення картки розрахунку в Конструкторі
	function renderResultCard(recipient, occasion, budget) {
		if (!recipient || !occasion || !budget || budget <= 0) return;

		// Шукаємо точний збіг у базі
		let gift = giftsList.find(g =>
			g.recipient.trim().toLowerCase() === recipient.trim().toLowerCase() &&
			g.occasion.trim().toLowerCase() === occasion.trim().toLowerCase()
		);

		// Якщо точного збігу немає — шукаємо будь-який подарунок для цього отримувача
		if (!gift) {
			gift = giftsList.find(g => g.recipient.trim().toLowerCase() === recipient.trim().toLowerCase());
		}

		// Якщо й такого немає — беремо універсальний фолбек
		if (!gift) {
			gift = {
				badge: "Оптимальний",
				title: `Святковий бокс (${recipient} • ${occasion})`,
				desc: "Подарунковий набір із солодощами, чаєм, святковою свічкою та вітальною листівкою.",
				img: imgPool.celebration,
				priceFactor: 0.9
			};
		}

		const factor = gift.priceFactor || 0.9;
		const calculatedPrice = Math.round(budget * factor);
		const occasionFull = occasionLabels[occasion] || occasion;

		resultCard.innerHTML = `
			<div class="card-badge">${escapeHtml(gift.badge)}</div>
			<img src="${escapeHtml(gift.img)}" alt="${escapeHtml(gift.title)}" onerror="this.src='${imgPool.celebration}'">
			<div class="card-body">
				<div class="card-target-tag">👤 Для: <strong>${escapeHtml(recipient)}</strong> • ${escapeHtml(occasionFull)}</div>
				<h3>${escapeHtml(gift.title)}</h3>
				<p>${escapeHtml(gift.desc)}</p>
				<div class="card-footer">
					<div class="card-price">Розрахункова ціна: <strong>${calculatedPrice.toLocaleString('uk-UA')} грн</strong></div>
				</div>
			</div>
		`;

		if (emptyStateContent) {
			emptyStateContent.style.display = 'none';
		}

		resultCard.style.display = 'flex';
		rezultatContainer.classList.remove('empty-state');
	}

	// =========================================================================
	// 11. Навігація між вкладками (Конструктор <-> Адмін-панель)
	// =========================================================================
	function switchToTab(tabName) {
		if (tabName === 'admin') {
			tabConstructor.classList.remove('active');
			tabAdmin.classList.add('active');
			constructorView.style.display = 'none';
			adminView.style.display = 'block';
			window.location.hash = 'admin';
			updateAdminUI();
		} else {
			tabAdmin.classList.remove('active');
			tabConstructor.classList.add('active');
			adminView.style.display = 'none';
			constructorView.style.display = 'block';
			window.location.hash = 'constructor';
		}
	}

	tabConstructor.addEventListener('click', () => switchToTab('constructor'));
	tabAdmin.addEventListener('click', () => switchToTab('admin'));

	// Обробка хешу URL при завантаженні (наприклад, #admin)
	if (window.location.hash === '#admin') {
		switchToTab('admin');
	}

	// =========================================================================
	// 12. Спливаючі сповіщення (Toast Notifications)
	// =========================================================================
	function showToast(message, type = 'success') {
		const toast = document.createElement('div');
		toast.className = `toast toast-${type}`;

		let icon = 'ℹ️';
		if (type === 'success') icon = '✅';
		if (type === 'danger') icon = '❌';
		if (type === 'warning') icon = '⚠️';

		toast.innerHTML = `
			<span class="toast-icon">${icon}</span>
			<span class="toast-msg">${message}</span>
		`;

		toastContainer.appendChild(toast);

		setTimeout(() => {
			toast.style.opacity = '0';
			toast.style.transform = 'translateX(100%)';
			setTimeout(() => {
				if (toast.parentNode) {
					toast.parentNode.removeChild(toast);
				}
			}, 300);
		}, 3500);
	}

	// =========================================================================
	// 13. Старт програми
	// =========================================================================
	loadGiftsFromStorage();
	syncConstructorDropdowns();
	updateAdminUI();
	updateSaveStatusTimestamp();
});
