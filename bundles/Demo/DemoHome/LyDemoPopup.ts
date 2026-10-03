import { _decorator, Node, UITransform } from 'cc';
import { GMLayer, gu } from '../../../../gmajor';
import { addSkin, addText, dress, loadSkin, skinInk } from '../../GameUI/SkinKit';

const { ccclass } = _decorator;

/** 设置弹窗：音量、经验条、步进和道具格，用 v7 皮 */
@ccclass('LyDemoPopup')
export class LyDemoPopup extends GMLayer {
    private readonly skins: Array<[Node, string]> = [];

    onInit(): void {
        const panel = this.panel;
        if (!panel) return;
        const uit = panel.getComponent(UITransform) ?? panel.addComponent(UITransform);
        uit.setContentSize(600, 760);
        this.put(panel, 'Panel', 0, 0, 600, 760);
        this.put(panel, 'TitleBar', 0, 316, 360, 64);
        addText(panel, '设置', 28, skinInk, 300, 64).node.setPosition(0, 316, 0);
        const close = this.put(panel, 'secondary', 246, 316, 72, 72);
        this.put(close, 'IconClose', 0, 0, 36, 36);
        const help = this.put(panel, 'secondary', -246, 316, 72, 72);
        this.put(help, 'IconHelp', 0, 0, 28, 40);
        gu.addClick(close, () => gu.closeLayer('LyDemoPopup'));
        gu.addClick(help, () => gu.alert('音乐、音效和语言都记在本机。'));
        this.slider(panel, 'IconMusic', '音乐', 200);
        this.slider(panel, 'IconSfx', '音效', 110);
        this.put(panel, 'XpTrack', 40, 16, 320, 64);
        this.put(panel, 'XpFill', 8, 16, 200, 40);
        addText(panel, '经验', 22, skinInk, 80, 36).node.setPosition(-220, 16, 0);
        this.put(panel, 'IconSettings', -220, -80, 56, 56);
        addText(panel, '语言  中文', 26, skinInk, 220, 48).node.setPosition(20, -80, 0);
        this.stepper(panel, -170);
        this.slot(panel, -290);
        loadSkin((err) => {
            if (err) return console.error('[LyDemoPopup] 皮加载失败', err);
            for (const [node, name] of this.skins) dress(node, name);
        });
    }

    private put(parent: Node, name: string, x: number, y: number, w: number, h: number): Node {
        const node = addSkin(parent, name, x, y, w, h);
        this.skins.push([node, name]);
        return node;
    }

    private slider(parent: Node, icon: string, text: string, y: number): void {
        this.put(parent, icon, -230, y, 56, 56);
        addText(parent, text, 24, skinInk, 80, 40).node.setPosition(-150, y, 0);
        this.put(parent, 'SliderTrack', 40, y, 280, 28);
        this.put(parent, 'SliderThumb', 40, y, 44, 44);
    }

    private stepper(parent: Node, y: number): void {
        const minus = this.put(parent, 'secondary', -70, y, 72, 72);
        this.put(minus, 'IconMinus', 0, 0, 40, 28);
        this.put(parent, 'PlateStepper', 50, y, 140, 72);
        addText(parent, '3', 28, skinInk, 140, 72).node.setPosition(50, y, 0);
        const plus = this.put(parent, 'primary', 180, y, 72, 72);
        this.put(plus, 'IconPlus', 0, 0, 40, 40);
    }

    private slot(parent: Node, y: number): void {
        this.put(parent, 'SlotItem', -50, y, 96, 96);
        this.put(parent, 'IconGold', -50, y, 52, 52);
        this.put(parent, 'FrameSelect', 80, y, 108, 108);
        this.put(parent, 'IconDiamond', 80, y, 52, 52);
    }
}
