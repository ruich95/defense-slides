"""Assemble editable slide sources into a self-contained presentation."""
from pathlib import Path
from base64 import b64encode
import xml.etree.ElementTree as E
import json
import html
import re
import struct
from zipfile import ZipFile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SVG = '{http://www.w3.org/2000/svg}'
E.register_namespace('', 'http://www.w3.org/2000/svg')
E.register_namespace('xlink', 'http://www.w3.org/1999/xlink')

def data(path, mime):
    return f'data:{mime};base64,' + b64encode(path.read_bytes()).decode()


def pyramid_art():
    source = next(path for path in [
        ROOT / 'figures/svg/abst-pyramid-w-trace.svg',
        ROOT / 'figures/svg/abst-pyramid-trace.svg',
    ] if path.exists())
    pyramid = E.parse(source).getroot()
    for parent in list(pyramid.iter()):
        for child in list(parent):
            if child.tag.split('}')[-1] in ['style', 'script', 'namedview', 'title', 'desc']:
                parent.remove(child)
    # Omit the inner cone from the slide while preserving the source artwork.
    for parent in list(pyramid.iter()):
        for child in list(parent):
            if child.get('id') in ['path4-6', 'g4-0-7']:
                parent.remove(child)
    ids = {n.get('id'): 'pyramid-' + n.get('id') for n in pyramid.iter() if n.get('id')}
    for n in pyramid.iter():
        for k, v in list(n.attrib.items()):
            if k == 'id':
                n.set(k, ids[v])
            else:
                for old, new in ids.items():
                    v = v.replace('url(#' + old + ')', 'url(#' + new + ')')
                    if v == '#' + old:
                        v = '#' + new
                n.set(k, v)
        if n.tag == SVG + 'text':
            n.set('fill', '#000')
            n.set('stroke', 'none')
        if n.text == 'Modeling':
            n.text = 'Modelling'
        if n.text == 'Materialisation':
            n.text = 'Implementation'
        if n.get('id') == 'pyramid-textPath42':
            n.set('startOffset', '45%')
        if n.get('id') == 'pyramid-textPath43':
            n.set('startOffset', '55%')
    pyramid.set('id', 'pyramid')
    pyramid.set('fill', 'none')
    pyramid.set('stroke', 'none')
    pyramid.set('role', 'img')
    pyramid.set('aria-label', 'Specification, modelling and implementation, with the FM receiver design trace')
    for attr in ['width', 'height']:
        pyramid.attrib.pop(attr, None)
    for id in ['g2', 'g3', 'g1', 'g5', 'g6', 'g7', 'path2']:
        next(n for n in pyramid.iter() if n.get('id') == 'pyramid-' + id).set('opacity', '0')
    return E.tostring(pyramid, encoding='unicode')

def receiver_art():
    animation = E.parse(ROOT / 'figures/radio-to-fm/radio-to-fm.svg').getroot()
    controller = animation.find(SVG + 'script')
    js = controller.text
    start = js.index("root.addEventListener('click',next);")
    end = js.index('notify();', start)
    controller.text = js[:start] + js[end:]
    animation.set('id', 'receiver-animation')
    animation.set('aria-label', 'FM receiver development, including FIR register insertion and folding')
    for attr in ['width', 'height', 'tabindex']:
        animation.attrib.pop(attr, None)
    return E.tostring(animation, encoding='unicode')


