"""Assemble editable slide sources into a self-contained presentation."""
from pathlib import Path
from base64 import b64encode
import xml.etree.ElementTree as E
import json
import html

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

def main():
    entries = json.loads((HERE / 'slides.json').read_text(encoding='utf8'))
    replacements = {
        '@@COVER@@': data(HERE / 'assets/cover.svg', 'image/svg+xml'),
        '@@LOGO@@': data(HERE / 'assets/kth-logo.svg', 'image/svg+xml'),
        '@@PYRAMID@@': pyramid_art(),
        '@@REQUIREMENTS_PYRAMID@@': requirements_pyramid_art(),
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
    styles = (HERE / 'shared/styles.css').read_text(encoding='utf8')
    styles = styles.replace('../assets/Figtree.ttf', data(HERE / 'assets/Figtree.ttf', 'font/ttf'))
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
