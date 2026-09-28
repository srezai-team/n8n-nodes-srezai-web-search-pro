# n8n-nodes-srezai

**Поисковый API для ИИ-агентов в n8n**

Community-нода для [srezai.ru](https://srezai.ru) — REST и MCP из одного ключа.
Нода отдаёт модели готовый контекст вместо сырых ссылок: живые страницы,
очищенные до Markdown или JSON, и работает как обычный шаг или как инструмент
AI Agent (`usableAsTool`).

## Почему srezai

- **Готовый контекст, а не выдача** — страницы открываются настоящим браузером,
  HTML чистится от навигации и рекламы, наружу уходит Markdown или JSON
- **Работает на окне 32k** — длинная страница приходит окнами по `offset`,
  извлечение отдаёт только поля вашей схемы, проверка утверждения — вердикт
  с цитатами: черновая работа идёт вне контекста модели
- **Карта сайта вместо десятков поисковых запросов** — адреса и разделы
  одним вызовом, затем чтение только нужных страниц
- **Данные хранятся в РФ, оплата в рублях** — договор и закрывающие документы
  для юрлиц, оплата без подписки
- **Один ключ на REST и MCP** — ту же ноду можно подключить как инструмент
  AI Agent или вызвать по HTTP из своего пайплайна

[n8n](https://n8n.io) — платформа автоматизации с [fair-code лицензией](https://docs.n8n.io/reference/license/).

## Установка

В n8n: **Settings → Community Nodes → Install**, затем введите `n8n-nodes-srezai`.
Подробнее — в [гайде по установке](https://docs.n8n.io/integrations/community-nodes/installation/).

## Операции

| Операция | Что делает | Цена |
| --- | --- | --- |
| Умный поиск (RAG) | Готовый ответ со ссылками и релевантностью источников | 3 / 5 / 10 кредитов по глубине |
| Поиск в интернете | Страницы по текстовому запросу: заголовок, ссылка, фрагмент | 1 кредит |
| Поиск картинок | Прямые ссылки, источник и разрешение | 1 кредит |
| Прочитать страницу | Страница → чистый Markdown, длинная — окнами | 1 кредит |
| Карта сайта | Адреса и разделы сайта из sitemap или со стартовой страницы, до 200 за вызов | 1 кредит за каждые 10 адресов, минимум 1 |
| Чтение разделов сайта | Карта плюс текст найденных страниц, фильтры по адресу и по тексту | 1 кредит за прочитанную страницу |
| Извлечь данные | JSON строго по вашей схеме, без текста страницы | 2 кредита за ссылку |
| Скриншот страницы | Markdown + скриншот; если рендер не удался — текст за 1 кредит | 3 кредита |
| Проверка утверждения | Вердикт `supported` / `refuted` / `mixed` / `unverified` с дословными цитатами | 8 кредитов |
| Глубокое исследование | Многошаговое исследование с источниками | 20 кредитов + 3 за 1000 токенов ответа |

1 кредит = 0,10 ₽. Ошибка и вызов, не принёсший результата, не списываются.

## Учётные данные

Нужен ключ API srezai.ru. Создайте его в личном кабинете, затем добавьте в n8n
учётные данные **srezai API** и вставьте ключ. Ключ передаётся как `Bearer`-токен.

## Использование

Добавьте ноду **srezai**, выберите операцию и учётные данные, заполните запрос
или URL. Для **Извлечь данные** укажите JSON-схему с полями, которые хотите
получить. Для **Карты сайта** и **Чтения разделов** начните с карты: она покажет
разделы и число адресов, а затем прочитайте нужный раздел через `selectPaths`.

> Примечание: `get_usage` доступен только через MCP-сервер srezai, а не через
> REST API, поэтому в ноде его нет. Остаток квоты возвращается в заголовках
> ответа `X-RateLimit-*`.

## Ресурсы

- [Документация по community-нодам n8n](https://docs.n8n.io/integrations/community-nodes/)
- [srezai.ru](https://srezai.ru)

---

## English

**Search API for AI agents in n8n**

This is an n8n community node for [srezai.ru](https://srezai.ru) — REST and MCP
from a single key. The node hands your model ready context instead of raw links:
live pages cleaned to Markdown or JSON. It works both as a regular step and as an
AI Agent tool (`usableAsTool`).

## Why srezai

- **Ready context, not a SERP dump** — pages are opened in a real browser and
  cleaned of navigation and ads; you get Markdown or JSON
- **Fits a 32k window** — long pages arrive in windows via `offset`, extraction
  returns only the fields of your schema, claim verification returns a verdict
  with quotes: the heavy lifting happens outside the model's context
- **A site map instead of dozens of searches** — URLs and sections in one call,
  then read only the pages you need
- **Infrastructure and billing in Russia** — contracts and closing documents for
  companies, no subscription
- **One key for REST and MCP** — use the node as an AI Agent tool or call the
  same API over HTTP from your own pipeline

**Install:** in n8n, go to **Settings → Community Nodes → Install** and enter
`n8n-nodes-srezai`.

**Operations:** Smart Search / RAG (3–10 credits by depth), Web Search
(1 credit), Image Search (1 credit), Read URL (1 credit), Site Map (1 credit per
10 URLs returned, minimum 1), Read Site Sections (1 credit per page read),
Extract structured data (2 credits per link), Fetch Page / Screenshot
(3 credits, 1 if the render failed), Claim Verification (8 credits),
Deep Research (20 credits + 3 per 1000 output tokens).

**Credentials:** create a srezai.ru API key in your dashboard, add **srezai API**
credentials in n8n and paste the key. It is sent as a `Bearer` token.

> `get_usage` is available only via the srezai MCP server, not the REST API, so
> it is not exposed here. Remaining quota is returned in `X-RateLimit-*`
> response headers.

## License

[MIT](LICENSE)