def requirements_pyramid_art():
    # Reuse page 3's exact geometry and trace, with independent IDs/controllers.
    pyramid = E.fromstring(pyramid_art())
    for node in pyramid.iter():
        for key, value in list(node.attrib.items()):
            node.set(key, value.replace('pyramid', 'requirements-pyramid'))
    pyramid.set('aria-label', 'Completed design trace from specification through modelling to implementation, with a schematic specification-satisfaction region')
    layer = next(n for n in pyramid.iter() if n.get('id') == 'requirements-pyramid-layer1')
    for node in list(layer):
        if node.get('id') == 'requirements-pyramid-path2':
            layer.remove(node)
    for name in ['g2', 'g3', 'g1', 'g5', 'g6', 'g7']:
        next(n for n in pyramid.iter() if n.get('id') == 'requirements-pyramid-' + name).set('opacity', '1')

    # Preserve the reference geometry and sibling paint order. The lower rim
    # paints after the modelling floor, while the sides retain their own slot.
    reference = E.parse(ROOT / 'figures/svg/abst-pyramid-w-range.svg').getroot()
    reference_layer = next(n for n in reference.iter() if n.get('id') == 'layer1')
    reference_order = [n.get('id') for n in reference_layer]
    for source_id, target_id, reveal_id in [
        ('g4-0-7', 'specification-cone-rim', 'specification-cone'),
        ('path4-6', 'specification-cone-sides', 'specification-cone-outline'),
    ]:
        artwork = next(n for n in reference.iter() if n.get('id') == source_id)
        reveal = E.Element(SVG + 'g', {
            'id': reveal_id, 'data-requirements-reveal': '2',
            'opacity': '0', 'visibility': 'hidden', 'aria-hidden': 'true',
        })
        for i, node in enumerate(artwork.iter()):
            node.set('id', target_id if i == 0 else f'{target_id}-{i}')
        reveal.append(artwork)
        following = reference_order[reference_order.index(source_id) + 1:]
        anchor = next(n for source in following for n in layer
                      if n.get('id') == 'requirements-pyramid-' + source)
        layer.insert(list(layer).index(anchor), reveal)
    return E.tostring(pyramid, encoding='unicode')


def prefix_svg(root, prefix, root_id):
    ids = {n.get('id'): prefix + n.get('id') for n in root.iter() if n.get('id')}
    def refs(value):
        for old, new in ids.items():
            value = value.replace('url(#' + old + ')', 'url(#' + new + ')')
            if value == '#' + old:
                value = '#' + new
        return value
    for node in root.iter():
        for key, value in list(node.attrib.items()):
            node.set(key, ids[value] if key == 'id' else refs(value))
        if node.tag == SVG + 'style' and node.text:
            node.text = refs(node.text)
    root.set('id', root_id)
    return root


def page5_start_pyramid():
    pyramid = E.fromstring(pyramid_art())
    omitted = {'pyramid-' + name for name in ['g2', 'g3', 'g1', 'g5', 'g6', 'g7', 'path2']}
    for parent in list(pyramid.iter()):
        for child in list(parent):
            if child.get('id') in omitted:
                parent.remove(child)
    prefix_svg(pyramid, 'p5-start-', 'page5-start-pyramid-svg')
    pyramid.set('aria-label', 'Specification, modelling and implementation, without a design trace')
    return E.tostring(pyramid, encoding='unicode')


def page5_draft_art():
    draft = E.parse(ROOT / 'figures/svg/page5-draft.svg').getroot()
    groups = {'layer1-3': None, 'g10': '1', 'g11': '2', 'g18': '4', 'g16': '5'}
    for node in list(draft):
        if node.tag not in [SVG + 'defs', SVG + 'style'] and node.get('id') not in groups:
            draft.remove(node)
    for node in list(draft):
        if node.get('id') in groups:
            threshold = groups[node.get('id')]
            if threshold is None:
                node.set('data-page5-phase-bar', '')
            else:
                node.set('data-page5-reveal', threshold)
    prefix_svg(draft, 'p5-draft-', 'page5-art')
    for node in draft.iter(SVG + 'style'):
        def scope(match):
            selectors = []
            for selector in match[1].split(','):
                selector = selector.strip()
                selectors.extend(['#page5-art', '#page5-art svg'] if selector == 'svg'
                                 else ['#page5-art ' + selector])
            return ','.join(selectors) + '{' + match[2] + '}'
        node.text = re.sub(r'([^{}]+)\{([^{}]*)\}', scope, node.text or '')
    draft.set('width', '1600')
    draft.set('height', '900')
    draft.set('role', 'img')
    draft.set('aria-label', 'Corresponding FIR equation, model, C and Verilog descriptions beside the design phases')
    # Retain the draft's 1920 by 1080 viewBox: this applies 5/6 exactly once.
    return E.tostring(draft, encoding='unicode')


