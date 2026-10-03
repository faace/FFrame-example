# FFrame 示例 App

这是一个具体游戏的目录，不是另一个 Cocos Creator 工程。框架在 [FFrame](https://github.com/faace/FFrame)，本仓库只放这个 App。

在 FFrame 工程里克隆到 `assets/game`（该目录已被框架仓库忽略）：

```
git clone https://github.com/faace/FFrame-example.git assets/game
```

编辑器播放 `assets/game/ScMain.scene`。`ScMain` 只点火，读 `config.ts` 调 `gm.boot`。

新 App 的目标接法写在框架仓库的 `docs/新App.md`。框架开机改完之前，本仓库仍用现在这份 `config.ts`。

## 开机会做的

`config.boot` 先绑三个常驻包，再按 `entry.web` 进入 `DemoHome`。

- **GameUI**：预载确认框皮 `LyAlert`，之后 `gu.alert` 用这张皮。皮是脚本画的灰底和两个按钮。
- **User**：绑定后 `gd.sync('User')`，拉账号数据树。
- **Setting**：本地设置 `gl.Setting`。没有值时补上背景乐音量、音效音量、语言（默认中文）。
- **DemoHome**：打开场景 `ScDemoHome`，把 Canvas 涂成蓝底，用来确认已经进了游戏。

## 留在包里、开机不会自动跑

这些是验收过的用法，入口不再主动调用。

- **LyDemoPopup**：一张弹窗，内容画在 `panel` 上，遮罩由框架克隆。
- **PfDemoItem**：列表项。拿到脚本后改数量，不直接改节点。
- **DemoChild**：子包的绑定生命周期（`onInit` / `onBind` / `onStart` / `onUnbind` / `onRemove`），只打日志。要看它，得由别的包再去绑定 `DemoChild`。
