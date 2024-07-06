# 📦 Changelog 
[![conventional commits](https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic versioning](https://img.shields.io/badge/semantic%20versioning-2.0.0-green.svg)](https://semver.org)
> All notable changes to this project will be documented in this file

## [1.0.1](https://github.com/AGL-Electronics/Lumin-Desktop/compare/v1.0.0...v1.0.1) (2024-04-19)


### 🐛 Bug Fixes

* Update deviceSettings.tsx to increase the minLen and maxLen for the password input field ([c66086e](https://github.com/AGL-Electronics/Lumin-Desktop/commit/c66086e66387f8e1561ac75a1807102796618163))

## 1.0.0 (2024-04-19)


### 🍕 Features

* Add new dependencies and update device enums ([c244c68](https://github.com/AGL-Electronics/Lumin-Desktop/commit/c244c688552c76af8452c6a7f1f1a4d93f142b64))
* add password visibility toggle and APMode ([5157222](https://github.com/AGL-Electronics/Lumin-Desktop/commit/5157222ca5929d4be4b306a8e2dafa23bc85accb))
* Add PCB images and update device enums and types ([0a7be89](https://github.com/AGL-Electronics/Lumin-Desktop/commit/0a7be8930177952bf9820bbe49383a9951c7aa57))
* fully implement wifi, mqtt, and printer settings ([c2a214e](https://github.com/AGL-Electronics/Lumin-Desktop/commit/c2a214e8cce28841506fb49b35751ccce6559437))
* get device disk persistence working ([29e7ddc](https://github.com/AGL-Electronics/Lumin-Desktop/commit/29e7ddcfd489d76926ee88003d7fce45ed6f17c5))
* Implement LED control via device preview, implement LED color control in device settings, remove stepper, setup check for firmware updates, setup menu for selection logging mode ([d7dbbe3](https://github.com/AGL-Electronics/Lumin-Desktop/commit/d7dbbe365deb51baa0d863a7012b35ba6964a700))
* implement proper communication with lumin device ([3161d64](https://github.com/AGL-Electronics/Lumin-Desktop/commit/3161d64bdafdf9cc0ba9334f22cf9d9d0b2160aa))
* implement setting lumin wifi and mqtt via json handler ([a15b7b3](https://github.com/AGL-Electronics/Lumin-Desktop/commit/a15b7b3117b56b7a3970f81494526cd6a82cb068))
* save devices to disk and load on boot ([82b67f3](https://github.com/AGL-Electronics/Lumin-Desktop/commit/82b67f32b031c1913d38fa3821eb4d44019edeca))
* setting up device settings functionality ([0ba16ca](https://github.com/AGL-Electronics/Lumin-Desktop/commit/0ba16ca0fb2aa0be1a37385eee686b17ac5069d7))
* setup device settings design layout ([99085d3](https://github.com/AGL-Electronics/Lumin-Desktop/commit/99085d3d21f0880ec4ae483da7bd67245fc284b2))


### 🐛 Bug Fixes

* bug causing async await to fail when more than one device is created ([909e7d0](https://github.com/AGL-Electronics/Lumin-Desktop/commit/909e7d0b5019cd1e65593978818240aef2681e65))
* bug in persisting settings to disk ([50808a6](https://github.com/AGL-Electronics/Lumin-Desktop/commit/50808a6e93724fbcde6b4727c142bc013873898c))
* bug with AP mode ([a10858d](https://github.com/AGL-Electronics/Lumin-Desktop/commit/a10858db21044cb700bbef0fa7f8d0b17193eaf3))
* error related to imports ([c085cda](https://github.com/AGL-Electronics/Lumin-Desktop/commit/c085cda5ae2e8d197eef902ccfebae88a8cee37e))
* Fix bug in DeviceSettings.tsx ([b977357](https://github.com/AGL-Electronics/Lumin-Desktop/commit/b977357d5b41fad36e2642d256c579243ffa7ffb))
* Fix bug in LEDControl component ([b3c1f14](https://github.com/AGL-Electronics/Lumin-Desktop/commit/b3c1f1481920aac15ea535ad50acef2e71f2fbd9))
* fix bug with setDevice function ([15cc3ce](https://github.com/AGL-Electronics/Lumin-Desktop/commit/15cc3ced3a5dc661d65362651152db93b17dcccf))
* prepare for building ([d49bfae](https://github.com/AGL-Electronics/Lumin-Desktop/commit/d49bfae89eb6ecd83a58c35b23333600601e2a50))
* refactor of rssi and device  discovery logic ([18b70a2](https://github.com/AGL-Electronics/Lumin-Desktop/commit/18b70a26e3d68cdd428aab83c0bf6a3cd487ae49))
* scroll and font ([3f25bf6](https://github.com/AGL-Electronics/Lumin-Desktop/commit/3f25bf6fe44460f998b89627aa6791bffc1fe5c7))


### 🧑‍💻 Code Refactoring

* Add .hintrc file and update List component ([d04c2ff](https://github.com/AGL-Electronics/Lumin-Desktop/commit/d04c2fffc1f936970c69ae9a0a915f64c13b97a0))
* Add AppSettings CSS and components for Firmware and Developer settings ([b8c77b5](https://github.com/AGL-Electronics/Lumin-Desktop/commit/b8c77b5f066dbe604c5274088f0754b0e45d30c6))
* Add debug statement and handle value change in NetworkSettings and LEDSettings ([2be99bb](https://github.com/AGL-Electronics/Lumin-Desktop/commit/2be99bb82832537e63120c2c1434b6cc93094bfe))
* Add Home, Settings, and WifiStrength components ([4da704a](https://github.com/AGL-Electronics/Lumin-Desktop/commit/4da704af0cea232c2d0c69b2ab68107b07213321))
* Add LEDDevice interface and update Device interface ([ecc2b68](https://github.com/AGL-Electronics/Lumin-Desktop/commit/ecc2b68d560bcba63c0f15b056aa4cf691c3a877))
* added coming soon ([e033540](https://github.com/AGL-Electronics/Lumin-Desktop/commit/e033540d0496760cbef20080f3e315a297e6abdb))
* change file casing ([61b8a5a](https://github.com/AGL-Electronics/Lumin-Desktop/commit/61b8a5ac5bec73eaa36c813199876aad46dc03ac))
* fix list view header ([63fd57d](https://github.com/AGL-Electronics/Lumin-Desktop/commit/63fd57dc3c37141ae05f8d1a33fd416ffc0ba7da))
* fix rssi and device detection bug ([f291755](https://github.com/AGL-Electronics/Lumin-Desktop/commit/f291755c875718732d9d5e4df4dc6dba9bdf0af7))
* integrate all deliverables ([a623078](https://github.com/AGL-Electronics/Lumin-Desktop/commit/a623078203d2c7938ffdfa6b5bc967e21daba698))
* Refactor animation and display modes in components ([e78bda6](https://github.com/AGL-Electronics/Lumin-Desktop/commit/e78bda637288e5db52ebc76fd95ddae434348078))
* remove old code ([3f9e598](https://github.com/AGL-Electronics/Lumin-Desktop/commit/3f9e5983b70b6108ed10b4b0c7cda95292fb2f9e))
* run formatter ([1edda25](https://github.com/AGL-Electronics/Lumin-Desktop/commit/1edda256f64cb174edaf38853c3965bd9d17ff8e))
* setting up content for device settings ([59b8c28](https://github.com/AGL-Electronics/Lumin-Desktop/commit/59b8c288283976f10b48a0b996baf8fc63607ac4))
* setting up main dashboard ([dfcd6b8](https://github.com/AGL-Electronics/Lumin-Desktop/commit/dfcd6b89781a45ef4319963c053c2c512602fabe))
* start refactoring project ([0eb8c90](https://github.com/AGL-Electronics/Lumin-Desktop/commit/0eb8c908b11ce8007e8de45d453407e7a8f07068))
* start setting up device settings ([c13bff9](https://github.com/AGL-Electronics/Lumin-Desktop/commit/c13bff9e2464f3dcfe3f587e0c383ef8aef802db))
* total project refactor ([e902eb0](https://github.com/AGL-Electronics/Lumin-Desktop/commit/e902eb059669e64bff206d8730f8f66219fe0fc4))
* Total refactor of device settings handling mechanism ([b635b69](https://github.com/AGL-Electronics/Lumin-Desktop/commit/b635b69df73d4e35c3f4acd8d54489002e10d499))
* Update dependencies and unused imports ([9f4511b](https://github.com/AGL-Electronics/Lumin-Desktop/commit/9f4511b45f9040c4ce8e5407ea09d13e9c840400))
* update device settings ([381495d](https://github.com/AGL-Electronics/Lumin-Desktop/commit/381495d296427e18a8735b9c48158b78dc69e2cd))
* updating routes ([10b8742](https://github.com/AGL-Electronics/Lumin-Desktop/commit/10b874273e2976482f27f8fe6364083755955a2a))


### 🤖 Build System

* setup build tooling ([a4ccbec](https://github.com/AGL-Electronics/Lumin-Desktop/commit/a4ccbec022b728cc544a30ca9f13c6797b465891))
