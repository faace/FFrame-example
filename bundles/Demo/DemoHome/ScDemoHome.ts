import { _decorator, Color, Node, view } from 'cc';
import { GMScene, gu } from '../../../../gmajor';
import { addPaper, addSkin, addText, dress, loadSkin, skinInk } from '../../GameUI/SkinKit';

const { ccclass } = _decorator;

/** 首页：标题、资源、页签和五个主按钮，点开确认框或设置 */
@ccclass('ScDemoHome')
export class ScDemoHome extends GMScene {
    private readonly skins: Array<[Node, string]> = [];

    onInit(): void {
        const canvas = this.node.scene?.getChildByName('Canvas');
        if (!canvas) return console.error('[ScDemoHome] 没有 Canvas');
        addPaper(canvas);
        const home = new Node('home');
        canvas.addChild(home);
        home.layer = canvas.layer;
        const h = view.getVisibleSize().height;
        const scale = Math.min(1, Math.max(0.55, (h - 48) / 980));
        home.setScale(scale, scale, 1);

        this.put(home, 'TitleBar', 0, 430, 420, 72);
        addText(home, '家园', 32, skinInk, 360, 72).node.setPosition(0, 430, 0);
        this.currency(home, 340);
        this.tabs(home, 240);
        this.buttons(home);
        loadSkin((err) => {
            if (err) return console.error('[ScDemoHome] 皮加载失败', err);
            for (const [node, name] of this.skins) dress(node, name);
        });
    }

    private put(parent: Node, name: string, x: number, y: number, w: number, h: number): Node {
        const node = addSkin(parent, name, x, y, w, h);
        node.layer = parent.layer;
        this.skins.push([node, name]);
        return node;
    }

    private currency(parent: Node, y: number): void {
        const row: Array<[string, string, number]> = [
            ['IconGold', '128', -170],
            ['IconDiamond', '32', 0],
            ['IconEnergy', '20', 170],
        ];
        for (const [icon, text, x] of row) {
            this.put(parent, icon, x - 36, y, 48, 48);
            addText(parent, text, 24, skinInk, 72, 40).node.setPosition(x + 28, y, 0);
        }
    }

    private tabs(parent: Node, y: number): void {
        const home = this.put(parent, 'TabSelected', -120, y, 200, 72);
        const setting = this.put(parent, 'TabNormal', 120, y, 200, 72);
        addText(home, '首页', 26, Color.WHITE, 200, 72);
        addText(setting, '设置', 26, skinInk, 200, 72);
        gu.addClick(setting, () => this.openSetting());
    }

    private buttons(parent: Node): void {
        const items: Array<[string, string, number, () => void]> = [
            ['BtnPrimary', '开始', 140, () => gu.alert({ content: '今天先从这里开始。', cancel: {} })],
            ['BtnAd', '看广告', 40, () => gu.alert({ content: '看完可以领一份奖励。', ok: { text: '领取' } })],
            ['BtnGold', '金币', -60, () => gu.alert('用金币买下这一格。')],
            ['BtnDiamond', '钻石', -160, () => gu.alert('用钻石买下这一格。')],
            ['BtnSecondary', '设置', -260, () => this.openSetting()],
        ];
        for (const [skin, text, y, onClick] of items) {
            const node = this.put(parent, skin, 0, y, 360, 80);
            if (skin === 'BtnAd') this.put(node, 'IconAd', -120, 0, 40, 40);
            const color = skin === 'BtnPrimary' ? Color.WHITE : skinInk; // 绿底用白字，黄/木/蓝底用深字
            const label = addText(node, text, 28, color, 280, 80);
            if (skin === 'BtnAd') label.node.setPosition(24, 0, 0);
            gu.addClick(node, onClick);
        }
    }

    private openSetting(): void {
        gu.showLayer('LyDemoPopup', { bundle: 'DemoHome' });
    }
}
