# n8n-nodes-srezai-web-search-pro

[![npm version](https://img.shields.io/npm/v/n8n-nodes-srezai-web-search-pro.svg)](https://www.npmjs.com/package/n8n-nodes-srezai-web-search-pro)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![n8n community node](https://img.shields.io/badge/n8n-community%20node-orange.svg)](https://docs.n8n.io/integrations/community-nodes/)

**Веб-поиск, чтение страниц и MCP-инструменты для ИИ-агентов в n8n** — 11 операций
одной нодой: поиск в интернете и по картинкам, чтение страниц в Markdown, карта
сайта и чтение разделов, извлечение данных по JSON-схеме, скриншот страницы,
проверка утверждений с цитатами, готовые ответы (RAG), глубокое исследование и
субтитры YouTube. Сильное покрытие рунета, REST и MCP из одного ключа.

Community-нода для [srezai.ru](https://srezai.ru) — веб-доступа для LLM-агентов,
RAG-систем и автоматизаций на n8n. Нода отдаёт модели готовый контекст вместо
сырых ссылок: живые страницы, очищенные до Markdown или JSON, и работает как
обычный шаг workflow или как инструмент AI Agent (`usableAsTool`).

## Установка

В n8n: **Settings → Community Nodes → Install** и введите имя пакета:

```
n8n-nodes-srezai-web-search-pro
```

Или из командной строки:

```bash
npm install n8n-nodes-srezai-web-search-pro
```

Подробнее — в [гайде по установке community-нод](https://docs.n8n.io/integrations/community-nodes/installation/).

## Зачем srezai в n8n

- **Готовый контекст, а не выдача** — страницы открываются настоящим браузером,
  HTML чистится от навигации и рекламы, наружу уходит Markdown или JSON
- **Работает на окне 32k** — длинная страница приходит окнами по `offset`,
  извлечение отдаёт только поля вашей схемы, проверка утверждения — вердикт
  с цитатами: черновая работа идёт вне контекста модели
- **Карта сайта вместо десятков поисковых запросов** — адреса и разделы
  одним вызовом, затем чтение только нужных страниц
- **Субтитры YouTube без скачивания видео** — текст ролика (ручные или
  автоматические субтитры) для конспектов, пересказов и RAG по видео
- **Данные хранятся в РФ, оплата в рублях** — договор и закрывающие документы
  для юрлиц, оплата без подписки
- **Один ключ на REST и MCP** — ту же ноду можно подключить как инструмент
  AI Agent или вызвать по HTTP из своего пайплайна

[n8n](https://n8n.io) — платформа автоматизации с [fair-code лицензией](https://docs.n8n.io/reference/license/).

## Операции

| Операция | Что делает | Цена |
| --- | --- | --- |
| Умный поиск (RAG) | Готовый ответ со ссылками и релевантностью источников | 3 / 5 / 10 кредитов по глубине |
| Поиск в интернете | Страницы по текстовому запросу: заголовок, ссылка, фрагмент | 1 кредит |
| Поиск картинок | Прямые ссылки, источник и разрешение | 1 кредит |
| Прочитать страницу | Страница → чистый Markdown, длинная — окнами | 1 кредит |
| Субтитры YouTube | Текст ролика YouTube: ручные или авто-субтитры, без скачивания видео, до 5 роликов за вызов | 1 кредит за ролик с полученным текстом, неудачи не тарифицируются |
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
получить. Для **Субтитров YouTube** вставьте до пяти ссылок (или id) по одной в
строке; продолжение длинного текста — параметр `from` со значением `nextFrom` из
прошлого ответа. Для **Карты сайта** и **Чтения разделов** начните с карты: она
покажет разделы и число адресов, а затем прочитайте нужный раздел через
`selectPaths`.

> Примечание: `get_usage` доступен только через MCP-сервер srezai, а не через
> REST API, поэтому в ноде его нет. Остаток квоты возвращается в заголовках
> ответа `X-RateLimit-*`.

## Ресурсы

- [Документация по community-нодам n8n](https://docs.n8n.io/integrations/community-nodes/)
- [srezai.ru — веб-доступ для ИИ-агентов](https://srezai.ru)
- [MCP-сервер srezai](https://github.com/srezai-team/srezai-mcp-web-search)
- [Python и JS SDK](https://github.com/srezai-team/srezai-web-search-sdk)

---

## English

**n8n community node for web search and page reading for AI agents** — 11
operations in one node: web search and image search, page reading as clean
Markdown, site maps and section crawls, JSON-schema extraction, browser
screenshots, claim verification with quotes, RAG answers, deep research and
YouTube transcripts. MCP + REST from a single key, with strong Russian-web
coverage.

This is an n8n community node for [srezai.ru](https://srezai.ru) — web access for
LLM agents, RAG systems and n8n automations. The node hands your model ready
context instead of raw links: live pages cleaned to Markdown or JSON. It works
both as a regular workflow step and as an AI Agent tool (`usableAsTool`).

**Install:** in n8n, go to **Settings → Community Nodes → Install** and enter
`n8n-nodes-srezai-web-search-pro`, or run
`npm install n8n-nodes-srezai-web-search-pro`.

## Why srezai

- **Ready context, not a SERP dump** — pages are opened in a real browser and
  cleaned of navigation and ads; you get Markdown or JSON
- **Fits a 32k window** — long pages arrive in windows via `offset`, extraction
  returns only the fields of your schema, claim verification returns a verdict
  with quotes: the heavy lifting happens outside the model's context
- **A site map instead of dozens of searches** — URLs and sections in one call,
  then read only the pages you need
- **YouTube transcripts without downloading video** — manual or auto-generated
  captions for summaries and video RAG
- **Infrastructure and billing in Russia** — contracts and closing documents for
  companies, no subscription
- **One key for REST and MCP** — use the node as an AI Agent tool or call the
  same API over HTTP from your own pipeline

**Operations:** Smart Search / RAG (3–10 credits by depth), Web Search
(1 credit), Image Search (1 credit), Read URL (1 credit), YouTube transcripts
(1 credit per video with text), Site Map (1 credit per 10 URLs returned, minimum
1), Read Site Sections (1 credit per page read), Extract structured data
(2 credits per link), Fetch Page / Screenshot (3 credits, 1 if the render
failed), Claim Verification (8 credits), Deep Research (20 credits + 3 per 1000
output tokens).

**Credentials:** create a srezai.ru API key in your dashboard, add **srezai API**
credentials in n8n and paste the key. It is sent as a `Bearer` token.

> `get_usage` is available only via the srezai MCP server, not the REST API, so
> it is not exposed here. Remaining quota is returned in `X-RateLimit-*`
> response headers.

## License

[MIT](LICENSE)