def page8_start_pyramid():
    # The same empty source used by page 5, including the current phase fills,
    # dashed rear rims and label paths. Never recreate its silhouette by eye.
    pyramid = E.fromstring(page5_start_pyramid())
    # Only this overview starts without phase captions; all other slides keep
    # their labels and source artwork unchanged.
    for parent in list(pyramid.iter()):
        for child in list(parent):
            if child.tag == SVG + 'text':
                parent.remove(child)
    for node in pyramid.iter():
        for key, value in list(node.attrib.items()):
            node.set(key, value.replace('p5-start-', 'p8-start-').replace('page5-start-', 'page8-start-'))
        if node.get('id') == 'p8-start-pyramid-layer1':
            node.set('data-page8-source-structure', '')
    pyramid.set('aria-label', 'Unlabelled full abstraction pyramid with three levels')
    return E.tostring(pyramid, encoding='unicode')


def page8_framework_art():
    art = E.parse(ROOT / 'figures/svg/SynQ-abstraction-level-overview.svg').getroot()
    layer = next(n for n in art if n.get('id') == 'layer1')
    by_id = {n.get('id'): n for n in layer.iter() if n.get('id')}
    # Visual inventory of Figure 1.5, in its original paint order:
    # path2551/2: outer sides; g7: implementation surface AND its caption;
    # g7-1: intermediate surface; g8: entire modelling surface (despite its
    # Inkscape label 'idris'). These surfaces are structural, never reveals.
    # g15/g16 each mix interpretation arrows with projection-cylinder sides.
    reveals = {
        # Black arrows construct SynQ terms using Idris2, including terms
        # outside SynQ. Red arrows transform models at the same level.
        1: ['path2549-1-6', 'g14', 'g24', 'g10', 'rect2555',
            'rect2555-4', 'g21', 'g22', 'g23'],
        2: ['g19'],
        3: ['g9', 'g2550-0', 'g10-6', 'g10-8', 'g13', 'g6',
            'g11', 'g11-7', 'g12', 'g12-5'],
        4: ['path2549-1-3', 'path2549-1-3-4', 'path2549-1-3-8', 'g25'],
    }
    for threshold, names in reveals.items():
        for name in names:
            node = by_id[name]
            # Two opening clicks precede the four capability reveals.
            node.set('data-page8-reveal', str(threshold + 2))
            node.set('opacity', '0')
            node.set('visibility', 'hidden')
            node.set('aria-hidden', 'true')
    # Repair the exported caption guides in each text's coordinate system.
    # Keep the original textPath, font styles, group and reveal assignment.
    # Baselines follow inset front-left ellipse quadrants, left to right.
    ancestors = {child: parent for parent in layer.iter() for child in parent}
    for text_id, guide_id, cx, cy, rx, ry, offset in [
        ('text13', 'path2549-8', 329.19098, 342.69445, 100.61536, 29.205116, '37%'),
        ('text2554-3-9', 'path2549-2-0-9', 326.0968, 467.86104, 130.15192, 39.05004, '50%'),
    ]:
        guide, parent = by_id[guide_id], ancestors[by_id[text_id]]
        while parent is not layer:
            translation = parent.get('transform', '')
            if translation.startswith('translate('):
                tx, ty = map(float, re.findall(r'[-+]?\d*\.?\d+(?:e[-+]?\d+)?', translation))
                cx, cy = cx - tx, cy - ty
            parent = ancestors[parent]
        guide.attrib.pop('transform', None)
        guide.set('d', f'M {cx-rx},{cy} A {rx},{ry} 0 0 0 {cx},{cy+ry}')
        by_id[text_id].find(SVG + 'textPath').set('startOffset', offset)
    for parent in list(art.iter()):
        for child in list(parent):
            if child.tag.split('}')[-1] in ['style', 'script', 'namedview', 'title', 'desc']:
                parent.remove(child)
    prefix_svg(art, 'p8-figure-', 'page8-framework-svg')
    art.set('viewBox', '170 250 320 281')
    art.set('width', '570')
    art.set('height', '500.53125')
    art.set('fill', 'none')
    art.set('stroke', 'none')
    art.set('role', 'img')
    art.set('aria-label', 'Figure 1.5: modelling, Other DSLs/IRs and implementation levels of the SynQ framework')
    for node in art.iter(SVG + 'text'):
        node.set('fill', '#000')
        node.set('stroke', 'none')
    return E.tostring(art, encoding='unicode')

