from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


OUTPUT = Path("/Users/ansh0eman/Documents/Anshuman Documents/Career/Resumes/Anshuman_Software_AI_Resume_2026.docx")


def set_cell_margins(*_args, **_kwargs):
    # Retained as a no-op guard: the resume intentionally avoids tables for ATS parsing.
    return None


def set_font(run, name="Arial", size=9.8, bold=False, italic=False, color="000000"):
    run.font.name = name
    run._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), name)
    run._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), name)
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = RGBColor.from_string(color)


def add_hyperlink(paragraph, text, url, size=9.2):
    part = paragraph.part
    rel_id = part.relate_to(
        url,
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
        is_external=True,
    )
    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("r:id"), rel_id)
    run = OxmlElement("w:r")
    rpr = OxmlElement("w:rPr")
    rfonts = OxmlElement("w:rFonts")
    rfonts.set(qn("w:ascii"), "Arial")
    rfonts.set(qn("w:hAnsi"), "Arial")
    rpr.append(rfonts)
    color = OxmlElement("w:color")
    color.set(qn("w:val"), "000000")
    rpr.append(color)
    sz = OxmlElement("w:sz")
    sz.set(qn("w:val"), str(int(size * 2)))
    rpr.append(sz)
    text_el = OxmlElement("w:t")
    text_el.text = text
    run.append(rpr)
    run.append(text_el)
    hyperlink.append(run)
    paragraph._p.append(hyperlink)


def set_spacing(paragraph, before=0, after=0, line=1.0):
    fmt = paragraph.paragraph_format
    fmt.space_before = Pt(before)
    fmt.space_after = Pt(after)
    fmt.line_spacing = line


def keep_with_next(paragraph, value=True):
    ppr = paragraph._p.get_or_add_pPr()
    el = ppr.find(qn("w:keepNext"))
    if value and el is None:
        ppr.append(OxmlElement("w:keepNext"))
    elif not value and el is not None:
        ppr.remove(el)


def prevent_split(paragraph):
    ppr = paragraph._p.get_or_add_pPr()
    if ppr.find(qn("w:cantSplit")) is None:
        ppr.append(OxmlElement("w:cantSplit"))


def remove_paragraph_border(paragraph_or_style):
    ppr = paragraph_or_style._element.get_or_add_pPr()
    border = ppr.find(qn("w:pBdr"))
    if border is not None:
        ppr.remove(border)


def section_heading(doc, text):
    p = doc.add_paragraph(style="Resume Section")
    r = p.add_run(text.upper())
    set_font(r, size=10.5, bold=True)
    set_spacing(p, before=5.0, after=2.1)
    keep_with_next(p)
    return p


def role_heading(doc, left, date):
    p = doc.add_paragraph(style="Resume Role")
    p.paragraph_format.tab_stops.add_tab_stop(Inches(7.35), WD_TAB_ALIGNMENT.RIGHT)
    r = p.add_run(left)
    set_font(r, size=9.85, bold=True)
    r = p.add_run("\t" + date)
    set_font(r, size=9.5, bold=True)
    set_spacing(p, before=1.7, after=0.5)
    keep_with_next(p)
    return p


def bullet(doc, text):
    p = doc.add_paragraph(style="Resume Bullet")
    p.paragraph_format.left_indent = Inches(0.18)
    p.paragraph_format.first_line_indent = Inches(-0.12)
    p.paragraph_format.right_indent = Inches(0.02)
    r = p.add_run("-  " + text)
    set_font(r, size=9.55)
    set_spacing(p, before=0, after=0.9, line=1.03)
    prevent_split(p)
    return p


def compact_line(doc, label, text, after=0.7):
    p = doc.add_paragraph(style="Resume Body")
    r = p.add_run(label)
    set_font(r, size=9.55, bold=True)
    r = p.add_run(text)
    set_font(r, size=9.55)
    set_spacing(p, before=0, after=after, line=1.02)
    return p


doc = Document()
section = doc.sections[0]
section.page_width = Inches(8.5)
section.page_height = Inches(11)
section.top_margin = Inches(0.48)
section.bottom_margin = Inches(0.48)
section.left_margin = Inches(0.57)
section.right_margin = Inches(0.57)
section.header_distance = Inches(0.2)
section.footer_distance = Inches(0.2)

styles = doc.styles
normal = styles["Normal"]
normal.font.name = "Arial"
normal._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
normal.font.size = Pt(9.8)
normal.font.color.rgb = RGBColor(0, 0, 0)

for name in ["Resume Section", "Resume Role", "Resume Bullet", "Resume Body"]:
    if name not in styles:
        styles.add_style(name, WD_STYLE_TYPE.PARAGRAPH)
    st = styles[name]
    st.font.name = "Arial"
    st._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    st._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    st.font.color.rgb = RGBColor(0, 0, 0)

title_style = styles["Title"]
title_style.font.name = "Arial"
title_style._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
title_style._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
title_style.font.color.rgb = RGBColor(0, 0, 0)
title_style.font.size = Pt(21)
title_style.font.bold = True
remove_paragraph_border(title_style)

