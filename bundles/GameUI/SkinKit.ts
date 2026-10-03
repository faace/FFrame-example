import { Color, Label, Node, Sprite, SpriteFrame, Texture2D, UITransform, Widget } from 'cc';
import { gm } from '../../../gmajor';

const SLICED = new Set([
    'TitleBar', 'Panel', 'BtnPrimary', 'BtnSecondary', 'BtnAd', 'BtnGold', 'BtnDiamond',
    'TabNormal', 'TabSelected', 'PlateStepper', 'SliderTrack', 'ProgressFill', 'XpTrack', 'XpFill',
]);

let frames: Map<string, SpriteFrame> | null = null;
let waiters: Array<(err: Error | null) => void> | null = null;

/** 读框架默认皮 GMSkin（gmajor/ui/skin）；已在内存则立刻回调 */
export function loadSkin(done: (err: Error | null) => void): void {
    if (frames) return done(null);
    if (waiters) return waiters.push(done);
    waiters = [done];
    const fail = (err: Error) => {
        const pending = waiters ?? [];
        waiters = null;
        pending.forEach((fn) => fn(err));
    };
    const afterBundle = (err: Error | null) => {
        if (err) return fail(err);
        const bundle = gm.resource.getBundle('GMSkin');
        if (!bundle) return fail(new Error('[Skin] GMSkin 未加载'));
        bundle.loadDir('', SpriteFrame, (loadErr, assets) => {
            const pending = waiters ?? [];
            waiters = null;
            frames = assets?.length ? indexFrames(assets) : new Map();
            if (!frames.size) {
                pending.forEach((fn) => fn(loadErr ?? new Error('[Skin] 没有 SpriteFrame')));
                frames = null;
                return;
            }
            finishSkin(pending);
        });
    };
    if (gm.resource.hasBundle('GMSkin')) return afterBundle(null);
    gm.resource.loadBundle('GMSkin', afterBundle);
}

export function skinFrame(name: string): SpriteFrame | null { // 未载入时是 null
    return frames?.get(name) ?? null;
}

/** 在 parent 下挂一张皮；九宫格件用 SLICED，其余原图 */
export function addSkin(parent: Node, name: string, x: number, y: number, w: number, h: number): Node {
    const node = new Node(name);
    parent.addChild(node);
    node.layer = parent.layer;
    node.setPosition(x, y, 0);
    node.addComponent(UITransform).setContentSize(w, h);
    node.addComponent(Sprite);
    dress(node, name);
    return node;
}

export function addText(parent: Node, text: string, fontSize: number, color: Color, w: number, h: number): Label {
    const node = new Node('label');
    parent.addChild(node);
    node.layer = parent.layer;
    node.addComponent(UITransform).setContentSize(w, h);
    const label = node.addComponent(Label);
    label.string = text;
    label.fontSize = fontSize;
    label.color = color;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.overflow = Label.Overflow.CLAMP;
    return label;
}

export const skinInk = new Color(92, 64, 32, 255); // 奶油底上的字
export const skinPaper = new Color(248, 238, 211, 255); // 和 v3 底色接近

function finishSkin(pending: Array<(err: Error | null) => void>): void {
    console.info('[Skin] 已载入', frames?.size, frames ? [...frames.keys()].join(' ') : '');
    pending.forEach((fn) => fn(null));
}

function indexFrames(assets: SpriteFrame[]): Map<string, SpriteFrame> {
    const map = new Map<string, SpriteFrame>();
    for (const frame of assets) {
        const name = frame.name.replace(/\/spriteFrame$/, '').replace(/\.png$/i, '');
        if (name && name !== 'spriteFrame') map.set(name, frame);
    }
    return map;
}

export function dress(node: Node, name: string): void { // 贴图后锁回自定义尺寸，避免被原图像素撑开
    const frame = skinFrame(name);
    const sp = node.getComponent(Sprite);
    const uit = node.getComponent(UITransform);
    if (!frame || !sp || !uit) return;
    const w = uit.width;
    const h = uit.height;
    sp.spriteFrame = frame;
    sp.sizeMode = Sprite.SizeMode.CUSTOM;
    sp.type = SLICED.has(name) ? Sprite.Type.SLICED : Sprite.Type.SIMPLE;
    uit.setContentSize(w, h);
}

/** 铺一层奶油底，跟着父节点四边拉伸 */
export function addPaper(parent: Node): Node {
    const node = new Node('paper');
    parent.addChild(node);
    node.layer = parent.layer;
    node.setSiblingIndex(0);
    node.addComponent(UITransform);
    const widget = node.addComponent(Widget);
    widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
    widget.top = widget.bottom = widget.left = widget.right = 0;
    widget.alignMode = Widget.AlignMode.ALWAYS;
    const sp = node.addComponent(Sprite);
    sp.spriteFrame = paperFrame();
    sp.sizeMode = Sprite.SizeMode.CUSTOM;
    sp.color = skinPaper;
    return node;
}

let paper: SpriteFrame | null = null;

function paperFrame(): SpriteFrame {
    if (paper?.isValid) return paper;
    const tex = new Texture2D();
    tex.reset({ width: 2, height: 2, format: Texture2D.PixelFormat.RGBA8888 });
    tex.uploadData(new Uint8Array(16).fill(255));
    paper = new SpriteFrame();
    paper.texture = tex;
    return paper;
}