def page6_paper_art():
    """Preserve original AEiC group transforms, picture crops and highlights."""
    ns = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
          'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
          'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
    papers = {
        '15': (1, 'Agda', 'A Brief Overview of Agda — A Functional Language with Dependent Types'),
        '20': (2, 'Idris', 'Idris, a general-purpose dependently typed programming language: Design and implementation'),
        '16': (3, 'Lean 4', 'The Lean 4 Theorem Prover and Programming Language'),
        '24': (4, 'Idris2', 'Idris 2: Quantitative Type Theory in Practice'),
    }
    art = E.Element(SVG + 'svg', {'id': 'page6-papers', 'width': '1600', 'height': '900',
        'viewBox': '0 0 1600 900', 'fill': 'none', 'stroke': 'none', 'role': 'img',
        'aria-label': 'Original Agda, Idris, Lean 4 and Idris2 paper excerpts and highlights from AEiC 2026'})
    destination = HERE / 'assets/type-theory-papers'
    destination.mkdir(exist_ok=True)
    with ZipFile(ROOT / 'final/AEiC-26.pptx') as deck:
        source = E.fromstring(deck.read('ppt/slides/slide3.xml'))
        size = E.fromstring(deck.read('ppt/presentation.xml')).find('p:sldSz', ns)
        unit = 1600 / int(size.get('cx'))
        assert abs(int(size.get('cy')) * unit - 900) < .01
        relationships = E.fromstring(deck.read('ppt/slides/_rels/slide3.xml.rels'))
        targets = {node.get('Id'): node.get('Target') for node in relationships}
        theme = E.fromstring(deck.read('ppt/theme/theme1.xml'))
        theme_lines = list(theme.find('.//a:lnStyleLst', ns))
        for original in source.findall('.//p:grpSp', ns):
            ident = original.find('p:nvGrpSpPr/p:cNvPr', ns).get('id')
            if ident not in papers:
                continue
            threshold, name, title = papers[ident]
            xf = original.find('p:grpSpPr/a:xfrm', ns)
            off, ext, child_off, child_ext = [xf.find('a:' + k, ns) for k in ['off', 'ext', 'chOff', 'chExt']]
            sx, sy = int(ext.get('cx')) / int(child_ext.get('cx')), int(ext.get('cy')) / int(child_ext.get('cy'))
            tx, ty = (int(off.get('x')) - sx * int(child_off.get('x'))) * unit, (int(off.get('y')) - sy * int(child_off.get('y'))) * unit
            group = E.SubElement(art, SVG + 'g', {'id': f'p6-paper-{threshold}',
                'data-page6-reveal': str(threshold), 'data-source-group': ident, 'data-paper': name,
                'transform': f'matrix({sx} 0 0 {sy} {tx} {ty})',
                'opacity': '0', 'visibility': 'hidden', 'aria-hidden': 'true'})
            E.SubElement(group, SVG + 'title', {'id': f'p6-paper-{threshold}-title'}).text = title
            for child in original:
                kind = child.tag.split('}')[-1]
                if kind not in ['pic', 'sp']:
                    continue
                transform = child.find('p:spPr/a:xfrm', ns)
                xy, size = transform.find('a:off', ns), transform.find('a:ext', ns)
                x, y, width, height = [int(v) * unit for v in [xy.get('x'), xy.get('y'), size.get('cx'), size.get('cy')]]
                if kind == 'pic':
                    blip = child.find('p:blipFill/a:blip', ns)
                    filename = Path(targets[blip.get('{' + ns['r'] + '}embed')]).name
                    raw = deck.read('ppt/media/' + filename)
                    (destination / filename).write_bytes(raw)
                    iw, ih = struct.unpack('>II', raw[16:24])
                    src = child.find('p:blipFill/a:srcRect', ns)
                    crop = {s: int(src.get(s, 0)) if src is not None else 0 for s in ['l', 't', 'r', 'b']}
                    viewport = E.SubElement(group, SVG + 'svg', {'id': f'p6-paper-{threshold}-picture',
                        'x': str(x), 'y': str(y), 'width': str(width), 'height': str(height),
                        'viewBox': f"{iw*crop['l']/100000} {ih*crop['t']/100000} {iw*(1-(crop['l']+crop['r'])/100000)} {ih*(1-(crop['t']+crop['b'])/100000)}",
                        'preserveAspectRatio': 'none', 'overflow': 'hidden',
                        'data-source-image': filename, 'data-source-crop': json.dumps(crop)})
                    E.SubElement(viewport, SVG + 'image', {'id': f'p6-paper-{threshold}-image',
                        'width': str(iw), 'height': str(ih), 'href': 'data:image/png;base64,' + b64encode(raw).decode()})
                else:
                    line = child.find('p:spPr/a:ln', ns)
                    colour = line.find('a:solidFill/a:srgbClr', ns).get('val')
                    line_ref = child.find('p:style/a:lnRef', ns)
                    inherited = theme_lines[int(line_ref.get('idx')) - 1].get('w')
                    E.SubElement(group, SVG + 'rect', {'id': f'p6-paper-{threshold}-highlight',
                        'x': str(x), 'y': str(y), 'width': str(width), 'height': str(height),
                        'fill': 'none', 'stroke': '#' + colour, 'stroke-width': str(int(line.get('w', inherited)) * unit)})
    return E.tostring(art, encoding='unicode')