doc.core_properties.title = "Anshuman Software Engineer and AI Engineer Resume"
doc.core_properties.subject = "Resume for software engineering and AI engineering roles"
doc.core_properties.author = "Anshuman"
doc.core_properties.keywords = "software engineer, AI engineer, machine learning, Python, React Native, SQL"

p = doc.add_paragraph(style="Title")
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("Anshuman")
set_font(r, size=21, bold=True)
set_spacing(p, after=0.2)
remove_paragraph_border(p)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("Software Engineer and AI Engineer")
set_font(r, size=10.6, bold=True)
set_spacing(p, after=1.1)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
set_spacing(p, after=2.4)
items = [
    ("+91 6205590392", None),
    ("anshuwont@gmail.com", "mailto:anshuwont@gmail.com"),
    ("ansh0eman.xyz", "https://ansh0eman.xyz"),
    ("github.com/ansh0eman", "https://github.com/ansh0eman"),
    ("linkedin.com/in/anshuman", "https://www.linkedin.com/in/anshuman-anshuman-82028b263/"),
]
for idx, (text, url) in enumerate(items):
    if idx:
        r = p.add_run("  |  ")
        set_font(r, size=9.2)
    if url:
        add_hyperlink(p, text, url, size=9.35)
    else:
        r = p.add_run(text)
        set_font(r, size=9.35)

section_heading(doc, "Profile")
p = doc.add_paragraph(style="Resume Body")
r = p.add_run(
    "Computer Science graduate with AI and software engineering internship experience building machine learning systems and user-facing software. "
    "Experience spans retail forecasting, computer vision, NLP research, enterprise workflow automation, "
    "and privacy-aware mobile products built with Python, SQL, TypeScript, React Native, and Supabase."
)
set_font(r, size=9.6)
set_spacing(p, after=1.0, line=1.03)

section_heading(doc, "Experience")
role_heading(doc, "AI Analyst Intern | Impact Analytics, Bengaluru", "Jan 2026 - Present")
bullet(doc, "Build retail demand-forecasting and pricing datasets and models in Python and BigQuery SQL, including store clustering, baseline forecasts, seasonality, and elasticity across product hierarchies.")
bullet(doc, "Run SQL and Tableau QA checks, investigate missing or inconsistent data, and validate aggregated tables before they enter downstream forecasting workflows.")

role_heading(doc, "Software Engineering Intern | YES BANK, Mumbai", "May 2025 - Jul 2025")
bullet(doc, "Led a three-person intern team through end-to-end testing of three enterprise platforms; documented 50+ defects and worked with developers to validate fixes across multi-step approval workflows.")
bullet(doc, "Built and improved SharePoint and Power Automate workflows, internal sites, and Power BI dashboards for operations and stakeholder reporting.")

role_heading(doc, "Machine Learning Engineer Intern | Alethe Labs, Gurugram", "Dec 2024 - Jan 2025")
bullet(doc, "Developed a ResUNet model with multi-head attention for pixel-level corrosion condition segmentation across four severity classes; also evaluated unsupervised methods for transaction anomaly detection.")

role_heading(doc, "Undergraduate NLP Research Intern | Manipal Institute of Technology", "Jun 2024 - Jul 2024")
bullet(doc, "Analyzed and visualized lyrical structure using BERT, Word2Vec, Doc2Vec, NLTK, Matplotlib, and Plotly, exploring how embeddings and transformer models capture recurring patterns.")

section_heading(doc, "Selected Projects")
role_heading(doc, "NearHere | React Native, Expo, TypeScript, Supabase, PostGIS", "Personal project")
bullet(doc, "Built an iOS MVP for nearby activity discovery with phone authentication, host and join flows, in-app chat, and a privacy model that shows approximate public locations while restricting exact meeting points.")
bullet(doc, "Backed client flows with RLS-protected RPCs, Supabase Realtime plus a bounded polling fallback, and 39 unit tests; verified lint, type checks, production bundling, and a native iOS Simulator build.")

role_heading(doc, "SetuAI | React, Node.js, PostgreSQL, Gemini OCR", "SAP Hackfest 2025")
bullet(doc, "Built a role-based vendor compliance platform combining document OCR, government API validation, dashboards, and risk scoring; earned a special award after placing in the top five among 4,000 teams.")

section_heading(doc, "Technical Skills")
compact_line(doc, "Languages: ", "Python, TypeScript, JavaScript, SQL, Java, C, HTML, CSS")
compact_line(doc, "AI and data: ", "PyTorch, TensorFlow, Hugging Face Transformers, BigQuery, Power BI, Tableau")
compact_line(doc, "Application development: ", "React, React Native, Expo, Node.js, PostgreSQL, Supabase, PostGIS, Git", after=0.8)

section_heading(doc, "Education")
role_heading(doc, "Manipal Institute of Technology | BTech in Computer Science | CGPA 8.65", "2022 - 2026")

# Keep the document single-section and explicitly remove Word's default empty footer spacing.
for footer_p in section.footer.paragraphs:
    footer_p.text = ""
    set_spacing(footer_p, after=0)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
doc.save(OUTPUT)
print(OUTPUT)
