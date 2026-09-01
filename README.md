### Hexlet tests and linter status:

[![Actions Status](https://github.com/mikitasazan/js-jest-testing-project-67/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/mikitasazan/js-jest-testing-project-67/actions)

## Стек

- Node.js (ESM, `type: "module"`), `commander` для CLI-обвязки
- `axios` для HTTP-запроса за страницей
- Jest (`node --experimental-vm-modules`, без Babel — тесты пишутся как обычный ESM)
- `nock` для мока HTTP-запросов в тестах

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

Запуск тестов:

```sh
npm test
```
