import { _decorator, Color, Label, Node, UITransform } from 'cc';
import { GMAlert } from '../../../gmajor';
import { addSkin, addText, dress, loadSkin, skinInk } from './SkinKit';

const { ccclass } = _decorator;

/** 确认框皮：v7 背板 + 标题条 + 主次按钮 */
@ccclass('LyAlert')
export class LyAlert extends GMAlert {
    private readonly skins: Array<[Node, string]> = [];

    onInit(): void {
        const panel = this.panel;
        if (!panel) return;
        const uit = panel.getComponent(UITransform) ?? panel.addComponent(UITransform);
        uit.setContentSize(520, 340);
        this.note(addSkin(panel, 'Panel', 0, 0, 520, 340), 'Panel');
        this.note(addSkin(panel, 'TitleBar', 0, 118, 360, 64), 'TitleBar');
        addText(panel, '提示', 28, skinInk, 300, 64).node.setPosition(0, 118, 0);
        this.body = this.makeLabel(panel, 'body', 28, 0, 28, 440, 100);
        this.btnCancel = this.makeBtn(panel, 'btnCancel', 'secondary', '取消', -120, -108, skinInk);
        this.btnOk = this.makeBtn(panel, 'btnOk', 'primary', '确定', 120, -108, Color.WHITE);
        this.cancelLabel = this.btnCancel.getChildByName('label')?.getComponent(Label) ?? null;
        this.okLabel = this.btnOk.getChildByName('label')?.getComponent(Label) ?? null;
        loadSkin((err) => {
            if (err) return console.error('[LyAlert] 皮加载失败', err);
            for (const [node, name] of this.skins) dress(node, name);
        });
        console.info('[LyAlert] onInit');
    }

    onRemove(): void {
        console.info('[LyAlert] onRemove');
    }

    private note(node: Node, name: string): Node {
        this.skins.push([node, name]);
        return node;
    }

    private makeBtn(parent: Node, nodeName: string, skin: string, text: string, x: number, y: number, color: Color): Node {
        const node = this.note(addSkin(parent, skin, x, y, 200, 72), skin);
        node.name = nodeName; // GMAlert 按 btnOk / btnCancel 找
        addText(node, text, 26, color, 200, 72);
        return node;
    }

    private makeLabel(parent: Node, name: string, fontSize: number, x: number, y: number, w: number, h: number): Label {
        const label = addText(parent, '', fontSize, skinInk, w, h);
        label.node.name = name;
        label.node.setPosition(x, y, 0);
        return label;
    }
}
