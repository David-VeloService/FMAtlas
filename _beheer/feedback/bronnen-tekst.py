#!/usr/bin/env python3
"""Zet het lesmateriaal van jaar 1 om naar platte tekst, zodat de feedbackverwerker op
de Mac mini meldingen kan toetsen zonder de 2 GB aan PowerPoints mee te sturen.

    python3 bronnen-tekst.py <bronmap "Vak gehaald"> <doelmap>

Per bestand komt er een .txt met per dia of pagina een kop "=== dia N ===", zodat de
verwerker een vindplaats kan noemen. Notities bij dia's gaan mee.
"""
import re, subprocess, sys, zipfile
from pathlib import Path

VAKKEN = {  # map in "Vak gehaald" -> map in de doelmap
    "Basis van FM A": "basis-van-fm-a",
    "Basis van FM B": "basis-van-fm-b",
    "Facilitaire bedrijfseconomie": "bedrijfseconomie",
    "Eventmanagement 1": "eventmanagement-1",
    "Evenementen management 2": "eventmanagement-2",
    "Facillitaire inkoop": "inkoop-en-recht",
    "Trendwatchers": "trendwatchers",
}

def tekst_uit_xml(data):
    data = data.decode("utf8", "ignore")
    stukken = re.findall(r"<a:t>([^<]*)</a:t>|<w:t[^>]*>([^<]*)</w:t>|(<a:p>|<w:p[ >])", data)
    uit, regel = [], []
    for a, w, p in stukken:
        if p:
            if regel: uit.append("".join(regel)); regel = []
        else:
            regel.append(a or w)
    if regel: uit.append("".join(regel))
    return "\n".join(x.strip() for x in uit if x.strip())

def pptx(pad):
    z = zipfile.ZipFile(pad)
    nummer = lambda n: int(re.search(r"(\d+)\.xml$", n).group(1))
    dias = sorted((n for n in z.namelist() if re.match(r"ppt/slides/slide\d+\.xml$", n)), key=nummer)
    uit = []
    for n in dias:
        i = nummer(n)
        uit.append(f"=== dia {i} ===\n" + tekst_uit_xml(z.read(n)))
        notes = f"ppt/notesSlides/notesSlide{i}.xml"
        if notes in z.namelist():
            t = tekst_uit_xml(z.read(notes))
            if t: uit.append("--- notities ---\n" + t)
    return "\n\n".join(uit)

def docx(pad):
    return tekst_uit_xml(zipfile.ZipFile(pad).read("word/document.xml"))

def pdf(pad):
    r = subprocess.run(["pdftotext", "-layout", str(pad), "-"], capture_output=True, text=True, timeout=120)
    paginas = r.stdout.split("\f")
    return "\n\n".join(f"=== pagina {i} ===\n{p.strip()}" for i, p in enumerate(paginas, 1) if p.strip())

def main(bron, doel):
    bron, doel = Path(bron), Path(doel)
    n = 0
    for map_, naam in VAKKEN.items():
        for f in (bron / map_).rglob("*"):
            if f.suffix.lower() not in (".pptx", ".docx", ".pdf") or f.name.startswith("~$"):
                continue
            try:
                t = {".pptx": pptx, ".docx": docx, ".pdf": pdf}[f.suffix.lower()](f)
            except Exception as e:
                print("overgeslagen:", f.name, e, file=sys.stderr); continue
            if len(t.strip()) < 40:
                continue
            uit = doel / naam / (f.relative_to(bron / map_).with_suffix(".txt"))
            uit.parent.mkdir(parents=True, exist_ok=True)
            uit.write_text(f"# Bron: {map_}/{f.relative_to(bron / map_)}\n\n{t}\n", encoding="utf8")
            n += 1
    print(n, "bestanden omgezet naar", doel)

if __name__ == "__main__":
    main(*sys.argv[1:3])