def main():
    entries = json.loads((HERE / 'slides.json').read_text(encoding='utf8'))
    p11 = json.loads((HERE / 'assets/page11/animation.json').read_text(encoding='utf8'))
    p11_content = []
    for shape in p11['shapes']:
        content = shape.pop('uri', None)
        body = '<img alt="" src="' + content + '">' if content else shape['html']
        scale = shape['scale']
        classes = 'page11-item' + (' page11-explanation' if not content else '')
        p11_content.append(f'<div id="p11-shape-{shape["id"]}" class="{classes}" data-source-id="{shape["id"]}" style="left:{shape["left"]}px;top:{shape["top"]}px;width:{shape["width"]*scale}px;height:{shape["height"]*scale}px">{body}</div>')
    p12 = json.loads((HERE / 'assets/page12/animation.json').read_text(encoding='utf8'))
    p12_content = []
    for shape in p12['shapes']:
        content = shape.pop('uri', None)
        body = '<img alt="" src="' + content + '">' if content else shape['html']
        scale = shape['scale']
        classes = 'page12-item' + (' page12-explanation' if not content else '')
        p12_content.append(f'<div id="p12-shape-{shape["id"]}" class="{classes}" data-source-id="{shape["id"]}" style="left:{shape["left"]}px;top:{shape["top"]}px;width:{shape["width"]*scale}px;height:{shape["height"]*scale}px">{body}</div>')
    p13 = json.loads((HERE / 'assets/page13/animation.json').read_text(encoding='utf8'))
    p13_content = []
    for shape in p13['shapes']:
        content = shape.pop('uri', None)
        body = '<img alt="" src="' + content + '">' if content else shape['html']
        scale = shape['scale']
        classes = 'page13-item' + (' page13-explanation' if not content else '')
        p13_content.append(f'<div id="p13-shape-{shape["id"]}" class="{classes}" data-source-id="{shape["id"]}" style="left:{shape["left"]}px;top:{shape["top"]}px;width:{shape["width"]*scale}px;height:{shape["height"]*scale}px">{body}</div>')
    p14 = json.loads((HERE / 'assets/page14/animation.json').read_text(encoding='utf8'))
    p14_content = []
    for shape in p14['shapes']:
        content = shape.pop('uri', None)
        body = '<img alt="" src="' + content + '">' if content else shape['html']
        scale = shape['scale']
        classes = 'page14-item' + (' page14-explanation' if not content else '') + (' page14-label' if shape['role']=='label' else '')
        p14_content.append(f'<div id="p14-shape-{shape["id"]}" class="{classes}" data-source-id="{shape["id"]}" style="left:{shape["left"]}px;top:{shape["top"]}px;width:{shape["width"]*scale}px;height:{shape["height"]*scale}px">{body}</div>')
    p15 = json.loads((HERE / 'assets/page15/animation.json').read_text(encoding='utf8'))
    p15_content = []
    for shape in p15['shapes']:
        content = shape.pop('uri', None)
        body = '<img alt="" src="' + content + '">' if content else shape['html']
        scale = shape['scale']
        classes = 'page15-item' + (' page15-explanation' if not content else '') + (' page15-label' if shape['role']=='label' else '')
        p15_content.append(f'<div id="p15-shape-{shape["id"]}" class="{classes}" data-source-id="{shape["id"]}" style="left:{shape["left"]}px;top:{shape["top"]}px;width:{shape["width"]*scale}px;height:{shape["height"]*scale}px">{body}</div>')
    p16 = json.loads((HERE / 'assets/page16/animation.json').read_text(encoding='utf8'))
    p16_content = []
    for shape in p16['shapes']:
        content = shape.pop('uri', None)
        body = '<img alt="" src="' + content + '">' if content else shape['html']
        scale = shape['scale']
        classes = 'page16-item' + (' page16-explanation' if not content else '') + (' page16-label' if shape['role']=='label' else '')
        p16_content.append(f'<div id="p16-shape-{shape["id"]}" class="{classes}" data-source-id="{shape["id"]}" style="left:{shape["left"]}px;top:{shape["top"]}px;width:{shape["width"]*scale}px;height:{shape["height"]*scale}px">{body}</div>')
    p17 = json.loads((HERE / 'assets/page17/animation.json').read_text(encoding='utf8'))
    p17_content = []
    for shape in p17['shapes']:
        content = shape.pop('uri', None)
        body = '<img alt="" src="' + content + '">' if content else shape['html']
        scale = shape['scale']
        classes = 'page17-item' + (' page17-explanation' if not content else '') + (' page17-label' if shape['role']=='label' else '')
        p17_content.append(f'<div id="p17-shape-{shape["id"]}" class="{classes}" data-source-id="{shape["id"]}" style="left:{shape["left"]}px;top:{shape["top"]}px;width:{shape["width"]*scale}px;height:{shape["height"]*scale}px">{body}</div>')
    replacements = {
        '@@COVER@@': data(HERE / 'assets/cover.svg', 'image/svg+xml'),
        '@@LOGO@@': data(HERE / 'assets/kth-logo.svg', 'image/svg+xml'),
        '@@PAGE17_CONTENT@@': '\n'.join(p17_content),
        '@@PAGE17_DATA@@': json.dumps(p17, ensure_ascii=False).replace('</', '<\\/'),
        '@@PAGE16_CONTENT@@': '\n'.join(p16_content),
        '@@PAGE16_DATA@@': json.dumps(p16, ensure_ascii=False).replace('</', '<\\/'),
        '@@PAGE15_CONTENT@@': '\n'.join(p15_content),
        '@@PAGE15_DATA@@': json.dumps(p15, ensure_ascii=False).replace('</', '<\\/'),
        '@@PAGE14_CONTENT@@': '\n'.join(p14_content),
        '@@PAGE14_DATA@@': json.dumps(p14, ensure_ascii=False).replace('</', '<\\/'),
        '@@PAGE13_CONTENT@@': '\n'.join(p13_content),
        '@@PAGE13_DATA@@': json.dumps(p13, ensure_ascii=False).replace('</', '<\\/'),
        '@@PAGE12_CONTENT@@': '\n'.join(p12_content),
        '@@PAGE12_DATA@@': json.dumps(p12, ensure_ascii=False).replace('</', '<\\/'),
        '@@PAGE11_CONTENT@@': '\n'.join(p11_content),
        '@@PAGE11_DATA@@': json.dumps(p11, ensure_ascii=False).replace('</', '<\\/'),
        '@@PYRAMID@@': pyramid_art(),
        '@@REQUIREMENTS_PYRAMID@@': requirements_pyramid_art(),
        '@@PAGE5_START_PYRAMID@@': page5_start_pyramid(),
        '@@PAGE5_DRAFT@@': page5_draft_art(),
        '@@PAGE8_START_PYRAMID@@': page8_start_pyramid(),
        '@@PAGE8_FRAMEWORK@@': page8_framework_art(),
        '@@PAGE6_PAPERS@@': page6_paper_art(),
        '@@PAGE9_SIGNALS@@': (HERE / 'assets/page9/signals.svg').read_text(encoding='utf-8-sig'),
        '@@ANIMATION@@': receiver_art(),
        '@@ES_CAR@@': data(HERE / 'assets/embedded-systems/braking-system.png', 'image/png'),
        '@@ES_ROBOT@@': data(HERE / 'assets/embedded-systems/robot-controller.png', 'image/png'),
        '@@ES_AIRCRAFT@@': data(HERE / 'assets/embedded-systems/aircraft-attitude-control.png', 'image/png'),
    }
    slides, controllers = {}, {}
    for entry in entries:
        content = (HERE / entry['source']).read_text(encoding='utf8')
        for key, value in replacements.items():
            content = content.replace(key, value)
        position = entries.index(entry) + 1
        content = content.replace('class="footer-page">2</span>', f'class="footer-page">{position}</span>')
        if 'aria-label="Slide ' in content:
            content = content.replace('aria-label="Slide 2:', f'aria-label="Slide {position}:')
        slides[entry['id']] = content
        if entry.get('controller'):
            controllers[entry['id']] = (HERE / entry['controller']).read_text(encoding='utf8')
            if entry['id'] == 'page17':
                controllers[entry['id']] = controllers[entry['id']].replace('@@PAGE17_DATA@@', replacements['@@PAGE17_DATA@@'])
            if entry['id'] == 'page16':
                controllers[entry['id']] = controllers[entry['id']].replace('@@PAGE16_DATA@@', replacements['@@PAGE16_DATA@@'])
            if entry['id'] == 'page15':
                controllers[entry['id']] = controllers[entry['id']].replace('@@PAGE15_DATA@@', replacements['@@PAGE15_DATA@@'])
            if entry['id'] == 'page14':
                controllers[entry['id']] = controllers[entry['id']].replace('@@PAGE14_DATA@@', replacements['@@PAGE14_DATA@@'])
            if entry['id'] == 'page13':
                controllers[entry['id']] = controllers[entry['id']].replace('@@PAGE13_DATA@@', replacements['@@PAGE13_DATA@@'])
            if entry['id'] == 'page12':
                controllers[entry['id']] = controllers[entry['id']].replace('@@PAGE12_DATA@@', replacements['@@PAGE12_DATA@@'])
            if entry['id'] == 'page11':
                controllers[entry['id']] = controllers[entry['id']].replace('@@PAGE11_DATA@@', replacements['@@PAGE11_DATA@@'])
    styles = (HERE / 'shared/styles.css').read_text(encoding='utf8')
    styles = styles.replace('../assets/Figtree.ttf', data(HERE / 'assets/Figtree.ttf', 'font/ttf'))
    styles = styles.replace('../assets/page10/Consolas.ttf', data(HERE / 'assets/page10/Consolas.ttf', 'font/ttf'))
    for font in ['MathRoman', 'MathItalic']:
        styles = styles.replace(f'../assets/page9/{font}.ttf', data(HERE / f'assets/page9/{font}.ttf', 'font/ttf'))
    shell = (HERE / 'shared/shell.html').read_text(encoding='utf8')
    def render(selected, title):
        result = shell
        values = {
            '@@TITLE@@': html.escape(title),
            '@@STYLES@@': styles,
            '@@SLIDES@@': '\n'.join(slides[e['id']] for e in selected),
            '@@MANIFEST@@': json.dumps(selected, ensure_ascii=False).replace('</', '<\\/'),
            '@@CONTROLLERS@@': '\n'.join(controllers.get(e['id'], '') for e in selected),
            '@@NAVIGATION@@': (HERE / 'shared/navigation.js').read_text(encoding='utf8'),
        }
        for key, value in values.items():
            result = result.replace(key, value)
        assert '@@' not in result
        return result
    (HERE / 'index.html').write_text(render(entries, 'SynQ · PhD Defence'), encoding='utf8')
    for entry in entries:
        (HERE / (entry['id'] + '.html')).write_text(render([entry], entry['title']), encoding='utf8')
    print(f'Built presentation with {len(entries)} slides and standalone previews.')

if __name__ == '__main__':
    main()
