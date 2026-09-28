import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

/**
 * Declarative-style node for the srezai.ru web-access REST API.
 *
 * Endpoints and body fields mirror the official srezai SDK
 * (github.com/srezai-team/srezai-sdk). Base URL is https://srezai.ru and each
 * operation posts to /api/v1/<path>.
 *
 * Note: get_usage exists only over MCP, not REST, so it is intentionally not
 * exposed here. Quota is reported via X-RateLimit-* headers.
 */
export class Srezai implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'srezai',
		name: 'srezai',
		icon: 'file:node_logo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description:
			'Поисковый API для ИИ-агентов: поиск, чтение страниц, карта сайта, извлечение по схеме, проверка фактов и исследование. Отдаёт готовый Markdown или JSON вместо сырых ссылок',
		defaults: {
			name: 'srezai',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		credentials: [
			{
				name: 'srezaiApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Операция',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'webSearch',
				options: [
					{
						name: 'Умный поиск (RAG)',
						value: 'answerSearch',
						action: 'Получить готовый ответ на вопрос',
						description:
							'RAG-поиск: готовый ответ со ссылками и релевантностью источников (3–10 кредитов по глубине)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/answer',
							},
						},
					},
					{
						name: 'Поиск в интернете',
						value: 'webSearch',
						action: 'Поиск в интернете',
						description: 'Поиск страниц по текстовому запросу (1 кредит)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/search',
							},
						},
					},
					{
						name: 'Поиск картинок',
						value: 'imageSearch',
						action: 'Поиск картинок',
						description: 'Поиск изображений по текстовому запросу (1 кредит)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/media',
							},
						},
					},
					{
						name: 'Прочитать страницу',
						value: 'readUrl',
						action: 'Прочитать страницу как markdown',
						description:
							'Открыть одну страницу и вернуть чистый текст в markdown. Длинная страница приходит окнами (1 кредит)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/read',
							},
						},
					},
					{
						name: 'Карта сайта',
						value: 'map',
						action: 'Собрать карту адресов сайта',
						description:
							'Адреса и разделы сайта из sitemap или со стартовой страницы (1 кредит за каждые 10 адресов, минимум 1)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/map',
							},
						},
					},
					{
						name: 'Чтение разделов сайта',
						value: 'crawl',
						action: 'Прочитать страницы сайта',
						description:
							'Карта адресов плюс текст найденных страниц, фильтры по адресу и по тексту (1 кредит за прочитанную страницу)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/crawl',
							},
						},
					},
					{
						name: 'Извлечь данные',
						value: 'extract',
						action: 'Извлечь структурированные данные со страницы',
						description: 'Вернуть JSON строго по вашей схеме (2 кредита за ссылку)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/extract',
							},
						},
					},
					{
						name: 'Скриншот страницы',
						value: 'fetchPage',
						action: 'Сделать скриншот страницы и вернуть текст',
						description:
							'Отрисовать страницу и вернуть скриншот и markdown (3 кредита; 1, если рендер не удался)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/fetch',
							},
						},
					},
					{
						name: 'Проверка утверждения',
						value: 'verifyClaim',
						action: 'Проверить утверждение по источникам',
						description:
							'Вердикт с дословными цитатами по 2–5 независимым источникам (8 кредитов)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/verify',
							},
						},
					},
					{
						name: 'Глубокое исследование',
						value: 'deepResearch',
						action: 'Провести многошаговое исследование',
						description:
							'Свести множество источников в готовый ответ (20 кредитов плюс 3 за каждую 1000 токенов ответа)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/deep',
							},
						},
					},
				],
			},

			// ---------- query (search / image search / deep research / answer search) ----------
			{
				displayName: 'Запрос',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['webSearch', 'imageSearch', 'deepResearch', 'answerSearch'] } },
				routing: { send: { type: 'body', property: 'query' } },
				description: 'Поисковый запрос или тема исследования',
			},

			// ---------- claim (verify) ----------
			{
				displayName: 'Утверждение',
				name: 'claim',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'GPT-4 вышла в марте 2023 года',
				displayOptions: { show: { operation: ['verifyClaim'] } },
				routing: { send: { type: 'body', property: 'claim' } },
				description:
					'Утверждение одной фразой, до 500 символов. Формулируйте проверяемо: «выручка X за 2024 год — 12 млрд ₽» проверяется, «X — хорошая компания» нет',
			},

			// ---------- url (read / map / crawl / extract / fetch) ----------
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://example.com/article',
				displayOptions: { show: { operation: ['readUrl', 'map', 'crawl', 'extract', 'fetchPage'] } },
				routing: { send: { type: 'body', property: 'url' } },
				description: 'Полный URL страницы (http/https)',
			},

			// ---------- extract schema ----------
			{
				displayName: 'Схема (JSON)',
				name: 'schema',
				type: 'json',
				required: true,
				default: '{\n  "title": "string",\n  "price": "number?"\n}',
				displayOptions: { show: { operation: ['extract'] } },
				routing: { send: { type: 'body', property: 'schema' } },
				description:
					'Схема результата. Поддерживается сокращённая форма: {"title":"string","price":"number?"}. «?» — необязательное поле, «[]» — массив.',
			},

			// ---------- answer search schema (optional) ----------
			{
				displayName: 'Схема ответа (JSON, опционально)',
				name: 'answerSchema',
				type: 'json',
				required: false,
				default: '',
				placeholder: '{\n  "services": [\n    {\n      "name": "string",\n      "price": "string"\n    }\n  ]\n}',
				displayOptions: { show: { operation: ['answerSearch'] } },
				routing: { send: { type: 'body', property: 'schema' } },
				description:
					'JSON Schema для structured output. Если не указана, вернётся свободный текст.',
			},

			// ---------- answer search depth ----------
			{
				displayName: 'Глубина поиска',
				name: 'depth',
				type: 'options',
				default: 'balanced',
				options: [
					{ name: 'Быстрая (2 страницы, ~5 сек, 3 кредита)', value: 'fast' },
					{ name: 'Сбалансированная (5 страниц, ~12 сек, 5 кредитов)', value: 'balanced' },
					{ name: 'Глубокая (10 страниц, ~25 сек, 10 кредитов)', value: 'deep' },
				],
				displayOptions: { show: { operation: ['answerSearch'] } },
				routing: { send: { type: 'body', property: 'depth' } },
				description: 'Сколько страниц читать и анализировать',
			},

			// ---------- optional fields ----------
			{
				displayName: 'Дополнительные параметры',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Добавить параметр',
				default: {},
				displayOptions: {
					show: { operation: ['webSearch', 'imageSearch', 'readUrl', 'extract', 'fetchPage'] },
				},
				options: [
					{
						displayName: 'Количество результатов',
						name: 'num',
						type: 'number',
						default: 10,
						displayOptions: { show: { '/operation': ['webSearch', 'imageSearch'] } },
						routing: { send: { type: 'body', property: 'num' } },
					},
					{
						displayName: 'Максимум символов',
						name: 'maxChars',
						type: 'number',
						default: 4000,
						displayOptions: { show: { '/operation': ['readUrl', 'fetchPage'] } },
						routing: { send: { type: 'body', property: 'maxChars' } },
					},
					{
						displayName: 'Движок',
						name: 'engine',
						type: 'options',
						default: 'auto',
						options: [
							{ name: 'Авто', value: 'auto' },
							{ name: 'Быстрый', value: 'fast' },
							{ name: 'Динамический', value: 'dynamic' },
							{ name: 'Скрытный', value: 'stealth' },
						],
						displayOptions: { show: { '/operation': ['readUrl', 'extract'] } },
						routing: { send: { type: 'body', property: 'engine' } },
					},
					{
						displayName: 'Период',
						name: 'timeRange',
						type: 'options',
						default: 'all',
						options: [
							{ name: 'За всё время', value: 'all' },
							{ name: 'За день', value: 'day' },
							{ name: 'За неделю', value: 'week' },
							{ name: 'За месяц', value: 'month' },
							{ name: 'За год', value: 'year' },
						],
						displayOptions: { show: { '/operation': ['webSearch', 'imageSearch'] } },
						routing: { send: { type: 'body', property: 'timeRange' } },
					},
					{
						displayName: 'Инструкция',
						name: 'instruction',
						type: 'string',
						default: '',
						displayOptions: { show: { '/operation': ['extract'] } },
						routing: { send: { type: 'body', property: 'instruction' } },
						description: 'Подсказка для разбора, если из схемы неочевидно',
					},
				],
			},

			// ---------- site map options ----------
			{
				displayName: 'Параметры карты сайта',
				name: 'mapOptions',
				type: 'collection',
				placeholder: 'Добавить параметр',
				default: {},
				displayOptions: { show: { operation: ['map'] } },
				options: [
					{
						displayName: 'Сколько адресов вернуть',
						name: 'limit',
						type: 'number',
						default: 50,
						routing: { send: { type: 'body', property: 'limit' } },
						description:
							'От 1 до 200. Это размер ответа, а не выборки: total в ответе покажет, сколько адресов нашлось всего',
					},
					{
						displayName: 'Фильтр по адресу',
						name: 'search',
						type: 'string',
						default: '',
						routing: { send: { type: 'body', property: 'search' } },
						description:
							'Оставить адреса с этой подстрокой. Сравнивается адрес, а не текст страницы, поэтому указывайте латинский фрагмент пути',
					},
					{
						displayName: 'Оставить пути (JSON-массив)',
						name: 'selectPaths',
						type: 'json',
						default: '[]',
						routing: { send: { type: 'body', property: 'selectPaths' } },
						description:
							'До 10 подстрок адреса, например ["organizers"]. Так целятся в раздел сайта, а не во весь сайт',
					},
					{
						displayName: 'Исключить пути (JSON-массив)',
						name: 'excludePaths',
						type: 'json',
						default: '[]',
						routing: { send: { type: 'body', property: 'excludePaths' } },
						description: 'До 10 подстрок адреса, например ["/tag/", "/page/"]',
					},
					{
						displayName: 'С поддоменами',
						name: 'includeSubdomains',
						type: 'boolean',
						default: false,
						routing: { send: { type: 'body', property: 'includeSubdomains' } },
						description: 'Считать своими и поддомены сайта. Адреса чужих доменов отбрасываются всегда',
					},
				],
			},

			// ---------- site crawl options ----------
			{
				displayName: 'Параметры чтения разделов',
				name: 'crawlOptions',
				type: 'collection',
				placeholder: 'Добавить параметр',
				default: {},
				displayOptions: { show: { operation: ['crawl'] } },
				options: [
					{
						displayName: 'Сколько страниц прочитать',
						name: 'limit',
						type: 'number',
						default: 5,
						routing: { send: { type: 'body', property: 'limit' } },
						description: 'От 1 до 20. Страницы читаются параллельно, поэтому 20 идёт заметно дольше, чем 5',
					},
					{
						displayName: 'Фильтр по тексту',
						name: 'search',
						type: 'string',
						default: '',
						routing: { send: { type: 'body', property: 'search' } },
						description:
							'Оставить страницы, в тексте или заголовке которых есть эти слова. В отличие от карты сайта сравнение идёт с содержимым, поэтому русское слово здесь работает',
					},
					{
						displayName: 'Оставить пути (JSON-массив)',
						name: 'selectPaths',
						type: 'json',
						default: '[]',
						routing: { send: { type: 'body', property: 'selectPaths' } },
						description:
							'До 10 подстрок адреса, например ["organizers"]. Без него читаются первые адреса карты — у агрегаторов это служебные страницы',
					},
					{
						displayName: 'Исключить пути (JSON-массив)',
						name: 'excludePaths',
						type: 'json',
						default: '[]',
						routing: { send: { type: 'body', property: 'excludePaths' } },
						description: 'До 10 подстрок адреса, например ["/tag/", "/page/"]',
					},
					{
						displayName: 'С поддоменами',
						name: 'includeSubdomains',
						type: 'boolean',
						default: false,
						routing: { send: { type: 'body', property: 'includeSubdomains' } },
						description: 'Считать своими и поддомены сайта',
					},
				],
			},

			// ---------- verify options ----------
			{
				displayName: 'Параметры проверки',
				name: 'verifyOptions',
				type: 'collection',
				placeholder: 'Добавить параметр',
				default: {},
				displayOptions: { show: { operation: ['verifyClaim'] } },
				options: [
					{
						displayName: 'Сколько источников читать',
						name: 'maxSources',
						type: 'number',
						default: 4,
						routing: { send: { type: 'body', property: 'maxSources' } },
						description:
							'От 2 до 5 независимых доменов. Цена от их числа не зависит, но больше источников — выше шанс поймать расхождение',
					},
					{
						displayName: 'Поисковый запрос',
						name: 'query',
						type: 'string',
						default: '',
						routing: { send: { type: 'body', property: 'query' } },
						description:
							'Отдельный запрос, если утверждение как есть ищется плохо: длинное, с местоимениями или внутренними названиями',
					},
					{
						displayName: 'Свежесть источников',
						name: 'timeRange',
						type: 'options',
						default: 'month',
						options: [
							{ name: 'За день', value: 'day' },
							{ name: 'За неделю', value: 'week' },
							{ name: 'За месяц', value: 'month' },
							{ name: 'За год', value: 'year' },
						],
						routing: { send: { type: 'body', property: 'timeRange' } },
						description:
							'Для фактов, которые могли устареть: цены, курсы, должности, статусы. Не добавляйте параметр, чтобы искать без ограничения по дате',
					},
				],
			},
		],
	};
}
