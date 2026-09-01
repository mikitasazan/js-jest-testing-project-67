### Hexlet tests and linter status:

[![Actions Status](https://github.com/mikitasazan/js-jest-testing-project-67/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/mikitasazan/js-jest-testing-project-67/actions)

## Стек

- Node.js (ESM, `type: "module"`), `commander` для CLI-обвязки
- `axios` для HTTP-запросов (страница + локальные ресурсы)
- `cheerio` для разбора и перезаписи HTML
- Jest (`node --experimental-vm-modules`, без Babel — тесты пишутся как обычный ESM)
- `nock` для мока HTTP-запросов в тестах

Загрузчик скачивает страницу и все её локальные ресурсы (`img[src]`,
`link[href]`, `script[src]` на том же хосте) в папку `<имя-страницы>_files/`,
переписывая ссылки в сохранённом HTML на локальные пути. Внешние ресурсы
(другой хост) не трогает.

## Использование

Установка:

```sh
npm install
```

Скачать страницу в текущую директорию:

```sh
node bin/loader.js https://example.com
```

Скачать в конкретную директорию (флаг `-o`):

```sh
node bin/loader.js -o /tmp/out https://example.com
```

Запуск тестов (сверяются с реальными фикстурами автопроверки Hexlet —
`__fixtures__/{localhost,site-com}-blog-about.html` и `__fixtures__/expected/`):

```sh
npm test
```
