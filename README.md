### Hexlet tests and linter status:

[![Actions Status](https://github.com/JS-NinjaNN/frontend-project-11/workflows/hexlet-check/badge.svg)](https://github.com/JS-NinjaNN/frontend-project-11/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/a091e9ce8a500ceb7ea1/maintainability)](https://codeclimate.com/github/JS-NinjaNN/frontend-project-11/maintainability)
[![rss-reader-check](https://github.com/JS-NinjaNN/frontend-project-11/actions/workflows/rssreader-check.yml/badge.svg)](https://github.com/JS-NinjaNN/frontend-project-11/actions/workflows/rssreader-check.yml)

# RSS-агрегатор

[RSS-агрегатор](https://rss-reader-liard.vercel.app/) – сервис для агрегации RSS-потоков, с помощью которых удобно читать разнообразные источники, например, блоги. Он позволяет добавлять неограниченное количество RSS-лент, сам их обновляет и добавляет новые записи в общий поток.

## Инструкция по использованию:

Перейдите по [ссылке](https://rss-reader-liard.vercel.app/)

Вставьте валидную RSS-ссылку в поле ввода. Нажмите кнопку «Добавить». RSS поток появится на экране!
Предварительный просмотр описания постов выводится через модальное окно после нажатия на кнопку «Просмотр».
Вы также можете подписываться сразу на несколько каналов, добавляя ссылки на другие источники.
Посты обновляются автоматически в режиме реального времени. 

## Поддержка браузеров:

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Установка для разработчиков:

##№ Minimum system requirements

Node.js 13.2.0 or higher

1. Клонируйте репозиторий с помощью следующей команды:
```sh 
git clone https://github.com/JS-NinjaNN/frontend-project-11
```

2. Установите программу чтения RSS, используя следующие команды:

```sh
make install
```

```sh
npm link
```
Компиляция:

Скомпилируйте пакет с помощью webpack, используя:

```sh
make build
```
